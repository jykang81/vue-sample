import {
  isNull,
  isEmail,
  validatePassword
} from '@utils/commonutil/commonUtil'
import uiUtil from '@utils/uiUtil'
import MEMBER_CONST from '@constants/customer/member'

/**
 * ValidPaymentAuthMixin
 * onclick_btnPayment -> (ASIS) 인증 정보
 */
const validPaymentAuthMixin = {
  methods: {
    /**
     * 비회원 구매 유효성 검증
     * @returns {Boolean}
     */
    validPaymentAuth () {
      // 인증 정보
      const iptOrdererName = this.globalVal.orderDeliveryInfo.iptOrdererName
      const authCi = this.globalVal.orderDeliveryInfo.ci || ''
      const authDi = this.globalVal.orderDeliveryInfo.di || ''
      const data = this.globalVal.orderDeliveryInfo.deliveryInfo[0]
      const regPhone = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/
      const pattern = /^[~!@#$%^&*()_+|<>?:{}a-z0-9]/
      const AUTH_VNO = { IPIN: 'ipin' }

      // 비회원일 경우 본인인증 체크
      if (this.globalVal.isGuest) { // 비회원
        if (isNull(authCi) || isNull(authDi)) {
          this.globalVal.customerInfo.isErrorMessageAuth = true
          uiUtil.scrollMove('guestCertArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        } else {
          this.globalVal.customerInfo.isErrorMessageAuth = false
        }

        if (isNull(iptOrdererName)) {
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (isNull(data.iptOrdererHpNo1) &&
              isNull(data.iptOrdererHpNo2) &&
              isNull(data.iptOrdererHpNo3)) {
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (!regPhone.test(`${data.iptOrdererHpNo1}${data.iptOrdererHpNo2}${data.iptOrdererHpNo3}`)) {
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (isNull(data.iptOrdererEmail)) {
          this.$root.$emit('blurEmailEmit')
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (data.iptOrdererEmail.length > 0 && !isEmail(data.iptOrdererEmail)) {
          this.$root.$emit('blurEmailEmit')
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (isNull(data.iptOrdererPwd) || data.iptOrdererPwd.length === 0) {
          this.$root.$emit('blurPasswordEmit')
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (data.iptOrdererPwd !== data.iptOrdererPwdConfirm) {
          this.$root.$emit('blurPwConfirmEmit')
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (!pattern.test(data.iptOrdererPwd)) {
          this.$root.$emit('blurPwConfirmEmit')
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        const validPassword = validatePassword(data.iptOrdererPwd)
        if (validPassword.validStatus !== '00') {
          this.$root.$emit('blurPwConfirmEmit')
          uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        this.paymentData.OrderUserInfo.setItem({
          PASSWORD: data.iptOrdererPwd,
          PHONE1TYPE: MEMBER_CONST.LOGIN_TYPE.NORMAL,
          PHONE1: `${data.iptOrdererHpNo1}-${data.iptOrdererHpNo2}-${data.iptOrdererHpNo3}`,
          MOBILE_NO11: data.iptOrdererHpNo1,
          MOBILE_NO12: data.iptOrdererHpNo2,
          MOBILE_NO13: data.iptOrdererHpNo3,
          EMAIL1: data.iptOrdererEmail
        })
      } else if ((this.globalVal.mOutputDatas.msg.UserInfo.USER_TYPE === MEMBER_CONST.LOGIN_TYPE.SIMPLE ||
            this.globalVal.mOutputDatas.msg.UserInfo.USER_TYPE === MEMBER_CONST.LOGIN_TYPE.NORMAL) &&
            this.globalVal.mOutputDatas.msg.firstOrderYn === 'Y') { // 간편로그인회원 첫주문
        // 간편로그인 회원 첫주문인 경우 보인인증 확인
        if (this.globalVal.mOutputDatas.msg.UserInfo.USER_TYPE === MEMBER_CONST.LOGIN_TYPE.SIMPLE &&
              (isNull(authCi) || isNull(authDi))) {
          this.globalVal.customerInfo.isUserHpnoErrorShow = false // 올바른 휴대폰 번호로 수정해주세요.
          this.globalVal.customerInfo.isConfirmUserAuthInfoShow = true
          uiUtil.scrollMove('guestCertArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        } else {
          this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false
        }

        if (this.globalVal.mOutputDatas.msg.UserInfo.USER_TYPE === MEMBER_CONST.LOGIN_TYPE.SIMPLE &&
            this.PaymentData.OrderUserInfo.getItem().AUTH_VNO === AUTH_VNO.IPIN) {
          if (isNull(data.iptOrdererHpNo1) &&
              isNull(data.iptOrdererHpNo2) &&
              isNull(data.iptOrdererHpNo3)) {
            uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            this.globalVal.activeDoubleClick = false
            return false
          }

          if (!regPhone.test(`${data.iptOrdererHpNo1}${data.iptOrdererHpNo2}${data.iptOrdererHpNo3}`)) {
            uiUtil.scrollMove('guestBuyerArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            this.globalVal.activeDoubleClick = false
            return false
          }

          this.PaymentData.OrderUserInfo.setItem({
            PHONE1: `${data.iptOrdererHpNo1}-${data.iptOrdererHpNo2}-${data.iptOrdererHpNo3}`
          })
        }
      }
      return true
    }
  }
}
export default validPaymentAuthMixin
