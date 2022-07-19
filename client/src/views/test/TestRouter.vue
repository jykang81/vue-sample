<template>
  <div>
    <h1>라우터 parameter 테스트 - 사용법은 소스코드 확인</h1>
    <br>
    this.$route.query 값 : {{ this.$route.query }}
    <br>
    this.$route.params 값 : {{ this.$route.params }}
    <br>
    <br>
    <h2>1. 라우터 링크 tag 사용(&lt;router-link&gt;)</h2>
    <br>
    <h3>1.1. 단순 링크</h3>
    <br>
    <router-link
      to="/test/test-router"
    >
      /test/test-router
    </router-link>
    <br>
    <br>
    <h3>1.2. query 스트링 포함</h3>
    <br>
    <router-link
      :to="{ path: '/test/test-router', query: { param1:'param1', param2: 'param2'}}"
    >
      /test/test-router?param1=param1&amp;param2=param2
    </router-link>
    <br>
    <br>
    <h3>1.3. path에 변수 사용</h3>
    <br>
    router 설정 :
    <pre>
    {
      path: 'test-router2/:param1', // url 정의. 반드시 유니크 해야한다.
      name: 'testRouter2',          // 사용할 기본 레이아웃 컴포넌트 정의
      redirect: '/test/test-main',  // 리다이렉트가 필요할때 사용
      component: () => import(/* webpackChunkName: "TestRouter/TestRouter" */ '@/views/test/TestRouter') // 연결될 컴포넌트 파일
      meta: {  // 레이아웃 타이틀, 타이틀을 사용하지 않으면 설정 불필요
        title: '테스트 메인'
      }
    },
    </pre>
    <router-link
      :to="{ path: '/test/test-router2/callPath'}"
    >
      /test/test-router2/callPath
    </router-link>
    <br>
    <router-link
      :to="{ name: 'testRouter2', params: { param0: 'callName'}}"
    >
      /test/test-router2/callName
    </router-link>

    <br>
    <br>
    <h2>2. script에서 사용( router.push() )</h2>
    <br>
    <h3>2.1. 이름으로 이동</h3>
    <br>
    router.push({ name: 'testRouter', query: { param1: 'param1', param2: 'param2' }})
    <br>
    router.push({ name: 'testRouter2', params: { param0: 'param0' }})
    <br>
    <br>
    <h3>2.2. path로 이동</h3>
    <br>
    router.push({ name: '/test/test-router', query: { param1: 'param1', param2: 'param2' }})
    <br>
    router.push({ path: '/test/test-router2', params: { param0: 'param0' }})

    <br>
    <br>
    <h2>3. &lt;router-link&gt; 사용과 일반 a tag 이동</h2>
    <br>
    &lt;router-link&gt;를 사용 시 동일 페이지 이동은 페이지 리로드가 되지 않는다.
    <br>
    즉 vue의 life cycle의 create()가 실행되지 않음
    <br>
    <h3>3.1. &lt;router-link&gt; 이동</h3>
    <br>
    <router-link
      to="/test/test-router"
    >
      동일 페이지 이동 : /test/test-router
    </router-link>
    <br>
    <router-link
      to="/test/test-router3"
    >
      다른 페이지 이동 : /test/test-router3
    </router-link>

    <br>
    <br>
    <h3>3.2. a tag 이동</h3>
    <a href="/test/test-router">동일 페이지 이동 : /test/test-router</a>
    <br>
    <a href="/test/test-router3">다른 페이지 이동 : /test/test-router3</a>

    <br>
    <br>
    <h2>3. form 사용</h2>
    <br>
    Vue 페이지는 post를 받을 수 없음
    <br>
    &lt;form
    method="post"
    action="<b>/test/test-router3</b>"
    &gt;

    <br>
    <br>
    <form
      method="post"
      action="/test/test-router3"
    >
      <input
        name="param1"
        value="param1"
      >
      <input
        type="submit"
        value="데이터 보내기"
      >
    </form>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
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
    console.log('update ====')
  },
  methods: {
    changeProp () {
    }
  }
}
</script>
