<template>
  <section class="happy_deal_today">
    <!-- Top Banner -->
    <figure v-if="topBanner.length" class="happydeal_banner" name="_EZ_HAPPYDEAL_TODAY_TOP_BANNER">
      <router-link :to="topBanner[0].mdUrl" event="" @click.native.prevent="clickTopBannerEvent(topBanner)">
        <ns-img
          :src="topBanner[0].imgUrl"
          :alt="topBanner[0].marketingText !== '' ? topBanner[0].marketingText : '해피딜 상단 배너' "
          type="WIDE"
        />
      </router-link>
    </figure>
    <!-- Top Banner Ends -->
    <!-- Today Product Wide -->
    <div v-if="todayProductListTitle" class="title_tag">
      <p class="title">
        {{ htmlDecode(todayProductListTitle) }}
      </p>
    </div>
    <ul v-if="todayProductList.length" class="product_wide" name="_EZ_HAPPYDEAL_TODAY_PRODWIDE">
      <li v-for="(product, index) in todayProductList" :key="index">
        <router-link
          :to="{ name: 'productDetail', params: { number: product.partnumber, clksrc: '해피딜_오늘특가상품' }}"
          @click.native="productLogging(index, product)"
        >
          <figure>
            <ns-img
              :alt="product.itncatentrynm"
              :src="product.espotImgUrl"
              :product-number="product.partnumber"
              :is-adult="product.adultItemFlag"
              type="WIDE"
              replace="SQUARE"
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
        <div v-if="isBenefitExist(product)" class="benefit_button center">
          <ul class="benefit">
            <li v-if="product.dlvrFreeYn === 'Y' && !isConsultantRequiredProduct(product)">
              무료배송
            </li>
            <li v-if="Number(product.promIfiVal)">
              무이자
            </li>
            <li v-if="product.promPadYn === 'Y'">
              적립금
            </li>
          </ul>
          <p v-if="product.orderQty !== '0'" class="count">
            {{ getOrderCount(product.orderQty) }}
          </p>
        </div>
      </li>
    </ul>
    <!-- Today Product Wide Ends -->
    <!-- Promotion Banner -->
    <figure v-if="promotionBanner.length" class="happydeal_banner" name="_EZ_HAPPYDEAL_TODAY_MID_BANNER">
      <router-link :to="promotionBanner[0].mdUrl" event="" @click.native.prevent="clickMiddleBannerEvent(promotionBanner)">
        <ns-img
          :src="promotionBanner[0].imgUrl"
          :alt="promotionBanner[0].marketingText"
          type="WIDE"
        />
      </router-link>
    </figure>
    <!-- Promotion Banner Ends -->
    <!-- Tommorow Product Wide -->
    <div v-if="nextDayProductListTitle" class="title_tag">
      <p class="title">
        {{ htmlDecode(nextDayProductListTitle) }}
      </p>
    </div>
    <ul v-if="nextDayProductList.length" class="happydeal_tomorrow" name="_EZ_HAPPYDEAL_TODAY_NEXT_PRDGRID">
      <template v-for="(product, index) in nextDayProductList">
        <li v-if="index < 3" :key="index">
          <figure>
            <ns-img
              :alt="product.itncatentrynm"
              :src="product.espotImgUrl"
              :product-number="product.partnumber"
              :is-adult="product.adultItemFlag"
              type="WIDE"
              replace="SQUARE"
            />
          </figure>
          <p class="title">
            {{ htmlDecode(product.itncatentrynm) }}
          </p>
        </li>
      </template>
    </ul>
    <!-- Tommorow Product Wide Ends -->
  </section>
</template>

<script>
import uiUtil from '@utils/uiUtil'
import {
  htmlDecode,
  insertCommas,
  getCutBytes,
  isNull
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import bizUtil from '@utils/bizUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'HappyDealToday',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    storeProductTypeMixin
  ],
  data () {
    return {
      topBanner: [], // 상단 배너
      todayProductListTitle: '', // 오늘 특가 타이틀
      todayProductList: [], // 오늘 특가 상품
      promotionBanner: [], // 프로모션 배너
      nextDayProductListTitle: '', // 내일 특가 타이틀
      nextDayProductList: [], // 내일 특가 상품
      intersectionObserverObj: null // 스크롤 시 요소 감지를 위한 IntersectionObserver 객체
    }
  },
  beforeDestroy () {
    this.intersectionObserverObj.disconnect()
  },
  deactivated () {
    this.intersectionObserverObj.disconnect()
  },
  activated () {
    this.init()
  },
  created () {
    this.init()
  },
  methods: {
    htmlDecode,
    insertCommas,
    getCutBytes,
    /**
     * 오늘특가 상품 클릭
     * @param {Number} index 순서
     * @param {Object} productInfo 상품정보
     */
    productLogging (index, productInfo) {
      const eventAction = '오늘특가'
      const eventLabel = `오늘특가_${index + 1}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
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
              name: productInfo.itncatentrynm,
              brand: productInfo.brandKorNm,
              dimension16: chnId
            }
          ],
          subparams: {
            t1: '해피딜',
            t2: '오늘특가상품',
            product_list: '해피딜_오늘특가상품'
          }
        }
      })
    },
    /**
     * 초기화
     *
     */
    init () {
      // 상단 배너, 오늩 특가 상품 상품 조회
      this.getHappyDealTodayInitData().then(() => {
      // 하단 프로모션 배너, 내일 특가 상품 조회는 스크롤 시 조회
        this.intersectionObserverObj = uiUtil.setInfiniteScroll(this, {
          callback: this.getHappyDealTodayMoreData,
          options: {
            rootMargin: '100% 0px'
          }
        })
      })
    },
    /**
     * 상단 배너, 오늩 특가 상품 상품 조회
     *
     * @returns {object} promise
     */
    getHappyDealTodayInitData () {
      const successHandling = response => {
        if (!response.msg) {
          return
        }
        // 상단 배너
        this.topBanner = response.msg.espotList[0]._EZ_HAPPYDEAL_TODAY_TOP_BANNER || []
        // 오늘 특가 타이틀
        this.todayProductListTitle = response.msg.espotExtendList._EZ_HAPPYDEAL_TODAY_PRODWIDE?.titleContent?.mainTitle
        // 오늘 특가 상품
        this.todayProductList = response.msg.espotList[1]._EZ_HAPPYDEAL_TODAY_PRODWIDE || []
        // 마케팅 스크립트 적용 부분
        // 네이버 프리미엄 로그
        marketingUtil.naverLogger.send({
          type: marketingUtil.naverLogger.TRACE_INFLOW
        })
      }

      const param = {
        espotInfo: [
          'EZ_HAPPYDEAL_TODAY_TOP_BANNER|ESPOT_CNTNT|1|1|0',
          'EZ_HAPPYDEAL_TODAY_PRODWIDE|ESPOT_PRDWIDE|1|9999|0'
        ].join('$')
      }

      return this.$nsaxios.post('NSFixedShopCmd', param, successHandling)
    },
    /**
     * 프로모션 배너, 내일 특가 상품 조회
     *
     * @returns {object} promise
     */
    getHappyDealTodayMoreData () {
      const successHandling = response => {
        if (!response.msg) {
          return
        }

        // 프로모션 배너
        this.promotionBanner = response.msg.espotList[0]._EZ_HAPPYDEAL_TODAY_MID_BANNER || []
        // 내일 특가 타이틀
        this.nextDayProductListTitle = response.msg.espotExtendList._EZ_HAPPYDEAL_TODAY_NEXT_PRDGRID?.titleContent?.mainTitle
        // 내일 특가 상품
        this.nextDayProductList = response.msg.espotList[1]._EZ_HAPPYDEAL_TODAY_NEXT_PRDGRID || []
      }

      const param = {
        espotInfo: [
          'EZ_HAPPYDEAL_TODAY_MID_BANNER|ESPOT_CNTNT|1|1|0',
          'EZ_HAPPYDEAL_TODAY_NEXT_PRDGRID|ESPOT_PRDGRID|1|3|0'
        ].join('$')
      }

      return this.$nsaxios.post('NSFixedShopCmd', param, successHandling).then(() => {
        // 더 조회할 API가 없으므로 무한 스크롤 요소 감지 중지
        this.intersectionObserverObj.disconnect()
      })
    },
    /**
     * 탑배너 클릭 이벤트
     *
     * @param {Object} topBanner - 탑배너 객체
     */
    clickTopBannerEvent (topBanner) {
      const { clickTarget, contentsId, clickCode, espotId, mdUrl, catalogId, contentName, marketingText } = topBanner[0]
      const eventAction = '띠배너영역'
      const eventLabel = `1_${mdUrl}_${isNull(marketingText) ? contentName : marketingText}`
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
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(clickCode),
              name: isNull(marketingText) ? contentName : marketingText // topBanner.marketingText
            }
          ],
          subparams: {
            t1: '해피딜',
            t2: '오늘특가',
            t3: '상단배너',
            product_list: '해피딜_오늘특가_상단배너'
          }
        }
      })
      bizUtil.espotClickEvent(clickTarget, contentsId, clickCode, espotId, mdUrl, catalogId, '해피딜_오늘특가_상단배너')
    },
    /**
     * 프로모션 배너 클릭 이벤트
     *
     * @param {Object} middleBanner - 프로모션배너 객체
     */
    clickMiddleBannerEvent (middleBanner) {
      const { clickTarget, contentsId, clickCode, espotId, mdUrl, catalogId, contentName, marketingText } = middleBanner[0]
      const eventAction = '띠배너영역'
      const eventLabel = `2_${mdUrl}_${isNull(marketingText) ? contentName : marketingText}`
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
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(clickCode),
              name: isNull(marketingText) ? contentName : marketingText
            }
          ],
          subparams: {
            t1: '해피딜',
            t2: '오늘특가',
            t3: '중간배너',
            product_list: '해피딜_오늘특가_중간배너'
          }
        }
      })
      bizUtil.espotClickEvent(clickTarget, contentsId, clickCode, espotId, mdUrl, catalogId, '해피딜_오늘특가_중간배너')
      // this.middleBannerLogging() 함수 미존재
      // this.middleBannerLogging(middleBanner[0].mdUrl, middleBanner[0].marketingText, middleBanner[0].clickCode)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/HappyDealToday";
</style>
