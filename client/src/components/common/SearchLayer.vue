<template>
  <div class="search">
    <app-header-main
      v-if="promotionText"
      ref="headerComp"
      type="searchPop"
      :tv-table-flag="tvTableFlag"
      :set-tv-table-class="setTvTableClass"
      :search-keyword="searchKeyword"
      :is-key-pressing="isKeyPressing"
      :relate-search-word-callback-flag="relateSearchWordCallbackFlag"
      :relate-search-word="relateSearchWord"
      :promotion-text="promotionText"
      @updateSearchKeyword="updateSearchKeyword"
      @repeatCallAutocomplete="repeatCallAutocomplete"
      @searchSubmit="searchSubmit"
      @setFocus="setFocus"
      @searchReset="searchReset"
      @keywordClicked="keywordClicked"
      @tvTagLabelHide="tvTagLabelHide"
      @closeSearchPopup="closeSearchPopup"
    />
    <div id="searchContainer" class="app_container">
      <swiper
        v-if="hasLatelySearchWord()"
        ref="searchSwiper"
        :options="searchSwiper"
        class="search_swiper"
        :auto-update="true"
        :auto-destroy="true"
        :delete-instance-on-destroy="true"
        :cleanup-styles-on-destroy="true"
      >
        <swiper-slide @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
          <div class="search_word" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
            <h3>최근 검색어</h3>
            <ul v-if="hasLatelySearchWord()" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
              <li
                v-for="(value, index) in latelySearchWordList"
                :key="`${index}`"
              >
                <p class="word" @click="keywordClicked(value.keyword, 'recentKeyword', index)">
                  {{ value.keyword }}
                </p>
                <p class="date">
                  {{ value.date }}
                </p>
                <button type="button" @click="deleteOneLatelySearchWord(value.keyword)">
                  삭제
                </button>
              </li>
            </ul>
            <p v-else class="nodata">
              <span>
                최근 검색 내역이 없습니다
              </span>
            </p>
            <p class="total_delete">
              <button v-if="hasLatelySearchWord()" type="button" @click="deleteAllLatelySearchWord()">
                전체삭제
              </button>
            </p>
          </div>
        </swiper-slide>
        <swiper-slide @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
          <div class="search_word" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
            <h3>인기 검색어</h3>
            <ol
              v-show="populatorSearchCallbackFlag"
              v-if="isPopularSearchData()" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()"
            >
              <li
                v-for="(value, index) in popularSearchWord.msg.espotList[0]._SEARCH_TOP"
                :key="`${index}`"
                :class="setUpDownNewSameClass(value.PROGRESS, value.PREV_RANK)"
                @click="keywordClicked(value.KEYWORD, 'popularKeyword', index)"
              >
                <p class="word">
                  {{ value.KEYWORD }}
                </p>
              </li>
            </ol>
            <p v-else class="nodata">
              인기검색어를 찾지 못했습니다.
            </p>
            <p class="update_time">
              {{ getOneHourTime() }}
            </p>
          </div>
        </swiper-slide>
      </swiper>
      <swiper
        v-else
        ref="searchSwiper"
        :options="searchSwiper"
        class="search_swiper"
        :auto-update="true"
        :auto-destroy="true"
        :delete-instance-on-destroy="true"
        :cleanup-styles-on-destroy="true"
      >
        <swiper-slide @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
          <div class="search_word" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
            <h3>인기 검색어</h3>
            <ol
              v-show="populatorSearchCallbackFlag"
              v-if="isPopularSearchData()" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()"
            >
              <li
                v-for="(value, index) in popularSearchWord.msg.espotList[0]._SEARCH_TOP"
                :key="`${index}`"
                :class="setUpDownNewSameClass(value.PROGRESS, value.PREV_RANK)"
                @click="keywordClicked(value.KEYWORD, 'popularKeyword', index)"
              >
                <p class="word">
                  {{ value.KEYWORD }}
                </p>
              </li>
            </ol>
            <p v-else class="nodata">
              인기검색어를 찾지 못했습니다.
            </p>
            <p class="update_time">
              {{ getOneHourTime() }}
            </p>
          </div>
        </swiper-slide>
        <swiper-slide @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
          <div class="search_word" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
            <h3>최근 검색어</h3>
            <ul v-if="hasLatelySearchWord()" @touchmove="$refs.headerComp.$refs.searchKeyword[0].blur()">
              <li
                v-for="(value, index) in latelySearchWordList"
                :key="`${index}`"
              >
                <p class="word" @click="keywordClicked(value.keyword, 'recentKeyword', index)">
                  {{ value.keyword }}
                </p>
                <p class="date">
                  {{ value.date }}
                </p>
                <button type="button" @click="deleteOneLatelySearchWord(value.keyword)">
                  삭제
                </button>
              </li>
            </ul>
            <p v-else class="nodata">
              <span>
                최근 검색 내역이 없습니다
              </span>
            </p>
            <p class="total_delete">
              <button v-if="hasLatelySearchWord()" type="button" @click="deleteAllLatelySearchWord()">
                전체삭제
              </button>
            </p>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import loginUtil from '@/common/utils/loginUtil'
import {
  isNull,
  isOsApp,
  isiOS
} from '@utils/commonutil/commonUtil'
import messageUtil from '@/common/frameworks/messageUtil'
import localStorageUtil from '@/common/frameworks/localStorageUtil'
import COMM_CONST from '@/common/constants/framework/constants'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import debounce from 'lodash/debounce'
import nativeUtil from '@/common/frameworks/nativeUtil'
import { mapGetters, mapMutations } from 'vuex' // mapState, mapGetters, mapMutations
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import AppHeaderMain from '@components/layouts/items/AppHeaderMain'

export default {
  components: {
    AppHeaderMain
  },
  props: {
    tvShopFlag: {
      type: String,
      default: ''
    },
    param: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      searchSwiper: { // 스와이퍼 옵션 객체.
        slidesPerView: 'auto',
        initialSlide: 0
      },
      tvTableFlag: false, // 전 페이지가 TV 편성표 인 경우 true로 변경.
      paramData: this.$route.params, // 라우터 변수
      compKeyword: null, // 자동완성 키워드 로직에서 비교값으로 사용됨.
      autoKeyword: null, // 자동완성 키워드 파라미터
      isLogon: this.checkLogonStatus(),
      relateSearchWord: null, // 연관검색어 객체
      popularSearchWord: null, // 인기검색어 객체
      populatorSearchCallbackFlag: false, // 인기검색어 조회 API 중복 호출 방지 플래그
      relateSearchWordCallbackFlag: false, // 연관검색어 조회 API 중복 호출 방지 플래그
      latelySearchWordList: [], // 최근 검색어 리스트
      isKeyPressing: false, // 자동완성 표시용 플래그
      searchKeyword: '', // 유저 입력 검색어
      keywordIdentify: '', // 어떤 키워드인지 판단하는 용도. (최근 검색어 or 인기 검색어)
      keywordIndex: null, // 마케팅 스크립트.
      liveTalkClassChecker: false, // 띵라이브 Live보기 매장과의 UI 충돌로 인한 제어 목적.
      promotionText: false, // 광고성 텍스트 placeholder에 설정
      focusFlag: false
    }
  },
  computed: {
    /**
     * vuex search.js - getters 사용.
     */
    ...mapGetters('search', [
      'getSearchWordInfo'
    ]),
    setTvTableClass () {
      if (this.tvTableFlag) {
        return 'active'
      } else {
        return ''
      }
    }
  },
  watch: {
    /**
     * @param {boolean} value 자동완성 표시 여부
     */
    isKeyPressing (value) {
      // iOS 자동완성 미표시 버그 대응
      if (isiOS()) {
        if (value && this.relateSearchWordCallbackFlag) {
          this.setStyleForiOS()
        } else {
          this.unsetStyleForiOS()
        }
      }
    },
    /**
     * @param {boolean} value 연관검색어 조회 호출 방지
     */
    relateSearchWordCallbackFlag (value) {
      // iOS 자동완성 미표시 버그 대응
      if (isiOS()) {
        if (value && this.isKeyPressing) {
          this.setStyleForiOS()
        } else {
          this.unsetStyleForiOS()
        }
      }
    }
  },
  created () {
    if (isOsApp()) { // APP
      if (this.tvShopFlag === 'true') { // TV검색
        this.tvTableFlag = true
      } else if (this.tvShopFlag === 'false') { // Shop+ 검색
        this.tvTableFlag = true
      } else {
        this.tvTableFlag = false
      }
    } else { // WEB
      const attrsChecker = !isNull(this.param)
      attrsChecker ? this.tvTableFlag = this.param.tvTableFlag : this.tvTableFlag = false
    }
    this.init()
  },
  mounted () {
    if (isOsApp()) { // APP
      // 검색 화면 공백제거
      if (this.$route.name === 'search' && document.querySelector('#searchContainer')) { // 메인에서 검색시
        document.querySelector('#searchContainer').classList.remove('app_container')
      }
      nativeUtil.setBackBtnYn('N')
    }
    this.liveTalkClassChecker = document.body.classList.contains('live_talk')
    if (this.liveTalkClassChecker) {
      document.body.classList.remove('live_talk')
    }
  },
  destroyed () {
    if (this.liveTalkClassChecker) {
      document.body.classList.add('live_talk')
    }

    if (isiOS()) {
      this.unsetStyleForiOS()
    }
  },
  methods: {
    ...mapMutations('search', [
      'setTvTableStatus',
      'setKeywordType'
    ]),
    /**
     * 컴포넌트 로드 후에 검색 인풋박스에 검색어 셋팅.
     */
    setSearchWordInit () {
      this.searchKeyword = this.hasKeyword()
      this.$nextTick(() => {
        this.$refs.headerComp.$refs.searchKeyword[0].value = this.searchKeyword || ''
      })
    },
    /**
     * 검색 input focus 셋팅.
     */
    setFocus () {
      this.$nextTick(() => {
        this.$refs.headerComp.$refs.searchKeyword[0].focus()
      })
    },
    /**
     * 검색레이어 닫기.
     */
    closeSearchPopup () {
      if (isOsApp() && this.$route.name === 'search') { // APP
        nativeUtil.closeWebView()
      } else { // WEB
        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '검색필드',
            eventLabel: '뒤로가기',
            params: {
              t1: null
            }
          }
        })
        const keywordMove = this.searchKeyword
        keywordMove !== '' ? this.$store.commit('popup/hide', keywordMove) : this.$store.commit('popup/hide', null)
      }
    },
    /**
     * 검색어 지우기.
     */
    searchReset () {
      this.searchKeyword = ''
      this.$nextTick(() => {
        this.$refs.headerComp.$refs.searchKeyword[0].value = ''
      })
      this.isKeyPressing = false
      this.$nextTick(() => {
        this.$refs.headerComp.$refs.searchKeyword[0].focus()
      })
    },
    /**
     * 키워드 셋팅 후 searchSubmit() 호출.
     * @param {String} keyword - 검색어
     * @param {String} keywordIdentify - 검색어 구분자
     * @param {String} keywordIndex - 검색어 인덱스
     */
    keywordClicked (keyword, keywordIdentify, keywordIndex) {
      this.isKeyPressing = false
      this.searchKeyword = keyword
      this.keywordIdentify = keywordIdentify
      this.keywordIndex = keywordIndex
      this.$store.commit('search/setKeywordType', keywordIdentify)

      this.searchSubmit()
    },
    /**
     * 공백 검사후 검색 매장으로 이동.
     */
    searchSubmit () {
      const promotionText = ''
      let searchKeyword = this.searchKeyword
      const keywordIdentify = this.keywordIdentify
      const keywordIndex = this.keywordIndex
      const trimSearchKeyword = this.toHTML(searchKeyword.replace(/\s/g, '')) // 검색어 공백 제거.

      if (trimSearchKeyword === '') {
        messageUtil.alert('검색어를 입력해 주세요.')
        this.searchKeyword = ''
      } else {
        if (this.tvTableFlag) {
          // 마케팅 스크립트 적용 부분
          // GA 360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_TV편성표',
              eventAction: 'TV쇼핑검색',
              eventLabel: this.searchKeyword,
              params: {
                t1: null
              }
            }
          })
        } else if (keywordIdentify === 'recentKeyword') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction: '검색필드',
              eventLabel: `최근검색_${keywordIndex + 1}`,
              params: {
                t1: null
              }
            }
          })
        } else if (keywordIdentify === 'popularKeyword') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction: '검색필드',
              eventLabel: `인기검색_${keywordIndex + 1}`,
              params: {
                t1: null
              }
            }
          })
        } else {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction: '검색필드',
              eventLabel: '검색',
              params: {
                t1: null
              }
            }
          })
        }

        // AIQUA
        marketingUtil.aiquaLogger.send({
          type: marketingUtil.aiquaLogger.USER_EVENT,
          data: {
            event: 'searched',
            params: {
              searched_keyword: this.searchKeyword
            }
          }
        })
        // 홈쇼핑 모아
        marketingUtil.hsmoaLogger.send({
          data: {
            co_cd: COMM_CONST.getCocd(),
            action: this.searchKeyword,
            category: 'query'
          }
        })
        const htmlTagRemoverWord = this.toHTML(searchKeyword)
        searchKeyword = htmlTagRemoverWord
        localStorageUtil.setSearchWord({ keyword: searchKeyword, date: calcDate('', 0, 0, 0, 0, 'MM.dd') })

        /* To Be ing end */
        const goingInvok = {
          path: `/search/result/${searchKeyword}`,
          params: {
            searchTerm: searchKeyword,
            promotionText,
            tvTableFlag: this.tvTableFlag, // TV 편성표에서 진입시 전문매장 타입 필터 유무.
            keywordIdentify, // 키워드 구분자 (최근검색어 or 인기검색어)
            keywordIndex
          }
        }
        this.$store.commit('search/setSearchWordInfo', goingInvok.params)
        this.setTvTableStatus(this.tvTableFlag)
        setTimeout(() => { // 검색어 입력 마침과 동시에 엔터를 눌렀을때 swiper 인식문제 때문에 딜레이 0.3초 줌.
          if (this.getSearchWordInfo.searchTerm) { this.$router.replace(goingInvok) }
        }, 500)
      }
    },
    /**
     * 로그인 상태 체크.
     *
     * @returns {Boolean} 로그인 여부
     */
    checkLogonStatus () {
      return loginUtil.checkLogonStatus()
    },
    /**
     * 검색어 및 검색타입 파라메터 유효성 검사.
     * @param {Object} params (필수) 검색 파라미터
     */
    init (params) {
      if (params !== undefined && !isNull(params.searchTerm)) {
        this.searchKeyword = params.searchTerm
      }
      this.initializeComponent()
    },
    /**
     * 이벤트 binding 등...
     */
    initializeComponent () {
      try {
        this.getPromotionText() // PROMOTION TEXT 조회.
        this.populatorSearch() // 인기검색어 조회.
        this.getLatelySearchWord() // 최근검색어 조회.
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * 검색 input 박스에 키가 입력될때마다 api 콜 (자동완성 기능)
     */
    repeatCallAutocomplete () {
      this.relateSearchWordCallbackFlag = false
      const keyword = this.toHTML(this.searchKeyword)
      let params = {}
      // 연관검색어 영역 출력
      if (keyword !== '') {
        this.isKeyPressing = true // 자동완성 리스트 엘리먼트 show 플래그
        if (keyword === this.compKeyword) {
          return false
        }
        this.autoKeyword = keyword
        this.compKeyword = keyword
        params = {
          searchType: 'auto',
          searchTerm: keyword
        }
        const debounceFunc = debounce(() => {
          this.$nsaxios.post(
            'NSSearchMobile',
            params,
            this.relateSearchWordCallback
          )
        }, 300)
        debounceFunc()
      } else {
        this.isKeyPressing = false
      }
    },
    /**
     * 연관 검색어 데이터 조회 콜백
     *
     * @param {Object} data (필수) 콜백 데이터
     */
    relateSearchWordCallback (data) {
      if (data.autoResultList === undefined || data.autoResultList.length <= 0) { // 통신장애 또는 데이터없을 경우
        this.isKeyPressing = false // 자동완성 리스트 엘리먼트 hide 플래그
      } else {
        this.relateSearchWord = data
        this.isKeyPressing = true // 자동완성 리스트 엘리먼트 show 플래그
      }
      this.relateSearchWordCallbackFlag = true
      if (this.hasLatelySearchWord() === false) {
        this.$refs.searchSwiper.$swiper.slideTo(1, 100)
      }
    },
    /**
     * 인기검색어 조회.
     */
    async populatorSearch () {
      const params = {
        espotInfo: 'SEARCH_TOP|RCMDSEARCH_TEXTSLIDE|1|50|0'
      }
      await this.$nsaxios.post(
        'NSFixedShopCmd',
        params,
        this.populatorSearchCallback
      )
    },
    /**
     * 인기검색어 조회 콜백 - 실제 데이터 셋팅부
     *
     * @param {Object} data (필수) 콜백 데이터
     */
    populatorSearchCallback (data) {
      this.popularSearchWord = data
      this.populatorSearchCallbackFlag = true
    },
    /**
     * 인기검색어 조회 데이터 유효성 검사.
     *
     * @returns {Boolean} 유효성 통과 여부
     */
    isPopularSearchData () {
      const checker =
        !isNull(this.popularSearchWord) &&
        !isNull(this.popularSearchWord.msg) &&
        !isNull(this.popularSearchWord.msg.espotList) &&
        this.popularSearchWord.msg.espotList.length &&
        !isNull(this.popularSearchWord.msg.espotList[0]._SEARCH_TOP) &&
        this.popularSearchWord.msg.espotList[0]._SEARCH_TOP.length
      return checker
    },
    /**
     * 최근 검색어 데이터 있는지 체크
     *
     * @returns {Boolean} 최근 검색어 데이터 유무 여부
     */
    hasLatelySearchWord () {
      return (this.latelySearchWordList.length > 0)
    },
    /**
     * 최근 검색어 조회 후 데이터 역순으로 바인딩.
     */
    getLatelySearchWord () {
      const latelySearchWordList = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)
      if (!isNull(latelySearchWordList)) {
        this.latelySearchWordList = latelySearchWordList.reverse() // 역순 정렬. this.latelySearchWordList = latelySearchWordList // Original
      }
    },
    /**
     * 최근 검색어 단건 삭제.
     *
     * @param {String} deleteKeyword (필수) 최근 검색어
     */
    deleteOneLatelySearchWord (deleteKeyword) {
      localStorageUtil.deleteSearchWordByKeyword(deleteKeyword)
      const arrayCheckObject = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)
      const latelySearchTypeCheck = arrayCheckObject instanceof Array && arrayCheckObject.length <= 0
      if (latelySearchTypeCheck) {
        this.latelySearchWordList = []
      } else {
        this.latelySearchWordList = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST).reverse()
      }
    },
    /**
     * 최근 검색어 모두 삭제.
     */
    deleteAllLatelySearchWord () {
      localStorageUtil.del(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)
      localStorageUtil.set(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST, [])
      this.latelySearchWordList = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)
    },
    /**
     * 프로모션 텍스트 조회.
     */
    async getPromotionText () {
      const parameters = {
        espotInfo: 'GNB_PROMOTION_TEXT_MOB|Text'
      }
      await this.$nsaxios.post(
        'NSEspotCommon',
        parameters,
        this.getPromotionTextCallback
      )
    },
    /**
     * getPromotionText 콜백.
     *
     * @param {Object} data (필수) 콜백 데이터
     */
    getPromotionTextCallback (data) {
      let promotionText = '검색어를 입력해주세요'
      try {
        if (isNull(data) || data.msg.root === undefined) {
          return
        } else {
          if (!isNull(data.msg.root._GNB_PROMOTION_TEXT_MOB)) {
            const voList = data.msg.root._GNB_PROMOTION_TEXT_MOB
            if (voList !== undefined && voList.length > 0) {
              // random 처리
              const val = Math.round(Math.random() * (voList.length - 1))
              promotionText = voList[val].marketingText
            }
          }
        }
      } catch (e) {
        this.commonErrorHandler(e)
      } finally {
        this.promotionText = promotionText
        this.setSearchWordInit()
        this.$nextTick(() => {
          this.$refs.headerComp.$refs.searchKeyword[0].click()
        })
      }
    },
    /**
     * 검색어 변수가 있는지 체크.
     *
     * @returns {String} 검색어 변수 유무 여부
     */
    hasKeyword () {
      const hasKeywordCheck = !isNull(this.paramData) && !isNull(this.paramData.searchTerm)

      if (hasKeywordCheck) {
        return this.paramData.searchTerm
      } else if (this.param && this.param.searchTerm && String(this.param.searchTerm).trim() !== '') { // 검색 결과 페이지의 검색어
        return this.param.searchTerm
      } else {
        return ''
      }
    },
    /**
     * 공통 에러 처리 핸들러.
     *
     * @param {object} error (필수) 에러 object
     */
    commonErrorHandler (error) {
      console.error(error)
    },
    /**
     * 자동완성 리스트중에 현재 검색어에 대한 폰트 빨간색 처리.
     *
     * @param {String} searchKeyword (필수) 검색어
     * @param {String} allKeyword (필수) 자동완성 리스트 한 항목의 풀 키워드.
     * @returns {String} 검색어 HTML 문자열
     */
    setFontColor (searchKeyword, allKeyword) {
      const fullKeyword = String(allKeyword)
      const searchWord = String(searchKeyword)
      if (searchWord !== '') {
        return fullKeyword.replace(searchWord, `<strong>${searchWord}</strong>`)
      }
    },
    /**
     * 편성표 라벨 숨김.
     */
    tvTagLabelHide () {
      this.tvTableFlag = false
    },
    /**
     * 편성표 라벨 유무에 따른 클래스 셋팅.
     *
     * @param {boolean} tvTableFlag (필수) 편성표 라벨 유무
     * @returns {String} class
     */
    /*
    setTvTableClass (tvTableFlag) {
      if (tvTableFlag) {
        return 'active'
      } else {
        return ''
      }
    },
    */
    /**
     * API 응답 값에 따라서 up, down, new, same 스트링 반환.
     * @param {String} progress 순위 상태
     * @param {Number} prevRank 이전 순위
     * @returns {String}
     */
    setUpDownNewSameClass (progress, prevRank) {
      let returnString = ''
      switch (progress) {
        case 'UP':
          returnString = 'up'
          break
        case 'DOWN':
          returnString = 'down'
          break
        case 'SAME':
          returnString = 'same'
          break
        case 'NEW':
          returnString = 'new'
          break
        default:
          returnString = ''
          break
      }
      if (Number(prevRank) === 0) { returnString = 'new' }
      return returnString
    },
    /**
     * 현재 시간의 1시간 전 시간을 계산하여 반환.
     * @returns {String}
     */
    getOneHourTime () {
      const today = new Date()
      const year = today.getFullYear() // 년도
      let month = today.getMonth() + 1 // 월
      let date = today.getDate() // 날짜
      // let hour = today.getHours() - 1 // 시간
      let hour = today.getHours() // 시간
      let minute = today.getMinutes() // 분
      if (String(month).length === 1) { month = `0${month}` }
      if (String(date).length === 1) { date = `0${date}` }
      if (String(hour).length === 1) { hour = `0${hour}` }
      if (String(minute).length === 1) { minute = `0${minute}` }
      const returnString = `${year}.${month}.${date} ${hour}:00 업데이트`
      return returnString
    },
    /**
     * html 태그 및 특정 특수문자가 포함된 검색어로 검색시 대응
     * @param {}
     * @returns {}
     */
    toHTML (str) {
      let returnString = str
      returnString = returnString.replace(/&/g, '')
      returnString = returnString.replace(/</g, '')
      returnString = returnString.replace(/>/g, '')
      returnString = returnString.replace(/"/g, '')
      returnString = returnString.replace(/'/g, '')
      returnString = returnString.replace(/\//g, '')
      return returnString
    },
    /**
     * iOS 대응용 style 설정
     */
    setStyleForiOS () {
      const appHeader = document.querySelector('.search .app_header')

      if (appHeader === null) {
        return
      }

      appHeader.classList.add('height_100')
    },
    /**
     * iOS 대응용 style 해제
     */
    unsetStyleForiOS () {
      const appHeader = document.querySelector('.search .app_header')

      if (appHeader === null) {
        return
      }

      appHeader.classList.remove('height_100')
    },
    updateSearchKeyword (val) {
      this.searchKeyword = val
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/SearchLayer";
</style>
