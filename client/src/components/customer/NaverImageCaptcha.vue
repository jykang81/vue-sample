<template>
  <div class="captcha_contents">
    <!-- 이미지캡차 -->
    <div class="captcha_box">
      <span class="captcha_img">
        <img
          v-if="naverImageCaptchaSrc !== ''"
          :src="naverImageCaptchaSrc"
          width="100%" height="100%"
          alt="캡차이미지"
        >
      </span>
      <div class="captcha_button">
        <button
          type="button"
          class="btn voice"
          @click="changeCaptchaComponent(false)"
        >
          <span>음성듣기</span>
        </button>
        <button
          type="button"
          class="btn refresh"
          @click="getNaverImageCaptchKey"
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
  name: 'NaverImageCaptcha',
  components: {
    NsInput
  },
  data () {
    return {
      naverImageCaptchaKey: '', // 네이버 이미지 캡차 API key 값
      naverImageCaptchaSrc: '', // 캡차 이미지 주소
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
        errorMessage: NAVER_CAPTCHA_CONST.RESULT_MESSAGES.VERIFICATION_FAILURE
      }
    }
  },
  created () {
    this.getNaverImageCaptchKey()
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

    this.getNaverImageCaptchKey()
  },
  methods: {
    /**
     * 이미지 캡차 키 갱신 API 호출 및 캡차 이미지 설정
     */
    getNaverImageCaptchKey () {
      const params = {}

      const successHandler = res => {
        this.naverImageCaptchaKey = res.data // 네이버 이미지 캡차 키

        this.naverImageCaptchaSrc = `${NAVER_CAPTCHA_CONST.IMAGE.FILE_URL}?key=${this.naverImageCaptchaKey}&X-NCP-APIGW-API-KEY-ID=${NAVER_CAPTCHA_CONST.KEY.CLIENT_ID}` // 캡차 이미지 갱신

        this.captchaInputParams.value = ''
        this.resultMessage = '' // 캡차 입력 검증 결과 메시지 초기화
      }

      this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.IMAGE.API_URL}/getKey`, params, successHandler)
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
        key: this.naverImageCaptchaKey,
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

          this.getNaverImageCaptchKey()
        }
      }

      const errorHandler = () => {
        resultObject.result = false
        this.resultMessage = NAVER_CAPTCHA_CONST.RESULT_MESSAGES.SERVICE_PROC_ERROR_COMMON
      }

      await this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.IMAGE.API_URL}/matchKey`, params, successHandler, errorHandler)

      return resultObject
    },
    /**
     * 부모컴포넌트 음성성캡챠로 변경
     *
     * @param {boolean} isImageCaptcha 음성캡차로 전환여부
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
      this.getNaverImageCaptchKey()
      this.noticeCaptchaActivation()
    }
  }
}
</script>
