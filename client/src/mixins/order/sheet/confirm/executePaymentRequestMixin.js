import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import messageUtil from '@frameworks/messageUtil'
import popupUtil from '@frameworks/popupUtil'
import {
  extend
} from '@utils/commonutil/commonUtil'
import routerUtil from '@frameworks/routerUtil'
import uiUtil from '@utils/uiUtil'

/**
 * ExecutePaymentRequestMixin
 * onclick_btnPayment -> (ASIS) executePaymentRequest
 */
const executePaymentRequestMixin = {
  methods: {
    /**
     * 결제요청 실행 (executePaymentRequest)
     * @returns {void}
     */
    executePaymentRequest () {
      try {
        let strVanCo = ''
        let params = this.paymentData.Payment.getItem(0)

        if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
          strVanCo = params.VAN_CO
        }

        const payInitData = this.globalVal.paymentMethodInfo.paymentMethodInitData[String(this.globalVal.paymentMethodInfo.paymentMethod)]
        params = extend(true, {}, params, payInitData)

        if (params.type !== null && params.type === 'naverpay') {
          params.type = ''
        }

        if (params.orderCompleteYn === 'Y' || params.FINAL_PAYMENT_AMT === 0) {
          this.gotoPaymentComplete(params)
        } else {
          if (!payInitData) {
            this.globalVal.paymentMethodInfo.wrongMessage = '필수 입력 사항입니다. 선택해 주세요.'
            uiUtil.scrollMove('payment_method', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            this.globalVal.activeDoubleClick = false
            return false
          }
          // 결제창 열기
          params.targetType = 'payment'

          // 상품명에 특수문자가 있으면 이지페이에서 오류를 발상하므로 특수문자 별도처리
          // '~','!','@','#','$','%','^','&','*','(',')','_','+','|','{','}',':','"','<','>','?','-','=','[',']',';'','.','/'
          // NSSR-21339 이지페이 상품명 인코딩 누락이슈(PC 로직과 동일하게 수정)
          if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
            params.EP_product_nm = params.EP_product_nm.replace(/[<>"'%;()&+#-]/g, '')
          }

          // 로그 정보 적재 후 외부연동 결제 진행
          this.loadPaymentLogJS('E', params.EP_order_no, params.payAmt, params.payType, params)

          this.globalVal.dobuleClickCount = 0

          /*
          * 기존 androidweb만 mainCtrl.showCertView을 호출 하였으나 iosweb도 같이 호출하도록 수정
          * 외부연동 결제 진행 시 롯데카드일 경우 롯데카드 결제에 필요한 parameter만 셋팅하여 호출하 도록 수정
          * if (key.indexOf("EP_") > -1 delete params[key]; 와 같이 사용하였으나 params에 로그를 위한 임의의 값을 추가하면 파라미터가 그대로 smpi_mob_agent01 로 호출되어 롯데카드 referer에 남게 됨.
          */
          // usercard_code >> modulGubun
          if (params.usedcard_code === 'AM' && strVanCo === '20') { // 롯데 카드일 경우
            const smpiParam = {
              payType: params.payType,
              VAN_CO: params.VAN_CO,
              moduleGubun: params.moduleGubun,
              usedcard_code: params.usedcard_code,

              VIEW_TYPE: params.VIEW_TYPE,
              str_apvl_chain_no_lt: params.str_apvl_chain_no_lt,
              EP_mall_nm: params.EP_mall_nm,
              custNum: params.custNum,
              payAmt: params.payAmt,
              EP_order_no: params.EP_order_no
            }

            params = {}
            params = smpiParam
          }

          this.globalVal.paymentMethodInfo.objPaymentCertData = {}
          this.globalVal.paymentMethodInfo.objPaymentCertData = params

          const paramPopup = {
            titleAlign: 'center',
            isShowSearch: false,
            isShowCart: false,
            orderPaymentParams: this.globalVal.paymentMethodInfo.objPaymentCertData
          }
          popupUtil.show('order/OrderPaymentCert.vue', paramPopup, () => {})

          // 인증창 호출하여 인증하지 않고 뒤로 돌아올수 있으니 인증창 호출 후 결제버튼 풀어줌
          setTimeout(() => {
            this.globalVal.activeDoubleClick = false
          }, 500)
        }
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

export default executePaymentRequestMixin
