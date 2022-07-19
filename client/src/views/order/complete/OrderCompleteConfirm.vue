<template>
  <div class="order_complete_confirm">
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
import loginUtil from '@utils/loginUtil'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  methods: {
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
      if (!loginUtil.isLoggedIn()) {
        this.$router.push({ name: 'nonMemberLogin' })
      } else {
        this.$router.push({ name: 'mypageOrderList', params: { backflag: 'home' } })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/complete/OrderCompleteConfirm";
</style>
