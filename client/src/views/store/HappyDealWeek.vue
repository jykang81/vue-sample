<template>
  <section class="happy_deal_week">
    <div v-if="recommendProductListTitle" class="title_tag">
      <p class="title">
        {{ htmlDecode(recommendProductListTitle) }}
      </p>
    </div>
    <swiper
      v-if="recommendProductList.length"
      ref="swiperProgressbar"
      :options="swiperProgressbar"
      class="product_wide"
      name="_EZ_HAPPYDEAL_WEEK_PRDWIDE"
    >
      <template v-for="(product, index) in recommendProductList">
        <swiper-slide v-if="index < 20" :key="index">
          <router-link
            :to="{ name: 'productDetail', params: { number: product.partnumber, clksrc: '해피딜_주간특가_추천상품' }}"
            @click.native="productLogging(index, product)"
          >
            <figure>
              <ns-img
                :src="product.espotImgUrl"
                :product-number="product.partnumber"
                :alt="product.itncatentrynm"
                :is-adult="product.adultItemFlag"
                type="WIDE"
                replace="CROP"
              />
              <template v-if="product.badge.length > 0">
                <p v-if="product.badge[0] && product.badge[0].PROMOTION" class="sticker">
                  <ns-img
                    :src="product.badge[0].PROMOTION"
                    alt="스티커"
                  />
                </p>
                <ul class="benefit">
                  <li v-if="product.badge[1] && product.badge[1].BENEFIT1">
                    {{ getCutBytes(product.badge[1].BENEFIT1, 12) }}
                  </li>
                  <li v-if="product.badge[2] && product.badge[2].BENEFIT2">
                    {{ getCutBytes(product.badge[2].BENEFIT2, 12) }}
                  </li>
                </ul>
              </template>
            </figure>
            <ns-price
              :dc-price="product.dcPrice"
              :dc-rate="product.dcRate"
              :price="product.price"
              :mm-rntal-prc="product.mmRntalPrc"
              :prc-wave-disp="product.prcWaveDisp"
              :buschn-id="product.buschnId"
              :disp-type-cd="product.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(product.itncatentrynm) }}
            </p>
          </router-link>
        </swiper-slide>
      </template>
    </swiper>
    <!-- Promotion Circle Banner -->
    <ul v-if="promotionBannerList.length" class="banner_grid" name="_EZ_HAPPYDEAL_WEEK_CIRCLE_BANNER">
      <template v-for="(banner, index) in promotionBannerList">
        <li v-if="index < 4" :key="index">
          <a @click.prevent="circleBannerClickEvent(banner)">
            <figure>
              <ns-img
                :src="banner.imgUrl"
                :alt="banner.marketingText"
              />
            </figure>
            <p>{{ htmlDecode(getCutBytes(banner.marketingText, 12)) }}</p>
          </a>
        </li>
      </template>
    </ul>
    <!-- Promotion Circle Banner Ends -->
    <product-list
      espot-name="_EZ_HAPPYDEAL_WEEK_PRDGRID"
      :product-list="weekProductList"
      :use-top="true"
      :parent-info="parentInfo"
      :total-count="weekProductsTotalCnt"
      clksrc="해피딜_주간특가_상품목록"
      @get:product="getWeekProductList"
    />
  </section>
</template>

<script>
import {
  htmlDecode,
  getCutBytes,
  insertCommas,
  isNull
} from '@utils/commonutil/commonUtil'
import ProductList from '@components/common/ProductList'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'

import bizUtil from '@utils/bizUtil'
import uiUtil from '@utils/uiUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'HappyDealWeek',
  components: {
    NsImg,
    NsPrice,
    ProductList
  },
  mixins: [
    storeProductTypeMixin
  ],
  data () {
    return {
      swiperProgressbar: { // swiper 설정
        slidesPerView: 'auto', // 동시에 보여줄 슬라이드 갯수
        spaceBetween: 16 // 슬라이드간 간격
      },
      recommendProductListTitle: '', // 추천 해피딜 이스팟 타이틀
      recommendProductList: [], // 추천 해피딜
      promotionBannerList: [], // 프로모션 배너
      weekProductList: [], // 주간 특가 상품
      parentInfo: '', // 마케팅스크립트 디스크립션
      scrollObject: null, // 무한스크롤 객체
      weekProductsTotalCnt: '', // 주간상품리스트 총개수
      weekProductsIndex: 0 // 주간상품리스트 조회 인덱스
    }
  },
  created () {
    this.init()
  },
  methods: {
    htmlDecode,
    getCutBytes,
    insertCommas,
    /**
     * 초기화
     *
     */
    init () {
      this.parentInfo = 'HappyDeal'

      this.getHappyDealWeekData().then(() => {
        this.setInfiniteScrollObject()
      })
    },
    /**
     * IO 기반 무한스크롤 객체 설정 함수
     * @returns {void}
     */
    setInfiniteScrollObject () {
      this.scrollObject = uiUtil.setInfiniteScroll(this, {
        callback: this.getWeekProductList,
        options: {
          rootMargin: '100% 0px'
        }
      })
    },
    /**
     * 주간특가 상품 클릭
     * @param {Number} index 순서
     * @param {Object} productInfo 상품정보
     */
    productLogging (index, productInfo) {
      const eventAction = '주간특가'
      const eventLabel = `주간특가_${index + 1}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_해피딜',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      let chnId = ''
      if (productInfo.buschnId === 'INT') {
        chnId = 'e상품'
      } else {
        chnId = 'eTV'
      }
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(productInfo.partnumber),
              name: productInfo.productname,
              brand: productInfo.brandKorNm,
              dimension16: chnId
            }
          ],
          subparams: {
            t1: '해피딜',
            t2: '주간특가',
            t3: '추천상품',
            product_list: '해피딜_주간특가_추천상품'
          }
        }
      })
    },
    /**
     * 서클배너 클릭
     * @param {String} code 배너코드
     * @param {String} text 배너명
     */
    circleBannerLogging (code, text) {
      const eventAction = '주간특가'
      const eventLabel = `써클배너_${code}_${text}`
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_해피딜',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 추천 해피딜 상품, 프로모션 배너
     *
     * @returns {object} promise
     */
    getHappyDealWeekData () {
      const successHandling = response => {
        if (!response.msg) {
          return
        }

        // 추천 해피딜 이스팟 타이틀
        this.recommendProductListTitle = response.msg.espotExtendList._EZ_HAPPYDEAL_WEEK_PRDWIDE.titleContent.marketingText

        // 추천 해피딜
        this.recommendProductList = response.msg.espotList[0]._EZ_HAPPYDEAL_WEEK_PRDWIDE || []

        // 프로모션 배너
        this.promotionBannerList = response.msg.espotList[1]._EZ_HAPPYDEAL_WEEK_CIRCLE_BANNER || []

        // 마케팅 스크립트 적용 부분
        // 네이버 프리미엄 로그
        marketingUtil.naverLogger.send({
          type: marketingUtil.naverLogger.TRACE_INFLOW
        })
      }
      const param = {
        espotInfo: [
          'EZ_HAPPYDEAL_WEEK_PRDWIDE|ESPOT_PRDWIDE|1|30|0',
          'EZ_HAPPYDEAL_WEEK_CIRCLE_BANNER|ESPOT_CNTNT|1|10|0'
        ].join('$')
      }

      return this.$nsaxios.post('NSFixedShopCmd', param, successHandling)
    },
    /**
     * 주간특가상품 조회
     *
     * @returns {object} promise
     */
    getWeekProductList () {
      const index = this.weekProductsIndex
      const seq = 40
      const successHandling = response => {
        // 주간 특가 상품
        const productList = response.msg.espotList[0]._EZ_HAPPYDEAL_WEEK_PRDGRID
        if (index === 0 && productList.length > 0) {
          this.weekProductsTotalCnt = productList[0].totProdCnt
        }
        if (!productList || !productList.length > 0) {
          this.scrollObject.disconnect()
        } else {
          this.weekProductList.push(...productList)
          this.weekProductsIndex = index + seq
        }
      }
      const param = {
        espotInfo: `EZ_HAPPYDEAL_WEEK_PRDGRID|ESPOT_PRDLARGE|${index + 1}|${index + seq}|0`
      }

      return this.$nsaxios.post('NSFixedShopCmd', param, successHandling)
    },
    /**
     * 서클 배너 클릭 이벤트
     *
     * @param {Object} banner - 서클 배너 객체
     */
    circleBannerClickEvent (banner) {
      const { clickTarget, contentsId, clickCode, espotId, mdUrl, catalogId, clksrc } = banner
      bizUtil.espotClickEvent(clickTarget, contentsId, clickCode, espotId, mdUrl, catalogId, clksrc)
      this.circleBannerLogging(banner.clickCode, isNull(banner.marketingText) ? banner.contentName : banner.marketingText)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/HappyDealWeek";
</style>
