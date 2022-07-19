<template>
  <!-- image lazy loadig을 적용할 영역의 상위 엘리먼트에 v-img-lazy-load directive를 설정한다 -->
  <div v-img-lazy-load>
    <!-- img 태그는 반드시 고정된 width, height 값이 있어야 하며 src 대신 data-src 에 이미지 경로를 설정해준다 -->
    <img v-for="n in 100" :key="n" :data-src="`https:/i.picsum.photos/id/${n}/600/600.jpg`" class="conatiner" alt="">
  </div>
</template>

<script>
import '@/common/directives/imgLazyLoad' // 이미지 lazyloading directives 모듈 추가

export default {

}
</script>

<style>
  .conatiner {
    width: 600px;
    height: 600px;
  }
</style>
