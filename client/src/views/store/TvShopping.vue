<template>
  <div class="tv_shopping">
    <!-- 추천 방송상품 -->
    <section :name="espotKeyName1" class="tv_shopping_recommand">
      <div class="title_tag">
        <p class="title">
          {{ htmlDecode(title1) }}
        </p>
      </div>
      <swiper
        ref="swiperProgressbar"
        :options="swiperProgressbar"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(prdRecommend, recommendIdx) in prdRecommendList"
          :key="recommendIdx"
        >
          <div
            class="recommend_item"
            @click="recomProductDetailLogging (prdRecommend, { clksrc: 'TV쇼핑_추천방송상품'})"
          >
            <figure>
              <ns-img
                :product-number="prdRecommend.partnumber"
                :width="320"
                :height="320"
                :alt="prdRecommend.itncatentrynm"
                :is-adult="prdRecommend.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="prdRecommend.dcPrice"
              :buschn-id="prdRecommend.buschnId"
              :disp-type-cd="prdRecommend.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(prdRecommend.itncatentrynm) }}
            </p>
          </div>
        </swiper-slide>
      </swiper>
      <div class="recommend_shop">
        <!-- TV쇼핑 혜택 -->
        <ul
          class="benefit tv"
          :class="[benefitList.length < 4 ? 'not_four' : '']"
        >
          <li
            v-for="(benefit, benefitIdx) in benefitList"
            :key="benefitIdx"
          >
            <div
              class="benefit_item"
              @click="espotClickEventLogging(
                benefit.clickTarget,
                benefit.contentsId,
                benefit.clickCode,
                benefit.espotId,
                benefit.mdUrl,
                benefit.slotTitle
              )"
            >
              <ns-img
                :src="benefit.imgUrl"
                :alt="benefit.slotTitle"
              />
              <p class="label">
                {{ htmlDecode(benefit.slotTitle) }}
              </p>
            </div>
          </li>
        </ul>
        <ul class="banner">
          <li
            v-for="(promotionBanner, promotionBannerIdx) in promotionBannerList"
            :key="promotionBannerIdx"
          >
            <router-link
              :to="promotionBanner.mdUrl"
              event=""
              @click.native.prevent="promotionBannerLogging(promotionBanner.clickTarget, promotionBanner.contentsId, promotionBanner.clickCode, promotionBanner.espotId, promotionBanner.mdUrl, isNull(promotionBanner.marketingText) ? promotionBanner.contentName : promotionBanner.marketingText)"
            >
              <ns-img
                :src="promotionBanner.imgUrl"
                :alt="htmlDecode(promotionBanner.marketingText) !== '' ? htmlDecode(promotionBanner.marketingText) : '프로모션 배너'"
                type="WIDE"
              />
            </router-link>
          </li>
        </ul>
      </div>
    </section>
    <!-- 다음 방송상품 -->
    <section class="tv_shopping_next">
      <div class="title_tag" :name="espotKeyName2">
        <p class="title">
          다음 방송상품
        </p>
      </div>
      <div
        v-for="(nextTvSchedule, nextTvScheduleIdx) in nextTvScheduleList"
        :key="nextTvScheduleIdx"
        class="product_item"
      >
        <strong :id="'relProductList'+nextTvScheduleIdx" class="live_time">
          <span v-if="isToday(nextTvSchedule.startDtm)">
            오늘
          </span>
          <span v-else>
            내일
          </span> <span class="time">{{ calcDate(getDateParse02(nextTvSchedule.startDtm), 0, 0, 0, 0, "HH:mm") }}</span> 방송
        </strong>
        <div class="product_box">
          <div
            class="product"
            @click="nextProductDetailLogging(nextTvSchedule, { clksrc: 'TV쇼핑_다음방송상품' })"
          >
            <figure>
              <ns-img
                :product-number="nextTvSchedule.partNumber"
                :alt="htmlDecode(nextTvSchedule.goodsName)"
                type="WIDE"
              />
            </figure>
            <ns-price
              :dc-price="nextTvSchedule.salePrice"
              :dc-rate="nextTvSchedule.saleRate"
              :price="nextTvSchedule.priceofferprice"
              :buschn-id="nextTvSchedule.busChnId"
              :disp-type-cd="nextTvSchedule.dispTypeCd"
            />
            <p class="title">
              [{{ htmlDecode(nextTvSchedule.brandName) }}] {{ htmlDecode(nextTvSchedule.goodsName) }}
            </p>
          </div>
          <div class="benefit_button">
            <ul class="benefit">
              <li class="tv">
                TV쇼핑
              </li>
              <li v-if="nextTvSchedule.dlvrFreeYn === 'Y' && !PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(nextTvSchedule.dispTypeCd)">
                무료배송
              </li>
              <li v-if="nextTvSchedule.promIfiYn === 'Y'">
                무이자
              </li>
              <li v-if="nextTvSchedule.promPadYn === 'Y'">
                적립금
              </li>
            </ul>
            <div class="btn_group">
              <button
                v-if="PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(nextTvSchedule.dispTypeCd)"
                type="button"
                class="btn_buy"
                @click="layerOpen('1', nextTvScheduleIdx, '', 'N', nextTvSchedule.goodsName)"
              >
                바로구매
              </button>
              <button
                v-else
                type="button"
                class="btn_buy"
                @click="moveConsultationRequest(nextTvSchedule.partNumber)"
              >
                상담신청
              </button>
            </div>
          </div>
        </div>
        <div :class="collapse[nextTvScheduleIdx]">
          <div class="prd_list">
            <div
              v-for="(nextRelInfo, nextRelIdx) in nextTvSchedule.RelTotalOrgan"
              :key="nextRelIdx"
              class="item_box"
            >
              <div
                class="item"
                @click="bizUtil.gotoProductDetail(nextRelInfo.catentryId)"
              >
                <figure>
                  <ns-img
                    :product-number="nextRelInfo.catentryId"
                    :width="176"
                    :height="176"
                    :alt="htmlDecode(nextRelInfo.goodsName)"
                  />
                </figure>
                <div class="price_title">
                  <ns-price
                    :dc-price="nextRelInfo.salePrice"
                    :buschn-id="nextRelInfo.buschnId"
                    :disp-type-cd="nextRelInfo.dispTypeCd"
                  />
                  <p class="title">
                    {{ htmlDecode(nextRelInfo.goodsName) }}
                  </p>
                </div>
              </div>
              <div class="benefit_button">
                <ul class="benefit">
                  <li class="tv">
                    TV쇼핑
                  </li>
                  <li v-if="nextRelInfo.dlvrFreeYn === 'Y' && !PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(nextRelInfo.dispTypeCd)">
                    무료배송
                  </li>
                  <li v-if="nextRelInfo.promIfiYn === 'Y'">
                    무이자
                  </li>
                  <li v-if="nextRelInfo.promPadYn === 'Y'">
                    적립금
                  </li>
                </ul>
                <div
                  v-if="nextRelInfo.orderYn === 'Y' || nextRelInfo.orderYn === 'T_EN' || nextRelInfo.orderYn === 'D_EN'"
                  class="btn_group"
                >
                  <button
                    v-if="PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(nextRelInfo.dispTypeCd)"
                    type="button"
                    class="btn_buy"
                    @click="layerOpen('3', nextTvScheduleIdx, nextRelIdx, 'N', nextRelInfo.goodsName)"
                  >
                    바로구매
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn_buy"
                    @click="moveConsultationRequest(nextRelInfo.catentryId)"
                  >
                    상담신청
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            v-show="nextTvSchedule.RelTotalOrgan.length > 0"
            type="button"
            class="btn collapse"
            @click="onCollapse('1', nextTvScheduleIdx)"
          >
            <span v-show="isRelOpenShow[nextTvScheduleIdx]">관련 상품 ({{ nextTvSchedule.RelTotalOrgan.length }}개)</span>
            <span v-show="isRelCloseShow[nextTvScheduleIdx]">닫기</span>
          </button>
        </div>
      </div>
      <!-- 바로구매 레이어 컴포넌트 -->
      <right-order-option
        v-if="!isNull(partNumber)"
        :key="partNumber"
        :shows-layer="layer[layerIdx]"
        :global-val="{partNumber: partNumber, getProductInfoFlag: true}"
        @layerClose="layerClose()"
      />
      <!-- TV쇼핑 인기 프로그램 -->
      <div v-show="topProgramList.length > 0" class="popular_program" :name="espotKeyName3">
        <div class="title_tag">
          <p class="title">
            {{ htmlDecode(title4) }}
          </p>
        </div>
        <div class="program_box">
          <dl
            v-for="(topProgram, topProgramIdx) in topProgramList"
            :key="topProgramIdx"
          >
            <div
              class="program"
              @click="popularProgramProductDetail(topProgram)"
            >
              <dt>
                <ns-img
                  :src="topProgram.imgUrl"
                  :alt="htmlDecode(topProgram.slotTitle.split('|')[0])"
                  type="WIDE"
                />
              </dt>
              <dd>{{ htmlDecode(topProgram.slotTitle.split('|')[0]) }}</dd>
              <dd class="time">
                {{ htmlDecode(topProgram.slotTitle.split('|')[1]) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        v-for="(nextTvSchedule2, nextTvScheduleIdx2) in nextTvScheduleList2"
        :key="nextTvScheduleIdx2+'_2'"
        class="product_item"
        :name="espotKeyName4"
      >
        <strong :id="'relProductList2'+nextTvScheduleIdx2" class="live_time">
          <span v-if="isToday(nextTvSchedule2.startDtm)">
            오늘
          </span>
          <span v-else>
            내일
          </span> <span class="time">{{ calcDate(getDateParse02(nextTvSchedule2.startDtm), 0, 0, 0, 0, "HH:mm") }}</span> 방송
        </strong>
        <div class="product_box">
          <div
            class="product"
            @click="bizUtil.gotoProductDetail(nextTvSchedule2.partNumber)"
          >
            <figure>
              <ns-img
                :product-number="nextTvSchedule2.partNumber"
                :alt="htmlDecode(nextTvSchedule2.goodsName)"
                type="WIDE"
              />
            </figure>
            <ns-price
              :dc-price="nextTvSchedule2.salePrice"
              :dc-rate="nextTvSchedule2.saleRate"
              :price="nextTvSchedule2.priceofferprice"
              :buschn-id="nextTvSchedule2.busChnId"
              :disp-type-cd="nextTvSchedule2.dispTypeCd"
            />
            <p class="title">
              [{{ htmlDecode(nextTvSchedule2.brandName) }}] {{ htmlDecode(nextTvSchedule2.goodsName) }}
            </p>
          </div>
          <div class="benefit_button">
            <ul class="benefit">
              <li class="tv">
                TV쇼핑
              </li>
              <li v-if="nextTvSchedule2.dlvrFreeYn === 'Y' && !PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(nextTvSchedule2.dispTypeCd)">
                무료배송
              </li>
              <li v-if="nextTvSchedule2.promIfiYn === 'Y'">
                무이자
              </li>
              <li v-if="nextTvSchedule2.promPadYn === 'Y'">
                적립금
              </li>
            </ul>
            <div class="btn_group">
              <button
                v-if="PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(nextTvSchedule2.dispTypeCd)"
                type="button"
                class="btn_buy"
                @click="layerOpen('2', nextTvScheduleIdx2, '', 'N', nextTvScheduleIdx2.goodsName)"
              >
                바로구매
              </button>
              <button
                v-else
                type="button"
                class="btn_buy"
                @click="moveConsultationRequest(nextTvSchedule2.partNumber)"
              >
                상담신청
              </button>
            </div>
          </div>
        </div>
        <div :class="collapse2[nextTvScheduleIdx2]">
          <div class="prd_list">
            <div
              v-for="(nextRelInfo2, nextRelIdx2) in nextTvSchedule2.RelTotalOrgan"
              :key="nextRelIdx2"
              class="item_box"
            >
              <div
                class="item"
                @click="bizUtil.gotoProductDetail(nextRelInfo2.catentryId)"
              >
                <figure>
                  <ns-img
                    :product-number="nextRelInfo2.catentryId"
                    :width="176"
                    :height="176"
                    :alt="htmlDecode(nextRelInfo2.goodsName)"
                  />
                </figure>
                <div class="price_title">
                  <ns-price
                    :dc-price="nextRelInfo2.salePrice"
                    :buschn-id="nextRelInfo2.buschnId"
                    :disp-type-cd="nextRelInfo2.dispTypeCd"
                  />
                  <p class="title">
                    {{ htmlDecode(nextRelInfo2.goodsName) }}
                  </p>
                </div>
              </div>
              <div class="benefit_button">
                <ul class="benefit">
                  <li class="tv">
                    TV쇼핑
                  </li>
                  <li v-if="nextRelInfo2.dlvrFreeYn === 'Y' && !PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(nextRelInfo2.dispTypeCd)">
                    무료배송
                  </li>
                  <li v-if="nextRelInfo2.promIfiYn === 'Y'">
                    무이자
                  </li>
                  <li v-if="nextRelInfo2.promPadYn === 'Y'">
                    적립금
                  </li>
                </ul>
                <div
                  v-if="nextRelInfo2.orderYn === 'Y' || nextRelInfo2.orderYn === 'T_EN' || nextRelInfo2.orderYn === 'D_EN'"
                  class="btn_group"
                >
                  <button
                    v-if="PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(nextRelInfo2.dispTypeCd)"
                    type="button"
                    class="btn_buy"
                    @click="layerOpen('4', nextTvScheduleIdx2, nextRelIdx2, 'N', nextRelInfo2.goodsName)"
                  >
                    바로구매
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn_buy"
                    @click="moveConsultationRequest(nextRelInfo2.catentryId)"
                  >
                    상담신청
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            v-show="nextTvSchedule2.RelTotalOrgan.length > 0"
            type="button"
            class="btn collapse"
            @click="onCollapse('2', nextTvScheduleIdx2)"
          >
            <span v-show="isRelOpenShow2[nextTvScheduleIdx2]">관련 상품 ({{ nextTvSchedule2.RelTotalOrgan.length }}개)</span>
            <span v-show="isRelCloseShow2[nextTvScheduleIdx2]">닫기</span>
          </button>
        </div>
      </div>
    </section>
    <section class="tv_shopping_popular">
      <div v-show="prdRecommendList2.length > 0" class="title_tag" :name="espotKeyName5">
        <p class="title">
          {{ htmlDecode(title2) }}
        </p>
      </div>
      <swiper
        ref="swiperProgressbar"
        :options="swiperProgressbar"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(prdRecommend2, recommendIdx2) in prdRecommendList2"
          :key="recommendIdx2"
        >
          <div
            class="recommend_item"
            @click="preRecommendProductDetail(
              prdRecommend2.partnumber,
              { clksrc: `TV쇼핑_${title2.replace(/\s/g, '')}_인기방송상품` },
              title2,
              prdRecommend2.itncatentrynm,
              prdRecommend2.brandKorNm,
              prdRecommend2.price
            )"
          >
            <figure>
              <ns-img
                :product-number="prdRecommend2.partnumber"
                :width="320"
                :height="320"
                :alt="htmlDecode(prdRecommend2.itncatentrynm)"
                :is-adult="prdRecommend2.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="prdRecommend2.dcPrice"
              :buschn-id="prdRecommend2.buschnId"
              :disp-type-cd="prdRecommend2.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(prdRecommend2.itncatentrynm) }}
            </p>
          </div>
        </swiper-slide>
      </swiper>
      <div v-show="prdRecommendList3.length > 0" class="title_tag" :name="espotKeyName6">
        <p class="title">
          {{ htmlDecode(title3) }}
        </p>
      </div>
      <swiper
        ref="swiperProgressbar"
        :options="swiperProgressbar"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(prdRecommend3, recommendIdx3) in prdRecommendList3"
          :key="recommendIdx3"
        >
          <div
            class="recommend_item"
            @click="preRecommendProductDetail(
              prdRecommend3.partnumber,
              { clksrc: `TV쇼핑_${title3.replace(/\s/g, '')}_인기방송상품` },
              title3,
              prdRecommend3.itncatentrynm,
              prdRecommend3.brandKorNm,
              prdRecommend3.price
            )"
          >
            <figure>
              <ns-img
                :product-number="prdRecommend3.partnumber"
                :width="320"
                :height="320"
                :alt="htmlDecode(prdRecommend3.itncatentrynm)"
                :is-adult="prdRecommend3.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="prdRecommend3.dcPrice"
              :buschn-id="prdRecommend3.buschnId"
              :disp-type-cd="prdRecommend3.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(prdRecommend3.itncatentrynm) }}
            </p>
          </div>
        </swiper-slide>
      </swiper>
    </section>
  </div>
</template>

<script>
import { PRODUCT_CONST } from '@/common/constants/product/product'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import RightOrderOption from '@/components/product/RightOrderOption'
import {
  isNull,
  insertCommas,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import {
  calcDate,
  getDateParse02
} from '@frameworks/dateutil/dateUtil'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import consultationMixin from '@/mixins/product/consultationMixin'
import historyMixin from '@/mixins/common/historyMixin'

export default {
  name: 'TvShopping',
  components: {
    NsImg,
    NsPrice,
    RightOrderOption
  },
  mixins: [
    consultationMixin,
    historyMixin
  ],
  data () {
    return {
      swiperProgressbar: {
        slidesPerView: 'auto',
        spaceBetween: 8,
        pagination: false
      },
      collapse: [], // 더보기
      collapse2: [], // 더보기
      seen: {
        text: '상품 더 보기 (2개)'
      },
      prdRecommendList: [], // 추천 방송상품 리스트
      prdRecommendList2: [], // 홈&리빙 인기 방송상품 리스트
      prdRecommendList3: [], // 패션&뷰티 방송상품 리스트
      benefitList: [], // 혜택 리스트
      promotionBannerList: [], // 프로모션 띠배너 리스트
      topProgramList: [], // 인기프로그램 리스트
      nextTvScheduleList: [], // 다음 방송상품 리스트
      nextTvScheduleList2: [], // 다음 방송상품 리스트
      partNumber: '', // 상품코드
      isRelOpenShow: [], // 관련상품보기
      isRelCloseShow: [], // 관련상품보기 닫기
      isRelOpenShow2: [], // 관련상품보기
      isRelCloseShow2: [], // 관련상품보기 닫기
      title1: '',
      title2: '',
      title3: '',
      title4: '',
      nextTvScheduleCnt: 3, // 다음방송 3개까지만 보여주기
      espotKeyName1: '',
      espotKeyName2: '',
      espotKeyName3: '',
      espotKeyName4: '',
      espotKeyName5: '',
      espotKeyName6: ''
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    PRODUCT_CONST () {
      return PRODUCT_CONST
    }
  },
  created () {
    // 마케팅 스크립트 적용 부분
    // Airbridge
    marketingUtil.airbridgeLogger.send({
      event: marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP, // 편성매장 - TV쇼핑
      data: {
        action: '편집매장',
        label: '편집매장 조회',
        categoryNm: 'tvshopping'
      }
    })
  },
  async mounted () {
    await this.callNsEspotCommon()

    // 뒤로가기 시 이전 좌표로 이동
    this.$nextTick(() => {
      this.scrollToSavedPosition()
    })
  },
  methods: {
    insertCommas,
    htmlDecode,
    isNull,
    calcDate,
    getDateParse02,
    /**
     *  TV쇼핑 인기프로그램 클릭
     */
    popularProgramProductDetail (topProgram) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV쇼핑',
          eventAction: '인기프로그램',
          eventLabel: isNull(topProgram.marketingText) ? topProgram.contentName : htmlDecode(topProgram.marketingText.split('|')[0]),
          params: {
            t1: null
          }
        }
      })
      bizUtil.espotClickEvent(topProgram.clickTarget, topProgram.contentsId, topProgram.clickCode, topProgram.espotId, topProgram.mdUrl, null, 'TV쇼핑_인기프로그램')
    },
    /**
     *  title별(홈&리빙 / 패션&뷰티) 인기프로그램/인기상품 클릭
     * @param {string} partnumber 상품번호
     * @param {string} clksrc 전자상거래코드
     * @param {string} title 제목
     * @param {string} productName 상품이름
     * @param {string} brandName 상품브랜드네임
     * @param {string} productPrice 상품가격
     */
    preRecommendProductDetail (partnumber, clksrc, title, productName, brandName, productPrice) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV쇼핑',
          eventAction: `${title}_인기방송상품`,
          eventLabel: `인기상품상세_${productName}`,
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
              id: String(partnumber),
              name: productName,
              brand: brandName,
              dimension16: 'eTV',
              dimension20: 'NS LIVE'
            }
          ],
          subparams: {
            t1: 'TV쇼핑',
            t2: title,
            t3: '인기방송상품',
            product_list: `TV쇼핑_${title}_인기방송상품`
          }
        }
      })

      bizUtil.gotoProductDetail(partnumber, { clksrc })
    },
    /**
     * 프로모션 배너 클릭
     *
     * @param {string} clickTarget 이동할 타겟 구분(Product, Category, Internal, External)
     * @param {string} contentsId 컨텐츠 ID
     * @param {string} clickCode 이동할 상품코드 또는 카테고리코드
     * @param {string} espotId ESPOT ID
     * @param {string} mdUrl 이동할 md URL
     * @param {string} contentName 마케팅 텍스트
     */
    promotionBannerLogging (clickTarget, contentsId, clickCode, espotId, mdUrl, contentName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV쇼핑',
          eventAction: '중간띠배너',
          eventLabel: `${contentName}`,
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
              dimension16: 'eTV',
              dimension20: 'NS LIVE'
            }
          ],
          subparams: {
            t1: 'TV쇼핑',
            t2: '중간배너',
            product_list: 'TV쇼핑_중간배너'
          }
        }
      })

      bizUtil.espotClickEvent(clickTarget, contentsId, clickCode, espotId, mdUrl, null, 'TV쇼핑_중간배너')
    },
    /**
     * 혜택 클릭
     * @param {string} clickTarget 이동할 타겟 구분(Product, Category, Internal, External)
     * @param {string} contentsId 컨텐츠 ID
     * @param {string} clickCode 이동할 상품코드 또는 카테고리코드
     * @param {string} espotId ESPOT ID
     * @param {string} mdUrl 이동할 md URL
     * @param {string} contentName 마케팅 텍스트
     */
    espotClickEventLogging (clickTarget, contentsId, clickCode, espotId, mdUrl, contentName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV쇼핑',
          eventAction: '혜택',
          eventLabel: `${contentName}`,
          params: {
            t1: null
          }
        }
      })
      bizUtil.espotClickEvent(clickTarget, contentsId, clickCode, espotId, mdUrl)
    },
    /**
     * 다음방송상품 상세 보기 클릭
     * @param {Object} productInfo 상품정보
     * @param {string} clksrc 전자상거래코드
     */
    nextProductDetailLogging (productInfo, clksrc) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV쇼핑',
          eventAction: '상품상세',
          eventLabel: `상품상세_${productInfo.goodsName}`,
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
              id: String(productInfo.goodsId),
              name: `${productInfo.goodsName}`,
              brand: productInfo.brandName,
              dimension16: 'eTV',
              dimension20: 'NS LIVE'
            }
          ],
          subparams: {
            t1: 'TV 쇼핑',
            t2: '다음방송상품',
            product_list: clksrc.clksrc
          }
        }
      })
      bizUtil.gotoProductDetail(productInfo.partNumber, { clksrc })
    },
    /**
     * 추천방송상품 상세 보기 클릭
     * @param {Object} productInfo 상품정보
     * @param {string} clksrc 전자상거래코드
     */
    recomProductDetailLogging (productInfo, clksrc) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV쇼핑',
          eventAction: '추천방송상품',
          eventLabel: `추천상품상세_${productInfo.itncatentrynm}`,
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
              id: String(productInfo.partnumber),
              name: productInfo.itncatentrynm,
              brand: productInfo.brandKorNm,
              dimension16: 'eTV',
              dimension20: 'NS LIVE'
            }
          ],
          subparams: {
            t1: 'TV 쇼핑',
            t2: '추천방송상품',
            product_list: clksrc.clksrc
          }
        }
      })
      bizUtil.gotoProductDetail(productInfo.partnumber, { clksrc })
    },
    /**
     * 관련 상품 보기/닫기
     * @param {String} flg
     * @param {Number} infoIdx
     */
    onCollapse (flg, infoIdx) {
      let scrollToId = ''

      if (flg === '1') {
        scrollToId = `#relProductList${infoIdx}`
        if (this.collapse[infoIdx] === 'product_related open') {
          this.collapse[infoIdx] = 'product_related'
          this.isRelOpenShow[infoIdx] = true
          this.isRelCloseShow[infoIdx] = false

          window.scrollTo(0, document.querySelector(scrollToId).offsetTop - document.querySelector('.app_category').offsetHeight)
          setTimeout(() => {
            document.getElementById('app').classList.value = 'hide'
          }, 100)
        } else {
          this.collapse[infoIdx] = 'product_related open'
          this.isRelOpenShow[infoIdx] = false
          this.isRelCloseShow[infoIdx] = true

          // android offset 보정
          const pageYOffset = window.pageYOffset
          this.$nextTick(() => {
            const product = document.querySelector(scrollToId)
            const relatedProduct = product.nextSibling.nextSibling

            let trialCount = 0
            const intervalRef = setTimeout(() => {
              if (trialCount > 10) {
                clearInterval(intervalRef)
                return
              }

              trialCount++
              const isItOpen = relatedProduct.classList.contains('open')

              if (isItOpen) {
                window.scrollTo(0, pageYOffset)
                clearInterval(intervalRef)
              }
            }, 10)
          })
        }
      } else {
        scrollToId = `#relProductList2${infoIdx}`
        if (this.collapse2[infoIdx] === 'product_related open') {
          this.collapse2[infoIdx] = 'product_related'
          this.isRelOpenShow2[infoIdx] = true
          this.isRelCloseShow2[infoIdx] = false

          window.scrollTo(0, document.querySelector(scrollToId).offsetTop - document.querySelector('.app_category').offsetHeight)
          setTimeout(() => {
            document.getElementById('app').classList.value = 'hide'
          }, 100)
        } else {
          this.collapse2[infoIdx] = 'product_related open'
          this.isRelOpenShow2[infoIdx] = false
          this.isRelCloseShow2[infoIdx] = true

          // android offset 보정
          const pageYOffset = window.pageYOffset
          this.$nextTick(() => {
            const product = document.querySelector(scrollToId)
            const relatedProduct = product.nextSibling.nextSibling

            let trialCount = 0
            const intervalRef = setTimeout(() => {
              if (trialCount > 10) {
                clearInterval(intervalRef)
                return
              }

              trialCount++
              const isItOpen = relatedProduct.classList.contains('open')

              if (isItOpen) {
                window.scrollTo(0, pageYOffset)
                clearInterval(intervalRef)
              }
            }, 10)
          })
        }
      }

      this.collapse = [...this.collapse]
      this.isRelOpenShow = [...this.isRelOpenShow]
      this.isRelCloseShow = [...this.isRelCloseShow]
      this.collapse2 = [...this.collapse2]
      this.isRelOpenShow2 = [...this.isRelOpenShow2]
      this.isRelCloseShow2 = [...this.isRelCloseShow2]

      this.$forceUpdate()
    },
    /**
     * 티비쇼핑 메인, 편성표 리스트 호출
     */
    async callNsEspotCommon () {
      await this.callNsEspotMain()
      await this.callTvScheduleList() // 다음 방송상품 리스트
    },
    /**
     * 티비쇼핑 메인 호출
     */
    async callNsEspotMain () {
      const param = {
        typeFlag: 'espot',
        // 추천 방송상품 $ 홈&리빙 $ 패&뷰 $ 혜택 $ 프로모션 띠배너 $ 인기프로그램
        espotInfo: 'EZ_TV_RCMD1|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_RCMD2|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_RCMD3|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_BNFT|ESPOT_CNTNT4W|1|4|0$EZ_TV_BANNER|ESPOT_CNTNTLIST|1|2|0$EZ_TV_PROGRAM|ESPOT_CNTNT2W|1|9999|0'
      }

      const successHandling = data => {
        this.espotKeyName1 = '_EZ_TV_RCMD1'
        this.espotKeyName5 = '_EZ_TV_RCMD2'
        this.espotKeyName6 = '_EZ_TV_RCMD3'
        this.espotKeyName3 = '_EZ_TV_PROGRAM'

        this.title1 = !isNull(data.msg.espotExtendList._EZ_TV_RCMD1) ? data.msg.espotExtendList._EZ_TV_RCMD1.titleContent.mainTitle : ''
        this.title2 = !isNull(data.msg.espotExtendList._EZ_TV_RCMD2) ? data.msg.espotExtendList._EZ_TV_RCMD2.titleContent.mainTitle : ''
        this.title3 = !isNull(data.msg.espotExtendList._EZ_TV_RCMD3) ? data.msg.espotExtendList._EZ_TV_RCMD3.titleContent.mainTitle : ''
        this.title4 = !isNull(data.msg.espotExtendList._EZ_TV_PROGRAM) ? data.msg.espotExtendList._EZ_TV_PROGRAM.titleContent.mainTitle : ''

        for (let i = 0; i < data.msg.espotList.length; i++) {
          // 추천 방송상품
          if (!isNull(data.msg.espotList[i]._EZ_TV_RCMD1)) {
            this.prdRecommendList = data.msg.espotList[i]._EZ_TV_RCMD1
          }
          // 홈&리빙 방송상품
          if (!isNull(data.msg.espotList[i]._EZ_TV_RCMD2)) {
            this.prdRecommendList2 = data.msg.espotList[i]._EZ_TV_RCMD2
          }
          // 패&뷰 방송상품
          if (!isNull(data.msg.espotList[i]._EZ_TV_RCMD3)) {
            this.prdRecommendList3 = data.msg.espotList[i]._EZ_TV_RCMD3
          }
          // 혜택
          if (!isNull(data.msg.espotList[i]._EZ_TV_BNFT)) {
            this.benefitList = data.msg.espotList[i]._EZ_TV_BNFT
          }
          // 프로모션 띠배너
          if (!isNull(data.msg.espotList[i]._EZ_TV_BANNER)) {
            this.promotionBannerList = data.msg.espotList[i]._EZ_TV_BANNER
          }
          // 인기프로그램
          if (!isNull(data.msg.espotList[i]._EZ_TV_PROGRAM)) {
            this.topProgramList = data.msg.espotList[i]._EZ_TV_PROGRAM
          }
        }

        // 마케팅 스크립트 적용 부분
        // 네이버 프리미엄 로그
        marketingUtil.naverLogger.send({
          type: marketingUtil.naverLogger.TRACE_INFLOW
        })
      }

      await this.$nsaxios.post('NSFixedShopCmd', param, successHandling)
    },
    /**
     * 편성표 조회
     */
    async callTvScheduleList () {
      const param = {
        typeFlag: 'espot',
        espotInfo: 'EZ_TV_BROAD|TVSCHEDULE24_NONE|1|9999|0'
      }

      const successHandling = data => {
        this.callBackTvScheduleList(data)
      }

      await this.$nsaxios.post('NSFixedShopNoCacheCmd', param, successHandling)
    },
    /**
     * 편성표 조회 callback
     * @param {Object}} data - object data
     */
    callBackTvScheduleList (data) {
      this.espotKeyName2 = '_EZ_TV_BROAD'
      this.espotKeyName4 = '_EZ_TV_BROAD'

      let tmpTvScheduleList = []
      let tmpIdx = 0
      for (let i = 0; i < data.msg.length; i++) {
        if (!isNull(data.msg[i]._EZ_TV_BROAD)) {
          tmpTvScheduleList = data.msg[i]._EZ_TV_BROAD[0].TvSchedule.TotalOrgan
        }
      }

      this.layer = []
      this.collapse = []
      this.isRelOpenShow = []
      this.isRelCloseShow = []
      this.collapse2 = []
      this.isRelOpenShow2 = []
      this.isRelCloseShow2 = []
      const tmpNextTvScheduleList = []
      for (let i = 0; i < tmpTvScheduleList.length; i++) {
        if ((tmpTvScheduleList[i].orderYn === 'Y' || tmpTvScheduleList[i].orderYn === 'T_EN' || tmpTvScheduleList[i].orderYn === 'D_EN') && tmpTvScheduleList[i].onAirFlag !== 'B') {
          const tmpStartDtm = `${tmpTvScheduleList[i].startDtm.substr(0, 4)}-${tmpTvScheduleList[i].startDtm.substr(4, 2)}-${tmpTvScheduleList[i].startDtm.substr(6, 2)} ${tmpTvScheduleList[i].startDtm.substr(8, 2)}:${tmpTvScheduleList[i].startDtm.substr(10, 2)}`

          if (calcDate(tmpStartDtm, 0, 0, 0, 0, 'yyyyMMddHHmm') < calcDate('', 0, 0, 0, 1, 'yyyyMMdd0200')) {
            tmpNextTvScheduleList.push(tmpTvScheduleList[i])
          } else if (calcDate(tmpStartDtm, 0, 0, 0, 0, 'yyyyMMddHHmm') > calcDate('', 0, 0, 0, 1, 'yyyyMMdd0600')) {
            tmpNextTvScheduleList.push(tmpTvScheduleList[i])
          }
        }
      }

      for (let i = 0; i < tmpNextTvScheduleList.length; i++) {
        if (tmpIdx < this.nextTvScheduleCnt) {
          this.nextTvScheduleList.push(tmpNextTvScheduleList[i])
        } else {
          this.nextTvScheduleList2.push(tmpNextTvScheduleList[i])
        }
        this.layer.push(false)

        if (tmpIdx < this.nextTvScheduleCnt) {
          this.collapse.push('product_related')
          this.isRelOpenShow.push(true)
          this.isRelCloseShow.push(false)
        } else {
          this.collapse2.push('product_related')
          this.isRelOpenShow2.push(true)
          this.isRelCloseShow2.push(false)
        }

        tmpIdx++
      }
    },
    /**
     * 바로주문 열기
     * @param {Number} infoIdx - 선택 index
     * @param {String} flg - 버튼위치 구분
     * @param {Number} relIdx - 버튼 클릭 index
     * @param {String} intPrdYn - 상담하기 여부 : 상담하기=Y 바로구매=N
     * @param {String} goodsName - 상품이름
     */
    layerOpen (flg, infoIdx, relIdx, intPrdYn, goodsName) {
      let eventAction = ''
      let eventLabel = ''
      if (intPrdYn === 'Y') {
        eventAction = '상담신청'
        eventLabel = `상담신청_${goodsName}`
      } else {
        eventAction = '바로구매'
        eventLabel = `바로구매_${goodsName}`
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV쇼핑',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      this.layerIdx = infoIdx
      if (flg === '1') {
        this.partNumber = this.nextTvScheduleList[infoIdx].partNumber
      } else if (flg === '2') {
        this.partNumber = this.nextTvScheduleList2[infoIdx].partNumber
      } else if (flg === '3') {
        this.partNumber = this.nextTvScheduleList[infoIdx].RelTotalOrgan[relIdx].catentryId
      } else {
        this.partNumber = this.nextTvScheduleList2[infoIdx].RelTotalOrgan[relIdx].catentryId
      }
      this.layer[this.layerIdx] = true
    },
    /**
     * 바로주문 닫기
     */
    layerClose () {
      this.partNumber = ''
      this.layer[this.layerIdx] = false
    },
    /**
     * 오늘 내일 여부
     */
    isToday (startDtm) {
      return calcDate(getDateParse02(startDtm), 0, 0, 0, 0, 'yyyyMMdd') === calcDate('', 0, 0, 0, 0, 'yyyyMMdd') ||
      calcDate(getDateParse02(startDtm), 0, 0, 0, 0, 'yyyyMMddHH') < calcDate('', 0, 0, 0, 1, 'yyyyMMdd02')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/ShopPlusTvShopping";
</style>
