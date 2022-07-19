<template>
  <div>
    <h1>라우터 parameter 테스트2</h1>
    <br>
    this.$route.query 값 : {{ this.$route.query }}
    <br>
    this.$route.params 값 : {{ this.$route.params }}
    <br>
    <br>
    <h2>라우터 parameter 테스트1으로 이동</h2>
    <br>
    <router-link
      to="/test/test-router"
    >
      /test/test-router
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
    // 쿼리 전달된거 꺼내 쓰기
    console.log('create ====')
    console.log('this.$route.params : ', this.$route.params)
    console.log('this.$route : ', this.$route)
    console.log('this.$route.query : ', this.$route.query)
  },
  updated () {
  },
  methods: {
    changeProp () {
    }
  }
}
</script>
