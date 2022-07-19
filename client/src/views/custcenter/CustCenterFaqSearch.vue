<template>
  <div class="cust_center_faq_search faq">
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
              ref="search_input"
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
      v-if="!isInit && faqSearchText.trim() !== ''"
      class="search_result_top"
    >
      <p class="total">
        <strong>'<span class="result">{{ faqSearchText }}</span>'</strong> 검색결과
      </p>
    </div>
    <!-- 검색 결과 -->
    <ul
      v-if="!isInit && faqList.length > 0"
      class="auto_complete"
    >
      <li
        v-for="(item, index) in faqList"
        :key="index"
      >
        <dl
          :class="item.id === selectedId ? 'active' : ''"
        >
          <dt>
            <button
              type="button"
              class="btn question"
              @click="selectItem(item.id)"
              v-html="htmlDecode(item.question)"
            />
          </dt>
          <dd
            class="answer"
            v-html="htmlDecode(item.answer)"
          />
        </dl>
      </li>
    </ul>
    <!-- 검색 결과 없을 때 -->
    <p
      v-if="!isInit && faqList.length === 0"
      class="nodata"
    >
      검색결과가 없습니다.
    </p>
  </div>
</template>

<script>
import routerUtil from '@frameworks/routerUtil'
import uiUtil from '@/common/utils/uiUtil'
import {
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  data () {
    return {
      searchKeyword: '', // 검색어 (실시간 view)
      pageId: 1,
      faqList: [],
      object: {}, // 무한스크롤 바인딩용 객체
      isApiLoding: false,
      selectedId: '',
      isInit: true,
      faqSearchText: '' // 검색어 (API parameter)
    }
  },
  mounted () {
    this.$refs.search_input.focus()
    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)
    if (isOsApp()) { // APP
      nativeUtil.setBackBtnYn('Y')
    }
  },
  updated () {
    // 불러온 리스트가 디바이스 화면보다 작을 경우 스크롤이 안먹는 이슈가 있어서 높이에 따라 강제로 데이터 요청
    if (this.$el.offsetHeight > 0 && window.innerHeight > this.$el.offsetHeight) {
      this.getSearchResult()
    }
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

      this.pageId = 1
      this.faqList = []
      this.isInit = true
      this.faqSearchText = this.searchKeyword.trim()

      this.getSearchResult()

      if (document.querySelector('#app')) {
        document.querySelector('#app').classList.remove('hide')
      }
    },

    /**
     * 검색 결과 데이터 가져오기
     * @returns {void|boolean}
     */
    getSearchResult () {
      // 더 불러올 리스트가 있는지 체크
      if (this.pageId !== 1 && this.faqList.length < (this.pageId - 1) * 10) {
        return false
      }

      // 현재 로딩중이면
      if (this.isApiLoding) {
        return false
      }

      // 검색어 값이 빈 문자열
      if (this.faqSearchText === '') {
        return false
      }

      this.isApiLoding = true

      const param = {
        faq_sch_txt: this.faqSearchText,
        pageId: this.pageId
      }

      const successHandling = data => {
        if (data && data.msg && data.msg.root) {
          const faqList = data.msg.root.SecondDepth[0].faqList

          for (let i = 0; i < faqList.length; i++) {
            const regKey = new RegExp(this.searchKeyword, 'g')
            const replaceKey = `&lt;strong&gt;${this.searchKeyword}&lt;/strong&gt;`

            faqList[i].question = faqList[i].question.replace(regKey, replaceKey)
            faqList[i].answer = faqList[i].answer.replace(regKey, replaceKey)
          }
          this.faqList = this.faqList.concat(faqList)
          this.pageId++
          this.isApiLoding = false
          this.isInit = false
        }
      }

      const errorHandling = () => {
        this.isApiLoding = false
      }

      this.isApiLoding = true
      this.$nsaxios.post('FooterFAQListMobileReal', param, successHandling, errorHandling)
    },

    /**
     * 질문 선택 시
     * @param {string} id 질문 아이디
     */
    selectItem (id) {
      if (this.selectedId === id) {
        this.selectedId = ''
      } else {
        this.selectedId = id
      }
    },

    /**
     * 키워드 제거 및 리스트 초기화
     */
    removeSearchKeyword () {
      this.searchKeyword = ''
      this.faqSearchText = ''
      this.pageId = 1
      this.faqList = []
      this.isInit = true
    },

    /**
     * 무한 스크롤용 객체 초기화
     */
    initParamObject () {
      this.object.callback = this.getSearchResult
      this.object.interval = 500
      this.object.triggerHeightPercent = 70
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterFaqSearch";
</style>
