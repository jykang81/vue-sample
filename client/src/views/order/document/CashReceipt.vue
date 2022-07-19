<template>
  <div class="cash_receipt">
    <div class="data_wrap">
      <ul class="month_list">
        <li v-for="month in 3" :key="month">
          <button
            type="button"
            :class="getPeriodClass(month)"
            @click="selectPeriod(month)"
          >
            {{ month }}개월
          </button>
        </li>
      </ul>
      <p
        class="month_list_message"
        :class="receiptList.length > 0 ? '' : 'border_none'"
      >
        3개월 이전 정보는 PC에서 확인가능합니다.
      </p>
      <ul v-if="receiptList.length > 0" class="data_list">
        <li v-for="(receiptObj, idx) in receiptList" :key="idx">
          <div class="date_state">
            <span>주문번호</span>
            <span>{{ receiptObj.orderNum }}</span>
          </div>
          <p class="title_receipt">
            {{ receiptObj.productName }}
          </p>
          <div class="flex">
            <p class="total">
              총 결제금액 {{ receiptObj.totalPayment }}원
            </p>
            <template v-if="receiptObj.buttonText === '신청하기'">
              <p>
                <button
                  type="button"
                  class="btn coral_border"
                  @click="applyReceipt(receiptObj)"
                >
                  <span>신청하기</span>
                </button>
              </p>
            </template>
            <template v-else-if="receiptObj.buttonText === '승인번호확인'">
              <p>
                <button
                  type="button"
                  class="btn gray_border"
                  @click="confirmReceipt(receiptObj)"
                >
                  <span>승인번호확인</span>
                </button>
              </p>
            </template>
            <template v-else-if="receiptObj.buttonText === '신청완료'">
              <p class="complete">
                신청완료
              </p>
            </template>
            <template v-else>
              <p class="impossible">
                신청불가
              </p>
            </template>
          </div>
        </li>
      </ul>
      <ul v-if="!tableShow" class="data_list">
        <li>
          <p class="nodata">
            신청가능한 내역이 없습니다.
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MEMBER_CONST from '@/common/constants/customer/member'
import messageUtil from '@frameworks/messageUtil'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import COMM_CONST from '@/common/constants/framework/constants'
import {
  insertCommas
} from '@utils/commonutil/commonUtil'
import modalUtil from '@frameworks/modalUtil'
import uiUtil from '@utils/uiUtil'
import cashReceiptService from '@services/order/document/cashReceiptService'

export default {
  name: 'CashReceipt',
  data () {
    return {
      currentSelected: 1,
      pageIdx: 1, // 페이지 인덱스
      pageSize: 5, // 페이징 사이즈
      totalCount: 0, // 전체 조회 내역 개수
      periodIdx: 3, // 조회기간 인덱스, 3 = 1개월
      periodMonth: 1, // 조회기간
      status: '', // 주문 상태
      startDate: '', // 조회 시작일
      endDate: '', // 조회 종료일
      pushFullEvent: false, // 스크롤 반응 이벤트 동작 여부
      clickBlocked: false, // 다중선택 방지용 플래그
      tableShow: true, // 조회 여부
      receiptList: [], // 조회된 데이터
      scrollObject: null, // io기반 무한 스크롤 객체
      isCallCashReceiptListInLoading: false // 조회중 플래그
    }
  },
  mounted () {
    this.onLoad()
  },
  beforeDestroy () {
    this.scrollObject.disconnect()
  },
  deactivated () {
    this.scrollObject.disconnect()
  },
  methods: {
    /**
     * Mounted Hook에서 Call되는 함수
     * @returns {void}
     */
    onLoad () {
      this.setPeriod()
      this.setInfiniteScrollObject()
    },
    /**
     * IO 기반 무한스크롤 객체 설정 함수
     * @returns {void}
     */
    setInfiniteScrollObject () {
      this.scrollObject = uiUtil.setInfiniteScroll(this, {
        callback: this.callCashReceiptList,
        options: {
          rootMargin: '100% 0px'
        }
      })
    },
    /**
     * 조회기간 버튼 선택시 Call되는 함수
     * @param {Number} month
     * @returns {void}
     */
    selectPeriod (month) {
      this.tableShow = true
      this.periodMonth = month
      this.currentSelected = month
      this.pageIdx = 1
      const periodIdxFlagNum = 2
      if (month > periodIdxFlagNum) {
        this.periodIdx = 4
      } else {
        this.periodIdx = 3
      }
      this.receiptList = []
      if (this.scrollObject) {
        this.scrollObject.disconnect()
      }
      this.setInfiniteScrollObject()
      this.setPeriod()
      this.callCashReceiptList()
    },
    /**
     * 선택된 조회기간 버튼 UI 렌더링용 함수
     * @param {Number} month
     * @returns {void}
     */
    getPeriodClass (month) {
      let isSelected = ''
      if (this.currentSelected === month) {
        isSelected = 'selected'
      }
      return isSelected
    },
    /**
     * 조회기간 데이터 정리 함수
     * @returns {void}
     */
    setPeriod () {
      const periodMonth = this.periodMonth
      this.startDate = calcDate('', 0, -periodMonth, 0, 0, 'yyyy.MM.dd')
      this.endDate = calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd')
    },
    /**
     * 현금영수증 목록 API Call 함수
     * @returns {void}
     */
    callCashReceiptList () {
      if (this.isCallCashReceiptListInLoading) {
        return
      }
      this.isCallCashReceiptListInLoading = true
      const invoke = {
        // 유동값
        pageidx: this.pageIdx, // 페이지 Index
        tmtyp: this.periodIdx, // 조회기간(1. 1주일 / 2. 15일 / 3. 1개월 / 4. 3개월 / 5. 6개월)
        odt1: this.startDate, // 조회시작일
        odt2: this.endDate, // 조회종료일
        status: this.status, // 주문상태
        // 고정값
        rowpage: this.pageSize, // 페이징 사이즈
        midx: COMM_CONST.DEFAULT_PARAMS.receipt.midx, // Menu Index (navi_11 : Default, navi_12 : 주문취소/변경, navi_13 : 교환/반품 신청, navi_14 : 입금확인/계좌관리, navi_15 : 증빙서류신청발급)
        channel: COMM_CONST.DEFAULT_PARAMS.receipt.channel, // 조회채널
        tasknm: COMM_CONST.DEFAULT_PARAMS.receipt.tasknm, // TaskName(NSOrderReceipt:영수증출력 화면, NSIssueReceiptInfo:영수증신청/발급 화면)
        storeId: COMM_CONST.DEFAULT_PARAMS.storeId,
        langId: COMM_CONST.DEFAULT_PARAMS.langId,
        catalogId: COMM_CONST.DEFAULT_PARAMS.storeId.base
      }
      const successHandling = response => {
        const pageData = response.msg.root.pageData
        if (this.pageIdx === 1 && (pageData == null || pageData.length === 0)) {
          this.tableShow = false
          this.isCallCashReceiptListInLoading = false
          this.scrollObject.disconnect()
        } else if (this.pageIdx > 1 && (pageData == null || pageData.length === 0)) {
          this.isCallCashReceiptListInLoading = false
          this.scrollObject.disconnect()
        } else {
          this.tableShow = true
          for (const pageEl of pageData) {
            const itemsum = pageEl.cats[0]
            const payInfo = pageEl.payms[0]
            const { payDttm } = payInfo
            const {
              cashreceiptAmount: cashReceiptAmount,
              cashReceiptStatus,
              taxBillStatus,
              selfCashReceiptStatus,
              apprNum,
              selfDealDate,
              selfAmt
            } = pageEl
            const totalPayment = insertCommas(pageEl.totalpayment)
            let cashReceiptButtonTxt = ''
            if (itemsum.status !== 'D' && cashReceiptAmount > 0 && cashReceiptStatus === 'N' && taxBillStatus === 'N' && selfCashReceiptStatus === 'N') {
              cashReceiptButtonTxt = COMM_CONST.RECEIPT_BUTTON_TEXT.APPLY
            } else if (cashReceiptAmount > 0 && cashReceiptStatus === 'Y' && taxBillStatus === 'N' && selfCashReceiptStatus === 'N') {
              cashReceiptButtonTxt = COMM_CONST.RECEIPT_BUTTON_TEXT.COMPLETE
            } else if (cashReceiptAmount > 0 && cashReceiptStatus === 'N' && taxBillStatus === 'Y' && selfCashReceiptStatus === 'N') {
              cashReceiptButtonTxt = COMM_CONST.RECEIPT_BUTTON_TEXT.COMPLETE
            } else if ((cashReceiptAmount > 0 && selfCashReceiptStatus === 'Y') || (cashReceiptAmount > 0 && selfCashReceiptStatus === 'I')) {
              cashReceiptButtonTxt = COMM_CONST.RECEIPT_BUTTON_TEXT.CHECK_NUM
            } else {
              cashReceiptButtonTxt = COMM_CONST.RECEIPT_BUTTON_TEXT.IMPOSSIBLE
            }
            const receiptObj = {
              orderNum: itemsum.ordersId,
              productName: itemsum.catentryName,
              buttonText: cashReceiptButtonTxt,
              totalPayment,
              cashReceiptAmount,
              apprNum,
              selfDealDate,
              selfAmt,
              payDttm
            }
            this.receiptList.push(receiptObj)
          }
          this.pageIdx++
          this.totalCount = response.msg.root.totalcnt
          this.isCallCashReceiptListInLoading = false
        }
      }
      const errorHandling = error => {
        console.debug(error)
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }
      cashReceiptService.callCashReceiptList(invoke, successHandling, errorHandling)
    },
    /**
     * 현금영수증 발급신청 버튼 선택시 Call되는 Popup 연계 함수
     * @param {Object} receiptObj
     * @returns {void}
     */
    applyReceipt (receiptObj) {
      const param = {
        ordersId: receiptObj.orderNum,
        totalpayment: receiptObj.totalpayment,
        cashreceiptAmount: receiptObj.cashReceiptAmount
      }
      const callback = () => {
        if (this.scrollObject) {
          this.scrollObject.disconnect()
        }
        this.setInfiniteScrollObject()
        this.receiptList = []
        this.tableShow = false
        this.pageIdx = 1
        this.callCashReceiptList()
      }
      modalUtil.show('order/document/CashReceiptApply', param, callback)
    },
    /**
     * 현금영수증 승인번호확인 버튼 선택시 Call되는 Popup 연계 함수
     * @param {Object} receiptObj
     * @returns {void}
     */
    confirmReceipt (receiptObj) {
      const param = {
        apprNum: receiptObj.apprNum,
        selfDealDate: receiptObj.selfDealDate,
        selfAmt: receiptObj.selfAmt,
        payDttm: receiptObj.payDttm
      }
      modalUtil.show('order/document/CashReceiptConfirm', param)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/document/CashReceipt";
</style>
