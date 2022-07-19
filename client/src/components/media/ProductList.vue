<template>
  <div
    class="product_list"
    :class="[
      !rightOrderBtn ? 'multi' : '',
      (collapse || !productMoreBtn) ? 'open' : ''
    ]"
  >
    <div class="prd_list">
      <div
        v-for="(prod, index) in productList"
        :key="`${prod.partnumber}_${index}`"
        class="item"
      >
        <router-link :to="`/product/${prod.partnumber}`" @click.native="productClickLogging(prod)">
          <span
            v-show="prod.type === 'rel'"
            class="label"
          >
            관련상품
          </span>
          <figure>
            <ns-img
              :src="prod.imageUrl"
              :alt="prod.itncatentrynm"
            />
          </figure>
          <div class="price_title">
            <ns-price
              :dc-price="prod.dcPrice"
              :dc-rate="prod.dcRate"
              :price="prod.price"
              :mm-rntal-prc="prod.mmRntalPrc"
              :prc-wave-disp="prod.prcWaveDisp"
              :buschn-id="prod.buschnId"
              :disp-type-cd="prod.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(prod.itncatentrynm) }}
            </p>
          </div>
        </router-link>
        <ul
          v-if="!rightOrderBtn && !checkIntangibleGood(prod.dispTypeCd)"
          class="benefit"
        >
          <li v-show="prod.dlvrFreeYn">
            무료배송
          </li>
          <li v-show="prod.promIfiVal">
            무이자
          </li>
          <li v-show="prod.promPadYn">
            적립금
          </li>
        </ul>
        <div
          v-else-if="rightOrderBtn"
          class="benefit_button"
        >
          <ul class="benefit">
            <li v-show="prod.dlvrFreeYn && !checkIntangibleGood(prod.dispTypeCd)">
              무료배송
            </li>
            <li v-show="prod.promIfiVal && !checkIntangibleGood(prod.dispTypeCd)">
              무이자
            </li>
            <li v-show="prod.promPadYn && !checkIntangibleGood(prod.dispTypeCd)">
              적립금
            </li>
          </ul>
          <button
            v-if="!checkIntangibleGood(prod.dispTypeCd)"
            type="button"
            class="btn_buy"
            @click="onClickRightOrderBtn(prod.partnumber)"
          >
            바로구매
          </button>
          <button
            v-else
            type="button"
            class="btn_buy"
            @click="onClickConsultationRequestBtn(prod.partnumber)"
          >
            상담신청
          </button>
        </div>
      </div>
    </div>
    <button
      v-show="productList.length > MAX_EXPOSE_PRODUCT_CNT && productMoreBtn"
      type="button"
      class="btn_collapse"
      @click="onToggleList()"
    >
      <span>{{ collapse ? '접기' : '상품 더보기 (' + (productList.length - MAX_EXPOSE_PRODUCT_CNT) + '개)' }}</span>
    </button>
  </div>
</template>

<script>
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  checkIntangibleGood
} from '@utils/productutil/productUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import thingliveMixin from '@/mixins/media/thingliveMixin'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import consultationMixin from '@/mixins/product/consultationMixin'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'

export default {
  name: 'ProductList',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    thingliveMixin,
    storeProductTypeMixin,
    consultationMixin
  ],
  props: {
    // 상품 목록
    productList: {
      type: Array,
      required: true
    },
    // 상품 더 보기 버튼 생성 여부
    productMoreBtn: {
      type: Boolean,
      required: true
    },
    // 바로구매 버튼 생성 여부
    rightOrderBtn: {
      type: Boolean,
      required: true
    },
    parentInfo: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      // 상품 더보기
      collapse: false
    }
  },
  methods: {
    htmlDecode,
    checkIntangibleGood,
    /**
     * 상품 더보기 토글
     * @returns {void}
     */
    onToggleList () {
      this.sendShowMoreButtonClickLog()

      const yOffsetBeforeDOMUpdate = window.pageYOffset // 이전 y 좌표 저장

      this.collapse = !this.collapse // 접기 or 펼치기

      if (this.collapse) {
        // y좌표 조정 처리
        this.$nextTick(() => {
          window.scrollTo({
            top: yOffsetBeforeDOMUpdate,
            left: 0
          })
        })
      }
    },
    /**
     * 상품상세
     * @param {Object} data 상품정보
     * @returns {void}
     */
    productClickLogging (data) {
      let eventAction = ''
      let eventLabel = ''
      let t2Name = ''
      let productList = ''
      if (this.parentInfo === 'ThingLive') {
        eventAction = '라이브'
        eventLabel = `상품상세_${data.partnumber}`
        t2Name = '라이브상품목록'
        productList = '띵라이브_라이브상품목록'
      } else if (this.parentInfo === 'next') {
        eventAction = '다음방송'
        eventLabel = `다음방송_${data.partnumber}`
        t2Name = '다음방송상품'
        productList = '띵라이브_다음방송상품'
      } else if (this.parentInfo === 'prev') {
        eventAction = '이전방송'
        eventLabel = `이전방송_${data.partnumber}`
        t2Name = '이전방송상품'
        productList = '띵라이브_이전방송상품'
      } else if (this.parentInfo === 'Highlight') {
        eventAction = '하이라이트'
        eventLabel = `하이라이트_${data.partnumber}`
        t2Name = '하이라이트상품목록'
        productList = '띵라이브_하이라이트상품목록'
      } else {
        eventAction = 'VOD상세'
        eventLabel = `영상상품_${data.partnumber}`
        t2Name = 'vod상품목록'
        productList = '띵라이브_vod상품목록'
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
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
              id: String(data.partnumber),
              name: data.itncatentrynm,
              dimension16: 'eTV'
            }
          ],
          subparams: {
            t1: '띵라이브',
            t2: t2Name,
            product_list: productList
          }
        }
      })
    },
    /**
     * 바로구매 버튼 클릭
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    onClickRightOrderBtn (partNumber) {
      this.$emit('onClickRightOrderBtn', partNumber)
    },
    /**
     * 상담하기 버튼 클릭
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    onClickConsultationRequestBtn (partNumber) {
      this.moveConsultationRequest(partNumber)
    },
    /**
     * 더보기 / 접기 버튼 클릭 로그
     */
    sendShowMoreButtonClickLog () {
      let eventAction = ''
      let eventLabel = ''
      if (this.parentInfo === 'ThingLive') {
        eventAction = '라이브'
        eventLabel = '상품더보기'
      } else if (this.parentInfo === 'next') {
        eventAction = '다음방송'
        eventLabel = '다음방송_상품더보기'
      } else if (this.parentInfo === 'prev') {
        eventAction = '이전방송'
        eventLabel = '이전방송_상품더보기'
      } else if (this.parentInfo === 'Highlight') {
        eventAction = '하이라이트'
        eventLabel = '상품더보기'
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction,
          eventLabel,
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
  @import "~@/assets/styles/components/media/ProductList";
</style>
