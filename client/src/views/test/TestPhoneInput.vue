<template>
  <div>
    <ns-phone
      :params="phoneParams"
      @blur="validatePhoneNumber(phoneParams);"
      @sendVerificationCode="sendVerificationCode"
      @verifyCode="verifyCode"
      @keyup.stop="filterStringOut($event, phoneParams); removeOverLengthValue($event, phoneParams);"
    />

    <div class="btn_group flex">
      <a
        href="javascript:"
        class="btn"
        @click="setInvalidPhoneNumber(phoneParams)"
      >
        <span>중복 번호 대입</span>
      </a>
      <a
        v-if="phoneParams.isError"
        href="javascript:"
        class="btn"
        @click="toggleMode(phoneParams)"
      >
        <span>{{ buttonName }}</span>
      </a>
    </div>

    <input id="temp" type="number">
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'
import NsPhone from '@components/common/NsPhone'
import inputMixin from '@/mixins/ui/inputMixin'

export default {
  components: {
    NsPhone
  },
  mixins: [
    inputMixin
  ],
  data () {
    return {
      phoneParams: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 11,
        title: '휴대전화 입력',
        placeholder: '휴대폰 번호 (‘-’ 없이 입력)',
        isSuccess: false,
        isError: false,
        errorMessage: 'jh****@naver.com 아이디(이메일)로 가입된 휴대전화입니다. <br>신규가입하실 경우, 휴대전화 인증이 필요합니다.',
        verification: {
          value: '',
          readonly: false,
          disabled: false,
          maxlength: 6,
          title: '인증번호 6자리',
          placeholder: '인증번호 6자리',
          isVerficationMode: false,
          timeLimit: '', /* 시간 제한 ex)05:00 or 04:59 ... */
          isSuccess: false,
          isError: false,
          isSendCode: false,
          sendMessage: '입력하신 번호로 인증번호가 발송되었습니다.',
          errorMessage: '인증번호를 다시 한 번 확인 후 입력해주세요.',
          successMessage: '인증완료',
          sendBtnName: '인증번호전송'
        }
      },
      timer: {
        seconds: 0,
        minutes: 0,
        intervalId: null
      },
      duplicatedPhoneNumberMessage: 'jh****@naver.com 아이디(이메일)로 가입된 휴대전화입니다. <br>신규가입하실 경우, 휴대전화 인증이 필요합니다.',
      invalidPhoneNumberMessage: '휴대폰 번호 양식에 맞게 입력해주세요',
      temp: {
        tempNumber: '',
        tempType: 'number'
      }
    }
  },
  computed: {
    buttonName () {
      return this.phoneParams.verification.isVerficationMode ? '인증 모드 끄기' : '휴대전화 인증'
    }
  },
  methods: {
    /**
     * 휴대폰 번호 검증
     *
     * @param {object} params
     * @param {string} params.value 입력된 비밀번호
     * @param {boolean} params.isSuccess 비밀번호 검증 성공 여부
     * @param {boolean} params.isError 비밀번호 검증 실패 여부
     * @param {string} params.errorMessage 에러 안내 메시지
     */
    validatePhoneNumber (params) {
      const INVALID_PHONE_NUMBER = '01012341234'
      const phoneNumber = params.value

      if (phoneNumber.length === params.maxlength) {
        if (phoneNumber === INVALID_PHONE_NUMBER) {
          params.isSuccess = false
          params.isError = true
          params.errorMessage = this.duplicatedPhoneNumberMessage
        } else {
          params.isSuccess = true
          params.isError = false
        }
      } else {
        params.isSuccess = false
        params.isError = true
        params.errorMessage = this.invalidPhoneNumberMessage
      }
    },
    /**
     * 비인가 번호 대입
     *
     * @param {object} params
     * @param {string} params.value 입력된 비밀번호
     */
    setInvalidPhoneNumber (params) {
      params.value = '01012341234'
    },
    /**
     * (점유)인증 모드 on/off
     *
     * @param {object} params
     * @param {boolean} params.verification.isVerficationMode (점유)인증 모드 사용 여부
     */
    toggleMode (params) {
      params.verification.isVerficationMode = !params.verification.isVerficationMode
    },
    /**
     * 인증번호 전송 및 후처리
     */
    sendVerificationCode () {
      /** 중복처리 방지 */
      if (this.phoneParams.verification.isSuccess) {
        messageUtil.alert('이미 인증되었습니다.')
        return
      }

      this.phoneParams.verification.isError = false
      this.phoneParams.verification.isSendCode = true

      /** !!! 개발 시 인증번호 전송 처리 필요!!! */

      /** 시간제한 설정 */
      /** 타이머 초기화 */
      this.resetTimer(this.timer)
      /** 타이머 시작 */
      this.timer.intervalId = setInterval(this.startTimer, 1000, this.timer, this.phoneParams)
    },
    /**
     * 인증번호 검증
     *
     * @param {String} code 사용자 입력 인증코드
     */
    verifyCode (code) {
      /** 가인증 코드 */
      const VERIFIED_CODE = '666666'

      /** 중복처리 방지 */
      if (this.phoneParams.verification.isSuccess) {
        messageUtil.alert('이미 인증되었습니다.')
        return
      }

      if (!this.phoneParams.verification.isSendCode) {
        messageUtil.alert('먼저 전송 버튼을 눌러주세요')
        return
      }

      /** 인증번호 검증 */
      if (code === VERIFIED_CODE) {
        this.phoneParams.verification.isError = false
        this.phoneParams.verification.isSuccess = true
        this.stopTimer(this.timer)
      } else {
        this.phoneParams.verification.isError = true
        this.phoneParams.verification.isFalse = false
        messageUtil.alert(`인증번호가 일치하지 않습니다. ${VERIFIED_CODE}를 입력해보세요.`)
      }
    },
    /**
     * 인증코드 시간제한 시작
     *
     * @param {object} timer timer object
     * @param {object} params input data
     */
    startTimer (timer, params) {
      if (timer.seconds === 0) {
        if (timer.minutes > 0) {
          timer.minutes--
          timer.seconds = 59
        }
      } else {
        timer.seconds--
      }

      params.verification.timeLimit = this.formattedLimitTime(timer)
    },
    /**
     * 타이머 리셋
     *
     * @param {object} timer
     * @param {number} timer.minutes 남은 분
     * @param {number} timer.seconds 남은 초
     */
    resetTimer (timer) {
      /** 기존 타이머 중지 */
      this.stopTimer(timer)

      timer.minutes = 5
      timer.seconds = 0
    },
    /**
     * 타이머 중지
     *
     * @param {object} timer
     * @param {string} timer.intervalId setInterval 아이디
     */
    stopTimer (timer) {
      if (timer.intervalId) {
        clearTimeout(timer.intervalId)
      }
    },
    /**
     * 제한 시간 포매팅
     *
     * @param {object} timer
     * @returns {string}
     */
    formattedLimitTime (timer) {
      return `${timer.minutes ? (timer.minutes > 9 ? timer.minutes : `0${timer.minutes}`) : '00'
        }:${timer.seconds > 9 ? timer.seconds : `0${timer.seconds}`}`
    }
  }
}
</script>
