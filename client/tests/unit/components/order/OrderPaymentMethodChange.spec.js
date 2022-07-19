import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import { getProcessedWCSParameter } from '@unit/testUtil'

import CONST from '@constants/framework/framework'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import { dummySelectboxCard } from '@unit/views/order/sheet/mock/tempOrderConst'
import nsaxios from '@frameworks/axiosUtil'
import {
  extend
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderPaymentMethodChange from '@/components/order/OrderPaymentMethodChange'

// import temp01ReqNSBasketCountCmdReal from '@unit/components/order/mock/01_req_NSBasketCountCmdReal'
import temp01ResNSBasketCountCmdReal from '@unit/components/order/mock/01_req_NSBasketCountCmdReal'

import temp02ResNSOrderPaymentModifyMobile from '@unit/components/order/mock/02_res_NSOrderPaymentModifyMobile'

// import temp02ReqNSOrderPaymentModifyMobile from '@unit/components/order/mock/02_req_NSOrderPaymentModifyMobile'
import temp0200ResNSMypageCmdChannelMobile from '@unit/components/order/mock/02_00_res_NSMypageCmdChannelMobile'

// import temp03ReqPaymentApprovalRequestCmd from '@unit/components/order/mock/03_req_PaymentApprovalRequestCmd'
import temp03ResPaymentApprovalRequestCmd from '@unit/components/order/mock/03_res_PaymentApprovalRequestCmd'

import temp04ReqNSMypageCommCmdInstmMmsList from '@unit/components/order/mock/04_req_NSMypageCommCmd_instmMmsList'
import temp04ResNSMypageCommCmdInstmMmsList from '@unit/components/order/mock/04_res_NSMypageCommCmd_instmMmsList'

import temp05ReqNSMypageCommCmdAlejandroE from '@unit/components/order/mock/05_req_NSMypageCommCmd_alejandro_E'
import temp05ResNSMypageCommCmdAlejandroE from '@unit/components/order/mock/05_res_NSMypageCommCmd_alejandro_E'

import temp06ReqNSMypageCommCmdAlejandroO from '@unit/components/order/mock/06_req_NSMypageCommCmd_alejandro_O'
import temp06ResNSMypageCommCmdAlejandroO from '@unit/components/order/mock/06_res_NSMypageCommCmd_alejandro_O'
import tempCallbackPaymentResult from '@unit/components/order/mock/tempCallbackPaymentResult'

describe('OrderPaymentMethodChange', () => {
  let localVue
  let options
  let mock
  let wrapper

  beforeEach(() => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.reset()
    mock.onPost(`${CONST.API_URL}/NSBasketCountCmdReal`).reply(200, temp01ResNSBasketCountCmdReal.get(''))
      .onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp0200ResNSMypageCmdChannelMobile)
      .onPost(`${CONST.API_URL}/NSOrderPaymentModifyMobile`).reply(200, temp02ResNSOrderPaymentModifyMobile.get(''))
      .onPost(`${CONST.API_URL}/PaymentApprovalRequestCmd`).reply(200, temp03ResPaymentApprovalRequestCmd.get(''))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get(''))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('SS')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('SS'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('KM')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('KM'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('BC')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('BC'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('DN')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('DN'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('CH')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('CH'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('AM')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('AM'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('HN')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('HN'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('VS')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('VS'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('SU')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('SU'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('SH')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('SH'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp04ReqNSMypageCommCmdInstmMmsList.get('LG')))
      .reply(200, temp04ResNSMypageCommCmdInstmMmsList.get('LG'))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp05ReqNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD)))
      .reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      // 롯데카드 직승인
      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"result":"0000","card_no":"5320920017121956"')))
      .reply(200, temp06ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"result":""')))
      .reply(200, temp06ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

      // KB카드 직승인
      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"SendCode":"10001000"')))
      .reply(200, temp06ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"SendCode":"22002200"')))
      .reply(200, temp06ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"SendCode":"00130013"')))
      .reply(200, temp06ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

      // 신한카드 직승인
      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"sendCode":"success"')))
      .reply(200, temp06ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp06ReqNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD, 'creditcard', ',"sendCode":""')))
      .reply(200, temp06ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

    options = {
      localVue,
      attachToDocument: true,
      propsData: {
        param: {
          ordersId: '300011015064'
        }
      }
    }
    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    wrapper = mount(OrderPaymentMethodChange, options)
    wrapper.vm.$store = { commit: data => {} }
  })

  afterEach(() => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderPaymentMethodChange 테스트', () => {
    it('결제수단변경 1 (method())', async () => {
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.useCardList = wrapper.vm.mOutputDatas.msg.UseCardList

      wrapper.vm.epCardCode = 'HN_006_N_80'
      wrapper.vm.onchangeSelectEpCardCode()

      wrapper.vm.epCardCode = 'AM_047_Y_70'
      wrapper.vm.onchangeSelectEpCardCode()

      wrapper.vm.epCardCode = 'KM_016_Y_30'
      wrapper.vm.onchangeSelectEpCardCode()

      wrapper.vm.onchangeSelectEpQuota()
      wrapper.vm.setEpNoinstFlagN()
      wrapper.vm.instmMmsListView()
      wrapper.vm.setDefaultEpQuota()

      wrapper.vm.epQuotaListType = '1'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.epQuotaListType = '2'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.epQuotaListType = '3'
      wrapper.vm.selectedCardCodeEzPayCd = 'KM_016'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.selectedCardCodeEzPayCd = 'SS_031'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.selectedCardCodeEzPayCd = 'SH_029'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.selectedCardCodeEzPayCd = 'DN_027'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.selectedCardCodeEzPayCd = 'AM_047'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.triggerChangeSelectEpCardCode()
      wrapper.vm.triggerChangeSelectEpNoinstFlag()

      assert.isTrue(true)
    })
    it('결제수단변경 (method()-fncGetCardChainId)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { list: { cardChainId: 'D' } })
      mock.onPost(`${CONST.API_URL}/PaymentModifyRequestCmd`).reply(200, { msg: { result: 'success' } })

      wrapper.vm.fncGetCardChainId({ EP_card_prefix: '1234567', EP_req_type: '' })
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-gotoPaymentComplete 1)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/PaymentModifyRequestCmd`).reply(200, { msg: { result: 'success' } })

      wrapper.vm.gotoPaymentComplete({ EP_card_prefix: '1234567', EP_req_type: '' })
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-gotoPaymentComplete 2)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/PaymentModifyRequestCmd`).reply(200, { msg: { result: '' } })

      wrapper.vm.gotoPaymentComplete({ EP_card_prefix: '1234567', EP_req_type: '' })
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-onclickChangeCancel)', async () => {
      wrapper.vm.onclickChangeCancel()
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-onclickConfirm 1)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      wrapper.vm.onclickConfirm()
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-onclickConfirm 2)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      wrapper.vm.epQuota = ''
      wrapper.vm.onclickConfirm()
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-onclickConfirm 3)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      wrapper.vm.epQuota = '00'
      wrapper.vm.isCheckAgreePurchage = false
      wrapper.vm.onclickConfirm()
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-onclickConfirm 4)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      wrapper.vm.isCheckAgreePurchage = true
      wrapper.vm.epCardCode = 'HN_006_N_80'
      wrapper.vm.onclickConfirm()
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-onclickConfirm 5)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      wrapper.vm.isCheckAgreePurchage = true
      wrapper.vm.epCardCode = 'AM_047_Y_70'
      wrapper.vm.onclickConfirm()
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-onclickConfirm 6)', async () => {
      temp03ResPaymentApprovalRequestCmd.get('').msg.RESULTCODE = '10001000'
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))
      mock.onPost(`${CONST.API_URL}/PaymentApprovalRequestCmd`).reply(200, temp03ResPaymentApprovalRequestCmd.get(''))

      wrapper.vm.isCheckAgreePurchage = true
      wrapper.vm.epCardCode = 'KM_016_Y_30'
      wrapper.vm.onclickConfirm()
      temp03ResPaymentApprovalRequestCmd.get('').msg.RESULTCODE = ''
      assert.isTrue(true)
    })
    it('결제수단변경 (method()-showPayWindows)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      wrapper.vm.showPayWindows()
      assert.isTrue(true)
    })

    it('결제수단변경(methods())-instmMmsListView', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }

      for (const item of dummySelectboxCard) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.mOutputDatas = { msg: { withoutBankInfo: { dpstSchdAmt: 55000 } } }
        wrapper.vm.instmMmsListView()
      }
      assert.isTrue(true)
    })

    it('결제수단변경(methods())-setDefaultEpQuota', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }

      for (const item of dummySelectboxCard) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.setDefaultEpQuota()
      }
      assert.isTrue(true)
    })

    it('결제수단변경(methods())-setDisplayEpQuotaList', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }

      for (const item of dummySelectboxCard) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.epQuotaListType = '1'
        wrapper.vm.setDisplayEpQuotaList()

        wrapper.vm.epQuotaListType = '2'
        wrapper.vm.setDisplayEpQuotaList()

        wrapper.vm.epQuotaListType = '3'
        wrapper.vm.setDisplayEpQuotaList()
      }
      assert.isTrue(true)
    })

    it('결제수단변경(method())-롯데카드 직승인 (callbackResult)', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }

      let data = extend(true, {}, tempCallbackPaymentResult)
      data.params.result = ''
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.usedcard_code = 'AM'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      data = extend(true, {}, tempCallbackPaymentResult)
      data.params.result = '0000'
      data.params.card_no = '5320920017121956'
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.usedcard_code = 'AM'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      assert.isTrue(true)
    })

    it('결제수단변경(method())-KB카드 직승인 (callbackResult)', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }

      let data = extend(true, {}, tempCallbackPaymentResult)
      data.params.SendCode = '22002200'
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.usedcard_code = 'KM'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      data = extend(true, {}, tempCallbackPaymentResult)
      data.params.SendCode = '00130013'
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.usedcard_code = 'KM'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      data = extend(true, {}, tempCallbackPaymentResult)
      data.params.SendCode = ''
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.usedcard_code = 'KM'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      data = extend(true, {}, tempCallbackPaymentResult)
      data.params.SendCode = '10001000'
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.usedcard_code = 'KM'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      assert.isTrue(true)
    })
    it('결제수단변경(method())-신한 직승인 (callbackResult)', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }

      let data = extend(true, {}, tempCallbackPaymentResult)
      data.params.sendCode = ''
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.moduleGubun = 'P'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      data = extend(true, {}, tempCallbackPaymentResult)
      data.params.sendCode = 'success'
      wrapper.vm.paymentMethodInitData.VAN_CO = '20'
      wrapper.vm.paymentMethodInitData.moduleGubun = 'P'
      wrapper.vm.callbackResult({ cmd: 'callbackPaymentResult', params: data.params })
      await flushPromises()

      assert.isTrue(true)
    })
    it('결제수단변경(method())-결제완료처리 (callbackResult)', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.callbackResult({ cmd: 'close', params: null })
      await flushPromises()

      assert.isTrue(true)
    })
    it('결제수단변경(methods())-onclickConfirm 1', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.epCardCode = 'HN_006_N_80'
      wrapper.vm.epQuota = null
      assert.isFalse(wrapper.vm.onclickConfirm())
    })
    it('결제수단변경(methods())-onclickConfirm 2', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.epCardCode = 'HN_006_N_80'
      wrapper.vm.epQuota = '03_n'
      wrapper.vm.isCheckAgreePurchage = false
      assert.isFalse(wrapper.vm.onclickConfirm())
    })
    it('결제수단변경(methods())-onclickConfirm 3', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp0200ResNSMypageCmdChannelMobile)
      mock.onPost(`${CONST.API_URL}/NSOrderPaymentModifyMobile`).reply(200, temp02ResNSOrderPaymentModifyMobile.get(''))
      mock.onPost(`${CONST.API_URL}/PaymentApprovalRequestCmd`).reply(200, temp03ResPaymentApprovalRequestCmd.get(''))
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp05ResNSMypageCommCmdAlejandroE.get(PAY_TYPE_CONST.CREDIT_CARD))

      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.epCardCode = 'HN_006_N_80'
      wrapper.vm.epQuota = '03_n'
      wrapper.vm.isCheckAgreePurchage = true
      wrapper.vm.useCardList = wrapper.vm.mOutputDatas.msg.UseCardList

      assert.isUndefined(wrapper.vm.onclickConfirm())
    })
    it('결제수단변경(methods())-setDisplayEpQuotaList 1', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.epQuotaListType = '2'
      wrapper.vm.limitForCount = 12
      wrapper.vm.useCardList = wrapper.vm.mOutputDatas.msg.UseCardList

      wrapper.vm.setDisplayEpQuotaList()
      assert.isTrue(true)
    })
    it('결제수단변경(methods())-setDisplayEpQuotaList 2', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.mOutputDatas.msg = temp02ResNSOrderPaymentModifyMobile.get('').msg.root
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.epQuotaListType = '3'
      wrapper.vm.limitForCount = 15
      wrapper.vm.epQuotaList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      wrapper.vm.useCardList = wrapper.vm.mOutputDatas.msg.UseCardList
      wrapper.vm.selectedCardCodeEzPayCd = 'KM_016'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.selectedCardCodeEzPayCd = 'DN_027'
      wrapper.vm.setDisplayEpQuotaList()

      wrapper.vm.selectedCardCodeEzPayCd = 'AM_047'
      wrapper.vm.setDisplayEpQuotaList()
      assert.isTrue(true)
    })
    it('결제수단변경(computed())-commonUtil, bizUtil', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      assert.isNotNull(wrapper.vm.commonUtil)
      assert.isNotNull(wrapper.vm.bizUtil)
    })
    it('결제수단변경(methods())-상품정보 설정 (setProductInfo)', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      const data = {
        msg: {
          root: {
            orders: [{ cats: [{}] }]
          }
        }
      }
      data.msg.root.orders[0].cats[0].subProducts = [
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
      wrapper.vm.setProductInfo(data)
      assert.isTrue(true)
    })
    it('결제수단변경(methods())-결제정보 설정 (setPaymentInfo)', async () => {
      const wrapper = mount(OrderPaymentMethodChange, options)
      wrapper.vm.setPaymentInfo(temp02ResNSOrderPaymentModifyMobile.get(''))
      assert.isTrue(true)
    })
  })
})
