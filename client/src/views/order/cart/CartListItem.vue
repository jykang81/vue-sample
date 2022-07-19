<template>
  <div v-if="productCount" class="cart_list_item">
    <div class="cart_list_header">
      <!-- <p v-if="cartType === 'GENERAL' && isTotalCountOver70" class="cart_guide">
        장바구니에는 <strong>최근에 담은 70개의 상품만 표시</strong>됩니다.
      </p> -->
      <p v-if="cartType === 'CARD'" class="gift_card">
        상품권
      </p>
      <div class="total_checkbox">
        <label>
          <input
            v-model="checkAll"
            type="checkbox"
            class="checkbox square"
          >
          <span class="check_label" :class="{ empty : !checkedProductCount }">{{ checkedProductCount }}개 선택</span>
        </label>
        <button
          type="button"
          class="btn"
          @click="deleteProductChecked"
        >
          <span>선택 삭제</span>
        </button>
      </div>
    </div>
    <div class="cart_list_content">
      <ul class="cart_list_product">
        <!-- 묶음배송별 그룹 -->
        <li v-for="(bundleGroup, groupIndex) in productListGroupByBundle" :key="groupIndex">
          <ul class="cart_product">
            <!-- 각 묶음배송별 상품 -->
            <li v-for="(product, productIndex) in bundleGroup" :key="productIndex">
              <div class="product_check">
                <input
                  v-model="checkEach"
                  :value="product.orderItemsId"
                  type="checkbox"
                  class="checkbox square"
                  :disabled="isLivePrdt(product) || isSoldout(product)"
                >
                <router-link
                  :to="{ name: 'productDetail', params: { number: product.partNumber, clksrc: '장바구니_담긴상품' }}"
                  event=""
                  @click.native.prevent="gotoProductDetail(product)"
                >
                  {{ getTitle(product) }}
                </router-link>
                <button type="button" @click="deleteProductEach(product)">
                  삭제
                </button>
              </div>
              <div class="product_info" :class="{ soldout : isSoldout(product) }">
                <router-link
                  :to="{ name: 'productDetail', params: { number: product.partNumber, clksrc: '장바구니_담긴상품' }}"
                  event=""
                  @click.native.prevent="gotoProductDetail(product)"
                >
                  <figure :class="{ onair : !isSoldout(product) && isLivePrdt(product) }">
                    <ns-img
                      :product-number="product.partNumber"
                      :width="224"
                      :height="224"
                      :alt="getTitle(product)"
                      :is-adult="product.adultItemFlag"
                    />
                  </figure>
                </router-link>
                <div class="field">
                  <ns-price
                    :dc-price="Number(product.salePrice) * Number(product.quantity)"
                    :buschn-id="product.buschnId"
                    :disp-type-cd="product.dispTypeCd"
                  />
                  <template v-if="product.goodsType === productConst.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD">
                    <p v-if="product.optionType === productConst.CARD_SEND_TYPE.EMAIL" class="title">
                      {{ product.email }}
                    </p>
                    <p v-if="product.optionType === productConst.CARD_SEND_TYPE.MMS" class="title">
                      {{ product.mobileNo1 }}-{{ product.mobileNo2 }}-{{ product.mobileNo3 }}
                    </p>
                    <p class="title">
                      {{ product.cardMessage }}
                    </p>
                  </template>
                  <template v-if="product.styleMngYn === 'Y'">
                    <p class="title">
                      {{ getOption(product.selectOpt) }}
                    </p>
                  </template>
                  <button
                    v-if="isPreRefund(product.rfndShapeCd)"
                    class="refund"
                    @click="isShowTooltipRefund = true"
                  >
                    선환불 <i />
                  </button>
                  <!-- 품절일때 노출 -->
                  <div v-if="isSoldout(product)" class="soldout_box">
                    <p class="soldout_text">
                      <i /> 품절
                    </p>
                  </div>
                  <div v-if="isLivePrdt(product)" class="button_onair">
                    <button
                      type="button"
                      class="btn"
                      @click="gotoShoppingAlarm(bundleGroup)"
                    >
                      <span>방송알림</span>
                    </button>
                  </div>
                </div>
              </div>
              <dl v-if="product.selectGift && product.selectGift.length" class="free_gift">
                <dt>사은품</dt>
                <dd v-for="(gift, giftIndex) in product.selectGift" :key="giftIndex">
                  {{ product.selectGift.length > 1 ? `${giftIndex + 1}. ` : '' }}{{ htmlDecode(gift.value || gift.name) }}
                </dd>
              </dl>
              <div v-if="!isSoldout(product) && !isLivePrdt(product)" class="count_buy">
                <quantity-input
                  :params="{
                    value: product.quantity,
                    max: setMax(product),
                    id: product.orderItemsId
                  }"
                  @change="$emit('update:quantity', $event, product)"
                />
                <button
                  type="button"
                  class="btn_buy"
                  @click="orderProductEach(product)"
                >
                  <span>바로구매</span>
                </button>
              </div>
            </li>
          </ul>
          <div
            v-if="!isFreeDelivery(bundleGroup) || isShowDeliverySaving(bundleGroup) || bundleGroup.length > 1"
            class="price_info"
          >
            <!-- 무료배송이 아닐때만 노출 -->
            <p v-if="bundleGroup.length > 1 || !isFreeDelivery(bundleGroup)">
              <strong>{{ getBundleSalePrice(bundleGroup) }}</strong>원
              <i class="plus" />
              배송비
              <strong>{{ getDeliveryPrice(bundleGroup) }}</strong>원
            </p>
            <!-- 무료배송이 아닐때만 노출 -->
            <p v-if="bundleGroup.length > 1 || !isFreeDelivery(bundleGroup)">
              <i class="equal" />
              결제예상
              <strong>{{ getTotalPrice(bundleGroup) }}</strong>원
            </p>
            <!-- 무료배송이 아닐때만 노출 -->
            <p v-if="!isFreeDelivery(bundleGroup)" class="delivery_free">
              ({{ getDeliveryPolicy(bundleGroup) }})
            </p>
            <!-- 배송비 절약 상품보기 조건을 만족할때 노출 -->
            <p v-if="isShowDeliverySaving(bundleGroup)" class="save_delivery_products">
              <router-link to="" @click.native="gotoDeliverySaving(bundleGroup)">
                배송비 절약 상품보기
              </router-link>
            </p>
            <p v-if="bundleGroup.length > 1" class="btn_bundle">
              <button
                type="button"
                class="btn"
                @click="orderProductBundle(bundleGroup)"
              >
                <span>묶음배송 구매하기</span>
              </button>
            </p>
          </div>
        </li>
      </ul>
      <div class="total_price">
        <dl>
          <dt>
            총 상품금액
          </dt>
          <dd :class="{ empty : checkedProductCount === 0}">
            <strong>{{ totalOrderPrice }}</strong>원
          </dd>
        </dl>
        <dl>
          <dt>
            총 할인금액
          </dt>
          <dd :class="{ empty : checkedProductCount === 0}">
            <strong>{{ offerPrice }}</strong>원
          </dd>
        </dl>
        <dl>
          <dt>
            총 배송비
          </dt>
          <dd :class="{ empty : checkedProductCount === 0}">
            <strong>{{ shippingPrice }}</strong>원
          </dd>
        </dl>
        <dl class="total">
          <dt>
            총 결제 예상 금액
          </dt>
          <dd :class="{ empty : checkedProductCount === 0}">
            <strong>{{ totalPriceBytype }}</strong>원
          </dd>
        </dl>
      </div>
    </div>

    <!-- 툴팁 컨테이너 -->
    <container-tooltip
      :show="isShowTooltipRefund"
      @close="isShowTooltipRefund = false"
    >
      <template #title>
        선환불
      </template>
      <template #content>
        <ul class="refund_guide">
          <li>반품 즉시 환불처리 가능 상품입니다.</li>
          <li>구매 시 개별 구매만 가능합니다.</li>
        </ul>
      </template>
    </container-tooltip>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import ContainerTooltip from '@components/frameworks/ContainerTooltip'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'

import QuantityInput from '@components/common/QuantityInput'
import LOGIN_CONST from '@constants/customer/login'
import { PRODUCT_CONST } from '@constants/product/product'
import messageUtil from '@frameworks/messageUtil'
import modalUtil from '@frameworks/modalUtil'
import bizUtil from '@utils/bizUtil'
import {
  getUUID,
  arrayGroupBy,
  htmlDecode,
  insertCommas,
  arraySum,
  getImageUrl,
  isNull,
  isOsApp
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import cartListItemService from '@services/order/cart/cartListItemService'
import COMM_CONST from '@constants/framework/constants'

export default {
  name: 'CartListItem',
  components: {
    ContainerTooltip,
    NsImg,
    NsPrice,
    QuantityInput
  },
  props: {
    cartType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      totalOrderPrice: '0', // 총 상품금액
      offerPrice: '0', // 할인예상금액
      shippingPrice: '0', // 총 배송비
      totalPriceBytype: '0', // 장바구니 상품타입별(일반/상품권) 총 결제 예상 금액
      isShowTooltipRefund: false, // 선환불 툴팁 노출 여부
      isShowSettingsPopup: false,
      registeredProductInfo: {} // 방송알리미 등록, 해지를 위한 정보
    }
  },
  computed: {
    ...mapState('cart', [
      'productListByType',
      'checkedItemIdsByType'
    ]),
    ...mapGetters('cart', [
      'isTotalCountOver70',
      'orderId'
    ]),
    /**
     * PRODUCT_CONST
     *
     */
    productConst () {
      return PRODUCT_CONST
    },
    /**
     * 상품타입별(일반/상품권) 전체 상품 목록
     *
     */
    productList () {
      return this.productListByType[this.cartType]
    },
    /**
     * 상품타입별(일반/상품권) 전체 상품 개수
     *
     */
    productCount () {
      return this.productList.length
    },
    /**
     * 상품타입별(일반/상품권) 체크된 상품 아이템ID 목록
     *
     */
    checkedItemIds () {
      return this.checkedItemIdsByType[this.cartType]
    },
    /**
     * 상품타입별(일반/상품권) 체크된 상품 목록
     *
     */
    checkedProductList () {
      return this.productList.filter(product => this.checkedItemIds.includes(product.orderItemsId))
    },

    /**
     * 상품타입별(일반/상품권) 체크된 상품 개수
     *
     */
    checkedProductCount () {
      return this.checkedItemIds.length
    },
    /**
     * 상품타입별(일반/상품권) 묶음배송별로 group by
     *
     */
    productListGroupByBundle () {
      const productList = this.productList.map(product => {
        // 배송그룹키가 없는 상품(품절)은 임의의 난수를 배송그룹키에 넣어 같은 묶음배송 상품으로 묶이지 않도록 함
        product.dlvyGrpKey = this.isLivePrdt(product) ? getUUID() : (product.dlvyGrpKey || getUUID())
        return product
      })

      return Object.values(arrayGroupBy(productList, 'dlvyGrpKey'))
    },
    /**
     * 상품타입별(일반/상품권) 품절상품, 방송상품을 제외한 모든 상품 아이템ID 목록 (체크박스 전체 선택 시 제외할 항목을 제외함)
     *
     */
    productListExceptSoldout () {
      return this.productList
        .filter(product => !this.isSoldout(product) && !this.isLivePrdt(product))
        .map(product => product.orderItemsId)
    },
    /**
     * 상품타입별(일반/상품권) 품절상품, 방송상품을 제외한 모든 상품 아이템ID 목록 개수
     *
     */
    productCountExceptSoldout () {
      return this.productListExceptSoldout.length
    },
    /**
     * 체크박스 전체 선택
     *
     */
    checkAll: {
      get () {
        // 총 결제 예상 금액 합계 재조정
        this.calcTotalpaymentPrice()

        return this.checkedProductCount === this.productCountExceptSoldout && this.checkedProductCount > 0
      },
      set (value) {
        // 체크상태면 모든 상품(품절상품, 방송상품 제외)의 orderItemsId를, 미체크상태면 빈 배열을 담음
        this.setCheckedItemIdsByType({
          cartType: this.cartType,
          value: value ? this.productListExceptSoldout : []
        })

        // 마케팅 스크립트 적용 부분
        // GA 360
        if (value) { // 전체 선택된 경우
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_장바구니',
              eventAction: '장바구니활동',
              eventLabel: '전체선택',
              params: {
                t1: null // $router.meta.depth를 사용하는 경우
              }
            }
          })
        }
      }
    },
    /**
     * 체크박스 개별 선택
     *
     */
    checkEach: {
      get () {
        return this.checkedItemIds
      },
      set (value) {
        // 마케팅 스크립트 적용 부분
        // GA 360
        if (this.checkedItemIds.length < value.length) {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_장바구니',
              eventAction: '장바구니활동',
              eventLabel: '개별선택',
              params: {
                t1: null // $router.meta.depth를 사용하는 경우
              }
            }
          })
        }

        this.setCheckedItemIdsByType({
          cartType: this.cartType,
          value
        })
      }
    }
  },
  created () {
    if (isOsApp()) { // APP
      this.isNative = true
    }
    // 최초 진입 시 전체 상품 체크된 상태로 표시 (품절상품 제외, 방송상품 제외)
    this.setCheckedItemIdsByType({
      cartType: this.cartType,
      value: this.productListExceptSoldout
    })
  },
  methods: {
    ...mapMutations('cart', ['setCheckedItemIdsByType', 'setTotalPaymentPrice']),
    htmlDecode,
    /**
     * bizUtil
     *
     */
    bizUtil () {
      return bizUtil
    },
    /**
     * 비회원 여부
     */
    isNonMember () {
      return !loginUtil.checkLogonStatus() || loginUtil.logonType() === COMM_CONST.LOGON_TYPE.NONMEMBER
    },
    /**
     * 품절 여부
     *
     * @param {object} product (필수) 상품 데이터
     */
    isSoldout (product) {
      return product.outYn === 'Y' || product.saleYn === 'N' || product.itemLiveYN === 'N'
    },
    /**
     * 무료 배송 여부
     *
     * @param {object} bundleGroup (필수) 묶음배송 그룹
     */
    isFreeDelivery (bundleGroup) {
      let isFree = false
      let isPaidButFree = false
      const tmpProduct = bundleGroup.filter(product => product.free_dlvr_spr_cd === PRODUCT_CONST.FREE_DLVR_SPR_CD.FREE)
      if (tmpProduct.length > 0) {
        isFree = true
      } else {
        const product = bundleGroup[0]
        const freeDlvrSprCd = product.free_dlvr_spr_cd
        isFree = freeDlvrSprCd === PRODUCT_CONST.FREE_DLVR_SPR_CD.FREE
        const isPaid = freeDlvrSprCd === PRODUCT_CONST.FREE_DLVR_SPR_CD.PAID

        if (isPaid) {
          // 묶음 상품 중 첫 번째 상품의 무료배송비 정책 금액
          const freeDlvrPossAmtStr = product.dlvyGrpKey.split(',').find(str =>
            str.includes('FREE_DLVR_POSS_AMT')
          )

          // 무료배송비 정책 있음
          if (freeDlvrPossAmtStr) {
            const freeDlvrPossAmt = freeDlvrPossAmtStr.split(':')[1]

            // 유료배송 상품이지만 묶음배송 그룹 상품 중 무료배송비 정책 금액보다 판매가(즉시할인가)가 크거나 같은 상품이 하나라도 있으면 무료배송으로 판단
            if (freeDlvrPossAmt && freeDlvrPossAmt !== '999999999999') {
              isPaidButFree = bundleGroup.some(bundle =>
                bundle.salePrice >= Number(freeDlvrPossAmt)
              )
            }
          // 무료배송비 정책 없음
          } else {
          // 유료배송 상품 && 무료배송비 정책 기준이 없음에도 불구하고 배송비가 0원 이면 무료배송으로 판단
            isPaidButFree = Number(product.deliveryPrice) === 0
          }
        }
      }

      return isFree || isPaidButFree
    },
    /**
     * 방송 상품 여부
     *
     * @param {object} product (필수) 상품 데이터
     */
    isLivePrdt (product) {
      return product.liveLimitYn === 'N'
    },
    /**
     * 상품명
     *
     * @param {object} product (필수) 상품 데이터
     */
    getTitle (product) {
      const brandName = product.brandName && product.brandName !== '미정의' ? `[${product.brandName}]` : ''
      return brandName + htmlDecode(product.goodsName)
    },
    /**
     * 판매가(즉시할인가)
     *
     * @param {object} product (필수) 상품 데이터
     */
    getSalePrice (product) {
      return insertCommas(Number(product.salePrice) * Number(product.quantity))
    },
    /**
     * 선환불 여부
     *
     * @param {string} rfndShapeCd (필수) 환불형태코드
     */
    isPreRefund (rfndShapeCd) {
      return rfndShapeCd === PRODUCT_CONST.RFND_SHAPE_CD.PRE
    },
    /**
     * 상품 상세 보기 링크
     *
     * @param {object} product (필수) 상품 데이터
     */
    gotoProductDetail (product) {
      // 마케팅 스크립트 적용 부분
      // 카테고리 전송
      let categoryName = ''
      if (!isNull(product.mparam)) {
        if (!isNull(product.mparam.cate1Nm)) {
          categoryName = htmlDecode(product.mparam.cate1Nm)
        }
        if (!isNull(product.mparam.cate2Nm)) {
          categoryName += htmlDecode(`/${product.mparam.cate2Nm}`)
        }
        if (!isNull(product.mparam.cate3Nm)) {
          categoryName += htmlDecode(`/${product.mparam.cate3Nm}`)
        }
        if (!isNull(product.mparam.cate4Nm)) {
          categoryName += htmlDecode(`/${product.mparam.cate4Nm}`)
        }
        if (!isNull(product.mparam.cate5Nm)) {
          categoryName += htmlDecode(`/${product.mparam.cate5Nm}`)
        }
      } else {
        categoryName = null
      }

      let chnId = ''
      const grpKey = product.dlvyGrpKey.split(',')
      if (grpKey === 'BUSCHN_ID:INT') {
        chnId = 'e상품'
      } else {
        chnId = 'eTV'
      }
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(product.partNumber),
              name: product.goodsName,
              brand: product.brandName,
              category: categoryName,
              dimension16: chnId
            }
          ],
          subparams: {
            t1: '장바구니',
            t2: '담긴상품',
            product_list: '장바구니_담긴상품'
          }
        }
      })
      bizUtil.gotoProductDetail(product.partNumber || product.goodsId, { multiCd: product.multiCd, clksrc: '장바구니_담긴상품' })
    },
    /**
     * 선택 삭제
     *
     */
    async deleteProductChecked () {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      if (!this.checkedProductCount) {
        messageUtil.alert('삭제할 상품을 선택해 주세요.')
        return
      }

      messageUtil.confirm('선택한 상품을 삭제하시겠습니까?', () => {
        const param = {
          orderId: this.orderId, // 주문번호
          orderItemId: this.checkedItemIds // 선택한 아이템ID
        }

        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_장바구니',
            eventAction: '장바구니활동',
            eventLabel: '선택삭제',
            params: {
              t1: null // $router.meta.depth를 사용하는 경우
            }
          }
        })

        // AIQUA
        const GA360ParamArr = this.checkedProductList.map(product => {
          const dlvyGrpKeyArr = product.dlvyGrpKey.split(',')
          const busChnId = dlvyGrpKeyArr.find(dlvyGrpKey => dlvyGrpKey.includes('BUSCHN_ID'))

          return {
            category_name: !isNull(product.mparam) ? htmlDecode(product.mparam.cate1Nm) : '',
            product_id: product.partNumber,
            product_name: product.goodsName,
            product_image_url: `https:${product.imageUrl}`,
            product_price: product.price,
            brandName: product.brandName,
            product_channel: busChnId ? busChnId.split(':')[1] : ''
          }
        })
        this.$emit('delete:product', param, GA360ParamArr)
        const productArray = []
        for (let i = 0; i < GA360ParamArr.length; i++) {
          // E-commerce
          let tvProduct = ''
          if (GA360ParamArr[i].product_channel === 'INT') {
            tvProduct = 'e상품'
          } else {
            tvProduct = 'eTV'
          }

          productArray.push({
            id: String(GA360ParamArr[i].product_id),
            name: GA360ParamArr[i].product_name,
            brand: GA360ParamArr[i].brandName,
            category: !isNull(GA360ParamArr[i].category_name) ? GA360ParamArr[i].category_name : '',
            dimension16: tvProduct
          })
        }
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_04,
            params: productArray,
            subparams: {
              t1: '장바구니',
              t2: '상품삭제'
            }
          }
        })
      })
    },
    /**
     * 상품 개별 삭제
     *
     * @param {object} product (필수) 상품 데이터
     */
    async deleteProductEach (product) {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      const param = {
        orderId: this.orderId, // 주문번호
        orderItemId: product.orderItemsId // 선택한 아이템 번호
      }

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_장바구니',
          eventAction: '장바구니활동',
          eventLabel: '개별삭제',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })

      // AIQUA
      const dlvyGrpKeyArr = product.dlvyGrpKey.split(',')
      const busChnId = dlvyGrpKeyArr.find(dlvyGrpKey => dlvyGrpKey.includes('BUSCHN_ID'))
      const aiquaParamArr = [{
        category_name: !isNull(product.mparam) ? htmlDecode(product.mparam.cate1Nm) : '',
        product_id: product.partNumber,
        product_name: product.goodsName,
        product_image_url: `https:${product.imageUrl}`,
        product_price: product.price,
        product_channel: busChnId ? busChnId.split(':')[1] : ''
      }]
      let type = ''
      let type2 = ''
      if (busChnId === 'BUSCHN_ID:INT') {
        type = 'e상품'
        type2 = null
      } else if (busChnId === 'BUSCHN_ID:CTCOM') {
        type = 'eTV'
        type2 = 'Shop+'
      } else if (busChnId === 'BUSCHN_ID:TV') {
        type = 'eTV'
        type2 = 'NSLIVE'
      }
      const gaParamArr = [{
        id: product.partNumber,
        name: product.goodsName,
        brand: product.brandName,
        category: isNull(product.cate1Nm) ? htmlDecode(product.cate1Nm) : '',
        dimension16: type,
        dimension20: type2
      }]
      this.$emit('delete:product', param, aiquaParamArr, gaParamArr)
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_04,
          params: gaParamArr,
          subparams: {
            t1: '장바구니',
            t2: '상품삭제'
          }
        }
      })
    },
    /**
     * 바로구매
     *
     * @param {object} product (필수) 상품 데이터
     */
    async orderProductEach (product) {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_장바구니',
          eventAction: '장바구니활동',
          eventLabel: '개별주문',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })
      if (product.custPrchQtyLimitYn === 'Y') {
        // 최대구매수량
        const param = {
          cmdType: 11,
          custDurSpr: product.custDurSpr,
          partNumber: product.partNumber,
          itemCnt: product.quantity
        }

        cartListItemService.orderProductEach(param, data => {
          const jsonData = data.jsonData
          if (!jsonData) {
            return
          }

          const rtn = jsonData.rtn
          let custDurSpr = 0
          if (data.custDurSpr === 1) {
            custDurSpr = rtn.DAY_P_QTY
          } else if (data.custDurSpr === 2) {
            custDurSpr = rtn.MONTH_P_QTY
          } else if (data.custDurSpr === 3) {
            custDurSpr = rtn.DATE_P_QTY
          } else {
            // else 케이스 없음
          }
          const maxOrderPossQty = rtn.flag === 'Y' ? custDurSpr : 0

          if (loginUtil.userId() === '') {
            messageUtil.alert('구매를 위해서 로그인이 필요합니다.', () => {
              bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.GLOBAL)
            })
            return
          }

          if (product.quantity > maxOrderPossQty) {
            if (product.custDurSpr === 1 || product.custDurSpr === 2) {
              messageUtil.alert(
                `${product.custDurSpr === 1 ? '금일' : '당월'} 최대 구매 가능 수량을
                초과 하셨습니다.
                ${maxOrderPossQty}개 구매 가능합니다.`
              )
              return
            } else if (product.custDurSpr === 3) {
              messageUtil.alert(
                `기간내 최대 구매 가능 수량을\n초과 하셨습니다.
                ${product.endYmd.substring(0, 4)}년${product.endYmd.substring(4, 6)}월${product.endYmd.substring(6, 8)}일까지
                ${maxOrderPossQty}개 구매 가능합니다.`
              )
              return
            } else {
              // else 케이스 없음
            }
          }

          // 주문서로 이동
          this.$emit('goto:ordersheet', [product.orderItemsId])
        })
      } else {
        // 주문서로 이동
        this.$emit('goto:ordersheet', [product.orderItemsId])
      }
    },
    /**
     * 묶음배송 주문하기
     *
     * @param {object} bundleGroup (필수) 묶음배송 그룹
     */
    async orderProductBundle (bundleGroup) {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      if (bundleGroup.reduce((acc, curr) => acc + Number(curr.quantity), 0) > 99) {
        messageUtil.alert('1회 최대 구매 가능 수량은 99개까지입니다.')
        return
      }

      // 주문서로 이동
      this.$emit('goto:ordersheet', bundleGroup.map(product => product.orderItemsId))
    },
    /**
     * 방송알림
     */
    async gotoShoppingAlarm (bundleGroup) {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      event.preventDefault()
      event.stopPropagation()

      const isLogon = loginUtil.checkLogonStatus()
      if (!isLogon) {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.ORDER)
        return
      }

      const registeredProductInfo = {
        partNumber: bundleGroup[0].partNumber, // '26196200', // bundleGroup[0].partNumber,
        catentryId: bundleGroup[0].partNumber, // '26196200', // bundleGroup[0].partNumber,
        productName: bundleGroup[0].goodsName,
        isCtcomProduct: false, // 샵플러스 상품 여부
        imageUrl: getImageUrl(bundleGroup[0].partNumber, 88, 88, bundleGroup[0].adultItemFlag)
      }
      const param = {
        globalVal: {
          productInfo: {
            ctcomTvList: [{
              pgmCd: '' // 티컴상품
            }]
          }
        },
        registeredProductInfo
      }
      modalUtil.show('product/ShoppingAlarmRegister', param, responseData => this.closeAlarmRegister(responseData))
    },
    /**
     * 방송알리미 등록창 닫기
     * @param {Boolean} 등록 성공 여부
     */
    closeAlarmRegister () {
      this.isShowSettingsPopup = false
    },
    /**
     * 묶음배송 판매가(즉시할인가)
     *
     * @param {object} bundleGroup (필수) 묶음배송 그룹
     */
    getBundleSalePrice (bundleGroup) {
      const bundleSalePrice = bundleGroup.reduce((acc, curr) => acc + Number(curr.salePrice) * Number(curr.quantity), 0)
      return insertCommas(bundleSalePrice)
    },
    /**
     * 배송비
     *
     * @param {object} bundleGroup (필수) 묶음배송 그룹
     */
    getDeliveryPrice (bundleGroup) {
      const deliveryPrice = arraySum(bundleGroup.map(product => Number(product.deliveryPrice)))
      return deliveryPrice > 0 ? `${insertCommas(deliveryPrice)}` : '0'
    },
    /**
     * 결제예상금액
     *
     * @param {object} bundleGroup (필수) 묶음배송 그룹
     */
    getTotalPrice (bundleGroup) {
      const bundleSalePrice = bundleGroup.reduce((acc, curr) => acc + Number(curr.salePrice) * Number(curr.quantity), 0)
      const deliveryPrice = arraySum(bundleGroup.map(product => Number(product.deliveryPrice)))
      return insertCommas(bundleSalePrice + deliveryPrice)
    },
    /**
     * 배송비 정책
     *
     * @param {object} bundleGroup (필수) 묶음배송 그룹
     */
    getDeliveryPolicy (bundleGroup) {
      const product = bundleGroup[bundleGroup.length - 1]
      let deliveryPolicy = ''

      if (product.free_dlvr_spr_cd === PRODUCT_CONST.FREE_DLVR_SPR_CD.PAY_ON_DELIVERY) {
        deliveryPolicy = '착불배송'
      } else if (!this.isFreeDelivery(bundleGroup)) { // 유료배송
        // 무료배송비 정책이 있으면 정책 안내 문구 노출, 없으면 유료배송 노출
        const freeDlvrPossAmtStr = product.dlvyGrpKey.split(',').find(str =>
          str.includes('FREE_DLVR_POSS_AMT')
        )
        const freeDlvrPossAmt = freeDlvrPossAmtStr ? freeDlvrPossAmtStr.split(':')[1] : ''

        if (freeDlvrPossAmt && freeDlvrPossAmt !== '999999999999') {
          deliveryPolicy = `${insertCommas(freeDlvrPossAmt)}원 이상 구매 시 무료배송`
        } else {
          deliveryPolicy = '유료배송'
        }
      } else {
        // 무료배송은 배송비 정책 노출하지 않음
      }

      return deliveryPolicy
    },
    /**
     * 배송비 절약 상품보기 노출 여부
     *
     * @param {object} bundleGroup (필수) 묶음배송 그룹
     */
    isShowDeliverySaving (bundleGroup) {
      const product = bundleGroup[0]

      // const isPayOnDelivery = product.free_dlvr_spr_cd === PRODUCT_CONST.FREE_DLVR_SPR_CD.PAY_ON_DELIVERY // 착불배송
      const isShipPlace = product.dlvr_expns_calc_type === PRODUCT_CONST.DLVR_COST_CALC_CD.SHIP_PLACE // 출고지 기준

      let bndlDlvrYn = '' // 묶음배송 여부
      let pckgYn = '' // 합배송 여부
      product.dlvyGrpKey.split(',').forEach(dlvyGrpStr => {
        if (dlvyGrpStr.includes('BNDLDLVR_YN')) {
          bndlDlvrYn = dlvyGrpStr.split(':')[1]
        }
        if (dlvyGrpStr.includes('PCKG_YN')) {
          pckgYn = dlvyGrpStr.split(':')[1]
        }
      })

      // 착불이거나 유료배송 && 출고지 기준 && 묶음배송 && 합배송이면 배송비 절약 상품보기 노출
      // return isPayOnDelivery || (product.freeDeliverYn !== 'Y' && isShipPlace && bndlDlvrYn === 'Y' && pckgYn === 'Y')
      return product.freeDeliverYn !== 'Y' && isShipPlace && bndlDlvrYn === 'Y' && pckgYn === 'Y'
    },
    /**
     * 배송비 절약 상품 보기
     */
    async gotoDeliverySaving (bundleGroup) {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_장바구니',
          eventAction: '장바구니활동',
          eventLabel: '배송비절약상품보기',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })

      const invok = {
        name: 'bundleList',
        params: {
          globalVal: {
            productInfo: {
              catentryId: bundleGroup[0].goodsId,
              brandName: bundleGroup[0].brandName,
              freeDeliverYn: bundleGroup[0].freeDeliverYn
            }
          },
          partNumber: bundleGroup[0].partNumber
        }
      }
      this.$router.push(invok)
    },
    /**
     * 총 결제 예상 금액 합계 재조정
     *
     */
    calcTotalpaymentPrice () {
      let totalOrderPrice = 0 // 총 상품금액
      let offerPrice = 0 // 할인예상금액
      let shippingPrice = 0 // 총 배송비
      let totalPaymentPrice = 0 // 총 결제 예상 금액

      // 체크된 상품만
      this.checkedProductList.forEach(product => {
        const quantity = Number(product.quantity)
        const price = Number(product.price)
        const priceXquantity = price * quantity

        // 총 상품금액, 할인예상금액, 총 배송비, 총 결제 예상 금액 계산
        totalOrderPrice += priceXquantity
        offerPrice += priceXquantity - (Number(product.salePrice) * quantity)
        shippingPrice += Number(product.deliveryPrice)
        totalPaymentPrice = totalOrderPrice - offerPrice + shippingPrice

        // 묶음배송 상품의 배송비 재계산
        const bundelCount = this.productList.filter(allProduct => product.dlvyGrpKey === allProduct.dlvyGrpKey).length
        if (bundelCount > 1 && bundelCount < Number(product.dlvyGrpKeyCnt)) {
          shippingPrice += Number(product.dlvRexPns)
          totalPaymentPrice += Number(product.dlvRexPns)
        }
      })

      // 마케팅 스크립트 적용 부분
      // 네이버 프리미엄 로그
      marketingUtil.naverLogger.send({
        type: marketingUtil.naverLogger.TRACE_TRANS,
        data: {
          strTranSoft: '3',
          strTranValue: '1' // String(totalPaymentPrice)
        }
      })

      this.totalOrderPrice = insertCommas(totalOrderPrice) // 총 상품금액
      this.offerPrice = (offerPrice > 0 ? '-' : '') + insertCommas(offerPrice) // 할인예상금액
      this.shippingPrice = insertCommas(shippingPrice) // 총 배송비
      this.totalPriceBytype = insertCommas(totalPaymentPrice) // 장바구니 상품타입별(일반/상품권) 총 결제 예상 금액

      // 총 결제 예상 금액 저장
      this.setTotalPaymentPrice({
        cartType: this.cartType,
        price: totalPaymentPrice
      })
    },
    /**
     * 최대 구매 가능 수량 설정
     *
     * @param {object} product (필수) 상품 데이터
     */
    setMax (product) {
      // 같은 상품번호 상품들만 필터링(구매 수량 제한은 묶음 상품이 아닌 상품번호 그룹으로 판단함)
      const productList = this.productList.filter(allProduct => allProduct.partNumber === product.partNumber)

      // 같은 상품번호 상품들 중 현재 상품을 제외한 수량 합계
      const totalQuantity = productList.reduce((acc, curr) => acc + Number(curr.quantity), 0) - product.quantity

      // 1회당최대주문가능수량
      const maxItemCountOnOnce = product.maxItemCountOnOnce - totalQuantity

      // 최대구매수량 제한 상품
      const maxOrderQty = product.custPrchQtyLimitYn === 'Y' ? product.maxOrderPossQty - totalQuantity : 99

      // 재고수량
      const inventoryQuantity = product.inventoryQuantity

      return Math.min(inventoryQuantity, maxItemCountOnOnce, maxOrderQty)
    },
    /**
     * 옵션 텍스트
     *
     * @param {array} options (필수) 옵션
     * @return {string} 단일, 멀티 옵션 텍스트
     */
    getOption (options) {
      return options.map(option => (
        htmlDecode(option.value) || htmlDecode(option.name)
      )).join(' | ')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/cart/CartListItem";
</style>
