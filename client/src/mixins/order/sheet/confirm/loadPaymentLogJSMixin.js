import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import {
  serializeToObject,
  extend,
  viewType
} from '@utils/commonutil/commonUtil'
import nsaxios from '@frameworks/axiosUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'

/**
 * LoadPaymentLogJSMixin
 * onclick_btnPayment -> (ASIS) setPaymentLogJS
 */
const loadPaymentLogJSMixin = {
  methods: {
    /**
     * 결제 전 인증 전후 값 로그 적재
     * @param {String} reqresType - 인증전 E, 인증후 O
     * @param {String} ordersId - 주문번호
     * @param {String} payAmt - 결제금액
     * @param {String} payTypeCd - 결제유형
     * @param {Object} frmPay - 결제정보
     * @returns {void}
     */
    loadPaymentLogJS (reqresType, ordersId, payAmt, payTypeCd, frmPay) {
      const invokeParams = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nspayment.helper.NSPaymentLogTableJDBCHelper',
          mnm: 'xpayapprLog',
          args: {
            ordersId,
            paySeq: '0',
            apprSeq: '0',
            reqresType,
            payClssfCd: '000',
            payTypeCd,
            requestCmd: 'Certification',
            payAmt,
            apprLog: frmPay
          }
        })
      }

      // 결제 인증 전후 로그 적재 실행
      nsaxios.post('NSMypageCommCmd', invokeParams, data => {
        if (reqresType === 'E') { // 인증 전 콜백처리 진행
        } else if (reqresType === 'O') { // 인증 후 콜백처리 진행
          // Native에서 넘어오는 String 파라미터는 json으로 파싱
          frmPay = serializeToObject(frmPay)

          // 롯데카드 직승인 구분값 추가 - usercard_code or modulGubun
          if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.objPaymentCertData.payType) &&
                this.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO === '20' &&
                this.globalVal.paymentMethodInfo.objPaymentCertData.usedcard_code === 'AM') {
            if (frmPay.result === '0000') {
              this.globalVal.paymentMethodInfo.objPaymentCertData.EP_card_prefix = frmPay.card_no.substring(0, 6)
              this.globalVal.paymentMethodInfo.objPaymentCertData.EP_card_chain_id = '1178133642' // 가맹점 번호 추가
              this.globalVal.paymentMethodInfo.objPaymentCertData.EP_card_cocd = COMM_CONST.getCocd()

              this.globalVal.paymentMethodInfo.objPaymentCertData.PAY = 'SPS' // 안심클릭 인지 간편결제인지 판단 SPS   ,  EACS 값

              this.globalVal.paymentMethodInfo.objPaymentCertData.card_no = frmPay.card_no // 인증시 받은 카드 번호
              this.globalVal.paymentMethodInfo.objPaymentCertData.order_amount = this.globalVal.paymentMethodInfo.objPaymentCertData.payAmt // 카드 결제 금액
              this.globalVal.paymentMethodInfo.objPaymentCertData.order_cardname = 'LOTTECARD'// 카드명   LOTTECARD
              this.globalVal.paymentMethodInfo.objPaymentCertData.apvl_chain_no_lt = this.globalVal.paymentMethodInfo.objPaymentCertData.str_apvl_chain_no_lt // 인증시 사용한 가맹점
              this.globalVal.paymentMethodInfo.objPaymentCertData.cavv = frmPay.cavv // 인증시 받은 복호화된 값
              this.globalVal.paymentMethodInfo.objPaymentCertData.xid = frmPay.xid

              this.globalVal.paymentMethodInfo.objPaymentCertData.EP_kvpcardcode = frmPay.card_no // 인증시 받은 카드 번호
              this.globalVal.paymentMethodInfo.objPaymentCertData.EP_card_no = frmPay.card_no

              this.gotoPaymentComplete(this.globalVal.paymentMethodInfo.objPaymentCertData) // 결제 완료 호출
            } else {
              this.globalVal.activeDoubleClick = false
              messageUtil.alert(`결제요청이 실패하였습니다. ${frmPay.msg}`, () => {
                this.$store.commit('popup/hideAll')
              })

              // card 정보 초기화
              this.globalVal.paymentMethodInfo.objPaymentCertData = {}
              this.paymentData.Payment.paymentList = []
              this.paymentData.Payment.setItem(0, { // -->> (ASIS)
                payAmt: this.globalVal.mOutputDatas.orderPrice.FINAL_PAYMENT_AMT,
                TOTAL_PRODUCT_AMT: this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT,
                OFFER_AMT: this.globalVal.mOutputDatas.orderPrice.OFFER_AMT,
                SHIP_CHARGE: this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE,
                SHIP_CHARGE_ONE_DELIVERY: this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE_ONE_DELIVERY,
                SHIP_CHARGE_MULTI_DELIVERY: this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE_MULTI_DELIVERY,
                FINAL_PAYMENT_AMT: this.globalVal.mOutputDatas.orderPrice.FINAL_PAYMENT_AMT,
                couponDcAmt: 0,
                cardDcAmt: 0
              })
            }
            // KB카드 분기 추가
          } else if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.objPaymentCertData.payType) &&
                  this.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO === '20' &&
                  this.globalVal.paymentMethodInfo.objPaymentCertData.moduleGubun === 'I') {
            for (const key in frmPay) {
              frmPay[key] = decodeURIComponent(frmPay[key])
            }
            if (frmPay.SendCode === '10001000') { // 성공
              frmPay.EncData = encodeURIComponent(frmPay.EncData)
              extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD], frmPay)
              this.gotoPaymentComplete(frmPay)
            } else {
              this.globalVal.activeDoubleClick = false
              if (frmPay.SendCode === '22002200') { // ISP 인증 취소
                messageUtil.alert('결제요청을 취소하셨습니다.', () => {
                  this.$store.commit('popup/hideAll')
                })
              } else if (frmPay.SendCode === '00130013') {
                messageUtil.alert('ISP인증이 정상적으로 처리되지 않았습니다.', () => {
                  this.$store.commit('popup/hideAll')
                })
              } else {
                messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                  this.$store.commit('popup/hideAll')
                })
              }
            }

            // 신한 직승인 분기 추가
          } else if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.objPaymentCertData.payType) &&
                  this.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO === '20' &&
                  this.globalVal.paymentMethodInfo.objPaymentCertData.moduleGubun === 'P') {
            // 성공 , 실패 관계 없이 인증 결과값을 수신 받았을 경우
            if (frmPay.sendCode === 'success') {
              for (const key in frmPay) {
                frmPay[key] = encodeURIComponent(decodeURIComponent(frmPay[key]))
              }
              this.gotoPaymentComplete(frmPay)
            } else {
              this.globalVal.activeDoubleClick = false
              // 고객이 인증을 취소 한 경우 가 아니라면 alert 표시
              if (frmPay.sendCode !== 'cancel') {
                messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                  this.$store.commit('popup/hideAll')
                })
              }
            }
          } else {
            switch (frmPay.type) {
              case 'creditcard': // 신용카드
                var unParams = {}
                for (const key in frmPay) {
                  /*
                   * EP8.0에서 kvp_sessionkey, kvp_encdata에 개항문자가 포함되어 SyntaxError 발생.
                   * android app일 경우 decoding data가 넘어온다.
                   */
                  if (viewType() === 'android' && (key === 'EP_kvp_sessionkey' || key === 'EP_kvp_encdata')) {
                    unParams[key] = `${encodeURIComponent(frmPay[key])}`
                  } else if (viewType() === 'ios' && (key === 'EP_kvp_sessionkey' || key === 'EP_kvp_encdata')) {
                    unParams[key] = `${frmPay[key]}`
                  } else {
                    unParams[key] = `${decodeURIComponent(frmPay[key])}`
                  }
                }

                if (unParams.EP_res_cd === '0000') { // 성공
                  this.fncGetCardChainId(unParams) // 가맹점 번호 조회
                } else {
                  this.globalVal.activeDoubleClick = false
                  messageUtil.alert(`결제요청이 실패하였습니다. ${JSON.stringify(unParams.EP_res_msg)}`, () => {
                    this.$store.commit('popup/hideAll')
                  })
                }
                break
              case 'phone': // 휴대폰소액결제
                if (frmPay.Resultcd === '0000') { // 성공
                  this.gotoPaymentComplete(frmPay)
                } else {
                  this.globalVal.activeDoubleClick = false
                  messageUtil.alert(`결제요청이 실패하였습니다. ${JSON.stringify(frmPay.Resultmsg)}`, () => {
                    this.$store.commit('popup/hideAll')
                  })
                }
                break
              case 'account': // 실시간계좌이체
                if (frmPay.LGD_RESPCODE === '0000') { // 성공
                  this.gotoPaymentComplete(frmPay)
                } else {
                  this.globalVal.activeDoubleClick = false
                  messageUtil.alert(`결제요청이 실패하였습니다. ${JSON.stringify(frmPay.LGD_RESPMSG)}`, () => {
                    this.$store.commit('popup/hideAll')
                  })
                }
                break
              case 'payco' : // 페이코 추가
                for (const key in frmPay) {
                  frmPay[key] = decodeURIComponent(frmPay[key])
                }

                if (frmPay.code === '0') { // 성공
                  const resultData = {
                    paymentCertifyToken: frmPay.paymentCertifyToken,
                    reserveOrderNo: frmPay.reserveOrderNo,
                    sellerOrderReferenceKey: frmPay.sellerOrderReferenceKey,
                    totalPaymentAmt: frmPay.totalPaymentAmt
                  }
                  extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO], resultData)
                  this.gotoPaymentComplete(frmPay)
                } else {
                  this.globalVal.activeDoubleClick = false
                  // 취소시
                  if (frmPay.code === '2222') {
                    messageUtil.alert('결제가 취소되었습니다.', () => {
                      this.$store.commit('popup/hideAll')
                    })
                  } else if (frmPay.code === '1022') { // 실패시
                    messageUtil.alert('등록되지 않은 가맹점 코드입니다.', () => {
                      this.$store.commit('popup/hideAll')
                    })
                  } else if (frmPay.code === '1023') {
                    messageUtil.alert('등록된 정보와 가맹점 코드가 일치하지 않습니다.', () => {
                      this.$store.commit('popup/hideAll')
                    })
                  } else if (frmPay.code === '1001' || frmPay.code === '3004' || frmPay.code === '3100' ||
                        frmPay.code === '3101' || frmPay.code === '3102' || frmPay.code === '3301' ||
                        frmPay.code === '3401' || frmPay.code === '3501' || frmPay.code === '3601' ||
                        frmPay.code === '3602' || frmPay.code === '4501' || frmPay.code === '4502' ||
                        frmPay.code === '4504' || frmPay.code === '4505' || frmPay.code === '4506' ||
                        frmPay.code === '4507' || frmPay.code === '4508' || frmPay.code === '9999'
                  ) {
                    messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                      this.$store.commit('popup/hideAll')
                    })
                  } else {
                    messageUtil.alert(`결제요청이 실패하였습니다. ${JSON.stringify(decodeURIComponent(frmPay.message))}`, () => {
                      this.$store.commit('popup/hideAll')
                    })
                  }
                }
                break
              case 'naverpay' :
                for (const key in frmPay) {
                  frmPay[key] = decodeURIComponent(frmPay[key])
                }

                if (frmPay.resultCode === 'Success') { // 성공
                  const resultData = {
                    paymentId: frmPay.paymentId,
                    resultCode: frmPay.resultCode,
                    storeId: frmPay.storeId,
                    type: frmPay.type
                  }
                  extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY], resultData)
                  this.gotoPaymentComplete(frmPay)
                } else {
                  this.globalVal.activeDoubleClick = false
                  if (frmPay.resultMessage === 'userCancel') {
                    messageUtil.alert('사용자에 의해 결제가 취소되었습니다.', () => {
                      this.$store.commit('popup/hideAll')
                    })
                  } else {
                    messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
                      this.$store.commit('popup/hideAll')
                    })
                  }
                }

                break

              case 'NSPAY_CARD' :
                for (const key in frmPay) {
                  frmPay[key] = decodeURIComponent(frmPay[key])
                }

                if (frmPay.resultCode === '0000') { // 성공
                  const resultData = {
                    paymentId: frmPay.paymentId,
                    resultCode: frmPay.resultCode,
                    storeId: frmPay.storeId,
                    type: frmPay.type,
                    wtid: frmPay.wtid
                  }
                  this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].nspayParams = ''
                  extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD], resultData)
                  this.gotoPaymentComplete(frmPay)
                } else {
                  this.globalVal.activeDoubleClick = false
                  // this.$store.commit('popup/hide')
                }
                break
              case 'NSPAY_ACCT' :
                for (const key in frmPay) {
                  frmPay[key] = decodeURIComponent(frmPay[key])
                }

                if (frmPay.resultCode === '0000') { // 성공
                  const resultData = {
                    paymentId: frmPay.paymentId,
                    resultCode: frmPay.resultCode,
                    storeId: frmPay.storeId,
                    type: frmPay.type,
                    wtid: frmPay.wtid
                  }
                  this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].nspayParams = ''
                  extend(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER], resultData)
                  this.gotoPaymentComplete(frmPay)
                } else {
                  this.globalVal.activeDoubleClick = false
                  // this.$store.commit('popup/hide')
                }
                break
            }
          }
        }
      }, e => {
        // handle exception
        console.error(e)
        this.globalVal.activeDoubleClick = false
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다. (B1310000M_36)${e}`, () => {
          routerUtil.back()
        })
      })
    },

    /**
     * 가맹점 번호 조회
     * (ASIS: 가맹점 번호 조회하여 paymentList에 추가되어 넘어갈 수 있도록 처리)
     * @param {Object} params - 결제처리정보
     * @returns {void}
     */
    fncGetCardChainId (params) {
      try {
        params.EP_card_prefix = params.EP_card_prefix.substring(0, 6) // card_prefix를 무조건 6자리로 자른다

        const cardPrefixNum = params.EP_card_prefix // 카드사 코드
        const acctPath = 'MOBIL' // 유입경로 MOBIL
        const irFreeYn = this.paymentData.Payment.getItem(0, 'EP_noinst_flag').EP_noinst_flag // 무이자 할부 여부 ; 무이자:Y,일반할부:N
        const ispApprYn = params.EP_req_type === '1' ? 'Y' : 'N' // ISP결제여부 : ISP결제일경우:Y,그외:N ; 1(ISP), 2(안심클릭), 3(PIN)
        const CARD_COCD = COMM_CONST.getCocd()
        const dispTypeCd = this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD // 전시유형코드

        const invokeParams = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nscart.helper.NSOrderBizJDBCHelper',
            mnm: 'getCardChainId',
            args: {
              cardPrefixNum,
              acctPath,
              dispTypeCd,
              irFreeYn,
              ispApprYn,
              cocd: CARD_COCD
            }
          })
        }

        // 가맹점 번호 조회 API 통신 및 콜백
        nsaxios.post('NSMypageCommCmd', invokeParams, data => {
          if (data.isSuccessful) {
            params.EP_card_chain_id = data.list.cardChainId // 가맹점 번호 추가
            params.EP_card_cocd = COMM_CONST.getCocd()
            this.gotoPaymentComplete(params) // 결제 완료 호출
          }
        })
      } catch (e) {
        // handle exception
        console.error(e)
        this.globalVal.activeDoubleClick = false
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }
    }
  }
}

export default loadPaymentLogJSMixin
