<template>
  <!-- 상단 특약배너 -->
  <div class="search_result_banner">
    <!-- 배너 이미지 -->
    <div
      v-if="dataLength === 1"
      class="search_banner"
    >
      <a
        @click="bannerCommonClickEvent(
          'Category',
          planList[0].contentsId,
          planList[0].planId,
          planList[0].planId,
          planList[0].mdUrl,
          null,
          null,
          planList[0].planNm
        )"
      >
        <figure>
          <ns-img
            :src="planList[0].imgUrl"
            :alt="planList[0].planNm"
            type="WIDE"
          />
        </figure>
      </a>
    </div>
    <!-- 배너 슬라이드 -->
    <splide
      v-else-if="dataLength > 1"
      :options="options"
      class="splide_search_banner"
    >
      <splide-slide
        v-for="(value, index) in planList"
        :key="`${index}`"
      >
        <a
          @click="bannerCommonClickEvent(
            'Category',
            value.contentsId,
            value.planId,
            value.planId,
            value.mdUrl,
            null,
            null,
            value.planNm
          )"
        >
          <figure>
            <ns-img
              :src="value.imgUrl"
              :alt="value.planNm"
            />
          </figure>
        </a>
      </splide-slide>
    </splide>
  </div>
</template>

<script>
import '@/common/directives/imgLazyLoad' // 이미지 lazyloading directives 모듈 추가
import anchorMixin from '@/mixins/store/home/anchorMixin'
import NsImg from '@components/common/NsImg'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import { Splide, SplideSlide } from '@splidejs/vue-splide'

export default {
  name: 'BannerList',
  components: {
    NsImg,
    Splide,
    SplideSlide
  },
  mixins: [
    anchorMixin
  ],
  props: {
    planList: {
      type: Array,
      required: true
    }, // 배너 리스트
    dataLength: {
      type: Number,
      required: true
    } // 배너 리스트 길이.
  },
  data () {
    return {
      mountedFlag: false,
      options: {
        type: 'loop',
        direction: 'rtl',
        padding: '1.6rem',
        start: 0,
        pagination: false,
        arrows: false
      }, // splide 객체 옵션.
      // swiperSearchBanner: {
      //   slidesPerView: 'auto',
      //   spaceBetween: 16,
      //   autoHeight: true
      // }, // swiper 객체 option
      slides: null,
      splideReloadKey: 0
    }
  },
  methods: {
    isNull
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/module/SearchResultBanner";
</style>
