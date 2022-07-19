<template>
  <div>
    <div class="contents terms">
      <div>
        {{ param.title }}
      </div>
      <div>
        주소를 입력하세요 :
        <input
          v-model="address"
          type="text"
        >
      </div>
    </div>
    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="$store.commit('popup/hideWithoutBack', address)"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      address: ''
    }
  }
}
</script>
