/* eslint-disable vue/valid-v-on */
<template>
  <div class="report_review">
    <p class="report_guide">
      악의적이거나 부정적인 의도로 상품평을 작성하는 고객님을 신고해 주세요. 신고가 접수되면 운영자가 신고대상 게시물을 검토하여 신고가 적절할 경우 해당 게시물을 삭제합니다.
      신고하시기 전에 신중하게 다시 한번 생각해보시고 신고해주세요.
    </p>
    <dl class="report_list">
      <dt>신고 사유가 무엇인가요?</dt>
      <dd>
        <input
          id="report_sort1"
          v-model="complainCd"
          value="01"
          type="radio"
          name="sort"
          checked
        >
        <label for="report_sort1">업체 및 상품에 대한 비방 내용</label>
      </dd>
      <dd>
        <input
          id="report_sort2"
          v-model="complainCd"
          value="02"
          type="radio"
          name="sort"
        >
        <label for="report_sort2">음란, 욕설 등 부적절한 내용</label>
      </dd>
      <dd>
        <input
          id="report_sort3"
          v-model="complainCd"
          value="03"
          type="radio"
          name="sort"
        >
        <label for="report_sort3">상업적 홍보 및 과대선전</label>
      </dd>
      <dd>
        <input
          id="report_sort4"
          v-model="complainCd"
          value="04"
          type="radio"
          name="sort"
        >
        <label for="report_sort4">타쇼핑몰 및 판매처 홍보</label>
      </dd>
      <dd>
        <input
          id="report_sort5"
          v-model="complainCd"
          value="05"
          type="radio"
          name="sort"
        >
        <label for="report_sort5">상품평 취지에 어긋남(복사글 등)</label>
      </dd>
      <dd>
        <input
          id="report_sort6"
          v-model="complainCd"
          value="06"
          type="radio"
          name="sort"
        >
        <label for="report_sort6">저작권 침해 또는 불량 사진 등록</label>
      </dd>
      <dd>
        <input
          id="report_sort7"
          v-model="complainCd"
          value="07"
          type="radio"
          name="sort"
        >
        <label for="report_sort7">기타</label>
      </dd>
    </dl>
    <dl class="report_list">
      <dt>신고 내용을 작성해 주세요.</dt>
      <dd>
        <div class="textarea">
          <label
            for="textarea"
            class="blind"
          >
            내용
          </label>
          <textarea
            v-model="reportText"
            placeholder="최대 2000자 까지 입력 가능합니다."
            maxlength="2000"
            @input="typing"
            @focus="focusEvent"
          />
        </div>
      </dd>
    </dl>
    <div class="btn_group">
      <button
        type="button"
        class="btn_cancel"
        @click="cancelReport"
      >
        <span>취소</span>
      </button>
      <button
        type="button"
        class="btn_register"
        :class="activateButton ? '' : 'in_active'"
        :disabled="!activateButton"
        @click="registerReport"
      >
        <span>등록하기</span>
      </button>
    </div>
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import toastUtil from '@frameworks/toastUtil'
import loginUtil from '@utils/loginUtil'
import REVIEW_CONST from '@/common/constants/product/review'
import reportReviewService from '@services/product/reportReviewService'
import {
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {}, // 공통 데이터
      reviewSeq: {}, // 상품평 순번
      reportText: '', // 신고 내용
      complainCd: '', // 신고 유형
      focusMoveIndex: 0 // 신고 내용 작성 키보드가 올라왔을 때 인풋 위치를 맞추는 작업을 시도한 횟수
    }
  },
  computed: {
    /**
     * 등록버튼 활성화 여부
     *
     * @returns {Boolean}
     */
    activateButton () {
      return !!this.reportText && !!this.complainCd
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.reviewSeq = this.param.seq
  },
  methods: {
    /**
     * 취소
     */
    cancelReport () {
      this.$router.go(-1)
    },
    /**
     * 길이 체크 위한 메서드
     *
     * @param {object} e event object
     */
    typing (e) {
      this.reportText = e.target.value
    },
    /**
     * 포커서시 Scroll bottom을 위한 메서드
     *
     * @param {object} e event object
     */
    focusEvent (e) {
      if (isOsApp() && viewType() === 'ios') {
        const scrollingElement = document.querySelector('.full_layer')
        scrollingElement.scrollTop = scrollingElement.scrollHeight
        console.log('ysjoo::scrollingElement.scrollTop >>>', scrollingElement.scrollTop)
        // 스크롤이 제대로 이동되었는지 파악 후 로직 재실행
        // 스크롤 이동 로직이 실행된 후에 키보드가 노출된 경우 scrollTop이 0으로 잡힘
        if (scrollingElement.scrollTop < 100 && this.focusMoveIndex < 3) {
          this.focusMoveIndex = this.focusMoveIndex + 1
          setTimeout(() => {
            this.focusEvent(e)
          }, 300)
        }
      }
    },
    /**
     * 신고 등록
     *
     */
    registerReport () {
      if (!this.activateButton) {
        return
      }
      const successHandling = response => {
        toastUtil.show(response.msg.root.result.message)
        popupUtil.close()
      }

      const registParams = {
        cmdType: REVIEW_CONST.REVIEW_CMD_TYPE.SET_REPORT,
        goodGrdSeq: this.reviewSeq,
        catentryId: this.globalVal.productInfo.catentryId,
        usersId: loginUtil.userId(),
        complainText: this.reportText,
        complainCd: this.complainCd
      }

      reportReviewService.registerReport(registParams, successHandling)
    }

  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/product/ReportReview";
</style>
