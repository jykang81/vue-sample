<template>
  <header class="app_header search_page border_none">
    <div class="header">
      <button
        type="button"
        class="back_btn"
        @click="goBack"
      >
        뒤로가기
      </button>
      <div class="search_wrap">
        <div class="search_inner">
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
        </div>
      </div>
      <div class="right_wrap">
        <button
          type="button"
          class="search_input"
          @click="doSearch"
        >
          검색
        </button>
      </div>
    </div>
  </header>
</template>
<script>
import { mapMutations } from 'vuex' // mapState, mapGetters, mapMutations
import routerUtil from '@frameworks/routerUtil'
import bizUtil from '@utils/bizUtil'
import { isOsApp } from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'AppSearchHeader',
  data () {
    return {
      paramData: this.$route.params,
      searchword: '' // 검색어
    }
  },
  computed: {
    /**
     * 검색결과 페이지 여부
     *
     */
    isSearchResultPage () {
      return this.$route.name === 'searchResult'
    }
  },
  watch: {
    '$route' (to) {
      if (this.isSearchResultPage) {
        this.paramData.searchTerm = to.params.searchword
        this.paramData.promotionText = to.params.promotionText
        this.paramData.tvTableFlag = false
        this.$refs.searchedKeyword.value = to.params.searchword
        this.searchword = to.params.searchword
      }
    }
  },
  created () {
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
  },
  methods: {
    /**
     * mutations(setter) 사용 선언부.
     * @param {String, Array} 'search', ['setSearchWordInfo', 'setFilterInfo']
     */
    ...mapMutations('search', [
      'setSearchWordInfo'
    ]),
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
     * 뒤로가기
     *
     */
    goBack () {
      routerUtil.back()
    }
  }
}
</script>
