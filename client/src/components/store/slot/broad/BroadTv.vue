<template>
  <!-- TV생방송, 샵플러스 -->
  <section :id="espotName">
    <swiper
      ref="exhibition"
      :options="exhibition"
      class="swiper_live"
    >
      <swiper-slide>
        <p class="live_title">
          Shop+
        </p>
        <div
          v-if="totalOrgan.shopPlus !== null"
          class="img_box"
          @click="clickGotoProduct()"
        >
          <figure>
            <ns-img
              :product-number="totalOrgan.shopPlus.partNumber"
              :alt="htmlDecode(totalOrgan.shopPlus.goodsName)"
              :is-adult="totalOrgan.shopPlus.adultItemFlag"
              type="WIDE"
            />
          </figure>
          <p class="live">
            <i class="icons_live" />
            <time>{{ limitTime }}</time>
          </p>
        </div>
        <div
          v-else
          class="img_box"
        >
          <figure>
            <ns-img
              src="~@/assets/images/common/img_noImage_wide.png"
              alt="현재 편성정보 없음."
            />
          </figure>
        </div>
        <div v-if="totalOrgan.shopPlus !== null">
          <div @click="clickGotoProduct()">
            <ns-price
              :dc-price="totalOrgan.shopPlus.pricedcprice"
              :dc-rate="totalOrgan.shopPlus.saleRate"
              :price="totalOrgan.shopPlus.priceofferprice"
              :mm-rntal-prc="totalOrgan.shopPlus.mmRntalPrc"
              :prc-wave-disp="totalOrgan.shopPlus.prcWaveDisp"
              :buschn-id="totalOrgan.shopPlus.busChnId"
              :disp-type-cd="totalOrgan.shopPlus.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(totalOrgan.shopPlus.goodsName) }}
            </p>
          </div>
          <div class="button_box">
            <button
              v-if="totalOrgan.shopPlus.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL || totalOrgan.shopPlus.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_INSURANCE || totalOrgan.shopPlus.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL || totalOrgan.shopPlus.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_FUNERAL || totalOrgan.shopPlus.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_ADVERTISEMENT"
              type="button"
              class="buy"
              @click="layerOpen()"
            >
              상담신청
            </button>
            <button
              v-else
              type="button"
              class="buy"
              @click="layerOpen()"
            >
              바로구매
            </button>
            <button
              type="button"
              class="nstalk"
            >
              <i />
            </button>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <!-- 바로구매 레이어 컴포넌트 -->
    <right-order-option
      v-if="!isNull(partNumber) && totalOrgan.shopPlus.multiFlg === 1"
      :key="totalOrgan.shopPlus.partNumber"
      :shows-layer="layer"
      :global-val="{partNumber: totalOrgan.shopPlus.partNumber, getProductInfoFlag: true}"
      @layerClose="layerClose()"
    />
  </section>
</template>

<script>
import { PRODUCT_CONST } from '@/common/constants/product/product'
import {
  insertCommas,
  htmlDecode,
  timerObject,
  isNull
} from '@utils/commonutil/commonUtil'
import {
  getPeriodDate,
  getDateParse,
  calcDate,
  format
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@utils/bizUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import RightOrderOption from '@/components/product/RightOrderOption'
import popupUtil from '@frameworks/popupUtil'

export default {
  name: 'BroadTv',
  components: {
    NsImg,
    NsPrice,
    RightOrderOption
  },
  props: {
    espotName: {
      type: String,
      required: true
    },
    slotGlobalVal: {
      type: Object,
      required: true
    },
    espotData: {
      type: Object,
      required: true
    },
    espotExtendData: {
      type: Object,
      required: true
    },
    totalOrgan: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      exhibition: {
        slidesPerView: 'auto',
        spaceBetween: 16
      },
      layer: false,
      limitTime: '', // 남은 생방송 시간
      partNumber: ''
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    PRODUCT_CONST () {
      return PRODUCT_CONST
    },
    getId () {
      let result = ''
      if (this.$el.parentNode !== null) {
        result = this.$el.parentNode.id
      }
      return result
    }
  },
  mounted () {
    this.espotDraw()
  },
  methods: {
    insertCommas,
    htmlDecode,
    isNull,
    /**
     * espot 그리기
     */
    espotDraw () {
      if (!isNull(this.totalOrgan.shopPlus)) {
        this.setLimitLiveTime()
      }
    },
    /**
     * 바로주문 열기
     */
    layerOpen () {
      if (this.totalOrgan.shopPlus.multiFlg > 1) {
        this.clickGotoProduct()
      } else {
        this.partNumber = this.totalOrgan.shopPlus.partNumber
        this.layer = true
      }
    },
    /**
     * 바로주문 닫기
     */
    layerClose () {
      if (this.layer) {
        this.layer = false
      }
    },
    /**
     * 생방송 남은 시간 설정
     * @returns {void}
     */
    setLimitLiveTime () {
      timerObject.checkTimerObject()
      timerObject.m_timer = setInterval(this.setRemainedTime, 1000)
    },
    /**
     * 생방송 남은 시간 설정
     * @returns {void}
     */
    setRemainedTime () {
      let remainingTime = null
      const nowTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
      const startDtm = !isNull(this.totalOrgan.shopPlus.time) ? this.totalOrgan.shopPlus.time.split('~')[0] : format(nowTime, 'yyyy-MM-dd HH:mm:ss')
      const endDtm = !isNull(this.totalOrgan.shopPlus.time) ? this.totalOrgan.shopPlus.time.split('~')[1] : format(nowTime, 'yyyy-MM-dd HH:mm:ss')

      if (getDateParse(startDtm) <= nowTime && getDateParse(endDtm) > nowTime) {
        remainingTime = endDtm
      }

      if (remainingTime === null) {
        timerObject.checkTimerObject()
        return false
      }

      const timeLimit = getPeriodDate(remainingTime, 'json')
      if (timeLimit.hour === 23 && timeLimit.minute === 59 && timeLimit.second >= 30) {
        remainingTime = null
        timerObject.checkTimerObject()
      } else {
        this.limitTime = `${timeLimit.hour}:${timeLimit.minute}:${timeLimit.second}`
      }
    },
    /**
     * 단일코드, 복수코드 판단 후 단일코드면 상품상세페이지로, 복수코드면 브릿지 페이지로 이동
     */
    clickGotoProduct () {
      if (this.totalOrgan.shopPlus.multiFlg > 1) {
        const nowTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        const params = {
          identify: 'shopPlus',
          goodId: this.totalOrgan.shopPlus.partNumber,
          startdtm: !isNull(this.totalOrgan.shopPlus.time) ? this.totalOrgan.shopPlus.time.split('~')[0] : nowTime,
          enddtm: !isNull(this.totalOrgan.shopPlus.time) ? this.totalOrgan.shopPlus.time.split('~')[1] : nowTime,
          nsTalkOnlyFlag: ''
        }

        popupUtil.show('store/HomeBridge', params, null, false)
      } else {
        bizUtil.gotoProductDetail(this.totalOrgan.shopPlus.partNumber, { clksrc: 'NSShop+' })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/board/BoardTv";
</style>
