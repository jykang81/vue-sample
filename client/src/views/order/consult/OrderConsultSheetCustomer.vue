<template>
  <div class="order_consult_sheet_customer">
    <!-- 신청자 정보 -->
    <h3 id="customerInfoArea" class="subject">
      신청자 정보
    </h3>
    <div class="input_field line">
      <label for="label_name" class="label_text">
        이름
      </label>
      <span class="input_group">
        <input id="label_name" type="text" class="form text" :value="globalVal.memberInfo.userNm" title="이름 입력" readonly disabled>
      </span>
    </div>
    <div class="input_field line">
      <label for="label_phone" class="label_text">
        휴대폰
      </label>
      <span class="input_group">
        <input id="label_phone"
               class="form text"
               :value="globalVal.memberInfo.phone"
               :type="updateHpnoType"
               title="휴대폰 입력"
               maxlength="11"
               :readonly="inputReadonlyPhone"
               :disabled="disabledReadonlyPhone"
               @keydown="keydownNumber($event)"
               @keyup="onKeyUpOnlyNumber($event)"
               @blur="blurDashPhone($event)"
               @focus="focusDashPhone()"
        >
      </span>
      <div class="input_field phone">
        <p v-show="globalVal.memberInfo.isUserAuthInfoShow || globalVal.memberInfo.isConfirmUserAuthInfoShow" :class="globalVal.memberInfo.isConfirmUserAuthInfoShow ? 'error_msg' :'default_msg'">
          NSmall 처음 이용 시 최초 1회에 한하여 휴대폰 인증이 필요합니다.
        </p>
        <p v-show="globalVal.memberInfo.isUserHpnoErrorShow" class="error_msg">
          올바른 휴대폰 번호로 수정해주세요.
        </p>
        <p v-show="isUserHpnoUpdateShow" class="complete_msg">
          회원정보를 인증된 휴대폰 번호로 수정하였습니다.
        </p>
        <!-- 휴대폰 인증 -->
        <div v-show="isUserAuthBtnShow" class="btn_group">
          <button type="button" class="btn coral_border" @click="sendVerificationCode">
            <span>인증번호 전송</span>
          </button>
        </div>
        <!-- 인증번호 전송 -->
        <div v-show="isUserAuthNumBtnShow" class="btn_group">
          <button type="button" class="btn gray_border" @click="sendVerificationCode">
            <span>인증번호 전송</span>
          </button>
        </div>
        <!-- 인증하기 -->
        <phone-auth
          v-show="isUserAuthShow"
          ref="phoneAuth"
          :phone-number="globalVal.memberInfo.phone"
          :auth-type="authType"
          :user-name="globalVal.memberInfo.userNm"
          :cust-num="globalVal.memberInfo.custNum"
          :email="globalVal.memberInfo.email"
          @sendVerificationCode="handleSendVerificationCode"
          @checkVerificationCode="handleCheckVerificationCode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  insertSeparatorPhoneNumber,
  timerObject
} from '@utils/commonutil/commonUtil'
import PhoneAuth from '@components/common/PhoneAuth'
import PHONE_AUTH_CONST from '@constants/customer/phoneAuth'

export default {
  components: {
    PhoneAuth
  },
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isUserAuthBtnShow: false, // 휴대폰인증 버튼
      isUserHpnoUpdateShow: false, // 회원정보를 인증된 휴대전화 번호로 수정하였습니다.
      isUserAuthNumBtnShow: false, // 인증번호 전송 버튼
      isUserPhoneNumShow: false, // 휴대폰번호
      isUserAuthPhoneNumShow: false, // 휴대폰번호 입력
      isUserAuthShow: false, // 인증하기 - 인증번호 입력, 재전송 버튼, 인증하기 버튼
      updateHpnoType: 'tel',
      inputReadonlyPhone: false,
      disabledReadonlyPhone: false,
      isCertNumerDisabled: false, // 인증번호
      txtTimer: '', // 인증번호 입력 남은 시간
      isUserCertErrorShow: false, // 인증번호를 다시 한 번 확인 후, 입력해 주세요.
      isUserTimeErrorShow: false, // 인증번호 입력 시간이 초과하였습니다. 다시 시도해 주세요.
      isUserCertSendShow: true, // 입력하신 번호로 인증번호가 발송되었습니다.
      isCertBtnDisabled: false, // 인증하기 버튼

      authType: PHONE_AUTH_CONST.AUTH_TYPE.ORDER,
      hasSentCode: false, // 초기 전송여부 체크
      effectiveTime: 0 // 입력 제한 시간
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      this.globalVal.memberInfo.isCertCheck = this.globalVal.memberInfo.hpNoSmsAuthYn === 'Y'

      if (!this.globalVal.memberInfo.isCertCheck) {
        this.globalVal.memberInfo.isUserAuthInfoShow = true // NSmall 처음 이용 시 최초 1회에 한하여<br>휴대폰 인증이 필요합니다.
        this.isUserAuthBtnShow = true // 휴대폰인증 버튼
      } else {
        this.inputReadonlyPhone = true
        this.disabledReadonlyPhone = true
      }
    },
    /**
     * 휴대폰 점유인증 인증 모듈 호출
     * @returns {void}
     */
    async sendVerificationCode () {
      const txtHp = insertSeparatorPhoneNumber(this.globalVal.memberInfo.phone, '').trim()

      // 핸드폰자리가 10자리 이하일 경우
      if (txtHp.length < 10) {
        this.globalVal.memberInfo.isConfirmUserAuthInfoShow = false
        this.globalVal.memberInfo.isUserAuthInfoShow = false
        this.globalVal.memberInfo.isUserHpnoErrorShow = true // 올바른 휴대폰 번호로 수정해주세요.
        return
      }

      this.globalVal.memberInfo.isUserHpnoErrorShow = false // 올바른 휴대폰 번호로 수정해주세요.
      this.globalVal.memberInfo.isUserAuthInfoShow = false // 주문/결제 시 최소 1회에 한하여 휴대폰 인증이 필요합니다.
      this.isUserAuthBtnShow = false // 휴대폰인증 버튼
      this.isUserAuthNumBtnShow = false // 인증번호 전송 버튼
      this.isUserAuthShow = true // 인증하기 - 인증번호 입력, 재전송 버튼, 인증하기 버튼
      this.hasSentCode = true // 초기 전송여부 체크

      await this.$refs.phoneAuth.sendVerificationCode()
    },
    /**
     * 인증번호 전송 후처리
     * @param {import('@components/ui/PhoneAuth.vue').resultObject} resultObject - 인증번호전송데이터
     * @returns {void}
     */
    handleSendVerificationCode (resultObject) {
      if (resultObject.response) {
        this.callbackCertNumber(resultObject.response)
      }
    },
    /**
     * 인증번호 확인 후처리
     * @param {import('@components/ui/PhoneAuth.vue').resultObject} resultObject - 인증후결과데이터
     * @returns {void}
     */
    handleCheckVerificationCode (resultObject) {
      if (resultObject.isUserHpnoErrorShow) {
        this.globalVal.memberInfo.isUserHpnoErrorShow = resultObject.isUserHpnoErrorShow
        return false
      }

      if (resultObject.response) {
        const result = resultObject.response.msg.root.processMsg.processMsg
        if (result === 'S' || result === 's') {
          this.globalVal.memberInfo.isCertCheck = true
          this.globalVal.memberInfo.isUserAuthInfoShow = false
          this.isUserHpnoUpdateShow = true
          this.isUserAuthShow = false
          this.isUserAuthPhoneNumShow = false
          this.isUserPhoneNumShow = true
          this.inputReadonlyPhone = true
          this.disabledReadonlyPhone = true
          this.globalVal.userInfo.phoneNo = this.globalVal.memberInfo.phone
        } else {
          this.globalVal.memberInfo.isCertCheck = false
        }
      }
    },
    /**
     * 인증번호 전송 callback
     * @param {Object} data - 인증번호 전송결과 데이터
     * @returns {void}
     */
    callbackCertNumber (data) {
      const result = data.msg.root.processMsg.processMsg
      this.effectiveTime = Number(data.msg.root.processMsg.effectiveTime)

      if (result === 'S') {
        // 서버에서 인증번호 입력 유효시간 확인(180초)
        timerObject.checkTimerObject()
        timerObject.m_timer = setInterval(this.setAuthNoIntervalTime, 1000)
      }
    },
    /**
     * 인증번호 입력 시간 제한 타이머 설정
     * @returns {void}
     */
    setAuthNoIntervalTime () {
      let comSecond = this.effectiveTime
      const addZero = function (number) {
        return Number(number) < 10 ? `0${number}` : number
      }

      let hh = Math.floor(comSecond / 60)
      hh = addZero(hh)

      let mm = (comSecond % 60)
      mm = addZero(mm)

      const m = `${hh}:${mm}`
      this.txtTimer = m

      comSecond--
      this.effectiveTime = comSecond

      if (comSecond < 0) {
        this.isUserTimeErrorShow = true // 인증번호 입력 시간이 초과하였습니다. 다시 시도해 주세요.
        this.isUserCertSendShow = false // 입력하신 번호로 인증번호가 발송되었습니다.
        this.isUserCertErrorShow = false // 인증번호를 다시 한 번 확인 후, 입력해 주세요.
        this.isCertBtnDisabled = true // 인증하기 버튼
        clearInterval(timerObject.m_timer)
      } else {
        this.isUserTimeErrorShow = false // 인증번호 입력 시간이 초과하였습니다. 다시 시도해 주세요.
        if (!this.isUserCertErrorShow && !this.globalVal.memberInfo.isUserHpnoErrorShow) {
          this.isUserCertSendShow = true // 입력하신 번호로 인증번호가 발송되었습니다.
        } else {
          this.isUserCertSendShow = false // 입력하신 번호로 인증번호가 발송되었습니다.
        }
        this.isCertBtnDisabled = false // 인증하기 버튼
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

      if (e.target.value.length >= 11) {
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
      this.globalVal.memberInfo.phone = insertSeparatorPhoneNumber(e.target.value, '-')
    },
    /**
     * 휴대폰 번호 숫자만 입력 가능
     */
    focusDashPhone () {
      this.updateHpnoType = 'number'
      this.globalVal.memberInfo.phone = insertSeparatorPhoneNumber(this.globalVal.memberInfo.phone, '')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/consult/OrderConsultSheetCustomer";
</style>
