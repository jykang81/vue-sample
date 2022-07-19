<template>
  <div class="inquiry_list">
    <button
      type="button"
      class="btn_inquiry"
      @click="gotoWriteQna"
    >
      <span>상품 문의하기</span>
    </button>
    <div class="total_wrap">
      <span class="total">총 <span class="num">{{ qAListCount }}건</span></span>
      <label>
        <input
          v-model="isOnlyMyInquiryChecked"
          type="checkbox"
          class="checkbox square"
          @change="showOnlyMyInquiry"
        >
        <span class="check_label">내 문의글만 보기</span>
      </label>
    </div>
    <div class="faq">
      <div class="faq_list">
        <ul>
          <li
            v-for="(qnaItem,index) in qnaList"
            :key="index"
          >
            <dl :class="getToggleYn(index)">
              <dt>
                <button
                  type="button"
                  class="btn question"
                  @click="setToggle(index)"
                >
                  {{ qnaItem.question }}
                </button>
                <div class="info">
                  <span class="id">{{ getMaskingStr(qnaItem.writer) }}</span>
                  <span class="date">{{ htmlDecode(qnaItem.questionDate) }}</span>
                </div>
              </dt>
              <dd class="answer">
                {{ qnaItem.status === "1" ? '아직 답변이 없습니다.' : htmlDecode(qnaItem.answer) }}
                <i v-if="qnaItem.isPrivate === 1"
                   class="icons_private"
                />
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <p v-show="qAListCount<1"
         class="nodata"
      >
        문의내역이 없습니다.
      </p>
    </div>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import LOGIN_CONST from '@constants/customer/login'
// import $store from '@/vuex'
import { mapState } from 'vuex'
import {
  getMaskingStr,
  unique,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import inquiryListService from '@services/product/info/inquiryListService'

export default {
  data () {
    return {
      globalVal: {},
      isOnlyMyInquiryChecked: false, // 내 문의글만 보기 체크 여부
      openedIndexList: [] // 토글 opened 인덱스
    }
  },
  computed: {
    ...mapState('login', ['loginParam']),
    /**
     * 문의 개수
     *
     * @returns {String}
     */
    qAListCount () {
      return this.globalVal?.qnaGuide?.qnaCnt || 0
    },
    /**
     * 문의 목록
     *
     * @returns {Array}
     */
    qnaList () {
      return this.globalVal?.detailQna
    }
  },
  created () {
    if (this.$route?.params?.globalVal) {
      this.globalVal = this.$route.params.globalVal
    } else {
      this.globalVal.partNumber = this.$route.params.partNumber
      this.getQAList()
      // this.globalVal = this.loginParam.globalVal
    }
  },
  methods: {
    htmlDecode,
    /**
     * 공통함수 getMaskingStr 함수
     *
     */
    getMaskingStr,
    /**
     * 내 문의글만 보기
     */
    showOnlyMyInquiry () {
      this.getQAList()
    },
    /**
     * 문의글 목록 가져오기
     */
    getQAList () {
      const successHandling = response => {
        this.$set(this.globalVal, 'qnaGuide', response.msg.root.qnaGuide)
        this.$set(this.globalVal, 'detailQna', response.msg.root.detailQna)
      }
      const params = {
        catentryId: this.globalVal.partNumber,
        pageId: 1,
        pageSize: 20,
        myQnAFlag: this.isOnlyMyInquiryChecked ? 'on' : 'off'

      }
      const isLogon = loginUtil.checkLogonStatus()
      const logonId = loginUtil.userId()

      if (!isLogon) {
        params.logonId = ''
      } else {
        params.logonId = logonId
      }

      inquiryListService.getQAList(params, successHandling)
    },
    /**
     * toggle open 여부
     *
     * @param {Number} index 글 인덱스
     * @returns {Boolean}
     */
    getToggleYn (index) {
      return this.openedIndexList.some(item => item === index) ? 'active' : ''
    },
    /**
     * 상품문의작성 페이지로 이동
     */
    gotoWriteQna () {
      const isLogon = loginUtil.checkLogonStatus()
      const globalVal = this.globalVal
      if (isLogon) {
        const params = {
          globalVal,
          partNumber: this.globalVal.partNumber
        }

        // $store.commit('login/setLoginParam', { globalVal })
        // this.$router.push({ name: 'writeInquiry', params })
        this.$router.push({ name: 'writeInquiry', params })
      } else {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, null, false, { globalVal })
      }
    },
    /**
     * 토글 설정
     * @param {Number} index 글 인덱스
     */
    setToggle (index) {
      this.openedIndexList = unique(this.openedIndexList)
      if (!this.getToggleYn(index)) {
        this.openedIndexList.push(index)
      } else {
        this.openedIndexList.splice(this.openedIndexList.indexOf(index), 1)
      }
    }

  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/info/InquiryList";
</style>
