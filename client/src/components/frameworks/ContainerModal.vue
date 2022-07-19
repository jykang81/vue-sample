<template>
  <!-- 모달이 존재할 때만 영역 노출 -->
  <div
    v-if="hasModalPopup"
  >
    <!--  Vuex store에서 popupList Array를 가져와 loop를 돌며 모달을 생성 -->
    <div
      v-for="(popup, index) in popupList"
      v-show="popup.isShow"
      :key="index"
      class="popup_container"
    >
      <div
        class="dimmed_all"
        @click="hideWithoutBack()"
      />
      <div v-if="!popup.isFullLayer" class="popup">
        <!-- vue path, param 을 파라미터로 받아 모달을 동적으로 import 함 -->
        <component
          :is="popup.path"
          ref="popupComponent"
          :param="popup.param"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    /*
      mapState 헬퍼로 Vuex Store에 저장된 popupList 를 가져온다.
      popupList 는 Array Type으로 Array 요소는 모달 정보가 담긴 Object Type으로 구성돼있다.
    */
    ...mapState('popup', ['popupList']),

    /**
     * Vuex Store 에 저장된 popupList 중에 모달이 적어도 한 개 있는지 체크
     *
     * @return {boolean} 모달 존재 유무
     */
    hasModalPopup () {
      if (this.popupList.length) {
        const isModalLayer = popupObj => !popupObj.isFullLayer
        return this.popupList.some(isModalLayer)
      }

      return false
    }
  },
  methods: {
    ...mapMutations('popup', ['hideWithoutBack'])
  }
}
</script>
