<template>
  <section class="product_info">
    <div class="photo_wrap" :class="showDataWarning ? 'layer_open' : ''">
      <div
        v-if="computedPlayerOption"
        v-show="isPlaying"
        :key="playReloadKey"
        class="video_wrap"
      >
        <video-player
          id="videoWrap"
          ref="videoPlayer"
          playsinline
          :options="computedPlayerOption"
          @ready="onPlayerReadied"
          @play="onPlayerPlay($event)"
          @pause="onPlayerPause($event)"
        />
        <div id="videoPlaying"
             class="video_playing"
        >
          <button
            style="visibility:hidden"
            type="button"
            class="btn_play"
          >
            <span class="icons_play">재생</span>
          </button>
          <strong
            v-if="showRemainingTime && showPlayButton"
            id="remainingTimeArea"
            class="remaining_time"
          >
            {{ remainingtimeText }}
          </strong>
        </div>
        <button
          type="button"
          class="btn_close"
          @click="closePlayer"
        >
          동영상 닫기
        </button>
        <p
          v-if="showLiveCloseMsg"
          class="live_close_msg"
        >
          생방송이<br>종료되었습니다.
        </p>
      </div>
      <swiper
        v-show="!isPlaying && photoList && photoList.length"
        ref="swiper"
        :key="swiperReloadKey"
        :options="computedSwiperOption"
        class="swiper_thumb"
      >
        <swiper-slide
          v-for="(photo,index) in (photoList) "
          :key="photo.photoPath"
          class="thumb_img"
        >
          <div
            class="item"
            :class="computedPlayerOption && index === 0 ? 'video_wrap' : ''"
            @click.prevent="openImageSlider()"
          >
            <ns-img
              :src="photo.photoPath"
              :alt="productName"
            />
          </div>
          <div v-show="index % photoList.length === 0 && showPlayButton" class="video_playing">
            <button
              type="button"
              class="btn_play"
              @click="openDataWarning"
            >
              <span class="icons_play">재생</span>
            </button>
            <strong
              v-if="isTvLiveProduct || isCtcomLiveProduct || (isThingliveProduct && thinglivePlayType=== 'LIVE')"
              class="remaining_time"
            >
              {{ remainingtimeText }}
            </strong>
          </div>
        </swiper-slide>
        <div
          v-show="!showDataWarning"
          slot="pagination"
          class="swiper-pagination"
        />
      </swiper>
      <data-warning
        v-if="showDataWarning"
        @closeDataWarning="closeDataWarning"
        @playVideo="playVideo"
      />
      <button
        v-if=" !isPlaying && (isThingliveVodProduct || !!thingLiveScheduledTime )"
        type="button"
        class="thinglive_button"
        @click="playVideo"
      >
        <span>띵라이브 영상보기</span>
      </button>
    </div>
    <div
      v-if="isThingliveProduct && thinglivePlayType === 'LIVE'"
      class="broadcast_bar_wrap"
    >
      <div class="broadcast_info">
        <i class="icons_thinglive" />
        <i class="icons_live" />
        <span class="copy">방송중</span>
      </div>
    </div>
    <div
      v-if="isThingliveProduct && thinglivePlayType === 'VIDEO'"
      class="broadcast_bar_wrap"
    >
      <div class="broadcast_info">
        <i class="icons_thinglive" />
        <span class="copy tv_schedule">{{ thingLiveScheduledTime }}</span>
      </div>
    </div>
    <div v-if="showBroadcastBar && showTvShopping"
         class="broadcast_bar_wrap"
    >
      <div class="broadcast_info">
        <span v-if="isCtcomProduct" class="copy">Shop+</span>
        <span v-else class="copy">TV쇼핑</span>
      </div>
      <div class="broadcast_state">
        <span class="copy">방송알림</span>
        <label>
          <input type="checkbox"
                 :checked="isAlarmRegistered"
                 :class="isAlarmRegistered? 'active' : ''"
                 @click="stopDefAction"
          >
          <div
            class="custom_switch"
            @click="clickBroadAlarm"
          >
            <div class="rail">
              <span class="switch_label switch_off">off</span>
              <span class="switch_label switch_on">on</span>
              <span class="handle" />
            </div>
          </div>
        </label>
      </div>
    </div>
    <div v-else-if="showBroadcastBar && showLiveShopping"
         class="broadcast_bar_wrap"
    >
      <div class="broadcast_info">
        <i v-if="isCtcomProduct" class="icons_shop" />
        <i v-else class="icons_homeshoping" />
        <i class="icons_live" />
        <span class="copy">방송중</span>
      </div>
      <div class="broadcast_state">
        <span class="copy">방송알림</span>
        <label>
          <input type="checkbox"
                 :checked="isAlarmRegistered"
                 :class="isAlarmRegistered? 'active' : ''"
                 @click="stopDefAction"
          >
          <div class="custom_switch"
               @click="clickBroadAlarm"
          >
            <div class="rail">
              <span class="switch_label switch_off">off</span>
              <span class="switch_label switch_on">on</span>
              <span class="handle" />
            </div>
          </div>
        </label>
      </div>
    </div>
    <div v-else-if="showBroadcastBar && liveScheduledTime"
         class="broadcast_bar_wrap"
    >
      <div class="broadcast_info">
        <i v-if="isCtcomProduct" class="icons_shop" />
        <i v-else class="icons_homeshoping" />
        <span class="copy tv_schedule">{{ liveScheduledTime }} 방송</span>
      </div>
      <div class="broadcast_state">
        <span class="copy">방송알림</span>
        <label>
          <input type="checkbox"
                 :checked="isAlarmRegistered"
                 :class="isAlarmRegistered? 'active' : ''"
                 @click="stopDefAction"
          >
          <div class="custom_switch"
               @click="clickBroadAlarm"
          >
            <div class="rail">
              <span class="switch_label switch_off">off</span>
              <span class="switch_label switch_on">on</span>
              <span class="handle" />
            </div>
          </div>
        </label>
      </div>
    </div>
    <div class="info_box">
      <h2 v-if="headCopyText"
          class="head_copy"
      >
        {{ headCopyText }}
      </h2>
      <div class="title_wrap">
        <h3 class="name">
          <span v-if="showTvProductArea"
                class="market tvshopping"
          >[TV쇼핑]</span>
          <span v-if="isCtcomProduct"
                class="market shopplus"
          >[Shop+]</span>
          <span v-if="showHappyDealArea"
                class="market happydeal"
          >[해피딜]</span>
          {{ productName }}
        </h3>
        <button
          class="btn_share"
          @click="onClickShareBtn"
        >
          공유하기
        </button>
      </div>
      <div v-if="showRatingStar"
           class="star_wrap"
      >
        <span
          class="rating_star"
          @click="gotoCustomerReview(0)"
        >
          <span class="star" />
          <span
            class="rating"
            :style="{width: starRating}"
          />
        </span>
        <span class="count"
              @click="gotoCustomerReview(0)"
        >{{ reviewCnt }}</span>
      </div>
      <div class="price_wrap">
        <ns-price
          v-if="!isConsultantRequiredProduct"
          :dc-price="orginSalePrice"
          :dc-rate="globalVal.productInfo.orginSaleRate"
          :price="globalVal.productInfo.offerPrice"
          :mm-rntal-prc="globalVal.productInfo.mmRntalPrc"
          :prc-wave-disp="globalVal.productInfo.prcWaveDisp"
          :buschn-id="globalVal.productInfo.busChnId"
          :disp-type-cd="globalVal.productInfo.dispTypeCd"
        >
          <button
            v-if="showSalesButton && saleInfo"
            type="button"
            class="button_tooltip"
            @click="tooltipSaleOpen"
          >
            할인내역 팝업
          </button>
          <container-tooltip
            :show="tooltipSale"
            @close="tooltipSaleClose"
          >
            <template #title>
              할인내역
            </template>
            <template #content>
              <div class="discount_wrap">
                <strong class="total_discount">
                  총 할인금액 : <span>-{{ discountedPrice }}원</span>
                </strong>
                <dl v-for="(item, index) in saleInfo"
                    :key="index"
                    class="list"
                >
                  <dt>{{ item.title }}</dt>
                  <dd>{{ item.salePrice }}</dd>
                </dl>
                <p class="guide">
                  고객님이 보유한 할인쿠폰, 적립금, 상품권, 청구할인카드등을 사용하여 추가할인이 가능합니다.
                </p>
              </div>
            </template>
          </container-tooltip>
        </ns-price>
        <!-- 해피딜 구매수량 팝업
        <div class="happydeal_purchase">
          <span class="amount">12,000개 구매</span>
          <button
            type="button"
            class="layer_alert"
            @click="tooltipHappydealPhurchaseOpen"
          >
            해피딜 구매수량 팝업
          </button>
          <container-tooltip
            :show="tooltipHappydealPhurchase"
            @close="tooltipHappydealPhurchaseClose"
          >
            <template #title>
              구매수량
            </template>
            <template #content>
              <p class="msg">
                본 상품이 해피딜 기간동안 판매된 누적 수량입니다.(최대 3개월 기준) 단, 판매가격은 공급가격 변동 등의 사정으로 일부 변경될 수 있습니다.
              </p>
            </template>
          </container-tooltip>
        </div>
        -->
        <div class="other_sale">
          <span v-if="staffPrice"
                class="sale_info staff"
          >
            NS임직원 <strong>{{ staffPrice }}</strong>원
          </span>
          <span
            v-if="isConsultantRequiredProduct"
            class="counsel"
          >
            본 상품은 상담 후 구매가 가능합니다.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import modalUtil from '@frameworks/modalUtil'
import popupUtil from '@frameworks/popupUtil'
import toastUtil from '@frameworks/toastUtil'
import messageUtil from '@frameworks/messageUtil'
import NO_IMAGE_SQUARE from '@/assets/images/common/img_noImage_square.png'
import PRODUCT_MESSAGE, { PRODUCT_CONST } from '@/common/constants/product/product'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import LOGIN_CONST from '@constants/customer/login'
import COMM_CONST from '@constants/framework/constants'
import {
  format,
  getDateParse,
  calcDate,
  getDateParse02
} from '@frameworks/dateutil/dateUtil'
import CONST from '@constants/framework/framework'
import {
  insertCommas,
  getMoneyFormat,
  htmlDecode,
  moneyUnformat,
  getImageUrl,
  isOsApp,
  isiOS
} from '@utils/commonutil/commonUtil'
import {
  getProductPrice
} from '@utils/productutil/productUtil'
import ContainerTooltip from '@components/frameworks/ContainerTooltip'
import DataWarning from '@/components/product/DataWarning'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import productInfoService from '@services/product/productInfoService'
import shareMixin from '@/mixins/common/shareMixin'

export default {
  name: 'ProductInfo',
  components: {
    ContainerTooltip,
    DataWarning,
    NsImg,
    NsPrice
  },
  mixins: [
    shareMixin
  ],
  props: {
    globalVal: {
      type: Object,
      required: true
    }

  },
  data () {
    return {
      liveInfoApi: 'NSFixedShopNoCacheCmd', // 생방송 정보 가져오는 api명
      userBroadInfrId: this.globalVal.userBroadInfrId, // 방송알림 등록 ID
      isAlarmRegistered: !!this.globalVal.userBroadInfrId, // 방송알리미 등록 여부
      closeMsgFlag: false, // 진입시 생방송이 었다가 종료된 경우 생방송 종료 message 보여주기 위한 flag
      swiperReloadKey: 100, // 스와이퍼 영역 다시 렌더링하기 위한 key
      playReloadKey: 0, // 플레이어 다시 렌더링하기 위한 key
      isPlaying: false, // 현재 재생중 여부
      isPausedClass: '', // 정지버튼 보임 여부
      showRemainingTime: false, // 남은시간 보임 여부
      isLive: false, // 생방송 상품 여부
      remainingTime: 0, // 방송 타이머
      PRE_PAST_VOD: PRODUCT_CONST.PRE_PAST_VOD, // 도메인주소
      LIVE_VOD_FILE_PATH: CONST.LIVE.url.etc, // 생방 url
      SHOPPLUS_VOD_FILE_PATH: CONST.LIVE.url.shopPlus, // shopPlus live url
      THINGLIVE_VOD_FILE_PATH: CONST.LIVE.url.thinglive, // ThingLive live url
      allowedPlay: false, // 데이터경고 팝업 동의 여부
      showPauseButton: false, // 일시정지 버튼 보임 여부
      showDataWarning: false, // 데이터경고창 열기
      tooltipSale: false, // 할인 정보 tooltip
      swiperOption: { // 이미지 슬라이더 옵션
        slidesPerView: 'auto',
        loop: false,
        pagination: {
          el: '.swiper-pagination'
        },
        resistance: true,
        resistanceRatio: 0
      }

    }
  },
  computed: {
    /**
     * 라이브 상품여부 (tv쇼핑, 샵플러스, 띵라이브)
     *
     * @returns {Boolean}
     */
    isLiveProduct () {
      return this.isTvLiveProduct || this.isCtcomLiveProduct || this.isThingliveProduct
    },
    /**
     * 재생버튼 노출 여부
     *
     * @returns {Boolean}
     */
    showPlayButton () {
      const isPlayerRequired = !!this.computedPlayerOption && (this.isLiveProduct || !this.isThingliveVodProduct)
      return isPlayerRequired && !this.showLiveCloseMsg && !this.showDataWarning
    },
    /**
     * 띵라이브 상품 여부
     *
     * @returns {Boolean}
     */
    isThingliveProduct () {
      return !!this.globalVal.productInfo.vodPlay?.vodPlayGubun
    },
    /**
     * 띵라이브 매장 VOD 상품 여부
     *
     * @returns {Boolean}
     */
    isThingliveVodProduct () {
      return this.globalVal.productInfo.isPlayStoreYn === 'Y' && this.globalVal.productInfo.isPlayVodPath
    },
    /**
     * 띵라이브 방송 타입
     * 'LIVE':라이브
     * 'VIDEO':예고
     * @returns {Boolean}
     */
    thinglivePlayType () {
      return this.globalVal.productInfo.vodPlay?.vodPlayGubun
    },
    /**
     * 띵라이브 방송 시간
     *
     * @returns {String}
     */
    thingLiveScheduledTime () {
      if (this.isThingliveProduct) {
        if (this.thinglivePlayType === 'LIVE') {
          this.setThingliveRemainingTime()
          return ''
        } else {
          const liveStartDttm = getDateParse02(this.globalVal.productInfo.vodPlay.vodLiveStartDttm)
          return `${format(liveStartDttm, ' MM/dd(' + 'E' + ')' + ' HH:mm ')} 방송`
        }
      }
      return ''
    },
    /**
     * 방송 예정시간
     *
     * @returns {String}
     */
    liveScheduledTime () {
      let data = []
      if (this.isTVProduct) {
        data = this.globalVal.productInfo.tvList
      } else if (this.isCtcomProduct) {
        data = this.globalVal.productInfo.ctcomTvList
      } else {
        return ''
      }

      return format(getDateParse(data[0].formStartDttm), ' MM/dd(' + 'E' + ')' + ' HH:mm ')
    },
    /**
     * TV 쇼핑 여부
     *
     * @returns {Boolean}
     */
    isTVProduct () {
      return !!this.globalVal.productInfo.tvList?.length
    },
    /**
     * 샵플러스 상품 여부
     *
     * @returns {Boolean}
     */
    isCtcomProduct () {
      return (
        !this.isThingliveProduct &&
        !this.isThingliveVodProduct &&
        !!this.globalVal.productInfo.ctcomTvList?.length
      )
    },
    /**
     * 렌탈 상품 여부
     *
     * @returns {Boolean}
     */
    isRentalProduct () {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL === this.globalVal.productInfo.dispTypeCd
    },
    /**
     * 상담이 필요한 상품 여부
     *
     * @returns {Boolean}
     */
    isConsultantRequiredProduct () {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(this.globalVal.productInfo.dispTypeCd)
    },
    /**
     * 방송정보바 보임 여부
     *
     * @returns {Boolean}
     */
    showBroadcastBar () {
      return (
        !this.isThingliveProduct &&
        !this.isThingliveVodProduct &&
          (this.globalVal.productInfo.tvList?.length ||
            this.globalVal.productInfo.ctcomTvList?.length
          )
      )
    },
    /**
     * tv 쇼핑 영역 보이기 여부
     *
     * * @returns {Boolean}
     */
    showTvShopping () {
      const info = this.globalVal.productInfo
      if (info.tvList) {
        return this.globalVal.productInfo.tvLiveCd === 'C'
      } else if (info.ctcomTvList) {
        return this.globalVal.productInfo.ctcomLiveCd === 'C'
      }
      return false
    },
    /**
     * 라이브 알림 영역 보이기 여부
     *
     * @returns {Boolean}
     */
    showLiveShopping () {
      return this.globalVal.productInfo.tvLiveCd === 'A' || this.globalVal.productInfo.ctcomLiveCd === 'A'
    },
    /**
     * 헤드카피문구
     *
     * @returns {String}
     */
    headCopyText () {
      return this.globalVal.productInfo.headCopy
    },
    /**
     * 생방 종료 메시지 노출 여부
     *
     * @returns {Boolean}
     */
    showLiveCloseMsg () {
      return Number(this.remainingTime) <= 0 && this.closeMsgFlag
    },
    /**
     * 생방 남은시간
     *
     * @returns {string}
     */
    remainingtimeText () {
      if (this.remainingTime > 0) {
        return this.convertTime(this.remainingTime)
      } else {
        return ''
      }
    },
    /**
     * 별점 보임 여부
     *
     * @returns {Boolean}
     */
    showRatingStar () {
      return this.globalVal.productInfo.score > 0
    },
    /**
     * 해피딜 여부
     *
     * @returns {Boolean}
     */
    showHappyDealArea () {
      return this.globalVal.productInfo.isFlashSaleNew === 'Y'
    },
    /**
     * TV쇼핑 여부
     *
     * @returns {Boolean}
     */
    showTvProductArea () {
      return !!this.globalVal.productInfo.tvList
    },
    /**
     * 비디오플레이어 옵션
     *
     * @returns {Object||null}
     */
    computedPlayerOption () {
      let vodFilePath = ''
      let type = ''
      if (this.globalVal.pastVod) {
        vodFilePath = this.PRE_PAST_VOD + this.globalVal.pastVod
      }

      const vodPlay = this.globalVal.productInfo.vodPlay
      const isTvOnAir = this.globalVal.productInfo.tvList && this.globalVal.productInfo.tvLiveCd === 'A'
      const isCtcomOnAir = this.isCtcomProduct && this.globalVal.productInfo.ctcomLiveCd === 'A'

      if (isTvOnAir) {
        vodFilePath = this.LIVE_VOD_FILE_PATH
        type = 'application/x-mpegURL'
      } else if (isCtcomOnAir) {
        vodFilePath = this.SHOPPLUS_VOD_FILE_PATH
        type = 'application/x-mpegURL'
      } else if (Object.keys(vodPlay)?.length && vodPlay.vodPlayGubun) {
        if (vodPlay.vodPlayGubun === 'LIVE') {
          vodFilePath = this.THINGLIVE_VOD_FILE_PATH
          type = 'application/x-mpegURL'
        } else if (vodPlay.vodPlayGubun === 'VIDEO') {
          vodFilePath = vodPlay.vodVideoUrl
          type = 'video/mp4'
        } else {
          console.log(`vodPlayGubun : ${vodPlay.vodPlayGubun}`)
        }
      }

      if (this.isThingliveVodProduct) {
        vodFilePath = this.globalVal.productInfo.isPlayVodPath
        type = 'video/mp4'
      }

      if (vodFilePath) {
        const playerOption = {
          overNative: true,
          html5: { hls: { withCredentials: false } },
          controlBar: {
            children: [
              'playToggle',
              'volumePanel',
              'fullscreenToggle',
              'remainingTimeDisplay'
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
          ],
          poster: this.globalVal.productInfo.photoList ? this.globalVal.productInfo.photoList[0].photoPath : NO_IMAGE_SQUARE
        }

        return playerOption
      } else {
        return null
      }
    },
    /**
     * 스와이퍼 옵션
     *
     * @returns {Object}
     *
     */
    computedSwiperOption () {
      const singleSwiperOption = {
        slidesPerView: 'auto',
        watchOverflow: true
      }
      return !!this.globalVal.productInfo.photoList && this.globalVal.productInfo.photoList.length > 1 ? this.swiperOption : singleSwiperOption
    },
    /**
     * 페이징처리 여부
     *
     * @returns {Boolean}
     */
    showPaginationArea () {
      return this.globalVal.productInfo.photoList ? this.globalVal.productInfo.photoList.length > 1 : null
    },
    /**
     * 할인버튼 보임 여부
     *
     * @returns {Boolean}
     */
    showSalesButton () {
      const isConsultantOnlyProduct = ((this.globalVal.productInfo.dispTypeCd === '35' || this.globalVal.productInfo.dispTypeCd === '40' || this.globalVal.productInfo.dispTypeCd === '56' || this.globalVal.productInfo.dispTypeCd === '58') && this.globalVal.productInfo.busChnId === 'TV')
      if (!isConsultantOnlyProduct) {
        const isDiscount = this.globalVal.productInfo.orginSalePrice !== 0 && this.globalVal.productInfo.offerPrice !== this.globalVal.productInfo.orginSalePrice
        return isDiscount
      }
      return false
    },
    /**
     * 판매가
     *
     * @returns {String}
     */
    offerPrice () {
      return getMoneyFormat('', this.globalVal.productInfo.offerPrice)
    },
    /**
     * 별점 점수
     *
     * @returns {String}
     */
    starRating () {
      return `${this.globalVal.productInfo.score}%`
    },
    /**
     * 상품평 개수
     *
     * @returns {String}
     */
    reviewCnt () {
      if (this.globalVal.productInfo.join_cnt > 0) {
        return `(${insertCommas(this.globalVal.productInfo.join_cnt)})`
      } else {
        return ''
      }
    },
    /**
     * 구매수량
     *
     * @returns {String}
     */
    orderQty () {
      if (this.globalVal.productInfo.ordQty > 0) {
        return `${insertCommas(this.globalVal.productInfo.ordQty)}개 구매중`
      } else {
        return ''
      }
    },
    /**
     * 임직원 할인가
     *
     * @returns {String} 할인 가격
     */
    staffPrice () {
      try {
        const isEmployeeDiscountProduct = this.globalVal.productInfo.staffBnft.empYn === 'Y' && this.globalVal.productInfo.staffSalePrice > 0
        if (isEmployeeDiscountProduct) {
          return insertCommas(this.globalVal.productInfo.staffSalePrice) + this.globalVal.productInfo.prcWaveDisp
        }
      } catch (error) {
        return null
      }
      return null
    },
    /**
     * 알뜰할인가
     *
     * @returns {String} 알뜰할인가
     */
    orginSalePrice () {
      const orginSalePrice = this.globalVal.productInfo.orginSalePrice
      const offerPrice = this.globalVal.productInfo.offerPrice

      if (orginSalePrice !== 0 && offerPrice !== orginSalePrice) {
        return orginSalePrice
      } else {
        return offerPrice
      }
    },
    /**
     * 알뜰할인가
     *
     * @returns {String} 알뜰할인가
     */
    salePrice () {
      const offerPrice = this.globalVal.productInfo.offerPrice
      const orginSalePrice = this.globalVal.productInfo.orginSalePrice

      if (orginSalePrice !== 0 && offerPrice !== orginSalePrice) {
        return insertCommas(orginSalePrice)
      } else {
        return insertCommas(offerPrice)
      }
    },
    /**
     * 상품명
     *
     * @returns {String} 인코딩된 HTML
     */
    productName () {
      return htmlDecode(this.globalVal.productInfo.productName)
    },
    /**
     * 상품이미지
     *
     * @returns {Array} 이미지목록
     */
    photoList () {
      return this.globalVal.productInfo.photoList || [{ photoPath: NO_IMAGE_SQUARE }]
    },
    /**
     * TV쇼핑상품 방송중 여부
     *
     * @returns {Boolean}
     */
    isTvLiveProduct () {
      try {
        if (this.globalVal.productInfo.tvList) {
          if (this.globalVal.productInfo.tvLiveCd === 'A') { // tvLiveCd - A:현재 방송중, B:방송예정, C:지난방송
            return true
          }
        }
        return false
      } catch (error) {
        return null
      }
    },
    /**
     * 샵플러스상품 방송중 여부
     *
     * @returns {Boolean}
     */
    isCtcomLiveProduct () {
      try {
        if (this.isCtcomProduct) {
          if (this.globalVal.productInfo.ctcomLiveCd === 'A') {
            return true
          }
        }
        return false
      } catch (error) {
        return null
      }
    },
    /**
     * 할인정보
     *
     * @returns {array} 할인정보
     */
    saleInfo () {
      const costTypeCd = this.globalVal.productInfo.costTypeCd
      const orginSalePrice = this.globalVal.productInfo.orginSalePrice
      const cpcAmt = this.globalVal.productInfo.cpcAmt
      const arsAmt = this.globalVal.productInfo.arsAmt
      const cpcValue = this.globalVal.productInfo.cpcValue
      const cpcDcWay = this.globalVal.productInfo.cpcDcWay
      const okCashUndispYn = this.globalVal.productInfo.okCashUndispYn

      const returnData = []
      const isDiscountOnAir = this.globalVal.productInfo.tvList?.length && arsAmt > 0 &&
                                 (costTypeCd === '10' || costTypeCd === '20' || costTypeCd === '2010' || costTypeCd === '2030' || costTypeCd === '203010')

      // 방송중 동일혜택 : [조조할인,조조할인일시불할인] + ars할인
      if (isDiscountOnAir) {
        returnData.push(this.addSaleInfo('방송 중 할인', arsAmt))
      } else if (arsAmt > 0) {
        returnData.push(this.addSaleInfo('가격할인', arsAmt))
      }

      // 매가할인
      if (cpcValue > 0 || this.globalVal.productInfo.couponList?.length || (orginSalePrice >= 10000 && okCashUndispYn === 'N' && this.globalVal.productInfo.tvList === false)) {
        if (cpcValue > 0) {
          if (cpcDcWay === 'RTO') {
            returnData.push(this.addSaleInfo('가격할인', cpcValue))
          } else if (cpcDcWay !== 'RTO') {
            returnData.push(this.addSaleInfo('가격할인', cpcAmt))
          }
        }
      }

      const ifiValue = this.globalVal.productInfo.ifiValue
      let lspAmt = this.globalVal.productInfo.lspAmt
      const dispTypeCd = this.globalVal.productInfo.dispTypeCd

      if (dispTypeCd === '35' || dispTypeCd === '45' || dispTypeCd === '55' || dispTypeCd === '57' || dispTypeCd === '60') {
      } else {
        if ((ifiValue && ifiValue !== '0') || lspAmt > 0) {
          if (lspAmt > 0) {
            lspAmt = insertCommas(lspAmt)
            returnData.push(this.addSaleInfo('일시불 할인', lspAmt))
          }
        }
      }

      const couponList = this.globalVal.productInfo.couponList
      const couponSubList = this.globalVal.productInfo.couponSubList

      if (cpcValue || couponList?.length || (orginSalePrice >= 10000 && okCashUndispYn === 'N' && this.isTVProduct === false)) {
        if (dispTypeCd === '35' || dispTypeCd === '45' || dispTypeCd === '57') {
        } else {
          if (couponList != null) {
            for (let k = 0; k < couponList.length; k++) {
              const items = couponList[k]
              let cpName = ''
              let salePrice

              // 정률 쿠폰
              if (items.plusCouponWay === '2') {
                cpName = `${items.plusCoupon}% 쿠폰`

                salePrice = Number(items.couponBeforePrice) * items.plusCoupon / 100
                salePrice = Math.ceil(salePrice / 10) * 10

                if (Number(items.maxBnftLimit)) {
                  cpName += `(최대 ${insertCommas(items.maxBnftLimit)}원)`

                  if (Number(items.maxBnftLimit) < salePrice) {
                    salePrice = Number(items.maxBnftLimit)
                  }
                }

              // 정액 쿠폰
              } else if (items.plusCouponWay === '1') {
                cpName = `${insertCommas(items.plusCoupon)}원 쿠폰 `
                salePrice = items.plusCoupon
              }

              const commCdNm = this.getCouponName(couponSubList)
              if (commCdNm !== '') { cpName = commCdNm }

              if (items.plusCoupon !== 0) {
                returnData.push(this.addSaleInfo(cpName, salePrice))
              }
            }
          }
        }
      }

      return returnData.length
        ? returnData
        : null
    },
    /**
     * 총 할인된 금액
     *
     * @returns {string} 총 할인된 금액
     */
    discountedPrice () {
      return getMoneyFormat('', moneyUnformat(this.offerPrice) - moneyUnformat(this.salePrice))
    }
  },
  created () {
    if (this.isTvLiveProduct) {
      this.callNSMobHomeViewLive()
    } else if (this.isCtcomLiveProduct) {
      this.callNSMobHomeViewShpoplusLive()
    } else if (this.isThingliveProduct && this.thinglivePlayType === 'LIVE') {
      this.closeMsgFlag = true
    } else {
      this.closeMsgFlag = false
    }
  },
  methods: {
    /**
     * checkbox 클릭이벤트 막음.
     * 알람등록여부 상태값에 의해서만 변경 가능.
     * @param {object} e 이벤트 객체
     */
    stopDefAction (e) {
      e.preventDefault()
    },
    /**
     * 상품평 페이지로 이동
     * @param {String} clickedItemSeq 클릭한 리뷰 번호
     */
    gotoCustomerReview (clickedItemSeq) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '상품평',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })

      if (!this.reviewCnt) {
        messageUtil.alert(PRODUCT_MESSAGE.NO_CUSTOMER_REVIEW)
      } else {
        const params = {
          globalVal: this.globalVal,
          clickedItemSeq,
          partNumber: this.globalVal.partNumber
        }
        this.$router.push({ name: 'reviewList', params })
      }
    },
    /**
     * 공유하기
     */
    onClickShareBtn () {
      const param = {
        type: 'product',
        title: this.productName,
        imageUrl: `https:${getImageUrl(this.globalVal.partNumber, 800, 800, this.globalVal.productInfo.adultItemFlag)}`,
        regularPrice: this.globalVal.productInfo.offerPrice,
        discountPrice: this.globalVal.productInfo.orginSalePrice,
        discountRate: this.globalVal.productInfo.orginSaleRate,
        shareUrl: `https://${CONST.MOBILE_NSMALL_PATH}${this.$route.fullPath}`
      }

      // 무형상품일 경우
      if (this.isConsultantRequiredProduct && !isOsApp()) {
        const priceInfo = getProductPrice(this.globalVal.productInfo.busChnId, this.globalVal.productInfo.dispTypeCd, this.globalVal.productInfo.mmRntalPrc, this.orginSalePrice)
        param.title = `${priceInfo.title.value || priceInfo.altText.value} ${priceInfo.dcPrice.value}${priceInfo.won.value}`
        param.description = this.productName
        param.type = 'intangibleProduct'
      }

      if (isOsApp()) {
        this.kakaoShareNative('product', param)
      } else {
        modalUtil.show('common/PopupShare', param, this.sharePopupClose)
      }

      this.shareClickLogging()
    },
    /**
     * 마케팅 스크립트 적용 부분
     * GA360
     */
    shareClickLogging () {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '공유하기',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 띵라이브 남은 시간
     */
    setThingliveRemainingTime () {
      const vodPlay = this.globalVal.productInfo.vodPlay
      if (this.isThingliveProduct) {
        const data = [
          {
            endDttm: vodPlay.vodLiveEndDttm
          }
        ]
        this.getCurrentLiveItem(data)
      }
    },
    /**
     * 방송알리미 페이지로 이동 / 알림 등록 삭제
     *
     * @param {}
     * @returns {}
     */
    clickBroadAlarm () {
      if (this.isAlarmRegistered) {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_상품상세',
            eventAction: '방송알림',
            eventLabel: '방송알림off',
            params: {
              t1: null
            }
          }
        })
      }

      const isLogon = loginUtil.checkLogonStatus()
      if (!isLogon) {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER)
        return
      }
      if (this.isAlarmRegistered) {
        const params = {
          userId: loginUtil.userId(),
          infrIdList: this.userBroadInfrId
        }

        const successHandling = response => {
          if (response.msg.root.resultKey === 1) {
            this.userBroadInfrId = ''
            this.isAlarmRegistered = false
          } else {
            const msg = '방송 알리미 삭제에 실패 하였습니다.'
            toastUtil.show(msg)
            this.isAlarmRegistered = true
          }
        }

        const errorHandling = err => {
          console.error(`${'DeleteAlarmReal' + ', '}${err}`)
          const msg = '방송 알리미 삭제에 실패 하였습니다.'
          toastUtil.show(msg)
          this.isAlarmRegistered = true
        }

        productInfoService.clickBroadAlarm(params, successHandling, errorHandling)
      } else {
        const registeredProductInfo = {
          partNumber: this.globalVal.partNumber,
          catentryId: this.globalVal.productInfo.catentryId,
          productName: this.productName,
          isCtcomProduct: this.isCtcomProduct,
          imageUrl: this.globalVal.productInfo.photoList ? this.globalVal.productInfo.photoList[0].photoPath : NO_IMAGE_SQUARE
        }
        const param = {
          globalVal: this.globalVal,
          registeredProductInfo
        }
        modalUtil.show('product/ShoppingAlarmRegister', param, responseData => this.closeAlarmRegister(responseData))
      }
    },
    /**
     * 방송알리미 등록창 닫기
     * @param {Boolean} 등록 성공 여부
     */
    closeAlarmRegister (isRegistSuccess) {
      if (isRegistSuccess === true) {
        this.isAlarmRegistered = true
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_상품상세',
            eventAction: '방송알림',
            eventLabel: '방송알림on',
            params: {
              t1: null
            }
          }
        })
        this.updateAlarmRegist()
      } else {
        this.isAlarmRegistered = false
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_상품상세',
            eventAction: '방송알림',
            eventLabel: '방송알림off',
            params: {
              t1: null
            }
          }
        })
      }
    },
    /**
     * 방송알림등록 ID 업데이트
     * cocd: 외부유입경로 코드(제휴사코드)
     */
    updateAlarmRegist () {
      const params = {
        partNumber: this.globalVal.partNumber,
        cocd: COMM_CONST.getCocd(),
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE
      }
      this.getProductDetail(params)
    },
    /**
     * 상품상세정보 조회
     * @param {object} params 파라미터
     */
    getProductDetail (params) {
      const successHandling = response => {
        const info = response.msg.goods[0].info
        this.globalVal.userBroadInfrId = response.msg.member.userBroadInfrId
        this.userBroadInfrId = this.globalVal.userBroadInfrId
        this.$store.commit('product/setProductInfo', info)
      }

      productInfoService.getProductDetail(params, successHandling)
    },
    /**
     * 쿠폰명 가져오기
     *
     * @param {Array} subList 쿠폰 리스트
     * @returns {string} 쿠폰명
     */
    getCouponName (subList) {
      if (!subList) { return '' }
      const cocd = COMM_CONST.getCocd()
      let commCdNm = ''

      for (let k = 0; k < subList.length; k++) {
        const items = subList[k]

        if (cocd === items.commCdVal) {
          commCdNm = `${items.commCdNm}쿠폰`
          break
        }
      }

      return commCdNm
    },
    /**
     * 방송 남은시간
     *
     * @param {Number} input 방송 남은시간
     * @returns {string} 방송시간 남은시간 포매팅된 값
     */
    convertTime (input) {
      const pad = function (input) { return (input < 10) ? `0${input}` : input }
      return [
        pad(Math.floor(input / 3600)),
        pad(Math.floor(input % 3600 / 60)),
        pad(Math.floor(input % 60))
      ].join(':')
    },
    /**
     * 할인정보
     *
     * @param {string} title 타이틀
     * @param {string} salePrice 할인가
     * @returns {object} 타이틀 , 할인가
     */
    addSaleInfo (title, salePrice) {
      salePrice = `-${insertCommas(salePrice)}원`
      return { title, salePrice }
    },
    /**
     * 샵플러스 라이브 방송 정보 조회
     * @param {object} params 파라미터
     */
    callNSMobHomeViewShpoplusLive (params) {
      const parameters = {
        espotInfo: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE|BROADALL_BROADBOXSLIDE|1|999|0',
        gubun: 'TV|SHOPPLUS',
        targetEspotId: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE'
      }
      const successHandling = response => {
        this.getCurrentLiveItem(response.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[1]._SHOPPLUS[0].TotalOrgan)
        this.closeMsgFlag = true
      }

      productInfoService.callNSMobHomeViewShpoplusLive(parameters, successHandling)
    },
    /**
     * 라이브 방송 정보 조회
     */
    callNSMobHomeViewLive () {
      const successHandling = response => {
        this.getCurrentLiveItem(response.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan)
        this.closeMsgFlag = true
      }
      const parameters = {
        espotInfo: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE|BROADALL_BROADBOXSLIDE|1|999|0',
        gubun: 'TV|SHOPPLUS',
        targetEspotId: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE'
      }

      productInfoService.callNSMobHomeViewLive(parameters, successHandling)
    },
    /**
     * 라이브 방송 타이머 설정
     * @param { object } data NSMobHomeView API 응답값
     */
    getCurrentLiveItem (data) {
      try {
        const currentTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        for (let i = 0; i < data.length; i++) {
          let etime = ''
          if (this.isCtcomProduct) {
            etime = getDateParse(data[i].time.split('~')[1])
          } else {
            etime = getDateParse02(data[i].endDttm)
          }
          const interval = (etime.getTime() - currentTime.getTime()) / 1000
          this.remainingTime = interval
        }
        const intervalTimer = setInterval(() => {
          if (this.remainingTime > 0) {
            this.remainingTime--
          } else {
            clearInterval(intervalTimer)
          }
        }, 1000)
      } catch (e) {
        console.error(`${'getCurrentLiveItem' + ', '}${e}`)
      }
    },
    /**
     * 데이터경고창 열기
     *
     */
    openDataWarning () {
      this.showPauseButton = true
      this.showDataWarning = true
      this.$refs.swiper.$swiper.destroy()
    },
    /**
     * 데이터경고창 닫기
     *
     */
    closeDataWarning () {
      this.showPauseButton = false
      this.showDataWarning = false
      this.swiperReloadKey++
    },
    /**
     * 할인내역 열기
     *
     */
    tooltipSaleOpen () {
      this.tooltipSale = true
    },
    /**
     * 할인내역 닫기
     *
     */
    tooltipSaleClose () {
      this.tooltipSale = false
    },
    /**
     * 해피딜 구매수량 열기
     */
    tooltipHappydealPhurchaseOpen () {
      this.tooltipHappydealPhurchase = true
    },
    /**
     * 해피딜 구매수량 닫기
     */
    tooltipHappydealPhurchaseClose () {
      this.tooltipHappydealPhurchase = false
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

      document.querySelector('.btn_full_close').addEventListener('touchend', event => {
        this.closePlayer()
        event.stopPropagation()
        event.preventDefault()
        document.querySelector('.btn_full_close').removeEventListener('touchend', this.closePlayer())
      })

      const videoWrap = document.getElementById('videoWrap')
      const targetArea = videoWrap.firstChild
      const remainingTimeArea = document.getElementById('videoPlaying')
      targetArea.appendChild(remainingTimeArea)

      document.addEventListener('fullscreenchange', () => {
        if (this.$refs.videoPlayer.player.isFullscreen()) {
          this.$refs.videoPlayer.player
            .addClass('vjs-fullscreen')
        } else {
          this.$refs.videoPlayer.player
            .removeClass('vjs-fullscreen')
        }
      })

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
      this.isPausedClass = 'paused'
      // document.querySelector('.vjs-paused').attr('data-before', this.remainingtimeText)
    },
    /**
     * 재생버튼 클릭
     *
     * @param {Object} player 비디오 플레이어
     */
    onPlayerPlay (player) {
      this.showRemainingTime = false
      this.isPlaying = true
      // this.$refs.videoPlayer.player.$('.vjs-control-bar').removeClass('.vjs-fade-in').addClass('vjs-fade-out')
      // this.$refs.videoPlayer.player.controlBar.playToggle.hide()
    },
    /**
     * 재생
     *
     */
    playVideo () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '영상보기',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
      this.showDataWarning = false
      this.showPauseButton = true
      this.allowedPlay = true
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
      this.swiperReloadKey++
      this.playReloadKey++
    },
    /**
     * 이미지 확대보기 열기
     *
     */
    openImageSlider () {
      const param = {
        title: '상세이미지',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        photoList: this.photoList,
        productName: this.productName
      }
      popupUtil.show('product/ImageSliderLayer', param, null)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/ProductInfo";
</style>
