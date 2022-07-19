<template>
  <div class="cash_receipt_confirm">
    <h3 class="title">
      현금영수증 승인번호 확인
    </h3>
    <div class="cash_receipt_confirm_form">
      <table>
        <caption>현금영수증 승인번호 확인</caption>
        <tr>
          <th scope="row">
            거래일자
          </th>
          <td>{{ selfCashReceiptData.payDttm }}</td>
        </tr>
        <tr>
          <th scope="row">
            금액
          </th>
          <td>{{ selfCashReceiptData.selfAmt }}원</td>
        </tr>
        <tr>
          <th scope="row">
            승인번호
          </th>
          <td>
            {{ selfCashReceiptData.apprNum }}
            <button
              v-if="buttonShow"
              v-clipboard:copy="selfCashReceiptData.apprNum"
              v-clipboard:success="onClickUrlCopy"
              type="button"
              class="btn"
            >
              <span>복사</span>
            </button>
          </td>
        </tr>
      </table>
      <p class="guide_title">
        현금영수증 자진발급 등록방법
      </p>
      <ol>
        <li>
          국세청 홈택스 홈페이지 [조회/발급 - 현금영수증 수정 – 자진 발급분 소비자등록] 메뉴에서 '거래일, 승인번호, 금액'을 입력하여 사용자 등록
        </li>
        <li>
          또는 현금영수증 상담센터(☎126-1-1) ARS를 통해 사용자 등록
        </li>
      </ol>
      <ul>
        <li>
          - 사업자 지출증빙용은 NSmall 고객센터로 문의해주세요.
        </li>
        <li>
          - 승인번호는 아래 발급일의 다음 날부터 확인이 가능합니다.
        </li>
      </ul>
    </div>
    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="onClickCancle"
      >
        취소
      </button>
      <button
        type="button"
        class="btn coral"
        @click="onClickHomeTax"
      >
        홈택스 바로가기
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  insertCommas
} from '@utils/commonutil/commonUtil'
import toastUtil from '@frameworks/toastUtil'
import COMM_CONST from '@/common/constants/framework/constants'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  name: 'CashReceiptConfirm',
  props: {
    param: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      selfCashReceiptData: {}, // Props로 전달받은 현금영수증 데이터 정제하여 UI 렌더링하기 위한 데이터
      buttonShow: true // 복사 버튼 노출 유무
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    /**
     * Mounted Hook에서 Call되는 함수
     * @returns {void}
     */
    onLoad () {
      const propsObj = this.param
      let apprNum = propsObj.apprNum
      const selfAmt = insertCommas(propsObj.selfAmt)
      const payDttm = propsObj.payDttm.substring(0, 10)
      const selfDealDate = propsObj.selfDealDate
      if (apprNum == null || apprNum === '') {
        let selfDealDateStr = COMM_CONST.DEFAULT_PARAMS.receiptConfirm.selfDealDateStr
        this.buttonShow = false
        if (selfDealDate != null && selfDealDate !== '') {
          const selfDealDateInt = parseInt(selfDealDate.substring(0, 10), 10) + 2
          selfDealDateStr = selfDealDateInt.toString()
          selfDealDateStr = `${selfDealDateStr.substring(0, 4)}-${selfDealDateStr.substring(4, 6)}-${selfDealDateStr.substring(6, 8)} 09시 생성예정`
        }
        apprNum = selfDealDateStr
      }
      this.selfCashReceiptData = {
        selfDealDate,
        apprNum,
        selfAmt,
        payDttm
      }
    },
    /**
     * URL 복사 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickUrlCopy (value) {
      toastUtil.show('승인번호가 복사되었습니다.')
    },
    /**
     * 취소 버튼 선택시 Call되는 함수
     * @returns {void}
     */
    onClickCancle () {
      this.$store.commit('popup/hideWithoutBack')
    },
    /**
     * 홈택스 바로가기 선택시 Call되는 함수
     * @returns {void}
     */
    onClickHomeTax () {
      window.open(COMM_CONST.DEFAULT_PARAMS.receiptConfirm.homeTax)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/document/CashReceiptConfirm";
</style>
