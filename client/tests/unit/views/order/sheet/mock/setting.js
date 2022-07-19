
import CONST from '@constants/framework/framework'
import { getProcessedWCSParameter } from '@unit/testUtil'

import { PAY_TYPE_CONST } from '@/common/constants/order/order'

// import temp00ReqAjaxNSOrderPayNow4Worklight from '@unit/views/order/sheet/mock/onload/00_req_AjaxNSOrderPayNow4Worklight'
// import temp00ResAjaxNSOrderPayNow4Worklight from '@unit/views/order/sheet/mock/onload/00_res_AjaxNSOrderPayNow4Worklight'
// import temp01ReqNSOrderPaymentMobile from '@unit/views/order/sheet/mock/onload/01_req_NSOrderPaymentMobile'
import temp01ResNSOrderPaymentMobile from '@unit/views/order/sheet/mock/onload/01_res_NSOrderPaymentMobile'
import temp02ReqNSMypageCommCmdLastCashReceipt from '@unit/views/order/sheet/mock/onload/02_req_NSMypageCommCmd_lastCashReceipt'
import temp02ResNSMypageCommCmdLastCashReceipt from '@unit/views/order/sheet/mock/onload/02_res_NSMypageCommCmd_lastCashReceipt'
// import temp03ReqShoppingAmtLimitCheckCmd from '@unit/views/order/sheet/mock/onload/03_req_ShoppingAmtLimitCheckCmd'
import temp03ResShoppingAmtLimitCheckCmd from '@unit/views/order/sheet/mock/onload/03_res_ShoppingAmtLimitCheckCmd'
// import temp04ReqShoppingLimitCheckCmd from '@unit/views/order/sheet/mock/onload/04_req_ShoppingLimitCheckCmd'
import temp04ResShoppingLimitCheckCmd from '@unit/views/order/sheet/mock/onload/04_res_ShoppingLimitCheckCmd'
// import temp04ReqNSCustDeliveryMsg from '@unit/views/order/sheet/mock/onload/04_req_NSCustDeliveryMsg'
import temp04ResNSCustDeliveryMsg from '@unit/views/order/sheet/mock/onload/04_res_NSCustDeliveryMsg'
// import temp05ReqSeparateStaffOnlyProducts from '@unit/views/order/sheet/mock/onload/05_req_SeparateStaffOnlyProducts'
import temp05ResSeparateStaffOnlyProducts from '@unit/views/order/sheet/mock/onload/05_res_SeparateStaffOnlyProducts'
// import temp06ReqRmaYNCheckCmd from '@unit/views/order/sheet/mock/onload/06_req_RmaYNCheckCmd'
import temp06ResRmaYNCheckCmd from '@unit/views/order/sheet/mock/onload/06_res_RmaYNCheckCmd'
import temp07ReqAjaxNSWPayIsWayDisplay from '@unit/views/order/sheet/mock/onload/07_req_AjaxNSWPay_isWayDisplay'
import temp07ResAjaxNSWPayIsWayDisplay from '@unit/views/order/sheet/mock/onload/07_res_AjaxNSWPay_isWayDisplay'
// import temp08ReqNSShippingChargeCmd from '@unit/views/order/sheet/mock/onload/08_req_NSShippingChargeCmd'
import temp08ResNSShippingChargeCmd from '@unit/views/order/sheet/mock/onload/08_res_NSShippingChargeCmd'
import temp09ReqNSMypageCommCmdInstmMmsList from '@unit/views/order/sheet/mock/onload/09_req_NSMypageCommCmd_instmMmsList'
import temp09ResNSMypageCommCmdInstmMmsList from '@unit/views/order/sheet/mock/onload/09_res_NSMypageCommCmd_instmMmsList'
// import temp10ReqPaymentApprovalRequestCmdRequestInfo from '@unit/views/order/sheet/mock/onload/10_req_PaymentApprovalRequestCmd_RequestInfo'
import temp10ResPaymentApprovalRequestCmdRequestInfo from '@unit/views/order/sheet/mock/onload/10_res_PaymentApprovalRequestCmd_RequestInfo'

// delivery
import temp01ReqNSMypageCommCmdShipAddrList from '@unit/views/order/sheet/mock/delivery/01_req_NSMypageCommCmd_ShipAddrList'
import temp01ResNSMypageCommCmdShipAddrList from '@unit/views/order/sheet/mock/delivery/01_res_NSMypageCommCmd_ShipAddrList'
import temp02ReqNSCustDeliveryMsg from '@unit/views/order/sheet/mock/delivery/02_req_NSCustDeliveryMsg'
import temp02ResNSCustDeliveryMsg from '@unit/views/order/sheet/mock/delivery/02_res_NSCustDeliveryMsg'
// import temp04ReqNSShippingAddressAccessCmdRealINSERT from '@unit/views/order/sheet/mock/delivery/04_req_NSShippingAddressAccessCmdReal_INSERT'
import temp04ResNSShippingAddressAccessCmdRealINSERT from '@unit/views/order/sheet/mock/delivery/04_res_NSShippingAddressAccessCmdReal_INSERT'
import temp03ReqNSShippingAddressAccessCmdRealModify from '@unit/views/order/sheet/mock/delivery/03_req_NSShippingAddressAccessCmdReal_Modify'
import temp03ResNSShippingAddressAccessCmdRealModify from '@unit/views/order/sheet/mock/delivery/03_res_NSShippingAddressAccessCmdReal_Modify'
// import temp04ReqNSShippingAddressAccessCmdRealDelete from '@unit/views/order/sheet/mock/delivery/04_req_NSShippingAddressAccessCmdReal_Delete'
import temp04ResNSShippingAddressAccessCmdRealDelete from '@unit/views/order/sheet/mock/delivery/04_res_NSShippingAddressAccessCmdReal_Delete'
import temp05ReqNSPhoneCheckMoblieCmdReal from '@unit/views/order/sheet/mock/delivery/05_req_NSPhoneCheckMoblieCmdReal'
import temp05ResNSPhoneCheckMoblieCmdReal from '@unit/views/order/sheet/mock/delivery/05_res_NSPhoneCheckMoblieCmdReal'
import temp06ReqNSMypageCommCmdAlejandrolistCity from '@unit/views/order/sheet/mock/delivery/06_req_NSMypageCommCmdAlejandrolistCity'
import temp06ResNSMypageCommCmdAlejandrolistCity from '@unit/views/order/sheet/mock/delivery/06_res_NSMypageCommCmdAlejandrolistCity'
import temp07ReqNSMypageCommCmdAlejandrolistSigugun from '@unit/views/order/sheet/mock/delivery/07_req_NSMypageCommCmdAlejandrolistSigugun'
import temp07ResNSMypageCommCmdAlejandrolistSigugun from '@unit/views/order/sheet/mock/delivery/07_res_NSMypageCommCmdAlejandrolistSigugun'
import temp08ReqNSMypageCommCmdAlejandrolistRelaxAddrList from '@unit/views/order/sheet/mock/delivery/08_req_NSMypageCommCmdAlejandrolistRelaxAddrList'
import temp08ResNSMypageCommCmdAlejandrolistRelaxAddrList from '@unit/views/order/sheet/mock/delivery/08_res_NSMypageCommCmdAlejandrolistRelaxAddrList'
// import temp03ReqNSMypageCommCmdMaxCnt from '@unit/views/order/sheet/mock/delivery/03_req_NSMypageCommCmd_maxCnt'
import temp03ResNSMypageCommCmdMaxCnt from '@unit/views/order/sheet/mock/delivery/03_res_NSMypageCommCmd_maxCnt'
import temp09ReqNSMypageCommCmdNorma from '@unit/views/order/sheet/mock/delivery/09_req_NSMypageCommCmdNorma'
import temp09ResNSMypageCommCmdNorma from '@unit/views/order/sheet/mock/delivery/09_res_NSMypageCommCmdNorma'

// payment
import temp01ReqNSOrderRegistVirtualAccntAjaxCmd from '@unit/views/order/sheet/mock/payment/01_req_NSOrderRegistVirtualAccntAjaxCmd'
import temp01ResNSOrderRegistVirtualAccntAjaxCmd from '@unit/views/order/sheet/mock/payment/01_res_NSOrderRegistVirtualAccntAjaxCmd'

// nspay
import temp01ReqAjaxNSWPayNoIntInfo from '@unit/views/order/sheet/mock/payment/nspay/01_req_AjaxNSWPay_noIntInfo'
import temp01ResAjaxNSWPayNoIntInfo from '@unit/views/order/sheet/mock/payment/nspay/01_res_AjaxNSWPay_noIntInfo'
import temp02ReqAjaxNSWPayPayInfoAll from '@unit/views/order/sheet/mock/payment/nspay/02_req_AjaxNSWPay_payInfoAll'
import temp02ResAjaxNSWPayPayInfoAll from '@unit/views/order/sheet/mock/payment/nspay/02_res_AjaxNSWPay_payInfoAll'
import temp03ReqAjaxNSWPayDelPayInfo from '@unit/views/order/sheet/mock/payment/nspay/03_req_AjaxNSWPay_delPayInfo'
import temp03ResAjaxNSWPayDelPayInfo from '@unit/views/order/sheet/mock/payment/nspay/03_res_AjaxNSWPay_delPayInfo'
import temp04ReqAjaxNSWPaySetMajorPayInfo from '@unit/views/order/sheet/mock/payment/nspay/04_req_AjaxNSWPay_setMajorPayInfo'
import temp04ResAjaxNSWPaySetMajorPayInfo from '@unit/views/order/sheet/mock/payment/nspay/04_res_AjaxNSWPay_setMajorPayInfo'
import temp05ReqAjaxNSWPayDelMajorPayInfo from '@unit/views/order/sheet/mock/payment/nspay/05_req_AjaxNSWPay_delMajorPayInfo'
import temp05ResAjaxNSWPayDelMajorPayInfo from '@unit/views/order/sheet/mock/payment/nspay/05_res_AjaxNSWPay_delMajorPayInfo'
import temp06ReqAjaxNSWPayMemUnReg from '@unit/views/order/sheet/mock/payment/nspay/06_req_AjaxNSWPay_memUnReg'
import temp06ResAjaxNSWPayMemUnReg from '@unit/views/order/sheet/mock/payment/nspay/06_res_AjaxNSWPay_memUnReg'
import temp07ReqAjaxNSWPaySetNSPayOneTouchFlag from '@unit/views/order/sheet/mock/payment/nspay/07_req_AjaxNSWPay_setNSPayOneTouchFlag'
import temp07ResAjaxNSWPaySetNSPayOneTouchFlag from '@unit/views/order/sheet/mock/payment/nspay/07_res_AjaxNSWPay_setNSPayOneTouchFlag'

// confirm
import temp01ReqNSMypageCommCmdAlejandroE from '@unit/views/order/sheet/mock/confirm/01_req_NSMypageCommCmd_alejandro_E'
import temp01ResNSMypageCommCmdAlejandroE from '@unit/views/order/sheet/mock/confirm/01_res_NSMypageCommCmd_alejandro_E'
import temp02ReqNSMypageCommCmdAlejandroO from '@unit/views/order/sheet/mock/confirm/02_req_NSMypageCommCmd_alejandro_O'
import temp02ResNSMypageCommCmdAlejandroO from '@unit/views/order/sheet/mock/confirm/02_res_NSMypageCommCmd_alejandro_O'
import temp03ReqNSMypageCommCmdAlejandroGetCardChainId from '@unit/views/order/sheet/mock/confirm/03_req_NSMypageCommCmd_alejandro_getCardChainId'
import temp03ResNSMypageCommCmdAlejandroGetCardChainId from '@unit/views/order/sheet/mock/confirm/03_res_NSMypageCommCmd_alejandro_getCardChainId'
import temp04ReqPaymentApprovalRequestCmdLastApproval from '@unit/views/order/sheet/mock/confirm/04_req_PaymentApprovalRequestCmd_LastApproval'
import temp04ResPaymentApprovalRequestCmdLastApproval from '@unit/views/order/sheet/mock/confirm/04_res_PaymentApprovalRequestCmd_LastApproval'

const initOrderSheet = mock => {
  mock.onPost(`${CONST.API_URL}/NSOrderPaymentMobile`)
    .reply(200, temp01ResNSOrderPaymentMobile)

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdLastCashReceipt))
    .reply(200, temp02ResNSMypageCommCmdLastCashReceipt)

    .onPost(`${CONST.API_URL}/ShoppingAmtLimitCheckCmd`)
    .reply(200, temp03ResShoppingAmtLimitCheckCmd)

    .onPost(`${CONST.API_URL}/ShoppingLimitCheckCmd`)
    .reply(200, temp04ResShoppingLimitCheckCmd)

    .onPost(`${CONST.API_URL}/NSCustDeliveryMsg`)
    .reply(200, temp04ResNSCustDeliveryMsg)

    .onPost(`${CONST.API_URL}/SeparateStaffOnlyProducts`)
    .reply(200, temp05ResSeparateStaffOnlyProducts)

    .onPost(`${CONST.API_URL}/RmaYNCheckCmd`)
    .reply(200, temp06ResRmaYNCheckCmd)

    .onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp07ReqAjaxNSWPayIsWayDisplay))
    .reply(200, temp07ResAjaxNSWPayIsWayDisplay)

    .onPost(`${CONST.API_URL}/NSShippingChargeCmd`)
    .reply(200, temp08ResNSShippingChargeCmd)

    .onPost(`${CONST.API_URL}/NSShippingChargeCmd`)
    .reply(200, temp08ResNSShippingChargeCmd)

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('SS')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('SS'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('KM')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('KM'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('BC')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('BC'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('DN')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('DN'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('CH')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('CH'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('AM')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('AM'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('HN')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('HN'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('VS')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('VS'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('SU')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('SU'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('SH')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('SH'))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdInstmMmsList.get('LG')))
    .reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('LG'))

    .onPost(`${CONST.API_URL}/PaymentApprovalRequestCmd`).reply(200, temp10ResPaymentApprovalRequestCmdRequestInfo)
    .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

  return mock
}

const initOrderSheetDelivery = mock => {
  mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp01ReqNSMypageCommCmdShipAddrList))
    .reply(200, temp01ResNSMypageCommCmdShipAddrList)

    .onPost(`${CONST.API_URL}/NSCustDeliveryMsg`, getProcessedWCSParameter('post', temp02ReqNSCustDeliveryMsg))
    .reply(200, temp02ResNSCustDeliveryMsg)

    .onPost(`${CONST.API_URL}/NSShippingAddressAccessCmdReal`)
    .reply(200, temp04ResNSShippingAddressAccessCmdRealINSERT)

    .onPost(`${CONST.API_URL}/NSShippingAddressAccessCmdReal`, getProcessedWCSParameter('post', temp03ReqNSShippingAddressAccessCmdRealModify))
    .reply(200, temp03ResNSShippingAddressAccessCmdRealModify)

    .onPost(`${CONST.API_URL}/NSShippingAddressAccessCmdReal`)
    .reply(200, temp04ResNSShippingAddressAccessCmdRealDelete)

    .onPost(`${CONST.API_URL}/NSPhoneCheckMoblieCmdReal`, getProcessedWCSParameter('post', temp05ReqNSPhoneCheckMoblieCmdReal))
    .reply(200, temp05ResNSPhoneCheckMoblieCmdReal)

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandrolistCity))
    .reply(200, temp06ResNSMypageCommCmdAlejandrolistCity)

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp07ReqNSMypageCommCmdAlejandrolistSigugun))
    .reply(200, temp07ResNSMypageCommCmdAlejandrolistSigugun)

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp08ReqNSMypageCommCmdAlejandrolistRelaxAddrList))
    .reply(200, temp08ResNSMypageCommCmdAlejandrolistRelaxAddrList)

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`)
    .reply(200, temp03ResNSMypageCommCmdMaxCnt)

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp09ReqNSMypageCommCmdNorma))
    .reply(200, temp09ResNSMypageCommCmdNorma)

    .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })
}

const initOrderSheetDiscount = () => {
  // 일반회원
  const getCustCouponList = () => {
    return {
      179105966: {
        1: [
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613110708',
            WWW_RATE: 7,
            CP_CLSSF: '11',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200514110708',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '7％ 할인 쿠폰',
            MAX_USE_NUM: 2,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1051601',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        2: [],
        3: [
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20291231102309',
            WWW_RATE: 5,
            CP_CLSSF: '12',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200317102309',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '다운쿠폰 5％다운쿠폰',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070675',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: '2000',
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: '0',
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: '999999999',
            CP_NM: '[바로방문][패밀리] 2，000원할인',
            MAX_USE_NUM: '1',
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070933',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: 2,
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: 30000,
            CP_NM: '[바로방문][패밀리] 2％ 할인',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070934',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        4: null,
        freeDlvry: [],
        flashMap: {},
        yearDc: []
      }
    }
  }

  const getCustStaffBnf = () => {
    return {
      couponBnftRate: 0,
      useAmt: 0,
      couponId: '',
      bnftBiggerYn: 'N', // 테스트 수정 0
      memberId: '',
      userId: 0,
      class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
      balanceAmt: 0, // 테스트 수정 0
      limitAmt: 0,
      empYn: 'N' // 테스트 수정 0
    }
  }

  const getCustUserInfoBenefit = () => {
    return {
      OKCASHBAG_BALANCE: 10000, // 테스트 수정 0
      NETIWELL_BALANCE: 10000, // 테스트 수정 0
      HAPPYMONEY_BALANCE: 10000, // 테스트 수정 0
      GIFTCARD_BALANCE: '10000', // 테스트 수정 '0'
      MILEAGE_BALANCE: '9000000', // 테스트 수정 '0'
      ACCUMONEY_BALANCE: '10000', // 테스트 수정 '0'
      ANNUDCCP_BALANCE: '10000' // 테스트 수정 '0'
    }
  }

  const getCustUsePaymentInfo = () => {
    return {
      GIFTCARD: 'Y',
      NETTIWELL: 'N',
      HAPPYMONEY: 'N', // 테스트 수정 'N'
      MOBILE: 'Y',
      NSPAY: 'Y',
      KAKAOPAY: 'N',
      ACCUMMONEY: 'Y',
      CREDITCARD: 'Y',
      MILEAGE: 'Y',
      ACCOUNT: 'Y',
      PAYPIN: 'Y',
      PAYCO: 'Y',
      OKCASHBAGSAVE: 'Y',
      NAVERPAY: 'Y',
      OKCASHBAG: 'Y',
      COMPPAY: 'Y',
      DEPOSIT: 'Y'
    }
  }

  // 일반회원 상품 두개
  const getCustMultiCouponList = () => {
    return {
      256241122: {
        1: [
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200626092151',
            WWW_RATE: 5,
            CP_CLSSF: '11',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200527092151',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '5％ 할인쿠폰',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1069211',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        2: [],
        3: [
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20291231102309',
            WWW_RATE: 5,
            CP_CLSSF: '12',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200317102309',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '다운쿠폰 5％다운쿠폰',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070675',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: '2000',
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: '0',
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: '999999999',
            CP_NM: '[바로방문][패밀리] 2，000원할인',
            MAX_USE_NUM: '1',
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070933',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: 2,
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: 30000,
            CP_NM: '[바로방문][패밀리] 2％ 할인',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070934',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        4: null,
        freeDlvry: [],
        flashMap: {},
        yearDc: []
      },
      256241124: {
        1: [
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613110708',
            WWW_RATE: 7,
            CP_CLSSF: '11',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200514110708',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '7％ 할인 쿠폰',
            MAX_USE_NUM: 2,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1051601',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        2: [],
        3: [
          {
            WWW_AMT: 2000,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: 0,
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: '999999999',
            CP_NM: '[바로방문][패밀리] 2，000원할인',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070933',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: '0',
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: '2',
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: '30000',
            CP_NM: '[바로방문][패밀리] 2％ 할인',
            MAX_USE_NUM: '1',
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070934',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        4: null,
        freeDlvry: [],
        flashMap: {},
        yearDc: []
      }
    }
  }

  const getCustMultiImdtDcCpAmtList = () => {
    return {
      256241122: {
        PROM_DC_WAY_ARS: '',
        PROM_DC_WAY_PAD: '',
        PROM_VAL_LSP_RATE: '0',
        PROM_VAL_PAD_RTO: '0',
        PROM_DC_WAY_CPC: 'N',
        PROM_VAL_ARS: '0',
        PROM_VAL_PAD: '0',
        PROM_DC_WAY_LSP: 'N',
        PROM_VAL_CPC: '0',
        PROM_VAL_LSP: 'N',
        PROM_VAL_PAD_AMT: '0',
        PROM_VAL_IFI: '0'
      },
      256241124: {
        PROM_DC_WAY_ARS: '',
        PROM_DC_WAY_PAD: '',
        PROM_VAL_LSP_RATE: '0',
        PROM_VAL_PAD_RTO: '0',
        PROM_DC_WAY_CPC: 'N',
        PROM_VAL_ARS: '0',
        PROM_VAL_PAD: '0',
        PROM_DC_WAY_LSP: 'N',
        PROM_VAL_CPC: '0',
        PROM_VAL_LSP: 'N',
        PROM_VAL_PAD_AMT: '0',
        PROM_VAL_IFI: '0'
      }
    }
  }

  const getCustMultiBestCouponList = () => {
    return {
      256241122: {
        maxDiscountQty: 6530,
        couponMap: {
          ImdtDcCp: {
            prom_val: 0,
            cpIdfr: '',
            qty: 1,
            discountPrice: 0,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: '',
            price: 130500,
            priceQty: 130500,
            discountPriceQty: 0
          },
          plus1: {
            prom_val: 0,
            cpIdfr: '',
            qty: 1,
            discountPrice: 0,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: '',
            price: 130500,
            priceQty: 130500,
            discountPriceQty: 0
          },
          plus2: {
            prom_val: 0,
            cpIdfr: '',
            qty: 1,
            discountPrice: 0,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: '',
            price: 130500,
            priceQty: 130500,
            discountPriceQty: 0
          },
          plus3: {
            prom_val: 5,
            cpIdfr: '1070675',
            qty: 1,
            discountPrice: 6530,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: 'RTO',
            price: 123970,
            priceQty: 123970,
            discountPriceQty: 6530
          },
          plus4: {
            prom_val: 5,
            cpIdfr: '',
            qty: 1,
            discountPrice: 0,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: 'RTO',
            price: 123970,
            priceQty: 123970,
            discountPriceQty: 0
          }
        },
        class: 'class com.ns.commerce.nsorder.vo.CouponSelected',
        price: 123970,
        orderItemsId: '256241122'
      },
      256241124: {
        maxDiscountQty: 4800,
        couponMap: {
          ImdtDcCp: {
            prom_val: 0,
            cpIdfr: '',
            qty: 1,
            discountPrice: 0,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: '',
            price: 39900,
            priceQty: 39900,
            discountPriceQty: 0
          },
          plus1: {
            prom_val: 7,
            cpIdfr: '1051601',
            qty: 1,
            discountPrice: 2800,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: 'RTO',
            price: 37100,
            priceQty: 37100,
            discountPriceQty: 2800
          },
          plus2: {
            prom_val: 7,
            cpIdfr: '',
            qty: 1,
            discountPrice: 0,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: 'RTO',
            price: 37100,
            priceQty: 37100,
            discountPriceQty: 0
          },
          plus3: {
            prom_val: 2000,
            cpIdfr: '1070933',
            qty: 1,
            discountPrice: 2000,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: 'AMT',
            price: 35100,
            priceQty: 35100,
            discountPriceQty: 2000
          },
          plus4: {
            prom_val: 2000,
            cpIdfr: '',
            qty: 1,
            discountPrice: 0,
            class: 'class com.ns.commerce.nsorder.vo.CouponSelectedItem',
            prom_type: 'AMT',
            price: 35100,
            priceQty: 35100,
            discountPriceQty: 0
          }
        },
        class: 'class com.ns.commerce.nsorder.vo.CouponSelected',
        price: 35100,
        orderItemsId: '256241124'
      }
    }
  }

  const getCustMultiOrderGoodList = () => {
    return [
      {
        itemDetailInfo: {
          promDcWayPad: '',
          payTypeCd: '',
          busChnId: 'INT',
          arsAmt: 0,
          cardBnftList: null,
          appSaleRate: 0,
          accptPathCd: 0,
          orderItemCount: 0,
          dlvrInfo: '',
          brandShopUrl: '',
          isFlashSaleNew: 'Y',
          custPrchQtyLimitYn: 'N',
          ordQty: '116',
          plusCoupon2EndTime: '',
          staffBnft: {
            couponBnftRate: 0,
            useAmt: 0,
            couponId: '',
            bnftBiggerYn: 'N',
            memberId: '',
            userId: 0,
            class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
            balanceAmt: 0,
            limitAmt: 0,
            empYn: 'N'
          },
          productName: '로티캠프 빅패밀리 원터치텐트 5-6인용',
          plusCoupon3Way: '',
          partNumber: '26710336',
          padDcWay: '',
          addAddressFlag: 'N',
          custDurSpr: null,
          rmaExtraClvrExpnsYn: '',
          lspValue: 0,
          giftBnftList: null,
          dlvRexPnsCalcType: '10',
          liveLimit: 'Y',
          arsValue: 0,
          goodsTypeCd: 'CMM',
          promValPad: 0,
          isPlayVodPath: '',
          padAmt: 0,
          coBuyId: '',
          plusCoupon1EndTime: '',
          orginSalePrice: 0,
          costBase: 97875,
          lspAmt: 0,
          tvList: null,
          mparam: null,
          everyCpExcptYn: 'N',
          staffSalePrice: 0,
          salePrice: 130500,
          intuitiveShippingDate: '',
          plusCoupon1CpIDFR: '',
          noSaleCatalogYn: 'N',
          nation: '',
          wishProduct: false,
          endTime: '',
          brandCd: '775615',
          affilEntCd: '',
          plusCoupon3OddTime: 0,
          excptYn: 'N',
          offerPrice: 130500,
          discountFlag: 'N',
          displayFlag: 'N',
          deliveryType: '',
          startTime: '',
          catGb: '',
          cpcAmt: 0,
          orderPrgrsTypeCd: '100',
          modelName: '',
          priodDlvrYn: 'N',
          remainTime: '0',
          urlParam: '',
          plusCoupon1Way: '',
          leafCd: '',
          sequenceNo: '',
          giftYn: 'N',
          dlvrPrice: 0,
          isPlayVodId: '',
          costTypeCd: '10',
          designName: '',
          styleMngYn: 'Y',
          plusCoupon2OddTime: 0,
          giftCardWriteFlag: 'N',
          installPrice: '',
          qnaFlag: 'Y',
          noSaleCatalogMsg: '',
          dutyUseDur: null,
          headCopy: '',
          giftPackFlag: 'N',
          partialYn: '',
          rmaJejuRegnDlvrExpns: 0,
          isPlayStoreYn: '',
          class: 'class com.ns.commerce.nsitemdetails.bean.NSItemDetailsDataBean',
          partialBnftList: null,
          cpcValue: 0,
          applyPrice: 130500,
          dispTypeCd: '15',
          company: '',
          packCatentrys: '',
          mmRntalPrc: null,
          vipFlashProdYn: 'N',
          okCashUndispYn: '',
          cardChrgdcExcptYn: 'N',
          vendorId: 1001614,
          plusCoupon2CpIDFR: '',
          markForDelete: 0,
          cardBnftStr: '',
          plusCoupon1OddTime: 0,
          tvLiveCd: '',
          staYmd: null,
          dofStartDttm: '',
          score: 0,
          catentryId: 26710336,
          rfndShapeCd: '',
          creditCardSalePrice: 0,
          alliMallGoodsCd: null,
          padValue: 0,
          vodPlay: {},
          rmaDlvrYn: '',
          vipSalePrice: 0,
          apprStatCd: '20',
          lspDcWay: '',
          outgoLocCd: '1',
          finishDealFlag: '',
          custGetDttm: '',
          dlvrNumber: '',
          arsDcWay: '',
          brandName: '로티캠프',
          optionList: null,
          headCopyList: [
            {
              overLinkUrl: null,
              textImagePath: null,
              headCopyDesc: "&lt;P&gt;&amp;nbsp;&lt;/P&gt;&lt;P style=\"TEXT-ALIGN: center\"&gt;&lt;IMG onclick=\"javascript:HUB_INIT.doNsTimesEvent('100000078378');\" id=tx_entry_73423_ class=txc-image style=\"CURSOR: pointer; FLOAT: none; CLEAR: none\" src=\"http://image.nsmall.com/ec_comimages/nsupload/xplat/2019/20190328/16223123510149314.jpg\" &lt;IMG&gt;&lt;/P&gt;&lt;P&gt;&amp;nbsp;&lt;/P&gt;",
              class: 'class com.ns.commerce.nsitemdetails.bean.NSHeadCopyDataBean',
              headName: '남성스포츠 다운로드 5%_모바일',
              overImagePath: null,
              dispgb: '0'
            },
            {
              overLinkUrl: null,
              textImagePath: null,
              headCopyDesc: "&lt;P&gt;&amp;nbsp;&lt;/P&gt;&lt;P&gt;&lt;A class=tx-link href=\"javascript:HUB_INIT.checkInflowOutsideChannel('http://m.nsmall.com/NSExhibit?catgroupId=-58544')\" target=_blank&gt;&lt;IMG id=tx_entry_15569_ class=txc-image style=\"FLOAT: none; CLEAR: none\" src=\"http://image.nsmall.com/ec_comimages/nsupload/xplat/2019/20190605/22202435979611117.jpg\"&gt;&lt;/A&gt;&lt;/P&gt;&lt;p&gt;&amp;nbsp;&lt;/p&gt;",
              class: 'class com.ns.commerce.nsitemdetails.bean.NSHeadCopyDataBean',
              headName: '로티_모바일',
              overImagePath: null,
              dispgb: '0'
            },
            {
              overLinkUrl: null,
              textImagePath: null,
              headCopyDesc: "&lt;P&gt;&amp;nbsp;&lt;/P&gt;&lt;P style=\"TEXT-ALIGN: center\"&gt;&amp;nbsp;&lt;/P&gt;&lt;P&gt;&amp;nbsp;&lt;/P&gt;&lt;P style=\"TEXT-ALIGN: center\"&gt;&lt;IMG onclick=\"javascript:doNsTimesEvent('100000078378');\" id=tx_entry_46036_ class=txc-image style=\"CURSOR: pointer; FLOAT: none; CLEAR: none\" src=\"http://image.nsmall.com/ec_comimages/nsupload/xplat/2019/20190328/16222896583745890.jpg\" &lt;IMG&gt;&lt;/P&gt;&lt;P&gt;&amp;nbsp;&lt;/P&gt;",
              class: 'class com.ns.commerce.nsitemdetails.bean.NSHeadCopyDataBean',
              headName: '남성스포츠 다운로드 5%_PC',
              overImagePath: null,
              dispgb: '3'
            },
            {
              overLinkUrl: null,
              textImagePath: null,
              headCopyDesc: '&lt;P&gt;&amp;nbsp;&lt;/P&gt;&lt;P&gt;&lt;A class=tx-link href="http://www.nsmall.com/NSTimesPrmtTempView?catgroupId=-58544&amp;amp;storeId=13001&amp;amp;catalogId=21151&amp;amp;langId=-9" target=_blank&gt;&lt;IMG id=tx_entry_72527_ class=txc-image style="FLOAT: none; CLEAR: none" src="http://image.nsmall.com/ec_comimages/nsupload/xplat/2019/20190605/22202357072166568.jpg"&gt;&lt;/A&gt;&lt;/P&gt;&lt;p&gt;&amp;nbsp;&lt;/p&gt;',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSHeadCopyDataBean',
              headName: '로티_PC',
              overImagePath: null,
              dispgb: '3'
            }
          ],
          deliveryPrice: 0,
          saleYn: 'Y',
          rmaGnrlRegnDlvrExpns: 0,
          plusCoupon2Way: '',
          deliveryInfo: '3',
          itnEpsuYn: 'Y',
          orderPostPrdnFlag: 'N',
          staffSaleRate: 0,
          saleRate: 0,
          plusCoupon3CpIDFR: '',
          dofEndDttm: '',
          lumpsumdcExcptYn: 'N',
          earlyMorningDiscountFlag: 'N',
          ctcomTvList: null,
          plusCoupon1: 0,
          plusCoupon2: 0,
          minCntrbPfrateYn: null,
          plusCoupon3: 0,
          chcChildYn: 'N',
          join_cnt: 0,
          dlvrSaveYn: '',
          maxItemCountOnOnce: 9999,
          installItemFlag: 'N',
          cateInfoList: null,
          dlvrPriceMsg: '',
          rmtrlpoo: '중국',
          newMemberBenefit: '',
          buyable: 0,
          couponList: [],
          ifiValue: '0',
          dlvrWayCd1: '10',
          maxOrderPossQty: 0,
          padValueRto: 0,
          bonusGift: '',
          photoList: null,
          orginSaleRate: 0,
          plusCoupon3EndTime: '',
          endYmd: null,
          couponSubList: null,
          okCashbackUrl: '',
          adultItemFlag: 'N',
          productCnt: 0,
          cpcDcWay: '',
          prcWaveDisp: '',
          minCntrbPfRate: 100,
          ctcomLiveCd: '',
          packPartNumbers: ''
        },
        itemLiveYN: 'Y',
        selectPack: [],
        attributes: [
          {
            VALUE: '그린',
            NAME: 'COLOR 단품속성',
            SUBSEQ: '0',
            SEQ: '1'
          }
        ],
        goodsDetail: {
          CATENTRY_ATTR_LIST: [
            {
              SEQUENCE: '1',
              ATTR_ID: '101',
              ATTRVAL_ID: '5000780'
            }
          ],
          OFFER_ITEM_CD: '',
          PGM_CD: '',
          DCPRICE: '130500',
          SALE_YN: 'Y',
          CATENTTYPE: 'CMM',
          _XCatEntChn_OTHRCOMEPSUYN: 'N',
          convinGb: 'N',
          _XCatEntChn_FREEDLVRPOSSAMT: '0',
          _prc_VAT_AMT: '8898',
          RMA_DLVR_YN: 'Y',
          BRDCT_CNNL_CD: '',
          CHILD_PARTNUMBER: '10193972879',
          COLLATERAL_ID: '0',
          PROM_VAL_ARS: '0',
          PARENT_BUYABLE: '1',
          CATENTRY_ID_PARENT: '26710336',
          INVENTORY_QUANTITY: '888',
          _XCatEntChn_LUMPSUMDCEXCPTYN: 'N',
          BRAND_CD: '775615',
          PROM_VAL_PAD_AMT: '0',
          CHILD_MFNAME: '',
          BRDCT_DATE: '',
          NORMAL_CST_PRC: '88977',
          _prc_COST_TYPE_CD: '10',
          COKEY: '',
          PROM_VAL_PAD: '0',
          VALID_YN: 'N',
          XCATENTRY_DISP_MIN_CMSSN_APPLY_TYPE_CD: 'RTO',
          _XCatEntChn_PRCCOMPEXCPTYN: 'N',
          GIFT_PARNT_ORDER_SEQ: '',
          SLCT_DAY_OBJT_GOODS_YN: 'Y',
          CHILD_ITEMSPC_ID: '90055735821',
          OFFERPRICE: '130500,130500,130500,10,97875,-1,88977,0',
          _XPriceDtl_SL_PRC: '130500',
          _XCatEntChn_DLVRFEECODYN: 'N',
          PARENT_CATENTTYPE_ID: 'ProductBean',
          UNIT_REGI_TYPE_CD: 'TYP',
          BUY_TAX_TYPE_CD: '20',
          _prc_MARG_RATE: '25',
          CAT4_CATEGORY_ID: '1911',
          CHILD_BUYABLE: '1',
          GIFT_YN: 'N',
          DLVR_WAY_CD1: '10',
          PROM_DC_WAY_CPC: 'N',
          DLVR_WAY_CD2: '20',
          DLVY_DAY: '',
          QUANTITY: '2',
          ITN_EPSU_YN: 'Y',
          GRP_PURCHASE_OWNER: '',
          PARENT_MARKFORDELETE: '0',
          PARTNUM: '10193972879',
          INST_GOODS_YN: 'N',
          FIELD2: '888',
          _prc_SL_PRC: '130500',
          GRP_PURCHASE_YN: '',
          _XCatEntChn_MDCD: '118617',
          FLASH_SALE_YN: '',
          _fix_SL_PRC: '130500',
          INVENTORY_QUANTITY_TYPE: '10',
          ITEM_CARDRECEIVER: '',
          CUST_MAX_ORDER_POSS_QTY: '',
          PROM_VAL_IFI: '0',
          CATGROUP_ID: '1911',
          ORDERS_ID: '300070490054',
          _XCatEntChn_CAMP_ID: '',
          PROM_DC_WAY_LSP: 'N',
          CTR_POSIT_CD: '',
          BUYABLE: '1',
          PCKG_YN: 'N',
          AGREE_DLINE: '3',
          CO_BUY_ID: '',
          SALE_WAY_CD: '20',
          PARENT_MFPARTNUMBER: '1001614',
          _XCatEntChn_GOODSEVALWRITEIPOSSYN: 'N',
          CARDDESIGN: '',
          DLVY_GRP_KEY: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:1001614,DLVR_WAY_CD1:10,PCKG_YN:N,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:1,FREE_DLVR_POSS_AMT:,SUB_ID:256241122,',
          WW_YN: 'N',
          CARDMESSAGE: '',
          PARENT_MFNAME: '(주)로티',
          DLVY_GRP_KEY_CNT: '1',
          MEMBER_ID: '100000000',
          DLVR_SCHD_DTTM: '',
          _XPriceDtl_MARG_RATE: '25',
          PROM_VAL_PAD_RTO: '0',
          _XCatEntChn_DLVREXPNSCALCTYPE: '10',
          SB_EVENT_YN: 'N',
          TAXRATE: '10',
          _fix_MARG_RATE: '25',
          deviceChnId: 'MOBIL',
          _XCatEntChn_DLVREXPNSAPPLYTYPE: 'BNN',
          RECEIVER_MOBILE: '',
          CAT1_CATEGORY_ID: '7',
          BASEPRICE: '',
          PARTNUMBER: '10193972879',
          _XPriceDtl_VAT_AMT: '8898',
          REL_OFFER_ID: '',
          WBL_NUM: '',
          _XCatEntChn_BUSCHN_ID: 'INT',
          XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE: '0',
          STOREENT_ID: '13001',
          LASTCREATE: '2020-05-14 11:05:45.856',
          CHILD_BASEITEM_ID: '26001691',
          REV_TAX_TYPE_CD: '20',
          CNNL_CLSSF_CD: '',
          CHILD_CATENTRY_ID: '10193972879',
          CATALOG_ID: '97001',
          _XCatEntChn_FREEDLVRSPRCD: '20',
          CARDSENDDT: '',
          PRICE: '130500',
          TOTALPRODUCT: '130500',
          OUTGO_LOC_LSC_CD: '10',
          DLVY_PERIOD: '',
          _XCatEntChn_DLVREXPNSAPPLYUNIT: '',
          CHILD_FIELD2: '',
          XCATENTRY_DISP_NAME: '로티캠프 빅패밀리 원터치텐트 5-6인용',
          intuitiveShippingDate: '20200518',
          MULTI_CD: '',
          ITEMSPC_ID: '90055735821',
          CHILD_CATENTTYPE_ID: 'ItemBean',
          ORDERITEMS_ID: '256241122',
          OFFER_IDFR: '',
          CATENTTYPE_ID: 'ItemBean',
          acceptPath: '500',
          PRIOD_DLVR_YN: 'N',
          AFFIL_ENT_CD: '',
          PROM_DC_WAY_ARS: '',
          MFPARTNUMBER: '',
          PROM_VAL_CPC: '0',
          CATENTRY_ID_CHILD: '10193972879',
          XBUSCHNID: 'INT',
          CHILD_MEMBER_ID: '7000000000000000201',
          _fix_COST_TYPE_CD: '10',
          ORDERIPADDRESS: '',
          CHILD_MARKFORDELETE: '0',
          ADDRESS_ID: '20653058537',
          MARKFORDELETE: '0',
          LSP_YN: 'N',
          XCATENTRY_DISP_ITNCATENTRYNM: '로티캠프 빅패밀리 원터치텐트 5-6인용',
          XCOST_TYPE_CD: '10',
          VENDOR_ID: '1001614',
          _XPriceDtl_COST_VAT_PERDO: '88977',
          PARNT_ORDER_SEQ: '',
          CAT2_CATEGORY_ID: '134',
          GOODS_NM_TRPT: '로티캠프 빅패밀리 원터치텐트 5-6인용',
          _XCatEntChn_SALESTAT: 'ON',
          _XCatEntChn_DISSCTNT: '',
          PROM_DC_WAY_PAD: '',
          MSG_CARD_WRITE_YN: 'N',
          _fix_VAT_AMT: '8898',
          XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE: '',
          PARENT_MEMBER_ID: '7000000000000000201',
          relaxGb: 'N',
          PROM_VAL_LSP: 'N',
          _XCatEntChn_CATENTRYWG: '',
          TOTALADJUSTMENT: '0',
          SEND_TYPE: '',
          ADLT_GOODS_YN: 'N',
          ESPOT_ID: '0',
          RFND_SHAPE_CD: 'PST',
          CAMP_ID: '',
          XBUSCHN_ID: 'INT',
          _XCatEntChn_CARDCHRGDCEXCPTYN: 'N',
          STYLE_MNG_YN: 'Y',
          _prc_COST_VAT_PERDO: '88977',
          MFNAME: '',
          _XPriceDtl_COST_TYPE_CD: '10',
          OUTGO_LOC_CD: '1',
          _fix_COST_VAT_PERDO: '88977',
          ORDER_SEQ: '647550',
          FLOWER_PRD_INFO: {},
          DLVR_ENT_CD: '',
          PARENT_PARTNUMBER: '26710336',
          PROM_VAL_LSP_RATE: '0',
          APPLY_CST_PRC: '88977',
          CHILD_MFPARTNUMBER: '',
          ONCE_MAX_ORDER_POSS_QTY: '9999',
          PARENT_BASEITEM_ID: '26001691',
          CUST_PRIOD_CNVEY_YN: '',
          _XCatEntChn_EVERYCPEXCPTYN: 'N',
          IMDTDCCPAMT: '0',
          PARENT_CATENTRY_ID: '26710336',
          KEEP_WAY_CD: '10',
          PARENT_FIELD2: '888',
          CARDSENDTYPE: '',
          _XCatEntChn_GIFTC_GOODS_ID: '',
          RMASHIPCHARGE: '0',
          XCATENTRY_DISP_MFNAME: '(주)로티',
          BASEITEM_ID: '26001691',
          ITEM_RECEIVER_EMAIL: '',
          ORGIN_ORDER_SEQ: '',
          _XCatEntChn_DLVREXPNS: '0',
          CATENTRY_ID: '10193972879',
          ITNCATENTRYNM: '',
          DISP_TYPE_CD: '15',
          INVENTORY_QUANTITY_SCHD_DATE: '20200515',
          SHIPCHARGE: '0',
          ITEM_CARDSENDER: '',
          STATUS: 'H',
          OUTGO_CMD_SCHD_DATE: '',
          NORMAL_SL_PRC: '130500',
          PTN_CD: '110',
          ITEMPRICE: '130500',
          CAT3_CATEGORY_ID: '666',
          _XCatEntChn_ITNCATENTRYNM: '로티캠프 빅패밀리 원터치텐트 5-6인용',
          PARENT_ITEMSPC_ID: '',
          CATEGORY_ID: '1588049',
          ONEPROD_ID: '26710336'
        },
        imageSourceURL: 'https://product-image.prod-nsmall.com/itemimg/6/26/336/26710336_G.jpg',
        selectGift: [],
        selectChoice: [],
        itemBaseData: {
          Price: 130500,
          QTY: 1,
          COST_PRICE: 97875,
          COST_VAT_PERDO: 88977,
          VAT_AMT: 8898,
          BasePrice: 130500,
          MIN_CMSSN_RATE_SCOPE: 0,
          MIN_CMSSN_RATE_SCOPE_PRICE: 0,
          MargPrice: 130500
        }
      },
      {
        itemDetailInfo: {
          promDcWayPad: '',
          payTypeCd: '',
          busChnId: 'INT',
          arsAmt: 0,
          cardBnftList: null,
          appSaleRate: 0,
          accptPathCd: 0,
          orderItemCount: 0,
          dlvrInfo: '',
          brandShopUrl: '',
          isFlashSaleNew: 'N',
          custPrchQtyLimitYn: 'N',
          ordQty: '',
          plusCoupon2EndTime: '',
          staffBnft: {
            couponBnftRate: 0,
            useAmt: 0,
            couponId: '',
            bnftBiggerYn: 'N',
            memberId: '',
            userId: 0,
            class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
            balanceAmt: 0,
            limitAmt: 0,
            empYn: 'N'
          },
          productName: '아이닉스 패밀리 침대 방수 매트리스 커버 260x200 (SS+Q)',
          plusCoupon3Way: '',
          partNumber: '28231929',
          padDcWay: '',
          addAddressFlag: 'N',
          custDurSpr: null,
          rmaExtraClvrExpnsYn: '',
          lspValue: 0,
          giftBnftList: null,
          dlvRexPnsCalcType: '10',
          liveLimit: 'Y',
          arsValue: 0,
          goodsTypeCd: 'CMM',
          promValPad: 0,
          isPlayVodPath: '',
          padAmt: 0,
          coBuyId: '',
          plusCoupon1EndTime: '',
          orginSalePrice: 0,
          costBase: 35112,
          lspAmt: 0,
          tvList: null,
          mparam: null,
          everyCpExcptYn: 'N',
          staffSalePrice: 0,
          salePrice: 37100,
          intuitiveShippingDate: '',
          plusCoupon1CpIDFR: '',
          noSaleCatalogYn: 'N',
          nation: '',
          wishProduct: false,
          endTime: '',
          brandCd: '767957',
          affilEntCd: '',
          plusCoupon3OddTime: 0,
          excptYn: 'N',
          offerPrice: 39900,
          discountFlag: 'N',
          displayFlag: '',
          deliveryType: '',
          startTime: '',
          catGb: '',
          cpcAmt: 0,
          orderPrgrsTypeCd: '100',
          modelName: '',
          priodDlvrYn: null,
          remainTime: '',
          urlParam: '',
          plusCoupon1Way: '',
          leafCd: '',
          sequenceNo: '',
          giftYn: 'N',
          dlvrPrice: 0,
          isPlayVodId: '',
          costTypeCd: '10',
          designName: '',
          styleMngYn: 'N',
          plusCoupon2OddTime: 0,
          giftCardWriteFlag: 'N',
          installPrice: '',
          qnaFlag: 'Y',
          noSaleCatalogMsg: '',
          dutyUseDur: null,
          headCopy: '',
          giftPackFlag: 'N',
          partialYn: '',
          rmaJejuRegnDlvrExpns: 0,
          isPlayStoreYn: '',
          class: 'class com.ns.commerce.nsitemdetails.bean.NSItemDetailsDataBean',
          partialBnftList: null,
          cpcValue: 0,
          applyPrice: 39900,
          dispTypeCd: '15',
          company: '',
          packCatentrys: '',
          mmRntalPrc: null,
          vipFlashProdYn: 'N',
          okCashUndispYn: '',
          cardChrgdcExcptYn: 'N',
          vendorId: 106759,
          plusCoupon2CpIDFR: '',
          markForDelete: 0,
          cardBnftStr: '',
          plusCoupon1OddTime: 0,
          tvLiveCd: '',
          staYmd: null,
          dofStartDttm: '',
          score: 0,
          catentryId: 28231929,
          rfndShapeCd: '',
          creditCardSalePrice: 0,
          alliMallGoodsCd: null,
          padValue: 0,
          vodPlay: {},
          rmaDlvrYn: '',
          vipSalePrice: 0,
          apprStatCd: '20',
          lspDcWay: '',
          outgoLocCd: '1',
          finishDealFlag: '',
          custGetDttm: '',
          dlvrNumber: '',
          arsDcWay: '',
          brandName: '아이닉스',
          optionList: null,
          headCopyList: null,
          deliveryPrice: 0,
          saleYn: 'Y',
          rmaGnrlRegnDlvrExpns: 0,
          plusCoupon2Way: '',
          deliveryInfo: '3',
          itnEpsuYn: 'Y',
          orderPostPrdnFlag: 'N',
          staffSaleRate: 0,
          saleRate: 0,
          plusCoupon3CpIDFR: '',
          dofEndDttm: '',
          lumpsumdcExcptYn: 'N',
          earlyMorningDiscountFlag: 'N',
          ctcomTvList: null,
          plusCoupon1: 0,
          plusCoupon2: 0,
          minCntrbPfrateYn: null,
          plusCoupon3: 0,
          chcChildYn: 'N',
          join_cnt: 0,
          dlvrSaveYn: '',
          maxItemCountOnOnce: 9999,
          installItemFlag: 'N',
          cateInfoList: null,
          dlvrPriceMsg: '',
          rmtrlpoo: null,
          newMemberBenefit: '',
          buyable: 0,
          couponList: [
            {
              plusCoupon: 7,
              couponType: '10',
              offerIdfr: '1051601,',
              couponBeforePrice: 0,
              flashCouponOddTime: '',
              plusCouponEndTime: '',
              plusCouponAmt: 2800,
              affilEntCd: '',
              flashOrderCnt: 0,
              cpNm: '',
              commCdNm: '',
              plusCouponWay: '2',
              offerItemCd: '',
              plusCouponCpIDFR: '',
              commCdVal: '',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemDetailCouponDataBean',
              plusCouponOddTime: 0,
              maxBnftLimit: ''
            }
          ],
          ifiValue: '0',
          dlvrWayCd1: '10',
          maxOrderPossQty: 0,
          padValueRto: 0,
          bonusGift: '',
          photoList: null,
          orginSaleRate: 0,
          plusCoupon3EndTime: '',
          endYmd: null,
          couponSubList: null,
          okCashbackUrl: '',
          adultItemFlag: 'N',
          productCnt: 0,
          cpcDcWay: '',
          prcWaveDisp: '',
          minCntrbPfRate: 100,
          ctcomLiveCd: '',
          packPartNumbers: ''
        },
        itemLiveYN: 'Y',
        selectPack: [],
        attributes: [
          {
            VALUE: '',
            NAME: '아이닉스 패밀리 침대 방수 매트리스 커버 260x200 (SS+Q)',
            SUBSEQ: '0',
            SEQ: '0'
          }
        ],
        goodsDetail: {
          CATENTRY_ATTR_LIST: [],
          OFFER_ITEM_CD: '',
          PGM_CD: '',
          DCPRICE: '37100',
          SALE_YN: 'Y',
          CATENTTYPE: 'CMM',
          _XCatEntChn_OTHRCOMEPSUYN: 'N',
          convinGb: 'N',
          _XCatEntChn_FREEDLVRPOSSAMT: '0',
          _prc_VAT_AMT: '3192',
          RMA_DLVR_YN: 'Y',
          BRDCT_CNNL_CD: '',
          CHILD_PARTNUMBER: '10212307465',
          COLLATERAL_ID: '0',
          PROM_VAL_ARS: '0',
          PARENT_BUYABLE: '1',
          CATENTRY_ID_PARENT: '28231929',
          INVENTORY_QUANTITY: '9943',
          _XCatEntChn_LUMPSUMDCEXCPTYN: 'N',
          BRAND_CD: '767957',
          PROM_VAL_PAD_AMT: '0',
          CHILD_MFNAME: '',
          BRDCT_DATE: '',
          NORMAL_CST_PRC: '31920',
          _prc_COST_TYPE_CD: '10',
          COKEY: '',
          PROM_VAL_PAD: '0',
          VALID_YN: 'N',
          XCATENTRY_DISP_MIN_CMSSN_APPLY_TYPE_CD: 'RTO',
          _XCatEntChn_PRCCOMPEXCPTYN: 'N',
          GIFT_PARNT_ORDER_SEQ: '',
          SLCT_DAY_OBJT_GOODS_YN: 'Y',
          CHILD_ITEMSPC_ID: '90063800205',
          OFFERPRICE: '39900,37100,39900,10,35112,-1,31920,0',
          _XPriceDtl_SL_PRC: '39900',
          _XCatEntChn_DLVRFEECODYN: 'N',
          PARENT_CATENTTYPE_ID: 'ProductBean',
          UNIT_REGI_TYPE_CD: 'OPT',
          BUY_TAX_TYPE_CD: '20',
          _prc_MARG_RATE: '12',
          CAT4_CATEGORY_ID: '2401',
          CHILD_BUYABLE: '1',
          GIFT_YN: 'N',
          DLVR_WAY_CD1: '10',
          PROM_DC_WAY_CPC: 'N',
          DLVR_WAY_CD2: '20',
          DLVY_DAY: '',
          QUANTITY: '2',
          ITN_EPSU_YN: 'Y',
          GRP_PURCHASE_OWNER: '',
          PARENT_MARKFORDELETE: '0',
          PARTNUM: '10212307465',
          INST_GOODS_YN: 'N',
          FIELD2: '9943',
          _prc_SL_PRC: '39900',
          GRP_PURCHASE_YN: '',
          _XCatEntChn_MDCD: '118721',
          FLASH_SALE_YN: '',
          _fix_SL_PRC: '39900',
          INVENTORY_QUANTITY_TYPE: '10',
          ITEM_CARDRECEIVER: '',
          CUST_MAX_ORDER_POSS_QTY: '',
          PROM_VAL_IFI: '0',
          CATGROUP_ID: '2401',
          ORDERS_ID: '300070490054',
          _XCatEntChn_CAMP_ID: '',
          PROM_DC_WAY_LSP: 'N',
          CTR_POSIT_CD: '',
          BUYABLE: '1',
          PCKG_YN: 'Y',
          AGREE_DLINE: '3',
          CO_BUY_ID: '',
          SALE_WAY_CD: '20',
          PARENT_MFPARTNUMBER: '106759',
          _XCatEntChn_GOODSEVALWRITEIPOSSYN: 'N',
          CARDDESIGN: '',
          DLVY_GRP_KEY: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:106759,DLVR_WAY_CD1:10,PCKG_YN:Y,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:1,FREE_DLVR_POSS_AMT:50000,',
          WW_YN: 'N',
          CARDMESSAGE: '',
          PARENT_MFNAME: '대우침장',
          DLVY_GRP_KEY_CNT: '1',
          MEMBER_ID: '100000000',
          DLVR_SCHD_DTTM: '',
          _XPriceDtl_MARG_RATE: '12',
          PROM_VAL_PAD_RTO: '0',
          _XCatEntChn_DLVREXPNSCALCTYPE: '10',
          SB_EVENT_YN: 'N',
          TAXRATE: '10',
          _fix_MARG_RATE: '12',
          deviceChnId: 'MOBIL',
          _XCatEntChn_DLVREXPNSAPPLYTYPE: 'BNN',
          RECEIVER_MOBILE: '',
          CAT1_CATEGORY_ID: '11',
          BASEPRICE: '',
          PARTNUMBER: '10212307465',
          _XPriceDtl_VAT_AMT: '3192',
          REL_OFFER_ID: '',
          WBL_NUM: '',
          _XCatEntChn_BUSCHN_ID: 'INT',
          XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE: '0',
          STOREENT_ID: '13001',
          LASTCREATE: '2020-05-14 11:06:39.055',
          CHILD_BASEITEM_ID: '27521615',
          REV_TAX_TYPE_CD: '20',
          CNNL_CLSSF_CD: '',
          CHILD_CATENTRY_ID: '10212307465',
          CATALOG_ID: '97001',
          _XCatEntChn_FREEDLVRSPRCD: '10',
          CARDSENDDT: '',
          PRICE: '39900',
          TOTALPRODUCT: '39900',
          OUTGO_LOC_LSC_CD: '10',
          DLVY_PERIOD: '',
          _XCatEntChn_DLVREXPNSAPPLYUNIT: '',
          CHILD_FIELD2: '',
          XCATENTRY_DISP_NAME: '아이닉스 패밀리 침대 방수 매트리스 커버 260x200 (SS+Q)',
          intuitiveShippingDate: '20200518',
          MULTI_CD: '',
          ITEMSPC_ID: '90063800205',
          CHILD_CATENTTYPE_ID: 'ItemBean',
          ORDERITEMS_ID: '256241124',
          OFFER_IDFR: '',
          CATENTTYPE_ID: 'ItemBean',
          acceptPath: '500',
          PRIOD_DLVR_YN: '',
          AFFIL_ENT_CD: '',
          PROM_DC_WAY_ARS: '',
          MFPARTNUMBER: '',
          PROM_VAL_CPC: '0',
          CATENTRY_ID_CHILD: '10212307465',
          XBUSCHNID: 'INT',
          CHILD_MEMBER_ID: '7000000000000000201',
          _fix_COST_TYPE_CD: '10',
          ORDERIPADDRESS: '',
          CHILD_MARKFORDELETE: '0',
          ADDRESS_ID: '20653058537',
          MARKFORDELETE: '0',
          LSP_YN: 'N',
          XCATENTRY_DISP_ITNCATENTRYNM: '아이닉스 패밀리 침대 방수 매트리스 커버 260x200 (SS+Q)',
          XCOST_TYPE_CD: '10',
          VENDOR_ID: '106759',
          _XPriceDtl_COST_VAT_PERDO: '31920',
          PARNT_ORDER_SEQ: '',
          CAT2_CATEGORY_ID: '153',
          GOODS_NM_TRPT: '패밀리방수커버 260',
          _XCatEntChn_SALESTAT: 'ON',
          _XCatEntChn_DISSCTNT: '',
          PROM_DC_WAY_PAD: '',
          MSG_CARD_WRITE_YN: 'N',
          _fix_VAT_AMT: '3192',
          XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE: '',
          PARENT_MEMBER_ID: '7000000000000000201',
          relaxGb: 'N',
          PROM_VAL_LSP: 'N',
          _XCatEntChn_CATENTRYWG: '',
          TOTALADJUSTMENT: '0',
          SEND_TYPE: '',
          ADLT_GOODS_YN: 'N',
          ESPOT_ID: '0',
          RFND_SHAPE_CD: 'PST',
          CAMP_ID: '',
          XBUSCHN_ID: 'INT',
          _XCatEntChn_CARDCHRGDCEXCPTYN: 'N',
          STYLE_MNG_YN: 'N',
          _prc_COST_VAT_PERDO: '31920',
          MFNAME: '',
          _XPriceDtl_COST_TYPE_CD: '10',
          OUTGO_LOC_CD: '1',
          _fix_COST_VAT_PERDO: '31920',
          ORDER_SEQ: '562533',
          FLOWER_PRD_INFO: {},
          DLVR_ENT_CD: '',
          PARENT_PARTNUMBER: '28231929',
          PROM_VAL_LSP_RATE: '0',
          APPLY_CST_PRC: '31920',
          CHILD_MFPARTNUMBER: '',
          ONCE_MAX_ORDER_POSS_QTY: '9999',
          PARENT_BASEITEM_ID: '27521615',
          CUST_PRIOD_CNVEY_YN: '',
          _XCatEntChn_EVERYCPEXCPTYN: 'N',
          IMDTDCCPAMT: '0',
          PARENT_CATENTRY_ID: '28231929',
          KEEP_WAY_CD: '10',
          PARENT_FIELD2: '9943',
          CARDSENDTYPE: '',
          _XCatEntChn_GIFTC_GOODS_ID: '',
          RMASHIPCHARGE: '0',
          XCATENTRY_DISP_MFNAME: '대우침장',
          BASEITEM_ID: '27521615',
          ITEM_RECEIVER_EMAIL: '',
          ORGIN_ORDER_SEQ: '',
          _XCatEntChn_DLVREXPNS: '3000',
          CATENTRY_ID: '10212307465',
          ITNCATENTRYNM: '',
          DISP_TYPE_CD: '15',
          INVENTORY_QUANTITY_SCHD_DATE: '20200515',
          SHIPCHARGE: '3000',
          ITEM_CARDSENDER: '',
          STATUS: 'H',
          OUTGO_CMD_SCHD_DATE: '',
          NORMAL_SL_PRC: '39900',
          PTN_CD: '110',
          ITEMPRICE: '39900',
          CAT3_CATEGORY_ID: '734',
          _XCatEntChn_ITNCATENTRYNM: '아이닉스 패밀리 침대 방수 매트리스 커버 260x200 (SS+Q)',
          PARENT_ITEMSPC_ID: '',
          CATEGORY_ID: '1587795',
          ONEPROD_ID: '28231929'
        },
        imageSourceURL: 'https://product-image.prod-nsmall.com/itemimg/9/28/929/28231929_G.jpg',
        selectGift: [],
        selectChoice: [],
        itemBaseData: {
          Price: 39900,
          QTY: 1,
          COST_PRICE: 35112,
          COST_VAT_PERDO: 31920,
          VAT_AMT: 3192,
          BasePrice: 39900,
          MIN_CMSSN_RATE_SCOPE: 0,
          MIN_CMSSN_RATE_SCOPE_PRICE: 0,
          MargPrice: 39900
        }
      }
    ]
  }

  // 임직원
  const getEmployCouponList = () => {
    return {
      179105966: {
        1: [
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613110708',
            WWW_RATE: 7,
            CP_CLSSF: '11',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200514110708',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '7％ 할인 쿠폰',
            MAX_USE_NUM: 2,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1051601',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        2: [],
        3: [
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20291231102309',
            WWW_RATE: 5,
            CP_CLSSF: '12',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200317102309',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '다운쿠폰 5％다운쿠폰',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070675',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: '2000',
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: '0',
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: '999999999',
            CP_NM: '[바로방문][패밀리] 2，000원할인',
            MAX_USE_NUM: '1',
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070933',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200613105050',
            WWW_RATE: 2,
            CP_CLSSF: '14',
            CP_TYPE: '10',
            AMT_START_VAL: '30000',
            CP_VALID_STARTDD: '20200514105050',
            MAX_BNFT_LIMIT: 30000,
            CP_NM: '[바로방문][패밀리] 2％ 할인',
            MAX_USE_NUM: 1,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1070934',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          },
          {
            WWW_AMT: 0,
            CARD_PREFIX: '',
            APPLY_SPR: '',
            CARD_CO_CD: '',
            AMT_END_VAL: '',
            CP_VALID_ENDDD: '20200605102457',
            WWW_RATE: 20,
            CP_CLSSF: '12',
            CP_TYPE: '10',
            AMT_START_VAL: '',
            CP_VALID_STARTDD: '20200604102457',
            MAX_BNFT_LIMIT: 999999999,
            CP_NM: '임직원 20％할인쿠폰(일부상품한정)',
            MAX_USE_NUM: 992,
            QTY_END_VAL: '',
            OFFER_BRCH: '',
            CP_IDFR: '1063264',
            BNFT_SEQ: '',
            QTY_START_VAL: '',
            CARD_AFFILIATION_CD: ''
          }
        ],
        4: null,
        freeDlvry: [],
        flashMap: {},
        yearDc: []
      }
    }
  }

  const getEmployStaffBnf = () => {
    return {
      couponBnftRate: 20,
      useAmt: 200000,
      couponId: '1063264',
      bnftBiggerYn: 'Y', // 테스트 수정 0
      memberId: '',
      userId: 0,
      class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
      balanceAmt: 1000000, // 테스트 수정 0
      limitAmt: 10000000,
      empYn: 'Y' // 테스트 수정 0
    }
  }

  const getEmployUserInfoBenefit = () => {
    return {
      OKCASHBAG_BALANCE: 10000, // 테스트 수정 0
      NETIWELL_BALANCE: 10000, // 테스트 수정 0
      HAPPYMONEY_BALANCE: 10000, // 테스트 수정 0
      GIFTCARD_BALANCE: '10000', // 테스트 수정 '0'
      MILEAGE_BALANCE: '9000000', // 테스트 수정 '0'
      ACCUMONEY_BALANCE: '10000', // 테스트 수정 '0'
      ANNUDCCP_BALANCE: '10000' // 테스트 수정 '0'
    }
  }

  const getEmployUsePaymentInfo = () => {
    return {
      GIFTCARD: 'Y',
      NETTIWELL: 'N',
      HAPPYMONEY: 'N', // 테스트 수정 'N'
      MOBILE: 'Y',
      NSPAY: 'Y',
      KAKAOPAY: 'N',
      ACCUMMONEY: 'Y',
      CREDITCARD: 'Y',
      MILEAGE: 'Y',
      ACCOUNT: 'Y',
      PAYPIN: 'Y',
      PAYCO: 'Y',
      OKCASHBAGSAVE: 'Y',
      NAVERPAY: 'Y',
      OKCASHBAG: 'Y',
      COMPPAY: 'Y',
      DEPOSIT: 'Y'
    }
  }

  return {
    getCustCouponList,
    getCustStaffBnf,
    getCustUserInfoBenefit,
    getCustUsePaymentInfo,

    getCustMultiCouponList,
    getCustMultiImdtDcCpAmtList,
    getCustMultiBestCouponList,
    getCustMultiOrderGoodList,

    getEmployCouponList,
    getEmployStaffBnf,
    getEmployUserInfoBenefit,
    getEmployUsePaymentInfo
  }
}

const initOrderSheetPayment = mock => {
  mock.onPost(`${CONST.API_URL}/NSOrderRegistVirtualAccntAjaxCmd`, getProcessedWCSParameter('post', temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get('VAK', '국민')))
    .reply(200, temp01ResNSOrderRegistVirtualAccntAjaxCmd.get('VAK', '국민'))

    .onPost(`${CONST.API_URL}/NSOrderRegistVirtualAccntAjaxCmd`, getProcessedWCSParameter('post', temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get('VAW', '우리')))
    .reply(200, temp01ResNSOrderRegistVirtualAccntAjaxCmd.get('VAW', '우리'))

    .onPost(`${CONST.API_URL}/NSOrderRegistVirtualAccntAjaxCmd`, getProcessedWCSParameter('post', temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get('VAS', '신한')))
    .reply(200, temp01ResNSOrderRegistVirtualAccntAjaxCmd.get('VAS', '신한'))

    .onPost(`${CONST.API_URL}/NSOrderRegistVirtualAccntAjaxCmd`, getProcessedWCSParameter('post', temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get('VA', '농협')))
    .reply(200, temp01ResNSOrderRegistVirtualAccntAjaxCmd.get('VA', '농협'))

    .onPost(`${CONST.API_URL}/NSOrderRegistVirtualAccntAjaxCmd`, getProcessedWCSParameter('post', temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get('VAH', '하나')))
    .reply(200, temp01ResNSOrderRegistVirtualAccntAjaxCmd.get('VAH', '하나'))

    .onPost(`${CONST.API_URL}/NSOrderRegistVirtualAccntAjaxCmd`, getProcessedWCSParameter('post', temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get('VAJ', '제일')))
    .reply(200, temp01ResNSOrderRegistVirtualAccntAjaxCmd.get('VAJ', '제일'))

    .onPost(`${CONST.API_URL}/NSOrderRegistVirtualAccntAjaxCmd`, getProcessedWCSParameter('post', temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get('VAK', '경남')))
    .reply(200, temp01ResNSOrderRegistVirtualAccntAjaxCmd.get('VAK', 'VAG'))
}

const initOrderSheetPaymentNspay = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp01ReqAjaxNSWPayNoIntInfo))
    .reply(200, temp01ResAjaxNSWPayNoIntInfo)

    .onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp02ReqAjaxNSWPayPayInfoAll))
    .reply(200, temp02ResAjaxNSWPayPayInfoAll)

    .onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp03ReqAjaxNSWPayDelPayInfo))
    .reply(200, temp03ResAjaxNSWPayDelPayInfo)

    .onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp04ReqAjaxNSWPaySetMajorPayInfo))
    .reply(200, temp04ResAjaxNSWPaySetMajorPayInfo)

    .onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp05ReqAjaxNSWPayDelMajorPayInfo))
    .reply(200, temp05ResAjaxNSWPayDelMajorPayInfo)

    .onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp06ReqAjaxNSWPayMemUnReg))
    .reply(200, temp06ResAjaxNSWPayMemUnReg)

    .onPost(`${CONST.API_URL}/AjaxNSWPay`, getProcessedWCSParameter('post', temp07ReqAjaxNSWPaySetNSPayOneTouchFlag))
    .reply(200, temp07ResAjaxNSWPaySetNSPayOneTouchFlag)
}

const initOrderSheetConfirm = mock => {
  mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp01ReqNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD)))
    .reply(200, temp01ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

    // 결제하기 After
    .onPost(`${CONST.API_URL}/NSItemDetailAjax`, getProcessedWCSParameter('post', {
      cmdType: 11,
      custDurSpr: 0,
      partNumber: '20874208',
      itemCnt: 1,
      accptPath: 500,
      accptPathCd: 500,
      userId: '110548084'
    }))
    .reply(200, { jsonData: { rtn: { flag: 'Y' } } })

  // cmdType=11&custDurSpr=0&partNumber=20874208&itemCnt=1&accptPath=500&accptPathCd=500&userId=110548084

    .onPost(`${CONST.API_URL}/NSItemDetailAjax`, getProcessedWCSParameter('post', {
      cmdType: 11,
      custDurSpr: 1,
      partNumber: '20874208',
      itemCnt: 1,
      accptPath: 500,
      accptPathCd: 500,
      userId: '110548084'
    }))
    .reply(200, { jsonData: { rtn: { flag: 'N' } } })

    // 롯데카드 직승인
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"result":"0000","card_no":"5320920017121956"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"result":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    // KB카드 직승인
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"SendCode":"10001000"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"SendCode":"22002200"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"SendCode":"00130013"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    // 신한카드 직승인
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"sendCode":"success"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"sendCode":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    // Other-phone-휴대폰소액결제
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.MOBILE, 'phone', ',"Resultcd":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.MOBILE))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.MOBILE, 'phone', ',"Resultcd":"0000"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.MOBILE))

    // Other-account-실시간계좌이체
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER, 'account', ',"LGD_RESPCODE":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER, 'account', ',"LGD_RESPCODE":"0000"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER))

    // Other-payco-페이코
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.PAYCO, 'payco', ',"code":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.PAYCO))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.PAYCO, 'payco', ',"code":"0"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.PAYCO))

    // Other-naverpay-네이버페이
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NAVER_PAY, 'naverpay', ',"resultCode":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NAVER_PAY))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NAVER_PAY, 'naverpay', ',"resultCode":"0000"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NAVER_PAY))

    // Other-NSPAY_CARD-NS카드
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD, 'NSPAY_CARD', ',"resultCode":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD, 'NSPAY_CARD', ',"resultCode":"0000"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD))

    // Other-NSPAY_ACCT-NS계좌이체
    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER, 'NSPAY_ACCT', ',"resultCode":""')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER, 'NSPAY_ACCT', ',"resultCode":"0000"')))
    .reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER))

    .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp03ReqNSMypageCommCmdAlejandroGetCardChainId))
    .reply(200, temp03ResNSMypageCommCmdAlejandroGetCardChainId)

    .onPost(`${CONST.API_URL}/PaymentApprovalRequestCmd`, getProcessedWCSParameter('post', temp04ReqPaymentApprovalRequestCmdLastApproval.get(PAY_TYPE_CONST.CREDIT_CARD)))
    .reply(200, temp04ResPaymentApprovalRequestCmdLastApproval.get(PAY_TYPE_CONST.CREDIT_CARD))

    .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })
}

export { initOrderSheet, initOrderSheetDelivery, initOrderSheetDiscount, initOrderSheetPayment, initOrderSheetPaymentNspay, initOrderSheetConfirm }
