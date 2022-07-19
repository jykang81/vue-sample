<template>
  <section
    v-if="!isEmpty(responseData)"
    class="thinglive_view"
    :name="espotKeyName"
  >
    <div class="title_tag">
      <p class="title">
        {{ htmlDecode(pgmAreaTitle) }}
      </p>
    </div>
    <!-- PGM 탭 -->
    <div class="tabs">
      <button
        v-for="(item, index) in pgmTab"
        :key="item.categoryId"
        type="button"
        class="tab"
        :class="currentTab === index ? 'active' : ''"
        @click="onClickPgmTab(index, item.categoryId, item.categoryName)"
      >
        <ns-img
          :src="item.imgUrl"
          :alt="item.categoryName"
        />
        <span>{{ item.categoryName }}</span>
      </button>
    </div>
    <!-- PGM 별 VOD 리스트-->
    <div
      class="tab_content"
    >
      <ul class="video_list">
        <li
          v-for="(item, index) in pgmVod"
          :key="item.vodId"
          @click="$router.push({name: 'thingliveVodDetail', params: { contentId : item.contentId, vodId : item.vodId}})"
        >
          <video-player
            v-if="loadVideoPlayer"
            v-show="false"
            ref="pgmPlayer"
            :options="item.playerOptions"
            :events="events"
            @loadedmetadata="onPgmPlayerLoadedMetadata(index, $event)"
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
    </div>
  </section>
</template>

<script>
import thingliveMixin from '@/mixins/media/thingliveMixin'
import NsImg from '@components/common/NsImg'
import {
  isEmpty,
  extend,
  htmlDecode,
  onlyNumFormat,
  insertCommas
} from '@utils/commonutil/commonUtil'
import {
  getAddDate,
  format,
  vodDateDiff
} from '@frameworks/dateutil/dateUtil'
import mediaUtil from '@utils/mediaUtil'
import uiUtil from '@utils/uiUtil'
import NO_IMAGE_WIDE from '@/assets/images/common/img_noImage_wide.png'

import imgThinglivePgm1 from '@/assets/images/main/img_thinglive_pgm1.png'
import imgThinglivePgm2 from '@/assets/images/main/img_thinglive_pgm2.png'
import imgThinglivePgm3 from '@/assets/images/main/img_thinglive_pgm3.png'
import imgThinglivePgm4 from '@/assets/images/main/img_thinglive_pgm4.png'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'ThinglivePgm',
  components: {
    NsImg
  },
  mixins: [
    thingliveMixin
  ],
  props: {
    responseData: {
      type: Object,
      required: true
    },
    pgmMenuFloating: {
      type: Boolean,
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
      events: ['loadedmetadata'],
      // 비디오 플레이어 로드 여부
      loadVideoPlayer: false,

      // PGM 영역
      pgmAreaTitle: '',
      pgmTab: [],
      pgmVod: [],

      // 현재 선택된 탭 인덱스
      currentTab: 0,

      // 카테고리 ID
      currentCategoryId: '',

      // 페이지 인덱스
      pageIdx: 1,
      // 페이징 사이즈
      pageSize: 8,
      // 페이징을 위한 전체 데이터 개수 저장
      pageTotal: 0,
      // 무한 스크롤 설정용 객체
      scrollObject: {
        callback: this.getPgmVod
      },
      // 조회중 플래그
      isLoading: false,

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
      // 이전 스크롤 위치 저장
      scrollBefore: 0
    }
  },
  watch: {
    responseData (responseData) {
      if (!isEmpty(responseData.espotExtendList)) {
        this.setPgmAreaTitle(responseData.espotExtendList._EZ_THING_LIVE_VODPGMCATE.titleContent.mainTitle)
      }
      this.setPgmTab(responseData.espotList[2]._EZ_THING_LIVE_VODPGMCATE)
      delete responseData.espotList[2]._EZ_THING_LIVE_VODPGMCATE
      this.setPgmVod(responseData.espotList[2])
    }
  },
  mounted () {
    // 페이징 용 스크롤 객체 초기화
    this.initScrollObject()
    // 페이징 용 무한 스크롤 이벤트 바인딩
    uiUtil.bindInfiniteScroll(this, this.scrollObject)
  },
  created () {
    // 띵라이브 모아보기 메뉴 고정용 스크롤 이벤트 추가
    window.addEventListener('scroll', this.onScrollThinglive)
  },
  beforeDestroy () {
    // 띵라이브 모아보기 메뉴 고정용 스크롤 이벤트 제거
    window.removeEventListener('scroll', this.onScrollThinglive)
  },
  activated () {
    // 띵라이브 모아보기 메뉴 고정용 스크롤 이벤트 추가
    window.addEventListener('scroll', this.onScrollThinglive)
  },
  deactivated () {
    // 띵라이브 모아보기 메뉴 고정용 스크롤 이벤트 제거
    window.removeEventListener('scroll', this.onScrollThinglive)
  },
  methods: {
    isEmpty,
    htmlDecode,
    onlyNumFormat,
    insertCommas,
    getAddDate,
    format,
    vodDateDiff,
    /**
     * 라이브 PGM 영역 타이틀 세팅
     *
     * @param {String} title - 타이틀
     * @returns {void}
     */
    setPgmAreaTitle (title) {
      this.pgmAreaTitle = title
    },

    /**
     * 라이브 PGM 탭 세팅
     *
     * @param {Object} pgmTab - PGM 리스트
     * @returns {void}
     */
    setPgmTab (pgmTab) {
      // 이미지 하드코딩
      pgmTab.forEach(item => {
        if (item.categoryName === '베스트') {
          item.imgUrl = imgThinglivePgm1
        } else if (item.categoryName === '뷰티띵템') {
          item.imgUrl = imgThinglivePgm2
        } else if (item.categoryName === '먹보세끼') {
          item.imgUrl = imgThinglivePgm3
        } else if (item.categoryName === '리빙X파일') {
          item.imgUrl = imgThinglivePgm4
        }
      })
      // 변수에 저장
      this.pgmTab = pgmTab
      // 최초 카테고리 ID 저장
      this.currentCategoryId = this.pgmTab[0].categoryId
    },

    /**
     * PGM 별 VOD 세팅
     *
     * @param {Object} pgmVod - PGM VOD 리스트
     * @returns {void}
     */
    setPgmVod (pgmVod) {
      // 동적으로 파라미터 명을 받아옴
      const keyName = Object.keys(pgmVod)[0]

      // 받아온 vod 목록 값 임시 저장
      const tempArr = pgmVod[keyName]
      const tempArrLength = tempArr.length
      const tempIndex = (this.pageIdx - 1) * this.pageSize

      // 첫번째 페이지인 경우, 새로운 pgm 목록을 넣어줌
      if (this.pageIdx === 1) {
        this.pgmVod = tempArr
        this.pageTotal = Number(tempArr[0].totalCount)
      }

      for (let i = 0; i < tempArrLength; i++) {
        // 두번째 페이지 이상인 경우, 기존 pgm 목록에 추가해줌
        if (this.pageIdx > 1) {
          this.pgmVod.push(tempArr[i])
        }
        // VOD 이미지 및 동영상 URL 변경
        this.pgmVod[tempIndex + i].playerOptions = extend(true, {}, this.playerOptions)
        const replacedVodPath = tempArr[i].vodPath.replace('http://', 'https://')
        this.pgmVod[tempIndex + i].playerOptions.sources[0].src = replacedVodPath
      }

      this.$nextTick(function () {
        // 비디오 플레이어 로드
        this.loadVideoPlayer = true
      })
    },

    /**
     * PGM VOD 데이터 호출
     *
     * @returns {void}
     */
    getPgmVod () {
      if (this.isLoading || (this.pageIdx !== 0 && (this.pgmVod.length === this.pageTotal))) {
        return
      }
      this.isLoading = true

      const pageStartNum = this.pageIdx * this.pageSize + 1
      const pageEndNum = this.pageIdx * this.pageSize + this.pageSize

      const param = {
        espotInfo: `${this.currentCategoryId}_FIXED_CATEVOD_VODPGMLIST|CATEVOD_VODPGMLIST|${pageStartNum}|${pageEndNum}|${this.currentCategoryId}`
      }

      const successHandling = response => {
        this.pageIdx++
        this.isLoading = false
        this.setPgmVod(response.msg.espotList[0])
      }

      this.$nsaxios.post('NSFixedShopCmd', param, successHandling)
    },

    /**
     * PGM 탭 클릭 이벤트
     *
     * @param {Number} index - 탭 index
     * @param {String} categoryId - PGM 카테고리 코드
     * @param {String} categoryName - 카테고리명
     * @returns {void}
     */
    onClickPgmTab (index, categoryId, categoryName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction: 'PGM',
          eventLabel: categoryName,
          params: {
            t1: null
          }
        }
      })
      // pageIdx 초기화
      this.pageIdx = 0
      // 선택된 탭 인덱스 저장
      this.currentTab = index
      // 선택된 탭 카테고리 ID 저장
      this.currentCategoryId = categoryId
      // 비디오 플레이어 로드
      this.loadVideoPlayer = false
      // 스크롤 이동
      this.setScroll()

      this.$nextTick(function () {
        // PGM VOD 데이터 호출
        this.getPgmVod()
      })
    },

    /**
     * 비디오 메타데이터 로드됨
     * @param {Number} index - 비디오 플레이어 인덱스
     * @returns {void}
     */
    onPgmPlayerLoadedMetadata (index) {
      this.pgmVod[index].vodPlayTime = mediaUtil.setDurationTimeForm(this.$refs.pgmPlayer[index].player.duration(), true)
    },
    /**
     * 페이징 용 스크롤 객체 초기화
     * @returns {void}
     */
    initScrollObject () {
      this.isLoading = false
      this.scrollObject.callback = this.getPgmVod
      this.scrollObject.isEnable = true
      this.scrollObject.interval = 500
      this.scrollObject.triggerHeightPercent = 80
    },
    /**
     * 띵라이브 모아보기 탭 메뉴 클릭 시 스크롤 이동
     * @returns {void}
     */
    setScroll () {
      if (document.querySelector('.thinglive_main').classList.contains('floating')) {
        // 띵라이브 모아보기 VOD 리스트
        const targetPmgList = document.querySelector('.thinglive_view .tab_content')
        const clientRectPmgList = targetPmgList.getBoundingClientRect()
        const relativeTopPgmList = clientRectPmgList.top

        // Title 및 Tab 영역 높이
        const headerHeight = document.querySelector('.app_header').clientHeight

        // threshold
        const threshold = 1

        // 스크롤 이동
        window.scrollTo(0, window.pageYOffset + relativeTopPgmList - headerHeight + threshold)
      }
    },

    /**
     * 띵라이브 모아보기 메뉴 스크롤 이벤트
     * @returns {void}
     */
    onScrollThinglive () {
      let result = this.pgmMenuFloating

      // 띵라이브 모아보기 타이틀
      const targetPgmTitle = document.querySelector('.thinglive_view .title_tag')

      // 타이틀이 있을 경우만 실행
      if (targetPgmTitle) {
        const clientRectPgmTitle = targetPgmTitle.getBoundingClientRect()
        const relativeTopPgmTitle = clientRectPgmTitle.top
        const heightPgmTitle = targetPgmTitle.clientHeight

        // 띵라이브 모아보기 탭
        const targetPgmTab = document.querySelector('.thinglive_view .tabs')
        const clientRectPgmTab = targetPgmTab.getBoundingClientRect()
        const relativeBottomPgmTab = clientRectPgmTab.bottom
        const heightPgmTab = targetPgmTab.clientHeight

        // 띵라이브 모아보기 VOD 리스트
        const targetPmgList = document.querySelector('.thinglive_view .tab_content')
        const clientRectPmgList = targetPmgList.getBoundingClientRect()
        const relativeTopPgmList = clientRectPmgList.top

        // Title 및 Tab 영역 높이
        const headerHeight = document.querySelector('.app_header').clientHeight

        // 띵라이브 모아보기 Tab 고정
        if (relativeTopPgmTitle <= headerHeight && relativeTopPgmList < heightPgmTitle + heightPgmTab + headerHeight) {
          result = true
          document.querySelector('.thinglive_view .tab_content').style.paddingTop = `${heightPgmTitle + heightPgmTab}px`
        }

        // 띵라이브 모아보기 Tab 고정 해제
        if (relativeTopPgmList + heightPgmTitle + heightPgmTab > relativeBottomPgmTab && this.scrollBefore > window.pageYOffset) {
          result = false
          document.querySelector('.thinglive_view .tab_content').style.paddingTop = '0px'
        }

        // 이전 스크롤 위치 저장
        this.scrollBefore = window.pageYOffset
        // pgmMenuFloating 변수 값 변경
        this.$emit('changePgmMenuFloating', result)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/module/ThinglivePgm";
</style>
