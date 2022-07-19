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
          NS LIVE
        </p>
        <div
          v-if="totalOrgan.tv !== null"
          class="img_box"
          @click="clickGotoProduct()"
        >
          <figure>
            <ns-img
              :product-number="totalOrgan.tv.partNumber"
              :alt="htmlDecode(totalOrgan.tv.goodsName)"
              :is-adult="totalOrgan.tv.adultItemFlag"
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
        <div v-if="totalOrgan.tv !== null">
          <div @click="clickGotoProduct()">
            <ns-price
              :dc-price="totalOrgan.tv.pricedcprice"
              :dc-rate="totalOrgan.tv.saleRate"
              :price="totalOrgan.tv.priceofferprice"
              :mm-rntal-prc="totalOrgan.tv.mmRntalPrc"
              :prc-wave-disp="totalOrgan.tv.prcWaveDisp"
              :buschn-id="totalOrgan.tv.busChnId"
              :disp-type-cd="totalOrgan.tv.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(totalOrgan.tv.goodsName) }}
            </p>
          </div>
          <div class="button_box">
            <button
              v-if="totalOrgan.tv.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL || totalOrgan.tv.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_INSURANCE || totalOrgan.tv.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL || totalOrgan.tv.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_FUNERAL || totalOrgan.tv.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_ADVERTISEMENT"
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
      v-if="!isNull(partNumber) && totalOrgan.tv.multiFlg === 1"
      :key="totalOrgan.tv.partNumber"
      :shows-layer="layer"
      :global-val="{partNumber: totalOrgan.tv.partNumber, getProductInfoFlag: true}"
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
  name: 'Broad',
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
      if (!isNull(this.totalOrgan.tv)) {
        this.setLimitLiveTime()
      }
    },
    /**
     * 바로주문 열기
     */
    layerOpen () {
      if (this.totalOrgan.tv.multiFlg > 1) {
        this.clickGotoProduct()
      } else {
        this.partNumber = this.totalOrgan.tv.partNumber
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
      const startDttm = getDateParse(format(this.totalOrgan.tv.startDttm, 'yyyy-MM-dd HH:mm:ss'))
      const endDttm = getDateParse(format(this.totalOrgan.tv.endDttm, 'yyyy-MM-dd HH:mm:ss'))
      const nowTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
      if (startDttm <= nowTime && endDttm > nowTime) {
        remainingTime = format(this.totalOrgan.tv.endDttm, 'yyyy-MM-dd HH:mm:ss')
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
      if (this.totalOrgan.tv.multiFlg > 1) {
        const params = {
          identify: 'tv',
          goodId: this.totalOrgan.tv.partNumber,
          startdtm: format(this.totalOrgan.tv.startDttm, 'yyyy-MM-dd HH:mm:ss'),
          enddtm: format(this.totalOrgan.tv.endDttm, 'yyyy-MM-dd HH:mm:ss'),
          nsTalkOnlyFlag: ''
        }

        popupUtil.show('store/HomeBridge', params, null, false)
      } else {
        bizUtil.gotoProductDetail(this.totalOrgan.tv.partNumber, { clksrc: 'NSLIVE' })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/board/Board";
</style>
