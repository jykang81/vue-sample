import CONST from '@constants/framework/framework'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import loginUtil from '@utils/loginUtil'
import {
  getCutBytes,
  viewType,
  isOsApp
} from '@utils/commonutil/commonUtil'
import {
  getTimeStamp
} from '@frameworks/dateutil/dateUtil'

/**
 * PaymentOtherMixin
 */
const paymentOtherMixin = {
  methods: {
    /**
     * 결제수단이 신용카드가 아닐 경우
     *  - 대상: 무통장입금(200),모바일(400),NSPay카드(1600),NSPay계좌(1700)
     *  - 제외: 신용카드(100), 네이버페이(1500), 페이코(1400)
     * (NSSR-19278 주문결제페이지 내 일시불할인 자동적용) - 신용카드 외 결제수단에서 일시불할인 체크
     */
    checkOtherPaymentMethod () {
      if (PAY_TYPE_CONST.isNotCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
        if (this.globalVal.discountInfo.showSinglePaymentDiscount &&
              !this.globalVal.discountInfo.checkedSinglePaymentDiscount &&
              PAY_TYPE_CONST.isNotNaverpay(this.globalVal.paymentMethodInfo.paymentMethod) &&
              PAY_TYPE_CONST.isNotPayco(this.globalVal.paymentMethodInfo.paymentMethod)) {
          // 카드일시불할인 항목 사용가능여부 체크
          let totalLspRate = 0
          for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
            const vImdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
            totalLspRate += Number(vImdtDcCpAmt.PROM_VAL_LSP_RATE)
          }

          if (totalLspRate !== 0 && this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn !== 'Y') {
            if (this.globalVal.completeOrderSheetDiscount) {
              this.globalVal.discountInfo.checkedSinglePaymentDiscount = true
              this.onchangeSinglePaymentDiscount()
            }
          }
        } else if ((!this.globalVal.discountInfo.checkedSinglePaymentDiscount &&
                  PAY_TYPE_CONST.isNaverpay(this.globalVal.paymentMethodInfo.paymentMethod) &&
                  PAY_TYPE_CONST.isNaverpay(this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode) &&
                  this.globalVal.checkedLastPayTypeSinglePaymentDiscountFlag) ||
                    (!this.globalVal.discountInfo.checkedSinglePaymentDiscount &&
                    PAY_TYPE_CONST.isPayco(this.globalVal.paymentMethodInfo.paymentMethod) &&
                    PAY_TYPE_CONST.isPayco(this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode) &&
                    this.globalVal.checkedLastPayTypeSinglePaymentDiscountFlag)) {
          this.globalVal.checkedLastPayTypeSinglePaymentDiscountFlag = false

          // 카드일시불할인 항목 사용가능여부 체크
          let totalLspRate = 0
          for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
            const vImdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
            totalLspRate += Number(vImdtDcCpAmt.PROM_VAL_LSP_RATE)
          }

          // 확인 - 신용카드_일시불선택 + 일시불할인 적용
          if (totalLspRate !== 0 && this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn !== 'Y') {
            const previousCurrentPayType = this.globalVal.paymentMethodInfo.currentPayType

            this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
            this.globalVal.discountInfo.checkedSinglePaymentDiscount = true
            this.onchangeSinglePaymentDiscount('checkOtherPaymentMethod')
            this.setCardByOtherPaymentMethod()
            this.clearPaymentMethod()

            if (PAY_TYPE_CONST.isNaverpay(previousCurrentPayType)) {
              this.globalVal.paymentMethodInfo.wrongMessage = '네이버페이는 일시불 할인 적용이 불가능한 결제수단입니다.'
            } else if (PAY_TYPE_CONST.isPayco(previousCurrentPayType)) {
              this.globalVal.paymentMethodInfo.wrongMessage = 'PAYCO는 일시불 할인 적용이 불가능한 결제수단입니다.'
            }
          }
        }

        // 카드선할인 json정보 삭제
        if (this.globalVal.mOutputDatas.cardPreDcList.length > 0) {
          for (let q = 0; q < this.paymentData.Discount.size(); q++) {
            this.paymentData.Discount.removeCouponItem(q, this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX)
          }
          // 할인금액 정보 출력
          this.setDiscountAmount()
        }

        for (let k = 0; this.globalVal.mOutputDatas.msg.OrderGoodList.length > k; k++) { // 상품 갯수 만큼 반복
          if (this.globalVal.mOutputDatas.msg.OrderGoodList[k].goodsDetail.VENDOR_ID === '109103') { // 제휴사코드가 갤러리아일 때
            this.globalVal.paymentMethodInfo.isGalleria = true
          }

          if (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode) &&
              PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymentMethodInfo.paymentMethod) &&
              this.globalVal.mOutputDatas.msg.OrderGoodList[k].goodsDetail.VENDOR_ID === '109103') {
            // ASIS: 마지막 결제수단이 무통장입금이었을때 신용카드 탭 트리거
            // TOBE: 결제수단 선택으로 처리한다.
            this.setCardByOtherPaymentMethod()
            break
          }
        }
      } else {
        if (PAY_TYPE_CONST.isNotMobile(this.globalVal.paymentMethodInfo.paymentMethod)) {
          this.$root.$emit('disabledReserved') // 할인영역 적립금 비활성화
        }
      }
    },
    /**
     * 저장된 휴대폰 결제 입금 정보 설장
     * @returns {void}
     */
    setSavedMobileInfo () {
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.MOBILE
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.MOBILE
      this.setMobileInfo()
    },
    /**
     * 휴대폰 결제 정보설정 (ASIS: setPaymentMobile)
     * @returns {void}
     */
    setMobileInfo () {
      // 휴대폰소액결제 결제 기본정보 요청
      this.doPaymentApprovalRequest({
        paymentList: JSON.stringify({ paymentList: [{ payType: PAY_TYPE_CONST.MOBILE, requestCommand: 'MobilePayInfo', payAmt: this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT }] })
      }, data => {
        if (data.msg && data.msg.result === 'success') {
          // 결제수단별 초기화 기본데이터 저장
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.MOBILE] = {
            orderId: this.globalVal.mInputParams.orderId,
            CALL_TYPE: data.msg.CALL_TYPE,
            CASH_GB: data.msg.CASH_GB,
            CONTRACT_HIDDEN: data.msg.CONTRACT_HIDDEN,
            Cryptstring: data.msg.Cryptstring,
            Cryptyn: data.msg.Cryptyn,
            EMAIL_HIDDEN: data.msg.EMAIL_HIDDEN,
            FOOTER_YN: data.msg.FOOTER_YN,
            HEIGHT: data.msg.HEIGHT,
            IFRAME_NAME: data.msg.IFRAME_NAME,
            INFOAREA_YN: data.msg.INFOAREA_YN,
            LOGO_YN: data.msg.LOGO_YN,
            MC_AUTHPAY: data.msg.MC_AUTHPAY,
            MC_AUTOPAY: 'N', // data.msg.MC_AUTOPAY, // 자동결제 여부
            MC_Cpcode: data.msg.MC_Cpcode,
            MC_DEFAULTCOMMID: data.msg.MC_DEFAULTCOMMID,
            MC_FIXCOMMID: data.msg.MC_FIXCOMMID,
            MC_FIXNO: data.msg.MC_FIXNO,
            MC_PARTPAY: data.msg.MC_PARTPAY,
            MC_SVCID: data.msg.MC_SVCID,
            MSTR: data.msg.MSTR,
            Notiemail: data.msg.Notiemail,
            PAY_MODE: data.msg.PAY_MODE,
            PRDT_HIDDEN: data.msg.PRDT_HIDDEN,
            Prdtcd: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.brandCd,
            // Prdtnm 30byte 길이재한 추가
            Prdtnm: getCutBytes(this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName, 20),
            Item: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.brandCd,
            Recordkey: data.msg.Recordkey,
            Sellernm: data.msg.Sellernm,
            Sellertel: data.msg.Sellertel,
            Signdate: getTimeStamp().substring(0, 14),
            Siteurl: data.msg.Siteurl,
            Tradeid: this.globalVal.mInputParams.orderId,
            Userid: this.globalVal.mOutputDatas.msg.UserInfo.MEMBER_ID
          }
        }
      })
    },
    /**
     * 저장된 페이코 입금 정보설정
     * @returns {void}
     */
    setSavedPaycoInfo () {
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.PAYCO
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.PAYCO
      this.setPaycoInfo()
    },
    /**
     * 페이코 설정 (ASIS: setPaymentPayco)
     * @returns {void}
     */
    setPaycoInfo () {
      const currentViewType = viewType()
      let inAppYn = 'N'
      let appUrl = ''

      if (currentViewType === 'android' || currentViewType === 'ios') {
        inAppYn = 'Y'
        if (currentViewType === 'ios') {
          appUrl = 'nsmall://'
        }
      }

      if (isOsApp()) {
        if (currentViewType === 'android' || currentViewType === 'ios') {
          inAppYn = 'Y'
          if (currentViewType === 'ios') {
            appUrl = 'nsmall://'
          }
        }
      }

      this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO] = {
        PayMethod: 'PAYCO',
        payType: PAY_TYPE_CONST.PAYCO,
        requestCommand: 'RequestInfo',
        /* 필수 : 상품단가 * 수량 */ SupplyAmt: '',
        /* 필수 : 상품결제단가 * 수량 */ productPaymentAmt: '',
        /* 필수 : 주문수량(배송비상품인 경우 1로세팅) */ orderQuantity: this.globalVal.mOutputDatas.msg.OrderGoodList.length,
        /* 필수 : 상품명 */ productName: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName,
        /* 필수 : 주문번호 */ sellerOrderReferenceKey: this.globalVal.mInputParams.orderId,
        /* 필수 : 고유상품키...?      */ sellerOrderProductReferenceKey: this.globalVal.mOutputDatas.orderItem.orderItemIds[0],
        /* 선택 : 주문채널 */ orderChannel: 'MOBILE',
        /* 선택 : 인앱결제 여부 */ inAppYn,
        /* 선택 : 개인통관 고유번호 입력 여부??? */ individualCustomNoInputYn: 'N',
        //  각 앱별로 reuturnUrl 경로가 다름
        /* 선택 : 결제완료 후 되돌아돌 URL */ returnUrl: `https:${CONST.API_HOST}/nsmall/mobile/payco/payco_mob_result.jsp`,
        /* iOS 앱결제시 NS앱호출 scheme */ appUrl,
        /* 페이코 결제시 entFlag 추가 */ entFlag: loginUtil.entFlag(),
        iframeYn: 'Y',
        /* busChnId 추가 */ busChnId: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId,
        /* partNumber 추가 */ partNumber: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.partNumber
      }
    },
    /**
     * 저장된 Naverpay 입금 정보설정
     * @returns {void}
     */
    setSavedNaverpayInfo () {
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NAVER_PAY
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NAVER_PAY
      this.setNaverpayInfo()
    },
    /**
     * 네이버페이 정보설정 (ASIS: setPaymentNaverPay)
     * @returns {void}
     */
    setNaverpayInfo () {
      const currentViewType = viewType()
      let inAppYn = 'N'
      let appUrl = ''

      if (currentViewType === 'android' || currentViewType === 'ios') {
        inAppYn = 'Y'
        if (currentViewType === 'ios') {
          appUrl = 'nsmall://'
        }
      }

      this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY] = {
        PayMethod: 'NAVERPAY',
        payType: PAY_TYPE_CONST.NAVER_PAY,
        requestCommand: 'RequestInfo',
        /* 필수 : 상품단가 * 수량 */ SupplyAmt: '',
        /* 필수 : 상품결제단가 * 수량 */ productPaymentAmt: '',
        /* 필수 : 주문수량(배송비상품인 경우 1로세팅) */ orderQuantity: this.globalVal.mOutputDatas.msg.OrderGoodList.length,
        /* 필수 : 상품명 */ productName: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName.substring(0, 120),
        /* 필수 : 주문번호 */ sellerOrderReferenceKey: this.globalVal.mInputParams.orderId + getTimeStamp().substring(0, 14),
        /* 필수 : 고유상품키...?      */ sellerOrderProductReferenceKey: this.globalVal.mOutputDatas.orderItem.orderItemIds[0],
        /* 선택 : 주문채널 */ orderChannel: 'MOBILE',
        /* 선택 : 인앱결제 여부 */ inAppYn,
        /* 선택 : 개인통관 고유번호 입력 여부??? */ individualCustomNoInputYn: 'N',
        //  각 앱별로 reuturnUrl 경로가 다름
        /* 선택 : 결제완료 후 되돌아돌 URL */ returnUrl: `http:${CONST.API_HOST}/nsmall/mobile/naverpay/naverpay_mob_result.jsp`,
        /* iOS 앱결제시 NS앱호출 scheme */ appUrl,
        /* 페이코 결제시 entFlag 추가 */ entFlag: loginUtil.entFlag(),
        userId: this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID
      }
    }
  }
}

export default paymentOtherMixin
