<template>
  <div>
    <div class="contents terms">
      <div>
        자동 팝업 {{ myIndex }}
      </div>
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
export default {
  data () {
    return {
      myIndex: 6
    }
  }
}
</script>
