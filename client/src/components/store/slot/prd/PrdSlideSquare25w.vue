<template>
  <!-- 상품 2.5 슬라이드형 슬롯 -->
  <section :id="espotName" class="prd_slide_square_25w">
    <div v-if="espotName === 'RCMDCLICK_PRDSLIDESQUARE25W'" class="title_tag border_bold">
      <p class="title">
        지금 고객님이 많이 보는 상품
      </p>
      <p class="tag">
        {{ htmlDecode(mainTitle) }}
      </p>
    </div>
    <div v-else-if="espotName === 'PRDRCMDUSER'" class="title_tag border_bold">
      <p class="title">
        {{ htmlDecode(mainTitle) }}
      </p>
      <p v-if="loginUtil.isLoggedIn()" class="tag">
        {{ loginUtil.userName() }}님의 추천상품
      </p>
      <p v-else>
        오늘의 추천 상품
      </p>
    </div>
    <div
      v-else
      v-show="!isNull(mainTitle) || !isNull(subTitle) || !isNull(imgTitle)"
      class="title_tag border_bold"
    >
      <p
        v-show="!isNull(mainTitle)"
        class="title"
      >
        {{ htmlDecode(mainTitle) }}
      </p>
      <figure @click="bizUtil.espotClickEvent(gridExtendData.titleContent.clickTarget, gridExtendData.titleContent.contentsId, gridExtendData.titleContent.clickCode, gridExtendData.titleContent.espotId, gridExtendData.titleContent.mdUrl)">
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
      ref="swiperList"
      :options="swiperList"
      class="swiper_product"
    >
      <swiper-slide
        v-for="(grid, gridIdx) in gridList"
        :key="gridIdx"
      >
        <div
          class="product_box"
          @click="productDetailLogging(
            gridIdx,
            grid.itncatentrynm,
            grid.partnumber,
            {slotStoreName: slotGlobalVal.cateName}
          )"
        >
          <figure>
            <ns-img
              :product-number="grid.partnumber"
              :width="320"
              :height="320"
              :alt="htmlDecode(grid.itncatentrynm)"
              :is-adult="grid.adultItemFlag"
            />
          </figure>
          <ns-price
            :dc-price="grid.dcPrice"
            :mm-rntal-prc="grid.mmRntalPrc"
            :prc-wave-disp="grid.prcWaveDisp"
            :buschn-id="grid.buschnId"
            :disp-type-cd="grid.dispTypeCd"
          />
          <p class="title">
            {{ htmlDecode(grid.itncatentrynm) }}
          </p>
        </div>
      </swiper-slide>
    </swiper>
    <div
      v-show="!isNull(clickTarget)"
      class="btn_total_view"
    >
      <button type="button" @click="bizUtil.espotClickEvent(gridExtendData.titleContent.clickTarget, gridExtendData.titleContent.contentsId, gridExtendData.titleContent.clickCode, gridExtendData.titleContent.espotId, gridExtendData.titleContent.mdUrl)">
        더보기
        <i />
      </button>
    </div>
  </section>
</template>

<script>
import {
  insertCommas,
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@/common/utils/loginUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import { mapGetters } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'PrdSlideSquare25w',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    storeProductTypeMixin
  ],
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
    },
    getId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      swiperList: {
        slidesPerView: 'auto',
        spaceBetween: 8
      },
      gridExtendData: {},
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
    loginUtil () {
      return loginUtil
    },
    gridList () {
      return this.espotName === 'PRDRCMDUSER' ? this.totalOrgan.rcmdUser : this.espotData[this.getId]
    },
    ...mapGetters('home', [
      'getDisplayName'
    ])
  },
  mounted () {
    this.espotDraw()
  },
  methods: {
    insertCommas,
    isNull,
    htmlDecode,
    /**
      * 상품 클릭
      * @param {number} index 순서
      * @param {string} productname 상품명
      * @param {string} partNumber 상품번호
      * @param {string} catename 스토어네임
      */
    productDetailLogging (index, productname, partnumber, cateName) {
      let action = ''
      if (!isNull(this.slotGlobalVal.themaSectionId)) {
        action = `${this.slotGlobalVal.themaSectionId}_${this.espotName}`
      } else {
        action = this.espotName
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: `MOBILE_${this.getDisplayName}`,
          eventAction: action,
          eventLabel: `${index + 1}_${productname}`,
          params: {
            t1: null
          }
        }
      })
      bizUtil.gotoProductDetail(partnumber, cateName)
    },
    /**
     * espot 그리기
     */
    espotDraw () {
      this.gridExtendData = this.espotExtendData[this.getId]
      this.mainTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.imgUrl
      this.clickTarget = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.clickTarget
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/prd/PrdSlideSquare25w";
</style>
