import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import nsaxios from '@frameworks/axiosUtil'
import cookieUtil from '@frameworks/cookieUtil'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import {
  insertSeparatorPhoneNumber,
  isNull,
  extend,
  isOsApp
} from '@utils/commonutil/commonUtil'
import routerUtil from '@frameworks/routerUtil'
import { mapState, mapMutations } from 'vuex'

/**
 * GotoPaymentCompleteMixin
 * onclick_btnPayment -> (ASIS) gotoPaymentComplete
 */
const gotoPaymentCompleteMixin = {
  computed: {
    ...mapState('orderSheet', ['strOrderInOrderId'])
  },
  methods: {
    ...mapMutations('orderSheet', ['setStrOrderInOrderId']),
    /**
     * 결제 완료
     * @param {Object} params - 결제처리 파라미터
     * @returns {void}
     */
    async gotoPaymentComplete (params) {
      try {
        // 결제요청 기본데이터 합산
        if (this.globalVal.paymentMethodInfo.paymentMethod === 0 && this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT === 0) {
          this.paymentData.Payment.setItem(0, {
            orderCompleteYn: 'Y',
            requestCommand: 'LastApproval'
          })
        } else {
          this.paymentData.Payment.setItem(0, this.globalVal.paymentMethodInfo.paymentMethodInitData[String(this.globalVal.paymentMethodInfo.paymentMethod)])
        }

        if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
          // 폼 데이터에 반영
          const data = {}
          for (const key in params) {
            if (params[key] && params[key].length > 0) {
              data[key] = String(params[key])
            }
          }
          data.orderCompleteYn = 'Y'
          data.requestCommand = 'LastApproval'
          data.payType = PAY_TYPE_CONST.CREDIT_CARD // '100'
          data.EP_card_code = params.EP_kvpcardcode
          data.EP_card_prefix = params.EP_card_prefix
          data.EP_ret_pay_type = params.EP_pay_type
          data.EP_trace_no = params.EP_m_cert_no
          // easypay 8.0추가
          data.EP_trace_no = params.EP_cno
          data.EP_card_req_type = params.EP_req_type
          data.EP_kmotion_useyn = params.EP_kmotion_useyn
          data.EP_kvp_pgid = ''
          data.EP_kvp_cardcode = params.EP_kvp_cardcode
          data.EP_kvp_sessionkey = params.EP_kvp_sessionkey
          data.EP_kvp_encdata = params.EP_kvp_encdata
          data.EP_kvp_payset_flag = params.EP_kvp_payset_flag
          data.EP_kvp_using_point = params.EP_kvp_using_point

          if (!isNull(this.paymentData.Payment.getItem(0)) &&
                !isNull(this.paymentData.Payment.getItem(0).EP_noinst_term)) {
            data.EP_noinst_term = this.paymentData.Payment.getItem(0).EP_noinst_term.split('-')[1]
          }

          // usedcard_code 카드 세팅 ; 026은 BC로 등등등 각 카드코드에 해당하는 카드사 약자
          const objCardList = this.globalVal.mOutputDatas.msg.UseCardList
          for (let i = 0; i < objCardList.length; i++) {
            if (objCardList[i].EZPAYCD === params.EP_card_cd) {
              data.usedcard_code = objCardList[i].CARD_CO_CD
              break
            }
          }

          // EP_card_prefix가 이상이 있으면 000000000으로 세팅한다.
          if (params.EP_card_prefix === null || undefined === params.EP_card_prefix || params.EP_card_prefix === '') {
            data.EP_card_prefix = '000000000'
          }

          if (this.globalVal.discountCardChoice.discountCardPreDc33 === true) { // 청구 할인 선택
            for (let i = 0; this.globalVal.discountCardChoice.discountList33Info.length > i; i++) {
              const index = this.globalVal.discountCardChoice.discountList33Info[i].index
              const indexDc = this.globalVal.discountCardChoice.discountList33Info[i].indexDc

              this.paymentData.Discount.setItem(index, {
                orderItemId: this.globalVal.discountCardChoice.discountList33[index].orderItemId,
                CATENTRY_ID: this.globalVal.discountCardChoice.discountList33[index].CATENTRY_ID
              })

              this.paymentData.Discount.setCouponItem(index, indexDc, this.globalVal.discountCardChoice.discountList33[index].couponList[indexDc])
            }
          } else if (this.globalVal.discountCardChoice.discountCardPreDc32 === true) { // 포인트 적립 선택
            for (let i = 0; this.globalVal.discountCardChoice.discountList32Info.length > i; i++) {
              const index = this.globalVal.discountCardChoice.discountList32Info[i].index
              const indexDc = this.globalVal.discountCardChoice.discountList32Info[i].indexDc

              this.paymentData.Discount.setItem(index, {
                orderItemId: this.globalVal.discountCardChoice.discountList32[index].orderItemId,
                CATENTRY_ID: this.globalVal.discountCardChoice.discountList32[index].CATENTRY_ID
              })

              this.paymentData.Discount.setCouponItem(index, indexDc, this.globalVal.discountCardChoice.discountList32[index].couponList[indexDc])
            }
          }

          this.paymentData.Payment.setItem(0, data)
        } else if (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymentMethodInfo.paymentMethod)) {
          // 폼 데이터에 반영
          this.paymentData.Payment.setItem(0, {
            orderCompleteYn: 'Y',
            requestCommand: 'LastApproval'
          })
        } else if (PAY_TYPE_CONST.isRealtimeAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
          // 폼 데이터에 반영
          this.paymentData.Payment.setItem(0, {
            orderCompleteYn: 'Y',
            requestCommand: 'LastApproval',
            LGD_PAYKEY: params.LGD_PAYKEY
          })
        } else if (PAY_TYPE_CONST.isMobile(this.globalVal.paymentMethodInfo.paymentMethod)) {
          // 폼 데이터에 반영
          const data = {}
          for (const key in params) {
            if (params[key] && params[key].length > 0) {
              data[key] = String(params[key])
            }
          }
          data.orderCompleteYn = 'Y'
          data.requestCommand = 'LastApproval'
          data.Mode = '21'
          data.seq = '0'
          for (const key in params) {
            if (params[key] && params[key].length > 0) {
              data[key] = String(params[key])
            }
          }
          this.paymentData.Payment.setItem(0, data)
        } else if (PAY_TYPE_CONST.isPayco(this.globalVal.paymentMethodInfo.paymentMethod)) {
          this.paymentData.Payment.setItem(0, {
            orderCompleteYn: 'Y',
            requestCommand: 'LastApproval'
          })
        } else if (PAY_TYPE_CONST.isNaverpay(this.globalVal.paymentMethodInfo.paymentMethod)) {
          this.paymentData.Payment.setItem(0, {
            orderCompleteYn: 'Y',
            requestCommand: 'LastApproval'
          })
        } else if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
          this.paymentData.Payment.setItem(0, {
            orderCompleteYn: 'Y',
            requestCommand: 'LastApproval'
          })
        } else if (PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
          this.paymentData.Payment.setItem(0, {
            orderCompleteYn: 'Y',
            requestCommand: 'LastApproval'
          })
        }

        // 예상적립금 적재 처리(PAD10100이 있으면 10100으로 적재한다.)
        for (let i = 0; i < this.paymentData.Discount.discountList.length; i++) {
          if (undefined !== this.paymentData.Discount.discountList[i].couponList.PAD10100) {
            this.paymentData.Discount.discountList[i].couponList['10100'] = this.paymentData.Discount.discountList[i].couponList.PAD10100
          }
        }

        // 결제 최종 승인 요청
        const _paymentData = this.paymentData.Payment.getItem(0)

        // 결제수단저장flag
        this.globalVal.checkPayFlag = this.globalVal.paymentMethodInfo.checkedAgreePurchageSave ? 'Y' : 'N'

        const selectDlyList = this.paymentData.Delivery.deliveryList
        const addressIdList = []

        for (let i = 0; i < selectDlyList.length; i++) {
          addressIdList.push(selectDlyList[i].ADDRESS_ID)
        }

        let param = {
          check_pay: this.globalVal.checkPayFlag, // 결제수단저장여부
          amtPrice: (this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT + this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE),
          totImdtDcCpAmt: this.globalVal.mOutputDatas.orderPrice.OFFER_AMT,
          caltotalShipCharge: this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE,
          registerType: this.globalVal.mOutputDatas.msg.UserInfo.REGISTERTYPE,
          orderTotalAmt: this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT,
          // sfinalPaymentAmtSaveExclude 부가결제 수단을 재외한 화면에 뿌려지는 값 세팅
          sfinalPaymentAmtSaveExclude: this.globalVal.mOutputDatas.sfinalPaymentAmtSaveExclude,
          expectAccmAmt: this.globalVal.mOutputDatas.forecastReservedAmt,
          couponDcAmt: (_paymentData.couponDcAmt || '0'),
          cardDcAmt: (_paymentData.cardDcAmt || '0'),
          payType: _paymentData.payType,
          requestCommand: _paymentData.requestCommand,
          orderCompleteYn: 'Y',
          classifyCd: '100', // 결제 분류코드(100=승인, 200=취소)
          productList: this.paymentData.Product.toJSON(),
          deliveryList: this.paymentData.Delivery.toJSON(),
          discountList: this.paymentData.Discount.toJSON(),
          paymentList: this.paymentData.Payment.toJSON(),
          partnershipList: this.paymentData.Partnership.toJSON(),
          orderName: this.paymentData.OrderUserInfo.getItem().LASTNAME,
          orderMail: this.paymentData.OrderUserInfo.getItem().EMAIL1,
          contactNum: insertSeparatorPhoneNumber(this.paymentData.OrderUserInfo.getItem().PHONE1, '-', true),
          parentCatEntryId: this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.CATENTRY_ID_PARENT,
          orderItemIds: this.globalVal.mOutputDatas.orderItem.orderItemIds,
          catEntryIds: this.globalVal.mOutputDatas.orderItem.catEntryIds,
          orderItemQuantitys: this.globalVal.mOutputDatas.orderItem.orderItemQuantitys,
          orderItemAmount: this.globalVal.mOutputDatas.orderItem.orderItemAmount,
          orderUserInfo: '',
          slctDayVal: this.globalVal.productInfo.deliveryDateSelected, // 지정일 배송
          paycoTrackingKey: cookieUtil.getCookie('trackingKey'), // 페이코 제휴 추가 로인한 제휴 추적 코드 추가
          paycoUUID: cookieUtil.getCookie('paycoUUID') ? cookieUtil.getCookie('paycoUUID') : null, // 페이코 제휴 추가 로인한 제휴 로그인 UUID 추가
          paymentId: params.paymentId, // 네이버페이 결제번호(승인요청시 사용)
          isFlashSaleNew: this.globalVal.mOutputDatas.orderItem.isFlashSaleNew, // 해피딜 상품여부
          payCertAddressList: addressIdList.join(','),
          ptnOrderNum: cookieUtil.getCookie('ptnOrderNum') !== '""' ? cookieUtil.getCookie('ptnOrderNum') : '', // 제휴사 주문 번호
          ptnCustNum: cookieUtil.getCookie('ptnCustNum') !== '""' ? cookieUtil.getCookie('ptnCustNum') : '', // 제휴사 고객 번호 (홈빠 회원번호)
          busChnId: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId,
          partNumber: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.partNumber
        }

        if (this.globalVal.mOutputDatas.msg.UserInfo.REGISTERTYPE === 'G') { // 비회원
          param.orderUserInfo = this.paymentData.OrderUserInfo.toJSON()
        }

        param.directOrderYN = this.globalVal.directOrderYN

        // todo...더블 클릭 체크
        if (this.globalVal.dobuleClickCount !== 0) {
          this.globalVal.activeDoubleClick = false
          return
        }
        this.globalVal.dobuleClickCount++

        // 최종 주문 API 막기 체크
        if (this.globalVal.activeDoubleApi) {
          this.globalVal.activeDoubleClick = false
          return
        }
        this.globalVal.activeDoubleApi = true // 최종 주문 API 막기

        // 결제 최종 승인 요청한 마지막 주문번호 체크
        if (this.strOrderInOrderId !== '' && this.strOrderInOrderId === this.globalVal.mInputParams.orderId) {
          messageUtil.alert('중복된 주문번호로 주문을 요청하여 진행할 수 없습니다.', () => {
            routerUtil.back()
          })

          return
        }
        this.setStrOrderInOrderId(this.globalVal.mInputParams.orderId)

        // 공통 펑션(_CurrentView.data.doPaymentApprovalRequest)으로 처리하던 부분을 직접 처리하도록(그대로 복사해옴) 수정
        param = extend({
          userId: this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID,
          orderId: this.globalVal.mInputParams.orderId,
          ordersId: this.globalVal.mInputParams.orderId,
          originOrdersId: this.globalVal.mInputParams.orderId,
          custNum: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
          userNm: this.paymentData.OrderUserInfo.getItem().LASTNAME,
          loginId: this.globalVal.mOutputDatas.msg.UserInfo.LOGONID,
          co_cd: COMM_CONST.getCocd(),
          dispTypeCd: this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD
        }, param)

        // vdn_cd (모바일 주문 접수 응대 번호) 데이터 다음 API 호출 시 추가
        if (isOsApp()) { // App
          param.vdn_cd = '54101'
        } else { // Web
          param.vdn_cd = '54102'
        }

        param.chkInventoryQuantityType = this.globalVal.chkInventoryQuantityType

        if (!this.globalVal.confirmInfo.enableComplete) {
          return false
        }

        // 결제 최종 승인 요청 및 콜백 처리
        await nsaxios.post('PaymentApprovalRequestCmd', param, data => {
          if (data.msg && data.msg.result === 'success') {
            if (data.msg.resultMsg !== undefined) {
              console.debug(`결제하기 실행 resultMsg ==> ${data.msg.resultMsg}`)
            }
            this.globalVal.confirmInfo.enableComplete = false
            delete this.paymentData

            // 최종 결제정보
            this.globalVal.mOutputDatas.orderPrice = extend(true, {}, this.globalVal.mOutputDatas.orderPrice, {
              TOTAL_PRODUCT_AMT: _paymentData.TOTAL_PRODUCT_AMT,
              OFFER_AMT: _paymentData.OFFER_AMT,
              SHIP_CHARGE: _paymentData.SHIP_CHARGE,
              RMA_SHIP_CHARGE: _paymentData.RMA_SHIP_CHARGE,
              FINAL_PAYMENT_AMT: _paymentData.FINAL_PAYMENT_AMT,
              couponDcAmt: _paymentData.couponDcAmt,
              cardDcAmt: _paymentData.cardDcAmt,
              freeShippingDcAmt: undefined === _paymentData.freeShippingDcAmt ? '0' : _paymentData.freeShippingDcAmt
            })

            // Wiselog의 필요한 데이터 적제
            if (!isNull(this.globalVal.mInputParams.catalogId)) {
              param.catalogId = this.globalVal.mInputParams.catalogId
            }

            if (!isNull(this.globalVal.mInputParams.p_bannerid)) {
              param.p_bannerid = this.globalVal.mInputParams.p_bannerid
            }

            if (!isNull(this.globalVal.mInputParams.p_espotid)) {
              param.p_espotid = this.globalVal.mInputParams.p_espotid
            }

            if (!isNull(this.globalVal.mInputParams.catgroupId)) {
              param.catgroupId = this.globalVal.mInputParams.catgroupId
            }

            if (!isNull(this.globalVal.mInputParams.categoryId)) {
              param.categoryId = this.globalVal.mInputParams.categoryId
            }

            // todo...상품 카테고리명칭 추가 적제
            param.productCategoryName = this.globalVal.mInputParams.productCategoryName

            param.bDiscount33selected = this.globalVal.bDiscount33selected
            param.bDiscount33product = this.globalVal.bDiscount33product

            // 스크립트 삽입 요청의 건 (NEO) start
            // 총결제금액,상품번호,수량
            /* (ASIS)
            const totalAmt = this.globalVal.mOutputDatas.orderPrice.FINAL_PAYMENT_AMT
            const primaryGoodsNo = this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.CATENTRY_ID_PARENT
            const totalItemCnt = this.globalVal.mOutputDatas.TOTAL_ITEM_COUNT
            Emf.convCall(844, 3398, total_amt, primary_goods_no, total_item_cnt)
            */
            // 스크립트 삽입 요청의 건 (NEO) end

            // 채널 저장
            param.busChnId = this.globalVal.tmpBusChnId

            // 주문완료 페이지로 이동
            if (isOsApp()) {
              this.$router.push({ name: 'orderComplete', params: extend(true, {}, data, param, { orderPrice: this.globalVal.mOutputDatas.orderPrice, invoke: this.globalVal.mInputParams.invoke, backflag: 'home' }) })
            } else {
              this.$router.push({ name: 'orderComplete', params: extend(true, {}, data, param, { orderPrice: this.globalVal.mOutputDatas.orderPrice, invoke: this.globalVal.mInputParams.invoke }) })
            }
          } else if (data.msg && data.msg.result === 'failure') {
            let strAlertSubMsg = ''

            if (undefined !== data.msg) {
              if (undefined !== data.msg.resultMessage) {
                strAlertSubMsg = ` ${data.msg.resultMessage}`
              }
            }

            messageUtil.alert(`결제를 실패하였습니다.${strAlertSubMsg}`, () => {
              this.setStrOrderInOrderId('') // 주문번호 중복 체크 관련 초기화
              this.globalVal.dobuleClickCount = 0 // 중복 클릭 체크값 초기화
              this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
              this.globalVal.activeDoubleApi = false // 최종 주문 API 막기 품

              bizUtil.gotoMain()
            })
          }
        })
      } catch (e) {
        // handle exception
        console.error(e)

        this.globalVal.dobuleClickCount = 0 // 중복 클릭 체크값 초기화
        this.globalVal.activeDoubleClick = false // 주문버튼 막기 품
        this.globalVal.activeDoubleApi = false // 최종 주문 API 막기 품
        // typeError(특수문자 에러의 경우 axios에서 TypeError return)의 경우 화면유지
        if (e instanceof TypeError) {
          this.setStrOrderInOrderId('') // 주문번호 중복 체크 관련 초기화
        } else {
          messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
            routerUtil.back()
          })
        }
      }
    }
  }
}

export default gotoPaymentCompleteMixin
