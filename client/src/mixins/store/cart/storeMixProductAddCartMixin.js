import COMM_CONST from '@constants/framework/constants'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import {
  getMoneyFormat,
  htmlDecode,
  extend,
  isNull
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import toastUtil from '@frameworks/toastUtil'
import PRODUCT_MESSAGE, { PRODUCT_CONST } from '@/common/constants/product/product'
import { mapState } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import uiUtil from '@utils/uiUtil'

/**
 * Cart Add Item Mixin
 */
const storeMixProductAddCartMixin = {
  data () {
    return {
      enabledSelectboxIndex: 0,
      selectedOptionName: [],
      selectedOptionItemList: [],
      isOpenIndex: null,
      changedOptionItemList: [],
      selectedCount: 1, // 단품의 선택된 개수
      totalPrice: 0, // 총 주문 금액
      toast: false, // 장바구니 담기 custom toast
      selectedOptions: [], // 선택된 옵션
      isOpenedOption: '', // 옵션영역 펼침 여부
      catentryId: '',
      isOnlyUser: false, // 비회원 주문 가능 여부
      styleMngYn: 'N', // N:단품 (옵션 없음)
      arrChkData: null, // 상품 중복 체크 위한 변수
      busChnId: null, // 매체타입
      productCategoryName: {}, // 상품 카테고리명
      productCatalogId: '', // 상품 조회 후 카탈로그 아이디 세팅
      invoiceProducts: [], // 옵션 각항목 정보
      totalCnt: 0, // 선택 개수
      productRemainedCnt: 0, // 단품의 남은 수량
      isNative: false,
      mustLayerCallFlag: false,
      anchorLayer: false,
      globalVal: {},
      isNotOptionExist: false, // 옵션 상품인데 옵션 없는 경우 대비한 방어 로직
      isSlotFlag: false
    }
  },
  computed: {
    ...mapState(['product']),
    /**
     * 사은품 존재 여부
     *
     * @returns Boolean
     */
    isGiftExist () {
      try {
        const isGiftBnftListExist = (!!this.product.productInfo.giftBnftList && this.product.productInfo.giftBnftList.length > 0)
        return isGiftBnftListExist
      } catch (error) {
        return null
      }
    },
    /**
     * 최대구매 가능
     *
     * @returns string
     */
    nMaxCount () {
      return this.product.productInfo.maxItemCountOnOnce >= 100 ? 99 : this.product.productInfo.maxItemCountOnOnce
    },
    /**
     * 구매하기 버튼 활성화 여부
     * @returns Boolean
     */
    isBuyButtonActive () {
      if (this.invoiceProducts.length > 0) {
        return ''
      } else {
        return 'in_active'
      }
    },
    /**
     * 총 주문금액 단일옵션인 경우 총 금액
     */
    singleTotalPrice () {
      return getMoneyFormat('', this.product.productInfo.salePrice * this.selectedCount)
    },
    /**
     * 총 주문금액 옵션상품인 경우 전체
     */
    totalPriceTxt () {
      return getMoneyFormat('', this.totalPrice)
    },
    /**
     * 속성 리스트 정의
     */
    definingAttributeList () {
      try {
        const optionList = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber)

        const entitledItems = optionList.SKUs
        const styleMngYn = optionList.styleMngYn
        const unitRegiTypeCd = optionList.unitRegiTypeCd
        const attributes = optionList.attributes
        const definingAttributeList = []
        const isOptionTextType = styleMngYn === 'Y' && unitRegiTypeCd === 'OPT' // OPT:텍스트형,TYP:단품TyPE형

        if (isOptionTextType) {
          const isBuyableAttr = []
          for (const attribute of entitledItems) {
            isBuyableAttr.push({ value: htmlDecode(attribute.name), valueId: attribute.uniqueID, overPrice: attribute.calPrmo, fieldTxt: attribute.field })
          }

          definingAttributeList.push({ attr: isBuyableAttr })
        } else {
          for (const attribute2 of attributes) {
            if (attribute2.usage !== 'Defining') {
              continue
            }

            const isBuyableAttr2 = []
            for (const allowedValue of attribute2.values) {
              let isBuyable = false

              for (const sku of entitledItems) {
                for (const skuAttributes of sku.attributes) {
                  if (attribute2.name === skuAttributes.name) {
                    for (const skuAttributeValues of skuAttributes.values) {
                      if (skuAttributeValues.uniqueID === allowedValue.uniqueID || skuAttributeValues.identifier === allowedValue.identifier) {
                        isBuyable = true
                      }
                    }
                  }
                }
              }

              if (isBuyable) {
                isBuyableAttr2.push({ value: allowedValue.value, valueId: allowedValue.uniqueID, overPrice: allowedValue.calPrmo, fieldTxt: allowedValue.field })
              }
            }

            if (isBuyableAttr2.length > 0) {
              definingAttributeList.push({ name: attribute2.name, nameId: attribute2.uniqueID, attr: isBuyableAttr2, overPrice: attribute2.calPrmo, fieldTxt: attribute2.field })
            }
          }
        }

        console.log(`옵션 갯수: ${definingAttributeList.length}`)
        console.log(definingAttributeList)
        return definingAttributeList
      } catch (error) {
        return null
      }
    },
    /**
     * 상품의 옵션 목록 반환.
     *
     * @param {void}
     * @returns {Array} - returnList
     */
    optionList () {
      const returnList = []
      const optionList = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber)
      const unitRegiTypeCd = optionList.unitRegiTypeCd
      const definingAttributeList = this.definingAttributeList
      let selCount = 1
      for (const attribute of definingAttributeList) {
        const attrList = []
        if (unitRegiTypeCd === 'OPT') {
          for (const attr of attribute.attr) {
            const id = `${selCount}_${attr.valueId}_${attr.value}`
            const fieldTxt = attr.fieldTxt
            const value = attr.value
            const valueId = attr.valueId

            attrList.push({ id, fieldTxt, value, valueId })
          }
        } else {
          if (selCount === 1) {
            for (const attr of attribute.attr) {
              const id = `${selCount}_${attribute.nameId}_${attr.valueId}_${attr.value}`
              const fieldTxt = attr.fieldTxt
              const value = attr.value
              const valueId = attr.valueId
              const nameId = attr.nameId
              attrList.push({ id, fieldTxt, value, nameId, valueId })
            }
          }
        }
        returnList.push({
          name: attribute.name,
          nameId: attribute.nameId,
          optionIndex: selCount,
          optionList: attrList
        })
        selCount++
      }

      return returnList
    },
    computedOptionList: {
      get () {
        if (this.changedOptionItemList && this.changedOptionItemList.length > 0) {
          return this.changedOptionItemList
        } else {
          return this.optionList
        }
      },
      set ({ inputOptionIndex, inputOptionList }) {
        const tempList = extend(true, [], this.optionList)
        tempList[inputOptionIndex + 1].optionList = inputOptionList
        this.changedOptionItemList = tempList
      }
    }
  },
  methods: {
    /**
     * 방송 중 구매가능 유효성 검사 (홈매장 상품정보 클릭시)
     * @param {String} partnumber - 상품코드
     */
    async liveLimitValidator (partnumber) {
      return await this.$store.dispatch('product/getProductInfoSync', this.setProductDetailParams(partnumber)).then(() => {
        const liveLimit = this.product.productInfo.liveLimit
        if (!isNull(liveLimit) && liveLimit === 'N') {
          messageUtil.alert('해당 상품은 방송시간 중에만 구매하실 수 있습니다.')
          const scrollChecker = document.body.classList.contains('no_scroll')
          if (scrollChecker) { document.body.classList.remove('no_scroll') }
          return false
        } else {
          return true
        }
      })
    },
    /**
     * 바로구매 열기 메소드.
     * @param {String} partnumber - 상품코드
     */
    layerOpen (partnumber) {
      this.$store.dispatch('product/getProductInfoSync', this.setProductDetailParams(partnumber)).then(() => {
        this.globalVal.partNumber = partnumber
        this.globalVal.getProductInfoFlag = false
        if (this.product.productData?.authMsg?.authCode === '400') {
          const alertMsg = this.product.productData.authMsg.message
          messageUtil.alert(alertMsg, () => {
            bizUtil.gotoMain()
          })
          return
        }
        const liveLimit = this.product.productInfo.liveLimit
        if (!isNull(liveLimit) && liveLimit === 'N') {
          messageUtil.alert('해당 상품은 방송시간 중에만 구매하실 수 있습니다.')
          return
        }
        if (this.product.productInfo?.giftBnftList?.length) {
          this.$router.push(`/product/${partnumber}`)
        } else {
          this.anchorLayer = true
        }
      })
    },
    /**
     * 바로구매 닫기 메소드.
     */
    layerClose () {
      this.anchorLayer = false
      this.finishedSetParamFlag = false
    },
    /**
     * 로그인 필요한 상품 여부
     * dispTypeCd 50: 무형 - 기프티쇼
     * @returns Boolean
     */
    isLoginRequiredProduct () {
      const isGiftishow = this.product.productInfo.dispTypeCd === '50'
      return isGiftishow
    },
    /**
     * 단품 여부
     * styleMngYn N:단품 (옵션 없음)
     */
    isSingleOption () {
      const realOptionLength = this.product.productInfo.optionList[0].SKUs.length
      const isNoOption = this.product.productInfo.styleMngYn === 'Y' && realOptionLength === 1 // 옵션 상품이지만 옵션이 없는 경우가 있어 방어로직(단품으로 처리)
      return this.product.productInfo.styleMngYn === 'N' || isNoOption
    },
    /**
     * 사은품 선택 여부 체크
     *
     */
    checkIsGiftSelected () {
      console.log('gift selected check..')
      console.log(this.product.selectedGiftList)
      console.log(this.product.selectedGiftList.selectedGiftOptionList)
      console.log(this.product.selectedGiftList.selectedGiftOptionList ? this.product.selectedGiftList.selectedGiftOptionList.length : '')
    },
    /**
     * getItem 대체
     */
    isValidItem (item) {
      try {
        return item.partNumber === this.product.productInfo.partNumber
      } catch (error) {
        return null
      }
    },
    /**
     * 유효성 체크
     *
     * @param {}
     * @returns {}
     */
    getItem (items, partNumber) {
      for (const item of items) {
        if (item.partNumber === partNumber) {
          return item
        }
      }

      return null
    },
    /**
     * 단품 상품이 최대 구매 가능 수량 도달 시 Alert
     *
     * @param {number} value (필수) max에 도달한 수량
     */
    singleMaxAlert (value) {
      if (value === this.product.productInfo.productCnt || value === this.productRemainedCnt) {
        toastUtil.show('남은 수량만큼 구매하세요.')
      } else if (value === this.nMaxCount) {
        toastUtil.show(`1회 최대구매 수량은 ${this.nMaxCount}개입니다.`)
      }
    },
    /**
     * 단품 재고 체크
     */
    setRemainedCatEntryCount_First (data) {
      if (data.jsonData.rtnData === 0) {
        return
      }
      const rtnData = data.jsonData.rtnData
      const dispTypeCd = this.product.productInfo.dispTypeCd

      this.productRemainedCnt = Number(rtnData) // 남은 수량.
      const isGeneralProduct = dispTypeCd === '10' || dispTypeCd === '15' || dispTypeCd === '20' || dispTypeCd === '30'
      const isNoOfferPrice = this.product.productInfo.offerPrice === 0 && dispTypeCd !== '45' && this.product.productInfo.busChnId !== 'TV'

      if (isNoOfferPrice) {
        if (isGeneralProduct) {
          const msg = PRODUCT_MESSAGE.SOLDOUT
          messageUtil.alert(msg)
        }
      }
    },
    /**
     * NSItemDetailRemainCntAjax API 파라미터 세팅
     */
    createRemainCntParams (partNumber, itemNumber) {
      return {
        partNumber,
        itemNumber,
        cmdType: 1,
        offerIdfr: '',
        busChnId: 'SB',
        coCd: COMM_CONST.getCocd(),
        multiCd: this.product.productInfo.multiCd || '',
        cpcAmt: this.product.productInfo.cpcAmt,
        arsAmt: this.product.productInfo.arsAmt
      }
    },
    /**
     * 단품의 남아있는 상품 개수를 가져온다.
     */
    getRemainedCatEntry (params) {
      const successHandling = response => {
        this.setRemainedCatEntryCount_First(response)
      }

      this.$nsaxios.post('NSItemDetailRemainCntAjax', params, successHandling)
    },
    /**
     * 상품정보 불러오기 위한 파라미터
     *
     */
    setProductDetailParams (partNumber) {
      return {
        partNumber,
        cocd: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE,
        cmdType: 'PRD_CATE_ORD'
      }
    },

    /**
     * 장바구니담기 버튼 클릭
     */
    addToCart (partNumber, dispTypeCd, busChnId, styleMngYn, catentryId, catalogId, brandKorNm, itncatentrynm) {
      uiUtil.disableScroll()

      const productInfo = {
        partNumber,
        dispTypeCd,
        busChnId,
        styleMngYn,
        catentryId,
        catalogId,
        brandKorNm,
        itncatentrynm
      }
      this.$store.dispatch('product/getProductInfoSync', this.setProductDetailParams(partNumber)).then(() => {
        if (this.product.productData?.authMsg?.authCode === '400') {
          const alertMsg = this.product.productData.authMsg.message
          messageUtil.alert(alertMsg, () => {
            // bizUtil.gotoMain()
          })
          return
        }
        const isLogon = true
        const isLoginRequiredProduct = this.isLoginRequiredProduct(productInfo.dispTypeCd)
        if (isLoginRequiredProduct && !isLogon) {
          const msg = '로그인을 하셔야 장바구니 담기가 가능한 상품입니다.'
          toastUtil.show(msg)
          return
        }
        const liveLimit = this.product.productInfo.liveLimit
        if (!isNull(liveLimit) && liveLimit === 'N') {
          messageUtil.alert('해당 상품은 방송시간 중에만 구매하실 수 있습니다.')
          return
        }
        if (this.isGiftExist) {
          this.$router.push(`/product/${productInfo.partNumber}`)
          return
        }
        if (!this.isSingleOption()) {
          // const msg = '옵션이 있는 상품입니다.'
          // toastUtil.show(msg)
          this.globalVal = productInfo
          this.mustLayerCallFlag = true

          if (this.isSlotFlag) {
            this.slotLayerOpen(partNumber)
          } else {
            this.layerOpen(partNumber)
          }

          return false
        } else {
          this.mustLayerCallFlag = false
          // 마케팅 스크립트 삽입
          // 제품_상품 유형
          let tvProduct = ''
          if (productInfo.busChnId === 'TV') {
            tvProduct = 'eTV'
          } else {
            tvProduct = 'e상품'
          }
          // E-commerce
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
            data: {
              step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
              params: [
                {
                  id: String(productInfo.partNumber),
                  name: productInfo.itncatentrynm,
                  brand: productInfo.brandKorNm,
                  dimension16: tvProduct
                }
              ],
              subparams: {
                t1: '장바구니담기',
                t2: productInfo.itncatentrynm
              }
            }
          })
        }
        this.getCartInfoList(productInfo)
        uiUtil.enableScroll()
      })
    },
    /**
      * 장바구니 내 같은 상품이 있을 경우 합산 수량을 체크한다.
      */
    getCartInfoList (param) {
      const objParam = {}
      objParam.DISP_TYPE_CD = param.dispTypeCd
      objParam.goodsType = 'GENERAL'

      const successHandling = response => {
        const invokeParams = this.setInvokeParameters(param)
        let bFlag = false

        if (undefined !== response.msg.goods) {
          for (let i = 0; response.msg.goods.length > i; i++) {
            for (let j = 0; this.arrChkData.length > j; j++) {
              if (response.msg.goods[i].catentryId === this.arrChkData[j].catEntryId) {
                if (Number(response.msg.goods[i].quantity) + Number(this.arrChkData[j].quantity) >= 100) {
                  bFlag = true
                }
              }
            }
          }
        }

        if (bFlag) {
          messageUtil.alert('장바구니에 담긴 동일한 상품과의 합산 수량이 1회 최대 구매 가능 수량 99개를 초과 하였습니다.')
          return
        }
        this.addCartInfo(invokeParams)
      }

      this.$nsaxios.post('NSBasketMobileCmdReal', objParam, successHandling)
    },
    /**
     * 장바구니 담기
     */
    addCartInfo (invokeParams) {
      const successHandling = response => {
        const orderId = response.orderId
        if (orderId == null || orderId === '') {
          messageUtil.alert(response.errorMessageKey)
        } else {
          bizUtil.getCartCount()
          toastUtil.show('장바구니에 상품이 담겼습니다.')
        }
      }
      this.$nsaxios.post('AjaxNSXorderItemAdd4Worklight', invokeParams, successHandling)
    },

    setSkuUniqueId () {
      if (this.isSingleOption) {
        const sku = this.product.productInfo.optionList.find(this.isValidItem).SKUs[0]
        if (sku) {
          this.catentryId = sku.uniqueID
          const params = this.createRemainCntParams(this.product.productInfo.partNumber, this.catentryId)
          this.getRemainedCatEntry(params)
        }
      }
    },
    /**
     * 장바구니 또는 바로주문에 넣을 파라미터 셋팅.
     */
    setInvokeParameters (param) {
      const cocd = COMM_CONST.getCocd()
      const invokeParams = {
        userId: loginUtil.userId(),
        orderId: '.',
        calculationUsage: '-1,-2,-5,-6,-7',
        inventoryValidation: 'false',
        cartType: param.dispTypeCd,
        itemType: 'product'
      }
      this.busChnId = param.busChnId // 매체타입

      const catalogId = (param.catalogId !== '') ? param.catalogId : COMM_CONST.getDefaultCatalogId()
      this.setSkuUniqueId()
      const catentryList = []
      const items = {
        catentryId: this.catentryId,
        quantity: this.selectedCount
      }
      catentryList.push(items)
      this.arrChkData = []

      for (let ii = 0; ii < catentryList.length; ii++) {
        const cnt = ii + 1
        const item = catentryList[ii]

        invokeParams[String(`quantity_${cnt}`)] = item.quantity
        invokeParams[String(`catEntryId_${cnt}`)] = item.catentryId
        invokeParams[String(`extCatalogId_${cnt}`)] = catalogId

        this.arrChkData[this.arrChkData.length] = { catEntryId: item.catentryId, quantity: item.quantity }

        if (!isNull(cocd)) {
          invokeParams[String(`extPtncd_${cnt}`)] = cocd
        }

        invokeParams[String(`itemBuschnId_${cnt}`)] = param.busChnId

        // 캠페인 ID - Push를 통해 들어온 데이터.
        const itemCampId = COMM_CONST.getCampaignId()
        if (!isNull(itemCampId)) {
          invokeParams[String(`itemCampId_${cnt}`)] = itemCampId
        }
      }
      // 사은품
      if (this.isGiftExist) {
        if (!!this.product.selectedGiftList.selectedGiftOptionList && this.product.selectedGiftList.selectedGiftOptionList.length > 0) {
          let selectedGiftCount = 0
          for (const selectedGift of this.product.selectedGiftList.selectedGiftOptionList) {
            selectedGiftCount++
            invokeParams[String(`relCatEntryId_${selectedGiftCount}`)] = selectedGift.valueId
            invokeParams[String(`relQuantity_${selectedGiftCount}`)] = '1'
            invokeParams[String(`suborditemId_${selectedGiftCount}`)] = selectedGiftCount
            invokeParams[String(`extPartgubun_${selectedGiftCount}`)] = 'F'
          }
        }
      }
      return invokeParams
    },
    /**
     * 매진 여부 체크
     *
     * @param {optionItem}
     */
    checkSoldOut (optionItem) {
      const isSoldOut = (optionItem.fieldTxt === '0')
      if (isSoldOut) {
        const msg = PRODUCT_MESSAGE.SOLDOUT
        toastUtil.show(msg)
        return false
      } else {
        console.log('checkSoldOut Ok..')
        return true
      }
    },
    checkDuplicateSelection (productName) {
      let selOptionProductName = productName
      if (this.selectedOptionName.length > 0) {
        selOptionProductName = `${this.selectedOptionName.toString().replace(',', ' / ')} / ${productName}`
      }
      for (const item of this.invoiceProducts) {
        if (item.productName === selOptionProductName) {
          const msg = '이미 선택한 상품입니다.'
          toastUtil.show(msg)
          return false
        }
      }
      return true
    },
    checkItemValidation (optionItem, productName) {
      if (this.checkSoldOut(optionItem) && this.checkDuplicateSelection(productName)) {
        console.log('checkItemValidation Ok..')
        return true
      } else {
        console.log('checkItemValidation fail..')
        return false
      }
    }
  }
}

export default storeMixProductAddCartMixin
