<template>
  <div>
    컴포넌트간 데이터 전달 테스트 - Vuex 이용(store)
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  updated () {
  },
  methods: {
    // callback 함수
    popClose (result) {
      console.log('popClose call callback : ', result)
    },
    // 바인딩된 변수 변경 테스트 함수
    changeProp () {
      this.componentName = 'rrrrr2'
      this.parameters.param1 = 'rrrrr2'
    }
  }
}
</script>
