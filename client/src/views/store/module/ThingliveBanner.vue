<template>
  <section
    v-if="!isEmpty(responseData)"
    class="thinglive_banner"
    :name="espotKeyName"
  >
    <swiper
      :options="swiperOptions"
      class="swiper_banner"
    >
      <swiper-slide
        v-for="(banner, index) in liveBanner"
        v-show="index < MAX_BANNER_CNT"
        :key="banner.contentsId"
      >
        <a
          @click="bannerClickLogging(banner, index)"
        >
          <figure>
            <ns-img
              :src="banner.imgUrl"
              :alt="banner.slotTitle !== '' ? banner.slotTitle : '띵라이브 배너'"
              type="WIDE"
            />
          </figure>
        </a>
      </swiper-slide>
      <div
        slot="pagination"
        class="swiper-pagination"
      />
    </swiper>
  </section>
</template>

<script>
import thingliveMixin from '@/mixins/media/thingliveMixin'
import bizUtil from '@/common/utils/bizUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import {
  isEmpty,
  isNull
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'

export default {
  name: 'ThingliveBanner',
  components: {
    NsImg
  },
  mixins: [
    thingliveMixin
  ],
  props: {
    responseData: {
      type: Array,
      required: true
    },
    espotKeyName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 배너 최대 노출 개수
      MAX_BANNER_CNT: 10,
      // 배너 목록
      liveBanner: [],
      // swiper 옵션
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 16,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  watch: {
    responseData () {
      this.setThingliveBanner()
    }
  },
  methods: {
    isEmpty,
    /**
     * 배너 클릭
     * @param {Object} banner banner Info
     * @param {Number} index index Info
     */
    bannerClickLogging (banner, index) {
      const label = `와이드배너_${index + 1}_${banner.clickCode}_${isNull(banner.marketingText) ? banner.contentName : banner.marketingText}`
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction: '라이브',
          eventLabel: label,
          params: {
            t1: null
          }
        }
      })
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(banner.clickCode)
            }
          ],
          subparams: {
            t1: '띵라이브',
            t2: '배너',
            product_list: '띵라이브_배너'
          }
        }
      })

      bizUtil.espotClickEvent(banner.clickTarget, banner.contentsId, banner.clickCode, banner.espotId, banner.mdUrl)
    },
    /**
     * 라이브 일정 배너 영역 세팅 (AS-IS: cntnt.js - espotDraw)
     * @returns {void}
     */
    setThingliveBanner () {
      this.liveBanner = this.responseData
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/module/ThingliveBanner";
</style>
