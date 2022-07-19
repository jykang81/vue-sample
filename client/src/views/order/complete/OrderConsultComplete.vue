<template>
  <div v-if="globalVal.userInfo" class="order_consult_complete">
    <div class="msg_box">
      <h2 class="subject">
        상담접수가 완료 되었습니다.
      </h2>
      <p class="msg lg">
        <!-- TODO: API 에서 주문번호(예약번호)가 내려오지 않음.
        (예약번호: 20200101010)
        -->
      </p>
    </div>
    <h3 class="subject">
      신청내역
    </h3>
    <div class="order_list">
      <ul class="product_info">
        <li>
          <div class="delivery_point">
            <div class="flex">
              <p class="name">
                {{ globalVal.userInfo.userName }}
              </p>
            </div>
            <div class="address">
              {{ globalVal.userInfo.fullAddress }}
            </div>
            <p class="phone">
              휴대폰: {{ globalVal.userInfo.phoneNo }}
            </p>
          </div>
        </li>
        <li>
          <div class="box">
            <figure>
              <ns-img
                :product-number="partNumber"
                :width="144"
                :height="144"
                :alt="productTitle"
              />
            </figure>
            <div class="field">
              <p class="title">
                {{ htmlDecode(productTitle) }}
              </p>
              <ns-price
                :dc-price="price"
                :mm-rntal-prc="price"
                :buschn-id="busChnId"
                :disp-type-cd="dispTypeCd"
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="btn_group">
      <button type="button" class="btn gray_border" @click="onclickOrdersList">
        <span>주문내역 조회</span>
      </button>
      <button type="button" class="btn coral" @click="onclickContinueShopping">
        <span>쇼핑 계속하기</span>
      </button>
    </div>
  </div>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import {
  htmlDecode,
  isNull
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'

export default {
  name: 'OrderConsultComplete',
  components: {
    NsImg,
    NsPrice
  },
  data () {
    return {
      globalVal: {
        mInputParams: null,
        userInfo: null
      },
      partNumber: '',
      productTitle: '',
      price: 0,
      quantity: 0,
      dispTypeCd: '',
      busChnId: ''
    }
  },
  created () {
    if (isNull(this.$route.params) || isNull(this.$route.params.mInputParams) || isNull(this.$route.params.userInfo)) {
      bizUtil.gotoMain()
      return false
    }

    this.globalVal.mInputParams = this.$route.params.mInputParams
    this.globalVal.userInfo = this.$route.params.userInfo

    this.init()
  },
  methods: {
    htmlDecode,
    /**
     * 초기화 (ASIS: setDefaultProductInfo)
     * @returns {void}
     */
    init () {
      let brandName = this.globalVal.mInputParams.brandName
      const productName = this.globalVal.mInputParams.productName
      const productNo = this.globalVal.mInputParams.productNo

      this.partNumber = this.globalVal.mInputParams.partNumber
      this.price = this.globalVal.mInputParams.offerPrice * this.globalVal.mInputParams.quantity
      this.quantity = this.globalVal.mInputParams.quantity
      this.dispTypeCd = this.globalVal.mInputParams.dispTypeCd
      this.busChnId = this.globalVal.mInputParams.busChnId

      if (!isNull(brandName)) {
        brandName = `[${brandName}]`
      }
      this.productTitle = `${brandName}${productName}(상품번호: ${productNo})`
    },
    /**
     * 계속 쇼핑하기 버튼 클릭.
     * @returns {void}
     */
    onclickContinueShopping () {
      bizUtil.gotoMain()
    },

    /**
     * 주문내역조회 버튼 클릭.
     * @returns {void}
     */
    onclickOrdersList () {
      this.$router.push({ name: 'mypageOrderList', params: { backflag: 'home' } })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/complete/OrderConsultComplete";
</style>
