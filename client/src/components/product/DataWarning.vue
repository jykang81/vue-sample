<template>
  <div class="data_warning">
    <div class="alert_content">
      <p class="copy">
        3G/LTE 등으로 접속시<br>데이터 통화료가 발생할 수 있습니다.
      </p>
      <div class="button_alert_wrap">
        <button
          class="btn_cancel"
          @click="closeDataWarning"
        >
          <span>취소</span>
        </button>
        <button
          class="btn_confirm"
          @click="playVideo"
        >
          <span>확인</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /**
     * 팝업 닫기
     */
    closeDataWarning () {
      this.$emit('closeDataWarning')
    },
    /**
     * 재생
     */
    playVideo () {
      this.$emit('playVideo')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/product/DataWarning";
</style>
