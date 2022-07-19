<template>
  <!-- 앵커: 지금 인기 -->
  <section class="anchor_popular">
    <!-- 컨텐츠 영역 -->
    <section name="_EZ_HOME_ANCHOR1A_ESPOT_CNTNTPROM">
      <div
        v-if="contentsData.length"
        aria-label="배너"
        class="category_top"
        @click="bannerCommonClickEvent(
          contentsData[0].clickTarget,
          contentsData[0].contentsId,
          contentsData[0].clickCode,
          contentsData[0].espotId,
          contentsData[0].mdUrl,
          null,
          '메인_지금인기_배너',
          isNull(contentsData[0].marketingText) ? contentsData[0].contentName : contentsData[0].marketingText
        )"
      >
        <figure>
          <ns-img
            :src="contentsData[0].imgUrl"
            :alt="contentsData[0].marketingText"
            :product-number="contentsData[0].clickTarget === 'Product' ? contentsData[0].clickCode : null"
            type="WIDE"
            replace="SQUARE"
          />
        </figure>
        <p class="title_main">
          {{ getHtmlDecode(contentsData[0].mainTitle) }}
        </p>
        <p class="title_sub">
          {{ getHtmlDecode(contentsData[0].subTitle) }}
        </p>
      </div>
    </section>
    <!-- // 컨텐츠 영역 -->

    <!-- 상품 영역 -->
    <section name="_EZ_HOME_ANCHOR1B_ESPOT_PRDWIDE">
      <ul v-if="productsData && productsData.length" class="product_wide">
        <li
          v-for="(value, index) in productsData"
          :key="`root${index}`"
          :class="setClassNameHasSlideData(value)"
        >
          <template v-if="isNotNullProductDetail(value)">
            <router-link
              aria-label="상품"
              to=""
              event=""
              @click.native="productDetailLogging(value.itncatentrynm, { name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_지금인기_상품' }})"
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
                <p v-show="!isOrdQtyHide(productsExtendData) && Number(value.orderQty) > 0" class="count">
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
              <ul v-else-if="hasBuyOrCartButton(productsExtendData)" class="benefit" />
              <div
                v-if="hasBuyOrCartButton(productsExtendData) === 'ORDER'"
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
                v-else-if="hasBuyOrCartButton(productsExtendData) === 'BASKET'"
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
            <p v-if="!hasBuyOrCartButton(productsExtendData) && !isNull(value.onAirTime)" class="live_time">
              {{ hashToSpace(value.onAirTime) }}
            </p>
          </template>
        </li>
      </ul>
    </section>
    <!-- // 상품 영역 -->

    <!-- 더보기 영역 -->
    <!-- <div v-if="Object.keys(productsExtendData).length && checkMoreView(productsExtendData)" class="btn_total_view">
      <button
        type="button"
        @click="bannerCommonClickEvent(
          productsExtendData.titleContent.clickTarget,
          productsExtendData.titleContent.contentsId,
          productsExtendData.titleContent.clickCode,
          productsExtendData.titleContent.espotId,
          productsExtendData.titleContent.mdUrl
        )"
      >
        {{ getHtmlDecode(productsExtendData.titleContent.mainTitle) }}
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
  name: 'AnchorPopular',
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
    contentsData: {
      type: Array,
      required: true
    },
    contentsExtendData: {
      type: Object,
      required: true
    },
    productsData: {
      type: Array,
      required: true
    },
    productsExtendData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      anchorLayer: false, // 바로 구매 레이어 표시 여부
      finishedSetParamFlag: false
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
          eventLabel: `지금인기_${productName}`,
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
    @import "~@/assets/styles/views/store/module/AnchorPopular";
</style>
