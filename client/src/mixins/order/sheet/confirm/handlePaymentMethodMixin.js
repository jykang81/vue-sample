import CONST from '@constants/framework/framework'
import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import messageUtil from '@frameworks/messageUtil'
import {
  onlyNumFormat,
  insertSeparatorPhoneNumber,
  viewType,
  extend,
  isNull,
  includeSpecialCharacter
} from '@utils/commonutil/commonUtil'

/**
 * HandlePaymentMethodMixin
 * onclick_btnPayment -> (ASIS) 결제수단별 결제정보 설정
 */
const handlePaymentMethodMixin = {
  methods: {
    /**
     * 결제수단 결제정보 설정 (handlePaymentMethod)
     * @returns {void}
     */
    handlePaymentMethod () {
      // 인증 정보
      const authCi = this.paymentData.OrderUserInfo.getItem().CI
      let strVanCo = '00' // 직승인 여부 코드

      // UserInfo에 휴대폰번호가 없을 경우, 배송지정보의 휴대폰번호를 가져옴
      let mobileNo = onlyNumFormat(this.paymentData.OrderUserInfo.getItem().PHONE1)
      if (mobileNo.length === 0) {
        const fullPhone = this.globalVal.deliveryInfo.data[0].phone11 +
                          this.globalVal.deliveryInfo.data[0].phone12 +
                          this.globalVal.deliveryInfo.data[0].phone13
        mobileNo = onlyNumFormat(fullPhone)
      }

      if (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT === 0) { // 최종 결제금액 0원
        // 폼 데이터에 반영
        this.globalVal.paymentMethodInfo.paymentMethod = isNull(this.globalVal.paymentMethodInfo.paymentMethod) ? PAY_TYPE_CONST.CREDIT_CARD : this.globalVal.paymentMethodInfo.paymentMethod
        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.CREDIT_CARD, // '100',
          requestCommand: 'RequestInfo',
          orderCompleteYn: 'N',
          payAmt: '0'
        })
      } else if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
        // 결제 수단이 신용카드일 경우 체크로직 추가
        if (this.globalVal.paymentMethodInfo.epCardCode === '') {
          messageUtil.alert('신용카드사를 선택해 주세요.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        // 결제 방식에 따라 값이 틀리다고 함.
        if (this.globalVal.paymentMethodInfo.epQuota === '00') {
          this.paymentData.Payment.setItem(0, {
            EP_mall_id: this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id_temp
          })

          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id = this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id_temp
        }

        let noinstFlagYn = '' // 무이자 할부여부
        // 결제금액 임시 저장
        this.globalVal.mOutputDatas.orderPrice.CREDITCARD_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
        if (this.globalVal.paymentMethodInfo.epQuota.indexOf('_n') > -1) {
          // 무이자할부
          this.paymentData.Payment.setItem(0, {
            EP_noinst_flag: 'Y',
            EP_noinst_term: `${this.globalVal.paymentMethodInfo.epCardCode.split('_')[1]}-${this.globalVal.paymentMethodInfo.epQuota.replace('_n', '')}`,
            EP_quota: this.globalVal.paymentMethodInfo.epQuota.replace('_n', ''),
            // 결제 방식에 따라 값이 틀리다고 함.
            EP_mall_id: this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id_free_temp
          })

          noinstFlagYn = 'Y'

          // 결제 방식에 따라 값이 틀리다고 함.
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id = this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id_free_temp
        } else {
          // 일반할부
          this.paymentData.Payment.setItem(0, {
            EP_noinst_flag: 'N',
            EP_noinst_term: '',
            EP_quota: this.globalVal.paymentMethodInfo.epQuota,
            // 결제 방식에 따라 값이 틀리다고 함.
            EP_mall_id: this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id_temp
          })

          noinstFlagYn = 'N'

          // 결제 방식에 따라 값이 틀리다고 함.
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id = this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_mall_id_temp
        }

        let strDiscount33YN = 'N' // 청구할인 여부
        if (this.globalVal.discountCardChoice.discountList33Info !== null) {
          if (this.globalVal.discountCardChoice.discountList33Info.length > 0) {
            strDiscount33YN = 'Y'
          }
        }

        let strPointMallYN = 'N' // 포인트몰 여부
        if (COMM_CONST.getCocd() === '750' || COMM_CONST.getCocd() === '905') {
          strPointMallYN = 'Y'
        }

        // 직승인 관련
        const selCard = this.globalVal.paymentMethodInfo.selectedCardData
        const moduleGubun = selCard.moduleGubun
        let strApvlChainNoLt = '' // 가맹점 번호

        // 직승인 카드사 (L : 롯데 / I : KB / P : 신한)
        if (moduleGubun === 'L' || moduleGubun === 'I' || moduleGubun === 'P') {
          if (selCard.DIRECT_YN === 'Y') {
            strVanCo = '20'
          }
        }

        // 결제정보수단카드값저장.
        let ecompCardName = null

        if (!this.globalVal.isGuest) {
          if (this.globalVal.paymentMethodInfo.checkedAgreePurchageSave) {
            ecompCardName = `${this.globalVal.paymentMethodInfo.epCardCode.split('_')[1]}|${this.globalVal.paymentMethodInfo.epCardText}` // 결제수단저장카드정보
          }
        }

        // 폼 데이터에 반영
        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.CREDIT_CARD, // '100',
          requestCommand: 'RequestInfo',
          orderCompleteYn: 'N',
          payAmt: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT),
          EP_product_amt: String(this.paymentData.Payment.getItem(0).TOTAL_PRODUCT_AMT),
          EP_user_nm: this.paymentData.OrderUserInfo.getItem().LASTNAME,
          EP_user_mail: this.paymentData.OrderUserInfo.getItem().EMAIL1,
          EP_user_phone2: insertSeparatorPhoneNumber(mobileNo, '-'),
          EP_usedcard_code: this.globalVal.paymentMethodInfo.epCardCode.split('_')[1],
          EP_card_no: this.globalVal.paymentMethodInfo.epCardNo,
          // 포인트 사용여부 구분 수정 - 미사용시 N 값으로 넘기게 수정..
          EP_point_useyn: (this.globalVal.paymentMethodInfo.checkedEpPointUseYn ? 'Y' : 'N'),
          custNum: this.paymentData.OrderUserInfo.getItem().USER_ID, // 고객번호
          str_apvl_chain_no_lt: strApvlChainNoLt,
          VAN_CO: strVanCo, // 직승인 사용 여부
          moduleGubun, // 결제모듈 구분값 추가
          usedcard_code: this.globalVal.paymentMethodInfo.epCardCode.split('_')[0],
          EcompCardName: ecompCardName // 결제수단저장카드정보
        })

        if (this.globalVal.isGuest) {
          // 기본데이타 변경
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_user_mail = this.paymentData.OrderUserInfo.getItem().EMAIL1
        }

        // 폼데이터 셋팅 시점 변경 및 분기 조건 변경
        // 기존 : 카드 코드 구분 -> 변경 : 모듈구분으로 변경
        if (moduleGubun === 'L' && strVanCo === '20') { // 롯데카드 직승인일 경우
          if (strDiscount33YN === 'Y') { // 청구할인
            if (noinstFlagYn === 'Y') { // 무이자
              strApvlChainNoLt = '9970164924'
            } else {
              strApvlChainNoLt = '9970164891'
            }
          } else if (strPointMallYN === 'Y') { // 포인트몰
            if (noinstFlagYn === 'Y') { // 무이자
              strApvlChainNoLt = '9985304450'
            } else {
              strApvlChainNoLt = '9985208560'
            }
          } else { // 일반
            if (noinstFlagYn === 'Y') { // 무이자
              strApvlChainNoLt = '9988286207'
            } else {
              strApvlChainNoLt = '9988189394'
            }
          }

          this.paymentData.Payment.setItem(0, {
            EP_mall_id: 'M201502243642M',
            mId: 'M201502243642M',
            VIEW_TYPE: viewType(),
            str_apvl_chain_no_lt: strApvlChainNoLt
          })
          this.nextValidation(authCi)
        } else if (moduleGubun === 'I' && strVanCo === '20') { // KB 직승인 추가
          const currentViewType = viewType()
          let wapUrl = ''
          let cancelUrl = ''
          let issuerCode = '' // 카카오뱅크 국민 구분 코드 추가
          const returnUrl = `https:${CONST.API_HOST}/nsmall/mobile/isp/isp_mob_result.jsp`

          if (currentViewType === 'ios') {
            wapUrl = 'nsmobilecert://isp'
            cancelUrl = 'nsmobilecert://isp'
          }
          // 카카오 뱅크 추가로 인한 KB와 분기 처리
          const cardName = this.globalVal.paymentMethodInfo.epCardText // 카드명
          if (cardName.indexOf('카카오') >= 0) {
            issuerCode = 'KA'
          } else {
            issuerCode = 'KBC'
          }

          // 간편로그인시 KB Card 결제오류 관련 추가
          const phoneNumber = this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_user_phone1
          const ispData = {
            LoginGubun: '1',
            PgId: '',
            ReturnUrl: returnUrl,
            WAPUrl: wapUrl,
            GoodName: this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_product_nm,
            Price: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT),
            Currency: 'WON',
            NoInt: (this.paymentData.Payment.getItem(0).EP_noinst_flag === 'N' ? 0 : 1),
            Noint_Inf: this.paymentData.Payment.getItem(0).EP_quota,
            // 간편로그인시 KB Card 결제오류 관련 수정
            HpNum: (phoneNumber === '' ? '010-8888-8888' : phoneNumber),
            MerchantNo: '',
            PubCertPrice: '',
            Tcode: '',
            IpAddr: '',
            TID: this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD].EP_order_no,
            CancelUrl: cancelUrl,
            CardCode: '',
            issuerCode,
            payMthd: (this.globalVal.paymentMethodInfo.checkedEpPointUseYn ? '9' : ''),
            EP_card_cocd: COMM_CONST.getCocd(),
            VAN_CO: strVanCo,
            moduleGubun, // 결제모듈 구분값 추가
            appGubun: 'HUB'
          }

          const paymentList = this.paymentData.Payment.getItem(0)
          extend(paymentList, ispData)

          this.doPaymentApprovalRequest({
            paymentList: JSON.stringify({ paymentList: [paymentList] })
          }, data => {
            if (data.msg.RESULTCODE === '10001000') {
              // 폼 데이터에 반영
              this.paymentData.Payment.setItem(0, {
                TId: data.msg.TID,
                MerchantNo: data.msg.MerchantNo,
                IpAddr: data.msg.IpAddr
              })

              this.nextValidation(authCi)
            } else {
              this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
              messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                this.$store.commit('popup/hide')
              })
            }
          })
        } else if (moduleGubun === 'P' && strVanCo === '20') { // 신한 직승인 추가
          this.paymentData.Payment.setItem(0, {
            Amt: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT),
            NoInt: this.paymentData.Payment.getItem(0).EP_noinst_flag
          })

          this.doPaymentApprovalRequest({
            paymentList: JSON.stringify({ paymentList: [this.paymentData.Payment.getItem(0)] })
          }, data => {
            if (data.msg.result === 'success') {
              const payLineData = {
                GoodsCnt: this.globalVal.mOutputDatas.msg.OrderGoodList.length,
                MID: data.msg.merchantID,
                EdiDate: data.msg.ediDate,
                EncryptData: data.msg.hash_String,
                payUrl: data.msg.payUrl,
                UserIP: data.msg.userIp,
                Moid: data.msg.Moid,
                BuyerTel: data.msg.buyerTel,
                BuyerName: data.msg.buyerNm,
                EP_card_cocd: COMM_CONST.getCocd(),
                BuyerEmail: data.msg.buyerEmail,
                BuyerAddr: data.msg.buyerAddres,
                ReturnURL: `https:${CONST.API_HOST}/nsmall/mobile/payline/payline_mob_result.jsp`
              }
              const paymentList = this.paymentData.Payment.getItem(0)
              extend(paymentList, payLineData)

              this.nextValidation(authCi)
            } else {
              this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
              messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                this.$store.commit('popup/hide')
              })
            }
          })
        }
      } else if (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymentMethodInfo.paymentMethod)) {
        // 결제금액 임시 저장
        this.globalVal.mOutputDatas.orderPrice.WITHOUT_BANKBOOK_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
        // 폼 데이터에 반영
        this.paymentData.Payment.setItem(0, {
          receipt_MobileNo: '',
          receipt_BusinessNo: '',
          PHONE_NUM: '',
          BIZ_REG_NUM: '',
          RECEIPT_TYPE: 'N'
        })

        if (this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER === null ||
              this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER === undefined ||
              this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER === '') {
          messageUtil.alert('본인인증 후 다시 시도 해 주세요.')
          this.globalVal.activeDoubleClick = false
          return false
        }
        if (this.globalVal.paymentMethodInfo.selectedBank === '') {
          messageUtil.alert('입금하실 은행을 선택 해 주세요.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (this.globalVal.paymentMethodInfo.selectedBankInfo.ACCT_NUM === 'nothing') {
          messageUtil.alert('선택하신 은행의 전용계좌 요청을 실패 하였습니다. 다시 시도해 주세요.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (this.globalVal.paymentMethodInfo.remitter.trim() === '') {
          messageUtil.alert('입금자명을 정확히 입력 해 주세요.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        // 특수문자 체크: 입금자명
        if (includeSpecialCharacter(this.globalVal.paymentMethodInfo.remitter)) {
          messageUtil.error(CONST.API_ERROR_MESSAGES[1].replace('{0}', '입금자명'), null)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (!this.validCashReceipt()) {
          this.globalVal.activeDoubleClick = false
          return false
        }
        // 폼 데이터에 반영
        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK, // '200',
          requestCommand: 'PayDeposit',
          orderCompleteYn: 'Y',
          payAmt: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT),
          DP_payScheduleAmt: String(this.paymentData.Payment.getItem(0).TOTAL_PRODUCT_AMT), // 결제예정금액(무통장 입금 만 해당)
          DP_payAmt: String(this.paymentData.Payment.getItem(0).TOTAL_PRODUCT_AMT), // 결제금액(무통장 입금 제외)
          DP_depositScheduleAmt: String(this.paymentData.Payment.getItem(0).TOTAL_PRODUCT_AMT), // 입금예정금액
          DP_remitter: this.globalVal.paymentMethodInfo.remitter,
          DP_payClassfyCd: '100', // 결제 분류코드(100=승인, 200=취소)
          DP_payTypeCd: PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK // '200'
        })
      } else if (PAY_TYPE_CONST.isRealtimeAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
        this.paymentData.Payment.setItem(0, {
          receipt_MobileNo: '', // 사업자 등록 번호
          receipt_BusinessNo: '', // 휴대폰 번호
          PHONE_NUM: '', // 휴대폰 번호
          BIZ_REG_NUM: '', // 사업자 등록 번호
          RECEIPT_TYPE: 'N' // 현금 영수증 종류 - N : 미사용, P : 소득공제용(일반개인용), B : 지출증빙용(사업자)
        })

        if (!this.validCashReceipt()) {
          this.globalVal.activeDoubleClick = false
          return false
        }

        // 결제금액 임시 저장
        this.globalVal.mOutputDatas.orderPrice.ACCOUNT_TRANSFER_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT

        // 폼 데이터에 반영
        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER, // '300',
          requestCommand: 'RequestInfo',
          orderCompleteYn: 'N',
          payAmt: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT),
          LGD_AMOUNT: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT)
        })
      } else if (PAY_TYPE_CONST.isMobile(this.globalVal.paymentMethodInfo.paymentMethod)) {
        // 결제금액 임시 저장
        this.globalVal.mOutputDatas.orderPrice.MOBILE_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT

        if (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT >= 300000) {
          messageUtil.alert('휴대폰 소액결제는 30만원 미만일 경우 가능합니다.')
          this.globalVal.activeDoubleClick = false
          return false
        }
        // 폼 데이터에 반영
        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.MOBILE, // '400',
          requestCommand: 'MobilePayInfo',
          orderCompleteYn: 'N',
          orderId: String(this.globalVal.mInputParams.orderId),
          payAmt: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT),
          Prdtprice: String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT),
          MC_No: onlyNumFormat(this.paymentData.OrderUserInfo.getItem().PHONE1),
          Payeremail: this.paymentData.OrderUserInfo.getItem().EMAIL1
        })
      } else if (PAY_TYPE_CONST.isPayco(this.globalVal.paymentMethodInfo.paymentMethod)) {
        // 결제금액 임시 저장
        this.globalVal.mOutputDatas.orderPrice.CREDITCARD_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
        const finalAmt = String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT)

        if (Number(finalAmt) < 1000) {
          messageUtil.alert('결제할 금액이 1,000원 미만인 경우 간편결제를 이용하실 수 없습니다.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.PAYCO, // '1400',
          requestCommand: 'RequestInfo',
          orderCompleteYn: 'N',
          payAmt: finalAmt
        })

        // 페이코 인증정보 폼에 최종결제 금액 반영
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO].payAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO].SupplyAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO].productPaymentAmt = finalAmt

        this.doPaymentApprovalRequest({
          paymentList: JSON.stringify({ paymentList: [this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO]] })
        }, data => {
          data.msg.RESULT_MSG = JSON.parse(data.msg.RESULT_MSG)
          if (data.msg && data.msg.result === 'success' && data.msg.RESULT_MSG.code === 0) {
            // 인증 성공시  응답 코드 셋
            const resultData = {
              orderSheetUrl: data.msg.orderSheetUrl,
              reserveOrderNo: data.msg.reserveOrderNo
            }
            extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO], resultData)
            this.nextValidation(authCi)
          } else {
            this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
            messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
              this.$store.commit('popup/hide')
            })
          }
        })
      } else if (PAY_TYPE_CONST.isNaverpay(this.globalVal.paymentMethodInfo.paymentMethod)) {
        // 결제금액 임시 저장
        this.globalVal.mOutputDatas.orderPrice.CREDITCARD_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
        const finalAmt = String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT)

        if (Number(finalAmt) < 1000) {
          messageUtil.alert('결제할 금액이 1,000원 미만인 경우 간편결제를 이용하실 수 없습니다.')
          this.globalVal.activeDoubleClick = false
          return false
        }

        let productTotalCnt = 0

        for (let i = 0; this.globalVal.mOutputDatas.msg.OrderGoodList.length > i; i++) {
          const goodsDetail = this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail
          productTotalCnt += Number(goodsDetail.QUANTITY)
        }

        /*
         * 카드(전체? 직승인?) 인증 진행 중 취소하고 네이버페이 결제 시도시 쇼핑몰 WAS에서
         * 네이버페이 결제에 필요한 parameter를 못 받아서 불필요한 parameters를 삭제하도록 수정.
         * "EP_"로 시작하는 parameter와 길이가 긴 EncryptData, ReturnURL, BuyerAddr를 삭제(초기화)처리 한다.
         */
        const curPayment = this.paymentData.Payment.getItem(0)
        for (const key in curPayment) {
          if (key.indexOf('EP_') > -1) {
            delete curPayment[key]
          }
        }
        delete curPayment.EncryptData
        delete curPayment.ReturnURL
        delete curPayment.BuyerAddr

        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.NAVER_PAY, // '1500',
          requestCommand: 'RequestInfo',
          orderCompleteYn: 'N',
          payAmt: finalAmt
        })

        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY].payAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY].SupplyAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY].productPaymentAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY].naverProdCnt = productTotalCnt

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

        this.doPaymentApprovalRequest({
          paymentList: JSON.stringify({ paymentList: [this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY]] })
        }, data => {
          if (data.isSuccessful) {
            // 인증 성공시  응답 코드 셋
            const resultData = {
              orderSheetUrl: 'test',
              reserveOrderNo: data.orderId
            }
            extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY], resultData)
            this.nextValidation(authCi)
          } else {
            this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
            messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
              this.$store.commit('popup/hide')
            })
          }
        })
      } else if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
        this.globalVal.mOutputDatas.orderPrice.CREDITCARD_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
        const finalAmt = String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT)

        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.NS_PAY_CREDIT_CARD, // '1600',
          requestCommand: 'RequestInfo',
          orderCompleteYn: 'N',
          payAmt: finalAmt
        })
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].payAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].SupplyAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].productPaymentAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].nspayOneTouchYn = this.globalVal.paymentMethodInfo.checkedNspayOneTouch ? 'Y' : 'N'

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

        this.doPaymentApprovalRequest({
          paymentList: JSON.stringify({
            paymentList: [this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD]]
          })
        }, data => {
          if (data.msg !== null && data.msg.result === 'success') {
            if (data.msg.nspayParams !== null) {
              // 인증 성공시  응답 코드 셋
              const resultData = {
                nspayParams: data.msg.nspayParams
              }
              extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD], resultData)

              this.nextValidation(authCi)
            } else {
              this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
              messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                this.$store.commit('popup/hide')
              })
            }
          }
        })
      } else if (PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
        this.globalVal.mOutputDatas.orderPrice.CREDITCARD_PAYMENT_AMT = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
        const finalAmt = String(this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT)

        this.paymentData.Payment.setItem(0, {
          payType: PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER, // '1700',
          requestCommand: 'RequestInfo',
          orderCompleteYn: 'N',
          payAmt: finalAmt
        })

        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].payAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].SupplyAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].productPaymentAmt = finalAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].nspayOneTouchYn = this.globalVal.paymentMethodInfo.checkedNspayOneTouch ? 'Y' : 'N'

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

        if (!this.validCashReceipt()) {
          this.globalVal.activeDoubleClick = false
          return false
        }

        this.doPaymentApprovalRequest({
          paymentList: JSON.stringify({
            paymentList: [this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER]]
          })
        }, data => {
          if (data.msg !== null && data.msg.result === 'success') {
            if (data.msg.nspayParams !== null) {
              // 인증 성공시  응답 코드 셋
              const resultData = {
                nspayParams: data.msg.nspayParams
              }
              extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER], resultData)

              this.nextValidation(authCi)
            } else {
              this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
              messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                this.$store.commit('popup/hide')
              })
            }
          }
        })
      }

      // 위 분기중 최종 결제 금액이 0 인경우 (상품권 및 적립금 사용) 는 아래 함수 호출
      if ((strVanCo !== '20' &&
            this.globalVal.paymentMethodInfo.paymentMethod !== PAY_TYPE_CONST.PAYCO &&
            this.globalVal.paymentMethodInfo.paymentMethod !== PAY_TYPE_CONST.NAVER_PAY &&
            this.globalVal.paymentMethodInfo.paymentMethod !== PAY_TYPE_CONST.NS_PAY_CREDIT_CARD &&
            this.globalVal.paymentMethodInfo.paymentMethod !== PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER) ||
            this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT === 0) {
        this.nextValidation(authCi)
      }
    }
  }
}
export default handlePaymentMethodMixin
