<template>
  <div class="ns_pay_register">
    <ul class="nspay_type">
      <li class="card">
        <button
          type="button"
          @click="onClickRegisterCard()"
        >
          신용/체크카드
        </button>
      </li>
      <li class="account">
        <button
          type="button"
          @click="onClickRegisterAccount()"
        >
          계좌이체
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import nspayMixin from '@/mixins/customer/nspayMixin'
import {
  viewType
} from '@utils/commonutil/commonUtil'

export default {
  mixins: [
    nspayMixin
  ],
  methods: {
    /**
     * 신용/체크카드 등록 버튼 클릭
     * @returns {void}
     */
    onClickRegisterCard () {
      window.vm = this // window.open 의 새창에서 call 하기 위함
      window.vm.callbackName = 'callbackNspayRegister'
      const paramPopup = {
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        orderNspayParams: {
          payMethod: '01',
          userId: loginUtil.userId()
        }
      }
      popupUtil.show('order/OrderNspayCert.vue', paramPopup, null)
    },

    /**
     * 계좌이체 등록 버튼 클릭
     * @returns {void}
     */
    onClickRegisterAccount () {
      window.vm = this // window.open 의 새창에서 call 하기 위함
      window.vm.callbackName = 'callbackNspayRegister'
      const paramPopup = {
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        orderNspayParams: {
          payMethod: '16',
          userId: loginUtil.userId()
        }
      }
      popupUtil.show('order/OrderNspayCert.vue', paramPopup, null)
    },

    /**
     * 등록 완료 후 실행할 callback 함수
     * @returns {void}
     */
    callbackNspayRegister () {
      if (viewType() === 'ios') {
        this.$router.go(-2)
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/nspay/NSPayRegister";
</style>
