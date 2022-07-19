<template>
  <div class="live_section_all">
    <div class="live_section_all_head">
      <p class="live_box">
        <span>{{ getTvLiveLabel(bottomNaviValue, bottomNaviIndex) }}</span>
        <i v-show="liveIconCheck(vodPlayGubun)" class="icons_live" />
      </p>
      <a v-if="isTv || isShopPlus" @click="scheduleLogging(bottomNaviValue)">
        편성표
        <i />
      </a>
      <a
        v-else
        href="/store/media/thinglive"
        @click="thingLiveLogging()"
      >
        전체보기
        <i />
      </a>
    </div>
    <div class="live_section_all_contents">
      <!-- TV Live와 샵플러스는 같은 템플릿 사용. -->
      <section v-if="isTv || isShopPlus">
        <div
          class="photo_wrap"
          :class="showDataWarning ? 'layer_open' : ''"
        >
          <figure
            v-if="!isPlaying"
            @click="gotoDetailOrBridge(commonIsMultiCode, dynamicPartNumber, bottomNaviValue)"
          >
            <ns-img
              v-if="hasTvInfoNow"
              :product-number="totalOrgan.partNumber"
              :alt="totalOrgan.itncatentrynm"
              :is-adult="totalOrgan.adultItemFlag"
              type="WIDE"
            />
          </figure>
          <div v-show="(computedPlayerOption && !showLiveCloseMsg && !showDataWarning && showRemainingTime) || dataUpdatingTv || dataUpdatingShop"
               class="play_button"
          >
            <button
              v-if="isPlaying"
              type="button"
              @click="playVideo"
            >
              <span v-show="isPausedClass === ''" :class="`icons_play`">재생</span>
            </button>
            <button
              v-else
              type="button"
              @click="openDataWarning"
            >
              <span :class="`icons_play`">재생</span>
            </button>
            <template v-if="isTv">
              <strong
                v-if="!retryingInterval && !isNull(timeLimitTv)"
                class="copy time"
              >
                {{ timeLimitTv.formattedLimitTime() }}
              </strong>
              <strong
                v-else
                class="copy time"
              >
                00:00:00
              </strong>
            </template>
            <template v-else-if="isShopPlus">
              <strong
                v-if="!retryingInterval && !isNull(timeLimitShop)"
                class="copy time"
              >
                {{ timeLimitShop.formattedLimitTime() }}
              </strong>
              <strong
                v-else
                class="copy time"
              >
                00:00:00
              </strong>
            </template>
          </div>
          <data-warning
            v-if="showDataWarning"
            @closeDataWarning="closeDataWarning"
            @playVideo="playVideo"
          />
          <div v-if="computedPlayerOption"
               v-show="isPlaying"
               :key="playReloadKey"
               class="video_wrap"
          >
            <video-player
              ref="videoPlayer"
              playsinline
              :options="computedPlayerOption"
              @ready="onPlayerReadied"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
            />
            <button
              type="button"
              class="btn_close"
              @click="closePlayer"
            >
              동영상 닫기
            </button>
            <p v-if="showLiveCloseMsg"
               class="live_close_msg"
            >
              생방송이<br>종료되었습니다.
            </p>
          </div>
          <figure v-if="!hasTvInfoNow">
            <img
              src="~@/assets/images/common/img_noImage_wide.png"
              alt="현재 편성정보가 없습니다."
            >
          </figure>
        </div>
        <div v-if="hasTvInfoNow"
             class="price_title"
             @click="gotoDetailOrBridge(commonIsMultiCode, dynamicPartNumber, bottomNaviValue, null, true)"
        >
          <ns-price
            v-show="!isNull(goodsName)"
            :dc-price="tvDcPrice"
            :dc-rate="tvSaleRate"
            :price="tvLivePrice"
            :mm-rntal-prc="tvMmRntalPrc"
            :prc-wave-disp="tvPrcWaveDisp"
            :buschn-id="busChnId"
            :disp-type-cd="tvDispTypeCd"
          />
          <p class="title">
            {{ goodsName }}
          </p>
        </div>
        <div v-if="tvLiveImage !== ''" class="btn_group">
          <button
            v-if="(isTv || isShopPlus) && checkIntangiblePrd(totalOrgan.dispTypeCd)"
            type="button"
            class="btn_buy"
            @click="setAdviceParam(totalOrgan.partNumber)"
          >
            상담하기
          </button>
          <button
            v-else
            type="button"
            class="btn_buy"
            @click="gotoDetailOrBridge(commonIsMultiCode, dynamicPartNumber, bottomNaviValue, 'buyButton')"
          >
            구매하기
          </button>
        </div>
      </section>
      <!-- 띵라이브만 별도 템플릿 사용 - 라이브, 라이브 예고 영상일때 -->
      <template v-else-if="viewGubun !== 'VOD'">
        <div
          class="photo_wrap thinglive"
          :class="showDataWarning ? 'layer_open' : ''"
        >
          <figure
            v-if="!isPlaying"
            @click="thingLiveProductInfoClicked"
          >
            <ns-img
              v-if="hasThingLiveInfo"
              :src="thingLiveData._VODLIVE[0].vodLiveImg"
              :alt="thingLiveData._VODLIVE[0].vodLiveGoodsNm"
              :is-adult="'N'"
              type="WIDE"
            />
          </figure>
          <div v-show="(computedPlayerOption && !showLiveCloseMsg && !showDataWarning && showRemainingTime)"
               class="play_button"
          >
            <button
              v-if="isPlaying"
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
              v-if="!isNull(timeLimit) && !isNull(timeLimit.hours) && timeLimit.hours >= 0"
              class="copy time"
            >
              {{ timeLimit.formattedLimitTime() }}
            </strong>
            <strong
              v-else
              class="copy time"
            >
              00:00:00
            </strong>
          </div>
          <data-warning
            v-if="showDataWarning"
            @closeDataWarning="closeDataWarning"
            @playVideo="playVideo"
          />
          <div
            v-show="isPlaying"
            class="video_wrap"
          >
            <video-player
              ref="videoPlayer"
              playsinline
              :options="computedPlayerOption"
              @ready="onPlayerReadied"
              @play="logSendAndPlayVideo"
              @pause="onPlayerPause($event)"
            />
            <button
              type="button"
              class="btn_close"
              @click="closePlayer"
            >
              동영상 닫기
            </button>
            <p v-if="showLiveCloseMsg"
               class="live_close_msg"
            >
              생방송이<br>종료되었습니다.
            </p>
          </div>
          <figure v-show="!hasThingLiveInfo">
            <img
              src="~@/assets/images/common/img_noImage_wide.png"
              alt="현재 편성정보가 없습니다."
            >
          </figure>
        </div>
        <div
          v-if="hasThingLiveInfo"
          class="price_title"
          @click="thingLiveProductInfoClicked"
        >
          <ns-price
            :key="vodPricedcprice"
            :dc-price="vodPricedcprice"
            :dc-rate="vodSaleRate"
            :price="vodPriceofferprice"
            :mm-rntal-prc="vodMmRntalPrc"
            :prc-wave-disp="vodPrcWaveDisp"
            :buschn-id="vodBuschnId"
            :disp-type-cd="vodDispTypeCd"
          />
          <p class="title">
            {{ vodLiveGoodsNm }}
          </p>
        </div>
        <div v-if="hasThingLiveInfo" class="btn_group">
          <button
            v-if="checkIntangiblePrd(vodDispTypeCd)"
            type="button"
            class="btn_buy"
            @click="thingLiveAdviceProduct"
          >
            상담하기
          </button>
          <button
            v-else
            type="button"
            class="btn_buy"
            @click="gotoDetailOrStoreThing(commonIsMultiCode, dynamicPartNumber, bottomNaviValue, 'buyButton')"
          >
            구매하기
          </button>
        </div>
      </template>
      <!-- VOD 일때 -->
      <template v-else-if="viewGubun === 'VOD'">
        <div
          class="photo_wrap thinglive"
          :class="showDataWarning ? 'layer_open' : ''"
        >
          <figure
            v-if="!isPlaying"
            @click="gotoVodDetail(vodData.contentId)"
          >
            <ns-img
              v-if="!isNull(vodData.imgUrl)"
              :src="vodData.imgUrl"
              :alt="vodData.vodName"
              :is-adult="'N'"
              type="WIDE"
            />
            <ns-img
              v-else
              :src="vodData.vodMdImage"
              :alt="vodData.vodName"
              :is-adult="'N'"
              type="WIDE"
            />
          </figure>
          <div v-show="(computedPlayerOption && !showDataWarning)"
               class="play_button"
               style="z-index:1;"
          >
            <button
              v-if="isPlaying"
              type="button"
              @click="playVideo"
            >
              <span v-show="isPausedClass !== ''" :class="`icons_play`">재생</span>
            </button>
            <button
              v-else
              type="button"
              @click="openDataWarning"
            >
              <span :class="`icons_play`">재생</span>
            </button>
            <p
              v-show="!isPlaying && vodAllTime"
              class="copy time"
            >
              {{ vodAllTime }}
            </p>
            <strong
              v-show="isPlaying && isPausedClass === 'paused'"
              class="copy time"
            >
              재생
            </strong>
          </div>
          <data-warning
            v-if="showDataWarning"
            @closeDataWarning="closeDataWarning"
            @playVideo="playVideo"
          />
          <div v-if="computedPlayerOption"
               v-show="isPlaying"
               class="video_wrap"
          >
            <video-player
              ref="videoPlayer"
              playsinline
              :options="computedPlayerOption"
              :events="events"
              @ready="onPlayerReadied"
              @play="playVideo"
              @pause="onPlayerPause($event)"
              @loadedmetadata="onReadyMetadata"
            />
            <button
              type="button"
              class="btn_close"
              @click="closePlayer"
            >
              동영상 닫기
            </button>
          </div>
        </div>
        <!-- commonIsMultiCode 값에 따라 상품정보 분기 -->
        <div class="price_title"
             @click="gotoVodDetail(vodData.contentId)"
        >
          <template v-if="hasVodMainProduct">
            <ns-price
              :key="vodPricedcprice"
              :dc-price="vodPricedcprice"
              :dc-rate="vodSaleRate"
              :price="vodPriceofferprice"
              :mm-rntal-prc="vodMmRntalPrc"
              :prc-wave-disp="vodPrcWaveDisp"
              :buschn-id="vodBuschnId"
              :disp-type-cd="vodDispTypeCd"
            />
          </template>
          <p class="title">
            {{ vodName }}
          </p>
        </div>
        <div v-if="hasVodMainProduct" class="btn_group">
          <button
            v-if="checkIntangiblePrd(vodDispTypeCd)"
            type="button"
            class="btn_buy"
            @click="gotoVodDetail(vodData.contentId)"
          >
            상담하기
          </button>
          <button
            v-else
            type="button"
            class="btn_buy"
            @click="gotoVodDetail(vodData.contentId)"
          >
            구매하기
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  isNull,
  htmlDecode,
  getImageUrl,
  isOsApp,
  isiOS
} from '@utils/commonutil/commonUtil'
import {
  getDateParse,
  calcDate,
  getDateParse02
} from '@frameworks/dateutil/dateUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import CONST from '@constants/framework/framework'
import TVLIVE_CONST from '@/common/constants/media/tvlive'
import DataWarning from '@/components/product/DataWarning'
import CommonTimer from '@/common/classes/CommonTimer'
import popupUtil from '@frameworks/popupUtil'
import { mapState, mapMutations } from 'vuex'
import bizUtil from '@utils/bizUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import anchorMixin from '@/mixins/store/home/anchorMixin'
import consultationMixin from '@/mixins/product/consultationMixin'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import loginUtil from '@utils/loginUtil'
import nativeUtil from '@frameworks/nativeUtil'
import mediaUtil from '@utils/mediaUtil'

export default {
  name: 'LiveSectionAll',
  components: {
    DataWarning,
    NsImg,
    NsPrice
  },
  mixins: [
    anchorMixin,
    consultationMixin
  ],
  props: {
    whatContents: {
      type: String,
      default: null
    },
    bottomNaviValue: {
      type: Object,
      default: null
    },
    bottomNaviIndex: {
      type: Number,
      default: null
    },
    liveFullData: {
      type: Object,
      default: null
    },
    videoStopKey: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {

      events: ['loadedmetadata'], // 비디오 플레이어 이벤트 추가.
      dynamicPartNumber: '', // 동적 제어를 위한 상품번호
      goodsName: '', // 상품명
      tvLivePrice: '', // TV 라이브 상품 할인전 가격
      tvSaleRate: '', // TV 라이브 상품 할인율
      tvDcPrice: '', // TV 라이브 상품 할인 가격
      tvPrcWaveDisp: '', // 복수 옵션인데 가격이 동일하지 않을 경우 물결표시
      tvLiveImage: '', // TV 라이브 상품 이미지
      tvDlvrPrice: '', // TV 라이브 무료배송 여부
      tvIfiValue: '', // TV 라이브 무이자 여부
      tvPadValue: '', // TV 라이브 적립금 여부
      tvDispTypeCd: '', // 전시타입코드
      tvMmRntalPrc: '', // 월 렌탈료
      multiCd: '', // 추후 반영을 위한 임시 변수
      busChnId: '', // 버스 채널 id
      showRemainingTime: true, // 남은시간 보임 여부
      isPlaying: false, // 현재 재생중 여부
      isPausedClass: '', // 정지버튼 보임 여부
      showDataWarning: false, // 데이터경고창 열기
      playReloadKey: 0, // 재생중 종료시 플레이어 다시 렌더링하기 위한 key

      totalOrgan: {}, // tv나 샵플러스 데이터 저장.
      thingLiveData: {}, // 띵라이브 데이터 저장.
      hasTvInfoNow: true, // 현재 편성정보가 있는지 체크 - TV LIVE
      hasThingLiveInfoNow: true, // 현재 편성정보가 있는지 체크 - Thing Live
      hasShopPlusInfoNow: true, // 현재 편성정보가 있는지 체크 - 샵플러스

      thingLiveVideoUrl: '', // 띵라이브 동영상 url
      vodPlayGubun: '', // 띵라이브 - PLAY_GUBUN : 'VIDEO':예고, 'LIVE':라이브
      hasThingLiveInfo: false, // 띵라이브 편성정보 유무.
      vodLiveGoodsNm: '', // vod 상품명
      vodSaleRate: '', // vod 할인율
      vodPricedcprice: '', // vod 할인가
      vodPriceofferprice: '', // vod 판매가
      vodPrcWaveDisp: '', // 복수옵션 다른 가격이 있을때 물결표시
      vodId: false, // 영상이 vod일때 vodId 저장.
      vodAllTime: false, // vod 전체시간
      commonIsMultiCode: false, // 복수상품 여부
      timeLimitTv: null, // TV쇼핑 타이머 객체
      timeLimitShop: null, // Shop+ 타이머 객체
      timeLimit: null, // Thing Live 라이브, 예고방송 타이머 객체
      RelatedPrdtSize: 0, // 연관상품 건수
      livePlay: null, // 띵라이브 라이브 재생시 로그 적재용 객체
      vodData: null, // 띵라이브 VOD 데이터
      hasVodMainProduct: false, // 띵라이브 vod 상품 존재 여부
      vodMainProduct: null, // vod 메인 상품
      vodName: '', // vod 명
      viewGubun: '', // 라이브 ,VOD 여부
      vodMmRntalPrc: '', // vod 상품 월 렌탈료
      vodBuschnId: '', // vod 버스 채널 id
      vodDispTypeCd: '', // vod 전시타입코드
      retryingInterval: false, // 인터벌 객체
      shopPlusTimeoutFlag: false, // 샵플러스 시간 종료 플래그
      tvTimeoutFlag: false, // TV쇼핑 시간 종료 플래그
      firstRetryTv: false, // tv live api 재조회 첫시도 인지 여부.
      firstRetryDataUpdateTv: false, // api 첫 재조회때 tv live 데이터 갱신한 여부.
      firstRetryShop: false, // shop+ api 재조회 첫시도 인지 여부.
      firstRetryDataUpdateShop: false, // api 첫 재조회때 shop+ 데이터 갱신한 여부.
      dataUpdatingTv: false, // TV Live 데이터 갱신중 여부.
      dataUpdatingShop: false, // Shop+ 데이터 갱신중 여부.
      computedPlayerOption: false, // 플레이어 옵션 객체
      isCompleteSetPlayerOption: false // 플레이어 옵션 객체 설정 완료 여부
    }
  },
  watch: {
    timeLimitTv: { // NS Live 타이머 감시
      deep: true,
      handler (newObject) {
        if (this.tvTimeoutFlag) { return false }
        this.tvTimeoutFlag = true
        if (!isNull(newObject) && newObject.hours === 0 && newObject.minutes === 0 && newObject.seconds === 0) {
          if (!this.retryingInterval) {
            this.dataUpdatingTv = true
            setTimeout(() => {
              this.firstRetryTv = true
              this.retryApiCall()
              if (this.firstRetryDataUpdateTv) {
                this.firstRetryTv = false
                this.firstRetryDataUpdateTv = false
                return false
              }
              this.firstRetryTv = false
              this.retryingInterval = setInterval(() => {
                this.retryApiCall()
              }, 10000)
            }, 100)
          }
        }
        setTimeout(() => { this.tvTimeoutFlag = false }, 3000)
      }
    },
    timeLimitShop: { // Shop+ 타이머 감시
      deep: true,
      handler (newObject) {
        if (this.shopPlusTimeoutFlag) { return false }
        this.shopPlusTimeoutFlag = true
        if (!isNull(newObject) && newObject.hours === 0 && newObject.minutes === 0 && newObject.seconds === 0) {
          if (!this.retryingInterval) {
            this.dataUpdatingShop = true
            setTimeout(() => {
              this.firstRetryShop = true
              this.retryApiCall()
              if (this.firstRetryDataUpdateShop) {
                this.firstRetryShop = false
                this.firstRetryDataUpdateShop = false
                return false
              }
              this.firstRetryShop = false
              this.retryingInterval = setInterval(() => {
                this.retryApiCall()
              }, 10000)
            }, 2000)
          }
        }
        setTimeout(() => { this.shopPlusTimeoutFlag = false }, 3000)
      }
    },
    timeLimit: {
      deep: true,
      handler (newObject) {
        if (!isNull(newObject) && newObject.hours === 0 && newObject.minutes === 0 && newObject.seconds === 0) {
          setTimeout(() => { this.retryApiCall() }, 10000)
        }
      }
    },
    videoStopKey: {
      handler () {
        this.onPlayerPause()
      }
    }
  },
  computed: {
    ...mapState('layouts', ['nsLive']),
    /**
     * 방송 남은 시간 null 체크.
     * @returns {bool}
     */
    showLiveCloseMsg () {
      if (this.isTv) {
        return isNull(this.timeLimitTv)
      } else if (this.isShopPlus) {
        return isNull(this.timeLimitShop)
      } else {
        return isNull(this.timeLimit)
      }
    },
    /**
     * tv 데이터 체크후 bool 반환
     * @returns {bool}
     */
    tvLiveDataCheck () {
      const parentsData = this.liveFullData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo
      return !isNull(parentsData.TotalOrgan) && parentsData.TotalOrgan.length
    },
    /**
     * 샵플러스 데이터 체크후 bool 반환
     * @returns {bool}
     */
    shopPlusDataCheck () {
      const parentsData = this.liveFullData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS[0].TotalOrgan
      return parentsData.length > 0
    },
    /**
     * 템플릿 분기를 위한 컴포넌트 검사 - tv live와 샵플러스는 같은 템플릿 사용.
     * @returns {bool}
     */
    isTvOrShopPlus () {
      const outerIndex = this.bottomNaviIndex
      const NS_LIVE = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].NS_LIVE
      const SHOP_PLUS = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].SHOP_PLUS
      const nowComponent = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex][this.whatContents]
      return nowComponent === NS_LIVE || nowComponent === SHOP_PLUS
    },
    /**
     * 템플릿, 프로세스 분기를 위한 컴포넌트 검사 - 띵라이브 인지 체크.
     * @returns {bool}
     */
    isThingLive () {
      const outerIndex = this.bottomNaviIndex
      const THING_LIVE = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].THING_LIVE
      const nowComponent = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex][this.whatContents]
      return nowComponent === THING_LIVE
    },
    /**
     * 프로세스 분기를 위한 컴포넌트 검사 - tv데이터와 샵플러스 데이터 값이 다르므로 메소드를 나눠야함.
     * @returns {bool}
     */
    isTv () {
      const outerIndex = this.bottomNaviIndex
      const NS_LIVE = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].NS_LIVE
      const nowComponent = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex][this.whatContents]
      return nowComponent === NS_LIVE
    },
    /**
     * 프로세스 분기를 위한 컴포넌트 검사 - tv데이터와 샵플러스 데이터 값이 다르므로 메소드를 나눠야함.
     * @returns {bool}
     */
    isShopPlus () {
      const outerIndex = this.bottomNaviIndex
      const SHOP_PLUS = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].SHOP_PLUS
      const nowComponent = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex][this.whatContents]
      return nowComponent === SHOP_PLUS
    }
  },
  created () {
    this.getGlobalInfo()
    this.onLoad()
  },
  beforeDestroy () {
    if (this.retryingInterval) { clearInterval(this.retryingInterval) }
    if (this.timeLimitTv) { this.timeLimitTv.stopTimer() }
    if (this.timeLimitShop) { this.timeLimitShop.stopTimer() }
    if (this.timeLimit) { this.timeLimit.stopTimer() }
  },
  deactivated () {
    if (this.retryingInterval) { clearInterval(this.retryingInterval) }
  },
  methods: {
    isNull,
    isiOS,
    ...mapMutations('layouts', ['toggleLive']),
    /**
     * 편성표 눌렀을때 로깅.
     * @param {Object} bottomNaviValue - 매체 구분 오브젝트.
     */
    scheduleLogging (bottomNaviValue) {
      const identifyKey = Object.keys(bottomNaviValue).toString()
      if (identifyKey === 'NS_LIVE') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_공통영역',
            eventAction: 'GNB_편성표/전체보기',
            eventLabel: 'NSLIVE_편성표',
            params: {
              t1: null
            }
          }
        })
        if (isOsApp()) { // APP
          const params = { toggleActive: 'tv' }
          nativeUtil.goScheduleHome(JSON.stringify(params))
        } else {
          if (this.$route.path.indexOf('/media/schedule/tv') > -1) {
            this.$emit('close')
            return false
          } else {
            this.$router.push({ path: '/media/schedule/tv', params: { toggleActive: '' } })
            this.$emit('close')
          }
        }
      } else if (identifyKey === 'SHOP_PLUS') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_공통영역',
            eventAction: 'GNB_편성표/전체보기',
            eventLabel: 'Shop+_편성표',
            params: {
              t1: null
            }
          }
        })
        if (isOsApp()) { // APP
          const params = { toggleActive: 'shop' }
          nativeUtil.goScheduleHome(JSON.stringify(params))
        } else {
          if (this.$route.path.indexOf('/media/schedule/shopplus') > -1) {
            this.$emit('close')
            return false
          } else {
            this.$router.push({ path: '/media/schedule/shopplus', params: { toggleActive: 'active' } })
            this.$emit('close')
          }
        }
      }
    },
    /**
     * 띵라이브 로깅
     */
    thingLiveLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: 'GNB_편성표/전체보기',
          eventLabel: '띵라이브_전체보기',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * Life Cycle: created() 호출될 때, 순차적 흐름이 필요한 메소드 모음.
     */
    onLoad () {
      this.initTvLiveData()
      const totalOrgan = []
      if (this.isTv || this.isShopPlus) {
        if (isNull(this.totalOrgan)) {
          this.hasTvInfoNow = false
          return false
        } else {
          totalOrgan.push(this.totalOrgan)
          this.setONAIRarea(totalOrgan)
        }
      }
    },
    /**
     * 라이브데이터 초기화.
     */
    initTvLiveData () {
      this.goodsName = ''
      this.tvLivePrice = ''
      this.tvLiveImage = ''
      this.tvDlvrPrice = false
      this.tvIfiValue = false
      this.tvPadValue = false
    },
    /**
     * TV 방송중상품 셋팅
     * @param {Array} TotalOrgan - 생방송 데이터
     */
    setONAIRarea (TotalOrgan) {
      if (TotalOrgan.length === 0) {
        return
      }
      if (this.isShopPlus) {
        this.commonIsMultiCode = this.shopDataLength > 1
      } else if (this.isTv) {
        this.commonIsMultiCode = Number(TotalOrgan.length + this.RelatedPrdtSize) > 1
      }
      const idx = this.getCurrentLiveItem(TotalOrgan)
      if (idx < 0) {
        return false
      }

      const objTotalOrganF = TotalOrgan[0]
      this.goodsName = htmlDecode(objTotalOrganF.goodsName)

      this.tvLivePrice = objTotalOrganF.priceofferprice // 일반 판매가. (할인전 가격)
      this.tvSaleRate = objTotalOrganF.saleRate // 할인율
      this.tvDcPrice = objTotalOrganF.pricedcprice // 할인가격.
      this.tvDlvrPrice = Number(objTotalOrganF.dlvrPrice) === 0
      this.tvIfiValue = Number(objTotalOrganF.ifiValue) > 0
      this.tvPadValue = Number(objTotalOrganF.padValue) !== 0

      this.tvLiveImage = getImageUrl(objTotalOrganF.partNumber, 640, 320, objTotalOrganF.adultItemFlag) // 'N'

      this.dynamicPartNumber = objTotalOrganF.partNumber

      this.multiCd = objTotalOrganF.multiCd
      this.busChnId = objTotalOrganF.busChnId
      this.tvPrcWaveDisp = objTotalOrganF.prcWaveDisp

      this.tvDispTypeCd = objTotalOrganF.dispTypeCd
      this.tvMmRntalPrc = objTotalOrganF.mmRntalPrc
    },
    /**
     * 현재 방송중인 TV LIVE 아이템 정보 호출.
     * @param {Object} data - 방송 Live 데이터.
     * @returns {Number}
     */
    getCurrentLiveItem (data) {
      let idx = -1
      try {
        const msecPerMinute = 1000 * 60
        const msecPerHour = msecPerMinute * 60
        const currentTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        const outerIndex = this.bottomNaviIndex
        const NS_LIVE = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].NS_LIVE
        const SHOP_PLUS = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].SHOP_PLUS
        const nowComponent = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex][this.whatContents]
        for (let i = 0; i < data.length; i++) {
          let etime = ''
          if (nowComponent === NS_LIVE) {
            etime = getDateParse02(data[i].endDttm)
          } else if (nowComponent === SHOP_PLUS) {
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
          if (this.isTv) {
            this.timeLimitTv = new CommonTimer()
            this.timeLimitTv.setTimerOptions(timerParam)
            this.timeLimitTv.startTimer()
          } else if (this.isShopPlus) {
            this.timeLimitShop = new CommonTimer()
            this.timeLimitShop.setTimerOptions(timerParam)
            this.timeLimitShop.startTimer()
          } else {
            this.timeLimit = new CommonTimer()
            this.timeLimit.setTimerOptions(timerParam)
            this.timeLimit.startTimer()
          }
        }
      } catch (e) {
        idx = -1
      }

      return idx
    },
    /**
     * 라이브 데이터 바인딩.
     */
    getGlobalInfo () {
      const outerIndex = this.bottomNaviIndex
      const NS_LIVE = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].NS_LIVE
      const SHOP_PLUS = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].SHOP_PLUS
      const THING_LIVE = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex].THING_LIVE
      const nowComponent = TVLIVE_CONST.TV_LIVE_ALL_LIST[outerIndex][this.whatContents]
      if (nowComponent === NS_LIVE) {
        const keyCheck = this.liveFullData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo
        if (!isNull(keyCheck.TotalOrgan)) {
          this.totalOrgan = keyCheck.TotalOrgan[0]
          this.RelatedPrdtSize = Number(keyCheck.RelatedPrdtSize)
        }
      } else if (nowComponent === SHOP_PLUS) {
        this.totalOrgan = this.liveFullData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS[0].TotalOrgan[0]
        this.shopDataLength = this.liveFullData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS[0].TotalOrgan.length
      } else if (nowComponent === THING_LIVE) {
        this.thingLiveData = this.liveFullData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._VODINFO[0]
      }
      this.setComputedPlayerOption()
    },
    /**
     * 데이터경고창 열기
     *
     */
    openDataWarning () {
      this.showDataWarning = true
    },
    /**
     * 데이터경고창 닫기
     *
     */
    closeDataWarning () {
      this.showDataWarning = false
    },
    /**
     * 동영상 준비완료
     *
     */
    onPlayerReadied () {
      this.showRemainingTime = true
      const playerObject = this.$refs.videoPlayer.player
      if (isiOS()) {
        playerObject.addClass('ios')
      } else {
        playerObject.addClass('android')
      }
      /**
       * ios 화면비 틀어짐 이슈 대응로직
       * 전체화면 후 돌아왔을때 늘려놓은 화면비(와이드)에서 원본 비율(4:3)로 되돌아오는 문제 대응.
       */
      playerObject.on('fullscreenchange', function () {
        setTimeout(() => {
          const techIdFront = this.id_
          const techId = `${techIdFront}_html5_api`
          const vjsTechElement = document.querySelectorAll(`#${techId}`)[0]
          if (this.isFullscreen()) {
            this.addClass('vjs-fullscreen')
            if (isiOS()) {
              if (vjsTechElement.style.objectFit !== 'contain') {
                vjsTechElement.style.objectFit = 'contain'
              }
            }
          } else {
            this.removeClass('vjs-fullscreen')
            if (isiOS()) {
              if (vjsTechElement.style.objectFit !== 'fill') {
                vjsTechElement.style.objectFit = 'fill'
              }
            }
          }
        }, 500)
      })
    },
    /**
     * 일시정지
     *
     */
    onPlayerPause () {
      this.showRemainingTime = true
      this.isPausedClass = 'paused'
      const player = !isNull(this.$refs?.videoPlayer?.player) ? this.$refs.videoPlayer.player : null
      if (!isNull(player)) { this.$refs.videoPlayer.player.pause() }
    },
    /**
     * 재생버튼 클릭
     */
    onPlayerPlay () {
      this.isPausedClass = ''
      this.showRemainingTime = false
      this.isPlaying = true
    },
    /**
     * 비디오 재생 로그 적재
     * @returns {void}
     */
    setPlayLog () {
      const param = {
        vodLiveId: this.livePlay.vodLiveId,
        viewGubun: 'VODLIVE',
        memberId: loginUtil.custNum(),
        gubun: this.livePlay.logType
      }

      this.$nsaxios.post('NSThingLiveCmd', param)
    },

    /**
     * 팅라이브 재생시 로그 적재 후 재생.
     *
     */
    logSendAndPlayVideo () {
      this.isPausedClass = ''
      this.showRemainingTime = false
      this.showDataWarning = false
      this.isPlaying = true
      this.setPlayLog()
      this.$refs.videoPlayer.player.play()
    },
    /**
     * 재생
     *
     */
    playVideo () {
      this.isPausedClass = ''
      this.showRemainingTime = false
      this.showDataWarning = false
      this.isPlaying = true
      this.$refs.videoPlayer.player.play()

      const identify = this.whatContents
      let eventLabel = ''
      if (identify === 'THING_LIVE') {
        eventLabel = '띵라이브_재생'
      } else if (identify === 'NS_LIVE') {
        eventLabel = 'NSLIVE_재생'
      } else {
        eventLabel = 'Shop+_재생'
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: 'GNB_방송재생',
          eventLabel,
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 동영상 닫기
     *
     */
    closePlayer () {
      this.isPlaying = false
      this.playReloadKey++
    },
    /**
     * getImageUrl 공통함수 호출.
     * @param {String} partNumber - 상품코드
     * @param {String} adultItemFlag - 성인 상품 유무
     * @returns {String}
     */
    getImageUrl (partNumber, adultItemFlag) {
      return getImageUrl(partNumber, 640, 320, adultItemFlag)
    },
    /**
     * html decode 공통함수 호출.
     * @param {String} itncatentrynm - 대상 문자열
     * @returns {String}
     */
    htmlDecode (itncatentrynm) {
      return htmlDecode(itncatentrynm)
    },
    /**
     * 띵라이브 방송 영역 데이터 셋팅
     * @param {Object} tingLiveInfo - 띵라이브 데이터
     * @returns {bool} true
     */
    setTingLiveArea (tingLiveInfo) {
      const onAirInfo = tingLiveInfo
      const viewGubun = onAirInfo.viewGubun
      // 동영상 영역 세팅
      this.livePlay = tingLiveInfo

      // 'VIDEO':예고, 'LIVE':라이브
      if (this.livePlay.vodPlayGubun === 'LIVE') {
        this.livePlay.mediaType = 'application/x-mpegURL'
        this.livePlay.remainingDttm = this.livePlay.vodLiveEndDttm // 라이브 방송 종료시간 (YYYYMMDDhhmmss)
        this.livePlay.vodVideoUrl = CONST.LIVE.url.thinglive
        this.livePlay.logType = '2' // 로그 적재용 구분값 - 1 : 예고 , 2 : 본방
      } else {
        this.livePlay.remainingDttm = this.livePlay.vodLiveStartDttm
        this.livePlay.mediaType = 'video/mp4'
        this.livePlay.logType = '1' // 로그 적재용 구분값 - 1 : 예고 , 2 : 본방
      }
      let objTotalOrganF = null
      let videoUrl = ''
      this.viewGubun = tingLiveInfo.viewGubun
      if (tingLiveInfo.viewGubun === 'VODLIVE') { // 띵라이브에서 라이브 영상 일때
        const data = onAirInfo._VODLIVE[0]
        const vodLiveStartDttm = data.vodLiveStartDttm
        const vodLiveEndDttm = data.vodLiveEndDttm
        const vodLiveGoodsNm = data.vodLiveGoodsNm
        const vodPlayGubun = data.vodPlayGubun
        const vodVideoUrl = data.vodVideoUrl
        this.vodLiveGoodsNm = vodLiveGoodsNm
        let endTime = ''
        if (vodPlayGubun === 'LIVE') {
          endTime = vodLiveEndDttm
          videoUrl = CONST.LIVE.url.thinglive
        } else {
          endTime = vodLiveStartDttm
          videoUrl = vodVideoUrl
        }
        const idxParam = [
          { endDttm: endTime }
        ]
        const idx = this.getCurrentLiveItem(idxParam)
        if (idx < 0) {
          return false
        }
        this.vodPlayGubun = vodPlayGubun

        objTotalOrganF = data._vod_main_product[0]
      } else { // 띵라이브에서 라이브가 아닌 영상 일때
        const vodData = onAirInfo._VOD.root

        videoUrl = vodData._vod_banner[0].vodPath.replace(/http/gi, 'https')
        this.vodId = vodData._vod_banner[0].vodId
        this.vodData = vodData._vod_banner[0]
        this.vodName = vodData._vod_banner[0].vodName
        this.commonIsMultiCode = (vodData._vod_main_product.length + vodData._vod_relation_product.length) > 1
        const vodMainProductArray = vodData._vod_main_product
        vodMainProductArray.some((element, index) => {
          if (!isNull(element)) {
            this.vodMainProduct = element
            this.totalOrgan = this.vodMainProduct
            this.vodSaleRate = this.vodMainProduct.dcRate // saleRate
            this.vodPricedcprice = this.vodMainProduct.dcPrice // pricedcprice
            this.vodPriceofferprice = this.vodMainProduct.price // priceofferprice
            this.vodPrcWaveDisp = this.vodMainProduct.prcWaveDisp
            this.dynamicPartNumber = this.vodMainProduct.partnumber
            this.vodMmRntalPrc = this.vodMainProduct.mmRntalPrc
            this.vodBuschnId = this.vodMainProduct.buschnId
            this.vodDispTypeCd = this.vodMainProduct.dispTypeCd
            this.hasVodMainProduct = true
          }
          return !isNull(element.partnumber)
        })
      }
      this.thingLiveVideoUrl = videoUrl
      if (viewGubun !== 'VOD') {
        const liveData = onAirInfo._VODLIVE[0]
        const mainAndRelatedProductLength = liveData._vod_main_product.length + liveData._vod_relation_product.length
        const isMultiCode = mainAndRelatedProductLength > 1 // Multicode 판별 여부
        this.commonIsMultiCode = isMultiCode
        if (objTotalOrganF) {
          this.vodSaleRate = objTotalOrganF.dcRate // saleRate
          this.vodPricedcprice = objTotalOrganF.dcPrice // pricedcprice
          this.vodPriceofferprice = objTotalOrganF.price // priceofferprice
          this.vodPrcWaveDisp = objTotalOrganF.prcWaveDisp
          this.dynamicPartNumber = objTotalOrganF.partnumber // objTotalOrganF.partNumber
          this.vodMmRntalPrc = objTotalOrganF.mmRntalPrc
          this.vodBuschnId = objTotalOrganF.buschnId
          this.vodDispTypeCd = objTotalOrganF.dispTypeCd
        }
        this.totalOrgan = objTotalOrganF
      }
      this.hasThingLiveInfo = true
      return true
    },
    /**
     * 무형상품 체크
     * @param {String} dispCd - 전시 타입 코드
     * @returns {bool}
     */
    checkIntangiblePrd (dispCd) {
      const intangiblePrd = [
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_INSURANCE,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_FUNERAL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_ADVERTISEMENT
      ]
      let returnFlag = false
      if (intangiblePrd.includes(dispCd)) {
        returnFlag = true
      }
      return returnFlag
    },
    /**
     * tv live UI 상에서 한글 이름 반환
     * @param {Object} param - tv 판단 유무 파라메터
     * @param {Number} index - 인덱스
     * @returns {String}
     */
    getTvLiveLabel (param, index) {
      const label = Object.keys(param)
      return TVLIVE_CONST.TV_LIVE_ALL_LIST[index][label]
    },
    /**
     * 상품갯수가 단일일경우: 상품상세페이지로 이동. 여러개일경우: 홈브릿지 페이지로 이동.
     * @param {String} commonIsMultiCode - 단일, 복수 판단
     * @param {String} partNumber - 상품코드
     * @param {String} bottomNaviValue - 매체 구분자
     * @param {String} flag - 바로구매 여부.
     * @param {bool} onlyDetailFlag - 상품명 및 가격 눌렀을때는 무조건 상품상세 페이지로감.
     */
    gotoDetailOrBridge (commonIsMultiCode, partNumber, bottomNaviValue, flag, onlyDetailFlag = false) {
      // 마케팅 스크립트 적용 부분
      // GA360
      if (flag === 'buyButton') {
        const identifyKey = Object.keys(bottomNaviValue).toString()
        if (identifyKey === 'NS_LIVE') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_공통영역',
              eventAction: 'GNB_구매하기',
              eventLabel: 'NSLIVE_구매하기',
              params: {
                t1: null
              }
            }
          })
        } else if (identifyKey === 'SHOP_PLUS') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_공통영역',
              eventAction: 'GNB_구매하기',
              eventLabel: 'Shop+_구매하기',
              params: {
                t1: null
              }
            }
          })
        }
      }
      if (isNull(partNumber)) { return false }
      let startTime = ''
      let endTime = ''
      let identify = ''
      if (this.isTv) {
        identify = 'tv'
        startTime = this.totalOrgan.startDttm
        endTime = this.totalOrgan.endDttm
      } else if (this.isShopPlus) {
        identify = 'shopPlus'
        startTime = getDateParse(this.totalOrgan.time.split('~')[0])
        endTime = getDateParse(this.totalOrgan.time.split('~')[1])
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
        this.$emit('close')
      }
    },
    /**
     * 상품갯수가 단일일경우: 상품상세페이지로 이동. 여러개일경우: 띵라이브 페이지로 이동.
     * @param {String} commonIsMultiCode - 단일, 복수 판단
     * @param {String} partNumber - 상품코드
     * @param {String} bottomNaviValue - 매체 구분자
     * @param {String} flag - 바로구매 버튼 구분자
     */
    gotoDetailOrStoreThing (commonIsMultiCode, partNumber, bottomNaviValue, flag) {
      if (isNull(partNumber)) { return false }

      if (flag === 'buyButton') {
        // 마케팅 스크립트 적용 부분
      // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_공통영역',
            eventAction: 'GNB_구매하기',
            eventLabel: '띵라이브_구매하기',
            params: {
              t1: null
            }
          }
        })
      }

      if (commonIsMultiCode) {
        this.$router.push({ name: 'thinglive' })
        this.$emit('close')
      } else {
        bizUtil.gotoProductDetail(partNumber)
        this.$emit('close')
      }
    },
    /**
     * VOD 상세 페이지로 이동.
     * @param {String} invokeContentId - 컨텐츠 번호.
     */
    async gotoVodDetail (invokeContentId) {
      const contentId = !isNull(invokeContentId) ? invokeContentId : 0
      this.$router.push({
        name: 'thingliveVodDetail',
        params: {
          contentId,
          vodId: this.vodId
        }
      })
      this.$emit('close')
    },
    /**
     * vodId로 contentId 조회.
     */
    async getVodContentId () {
      const vodId = this.vodId
      const apiData = await this.$nsaxios.post(
        'NSFixedShopCmd',
        { espotInfo: 'EZ_THING_LIVE_VODPGMCATE|CATEVOD_VODPGMCATE|1|9999|0' },
        null
      )
      let contentId = 0
      const vodPgmCateChecker =
        !isNull(apiData) &&
        !isNull(apiData.msg) &&
        !isNull(apiData.msg.espotList) &&
        apiData.msg.espotList.length &&
        !isNull(apiData.msg.espotList[0]._EZ_THING_LIVE_VODPGMCATE) &&
        apiData.msg.espotList[0]._EZ_THING_LIVE_VODPGMCATE.length &&
        !isNull(apiData.msg.espotList[0]._EZ_THING_LIVE_VODPGMCATE[0].categoryId)
      const bestCateId = vodPgmCateChecker ? apiData.msg.espotList[0]._EZ_THING_LIVE_VODPGMCATE[0].categoryId : false
      const vodPgmListChecker =
        bestCateId &&
        !isNull(apiData) &&
        !isNull(apiData.msg) &&
        !isNull(apiData.msg.espotList) &&
        apiData.msg.espotList.length &&
        !isNull(apiData.msg.espotList[0][`_${bestCateId}_FIXED_CATEVOD_VODPGMLIST`]) &&
        apiData.msg.espotList[0][`_${bestCateId}_FIXED_CATEVOD_VODPGMLIST`].length
      if (vodPgmListChecker) {
        const vodPgmList = apiData.msg.espotList[0][`_${bestCateId}_FIXED_CATEVOD_VODPGMLIST`]
        vodPgmList.forEach(element => {
          if (element.vodId === vodId) {
            contentId = element.contentId
          }
        })
      }
      return contentId
    },
    /**
     * 상품상세 API 조회후, 단일 코드이면, 상담하기 페이지로 이동, 복수 코드이면 홈 브릿지로 이동.
     * @param partNumber - 상품코드
     */
    setAdviceParam (partNumber) {
      if (this.commonIsMultiCode) {
        let startTime = ''
        let endTime = ''
        let identify = ''
        if (this.isTv) {
          identify = 'tv'
          startTime = this.totalOrgan.startDttm
          endTime = this.totalOrgan.endDttm
        } else if (this.isShopPlus) {
          identify = 'shopPlus'
          startTime = getDateParse(this.totalOrgan.time.split('~')[0])
          endTime = getDateParse(this.totalOrgan.time.split('~')[1])
        }
        const params = {
          identify,
          goodId: partNumber,
          startdtm: startTime,
          enddtm: endTime
        }
        popupUtil.show('store/HomeBridge', params, null, false)
      } else {
        this.moveConsultationRequest(partNumber)
      }
    },
    /**
     * 띵라이브에서 구매하기, 상담하기를 제외한 상품정보를 클릭 했을경우, 띵라이브 매장으로 랜딩함.
     */
    thingLiveProductInfoClicked () {
      this.$router.push({ name: 'thinglive' })
      this.$emit('close')
    },
    /**
     * 띵라이브 데이터중 상담상품일 경우 복수상품 여부에 따른 랜딩 분기.
     */
    thingLiveAdviceProduct () {
      const commonIsMultiCode = this.commonIsMultiCode
      const dynamicPartNumber = this.dynamicPartNumber
      if (commonIsMultiCode) {
        this.$router.push({ name: 'thinglive' })
        this.$emit('close')
      } else {
        this.moveConsultationRequest(dynamicPartNumber)
      }
    },
    /**
     * Live 여부에 따른 bool 반환 - NS Live, Shop+ 는 영상정보로 판단, 띵라이브는 특정값으로 판단.
     * @param {*} param - null 체크 할 타겟.
     * @returns {bool}
     */
    liveIconCheck (param) {
      if (this.isTv || this.isShopPlus) {
        return this.computedPlayerOption
      } else {
        return String(param) === 'LIVE'
      }
    },
    /**
     * 기존 TV Live 또는 shop+ 데이터에서 시간이 00:00:00가 되면 방송정보 갱신을 위해 호출
     */
    async retryApiCall () {
      if (this.isTv) {
        this.timeLimitTv = null
      } else if (this.isShopPlus) {
        this.timeLimitShop = null
      } else {
        this.timeLimit = null
      }
      const commandName = TVLIVE_CONST.PARAMETERS.COMMAND_NAME
      const parameters = {
        targetEspotId: TVLIVE_CONST.PARAMETERS.TARGET_ESPOT_ID,
        categoryId: TVLIVE_CONST.PARAMETERS.CATEGORY_ID,
        gubun: this.isTv ? TVLIVE_CONST.PARAMETERS.TV : this.isShopPlus ? TVLIVE_CONST.PARAMETERS.SHOPPLUS : TVLIVE_CONST.PARAMETERS.THINGLIVE
      }
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      this.nowAndNewDataCheck(apiData)
    },
    /**
     * 현재 방송 데이터와 00:00:00가 되어 새로 조회해온 데이터 체크후 방송 종료 시간이 같으면 false, 다르면 true 반환.
     * @param {Object} apiData - 새로 조회해온 데이터.
     * @returns {bool}
     */
    nowAndNewDataCheck (apiData) {
      if (isNull(apiData.msg) || isNull(apiData.msg[0]) || isNull(apiData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE)) { return false }
      let prevEndTime = ''
      let newEndTime = ''
      if (this.isTv) {
        if (this.nsLiveValidator(apiData)) {
          prevEndTime = this.totalOrgan.endDttm
          newEndTime = apiData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan[0].endDttm
          if (prevEndTime !== newEndTime) {
            if (this.firstRetryTv) { this.firstRetryDataUpdateTv = true }
            clearInterval(this.retryingInterval)
            this.retryingInterval = false
            this.$emit('update', 'isTv', apiData)
            this.dataUpdatingTv = false
          }
        }
      } else if (this.isShopPlus) {
        if (this.shopPlusValidator(apiData)) {
          prevEndTime = getDateParse(this.totalOrgan.time.split('~')[1]).getTime()
          newEndTime = getDateParse(apiData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS[0].TotalOrgan[0].time.split('~')[1]).getTime()
          if (prevEndTime !== newEndTime) {
            if (this.firstRetryShop) { this.firstRetryDataUpdateShop = true }
            clearInterval(this.retryingInterval)
            this.retryingInterval = false
            this.$emit('update', 'isShopPlus', apiData)
            this.dataUpdatingShop = false
          }
        }
      } else if (this.isThingLive) {
        if (!isNull(apiData)) {
          this.$emit('update', 'isThinglive', apiData)
        }
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
          !isNull(data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE) &&
          (data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE.length) &&
          !isNull(data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._TV) &&
          (data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._TV.length) &&
          !isNull(data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan) &&
          (data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan.length)
        return checker
      }
      return false
    },
    /**
     * Shop+ 응답 데이터 정상유무 와 편성정보 유무.
     * @param {Object} data
     * @returns {bool}
     */
    shopPlusValidator (data) {
      if (!isNull(data)) {
        const checker =
          !isNull(data.msg) &&
          (data.msg.length) &&
          !isNull(data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE) &&
          (data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE.length) &&
          !isNull(data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS) &&
          (data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS.length) &&
          !isNull(data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS[0].TotalOrgan) &&
          (data.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._SHOPPLUS[0].TotalOrgan.length)
        return checker
      }
      return false
    },
    /**
     * vod 전체 재생시간 설정.
     */
    setVodAllTime () {
      const duration = this.$refs.videoPlayer.player.duration()
      this.vodAllTime = mediaUtil.setDurationTimeForm(duration, false)
    },
    /**
     * 메타 데이터가 로드 되었을때 실행할 동작.
     */
    onReadyMetadata () {
      this.setVodAllTime()
    },
    /**
     * 비디오플레이어 옵션 셋팅. - 데이터가 없을시 false 셋팅
     */
    setComputedPlayerOption () {
      if (this.isTv && !this.tvLiveDataCheck) {
        return null
      }
      if (this.isShopPlus && !this.shopPlusDataCheck) {
        return null
      }
      let vodFilePath = ''
      let type = ''
      let videoLiveYn = true
      if (this.isTv) {
        vodFilePath = CONST.LIVE.url.etc
      } else if (this.isShopPlus) {
        vodFilePath = CONST.LIVE.url.shopPlus
      } else if (this.isThingLive) {
        this.setTingLiveArea(this.thingLiveData)
        vodFilePath = this.thingLiveVideoUrl
        if (this.vodPlayGubun !== 'LIVE') {
          videoLiveYn = false
        }
      }
      videoLiveYn ? type = 'application/x-mpegURL' : type = 'video/mp4' // 전자 - 라이브일떄, 후자 - 라이브 아닐때
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
        this.computedPlayerOption = playerOption
      } else {
        this.computedPlayerOption = false
      }
      this.isCompleteSetPlayerOption = true
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/LiveSectionAll";
    .ios_player_fill {
      object-fit: fill !important;
    }
    .ios_player_contain {
      object-fit: contain !important;
    }
</style>
