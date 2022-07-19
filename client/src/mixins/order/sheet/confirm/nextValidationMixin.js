import nsaxios from '@frameworks/axiosUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'

/**
 * NextValidationMixin
 * onclick_btnPayment -> (ASIS) nextValidation
 */
const nextValidationMixin = {
  methods: {
    /**
     * 페이코 결제 ajax 시점 문제로 분기
     * 본인인증정보를 파라미터로 받는다
     * @param {String} authCi - 인증 CI
     * @returns {void}
     */
    nextValidation (authCi) {
      try {
        // 연간할인권은 단일결제 불가
        if (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT === 0) {
          const paymentList = this.paymentData.Payment.getJSON()
          if (paymentList.length < 2 && paymentList[0].payType === this.paymentData.Payment.getDefineValue('annualCoupons', 'payType')) {
            messageUtil.alert('연간할인권은 단일결제가 불가능합니다.')
            this.globalVal.activeDoubleClick = false
            return false
          }
        }

        // 공통 validation 체크
        if (!this.globalVal.confirmInfo.isCheckAgreePurchage) {
          messageUtil.alert('전자상거래법 제8조 제2항에 동의하셔야 합니다.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (this.globalVal.isGuest && !this.globalVal.confirmInfo.isCheckAgreeGuest) {
          messageUtil.alert('비회원 주문 정보 수집에 동의하셔야 합니다.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        // 비회원 월 주문 한도 금액 체크 후 처리
        const limitCheckParam = {}
        limitCheckParam.userId = this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID
        limitCheckParam.registerType = this.globalVal.mOutputDatas.msg.UserInfo.REGISTERTYPE // 유저 로그인 타입(회원K, 비회원G등)
        limitCheckParam.userCi = authCi // ci값은 최초 조회시(정회원 조회시) 빈스트링

        this.ShoppingAmtLimitCheckNext(limitCheckParam, this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT)
      } catch (e) {
        console.error(e)
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          this.globalVal.activeDoubleClick = false
          routerUtil.back()
        })
      }
    },

    /**
     * 총 주문금액 체크
     * (ASIS: 월 주문 한도 체크 로직 추가에 따른 수정, 비회의 경우 통신을 통해 금액을 체크 후 다음로직으로 이동)
     * @param {Object} limitCheckParam - 비회원 월 주문 한도 금액 체크 정보
     * @param {Number} finalPaymentAmt - 결제금액
     * @returns {void}
     */
    ShoppingAmtLimitCheckNext (limitCheckParam, finalPaymentAmt) {
      try {
        if (limitCheckParam.registerType === 'G') { // 비회원의 경우
          nsaxios.post('ShoppingAmtLimitCheckCmd', limitCheckParam, data => {
            this.globalVal.maxPaymentPrice = data.root.shoppinglimitprice
            if (Number(data.root.result) + Number(finalPaymentAmt) > this.globalVal.maxPaymentPrice) {
              messageUtil.alert('고객님의 총 주문 금액이 당사 기준을 초과하였습니다. 자세한 안내는 NS홈쇼핑 모바일 상담전화 (1800-0770(유료))를 통해 가능합니다.',
                () => {
                  routerUtil.back()
                })
              this.globalVal.activeDoubleClick = false
              return
            }

            this.checkNextPayment() // 결제전 최종 체크 로직 펑셩 호출
          })
        } else {
          this.checkNextPayment() // 결제전 최종 체크 로직 펑셩 호출
        }
      } catch (e) {
        // handle exception
        console.error(e)
        this.globalVal.activeDoubleClick = false
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }
    },
    /**
     * 결제전 최종 체크
     * (ASIS: 월 주문 한도 체크 로직 추가에 따른 수정, 결제 실행전 최종 체크항목 체크 후 결제하기 실행 펑션 호출)
     * @returns {void}
     */
    checkNextPayment () {
      try {
        // 제휴몰 데이터 셋팅
        this.setPartnershipData()

        // 환급성 상품구매 체크
        if (!this.checkLiquidity()) {
          this.globalVal.activeDoubleClick = false
          return false
        }

        // 판매불가 매장 체크
        this.checkNotSale(() => {
          this.executePaymentRequest() // 결제하기 실행
        })
      } catch (e) {
        // handle exception
        console.error(e)
        this.globalVal.activeDoubleClick = false
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }
    },

    /**
     * 환금성 상품구매 체크
     * @returns {void}
     */
    checkLiquidity () {
      try {
        const monthCnt = this.globalVal.mOutputDatas.msg.payCheck.month_cnt // 월간 쌀 구매 건수
        const monthAmt = this.globalVal.mOutputDatas.msg.payCheck.month_amt // 월간 쌀 구매 금액
        const yearAmt = this.globalVal.mOutputDatas.msg.payCheck.year_amt // 년간 쌀 구매 금액
        const dlrOrdCnt = this.globalVal.mOutputDatas.msg.payCheck.dlrOrdCnt // 하루동안 분유 주문건수

        if (Number(monthCnt) > 20) {
          messageUtil.alert('고객님의 쌀 월 구매갯수가 20건을 초과 하였습니다. NS홈쇼핑 모바일무료 상담 1800-0770으로 연락 주시면 결제 진행하도록 하겠습니다.')
          return false
        } else if (Number(monthAmt) > 4000000) { // 월 400 만원
          messageUtil.alert('고객님의 쌀 월 구매금액이 400만원을 초과 하였습니다. NS홈쇼핑 모바일무료 상담 1800-0770으로 연락 주시면 결제 진행하도록 하겠습니다.')
          return false
        } else if (Number(yearAmt) > 10000000) { // 년 1000 만원
          messageUtil.alert('고객님의 쌀 총 구매금액이 1,000만원을 초과 하였습니다. NS홈쇼핑 모바일무료 상담 1800-0770으로 연락 주시면 결제 진행하도록 하겠습니다.')
          return false
        } else if (Number(dlrOrdCnt) > 3) { // 하루 3개
          messageUtil.alert('죄송합니다. 해당 해당 상품은 3개이상 구매가 불가능합니다.')
          return false
        } else {
          return true
        }
      } catch (e) {
        // handle exception
        console.error(e)
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }
    },

    /**
     * 판매불가 매장 체크
     * @param {Function} callback - 판매불가 매장 체크 후 결제하기 실행 Function
     * @returns {void}
     */
    checkNotSale (callback) {
      try {
        if (this.globalVal.mOutputDatas.msg.payCheck.notSaleCheck === 'Y') {
          this.globalVal.activeDoubleClick = false
          messageUtil.confirm('NS몰 바로구매시 고객님이 경유하신 제휴사의 적립 및 할인 혜택은 유효하지 않습니다. 주문하시겠습니까?', callback)
        } else {
          callback()
        }
      } catch (e) {
        console.error(e)
        this.globalVal.activeDoubleClick = false
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }
    }
  }
}
export default nextValidationMixin
