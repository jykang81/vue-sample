import COMM_CONST from '@constants/framework/constants'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import {
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import toastUtil from '@frameworks/toastUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import rightOrderOptionService from '@services/product/rightOrderOptionService'

/**
 * Cart Add Item Mixin
 */
const addCartMixin = {
  data () {
    return {
      addCartItems: [],
      checkAddCartItemData: null,
      callbackAddCartItems: data => {
        if (this.isCartFlg) {
          toastUtil.show('장바구니에 상품이 담겼습니다.', 'add_cart')
        } else {
          toastUtil.show('장바구니에 상품이 담겼습니다.')
        }
      },
      isError: false,
      cnt: 1,
      isCartFlg: false,
      isEndFlg: false
    }
  },
  methods: {
    /**
     * 장바구니 담기
     */
    async addCart () {
      this.isError = false

      let itemCnt = 0
      for (const addCartItem of this.addCartItems) {
        const data = await this.getProduct(addCartItem)
        const isSoldOut = await this.isSoldOutProduct(data.msg.goods[0].info)

        if (isSoldOut) {
          this.isError = true
          messageUtil.alert('품절된 상품으로 장바구니에 담을 수 없습니다.')
          return false
        }

        const optionList = this.getItem(data.msg.goods[0].info.optionList, data.msg.goods[0].info.partNumber)
        const skus = optionList.SKUs.find(option => addCartItem.CATENTRY_ID === option.uniqueID)
        if (!isNull(skus) && Number(skus.field) === 0) {
          this.isError = true
          messageUtil.confirm('상품정보가 변경되어 장바구니에 담을 수 없습니다.<br>상품상세로 이동하시겠습니까?', () => {
            bizUtil.gotoProductDetail(addCartItem.goodsCd)
          }, () => {
            return false
          }, '확인', '취소')
          return false
        }

        if (addCartItem.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_GIFTISHOW && !loginUtil.isLoggedIn()) {
          messageUtil.alert('로그인을 하셔야 장바구니 담기가 가능한 상품입니다.', () => {
            return false
          })
        }

        const couponInfoList = this.couponInfoList(data)
        const couponParams = this.getCouponParams(couponInfoList, addCartItem.QUANTITY)
        await this.execCouponAutoSave(couponParams)
        await this.getCartInfoList(addCartItem)

        itemCnt++
        if (itemCnt === this.addCartItems.length) {
          this.isEndFlg = true
        }

        if (this.isError) {
          break
        }
      }

      // if (!this.isError) {
      //   this.callbackAddCartItems()
      // }
    },
    /**
     * 장바구니 내 같은 상품이 있을 경우 합산 수량을 체크한다.
     * @param {Object} addCartItem
     */
    async getCartInfoList (addCartItem) {
      const param = {
        DISP_TYPE_CD: addCartItem.DISP_TYPE_CD,
        userId: loginUtil.userId(),
        goodsType: 'GENERAL'
      }

      const successHandling = data => {
        const invokeParams = this.setInvokeParameters(addCartItem)
        let bFlag = false

        if (undefined !== data.msg.goods) {
          for (let i = 0; data.msg.goods.length > i; i++) {
            for (let j = 0; this.checkAddCartItemData.length > j; j++) {
              if (data.msg.goods[i].catentryId === this.checkAddCartItemData[j].catEntryId) {
                if (Number(data.msg.goods[i].quantity) + Number(this.checkAddCartItemData[j].quantity) >= 100) {
                  bFlag = true
                }
              }
            }
          }
        }

        if (bFlag) {
          messageUtil.alert('장바구니에 담김 동일한 상품과의 합산 수량이 1회 최대 구매 가능 수량 99개를 초과 하였습니다.')
          return
        }

        this.addCartInfo(invokeParams)
      }

      const errorHandling = e => {
        this.isError = true
      }

      await this.$nsaxios.post('NSBasketMobileCmdReal', param, successHandling, errorHandling)
    },
    /**
     * 장바구니에 넣을 파라미터 셋팅
     * @param {Object} addCartItem
     */
    setInvokeParameters (addCartItem) {
      const cocd = COMM_CONST.getCocd()
      const espotId = null
      const collateralId = null

      const invokeParams = {
        userId: loginUtil.userId(),
        orderId: '.',
        calculationUsage: '-1,-2,-5,-6,-7',
        inventoryValidation: 'false', // 번들상품일 경우 true
        cartType: addCartItem.DISP_TYPE_CD,
        itemType: 'product',
        goodsCd: addCartItem.goodsCd
      }

      let catalogId = ''
      if (!isNull(this.globalVal.mInputParams.invoke) &&
            !isNull(this.globalVal.mInputParams.invoke.preParam)) {
        catalogId = (this.globalVal.mInputParams.invoke.preParam.extCatalogId_1 !== '') ? this.globalVal.mInputParams.invoke.preParam.extCatalogId_1 : COMM_CONST.getDefaultCatalogId()
      }

      this.cnt = 1
      invokeParams[String(`quantity_${this.cnt}`)] = addCartItem.QUANTITY
      invokeParams[String(`catEntryId_${this.cnt}`)] = addCartItem.CATENTRY_ID
      invokeParams[String(`extCatalogId_${this.cnt}`)] = catalogId

      this.checkAddCartItemData = []
      this.checkAddCartItemData[this.checkAddCartItemData.length] = { catEntryId: addCartItem.CATENTRY_ID, quantity: addCartItem.QUANTITY }

      if (!isNull(cocd)) {
        invokeParams[String(`extPtncd_${this.cnt}`)] = cocd
      }

      invokeParams[String(`itemBuschnId_${this.cnt}`)] = addCartItem.busChnId

      if (!isNull(espotId)) {
        invokeParams[String(`extEspotId_${this.cnt}`)] = espotId
      }
      if (!isNull(collateralId)) {
        invokeParams[String(`extCollateralId_${this.cnt}`)] = collateralId
      }

      // 캠페인 ID - Push를 통해 들어온 데이터.
      const itemCampId = COMM_CONST.getCampaignId()
      if (!isNull(itemCampId)) {
        invokeParams[String(`itemCampId_${this.cnt}`)] = itemCampId
      }

      this.cnt++
      return invokeParams
    },
    /**
     * 장바구니 담기
     * @param {Object} invokeParams - 장바구니에 넣을 파라미터 정보
     */
    addCartInfo (invokeParams) {
      const successHandling = response => {
        const orderId = response.orderId
        if (orderId == null || orderId === '') {
          this.isError = true
          if (response.errorCode === 'CMN0413E') {
            messageUtil.confirm('상품정보가 변경되어 장바구니에 담을 수 없습니다.<br>상품상세로 이동하시겠습니까?',
              () => {
                bizUtil.gotoProductDetail(invokeParams.goodsCd)
              },
              null
            )
          } else {
            messageUtil.alert(response.errorMessageKey)
          }
        } else {
          bizUtil.getCartCount()
          if (this.isEndFlg && !this.isError) {
            this.callbackAddCartItems()
          }
        }
      }

      const errorHandling = e => {
        this.isError = true
      }

      this.$nsaxios.post('AjaxNSXorderItemAdd4Worklight', invokeParams, successHandling, errorHandling)
    },

    /**
     * 품절 여부 체크
     * 상품상세 진입 시 체크하는 기준 중 SOLDOUT 기준만 적용
     * @param {object} info 상품정보
     * @returns {boolean}
     */
    async isSoldOutProduct (info) {
      let isSoldOut = false

      if (info.salePrice < 0) { // 알뜰 할인가 마이너스 값일 경우 처리
        isSoldOut = true
      } else if (info.dispTypeCd === '') { // 전시타입 코드가 없는 경우
        isSoldOut = true
      } else if (info.apprStatCd !== '20' && info.apprStatCd !== '30' && info.apprStatCd !== '40') { // 미승인 상태 상품이 출력되었을 경우.
        isSoldOut = true
      } else if (info.buyable === 0) { // 판매불가 상품일 경우
        isSoldOut = true
      } else if (info.saleYn === 'N' || info.markForDelete === 1) { // 상품 판매가능 여부 (Y=판매가능 N=판매불가)와 DB에서 삭제된 상품인지 체크
        isSoldOut = true
      } else if (info.dispTypeCd === '60') { // 실물상품권일 경우 판매 불가
        isSoldOut = true
      } else if (info.productCnt <= 0) {
        isSoldOut = true
      } else if (info.busChnId === 'SB' && isNull(info.multiCd)) { // 쇼핑북상품 확인
        isSoldOut = true
      }

      const optionList = this.getItem(info.optionList, info.partNumber)

      if (!optionList) {
        isSoldOut = true
      }

      return isSoldOut
    },
    /**
     * partNumber 일치하는 첫번째 아이템 반환
     *
     * @param {Array|String}
     * @returns {Object}
     */
    getItem (items, partNumber) {
      return items.find(item => partNumber === item.partNumber)
    },
    /**
     * 상품정보 조회
     *
     * @param {Object} addCartItem - 장바구니 추가 상품정보
     * @returns {Object}
     */
    async getProduct (addCartItem) {
      const param = {
        partNumber: addCartItem.goodsCd,
        cocd: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE
      }

      let productInfo = null

      const successHandling = data => {
        addCartItem.busChnId = data.msg.goods[0].info.busChnId
        productInfo = data
      }

      await this.$nsaxios.post('DetailProductViewReal', param, successHandling)
      return productInfo
    },
    /**
     * 쿠폰정보목록
     *
     * @param {Object} data 상품정보
     * @returns {Array}
     */
    couponInfoList (data) {
      const returnlist = []
      const { couponList } = data.msg.goods[0].info

      if (!isNull(couponList)) {
        couponList.forEach(items => {
          returnlist.push({ cpIdfr: items.plusCouponCpIDFR, beforePrice: items.couponBeforePrice })
        })
      }

      return returnlist
    },
    /**
     * 쿠폰 정보 가져오기위한 파라미터
     *
     * @param {Array} couponInfoList 쿠폰정보목록
     * @returns {Object}
     */
    getCouponParams (couponInfoList, quantity) {
      if (!couponInfoList || couponInfoList.length < 1) {
        return null
      }

      let cpIdfr = ''
      let beforePrice = ''
      for (let k = 0; k < couponInfoList.length; k++) {
        cpIdfr += (k === 0) ? couponInfoList[k].cpIdfr : `,${couponInfoList[k].cpIdfr}`
        beforePrice += (k === 0) ? couponInfoList[k].beforePrice : `,${couponInfoList[k].beforePrice}`
      }

      const itemCnt = quantity
      const vdnCd = isOsApp() ? '54101' : '54102'
      const param = {
        cmdType: 8,
        cpIdfr,
        itemCnt,
        vdn_cd: vdnCd,
        couponBeforePrice: beforePrice
      }

      return param
    },
    /**
     * 장바구니 담기 전 또는 바로주문 전에 해당 상품의 쿠폰을 다운로드한다.
     *
     * @param {Object} couponParams 파라미터
     * @returns {Boolean}
     */
    async execCouponAutoSave (couponParams) {
      if (!couponParams) {
        return false
      }

      const successHandling = response => {
        console.debug(response)
      }

      await rightOrderOptionService.execCouponAutoSave(couponParams, successHandling)
    }
  }
}

export default addCartMixin
