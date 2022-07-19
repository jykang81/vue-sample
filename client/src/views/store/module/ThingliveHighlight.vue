<template>
  <section
    v-if="!isEmpty(responseData)"
    class="thinglive_highlight"
    :name="espotKeyName"
  >
    <div class="title_tag">
      <p class="title">
        방송 하이라이트
      </p>
    </div>
    <div
      v-for="(item, index) in highlight"
      :key="item.vodId"
      class="highlight"
    >
      <div class="video_area">
        <p
          class="video_title"
          @click="onClickTitle(item.contentId, item.vodId, index)"
        >
          {{ htmlDecode(item.vodDescribe) }}
        </p>
        <div class="photo_wrap">
          <figure v-show="!item.showPlayButton && !item.showDataWarning && item.showImgFlag">
            <ns-img
              :src="item.imgUrl"
              :alt="htmlDecode(item.vodDescribe)"
            />
          </figure>
          <div
            ref="playerWrap"
            class="video_wrap"
            :data-idx="index"
          >
            <video-player
              v-show="item.showVideo"
              ref="hightlightPlayer"
              playsinline
              :options="item.playerOptions"
              :events="events"
              @loadedmetadata="onHighlightPlayerLoadedMetadata(index)"
              @loadeddata="onPlayerLoadeddata(index)"
              @playing="onPlayerPlaying($event)"
              @fullscreenchange="fullscreenchange"
            />
          </div>
          <div
            v-show="item.showPlayButton && !isAppAndWifi"
            class="play_button"
          >
            <button
              type="button"
              @click="openDataWarning(index)"
            >
              <span class="icons_play">재생</span>
            </button>
            <p class="copy time">
              {{ item.remainingTime }}
            </p>
          </div>
          <data-warning
            v-show="item.showDataWarning"
            @closeDataWarning="closeDataWarning(index)"
            @playVideo="playVideo(index)"
          />
        </div>
        <div class="video_info">
          <span class="play">
            재생수 <span>{{ item.vodPlayCount > 99999 ? '99,999+' : insertCommas(item.vodPlayCount) }}</span>
          </span>
          <div class="btn_group">
            <button
              type="button"
              class="btn_like"
              :class="item.userLikeYn ? 'active' : ''"
              @click="onClickLikeBtn(index)"
            >
              <i class="icons_good" /> {{ item.vodLikeCount > 99999 ? '99,999+' : insertCommas(item.vodLikeCount) }}
            </button>
            <button
              type="button"
              class="btn_share"
              @click="onClickShareBtn(item.vodName, item.vodDescribe, `https:${item.imgUrl}`, item.vodLikeCount, item.vodPlayCount, item.vodId, item.contentId)"
            >
              공유하기
            </button>
          </div>
        </div>
      </div>
      <product-list
        v-if="item.prodList"
        :parent-info="parentInfo"
        :product-list="item.prodList"
        :product-more-btn="true"
        :right-order-btn="false"
      />
    </div>
  </section>
</template>

<script>
import thingliveMixin from '@/mixins/media/thingliveMixin'
import DataWarning from '@/components/product/DataWarning' // 데이터 안내 팝업
import mediaUtil from '@utils/mediaUtil'
import {
  extend,
  isEmpty,
  htmlDecode,
  insertCommas,
  isOsApp
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import NO_IMAGE_WIDE from '@/assets/images/common/img_noImage_wide.png'
import CONST from '@/common/constants/framework/framework'
import ProductList from '@/components/media/ProductList'
import nativeUtil from '@frameworks/nativeUtil'
import NsImg from '@components/common/NsImg'

export default {
  components: {
    DataWarning,
    ProductList,
    NsImg
  },
  mixins: [
    thingliveMixin
  ],
  props: {
    responseData: {
      type: Array,
      required: true
    },
    espotKeyName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 비디오 플레이어 이벤트 추가
      events: ['loadedmetadata', 'fullscreenchange'],

      // 띵라이브 하이라이트 목록
      highlight: [{ playerOptions: {} }, { playerOptions: {} }, { playerOptions: {} }, { playerOptions: {} }, { playerOptions: {} }],
      parentInfo: 'Highlight',

      // 자동 재생
      isAppAndWifi: false, // 네이티브 앱 & Wifi 환경인지 확인한다
      visiblePlayerList: new Set(), // 뷰포트에 노출되는 플레이어 목록
      visiblePlayerIndex: 99, // 뷰포트에 노출되는 플레이어 중, 재생될 플레이어 번호
      visiblePlayerTimerId: '', // 3초 포커싱 체크 타이머

      // videoPlayerOptions
      playerOptions: {
        muted: false,
        fluid: true,
        language: 'ko',
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: NO_IMAGE_WIDE,
        preload: 'metadata',
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
  watch: {
    responseData () {
      this.setThingliveHighlight()
    }
  },
  created () {
    // 네트워크 환경 확인
    this.checkIsWifi()
  },
  methods: {
    isEmpty,
    htmlDecode,
    insertCommas,
    /**
     * 띵라이브 하이라이트 VOD 세팅
     * @returns {void}
     */
    setThingliveHighlight () {
      // VOD 재생 영역 관련 데이터 세팅
      this.highlight = JSON.parse(JSON.stringify(this.responseData)) // 참조없는 복사

      for (let i = 0; i < this.highlight.length; i++) {
        // 재생수 카운트 String을 Number로 변경
        this.highlight[i].vodPlayCount = Number(this.highlight[i].vodPlayCount)
        // 좋아요 카운트 String을 Number로 변경
        this.highlight[i].vodLikeCount = Number(this.highlight[i].vodLikeCount)
        // 좋아요 여부 String을 Boolean으로 변경
        this.highlight[i].userLikeYn = this.highlight[i].userLikeYn === 'Y'

        // VOD 이미지 및 동영상 URL 변경
        this.highlight[i].playerOptions = extend(true, {}, this.playerOptions) // 참조없는 복사
        this.highlight[i].playerOptions.poster = this.highlight[i].imgUrl
        this.highlight[i].playerOptions.muted = this.isAppAndWifi
        const replacedVodPath = this.highlight[i].vodPath.replace('http://', 'https://')
        this.highlight[i].playerOptions.sources[0].src = replacedVodPath

        this.$set(this.highlight[i], 'remainingTime', '') // 비디오 남은 시간
        this.$set(this.highlight[i], 'showVideo', false) // 비디오 영역 보임 여부
        this.$set(this.highlight[i], 'showPlayButton', false) // 재생버튼 보임 여부
        this.$set(this.highlight[i], 'showRemainingTime', false) // 남은시간 보임 여부
        this.$set(this.highlight[i], 'showDataWarning', false) // 데이터 요금 경고 보임 여부
        this.$set(this.highlight[i], 'collapse', false) // 상품 더 보기 토글 추가
        this.$set(this.highlight[i], 'showImgFlag', true) // poster와 play사이 term발생시, 이미지 보임 여부

        // 상품 영역 세팅
        this.$set(this.highlight[i], 'prodList', [])
        this.setProdArea(this.highlight[i].prodList, this.highlight[i]._vod_main_product, 'main')
        this.setProdArea(this.highlight[i].prodList, this.highlight[i]._vod_relation_product, 'rel')
      }

      // DOM이 그려진 후 Intersection Observer 생성
      this.$nextTick(() => {
        if (this.isAppAndWifi) {
          this.createObserver()
        }
      })
    },
    /**
     * 좋아요 토글 버튼
     * @param {Number} index - 동영상 번호
     * @returns {void}
     */
    onClickLikeBtn (index) {
      // 로그인이 되어 있지 않으면,
      if (!loginUtil.checkLogonStatus()) {
        bizUtil.gotoLogin()
      // 로그인이 되어 있으면,
      } else {
        this.highlight[index].userLikeYn = !this.highlight[index].userLikeYn
        if (this.highlight[index].userLikeYn) { // 좋아요 클릭
          this.highlight[index].vodLikeCount += 1
        } else { // 좋아요 해제
          this.highlight[index].vodLikeCount -= 1
        }
        this.setLikeCount(this.highlight[index].userLikeYn, this.highlight[index].vodId)
      }
    },
    /**
     * 좋아요 카운트 증가/감소
     * @param {boolean} type - true : 좋아요, false : 좋아요 취소
     * @param {string} vodId - vod id
     * @returns {void}
     */
    setLikeCount (type, vodId) {
      const param = {
        viewGubun: 'VOD',
        vodId,
        gubun: type ? '2' : '3', // 2 : 좋아요, 3 : 좋아요 취소
        memberId: loginUtil.custNum()
      }
      this.$nsaxios.post('NSThingLiveCmd', param)
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
      this.$emit('onClickShareBtn', param)
    },
    /**
     * 데이터 요금 안내 레이어 열기
     * @param {Number} index - 동영상 번호
     * @returns {void}
     */
    openDataWarning (index) {
      this.highlight[index].showDataWarning = true
      this.highlight[index].showPlayButton = false
      this.highlight[index].showRemainingTime = false
    },
    /**
     * 데이터 요금 안내 레이어 닫기
     * @param {Number} index - 동영상 번호
     * @returns {void}
     */
    closeDataWarning (index) {
      this.highlight[index].showDataWarning = false
      this.highlight[index].showPlayButton = true
      this.highlight[index].showRemainingTime = true
    },
    /**
     * 비디오 meta데이터 로드됨
     * @param {Number} index - 동영상 번호
     * @returns {void}
     */
    onHighlightPlayerLoadedMetadata (index) {
      this.highlight[index].remainingTime = mediaUtil.setDurationTimeForm(this.$refs.hightlightPlayer[index].player.duration(), true)
      this.highlight[index].showPlayButton = true
      this.highlight[index].showVideo = true
      this.highlight[index].showRemainingTime = true
    },
    /**
     * 비디오 데이터 로드됨
     * @param {Number} index - 동영상 번호
     * @returns {void}
     */
    onPlayerLoadeddata (index) {
      this.highlight[index].showImgFlag = false
    },
    /**
     * 비디오 플레이어 재생됨
     * @param {Object} thisPlayer - 재생된 플레이어
     * @returns {void}
     */
    onPlayerPlaying (thisPlayer) {
      this.$refs.hightlightPlayer.forEach(function (value) {
        // 다른 비디오 플레이어 이면
        if (value.player !== thisPlayer) {
          // 동영상 멈춤
          value.player.pause()
        }
      })
    },
    /**
     * 비디오 재생
     * @param {Number} index - 동영상 번호
     * @returns {void}
     */
    playVideo (index) {
      if (this.$refs.hightlightPlayer[index].player.paused()) {
        this.highlight[index].showDataWarning = false
        this.$refs.hightlightPlayer[index].player.play()
        this.setPlayLog(this.highlight[index].vodId)
      }
    },
    /**
     * 비디오 재생 로그 적재
     * @param {string} vodId - vod id
     * @returns {void}
     */
    setPlayLog (vodId) {
      const param = {
        viewGubun: 'VOD',
        vodId,
        gubun: '4',
        memberId: loginUtil.custNum()
      }
      this.$nsaxios.post('NSThingLiveCmd', param)
    },
    /**
     * 상품 더보기 토글
     * @param {Number} index - 하이라이트 영역 index
     * @returns {void}
     */
    onToggleList (index) {
      this.highlight[index].collapse = !this.highlight[index].collapse
    },
    /**
     * 타이틀 클릭 이벤트, VOD 상세 페이지로 이동한다
     * @param {string} contentId - vod id
     * @param {string} vodId - vod id
     * @param {number} index - 하이라이트 영역 index
     * @returns {void}
     */
    onClickTitle (contentId, vodId, index) {
      const currentTime = this.$refs.hightlightPlayer[index].player.currentTime()
      this.$router.push({ name: 'thingliveVodDetail', params: { contentId, vodId, currentTime } })
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
     * IntersectionObserver를 생성한다(자동 재생용)
     * @returns {void}
     */
    createObserver () {
      const playerWrap = this.$refs.playerWrap
      const liveWrap = document.querySelector('#liveWrap')
      const liveSection = document.querySelector('.thinglive_live.preview')
      const liveWrapClientHeight = liveWrap && !liveSection ? liveWrap.clientHeight : 0
      const topMargin = liveWrapClientHeight + Number(window.getComputedStyle(document.querySelector('.thinglive_main .video_area .photo_wrap')).marginTop.replace('px', ''))

      const options = {
        root: null,
        rootMargin: `-${topMargin}px 0px 0px 0px`,
        threshold: this.buildThresholdList()
      }

      const observer = new IntersectionObserver(this.handleIntersect, options)
      for (let i = 0; i < playerWrap.length; i++) {
        observer.observe(playerWrap[i])
      }
    },
    /**
     * Threshold 배열을 생성한다(자동 재생용)
     * @returns {Array} Threshold 리스트
     */
    buildThresholdList () {
      const thresholds = []
      const numSteps = 100

      for (let i = 1.0; i <= numSteps; i++) {
        const ratio = i / numSteps
        thresholds.push(ratio)
      }

      thresholds.push(0)
      return thresholds
    },
    /**
     * IntersectionObserver 핸들러(자동 재생용)
     * @param {array} entries - IntersectionObserver에 등록된 요소 리스트
     * @returns {void}
     */
    handleIntersect (entries) {
      const MAX_RATIO = 0.90
      entries.forEach(entry => {
        if (entry.intersectionRatio > MAX_RATIO) {
          const targetEntry = entry.target
          this.visiblePlayerList.add(targetEntry)
        } else {
          const targetEntry = entry.target
          this.visiblePlayerList.delete(targetEntry)
        }
        this.handlePlayer()
      })
    },
    /**
     * 뷰포트에 노출되는 플레이어가 변경될 때 수행될 핸들러(자동 재생용)
     * @returns {void}
     */
    handlePlayer () {
      // 현재 보이는 player가 없으면
      if (this.visiblePlayerList.size === 0) {
        this.$refs.hightlightPlayer.forEach(function (value) {
          // 모든동영상 멈춤
          value.player.pause()
        })
      // 현재 보이는 player가 1개 이상이면
      } else if (this.visiblePlayerList.size > 0) {
        let minIndex = 99
        // 가장 최상위의 player를 탐색
        this.visiblePlayerList.forEach(function (value) {
          if (value.dataset.idx < minIndex) {
            minIndex = value.dataset.idx
          }
        })

        // 현재 보이는 player가 변경되었으면
        if (this.visiblePlayerIndex !== minIndex || this.$refs.hightlightPlayer[minIndex].player.paused()) {
          console.log('hs>>>>> clearTimeout', this.visiblePlayerIndex)
          // 3초 포커싱 체크 타이머 초기화
          clearTimeout(this.visiblePlayerTimerId)

          // 새로운 player index 저장
          this.visiblePlayerIndex = minIndex
          // 3초 포커싱 체크 타이머 시작
          this.visiblePlayerTimerId = setTimeout(() => {
            console.log('hs>>>>> setTimeout', minIndex)
            // 최상위 플레이어를 실행하고 나머지는 멈춤
            this.playVideo(minIndex)
          }, 3000)
        }
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
  @import "~@/assets/styles/views/store/module/ThingliveHighlight";
</style>
