<template>
  <div v-if="hasFullLayerPopup">
    <div
      v-for="(popup, index) in popupList"
      :key="index"
      ref="fullLayer"
      class="full_layer"
    >
      <app-header-default v-if="popup.isShowHeader" :popup-obj="popup" />
      <!-- 헤더가 있는 경우만 div로 감싼다 -->
      <div v-if="popup.isShowHeader" class="app_container">
        <component
          :is="popup.path"
          v-show="popup.isFullLayer && popup.isShow"
          :param="popup.param"
        />
      </div>
      <component
        :is="popup.path"
        v-else
        v-show="popup.isFullLayer && popup.isShow"
        :param="popup.param"
      />
      <app-footer v-if="currentPopupParam.footerShow" />
      <app-bottom-navi v-if="!isOsApp() && currentPopupParam.bottomShow" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AppHeaderDefault from '@components/layouts/items/AppHeaderMain'
// import AppHeaderDefault from '@components/layouts/items/AppHeaderDefault'
import AppBottomNavi from '@components/layouts/items/AppBottomNavi'
import AppFooter from '@components/layouts/items/AppFooter'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'

export default {
  name: 'ContainerFullLayer',
  components: {
    AppHeaderDefault,
    AppBottomNavi,
    AppFooter
  },
  computed: {
    ...mapState('popup', ['popupList']),
    ...mapGetters('popup', ['hasFullLayerPopup']),
    currentPopupParam () {
      const popupLength = this.popupList.length
      return this.popupList[popupLength - 1].param || {}
    }
  },
  methods: {
    isOsApp
  }
}
</script>
