<template>
  <div class="loading_page">
    <strong class="subject">{{ text }}</strong>
    <p class="msg">
      잠시만 기다려 주세요.
    </p>
  </div>
</template>

<script>
export default {
  name: 'LoadingPage',
  props: {
    text: { // 이동할 페이지명
      type: String,
      required: true
    },
    preLoader: { // preLoader 사용 여부
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  created () {
    // preLoader 열기
    if (this.preLoader) {
      this.$store.commit('preLoader/show')
    }
  },
  beforeDestroy () {
    // preLoader 닫기
    this.$store.commit('preLoader/hide')
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/frameworks/LoadingPage";
</style>
