<template>
  <div>
    <div class="contents terms">
      <div>
        자동 팝업 {{ myIndex }}
      </div>
      <div>
        콜백으로 받아온 팝업 번호
        <input
          v-model="callbackIndex"
          type="text"
          readonly
        >
      </div>
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div>
    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="$store.commit('popup/hideWithoutBack', myIndex)"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script>
import modalUtil from '@frameworks/modalUtil'

export default {
  data () {
    return {
      myIndex: 1,
      callbackIndex: 0
    }
  },
  created () {
    modalUtil.show('test/ChainModal2.vue', {}, this.callbackFunction)
  },
  methods: {
    callbackFunction (myIndex) {
      this.callbackIndex = myIndex
    }
  }
}
</script>
