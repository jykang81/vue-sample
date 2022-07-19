<template>
  <!-- NS LIVE, Shop+ -->
  <section v-if="swiperHide" class="live_section">
    <splide
      ref="exhibition"
      :options="options"
      class="splide_live"
    >
      <!-- NS LIVE AREA -->
      <splide-slide v-if="nsLiveFlag" :key="`tv_${totalOrganTv}`">
        <p class="live_title">
          NS LIVE
        </p>
        <section @click="clickedLiveProduct(isMultiCodeTv, tvPartNumber, 'NSLIVE', tvGoodsName)">
          <div class="img_box">
            <figure>
              <ns-img
                v-if="tvPartNumber !== ''"
                :product-number="tvPartNumber"
                :alt="tvGoodsName"
                :is-adult="tvAdultItemFlag"
                type="WIDE"
              />
              <img
                v-else
                src="~@/assets/images/common/img_noImage_wide.png"
                alt="현재 편성정보 없음."
              >
            </figure>
            <p v-if="tvTimeSetFlag" class="live">
              <i class="icons_live" />
              <time v-if="timeLimitNSLive">{{ timeLimitNSLive.formattedLimitTime() }}</time>
            </p>
          </div>
          <ns-price
            v-if="nsLiveFlag"
            :key="tvDcPrice"
            :dc-price="tvDcPrice"
            :dc-rate="tvSaleRate"
            :price="tvLivePrice"
            :mm-rntal-prc="tvMmRntalPrc"
            :prc-wave-disp="tvPrcWaveDisp"
            :buschn-id="tvBusChnId"
            :disp-type-cd="tvDispTypeCd"
          />
          <p class="title">
            {{ tvGoodsName }}
          </p>
        </section>
        <div
          v-if="tvPartNumber"
          class="button_box"
        >
          <button
            v-if="!checkIntangibleGood(tvDispTypeCd)"
            type="button"
            class="buy"
            @click="layerOpen(tvPartNumber, 'NSLIVE', tvGoodsName)"
          >
            바로구매
          </button>
          <button
            v-else
            type="button"
            class="buy"
            @click="gotoAdvice(tvPartNumber, 'NSLIVE', tvGoodsName)"
          >
            상담신청
          </button>
          <button
            v-show="nsTalkEnable"
            type="button"
            class="nstalk"
            @click="gotoBridgeOnlyNsTalk('NSLIVE', tvPartNumber)"
          >
            NS톡
            <i />
          </button>
        </div>
      </splide-slide>

      <!-- Shop+ AREA -->
      <splide-slide v-if="shopPlusFlag" :key="`shop_${totalOrganShop}`">
        <p class="live_title">
          Shop+
        </p>
        <section @click="clickedLiveProduct(isMultiCodeShop, shopPartNumber, 'NSShop+', shopGoodsName)">
          <div class="img_box">
            <figure>
              <ns-img
                v-if="shopPartNumber !== ''"
                :product-number="shopPartNumber"
                :alt="shopGoodsName"
                :is-adult="shopAdultItemFlag"
                type="WIDE"
              />
              <img
                v-else
                src="~@/assets/images/common/img_noImage_wide.png"
                alt="현재 편성정보 없음."
              >
            </figure>
            <p v-if="shopTimeSetFlag" class="live">
              <i class="icons_live" />
              <time v-if="timeLimitShopPlus">{{ timeLimitShopPlus.formattedLimitTime() }}</time>
            </p>
          </div>
          <ns-price
            v-if="shopPlusFlag"
            :key="shopDcPrice"
            :dc-price="shopDcPrice"
            :dc-rate="shopSaleRate"
            :price="shopPrice"
            :mm-rntal-prc="shopMmRntalPrc"
            :prc-wave-disp="shopPrcWaveDisp"
            :buschn-id="shopBusChnId"
            :disp-type-cd="shopDispTypeCd"
          />
          <p class="title">
            {{ shopGoodsName }}
          </p>
        </section>
        <div
          v-if="shopPartNumber"
          class="button_box"
        >
          <button
            v-if="!checkIntangibleGood(shopDispTypeCd)"
            type="button"
            class="buy"
            @click="layerOpen(shopPartNumber, 'NSShop+', shopGoodsName)"
          >
            바로구매
          </button>
          <button
            v-else
            type="button"
            class="buy"
            @click="gotoAdvice(shopPartNumber, 'NSShop+', shopGoodsName)"
          >
            상담신청
          </button>
        </div>
      </splide-slide>
    </splide>
    <right-order-option
      v-if="layer"
      :key="tvPartNumber || shopPartNumber"
      :shows-layer="layer"
      :global-val="{ partNumber: dynamicPartNumber, getProductInfoFlag: true }"
      @layerClose="layerClose"
    />
  </section>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  checkIntangibleGood
} from '@utils/productutil/productUtil'
import {
  getDateParse,
  calcDate,
  getDateParse02
} from '@frameworks/dateutil/dateUtil'
import CommonTimer from '@/common/classes/CommonTimer'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import RightOrderOption from '@/components/product/RightOrderOption'
import popupUtil from '@frameworks/popupUtil'
import loginUtil from '@utils/loginUtil'
import consultationMixin from '@/mixins/product/consultationMixin'

import anchorMixin from '@/mixins/store/home/anchorMixin'
import { mapMutations } from 'vuex'
import setNsTalkRollingMixin from '@/mixins/store/home/setNsTalkRollingMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import { Splide, SplideSlide } from '@splidejs/vue-splide'

export default {
  name: 'LiveSection',
  components: {
    NsImg,
    NsPrice,
    RightOrderOption,
    Splide,
    SplideSlide
  },
  mixins: [
    anchorMixin,
    consultationMixin,
    setNsTalkRollingMixin
  ],
  data () {
    return {
      layer: false, // 바로구매 레이어
      options: {
        rewind: true,
        pagination: false,
        arrows: false,
        fixedWidth: '28rem',
        padding: '1.6rem',
        gap: '1.6rem'
      }, // 스플라이드 옵션.
      dynamicPartNumber: '', // right order option 컴포넌트 공유를 위한 상품코드 동적 제어.
      /* ns live 데이터 시작 */
      timeLimitNSLive: null, // ns live 타이머
      tvGoodsName: '', // 상품명
      tvLivePrice: '', // tv live 가격
      tvMmRntalPrc: '', // tv live 렌탈가격
      tvSaleRate: '', // tv live 세일율
      tvDcPrice: '', // tv live 할인가격
      tvPrcWaveDisp: '',
      tvDlvrPrice: false, // tv live 무료배송 여부
      tvIfiValue: false, // tv live 무이자 여부
      tvPadValue: false, // tv live 적립금 여부
      tvAdultItemFlag: '', // tv live 성인상품 여부
      tvTimeSetFlag: false, // tv live 타이머클래스 셋팅완료 여부
      tvPartNumber: '', // tv live 상품 코드
      tvMultiCd: '', // SB 관련 데이터
      tvBusChnId: '', // tv live 버스채널 id
      tvDispTypeCd: '', // tv live 전시유형
      isMultiCodeTv: false, // tv live 복수코드 이면 true 아니면 false
      nstalkYnTv: false,
      nsLiveFlag: false,
      /* ns live 데이터 끝 */
      /* shop+ 데이터 시작 */
      timeLimitShopPlus: null, // shop+ 타이머
      shopGoodsName: '', // 상품명
      shopPrice: '', // shop+ 가격
      shopSaleRate: '', // shop+ 세일율
      shopDcPrice: '', // shop+ 할인가격
      shopMmRntalPrc: '', // shop+ 렌탈가격
      shopPrcWaveDisp: '',
      shopDlvrPrice: false, // shop+ 무료배송 여부
      shopIfiValue: false, // shop+ 무이자 여부
      shopPadValue: false, // shop+ 적립금 여부
      shopAdultItemFlag: '', // shop+ 성인상품 여부
      shopTimeSetFlag: false, // shop+ 타이머클래스 셋팅완료 여부
      shopPartNumber: '', // shop+ 상품 코드
      shopMultiCd: '', // SB 관련 데이터
      shopBusChnId: '', // shop+ 버스채널 id
      shopDispTypeCd: '', // shop+ 전시유형
      isMultiCodeShop: false, // shop+ 복수코드 이면 true 아니면 false,
      nstalkYnShop: false,
      totalOrganTv: null,
      totalOrganShop: null,
      shopPlusFlag: false,
      /* shop+ 데이터 끝 */
      /* nstalk 관련 데이터 시작 */
      talkInfo: {
        productCode: '',
        userId: '',
        userTel: ''
      },
      /* nstalk 관련 데이터 끝 */
      retryingTv: false,
      retryingShop: false
    }
  },
  computed: {
    swiperHide () {
      if (this.tvPartNumber === '' && this.shopPartNumber === '') {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    timeLimitNSLive: {
      deep: true,
      handler (newObject) {
        if (!isNull(newObject) && newObject.hours === 0 && newObject.minutes === 0 && newObject.seconds === 0) {
          const prevEndTime = this.totalOrganTv.endDttm
          if (!this.retryingTv) {
            this.retryingTv = setInterval(() => {
              this.callNSLiveAndShopPlusInfo(true, false, prevEndTime)
            }, 10000)
          }
        }
      }
    },
    timeLimitShopPlus: {
      deep: true,
      handler (newObject) {
        if (!isNull(newObject) && newObject.hours === 0 && newObject.minutes === 0 && newObject.seconds === 0) {
          const prevEndTime = getDateParse(this.totalOrganShop.time.split('~')[1]).getTime()
          if (!this.retryingShop) {
            this.retryingShop = true
            setTimeout(() => { // tv live와 샵플러스 생방송 시간이 똑같을 수 있으므로, api 중복호출을 피하기 위한 시간차 설정.
              this.retryingShop = setInterval(() => {
                this.callNSLiveAndShopPlusInfo(false, true, prevEndTime)
              }, 10000)
            }, 2000)
          }
        }
      }
    }
  },
  created () {
    this.onLoad()
  },
  beforeDestroy () {
    if (this.retryingTv) { clearInterval(this.retryingTv) }
    if (this.retryingShop) { clearInterval(this.retryingShop) }
    if (this.timeLimitNSLive) { this.timeLimitNSLive = null }
    if (this.timeLimitShopPlus) { this.timeLimitShopPlus = null }
    if (this.timeLimitThingLive) { this.timeLimitThingLive = null }
  },
  deactivated () {
    if (this.retryingTv) { clearInterval(this.retryingTv) }
    if (this.retryingShop) { clearInterval(this.retryingShop) }
    if (!isNull(this.nsTalkInterval)) { clearInterval(this.nsTalkInterval) }
    if (!isNull(this.nsTalkInfoInterval)) { clearInterval(this.nsTalkInfoInterval) }
    if (this.timeLimitNSLive) { this.timeLimitNSLive = null }
    if (this.timeLimitShopPlus) { this.timeLimitShopPlus = null }
  },
  activated () {
    this.setNsTalkRollingForHome('tv', this.tvPartNumber, this.totalOrganTv?.startDttm, this.totalOrganTv?.endDttm)
    this.callNSLiveAndShopPlusInfo()
  },
  methods: {
    isNull,
    checkIntangibleGood,
    ...mapMutations('home', [
      'setLiveSectionFlag'
    ]),
    /**
     * Life Cycle: created() 호출될 때, 순차적 흐름이 필요한 메소드 모음.
     */
    onLoad () {
      this.callNSLiveAndShopPlusInfo()
    },
    /**
     * 바로구매 열기 메소드.
     * @param {String} partNumber - NS LIVE, Shop+ 바로구매 버튼 클릭시 상품코드 동적 변경후 레이어 호출.
     * @param {String} flg - 방송 매체 구분자.
     * @param {String} goodsName - 상품명.
     */
    layerOpen (partNumber, flg, goodsName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: '바로구매',
          eventLabel: `바로구매_${flg}_${goodsName}`,
          params: {
            t1: null
          }
        }
      })
      this.dynamicPartNumber = partNumber
      if (!this.isMultiCodeTv && flg === 'NSLIVE') {
        this.layer = true
        return false
      } else if (!this.isMultiCodeShop && flg === 'NSShop+') {
        this.layer = true
        return false
      }
      this.gotoDetailOrBridge(flg, partNumber)
    },
    /**
     * 바로구매 닫기 메소드.
     */
    layerClose () {
      this.layer = false
    },
    /**
     * NS LIVE, Shop+ 편성 정보 호출
     * @param {bool} retryFlagTv - 티비 방송이 끝난후 api 콜 재시도 여부 flag.
     * @param {bool} retryFlagShop - 샵플러스 방송이 끝난후 api 콜 재시도 여부 flag.
     * @param {} prevEndTime - 재시도 여부가 true 일때 이전 방송 엔드타임으로 같은방송인지 체크.
     */
    async callNSLiveAndShopPlusInfo (retryFlagTv = false, retryFlagShop = false, prevEndTime = null) {
      const commandName = 'NSFixedShopNoCacheCmd'
      const parameters = {
        espotInfo: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE|BROADALL_BROADBOXSLIDE|1|999|0',
        gubun: retryFlagTv ? 'TV' : retryFlagShop ? 'SHOPPLUS' : 'TV|SHOPPLUS',
        targetEspotId: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE'
      } // typeFlag가 없으면 TV상품정보 조회
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      if (retryFlagTv) {
        this.setNsLiveData(apiData, retryFlagTv, prevEndTime)
      } else if (retryFlagShop) {
        this.setShopPlusData(apiData, retryFlagShop, prevEndTime)
      } else {
        this.setNsLiveData(apiData, retryFlagTv, prevEndTime)
        this.setShopPlusData(apiData, retryFlagShop, prevEndTime)
      }
      this.setLiveSectionFlag(true)
    },
    /**
     * NS Live 데이터 체크 및 설정.
     * @param {Object} apiData - NS Live 방송 데이터.
     * @param {Object} retryFlagTv - 티비 방송이 끝난후 api 콜 재시도 여부 flag.
     * @param {Object} prevEndTime - 재시도 여부가 true 일때 이전 방송 엔드타임으로 같은방송인지 체크.
     */
    setNsLiveData (apiData, retryFlagTv, prevEndTime) {
      if (this.nsLiveValidator(apiData)) { // NS LIVE 편성정보가 있으면 데이터 셋팅.
        const nstalkChecker = apiData.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[1].nstalkYn
        nstalkChecker === 'Y' ? this.nstalkYnTv = true : this.nstalkYnTv = false
        const onAirInfo = apiData.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo
        const relatedPrdtSize = Number(onAirInfo.RelatedPrdtSize)
        onAirInfo.TotalOrgan.length + relatedPrdtSize > 1 ? this.isMultiCodeTv = true : this.isMultiCodeTv = false
        this.setNSLiveData(onAirInfo.TotalOrgan, 'nsLive')
        this.totalOrganTv = onAirInfo.TotalOrgan[0]
        if (retryFlagTv) {
          const nowEndTime = this.totalOrganTv.endDttm
          const checkToBroadEqual = prevEndTime !== nowEndTime
          if (checkToBroadEqual) {
            clearInterval(this.retryingTv)
            this.retryingTv = false
          }
        }
        this.setNsTalkRollingForHome('tv', this.tvPartNumber, this.totalOrganTv.startDttm, this.totalOrganTv.endDttm)
        this.nsLiveFlag = true
      }
    },
    /**
     * Shop+ 데이터 체크 및 설정.
     * @param {Object} apiData - NS Live 방송 데이터.
     * @param {Object} retryFlagShop - 샵플러스 방송이 끝난후 api 콜 재시도 여부 flag.
     * @param {Object} prevEndTime - 재시도 여부가 true 일때 이전 방송 엔드타임으로 같은방송인지 체크.
     */
    setShopPlusData (apiData, retryFlagShop, prevEndTime) {
      const broadIndex = retryFlagShop ? 0 : 1 // 홈이 처음 로딩될때는 배열길이가 2이다. (TV, Shop+) 타이머 종료시에 api 콜이 될때는, 배열길이가 1이다.
      if (this.shopPlusValidator(apiData, retryFlagShop)) { // Shop+ 편성정보가 있으면 데이터 셋팅.
        const totalOrgan = apiData.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[broadIndex]._SHOPPLUS[0].TotalOrgan
        totalOrgan.length > 1 ? this.isMultiCodeShop = true : this.isMultiCodeShop = false
        this.setShopPlusLiveData(totalOrgan, 'shopPlus')
        this.totalOrganShop = totalOrgan[0]
        if (retryFlagShop) {
          const nowEndTime = getDateParse(this.totalOrganShop.time.split('~')[1]).getTime()
          const checkToBroadEqual = prevEndTime !== nowEndTime
          if (checkToBroadEqual) {
            clearInterval(this.retryingShop)
            this.retryingShop = false
          }
        }
        this.shopPlusFlag = true
      }
    },
    /**
     * NS Live 응답 데이터 정상유무 와 편성정보 유무.
     * @param {Object} data
     * @returns {bool}
     */
    nsLiveValidator (data) {
      if (!isNull(data)) {
        const checker =
          !isNull(data.msg) &&
          (data.msg.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE) &&
          (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV) &&
          (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan) &&
          (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan.length) > 0
        return checker
      }
      return false
    },
    /**
     * Shop+ 응답 데이터 정상유무 와 편성정보 유무.
     * @param {Object} data
     * @param {Object} retryFlagShop - 샵플러스 방송이 끝난후 api 콜 재시도 여부 flag.
     * @returns {bool}
     */
    shopPlusValidator (data, retryFlagShop = false) {
      const broadIndex = retryFlagShop ? 0 : 1 // 홈이 처음 로딩될때는 배열길이가 2이다. (TV, Shop+) 타이머 종료시에 api 콜이 될때는, 배열길이가 1이다.
      if (!isNull(data)) {
        const checker =
          !isNull(data.msg) &&
          (data.msg.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE) &&
          (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[broadIndex]._SHOPPLUS) &&
          (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[broadIndex]._SHOPPLUS.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[broadIndex]._SHOPPLUS[0].TotalOrgan) &&
          (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[broadIndex]._SHOPPLUS[0].TotalOrgan.length) > 0
        return checker
      }
      return false
    },
    /**
     * NS Live 데이터 셋팅.
     * @param {Array} data
     * @param {String} caller - getCurrentLiveItem 메소드에 어떤 매체인지 전달하기 위함. (시간 데이터 포맷이 다름.)
     */
    setNSLiveData (data, caller) {
      const idx = this.getCurrentLiveItem(data, caller)
      if (idx < 0) {
        return false
      }

      const objTotalOrganF = data[0]
      this.tvGoodsName = htmlDecode(objTotalOrganF.goodsName)
      this.tvDlvrPrice = Number(objTotalOrganF.dlvrPrice) === 0
      this.tvIfiValue = Number(objTotalOrganF.ifiValue) > 0
      this.tvPadValue = Number(objTotalOrganF.padValue) !== 0

      this.tvLivePrice = objTotalOrganF.priceofferprice // 일반 판매가 (할인전 가격)
      this.tvDcPrice = objTotalOrganF.pricedcprice // 할인가격
      this.tvMmRntalPrc = objTotalOrganF.mmRntalPrc // 렌탈가격
      this.tvSaleRate = objTotalOrganF.saleRate // 할인율
      this.tvPrcWaveDisp = objTotalOrganF.prcWaveDisp // ~
      this.tvBusChnId = objTotalOrganF.busChnId
      this.tvDispTypeCd = objTotalOrganF.dispTypeCd

      this.tvAdultItemFlag = objTotalOrganF.adultItemFlag
      this.tvTimeSetFlag = true
      this.tvPartNumber = objTotalOrganF.partNumber
      this.dynamicPartNumber = objTotalOrganF.partNumber
      this.tvMultiCd = objTotalOrganF.multiCd

      if (loginUtil.isLoggedIn()) {
        this.setNSTalkData(objTotalOrganF.partNumber, loginUtil.userId(), loginUtil.telNo())
      }
    },
    /**
     * Shop+ 데이터 셋팅.
     * @param {Array} data
     * @param {String} caller - getCurrentLiveItem 메소드에 어떤 매체인지 전달하기 위함. (시간 데이터 포맷이 다름.)
     */
    setShopPlusLiveData (data, caller) {
      const idx = this.getCurrentLiveItem(data, caller)
      if (idx < 0) {
        return false
      }

      const objTotalOrganF = data[0]
      this.shopGoodsName = htmlDecode(objTotalOrganF.goodsName)
      this.shopDlvrPrice = Number(objTotalOrganF.dlvrPrice) === 0
      this.shopIfiValue = Number(objTotalOrganF.ifiValue) > 0
      this.shopPadValue = Number(objTotalOrganF.padValue) !== 0

      this.shopPrice = objTotalOrganF.priceofferprice // 일반 판매가(할인전 가격)
      this.shopDcPrice = objTotalOrganF.pricedcprice // 할인가격
      this.shopMmRntalPrc = objTotalOrganF.mmRntalPrc // 렌탈가격
      this.shopSaleRate = objTotalOrganF.saleRate // 할인율
      this.shopPrcWaveDisp = objTotalOrganF.prcWaveDisp // ~
      this.shopBusChnId = objTotalOrganF.busChnId
      this.shopDispTypeCd = objTotalOrganF.dispTypeCd

      this.shopAdultItemFlag = objTotalOrganF.adultItemFlag
      this.shopTimeSetFlag = true
      this.shopPartNumber = objTotalOrganF.partNumber
      this.dynamicPartNumber = objTotalOrganF.partNumber
      this.shopMultiCd = objTotalOrganF.multiCd
    },
    /**
     * 현재 방송중인 NS LIVE 아이템 정보 호출.
     * @param {Object} data
     * @returns {Number} idx
     */
    getCurrentLiveItem (data, caller) {
      let idx = -1
      try {
        const msecPerMinute = 1000 * 60
        const msecPerHour = msecPerMinute * 60
        const currentTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        for (let i = 0; i < data.length; i++) {
          let etime = ''
          if (caller === 'shopPlus') {
            etime = getDateParse(data[i].time.split('~')[1])
          } else {
            etime = getDateParse02(data[i].endDttm)
          }
          idx = i

          let interval = (etime.getTime() - currentTime.getTime())
          const hours = Math.floor(interval / msecPerHour)

          interval = interval - (hours * msecPerHour)
          const minutes = Math.floor(interval / msecPerMinute)

          interval = interval - (minutes * msecPerMinute)
          const seconds = Math.floor(interval / 1000)
          const timerParam = {
            hours,
            minutes,
            seconds
          }
          if (caller === 'nsLive') {
            this.timeLimitNSLive = new CommonTimer()
            this.timeLimitNSLive.setTimerOptions(timerParam)
            this.timeLimitNSLive.startTimer()
          } else if (caller === 'shopPlus') {
            this.timeLimitShopPlus = new CommonTimer()
            this.timeLimitShopPlus.setTimerOptions(timerParam)
            this.timeLimitShopPlus.startTimer()
          } else if (caller === 'thingLive') {
            this.timeLimitThingLive = new CommonTimer()
            this.timeLimitThingLive.setTimerOptions(timerParam)
            this.timeLimitThingLive.startTimer()
          }
        }
      } catch (e) {
        this.regErrlog('getCurrentLiveItem', e)
        idx = -1
      }

      return idx
    },
    /**
     * 단일코드, 복수코드 판단 후 단일코드면 상품상세페이지로, 복수코드면 브릿지 페이지로 이동.
     * @param {String} multiCodeFlag - 단일코드, 복수코드 판단.
     * @param {Number} partNumber - 상품코드
     * @param {String} clksrc - 전자상거래코드
     * @param {String} goodsName - 상품이름
     */
    clickedLiveProduct (multiCodeFlag, partNumber, clksrc, goodsName) {
      if (isNull(partNumber)) { // 단순히 편성정보가 없을때는 아무 동작도 하지 않는다.
        return false
      }
      const wahatContent = clksrc
      if (multiCodeFlag && !isNull(wahatContent)) { // 멀티 상품일때 브릿지 페이지로 이동.
        wahatContent === 'NSLIVE' ? this.gotoDetailOrBridge('NSLIVE', partNumber) : this.gotoDetailOrBridge('NSShop+', partNumber)
      } else {
        bizUtil.gotoProductDetail(partNumber, { clksrc })
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: `ONAIR_${clksrc}`,
          eventLabel: `방송보기_${goodsName}`,
          params: {
            t1: null
          }
        }
      })

      let t2Name = ''
      let productList = ''
      if (wahatContent === 'NSShop+') {
        t2Name = 'NSShop+'
        productList = '메인_NSShop+'
      } else {
        t2Name = 'NSLIVE'
        productList = '메인_NSLIVE'
      }
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(partNumber),
              name: goodsName,
              dimension16: 'eTV',
              dimension20: clksrc
            }
          ],
          subparams: {
            t1: '메인',
            t2: t2Name,
            product_list: productList
          }
        }
      })
    },
    /**
     * 상품갯수가 단일일경우: 상품상세페이지로 이동. 여러개일경우: 홈브릿지 페이지로 이동.
     * @param {String} identifyParam - 매체 구분자
     * @param {String} partNumber - 상품코드
     */
    gotoDetailOrBridge (identifyParam, partNumber) {
      let startTime = ''
      let endTime = ''
      let identify = ''
      let commonIsMultiCode = null
      if (identifyParam === 'NSLIVE') {
        identify = 'tv'
        startTime = this.totalOrganTv.startDttm
        endTime = this.totalOrganTv.endDttm
        commonIsMultiCode = this.isMultiCodeTv
      } else if (identifyParam === 'NSShop+' || identifyParam === 'Shop+') {
        identify = 'shopPlus'
        startTime = getDateParse(this.totalOrganShop.time.split('~')[0])
        endTime = getDateParse(this.totalOrganShop.time.split('~')[1])
        commonIsMultiCode = this.isMultiCodeShop
      }
      if (commonIsMultiCode) {
        const params = {
          identify,
          goodId: partNumber,
          startdtm: startTime,
          enddtm: endTime
        }
        popupUtil.show('store/HomeBridge', params, null, false)
      } else {
        this.$router.push(`/product/${partNumber}`)
      }
    },
    /**
     * ns live 및 shop+ 타이머 객체 null 체크.
     * 업데이트 훅에서 타이머 객체 null 체크 후 타이머 시간을 모두 소모했을때 API 재조회를 위함.
     * @param {Object || null} timer
     * @returns {bool}
     */
    timerIsNotNull (timer) {
      return !isNull(timer)
    },
    /**
     * NS Live 데이터 초기화. (편성 정보 없을때의 경우 등등..)
     */
    nsLiveDataInit () {
      this.timeLimitNSLive = null // ns live 타이머
      this.tvGoodsName = '' // 상품명
      this.tvLivePrice = '' // tv live 가격
      this.tvMmRntalPrc = '' // tv live 렌탈가격
      this.tvSaleRate = '' // tv live 세일율
      this.tvDcPrice = '' // tv live 할인가격
      this.tvDlvrPrice = false // tv live 무료배송 여부
      this.tvIfiValue = false // tv live 무이자 여부
      this.tvPadValue = false // tv live 적립금 여부
      this.tvAdultItemFlag = '' // tv live 성인상품 여부
      this.tvTimeSetFlag = false // tv live 타이머클래스 셋팅완료 여부
      this.tvPartNumber = '' // tv live 상품 코드
      this.tvMultiCd = '' // tv live 단일코드, 복수코드 여부
      this.tvBusChnId = '' // tv live 버스채널 id
      this.tvDispTypeCd = '' // tv live 전시유형
      this.isMultiCodeTv = false
      this.nstalkYnTv = false
      this.nsLiveFlag = false
    },
    /**
     * Shop+ 데이터 초기화. (편성 정보 없을때의 경우 등등..)
     */
    shopPlusDataInit () {
      this.timeLimitShopPlus = null // shop+ 타이머
      this.shopGoodsName = '' // 상품명
      this.shopPrice = '' // shop+ 가격
      this.shopSaleRate = '' // shop+ 세일율
      this.shopDcPrice = '' // shop+ 할인가격
      this.shopMmRntalPrc = '' // shop+ 렌탈가격
      this.shopDlvrPrice = false // shop+ 무료배송 여부
      this.shopIfiValue = false // shop+ 무이자 여부
      this.shopPadValue = false // shop+ 적립금 여부
      this.shopAdultItemFlag = '' // shop+ 성인상품 여부
      this.shopTimeSetFlag = false // shop+ 타이머클래스 셋팅완료 여부
      this.shopPartNumber = '' // shop+ 상품 코드
      this.shopMultiCd = '' // shop+ 단일코드, 복수코드 여부
      this.shopBusChnId = '' // shop+ 버스채널 id
      this.shopDispTypeCd = '' // shop+ 전시유형
      this.isMultiCodeShop = false
      this.nstalkYnShop = false
      this.shopPlusFlag = false
    },
    /**
     * 상담상품일때 상담하기 페이지로 이동.
     * @param {String} partNumber
     */
    gotoAdvice (partNumber, flg, goodsName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: '상담신청',
          eventLabel: `상담신청_${flg}_${goodsName}`,
          params: {
            t1: null
          }
        }
      })
      this.moveConsultationRequest(partNumber)
    },
    /**
     * NSTalk 데이터 세팅
     *
     * @param {String} productCode - 상품 코드
     * @param {String} userId - 고객 번호
     * @param {String} userTel - 고객 전화번호 뒤 4자리
     * @returns {void}
     */
    setNSTalkData (productCode, userId, userTel) {
      this.talkInfo.productCode = productCode
      this.talkInfo.userId = userId
      this.talkInfo.userTel = userTel
    },

    /**
     * 상품갯수가 단일일경우: 상품상세페이지로 이동. 여러개일경우: 홈브릿지 페이지로 이동.
     * @param {String} identifyParam - 매체 구분자
     * @param {String} partNumber - 상품코드
     */
    gotoBridgeOnlyNsTalk (identifyParam, partNumber) {
      if (isNull(partNumber)) { return false }
      const startTime = this.totalOrganTv.startDttm
      const endTime = this.totalOrganTv.endDttm
      const identify = 'tv'
      const params = {
        identify,
        goodId: partNumber,
        startdtm: startTime,
        enddtm: endTime,
        nsTalkOnlyFlag: true
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: 'NS톡',
          eventLabel: `NS톡_${partNumber}`,
          params: {
            t1: null
          }
        }
      })
      popupUtil.show('store/HomeBridge', params, null, false)
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/LiveSection";
</style>
