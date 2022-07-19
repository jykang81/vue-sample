<template>
  <div class="order_sheet_rma_check">
    <div class="contents">
      <p class="title">
        도서산간 지역 배송 안내
      </p>
      <p class="guide">
        총 {{ addCartItems.length }}개의 상품이 도서산간 지역으로<br> 배송되지 않습니다.
      </p>
      <div>
        <ul class="product_list">
          <div
            v-for="(item, itemIdx) in addCartItems"
            :key="itemIdx"
          >
            <div v-if="item.rmaYNCheck === 'N' && (item.RMA_DLVR_YN === 'N' || item.RMA_DLVR_YN === 'J')">
              <li v-if="item.STYLE_MNG_YN === 'Y' && item.ATTRIBUTES.length > 0">
                {{ item.PRODUCT_NAME }} {{ item.ATTRIBUTES[0].NAME }}
              </li>
              <li v-else>
                {{ item.PRODUCT_NAME }}
              </li>
            </div>
          </div>
        </ul>
      </div>
    </div>
    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="changeDelivery()"
      >
        배송지 변경
      </button>
      <button
        type="button"
        class="btn coral"
        @click="addToCart()"
      >
        장바구니
      </button>
    </div>
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import addCartMixin from '@/mixins/order/cart/addCartMixin'
import uiUtil from '@utils/uiUtil'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'

export default {
  mixins: [
    addCartMixin
  ],
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {},
      addCartItems: []
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.addCartItems = this.param.items
    this.callbackAddCartItems = data => {
      popupUtil.closeAll('/order/cart')
    }
  },
  mounted () {
    uiUtil.disableScroll()
  },
  methods: {
    /**
     * 배송지 변경
     * @param {Object} data
     */
    async changeDelivery () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      this.globalVal.deliveryInfo.isPopOpenYn = 'N'
      this.$store.commit('popup/hideWithoutBack', {})
    },
    /**
     * 장바구니
     */
    async addToCart () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      if (this.globalVal.directOrderYN === 'Y') {
        this.addCart()
      } else {
        popupUtil.closeAll()
        this.$router.replace({ name: 'cartList' })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetRmaCheck";
</style>
