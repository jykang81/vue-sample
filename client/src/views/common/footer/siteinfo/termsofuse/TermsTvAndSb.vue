<template>
  <div class="terms_tv_and_sb">
    <!-- 가이드 탭  -->
    <guide-tab :current-tab="currentTab" />

    <!-- 홈쇼핑/쇼핑북 가이드 -->
    <div
      v-show="shopNBookGuide"
      class="terms_frame"
      v-html="shopNBookGuide"
    />
  </div>
</template>

<script>
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import GuideTab from '@/views/common/footer/siteinfo/termsofuse/GuideTab'

export default {
  components: {
    GuideTab
  },
  data () {
    return {
      currentTab: 'tab2',
      shopNBookGuide: '', // 홈쇼핑/쇼핑북 가이드 (html)
      mobileGuide: '' // 현재 미사용. 차후 대비
    }
  },
  created () {
    this.getTermsOfUseData()
  },
  methods: {
    /**
     * 이용약관 조회
     */
    getTermsOfUseData () {
      this.$nsaxios.post('MallUserGuideContentReal', {}, this.setTermsOfUseData)
    },
    /**
     * 이용약관 데이터 갱신
     * @param {object} response 이용약관 API 반환값
     */
    setTermsOfUseData (response) {
      const commonResultPath = response.msg.root

      this.shopNBookGuide = htmlDecode(commonResultPath.ShopNBookGuide)
      this.mobileGuide = htmlDecode(commonResultPath.MobileAgree)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/common/footer/siteinfo/termsofuse/TermsTvAndSb";
</style>
