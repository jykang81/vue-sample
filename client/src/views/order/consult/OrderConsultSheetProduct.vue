<template>
  <div class="order_consult_sheet_product">
    <!-- 신청상품 -->
    <h3 class="subject">
      신청상품
    </h3>
    <ul class="product_info">
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
</template>

<script>
import {
  htmlDecode,
  isNull
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'

export default {
  name: 'OrderConsultSheetProduct',
  components: {
    NsImg,
    NsPrice
  },
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      partNumber: '',
      productTitle: '',
      price: 0,
      quantity: 0,
      dispTypeCd: '',
      busChnId: ''
    }
  },
  created () {
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
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/consult/OrderConsultSheetProduct";
</style>
