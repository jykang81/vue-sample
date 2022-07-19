<template>
  <div>
    <ul
      id="ulPaymentMethodArea"
      class="tabs theme-h ui-base-tabs"
    >
      <li
        :class="{'active':('creditCard' === currentPayment)}"
        @click="setCurrentPayment('creditCard')"
      >
        <a
          id="tabCreditCard"
          href="javascript:;"
        >
          <span>신용카드</span>
        </a>
      </li>
      <li
        id="liPayco"
        class="payco"
        :class="{'active':('payco' === currentPayment)}"
        @click="setCurrentPayment('payco')"
      >
        <a
          id="tabPayco"
          href="javascript:;"
        >
          <span>페이코</span>
        </a>
      </li>
      <li
        :class="{'active':('naverPay' === currentPayment)}"
        @click="setCurrentPayment('naverPay')"
      >
        <a
          id="tabNaverpay"
          href="javascript:;"
        >
          <span>네이버페이</span>
        </a>
      </li>

      <li
        :class="{'active':('mobile' === currentPayment)}"
        @click="setCurrentPayment('mobile')"
      >
        <a
          id="tabMobile"
          href="javascript:;"
        >
          <span>휴대폰결제</span>
        </a>
      </li>
      <li
        :class="{'active':('deposit' === currentPayment)}"
        @click="setCurrentPayment('deposit')"
      >
        <a
          id="tabBankTransfer"
          href="javascript:;"
          name="tabBankTransfer_n"
        >
          <span>무통장 입금</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPayment: 'payco'
    }
  },
  methods: {
    /**
     * 결제 수단 설정
     *
     * @param {string} payment
     */
    setCurrentPayment (payment) {
      this.currentPayment = payment
    }
  }
}
</script>

<style lang="scss">
li {
  width: 10%;

  &.active a {
    color: red
  }
}

</style>
