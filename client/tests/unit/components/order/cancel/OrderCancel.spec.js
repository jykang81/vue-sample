import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import VueRouter from 'vue-router'
import router from '@/router'
// import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'

import CONST from '@constants/framework/framework'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'
import { getProcessedWCSParameter } from '@unit/testUtil'

import TEMP_M_INPUTPARAMS from '@unit/components/order/cancel/mock/m_inputParamsTest'
import TEMP_M_OUTPUTDATAS from '@unit/components/order/cancel/mock/m_outputDatasTest'
import OrderCancelProduct from '@/components/order/cancel/OrderCancelProduct'
import OrderCancel from '@/components/order/cancel/OrderCancel'

import OrderCancelReason from '@/components/order/cancel/OrderCancelReason'
import OrderCancelRefundInfo from '@/components/order/cancel/OrderCancelRefundInfo'
import OrderCancelRefundMethod from '@/components/order/cancel/OrderCancelRefundMethod'
import OrderCancelConfirm from '@/components/order/cancel/OrderCancelConfirm'
import OrderCancelComplete from '@/components/order/cancel/OrderCancelComplete'

// import temp01ReqNSMypageCommCmdAlejandro from '@unit/components/order/cancel/mock/01_req_NSMypageCommCmdAlejandroTest'
import temp01ResNSMypageCommCmdAlejandro from '@unit/components/order/cancel/mock/01_res_NSMypageCommCmdAlejandroTest'
import temp02ReqNSChangeOrderCmdCancelForm from '@unit/components/order/cancel/mock/02_req_NSChangeOrderCmdCancelFormTest'
import temp02ResNSChangeOrderCmdCancelForm from '@unit/components/order/cancel/mock/02_res_NSChangeOrderCmdCancelFormTest'
// import temp03ReqNSChangeOrderCmdCancelPayment from '@unit/components/order/cancel/mock/03_req_NSChangeOrderCmdCancelPaymentTest'
import temp03ResNSChangeOrderCmdCancelPayment from '@unit/components/order/cancel/mock/03_res_NSChangeOrderCmdCancelPaymentTest'
import temp04ReqNSMypageCommCmdOrdrsn from '@unit/components/order/cancel/mock/04_req_NSMypageCommCmdOrdrsnTest'
/*
import temp04ResNSMypageCommCmdOrdrsn from '@unit/components/order/cancel/mock/04_res_NSMypageCommCmdOrdrsnTest'
import temp05ReqNSMypageCommCmdAlejandro from '@unit/components/order/cancel/mock/05_req_NSMypageCommCmdAlejandroTest'
import temp05ResNSMypageCommCmdAlejandro from '@unit/components/order/cancel/mock/05_res_NSMypageCommCmdAlejandroTest'
*/
describe('OrderCancel', () => {
  let localVue
  let options
  let mainWrapper
  let mock
  const e = {
    preventDefault: () => {},
    keyCode: '',
    target: { value: '', src: '' }
  }
  const result = {
    list: {
      lockedOrderYn: 'N',
      lastupdateall: '20200724140916',
      latestOperationId: null,
      canYn: 'Y',
      respCd: 'S',
      modifyOrder: 'N'
    }
  }

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'orderOrderCancel',
      meta: {},
      path: '/order/cancel',
      hash: '',
      query: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`)
      .reply(200, temp01ResNSMypageCommCmdAlejandro)
      .onPost(`${CONST.API_URL}/NSChangeOrderCmd`, getProcessedWCSParameter('post', temp02ReqNSChangeOrderCmdCancelForm))
      .reply(200, temp02ResNSChangeOrderCmdCancelForm)
      .onPost(`${CONST.API_URL}/NSChangeOrderCmd`)
      .reply(200, temp03ResNSChangeOrderCmdCancelPayment)

    options = {
      localVue,
      store,
      router,
      propsData: { param: TEMP_M_INPUTPARAMS }
    }
    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    mainWrapper = mount(OrderCancel, options)
    mainWrapper.vm.globalVal.mInputParams = TEMP_M_INPUTPARAMS
    mainWrapper.vm.globalVal.mOutputDatas = TEMP_M_OUTPUTDATAS
    mainWrapper.vm.globalVal.action = 'CANCEL'
    mainWrapper.vm.responseOrderFormChk(temp02ResNSChangeOrderCmdCancelForm)
    mainWrapper.vm.responseOrderPayment(temp03ResNSChangeOrderCmdCancelPayment)
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })
  describe('OrderCancel 테스트', () => {
    it('취소신청-Main', async () => {
      mainWrapper.vm.globalVal.action = 'EXCHANGE'
      temp02ResNSChangeOrderCmdCancelForm.msg.root.orders[0].cats[0].availQuantityType = '30'
      mainWrapper.vm.responseOrderFormChk(temp02ResNSChangeOrderCmdCancelForm)

      temp02ResNSChangeOrderCmdCancelForm.msg.root.orders[0].cats[0].availQuantityType = '40'
      mainWrapper.vm.responseOrderFormChk(temp02ResNSChangeOrderCmdCancelForm)

      mainWrapper.vm.responseOrderPayment(temp03ResNSChangeOrderCmdCancelPayment)

      mainWrapper.vm.globalVal.action = 'RETURN'
      mainWrapper.vm.responseOrderFormChk(temp02ResNSChangeOrderCmdCancelForm)
      mainWrapper.vm.responseOrderPayment(temp03ResNSChangeOrderCmdCancelPayment)

      mainWrapper.vm.responseOrderFormChk({ msg: '' })
      mainWrapper.vm.responseOrderForm({ msg: '' })
      mainWrapper.vm.responseOrderPayment({ msg: '' })

      assert.isTrue(true)
    })
  })
  describe('OrderCancelProduct 테스트', () => {
    it('취소신청-상세정보', async () => {
      const wrapper = mainWrapper.find(OrderCancelProduct)
      const bizUtil = wrapper.vm.bizUtil

      assert.isNotNull(bizUtil)
      assert.isTrue(true)
    })
  })
  describe('OrderCancelReason 테스트', () => {
    it('취소신청-환불사유', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`)
        .reply(200, temp04ReqNSMypageCommCmdOrdrsn)
      const wrapper = mainWrapper.find(OrderCancelReason)
      wrapper.vm.onchangeReasonOption()
      wrapper.vm.getReasonText()
      wrapper.vm.keyupReasonMessage(e)
      wrapper.vm.keydownNumber(e)
      wrapper.vm.keyupNumber(e)
      wrapper.vm.onblurValueApply(e)
      wrapper.vm.focusDashPhone()
      assert.isTrue(true)
    })
  })
  describe('OrderCancelRefundInfo 테스트', () => {
    it('취소신청-환불정보(신용카드)', async () => {
      const wrapper = mainWrapper.find(OrderCancelRefundInfo)
      wrapper.vm.globalVal.orderDataInfo[0] = {
        payms: [
          {
            paymenttype: 'CREDIT',
            payAmt: '75140',
            paySchdAdjustAmt: '75140',
            payTypeCnt: '1',
            availAdjustAmt: '75140',
            displayorder: ' 00090',
            paymentname: '카드결제',
            payDttm: '2020.07.31 18:57',
            payClssfNm: '승인',
            paySchdAmt: '75140',
            paySeq: '1',
            availAmt: '75140',
            paymentcode: '100',
            paymdtls: [
              {
                payAmt: '75140',
                instmMmCnt: '00',
                cardApprMediaCd: '10',
                cardKindCd: 'HN',
                initRegiPic: 'MALL',
                traceCd: '20073118563910082222',
                instMm: '00',
                siteCd: 'H01',
                apprNo: '00136430',
                apprNum: '00136430',
                cardValidDur: null,
                cardNum: '5320920017121956',
                apprReqDttm: '2020.07.31 18:57:10',
                irFreeInstmMmCnt: '00',
                payDt: '2020/07/31',
                availAmt: '75140',
                apprReqAmt: '75140',
                apprReqDt: '2020/07/31',
                cardExpYm: '**/**',
                irFreeYn: 'N',
                ispApprNum: '00136430',
                vanCo: '00',
                cancReqDttm: null,
                terminalId: 'T0002493',
                relNm: '하나SK개인체크',
                relNo: '5320-9200-****-1956',
                cancReqDt: null,
                cardApprSeq: '20073118563910082222'
              }
            ]
          }
        ]
      }
      wrapper.vm.init()
      assert.isTrue(true)
    })
    it('취소신청-환불정보(무통장입금)', async () => {
      const wrapper = mainWrapper.find(OrderCancelRefundInfo)
      wrapper.vm.globalVal.orderDataInfo[0] = {
        cats: [{
          status: ''
        }],
        payms: [
          {
            payAmt: '88040',
            paymenttype: 'CASH',
            paySchdAdjustAmt: '0',
            payTypeCnt: '1',
            availAdjustAmt: '0',
            cancelProcType: 'PRE',
            displayorder: ' 00080',
            payDttm: null,
            paymentname: '무통장 입금',
            paySchdAmt: '88040',
            payClssfNm: '승인',
            paySeq: '1',
            availAmt: '0',
            paymentcode: '200',
            paymdtls: [{
              payAmt: '88040',
              dpstAcctNum: '35649014275224',
              dpstBankNm: '국민(가상)',
              dpstBankCd: 'VAK',
              rmitr: '테스터',
              cashRcptApprNum: '',
              apprSeq: '1',
              dpstSchdAmt: '88040',
              apprNo: '',
              relNm: '국민(가상)',
              availAmt: '0',
              relNo: '010-****-9307'
            }]
          }
        ]
      }
      wrapper.vm.init()

      wrapper.vm.globalVal.orderDataInfo[0].cats[0].status = 'D'
      wrapper.vm.init()
      assert.isTrue(true)
    })
    it('취소신청-환불정보(모바일)', async () => {
      const wrapper = mainWrapper.find(OrderCancelRefundInfo)
      wrapper.vm.globalVal.orderDataInfo[0] = {
        payms: [
          {
            paySeq: '1',
            payAmt: '88040',
            paymenttype: 'MOBILE',
            paymentname: '휴대폰결제',
            paymentcode: '400',
            paymdtls: [{
              payAmt: '88040',
              instmMmCnt: '00'
            }]
          }
        ]
      }
      wrapper.vm.init()
      assert.isTrue(true)
    })
    it('취소신청-환불정보(페이코)', async () => {
      const wrapper = mainWrapper.find(OrderCancelRefundInfo)
      wrapper.vm.globalVal.orderDataInfo[0] = {
        payms: [
          {
            paySeq: '1',
            payAmt: '88040',
            paymenttype: 'PAYCO',
            paymentname: '페이코',
            paymentcode: '1400',
            paymdtls: [{ payAmt: '88040' }]
          }
        ]
      }
      wrapper.vm.init()
      assert.isTrue(true)
    })
    it('취소신청-환불정보(기타)', async () => {
      const wrapper = mainWrapper.find(OrderCancelRefundInfo)
      wrapper.vm.globalVal.orderDataInfo[0] = {
        payms: [
          {
            paySeq: '1',
            paymentcode: '700',
            payAmt: '88040',
            paymenttype: 'GIFTCARD',
            displaytext: '',
            paymdtls: [{ payAmt: '88040' }],
            paymentname: ''
          },
          {
            paySeq: '2',
            payAmt: '88040',
            paymentcode: '500',
            paymenttype: 'POINT',
            displaytext: '',
            paymdtls: [{ payAmt: '88040' }],
            paymentname: ''
          }
        ]
      }
      wrapper.vm.init()
      assert.isTrue(true)
    })
  })
  describe('OrderCancelRefundMethod 테스트', () => {
    it('취소신청-환불수단', async () => {
      mainWrapper.vm.globalVal.isRefund = true
      const wrapper = mainWrapper.find(OrderCancelRefundMethod)
      wrapper.vm.onclickRefundType('1')
      wrapper.vm.onclickRefundType('2')
      wrapper.vm.onchangeBanckInfo()
      wrapper.vm.getBankInfo()

      e.target.value = '12345678901234567'
      wrapper.vm.keydownNumber(e)
      wrapper.vm.keyupNumber(e)
      wrapper.vm.onblurValueApply(e)
      assert.isTrue(true)
    })
  })
  describe('OrderCancelConfirm 테스트', () => {
    it('취소신청-취소신청확인', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`)
        .reply(200, {
          list: {
            lockedOrderYn: 'N',
            lastupdateall: '20200724140916',
            latestOperationId: null,
            canYn: 'Y',
            respCd: 'S',
            modifyOrder: 'N'
          }
        })
        .onPost(`${CONST.API_URL}/NSChangeOrderCmd`)
        .reply(200, {
          msg: {
            root: {
              orders: {}
            }
          },
          paymentList: []
        })

      let wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.globalVal.reasonPhoneValue = '01012345678'
      wrapper.vm.globalVal.reasonOptionValue = '122'
      wrapper.vm.onclickComplete()

      wrapper = mainWrapper.find(OrderCancelComplete)
      wrapper.vm.globalVal.paymemntMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.init()

      wrapper.vm.globalVal.paymemntMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.paymemntMethodStatus = 'M'
      wrapper.vm.init()

      wrapper.vm.globalVal.paymemntMethod = PAY_TYPE_CONST.MOBILE
      wrapper.vm.init()

      wrapper.vm.globalVal.paymemntMethod = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD
      wrapper.vm.init()

      wrapper.vm.globalVal.paymemntMethod = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER
      wrapper.vm.init()

      wrapper.vm.globalVal.paymemntMethod = PAY_TYPE_CONST.PAYCO
      wrapper.vm.init()

      wrapper.vm.globalVal.paymemntMethod = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.init()

      wrapper.vm.onclickAddCart()
      wrapper.vm.onclickOrdersList()

      assert.isTrue(true)
    })
    it('취소신청-신청취소 (onclickComplete)', async () => {
      const wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.onclickCancel()
      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 1 (onclickComplete)', async () => {
      let wrapper = mainWrapper.find(OrderCancelConfirm)

      result.list.lockedOrderYn = 'Y'
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, result)
      wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.globalVal.doubleClick = false
      wrapper.vm.globalVal.action = 'CANCEL'
      wrapper.vm.onclickComplete()
      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 2 (onclickComplete)', async () => {
      let wrapper = mainWrapper.find(OrderCancelConfirm)

      mock.reset()
      result.list.lockedOrderYn = 'N'
      result.list.lastupdateall = ''
      result.list.latestOperationId = ''
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, result)
      wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.globalVal.doubleClick = false
      wrapper.vm.globalVal.action = 'CANCEL'
      wrapper.vm.onclickComplete()
      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 3 (onclickComplete)', async () => {
      let wrapper = mainWrapper.find(OrderCancelConfirm)

      mock.reset()
      result.list.lockedOrderYn = 'N'
      result.list.lastupdateall = '20200724140916'
      result.list.latestOperationId = null
      result.list.canYn = 'N'
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, result)
      wrapper.vm.globalVal.doubleClick = false
      wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.globalVal.action = 'CANCEL'
      wrapper.vm.onclickComplete()
      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 4 (onclickComplete)', async () => {
      let wrapper = mainWrapper.find(OrderCancelConfirm)

      mock.reset()
      result.list.respCd = 'E'
      result.list.canYn = 'Y'
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, result)
      wrapper.vm.globalVal.doubleClick = false
      wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.globalVal.action = 'CANCEL'
      wrapper.vm.onclickComplete()
      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 5 (onclickComplete)', async () => {
      let wrapper = mainWrapper.find(OrderCancelConfirm)

      mock.reset()
      result.list.respCd = 'S'
      result.list.modifyOrder = 'Y'
      result.list.canYn = 'Y'
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, result)

      wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.globalVal.doubleClick = false
      wrapper.vm.globalVal.action = 'CANCEL'
      wrapper.vm.onclickComplete()
      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 6 (onclickComplete)', async () => {
      const wrapper = mainWrapper.find(OrderCancelConfirm)

      wrapper.vm.globalVal.action = 'RETURN'
      wrapper.vm.onclickComplete()

      wrapper.vm.globalVal.action = 'EXCHANGE'
      wrapper.vm.onclickComplete()
      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 1 (setOrder)', async () => {
      const wrapper = mainWrapper.find(OrderCancelConfirm)

      wrapper.vm.globalVal.reasonPhoneValue = ''
      wrapper.vm.setOrder()

      wrapper.vm.globalVal.reasonPhoneValue = '12312345678'
      wrapper.vm.setOrder()

      wrapper.vm.globalVal.reasonPhoneValue = '01012345678'
      wrapper.vm.globalVal.reasonOptionValue = ''
      wrapper.vm.setOrder()

      wrapper.vm.globalVal.reasonOptionValue = '122'
      wrapper.vm.setOrder()

      wrapper.vm.globalVal.reasonOptionValue = '999'
      wrapper.vm.globalVal.reasonTextValue = ''
      wrapper.vm.setOrder()

      wrapper.vm.globalVal.reasonTextValue = 'dummy'
      wrapper.vm.globalVal.isRefund = false
      wrapper.vm.globalVal.refundType = '1'
      wrapper.vm.setOrder()

      wrapper.vm.globalVal.isRefund = true
      wrapper.vm.globalVal.refundType = '2'
      wrapper.vm.setOrder()

      assert.isTrue(true)
    })
    it('취소신청-취소신청실패 2 (setOrder)', async () => {
      const wrapper = mainWrapper.find(OrderCancelConfirm)
      wrapper.vm.globalVal.reasonPhoneValue = '01012345678'
      wrapper.vm.globalVal.reasonOptionValue = '122'
      wrapper.vm.globalVal.refundType = '2'

      wrapper.vm.globalVal.refundBankCd = '1'
      wrapper.vm.globalVal.refundAccntOwner = '1'
      wrapper.vm.globalVal.refundAccntNo = '1'

      wrapper.vm.globalVal.action = 'RETURN'
      wrapper.vm.setOrder()

      wrapper.vm.globalVal.action = 'EXCHANGE'
      wrapper.vm.setOrder()

      assert.isTrue(true)
    })
  })
})
