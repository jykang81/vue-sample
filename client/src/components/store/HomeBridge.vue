<template>
  <div id="home_bridge_wrap" class="home_bridge">
    <header class="app_header sub_page">
      <div class="header">
        <h1 class="sub_title">
          <i class="icons_live" />
          {{ getTitleLable() }}
        </h1>
        <div class="right_wrap">
          <button
            v-if="getOnlyNsTalkFlag"
            type="button"
            class="btn_close"
            @click="xButtonToggle(getOnlyNsTalkFlag)"
          >
            팝업 닫기
          </button>
          <button
            v-else
            type="button"
            class="btn_close"
            @click="closeSearchPopup()"
          >
            팝업 닫기
          </button>
        </div>
      </div>
    </header>
    <div class="app_container">
      <!-- 비디오 관련 영역 -->
      <div class="photo_wrap">
        <figure
          v-if="partNumber && productsData.length"
          v-show="!warningFlag"
        >
          <ns-img
            :product-number="partNumber"
            :alt="htmlDecode(productsData[0].goodsName)"
            type="WIDE"
          />
        </figure>
        <div class="video_wrap">
          <video-player
            id="exampleFour"
            ref="videoPlayer"
            playsinline
            :options="computedPlayerOption"
            @ready="onPlayerReadied"
            @play="playVideo"
            @pause="onPlayerPause($event)"
          />
        </div>
        <div id="videoPlaying"
             class="video_playing"
        >
          <div
            v-show="(!!computedPlayerOption && !showLiveCloseMsg && !showDataWarning && showRemainingTime)"
            class="play_button"
          >
            <button
              v-if="warningFlag"
              type="button"
              @click="playVideo"
            >
              <span :class="`icons_play`">재생</span>
            </button>
            <button
              v-else
              type="button"
              @click="openDataWarning"
            >
              <span :class="`icons_play`">재생</span>
            </button>
            <strong
              v-if="liveTime"
              class="copy time"
            >
              {{ liveTime.formattedLimitTime() }}
            </strong>
            <strong
              v-else
              class="copy time"
            >
              00:00:00
            </strong>
          </div>
        </div>
        <data-warning
          v-if="showDataWarning"
          @closeDataWarning="closeDataWarning"
          @playVideo="playVideo"
        />
        <p
          v-if="liveTime === 0"
          class="live_close_msg"
        >
          생방송이<br>종료되었습니다.
        </p>
      </div>
      <!-- nstalk 롤링 영역 -->
      <div
        v-if="!getOnlyNsTalkFlag && nsTalkEnable && !activeNsTalk"
        class="nstalk_line"
      >
        <i class="icons_nstalk" />
        <swiper
          ref="swiperTalk"
          :options="swiperTalk"
          class="swiper_talk"
        >
          <swiper-slide
            v-for="(value, index) in nsTalkMessage"
            :key="index"
          >
            <span>{{ value }}</span>
          </swiper-slide>
        </swiper>
        <a class="btn_nstalk" @click="clickedNsTalk()">
          <span>NS톡</span>
        </a>
      </div>
      <ns-talk v-if="activeNsTalk" :talk-info="talkInfo" />
      <!-- 상품 영역 -->
      <template
        v-else-if="!getOnlyNsTalkFlag && !activeNsTalk && productsData.length"
      >
        <template
          v-for="(value, index) in productsData"
        >
          <strong
            v-if="value.onAirFlag === 'B' || value.onAirFlag === 'A'"
            :key="index"
            class="live_time"
          >
            {{ getPreNextLabel(value.onAirFlag) }} <span class="time">{{ getHourMinuteFormat(value.startDtm) }} - {{ getHourMinuteFormat(value.endDtm) }}</span>
          </strong>
          <div :key="`${index}_key`" class="product_item">
            <div class="item">
              <router-link
                to=""
                event=""
                @click.native="liveProductLogging(
                  value.goodsId,
                  value.goodsName,
                  getTitleLable().replace(' ', ''),
                  {clksrc: `메인_${getTitleLable().replace(' ', '')}_라이브상품목록`},
                  { name: 'productDetail', params: { number: value.goodsId, clksrc: `메인_${getTitleLable().replace(' ', '')}_라이브상품목록` }},
                  value.orderYn !== 'N'
                )"
              >
                <figure>
                  <ns-img
                    :product-number="value.goodsId"
                    :width="176"
                    :height="176"
                    :alt="value.goodsName"
                    :is-adult="'N'"
                  />
                </figure>
                <div class="price_title">
                  <ns-price
                    :dc-price="value.salePrice"
                    :dc-rate="value.saleRate"
                    :price="value.priceofferprice"
                    :mm-rntal-prc="value.mmRntalPrc"
                    :prc-wave-disp="value.prcWaveDisp"
                    :buschn-id="value.busChnId"
                    :disp-type-cd="value.dispTypeCd"
                  />
                  <p class="title">
                    {{ getHtmlDecode(value.goodsName) }}
                  </p>
                </div>
              </router-link>
              <div class="benefit_button">
                <ul class="benefit">
                  <li v-if="!checkFormlessProduct(value.dispTypeCd) && value.dlvrFreeYn">
                    무료배송
                  </li>
                  <li v-if="value.promIfiYn">
                    무이자
                  </li>
                  <li v-if="value.promPadYn">
                    적립금
                  </li>
                </ul>
                <p
                  v-if="value.onAirFlag === 'O' && value.orderYn === 'N'"
                  class="btn_group"
                >
                  <button
                    type="button"
                    class="btn_buy in_active"
                    @click="soldOut()"
                  >
                    일시품절
                  </button>
                </p>
                <p
                  v-else-if="value.onAirFlag === 'O' && value.adviceProductFlag"
                  class="btn_group"
                >
                  <button
                    type="button"
                    class="btn_buy"
                    @click="setAdviceParam(value.goodsId)"
                  >
                    상담 신청
                  </button>
                </p>
                <p
                  v-else-if="value.onAirFlag === 'O' && !value.adviceProductFlag"
                  class="btn_group"
                >
                  <button
                    type="button"
                    class="btn_buy"
                    @click="clickedBuyNow(value.goodsId)"
                  >
                    바로구매
                  </button>
                </p>
              </div>
            </div>
          </div>
          <!-- 연관상품 영역 -->
          <div
            v-for="(innerValue, innerIndex) in value.RelTotalOrgan"
            v-show="value.onAirFlag === 'O'"
            :key="`${index}_${innerIndex}_relatekey`"
            class="product_item"
          >
            <div class="item">
              <router-link
                to=""
                event=""
                @click.native="liveRelateProductClicked(
                  { name: 'productDetail', params: { number: innerValue.goodsId, clksrc: `메인_${getTitleLable().replace(' ', '')}_라이브상품목록` }},
                  innerValue.orderYn !== 'N'
                )"
              >
                <figure>
                  <ns-img
                    :src="innerValue.imageUrl"
                    :alt="innerValue.goodsName"
                  />
                </figure>
                <div class="price_title">
                  <ns-price
                    :dc-price="innerValue.salePrice"
                    :dc-rate="innerValue.saleRate"
                    :price="innerValue.priceofferprice"
                    :mm-rntal-prc="innerValue.mmRntalPrc"
                    :prc-wave-disp="innerValue.prcWaveDisp"
                    :buschn-id="innerValue.busChnId"
                    :disp-type-cd="innerValue.dispTypeCd"
                  />
                  <p class="title">
                    {{ getHtmlDecode(innerValue.goodsName) }}
                  </p>
                </div>
              </router-link>
              <div class="benefit_button">
                <ul class="benefit">
                  <li v-if="innerValue.dlvrFreeYn">
                    무료배송
                  </li>
                  <li v-if="innerValue.promIfiYn">
                    무이자
                  </li>
                  <li v-if="innerValue.promPadYn">
                    적립금
                  </li>
                </ul>
                <p
                  v-if="value.onAirFlag === 'O' && innerValue.orderYn === 'N'"
                  class="btn_group"
                >
                  <button
                    type="button"
                    class="btn_buy in_active"
                    @click="soldOut()"
                  >
                    일시품절
                  </button>
                </p>
                <p
                  v-else-if="value.onAirFlag === 'O' && innerValue.adviceProductFlag"
                  class="btn_group"
                >
                  <button
                    type="button"
                    class="btn_buy"
                    @click="setAdviceParam(innerValue.goodsId)"
                  >
                    상담 신청
                  </button>
                </p>
                <p
                  v-else-if="value.onAirFlag === 'O' && !innerValue.adviceProductFlag"
                  class="btn_group"
                >
                  <button
                    type="button"
                    class="btn_buy"
                    @click="clickedBuyNow(innerValue.goodsId)"
                  >
                    바로구매
                  </button>
                </p>
              </div>
            </div>
          </div>
          <!-- // 연관상품 영역 -->
        </template>
      </template>
    </div>
    <!-- 바로장바구니 레이어 컴포넌트 -->
    <right-order-option
      v-if="layer"
      :shows-layer="layer"
      :global-val="globalVal"
      @layerClose="layerClose"
    />
  </div>
</template>

<script>
import {
  isNull,
  htmlDecode,
  isOsApp,
  isiOS
} from '@utils/commonutil/commonUtil'
import {
  getDateParse,
  getDateParse02,
  calcDate
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@utils/bizUtil'
import DataWarning from '@/components/product/DataWarning'
import setNsTalkRollingMixin from '@/mixins/store/home/setNsTalkRollingMixin'
import CONST from '@constants/framework/framework'
import CommonTimer from '@/common/classes/CommonTimer'
import STORE_CONST from '@/common/constants/store/store'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import loginUtil from '@utils/loginUtil'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import consultationMixin from '@/mixins/product/consultationMixin'
import NsImg from '@components/common/NsImg'
import RightOrderOption from '@/components/product/RightOrderOption'
import NsTalk from '@/components/media/NsTalk' // NS TALK 팝업
import nativeUtil from '@frameworks/nativeUtil'
import uiUtil from '@utils/uiUtil'
import LOGIN_CONST from '@constants/customer/login'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsPrice from '@components/common/NsPrice'
import messageUtil from '@/common/frameworks/messageUtil'
import storeFormlessMixin from '@/mixins/store/storeFormlessMixin'

export default {
  components: {
    DataWarning,
    NsImg,
    RightOrderOption,
    NsTalk,
    NsPrice
  },
  mixins: [
    setNsTalkRollingMixin,
    anchorMixin,
    consultationMixin,
    storeFormlessMixin
  ],
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      layer: false,
      showDataWarning: false, // 데이터 경고창을 보여줄것인지 아닌지의 여부.
      showPauseButton: false, // 일시정지 버튼을 보여줄것인지 아닌지의 여부.
      showRemainingTime: false, // 남은시간을 보여줄것인지 아닌지의 여부.
      isPlaying: false, // 현재 재생중인지 아닌지의 여부.
      swiperTalk: { // ns talk 롤링 세로 스와이프.
        direction: 'vertical',
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        },
        loop: true
      },
      globalVal: { // right-order-option 컴포넌트에 넘겨줄 Object
        partNumber: '',
        getProductInfoFlag: true
      },
      liveTime: null, // 방송 남은 시간
      warningFlag: false, // 데이터 경고창을 최초 한번만 보여주기 위해 제어를 위한 bool
      productsData: [], // NS Live 혹은 NS Shop+ 데이터.
      /* nstalk 관련 데이터 시작 */
      activeNsTalk: false, // ns 톡 메세지버튼 제어.
      talkInfo: {
        productCode: '', // 상품코드
        userId: '', // 유저 id
        userTel: '' // 유저 폰번호
      },
      /* nstalk 관련 데이터 끝 */
      partNumber: false
    }
  },
  computed: {
    /**
     * nstalk icon을 눌러서 들어왔는지 그냥 들어왔는지 체크후 bool 반환.
     * @returns {bool}
     */
    getOnlyNsTalkFlag () {
      if (isOsApp()) { // APP
        return this.param.nsTalkOnlyFlag === 'true'
      }
      return !isNull(this.param.nsTalkOnlyFlag) && this.param.nsTalkOnlyFlag
    },
    /**
     * 방송 남은 시간 null 체크.
     * @returns {bool}
     */
    showLiveCloseMsg () {
      return isNull(this.liveTime)
    },
    /**
     * 비디오 플레이어 객체 반환.
     * @returns {Object}
     */
    player () {
      return this.$refs.videoPlayer.player
    },
    /**
     * 비디오플레이어 옵션
     *
     */
    computedPlayerOption () {
      let vodFilePath = ''
      if (this.param.identify === 'tv') {
        vodFilePath = CONST.LIVE.url.etc
      } else {
        vodFilePath = CONST.LIVE.url.shopPlus
      }
      const type = 'application/x-mpegURL'
      const partNumber = this.param.goodId
      this.setPartNumber(!isNull(partNumber) ? partNumber : false)
      if (vodFilePath) {
        const playerOption = {
          html5: { hls: { withCredentials: false } },
          controlBar: {
            children: [
              'playToggle',
              'volumePanel',
              'fullscreenToggle'
            ]
          },
          muted: true,
          fluid: true,
          language: 'ko',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [
            {
              withCredentials: false,
              type,
              src: vodFilePath
            }
          ]
        }

        return playerOption
      } else {
        return null
      }
    }
  },
  created () {
    const { identify, goodId, startdtm, enddtm } = this.param
    this.setNsTalkInfo(identify, goodId, startdtm, enddtm)
    this.setNsTalkRolling()
    this.setCurrentLiveItem()
    this.getProductInfo()
  },
  mounted () {
    if (this.getOnlyNsTalkFlag) {
      this.clickedNsTalk()
    }
    if (isOsApp()) {
      nativeUtil.setRoutePath('/popup')
    }
  },
  updated () {
    uiUtil.disableScroll()
  },
  beforeDestroy () {
    uiUtil.enableScroll()
    this.nstalkClassRemove()
    this.activeNsTalk = false
    this.liveTime = null
  },
  methods: {
    htmlDecode,
    /**
     * 라이브상품목록 클릭 시
     * @param {String} goodsId  상품코드
     * @param {String} goodsName 상품명
     * @param {String} titleLabel 라이브명
     * @param {Object} clksrc 전자상거래코드
     * @param {Object} routerInfo 라우터 정보
     * @param {bool} isNotSoldOut 구매가능여부 - true: 구매가능, false: 일시품절.
     */
    liveProductLogging (goodsId, goodsName, titleLabel, clksrc, routerInfo, isNotSoldOut) {
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: goodsId,
              name: goodsName,
              dimension16: 'eTV'
            }
          ],
          subparams: {
            t1: '메인',
            t2: titleLabel,
            t3: '라이브상품목록',
            product_list: clksrc.clksrc
          }
        }
      })
      if (isNotSoldOut) {
        this.$router.push(routerInfo)
      }
    },
    /**
     * 라이브 연관상품 목록 클릭시
     * @param {Object} routerInfo 라우터 정보
     * @param {bool} isNotSoldOut 구매가능여부 - true: 구매가능, false: 일시품절.
     */
    liveRelateProductClicked (routerInfo, isNotSoldOut) {
      if (isNotSoldOut) {
        this.$router.push(routerInfo)
      }
    },
    /**
     * 썸네일 이미지를 가져오기위해 상품코드 셋팅.
     * @param {String} partNumber - 상품코드
     */
    setPartNumber (partNumber) {
      this.partNumber = partNumber
    },
    /**
     * nstalk 활성화 했을경우, class 추가.
     */
    nstalkClassAdd () {
      let checker = document.querySelector('body')?.classList.contains('live_talk')
      if (!checker) { document.querySelector('body').classList.add('live_talk') }
      checker = document.querySelector('.nstalk_line')?.classList.contains('blind')
      if (checker) { document.querySelector('.nstalk_line').classList.add('blind') }
    },
    /**
     * 홈브릿지에서 nstalk 닫았을경우, class 추가.
     */
    nstalkClassRemove () {
      const checker = document.querySelector('body').classList.contains('live_talk')
      if (checker) { document.querySelector('body').classList.remove('live_talk') }
    },
    /**
     * ns talk 버튼 클릭. - ns talk 활성화.
     */
    clickedNsTalk () {
      if (loginUtil.isLoggedIn()) {
        this.$nsaxios.post('NSMobNsTalkForInfoBankCmd', {}).then(data => {
          const userInfo = data.msg.PersonalInfo
          const productInfo = data.msg.OnAirPrdInfo

          if (userInfo && productInfo.length) {
            const productCode = productInfo[0].product_code
            const userId = userInfo.user_id
            const userTel = userInfo.user_tel
            this.setNSTalkData(productCode, userId, userTel)
          }
          this.activeNsTalk = true
        })
        this.nstalkClassAdd()
      } else {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER)
      }
    },
    /**
     * 바로구매 열기 메소드.
     */
    layerOpen () {
      this.layer = true
    },
    /**
     * 바로구매 닫기 메소드.
     */
    layerClose () {
      this.layer = false
      uiUtil.enableScroll(document.getElementById('home_bridge_wrap'))
    },
    /**
     * 바로구매 클릭시 레이어 오픈.
     * @param {String} partNumber - 상품코드.
     */
    clickedBuyNow (partNumber) {
      this.globalVal.partNumber = partNumber
      this.layer = true
      uiUtil.disableScroll(document.getElementById('home_bridge_wrap'))
    },
    /**
     * 데이터경고창 열기
     *
     */
    openDataWarning () {
      this.showPauseButton = true
      this.showDataWarning = true
    },
    /**
     * 데이터경고창 닫기
     *
     */
    closeDataWarning () {
      this.showPauseButton = false
      this.showDataWarning = false
    },
    /**
     * 동영상 준비완료
     *
     */
    onPlayerReadied () {
      this.showRemainingTime = true
      this.$refs.videoPlayer.player
        .addChild('button')
        .addClass('btn_full_close')

      document.querySelector('.btn_full_close').addEventListener('touchstart', () => {
        this.closePlayer()
        document.querySelector('.btn_full_close').removeEventListener('touchstart', this.closePlayer())
      })

      const sampleDiv = document.getElementById('exampleFour')
      const targetDiv = sampleDiv.firstChild
      const videoPlayingDiv = document.getElementById('videoPlaying')
      targetDiv.appendChild(videoPlayingDiv)

      if (isiOS()) {
        this.$refs.videoPlayer.player
          .addClass('ios')
      } else {
        this.$refs.videoPlayer.player
          .addClass('android')
      }
    },
    /**
     * 일시정지
     *
     */
    onPlayerPause () {
      this.showRemainingTime = true
      this.$refs.videoPlayer.player.pause()
      this.isPlaying = false
    },
    /**
     * 재생버튼 클릭
     *
     * @param {palyer} 비디오 플레이어
     */
    onPlayerPlay () {
      this.warningFlag = true
      this.showRemainingTime = false
      this.isPlaying = true
    },
    /**
     * 재생
     *
     */
    playVideo () {
      this.warningFlag = true
      this.showRemainingTime = false
      this.showDataWarning = false
      this.showPauseButton = true
      this.isPlaying = true
      this.$refs.videoPlayer.player.play()
    },
    /**
     * 동영상 닫기
     *
     */
    closePlayer () {
      this.isPlaying = false
      this.showPauseButton = false
      this.showRemainingTime = true
    },
    /**
     * 브릿지 레이어 닫기.
     *
     */
    closeSearchPopup () {
      if (this.activeNsTalk) {
        this.nstalkClassRemove()
        this.activeNsTalk = false
      } else {
        if (isOsApp() && this.param.nativeYn === 'Y') { // APP
          nativeUtil.closeWebView()
        } else {
          this.$store.commit('popup/hide', null)
        }
      }
    },
    /**
     * nstalk 에서 홈브릿지로 돌아갈지 팝업을 닫을지 판단.
     * @param {bool} flag - 홈에서 ns talk을 통해 들어오면 true, 홈브릿지에서 nstalk을 누른거면 false
     */
    xButtonToggle (flag) {
      if (flag) {
        if (isOsApp() && this.param.nativeYn === 'Y') { // APP
          nativeUtil.closeWebView()
        } else {
          this.$store.commit('popup/hide', null)
        }
      } else {
        this.nstalkClassRemove()
        this.activeNsTalk = false
      }
    },
    /**
     * 매체에 따라 타이틀 리턴.
     *
     * @returns {String}
     */
    getTitleLable () {
      let label = ''
      switch (this.param.identify) {
        case 'tv':
          label = 'NS LIVE'
          break
        default:
          label = 'NS Shop+'
      }
      if (this.activeNsTalk) { label = 'NS Talk' }
      return label
    },
    /**
     * 현재 방송중인 TV LIVE 아이템 정보 호출.
     */
    setCurrentLiveItem () {
      try {
        let endTime = ''
        if (this.param.identify === 'tv') {
          endTime = getDateParse02(this.param.enddtm)
        } else {
          if (isOsApp()) {
            endTime = getDateParse02(this.param.enddtm)
          } else {
            endTime = this.param.enddtm
          }
        }
        const msecPerMinute = 1000 * 60
        const msecPerHour = msecPerMinute * 60
        const currentTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        let interval = (endTime.getTime() - currentTime.getTime())
        const hours = Math.floor(interval / msecPerHour)

        interval = interval - (hours * msecPerHour)
        const minutes = Math.floor(interval / msecPerMinute)

        interval = interval - (minutes * msecPerMinute)
        const seconds = Math.floor(interval / 1000)
        const today = new Date()
        this.tvRemainingTime = new Date(today.getFullYear(), today.getMonth(), today.getDay(), hours, minutes, seconds)
        const timerParam = {
          hours,
          minutes,
          seconds
        }
        this.liveTime = new CommonTimer()
        this.liveTime.setTimerOptions(timerParam)
        this.liveTime.startTimer()
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * hh:mm 형태의 time string 반환.
     * @param {String} param - 대상 시간.
     * @returns {String}
     */
    getHourMinuteFormat (param) {
      let hour = getDateParse02(param).getHours()
      let minute = getDateParse02(param).getMinutes()
      if (String(hour).length === 1) { hour = `0${hour}` }
      if (String(minute).length === 1) { minute = `0${minute}` }
      const returnTime = `${hour}:${minute}`
      return returnTime
    },
    /**
     * NS Live 또는 샵플러스 정보 조회
     */
    async getProductInfo () {
      const idText = this.param.identify
      if (isOsApp() && isNull(idText)) {
        nativeUtil.closeWebView()
      }
      const commandName = STORE_CONST.BRIDGE_CONST.PARAMETERS[idText].COMMAND_NAME
      const parameters = {
        selectDay: STORE_CONST.BRIDGE_CONST.PARAMETERS[idText].SELECT_DAY,
        processFlag: STORE_CONST.BRIDGE_CONST.PARAMETERS[idText].PROCESS_FLAG
      }
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      if (!isNull(apiData) && !isNull(apiData.msg) && !isNull(apiData.msg.TotalOrgan)) {
        this.setProductsData(apiData.msg.TotalOrgan)
      }
    },
    /**
     * 실제 상품영역 데이터 셋팅.
     * @param {Array} data API 정보조회 데이터.
     */
    setProductsData (data) {
      const productsData = []
      data.forEach((element, index) => {
        const objTotalOrganF = data[index]
        const dataSet = {}
        dataSet.goodsName = htmlDecode(objTotalOrganF.goodsName)
        if (
          (
            objTotalOrganF.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL || // 35, 무형상품-여행
            objTotalOrganF.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_INSURANCE || // 40 무형상품-보험
            objTotalOrganF.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL || // 45 무형상품-렌탈
            objTotalOrganF.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_FUNERAL || // 56 무형상품-장례
            objTotalOrganF.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_ADVERTISEMENT || // 58 무형상품-광고
            objTotalOrganF.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE || // 57 무형상품-휴대폰
            objTotalOrganF.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL // 45 무형상품-렌탈
          )
        ) {
          dataSet.adviceProductFlag = true
        } else {
          dataSet.adviceProductFlag = false
        }
        dataSet.dlvrFreeYn = objTotalOrganF.dlvrFreeYn === 'Y'
        dataSet.promIfiYn = objTotalOrganF.promIfiYn === 'Y'
        dataSet.promPadYn = objTotalOrganF.promPadYn === 'Y'
        dataSet.salePrice = objTotalOrganF.salePrice // 할인가격
        dataSet.saleRate = objTotalOrganF.saleRate // 할인율
        dataSet.priceofferprice = objTotalOrganF.priceofferprice // 일반 판매가(할인전 가격)
        dataSet.goodsId = objTotalOrganF.goodsId
        dataSet.onAirFlag = objTotalOrganF.onAirFlag
        dataSet.startDtm = objTotalOrganF.startDtm
        dataSet.endDtm = objTotalOrganF.endDtm
        dataSet.prcWaveDisp = objTotalOrganF.prcWaveDisp
        dataSet.orderYn = objTotalOrganF.orderYn
        dataSet.busChnId = objTotalOrganF.busChnId
        dataSet.dispTypeCd = objTotalOrganF.dispTypeCd

        const RelTotalOrgan = []
        if (objTotalOrganF.RelTotalOrgan.length) { // 연관 상품 셋팅.
          objTotalOrganF.RelTotalOrgan.forEach((relateValue, relateIndex) => {
            const relateDataSet = {}
            if (
              (
                relateValue.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL || // 35, 무형상품-여행
                relateValue.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_INSURANCE || // 40 무형상품-보험
                relateValue.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL || // 45 무형상품-렌탈
                relateValue.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_FUNERAL || // 56 무형상품-장례
                relateValue.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_ADVERTISEMENT || // 58 무형상품-광고
                relateValue.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE || // 57 무형상품-휴대폰
                relateValue.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL // 45 무형상품-렌탈
              )
            ) {
              relateDataSet.adviceProductFlag = true
            } else {
              relateDataSet.adviceProductFlag = false
            }
            relateDataSet.imageUrl = relateValue.imageUrl
            relateDataSet.goodsName = htmlDecode(relateValue.goodsName)
            relateDataSet.dlvrFreeYn = relateValue.dlvrFreeYn === 'Y'
            relateDataSet.promIfiYn = relateValue.promIfiYn === 'Y'
            relateDataSet.promPadYn = relateValue.promPadYn === 'Y'
            relateDataSet.priceofferprice = relateValue.price // 일반 판매가(할인전 가격)
            relateDataSet.saleRate = Number(relateValue.saleRate) // 할인율
            relateDataSet.salePrice = relateValue.salePrice // 할인가격
            relateDataSet.goodsId = relateValue.goodsId
            relateDataSet.prcWaveDisp = relateValue.prcWaveDisp
            relateDataSet.orderYn = relateValue.orderYn
            relateDataSet.busChnId = relateValue.buschnId
            relateDataSet.dispTypeCd = relateValue.dispTypeCd
            RelTotalOrgan.push(relateDataSet)
          })
        }
        dataSet.RelTotalOrgan = RelTotalOrgan
        productsData.push(dataSet)
      })
      let OIndex = null
      let BIndex = null
      let AIndex = null
      const resultArray = []
      productsData.forEach((element, index) => { // 렌더링 순서를 dom에 맞추기 위해 배열의 요소들을 정렬한다. (현재방송, 이전방송, 다음방송)
        if (element.onAirFlag === 'O') { OIndex = index }
        if (element.onAirFlag === 'B') { BIndex = index }
        if (element.onAirFlag === 'A') { AIndex = index }
      })
      if (!isNull(productsData[OIndex])) { resultArray.push(productsData[OIndex]) } // 1. 현재방송
      if (!isNull(productsData[BIndex])) { resultArray.push(productsData[BIndex]) } // 2. 이전방송
      if (!isNull(productsData[AIndex])) { resultArray.push(productsData[AIndex]) } // 3. 다음방송
      this.productsData = resultArray
    },
    /**
     * 이전방송, 다음방송 한글 텍스트 반환.
     *
     * @param {String} param - 방송 순서 구분자.
     * @returns {String}
     */
    getPreNextLabel (param) {
      if (param === 'B') {
        return STORE_CONST.BRIDGE_CONST.PRE_BROAD_KOR
      } else if (param === 'A') {
        return STORE_CONST.BRIDGE_CONST.NEXT_BROAD_KOR
      }
    },
    /**
     * 상품상세 API 조회후, 상담하기 페이지로 이동.
     * @param partNumber - 상품코드
     */
    setAdviceParam (partNumber) {
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
     * 일시 품절일 경우에 대한 처리.
     */
    soldOut () {
      messageUtil.alert('품절되었습니다.\n빠른 시간 내에 상품을 준비하겠습니다.')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/HomeBridge";
</style>
