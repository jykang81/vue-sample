<template>
  <div class="price_product">
    <!-- 상담접수상품 -->
    <span
      v-if="priceInfo.altText.show"
      class="price_counsel"
    >
      {{ priceInfo.altText.value }}
    </span>
    <!-- 월 0,000원~ 0% 0,000원 -->
    <strong v-if="priceInfo.dcPrice.show" class="price_current">
      <span v-if="priceInfo.title.show" class="price_month">{{ priceInfo.title.value }}</span>{{ priceInfo.dcPrice.value }}<span class="price_unit">{{ priceInfo.won.value }}{{ priceInfo.prcWaveDisp.value }}</span>
    </strong>
    <span v-if="priceInfo.dcRate.show" class="price_sale">{{ priceInfo.dcRate.value }}</span>
    <del v-if="priceInfo.price.show" class="price_base">{{ priceInfo.price.value }}</del>
    <!-- 상품상세 할인내역 -->
    <slot />
  </div>
</template>

<script>
import {
  getProductPrice
} from '@utils/productutil/productUtil'

export default {
  name: 'NsPrice',
  props: {
    dcPrice: {
      type: [String, Number],
      required: true,
      default: () => ''
    },
    dcRate: {
      type: [String, Number],
      required: false,
      default: () => ''
    },
    price: {
      type: [String, Number],
      required: false,
      default: () => ''
    },
    mmRntalPrc: {
      type: [String, Number],
      required: false,
      default: () => ''
    },
    prcWaveDisp: {
      type: String,
      required: false,
      default: () => ''
    },
    buschnId: {
      type: String,
      required: false,
      default: () => ''
    },
    dispTypeCd: {
      type: [String, Number],
      required: false,
      default: () => ''
    },
    soldOut: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  computed: {
    priceInfo () {
      const result = getProductPrice(this.buschnId, this.dispTypeCd, this.mmRntalPrc, this.dcPrice, this.prcWaveDisp, this.dcRate, this.price, this.soldOut)
      return result
    }
  }
}
</script>
