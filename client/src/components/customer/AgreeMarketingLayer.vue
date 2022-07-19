<template>
  <!-- 버튼 2개 시작 -->
  <div class="popup_container">
    <div
      class="dimmed_all"
      @click="layerClose"
    />
    <div class="popup">
      <!-- layer 시작 -->
      <div class="contents marketing">
        <p class="guide">
          [NSmall] {{ param.agreeDate }}에 요청하신<br>
          이메일, SMS, 전화 수신 동의가<br>
          다음과 같이 처리되었습니다.
        </p>
        <div class="box">
          <ul class="msg_bullet_list">
            <li>SMS 수신 동의 여부 : {{ param.isSms }}</li>
            <li>이메일 수신 동의 여부 : {{ param.isEmail }}</li>
            <li>전화 수신 동의 여부 : {{ param.isTel }}</li>
          </ul>
        </div>
      </div>
      <div class="button">
        <button
          type="button"
          class="btn coral"
          @click="layerClose"
        >
          확인
        </button>
      </div>
      <!-- layer 끝 -->
    </div>
  </div>
</template>

<script>
import uiUtil from '@utils/uiUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  mounted () {
    uiUtil.disableScroll()
  },
  methods: {
    /**
     * 메세지 팝업
     *
     * @returns {void}
     */
    layerClose () {
      uiUtil.enableScroll()
      this.$store.commit('popup/hideWithoutBack', { isOk: true })
    }
  }
}
</script>
