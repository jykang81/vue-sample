<template>
  <div class="cust_center_faq">
    <div class="search_wrap">
      <router-link to="/custcenter/faq/search" class="search_input" @click.native="searchInputLogging">
        <span>궁금하신 사항을 입력해주세요</span>
      </router-link>
    </div>
    <ul class="faq_categoies">
      <li
        v-for="(cate, index) in categoies"
        :key="index"
      >
        <button
          type="button"
          class="btn"
          :class="idKey === cate.id ? 'active' : ''"
          @click="selectCate(cate.id, cate.name)"
        >
          {{ cate.name }}
        </button>
      </li>
    </ul>
    <div class="faq_list">
      <ul>
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
              >
                {{ item.question }}
              </button>
            </dt>
            <dd
              class="answer"
              v-html="htmlDecode(item.answer)"
            />
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import uiUtil from '@/common/utils/uiUtil'
import { htmlDecode } from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  data () {
    return {
      categoies: [
        { id: '01', name: '교환/반품/AS' },
        { id: '02', name: '주문/취소/변경' },
        { id: '03', name: '결제/환불' },
        { id: '05', name: '적립금/톨' },
        { id: '06', name: '배송안내' },
        { id: '07', name: 'NS홈쇼핑' },
        // { id: '08', name: '이벤트안내' },
        { id: '09', name: '회원가입/수정/탈퇴' },
        { id: '10', name: '사이트이용안내' },
        { id: '11', name: '거래증빙서류안내' },
        { id: '12', name: '오픈마켓/백화점이용안내' },
        { id: '13', name: 'NS상품권' },
        { id: '14', name: '간편결제서비스' }
      ],
      idKey: '01',
      pageId: 1,
      faqList: [],
      object: {
        callback: this.getNotice
      },
      isApiLoding: false,
      selectedId: ''
    }
  },
  computed: {
    htmlDecode () {
      return htmlDecode
    }
  },
  mounted () {
    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)
  },
  created () {
    if (this.$route.query.id) {
      this.idKey = this.$route.query.id
    }

    this.getFaqList()
  },
  methods: {
    /**
     * FAQ 리스트 불러오기
     * @returns {void|boolean}
     */
    getFaqList () {
      // 더 불러올 리스트가 있는지 체크
      if (this.pageId !== 1 && this.faqList.length < (this.pageId - 1) * 10) {
        return false
      }

      // 현재 로딩중이면
      if (this.isApiLoding) {
        return false
      }

      this.isApiLoding = true

      const param = {
        cmd_gubun: 'FL',
        tab_faq_gubun: this.idKey,
        pageId: this.pageId
      }

      const successHandling = data => {
        this.faqList = this.faqList.concat(data.msg.root.SecondDepth[0].faqList)
        this.pageId++
        this.isApiLoding = false
      }

      this.$nsaxios.post('FooterFAQListMobileReal', param, successHandling)
    },

    /**
     * 카테고리 선택 시 실행
     * @param {string} id 카테고리 ID
     * @param {string} name 카테고리 이름
     */
    selectCate (id, name) {
      if (this.idKey !== id) {
        this.idKey = id
        this.pageId = 1
        this.faqList = []

        this.getFaqList()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: 'FAQ_카테고리',
          eventLabel: `FAQ_${name}`,
          params: {
            t1: null
          }
        }
      })
    },

    /**
     * 질문 제목 선택 시
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
     * 무한 스크롤용 객체 초기화
     */
    initParamObject () {
      this.object.callback = this.getFaqList
      this.object.isEnable = true
      this.object.interval = 500
      this.object.triggerHeightPercent = 70
    },

    /**
     * 검색 input 클릭
     */
    searchInputLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: '검색',
          eventLabel: 'FAQ_검색',
          params: {
            t1: null
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterFaq";
</style>
