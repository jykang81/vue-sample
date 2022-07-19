<template>
  <!-- 서클 4.5 슬라이드형 -->
  <section name="_EZ_HOME_TOPD_ESPOT_CNTNTCIRCLESLIDE" class="cirlce_slide_list">
    <splide
      ref="exhibition"
      :options="options"
      class="exhibition"
    >
      <splide-slide
        v-for="(value, index) in espotData"
        :key="`${index}`"
        :class="`${setNewIcon(value.newYn)}`"
      >
        <template v-if="index < CONTENTS_MAX_LENGTH">
          <div
            aria-label="배너 목록"
            class="banner_box"
            @click="bannerCommonClickEvent(
              value.clickTarget,
              value.contentsId,
              value.clickCode,
              value.espotId,
              value.mdUrl,
              null,
              '버튼배너',
              isNull(value.marketingText) ? value.contentName : value.marketingText
            )"
          >
            {{ value.marketingText || '상품이미지' }}
            <figure>
              <ns-img
                :src="value.imgUrl"
                :alt="value.marketingText"
                type="WIDE"
              />
            </figure>
            <span>
              {{ getCutBytes(getHtmlDecode(value.marketingText)) }}
            </span>
          </div>
        </template>
      </splide-slide>
    </splide>
  </section>
</template>

<script>
import anchorMixin from '@/mixins/store/home/anchorMixin'
import NsImg from '@components/common/NsImg'
import { Splide, SplideSlide } from '@splidejs/vue-splide'

export default {
  name: 'CircleSlideList',
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
    },
    espotExtendList: {
      type: Object,
      required: true
    }
  }, // espot 조회 결과 객체
  data () {
    return {
      options: {
        pagination: false,
        arrows: false,
        fixedWidth: '7.2rem',
        padding: '1.6rem',
        gap: '1.6rem'
      },
      slides: this.espotData,
      CONTENTS_MAX_LENGTH: 15
    } // 전시회 swiper 객체
  },
  methods: {
    /**
     * API 응답값(newYn)에 따라 new 아이콘 노출, 미노출 클래스 반환.
     * @param {String} hasNewYn
     * @returns {String}
     */
    setNewIcon (hasNewYn) {
      return (hasNewYn === 'Y') ? 'new' : ''
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/CircleSlideList";
</style>
