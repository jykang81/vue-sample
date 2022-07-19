<template>
  <div class="facebook_member_agree">
    <div class="contents terms">
      <p class="title">
        이용약관
      </p><!-- 쇼핑몰 가이드 -->
      <div
        v-show="mallUserGuide"
        class="terms_frame"
        v-html="mallUserGuide"
      />
    </div>
    <div class="button">
      <button
        type="button"
        class="btn_cancel"
        @click="$store.commit('popup/hideWithoutBack', { isAgreeTerms })"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isAgreeTerms: true,
      mallUserGuide: '' // mall 가이드 (html)
    }
  },
  created () {
    this.mallUserGuide = this.param.mallUserGuide
  },
  methods: {}
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/customer/FacebookMemberAgree";
</style>
