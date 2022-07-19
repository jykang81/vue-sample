<template>
  <div class="order_cancel">
    <order-cancel-product
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />

    <order-cancel-reason
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />

    <order-cancel-refund-info
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />

    <order-cancel-refund-method
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />

    <order-cancel-confirm
      v-if="isLoadChildComponent"
      :global-val="globalVal"
      :order-cancel-info="orderCancelInfo"
    />

    <order-cancel-complete
      v-show="globalVal.isOrderComplete"
      :global-val="globalVal"
    />
  </div>
</template>

<script>
import { PAY_TYPE_CONST } from '@/common/constants/order/order'

import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import {
  extend,
  isNull,
  unique
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'

import OrderCancelProduct from '@/components/order/cancel/OrderCancelProduct'
import OrderCancelReason from '@/components/order/cancel/OrderCancelReason'
import OrderCancelRefundInfo from '@/components/order/cancel/OrderCancelRefundInfo'
import OrderCancelRefundMethod from '@/components/order/cancel/OrderCancelRefundMethod'
import OrderCancelConfirm from '@/components/order/cancel/OrderCancelConfirm'
import OrderCancelComplete from '@/components/order/cancel/OrderCancelComplete'
import orderCancelService from '@services/order/cancel/orderCancelService'

export default {
  components: {
    OrderCancelProduct,
    OrderCancelReason,
    OrderCancelRefundInfo,
    OrderCancelRefundMethod,
    OrderCancelConfirm,
    OrderCancelComplete
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoadChildComponent: false,
      orderCancelInfo: {
        result: ''
      },
      globalVal: {
        mInputParams: {}, // (ASIS) m_inputParams
        mOutputDatas: {}, // (ASIS) m_outputDatas

        isOrderComplete: false,
        showDetailArea: true, // 주문정보 영역 (ASIS: divOrderListArea)
        showRefundMethodArea: false, // 환불정보 영역 (ASIS: sectionYourRefundArea)

        orderDataInfo: [], // 상품, 가격정보 display 를 위한 데이터
        pageDataset: [],
        doubleClick: false, // 더블 클릭 체크 변수 // NSSR-36698 : 주문 취소시 더블클릭 불가하도록 개선

        SELECT_TXT: {
          CANCEL: '취소사유를 선택하세요.',
          EXCHANGE: '교환사유를 선택하세요.',
          RETURN: '반품사유를 선택하세요.'
        },
        ACTION_TXT: {
          CANCEL: '취소',
          EXCHANGE: '교환',
          RETURN: '반품'
        },

        action: 'CANCEL', // default action is cacel order...
        ordsid: null, // 주문번호.
        isRefund: false,
        isRefundDisplay: false,
        counselor: 'N', // counselor
        showCancelInformArea: false,
        textRequestButton: '취소',
        noticeItems: [],
        textOrdersId: '',

        reasonPhoneValue: '',
        reasonOptionValue: '',
        reasonOptionText: '',
        reasonTextValue: '',

        REFUND_TYPE: {
          DEPOSIT_AMT: '1', // 예치금
          ACCOUNT: '2' // 계좌
        },
        refundType: '2', // 예치금: 1, 계좌환불: 2
        disabledRefundType1: false,
        refundBankCd: '',
        disabledRefundBankCd: false,
        refundBankText: '',
        refundAccntOwner: '',
        disabledRefundAccntOwner: false,
        refundAccntNo: '',
        disabledRefundAccntNo: false,
        paymemntMethod: '',
        paymemntMethodStatus: ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      this.globalVal.mInputParams = this.param
      this.orderCancelInfo = this.param.orderCancelInfo

      if (this.globalVal.mInputParams.action === 'REFUND') {
        this.globalVal.mInputParams.action = 'RETURN'
      }
      if (!this.globalVal.mInputParams.tabIndex || Number(this.globalVal.mInputParams.tabIndex) === 0) {
        this.globalVal.mInputParams.tabIndex = 'N'
      }
      this.globalVal.action = this.globalVal.mInputParams.action
      this.globalVal.ordsid = this.globalVal.mInputParams.ordersId
      this.globalVal.counselor = this.globalVal.mInputParams.counselor // 상담사취소건

      this.formOrderForm({}, this.responseOrderFormChk) // 변경정보 입력 (1단계)
    },
    /**
     * 변경정보 입력 (1단계)
     * @param {Object} invokeParams - 요청 파라미터
     * @param {Function} callback - 요청완료 후 처리
     * @returns {void}
     */
    formOrderForm (invokeParams, callback) {
      invokeParams.tasknm = this.globalVal.action
      invokeParams.subTasknm = 'form'
      invokeParams.counselorOrderCancel = this.globalVal.counselor // 상담사 카드취소 추가
      this.doModifyOrderCmd(invokeParams, callback)
    },
    /**
     * 주문취소/교환/반품 요청.
     * @param {Object} invokeParams - 요청 파라미터
     * @param {Function} callback - 요청완료 후 처리
     * @returns {void}
     */
    doModifyOrderCmd (invokeParams, callback) {
      invokeParams = extend({
        userId: loginUtil.userId(),
        ordsid: this.globalVal.ordsid,
        tidx: (this.globalVal.mInputParams.tabIndex || 'N'),
        channel: 'mobile'
      }, invokeParams)

      orderCancelService.doModifyOrderCmd(invokeParams, callback)
    },
    /**
     * 변경정보 입력 체크 (1단계)
     * @param {Object} data - 요청 결과 data
     * @returns {void}
     */
    responseOrderFormChk (data) {
      if (!data.msg || !data.msg.root || !data.msg.root.orders || data.msg.root.orders.length === 0) {
        messageUtil.alert('주문 내역이 없습니다.', () => {
          routerUtil.back()
        })
        return false
      }

      const pageDataset = extend(true, {}, this.globalVal.mInputParams.pageData, data.msg.root.orders[0])
      let strInventoryMsg = ''

      for (let i = 0; i < pageDataset.cats.length; i++) {
        if (this.globalVal.action === 'EXCHANGE') { // 교환신청
          const catsData = pageDataset.cats[i]
          const availQuantityType = pageDataset.cats[i].availQuantityType
          const availQuantitySchdDate = pageDataset.cats[i].availQuantitySchdDate

          if (availQuantityType === '30' || availQuantityType === '40') {
            if (strInventoryMsg !== '') { // 처음이 아닐경우 한줄 띄움
              strInventoryMsg += ' '
            }

            let strTitleNm = '' // [브랜드명]상품명
            strTitleNm += (catsData.brandName && catsData.brandName !== '미정의' ? `[${catsData.brandName}]` : '') + catsData.catentryName

            strInventoryMsg += `${strTitleNm} 상품은 `
            strInventoryMsg += `${availQuantitySchdDate.substring(4, 6)}월 `
            strInventoryMsg += `${availQuantitySchdDate.substring(6, 8)}일`

            if (availQuantityType === '30') { // 순차배송일 경우
              strInventoryMsg += ' 까지 배송됩니다. '
            } else { // 예약배송일 경우
              strInventoryMsg += '에 배송됩니다. '
            }
          }
        }
      }

      if (strInventoryMsg !== '') {
        strInventoryMsg += ' 교환을 진행하시겠습니까?'
      }

      // 메시지 변수에 값이 있으며 confirm 창 활성
      if (strInventoryMsg !== '') {
        messageUtil.confirm(strInventoryMsg,
          () => { // 확인
            this.responseOrderForm(data)
          },
          () => { // 취소
            routerUtil.back()
          },
          '확인',
          '취소'
        )
        return false
      }

      this.responseOrderForm(data)
    },
    /**
     * 변경정보 입력 후처리 (1단계)
     * @param {Object} data - 요청 결과 data
     * @returns {void}
     */
    responseOrderForm (data) {
      if (!data.msg || !data.msg.root || !data.msg.root.orders || data.msg.root.orders.length === 0) {
        messageUtil.alert('주문 내역이 없습니다.', () => {
          routerUtil.back()
        })
        return false
      }

      // 주문정보 조회결과 저장
      const pageDataset = extend(true, {}, this.globalVal.mInputParams.pageData, data.msg.root.orders[0])

      // cats
      for (let i = 0; i < pageDataset.cats.length; i++) {
        // 취소 수량 설정
        pageDataset.cats[i].modQuantity = '0'
        if (this.globalVal.action === 'CANCEL') { // 취소신청.
          pageDataset.cats[i].cancelQuantity = pageDataset.cats[i].quantity
        } else if (this.globalVal.action === 'EXCHANGE') { // 교환신청
          pageDataset.cats[i].exchangeQuantity = pageDataset.cats[i].quantity
        } else if (this.globalVal.action === 'RETURN') { // 반품신청
          pageDataset.cats[i].returnQuantity = pageDataset.cats[i].quantity
        }

        // 취소,교환,반품 사유 추가
        const info = {
          ordersId: pageDataset.cats[i].ordersId,
          rsn: '',
          rsnDesc: '',
          phone11: '',
          phone12: '',
          phone13: '',
          rsnDtl: ''
        }
        // 취소신청.
        info.occurType = '600'
        pageDataset.cats[i].cancelInfo = info
        // 교환신청
        info.occurType = '200'
        pageDataset.cats[i].exchangeInfo = info
        // 반품신청
        info.occurType = '100'
        pageDataset.cats[i].returnInfo = info

        // 수거정보 추가
        const pickupInfo = (pageDataset.cats[i].pickupInfo || {
          ordersId: pageDataset.cats[i].ordersId,
          type: '',
          conv_dt: '',
          conv_tel11: '',
          conv_tel12: '',
          conv_tel13: '',
          addressId: ((pageDataset.cats[i].orgship && pageDataset.cats[i].orgship.addressId) || ''),
          deliv_name: '',
          deliv_tel11: '',
          deliv_tel12: '',
          deliv_tel13: '',
          deliv_tel21: '',
          deliv_tel22: '',
          deliv_tel23: '',
          deliv_ziptype: '',
          deliv_zipcd1: '',
          deliv_zipcd2: '',
          deliv_addr1: '',
          deliv_addr2: ''
        })
        pageDataset.cats[i].pickupInfo = pickupInfo
      }

      // orderitems
      for (let i = 0; i < pageDataset.orderitems.length; i++) {
        // 취소 수량 설정
        pageDataset.orderitems[i].modQuantity = '0'
        if (this.globalVal.action === 'CANCEL') { // 취소신청.
          pageDataset.orderitems[i].cancelQuantity = pageDataset.orderitems[i].quantity
        } else if (this.globalVal.action === 'EXCHANGE') { // 교환신청
          pageDataset.orderitems[i].exchangeQuantity = pageDataset.orderitems[i].quantity
        } else if (this.globalVal.action === 'RETURN') { // 반품신청
          pageDataset.orderitems[i].returnQuantity = pageDataset.orderitems[i].quantity
        }

        // 취소,교환,반품 사유 추가
        const info = {
          ordersId: pageDataset.orderitems[i].ordersId,
          orderitemsId: pageDataset.orderitems[i].orderitemsId,
          rsn: '',
          rsnDesc: '',
          phone11: '',
          phone12: '',
          phone13: '',
          rsnDtl: ''
        }
        // 취소신청.
        info.occurType = '600'
        pageDataset.orderitems[i].cancelInfo = info
        // 교환신청
        info.occurType = '200'
        pageDataset.orderitems[i].exchangeInfo = info
        // 반품신청
        info.occurType = '100'
        pageDataset.orderitems[i].returnInfo = info
      }

      // 전체 주문아이템에 대한 환불정보.
      pageDataset.refundInfo = {
        ordersId: pageDataset.ordersId,
        newHistSeq: pageDataset.newHistSeq,
        type: '',
        typeDesc: '',
        bankCd: '', // 환불계좌은행코드
        bankNm: '',
        accntOwner: '', // 계좌소유주
        accntNo: '', // 계좌번호
        refundAmt: '0'
      }

      // 신규 주소 정보
      pageDataset.newAddrs = []

      // 이 시점의 pageDataset 데이터가 주문정보 출력에 사용된다. (주문상품정보 (OrderCancelDetail.vue),  결제정보 (OrderCancelRefundInfo.vue))
      this.globalVal.orderDataInfo[0] = pageDataset

      // 변경정보 확인 및 결제 준비 (2단계)
      this.getOrderPayment()
    },
    /**
     * 변경정보 확인 및 결제 준비 (2단계)
     * @returns {void}
     */
    getOrderPayment () {
      const invokeparams = {
        pageData: JSON.stringify(this.globalVal.orderDataInfo)
      }
      this.paymentOrderForm(invokeparams, this.responseOrderPayment)
    },
    /**
     * 변경정보 확인 및 결제 준비 (2단계)
     * @param {Object} invokeParams - 요청 파라미터
     * @param {Function} callback - 요청완료 후 처리
     * @returns {void}
     */
    paymentOrderForm (invokeparams, callback) {
      invokeparams.tasknm = this.globalVal.action
      invokeparams.subTasknm = 'payment'
      invokeparams.counselorOrderCancel = this.globalVal.counselor // 상담사 카드취소 추가
      this.doModifyOrderCmd(invokeparams, callback)
    },
    /**
     * 변경정보 확인 및 결제 준비 후처리 (2단계)
     * @param {Object} data - 요청 결과 data
     * @returns {void}
     */
    responseOrderPayment (data) {
      if (data.msg && data.msg.root && data.msg.root.errorMsg) {
        messageUtil.alert(data.msg.root.errorMsg)
        return false
      } else if (!data.msg || !data.msg.root || !data.msg.root.orders || data.msg.root.orders.length === 0) {
        messageUtil.alert('주문 내역이 없습니다.', () => {
          routerUtil.back()
        })
        return false
      }

      // 교환,반품이면서 (재결제정보가 필요한 경우), 환불 불가
      let addAmt = 0
      for (let i = 0; i < data.msg.root.orders.length; i++) {
        if (undefined !== data.msg.root.orders[i].totalshipping && data.msg.root.orders[i].totalshipping !== '') {
          addAmt += Number(data.msg.root.orders[i].totalshipping)
        }
      }

      if ((this.globalVal.action === 'EXCHANGE' || this.globalVal.action === 'RETURN') && (addAmt > 0)) {
        this.setRefundFail()
        return false
      }

      // 교환,반품이면서 (복수배송지인 경우), 환불 불가
      let multiDeliveryList = []
      for (let i = 0; i < data.msg.root.orders[0].cats.length; i++) {
        multiDeliveryList.push(data.msg.root.orders[0].cats[i].orgship.dispAddressPlus)
      }

      multiDeliveryList = unique(multiDeliveryList)
      if ((this.globalVal.action === 'EXCHANGE' || this.globalVal.action === 'RETURN') && (multiDeliveryList.length > 1)) {
        this.setRefundFail()
        return false
      }
      // 교환,반품이면서 (복합결제인 경우), 환불 불가
      let multiPaymentCount = 0
      for (let i = 0; i < data.msg.root.orders[0].payms.length; i++) {
        const paymentcodeList = [PAY_TYPE_CONST.CREDIT_CARD, PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK, PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER, PAY_TYPE_CONST.MOBILE]
        multiPaymentCount += (paymentcodeList.includes(data.msg.root.orders[0].payms[i].paymentcode) ? 1 : 0)
      }
      if ((this.globalVal.action === 'EXCHANGE' || this.globalVal.action === 'RETURN') && (multiPaymentCount > 1)) {
        this.setRefundFail()
        return false
      }
      // 교환이면서 (재고수량이 부족할 경우), 교환 불가
      let isAvailQty = true
      for (let i = 0; i < data.msg.root.orders[0].cats.length; i++) {
        isAvailQty = (Number(data.msg.root.orders[0].cats[i].quantity) <= Number(data.msg.root.orders[0].cats[i].availQuantity))
      }
      if (this.globalVal.action === 'EXCHANGE' && !isAvailQty) {
        this.setRefundFail()
        return false
      }

      // 교환이면서 (후 환불 상품인 경우), 교환 불가
      if (this.globalVal.action === 'EXCHANGE' && data.msg.root.orders[0].pstRefundAvailYn === 'Y') {
        this.setRefundFail()
        return false
      }

      // 배송유형이 자체배송 상품 / 식품,가전,가구,무형서비스 상품 / 제휴몰 상품은 인터넷으로 반품/교환 접수 및 선환불 상품/센터배송은 인터넷에서 반품/교환은 직접 처리 불가
      for (let i = 0; i < data.msg.root.orders.length; i++) {
        if ((this.globalVal.action === 'EXCHANGE' || this.globalVal.action === 'RETURN') && data.msg.root.orders[i].rtnExcgNotAvailYn === 'Y') {
          this.setRefundFail()
          return false
        }
      }

      // 주문정보 조회결과 저장
      this.globalVal.mOutputDatas = data
      this.globalVal.pageDataset = data.msg.root.orders

      if (this.globalVal.action === 'CANCEL') {
        const invokeParams = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.helper.NSPaymentCtrlJDBCHelper',
            mnm: 'getPaymCnclDesc',
            args: { ordersId: data.ordsid[0] }
          })
        }

        // 상담원 처리 유무 체크 통신
        orderCancelService.responseOrderPayment(invokeParams, objData => {
          this.isLoadChildComponent = true
          if (!isNull(objData.list) && !isNull(objData.list.getPaymCnclDesc)) {
            messageUtil.alert(`${objData.list.getPaymCnclDesc} 상담원을 통해서 신청해 주시기 바랍니다.`, () => {
              routerUtil.back()
            })
          }
        })
      } else {
        this.isLoadChildComponent = true
      }
    },

    /**
     * 교환/반품 대상이 아닐 경우 출력
     * @returns {void}
     */
    setRefundFail () {
      this.globalVal.showRefundMethodArea = false
      this.globalVal.showDetailArea = false
      messageUtil.alert('교환/반품 대상이 아닙니다.', () => {
        routerUtil.back()
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/cancel/OrderCancel";
</style>
