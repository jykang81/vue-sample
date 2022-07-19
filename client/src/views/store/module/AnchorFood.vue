<template>
  <!-- 앵커: 푸드/건강 -->
  <section class="anchor_food">
    <!-- 5A 배너 영역 -->
    <section name="_EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST">
      <div v-if="!A5contentsDeactve" class="category_top">
        <div
          aria-label="배너"
          @click="bannerCommonClickEvent(
            A5contents.clickTarget,
            A5contents.contentsId,
            A5contents.clickCode,
            A5contents.espotId,
            A5contents.mdUrl,
            null,
            '메인_푸드/건강_배너',
            isNull(A5contents.marketingText) ? A5contents.contentName : A5contents.marketingText
          )"
        >
          <figure>
            <ns-img
              :src="A5contents.imgUrl"
              :alt="A5contents.marketingText"
              :product-number="A5contents.clickTarget === 'Product' ? A5contents.clickCode : null"
              type="WIDE"
              replace="SQUARE"
            />
          </figure>
          <template v-if="hasBrTag(A5contents.marketingText)">
            <p class="title_main">
              {{ brTagSplit(getHtmlDecode(A5contents.marketingText), 'title') }}
            </p>
            <p class="title_sub">
              {{ brTagSplit(getHtmlDecode(A5contents.marketingText), 'tag') }}
            </p>
          </template>
          <p v-else class="title_main">
            {{ brTagSplit(getHtmlDecode(A5contents.marketingText), 'title') }}
          </p>
        </div>
      </div>
      <!-- // 5A 배너 영역 -->

      <!-- 5A 상품 영역 -->
      <ul
        class="promotion_list"
        :class="checkMoreView(A5ExendData) ? 'has_total_view' : ''"
      >
        <li
          v-for="(value, index) in A5products"
          :key="`${index}`"
        >
          <template v-if="index < 3">
            <figure>
              <router-link
                :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_푸드/건강_상품' }}"
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
                :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_푸드/건강_상품' }}"
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
              v-if="hasBuyOrCartButton(A5ExendData) === 'BASKET'"
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
      <!-- <div v-if="checkMoreView(A5ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            A5ExendData.titleContent.clickTarget,
            A5ExendData.titleContent.contentsId,
            A5ExendData.titleContent.clickCode,
            A5ExendData.titleContent.espotId,
            A5ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(A5ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
      <!-- // 더보기 영역 -->
    </section>
    <!-- // 5A 상품 영역 -->

    <!-- 5B 배너 영역 -->
    <section name="_EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST">
      <div
        v-if="!B5contentsDeactve"
        class="category_top"
        aria-label="배너"
        @click="bannerCommonClickEvent(
          B5contents.clickTarget,
          B5contents.contentsId,
          B5contents.clickCode,
          B5contents.espotId,
          B5contents.mdUrl,
          null,
          '메인_푸드/건강_배너',
          isNull(B5contents.marketingText) ? B5contents.contentName : B5contents.marketingText
        )"
      >
        <figure>
          <ns-img
            :src="B5contents.imgUrl"
            :alt="B5contents.marketingText"
            :product-number="B5contents.clickTarget === 'Product' ? B5contents.clickCode : null"
            type="WIDE"
            replace="SQUARE"
          />
        </figure>
        <template v-if="hasBrTag(B5contents.marketingText)">
          <p class="title_main">
            {{ brTagSplit(getHtmlDecode(B5contents.marketingText), 'title') }}
          </p>
          <p class="title_sub">
            {{ brTagSplit(getHtmlDecode(B5contents.marketingText), 'tag') }}
          </p>
        </template>
        <p v-else class="title_main">
          {{ brTagSplit(getHtmlDecode(B5contents.marketingText), 'title') }}
        </p>
      </div>

      <!-- // 5B 배너 영역 -->

      <!-- 5B 상품 영역 -->
      <ul
        class="promotion_list"
        :class="checkMoreView(B5ExendData) ? 'has_total_view' : ''"
      >
        <li
          v-for="(value, index) in B5products"
          :key="`${index}`"
        >
          <template v-if="index < 3">
            <figure>
              <router-link
                :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_푸드/건강_상품' }}"
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
                :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_푸드/건강_상품' }}"
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
              v-if="hasBuyOrCartButton(B5ExendData) === 'BASKET'"
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
      <!-- <div v-if="checkMoreView(B5ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            B5ExendData.titleContent.clickTarget,
            B5ExendData.titleContent.contentsId,
            B5ExendData.titleContent.clickCode,
            B5ExendData.titleContent.espotId,
            B5ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(B5ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
    </section>
    <!-- // 더보기 영역 -->
    <!-- // 5B 상품 영역 -->

    <!-- 5C 배너 영역 -->
    <section name="_EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST">
      <ul
        v-if="C5products.length > 0"
        class="banner_list"
      >
        <li
          v-for="(value, index) in C5products"
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
      <!-- <div v-if="checkMoreView(C5ExendData)" class="btn_total_view">
        <button
          type="button"
          @click="bannerCommonClickEvent(
            C5ExendData.titleContent.clickTarget,
            C5ExendData.titleContent.contentsId,
            C5ExendData.titleContent.clickCode,
            C5ExendData.titleContent.espotId,
            C5ExendData.titleContent.mdUrl
          )"
        >
          {{ getHtmlDecode(C5ExendData.titleContent.mainTitle) }}
          <i />
        </button>
      </div> -->
    </section>
    <!-- // 더보기 영역 -->
    <!-- // 6C 배너 영역 -->
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
  name: 'AnchorFood',
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
      anchorLayer: false, // 바로 구매 레이어 표시 여부
      A5contents: this.espotData.espotList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST[0].banner,
      A5contentsDeactve: !isNull(this.espotData.espotList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST[0].banner._CNTNT_INFO),
      B5contents: this.espotData.espotList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST[0].banner,
      B5contentsDeactve: !isNull(this.espotData.espotList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST[0].banner._CNTNT_INFO),
      A5products: this.espotData.espotList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST[0].prdList,
      B5products: this.espotData.espotList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST[0].prdList,
      C5products: this.espotData.espotList._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST,
      A5ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST,
      B5ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST,
      C5ExendData: this.espotData.espotExtendList._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST,
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
          eventLabel: `푸드/건강_${productName}`,
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
    @import "~@/assets/styles/views/store/module/AnchorFood";
</style>
