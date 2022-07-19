<template>
  <section
    v-if="productDataReady"
    class="right_order_option"
    :class="showsLayer ? 'active' : ''"
  >
    <div
      v-touch:moving="layerClose" class="dimmed_all"
      :class="isNative ? 'native_opa' : ''"
      @click="layerClose"
    />
    <div v-if="isSingleOption"
         id="rightOrderOptionLayer"
         class="layer_inner"
    >
      <div
        class="product_option"
        :class="optionList.length > 1 ? 'option_more' : '' "
      >
        <div class="count_buy">
          <div class="count">
            <span class="num_title">수량</span>
            <quantity-input
              :params="{
                value: selectedCount,
                max: Math.min(product.productInfo.productCnt, productRemainedCnt, nMaxCount),
                id: product.productInfo.catentryId
              }"
              @change="selectedCount = $event"
            />
          </div>
        </div>
      </div>
      <div class="total_price_info">
        <span class="total_price">
          총
          <ns-price
            :dc-price="singleTotalPrice"
            :buschn-id="product.productInfo.busChnId"
            :disp-type-cd="product.productInfo.dispTypeCd"
          />
        </span>
      </div>
      <div class="btn_group">
        <button
          type="button"
          class="btn_cart"
          @[bindEvent]="addToCart()"
        >
          <span>장바구니</span>
        </button>
        <button
          type="button"
          class="btn_buy"
          @[bindEvent]="clickBuyButton()"
        >
          <span>구매하기</span>
        </button>
      </div>
      <button type="button" class="btn_layer_close" @click="layerClose">
        <span>구매하기 취소</span>
      </button>
    </div>
    <div
      v-else
      id="rightOrderOptionLayer"
      class="layer_inner"
      :class="isOpenedOption ? 'option_select' : '' "
    >
      <div v-for="(optionItemList, selectboxIndex) in computedOptionList"
           :key="selectboxIndex"
           class="product_select"
           :class="isSelectBoxState(selectboxIndex)"
      >
        <button
          type="button"
          class="btn_select"
          :class="isOpenIndex === selectboxIndex ? 'active' : ''"
          :disabled="enabledSelectboxIndex < selectboxIndex ? true: false"
          @click="toggleOpenOption(selectboxIndex)"
        >
          <span>{{ selectboxPlaceholderText[selectboxIndex] }}</span>
        </button>
        <ul class="select_list">
          <li
            v-for="(optionItem, optionItemIndex) in optionItemList.optionList"
            :key="optionItemIndex"
            :value="optionItem.id"
            @click="selectOptionIndex(optionItem,optionItemIndex,selectboxIndex)"
          >
            <div class="state" :class="optionItem.fieldTxt === '0' ? 'soldout' : ''">
              <span class="item">
                <span v-if="optionItem.fieldTxt === '0'" class="txt_soldout">(품절)</span>
                <span v-else-if="getSelectedYn(optionItem, optionItemIndex, selectboxIndex)" class="txt_select">(선택)</span>
                {{ optionItem.value }}
              </span>
              <ns-price
                v-if="showOptionPrice"
                :dc-price="optionItem.optionSalePrice"
                :buschn-id="product.productInfo.busChnId"
                :disp-type-cd="product.productInfo.dispTypeCd"
              />
            </div>
          </li>
        </ul>
      </div>
      <div v-if="invoiceProducts.length > 0"
           class="product_option"
           :class="optionList.length > 1 ? 'option_more' : '' "
      >
        <div v-for="(invoiceProduct, k) in invoiceProducts"
             :key="k"
             class="count_buy"
        >
          <p class="option_title">
            {{ htmlDecode(invoiceProduct.productName) }}
          </p>
          <div class="count">
            <ns-price
              :dc-price="invoiceProduct.optionTotalPriceTxt"
              :buschn-id="product.productInfo.busChnId"
              :disp-type-cd="product.productInfo.dispTypeCd"
            />
            <quantity-input
              :params="{
                value: invoiceProduct.selectedOptionCount,
                max: setMax(invoiceProduct),
                id: invoiceProduct.catentryId
              }"
              @change="changeOptionQuantity($event, invoiceProduct)"
            />
          </div>
          <button type="button" class="btn_close" @click="deleteRow(invoiceProduct)">
            닫기
          </button>
        </div>
      </div>
      <div v-if="!!invoiceProducts && invoiceProducts.length > 0"
           class="total_price_info"
      >
        <span class="num_info">{{ totalCnt }}개 선택</span>
        <span class="total_price">
          총
          <ns-price
            :dc-price="totalPriceTxt"
            :buschn-id="product.productInfo.busChnId"
            :disp-type-cd="product.productInfo.dispTypeCd"
          />
        </span>
      </div>
      <div class="btn_group">
        <button
          type="button"
          class="btn_cart"
          :class="isBuyButtonActive"
          :disabled="!!isBuyButtonActive"
          @click="addToCart()"
        >
          <span>장바구니</span>
        </button>
        <button
          type="button"
          class="btn_buy"
          :class="isBuyButtonActive"
          :disabled="!!isBuyButtonActive"
          @click="clickBuyButton()"
        >
          <span>구매하기</span>
        </button>
      </div>
      <button type="button" class="btn_layer_close" @click="layerClose">
        <span>구매하기 취소</span>
      </button>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import MESSAGES from '@constants/framework/messages'
import toastUtil from '@frameworks/toastUtil'
import {
  getMoneyFormat,
  htmlDecode,
  extend,
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import COMM_CONST from '@constants/framework/constants'
import {
  format,
  getDateParse
} from '@frameworks/dateutil/dateUtil'
import PRODUCT_MESSAGE, { PRODUCT_CONST } from '@/common/constants/product/product'
import LOGIN_CONST from '@constants/customer/login'
import QuantityInput from '@components/common/QuantityInput'
import NsPrice from '@components/common/NsPrice'
import nativeUtil from '@/common/frameworks/nativeUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import rightOrderOptionService from '@services/product/rightOrderOptionService'
import uiUtil from '@utils/uiUtil'
import flushPromises from 'flush-promises'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'

export default {
  name: 'RightOrderOption',
  components: {
    QuantityInput,
    NsPrice
  },
  props: {
    showsLayer: {
      type: Boolean,
      default: false
    },
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isNoAuthority: false,
      productDataReady: false, // 상품상세 데이터 호출 응답 완료
      isNotOptionExist: false, // 옵션 상품인데 옵션 없는 경우 대비한 방어 로직
      enabledSelectboxIndex: 0, // 활성화된 셀렉트박스 인덱스
      selectedOptionName: [], // 선택된 옵션명
      selectedOptionItemList: [], // 선택된 옵션 목록
      isOpenIndex: null, // div 셀렉트박스처럼 동작하게 하기 위한 변수
      changedOptionItemList: [],
      selectedCount: 1, // 단품의 선택된 개수
      totalPrice: 0, // 총 주문 금액
      toast: false, // 장바구니 담기 custom toast
      selectedOptions: [], // 선택된 옵션
      isOpenedOption: '', // 옵션영역 펼침 여부
      catentryId: '', // catentryId
      isOnlyUser: false, // 비회원 주문 가능 여부 true: 불가, false: 가능
      styleMngYn: 'N', // N:단품 (옵션 없음)
      arrChkData: null, // 상품 중복 체크 위한 변수
      busChnId: null, // 매체타입
      productCategoryName: {}, // 상품 카테고리명
      productCatalogId: '', // 상품 조회 후 카탈로그 아이디 세팅
      invoiceProducts: [], // 옵션 각항목 정보
      totalCnt: 0, // 선택 개수
      productRemainedCnt: 0, // 단품의 남은 수량
      isNative: false, // 네이티브 여부
      bindEvent: 'click' // 클릭 이벤트 바인딩 (중복 호출 방지를 위해 동적으로 이벤트 바인딩)
    }
  },
  computed: {
    ...mapState(['product']),
    /**
     * TV상품 여부
     *
     * @returns {Boolean}
     */
    isTvProduct () {
      return this.product.productInfo?.tvList?.length > 0 || false
    },
    /**
     * 렌탈상품 여부
     *
     * @returns {Boolean}
     */
    isRentalProduct () {
      return this.product.productInfo.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL
    },
    /**
     * 여행상품 여부
     *
     * @returns {Boolean}
     */
    isTravelProduct () {
      return this.product.productInfo.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL
    },
    /**
     * 핸드폰상품 여부
     *
     * @returns {Boolean}
     */
    isPhoneProduct () {
      return this.product.productInfo.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE
    },
    /**
     * 할인쿠폰정보 출력 여부
     *
     * 즉시할인쿠폰 할인액이 존재하거나
     * 알뜰할인가 가격이 1만원이상이고 OK캐쉬백 노출 제외 여부가 N이고 tv상품 아닌 경우
     *
     * @returns {Boolean}
     */
    isCouponInfoShowConditions () {
      const { couponList, cpcValue, okCashUndispYn, orginSalePrice } = this.product.productInfo
      return couponList?.length > 0 || cpcValue > 0 || (orginSalePrice >= 10000 && okCashUndispYn === 'N' && !this.isTVProduct)
    },
    /**
     * 할인쿠폰 정보 출력하지 않는 상품 여부
     *
     * @returns {Boolean}
     */
    isCouponInfoShowProduct () {
      return this.isTravelProduct &&
            this.isRentalProduct &&
            this.isPhoneProduct
    },
    /**
     * 쿠폰정보목록
     *
     * @returns {Array}
     */
    couponInfoList () {
      const returnlist = []

      if (this.isCouponInfoShowConditions && !this.isCouponInfoShowProduct) {
        const { couponList } = this.product.productInfo

        couponList && couponList.forEach(items => {
          returnlist.push({ cpIdfr: items.plusCouponCpIDFR, beforePrice: items.couponBeforePrice })
        })
      }

      return returnlist
    },
    /**
     * 옵션 선택창 placeholder
     *
     * @returns {Array<String>}}
     */
    selectboxPlaceholderText () {
      try {
        const optionList = new Array(this.definingAttributeList.length)
        optionList.fill('선택')

        const returnList = this.definingAttributeList.length < 2
          ? optionList
          : optionList.map((item, index) => `${item} ${index + 1}`)
        this.selectedOptionName.forEach((optionName, i) => {
          returnList[i] = optionName
        })

        // returnList[this.definingAttributeList.length - 1] = '선택'

        if (this.isOpenedOption) {
          returnList[this.isOpenIndex] = '선택'
        }

        return returnList
      } catch (error) {
        return null
      }
    },
    /**
     * 사은품 존재 여부
     *
     * @returns {Boolean}
     */
    isGiftExist () {
      return this.product.productInfo?.giftBnftList?.length > 0 || false
    },
    /**
     * 최대구매 가능
     *
     * @returns {Number}
     */
    nMaxCount () {
      return this.product.productInfo.maxItemCountOnOnce >= 100 ? 99 : this.product.productInfo.maxItemCountOnOnce
    },
    /**
     * 구매하기 버튼 활성화 여부
     * @returns {String}
     */
    isBuyButtonActive () {
      if (this.invoiceProducts.length > 0) {
        return ''
      } else {
        return 'in_active'
      }
    },
    /**
     * 기프티쇼 상품 여부
     *
     * @returns {Boolean}
     */
    isGiftishowProduct () {
      return this.product.productInfo.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_GIFTISHOW
    },
    /**
     * 로그인 필요한 상품 여부
     * 기프티쇼, 성인상품, 정기배송
     *
     * @returns {Boolean}
     */
    isLoginRequiredProduct () {
      return this.isGiftishowProduct
    },
    /**
     * 단품 여부
     * styleMngYn N:단품 (옵션 없음)
     * @returns {Boolean}
     */
    isSingleOption () {
      const isNoOption = this.product.productInfo.styleMngYn === 'Y' && this.isNotOptionExist // 옵션 상품이지만 옵션이 없는 경우가 있어 방어로직(단품으로 처리)
      return this.product.productInfo.styleMngYn === 'N' || isNoOption
    },
    /**
     * 총 주문금액 단일옵션인 경우 총 금액
     * @returns {String}
     */
    singleTotalPrice () {
      return getMoneyFormat('', this.product.productInfo.salePrice * this.selectedCount)
    },
    /**
     * 총 주문금액 옵션상품인 경우 전체
     * @returns {String}
     */
    totalPriceTxt () {
      return getMoneyFormat('', this.totalPrice)
    },
    /**
     * 옵션목록
     * @returns {Array}
     */
    definingAttributeList () {
      try {
        const optionList = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber)

        const entitledItems = optionList.SKUs
        const { styleMngYn, unitRegiTypeCd, attributes } = optionList
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

        return definingAttributeList
      } catch (error) {
        return null
      }
    },
    /**
     * 옵션 가격 노출 여부
     * 옵션별 가격이 다른 옵션일 경우 노출
     *
     * @returns {Boolean} 옵션 가격 노출 여부
     */
    showOptionPrice () {
      return this.definingAttributeList[this.definingAttributeList.length - 1]
        .attr.some(element => Number(element.overPrice))
    },
    /**
     * 옵션목록
     *
     * @returns {Array}
     */
    optionList () {
      const returnList = []
      const optionList = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber)
      if (isNull(optionList)) {
        return returnList
      }
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
            const optionSalePrice = this.showOptionPrice ? this.getOptionPrice(attr.overPrice) : this.product.productInfo.salePrice

            attrList.push({ id, fieldTxt, value, valueId, optionSalePrice })
          }
        } else {
          if (selCount === 1) {
            for (const attr of attribute.attr) {
              const id = `${selCount}_${attribute.nameId}_${attr.valueId}_${attr.value}`
              const fieldTxt = attr.fieldTxt
              const value = attr.value
              const valueId = attr.valueId
              const nameId = attr.nameId
              const optionSalePrice = this.showOptionPrice ? this.getOptionPrice(attr.overPrice) : this.product.productInfo.salePrice

              attrList.push({ id, fieldTxt, value, nameId, valueId, optionSalePrice })
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
  watch: {
    'showsLayer' (isShowLayer) {
      if (isShowLayer) {
        if (this.isNoAuthority) {
          const alertMsg = this.product.productData.authMsg.message
          messageUtil.alert(alertMsg)
          this.layerClose()
        }
        uiUtil.disableScroll()
        if (isOsApp()) { // APP
          nativeUtil.setRoutePath('/native/right-order-option')
        }
      } else {
        uiUtil.enableScroll()
        if (isOsApp()) { // APP
          nativeUtil.setRoutePath(router.history.current.path)
        }
      }
    }
  },
  async created () {
    if (isOsApp()) { // APP
      this.isNative = true
      if (this.$route.name === 'rightOrderOption') {
        this.showsLayer = true
      }
    }
    if (this.globalVal.getProductInfoFlag) { // 다른 페이지에서 컴퍼넌트 사용시 API 중복호출 막기 위한 플래그(상품상세 페이지가 아닌 곳에서 바로구매 클릭 시)
      const response = await this.$store.dispatch('product/getProductInfoSync', this.setProductDetailParams())
      if (isOsApp() && response?.msg?.resultCode === '2510') { // APP 바로구매 오류로 인해 추가 by ysjoo
        // CMN3101E \"{0}\"(으)로 인해 시스템을 사용할 수 없습니다. 인 경우 웹뷰 닫음
        bizUtil.secessionMemberCheker().then(data => {
          nativeUtil.closeWebView()
        })
      }
      if (response?.authMsg?.authCode === '400') {
        const alertMsg = this.product.productData.authMsg.message
        this.isNoAuthority = true
        messageUtil.alert(alertMsg, () => {
          bizUtil.gotoMain()
        })
        return
      }
      const liveLimit = this.product.productInfo.liveLimit
      if (!isNull(liveLimit) && liveLimit === 'N') {
        messageUtil.alert('해당 상품은 방송시간 중에만 구매하실 수 있습니다.')
        this.layerClose()
        return
      }
      if (this.isGiftExist) {
        if (!this.$route.path.includes('product')) {
          this.layerClose()
          this.$router.push(`/product/${this.globalVal.partNumber}`)
        }
      }
      this.productDataReady = true
    } else {
      this.productDataReady = true
    }

    if (this.isSingleOption) {
      const sku = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber).SKUs[0]
      if (sku) {
        this.catentryId = sku.uniqueID
        const params = this.createRemainCntParams(this.product.productInfo.partNumber, this.catentryId)
        this.getRemainedCatEntry(params)
      }
    } else {
      if (this.optionList.length < 1) {
        this.isNotOptionExist = true
      }
    }
  },
  destroyed () {
    this.$store.commit('product/setSelectedGiftList', {})
  },
  mounted () {
    if (this.showsLayer) {
      uiUtil.disableScroll()
    } else {
      uiUtil.enableScroll()
    }
    if (isOsApp()) { // APP
      if (this.isSingleOption) {
        const sku = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber).SKUs[0]
        if (sku) {
          this.catentryId = sku.uniqueID
          const params = this.createRemainCntParams(this.product.productInfo.partNumber, this.catentryId)
          this.getRemainedCatEntry(params)
        }
      } else {
        if (PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(this.product.productInfo?.dispTypeCd) && (this.product.productInfo?.salePrice === 0)) {
          // 옵션상품이면서, 일반상품의 가격이 0원일 경우 soldout alert
          const msg = PRODUCT_MESSAGE.SOLDOUT
          messageUtil.alert(msg)
        }
        if (this.optionList.length < 1) {
          this.isNotOptionExist = true
        }
      }
    }
  },
  beforeDestroy () {
    uiUtil.enableScroll()
  },
  methods: {
    htmlDecode,
    getSelectedYn (optionItem, optionItemIndex, selectboxIndex) {
      const optionList = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber)
      const productName = this.getProductName(optionList, optionItem)
      const optionName = this.definingAttributeList.length < 2 ? productName : `${this.selectedOptionName.join(' / ')} / ${productName}`
      if (this.definingAttributeList.length - 1 === selectboxIndex) {
        return this.invoiceProducts.some(item => item.productName === optionName)
      }

      return false
      // return this.definingAttributeList.length < 2 && this.selectedOptions.length > 0 && this.selectedOptions.includes(optionItemIndex)
    },
    /**
     * 옵션 가격
     *
     * @param {Number} 가격 차이
     * @returns {String} 가격
     */
    getOptionPrice (overPrice) {
      return getMoneyFormat('', this.product.productInfo.salePrice + (Number(overPrice) ? overPrice : 0))
    },
    /**
   * 쿠폰 정보 가져오기위한 파라미터
   *
   * @returns {Object}
   */
    getCouponParams () {
      if (!this.couponInfoList || this.couponInfoList.length < 1) {
        return null
      }

      let cpIdfr = ''
      let beforePrice = ''
      for (let k = 0; k < this.couponInfoList.length; k++) {
        cpIdfr += (k === 0) ? this.couponInfoList[k].cpIdfr : `,${this.couponInfoList[k].cpIdfr}`
        beforePrice += (k === 0) ? this.couponInfoList[k].beforePrice : `,${this.couponInfoList[k].beforePrice}`
      }
      let itemCnt = 0
      if (this.isSingleOption) {
        itemCnt = this.selectedCount
      } else {
        itemCnt = this.totalCnt
      }
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
    execCouponAutoSave (couponParams) {
      if (!couponParams) {
        return false
      }

      const successHandling = response => {
        console.debug(response)
      }

      rightOrderOptionService.execCouponAutoSave(couponParams, successHandling)
    },
    /**
     * 해당 옵션 활성화 여부
     *
     * @param {Number} currentIndex 셀렉트박스 인덱스
     * @returns {String}
     */
    isSelectBoxState (currentIndex) {
      if (this.enabledSelectboxIndex === currentIndex) {
        return 'selected'
      } else if (this.enabledSelectboxIndex > currentIndex) {
        return ''
      } else {
        return 'in_active'
      }
    },
    /**
     * 사은품 선택 여부 체크
     * @returns {Boolean}
     */
    checkIsGiftSelected () {
      let selectedGiftOptionCount = 0
      let giftOptionCount = 0
      let isSelectedAll = false
      if (this.product.selectedGiftList.selectedGiftOptionList) {
        selectedGiftOptionCount = this.product.selectedGiftList.selectedGiftOptionList.filter(item => item.valueId).length
        giftOptionCount = this.product.selectedGiftList.selectedGiftOptionList.length
        isSelectedAll = selectedGiftOptionCount === giftOptionCount
      }

      if (isSelectedAll) {
        return true
      } else {
        let msg = ''
        if (selectedGiftOptionCount < 1) {
          msg = '선택된 사은품이 없습니다. 사은품을 선택하세요.'
        } else {
          msg = `사은품을 ${giftOptionCount}개 선택하세요.`
        }
        messageUtil.alert(msg)
        return false
      }
    },
    /**
     * 유효성 체크
     *
     * @param {Object} items 항목
     * @param {String} partNumber 제품번호
     * @returns {Object|null}
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
     * 단품 재고 체크
     * @param {Object} data 단품 재고체크 데이터
     */
    setSingleItemRemainedCatEntryCount (data) {
      if (data.jsonData.rtnData === 0) {
        return
      }
      const rtnData = data.jsonData.rtnData
      const dispTypeCd = this.product.productInfo.dispTypeCd

      this.productRemainedCnt = Number(rtnData)
      const isGeneralProduct = dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_NO_SINGLE ||
                              dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_SINGLE ||
                              dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PACK ||
                              dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.DELIVERY

      const isNoOfferPrice = this.product.productInfo.offerPrice === 0 && !this.isRentalProduct && this.product.productInfo.busChnId !== 'TV'

      if (isNoOfferPrice) {
        if (isGeneralProduct) {
          const msg = PRODUCT_MESSAGE.SOLDOUT
          messageUtil.alert(msg)
        }
      }
    },
    /**
     * NSItemDetailRemainCntAjax API 파라미터 세팅
     * @param {String} partNumber 상품번호
     * @param {String} itemNumber 아이템번호
     * @returns {Object}
     */
    createRemainCntParams (partNumber, itemNumber) {
      return {
        partNumber,
        itemNumber,
        cmdType: 1,
        offerIdfr: '',
        busChnId: this.product.productInfo.busChnId,
        coCd: COMM_CONST.getCocd(),
        multiCd: this.product.productInfo.mparam?.multiCd || '',
        cpcAmt: this.product.productInfo.cpcAmt,
        arsAmt: this.product.productInfo.arsAmt
      }
    },
    /**
     * 단품의 남아있는 상품 개수를 가져온다.
     * @param {Object} params api 파라미터
     */
    getRemainedCatEntry (params) {
      const successHandling = response => {
        this.setSingleItemRemainedCatEntryCount(response)
      }

      rightOrderOptionService.getRemainedCatEntry(params, successHandling)
    },
    /**
     * 상품정보 불러오기 위한 파라미터
     *
     * @returns {Object}
     */
    setProductDetailParams () {
      return {
        partNumber: this.globalVal.partNumber,
        cocd: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        cmdType: 'PRD_CATE_ORD'
      }
    },
    /**
     * 버튼영역
     *
     */
    layerClose () {
      if (isOsApp()) { // APP
        if (this.$route.name === 'rightOrderOption') {
          nativeUtil.closeWebView()
        } else if (this.$route.name === 'thinglive') {
          this.$emit('layerClose')
        } else {
          this.$emit('layerClose')
        }
      } else { // WEB
        this.$emit('layerClose')
      }
    },
    /**
     * selectbox option 클릭 동작(해당 옵션 열기 닫기)
     * @param {Number} index 셀렉트박스 인덱스
     */
    toggleOpenOption (index) {
      this.enabledSelectboxIndex = index
      if (index !== this.selectedOptionName.length) {
        this.selectedOptionName.splice(index - this.enabledSelectboxIndex)
      }
      if (index < this.selectedOptionItemList.length) {
        this.selectedOptionItemList.splice(index - this.enabledSelectboxIndex)
      }

      this.isOpenIndex = (this.isOpenIndex === index) ? null : index
      if (this.isOpenIndex !== null) {
        this.isOpenedOption = true
      } else {
        this.isOpenedOption = false
      }
    },
    /**
     * 옵션 상품 수량 변경
     *
     * @param {number} value (필수) 변경될 수량
     * @param {object} invoiceProduct (필수) 옵션 정보
     */
    changeOptionQuantity (value, invoiceProduct) {
      invoiceProduct.selectedOptionCount = value
      this.calculateLineTotal(invoiceProduct)
    },
    /**
     * 장바구니담기 버튼 클릭
     */
    async addToCart () {
      if (this.isGiftExist) {
        if (!this.checkIsGiftSelected()) {
          return
        }
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '구매하기 상세',
          eventLabel: '장바구니',
          params: {
            t1: null
          }
        }
      })

      const isLogon = loginUtil.checkLogonStatus()
      if (this.isLoginRequiredProduct && !isLogon) {
        const msg = '로그인을 하셔야 장바구니 담기가 가능한 상품입니다.'
        toastUtil.show(msg)
        return
      }

      // 다중 호출 방지
      this.bindEvent = null

      this.getCartInfoList()

      await flushPromises()

      this.bindEvent = 'click'
    },
    /**
      * 장바구니 내 같은 상품이 있을 경우 합산 수량을 체크한다.
      */
    getCartInfoList () {
      const objParam = {}
      objParam.DISP_TYPE_CD = this.product.productInfo.dispTypeCd
      objParam.userId = loginUtil.userId()
      objParam.goodsType = 'GENERAL'

      const successHandling = response => {
        const invokeParams = this.setInvokeParameters()
        let bFlag = false

        if (undefined !== response.msg.goods) {
          for (let i = 0; response.msg.goods.length > i; i++) {
            for (let j = 0; this.arrChkData.length > j; j++) {
              if (response.msg.goods[i].catentryId === this.arrChkData[j].catEntryId.toString()) {
                if (Number(response.msg.goods[i].quantity) + Number(this.arrChkData[j].quantity) >= 100) {
                  bFlag = true
                }
              }
            }
          }
        }

        if (bFlag) {
          const msg = '장바구니에 담긴 동일한 상품과의 합산 수량이 1회 최대 구매 가능 수량 99개를 초과 하였습니다.'
          toastUtil.show(msg)
          return
        }

        this.execCouponAutoSave(this.getCouponParams())
        this.addCartInfo(invokeParams)
      }

      rightOrderOptionService.getCartInfoList(objParam, successHandling)
    },
    /**
     * 장바구니 담기
     * @param {Object} invokeParams 파라미터
     */
    addCartInfo (invokeParams) {
      const successHandling = response => {
        const orderId = response.orderId
        if (!orderId) {
          toastUtil.show(response.errorMessageKey)
        } else {
          this.layerClose()
          bizUtil.getCartCount()

          if (isOsApp() && this.$route.name === 'rightOrderOption') { // Native에 장바구니 수 set
            bizUtil.getNativeCartCount()
            nativeUtil.showToast('장바구니에 상품이 담겼습니다.')
          } else {
            // 상품상세는 토스트 메시지가 장바구니를 가리키도록 위치를 조정
            const toastClass = this.$route.name === 'productDetail' ? 'add_cart' : ''
            toastUtil.show('장바구니에 상품이 담겼습니다.', toastClass)
          }

          // 마케팅 스크립트 적용 부분
          // Airbridge
          let productCategoryName = ''
          if (!isNull(this.product.productInfo.mparam?.cate1Nm)) {
            productCategoryName = htmlDecode(this.product.productInfo.mparam?.cate1Nm)
          }
          if (!isNull(this.product.productInfo.mparam?.cate2Nm)) {
            productCategoryName += `>${htmlDecode(this.product.productInfo.mparam?.cate2Nm)}`
          }
          if (!isNull(this.product.productInfo.mparam?.cate3Nm)) {
            productCategoryName += `>${htmlDecode(this.product.productInfo.mparam?.cate3Nm)}`
          }
          if (!isNull(this.product.productInfo.mparam?.cate4Nm)) {
            productCategoryName += `>${htmlDecode(this.product.productInfo.mparam?.cate4Nm)}`
          }
          if (!isNull(this.product.productInfo.mparam?.cate5Nm)) {
            productCategoryName += `>${htmlDecode(this.product.productInfo.mparam?.cate5Nm)}`
          }
          marketingUtil.airbridgeLogger.send({
            event: marketingUtil.airbridgeLogger.EVENT.ADDED_TO_CART, // 장바구니 담기
            data: {
              cartID: String(orderId), // String(Math.floor(Math.random() * (9999999 - 1)) + 1), // cartID라는 값은 특별히 관리하지 않는다. 임의의 난수 발생
              totalValue: Number(this.product.productInfo.salePrice) * Number(invokeParams.quantity_1),
              currency: 'KRW',
              products: [
                {
                  productID: this.product.productInfo.partNumber, // 상품ID
                  name: this.product.productInfo.productName, // 상품명
                  price: Number(String(this.product.productInfo.salePrice).replaceAll(',', '')), // 가격
                  quantity: Number(String(invokeParams.quantity_1).replaceAll(',', '')), // 개수
                  currency: 'KRW', // 통화
                  position: 1 // index
                }
              ],
              customAttributes: {
                categoryNm: productCategoryName,
                gradeNm: loginUtil.getUserInfo('gradeNm')
              },
              action: '장바구니 담기',
              label: '장바구니 담기' // productCategoryName
            }
          })
          // 페이스북 픽셀
          marketingUtil.fbpixelLogger.send({
            type: marketingUtil.fbpixelLogger.EVENT.ADD_TO_CART
          })
          // 홈쇼핑 모아
          marketingUtil.hsmoaLogger.send({
            data: {
              co_cd: COMM_CONST.getCocd(),
              action: [this.product.productInfo.partNumber],
              category: 'basket'
            }
          })
          // E-commerce (장바구니)
          this.addCartEcommerceLogging()
          // AIQUA
          const params = {
            rcmdGbn: 'PRODUCT',
            rcmdValue: this.product.productInfo.partNumber
          }

          const productId = this.product.productInfo.partNumber
          let imgPath = ''
          if (!isNull(this.product.productInfo.photoList)) {
            if (Array.isArray(this.product.productInfo.photoList) && this.product.productInfo.photoList.length > 0) {
              imgPath = `https:${this.product.productInfo.photoList[0].photoPath}`
            }
          }
          let categoryName = ''
          if (!isNull(this.product.productInfo.mparam?.cate2Nm)) {
            categoryName = htmlDecode(this.product.productInfo.mparam?.cate2Nm)
          } else if (!isNull(this.product.productInfo.mparam?.cate1Nm)) {
            categoryName = htmlDecode(this.product.productInfo.mparam?.cate1Nm)
          } else {
            categoryName = ''
          }

          nsaxios.post('NSRcmdCmd', params, function (data) {
            let channelId = ''
            if (data.msg.tcomYn === 'Y') {
              channelId = 'CTCOM'
            } else if (data.msg.tvYn === 'Y') {
              channelId = 'TV'
            } else {
              channelId = 'INT'
            }

            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_EVENT,
              data: {
                event: 'product_added_to_cart',
                params: {
                  category_name: categoryName,
                  product_id: productId,
                  product_name: data.msg.itemName,
                  product_image_url: imgPath,
                  product_price: Number(String(data.msg.originalPrice).replaceAll(',', '')),
                  product_channel: channelId,
                  md_name: !isNull(data.msg.empNm) ? data.msg.empNm : '',
                  md_team_name: !isNull(data.msg.orgNm) ? data.msg.orgNm : ''
                }
              }
            })
          })
        }
      }

      rightOrderOptionService.addCartInfo(invokeParams, successHandling)
    },
    /**
     * GA360 전자상거래 - 장바구니 버튼 클릭
     */
    addCartEcommerceLogging () {
      const info = this.product.productInfo
      // 카테고리 전송
      let categoryName = ''
      if (!isNull(info.mparam)) {
        if (!isNull(info.mparam?.cate1Nm)) {
          categoryName = htmlDecode(info.mparam?.cate1Nm)
        }
        if (!isNull(info.mparam?.cate2Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate2Nm}`)
        }
        if (!isNull(info.mparam?.cate3Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate3Nm}`)
        }
        if (!isNull(info.mparam?.cate4Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate4Nm}`)
        }
        if (!isNull(info.mparam?.cate5Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate5Nm}`)
        }
      }
      // 제품_상품 유형
      let tvProduct = ''
      if (!isNull(info.ctcomTvList) || !isNull(info.tvList)) {
        tvProduct = 'eTV'
      } else {
        tvProduct = 'e상품'
      }

      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
          params: [
            {
              id: String(info.partNumber),
              name: info.productName,
              brand: info.brandName,
              category: categoryName,
              dimension16: tvProduct
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: '일반상품',
            t3: info.productName,
            product_list: null // productList
          }
        }
      })
    },
    /**
     * GA360 전자상거래 - 바로구매 버튼 클릭
     */
    buyBtnEcommerceLogging () {
      const info = this.product.productInfo
      // 카테고리 전송
      let categoryName = ''
      if (!isNull(info.mparam)) {
        if (!isNull(info.mparam?.cate1Nm)) {
          categoryName = htmlDecode(info.mparam?.cate1Nm)
        }
        if (!isNull(info.mparam?.cate2Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate2Nm}`)
        }
        if (!isNull(info.mparam?.cate3Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate3Nm}`)
        }
        if (!isNull(info.mparam?.cate4Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate4Nm}`)
        }
        if (!isNull(info.mparam?.cate5Nm)) {
          categoryName += htmlDecode(`/${info.mparam?.cate5Nm}`)
        }
      } else {
        categoryName = null
      }

      // 제품_상품 유형
      let tvProduct = ''
      if (!isNull(info.ctcomTvList) || !isNull(info.tvList)) {
        tvProduct = 'eTV'
      } else {
        tvProduct = 'e상품'
      }
      // 옵션 전송
      // let option = ''
      // if (!isNull(info.optionList[0].SKUs) && info.optionList[0].SKUs.length > 0) {
      //   for (let i = 0; i < info.optionList[0].SKUs.length; i++) {
      //     option += `${i !== 0 ? '/' : ''}${info.optionList[0].SKUs[i].name}(잔여:${info.optionList[0].SKUs[i].field}개)`
      //   }
      // } else {
      //   option = ''
      // }
      // 제품_방송일  & 제품_방송시작시간 & 제품_방송종료시간
      if (info.busChnId === 'TV') {
        let liveTime = ''
        let liveStartTime = ''
        let liveEndTime = ''
        if (info.tvList) {
          liveTime = info.tvList[0].brdctDate
          liveStartTime = format(getDateParse(info.tvList[0].formStartDttm), 'HH:mm')
          liveEndTime = format(getDateParse(info.tvList[0].formEndDttm), 'HH:mm')
        } else if (this.globalVal.productInfo.ctcomTvList) {
          liveTime = info.ctcomTvList[0].brdctDate
          liveStartTime = format(getDateParse(info.ctcomTvList[0].formStartDttm), 'HH:mm')
          liveEndTime = format(getDateParse(info.ctcomTvList[0].formEndDttm), 'HH:mm')
        } else {
          liveTime = null
          liveStartTime = null
          liveEndTime = null
        }

        // 제품_방송프로그램명
        let programName = ''
        if (!isNull(info.tvList)) {
          programName = 'NS LIVE'
        } else if (!isNull(info.ctcomTvList)) {
          programName = 'Shop+'
        } else {
          programName = null
        }

        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_07, // marketingUtil.ga360Logger.ECOMMERCE_STEP_03
            params: [
              {
                id: String(info.partNumber),
                name: info.productName,
                brand: info.brandName,
                category: categoryName,
                dimension16: tvProduct,
                dimension17: liveTime,
                dimension18: liveStartTime,
                dimension19: liveEndTime,
                dimension20: programName
              }
            ],
            subparams: {
              t1: '상품상세',
              t2: '일반상품',
              t3: info.productName,
              product_list: null // productList
            }
          }
        })
      } else {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_08, // marketingUtil.ga360Logger.ECOMMERCE_STEP_03
            params: [
              {
                id: String(info.partNumber),
                name: info.productName,
                brand: info.brandName,
                category: categoryName,
                dimension16: tvProduct
              }
            ],
            subparams: {
              t1: '상품상세',
              t2: '일반상품',
              t3: info.productName,
              product_list: null // productList
            }
          }
        })
      }
    },
    /**
     * 바로주문 버튼 클릭swiper-wrapper
     */
    async clickBuyButton () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '구매하기 상세',
          eventLabel: '구매하기',
          params: {
            t1: null
          }
        }
      })

      // 다중 호출 방지
      this.bindEvent = null

      this.checkMaxCount()

      await flushPromises()

      this.bindEvent = 'click'
    },
    /**
     * 최대 구매수량 체크
     * @returns {void}
     */
    checkMaxCount () {
      if (this.product.productInfo.custPrchQtyLimitYn === 'Y') {
        const invoke = {
          cmdType: 11,
          custDurSpr: this.product.productInfo.custDurSpr,
          partNumber: this.product.productInfo.partNumber,
          itemCnt: this.totalCnt
        }

        const successHandling = data => {
          let rtnFlag = ''

          if (data.jsonData !== undefined) {
            rtnFlag = data.jsonData.rtn.flag
          }

          let msg

          let maxOrderPossQty = ''
          if (this.product.productInfo.maxOrderPossQty) { maxOrderPossQty = this.product.productInfo.maxOrderPossQty }

          if (rtnFlag === 'Y') {
            if (this.product.productInfo.custDurSpr === '1') {
              maxOrderPossQty = data.jsonData.rtn.DAY_P_QTY
            } else if (this.product.productInfo.custDurSpr === '2') {
              maxOrderPossQty = data.jsonData.rtn.MONTH_P_QTY
            } else if (this.product.productInfo.custDurSpr === '3') {
              maxOrderPossQty = data.jsonData.rtn.DATE_P_QTY
            }
          }

          if (this.product.productInfo.custPrchQtyLimitYn === 'Y' && this.product.productInfo.custDurSpr === '1' && this.totalCnt > maxOrderPossQty) {
            msg = `금일 최대 구매 가능 수량을<br> 초과 하셨습니다.<br>${maxOrderPossQty}개 구매 가능합니다.`
          } else if (this.product.productInfo.custPrchQtyLimitYn === 'Y' && this.product.productInfo.custDurSpr === '2' && this.totalCnt > maxOrderPossQty) {
            msg = `당월 최대 구매 가능 수량을<br> 초과 하셨습니다.<br>${maxOrderPossQty}개 구매 가능합니다.`
          } else if (this.product.productInfo.custPrchQtyLimitYn === 'Y' && this.product.productInfo.custDurSpr === '3' && this.totalCnt > maxOrderPossQty) {
            msg = `기간내 최대 구매 가능 수량을<br> 초과 하셨습니다.<br>${this.product.productInfo.endYmd.substring(0, 4)}년${this.product.productInfo.endYmd.substring(4, 6)}월${this.product.productInfo.endYmd.substring(6, 8)}일까지<br> ${maxOrderPossQty}개 구매 가능합니다.`
          } else if (this.product.productInfo.custPrchQtyLimitYn === 'N' && this.product.productInfo.custDurSpr === '' && this.totalCnt > this.nMaxCount) {
            msg = `1회 구매 가능 수량을 초과 하셨습니다.<br>(최대${this.nMaxCount}개)`
          }
          if (msg) {
            toastUtil.show(msg)
            return
          }

          this.executeOrder()
        }

        rightOrderOptionService.checkMaxCount(invoke, successHandling)
      } else {
        this.executeOrder()
      }
    },
    /**
     * 주문
     */
    executeOrder () {
      if (this.isGiftExist) {
        if (!this.checkIsGiftSelected()) {
          return
        }
      }

      if (this.isGiftishowProduct) {
        this.isOnlyUser = true
      } else {
        this.isOnlyUser = false
      }

      const data = this.product.productData
      this.setProdCategory(data)// 상품 카테고리 정리
      const invoke = this.setInvokeParameters()
      const _isOsApp = isOsApp()
      if (_isOsApp) { // App
        invoke.vdn_cd = '54101'
      } else { // Web
        invoke.vdn_cd = '54102'
      }
      invoke.directOrderYN = 'Y' // 바로주문 클릭하여 주문 넘어갈 경우 세팅
      this.checkLoginStatus('AjaxNSOrderPayNow4Worklight', invoke, this.isOnlyUser)
    },
    /**
     * 바로주문
     * @param {String} tranId api명
     * @param {Object} params 파라미터
     * @param {Boolean} isOnlyUser 회원전용여부
     */
    checkLoginStatus (tranId, params, isOnlyUser) {
      if (!this.globalVal.getProductInfoFlag) {
        this.layerClose()
      }

      const coupons = this.getCouponParams()
      const objNextParam = {}

      const isLogon = loginUtil.checkLogonStatus()
      if (!isLogon) {
        const custPrchQtyLimitYn = this.product.productInfo?.custPrchQtyLimitYn
        if ((this.isLoginRequiredProduct && isOnlyUser) || custPrchQtyLimitYn === 'Y') {
          const productName = this.product.productInfo.productName
          const msg = `${htmlDecode(productName)}은 회원만 구매하실 수 있는 상품입니다.<br />로그인 후, 구매를 진행해 주세요.`
          messageUtil.alert(msg, () => {
            bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, null, false, { invoke: params, isOnlyUser, coupons })
          })
        } else {
          bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.ORDER, null, false, { invoke: params, isOnlyUser, coupons })
        }
        return
      }

      const successHandling = response => {
        const orderId = response.orderId

        if (!orderId) {
          messageUtil.alert(`${MESSAGES.UNEXPECTED_ERROR}`)
        } else {
          objNextParam.orderId = orderId

          if (coupons) {
            this.execCouponAutoSave(coupons)
          }

          // 바로주문 클릭으로 진행 하는 경우
          if (response.directOrderYN) {
            objNextParam.invoke = {}
            objNextParam.invoke.directOrderYN = response.directOrderYN[0]
            objNextParam.invoke.preParam = params
            objNextParam.productCategoryName = this.productCategoryName // 바로주문시 카테고리네임 추가
            objNextParam.custDurSpr = this.product.productInfo.custDurSpr
          }
          bizUtil.gotoOrdersheet(objNextParam)
          this.$store.commit('product/setSelectedGiftList', {})
          this.buyBtnEcommerceLogging()
        }
      }
      params.storeId = '13001'
      rightOrderOptionService.checkLoginStatus(tranId, params, successHandling)
    },
    /**
     * 상품 카테고리 정리
     * @param {Object} data 상품정보
     */
    setProdCategory (data) {
      for (let j = 0; j < data.msg.goods.length; j++) {
        const good = data.msg.goods[j]

        let strCateCdFull = '' // '@/'를 구분자로 하여 순서대로 나열된 카테고리 코드 문자열
        let strCateNmFull = '' // '@/'를 구분자로 하여 순서대로 나열된 카테고리 이름 문자열

        let cateCdEnd = ''
        let cateNmEnd = ''

        this.productCategoryName[`partNum_${good.info.catentryId}`] = {}
        this.productCategoryName[`partNum_${good.info.catentryId}`].success = true

        try {
          for (let i = 5; i >= 1; i--) {
            let cateCode = good.info.mparam[`cate${i}Code`]
            let cateName = good.info.mparam[`cate${i}Nm`]

            if (!strCateCdFull && !cateCode) {
              // 별도 동작 하지 않음
            } else {
              if (!strCateCdFull) {
                strCateCdFull = cateCode
                strCateNmFull = cateName

                cateCdEnd = cateCode
                cateNmEnd = cateName
              } else {
                if (!cateCode) {
                  cateCode = ''
                  cateName = ''
                }

                strCateCdFull = `${cateCode}@/${strCateCdFull}`
                strCateNmFull = `${cateName}@/${strCateNmFull}`
              }
            }
          }

          this.productCategoryName[`partNum_${good.info.catentryId}.cateCdFull`] = strCateCdFull
          this.productCategoryName[`partNum_${good.info.catentryId}.cateNmFull`] = strCateNmFull

          this.productCategoryName[`partNum_${good.info.catentryId}.cateCdEnd`] = cateCdEnd
          this.productCategoryName[`partNum_${good.info.catentryId}.cateNmEnd`] = cateNmEnd

          for (let k = 1; k <= 5; k++) {
            const cd = good.info.mparam[`cate${k}Code`]
            const nm = good.info.mparam[`cate${k}Nm`]
            this.productCategoryName[`partNum_${good.info.catentryId}.cate${k}Code`] = cd
            this.productCategoryName[`partNum_${good.info.catentryId}.cate${k}Nm`] = nm
          }
        } catch (e) {
          this.productCategoryName[`partNum_${good.info.catentryId}.success`] = false
        }
      }
    },
    /**
     * 장바구니 또는 바로주문에 넣을 파라미터 셋팅.
     * @returns {Object}
     */
    setInvokeParameters () {
      const cocd = COMM_CONST.getCocd()
      const invokeParams = {
        userId: loginUtil.userId(),
        orderId: '.',
        calculationUsage: '-1,-2,-5,-6,-7',
        inventoryValidation: 'false',
        cartType: this.product.productInfo.dispTypeCd,
        itemType: 'product'
      }

      this.busChnId = this.product.productInfo.busChnId // 매체타입

      const catalogId = (this.productCatalogId !== '') ? this.productCatalogId : COMM_CONST.getDefaultCatalogId()

      const catentryList = []
      let items = {}

      if (!this.isSingleOption) {
        for (const invoiceProduct of this.invoiceProducts) {
          items = {
            catentryId: invoiceProduct.catentryId,
            quantity: invoiceProduct.selectedOptionCount
          }

          catentryList.push(items)
        }
      } else {
        items = {
          catentryId: this.catentryId,
          quantity: this.selectedCount
        }

        catentryList.push(items)
      }

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

        if (!isNull(this.product.productInfo.mparam?.multiCd)) {
          invokeParams[String(`itemMultiCd_${cnt}`)] = this.product.productInfo.mparam?.multiCd
        }

        invokeParams[String(`itemBuschnId_${cnt}`)] = this.busChnId

        // 캠페인 ID - Push를 통해 들어온 데이터.
        const itemCampId = COMM_CONST.getCampaignId()
        if (!isNull(itemCampId)) {
          invokeParams[String(`itemCampId_${cnt}`)] = itemCampId
        }

        if (this.isTVProduct) {
          invokeParams[String(`itemPgmCd_${cnt}`)] = this.product.productInfo.tvList[0].pgmcd
          invokeParams[String(`itemBrdctDate_${cnt}`)] = this.product.productInfo.tvList[0].brdctDate
          invokeParams[String(`itemBrdctCnnlCd_${cnt}`)] = this.product.productInfo.tvList[0].cnnlNumCd
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
     * @param {Object} optionItem 옵션항목
     * @returns {Boolean}
     */
    checkSoldOut (optionItem) {
      const isSoldOut = (optionItem.fieldTxt === '0')
      if (isSoldOut) {
        const msg = PRODUCT_MESSAGE.SOLDOUT
        toastUtil.show(msg)
        return false
      } else {
        return true
      }
    },
    /**
     * 선택여부 체크
     * @param {String} productName 상품명
     * @returns {Boolean}
     */
    checkDuplicateSelection (productName) {
      let selOptionProductName = productName
      if (this.selectedOptionName.length > 0) {
        selOptionProductName = `${this.selectedOptionName.toString().replace(',', ' / ')} / ${productName}`
      }
      for (const item of this.invoiceProducts) {
        if (item.productName === selOptionProductName) {
          const msg = '이미 선택한 옵션입니다.'
          toastUtil.show(msg)
          return false
        }
      }
      return true
    },
    /**
     * 상품 유효성 체크
     * @param {Object} optionItem 옵션아이템
     * @param {String} productName 상품명
     * @returns {Boolean}
     */
    checkItemValidation (optionItem, productName) {
      return this.checkSoldOut(optionItem) && this.checkDuplicateSelection(productName)
    },
    /**
     * 상품명가져오기
     * @param {Array} optionList 옵션리스트
     * @param {Object} optionItem 옵션아이템
     * @returns {String}
     */
    getProductName (optionList, optionItem) {
      const styleMngYn = optionList.styleMngYn
      const unitRegiTypeCd = optionList.unitRegiTypeCd
      const isOptionTextType = styleMngYn === 'Y' && unitRegiTypeCd === 'OPT' // OPT:텍스트형,TYP:단품TyPE형
      const selValue = optionItem.id.split('_')

      if (isOptionTextType) {
        return optionItem.value.replace(/,/gi, '')
      } else {
        if (selValue.length > 4) {
          return `${selValue[selValue.length - 2]}_${selValue[selValue.length - 1]}`.replace(/,/gi, '')
        } else {
          return selValue[selValue.length - 1].replace(/,/gi, '')
        }
      }
    },
    /**
     * 옵션 초기화
     */
    initOptions () {
      this.enabledSelectboxIndex = 0
    },
    /**
     * 옵션 선택시 이벤트
     * @param {Object} optionItem 옵션아이템
     * @param {Number} selectedIndex 선택된인덱스
     * @param {Number} selectboxIndex 셀렉트박스인덱스
     */
    selectOptionIndex (optionItem, selectedIndex, selectboxIndex) {
      const successHandling = response => {
        const prodCnt = response.jsonData.rtnData
        const productPrice = response.jsonData.rtnPrice
        const catentryId = response.itemNumber
        const selectedOptionCount = 1
        const optionTotalPrice = productPrice * selectedOptionCount

        // case 1. 이전에 추가한 catentryId가 있는지 점검한다. 선택한 옵션이면 패스..
        if (prodCnt === 0) {
          messageUtil.alert(PRODUCT_MESSAGE.SOLDOUT)
          return
        }

        if (this.totalCnt >= 99) {
          const msg = '1회 최대 99개 주문가능'
          toastUtil.show(msg)
          return
        }

        const productName = this.selectedOptionName.toString().replace(',', ' / ')
        this.selectedOptionName = []

        this.invoiceProducts.unshift({
          catentryId,
          optionTotalPrice,
          optionTotalPriceTxt: getMoneyFormat('', optionTotalPrice),
          productName,
          productPrice,
          prodCnt,
          selectedOptionCount
        })
        this.selectedOptions.push(selectedIndex)
        this.selectedOptionItemList = []

        this.calculateTotal()
      }

      this.toggleOpenOption(selectboxIndex)

      const maxCount = Math.min(this.product.productInfo.productCnt, this.nMaxCount)
      if (this.totalCnt === maxCount) {
        toastUtil.show(`1인 구매 가능한 수량은 ${maxCount}개 입니다.`)
        return
      }

      const multiCd = this.product.productInfo.mparam?.multiCd || ''
      const busChnId = (!this.product.productInfo.mparam?.multiCd) ? 'INT' : 'SB'
      const cocd = COMM_CONST.getCocd()
      const partNumber = this.product.productInfo.partNumber
      const optionList = this.getItem(this.product.productInfo.optionList, this.product.productInfo.partNumber)
      const productName = this.getProductName(optionList, optionItem)
      const isTwoOrMoreOptions = (this.optionList.length > 1)
      const isLastOptionIndex = !(selectboxIndex < this.optionList.length - 1)

      if (!this.checkItemValidation(optionItem, productName)) {
        this.initOptions()
        this.selectedOptionItemList = []
        this.selectedOptionName = []
        return
      }

      this.selectedOptionName.push(optionItem.value.replace(/,/gi, ''))
      this.selectedOptionItemList.push(optionItem)

      if (isTwoOrMoreOptions) {
        if (isLastOptionIndex) {
          this.initOptions()
          this.changedOptionItemList = []
        } else {
          const nextId = this.optionList[selectboxIndex + 1].nameId
          this.computedOptionList =
            {
              inputOptionIndex: selectboxIndex,
              inputOptionList: this.getNextOption({ partNumber, nextId, optionItem, selectboxIndex })
            }
          this.enabledSelectboxIndex = selectboxIndex + 1
          return
        }
      }

      const catentryId = this.getCatentryId({ partNumber, optionList, optionItem })
      const params = {
        cmdType: 1,
        partNumber: this.product.productInfo.partNumber,
        itemNumber: catentryId,
        multiCd,
        offerIdfr: '',
        cpcAmt: this.product.productInfo.cpcAmt,
        arsAmt: this.product.productInfo.arsAmt,
        busChnId,
        coCd: cocd
      }

      if (this.product.productInfo.salePrice === this.product.productInfo.staffSalePrice) { // 임직원할인가
        params.staffSaleRate = this.product.productInfo.staffBnft.couponBnftRate
      }

      rightOrderOptionService.selectOptionIndex(params, successHandling)
    },
    /**
     * 다음 옵션리스트 불러옴
     *
     * @param {Object} option 옵션
     * @param {String} option.partNumber 파트넘버
     * @param {String} option.nextId 다음옵션 아이디
     * @param {Object} option.optionItem 옵션아이템
     * @param {Number} option.selectboxIndex 셀렉트박스인덱스
     * @returns {Array}
     */
    getNextOption ({ partNumber, nextId, optionItem, selectboxIndex }) {
      const attributeList = []

      const itemlist = this.getItem(this.product.productInfo.optionList, partNumber)

      for (const sku of itemlist.SKUs) {
        let nextValueId = null
        let nextValue = null
        let nextOverPrice = 0
        let nextFieldTxt = '0'
        let equalCount = 0

        for (let k = 0; k < sku.attributes.length; k++) {
          const attribute = sku.attributes[k]

          const valueId = attribute.values[0].uniqueID
          const value = attribute.values[0].value
          const fieldTxt = attribute.values[0].field
          const overPrice = sku.calPrmo
          const nameId = attribute.uniqueID
          let selCount = 0

          const selVal = optionItem.id.split('_')

          if (selVal.length > 1) {
            selCount++

            if (selVal[1] === nameId && selVal[2] === valueId) {
              equalCount++
            } else {
              if (nextId === nameId) {
                nextValueId = valueId
                nextValue = value
                nextOverPrice = overPrice
                nextFieldTxt = fieldTxt
              }
            }
          }

          const id = `${selectboxIndex + 2}_${nextId}_${nextValueId}_${nextValue}`

          if (selCount === equalCount) {
            if (nextValueId) {
              attributeList.push({
                id,
                nameId: nextId,
                valueId: nextValueId,
                value: nextValue,
                overPrice: nextOverPrice,
                fieldTxt: nextFieldTxt
              })
            }
          }
        }
      }

      return attributeList
    },
    /**
     * 옵션삭제
     * @param {Array} invoiceProduct 삭제할옵션
     */
    deleteRow (invoiceProduct) {
      const idx = this.invoiceProducts.indexOf(invoiceProduct)
      if (idx > -1) {
        this.invoiceProducts.splice(idx, 1)
        this.optionList[0].optionList.filter(item => {
          if (invoiceProduct.productName === item.value) {
            const index = this.selectedOptions.indexOf(this.optionList[0].optionList.indexOf(item))
            this.selectedOptions.splice(index, 1)
          }
        })
      }
      this.calculateTotal()
    },
    /**
     * 옵션별 주문 금액 계산
     * @param {Object} invoiceProduct 해당옵션
     */
    calculateLineTotal (invoiceProduct) {
      const total = invoiceProduct.productPrice * invoiceProduct.selectedOptionCount
      if (!isNaN(total)) {
        invoiceProduct.optionTotalPrice = total
        invoiceProduct.optionTotalPriceTxt = getMoneyFormat('', total)
      }
      this.calculateTotal()
    },
    /**
     * 총 주문 금액 계산
     *
     */
    calculateTotal () {
      const totalPrice = this.invoiceProducts.reduce(function (sum, product) {
        if (!isNaN(product.optionTotalPrice)) {
          const lineTotalPrice = product.optionTotalPrice
          return sum + lineTotalPrice
        }
      }, 0)

      this.totalPrice = totalPrice

      const totalCnt = this.invoiceProducts.reduce(function (sum, product) {
        if (!isNaN(product.selectedOptionCount)) {
          const lineTotalCnt = product.selectedOptionCount
          return sum + lineTotalCnt
        }
      }, 0)

      this.totalCnt = totalCnt
    },
    /**
     * catentryId 가져오기
     * @param {Object} option 옵션
     * @param {String} option.partNumber 상품번호
     * @param {Array} option.optionList 옵션리스트
     * @param {Object} option.optionItem 옵션아이템
     * @returns {String}
     */
    getCatentryId ({ partNumber, optionList, optionItem }) {
      const selValue = optionItem.id.split('_')
      if (optionList.unitRegiTypeCd === 'OPT') {
        return selValue[1]
      } else {
        const itemlist = this.getItem(this.product.productInfo.optionList, partNumber)
        const catentryId = ''
        for (const sku of itemlist.SKUs) {
          let _catentryId
          let equalCount = 0

          for (const attribute of sku.attributes) {
            const valueId = attribute.values[0].uniqueID
            const nameId = attribute.uniqueID
            _catentryId = attribute.catentryId
            let selCount = 0

            for (const selectedItem of this.selectedOptionItemList) {
              const selVal = selectedItem.id.split('_')

              if (selVal.length > 1) {
                selCount++

                if (selVal[1] === nameId && selVal[2] === valueId) {
                  equalCount++
                }
              }
            }

            if (selCount === equalCount) {
              return _catentryId
            }
          }
        }

        return catentryId
      }
    },
    /**
     * 최대 구매 가능 수량 설정
     *
     * @param {object} product (필수) 상품 데이터
     * @return {Number}
     */
    setMax (product) {
      // 현재 옵션을 제외한 전체 옵션 수량 합계
      const totalQuantity = this.invoiceProducts.reduce((acc, curr) => acc + Number(curr.selectedOptionCount), 0) - product.selectedOptionCount

      // 1회당최대주문가능수량
      const maxItemCountOnOnce = this.product.productInfo.maxItemCountOnOnce - totalQuantity

      // 최대구매수량 제한 상품
      const maxOrderQty = product.custPrchQtyLimitYn === 'Y' ? this.product.productInfo.maxOrderPossQty - totalQuantity : 99

      // 재고수량
      const inventoryQuantity = product.prodCnt

      return Math.min(inventoryQuantity, maxItemCountOnOnce, maxOrderQty)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/product/RightOrderOption";
</style>
