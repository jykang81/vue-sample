<template>
  <div>
    <button class="CaptchaButton" @click="getImageCaptcha">
      이미지 캡차
    </button>
    <button class="CaptchaButton" @click="getSoundCaptcha">
      음성 캡차
    </button>
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
import NaverImageCaptcha from '@/views/test/TestNaverImageCaptcha'
import NaverVoiceCaptcha from '@/views/test/TestNaverSoundCaptcha'

export default {
  name: 'TestNaverCaptcha',
  components: {
    NaverImageCaptcha,
    NaverVoiceCaptcha
  },
  data () {
    return {
      currentComponent: ''
    }
  },
  created () {
    this.getImageCaptcha()
  },
  methods: {
    getImageCaptcha () {
      this.currentComponent = 'NaverImageCaptcha'
    },
    getSoundCaptcha () {
      this.currentComponent = 'NaverVoiceCaptcha'
    }
  }
}
</script>

<style scoped lang="scss">
  .CaptchaButton {
    background-color: white;
    color: black;
    border: 2px solid #4CAF50;
    margin: 10px;
  }
</style>
