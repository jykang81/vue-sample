<template>
  <div>
    <h1 :style="styledObject">
      테스트 샘플 메인
    </h1>

    <router-link
      to="/test/test-data"
      class="test_link"
    >
      컴포넌트간 데이터 전달 - prop & emmit
    </router-link>

    <router-link
      to="/test/test-router"
      class="test_link"
    >
      Vue Router 파라메터 전달하기
    </router-link>

    <router-link
      to="/test/test-extend"
      class="test_link"
    >
      object merge
    </router-link>

    <router-link
      to="/test/test-checkbox"
      class="test_link"
    >
      DOM 제어 - checkbox
    </router-link>
    <router-link
      to="/test/test-class"
      class="test_link"
    >
      DOM 제어 - class
    </router-link>
    <router-link
      to="/test/test-binding"
      class="test_link"
    >
      DOM 제어 - attribute binding
    </router-link>

    <router-link
      to="/test/test-input2"
      class="test_link"
    >
      UI component - input 예제
    </router-link>
    <router-link
      to="/test/test-password"
      class="test_link"
    >
      UI component - password 예제
    </router-link>
    <router-link
      to="/test/test-input-phone"
      class="test_link"
    >
      UI component - input phone 예제
    </router-link>
    <router-link
      to="/test/test-quantity-input"
      class="test_link"
    >
      UI component - QuantityControlInput 예제
    </router-link>
    <router-link
      to="/test/test-popup"
      class="test_link"
    >
      레이어 팝업 & 레이어 메시지(alert, confirm, error) & 토스트 메시지 예제
    </router-link>
    <router-link
      to="/test/test-search-address"
      class="test_link"
    >
      우편번호 찾기
    </router-link>
    <router-link
      to="/test/test-img-lazy-load"
      class="test_link"
    >
      이미지 lazy loading
    </router-link>
    <router-link
      to="/test/test-infinite-scroll"
      class="test_link"
    >
      무한 스크롤
    </router-link>
    <router-link
      to="/test/test-intersection-observer"
      class="test_link"
    >
      무한스크롤 (intersection observer)
    </router-link>
    <router-link to="/test/test-picker" class="test_link">
      달력 테스트 중
    </router-link>
    <router-link to="/test/test-websocket" class="test_link">
      Ns Talk
    </router-link>
    <router-link to="/test/test-naver-captcha" class="test_link">
      네이버 캡차
    </router-link>
    <!-- <router-link to="/test/test-nhn-log" class="test_link">
      NHN 유입 추적 스크립트
    </router-link> -->
    <router-link to="/test/test-ga360-log" class="btn">
      GA 360
    </router-link>
    <router-link to="/test/test-recobell-log" class="btn">
      Recobell 테스트
    </router-link>
    <router-link to="/test/test-common-log" class="btn">
      공통 로깅
    </router-link>
    <router-link to="/test/test-common-timer" class="test_link">
      공용 타이머 테스트
    </router-link>
    <router-link to="/test/test-aiqua-log" class="btn">
      AIQUA 테스트
    </router-link>
    <router-link to="/test/test-wish" class="test_link">
      찜하기 테스트
    </router-link>
    <router-link to="/test/test-airbridge-log" class="btn">
      Airbridge 테스트
    </router-link>
    <router-link to="/test/test-naver-log" class="btn">
      네이버로그 테스트
    </router-link>
    <router-link to="/test/test-dtsi-log" class="btn">
      DTSI 로그 테스트
    </router-link>
    <router-link to="/test/test-sendHsmoa-log" class="btn">
      홈쇼핑모아 테스트
    </router-link>
    <router-link to="/test/test-fbpixel-log" class="btn">
      페이스북 픽셀 테스트
    </router-link>
    <router-link to="/test/test-app2web-log" class="btn">
      APP --> WEB 전송 테스트
    </router-link>
    <router-link to="/test/test-deeplink" class="btn">
      딥링크 테스트
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      styledObject: {
        'text-align': 'center',
        margin: '15px'
      }
    }
  }
}
</script>

<style scoped>
  a {
    display: block;
    margin-bottom: 10px;
  }
  a.test_link {
    display: block;
    margin-bottom: 10px;
  }
</style>
