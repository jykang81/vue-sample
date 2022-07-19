import {
  insertCommas
} from '@utils/commonutil/commonUtil'
import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'
import loginUtil from '@utils/loginUtil'

/**
 * orderReturnStepMixin
 */
const orderReturnStepMixin = {
  methods: {
    /**
     * 반품 상품정보
     * @returns {void}
     */
    setRefundOrdersInfo () {
      const data = this.globalVal.mOutputDatas.orders
      this.globalVal.textOrdersId = data.ordersId

      // 상품정보 출력
      this.catList = []
      if (data.cats && data.cats.length > 0) {
        for (let i = 0; i < data.cats.length; i++) {
          const item = data.cats[i]
          const addItem = {
            goodsCd: item.goodsCd,
            name: (item.brandName && item.brandName !== '미정의' ? `[${item.brandName}]` : '') + item.catentryName,
            catentryName: item.catentryName,
            price: insertCommas(item.price),
            quantity: insertCommas(item.quantity),
            totalproduct: insertCommas(item.totalproduct),
            attrs: [],
            showGift: false,
            gifts: []
          }

          if (item.attrs && item.attrs.length > 0) {
            for (let j = 0; j < item.attrs.length; j++) {
              addItem.attrs.push(item.attrs[j].attrvalDesc)
            }
          }

          if (item.subProducts && item.subProducts.length > 0) {
            for (let k = 0; k < item.subProducts.length; k++) {
              const subProductItem = item.subProducts[k]
              if (subProductItem.partgubun === 'GIFT') {
                if (subProductItem.attrs.length > 0) {
                  addItem.gifts.push({ name: subProductItem.name, attrs: [] })
                  for (let l = 0; l < subProductItem.attrs.length; l++) {
                    addItem.gifts[k].attrs.push({ value: subProductItem.attrs[l].value })
                  }
                } else {
                  addItem.gifts.push({ name: subProductItem.name, attrs: [{ value: '' }] })
                }
                addItem.showGift = addItem.gifts.length > 0
              }
            }
          }

          this.catList.push(addItem)
        }
      }
    },
    /**
     * 환불정보
     * @returns {void}
     */
    setPaymentInfo () {
      const data = this.globalVal.mOutputDatas.orders

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
        this.paymentInfo = []
        for (let i = 0; i < data.payms.length; i++) {
          this.globalVal.paymemntMethod = data.payms[i].paymentcode

          if ((PAY_TYPE_CONST.isCreditCard(this.globalVal.paymemntMethod) ||
                  PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymemntMethod)) &&
                    data.payms[i].paymdtls.length > 0) { // 신용카드, NS페이
            const textName = data.payms[i].paymdtls[0].relNm
            const textFree = (data.payms[i].paymdtls[0].irFreeYn === 'Y' ? `무이자${data.payms[i].paymdtls[0].irFreeInstmMmCnt}개월` : (data.payms[i].paymdtls[0].instmMmCnt === '00' ? '일시불' : `${data.payms[i].paymdtls[0].instmMmCnt}개월`))
            this.paymentInfo.push({
              label: PAY_TYPE_CONST.isCreditCard(this.globalVal.paymemntMethod) ? '신용카드' : 'NS페이(카드)',
              text: PAY_TYPE_CONST.isCreditCard(this.globalVal.paymemntMethod) ? `${textName},${textFree}` : `NS페이(${textName}),${textFree}`,
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if ((PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ||
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
          } else if (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ||
                        PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymemntMethod)) { // 무통장, NS페이 계좌
            const textMethod = PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) ? '무통장 입금' : 'NS페이 계좌'
            this.globalVal.paymemntMethodStatus = data.cats[i].status
            this.paymentInfo.push({
              label: textMethod,
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if (PAY_TYPE_CONST.isRealtimeAccountTransfer(this.globalVal.paymemntMethod) && data.payms[i].paymdtls.length > 0) { // 실시간계좌이체
            this.paymentInfo.push({
              label: data.payms[i].paymentname,
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if (PAY_TYPE_CONST.isMobile(this.globalVal.paymemntMethod) && data.payms[i].paymdtls.length > 0) { // 휴대폰소액결제
            this.paymentInfo.push({
              label: data.payms[i].paymentname,
              text: '',
              amt: insertCommas(data.payms[i].payAmt)
            })
          } else if (PAY_TYPE_CONST.isPayco(this.globalVal.paymemntMethod) && data.payms[i].paymdtls.length > 0) { // Payco
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
          if (!loginUtil.isLoggedIn() && !this.globalVal.isPrevStep) { // 비회원
            this.globalVal.disabledRefundType1 = true // 예치금
            this.globalVal.refundType = this.globalVal.REFUND_TYPE.ACCOUNT // 계좌
          } else if (!this.globalVal.isPrevStep) {
            this.globalVal.refundType = this.globalVal.REFUND_TYPE.ACCOUNT // 계좌
            this.globalVal.refundAccntOwner = this.globalVal.mOutputDatas.msg.root.userInfo.lastname
          }
        }
      }
    }
  }
}
export default orderReturnStepMixin
