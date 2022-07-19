<template>
  <!-- 이미지 슬롯 -->
  <section :id="espotName" class="cntnt">
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
      <figure @click="bizUtil.espotClickEvent(bannerExtendData.titleContent.clickTarget, bannerExtendData.titleContent.contentsId, bannerExtendData.titleContent.clickCode, bannerExtendData.titleContent.espotId, bannerExtendData.titleContent.mdUrl)">
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
    <!-- 1개 등록시 -->
    <div
      v-if="bannerList.length === 1"
      class="simple_single"
    >
      <figure @click="clickBannerList(bannerList[0])">
        <ns-img
          :src="bannerList[0].imgUrl"
          :alt="bannerList[0].marketingText !== '' ? bannerList[0].marketingText : '배너'"
          type="WIDE"
        />
      </figure>
    </div>
    <!-- N개 등록시 -->
    <swiper
      v-else
      ref="swiperSingle"
      :options="swiperSingle"
      class="swiper_single"
    >
      <swiper-slide
        v-for="(banner, bannerIdx) in bannerList"
        :key="bannerIdx"
      >
        <figure @click="clickBanner(banner)">
          <ns-img
            :src="banner.imgUrl"
            :alt="htmlDecode(banner.marketingText) !== '' ? htmlDecode(banner.marketingText) : '슬롯 배너' "
            type="WIDE"
          />
        </figure>
      </swiper-slide>
      <div
        slot="pagination"
        class="swiper-pagination"
      />
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
import NsImg from '@components/common/NsImg'
import bizUtil from '@utils/bizUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import { mapGetters } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'Cntnt',
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
      swiperSingle: {
        spaceBetween: 16,
        pagination: {
          el: '.swiper-pagination'
        }
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
    },
    ...mapGetters('home', [
      'getDisplayName'
    ])
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
      if (this.espotData[this.getId].length > 10) {
        for (let i = 0; i < 10; i++) {
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
    },
    /**
      * 배너 클릭 시
      */
    clickBannerList (banner) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_이벤트매장',
          eventAction: '사용가능쿠폰',
          eventLabel: isNull(banner.marketingText) ? banner.contentName : banner.marketingText, // '',
          params: {
            t1: null
          }
        }
      })
      if (!isNull(banner.clickTarget)) {
        bizUtil.espotClickEvent(banner.clickTarget, banner.contentsId, banner.clickCode, banner.espotId, banner.mdUrl)
      }
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
          eventCate: `MOBILE_${this.getDisplayName}`,
          eventAction: '배너',
          eventLabel: `${this.getDisplayName}_${isNull(banner.marketingText) ? banner.contentName : banner.marketingText}`,
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
  @import "~@/assets/styles/components/store/slot/cntnt/Cntnt";
</style>
