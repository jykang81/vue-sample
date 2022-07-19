<template>
  <!-- 앵커: 해피딜 -->
  <section class="anchor_happydeal">
    <!-- 컨텐츠 영역 -->
    <section name="_EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM">
      <div
        v-if="A3contents"
        class="category_top"
        aria-label="배너"
        @click="bannerCommonClickEvent(
          A3contents.clickTarget,
          A3contents.contentsId,
          A3contents.clickCode,
          A3contents.espotId,
          A3contents.mdUrl,
          null,
          '메인_해피딜_배너',
          isNull(A3contents.marketingText) ? A3contents.contentName : A3contents.marketingText
        )"
      >
        <figure>
          <ns-img
            :src="A3contents.imgUrl"
            :alt="A3contents.marketingText"
            :product-number="A3contents.clickTarget === 'Product' ? A3contents.clickCode : null"
            type="WIDE"
            replace="SQUARE"
          />
        </figure>
        <p class="title_main">
          {{ getHtmlDecode(A3contents.mainTitle) }}
        </p>
        <p class="title_sub">
          {{ getHtmlDecode(A3contents.subTitle) }}
        </p>
      </div>
    </section>
    <!-- // 컨텐츠 영역 -->

    <!-- 상품 영역 -->
    <section name="_EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE">
      <ul v-if="B3products && B3products.length" class="product_wide">
        <li
          v-for="(value, index) in B3products"
          :key="`root${index}`"
          :class="setClassNameHasSlideData(value)"
        >
          <template v-if="isNotNullProductDetail(value)">
            <router-link
              aria-label="상품"
              to=""
              event=""
              @click.native="productDetailLogging(value.itncatentrynm, { name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_해피딜_상품' }})"
            >
              <figure>
                <ns-img
                  :src="value.espotImgUrl"
                  :alt="value.itncatentrynm"
                  :is-adult="value.adultItemFlag"
                  :product-number="value.partnumber"
                  type="WIDE"
                  replace="SQUARE"
                />
                <template v-if="value.badge.length > 0">
                  <p v-if="value.badge[0] && value.badge[0].PROMOTION" class="sticker">
                    <ns-img
                      :src="value.badge[0].PROMOTION"
                      alt="스티커"
                    />
                  </p>
                  <ul class="benefit">
                    <li v-if="value.badge[1] && value.badge[1].BENEFIT1">
                      {{ getCutBytes(value.badge[1].BENEFIT1, 12) }}
                    </li>
                    <li v-if="value.badge[2] && value.badge[2].BENEFIT2">
                      {{ getCutBytes(value.badge[2].BENEFIT2, 12) }}
                    </li>
                  </ul>
                </template>
              </figure>
              <div class="price_count">
                <ns-price
                  :dc-price="value.dcPrice"
                  :dc-rate="value.dcRate"
                  :price="value.price"
                  :mm-rntal-prc="value.mmRntalPrc"
                  :prc-wave-disp="value.prcWaveDisp"
                  :buschn-id="value.buschnId"
                  :disp-type-cd="value.dispTypeCd"
                />
                <p v-show="!isOrdQtyHide(B3productsExtend) && Number(value.orderQty) > 0" class="count">
                  {{ insertCommas(value.orderQty) }}개 구매
                </p>
              </div>
              <p class="title">
                {{ getHtmlDecode(value.itncatentrynm) }}
              </p>
            </router-link>
            <div class="benefit_button">
              <ul v-if="getChannelInfo(value).length || getBenefitInfo(value).length" class="benefit">
                <li
                  v-for="(storeTypeValue, storeTypeIndex) in getChannelInfo(value)"
                  :key="`storeType${storeTypeIndex}`"
                  :class="getChannelStyle(storeTypeValue)"
                >
                  {{ storeTypeValue }}
                </li>
                <li
                  v-for="(benefitValue, benefitIndex) in getBenefitInfo(value)"
                  :key="`benefit${benefitIndex}`"
                >
                  {{ benefitValue }}
                </li>
              </ul>
              <ul v-else-if="hasBuyOrCartButton(B3productsExtend)" class="benefit" />
              <div
                v-if="hasBuyOrCartButton(B3productsExtend) === 'ORDER'"
                class="button_box"
              >
                <button
                  v-if="checkFormlessProduct(value.dispTypeCd)"
                  type="button"
                  class="buy border"
                  @click="moveConsultationRequest(value.partnumber)"
                >
                  상담신청
                </button>
                <button
                  v-else
                  type="button"
                  class="buy border"
                  @click="layerOpen(value.partnumber)"
                >
                  바로구매
                </button>
              </div>
              <div
                v-else-if="hasBuyOrCartButton(B3productsExtend) === 'BASKET'"
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
            </div>
            <p v-if="!hasBuyOrCartButton(B3productsExtend) && !isNull(value.onAirTime)" class="live_time">
              {{ hashToSpace(value.onAirTime) }}
            </p>
          </template>
        </li>
      </ul>
    </section>
    <!-- // 상품 영역 -->

    <!-- 더보기 영역 -->
    <!-- <div v-if="B3productsExtend && checkMoreView(B3productsExtend)" class="btn_total_view">
      <button
        type="button"
        @click="bannerCommonClickEvent(
          B3productsExtend.titleContent.clickTarget,
          B3productsExtend.titleContent.contentsId,
          B3productsExtend.titleContent.clickCode,
          B3productsExtend.titleContent.espotId,
          B3productsExtend.titleContent.mdUrl
        )"
      >
        {{ getHtmlDecode(B3productsExtend.titleContent.mainTitle) }}
        <i />
      </button>
    </div> -->
    <!-- // 더보기 영역 -->

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
import anchorMixin from '@/mixins/store/home/anchorMixin'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import RightOrderOption from '@/components/product/RightOrderOption'
import {
  getCutBytes,
  insertCommas
} from '@utils/commonutil/commonUtil'
import toastUtil from '@/common/frameworks/toastUtil'

export default {
  name: 'AnchorHappydeal',
  components: {
    NsImg,
    NsPrice,
    RightOrderOption
  },
  mixins: [
    anchorMixin,
    storeMixProductAddCartMixin,
    storeProductTypeMixin
  ],
  props: {
    espotData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      finishedSetParamFlag: false,
      callResult: null,
      A3contents: this.espotData.espotList._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM[0],
      A3contentsExtend: this.espotData.espotExtendList._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM,
      B3products: this.espotData.espotList._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE,
      B3productsExtend: this.espotData.espotExtendList._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE
    }
  },
  methods: {
    getCutBytes,
    insertCommas,
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
    async addToCartLogging (partnumber, dispTypeCd, buschnId, catentryId, brandKorNm, itncatentrynm, isFormlessProduct = false) {
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
      const liveLimitChecker = await this.liveLimitValidator(partnumber)
      if (liveLimitChecker) {
        if (isFormlessProduct) {
          const msg = '장바구니에 담을 수 없는 상품입니다.'
          toastUtil.show(msg)
        } else {
          this.addToCart(partnumber, dispTypeCd, buschnId, null, catentryId, null, brandKorNm, itncatentrynm)
        }
      }
    },
    /**
     * 상품 클릭
     * @param {String} productName 상품명
     * @param {Object} routerInfo - 유효성 검사 통과시 이동할 페이지 정보
     */
    async productDetailLogging (productName, routerInfo) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: 'Tab_상품목록',
          eventLabel: `해피딜_${productName}`,
          params: {
            t1: null
          }
        }
      })

      const liveLimitChecker = await this.liveLimitValidator(routerInfo.params.number)
      if (liveLimitChecker) {
        this.$router.push(routerInfo)
      }
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/AnchorHappydeal";
</style>
