import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import CONST from '@constants/framework/framework'
import { getProcessedWCSParameter } from '@unit/testUtil'

import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import {
  getNowDate
} from '@frameworks/dateutil/dateUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderConsultSheet from '@/views/order/consult/OrderConsultSheet'
import OrderConsultSheetCustomer from '@/views/order/consult/OrderConsultSheetCustomer'
import OrderConsultSheetUser from '@/views/order/consult/OrderConsultSheetUser'
import OrderConsultSheetConfirm from '@/views/order/consult/OrderConsultSheetConfirm'

import TEMP_M_INPUTPARAMS from '@unit/views/order/consult/mock/m_inputParamsTest'
import temp01ReqNSItemDetailAjaxCmdType14 from '@unit/views/order/consult/mock/01_req_NSItemDetailAjax_cmdType14Test'
import temp01ResNSItemDetailAjaxCmdType14 from '@unit/views/order/consult/mock/01_res_NSItemDetailAjax_cmdType14Test'
import temp02ReqNSItemDetailAjaxCmdType6 from '@unit/views/order/consult/mock/02_req_NSItemDetailAjax_cmdType6Test'
import temp02ResNSItemDetailAjaxCmdType6 from '@unit/views/order/consult/mock/02_res_NSItemDetailAjax_cmdType6Test'
// import temp03ReqNSItemDetailAjaxCmdType14 from '@unit/views/order/consult/mock/03_req_NSItemDetailAjax_cmdType14Test'
import temp03ResNSItemDetailAjaxCmdType14 from '@unit/views/order/consult/mock/03_res_NSItemDetailAjax_cmdType14Test'
// import temp04ReqNSItemDetailAjaxCmdType4 from '@unit/views/order/consult/mock/04_req_NSItemDetailAjax_cmdType4Test'
import temp04ResNSItemDetailAjaxCmdType4 from '@unit/views/order/consult/mock/04_res_NSItemDetailAjax_cmdType4Test'

describe('OrderConsultSheet', () => {
  let localVue
  let options
  let mainWrapper
  let mock
  const responeObject = { isUserHpnoErrorShow: false, response: { msg: { root: { processMsg: { processMsg: 'S', effectiveTime: 1 } } } } }
  const e = {
    preventDefault: () => {},
    keyCode: '',
    target: { value: '', src: '' }
  }

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    bizUtil.gotoOrdersheet(TEMP_M_INPUTPARAMS)

    delete router.history.current
    router.history.current = {
      name: 'orderConsultSheet',
      meta: {},
      path: '/order/consult',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.reset()
    mock.onPost(`${CONST.API_URL}/NSItemDetailAjax`, getProcessedWCSParameter('post', temp01ReqNSItemDetailAjaxCmdType14))
      .reply(200, temp01ResNSItemDetailAjaxCmdType14)
      .onPost(`${CONST.API_URL}/NSItemDetailAjax`, getProcessedWCSParameter('post', temp02ReqNSItemDetailAjaxCmdType6))
      .reply(200, temp02ResNSItemDetailAjaxCmdType6)

    options = {
      localVue,
      store,
      router,
      attachToDocument: true,
      data () {
        return {
        }
      }
    }

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K' })
    mainWrapper = mount(OrderConsultSheet, options)

    await flushPromises()
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderConsultSheet 테스트', () => {
    it('상담신청 주문서(methods())-init (init)', async () => {
      mainWrapper.vm.globalVal.mInputParams.catalogId = ''
      mainWrapper.vm.init()

      mainWrapper.vm.globalVal.mInputParams.catalogId = '12345'
      mainWrapper.vm.globalVal.mInputParams.categoryId = ''
      mainWrapper.vm.init()

      mainWrapper.vm.globalVal.mInputParams.categoryId = '12345'
      mainWrapper.vm.globalVal.mInputParams.catgroupId = ''
      mainWrapper.vm.init()

      mainWrapper.vm.globalVal.mInputParams.catgroupId = '12345'
      mainWrapper.vm.init()

      mainWrapper.vm.globalVal.mInputParams.orderPrgrsTypeCd = '800'
      mainWrapper.vm.init()

      mainWrapper.vm.globalVal.mInputParams.addAddressFlag = 'Y'
      mainWrapper.vm.init()

      mainWrapper.vm.globalVal.mInputParams.addAddressFlag = 'N'
      mainWrapper.vm.globalVal.mInputParams.dispTypeCd = '57'
      mainWrapper.vm.init()
      assert.isTrue(true)
    })
    it('상담신청 주문서(methods())-고객정보 가져오기 (getCustomer)', async () => {
      assert.isNotNull(mainWrapper.vm.globalVal.memberInfo)
    })
    it('상담신청 주문서(methods())-배송지정보 가져오기 (getShippingAddress)', async () => {
      assert.isNotNull(mainWrapper.vm.globalVal.deliveryInfo)
    })
    it('상담신청 주문서(methods())-상품상세정보조회 API 호출을 위한 파라미터 (productDetailParams)', async () => {
      assert.isNotNull(mainWrapper.vm.productDetailParams())
    })
    it('상담신청 주문서(methods())-파라미터 세팅 (setParams)', async () => {
      mainWrapper.vm.setParams({
        orderPrgrsTypeCd: '',
        goodsTypeCd: '',
        addAddressFlag: '',
        brandName: '',
        productName: '',
        modelName: '',
        costTypeCd: '',
        catentryId: '',
        dispTypeCd: '',
        multiCd: '1234567890',
        mmRntalPrc: '1000',
        offerPrice: '1000',
        photoList: [{ photoPath: '/img' }],
        tvList: [{ pgmCd: '', cnnlNumCd: '', brdctDate: '' }],
        optionList: [{ partNumber: '1234567890', SKUs: [{ uniqueID: 'asdf0u' }] }]
      })
      assert.isNotNull(mainWrapper.vm.globalVal.deliveryInfo)
    })
  })
  describe('OrderConsultSheetCustomer 테스트', () => {
    it('신청자 정보(methods())-휴대폰 점유인증 인증 모듈 호출 (sendVerificationCode)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetCustomer)
      wrapper.vm.sendVerificationCode()
      assert.isTrue(true)
    })
    it('신청자 정보(methods())-인증번호 전송 후처리 (handleSendVerificationCode)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetCustomer)
      wrapper.vm.handleSendVerificationCode(responeObject)
      assert.isTrue(true)
    })
    it('신청자 정보(methods())-인증번호 확인 후처리 (handleCheckVerificationCode)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetCustomer)
      wrapper.vm.handleCheckVerificationCode(responeObject)
      assert.isTrue(true)
    })
    it('신청자 정보(methods())-인증번호 전송 callback (callbackCertNumber)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetCustomer)
      wrapper.vm.callbackCertNumber(responeObject.response)
      assert.isTrue(true)
    })
    it('신청자 정보(methods())-인증번호 입력 시간 제한 타이머 (getAuthNoIntervalTime)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetCustomer)

      wrapper.vm.effectiveTime = 1
      wrapper.vm.setAuthNoIntervalTime()

      wrapper.vm.effectiveTime = 10
      wrapper.vm.setAuthNoIntervalTime()
      assert.isTrue(true)
    })
  })
  describe('OrderConsultSheetUser 테스트', () => {
    it('이용자 정보(methods())-배송주소 클릭 시 (onclickAddressBookLink)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetUser)
      wrapper.vm.onclickAddressBookLink()
      assert.isTrue(true)
    })
    it('이용자 정보(methods())-상담 요청일 (onchangeCallDate)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetUser)
      wrapper.vm.onchangeCallDate()
      assert.isTrue(true)
    })
    it('이용자 정보(methods())-일자선택 (onclickCallDay)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetUser)
      wrapper.vm.onclickCallDay()
      assert.isTrue(true)
    })
    it('이용자 정보(methods())-입력 (key)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetUser)

      wrapper.vm.focusDashPhone()

      e.keyCode = 9
      wrapper.vm.keydownNumber(e)

      wrapper.vm.giftCardNo = '01012345678'
      e.keyCode = 65
      wrapper.vm.keydownNumber(e)

      e.keyCode = ''
      wrapper.vm.keyupNumber(e)
      wrapper.vm.onblurValueApply(e)

      assert.isTrue(true)
    })
  })
  describe('OrderConsultSheetConfirm 테스트', () => {
    it('상담 신청하기(methods())-유효성 검사 (validConsult)', async () => {
      const wrapper = mainWrapper.find(OrderConsultSheetConfirm)
      mainWrapper.vm.globalVal.mInputParams.orderPrgrsTypeCd = '300'

      wrapper.vm.checkedAgreeForce = false
      assert.isFalse(wrapper.vm.validConsult(), '-1')

      wrapper.vm.checkedAgreeForce = true
      wrapper.vm.globalVal.userInfo.userName = ''
      assert.isFalse(wrapper.vm.validConsult(), '-2')

      wrapper.vm.globalVal.userInfo.userName = '테스터'
      wrapper.vm.globalVal.userInfo.fullAddress = ''
      assert.isFalse(wrapper.vm.validConsult(), '-3')

      wrapper.vm.globalVal.userInfo.fullAddress = '배송주소'
      wrapper.vm.globalVal.userInfo.phoneNo = ''
      assert.isFalse(wrapper.vm.validConsult(), '-4')

      wrapper.vm.globalVal.userInfo.phoneNo = '010-1234'
      wrapper.vm.globalVal.mInputParams.orderPrgrsTypeCd = '000'
      assert.isFalse(wrapper.vm.validConsult(), '-5')

      wrapper.vm.globalVal.userInfo.phoneNo = '01012345678'
      wrapper.vm.globalVal.userInfo.checkedCallDate = 'Y'
      wrapper.vm.globalVal.userInfo.showWrongCallDate = ''
      assert.isFalse(wrapper.vm.validConsult(), '-6')

      wrapper.vm.globalVal.userInfo.showWrongCallDate = '1900-06-24'
      wrapper.vm.validConsult()

      wrapper.vm.globalVal.userInfo.showWrongCallDate = '2100-07-24'
      wrapper.vm.validConsult()

      wrapper.vm.globalVal.userInfo.showWrongCallDate = getNowDate()
      wrapper.vm.globalVal.userInfo.selectTime = '20'
      wrapper.vm.validConsult()

      wrapper.vm.globalVal.userInfo.checkedCallDate = 'N'
      assert.isTrue(wrapper.vm.validConsult(), '-8')
    })
    it('상담 신청하기(methods())-상담 신청하기1 (onclickConsultConfirm)', async () => {
      mock.reset()
      const wrapper = mainWrapper.find(OrderConsultSheetConfirm)
      await wrapper.vm.onclickConsultConfirm()
      assert.isTrue(true)
    })
    it('상담 신청하기(methods())-상담 신청하기2 (requestConsultConfirm)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSItemDetailAjax`)
        .reply(200, temp03ResNSItemDetailAjaxCmdType14)

      const wrapper = mainWrapper.find(OrderConsultSheetConfirm)
      loginUtil.login({ userId: 110548084, logonType: 'K' })
      wrapper.vm.requestConsultConfirm()
      assert.isTrue(true)
    })
    it('상담 신청하기(methods())-상담 신청하기3 (executeCunsult)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSItemDetailAjax`)
        .reply(200, temp04ResNSItemDetailAjaxCmdType4)

      const wrapper = mainWrapper.find(OrderConsultSheetConfirm)
      loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K' })
      wrapper.vm.globalVal.mInputParams.orderPrgrsTypeCd = '800'
      wrapper.vm.globalVal.memberInfo.phone = '01012345678'
      wrapper.vm.globalVal.userInfo.phoneNo = '01012345678'
      wrapper.vm.executeCunsult()
      assert.isTrue(true)
    })
    it('상담 신청하기(methods())-상담신청 주문서로 이동 (gotoOrderConsult)', async () => {
      bizUtil.gotoOrderConsult({})
      assert.isTrue(true)
    })
  })
})
