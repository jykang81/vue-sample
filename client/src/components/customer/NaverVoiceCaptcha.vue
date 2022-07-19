<template>
  <div class="captcha_contents">
    <!-- 음성캡차 -->
    <div class="captcha_box">
      <span class="captcha_voice" @click="handleClickButton">
        <span>{{ audioButtonName }}</span>
      </span>
      <div class="captcha_button">
        <button
          type="button"
          class="btn text"
          @click="changeCaptchaComponent(true)"
        >
          <span>문자보기</span>
        </button>
        <button
          type="button"
          class="btn refresh"
          @click="getNaverVoiceCaptchKey"
        >
          <span>새로고침</span>
        </button>
      </div>
    </div>
    <ns-input
      :params="captchaInputParams"
    />
    <p>{{ resultMessage }}</p>
  </div>
</template>

<script>
import { NAVER_CAPTCHA_CONST } from '@constants/customer/captcha'
import NsInput from '@components/common/NsInput'
import {
  isNull
} from '@utils/commonutil/commonUtil'

export default {
  name: 'NaverVoiceCaptcha',
  components: {
    NsInput
  },
  data () {
    return {
      naverVoiceCaptchaKey: '', // 네이버 음성 캡차 API key 값
      captchaAudio: null, // Audio 타입 객체
      audioButtonName: NAVER_CAPTCHA_CONST.VOICE.IDLE_BUTTON_NAME, // 음성 캡차 오디오 컨트롤 버튼명
      resultMessage: '', // 캡차 입력 검증 결과 메시지
      captchaInputParams: { // 사용자 입력 문자
        value: '',
        iconClass: 'text',
        title: NAVER_CAPTCHA_CONST.INPUT_TEXT.TITLE,
        placeholder: NAVER_CAPTCHA_CONST.INPUT_TEXT.PLACEHOLDER,
        maxlength: 12,
        type: 'phone',
        isLabel: true,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        disabled: false,
        errorMessage: NAVER_CAPTCHA_CONST.IMAGE.VERIFICATION_FAILURE
      }
    }
  },
  created () {
    this.getNaverVoiceCaptchKey()
    this.noticeCaptchaActivation()
  },
  activated () {
    this.noticeCaptchaActivation()
  },
  deactivated () {
    this.captchaInputParams.value = ''
    this.captchaInputParams.isError = false
    this.captchaInputParams.errorMessage = NAVER_CAPTCHA_CONST.IMAGE.VERIFICATION_FAILURE
    this.captchaInputParams.disabled = false
    this.captchaInputParams.isSuccess = false
    this.resultMessage = ''

    this.getNaverVoiceCaptchKey()
  },
  mounted () {
    window.vm = this
  },
  methods: {
    /**
     * 오디오 조정 버튼 클릭 이벤트 처리
     */
    handleClickButton () {
      const isAudioPaused = this.captchaAudio.paused

      if (isAudioPaused) {
        this.playVoice()
      } else {
        this.pauseSound()
      }
    },
    /**
     * 음성 캡차 오디오 재생
     */
    playVoice () {
      this.captchaAudio.play()
      this.audioButtonName = NAVER_CAPTCHA_CONST.VOICE.PLAYING_BUTTON_NAME
    },
    /**
     * 음성 캡차 오디오 중지 및 재생시간 초기화
     */
    pauseSound () {
      this.captchaAudio.pause()
      this.captchaAudio.currentTime = 0
      this.audioButtonName = NAVER_CAPTCHA_CONST.VOICE.IDLE_BUTTON_NAME
    },
    /**
     * 음성 캡차 키 갱신 API 호출 및 캡차 오디오 설정
     */
    getNaverVoiceCaptchKey () {
      const params = {}

      const successHandler = res => {
        this.naverVoiceCaptchaKey = res.data // 캡차 키 갱신
        this.captchaAudio = new Audio(`${NAVER_CAPTCHA_CONST.VOICE.FILE_URL}?key=${this.naverVoiceCaptchaKey}&X-NCP-APIGW-API-KEY-ID=${NAVER_CAPTCHA_CONST.KEY.CLIENT_ID}`)
        this.captchaAudio.onended = this.pauseSound

        this.captchaInputParams.value = ''
        this.resultMessage = '' // 캡차 입력 검증 결과 메시지 초기화
      }

      this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.VOICE.API_URL}/getKey`, params, successHandler)
    },
    /**
     * 사용자 입력 문자 검증 API 호출 및 후처리
     *
     * @returns {object}
     */
    async matchNaverCaptchaValue () {
      const inputValue = this.captchaInputParams.value
      const resultObject = {
        result: true
      }

      if (isNull(inputValue)) {
        this.captchaInputParams.isError = true
        this.captchaInputParams.errorMessage = NAVER_CAPTCHA_CONST.VALIDATION_MESSAGES.NULL
        resultObject.result = false
        return resultObject
      }

      const params = {
        key: this.naverVoiceCaptchaKey,
        value: inputValue
      }

      const successHandler = res => {
        const result = res.data.result
        resultObject.result = result

        if (result === true) {
          this.captchaInputParams.isError = false
          this.captchaInputParams.isSuccess = true
        } else {
          this.captchaInputParams.isError = true
          this.captchaInputParams.isSuccess = false

          this.captchaInputParams.value = ''
          this.captchaInputParams.errorMessage = NAVER_CAPTCHA_CONST.VALIDATION_MESSAGES.FAIL
          this.captchaInputParams.disabled = false

          this.getNaverVoiceCaptchKey()
        }
      }

      const errorHandler = () => {
        resultObject.result = false
        this.resultMessage = NAVER_CAPTCHA_CONST.RESULT_MESSAGES.SERVICE_PROC_ERROR_COMMON
      }

      await this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.VOICE.API_URL}/matchKey`, params, successHandler, errorHandler)

      return resultObject
    },
    /**
     * 부모컴포넌트 이미지캡챠로 변경
     *
     * @param {boolean} isImageCaptcha 이미지캡차로변경여부
     */
    changeCaptchaComponent (isImageCaptcha) {
      this.$emit('changeCaptchaComponent', isImageCaptcha)
    },
    /**
     * 캡챠로드
     */
    noticeCaptchaActivation () {
      this.$emit('noticeCaptchaActivation', this)
    },
    /**
     * 부모컴포넌트의 메세지를 적용한다.
     *
     * @param {boolean} isError 에러여부
     * @param {string} errorMessage 에러메세지
     * @returns {void}
     */
    setParamMessess (isError, errorMessage) {
      this.captchaInputParams.isError = isError
      this.captchaInputParams.isSuccess = !isError
      this.captchaInputParams.errorMessage = errorMessage
      this.getNaverVoiceCaptchKey()
      this.noticeCaptchaActivation()
    }
  }
}
</script>
