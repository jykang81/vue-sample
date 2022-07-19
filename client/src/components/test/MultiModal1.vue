<template>
  <div>
    <div class="contents terms">
      <div>
        {{ param.title }}
      </div>
      <div>
        이름 :
        <input
          v-model="name"
          type="text"
        >
      </div>
      <div>
        회원정보 1
      </div>
      <div>
        회원정보 2
      </div>
      <div>
        회원정보 3
      </div>
      <div>
        회원정보 4
      </div>
      <div>
        회원정보 5
      </div>
      <div>
        주소 :
        <input
          v-model="address"
          type="text"
          readonly
        >
        <button @click="showLayer">
          주소 입력
        </button>
      </div>
    </div>

    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="$store.commit('popup/hideWithoutBack', { name, address })"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script>
import modalUtil from '@frameworks/modalUtil'
import messageUtil from '@frameworks/messageUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      name: '',
      address: ''
    }
  },
  methods: {
    callbackFunction (address) {
      messageUtil.alert('주소 선택 완료')
      this.address = address
    },
    showLayer () {
      modalUtil.show('test/MultiModal2.vue', { title: '주소 입력' }, this.callbackFunction)
    }
  }
}
</script>
