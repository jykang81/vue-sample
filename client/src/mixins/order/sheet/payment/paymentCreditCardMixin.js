import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import nsaxios from '@frameworks/axiosUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import {
  insertSeparatorPhoneNumber,
  isNull,
  insertCommas
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'

/**
 * PaymentCreditCardMixin
 */
const paymentCreditCardMixin = {
  data () {
    return {
      lastPayTypeCode: '',

      useCardList: [],
      bankList: [],

      // 무이자 개월수 노출을 위하여 사용된다.
      epQuotaList: [],
      epQuotaListType: '',
      selectedCardCodeEzPayCd: '',
      limitForCount: 0
    }
  },
  computed: {
    /**
     * NSPay 여부
     * @returns {Boolean}
     */
    isNSPay () {
      return this.globalVal.paymentMethodInfo.currentPayType === 'NSPay' || this.isNSPayCard || this.isNSPayAccTransfer
    },
    /**
     * NSPay 비활성화
     * @returns {Boolean}
     */
    disabledNSPay () {
      return this.globalVal.mOutputDatas.msg.UsePaymentInfo.NSPAY === 'N' || this.globalVal.isGuest
    },
    /**
     * NSPay 신용카드 여부
     * @returns {Boolean}
     */
    isNSPayCard () {
      return PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.currentPayType)
    },
    /**
     * NSPay 계좌이체 여부
     * @returns {Boolean}
     */
    isNSPayAccTransfer () {
      return PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymentMethodInfo.currentPayType)
    },
    /**
     * 카드 여부
     * @returns {Boolean}
     */
    isCard () {
      return PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.currentPayType)
    },
    /**
     * 카드 비활성화
     * @returns {Boolean}
     */
    disabledCard () {
      return this.globalVal.mOutputDatas.msg.UsePaymentInfo.CREDITCARD === 'N'
    },
    /**
     * 네이버페이 여부
     * @returns {Boolean}
     */
    isNaverpay () {
      return PAY_TYPE_CONST.isNaverpay(this.globalVal.paymentMethodInfo.currentPayType)
    },
    /**
     * 네이버페이 비활성화
     * @returns {Boolean}
     */
    disabledNaverpay () {
      return this.globalVal.mOutputDatas.msg.UsePaymentInfo.NAVERPAY === 'N'
    },
    /**
     * 페이코 여부
     * @returns {Boolean}
     */
    isPayco () {
      return PAY_TYPE_CONST.isPayco(this.globalVal.paymentMethodInfo.currentPayType)
    },
    /**
     * 페이코 비활성화
     * @returns {Boolean}
     */
    disabledPayco () {
      return this.globalVal.mOutputDatas.msg.UsePaymentInfo.PAYCO === 'N'
    },
    /**
     * 모바일 여부
     * @returns {Boolean}
     */
    isMobile () {
      return PAY_TYPE_CONST.isMobile(this.globalVal.paymentMethodInfo.currentPayType)
    },
    /**
     * 모바일 비활성화
     * @returns {Boolean}
     */
    disabledMobile () {
      return this.globalVal.mOutputDatas.msg.UsePaymentInfo.MOBILE === 'N'
    },
    /**
     * 무통장입금 여부
     * @returns {Boolean}
     */
    isDeposit () {
      return PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymentMethodInfo.currentPayType) &&
              !this.globalVal.paymentMethodInfo.isGalleria
    },
    /**
     * 무통장입금 비활성화
     * @returns {Boolean}
     */
    disabledDeposit () {
      return this.globalVal.mOutputDatas.msg.UsePaymentInfo.DEPOSIT === 'N'
    }
  },
  created () {
    // order sheet 의 this.globalVal, this.paymentData 에 data를 공유하여 사용가능하다.
    if (this.param && this.param.globalVal && this.param.paymentData) {
      this.globalVal = this.param.globalVal
      this.paymentData = this.param.paymentData
    }

    this.setCardList() // 카드목록
  },
  methods: {
    /**
     * selectbox trigger change EP_card_code
     * @param {String} epCardCode - 신용카드 value ()`${CARD_CO_CD}_${EZPAYCD}_${DIRECT_YN}_${CARD_SEQ}`)
     * @returns {void}
     */
    triggerChangeSelectEpCardCode (epCardCode = '') {
      // $("select[name=EP_card_code]").trigger("change"); 와 같은 코드를 처리한다.
      this.globalVal.paymentMethodInfo.epCardCode = epCardCode
      this.onchangeSelectEpCardCode()
    },

    /**
     * selectbox trigger change EP_noinst_flag
     * @param {String} epQuota - 할부개월수
     * @returns {void}
     */
    triggerChangeSelectEpNoinstFlag (epQuota = '00') {
      this.globalVal.paymentMethodInfo.epQuota = epQuota
      this.onchangeSelectEpQuota()
    },

    /**
     * 카드목록
     * @returns {void}
     */
    setCardList () {
      const tempUseCardList = this.globalVal.mOutputDatas.msg.UseCardList || []
      for (let i = 0; i < tempUseCardList.length; i++) {
        // KAKAO BANK 직승인이 아니면 카드리스트에서 노출되지 않도록 함
        if (!(tempUseCardList[i].CARD_CO_NM.indexOf('카카오') >= 0 &&
              tempUseCardList[i].DIRECT_YN === 'N')) {
          this.useCardList.push(tempUseCardList[i])
        }
      }
      return tempUseCardList
    },

    /**
     * 신용카드 탭 출력 -> (ASIS) setPaymentCreditCard
     * @param {Object} data - 주문서 response data
     * @param {String} epCardCode - 신용카드 value ()`${CARD_CO_CD}_${EZPAYCD}_${DIRECT_YN}_${CARD_SEQ}`)
     * @returns {void}
     */
    setPaymentCreditCard (data, epCardCode) {
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      this.globalVal.paymentMethodInfo.wrongMessage = ''

      if (this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD]) { // 결제수단별 탭 초기화를 한번만 처리.
        return false
      }
      if (data.UseCardList === null || data.UseCardList.length < 1) {
        return false
      }

      // 신용카드 목록 출력
      if (data.CardList === null || data.CardList.length < 1) {
        return false
      }

      this.setPaymentCreditCardApprovalRequest(() => {
        // 저장된 결제수단 설정시에만 사용한다.
        if (!isNull(epCardCode)) {
          this.globalVal.paymentMethodInfo.epCardCode = epCardCode
          this.onchangeSelectEpCardCode()
        }
      })
    },

    /**
     * 신용카드 결제 기본정보 요청 -> (ASIS) setPaymentCreditCard
     * @returns {void}
     */
    setPaymentCreditCardApprovalRequest (callback) {
      // 신용카드 결제 기본정보 요청
      this.doPaymentApprovalRequest({
        paymentList: JSON.stringify({ paymentList: [{ payType: PAY_TYPE_CONST.CREDIT_CARD, requestCommand: 'RequestInfo', payAmt: this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT }] })
      }, data => {
        if (data.msg && data.msg.result === 'success') {
          let strEpUserAddr = ''

          // 비회원 체크, 비회원이면 false
          if (loginUtil.checkLogonStatus()) {
            if (this.globalVal.mOutputDatas.msg.UserInfo.ADDRESS1.replace(/&amp;:/g, '').trim() !== '') {
              strEpUserAddr = this.globalVal.mOutputDatas.msg.UserInfo.ADDRESS1.replace(/&amp;:/g, ' ')
            } else {
              strEpUserAddr = ''
            }
          }

          // 결제수단별 초기화 기본데이터 저장
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = {
            EP_order_no: this.globalVal.mInputParams.orderId,
            EP_user_type: (this.globalVal.mOutputDatas.msg.UserInfo.REGISTERTYPE === 'G' ? '2' : '1'),
            EP_user_id: this.globalVal.mOutputDatas.msg.UserInfo.LOGONID,
            EP_user_nm: this.paymentData.OrderUserInfo.getItem().LASTNAME,
            EP_user_mail: this.paymentData.OrderUserInfo.getItem().EMAIL1,
            EP_user_phone1: insertSeparatorPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1),
            EP_user_addr: strEpUserAddr, // $.trim(this.globalVal.mOutputDatas.msg.UserInfo.ADDRESS1 + ' ' + this.globalVal.mOutputDatas.msg.UserInfo.ADDRESS2),
            EP_product_type: '0',
            EP_product_nm: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName,
            EP_product_expr: '',
            EP_tax_flg: 'N',
            EP_cert_type: data.msg.EP_cert_type,
            EP_mall_id: data.msg.EP_mall_id,
            EP_mall_id_temp: data.msg.EP_mall_id,
            EP_mall_id_free_temp: data.msg.EP_mall_id_free,
            EP_currency: data.msg.EP_currency,
            EP_agent_ver: data.msg.EP_agent_ver,
            EP_mall_nm: data.msg.EP_mall_nm,
            EP_mall_pwd: data.msg.EP_mall_pwd,
            EP_lang_flag: data.msg.EP_lang_flag,
            EP_ci_url: data.msg.EP_ci_url,
            EP_pay_type: '11',
            EP_card_code: '',
            EP_card_prefix: '',
            EP_ret_pay_type: '',
            EP_trace_no: '',
            EP_min_install_cnt: this.globalVal.mOutputDatas.minInstallCnt // 최대 무이자 개월수
          }

          if (!isNull(callback)) {
            callback()
          }
        }
      })
    },

    /**
     * 신용카드 타이틀 설정을 위한 정보
     * @returns {Object}
     */
    getCardTmplTitleInfo () {
      const name = this.globalVal.paymentMethodInfo.epCardText
      let quota = ''
      if (this.globalVal.paymentMethodInfo.epQuota === '00') {
        quota = '일시불'
      } else {
        quota = this.globalVal.paymentMethodInfo.dispEpQuotaList.filter(o => {
          return o.value === this.globalVal.paymentMethodInfo.epQuota
        })[0].text
      }

      return {
        name,
        quota
      }
    },

    /**
     * 바닥페이지 신용카드 타이틀 설정
     * @returns {void}
     */
    setFloorCardTmplTitle () {
      if (this.isFloorMode) {
        const data = this.getCardTmplTitleInfo()
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType, data.name, data.quota)
        if (isNull(data.name)) {
          this.globalVal.paymentMethodInfo.paymentMethodTitle = '결제수단을 선택해 주세요.'
        }
      }
    },

    /**
     * 신용카드 목록 선택 select onchange
     * @returns {void}
     */
    onchangeSelectEpCardCode () {
      /**
       * 신용카드 프로모션 데이터 처리 방식
       * - 카드 프로모션이 적용된 주문 결제 시 추가적으로 구현해야 할 프로세스 공유
       * 1. discountList에 카드프로모션 내역 추가시 ORDERITEMS 별로 카드할인 sub-list에 DIFF_AMT파라미터 추가
       *  A) 최종결제금액(상품금액 - 할인금액 + 배송비) 중
       *    i.   (신용카드결제금액 * 할인율)을 구하여 절상한다 >>> 실제로 주문에 할인 될 금액임
       *    ii.  (i에서 구한 겂) / 수량을 나누어서 ImdtDcCpAmt에 세팅
       *    iii. ImdtDcCpAmt * 수량 = DiscountPrice에 세팅 >>> DiscountPrice에는 "뻥튀기 된 금액"이 저장되어야 한다.
       *  B) 절상된(신용카드결제금액 * 할인율) - DiscountPrice 값 = DIFF_AMT로 세팅
       *
       *  A, B계산 중 원단위 결과가 나올 경우 절상하여 진행함(928.57원 > 930원)
       *
       * 2. 신용카드 프로모션 중 적립금, 청구할인 또한 선할인과 동일한 포맷으로 DISCOUNTlIST에 추가하여 API통해 전달되어야 함
       *    참고 - DC_TYPE_CD - 선할인   600
       *                        적립금   10130
       *                        청구할인 610
       */

      const arrSelectedEpCardCode = this.globalVal.paymentMethodInfo.epCardCode.split('_')
      const selectedCardData = this.useCardList.filter(o => { // 포인트카드 안내 에서도 사용됨 (ASIS) optData
        return o.CARD_CO_CD === arrSelectedEpCardCode[0] &&
               o.EZPAYCD === arrSelectedEpCardCode[1] &&
               o.DIRECT_YN === arrSelectedEpCardCode[2] &&
               o.CARD_SEQ === arrSelectedEpCardCode[3]
      })[0] || { CARD_CO_CD: '', CARD_CO_NM: '', DIRECT_YN: '', CARD_SEQ: '' }

      const epCardCode = this.globalVal.paymentMethodInfo.epCardCode
      const epCardCoCode = selectedCardData.CARD_CO_CD
      const epCardText = selectedCardData.CARD_CO_NM
      this.globalVal.paymentMethodInfo.selectedCardData = selectedCardData
      this.globalVal.paymentMethodInfo.epCardCoCode = epCardCoCode
      this.globalVal.paymentMethodInfo.epCardText = epCardText
      this.globalVal.paymentMethodInfo.epDirectYn = selectedCardData.DIRECT_YN

      // 포인트카드안내 영역 삭제
      this.globalVal.paymentMethodInfo.cardPointGuide.cardPreDc.isShow = false
      this.globalVal.paymentMethodInfo.cardPointGuide.selectedCard.isShow = false

      this.globalVal.paymentMethodInfo.hasCardPreDc = false // 카드 선할인 사용 유무 초기화
      this.globalVal.paymentMethodInfo.bFlagCard31 = false // 선할인 선택 여부 초기화
      this.globalVal.discountCardChoice.discountCardPreDc31 = false
      this.globalVal.discountCardChoice.discountCardPreDc32 = false
      this.globalVal.discountCardChoice.discountCardPreDc33 = false
      this.globalVal.discountCardChoice.discountList32 = null
      this.globalVal.discountCardChoice.discountList33 = null
      this.globalVal.discountCardChoice.discountList32Info = null
      this.globalVal.discountCardChoice.discountList33Info = null
      this.globalVal.bDiscount33selected = false

      // (NSSR-19278 주문결제페이지 내 일시불할인 자동적용) - 카드선택 시 일시불이 기본이므로 일시불할인 체크해준다.
      if (this.globalVal.discountInfo.showSinglePaymentDiscount) {
        if (!this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
          // 카드일시불할인 항목 사용가능여부 체크
          let totalLspRate = 0
          for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
            const vImdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
            totalLspRate += Number(vImdtDcCpAmt.PROM_VAL_LSP_RATE)
          }

          if (totalLspRate !== 0 &&
              this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn !== 'Y' &&
              this.globalVal.paymentMethodInfo.epQuota === '00') { // 할부조건 추가
            this.globalVal.discountInfo.checkedSinglePaymentDiscount = true
            this.onchangeSinglePaymentDiscount()
          }
        }
      }

      // 카드선할인 json정보 삭제
      if (this.globalVal.mOutputDatas.cardPreDcList.length > 0) {
        for (let i = 0; i < this.paymentData.Discount.size(); i++) {
          this.paymentData.Discount.removeCouponItem(i, this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX)
        }
        // 할인금액 정보 출력
        this.setDiscountAmount()
      }

      if (epCardCode.length > 0) {
        let objCardPreDc = null

        // 선택된 카드에 대한 할인가능 목록이 있는지 찾는다.
        if (this.globalVal.mOutputDatas.cardPreDcList.length > 0) {
          for (let i = 0; i < this.globalVal.mOutputDatas.cardPreDcList.length; i++) {
            if (this.globalVal.mOutputDatas.cardPreDcList[i].cardCoCd === epCardCoCode &&
                  this.globalVal.mOutputDatas.cardPreDcList[i].bnftType === '33') {
              objCardPreDc = this.globalVal.mOutputDatas.cardPreDcList[i]
              break
            } else {
              if (epCardCoCode === 'SH' &&
                    this.globalVal.mOutputDatas.cardPreDcList[i].cardCoCd === 'LG' &&
                    this.globalVal.mOutputDatas.cardPreDcList[i].bnftType === '33') {
                objCardPreDc = this.globalVal.mOutputDatas.cardPreDcList[i]
                break
              }
            }
          }
        }

        if (objCardPreDc != null) {
          // 청구할인:33
          if (objCardPreDc.bnftType === '33') {
            this.globalVal.bDiscount33selected = true
          }
        }

        this.setCardPointGuide(selectedCardData, objCardPreDc) // 신용카드 포인트 가이드 표시

        // 카드 선할인 경우... 31:선할인, 33:청구할인, 32:포인트적립
        if (objCardPreDc != null && objCardPreDc.bnftType === '31') { // 카드선할인인 경우
          const countPoint = this.getAllUseAmt() // 부가결제수단 입력액

          if (countPoint !== 0) { // 부가결제수단 입력액이 있으면
            messageUtil.confirm('선택하신 신용카드에 대한 제휴할인을 적용할 경우는 부가결제수단을 사용하실 수 없습니다.<br />진행하시겠습니까?',
              () => { // 예
                this.globalVal.paymentMethodInfo.bFlagCard31 = true // 선할인 카드 선택여부 세팅

                // 카드즉시할인 대상 카드이면 카드할인 금액 계산
                this.calcCardPreDcAmt(epCardCoCode, objCardPreDc) // (ASIS) setCardPreDcList
                // 할인금액 정보 출력
                this.setDiscountAmount()

                this.globalVal.paymentMethodInfo.hasCardPreDc = true
                this.globalVal.discountCardChoice.discountCardPreDc31 = true
              },
              () => { // 아니요
                this.triggerChangeSelectEpCardCode() // 신용카드 select 초기화
              },
              '예',
              '아니요'
            )
          } else { // 부가결제수단 입력액이 0인경우
            this.globalVal.paymentMethodInfo.bFlagCard31 = true // 선할인 카드 선택여부 세팅
            // 카드즉시할인 대상 카드이면 카드할인 금액 계산
            this.calcCardPreDcAmt(epCardCoCode, objCardPreDc) // (ASIS) setCardPreDcList
            // 할인금액 정보 출력
            this.setDiscountAmount()

            this.globalVal.paymentMethodInfo.hasCardPreDc = true
            this.globalVal.discountCardChoice.discountCardPreDc31 = true
          }
        } else {
          if (this.globalVal.discountInfo.showSinglePaymentDiscount) { // 할인영역에 있음
            if (!this.globalVal.discountInfo.checkedSinglePaymentDiscount && !this.globalVal.paymentMethodInfo.bFlagCard31) {
              this.$root.$emit('disabledAllExcludeEmployeeEmit')
            }
          }
        }

        if (objCardPreDc != null && objCardPreDc.bnftType === '32') { // 포인트 적립
          this.calcCardPointAmt(epCardCoCode, objCardPreDc) // (ASIS) setCardPreDcList32
          this.globalVal.discountCardChoice.discountCardPreDc32 = true
        } else if (objCardPreDc != null && objCardPreDc.bnftType === '33') { // 청구할인
          this.calcChargeDcAmt(epCardCoCode, objCardPreDc) // (ASIS) setCardPreDcList33
          this.globalVal.discountCardChoice.discountCardPreDc33 = true
        }
      } else {
        if (this.globalVal.discountInfo.showSinglePaymentDiscount) { // 할인영역에 있음
          if (!this.globalVal.discountInfo.checkedSinglePaymentDiscount && !this.globalVal.paymentMethodInfo.bFlagCard31) {
            this.$root.$emit('disabledAllExcludeEmployeeEmit')
          }
        }
      }

      this.selectedCardCodeEzPayCd = epCardCode
      if (this.selectedCardCodeEzPayCd.length > 6) {
        this.selectedCardCodeEzPayCd = this.selectedCardCodeEzPayCd.substring(0, 6)
      }

      this.globalVal.paymentMethodInfo.epQuota = '00'
      this.globalVal.paymentMethodInfo.checkedEpPointUseYn = false
      if (isNull(epCardCode)) {
        this.globalVal.paymentMethodInfo.dispEpQuotaList = [{ value: '00', text: '일시불' }]
      } else {
        this.instmMmsListView()
      }
    },

    /**
     * 카드 무이자 할부 리스트 호출
     * @returns {void}
     */
    instmMmsListView () {
      if (this.setEpNoinstFlagN()) {
        return
      }

      // 카드사별 무이자 할부 정보 API 호출
      // API 호출을 위한 기존 6자리에서 앞 2자리 substring
      let tCardVal = this.selectedCardCodeEzPayCd.substring(0, 2)
      const tEasyCode = this.selectedCardCodeEzPayCd.substring(3, 6)

      // 신한카드의 경우는 SH --> LG로 변경한다.
      if (tCardVal === 'SH' && tEasyCode === '029') {
        tCardVal = 'LG'
      }

      // 무이자 할부 확인하여 할부 option 다시 그림
      let nMaxForCnt = 12

      const successHandling = data => {
        if (data != null && data.isSuccessful) { // API를 통해서 카드 무이자 개월수를 받아 왔다면..
          if (this.setEpNoinstFlagN()) {
            return false
          }

          if (this.globalVal.mOutputDatas.minInstallCnt > 12 && data.list.length > 11) {
            nMaxForCnt = this.globalVal.mOutputDatas.minInstallCnt
          }

          if (nMaxForCnt < 13) { // 무이자 12개월 이하이면 무조건 2~12개월만 보여준다.
            this.limitForCount = 11
          } else if (nMaxForCnt - 1 > data.list.length) { // 무이자 상품 개월수가 카드 무이자 개월수보다 많으면 카드가 내려주는 무이자 개월수를 보여준다.
            this.limitForCount = data.list.length
          } else { // 무이자 상품 개월수를 보여준다.
            this.limitForCount = nMaxForCnt
          }

          if (data.list.length > 0) {
            this.epQuotaListType = '1'
            this.epQuotaList = data.list
          } else {
            this.epQuotaListType = '2'
            this.epQuotaList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          }
        } else {
          this.setDefaultEpQuota()
        }
        this.setDisplayEpQuotaList()
      }

      const errorHandling = () => {
        this.setDefaultEpQuota()
        this.setDisplayEpQuotaList()
      }

      nsaxios.post('NSMypageCommCmd', { tasknm: 'instmMmsList', var: tCardVal }, successHandling, errorHandling)
    },

    /**
     * 카드 무이자 할부 리스트
     * (ASIS: API 호출에 실패하면 기존 하드코딩 로직을 탄다.)
     * @returns {void}
     */
    setDefaultEpQuota () {
      let nMaxForCnt = 12
      this.epQuotaListType = '3'
      this.epQuotaList = []

      if (this.globalVal.mOutputDatas.minInstallCnt > 12 &&
            (this.selectedCardCodeEzPayCd === 'KM_016' || // 국민
             this.selectedCardCodeEzPayCd === 'SS_031' || // 삼성
             this.selectedCardCodeEzPayCd === 'SH_029' || // 신한
             this.selectedCardCodeEzPayCd === 'DN_027' || // 현대
             this.selectedCardCodeEzPayCd === 'BC_026' || // BC
             this.selectedCardCodeEzPayCd === 'AM_047' // 롯데
            )) {
        nMaxForCnt = this.globalVal.mOutputDatas.minInstallCnt
      }

      for (let k = 2; k <= nMaxForCnt; k++) {
        this.epQuotaList.push(k)
      }
    },

    /**
     * 무이자 개월수 설정
     * @returns {void}
     */
    setDisplayEpQuotaList () {
      if (isNull(this.globalVal.paymentMethodInfo.epCardCode)) {
        this.globalVal.paymentMethodInfo.dispEpQuotaList = [{ value: '00', text: '일시불' }]
        return false
      }

      const list = [{ value: '00', text: '일시불' }]

      const setOption = (_epQuota, flag) => {
        const epQuota = _epQuota < 10 ? `0${_epQuota}` : _epQuota
        if (flag) {
          return { value: `${epQuota}_n`, text: `${epQuota}개월(무이자)`, flag }
        } else {
          return { value: `${epQuota}`, text: `${epQuota}개월`, flag }
        }
      }

      if (this.epQuotaListType === '1') {
        for (let index = 0; index < this.limitForCount; index++) {
          const epQuotaItem = this.epQuotaList[index]
          const isFreeInterest = (index > this.limitForCount) ||
                                    (epQuotaItem <= this.globalVal.mOutputDatas.minInstallCnt)

          list.push(setOption(epQuotaItem, isFreeInterest))
        }
      } else if (this.epQuotaListType === '2') {
        for (let index = 0; index < this.limitForCount; index++) {
          const epQuotaItem = this.epQuotaList[index]
          const isFreeInterest = (epQuotaItem <= this.globalVal.mOutputDatas.minInstallCnt)

          list.push(setOption(epQuotaItem, isFreeInterest))
        }
      } else if (this.epQuotaListType === '3') {
        for (let index = 0; index < this.limitForCount; index++) {
          const epQuotaItem = this.epQuotaList[index]
          if (epQuotaItem > 12) { // 12개월 초과일 경우
            // 국민, 삼성, 신한 - 2~24, 36
            if ((this.selectedCardCodeEzPayCd === 'KM_016' ||
                  this.selectedCardCodeEzPayCd === 'SS_031' ||
                  this.selectedCardCodeEzPayCd === 'SH_029') &&
                  (epQuotaItem <= 24 || epQuotaItem === 36)) {
              list.push(setOption(epQuotaItem, true))
            }

            // 현대 - 2~12, 24, 36
            if ((this.selectedCardCodeEzPayCd === 'DN_027') &&
                  (epQuotaItem <= 12 || epQuotaItem === 24 || epQuotaItem === 36)) {
              list.push(setOption(epQuotaItem, true))
            }

            // 롯데 - 최대할부 24개월 - 2~24
            if ((this.selectedCardCodeEzPayCd === 'AM_047') &&
                  (epQuotaItem <= 24)) {
              list.push(setOption(epQuotaItem, true))
            }
          } else {
            // BC카드 최대 12개월까지만 표기
            const isFreeInterest = (epQuotaItem <= this.globalVal.mOutputDatas.minInstallCnt)
            list.push(setOption(epQuotaItem, isFreeInterest))
          }
        }
      }
      const temp = list.filter(o => {
        return o.flag
      })
      if (temp.length > 0) {
        const maxEpQuota = temp[temp.length - 1].value.replace('_n', '')
        list[0] = { value: '00', text: `일시불(무이자최대 ${maxEpQuota}개월 가능)` }
      }
      this.globalVal.paymentMethodInfo.dispEpQuotaList = list
    },

    /**
     * 신용카드 할부 선택 select onchange
     * @returns {void}
     */
    onchangeSelectEpQuota () {
      try {
        // 5만원 미만일 경우 할부 선택 불가 추가
        if (this.setEpNoinstFlagN()) {
          return
        } else {
          this.instmMmsListView()
        }

        // -(NSSR-19278 주문결제페이지 내 일시불할인 자동적용) - 일시불할인 체크하고 할부 선택 시
        if (this.globalVal.discountInfo.showSinglePaymentDiscount) {
          if (this.globalVal.discountInfo.checkedSinglePaymentDiscount && this.globalVal.paymentMethodInfo.epQuota !== '00') {
            // (NSSR-19278 주문결제페이지 내 일시불할인 자동적용) - 일시불할인 체크박스 적용상태에서, NS페이 할부 선택
            const strConfirmMsg = `${'할부를 선택하셔서 일시불 할인 ' + '-'}${insertCommas(this.paymentData.Payment.getItem(0).cardDcAmt)}원` + '이 취소됩니다. 할부결제를 하시겠습니까?'
            if (this.globalVal.paymentMethodInfo.enableDiscountQuota) {
              messageUtil.confirm(strConfirmMsg, () => {
                // 확인 - 신용카드 할부 + 일시불할인 미적용
                this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
                this.onchangeSinglePaymentDiscount()
                this.checkedPointNonQuota()
                this.setFloorCardTmplTitle()
              }, () => {
              // 취소 - 신용카드 일시불 + 일시불할인 적용
                this.globalVal.paymentMethodInfo.epQuota = '00'
                this.setFloorCardTmplTitle()
              }, '확인', '취소')
            }
          } else if (this.globalVal.paymentMethodInfo.epQuota === '00' && !this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
            // 카드일시불할인 항목 사용가능여부 체크
            let totalLspRate = 0
            for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
              const vImdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
              totalLspRate += Number(vImdtDcCpAmt.PROM_VAL_LSP_RATE)
            }

            if (totalLspRate !== 0 &&
                this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn !== 'Y' &&
                !this.globalVal.paymentMethodInfo.changeFinalAmtPaymentMethodCardEmit) {
              this.globalVal.discountInfo.checkedSinglePaymentDiscount = true
              this.onchangeSinglePaymentDiscount()
            }
          }
        }
        this.setFloorCardTmplTitle()
      } catch (e) {
        console.error(e)
        // handle exception
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }

      this.globalVal.paymentMethodInfo.enableDiscountQuota = true
    },

    /**
     * 일시불 설정
     * @returns {Boolean}
     */
    setEpNoinstFlagN () {
      const isLt = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT < 50000
      if (isLt && !isNull(this.globalVal.paymentMethodInfo.epCardCode)) {
        this.globalVal.paymentMethodInfo.dispEpQuotaList = [{ value: '00', text: `일시불${isLt ? '(5만원 이상할부가능)' : ''}` }]
        this.globalVal.paymentMethodInfo.epQuota = '00' // 일시불 선택시, 할부유형을 일반할부로 변경
      }
      return isLt
    },

    /**
     * 신용카드 포인트 가이드 표시
     * @param {Object} selectedCardData - 선택된 카드정보
     * @param {Object} objCardPreDc - 할인정보
     * @returns {void}
     */
    setCardPointGuide (selectedCardData, objCardPreDc) {
      // 결제선택 출력
      if (selectedCardData.POINTEX === 'Y') {
        this.globalVal.paymentMethodInfo.cardPointGuide.selectedCard.pointName = selectedCardData.POINT_NAME
        this.globalVal.paymentMethodInfo.cardPointGuide.selectedCard.isShow = true
      } else {
        this.globalVal.paymentMethodInfo.cardPointGuide.selectedCard.isShow = false
      }
    },

    /**
     * KB포인트리 사용시 무이자 12개월 이상일시 alert발생
     * @returns {void}
     */
    checkedPointNonQuota () {
      const quotaInfo = this.globalVal.paymentMethodInfo.epQuota.split('_')

      if (this.globalVal.paymentMethodInfo.epCardCoCode === 'KM' &&
          this.globalVal.paymentMethodInfo.epDirectYn === 'Y' &&
          this.globalVal.paymentMethodInfo.checkedEpPointUseYn) {
        if (quotaInfo.length >= 2 && quotaInfo[0] > 12) {
          this.globalVal.paymentMethodInfo.checkedEpPointUseYn = false
          this.globalVal.paymentMethodInfo.epQuota = '00'
          messageUtil.alert('KB국민카드 포인트리 결제 선택 시 무이자는 최대 12개월까지 가능합니다.')
        }
      }
    }
  }
}
export default paymentCreditCardMixin
