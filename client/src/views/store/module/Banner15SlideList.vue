<template>
  <!-- 배너 1.5 슬라이드형 -->
  <section class="banner_15_slide_list" name="_EZ_HOME_TOPE_ESPOT_CNTNTSLIDE15W">
    <div v-if="hasEspotExtendList()" class="title_tag border_bold">
      <p class="title">
        {{ brTagReplaceAll(getHtmlDecode(espotExtendList.titleContent.mainTitle)) }}
      </p>
      <p class="tag">
        {{ brTagReplaceAll(getHtmlDecode(espotExtendList.titleContent.subTitle)) }}
      </p>
    </div>
    <div v-if="childEspotData.contents.length === 1" class="simple_single">
      <figure
        aria-label="배너"
        @click="bannerCommonClickEvent(
          espotData[0].clickTarget,
          espotData[0].contentsId,
          espotData[0].clickCode,
          espotData[0].espotId,
          espotData[0].mdUrl,
          null,
          '메인_중간배너',
          isNull(espotData[0].marketingText) ? espotData[0].contentName : espotData[0].marketingText
        )"
      >
        <ns-img
          :src="espotData[0].imgUrl"
          :alt="espotData[0].marketingText !== '' ? espotData[0].marketingText : '메인 중간배너'"
          type="WIDE"
        />
      </figure>
    </div>
    <splide
      v-else-if="childEspotData.contents.length > 1"
      ref="swiperSimple"
      :options="options"
      class="swiper_simple"
    >
      <splide-slide
        v-for="(value, index) in childEspotData.contents"
        :key="`${index}`"
      >
        {{ getHtmlDecode(value.marketingText) || '상품이미지' }}
        <figure
          @click="bannerCommonClickEvent(
            value.clickTarget,
            value.contentsId,
            value.clickCode,
            value.espotId,
            value.mdUrl,
            null,
            '메인_중간배너',
            isNull(value.marketingText) ? value.contentName : value.marketingText
          )"
        >
          <ns-img
            :src="value.imgUrl"
            :alt="getHtmlDecode(value.marketingText) !== '' ? getHtmlDecode(value.marketingText) : '메인 중간배너'"
            type="WIDE"
          />
        </figure>
        <span>{{ getHtmlDecode(value.marketingText) }}</span>
      </splide-slide>
    </splide>
    <!-- 더보기 영역 -->
    <!-- <div v-if="checkMoreView(espotExtendList)" class="btn_total_view">
      <button
        type="button"
        @click="bannerCommonClickEvent(
          espotExtendList.titleContent.clickTarget,
          espotExtendList.titleContent.contentsId,
          espotExtendList.titleContent.clickCode,
          espotExtendList.titleContent.espotId,
          espotExtendList.titleContent.mdUrl,
          null,
          '메인_중간배너'
        )"
      >
        {{ getHtmlDecode('더보기') }}
        <i />
      </button>
    </div> -->
    <!-- // 더보기 영역 -->
  </section>
</template>

<script>
import anchorMixin from '@/mixins/store/home/anchorMixin'
import NsImg from '@components/common/NsImg'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import { Splide, SplideSlide } from '@splidejs/vue-splide'

export default {
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
        fixedWidth: '28rem',
        padding: '1.6rem',
        gap: '1.6rem'
      },
      slides: this.espotData,
      childEspotData: {}
    }
  },
  created () {
    this.setChildEspotData()
  },
  methods: {
    /**
     * API 응답 결과 재구성.
     * 새로운 espot 추가 및 변경에 의해, API가 수정되어야 할 부분을
     * MC쪽에서 처리하게끔 의사 결정되어서 데이터셋을 새로 구성해줘야함.
     */
    setChildEspotData () {
      const childEspotData = {}
      const childContentsList = []
      const espotData = this.espotData
      if (isNull(espotData)) { return false }
      espotData.forEach(function (element, index) {
        if (index < 10) { childContentsList.push(element) } // 최대 10건 노출
      })
      childEspotData.contents = childContentsList
      this.childEspotData = childEspotData
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/Banner15SlideList";
</style>
