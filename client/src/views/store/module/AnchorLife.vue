<template>
  <!-- 앵커: 생활/가전 -->
  <section class="anchor_life">
    <section name="_EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST">
      <!-- 7A 배너 영역 -->
      <div
        v-if="!A7contentsDeactve"
        class="category_top"
        aria-label="배너"
        @click="bannerCommonClickEvent(
          A7contents.clickTarget,
          A7contents.contentsId,
          A7contents.clickCode,
          A7contents.espotId,
          A7contents.mdUrl,
          null,
          '메인_생활/가전_배너',
          isNull(A7contents.marketingText) ? A7contents.contentName : A7contents.marketingText
        )"
      >
        <figure>
          <ns-img
            :src="A7contents.imgUrl"
            :alt="A7contents.marketingText"
            :product-number="A7contents.clickTarget === 'Product' ? A7contents.clickCode : null"
            type="WIDE"
            replace="SQUARE"
          />
        </figure>
        <template v-if="hasBrTag(A7contents.marketingText)">
          <p class="title_main">
            {{ brTagSplit(getHtmlDecode(A7contents.marketingText), 'title') }}
          </p>
          <p class="title_sub">
            {{ brTagSplit(getHtmlDecode(A7contents.marketingText), 'tag') }}
          </p>
        </template>
        <p v-else class="title_main">
          {{ brTagSplit(getHtmlDecode(A7contents.marketingText), 'title') }}
        </p>
      </div>
      <!-- // 7A 배너 영역 -->

      <!-- 7A 상품 영역 -->
      <ul
        class="promotion_list"
        :class="checkMoreView(A7ExendData) ? 'has_total_view' : ''"
      >
        <li
          v-for="(value, index) in A7products"
          :key="`${index}`"
        >
          <template v-if="index < 3">
            <figure>
              <router-link
                :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_생활/가전_상품' }}"
                aria-label="상품"
                @click.native="productDetailLogging(value.itncatentrynm)"
              >
                <ns-img
                  :product-number="value.partnumber"
                  :width="144"
                  :height="144"
                  :alt="value.itncatentrynm"
                  :is-adult="value.adultItemFlag"
                />
              </router-link>
            </figure>
            <div class="price_title">
              <router-link
                :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_생활/가전_상품' }}"
                aria-label="상품"
                @click.native="productDetailLogging(value.itncatentrynm)"
              >
                <ns-price
                  :dc-price="value.dcPrice"
                  :dc-rate="value.dcRate"
                  :price="value.price"
                  :mm-rntal-prc="value.mmRntalPrc"
                  :prc-wave-disp="value.prcWaveDisp"
                  :buschn-id="value.buschnId"
                  :disp-type-cd="value.dispTypeCd"
                />
                <p class="title">
                  {{ getHtmlDecode(value.itncatentrynm) }}
                </p>
              </router-link>
            </div>
            <div
              v-if="hasBuyOrCartButton(A7ExendData) === 'BASKET'"
              class="button_box"
            >
              <button
                type="button"
                class="cart"
                @click="
                  addToCartLogging(
                    value.partnumber,
                    value.dispTypeCd,
                    value.buschnId,
                    value.catentryId,
                    value.brandKorNm,
                    value.itncatentrynm,
                    checkIntangiblePrd(value.dispTypeCd)
                  )
                "
              >
                장바구니담기
              </button>
            </div>
          </template>
        </li>
      </ul>
      <!-- 더보기 영역 -->
      <!-- <div v-if="checkMoreView(A7ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            A7ExendData.titleContent.clickTarget,
            A7ExendData.titleContent.contentsId,
            A7ExendData.titleContent.clickCode,
            A7ExendData.titleContent.espotId,
            A7ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(A7ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
    <!-- // 더보기 영역 -->
    <!-- // 7A 상품 영역 -->
    </section>

    <section name="_EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE">
      <!-- 7B 배너 영역 -->
      <div
        v-if="!B7contentsDeactve"
        class="category_top"
        aria-label="배너"
        @click="bannerCommonClickEvent(
          B7contents.clickTarget,
          B7contents.contentsId,
          B7contents.clickCode,
          B7contents.espotId,
          B7contents.mdUrl,
          null,
          '메인_생활/가전_배너',
          isNull(B7contents.marketingText) ? B7contents.contentName : B7contents.marketingText
        )"
      >
        <figure>
          <ns-img
            :src="B7contents.imgUrl"
            :alt="B7contents.marketingText"
            :product-number="B7contents.clickTarget === 'Product' ? B7contents.clickCode : null"
            type="WIDE"
            replace="SQUARE"
          />
        </figure>
        <template v-if="hasBrTag(B7contents.marketingText)">
          <p class="title_main">
            {{ brTagSplit(getHtmlDecode(B7contents.marketingText), 'title') }}
          </p>
          <p class="title_sub">
            {{ brTagSplit(getHtmlDecode(B7contents.marketingText), 'tag') }}
          </p>
        </template>
        <p v-else class="title_main">
          {{ brTagSplit(getHtmlDecode(B7contents.marketingText), 'title') }}
        </p>
      </div>
      <!-- // 7B 배너 영역 -->

      <!-- 7B 상품 영역 -->
      <swiper
        ref="swiperList"
        :options="swiperList"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(value, index) in B7products"
          :key="`${index}`"
        >
          <router-link
            :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_생활/가전_상품' }}"
            aria-label="상품"
            @click.native="productDetailLogging(value.itncatentrynm)"
          >
            <figure>
              <ns-img
                :product-number="value.partnumber"
                :width="320"
                :height="320"
                :alt="value.itncatentrynm"
                :is-adult="value.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="value.dcPrice"
              :mm-rntal-prc="value.mmRntalPrc"
              :prc-wave-disp="value.prcWaveDisp"
              :buschn-id="value.buschnId"
              :disp-type-cd="value.dispTypeCd"
            />
            <p class="title">
              {{ getHtmlDecode(value.itncatentrynm) }}
            </p>
          </router-link>
        </swiper-slide>
      </swiper>
      <!-- 더보기 영역 -->
      <!-- <div v-if="checkMoreView(B7ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            B7ExendData.titleContent.clickTarget,
            B7ExendData.titleContent.contentsId,
            B7ExendData.titleContent.clickCode,
            B7ExendData.titleContent.espotId,
            B7ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(B7ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
    <!-- // 더보기 영역 -->
    <!-- // 7B 상품 영역 -->
    </section>

    <section name="_EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST">
      <!-- 7C 배너 영역 -->
      <ul
        v-if="C7products.length > 0"
        class="banner_list"
      >
        <li
          v-for="(value, index) in C7products"
          :key="`${index}`"
        >
          <figure
            aria-label="배너 목록"
            @click="bannerCommonClickEvent(
              value.clickTarget,
              value.contentsId,
              value.clickCode,
              value.espotId,
              value.mdUrl,
              null,
              '메인_중간띠배너',
              value.slotTitle
            )"
          >
            <ns-img
              :src="value.imgUrl"
              :alt="value.slotTitle !== '' ? value.slotTitle : '메인 중간띠배너'"
              type="WIDE"
            />
          </figure>
        </li>
      </ul>
      <!-- 더보기 영역 -->
      <!-- <div v-if="checkMoreView(C7ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            C7ExendData.titleContent.clickTarget,
            C7ExendData.titleContent.contentsId,
            C7ExendData.titleContent.clickCode,
            C7ExendData.titleContent.espotId,
            C7ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(C7ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
    <!-- // 더보기 영역 -->
    <!-- // 7C 배너 영역 -->
    </section>

    <!-- 바로장바구니 레이어 컴포넌트 -->
    <right-order-option
      v-if="anchorLayer"
      :shows-layer="anchorLayer"
      :global-val="globalVal"
      @layerClose="layerClose"
    />
  </section>
</template>

<script>
import {
  insertCommas,
  isNull
} from '@utils/commonutil/commonUtil'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import RightOrderOption from '@/components/product/RightOrderOption'
import toastUtil from '@/common/frameworks/toastUtil'

export default {
  name: 'AnchorLife',
  components: {
    NsImg,
    NsPrice,
    RightOrderOption
  },
  mixins: [
    storeMixProductAddCartMixin,
    storeProductTypeMixin,
    anchorMixin
  ],
  props: {
    espotData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      swiperList: {
        slidesPerView: 'auto',
        spaceBetween: 8
      },
      A7contents: this.espotData.espotList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST[0].banner,
      A7contentsDeactve: !isNull(this.espotData.espotList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST[0].banner._CNTNT_INFO),
      B7contents: this.espotData.espotList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE[0].banner,
      B7contentsDeactve: !isNull(this.espotData.espotList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE[0].banner._CNTNT_INFO),
      A7products: this.espotData.espotList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST[0].prdList,
      B7products: this.espotData.espotList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE[0].prdList,
      C7products: this.espotData.espotList._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST,
      A7ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST,
      B7ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE,
      C7ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST,
      finishedSetParamFlag: false,
      layerFlag: false
    }
  },
  methods: {
    insertCommas,
    isNull,
    /**
      * 바로담기 클릭
      * @param {String} partnumber 상품코드
      * @param {String} dispTypeCd 타입코드
      * @param {String} buschnId 채널id
      * @param {String} catentryId 상품번호
      * @param {String} brandKorNm 브랜드명
      * @param {String} itncatentrynm 상품명
      * @param {bool} isFormlessProduct 무형상품 여부 (true: 무형상품, false: 무형상품 아님)
      */
    addToCartLogging (partnumber, dispTypeCd, buschnId, catentryId, brandKorNm, itncatentrynm, isFormlessProduct = false) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: '바로담기',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
      if (isFormlessProduct) {
        const msg = '장바구니에 담을 수 없는 상품입니다.'
        toastUtil.show(msg)
      } else {
        this.addToCart(partnumber, dispTypeCd, buschnId, null, catentryId, null, brandKorNm, itncatentrynm)
      }
    },
    /**
     * 상품 클릭
     * @param {String} productName 상품명
     */
    productDetailLogging (productName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: 'Tab_상품목록',
          eventLabel: `뷰티/패션_${productName}`,
          params: {
            t1: null
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/AnchorLife";
</style>
