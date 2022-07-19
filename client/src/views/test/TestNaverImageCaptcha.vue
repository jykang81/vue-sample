<template>
  <div>
    <h1>네이버 이미지 캡차 테스트</h1>
    <img v-if="captchaImageSrc !== ''" :src="captchaImageSrc" alt="캡차이미지"> <br>
    <input v-model="naverCaptchaInputValue"> <br>
    <p>{{ resultMessage }}</p>
    <button @click="matchNaverCaptchaValue">
      인증하기
    </button> <br>
    <button @click="getNaverCaptchKey">
      재발급
    </button>
  </div>
</template>

<script>
import { NAVER_CAPTCHA_CONST } from '@constants/customer/captcha'
export default {
  name: 'TestNaverCaptcha',
  data () {
    return {
      naverCaptchaKey: '',
      naverCaptchaInputValue: '',
      captchaImageSrc: '',
      resultMessage: ''
    }
  },
  created () {
    this.getNaverCaptchKey()
  },
  methods: {
    getNaverCaptchKey () {
      const invoke = {}
      const successHandler = res => {
        console.log(res)
        this.naverCaptchaKey = res.data
        this.captchaImageSrc = `${NAVER_CAPTCHA_CONST.IMAGE.FILE_URL}?key=${this.naverCaptchaKey}&X-NCP-APIGW-API-KEY-ID=${NAVER_CAPTCHA_CONST.KEY.CLIENT_ID}`
      }
      const errorHandler = err => {
        console.log(err)
      }
      this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.IMAGE.API_URL}/getKey`, invoke, successHandler, errorHandler)
    },
    matchNaverCaptchaValue () {
      const invoke = {
        key: this.naverCaptchaKey,
        value: this.naverCaptchaInputValue
      }
      const successHandler = res => {
        console.log(res)
        const result = res.data.result
        if (result === true) {
          this.resultMessage = '인증 성공'
        } else {
          this.resultMessage = '인증 실패'
          this.getNaverCaptchKey()
        }
      }
      const errorHandler = () => {
        this.resultMessage = '서버 에러'
      }
      this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.IMAGE.API_URL}/matchKey`, invoke, successHandler, errorHandler)
    }
  }
}
</script>
