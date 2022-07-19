<template>
  <div class="order_sheet_payment_amt">
    <!-- 결제금액 -->
    <h3 class="subject">
      결제금액
    </h3>
    <div class="total_price">
      <dl>
        <dt>총 상품금액</dt>
        <dd><strong>{{ totalProductAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 할인금액</dt>
        <dd><strong>{{ totalSaleAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 배송비</dt>
        <dd><strong>{{ totalShipAmt }}</strong>원</dd>
      </dl>
      <dl class="total">
        <dt>최종 결제금액</dt>
        <dd><strong>{{ grandTotalAmt }}</strong>원</dd>
      </dl>
      <p class="agree_guide">
        주문하실 상품, 가격, 배송정보, 할인 내역 등을<br> 최종 확인하였으며, 구매에 동의 하시겠습니까?
      </p>
    </div>

    <!-- 툴팁 컨테이너 -->
    <container-tooltip
      :show="isShowTooltipRefund"
      @close="isShowTooltipRefund = false"
    >
      <template #content>
        <p class="msg">
          도서산간 배송지로 추가 배송비가 부과 됩니다.
        </p>
      </template>
    </container-tooltip>
  </div>
</template>

<script>
import {
  insertCommas
} from '@utils/commonutil/commonUtil'
import ContainerTooltip from '@components/frameworks/ContainerTooltip'

export default {
  components: {
    ContainerTooltip
  },
  props: {
    paymentData: {
      type: Object,
      required: true
    },
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isShowTooltipRefund: false // 선환불 툴팁 노출 여부
    }
  },
  computed: {
    /**
     * 총 상품금액
     * @returns {String}
     */
    totalProductAmt () {
      return insertCommas(this.globalVal.paymentAmtInfo.totalProductAmt)
    },

    /**
     * 총할인금액
     * @returns {String}
     */
    totalSaleAmt () {
      const total = this.globalVal.paymentAmtInfo.totalSaleAmt || 0
      return (total > 0 ? '-' : '') + insertCommas(total)
    },

    /**
     * 배송비
     * @returns {String}
     */
    totalShipAmt () {
      return insertCommas(this.globalVal.deliveryInfo.sumShipCharge)
    },

    /**
     * 추가 배송비
     * @returns {String}
     */
    addShipAmt () {
      return insertCommas(this.globalVal.deliveryInfo.rmaShipCharge)
    },
    /**
     * show 추가 배송비
     * @returns {String}
     */
    showAddShipAmt () {
      return this.globalVal.deliveryInfo.rmaShipCharge > 0
    },

    /**
     * 최종 결제 금액
     * @returns {String}
     */
    grandTotalAmt () {
      return insertCommas(this.globalVal.paymentAmtInfo.grandTotalAmt)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetPaymentAmt";
</style>
