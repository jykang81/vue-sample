<template>
  <div class="order_return">
    <order-return-step1
      v-if="isLoadChildComponent"
      :global-val="globalVal"
      :order-return-info="orderReturnInfo"
    />

    <order-return-step2
      v-if="isLoadChildComponent"
      :global-val="globalVal"
      :order-return-info="orderReturnInfo"
    />

    <order-return-step3
      v-if="isLoadChildComponent"
      :global-val="globalVal"
      :order-return-info="orderReturnInfo"
    />
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'

import OrderReturnStep1 from '@/components/order/return/OrderReturnStep1'
import OrderReturnStep2 from '@/components/order/return/OrderReturnStep2'
import OrderReturnStep3 from '@/components/order/return/OrderReturnStep3'
import orderReturnService from '@services/order/return/orderReturnService'

export default {
  components: {
    OrderReturnStep1,
    OrderReturnStep2,
    OrderReturnStep3
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
      orderReturnInfo: {
        result: ''
      },
      globalVal: {
        mInputParams: {},
        mOutputDatas: {},
        showStep1: true,
        showStep2: false,
        showStep3: false,
        isPrevStep: false,
        executeBtnClicked: false,

        reasonOptionValue: '',
        reasonOptionText: '',
        reasonTextValue: '',

        pickupOptionValue: '',
        pickupOptionText: '',
        pickupTextValue: '',

        pickupInfoData: {},
        deliveryInfo: [],

        showRefundMethodArea: false,
        REFUND_TYPE: {
          DEPOSIT_AMT: '1', // 예치금
          ACCOUNT: '2' // 계좌
        },
        refundType: '2', // 예치금: 1, 계좌환불: 2
        showRefundTypeDepositAmt: true,
        showRefundTypeAccount: true,
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
      this.orderReturnInfo = this.param.orderReturnInfo

      // 반품할 상품정보 조회
      this.getRefundOrderForm()
    },
    /**
     * 반품할 상품정보 조회
     * @returns {void}
     */
    getRefundOrderForm () {
      const param = {
        subTasknm: 'form',
        tasknm: 'RETURN',
        ordsid: this.globalVal.mInputParams.ordersId,
        channel: 'mobile',
        counselorOrderCancel: 'Y',
        objOrder: this.globalVal.mInputParams.objOrder
      }

      orderReturnService.getRefundOrderForm(param, this.responseRefundOrderFormChk)
    },
    /**
     * 반품할 상품정보 조회 callback
     * @param {Object} data - 반품할 상품정보 조회결과
     * @returns {void}
     */
    responseRefundOrderFormChk (data) {
      if (!data.msg || !data.msg.root || !data.msg.root.orders || data.msg.root.orders.length === 0 ||
            data.msg.root.orders[0] == null || data.msg.root.orders[0] === '') {
        messageUtil.alert('본 상품의 반품은 상담원을 통해서 신청해 주시기 바랍니다.', () => {
          this.orderReturnInfo.result = 'FAIL'
          this.$store.commit('popup/hide', { result: 'FAIL' })
        })
      } else {
        this.globalVal.mOutputDatas = data
        this.globalVal.mOutputDatas.orders = data.msg.root.orders[0]
        this.isLoadChildComponent = true
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/return/OrderReturn";
</style>
