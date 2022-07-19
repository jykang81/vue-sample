<template>
  <div class="product_layer">
    <div class="title_wrap">
      <strong class="title">판매 상품 <span class="num">({{ liveProd.length }})</span></strong>
      <button
        type="button"
        class="btn_close"
        @click="layerClose"
      >
        레이어 닫기
      </button>
    </div>
    <div class="product_list">
      <div
        v-for="(prod, index) in liveProd"
        :key="`${prod.partnumber}_${index}`"
        class="item"
      >
        <router-link :to="`/product/${prod.partnumber}`" @click.native="thinsLiveProdTagging(prod)">
          <figure>
            <ns-img
              :product-number="prod.partnumber"
              :width="224"
              :height="224"
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
        <button
          v-if="!checkIntangibleGood(prod.dispTypeCd)"
          type="button"
          class="btn_buy"
          @click="onClickRightOrderBtn(prod.partnumber)"
        >
          <span>바로구매</span>
        </button>
        <button
          v-else
          type="button"
          class="btn_buy"
          @click="onClickConsultationRequestBtn(prod.partnumber)"
        >
          <span>상담신청</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  checkIntangibleGood
} from '@utils/productutil/productUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import uiUtil from '@utils/uiUtil'

export default {
  name: 'ProductLayer',
  components: {
    NsImg,
    NsPrice
  },
  props: {
    liveProd: {
      type: Array,
      required: true
    }
  },
  methods: {
    htmlDecode,
    checkIntangibleGood,
    /**
     * 레이어 닫기
     * @returns {void}
     */
    layerClose () {
      uiUtil.enableScroll()
      this.$emit('layerClose')
    },
    /**
     * 바로구매 버튼 클릭 이벤트
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    onClickRightOrderBtn (partNumber) {
      this.$emit('clickRightOrderBtn', partNumber)
    },
    /**
     * 상담신청 버튼 클릭 이벤트
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    onClickConsultationRequestBtn (partNumber) {
      this.$emit('clickConsultationRequestBtn', partNumber)
    },
    /**
     * 상품클릭
     * @param {Object} data 상품정보
     */
    thinsLiveProdTagging (data) {
      // 마케팅 스크립트 적용 부분
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(data.partnumber),
              name: data.itncatentrynm,
              dimension16: 'eTV',
              dimension20: 'NS LIVE'
            }
          ],
          subparams: {
            t1: '띵라이브',
            t2: '라이브상품목록',
            product_list: '띵라이브_라이브상품목록'
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/media/ProductLayer";
</style>
