<template>
  <div class="cust_center_board_inquiry">
    <div
      v-if="answerList.length === 0 && isDataReadied"
      class="nodata"
    >
      <p>문의내역이 없습니다.</p>
      <div class="chat_guide">
        <p>채팅상담하신 내역이 있으신가요?</p>
        <router-link to="/custcenter/chat-counseling/history" class="btn_link">
          <span>채팅상담내역 확인하기</span>
        </router-link>
      </div>
    </div>

    <div
      v-if="answerList.length > 0"
      class="chat_guide"
    >
      <p>채팅상담하신 내역이 있으신가요?</p>
      <router-link to="/custcenter/chat-counseling/history" class="btn_link">
        <span>채팅상담내역 확인하기</span>
      </router-link>
    </div>

    <div
      v-if="answerList.length > 0"
      class="counsel_wrap"
    >
      <ul>
        <li
          v-for="(answer, index) in answerList"
          :key="index"
          class="item"
        >
          <div class="product_info">
            <figure
              v-if="answer.goodsName !== '' && answer.imageURL"
            >
              <a
                @click="moveDetail(answer)"
              >
                <ns-img
                  :product-number="answer.goodsId"
                  :width="144"
                  :height="144"
                  :alt="answer.goodsName"
                />
              </a>
            </figure>
            <div class="subject">
              <div class="category">
                <strong class="sort">
                  {{ answer.category }}

                </strong>
                <span
                  v-if="answer.category === '1:1문의'"
                  class="sort_detail"
                >
                  {{ answer.typenm }}
                </span>
                <span class="date">{{ answer.uploadDate.split(' ')[0] }}</span>
              </div>
              <a
                v-if="answer.goodsName !== ''"
                class="title"
                @click="moveDetail(answer)"
              >
                {{ answer.goodsName }}
              </a>
            </div>
          </div>
          <div
            class="counsel"
            @click="moveDetail(answer)"
          >
            <span
              class="state"
              :class="answer.className"
            >
              {{ answer.statusName }}
            </span>
            <span class="txt">{{ answer.title }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import uiUtil from '@/common/utils/uiUtil'
import loginUtil from '@/common/utils/loginUtil'
import { isNull, htmlDecode } from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'

export default {
  components: {
    NsImg
  },
  data () {
    return {
      isDataReadied: false,
      pageIdx: 1,
      rowPerPage: 20,
      totalCount: 0,
      answerList: [],
      object: {
        callback: this.getQnaList
      },
      isApiLoding: false
    }
  },
  mounted () {
    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)
  },
  created () {
    this.isDataReadied = false
    this.getQnaList()
  },
  methods: {
    /**
     * 문의 내역 가져오기
     * @returns {void|boolean}
     */
    getQnaList () {
      // 더 불러올 리스트가 있는지 체크
      if (this.pageIdx !== 1 && this.answerList.length >= this.totalCount) {
        return false
      }

      // 현재 로딩중이면
      if (this.isApiLoding) {
        return false
      }

      this.isApiLoding = true

      const param = {
        pageIdx: this.pageIdx,
        rowPerPage: this.rowPerPage,
        usersId: loginUtil.userId()
      }

      const successHandling = data => {
        this.isDataReadied = true
        if (!data || !data.msg || !data.msg.root) {
          return false
        }

        const answered = data.msg.root.questionListInfo

        this.totalCount = data.msg.root.totalCount

        for (let i = 0; i < answered.length; i++) {
          const brandName = answered[i].brandName
          const brand = !isNull(brandName) && brandName !== '미정의' ? `[${brandName}]` : ''

          answered[i].goodsName = htmlDecode(brand + answered[i].goodsName)
          answered[i].title = htmlDecode(answered[i].title)

          // 진행상태 & html class 설정
          if (answered[i].statusNm === '답변완료') {
            answered[i].statusName = '답변완료'
            answered[i].className = 'complete'
          } else if (answered[i].statusNm === '진행중') {
            answered[i].statusName = '처리중'
            answered[i].className = 'current'
          } else if (answered[i].statusNm === '접수') {
            answered[i].statusName = '답변대기'
            answered[i].className = 'standby'
          }

          // 문의 유형 설정
          if (answered[i].category === '일대일') {
            answered[i].category = '1:1문의'
          }
        }

        this.pageIdx++

        this.answerList = this.answerList.concat(answered)
        this.isApiLoding = false
      }

      this.$nsaxios.post('QuestionItemListInfo', param, successHandling)
    },

    /**
     * 문의 상세로 이동
     * @param {object} answer 문의/답변 객체
     */
    moveDetail (answer) {
      if (answer.category === '상품문의') {
        // 상품문의 유형인 경우
        this.$router.push(`/custcenter/board-inquiry/detail/product/${answer.seq}`)
      } else {
        // 1:1 문의 유형인 경우
        this.$router.push(`/custcenter/board-inquiry/detail/board/${answer.seq}`)
      }
    },

    /**
     * 무한 스크롤용 객체 초기화
     */
    initParamObject () {
      this.object.callback = this.getQnaList
      this.object.isEnable = true
      this.object.interval = 500
      this.object.triggerHeightPercent = 70
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterBoardInquiry";
</style>
