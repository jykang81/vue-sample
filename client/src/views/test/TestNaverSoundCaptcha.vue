<template>
  <div>
    <h1>네이버 음성 캡차 테스트</h1>
    <p @click="playSound">
      {{ playMessage }}
    </p>
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
      captchaSound: '',
      playMessage: 'Play',
      resultMessage: ''
    }
  },
  created () {
    this.getNaverCaptchKey()
  },
  methods: {
    playSound () {
      this.captchaSound.play()
      this.playMessage = 'Playing...'
    },
    pauseSound () {
      this.captchaSound.pause()
      this.captchaSound.currentTime = 0
      this.playMessage = 'Play'
    },
    getNaverCaptchKey () {
      const invoke = {}
      const successHandler = res => {
        console.log(res)
        this.naverCaptchaKey = res.data
        this.captchaSound = new Audio(`${NAVER_CAPTCHA_CONST.VOICE.FILE_URL}?key=${this.naverCaptchaKey}&X-NCP-APIGW-API-KEY-ID=${NAVER_CAPTCHA_CONST.KEY.CLIENT_ID}`)
        this.captchaSound.onended = this.pauseSound
      }
      const errorHandler = err => {
        console.log(err)
      }
      this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.VOICE.API_URL}/getKey`, invoke, successHandler, errorHandler)
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
      this.$nsaxios.post(`${NAVER_CAPTCHA_CONST.VOICE.API_URL}/matchKey`, invoke, successHandler, errorHandler)
    }
  }
}
</script>
