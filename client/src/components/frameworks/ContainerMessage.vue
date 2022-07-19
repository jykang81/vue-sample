<template>
  <div
    v-show="isShow"
    class="popup_container"
  >
    <div
      class="dimmed_all"
    />
    <div class="popup">
      <div class="contents">
        <p
          v-if="param.msg"
          class="content"
          v-html="htmlMessage"
        />
      </div>

      <div class="button">
        <button
          v-if="param.type ==='confirm'"
          type="button"
          class="btn gray"
          @click="cancel"
        >
          {{ param.cancelTxt }}
        </button>
        <button
          type="button"
          class="btn coral"
          @click="confirm"
        >
          {{ param.okTxt }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('message', ['isShow', 'param']),

    /**
     * 개행 문자 BR 태그로 변경
     *
     * @returns {String} HTML 메시지
     */
    htmlMessage () {
      return this.param.msg.replace('\r\n', '<br/>').replace('\n', '<br/>')
    }
  },
  methods: {
    /**
     * 확인
     *
     */
    confirm () {
      if (this.param.okCallback) {
        this.param.okCallback()
      }
      this.$store.commit('message/hide')
    },
    /**
     * 취소
     *
     */
    cancel () {
      if (this.param.cancelCallback) {
        this.param.cancelCallback()
      }
      this.close()
    },
    /**
     * 닫기
     *
     */
    close () {
      this.$store.commit('message/hide')
    }
  }
}
</script>
