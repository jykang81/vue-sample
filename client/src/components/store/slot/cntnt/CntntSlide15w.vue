<template>
  <!-- 배너 1.5 슬라이드형 슬롯 -->
  <section :id="espotName" class="cntnt_slide_15w">
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
    <div v-if="bannerList.length === 1" class="simple_single">
      <figure @click="slideClickLogging(isNull(bannerList[0].marketingText) ? bannerList[0].contentName : bannerList[0].marketingText, bannerList[0].clickTarget, bannerList[0].clickCode, bannerList[0].contentsId, bannerList[0].espotId, bannerList[0].mdUrl)">
        <ns-img
          :src="bannerList[0].imgUrl"
          :alt="htmlDecode(bannerList[0].marketingText)"
          type="WIDE"
        />
      </figure>
    </div>
    <!-- N개 등록시 -->
    <div v-if="bannerList.length > 1">
      <swiper
        ref="exhibition"
        :options="exhibition"
        class="swiper_simple"
      >
        <swiper-slide
          v-for="(banner, bannerIdx) in bannerList"
          :key="bannerIdx"
        >
          <figure @click="slideClickLogging(isNull(banner.marketingText) ? banner.contentName : banner.marketingText, banner.clickTarget, banner.contentsId, banner.clickCode, banner.espotId, banner.mdUrl)">
            <ns-img
              :src="banner.imgUrl"
              :product-number="banner.clickCode"
              :alt="htmlDecode(banner.marketingText) !== '' ? htmlDecode(banner.marketingText) : '마켓 배너'"
              type="WIDE"
              replace="CROP"
            />
          </figure>
        </swiper-slide>
      </swiper>
    </div>
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
import { mapGetters } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'CntntSlide15w',
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
      * 슬라이드 아이템 클릭
      * @param {string} contentName 배너명 or 기획전명 or 이벤트명
      * @param {string} target 이동할 타겟 구분(Product, Category, Internal, External)
      * @param {string} contentsId 컨텐츠 ID
      * @param {string} clickCode 이동할 상품코드 또는 카테고리코드
      * @param {string} espotId ESPOT ID
      * @param {string} mdUrl 이동할 md URL
     */
    slideClickLogging (contentName, clickTarget, contentsId, clickCode, espotId, mdUrl) {
      // 마케팅 스크립트 적용 부분
      // GA360
      if (this.getDisplayName === '혜택&쿠폰') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_이벤트매장',
            eventAction: '빅배너',
            eventLabel: contentName,
            params: {
              t1: null
            }
          }
        })
      } else {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: `MOBILE_${this.getDisplayName}`,
            eventAction: `${this.getDisplayName}_배너`,
            eventLabel: `${this.getDisplayName}_${contentName}`,
            params: {
              t1: null
            }
          }
        })
      }
      bizUtil.espotClickEvent(clickTarget, contentsId, clickCode, espotId, mdUrl)
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
  @import "~@/assets/styles/components/store/slot/cntnt/CntntSlide15w";
</style>
