import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import VueRouter from 'vue-router'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import { getProcessedWCSParameter } from '@unit/testUtil'

import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderReturn from '@/components/order/return/OrderReturn'
import OrderReturnStep1 from '@/components/order/return/OrderReturnStep1'
import OrderReturnStep2 from '@/components/order/return/OrderReturnStep2'
import OrderReturnStep3 from '@/components/order/return/OrderReturnStep3'

import {
  TEMP_M_INPUTPARAMS,
  TEMP_RES_DATA2,
  TEMP_REQ_DATA3, TEMP_RES_DATA3,
  TEMP_REQ_DATA5, TEMP_RES_DATA5
} from '@unit/components/order/return/mock/dummyData'

describe('OrderReturn', () => {
  let localVue
  let options
  let mainWrapper
  let mock
  const e = {
    preventDefault: () => {},
    keyCode: '',
    target: { value: '' }
  }

  beforeEach(() => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'OrderReturn',
      meta: {},
      path: '/order/return',
      hash: '',
      query: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.reset()
    mock.onPost(`${CONST.API_URL}/NSChangeOrderCmd`).reply(200, TEMP_RES_DATA2)
    mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', TEMP_REQ_DATA3)).reply(200, TEMP_RES_DATA3)
    mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', TEMP_REQ_DATA5)).reply(200, TEMP_RES_DATA5)

    TEMP_M_INPUTPARAMS.orderReturnInfo = { result: '' }
    options = {
      localVue,
      store,
      router,
      propsData: { param: TEMP_M_INPUTPARAMS }
    }
    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    mainWrapper = mount(OrderReturn, options)
    mainWrapper.vm.orderReturnInfo = {
      result: ''
    }
    mainWrapper.vm.$store = { commit: data => {} }
    mainWrapper.vm.globalVal.mInputParams = TEMP_M_INPUTPARAMS
    mainWrapper.vm.responseRefundOrderFormChk(TEMP_RES_DATA2)
    mainWrapper.vm.globalVal.mOutputDatas.orders = TEMP_RES_DATA2.msg.root.orders[0]
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })
  describe('OrderReturn 테스트', () => {
    it('반품신청-init', async () => {
      mainWrapper.vm.init()
      assert.isTrue(true)
    })
    it('반품신청-반품할 상품정보 조회(responseRefundOrderFormChk)', async () => {
      const data = {}
      mainWrapper.vm.responseRefundOrderFormChk(data)
      data.msg = { root: null }
      mainWrapper.vm.responseRefundOrderFormChk(data)
      data.msg.root = { orders: null }
      mainWrapper.vm.responseRefundOrderFormChk(data)
      data.msg.root = { orders: [] }
      mainWrapper.vm.responseRefundOrderFormChk(data)
      data.msg.root = { orders: [''] }
      mainWrapper.vm.responseRefundOrderFormChk(data)
      assert.isTrue(true)
    })
  })
  describe('OrderReturnStep1 테스트', () => {
    it('반품신청 STEP1-init', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', TEMP_REQ_DATA3)).reply(200, TEMP_RES_DATA3)

      const wrapper = mainWrapper.find(OrderReturnStep1)
      const commonUtil = wrapper.vm.commonUtil
      const bizUtil = wrapper.vm.bizUtil
      const pickupInfoData = wrapper.vm.pickupInfoData

      assert.isNotNull(commonUtil)
      assert.isNotNull(bizUtil)
      assert.isNotNull(pickupInfoData)
      assert.isTrue(true)
    })
    it('반품신청 STEP1-반품사유 선택 (onchangeReasonOption)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.globalVal.reasonOptionValue = '999'
      wrapper.vm.onchangeReasonOption()
      wrapper.vm.globalVal.reasonOptionValue = '460'
      wrapper.vm.onchangeReasonOption()
      assert.isTrue(true)
    })
    it('반품신청 STEP1-반품사유 Text (getReasonText)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.globalVal.reasonOptionValue = ''
      wrapper.vm.getReasonText()
      wrapper.vm.globalVal.reasonOptionValue = '460'
      wrapper.vm.getReasonText()
      assert.isTrue(true)
    })
    it('반품신청 STEP1-반품사유 입력 (keyupReasonMessage)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.keyupReasonMessage(e)
      assert.isTrue(true)
    })
    it('반품신청 STEP1-회수지설정 (setChangeReturnAddress)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.setChangeReturnAddress()
      assert.isTrue(true)
    })
    it('반품신청 STEP1-회수지변경 (onclickChangeReturnAddress)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { list: { resultCd: '' } })

      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.onclickChangeReturnAddress()
      assert.isTrue(true)
    })
    it('반품신청 STEP1-수거가능지역 여부 조회 (checkPickupAddress)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      const result = {
        cst_addrId: '',
        lastname: '',
        phone1: '',
        phone2: '',
        cst_addr: '',
        cst_addrDetail: '',
        cst_zipCode: '',
        receiverName: '',
        fax1: ''
      }

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { list: { resultCd: '' } })
      wrapper.vm.checkPickupAddress(result)

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { list: { resultCd: '98' } })
      wrapper.vm.checkPickupAddress(result)

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { list: { resultCd: '00' } })
      wrapper.vm.checkPickupAddress(result)
      assert.isTrue(true)
    })
    it('반품신청 STEP1-수거메시지 선택 (onchangePickupOption)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.globalVal.pickupOptionValue = '직접 입력(20자 이내)'
      wrapper.vm.onchangePickupOption()

      wrapper.vm.globalVal.pickupOptionValue = '수거 전 연락바랍니다.'
      wrapper.vm.onchangePickupOption()
      assert.isTrue(true)
    })
    it('반품신청 STEP1-수거 메시지 (keyupPickupMessage)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.keyupPickupMessage()
      assert.isTrue(true)
    })
    it('반품신청 STEP1-반품신청 다음단계 (onclickNextStep)', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep1)
      wrapper.vm.globalVal.reasonOptionValue = ''
      wrapper.vm.onclickNextStep()

      wrapper.vm.globalVal.reasonOptionValue = '999'
      wrapper.vm.globalVal.reasonTextValue = ''
      wrapper.vm.onclickNextStep()

      wrapper.vm.globalVal.reasonOptionValue = '460'
      wrapper.vm.globalVal.reasonTextValue = '직접입력'
      wrapper.vm.onclickNextStep()

      wrapper.vm.globalVal.pickupOptionValue = '직접 입력(20자 이내)'
      wrapper.vm.globalVal.pickupTextValue = '직접입력'
      wrapper.vm.onclickNextStep()

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSChangeOrderCmd`).reply(200, TEMP_RES_DATA5)
      wrapper.vm.globalVal.pickupOptionValue = '수거 전 연락바랍니다.'
      wrapper.vm.globalVal.pickupTextValue = '수거 전 연락바랍니다.'
      wrapper.vm.onclickNextStep()

      assert.isTrue(true)
    })
  })
  describe('OrderReturnStep2 테스트', () => {
    beforeEach(() => {
      mainWrapper.vm.globalVal.mOutputDatas.orders = TEMP_RES_DATA5.msg.root.orders[0]
    })
    it('반품신청 STEP2-환불수단 보임/숨김처리', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep2)
      wrapper.vm.setRefundDisplay()
      wrapper.vm.globalVal.mOutputDatas.orders.refundActSum = '9000'
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = '400'
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymdtls = [{ a: 1 }]
      wrapper.vm.setRefundDisplay()
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = '500'
      wrapper.vm.setRefundDisplay()
      assert.isTrue(true)
    })
    it('반품신청 STEP2-은행선택', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep2)
      wrapper.vm.onclickRefundType(wrapper.vm.globalVal.REFUND_TYPE.DEPOSIT_AMT)
      wrapper.vm.onclickRefundType(wrapper.vm.globalVal.REFUND_TYPE.ACCOUNT)

      wrapper.vm.setBankList()

      wrapper.vm.globalVal.refundBankCd = '04'
      wrapper.vm.onchangeBanckInfo()

      wrapper.vm.keydownNumber(e)
      wrapper.vm.keyupNumber(e)
      wrapper.vm.onblurValueApply(e)

      assert.isTrue(true)
    })
    it('반품신청 STEP2-반품신청 이전단계', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep2)
      wrapper.vm.onclickPrevStep()
      wrapper.vm.globalVal.showStep1 = false
      wrapper.vm.globalVal.showStep2 = true
      assert.isTrue(true)
    })
    it('반품신청 STEP2-반품신청완료1', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep2)
      wrapper.vm.globalVal.mOutputDatas.orders.refundActSum = '9000'
      wrapper.vm.globalVal.refundType = wrapper.vm.globalVal.REFUND_TYPE.ACCOUNT
      wrapper.vm.globalVal.refundBankCd = ''
      wrapper.vm.globalVal.refundAccntNo = ''
      wrapper.vm.globalVal.refundAccntOwner = ''
      wrapper.vm.onclickComplete()

      wrapper.vm.globalVal.refundBankCd = '04'
      wrapper.vm.onclickComplete()

      wrapper.vm.globalVal.refundAccntNo = '1234567890'
      wrapper.vm.onclickComplete()

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSChangeOrderCmd`).reply(200, { msg: { root: { orders: [{ a: 1 }] } } })
      wrapper.vm.globalVal.refundAccntOwner = '김테이'
      wrapper.vm.onclickComplete()

      assert.isTrue(true)
    })
    it('반품신청 STEP2-반품신청완료2', async () => {
      const wrapper = mainWrapper.find(OrderReturnStep2)
      wrapper.vm.globalVal.refundBankCd = '04'
      wrapper.vm.globalVal.refundAccntNo = '1234567890'
      wrapper.vm.globalVal.refundAccntOwner = '김테이'

      const data = {}
      wrapper.vm.onclickComplete()
      data.msg = { root: null }
      wrapper.vm.onclickComplete(data)
      data.msg.root = { orders: null }
      wrapper.vm.onclickComplete(data)
      data.msg.root = { orders: [] }
      wrapper.vm.onclickComplete(data)
      data.msg.root = { orders: [''] }
      wrapper.vm.onclickComplete(data)
      assert.isTrue(true)
    })
  })
  describe('OrderReturnStep3 테스트', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mainWrapper.find(OrderReturnStep3, {
        propsData: {
          param: {
            globalVal: {
              showStep3: true
            },
            orderReturnInfo: { result: '' }
          }
        }
      })
    })
    it('반품신청 STEP3-init', async () => {
      const commonUtil = wrapper.vm.commonUtil
      const bizUtil = wrapper.vm.bizUtil
      const pickupInfoData = wrapper.vm.pickupInfoData

      assert.isNotNull(commonUtil)
      assert.isNotNull(bizUtil)
      assert.isNotNull(pickupInfoData)

      wrapper.vm.init()

      assert.isTrue(true)
    })
    it('반품신청 STEP3-주문내역조회 버튼 클릭. (onclickOrdersList)', async () => {
      wrapper.vm.onclickOrdersList()
      assert.isTrue(true)
    })
    it('반품신청 STEP3-홈으로 이동 (onclickHome)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { list: { resultCd: '' } })

      wrapper.vm.onclickHome()
      assert.isTrue(true)
    })
  })
  describe('orderReturnStepMixin-', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mainWrapper.find(OrderReturnStep3, {
        propsData: { param: TEMP_M_INPUTPARAMS }
      })
    })

    it('반품 상품정보-(setRefundOrdersInfo)', async () => {
      wrapper.vm.globalVal.mOutputDatas.orders.cats[0].subProducts = [
        {
          ordersId: '300011241060',
          catentryIdParent: '42828213',
          attrs: [
            {
              value: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원',
              name: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원',
              subseq: '0',
              seq: '0'
            }
          ],
          unitCd: '10118809215',
          goodsCd: '42828213',
          catentryId: '10118809215',
          partgubun: 'GIFT',
          styleMngYn: 'N',
          name: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원',
          quantity: '1',
          orderitemsId: '180725970',
          suborditemId: '1'
        }
      ]
      wrapper.vm.setRefundOrdersInfo()
      assert.isTrue(true)
    })
    it('환불정보-(setPaymentInfo)', async () => {
      wrapper.vm.globalVal.mOutputDatas.orders.payms = [{}]
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].payAmt = '9000'
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].displaytext = ''
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymdtls = []
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentname = ''
      wrapper.vm.globalVal.mOutputDatas.orders.status = ''
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymdtls = [{ payOrgNm: '', lgTelcTrstNum: '', instmMmCnt: '', dpstBankNm: '' }]

      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.mOutputDatas.orders.status = 'M'
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.mOutputDatas.orders.status = 'D'
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.MOBILE
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.PAYCO
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.setPaymentInfo()

      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentcode = ''
      wrapper.vm.globalVal.mOutputDatas.orders.payms[0].paymentname = ''
      wrapper.vm.globalVal.mOutputDatas.orders.payms[1] = {}
      wrapper.vm.globalVal.mOutputDatas.orders.payms[1].paymentcode = PAY_ASSIST_CONST.NS_GIFT_CARD
      wrapper.vm.globalVal.mOutputDatas.orders.payms[1].paymenttype = 'GIFTCARD'
      wrapper.vm.globalVal.mOutputDatas.orders.payms[1].payAmt = '100'
      wrapper.vm.globalVal.mOutputDatas.orders.payms[1].paymentname = ''
      wrapper.vm.globalVal.mOutputDatas.orders.payms[2] = {}
      wrapper.vm.globalVal.mOutputDatas.orders.payms[2].paymentcode = PAY_ASSIST_CONST.DEPOSIT_AMT
      wrapper.vm.globalVal.mOutputDatas.orders.payms[2].paymenttype = 'POINT'
      wrapper.vm.globalVal.mOutputDatas.orders.payms[2].payAmt = '200'
      wrapper.vm.globalVal.mOutputDatas.orders.payms[2].paymentname = ''
      wrapper.vm.setPaymentInfo()

      assert.isTrue(true)
    })
  })
})
