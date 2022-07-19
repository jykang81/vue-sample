<template>
  <div class="input_field auth">
    <label
      for="label_email_auth"
      class="blind"
    >
      인증번호
    </label>
    <span class="input_group">
      <input
        id="label_email_auth"
        ref="verificationCodeInput"
        type="tel"
        class="form text auth"
        placeholder="인증번호"
        value=""
        :maxlength="verificationCodeMaxLength"
        :disabled="disabledOfVerifyInput"
        @keyup="filterVerificationCode"
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
        type="button"
        class="btn_resend"
        @click="sendVerificationCode"
      >
        <span>재전송</span>
      </button>
      <button
        type="button"
        class="btn_auth"
        @click="checkVerificationCode"
      >
        <span>인증하기</span>
      </button>
    </div>
  </div>
</template>

<script>
import Timer from '@/common/classes/Timer'
import EMAIL_AUTH_CONST from '@/common/constants/customer/emailAuth'
import {
  isNull,
  isEmail
} from '@utils/commonutil/commonUtil'
import loginUtil from '@/common/utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'

export default {
  props: {
    authType: { // 인증 타입 ex) EMAIL_AUTH_CONST.xxx
      type: String,
      required: true,
      default: ''
    },
    email: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: false,
      default: ''
    },
    emailError: {
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
      isSuccess: false, // 성공 여부
      isError: false, // 실패 여부
      hasSentCode: false, // 인증 코드 발송 여부
      errorMessage: '', // 에러 메시지
      successMessage: '', // 성공 메시지
      infoMessage: '', // 안내 메시지
      disabledOfVerifyInput: false,
      disabledOfSendButton: false,
      disabledOfVerifyButton: false
    }
  },
  computed: {
    /**
     * 인증코드 발송 메시지 표시여부
     *
     * @returns {boolean}
     */
    isInfoMessageVisible () {
      return this.hasSentCode && !this.isSuccess && !this.isError
    }
  },
  watch: {
    timer: {
      deep: true,

      handler () {
        if (
          this.hasSentCode &&
          !this.isSuccess &&
          !this.timer.hasRemainingTime()
        ) {
          this.isError = true
          this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.TIMEOUT
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
     *
     * @param {object} e event object
     */
    filterVerificationCode (e) {
      const filtered = e.target.value.replace(/[^0-9]/g, '')
      e.target.value = filtered
      this.verificationCode = filtered
    },
    /**
     * 인증코드 발송
     * 인증 타입에 따라 API 호출
     *
     * @returns {resultObject}
     */
    sendVerificationCode () {
      const authType = this.authType

      if (authType === EMAIL_AUTH_CONST.AUTH_TYPE.FIND_ID) {
        return this.sendVerificationCodeFindID()
      } else if (authType === EMAIL_AUTH_CONST.AUTH_TYPE.FIND_PASSWORD) {
        return this.sendVerificationCodeFindPassword()
      } else if (authType === EMAIL_AUTH_CONST.AUTH_TYPE.MEMBER_MODIFY) {
        return this.sendVerificationCodeMemberModify()
      }
    },
    /**
     * 아이디찾기용 인증코드 발송
     *
     * @returns {resultObject}
     */
    async sendVerificationCodeFindID () {
      const userName = this.userName
      const email = this.email

      if (!this.validateSendOfProps()) {
        return
      }

      this.apiParams.authnumber = ''
      this.apiParams.mode = 'S'
      this.apiParams.type = 'E'
      this.apiParams.name = userName
      this.apiParams.email1 = email
      this.apiParams.mobAPI = 'NSIDCheckMoblieCmdReal'

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult

        if (res.search_yn === 'N') {
          this.isError = true
        } else {
          this.isError = false
          this.hasSentCode = true
          this.infoMessage = EMAIL_AUTH_CONST.MESSAGES.AFTER_SEND_CODE

          this.apiParams.userId = res.userId
          this.apiParams.logonId = res.logonId

          this.timer.setTimerAllInOne() // 인증번호 유효시간 타이머 설정
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(EMAIL_AUTH_CONST.MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('NSIDCheckMoblieCmdReal', this.apiParams, successHandling, errorHandling)

      this.$emit('sendVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 비밀번호찾기용 인증코드 발송
     *
     * @returns {resultObject}
     */
    async sendVerificationCodeFindPassword () {
      const userName = this.userName
      const email = this.email

      if (!this.validateSendOfProps()) {
        return
      }

      this.apiParams.authnumber = ''
      this.apiParams.mode = 'S'
      this.apiParams.type = 'E'
      this.apiParams.name = userName
      this.apiParams.email1 = email
      this.apiParams.mobAPI = 'NSPWCheckMoblieCmdReal'

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult

        if (res.search_yn === 'N') {
          this.isError = true
        } else {
          this.isError = false
          this.hasSentCode = true
          this.infoMessage = EMAIL_AUTH_CONST.MESSAGES.AFTER_SEND_CODE

          this.apiParams.userId = res.userId
          this.apiParams.logonId = res.logonId

          this.timer.setTimerAllInOne() // 인증번호 유효시간 타이머 설정
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(EMAIL_AUTH_CONST.MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('NSPWCheckMoblieCmdReal', this.apiParams, successHandling, errorHandling)

      this.$emit('sendVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 회원정보수정용 인증코드 발송
     *
     * @returns {resultObject}
     */
    async sendVerificationCodeMemberModify () {
      const email = this.email.toLowerCase()

      if (!this.validateEmail(email)) {
        return
      }

      this.apiParams.userTypeGb = 'K'
      this.apiParams.pMode = 'R'
      this.apiParams.email1 = ''
      this.apiParams.authNumber = ''
      this.apiParams.authUsage = '5'
      this.apiParams.duplicationChk = 'Y'
      this.apiParams.newLogonId = email
      this.apiParams.oldLogonId = loginUtil.getUserInfo('logonId')
      this.apiParams.authNumRecall = 'N'

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const processMsg = response.processMsg

        if (processMsg === 'E') {
          this.hasSentCode = false
          this.isError = true
          this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.DUPLICATED_EMAIL
        } else {
          this.hasSentCode = true
          this.isError = false

          this.timer.setTimerAllInOne() // 인증번호 유효시간 타이머 설정
        }
      }
      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(EMAIL_AUTH_CONST.MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('NSAuthNumberConfirmCmd', this.apiParams, successHandling, errorHandling)

      this.$emit('sendVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 이메일 유효성 검증
     *
     * @param {string} email
     * @returns {boolean}
     */
    validateEmail (email) {
      // 메일주소 유효성 체크
      if (isNull(email)) {
        this.isError = true
        this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.INVALID_INPUT
        return false
      }

      if (!isEmail(email)) {
        this.isError = true
        this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.INVALID_INPUT
        return false
      }

      return true
    },
    /**
     * 인증번호 검증
     *
     * @returns {resultObject|undefined}
     */
    checkVerificationCode () {
      const verificationCode = this.verificationCode.trim()

      if (!this.validateVerificationCode(verificationCode)) {
        return
      }

      if (!this.validateTimeLimit()) {
        return
      }
      /** 공통 validation end */

      const authType = this.authType

      if (authType === EMAIL_AUTH_CONST.AUTH_TYPE.FIND_ID) {
        return this.checkVerificationCodeFindID()
      } else if (authType === EMAIL_AUTH_CONST.AUTH_TYPE.FIND_PASSWORD) {
        return this.checkVerificationCodeFindPassword()
      } else if (authType === EMAIL_AUTH_CONST.AUTH_TYPE.MEMBER_MODIFY) {
        return this.checkVerificationCodeMemberModify()
      }
    },
    /**
     * 아이디찾기용 인증번호확인
     *
     * @returns {resultObject|undefined}
     */
    async checkVerificationCodeFindID () {
      const verificationCode = this.verificationCode.trim()

      if (!this.validateStateOfProps()) {
        this.$emit('validateStateOfProps')

        return
      }

      this.apiParams.authnumber = verificationCode
      this.apiParams.mode = 'V'

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult
        const searchYn = res.search_yn

        if (searchYn === 'N') {
          this.isError = true
          this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.INVALID_VERIFICATION_CODE
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(EMAIL_AUTH_CONST.MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('NSIDCheckMoblieCmdReal', this.apiParams, successHandling, errorHandling)

      this.$emit('checkVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 비밀번호찾기용 인증번호확인
     *
     * @returns {resultObject|undefined}
     */
    async checkVerificationCodeFindPassword () {
      const verificationCode = this.verificationCode.trim()

      if (!this.validateStateOfProps()) {
        this.$emit('validateStateOfProps')

        return
      }

      this.apiParams.authnumber = verificationCode
      this.apiParams.mode = 'V'

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const res = response.msg.root.Searchresult
        const searchYn = res.search_yn

        if (searchYn === 'N') {
          this.isError = true
          this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.INVALID_VERIFICATION_CODE
        }
      }

      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(EMAIL_AUTH_CONST.MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('NSPWCheckMoblieCmdReal', this.apiParams, successHandling, errorHandling)

      this.$emit('checkVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 회원정보수정용 인증번호확인
     *
     * @returns {resultObject}
     */
    async checkVerificationCodeMemberModify () {
      const verificationCode = this.verificationCode.trim()

      this.apiParams.authNumber = verificationCode
      this.apiParams.userTypeGb = 'K'
      this.apiParams.pMode = 'C'
      this.apiParams.email = ''
      this.apiParams.authUsage = '5'
      this.apiParams.duplicationChk = 'Y'
      this.apiParams.authNumRecall = 'Y'

      const resultObject = {}

      const successHandling = response => {
        resultObject.response = response

        const processMsg = response.processMsg

        if (processMsg === 'E') {
          this.isError = true
          this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.INVALID_VERIFICATION_CODE
        } else {
          this.isError = false

          this.resetState() // 인증번호 상태 및 입력폼 초기화
        }
      }
      const errorHandling = error => {
        resultObject.error = error

        console.error(error)

        messageUtil.alert(EMAIL_AUTH_CONST.MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('NSAuthNumberConfirmCmd', this.apiParams, successHandling, errorHandling)

      this.$emit('checkVerificationCode', resultObject)

      return resultObject
    },
    /**
     * 인증코드 유효성 검증
     *
     * @param {string} verificationCode 인증번호
     * @returns {boolean}
     */
    validateVerificationCode (verificationCode) {
      if (isNull(verificationCode)) {
        this.isError = true
        this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.EMPTY_VERIFICATION_CODE

        return false
      }

      return true
    },
    /**
     * 인증번호 상태 및 입력폼 초기화
     */
    resetState () {
      this.$refs.verificationCodeInput.value = '' // 인증번호 입력폼 초기화
      this.verificationCode = '' // 인증번호 초기화
    },
    /**
     * prop(고객명/이메일) 상태값 유효성 확인
     *
     * @returns {boolean}
     */
    validateStateOfProps () {
      const userName = this.userName
      const email = this.email.toLowerCase()
      const userNameIsError = this.userNameError || false
      const emailIsError = this.emailError || false

      if (isNull(userName)) {
        return false
      }

      if (userNameIsError) {
        return false
      }

      if (isNull(email)) {
        return false
      }

      if (emailIsError) {
        return false
      }

      return true
    },
    /**
     * prop(고객명/이메일) 상태값 유효성 확인
     *
     * @returns {boolean}
     */
    validateSendOfProps () {
      const userName = this.userName
      const email = this.email.toLowerCase()
      const userNameIsError = this.userNameError || false
      const emailIsError = this.emailError || false

      if (isNull(userName)) {
        return false
      }

      if (userNameIsError) {
        return false
      }

      if (isNull(email)) {
        return false
      }

      if (emailIsError) {
        return false
      }

      return true
    },
    /**
     * 인증번호 남은 시간 확인
     *
     * @returns {boolean}
     */
    validateTimeLimit () {
      /** 시간 초과 확인 */
      if (this.hasSentCode && (this.timer.minutes === 0 && this.timer.seconds === 0)) {
        this.errorMessage = EMAIL_AUTH_CONST.MESSAGES.TIMEOUT
        this.isError = true

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
 * @typedef {object} resultObject 인증코드발송 / 인증코드확인 결과 반환용 객체
 * @property {object} [response] http response
 * @property {object} [error] http request error
 */
</script>
