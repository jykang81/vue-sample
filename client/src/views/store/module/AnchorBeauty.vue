<template>
  <!-- 앵커: 뷰티/패션 -->
  <section class="anchor_beauty">
    <!-- 6A 배너 영역 -->
    <section name="_EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W">
      <div
        v-if="!A6contentsDeactve"
        class="category_top"
        aria-label="배너"
        @click="bannerCommonClickEvent(
          A6contents.clickTarget,
          A6contents.contentsId,
          A6contents.clickCode,
          A6contents.espotId,
          A6contents.mdUrl,
          null,
          '메인_뷰티/패션_배너',
          isNull(A6contents.marketingText) ? A6contents.contentName : A6contents.marketingText
        )"
      >
        <figure>
          <ns-img
            :src="A6contents.imgUrl"
            :alt="A6contents.marketingText"
            :product-number="A6contents.clickTarget === 'Product' ? A6contents.clickCode : null"
            type="WIDE"
            replace="SQUARE"
          />
        </figure>
        <template v-if="hasBrTag(A6contents.marketingText)">
          <p class="title_main">
            {{ brTagSplit(getHtmlDecode(A6contents.marketingText), 'title') }}
          </p>
          <p class="title_sub">
            {{ brTagSplit(getHtmlDecode(A6contents.marketingText), 'tag') }}
          </p>
        </template>
        <p v-else class="title_main">
          {{ brTagSplit(getHtmlDecode(A6contents.marketingText), 'title') }}
        </p>
      </div>
      <!-- // 6A 배너 영역 -->

      <!-- 6A 상품 영역 -->
      <ul class="promotion_grid">
        <li
          v-for="(value, index) in A6products.slice(0,8)"
          :key="`${index}`"
        >
          <router-link
            :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_뷰티/패션_상품' }}"
            aria-label="상품"
            @click.native="productDetailLogging(value.itncatentrynm)"
          >
            <figure>
              <ns-img
                :product-number="value.partnumber"
                :width="180"
                :height="180"
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
          </router-link>
        </li>
      </ul>
      <!-- 더보기 영역 -->
      <!-- <div v-if="checkMoreView(A6ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            A6ExendData.titleContent.clickTarget,
            A6ExendData.titleContent.contentsId,
            A6ExendData.titleContent.clickCode,
            A6ExendData.titleContent.espotId,
            A6ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(A6ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
    </section>
    <!-- // 더보기 영역 -->
    <!-- // 6A 상품 영역 -->

    <!-- 6B 배너 영역 -->
    <section name="_EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE">
      <div
        v-if="!B6contentsDeactve"
        class="category_top"
        aria-label="배너"
        @click="bannerCommonClickEvent(
          B6contents.clickTarget,
          B6contents.contentsId,
          B6contents.clickCode,
          B6contents.espotId,
          B6contents.mdUrl,
          null,
          '메인_뷰티/패션_배너',
          isNull(B6contents.marketingText) ? B6contents.contentName : B6contents.marketingText
        )"
      >
        <figure>
          <ns-img
            :src="B6contents.imgUrl"
            :alt="B6contents.marketingText"
            :product-number="B6contents.clickTarget === 'Product' ? B6contents.clickCode : null"
            type="WIDE"
            replace="SQUARE"
          />
        </figure>
        <template v-if="hasBrTag(B6contents.marketingText)">
          <p class="title_main">
            {{ brTagSplit(getHtmlDecode(B6contents.marketingText), 'title') }}
          </p>
          <p class="title_sub">
            {{ brTagSplit(getHtmlDecode(B6contents.marketingText), 'tag') }}
          </p>
        </template>
        <p v-else class="title_main">
          {{ brTagSplit(getHtmlDecode(B6contents.marketingText), 'title') }}
        </p>
      </div>
      <!-- // 6B 배너 영역 -->

      <!-- 6B 상품 영역 -->
      <swiper
        ref="swiperList"
        :options="swiperList"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(value, index) in B6products"
          :key="`${index}`"
        >
          <router-link
            :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_뷰티/패션_상품' }}"
            aria-label="상품"
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
      <!-- <div v-if="checkMoreView(B6ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            B6ExendData.titleContent.clickTarget,
            B6ExendData.titleContent.contentsId,
            B6ExendData.titleContent.clickCode,
            B6ExendData.titleContent.espotId,
            B6ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(B6ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
    </section>
    <!-- // 더보기 영역 -->
    <!-- // 6B 상품 영역 -->

    <!-- 6C 배너 영역 -->
    <section name="_EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST">
      <ul
        v-if="C6products.length > 0"
        class="banner_list"
      >
        <li
          v-for="(value, index) in C6products"
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
    </section>
    <!-- // 6C 배너 영역 -->
    <!-- 더보기 영역 -->
    <!-- <div v-if="checkMoreView(C6ExendData)" class="btn_total_view">
      <button
        type="button"
        @click="bannerCommonClickEvent(
          C6ExendData.titleContent.clickTarget,
          C6ExendData.titleContent.contentsId,
          C6ExendData.titleContent.clickCode,
          C6ExendData.titleContent.espotId,
          C6ExendData.titleContent.mdUrl
        )"
      >
        {{ getHtmlDecode(C6ExendData.titleContent.mainTitle) }}
        <i />
      </button>
    </div> -->
    <!-- // 더보기 영역 -->
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

export default {
  name: 'AnchorBeauty',
  components: {
    NsImg,
    NsPrice
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
      anchorLayer: false, // 바로 구매 레이어 표시 여부
      A6contents: this.espotData.espotList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W[0].banner,
      A6contentsDeactve: !isNull(this.espotData.espotList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W[0].banner._CNTNT_INFO),
      B6contents: this.espotData.espotList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE[0].banner,
      B6contentsDeactve: !isNull(this.espotData.espotList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE[0].banner._CNTNT_INFO),
      A6products: this.espotData.espotList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W[0].prdList,
      B6products: this.espotData.espotList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE[0].prdList,
      C6products: this.espotData.espotList._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST,
      A6ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W,
      B6ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE,
      C6ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST,
      finishedSetParamFlag: false,
      layerFlag: false
    }
  },
  methods: {
    insertCommas,
    isNull,
    /**
     * 상품 클릭
     * @param {String} productName 상품이름
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
    @import "~@/assets/styles/views/store/module/AnchorBeauty";
</style>
