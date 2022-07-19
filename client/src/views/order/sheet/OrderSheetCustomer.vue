<template>
  <div class="order_sheet_customer">
    <!-- 구매자 정보 -->
    <h3 id="customer_subject" class="subject">
      구매자 정보
    </h3>
    <div class="input_field line">
      <label
        for="label_name"
        class="label_text"
      >
        이름
      </label>
      <span class="input_group">
        <input
          id="label_name"
          v-model="ordererInfo.name"
          type="text"
          class="form text"
          title="이름 입력"
          readonly
          disabled
        >
      </span>
    </div>
    <div class="input_field line">
      <label
        for="label_email"
        class="label_text"
      >
        이메일
      </label>
      <span class="input_group">
        <input
          id="label_email"
          v-model="ordererInfo.email"
          type="text"
          class="form text"
          title="이메일 입력"
          readonly
          disabled
        >
      </span>
    </div>
    <div class="input_field line">
      <label
        for="label_phone"
        class="label_text"
      >
        휴대폰
      </label>
      <span class="input_group">
        <input
          v-show="isUserPhoneNumShow"
          id="label_phone"
          v-model="ordererInfo.hpNo"
          type="text"
          class="form text"
          title="휴대폰 입력"
          readonly
          disabled
        >
        <input
          v-show="isUserAuthPhoneNumShow"
          id="label_phone"
          v-model="updateHpno"
          :type="updateHpnoType"
          class="form text"
          title="휴대폰 입력"
          maxlength="11"
          placeholder="휴대폰 번호를 입력해 주세요."
          @keydown="keydownNumber($event)"
          @keyup="onKeyUpOnlyNumber($event)"
          @blur="blurDashPhone($event)"
          @focus="focusDashPhone()"
        >
      </span>
      <p v-show="isUserAuthInfoShow || globalVal.customerInfo.isConfirmUserAuthInfoShow" :class="globalVal.customerInfo.isConfirmUserAuthInfoShow ? 'error_msg' :'default_msg'">
        주문/결제 시 최초 1회에 한하여 휴대폰 인증이 필요합니다.
      </p>
      <p v-show="globalVal.customerInfo.isUserHpnoErrorShow" class="error_msg">
        올바른 휴대폰 번호로 수정해주세요.
      </p>
      <p v-show="isUserHpnoUpdateShow" class="complete_msg">
        회원정보를 인증된 휴대폰 번호로 수정하였습니다.
      </p>
      <!-- 휴대폰 인증 -->
      <div
        v-show="isUserAuthBtnShow"
        class="btn_group"
      >
        <button
          type="button"
          class="btn coral_border"
          @click="sendVerificationCode"
        >
          <span>인증번호 전송</span>
        </button>
      </div>
      <!-- 인증번호 전송 -->
      <div v-show="isUserAuthNumBtnShow" class="input_field phone">
        <div class="btn_group">
          <button
            type="button"
            class="btn gray_border"
            @click="sendVerificationCode"
          >
            <span>인증번호 전송</span>
          </button>
        </div>
      </div>
      <!-- 인증하기 -->
      <phone-auth
        v-show="isUserAuthShow"
        ref="phoneAuth"
        :phone-number="updateHpno"
        :auth-type="authType"
        :user-name="ordererInfo.name"
        :cust-num="globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER"
        :email="paymentData.OrderUserInfo.getItem().EMAIL1"
        @sendVerificationCode="handleSendVerificationCode"
        @checkVerificationCode="handleCheckVerificationCode"
      />
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  insertSeparatorPhoneNumber,
  getPhoneNumber,
  timerObject,
  isNull
} from '@utils/commonutil/commonUtil'
import PhoneAuth from '@components/common/PhoneAuth'
import PHONE_AUTH_CONST from '@constants/customer/phoneAuth'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'

export default {
  components: {
    PhoneAuth
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
      ordererInfo: {
        name: '', // 구매자 이름
        email: '', // 구매자 이메일
        hpNo: '' // 구매자 휴대폰
      },
      isUserAuthInfoShow: false, // 주문/결제 시 최소 1회에 한하여 휴대폰 인증이 필요합니다.
      isUserAuthBtnShow: false, // 휴대폰인증 버튼
      isUserHpnoUpdateShow: false, // 회원정보를 인증된 휴대전화 번호로 수정하였습니다.
      isUserAuthNumBtnShow: false, // 인증번호 전송 버튼
      isUserPhoneNumShow: false, // 휴대폰번호
      isUserAuthPhoneNumShow: false, // 휴대폰번호 입력
      isUserAuthShow: false, // 인증하기 - 인증번호 입력, 재전송 버튼, 인증하기 버튼
      isCertNumerDisabled: false, // 인증번호
      certNumer: '', // 인증번호
      txtTimer: '', // 인증번호 입력 남은 시간
      isUserCertErrorShow: false, // 인증번호를 다시 한 번 확인 후, 입력해 주세요.
      isUserTimeErrorShow: false, // 인증번호 입력 시간이 초과하였습니다. 다시 시도해 주세요.
      isUserCertSendShow: true, // 입력하신 번호로 인증번호가 발송되었습니다.
      isCertBtnDisabled: false, // 인증하기 버튼
      updateHpno: '',
      authType: PHONE_AUTH_CONST.AUTH_TYPE.ORDER,
      hasSentCode: false, // 초기 전송여부 체크
      updateHpnoType: 'tel'
    }
  },
  mounted () {
    this.init()
    this.globalVal.completeOrderSheetCustomer = true
  },
  methods: {
    init () {
      // 주문하시는분 정보(기본값으로 회원정보를 표시함)
      this.setUpdateOrderer({
        ordererName: this.globalVal.mOutputDatas.msg.UserInfo.LASTNAME,
        ordererHpNo: this.globalVal.mOutputDatas.msg.UserInfo.PHONE1,
        ordererEmail: this.globalVal.mOutputDatas.msg.UserInfo.EMAIL1
      })
      // 주문하시는분 출력
      this.setOrdererInfo(this.globalVal.mOutputDatas.msg)
    },
    /**
     * 주문하시는분 정보 출력
     * @param {Object} data - 주문정보 object
     */
    setUpdateOrderer (data) {
      if (data == null) {
        return false
      }

      if ((undefined === data.ordererName || data.ordererName === '') &&
        (undefined !== this.ordererInfo && this.ordererInfo.name)) {
        data.ordererName = this.ordererInfo.name
      }

      if ((undefined === data.ordererHpNo || data.ordererHpNo === '') &&
        (undefined !== this.ordererInfo && this.ordererInfo.hpNo)) {
        data.ordererHpNo = this.ordererInfo.hpNo
      }

      if ((undefined === data.ordererEmail || data.ordererEmail === '') &&
        (undefined !== this.ordererInfo && this.ordererInfo.email)) {
        data.ordererEmail = this.ordererInfo.email
      }

      this.ordererInfo.name = data.ordererName === undefined ? '' : data.ordererName
      this.ordererInfo.hpNo = isNull(data.ordererHpNo) ? '' : `${getPhoneNumber(data.ordererHpNo, '1')}-${getPhoneNumber(data.ordererHpNo, '2')}-${getPhoneNumber(data.ordererHpNo, '3')}`
      this.ordererInfo.email = data.ordererEmail === undefined ? '' : data.ordererEmail

      this.globalVal.orderDeliveryInfo.iptOrdererName = this.ordererInfo.name
      this.globalVal.orderDeliveryInfo.receiptEmail = this.ordererInfo.email

      // 폼 데이터에 반영
      this.paymentData.OrderUserInfo.setItem({
        LASTNAME: data.ordererName,
        NICKNAME: data.ordererName,
        PHONE1TYPE: 'K',
        PHONE1: insertSeparatorPhoneNumber(data.ordererHpNo, '-'),
        MOBILE_NO11: getPhoneNumber(data.ordererHpNo, '1'),
        MOBILE_NO12: getPhoneNumber(data.ordererHpNo, '2'),
        MOBILE_NO13: getPhoneNumber(data.ordererHpNo, '3'),
        EMAIL1: data.ordererEmail
      })
    },
    /**
     * 주문하시는분/본인인증하기/비밀번호 정보 출력
     * 간편로그인 및 로그인 회원 첫주문인경우 본인인증하기 출력
     * @param {Object} data - 주문정보 object
     */
    setOrdererInfo (data) {
      this.globalVal.customerInfo.phNumber = insertSeparatorPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1, '')
      // 회원가입 점유인증 제거 - SMS 인증하지 않았을 경우 인증 정보 노출
      this.globalVal.customerInfo.mHpNoSmsAuthYn = data.hpNoSmsAuthYn

      // 간편로그인 회원 첫주문
      if ((data.UserInfo.USER_TYPE === 'S' || data.UserInfo.USER_TYPE === 'K') && data.firstOrderYn === 'Y' && this.globalVal.customerInfo.mHpNoSmsAuthYn !== 'Y') {
        this.updateHpno = this.ordererInfo.hpNo
        this.isUserAuthInfoShow = true // 주문/결제 시 최소 1회에 한하여 휴대폰 인증이 필요합니다.
        this.isUserAuthBtnShow = true // 휴대폰인증 버튼
        this.isUserAuthPhoneNumShow = true // 휴대폰 번호 입력
        this.isUserPhoneNumShow = false
        this.globalVal.customerInfo.isOrderSheetCustomerShow = true
        this.globalVal.deliveryInfo.deliveryClass = 'subject line checkbox'

        this.ordererInfo.hpNo = this.globalVal.mOutputDatas.msg.UserInfo.PHONE1

        this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false // 결제하기 클릭시 사용

        // 회원 본인인증 여부 미체크
        this.globalVal.customerInfo.bFirstOrderYnCert = true
      } else if (this.globalVal.isGuest) { // 비회원
        this.globalVal.customerInfo.isOrderSheetCustomerShow = false
      } else { // 기타 회원
        // 회원가입점유인증제거 - 회원가입 SMS 인증을 받지 않았을 경우 인증 정보 노출
        if (this.globalVal.customerInfo.mHpNoSmsAuthYn !== 'Y') {
          this.updateHpno = this.ordererInfo.hpNo
          this.isUserAuthInfoShow = true // 주문/결제 시 최소 1회에 한하여 휴대폰 인증이 필요합니다.
          this.isUserAuthBtnShow = true // 휴대폰인증 버튼
          this.isUserAuthPhoneNumShow = true // 휴대폰 번호 입력
          this.isUserPhoneNumShow = false
          this.globalVal.customerInfo.isOrderSheetCustomerShow = true
          this.globalVal.deliveryInfo.deliveryClass = 'subject line checkbox'

          this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false // 결제하기 클릭시 사용
        } else {
          // 폰번호 ''인 경우 인증 해야 함
          if (insertSeparatorPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1, '') === '') {
            this.updateHpno = this.ordererInfo.hpNo
            this.isUserAuthInfoShow = true // 주문/결제 시 최소 1회에 한하여 휴대폰 인증이 필요합니다.
            this.isUserAuthBtnShow = true // 휴대폰인증 버튼
            this.isUserAuthPhoneNumShow = true // 휴대폰 번호 입력
            this.isUserPhoneNumShow = false
            this.globalVal.customerInfo.isOrderSheetCustomerShow = true
            this.globalVal.deliveryInfo.deliveryClass = 'subject line checkbox'

            this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false // 결제하기 클릭시 사용
          } else {
            this.isUserAuthInfoShow = false // 주문/결제 시 최소 1회에 한하여 휴대폰 인증이 필요합니다.
            this.isUserAuthBtnShow = false // 휴대폰인증 버튼
            this.isUserAuthPhoneNumShow = false // 휴대폰 번호 입력
            this.isUserPhoneNumShow = true
            this.globalVal.customerInfo.isOrderSheetCustomerShow = false
            this.globalVal.deliveryInfo.deliveryClass = 'subject checkbox'

            this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false // 결제하기 클릭시 사용
          }
        }
      }
    },
    /**
     * key down 방향기, 백스페이스, Del키,  숫자 외 입력 금지
     * maxlength (16) 이상은 방향기, 백스페이스, Del키 만 허용
     * @param {object} e event object
     * @returns {void}
     */
    keydownNumber (e) {
      const code = e.keyCode
      const ALLOW_KEYS = [
        COMM_CONST.KEY_CODE.BACK_SPACE,
        COMM_CONST.KEY_CODE.DELETE,
        COMM_CONST.KEY_CODE.LEFT,
        COMM_CONST.KEY_CODE.RIGHT
      ]

      if (!ALLOW_KEYS.includes(code) && (code < COMM_CONST.KEY_CODE.NUM_0 || code > COMM_CONST.KEY_CODE.NUM_9)) {
        e.preventDefault()
      }

      if (e.target.value.length >= 16) {
        if (!ALLOW_KEYS.includes(code)) {
          e.preventDefault()
        }
      }
    },
    /**
     * 휴대폰 번호 숫자만 입력 가능
     * @param {object} e event object
     */
    onKeyUpOnlyNumber (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '')
    },
    /**
     * 휴대폰 번호 숫자만 입력 가능
     * @param {object} e event object
     */
    blurDashPhone (e) {
      this.updateHpnoType = 'tel'
      this.updateHpno = insertSeparatorPhoneNumber(e.target.value, '-')
    },
    /**
     * 휴대폰 번호 숫자만 입력 가능
     */
    focusDashPhone () {
      this.updateHpnoType = 'number'
      this.updateHpno = insertSeparatorPhoneNumber(this.updateHpno, '')
    },
    /**
     * 인증번호 전송 callback
     * @param {Object} data - 인증번호 전송 callback data
     */
    callbackCertNumber (data) {
      const result = data.msg.root.processMsg.processMsg
      this.globalVal.customerInfo.effectiveTime = Number(data.msg.root.processMsg.effectiveTime)

      if (result === 'S') {
        // 서버에서 인증번호 입력 유효시간 확인(180초)
        timerObject.checkTimerObject()
        timerObject.m_timer = setInterval(this.getAuthNoIntervalTime, 1000)
      }
    },
    /**
     * 인증번호 입력 시간 제한 타이머.
     */
    getAuthNoIntervalTime () {
      let comSecond = this.globalVal.customerInfo.effectiveTime
      const addZero = function (number) {
        return Number(number) < 10 ? `0${number}` : number
      }

      let hh = Math.floor(comSecond / 60)
      hh = addZero(hh)

      let mm = (comSecond % 60)
      mm = addZero(mm)

      const hhMm = `${hh}:${mm}`
      this.txtTimer = hhMm

      comSecond--
      this.globalVal.customerInfo.effectiveTime = comSecond

      if (comSecond < 0) {
        this.isUserTimeErrorShow = true // 인증번호 입력 시간이 초과하였습니다. 다시 시도해 주세요.
        this.isUserCertSendShow = false // 입력하신 번호로 인증번호가 발송되었습니다.
        this.isUserCertErrorShow = false // 인증번호를 다시 한 번 확인 후, 입력해 주세요.
        this.isCertBtnDisabled = true // 인증하기 버튼
        clearInterval(timerObject.m_timer)
      } else {
        this.isUserTimeErrorShow = false // 인증번호 입력 시간이 초과하였습니다. 다시 시도해 주세요.
        if (!this.isUserCertErrorShow && !this.globalVal.customerInfo.isUserHpnoErrorShow) {
          this.isUserCertSendShow = true // 입력하신 번호로 인증번호가 발송되었습니다.
        } else {
          this.isUserCertSendShow = false // 입력하신 번호로 인증번호가 발송되었습니다.
        }
        this.isCertBtnDisabled = false // 인증하기 버튼
      }
    },
    /**
     * 휴대폰 점유인증 인증 모듈 호출
     */
    async sendVerificationCode () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const txtHp = insertSeparatorPhoneNumber(this.updateHpno, '').trim()

      // 핸드폰자리가 10자리 이하일 경우
      if (txtHp.length < 10) {
        this.isUserAuthInfoShow = false
        this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false
        this.globalVal.customerInfo.isUserHpnoErrorShow = true // 올바른 휴대폰 번호로 수정해주세요.
        return
      }

      this.globalVal.customerInfo.isUserHpnoErrorShow = false // 올바른 휴대폰 번호로 수정해주세요.
      this.isUserAuthInfoShow = false // 주문/결제 시 최소 1회에 한하여 휴대폰 인증이 필요합니다.
      this.isUserAuthBtnShow = false // 휴대폰인증 버튼
      this.isUserAuthNumBtnShow = false // 인증번호 전송 버튼
      this.isUserAuthShow = true // 인증하기 - 인증번호 입력, 재전송 버튼, 인증하기 버튼
      this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false // 결제하기 클릭시 사용

      this.hasSentCode = true // 초기 전송여부 체크

      await this.$refs.phoneAuth.sendVerificationCode()
    },
    /**
     * 인증번호 전송 후처리
     *
     * @param {Object} resultObject - 인증번호 전송 후처리 object
     */
    handleSendVerificationCode (resultObject) {
      if (resultObject.response) {
        this.callbackCertNumber(resultObject.response)
      } else if (resultObject.error) {
        console.log(resultObject.error)
      }
    },
    /**
     * 인증번호 확인 후처리
     *
     * @param {Object} resultObject - 인증번호 확인 후처리 object
     */
    handleCheckVerificationCode (resultObject) {
      if (resultObject.isUserHpnoErrorShow) {
        this.globalVal.customerInfo.isUserHpnoErrorShow = resultObject.isUserHpnoErrorShow

        return
      }

      if (resultObject.response) {
        const result = resultObject.response.msg.root.processMsg.processMsg
        if (result === 'S' || result === 's') {
          this.globalVal.customerInfo.phNumber = this.updateHpno
          this.globalVal.customerInfo.isCertCheck = true
          this.isUserAuthInfoShow = false
          this.isUserHpnoUpdateShow = true
          this.globalVal.customerInfo.isConfirmUserAuthInfoShow = false // 결제하기 클릭시 사용
          this.isUserAuthShow = false
          this.isUserAuthPhoneNumShow = false
          this.isUserPhoneNumShow = true
          this.ordererInfo.hpNo = `${getPhoneNumber(this.updateHpno, '1')}-${getPhoneNumber(this.updateHpno, '2')}-${getPhoneNumber(this.updateHpno, '3')}`
        } else {
          this.globalVal.customerInfo.isCertCheck = false
        }
      }

      if (resultObject.error) {
        console.log(resultObject.error)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetCustomer";
</style>
