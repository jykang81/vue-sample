<template>
  <div class="input_field auth">
    <label
      for="label_phone_auth"
      class="blind"
    >
      인증번호
    </label>
    <span class="input_group">
      <input
        id="label_phone_auth"
        ref="verificationCodeInput"
        type="tel"
        class="form text auth"
        placeholder="인증번호"
        autocomplete="off"
        value=""
        :maxlength="verificationCodeMaxLength"
        :disabled="disabledOfVerifyInput"
        @input="filterVerificationCode"
      >
      <span v-show="hasSentCode" class="auth_time">{{ timer.formattedLimitTime() }}</span>
    </span>
    <p
      v-if="isInfoMessageVisible"
      class="default_msg"
    >
      {{ infoMessage }}
    </p>
    <p
      v-if="isSuccess"
      class="default_msg"
      v-html="successMessage"
    />
    <p
      v-if="isError"
      class="error_msg"
      v-html="errorMessage"
    />
    <div class="btn_group">
      <button
        class="btn_resend"
        :disabled="disabledOfSendButton"
        @click="sendVerificationCode"
      >
        <span>재전송</span>
      </button>
      <button
        class="btn_auth"
        :disabled="disabledOfVerifyButton"
        @click="checkVerificationCode"
      >
        <span>인증하기</span>
      </button>
    </div>
  </div>
</template>

<script>
import Timer from '@/common/classes/Timer'
import PHONE_AUTH_CONST from '@constants/customer/phoneAuth'
import MEMBER_CONST from '@/common/constants/customer/member'
import {
  insertSeparatorPhoneNumber,
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@utils/loginUtil'
import phoneAuthService from '@/services/common/phoneAuthService'

export default {
  props: {
    authType: { // 인증 타입 ex) PHON_AUTH_CONST.xxx
      type: String,
      required: true,
      default: ''
    },
    userName: { // 고객명
      type: String,
      required: true,
      default: ''
    },
    phoneNumber: { // 휴대폰번호
      type: String,
      required: true,
      default: ''
    },
    logonId: { // 아이디 (이메일)
      type: String,
      required: false,
      default: ''
    },
    custNum: {
      type: String,
      required: false,
      default: ''
    },
    email: {
      type: String,
      required: false,
      default: ''
    },
    phoneError: {
      type: Boolean,
      required: false,
      default: false
    },
    userNameError: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      apiParams: {}, // API request parameters
      timer: new Timer(), // 인증번호 유효 시간 관리용 객체
      verificationCode: '', // 인증번호
      verificationCodeMaxLength: 4, // 인증번호폼 최대 입력 길이
      disabled: false, // 인증번호 입력폼 disable 여부
      isSuccess: false, // 성공 여부
      isError: false, // 실패 여부
      hasSentCode: false, // 인증 코드 발송 여부
      tempUserId: '', // 임시 유저 아이디 (회원가입 인증시 사용)
      errorMessage: PHONE_AUTH_CONST.MESSAGES.INVALID_INPUT, // 에러 메시지
      successMessage: PHONE_AUTH_CONST.MESSAGES.SUCCESS, // 성공 메시지
      infoMessage: PHONE_AUTH_CONST.MESSAGES.AFTER_SEND_CODE, // 안내 메시지
      disabledOfVerifyInput: false,
      disabledOfSendButton: false,
      disabledOfVerifyButton: false
    }
  },
  computed: {
    /**
     * 인증코드 발송 메시지 표시여부
     * @returns {Boolean}
     */
    isInfoMessageVisible () {
      return this.hasSentCode && !this.isSuccess && !this.isError
    }
  },
  watch: {
    timer: {
      deep: true,

      handler () {
        // 입력시간 초과
        if (
          this.hasSentCode &&
          !this.isSuccess &&
          !this.timer.hasRemainingTime()
        ) {
          this.isSuccess = false
          this.isError = true
          this.errorMessage = PHONE_AUTH_CONST.MESSAGES.TIMEOUT
        }

        // 인증만료 ()
        if (
          this.authType === PHONE_AUTH_CONST.AUTH_TYPE.MEMBER_JOIN &&
          this.hasSentCode &&
          this.isSuccess &&
          !this.timer.hasRemainingTime()
        ) {
          this.isSuccess = false
          this.isError = true
          this.errorMessage = PHONE_AUTH_CONST.MESSAGES.EXPIRED
          this.$refs.verificationCodeInput.value = '' // 인증번호 input 초기화
          this.disabledOfSendButton = false
          this.disabledOfVerifyButton = false
          this.disabledOfVerifyInput = false
          this.$emit('expiredVerificationCode')
        }
      }
    }
  },
  activated () {
    this.initState() // 컴포넌트 상태 초기화 (캐싱 대비)
  },
  methods: {
    /**
     * 입력문자 필터 처리 (숫자만 남김)
     * @param {Event} e event object
     */
    filterVerificationCode (e) {
      const filtered = e.target.value.replace(/[^0-9]/g, '')
      e.target.value = filtered
      this.verificationCode = filtered
    },
    /**
     * 인증코드 발송
     * 인증 타입에 따라 API 호출
     * @returns {resultObject|undefined}
     */
    sendVerificationCode () {
      /** 공통 validation */
      if (this.isSuccess) { // 중복 호출 방지
        return
      }

      const authType = this.authType
      this.$refs.verificationCodeInput.value = ''

      if (authType === PHONE_AUTH_CONST.AUTH_TYPE.FIND_ID) {
        return this.sendVerificationCodeFindID()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.FIND_PASSWORD) {
        return this.sendVerificationCodeFindPass()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.MEMBER_JOIN) {
        return this.sendVerificationCodeMemberJoin()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.MEMBER_MODIFY) {
        return this.sendVerificationCodeMemberModify()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.ORDER) {
        return this.sendVerificationCodeOrder()
      }
    },
    /**
     * 아이디찾기용 인증코드 발송
     * @returns {resultObject|undefined}
     */
    async sendVerificationCodeFindID () {
      const userName = this.userName
      const phoneNumber = this.phoneNumber.trim().replace(/-/gi, '')
      const logonId = this.logonId
      const userNameIsError = this.userNameError || false
      const phoneIsError = this.phoneError || false

      if (userNameIsError) {
        return
      }

      if (phoneIsError) {
        return
      }

      if (!this.validateUserName(userName)) {
        return
      }

      if (!this.validatePhoneNumber(phoneNumber)) {
        return
      }

      this.apiParams.strLogonId = logonId
      this.apiParams.name = userName
      this.apiParams.phone1 = insertSeparatorPhoneNumber(phoneNumber, '-')

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult

        this.apiParams.userId = res.userId
        this.apiParams.logonId = res.logonId

        this.postProcessingOfSendingCode()
      }

      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.sendVerificationCodeFindID(this.apiParams, successHandling, errorHandling)

      this.$emit('sendVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 비밀번호용 인증코드 발송
     * @returns {resultObject|undefined}
     */
    async sendVerificationCodeFindPass () {
      const userName = this.userName
      const phoneNumber = this.phoneNumber.trim().replace(/-/gi, '')
      const logonId = this.logonId
      const userNameIsError = this.userNameError || false
      const phoneIsError = this.phoneError || false

      if (userNameIsError) {
        return
      }

      if (phoneIsError) {
        return
      }

      if (!this.validateUserName(userName)) {
        return
      }

      if (!this.validatePhoneNumber(phoneNumber)) {
        return
      }

      this.apiParams.authnumber = ''
      this.apiParams.strLogonId = logonId
      this.apiParams.mode = 'S'
      this.apiParams.type = 'P'
      this.apiParams.name = userName
      this.apiParams.mobAPI = 'NSPWCheckMoblieCmdReal'
      this.apiParams.phone1 = insertSeparatorPhoneNumber(phoneNumber, '-')

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult

        if (res.search_yn === 'Y' || res.search_yn === 'y') {
          this.apiParams.userId = res.userId
          this.apiParams.logonId = res.logonId

          this.postProcessingOfSendingCode()
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.sendVerificationCodeFindPass(this.apiParams, successHandling, errorHandling)

      this.$emit('sendVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 회원가입용 인증코드 발송
     * @returns {resultObject|undefined}
     */
    async sendVerificationCodeMemberJoin () {
      // const userName = this.userName
      const phoneNumber = this.phoneNumber.trim().replace(/-/gi, '')

      // if (!this.validateUserName(userName)) {
      //   return
      // }

      if (!this.validatePhoneNumber(phoneNumber)) {
        return
      }

      this.apiParams.cmdType = 'sendSmsAuth'
      this.apiParams.phone = insertSeparatorPhoneNumber(phoneNumber, '-')
      // this.apiParams.name = userName

      const resultObject = {}
      const successHandling = response => {
        resultObject.response = response

        const code = response.msg.result.resultCode

        if (code === 'Y') { // 인증번호 발송 완료
          this.tempUserId = response.msg.tempUserId
          this.postProcessingOfSendingCode()
        }
      }

      await phoneAuthService.sendVerificationCodeMemberJoin(this.apiParams, successHandling, this.commonErrorHandling)

      this.$emit('sendVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 회원정보수정용 인증코드 발송
     * @returns {resultObject}
     */
    async sendVerificationCodeMemberModify () {
      const phoneNumber = this.phoneNumber.trim()

      this.apiParams.users_id = loginUtil.getUserInfo('userId')
      this.apiParams.pMode = 'K'
      this.apiParams.authUsage = '6'
      this.apiParams.Phone = phoneNumber

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const code = response.msg.root.processMsg.processMsg

        if (code !== 'S') {
          this.isError = true
          this.hasSentCode = false
        } else {
          this.apiParams.userId = loginUtil.getUserInfo('userId')
          this.postProcessingOfSendingCode()
        }
      }
      const errorHandling = error => {
        resultObject.error = error

        this.isError = true
        this.hasSentCode = false

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.sendVerificationCodeMemberModify(this.apiParams, successHandling, errorHandling)

      this.$emit('sendVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 주문서용 인증코드 발송
     * @returns {resultObject}
     */
    async sendVerificationCodeOrder () {
      const phoneNumber = this.phoneNumber.trim().replace(/-/gi, '')

      this.apiParams.userId = this.userId
      this.apiParams.pMode = 'K'
      this.apiParams.authUsage = '6'
      this.apiParams.Phone = insertSeparatorPhoneNumber(phoneNumber, '-')

      const resultObject = {}
      const successHandling = response => {
        resultObject.response = response

        const result = response.msg.root.processMsg.processMsg

        if (result === 'S') {
          this.postProcessingOfSendingCode()
        } else {
          this.isError = true
          this.hasSentCode = false
        }
      }
      const errorHandling = error => {
        resultObject.error = error

        this.isError = true
        this.hasSentCode = false

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.sendVerificationCodeOrder(this.apiParams, successHandling, errorHandling)

      return resultObject
    },
    /**
     * 공통 에러 처리
     * @param {Object} error http request error 객체
     */
    commonErrorHandling (error) {
      console.error(error)

      messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
    },
    /**
     * 인증번호 전송 후처리 (타이머 초기화 및 상태 설정)
     */
    postProcessingOfSendingCode () {
      this.timer.setTimerAllInOne()

      this.hasSentCode = true // 인증코드 발송 처리
      this.isError = false // 에러 여부 초기화
    },
    /**
     * 고객명 유효성 검증
     *
     * @param {String} userName 고객명
     * @returns {Boolean}
     */
    validateUserName (userName) {
      if (isNull(userName)) {
        this.isError = true
        this.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME01

        return false
      }

      return true
    },
    /**
     * 휴대폰번호 유효성 검증
     *
     * @param {String} phoneNumber 휴대폰번호
     * @returns {Boolean}
     */
    validatePhoneNumber (phoneNumber) {
      if (isNull(phoneNumber) || phoneNumber.length < 10) {
        this.isError = true
        this.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12

        return false
      }

      return true
    },
    /**
     * 인증번호 검증
     * @returns {resultObject|undefined}
     */
    async checkVerificationCode () {
      /** 중복처리 방지 */
      if (this.isSuccess) {
        return
      }

      const verificationCode = this.verificationCode.trim()

      if (!this.validateBeforeCheckVerification(verificationCode)) {
        return
      }

      const authType = this.authType

      if (authType === PHONE_AUTH_CONST.AUTH_TYPE.FIND_ID) {
        return this.checkVerificationCodeFindID()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.FIND_PASSWORD) {
        return this.checkVerificationCodeFindPassword()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.MEMBER_JOIN) {
        return this.checkVerificationCodeMemberJoin()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.MEMBER_MODIFY) {
        return this.checkVerificationCodeMemberModify()
      } else if (authType === PHONE_AUTH_CONST.AUTH_TYPE.ORDER) {
        return this.checkVerificationCodeOrder()
      }
    },
    /**
     * 아이다칮기용 인증번호확인
     * @returns {resultObject}
     */
    async checkVerificationCodeFindID () {
      const verificationCode = this.verificationCode.trim()

      this.apiParams.authnumber = verificationCode
      this.apiParams.mode = 'V'

      const resultObject = {}
      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult
        const searchYn = res.search_yn

        if (searchYn === 'N') {
          this.isError = true
          this.errorMessage = PHONE_AUTH_CONST.MESSAGES.INVALID_INPUT
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.checkVerificationCodeFindID(this.apiParams, successHandling, errorHandling)

      this.$emit('checkVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 비밀번호찾기용 인증번호확인
     * @returns {resultObject}
     */
    async checkVerificationCodeFindPassword () {
      const verificationCode = this.verificationCode.trim()

      this.apiParams.authnumber = verificationCode
      this.apiParams.mode = 'V'

      const resultObject = {}
      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult
        const searchYn = res.search_yn

        if (searchYn === 'N') {
          this.isError = true
          this.errorMessage = PHONE_AUTH_CONST.MESSAGES.INVALID_INPUT
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.checkVerificationCodeFindPassword(this.apiParams, successHandling, errorHandling)

      this.$emit('checkVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 회원가입용 인증번호확인
     * @returns {resultObject}
     */
    async checkVerificationCodeMemberJoin () {
      const verificationCode = this.verificationCode.trim()

      const authNumber = verificationCode
      const tempUserId = this.tempUserId

      this.apiParams.cmdType = 'confirmCertificateNo'
      this.apiParams.authNumber = authNumber
      this.apiParams.tempUserId = tempUserId

      const resultObject = {}
      const successHandling = response => {
        resultObject.response = response

        const result = response.msg.result.processMsg

        if (result === 'S') {
          this.isError = false
          this.isSuccess = true
          this.disabledOfSendButton = true
          this.disabledOfVerifyButton = true
          this.disabledOfVerifyInput = true
        } else {
          this.isError = true
          this.errorMessage = PHONE_AUTH_CONST.MESSAGES.INVALID_INPUT
        }
      }
      const errorHandling = error => {
        resultObject.error = error

        console.log(error)
        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.checkVerificationCodeMemberJoin(this.apiParams, successHandling, errorHandling)

      this.$emit('checkVerificationCode', resultObject)
    },
    /**
     * 회원정보수정용 인증번호확인
     * @returns {resultObject|undefined}
     */
    async checkVerificationCodeMemberModify () {
      const verificationCode = this.verificationCode.trim()

      if (!this.validateBeforeCheckVerification(verificationCode)) {
        return
      }

      this.apiParams.authNumber = verificationCode
      this.apiParams.pMode = 'C'
      this.apiParams.authUsage = '6'
      this.apiParams.users_id = loginUtil.getUserInfo('userId')

      const resultObject = {}
      const successHandling = async response => {
        const result = response.msg.root.processMsg.processMsg

        if (result === 's' || result === 'S') {
          /** 인증번호 확인후 정상인경우 휴대폰 번호를 변경한다. */
          this.apiParams.authUsage = '6'
          this.apiParams.pMode = 'U'
          this.apiParams.users_id = loginUtil.getUserInfo('userId')
          this.apiParams.Phone = this.phoneNumber

          const changeSuccessHandling = changeResponse => {
            const changeResult = changeResponse.msg.root.processMsg.processMsg
            resultObject.response = changeResponse

            if (changeResult === 's' || changeResult === 'S') {
              /** 세션스토리지 및 로컬스토리지 logonId값 변경 */
              const memberInfo = loginUtil.getMemberInfo()
              memberInfo.telNo = this.phoneNumber
              loginUtil.login(memberInfo)

              /** 상태 초기화 */
              this.verificationCode = ''
              this.timer.stopTimer()
              this.hasSentCode = false
            }
          }
          const changeErrorHandling = changeError => {
            resultObject.error = changeError

            messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
          }

          await phoneAuthService.checkVerificationCodeMemberModify(this.apiParams, changeSuccessHandling, changeErrorHandling)

          this.$emit('checkVerificationCode', resultObject)
        } else {
          this.isError = true
          this.isSuccess = false
          this.errorMessage = PHONE_AUTH_CONST.MESSAGES.INVALID_INPUT
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.checkVerificationCodeMemberModify(this.apiParams, successHandling, errorHandling)
    },
    /**
     * 주문서용 인증번호확인
     * @returns {resultObject|undefined}
     */
    async checkVerificationCodeOrder () {
      const verificationCode = this.verificationCode.trim()

      if (!this.validateBeforeCheckVerification(verificationCode)) {
        this.disabled = false
        this.isSuccess = false

        return
      }

      const resultObject = {}

      const txtHp = insertSeparatorPhoneNumber(this.phoneNumber, '').trim()

      if (txtHp.length === 11) {
      } else if (txtHp.length === 10) {
      } else {
        resultObject.isUserHpnoErrorShow = true // 올바른 휴대폰 번호로 수정해주세요.
        this.$emit('checkVerificationCode', resultObject)
        return
      }

      this.apiParams.authNumber = verificationCode
      this.apiParams.authUsage = '6'
      this.apiParams.pMode = 'C'
      this.apiParams.Phone = this.phoneNumber
      this.apiParams.modifyUserHpNoYn = 'Y'
      this.apiParams.custNum = this.custNum
      this.apiParams.email = this.email

      const successHandling = response => {
        resultObject.response = response

        const result = response.msg.root.processMsg.processMsg

        if (result === 'S' || result === 's') {
          /** 상태 초기화 */
          this.verificationCode = ''
          this.timer.stopTimer()
          this.hasSentCode = false
        } else {
          this.isError = true
          this.isSuccess = false
          this.errorMessage = PHONE_AUTH_CONST.MESSAGES.INVALID_INPUT
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        messageUtil.alert(PHONE_AUTH_CONST.MESSAGES.SERVER_ERROR)
      }

      await phoneAuthService.checkVerificationCodeOrder(this.apiParams, successHandling, errorHandling)

      this.$emit('checkVerificationCode', resultObject)
    },
    /**
     * 인증번호 문자열 유효성 검증
     * @param {String} verificationCode 인증번호
     * @returns {Boolean}
     */
    validateBeforeCheckVerification (verificationCode) {
      /** 시간 초과 확인 */
      if (this.hasSentCode && (this.timer.minutes === 0 && this.timer.seconds === 0)) {
        this.errorMessage = PHONE_AUTH_CONST.MESSAGES.TIMEOUT
        this.isError = true

        return false
      }

      /** 입력 확인 */
      if (isNull(verificationCode)) {
        this.isError = true
        this.errorMessage = PHONE_AUTH_CONST.MESSAGES.EMPTY_VERIFICATION_CODE

        return false
      }

      /** 인증번호 길이 확인 */
      if (verificationCode.length !== this.verificationCodeMaxLength) {
        this.isError = true
        this.errorMessage = PHONE_AUTH_CONST.MESSAGES.INVALID_INPUT

        return false
      }

      return true
    },
    /**
     * 컴포넌트 상태 초기화
     */
    initState () {
      this.hasSentCode = false
      this.isSuccess = false
      this.isError = false
      this.verificationCode = ''

      this.$refs.verificationCodeInput.value = '' // 인증번호 input 초기화

      this.timer = new Timer() // Timer 초기화
    }
  }
}

/**
 * @typedef {Object} resultObject 인증코드발송 / 인증코드확인 결과 반환용 객체
 * @property {Object} [response] http response
 * @property {Object} [error] http request error
 * @property {Boolean} [isUserHpnoErrorShow] 주문서 에러 메시지 출력여부
 */
</script>
