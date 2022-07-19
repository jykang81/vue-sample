<template>
  <div class="participation_winner_search">
    <header class="app_header search_page">
      <div class="header">
        <button
          type="button"
          class="back_btn"
          @click="moveBack"
        >
          뒤로가기
        </button>
        <div class="search_wrap">
          <div class="search_inner">
            <label
              for="label_search"
              class="blind"
            >
              검색어 입력
            </label>
            <input
              id="label_search"
              ref="searchKeyword"
              v-model="searchKeyword"
              type="text"
              class="search_input"
              placeholder="검색어를 입력해주세요"
              title="검색어입력"
              required
              @keyup="onTextWrite"
            >
            <button
              v-show="String(searchKeyword).trim() !== ''"
              type="button"
              class="reset_btn"
              @click="removeSearchKeyword"
            >
              <span>검색어초기화</span>
            </button>
          </div>
        </div>
        <div class="right_wrap">
          <button
            type="button"
            class="search_input"
            @click="onSearchClick"
          >
            검색
          </button>
        </div>
      </div>
    </header>
    <div
      v-if="searchKeyword.trim() !== ''"
      class="search_result_top"
    >
      <p class="total">
        <strong>'<span class="result">{{ searchKeyword }}</span>'</strong> 검색결과
      </p>
    </div>
    <!-- 검색 결과 -->
    <ul
      v-for="(item, index) in winnerList"
      v-show="!isInit && isList && winnerList.length > 0"
      :key="index"
      class="winnder_announce_list"
    >
      <li @click="onclickDetailNotice(item)">
        <p class="title">
          <i v-if="item.recGb === 'VIP'" class="vip">VIP</i>
          {{ htmlDecode(item.title) }}
        </p>
        <p class="date">
          당첨발표일 : {{ item.wnrDt }}
        </p>
      </li>
    </ul>
    <!-- 검색 결과 없을 때 -->
    <p
      v-if="!isInit && !isList && winnerList.length === 0"
      class="nodata"
    >
      검색결과가 없습니다.
    </p>
  </div>
</template>

<script>
import routerUtil from '@frameworks/routerUtil'
import uiUtil from '@/common/utils/uiUtil'
import messageUtil from '@frameworks/messageUtil'

import winnerMixin from '@/mixins/event/winnerMixin'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

export default {
  name: 'ParticipationWinnerSearch',
  mixins: [
    winnerMixin
  ],
  data () {
    return {
      searchKeyword: '',
      pageId: 0,
      winnerList: [],
      isApiLoding: false,
      totalCount: 0,
      isList: true,
      isListForFlg: true,
      isInit: true,
      isScroll: false,
      object: {
        callback: this.getNoticeListMobile
      },
      recGb: ''
    }
  },
  activated () {
    this.$refs.searchKeyword.focus()

    // 이전 페이지가 참여한 이벤트 페이지일때만 검색 이력 초기화
    const referer = this.$route.meta.refer
    if (referer === 'participationWinner') {
      this.searchKeyword = ''
      this.winnerList = []
      this.isScroll = false
      this.isInit = true
    }
  },
  created () {
    this.recGb = this.$route.params.recGb
  },
  mounted () {
    this.$refs.searchKeyword.focus()
  },
  methods: {
    htmlDecode,
    /**
     * 뒤로가기
     */
    moveBack () {
      routerUtil.back()
    },

    /**
     * 검색창에 검색어 입력 시
     * @param {object} e
     */
    onTextWrite (e) {
      // 모바일 디바이스에서 v-model 사용 시 값 갱신이 되지 않아 강제로 할당
      this.searchKeyword = this.$el.querySelector('#label_search').value

      if (e.keyCode === 13) {
        this.onSearchClick()
        this.$refs.searchKeyword.blur()
      }
    },

    /**
     * 검색 버튼 클릭
     * @returns {void|boolean}
     */
    onSearchClick () {
      if (this.searchKeyword.trim() === '') {
        messageUtil.alert('검색할 단어를 입력해주세요.')
        return false
      }

      if (!this.isScroll) {
        uiUtil.setInfiniteScroll(this, {
          callback: this.getNoticeListMobile,
          conditionCallback: this.isGetList,
          targetElement: this.$refs.listEnd
        })
        this.isScroll = true
      }

      this.pageId = 1
      this.winnerList = []
      this.isList = false
      this.isInit = false

      this.getNoticeListMobile()
    },

    /**
     * 키워드 제거 및 리스트 초기화
     */
    removeSearchKeyword () {
      this.searchKeyword = ''
      this.pageId = 1
      this.winnerList = []
      this.isList = false
      this.isInit = true
    },
    /**
     * 리스트 통신중 여부 확인
     *
     * @returns {boolean}
     */
    isGetList () {
      return this.isListForFlg
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/event/ParticipationWinnerSearch";
</style>
