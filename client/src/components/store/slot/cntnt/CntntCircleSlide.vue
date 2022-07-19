<template>
  <!-- 배너 4.5 슬라이드 슬롯 -->
  <section :id="espotName" class="cntnt_circle_slide">
    <div
      v-show="!isNull(mainTitle) || !isNull(subTitle) || !isNull(imgTitle)"
      class="title_tag border_bold"
    >
      <p
        v-show="!isNull(mainTitle)"
        class="title"
      >
        {{ htmlDecode(mainTitle) }}
      </p>
      <figure
        @click="bizUtil.espotClickEvent(
          bannerExtendData.titleContent.clickTarget,
          bannerExtendData.titleContent.contentsId,
          bannerExtendData.titleContent.clickCode,
          bannerExtendData.titleContent.espotId,
          bannerExtendData.titleContent.mdUrl
        )"
      >
        <ns-img
          v-show="isNull(mainTitle) && !isNull(imgTitle)"
          :src="imgTitle"
          alt="타이틀 이미지"
        />
      </figure>
      <p
        v-show="!isNull(subTitle)"
        class="tag"
      >
        {{ htmlDecode(subTitle) }}
      </p>
    </div>
    <swiper
      ref="exhibition"
      :options="exhibition"
      class="exhibition"
    >
      <swiper-slide
        v-for="(banner, bannerIdx) in bannerList"
        :key="bannerIdx"
        :class="banner.newYn === 'Y' ? 'new' : ''"
      >
        <div
          class="espot_item"
          @click="bizUtil.espotClickEvent(
            banner.clickTarget,
            banner.contentsId,
            banner.clickCode,
            banner.espotId, banner.mdUrl
          )"
        >
          <figure>
            <ns-img
              :src="banner.imgUrl"
              :alt="htmlDecode(banner.marketingText)"
            />
          </figure>
          <span>{{ htmlDecode(banner.marketingText) }}</span>
        </div>
      </swiper-slide>
    </swiper>
    <div
      v-show="!isNull(clickTarget)"
      class="btn_total_view"
    >
      <button type="button" @click="bizUtil.espotClickEvent(bannerExtendData.titleContent.clickTarget, bannerExtendData.titleContent.contentsId, bannerExtendData.titleContent.clickCode, bannerExtendData.titleContent.espotId, bannerExtendData.titleContent.mdUrl)">
        더보기
        <i />
      </button>
    </div>
  </section>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import NsImg from '@components/common/NsImg'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'

export default {
  name: 'CntntCircleSlide',
  components: {
    NsImg
  },
  props: {
    espotName: {
      type: String,
      required: true
    },
    slotGlobalVal: {
      type: Object,
      required: true
    },
    espotData: {
      type: Object,
      required: true
    },
    espotExtendData: {
      type: Object,
      required: true
    },
    totalOrgan: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      exhibition: {
        slidesPerView: 'auto',
        spaceBetween: 16
      },
      bannerList: [],
      bannerExtendData: {},
      mainTitle: '',
      subTitle: '',
      imgTitle: '',
      clickTarget: ''
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    getId () {
      let result = ''
      if (this.$el.parentNode !== null) {
        result = this.$el.parentNode.id
      }
      return result
    }
  },
  mounted () {
    this.espotDraw()
  },
  methods: {
    isNull,
    htmlDecode,
    /**
     * espot 그리기
     */
    espotDraw () {
      if (this.espotData[this.getId].length > 15) {
        for (let i = 0; i < 15; i++) {
          this.bannerList.push(this.espotData[this.getId][i])
        }
      } else {
        this.bannerList = this.espotData[this.getId]
      }
      this.bannerExtendData = this.espotExtendData[this.getId]

      this.mainTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.imgUrl
      this.clickTarget = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.clickTarget
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cntnt/CntntCircleSlide";
</style>
