<template>
  <!-- 상단 특약배너 -->
  <section class="banner_list" name="_EZ_HOME_TOPA_ESPOT_CNTNTSLIDEEXTEND">
    <template
      v-if="bannerData && bannerData.length === 1"
    >
      <div class="top_banner">
        <figure
          aria-label="배너"
          @click="bannerCommonClickEvent(
            bannerData[0].clickTarget,
            bannerData[0].contentsId,
            bannerData[0].clickCode,
            bannerData[0].espotId,
            bannerData[0].mdUrl,
            null,
            '메인_상단배너',
            isNull(bannerData[0].marketingText) ? bannerData[0].contentName : bannerData[0].marketingText
          )"
        >
          <ns-img
            :src="bannerData[0].imgUrl"
            :alt="bannerData[0].marketingText !== '' ? bannerData[0].marketingText : '메인 상단배너'"
            type="WIDE"
          />
        </figure>
      </div>
    </template>
    <template v-else-if="bannerData && bannerData.length > 1">
      <!-- 이미지 슬라이드 영역 -->
      <splide
        :key="splideReloadKey"
        :options="options"
        class="splide_top_banner"
      >
        <splide-slide
          v-for="(value, index) in bannerData"
          :key="`${index}`"
        >
          <figure
            aria-label="배너 목록"
            @click="bannerCommonClickEvent(
              value.clickTarget,
              value.contentsId,
              value.clickCode,
              value.espotId,
              value.mdUrl,
              null,
              '메인_상단배너',
              isNull(value.marketingText) ? value.contentName : value.marketingText
            )"
          >
            <img
              :src="value.imgUrl"
              :alt="value.marketingText !== '' ? value.marketingText : '메인 상단배너'"
            >
          </figure>
        </splide-slide>
      </splide>
      <!-- // 이미지 슬라이드 영역 -->
      <button
        type="button"
        class="btn_banner_view_open"
        @click="bannerAllViewOpen"
      >
        <img
          src="~@/assets/images/common/icons_banner_view.png"
          alt="배너전체보기"
        >
      </button>
    </template>
    <!-- 배너전체보기 -->
    <div
      class="banner_all_view_layer"
      :class="bannerAllView ? 'active' : ''"
    >
      <button
        type="button"
        class="btn_banner_view_close"
        @click="bannerAllViewClose"
      >
        <img
          src="~@/assets/images/common/icons_close.png"
          alt="배너전체닫기"
        >
      </button>
      <ul class="banner_list">
        <li
          v-for="(value, index) in bannerData"
          :key="`${index}`"
        >
          <figure
            aria-label="배너 목록"
            @click="bannerCommonClickEvent(
              value.clickTarget,
              value.contentsId,
              value.clickCode,
              value.espotId,
              value.mdUrl,
              null,
              '메인_상단배너',
              isNull(value.marketingText) ? value.contentName : value.marketingText
            )"
          >
            <ns-img
              :src="value.imgUrl"
              :alt="value.marketingText !== '' ? value.marketingText : '메인 상단배너'"
              type="WIDE"
            />
          </figure>
        </li>
      </ul>
    </div>
  </section>
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
    espotData: {
      type: Array,
      required: true
    }, // 배너 리스트
    espotExtendList: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      bannerData: this.espotData, // 배너 슬라이드 데이터.
      mountedFlag: false,
      options: {
        type: 'loop',
        start: this.getRandomSortIndex(),
        rewind: true,
        padding: '1.6rem',
        gap: '1.6rem',
        autoplay: true,
        interval: 5000,
        pagination: false,
        arrows: false
      },
      slides: this.espotData,
      splideReloadKey: 0
    }
  },
  mounted () {
    this.mountedFlag = true
  },
  activated () {
    ++this.splideReloadKey
  },
  methods: {
    /**
     * 최소값, 최대값을 포함하는 난수 생성후 반환. (전 인덱스와 반환 인덱스가 같을수도 있음. --> 랜덤에 대한 기획 x)
     * @returns {Object} resultNumber
     */
    getRandomSortIndex () {
      const min = 0
      const max = !isNull(this.espotData) ? this.espotData.length - 1 : 0 // 데이터 인덱스 제한.
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min // 최소값, 최대값을 포함하는 난수 생성.
      return randomNumber
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/module/BannerList";
</style>
