<template>
  <div class="guide_tab">
    <button
      type="button"
      class="tab"
      :class="[ currentTab === 'tab1' ? 'active' : '']"
      @click="gotoTermsOfUseNsmall"
    >
      NSmall
    </button>
    <button
      type="button"
      class="tab"
      :class="[ currentTab === 'tab2' ? 'active' : '']"
      @click="gotoTermsOfUseTvAndSb"
    >
      TV 홈쇼핑/쇼핑북
    </button>
  </div>
</template>

<script>
import {
  isOsApp
} from '@utils/commonutil/commonUtil'

export default {
  props: {
    currentTab: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * NSmall 이용약관 이동
     */
    gotoTermsOfUseNsmall () {
      if (isOsApp()) { // APP
        this.$router.replace('/native/terms-of-use/nsmall')
      } else { // WEB
        this.$router.replace('/common/footer/site-info/terms-of-use/nsmall')
      }
    },
    /**
     * TV홈쇼핑/쇼핑북 이용약관 이동
     */
    gotoTermsOfUseTvAndSb () {
      if (isOsApp()) { // APP
        this.$router.replace('/native/terms-of-use/tv-and-sb')
      } else { // WEB
        this.$router.replace('/common/footer/site-info/terms-of-use/tv-and-sb')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/common/footer/siteinfo/termsofuse/GuideTab";
</style>
