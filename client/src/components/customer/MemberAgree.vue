<template>
  <div class="member_agree">
    <div class="contents terms">
      <p class="title">
        {{ param.title }}
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
      mallUserGuide: '', // mall 가이드 (html)
      mobileGuide: '' // 현재 미사용. 차후 대비
    }
  },
  created () {
    this.mallUserGuide = this.param.mallUserGuide
    this.mobileGuide = this.param.mobileGuide
  },
  methods: {}
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/customer/MemberAgree";
</style>
