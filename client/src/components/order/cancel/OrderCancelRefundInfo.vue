<template>
  <div v-show="!globalVal.isOrderComplete && showRefundAmt" class="order_cancel_refund_info">
    <h3 class="subject line">
      환불정보
    </h3>
    <div class="total_price">
      <dl>
        <dt>총 상품금액</dt>
        <dd><strong>{{ totalProductAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 할인금액</dt>
        <dd><strong>{{ offerAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 배송비</dt>
        <dd><strong>{{ shipCharge }}</strong>원</dd>
      </dl>
      <dl class="total">
        <dt>환불 예상금액</dt>
        <dd><strong>{{ finalPaymentAmt }}</strong>원</dd>
      </dl>
      <dl class="payment_option">
        <template v-for="(paymentInfoItem, indexPaymentInfo) in paymentInfo">
          <dt :key="`dtOp${indexPaymentInfo}`">
            {{ paymentInfoItem.label }}
          </dt>
          <dd :key="`ddOp${indexPaymentInfo}`">
            {{ paymentInfoItem.text }}
            <span><strong>{{ paymentInfoItem.amt }}</strong>원</span>
          </dd>
        </template>
      </dl>
    </div>
  </div>
</template>

<script>
import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'
import {
  insertCommas
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      totalProductAmt: '',
      shipCharge: '',
      offerAmt: '',
      finalPaymentAmt: '',
      discountList: [],
      paymentInfo: [],
      showRefundAmt: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 결제금액 출력 (ASIS: setPaymentInfo)
     * @returns {void}
     */
    init () {
      const data = this.globalVal.orderDataInfo[0]

      this.totalProductAmt = insertCommas(Number(data.totalproduct)) // 상품합계금액
      this.shipCharge = insertCommas(Number(data.totalshipping)) // 배송비 합계금액
      this.offerAmt = insertCommas(Number(data.totaladjustment)) // 할인금액
      this.offerAmt = this.offerAmt === '0' ? this.offerAmt : `- ${this.offerAmt}`
      this.finalPaymentAmt = insertCommas(Number(data.totalpayment)) // 총 결제금액

      if (data.payms && data.payms.length > 0) {
        // 결제수단별 결제내역 sort
        data.payms.sort((a, b) => {
          return (Number(a.paySeq) - Number(b.paySeq))
        })

        // 적립금/예치금 등 사용금액 출력
        const pointData = [{
          displaytext: '상품권 사용금액', payAmt: 0
        }, {
          displaytext: '적립금/포인트/예치금 사용금액', payAmt: 0
        }]

        let isPoint500sum = false // 예치금 사용여부

        for (let i = 0; i < data.payms.length; i++) {
          if (PAY_ASSIST_CONST.CODES.includes(data.payms[i].paymentcode)) { // 포인트 관련 paymentcode, 포인트 관련 결제 내역만 출력
            if (data.payms[i].paymenttype === 'GIFTCARD') {
              pointData[0].payAmt += Number(data.payms[i].payAmt)
              continue
            }
            if (data.payms[i].paymenttype === 'POINT') {
              pointData[1].payAmt += Number(data.payms[i].payAmt)

              if (PAY_ASSIST_CONST.isDepositAmt(data.payms[i].paymentcode) && Number(data.payms[i].payAmt) > 0) { // 예치금
                isPoint500sum = true
              }
              continue
            }
            this.discountList.push({
              text: data.payms[i].displaytext,
              amt: insertCommas(data.payms[i].payAmt)
            })
          }
        }

        let dispChk = false // 예치금 체크 변수
        for (let i = 0; i < pointData.length; i++) {
          if (pointData[i].payAmt > 0) {
            this.discountList.push({
              text: pointData[i].displaytext,
              amt: insertCommas(pointData[i].payAmt)
            })
          }
        }

        // 결제수단별 결제금액 출력
        for (let i = 0; i < data.payms.length; i++) {
          const paymentCode = data.payms[i].paymentcode
          if (PAY_TYPE_CONST.isCodes(data.payms[i].paymentcode)) {
            this.globalVal.paymemntMethod = paymentCode
          }

          if (!PAY_ASSIST_CONST.isCodes(paymentCode) &&
              (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymemntMethod) ||
                PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymemntMethod)) &&
                  data.payms[i].paymdtls.length > 0) { // 신용카드, NS페이
            const textName = data.payms[i].paymdtls[0].relNm
            let textFree = ''
            if (data.payms[i].paymdtls[0].irFreeYn === 'Y') {
              textFree = `무이자${data.payms[i].paymdtls[0].irFreeInstmMmCnt}개월`
            } else if (data.payms[i].paymdtls[0].instmMmCnt === '00') {
              textFree = '일시불'
            } else {
              textFree = `${data.payms[i].paymdtls[0].instmMmCnt}개월`
            }
            this.paymentInfo.push({
              label: PAY_TYPE_CONST.isCreditCard(this.globalVal.paymemntMethod) ? '신용카드' : 'NS페이(카드)',
              text: PAY_TYPE_CONST.isCreditCard(this.globalVal.paymemntMethod) ? `${textName},${textFree}` : `NS페이(${textName}),${textFree}`,
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if (!PAY_ASSIST_CONST.isCodes(paymentCode) &&
                      (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ||
                        PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymemntMethod)) &&
                          data.payms[i].paymdtls.length > 0) { // 무통장
            const textMethod = PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ? '무통장 입금' : 'NS페이 계좌'
            this.globalVal.paymemntMethodStatus = data.cats[i].status
            this.paymentInfo.push({
              label: textMethod,
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })

            // 환불계좌 입력 란 보여줄지 여부 체크
            if (!this.globalVal.isRefundDisplay && data.status !== 'D') {
              this.globalVal.isRefundDisplay = true
            } else if (data.status === 'D' &&
                        (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ||
                          PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymemntMethod)) &&
                            isPoint500sum) {
              this.globalVal.isRefundDisplay = true
            }
          } else if (!PAY_ASSIST_CONST.isCodes(paymentCode) &&
                      (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ||
                      PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymemntMethod))) { // 무통장, NS페이 계좌
            const textMethod = PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ? '무통장 입금' : 'NS페이 계좌'
            this.globalVal.paymemntMethodStatus = data.cats[i].status
            this.paymentInfo.push({
              label: textMethod,
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if (!PAY_ASSIST_CONST.isCodes(paymentCode) &&
                      PAY_TYPE_CONST.isRealtimeAccountTransfer(this.globalVal.paymemntMethod) && data.payms[i].paymdtls.length > 0) { // 실시간계좌이체
            this.paymentInfo.push({
              label: data.payms[i].paymentname,
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if (!PAY_ASSIST_CONST.isCodes(paymentCode) &&
                      PAY_TYPE_CONST.isMobile(this.globalVal.paymemntMethod) && data.payms[i].paymdtls.length > 0) { // 휴대폰소액결제
            this.paymentInfo.push({
              label: data.payms[i].paymentname,
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if (!PAY_ASSIST_CONST.isCodes(paymentCode) &&
                      PAY_TYPE_CONST.isPayco(this.globalVal.paymemntMethod) && data.payms[i].paymdtls.length > 0) { // Payco
            const textPayco = data.payms[i].paymdtls[0].instmMmCnt === '00' ? '일시불' : `${data.payms[i].paymdtls[0].instmMmCnt}개월`
            this.paymentInfo.push({
              label: data.payms[i].paymentname,
              text: textPayco,
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else {
            this.paymentInfo.push({
              label: data.payms[i].paymentname.split(' ')[0],
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })
          }

          // 예치금 (교환은 예치금 환불 불가)
          if (PAY_ASSIST_CONST.isDepositAmt(data.payms[i].paymentcode) &&
              this.globalVal.action !== 'EXCHANGE') {
            dispChk = true
          }
        }

        // 무통장 입금대기중 일때 환불예상 금액을 숨김
        if (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) &&
            this.globalVal.paymemntMethodStatus === 'D' &&
            this.discountList.length === 0) {
          this.showRefundAmt = false
        }

        // 결제수단에 따른 환불방법선택 영역 표시 : 무통장(입금대기중), 실시간계좌이체, 예치금 결제일 경우에만 출력
        if ((PAY_TYPE_CONST.isDepositWithoutBankbook(data.payms[0].paymentcode) &&
              data.payms[0].paymdtls.length > 0) ||
              PAY_TYPE_CONST.isRealtimeAccountTransfer(data.payms[0].paymentcode) ||
              dispChk) {
          // 무통장 입금이고 환불 계좌번호 입력란 보여줄지 여부 체크
          if (PAY_TYPE_CONST.isDepositWithoutBankbook(data.payms[0].paymentcode) &&
              !this.globalVal.isRefundDisplay) {
            this.globalVal.isRefund = false
          } else {
            this.globalVal.isRefund = true
          }

          // 회원,비회원 별로 환불정보 선택
          if (!loginUtil.isLoggedIn()) { // 비회원
            this.globalVal.disabledRefundType1 = true // 예치금
            this.globalVal.refundType = this.globalVal.REFUND_TYPE.ACCOUNT // 계좌
          } else {
            this.globalVal.refundType = this.globalVal.REFUND_TYPE.ACCOUNT // 계좌
            this.globalVal.refundAccntOwner = this.globalVal.mOutputDatas.msg.root.userInfo.lastname
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/cancel/OrderCancelRefundInfo";
</style>
