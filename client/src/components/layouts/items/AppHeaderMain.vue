<template>
  <header id="appHeaderMain" class="app_header" :class="definitions.subClass">
    <div
      v-for="(item, index) in definitions.headerAttr"
      :key="index"
      class="header"
      :class="item.class"
      :style="item.style"
    >
      <h1 v-if="definitions.home.isShow" class="logo_title_wrap">
        <a
          class="logo"
          :href="isOsApp() ? '' : '/store/home'"
          @click="definitions.home.onClick"
        >
          <span>NSMall</span>
        </a>
      </h1>
      <button
        v-if="definitions.back.isShow"
        type="button"
        class="back_btn"
        @click="definitions.back.onClick"
      >
        뒤로가기
      </button>
      <h1
        v-if="definitions.subTitle.isShow"
        class="sub_title"
        :class="definitions.subTitle.subClass"
        @click="definitions.subTitle.onClick"
      >
        {{ htmlDecode(definitions.subTitle.text) }}
      </h1>

      <div v-if="definitions.search.isShow" class="search_wrap">
        <div class="search_inner">
          <template v-if="type === 'search'">
            <label
              for="label_search"
              class="blind"
            >검색어 입력</label>
            <input
              id="label_search"
              ref="searchedKeyword"
              type="text"
              class="search_input"
              placeholder="검색어를 입력해주세요"
              title="검색어입력"
              required
              :value="searchword"
              @click="clickSearch"
              @input="inputSearch"
            >
            <button
              v-show="searchword"
              type="button"
              class="reset_btn"
              @click="resetSearch"
            >
              <span>검색어초기화</span>
            </button>
          </template>
          <template v-else-if="type === 'searchPop'">
            <span v-if="tvTableFlag" id="tvTagLabel" class="tag_label" :class="setTvTableClass">
              TV쇼핑
              <button
                type="button"
                class="btn_delete"
                @click="$emit('tvTagLabelHide')"
              >
                <span>삭제</span>
              </button>
            </span>
            <label
              for="label_search"
              class="blind"
            >검색어 입력</label>
            <input
              id="label_search"
              ref="searchKeyword"
              type="text"
              class="search_input"
              :placeholder="promotionText"
              title="검색어입력"
              required
              maxlength="100"
              @input="$emit('updateSearchKeyword', $event.target.value)"
              @keyup="$emit('repeatCallAutocomplete')"
              @keydown.enter="$emit('searchSubmit')"
              @click="$emit('setFocus')"
            >
            <button
              v-show="String(searchKeyword).trim() !== ''"
              ref="searchReset"
              type="button"
              class="reset_btn"
              @click="$emit('searchReset')"
            >
              <span>검색어초기화</span>
            </button>
          </template>
          <template v-else>
            <button
              type="button"
              class="search_input"
              @click="definitions.search.onClick"
            >
              검색
            </button>
          </template>
        </div>
      </div>
      <div v-if="definitions.rightWrap.isShow" class="right_wrap">
        <template v-if="type === 'main'">
          <router-link
            :to="{ name : 'cartList'}"
            class="icons cart cart_count"
            @click.native="cartListClickLogging()"
          >
            <span>장바구니</span>
            <span v-show="cartIconCount" class="count">{{ cartIconCount }}</span>
          </router-link>
        </template>
        <template v-else-if="type === 'search'">
          <button
            type="button"
            class="search_input"
            @click="doSearch"
          >
            검색
          </button>
        </template>
        <template v-else-if="type === 'searchPop'">
          <button
            type="button"
            class="search_input"
            @click="$emit('searchSubmit')"
          >
            검색
          </button>
        </template>
        <template v-else>
          <template v-if="type === 'product'">
            <button
              type="button"
              class="icons home"
              @click="gotoMain"
            >
              <span>홈</span>
            </button>
          </template>
          <button
            type="button"
            class="icons cart cart_count"
            @click="gotoCartList"
          >
            <span>장바구니</span>
            <span v-show="cartIconCount" class="count">{{ cartIconCount }}</span>
          </button>
        </template>
      </div>
    </div>
    <!-- 검색어 입력시 자동완성 노출 -->
    <ul v-if="isKeyPressing && relateSearchWordCallbackFlag" class="auto_complete">
      <li
        v-for="(value, index) in relateSearchWord.autoResultList"
        :key="`autoResultList_${index}`"
        @click="$emit('keywordClicked', value.keyword, 'autoKeyword', index)"
      >
        <span v-html="setFontColor(searchKeyword, value.keyword)" />
      </li>
    </ul>
  </header>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import popupUtil from '@frameworks/popupUtil'
import bizUtil from '@utils/bizUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import routerUtil from '@frameworks/routerUtil'
import nativeUtil from '@frameworks/nativeUtil'
import {
  extend,
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'

export default {
  name: 'AppHeaderMain',
  props: {
    // params
    type: {
      type: String,
      default: ''
    },
    // fullLayerPopup 용도
    popupObj: {
      type: Object,
      required: false,
      default: null
    },
    // searchPop 용도
    tvTableFlag: {
      type: Boolean,
      required: false,
      default: false
    },
    setTvTableClass: {
      type: String,
      required: false,
      default: ''
    },
    searchKeyword: {
      type: String,
      required: false,
      default: ''
    },
    isKeyPressing: {
      type: Boolean,
      required: false,
      default: false
    },
    relateSearchWordCallbackFlag: {
      type: Boolean,
      required: false,
      default: false
    },
    relateSearchWord: {
      type: Object,
      required: false,
      default: null
    },
    promotionText: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    const vm = this
    return {
      titleAlign: '',
      isShowSearch: true,
      isShowCart: true,
      pageTitleForSub: '',
      paramData: this.$route.params,
      searchword: '', // 검색어
      headerNonOverStyle: {
        opacity: 1
      },
      headerOverStyle: {
        opacity: 0
      },
      areas: {
        headerAttr: [
          {
            class: [],
            style: []
          }
        ],
        home: {
          isShow: false,
          onClick () {
            vm.goNativeHome()
          }
        },
        back: {
          isShow: false,
          onClick () {
            vm.goBack()
          }
        },
        subTitle: {
          isShow: false,
          onClick () {
            if (vm.type) {
              return
            }
            vm.refreshLnbCategory()
          }
        },
        search: {
          isShow: false,
          onClick () {
            vm.searchFullLayer()
          }
        },
        rightWrap: {
          isShow: false
        }
      }
    }
  },
  computed: {
    ...mapState('cart', ['cartIconCount']),
    ...mapState('appHeaderDefault', ['pageTitle']),
    isPopupHeader () {
      return this.popupObj !== null
    },
    /**
     * 검색결과 페이지 여부
     *
     */
    isSearchResultPage () {
      return this.$route.name === 'searchResult'
    },
    definitions () {
      let obj = {}
      obj = extend(true, {}, this.areas)
      switch (this.type) {
        case 'main' :
          obj.subClass = 'main'
          obj.home.isShow = true
          obj.search.isShow = true
          obj.rightWrap.isShow = true
          break
        case 'sub' :
          obj.subClass = 'sub_page'
          obj.back.isShow = true
          obj.subTitle.isShow = true
          obj.subTitle.subClass = 'center'
          obj.subTitle.text = this.pageTitleForSub
          break
        case 'search' :
          obj.subClass = 'search_page border_none'
          obj.back.isShow = true
          obj.search.isShow = true
          obj.rightWrap.isShow = true
          break
        case 'searchPop' :
          obj.subClass = 'search_page'
          obj.back.isShow = true
          obj.search.isShow = true
          obj.rightWrap.isShow = true
          break
        case 'product':
          obj.headerAttr = [
            {
              class: { non_over: true },
              style: this.headerNonOverStyle
            },
            {
              class: { over: true },
              style: this.headerOverStyle
            }
          ]
          obj.subClass = 'sub_page'
          obj.back.isShow = true
          obj.search.isShow = true
          obj.rightWrap.isShow = true
          break
        default:
          obj.subClass = 'sub_page'
          obj.back.isShow = true
          obj.subTitle.isShow = true
          obj.subTitle.subClass = this.titleAlign
          obj.subTitle.text = this.isPopupHeader ? this.popupObj.param.title || this.pageTitle : this.pageTitle
          obj.search.isShow = this.isShowSearch
          obj.rightWrap.isShow = this.isShowCart
          break
      }
      return obj
    }
  },
  watch: {
    '$route' (to, from) {
      this.init()
      if (this.type && !(this.type === 'sub' || this.type === 'search')) {
        return
      }
      if (this.type === 'sub') {
        if (to.meta !== null) {
          this.pageTitleForSub = to.meta.title
          if (isOsApp()) { // APP
            nativeUtil.setBackBtnYn('Y')
            if (to.name === 'nativeHomeBridge') {
              nativeUtil.closeWebView()
            } else if (to.name === 'memberLogin' && from.name === 'orderSheet') {
              nativeUtil.closeWebView()
            } else if (to.name === 'memberLogin' && from.name === 'orderConsultSheet') {
              nativeUtil.closeWebView()
            }
          }
        }
      } else if (this.type === 'search') {
        if (this.isSearchResultPage) {
          this.paramData.searchTerm = to.params.searchword
          this.paramData.promotionText = to.params.promotionText
          this.paramData.tvTableFlag = false
          // this.$refs.searchedKeyword.value = to.params.searchword
          this.searchword = to.params.searchword
          this.$nextTick(() => {
            this.$refs.searchedKeyword.value = to.params.searchword
          })
        }
      } else {
        if (to?.meta?.title) {
          this.$store.commit('appHeaderDefault/setPageTitle', to.meta.title) // 헤더 타이틀 업데이트
        }
      }
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.updateScroll)
  },
  mounted () {
    if (this.type === 'main' || this.type === 'search' || this.type === 'searchPop') {
      return
    }
    if (isOsApp()) { // APP
      nativeUtil.setBackBtnYn('Y')
    }
  },
  methods: {
    /**
     * mutations(setter) 사용 선언부.
     * @param {String, Array} 'search', ['setSearchWordInfo', 'setFilterInfo']
     */
    ...mapMutations('search', [
      'setSearchWordInfo'
    ]),
    htmlDecode,
    isOsApp,
    init () {
      switch (this.type) {
        case 'main' :
        // 우상단 장바구니 아이콘 수량 세팅
          bizUtil.getCartCount()
          break
        case 'sub' :
          if (this.$route.meta !== null) {
            this.pageTitleForSub = this.$route.meta.title
          }
          break
        case 'search':
          if (this.isSearchResultPage) {
            if (isOsApp()) {
              const searchParams = {
                searchTerm: this.$route.params.searchword,
                promotionText: '',
                layerMoveFlag: true // 검색결과 페이지에서 경로 식별하기 위한 flag.
              }
              this.$store.commit('search/setSearchWordInfo', searchParams)
            }
            this.searchword = this.paramData.searchword
          }
          break
        case 'searchPop':
          break
        case 'product' :
        // 우상단 장바구니 아이콘 수량 세팅
          bizUtil.getCartCount()

          window.addEventListener('scroll', this.updateScroll)
          break
        default:
          this.setCartCount()

          if (this.$route?.meta?.title) {
            this.$store.commit('appHeaderDefault/setPageTitle', this.$route.meta.title) // 헤더 타이틀 업데이트
          }
          this.initPopupHeader()
          break
      }
    },
    /**
     * title align 설정
     */
    setTitleAlign () {
      if (this.popupObj && this.popupObj.param.titleAlign) {
        this.titleAlign = this.popupObj.param.titleAlign
      }
    },
    /**
     * full layer popup title 설정
     */
    setFullLayerPopupTitle () {
      if (this.popupObj && this.popupObj.param.title) {
        this.$store.commit('appHeaderDefault/setPageTitle', this.popupObj.param.title)
      }
    },
    /**
     * 검색메뉴 보임/안보임
     */
    setIsShowSearch () {
      if (this.popupObj && this.popupObj.param.isShowSearch !== undefined) {
        this.isShowSearch = this.popupObj.param.isShowSearch
      }
    },
    /**
     * 장바구니메뉴 보임/안보임
     */
    setIsShowCart () {
      if (this.popupObj && this.popupObj.param.isShowCart !== undefined) {
        this.isShowCart = this.popupObj.param.isShowCart
      }
    },
    /**
     * 팝업용 헤더 설정
     */
    initPopupHeader () {
      this.setTitleAlign()
      this.setIsShowSearch()
      this.setIsShowCart()
    },
    /**
     * 검색 레이어 호출.
     * @param {void}
     * @returns {void}
     */
    searchFullLayer () {
      bizUtil.openSearchLayer()
    },
    /**
     * 검색어 입력 시
     *
     * @param {object} e input 이벤트
     */
    inputSearch (e) {
      this.searchword = e.target.value
    },
    /**
     * 검색어 입력 클릭 시
     *
     */
    clickSearch () {
      // 검색 결과 페이지에서만 검색 레이어 호출
      if (this.isSearchResultPage) {
        this.doSearch()
      }
    },
    /**
     * 검색 버튼 클릭 시
     *
     */
    doSearch () {
      // 검색 결과 페이지에서만 검색 레이어 호출
      if (this.isSearchResultPage) {
        bizUtil.openSearchLayer(this.paramData)
      }
    },
    /**
     * 검색어 지우기
     *
     */
    resetSearch () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_검색결과',
          eventAction: '필터',
          eventLabel: '초기화',
          params: {
            t1: null
          }
        }
      })
      this.$refs.searchedKeyword.value = ''
      this.searchword = ''
      const invoke = {
        searchTerm: '',
        searchword: ''
      }
      if (this.isSearchResultPage) {
        bizUtil.openSearchLayer(invoke)
      }
    },
    /**
     *  장바구니 클릭
     */
    cartListClickLogging () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: '장바구니',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 장바구니 이동.
     * @param {void}
     * @returns {void}
     */
    gotoCartList () {
      this.$router.push({ name: 'cartList' })
    },
    /**
     * 주문 Cert 뷰 존재 여부
     * @returns {Boolean}
     */
    hasCert () {
      const certView = document.querySelector('#certView')
      return Boolean(certView)
    },
    /**
     * 장바구니 수량 설정
     */
    setCartCount () {
      // 장바구니 미표시 header 제외
      if (this.isPopupHeader && !this.popupObj.isShowCart) {
        return
      }

      bizUtil.getCartCount()
    },
    /**
     * 현재 페이지가 주문 페이지인지 확인
     * @returns {Boolean}
     */
    areInOrderPage () {
      return location.pathname === '/order/sheet'
    },
    /**
     * 현재 페이지가 카테고리 매장이면, 타이틀 클릭이벤트 설정.
     */
    refreshLnbCategory () {
      const nowPath = location.pathname
      if (nowPath.indexOf('/store/cate/') > -1) {
        window.location.reload()
      }
    },
    /**
     * 상품상세 상단 헤더 interaction (스크롤 업/다운 시 투명도 조절)
     *
     */
    updateScroll () {
      if (window.pageYOffset > 0) {
        const range = 250
        let background = window.pageYOffset / range
        if (background > 1) {
          background = 1
        }
        this.headerNonOverStyle.opacity = 0
        this.headerOverStyle.display = 'flex'
        this.headerOverStyle.opacity = background
      } else if (window.pageYOffset === 0) {
        this.headerNonOverStyle.opacity = 1
        this.headerOverStyle.display = 'none'
        this.headerOverStyle.opacity = 0
      }
    },
    /**
     * 메인으로 이동
     *
     */
    gotoMain () {
      bizUtil.gotoMain()
    },
    /**
     * NativeHome으로 이동
     * @param {void}
     * @returns {void}
     */
    goNativeHome () {
      if (isOsApp()) { // APP
        nativeUtil.goHome()
      }
    },
    /**
     * back 이동(App일때 홈으로 이동의 경우 홈으로 이동)
     */
    goBack () {
      switch (this.type) {
        case 'sub' :
          if (isOsApp() && (this.$route.params.backflag === 'home' || this.$route.name === 'orderComplete' || this.$route.name === 'facebookJoinComplete')) {
            nativeUtil.closeWebView()
          } else {
            routerUtil.back()
          }
          break
        case 'search':
          if (this.isSearchResultPage) {
            if (isOsApp() && this.$route.name === 'search') {
              nativeUtil.closeWebView()
            } else {
              routerUtil.back()
            }
          } else {
            routerUtil.back()
          }
          break
        case 'searchPop':
          this.$emit('closeSearchPopup')
          break
        case 'product' :
          if (isOsApp() && (this.$route.params.backflag === 'home')) {
            nativeUtil.closeWebView()
          } else {
            routerUtil.back()
          }
          break
        default:
          // 결제창에서 뒤로가기 시 팝업 결제창 닫음
          if (this.hasCert() && this.areInOrderPage()) {
            popupUtil.closeAll()
          } else {
            if (isOsApp() && (this.$route.name === 'mypageMain' || this.$route.name === 'orderComplete')) {
              nativeUtil.closeWebView()
            } else if (isOsApp() && this.$route.params.backflag === 'home') {
              nativeUtil.closeWebView()
            } else {
              routerUtil.back()
            }
          }
          break
      }
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
    }
  }
}
</script>
