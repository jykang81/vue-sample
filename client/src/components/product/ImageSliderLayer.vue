<template>
  <div class="image_slider_layer">
    <swiper
      ref="swiperTop"
      :options="swiperOptionTop"
      class="swiper_gallery_top"
      @slideChange="handleTopSlideChange"
    >
      <swiper-slide
        v-for="(photo,index) in (productPhotoList) "
        :key="index"
        :class="`slide_${index+1}`"
      >
        <pinch-zoom :properties="pinchZoomOptions">
          <ns-img
            :src="photo.photoPath"
            :alt="htmlDecode(param.productName)"
          />
        </pinch-zoom>
      </swiper-slide>
    </swiper>
    <swiper
      ref="swiperThumbs"
      :options="swiperOptionThumbs"
      class="swiper_gallery_thumbs"
      @click.native="handleThumbnailClick"
    >
      <swiper-slide
        v-for="(photo,index) in (productPhotoList) "
        :key="index"
        :class="getSlideClassName(index)"
      >
        <ns-img
          :src="photo.photoPath"
          :alt="htmlDecode(param.productName)"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import Vue from 'vue'
import PinchZoom from 'vue-pinch-zoom'
import NsImg from '@components/common/NsImg'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

Vue.component('pinch-zoom', PinchZoom)

export default {
  name: 'ImageSliderLayer',
  components: {
    NsImg
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      swiperOptionTop: { // 상품이미지 스와이퍼 옵션
        loop: false,
        spaceBetween: 0
      },
      swiperOptionThumbs: { // 썸네일 스와이퍼 옵션
        loop: false,
        spaceBetween: 8,
        slidesPerView: 'auto'
      },
      activeThumbnailClassName: 'active_thumbnail', //  활성화된 썸네일 클래스명
      activeThumbnailIndex: 0, // 활성화된 썸네일 인덱스
      pinchZoomOptions: {
        doubleTap: false, // 더블 탭 기능 끄기
        listeners: 'auto', // 데스크탑 zoom 기능 방지
        minScale: 1 // 최소화 크기 제한
      }
    }
  },
  computed: {
    /**
     * 상품이미지
     *
     * @returns {array} 상품이미지
     */
    productPhotoList () {
      return this.param.photoList || ['noImg']
    },
    /**
     * 상품이미지 swiper 객체
     */
    topSwiper () {
      return this.$refs.swiperTop.$swiper
    },
    /**
     * 상품 썸네일이미지swiper 객체
     */
    thumbnailSwiper () {
      return this.$refs.swiperThumbs.$swiper
    }
  },
  methods: {
    htmlDecode,
    /**
     * 상품 슬라이더 인덱스에 따라 썸네일 슬라이더 따라 동작
     *
     */
    handleTopSlideChange () {
      const activeIndex = this.topSwiper.activeIndex
      this.setThumbnailClass(activeIndex)
    },
    /**
     * 썸네일 클릭 이벤트
     *
     */
    handleThumbnailClick () {
      const clickedThumbnailIndex = this.thumbnailSwiper.clickedIndex

      // thumbnail 외부 영역 클릭 예외 처리
      if (clickedThumbnailIndex === undefined) {
        return
      }

      this.topSwiper.slideTo(clickedThumbnailIndex)
      this.setThumbnailClass(clickedThumbnailIndex)
    },
    /**
     * 썸네일 클래스명 설정
     * @param {Number} index 인덱스
     */
    setThumbnailClass (index) {
      this.activeThumbnailIndex = index
    },
    /**
     * 썸네일 클래스명
     *
     * @param {Number} index 인덱스
     * @returns {String} 클래스명
     */
    getSlideClassName (index) {
      return `slide_${index + 1} ${this.activeThumbnailIndex === index ? this.activeThumbnailClassName : ''}`
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/product/ImageSliderLayer";
</style>
