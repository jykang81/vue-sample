<template>
  <!-- 배너 4단 슬롯 -->
  <section :id="espotName" class="cntnt_4w">
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
      <a @click="bizUtil.espotClickEvent(bannerExtendData.titleContent.clickTarget, bannerExtendData.titleContent.contentsId, bannerExtendData.titleContent.clickCode, bannerExtendData.titleContent.espotId, bannerExtendData.titleContent.mdUrl)">
        <ns-img
          v-show="isNull(mainTitle) && !isNull(imgTitle)"
          :src="imgTitle"
          alt="타이틀 이미지"
        />
      </a>
      <p
        v-show="!isNull(subTitle)"
        class="tag"
      >
        {{ htmlDecode(subTitle) }}
      </p>
    </div>
    <ul class="banner_grid">
      <li
        v-for="(banner, bannerIdx) in bannerList"
        :key="bannerIdx"
      >
        <div
          class="banner_item"
          @click="bannerGridLogging(banner)"
        >
          <figure>
            <ns-img
              :src="banner.imgUrl"
              :alt="htmlDecode(banner.marketingText) !== '' ? htmlDecode(banner.marketingText) : '마켓 배너'"
            />
          </figure>
          <p>
            {{ htmlDecode(banner.marketingText) }}
          </p>
        </div>
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
import NsImg from '@components/common/NsImg'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'Cntnt4w',
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
      * 배너 클릭
      * @param {Object} banner
      */
    bannerGridLogging (banner) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_이벤트매장',
          eventAction: '버튼배너',
          eventLabel: isNull(banner.marketingText) ? banner.contentName : banner.marketingText,
          params: {
            t1: null
          }
        }
      })
      bizUtil.espotClickEvent(banner.clickTarget, banner.contentsId, banner.clickCode, banner.espotId, banner.mdUrl)
    },
    /**
     * espot 그리기
     */
    espotDraw () {
      this.bannerList = this.espotData[this.getId]
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
  @import "~@/assets/styles/components/store/slot/cntnt/Cntnt4w";
</style>
