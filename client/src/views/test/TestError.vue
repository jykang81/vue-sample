<template>
  <div>
    에러테스트 페이지 오류 발생 중 개발자 모드 켜서 콘솔창을 볼것
    <button @click="doIt">
      Do It
    </button>
    {{ name }}
    {{ name2 }}
  </div>
</template>

<script>
/* eslint-disable */
/* 에러 강제 발생 페이지 console.log를 결과를 확인하시오 */

//이거 잘 동작을 안하더라..
/* 
window.onerror = function(message, source, line, column, error) {
  console.log('ONE ERROR HANDLER TO RULE THEM ALL:', message)
}
 */
export default {
  data () {
    return {
    }
  },
  computed: {
    name2 () {
      return ''
    }
  },
  created () {
    // const data = {
    //   "data": "this is test data"
    // }
    // this.$log.info(data)
  },
  methods: {
    doIt () {
      return ''
    }
  },
  //오오 이건 동작 !!
  renderError (h, err) {
    return h('pre', { style: { color: 'red' }}, err.stack)
  },
  //이건 동작 잘안하넹
  errorCaptured(err,vm,info) {
    console.log(`cat EC: ${err.toString()}\ninfo: ${info}`); 
    return false;
  }
}
</script>
