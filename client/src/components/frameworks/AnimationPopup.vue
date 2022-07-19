<template>
  <!-- 팝업 영역 표시 여부 -->
  <div class="animation_popup">
    <div
      class="dimmed_all"
      :class="[isShow ? 'active' : '']"
      @click="closePopup"
    />
    <div class="animation_popup_contents">
      <!-- 팝업 컨텐츠 -->
      <component
        :is="animationPopup.dynamicComponent"
        v-if="animationPopup"
        v-show="isShow"
        ref="popupComponent"
        v-touch:swipe.bottom="closePopupOnlyApp"
        :param="animationPopup.param"
        :style="isShow ? animationStyle : null"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'

export default {
  computed: {
    ...mapState('animationPopup', ['animationPopup', 'isShow', 'animationStyle'])
  },
  methods: {
    /**
     * 팝업 닫기
     */
    closePopup () {
      this.$store.commit('animationPopup/hide') // animation popup 닫기 요청
    },
    /**
     * 앱일 때만 팝업 닫기
     */
    closePopupOnlyApp () {
      if (isOsApp()) {
        this.$store.commit('animationPopup/hide') // animation popup 닫기 요청
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/frameworks/AnimationPopup";
</style>
