<template>
  <div class="thinglive_vod_detail">
    <!-- 비디오 -->
    <section
      v-show="vodPlay"
      v-if="checkPlayerUrl"
    >
      <div class="photo_wrap">
        <div class="video_wrap">
          <video-player
            v-show="showVideo"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
            :events="events"
            @loadedmetadata="onPlayerLoadedMetadata"
            @fullscreenchange="fullscreenchange"
          />
        </div>
        <div
          v-show="showPlayButton && !isAppAndWifi"
          class="play_button"
        >
          <button
            type="button"
            @click="openDataWarning"
          >
            <span class="icons_play">재생</span>
          </button>
          <p
            class="copy time"
          >
            {{ remainingTime }}
          </p>
        </div>
        <data-warning
          v-if="showDataWarning"
          @closeDataWarning="closeDataWarning"
          @playVideo="playVideo"
        />
      </div>
      <div class="video_info">
        <strong class="video_title">
          {{ htmlDecode(vodPlay.vodName) }}
        </strong>
        <p class="video_description">
          {{ htmlDecode(vodPlay.vodDescribe) }}
        </p>
        <div class="video_other">
          <span class="play">
            재생수 <span>{{ vodPlay.vodPlayCount > 99999 ? '99,999+' : insertCommas(vodPlay.vodPlayCount) }}</span>
          </span>
          <div class="btn_group">
            <button
              type="button"
              class="btn_like"
              :class="vodPlay.userLikeYn ? 'active' : ''"
              @click="onClickLikeBtn()"
            >
              <i class="icons_good" /> {{ vodPlay.vodLikeCount > 99999 ? '99,999+' : insertCommas(vodPlay.vodLikeCount) }}
            </button>
            <button
              type="button"
              class="btn_share"
              @click="onClickShareBtn(vodPlay.vodName, vodPlay.vodDescribe, `https:${vodPlay.imgUrl}`, vodPlay.vodLikeCount, vodPlay.vodPlayCount, vodPlay.vodId, contentId)"
            >
              공유하기
            </button>
          </div>
        </div>
      </div>
    </section>
    <!-- 영상 상품 -->
    <section
      v-show="vodProd.length"
    >
      <div class="title_tag">
        <p class="title">
          영상 상품
        </p>
      </div>
      <product-list
        v-if="vodProd"
        :product-list="vodProd"
        :product-more-btn="false"
        :right-order-btn="false"
      />
    </section>
    <section
      v-show="vodNext.length"
    >
      <div class="title_tag">
        <p class="title">
          다음 영상
        </p>
      </div>
      <ul class="video_list">
        <li
          v-for="(item, index) in vodNext"
          :key="item.vodId"
          @click="onClickVodNext(item.vodId, item.contentId, item.vodName)"
        >
          <video-player
            v-if="loadVideoPlayer"
            v-show="false"
            ref="pgmPlayer"
            :options="item.playerOptions"
            :events="events"
            @loadedmetadata="onPgmPlayerLoadedMetadata(index)"
          />
          <dl class="item">
            <dt>
              <span
                v-show="getAddDate('day', -7) <= format(onlyNumFormat(item.initRegiDttm), 'yyyyMMdd')"
                class="label new"
              >
                NEW
              </span>
              <ns-img
                :src="item.imgUrl"
                :alt="item.vodDescribe"
                type="WIDE"
              />
              <span class="remaining_time">{{ item.vodPlayTime }}</span>
            </dt>
            <dd>
              <p class="title">
                {{ htmlDecode(item.vodDescribe) }}
              </p>
            </dd>
            <dd>
              <div class="info">
                <span class="play">
                  <span class="num">{{ Number(item.vodPlayCount) > 99999 ? '99,999+' : insertCommas(item.vodPlayCount) }}</span>
                </span>
                <span class="like">
                  <span class="num">{{ Number(item.vodLikeCount) > 99999 ? '99,999+' : insertCommas(item.vodLikeCount) }}</span>
                </span>
                <span class="date">{{ vodDateDiff(onlyNumFormat(item.initRegiDttm)) }}</span>
              </div>
            </dd>
          </dl>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import thingliveMixin from '@/mixins/media/thingliveMixin'
import shareMixin from '@/mixins/common/shareMixin'
import DataWarning from '@/components/product/DataWarning' // 데이터 안내 팝업
import {
  extend,
  htmlDecode,
  insertCommas,
  onlyNumFormat,
  isOsApp
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import mediaUtil from '@utils/mediaUtil'
import bizUtil from '@utils/bizUtil'
import {
  getAddDate,
  format,
  vodDateDiff
} from '@frameworks/dateutil/dateUtil'
import nativeUtil from '@frameworks/nativeUtil'
import CONST from '@/common/constants/framework/framework'
import NO_IMAGE_WIDE from '@/assets/images/common/img_noImage_wide.png'
import NsImg from '@components/common/NsImg'
import ProductList from '@/components/media/ProductList'
import modalUtil from '@frameworks/modalUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'ThingliveVodDetail',
  components: {
    DataWarning,
    NsImg,
    ProductList
  },
  mixins: [
    thingliveMixin,
    shareMixin
  ],
  data () {
    return {
      // 비디오 플레이어 이벤트 추가
      events: ['loadedmetadata', 'fullscreenchange'],
      // 비디오 플레이어 로드 여부
      loadVideoPlayer: false,

      // VOD 재생 영역
      vodPlay: {},
      contentId: '',
      remainingTime: '', // 라이브 방송 남은시간 (hh:mm:ss)
      showVideo: false, // 비디오 영역 보임 여부
      showPlayButton: false, // 재생버튼 보임 여부
      showRemainingTime: false, // 남은시간 보임 여부
      showDataWarning: false, // 데이터 요금 경고 보임 여부
      isAppAndWifi: false, // 자동재생을 위해, 네이티브 앱이고 Wifi 환경인지 확인한다

      // VOD 상품 영역
      vodProd: [],

      // 다음 영상 영역
      vodNext: [],

      // 비디오 플레이어 default 옵션
      playerOptions: {
        muted: false,
        fluid: true,
        language: 'ko',
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: NO_IMAGE_WIDE,
        controlBar: {
          children: [
            'fullscreenToggle',
            'playToggle',
            'remainingTimeDisplay',
            'volumePanel',
            'progressControl'
          ]
        }
      },
      currentPageYOffset: 0 // 현재 스크롤 위치
    }
  },
  computed: {
    /**
     * 비디오 플레이어 객체 목록을 리턴한다
     * @returns {Array}
     */
    player () {
      return this.$refs.videoPlayer.player
    },
    /**
     * 비디오 플레이어의 영상 URL이 있는지 확인한다 (src 값이 없을 경우 초기 에러를 방지하기 위함)
     * @returns {String}
     */
    checkPlayerUrl () {
      return this.playerOptions.sources[0].src
    }
  },
  watch: {
    '$route' (route) {
      if (!route.params.vodId || !route.params.contentId) {
        return
      }

      this.getThingliveVideoData(route.params.vodId, route.params.contentId)
    }
  },
  created () {
    // 비디오 재생 영역 데이터 호출
    this.getThingliveVideoData(this.$route.params.vodId, this.$route.params.contentId)

    // 네트워크 환경 확인
    this.checkIsWifi()
  },
  methods: {
    htmlDecode,
    insertCommas,
    onlyNumFormat,
    getAddDate,
    format,
    vodDateDiff,
    /**
     * 비디오 재생 영역 데이터 호출
     * @param {String} vodId - VOD ID
     * @param {String} contentId - content ID
     * @returns {void}
     */
    getThingliveVideoData (vodId, contentId) {
      // contentId를 모르는 페이지에서 넘어올 경우 '0'으로 입력됨
      if (contentId === '0') {
        contentId = ''
      }

      const param = {
        viewGubun: 'VOD',
        gubun: '0',
        vodId,
        contentId,
        memberId: loginUtil.custNum()
      }

      const successHandling = response => {
        this.setThingliveVideoData(response.msg.root)
        this.contentId = response.contentId[0]
      }

      this.$nsaxios.post('NSThingLiveCmd', param, successHandling)
    },

    /**
     * 비디오 재생 영역 세팅
     *
     * @param {Object} data - 라이브 방송 및 상품 정보
     * @returns {void}
     */
    setThingliveVideoData (data) {
      // VOD 재생 영역 관련 데이터 세팅
      this.vodPlay = data._vod_banner[0]

      // 재생수 카운트 String을 Number로 변경
      this.vodPlay.vodPlayCount = Number(this.vodPlay.vodPlayCount)
      // 좋아요 카운트 String을 Number로 변경
      this.vodPlay.vodLikeCount = Number(this.vodPlay.vodLikeCount)
      // 좋아요 여부 String을 Boolean으로 변경
      this.vodPlay.userLikeYn = (this.vodPlay.userLikeYn === 'Y')
      // 재생시간 default 값 변경
      this.vodPlay.vodPlayTime = '00:00'

      // VOD 이미지 및 동영상 URL 변경
      this.playerOptions.poster = this.vodPlay.imgUrl
      const replacedVodPath = this.vodPlay.vodPath.replace('http://', 'https://')
      this.playerOptions.sources[0].src = replacedVodPath
      this.playerOptions.muted = this.isAppAndWifi

      // 재생수(페이지 진입 수) 카운트 증가
      this.setPlayCount()

      // 상품 영역 세팅
      this.vodProd = []
      this.setProdArea(this.vodProd, data._vod_main_product, 'main')
      this.setProdArea(this.vodProd, data._vod_relation_product, 'rel')

      // 다음 영상 영역 세팅
      this.setVodNext(data._vod_nextBanner)

      // 스크롤 최상단으로 이동
      document.scrollingElement.scrollTop = 0
    },

    /**
     * 다음 영상 세팅
     *
     * @param {Array} vodNext - 다음 영상 VOD 리스트
     * @returns {void}
     */
    setVodNext (vodNext) {
      this.vodNext = vodNext

      for (let i = 0; i < this.vodNext.length; i++) {
        // 재생시간 default 값 변경
        this.vodNext[i].vodPlayTime = '00:00'
        // VOD 이미지 및 동영상 URL 변경
        this.vodNext[i].playerOptions = extend(true, {}, this.playerOptions)
        const replacedVodPath = this.vodNext[i].vodPath.replace('http://', 'https://')
        this.vodNext[i].playerOptions.sources[0].src = replacedVodPath
      }

      this.$nextTick(function () {
        // 비디오 플레이어 로드
        this.loadVideoPlayer = true
      })
    },

    /**
     * 재생수(페이지 진입 수) 카운트 증가
     * @returns {void}
     */
    setPlayCount () {
      const param = {
        viewGubun: 'VOD',
        vodId: this.vodPlay.vodId,
        gubun: '1',
        memberId: loginUtil.custNum()
      }
      this.$nsaxios.post('NSThingLiveCmd', param)
    },

    /**
     * 좋아요 카운트 증가/감소
     * @param {boolean} type - true : 좋아요, false : 좋아요 취소
     * @returns {void}
     */
    setLikeCount (type) {
      const param = {
        viewGubun: 'VOD',
        vodId: this.vodPlay.vodId,
        gubun: type ? '2' : '3', // 2 : 좋아요, 3 : 좋아요 취소
        memberId: loginUtil.custNum()
      }
      this.$nsaxios.post('NSThingLiveCmd', param)
    },

    /**
     * 비디오 재생 로그 적재
     * @returns {void}
     */
    setPlayLog () {
      const param = {
        viewGubun: 'VOD',
        vodId: this.vodPlay.vodId,
        gubun: '4',
        memberId: loginUtil.custNum()
      }
      this.$nsaxios.post('NSThingLiveCmd', param)
    },

    /**
     * 좋아요 토글 버튼
     * @returns {void}
     */
    onClickLikeBtn () {
      // 로그인이 되어 있지 않으면,
      if (!loginUtil.checkLogonStatus()) {
        bizUtil.gotoLogin()
      // 로그인이 되어 있으면,
      } else {
        this.vodPlay.userLikeYn = !this.vodPlay.userLikeYn
        if (this.vodPlay.userLikeYn) { // 좋아요 클릭
          this.vodPlay.vodLikeCount += 1
        } else { // 좋아요 해제
          this.vodPlay.vodLikeCount -= 1
        }
        this.setLikeCount(this.vodPlay.userLikeYn)
      }
    },

    /**
     * 다음 영상 클릭 이벤트
     * API를 다시 호출하여 새로운 데이터를 받아온다
     *
     * @param {String} vodId - VOD ID
     * @param {String} contentId - content ID
     * @param {String} vodName - VOD Name
     * @returns {void}
     */
    onClickVodNext (vodId, contentId, vodName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction: 'VOD상세',
          eventLabel: `다음영상_${vodName}`,
          params: {
            t1: null
          }
        }
      })
      // 비디오 플레이어 제거
      this.loadVideoPlayer = false

      // 비디오 재생 영역 데이터 갱신 유도
      this.$router.push({
        name: 'thingliveVodDetail',
        params: {
          contentId,
          vodId
        }
      })
    },
    /**
     * 비디오 데이터 로드됨
     * @returns {void}
     */
    onPlayerLoadedMetadata () {
      this.remainingTime = mediaUtil.setDurationTimeForm(this.player.duration(), false)
      this.showVideo = true
      this.showPlayButton = true
      this.showRemainingTime = true
      // 홈에서 동영상 재생 후 동영상 컨텐츠 페이지로 이동시 이어서 자동 재생
      if (this.$route.params.currentTime) {
        this.player.currentTime(this.$route.params.currentTime)
      }
      // App & wifi 환경일 경우
      if (this.isAppAndWifi) {
        // 동영상 재생
        this.playVideo()
      }
    },
    /**
     * 데이터 요금 안내 레이어 열기
     * @returns {void}
     */
    openDataWarning () {
      this.showDataWarning = true
      this.showPlayButton = false
      this.showRemainingTime = false
    },
    /**
     * 데이터 요금 안내 레이어 닫기
     * @returns {void}
     */
    closeDataWarning () {
      this.showDataWarning = false
      this.showPlayButton = true
      this.showRemainingTime = true
    },
    /**
     * 비디오 재생
     * @returns {void}
     */
    playVideo () {
      this.showDataWarning = false
      this.setPlayLog()
      this.player.play()
    },

    /**
     * 비디오 데이터 로드됨
     * @param {Number} index - 동영상 번호
     * @returns {void}
     */
    onPgmPlayerLoadedMetadata (index) {
      this.vodNext[index].vodPlayTime = mediaUtil.setDurationTimeForm(this.$refs.pgmPlayer[index].player.duration(), false)
    },

    /**
     * 공유하기 버튼 클릭
     * @param {String} title - VOD 타이틀
     * @param {String} description - VOD 설명
     * @param {String} imageUrl - 대표 이미지
     * @param {Number} likeCount - 좋아요 수
     * @param {Number} viewCount - 조회 수
     * @param {String} vodId - 공유하기 URL을 만들기 위해 필요한 vod ID
     * @param {String} contentId - 공유하기 URL을 만들기 위해 필요한 content ID
     * @returns {void}
     */
    onClickShareBtn (title, description, imageUrl, likeCount, viewCount, vodId, contentId) {
      const param = {
        type: 'thinglive',
        title,
        description,
        imageUrl,
        likeCount,
        viewCount,
        shareUrl: `https://${CONST.MOBILE_NSMALL_PATH}/media/thinglive/vod-stream/${contentId}/${vodId}`
      }

      if (isOsApp()) {
        this.kakaoShareNative('thinglive', param)
      } else {
        modalUtil.show('common/PopupShare', param, this.sharePopupClose)
      }
    },
    /**
     * 네이티브 앱일 경우, 현재 LTE로 접속중인지, Wifi로 접속중인지 네트워크 환경을 체크한다
     * @returns {void}
     */
    checkIsWifi () {
      // 앱일 경우만 확인
      if (isOsApp()) {
        // isWifiConnected 콜백함수
        const callbackFunc = data => {
          if (data === 'true') {
            this.isAppAndWifi = true
          }
        }
        // isWifiConnected 콜백함수 저장
        window.callbackFunc = callbackFunc

        // isWifiConnected 브릿지 함수 호출
        nativeUtil.isWifiConnected('callbackFunc')
      }
    },
    /**
     * 전체화면 전환/복구 시 발생하는 이벤트
     *
     * @param {Object} playerObj 비디오 플레이어 object
     */
    fullscreenchange (playerObj) {
      // 전체 화면 전환 시 스크롤 위치 저장 후, 전체 화면 복구 시 스크롤 위치 복구 (App에서 동영상 전체 화면시 바닥 페이지 스크롤 최상단으로 이동하는 버그 대응)
      const isFullSCreen = playerObj.isFullscreen_
      if (isFullSCreen) {
        this.currentPageYOffset = window.pageYOffset
      } else {
        window.scrollTo(0, this.currentPageYOffset)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/media/ThingliveVodDetail";
</style>
