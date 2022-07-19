<template>
  <div class="login_none_member">
    <!-- 주문번호 Area -->
    <ns-input
      :params="orderNumParams"
      @input="orderNumInput"
      @blur="orderNumBlur($event)"
    />
    <!-- 비밀번호 체크: default -->
    <ns-password
      :params="passwordParams"
      @input="loginValidation"
      @blur="passwordBlur($event)"
    />
    <button
      type="button"
      class="btn_inquiry"
      @click="selectOrder($event)"
    >
      <span>비회원 주문조회</span>
    </button>
    <ul class="msg_bullet_list">
      <li>비회원 주문조회는 주문번호와 주문 시 설정한 비밀번호를 통해 확인할 수 있습니다.</li>
      <li>주문번호는 주문 완료 시 이메일 또는 안내 문자로 자동 발송됩니다.</li>
      <li>
        주문번호가 기억나지 않으시면
        <a href="tel:1800-0770">
          고객센터(1800-0770(유료))
        </a>
        로 문의하시기 바랍니다.
      </li>
    </ul>
  </div>
</template>

<script>
import LOGIN_CONST from '@constants/customer/login'
import MEMBER_CONST from '@constants/customer/member'
import messageUtil from '@frameworks/messageUtil'

import {
  isNull
} from '@utils/commonutil/commonUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'

import NsInput from '@components/common/NsInput'
import NsPassword from '@components/customer/NsPassword'
import popupUtil from '@frameworks/popupUtil'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  components: {
    NsInput,
    NsPassword
  },
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      orderNumParams: {
        value: '',
        iconClass: 'id',
        title: MEMBER_CONST.MEMBER_TEXT.ORDERNUMTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.ORDERNUMPLACEHOLDER,
        maxlength: 15,
        type: 'number',
        isLabel: false,
        labelKind: 'label_order_number1',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.ORDERNUM01
      },
      passwordParams: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 20,
        title: MEMBER_CONST.MEMBER_TEXT.PASSTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.PASSPLACEHOLDER,
        isLabel: false,
        labelKind: 'label_password1',
        isSuccess: false,
        isError: false,
        default_msg: '',
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS04
      }
    }
  },
  methods: {
    /**
     * Login입력정보 체크함수
     *
     * @returns {Boolean}
     */
    loginValidation () {
      this.passwordParams.value = this.passwordParams.value.replace(/ /gi, '')
      const orderNumCheck = isNull(this.orderNumParams.value.trim())
      const passCheck = isNull(this.passwordParams.value.trim())

      if (orderNumCheck) {
        this.orderNumParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.ORDERNUM01
        this.orderNumParams.isError = true
        return false
      }

      if (passCheck) {
        this.passwordParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[903]
        this.passwordParams.isError = true
        return false
      }

      if (!orderNumCheck && !passCheck) {
        this.orderNumParams.isError = false
        this.passwordParams.isError = false
        return true
      }
    },
    /**
     * 주문번호 규칙 확인
     *
     * @param {string} value input 값
     * @param {Event} event 이벤트 객체
     */
    orderNumInput (value, event) {
      this.orderNumParams.value = this.orderNumParams.value.replace(/ /gi, '')
      this.orderNumParams.isError = false
      const orderNum = this.orderNumParams.value
      const pattern = /^([0-9]{1,})$/ // 정규식 패턴
      const numberCheck = pattern.test(orderNum)

      if (!numberCheck) {
        this.orderNumParams.value = orderNum.slice(0, -1)
        event.target.value = this.orderNumParams.value // chrome mobile 대응
      }
    },
    /**
     * 주문 번호 포커스아웃일때 체크
     */
    orderNumBlur () {
      const orderNum = this.orderNumParams.value

      if (isNull(orderNum)) {
        this.orderNumParams.isError = true
        this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.ORDERNUM01
      } else {
        this.orderNumParams.isError = false
      }
    },
    /**
     * 비밀 번호 포커스아웃일때 체크
     */
    passwordBlur () {
      const password = this.passwordParams.value

      if (isNull(password)) {
        this.passwordParams.isError = true
        this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS04
      } else {
        this.passwordParams.isError = false
      }
    },
    /**
     * 비회원 주문번호에 대한 API조회
     */
    selectOrder () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_로그인',
          eventAction: '비회원활동',
          eventLabel: '비회원주문조회',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })

      const ordersId = this.orderNumParams.value
      const orderPassword = this.passwordParams.value

      if (isNull(ordersId) && isNull(orderPassword)) {
        this.orderNumParams.isError = true
        this.passwordParams.isError = true
        this.orderNumParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.ORDERNUM01
        this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS04
        return false
      } else {
        if (isNull(orderPassword)) {
          this.passwordParams.isError = true
          this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS04
          return false
        }
        if (ordersId.length < 8) {
          this.orderNumParams.isError = true
          this.orderNumParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.ORDERNUM01
          return false
        }
      }

      const params = {
        orderNumber: ordersId,
        orderPassword
      }

      const successHandling = data => {
        const resultYn = data.msg.root.resultYn

        const orderParams = {
          ordersId,
          tabIndex: 'N',
          footerShow: true,
          bottomShow: true
        }

        if (resultYn === 'Y') {
          orderParams.guestResultYn = 'Y'
          orderParams.title = '주문상세내역'
          orderParams.isShowSearch = true
          orderParams.isShowCart = true
          orderParams.logonType = 'nomember'

          // const param = {
          //   name: 'mypageOrderList',
          //   params: orderParams
          // }
          // this.$router.push(param)
          popupUtil.show('order/detail/MypageOrderDetail', orderParams)
        } else if (resultYn === 'X') {
          this.passwordParams.isError = true
          this.passwordParams.errorMessage = MEMBER_CONST.WARNING_MESSAGES.NO_MEMBER_RESULT_ERROR01
        } else {
          this.passwordParams.isError = true
          this.passwordParams.errorMessage = MEMBER_CONST.WARNING_MESSAGES.NO_MEMBER_RESULT_ERROR02
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      this.$nsaxios.post('NSNonMemberOrderChk', params, successHandling, errorHandling)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/LoginNoneMember";
</style>
