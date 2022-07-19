<template>
  <!-- 배너 리스트 슬롯 -->
  <section :id="espotName" class="cntnt_list">
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
    <!-- 기본형 -->
    <ul
      v-if="isNull(dispStyle)"
      class="banner_list basics"
    >
      <li
        v-for="(banner, bannerIdx) in bannerList"
        :key="bannerIdx"
      >
        <figure @click="clickBanner(banner)">
          <ns-img
            :src="banner.imgUrl"
            :alt="htmlDecode(banner.marketingText) !== '' ? htmlDecode(banner.marketingText) : '기본형 배너'"
            type="WIDE"
          />
        </figure>
      </li>
    </ul>
    <!-- 카드형 -->
    <ul
      v-else-if="dispStyle === 'CARD'"
      class="banner_list"
    >
      <li
        v-for="(banner, bannerIdx) in bannerList"
        :key="bannerIdx"
      >
        <figure @click="clickBanner(banner)">
          <ns-img
            :src="banner.imgUrl"
            :alt="htmlDecode(banner.marketingText) !== '' ? htmlDecode(banner.marketingText) : '카드형 배너'"
            type="WIDE"
          />
        </figure>
      </li>
    </ul>
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
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'CntntList',
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
      bannerList: [],
      bannerExtendData: {},
      dispStyle: '',
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
      this.bannerList = this.espotData[this.getId]
      this.bannerExtendData = this.espotExtendData[this.getId]

      this.dispStyle = isNull(this.bannerExtendData.css.dispStyle) ? '' : this.bannerExtendData.css.dispStyle

      this.mainTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.imgUrl

      this.clickTarget = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.clickTarget
    },
    /**
     * 배너 클릭 시
     */
    clickBanner (banner) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_이벤트매장',
          eventAction: htmlDecode(this.mainTitle),
          eventLabel: isNull(banner.marketingText) ? banner.contentName : banner.marketingText,
          params: {
            t1: null
          }
        }
      })
      if (!isNull(banner.clickTarget)) {
        bizUtil.espotClickEvent(banner.clickTarget, banner.contentsId, banner.clickCode, banner.espotId, banner.mdUrl)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cntnt/CntntList";
</style>
