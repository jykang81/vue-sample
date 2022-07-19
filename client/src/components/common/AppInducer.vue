<template>
  <div class="app_inducer">
    <section class="appgo_popup_section active">
      <div class="appgo_popup_wrap">
        <div class="info_wrap">
          <div class="appgo_logo" />
          <h2 class="appgo_info">
            모바일 앱 전용혜택 TV 상품
            <strong>7%적립 + 5%할인</strong>
          </h2>
        </div>
        <div class="appgo_button">
          <!-- <a class="link_appgo ui-link" role="button" @click="gotoAppMarket">앱으로 보기</a> -->
          <button id="deeplinking-show-app" type="button" class="link_appgo">
            앱으로 보기
          </button>
        </div>
        <div class="close_button">
          <button type="button" class="icon_close" @click="handlePopupClosingClick">
            <span class="blind">팝업 닫기</span>
          </button>
        </div>
      </div>
      <div class="web_go">
        <a @click.prevent="handlePopupClosingClick">모바일 웹에서 쇼핑하기</a>
      </div>
    </section>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  gotoAppMarket
} from '@utils/commonutil/commonUtil'

export default {
  name: 'AppInducer',
  mounted () {
    // 앱으로 보기
    window.airbridge.setDeeplinks({
      buttonID: 'deeplinking-show-app',
      // or ["deeplink-button-1", "deeplink-button-2", ...]
      deeplinks: {
        ios: 'nsmall://',
        android: 'nsmall://'
      },
      fallbacks: {
        ios: 'itunes-appstore',
        // itunes-appstore(default), google-play, url
        android: 'google-play'
        // google-play(default), itunes-appstore, url
      }
    })
  },
  methods: {
    gotoAppMarket,
    handlePopupClosingClick () {
      sessionStorage.setItem(COMM_CONST.SESSION_STORAGE_KEY.ATTRACT_APP_DOWN_BANNER, 'Y')

      this.$store.commit('popup/hideWithoutBack') // 팝업 닫기
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/AppInducer";
</style>
