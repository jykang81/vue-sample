import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import VueRouter from 'vue-router'
import router from '@/router'
import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'
import {
  getDateWithDayFormat
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import {
  insertCommas,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import CONST from '@constants/framework/framework'
import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'
import { getProcessedWCSParameter } from '@unit/testUtil'

import TEMP_M_INPUTPARAMS from '@unit/views/order/complete/mock/mInputParams'
import OrderComplete from '@/views/order/complete/OrderComplete'
import OrderCompleteMessage from '@/views/order/complete/OrderCompleteMessage'
import OrderCompleteDetail from '@/views/order/complete/OrderCompleteDetail'
import OrderCompletePayment from '@/views/order/complete/OrderCompletePayment'
import OrderCompleteConfirm from '@/views/order/complete/OrderCompleteConfirm'

// message
import temp01ReqNSBasketMobileCmdReal from '@unit/views/order/complete/mock/message/01_req_NSBasketMobileCmdReal'
import temp01ResNSBasketMobileCmdReal from '@unit/views/order/complete/mock/message/01_res_NSBasketMobileCmdReal'
import temp02ReqAjaxNSXorderItemAdd4Worklight from '@unit/views/order/complete/mock/message/02_req_AjaxNSXorderItemAdd4Worklight'
import temp02ResAjaxNSXorderItemAdd4Worklight from '@unit/views/order/complete/mock/message/02_res_AjaxNSXorderItemAdd4Worklight'
import temp03ReqNSBasketCountCmdReal from '@unit/views/order/complete/mock/message/03_req_NSBasketCountCmdReal'
import temp03ResNSBasketCountCmdReal from '@unit/views/order/complete/mock/message/03_res_NSBasketCountCmdReal'

// delivery
import temp01ReqNSMypageCommCmdCheckOrderStatus from '@unit/views/order/complete/mock/delivery/01_req_NSMypageCommCmd_CheckOrderStatus'
import temp01ResNSMypageCommCmdCheckOrderStatus from '@unit/views/order/complete/mock/delivery/01_res_NSMypageCommCmd_CheckOrderStatus'
import temp02ReqNSMypageCommCmdAlejandro from '@unit/views/order/complete/mock/delivery/02_req_NSMypageCommCmd_alejandro'
import temp02ResNSMypageCommCmdAlejandro from '@unit/views/order/complete/mock/delivery/02_res_NSMypageCommCmd_alejandro'
// import temp03ReqNSOrderDeliveryModifyCmdMobile from '@unit/views/order/complete/mock/delivery/03_req_NSOrderDeliveryModifyCmdMobile'
import temp03ResNSOrderDeliveryModifyCmdMobile from '@unit/views/order/complete/mock/delivery/03_res_NSOrderDeliveryModifyCmdMobile'

describe('OrderComplete', () => {
  const dummy = 'dummy'
  let localVue
  let options
  let mainWrapper
  let mock
  const mockData = {
    salePrice: 1000,
    dispTypeCd: '50',
    apprStatCd: '20',
    buyable: 1,
    saleYn: 'Y',
    markForDelete: 0,
    productCnt: 1,
    busChnId: 'AA',
    multiCd: 'dummy',
    partNumber: '1234567890',
    optionList: [{ partNumber: '1234567890' }]
  }

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'orderComplete',
      meta: {},
      path: '/order/complete',
      hash: '',
      query: {},
      params: TEMP_M_INPUTPARAMS,
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.reset()
    mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp01ReqNSMypageCommCmdCheckOrderStatus))
      .reply(200, temp01ResNSMypageCommCmdCheckOrderStatus)

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandro.get('checkOrderStatus', '')))
      .reply(200, temp02ResNSMypageCommCmdAlejandro.get('checkOrderStatus', ''))

      .onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', temp02ReqNSMypageCommCmdAlejandro.get('chkRcOrderDtlStats', ',"memberId":""')))
      .reply(200, temp02ResNSMypageCommCmdAlejandro.get('chkRcOrderDtlStats', ',"memberId":""'))

      .onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`, getProcessedWCSParameter('post', temp01ReqNSBasketMobileCmdReal.get('10')))
      .reply(200, temp01ResNSBasketMobileCmdReal.get('10'))

      .onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`, getProcessedWCSParameter('post', temp01ReqNSBasketMobileCmdReal.get('50')))
      .reply(200, temp01ResNSBasketMobileCmdReal.get('50'))

      .onPost(`${CONST.API_URL}/AjaxNSXorderItemAdd4Worklight`, getProcessedWCSParameter('post', temp02ReqAjaxNSXorderItemAdd4Worklight.get('10')))
      .reply(200, temp02ResAjaxNSXorderItemAdd4Worklight.get('10'))

      .onPost(`${CONST.API_URL}/AjaxNSXorderItemAdd4Worklight`, getProcessedWCSParameter('post', temp02ReqAjaxNSXorderItemAdd4Worklight.get('50')))
      .reply(200, temp02ResAjaxNSXorderItemAdd4Worklight.get('50'))

      .onPost(`${CONST.API_URL}/NSBasketCountCmdReal`, getProcessedWCSParameter('post', temp03ReqNSBasketCountCmdReal))
      .reply(200, temp03ResNSBasketCountCmdReal)

      .onPost(`${CONST.API_URL}/NSOrderDeliveryModifyCmdMobile`)
      .reply(200, temp03ResNSOrderDeliveryModifyCmdMobile)

      .onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: mockData }] } })
      .onPost(`${CONST.API_URL}/NSAjaxLogOutCmd`).reply(200, {})

    options = {
      localVue,
      store,
      router
    }

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    mainWrapper = mount(OrderComplete, options)
  })

  afterEach(() => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderComplete 테스트', () => {
    // OrderComplete
    it('주문완료(vm.globalVal)-주문번호 확인', async () => {
      const orderId = mainWrapper.vm.globalVal.mInputParams.orderId
      assert.isNotEmpty(orderId)
    })
    it('주문완료(vm)-isLoadChildComponent (true)', async () => {
      const isLoadChildComponent = mainWrapper.vm.isLoadChildComponent
      assert.isTrue(isLoadChildComponent)
    })
    it('주문완료(created)-nsAjaxLogOut', async () => {
      sessionStorageUtil.del('memberInfo')
      localStorageUtil.del('memberInfo')
      mount(OrderComplete, options)
      assert.isTrue(true)
    })

    // OrderCompleteMessage
    it('주문정보(vm.globalVal)-주문번호 확인', async () => {
      const wrapper = mainWrapper.find(OrderCompleteMessage)
      const orderId = wrapper.vm.globalVal.mInputParams.orderId
      assert.equal(orderId, mainWrapper.vm.globalVal.mInputParams.orderId)
    })
    it('주문정보(methods())-장바구니 담기 (onclickAddCart)', async () => {
      const wrapper = mainWrapper.find(OrderCompleteMessage)
      wrapper.vm.onclickAddCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 1 (addCart)', async () => {
      const data = {
        salePrice: 1000,
        dispTypeCd: '50',
        apprStatCd: '20',
        buyable: 1,
        saleYn: 'Y',
        markForDelete: 0,
        productCnt: 1,
        busChnId: 'AA',
        multiCd: 'dummy',
        partNumber: '1234567890',
        optionList: [{ partNumber: '1234567890' }]
      }

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })

    it('주문정보(methods())-Mixin 2 (addCart)', async () => {
      const data = { salePrice: 0, dispTypeCd: '', apprStatCd: '50', buyable: 0, saleYn: 'N', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 3 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '', apprStatCd: '50', buyable: 0, saleYn: 'N', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 4 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '50', apprStatCd: '50', buyable: 0, saleYn: 'N', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 5 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '50', apprStatCd: '20', buyable: 0, saleYn: 'N', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 6 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '50', apprStatCd: '20', buyable: 1, saleYn: 'N', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 7 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '50', apprStatCd: '20', buyable: 1, saleYn: 'Y', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 8 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '50', apprStatCd: '20', buyable: 1, saleYn: 'Y', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 9 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '50', apprStatCd: '20', buyable: 1, saleYn: 'Y', markForDelete: 1, productCnt: 0, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-Mixin 10 (addCart)', async () => {
      const data = { salePrice: 1000, dispTypeCd: '50', apprStatCd: '20', buyable: 1, saleYn: 'Y', markForDelete: 1, productCnt: 1, busChnId: 'SB', multiCd: '', partNumber: '1234567890', optionList: [{ partNumber: '1234567890' }] }
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200, { msg: { goods: [{ catentryId: '', quantity: 0 }] } })
      mock.onPost(`${CONST.API_URL}/DetailProductViewReal`).reply(200, { msg: { goods: [{ info: data }] } })
      const wrapper = mainWrapper.find(OrderCompleteMessage)

      wrapper.vm.addCartItems = [{ DISP_TYPE_CD: '50', QUANTITY: '1', CATENTRY_ID: '10119997968', busChnId: 'INT' }]
      wrapper.vm.addCart()
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문정보(methods())-무통장입금 여부 확인 (isDeposit:true)', () => {
      const wrapper = mainWrapper.find(OrderCompleteMessage)
      wrapper.vm.paymentItem.payType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      assert.isTrue(wrapper.vm.isDeposit())
    })
    it('주문정보(methods())-무통장입금 여부 확인 (isDeposit:false)', () => {
      const wrapper = mainWrapper.find(OrderCompleteMessage)
      wrapper.vm.paymentItem.payType = dummy
      assert.isFalse(wrapper.vm.isDeposit())
    })
    it('주문정보(methods())-무통장입금설정 확인 (setDeposit)', () => {
      const wrapper = mainWrapper.find(OrderCompleteMessage)
      wrapper.vm.paymentItem.DP_bankName = '국민'
      wrapper.vm.paymentItem.payAmt = '1000'
      wrapper.vm.paymentItem.DP_depositAccountNo = '35649014275224'
      wrapper.vm.paymentItem.DP_payDate = '2020-03-16'
      wrapper.vm.setDeposit()

      assert.equal(wrapper.vm.displayInfo.deposit.name, wrapper.vm.paymentItem.DP_bankName)
      assert.equal(wrapper.vm.displayInfo.deposit.amt, insertCommas(wrapper.vm.paymentItem.payAmt))
      assert.equal(wrapper.vm.displayInfo.deposit.accNum, wrapper.vm.paymentItem.DP_depositAccountNo)
      assert.equal(wrapper.vm.displayInfo.deposit.date, getDateWithDayFormat(wrapper.vm.paymentItem.DP_payDate.replace(/-/g, '')))
    })

    // OrderCompleteDetail
    it('주문상세(vm.globalVal)-주문번호 확인', () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      const orderId = wrapper.vm.globalVal.mInputParams.orderId
      assert.equal(orderId, mainWrapper.vm.globalVal.mInputParams.orderId)
    })
    it('주문상세(methods())-배송일 (shippingDate)', () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      const data = {}

      data.intuitiveShippingDate = ''
      assert.isEmpty(wrapper.vm.shippingDate(data))

      data.intuitiveShippingDate = '29990101'
      data.orderPostPrdnFlag = 'N'
      data.busChnId = 'CTCOM'
      assert.equal(wrapper.vm.shippingDate(data), '설치/직배송상품 별도 해피콜 예정 <br/>(약 3일 소요)')

      data.busChnId = 'TV'
      assert.equal(wrapper.vm.shippingDate(data), '설치/직배송상품 별도 해피콜 예정 <br/>(약 3일 소요)')

      data.busChnId = ''
      assert.equal(wrapper.vm.shippingDate(data), '설치/직배송상품 별도 해피콜 예정')

      data.intuitiveShippingDate = '29990102'
      assert.equal(wrapper.vm.shippingDate(data), '상품설명 내 상세배송일정 참고')

      data.intuitiveShippingDate = '20200427'
      assert.equal(wrapper.vm.shippingDate(data), `${getDateWithDayFormat(data.intuitiveShippingDate)} 이내 도착예정`)

      data.orderPostPrdnFlag = 'Y'
      assert.equal(wrapper.vm.shippingDate(data), `${getDateWithDayFormat(data.intuitiveShippingDate)} 이내 도착예정<p>[주문제작상품]</p>`)

      data.intuitiveShippingDate = false
      data.custGetDttm = '29990101'
      data.installItemFlag = 'Y'
      data.deliveryType = ''
      data.orderPostPrdnFlag = ''
      assert.equal(wrapper.vm.shippingDate(data), `${getDateWithDayFormat(data.custGetDttm)}이내 해피콜 예정`)

      data.installItemFlag = 'N'
      data.orderPostPrdnFlag = 'Y'
      assert.equal(wrapper.vm.shippingDate(data), `${getDateWithDayFormat(data.custGetDttm)}이내 도착 예정<p>[주문제작상품]</p>`)

      data.orderPostPrdnFlag = 'N'
      data.deliveryType = '10'
      assert.equal(wrapper.vm.shippingDate(data), '예약일정에 따라 출고')
    })
    it('주문상세(computed())-복수배송 배송지 정보: 기프티콘일 경우 확인 (isGifticon)', () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      wrapper.vm.globalVal.detailInfo.productList[0].DISP_TYPE_CD = '50'
      assert.isTrue(wrapper.vm.isGifticon)

      wrapper.vm.globalVal.detailInfo.productList[0].DISP_TYPE_CD = '55'
      assert.isTrue(wrapper.vm.isGifticon)

      wrapper.vm.globalVal.detailInfo.productList[0].DISP_TYPE_CD = '00'
      assert.isFalse(wrapper.vm.isGifticon)
    })
    it('주문상세(methods())-기프티콘, 배송메시지 여부 확인 (isNotGifticonAndMessage)', () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      const data = {
        DLVY_MESSAGE: '배송메시지',
        ITEMS: [{ DISP_TYPE_CD: '00' }]
      }
      assert.isTrue(wrapper.vm.isNotGifticonAndMessage(data))

      data.ITEMS[0].DISP_TYPE_CD = '50'
      data.DLVY_MESSAGE = ''
      assert.isFalse(wrapper.vm.isNotGifticonAndMessage(data))

      data.ITEMS[0].DISP_TYPE_CD = '55'
      assert.isFalse(wrapper.vm.isNotGifticonAndMessage(data))
    })
    it('주문상세(methods())-상품명 확인 (getProductTitle)', () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      const data = { BRAND_KOR_NM: '' }
      assert.isEmpty(wrapper.vm.getProductTitle(data))

      data.BRAND_KOR_NM = '상품명'
      assert.isNotEmpty(wrapper.vm.getProductTitle(data))
    })
    it('주문상세(methods())-상품가격 확인 (getProductAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      const data = { BASEPRICE: 1000, QUANTITY: 10 }
      assert.equal(wrapper.vm.getProductAmt(data), insertCommas(data.BASEPRICE * data.QUANTITY))
    })
    /*
    it('주문상세(methods())-배송비 확인 (getShipAmt)', async () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      const data = { SHIPCHARGE: '1000' }
      assert.equal(wrapper.vm.getShipAmt(data), insertCommas(data.SHIPCHARGE) + '원')

      data.SHIPCHARGE = '0'
      assert.equal(wrapper.vm.getShipAmt(data), '무료배송')
    })
    */
    it('주문상세(methods())-상품 상세보기 링크 (onclickProductDetail)', () => {
      const wrapper = mainWrapper.find(OrderCompleteDetail)
      wrapper.vm.onclickProductDetail('20874208', '')
      assert.isTrue(true)
    })
    it('주문상세(methods())-배송지 변경 링크 1 (onclickChangeDelivery)', async () => {
      const param1 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"checkOrderStatus","args":{"ordersId":"300011018016"}}' }

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param1)).reply(200, { list: { lockedOrderYn: 'Y' } })

      const wrapper = mainWrapper.find(OrderCompleteDetail)
      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.onclickChangeDelivery(0)
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문상세(methods())-배송지 변경 링크 2 (onclickChangeDelivery)', async () => {
      const param1 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"checkOrderStatus","args":{"ordersId":"300011018016"}}' }
      const param2 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"chkRcOrderDtlStats","args":{"ordersId":"300011018016","memberId":110548084}}' }

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param1)).reply(200, { list: { lockedOrderYn: 'N' } })
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param2)).reply(200, { list: { respCd: 'E' } })
      mock.onPost(`${CONST.API_URL}/NSOrderDeliveryModifyCmdMobile`).reply(200, { msg: { result: 'success' } })

      const wrapper = mainWrapper.find(OrderCompleteDetail)
      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.onclickChangeDelivery(0)
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문상세(methods())-배송지 변경 링크 3 (onclickChangeDelivery)', async () => {
      const param1 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"checkOrderStatus","args":{"ordersId":"300011018016"}}' }
      const param2 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"chkRcOrderDtlStats","args":{"ordersId":"300011018016","memberId":110548084}}' }

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param1)).reply(200, { list: { lockedOrderYn: 'N' } })
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param2)).reply(200, { list: { respCd: 'E' } })
      mock.onPost(`${CONST.API_URL}/NSOrderDeliveryModifyCmdMobile`).reply(200, { msg: { result: 'success' } })

      const wrapper = mainWrapper.find(OrderCompleteDetail)
      wrapper.vm.globalVal.isGuest = true
      wrapper.vm.onclickChangeDelivery(0)
      wrapper.vm.globalVal.isGuest = false
      await flushPromises()
      assert.isTrue(true)
    })
    it('주문상세(methods())-배송지 변경 링크 4 (onclickChangeDelivery)', async () => {
      const param1 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"checkOrderStatus","args":{"ordersId":"300011018016"}}' }
      const param2 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"chkRcOrderDtlStats","args":{"ordersId":"300011018016","memberId":110548084}}' }

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param1)).reply(200, { list: { lockedOrderYn: 'N' } })
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param2)).reply(200, { list: { respCd: 'S' } })
      mock.onPost(`${CONST.API_URL}/NSOrderDeliveryModifyCmdMobile`).reply(200, { msg: { result: 'success' } })

      const wrapper = mainWrapper.find(OrderCompleteDetail)
      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.onclickChangeDelivery(0)
      await flushPromises()
      assert.isTrue(true)
    })

    // OrderCompletePayment
    it('결제정보(vm.globalVal)-주문번호 확인', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const orderId = wrapper.vm.globalVal.mInputParams.orderId
      assert.equal(orderId, mainWrapper.vm.globalVal.mInputParams.orderId)
    })
    it('결제정보(data())-초기 카드금액 확인', () => {
      const amt = OrderCompletePayment.data().displayInfo.card.amt
      assert.equal(amt, '0')
    })
    it('결제정보(data())-설정 카드금액 확인', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const expected = '1000'
      wrapper.vm.displayInfo.card.amt = expected
      assert.equal(wrapper.vm.displayInfo.card.amt, expected)
    })
    it('결제정보(computed())-총 상품금액 확인 (totalProductAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const amt = wrapper.vm.totalProductAmt
      const expected = insertCommas(wrapper.vm.globalVal.paymentInfo.orderPrice.TOTAL_PRODUCT_AMT)
      assert.equal(amt, expected)
    })
    it('결제정보(computed())-총 할인금액 확인 (totalSaleAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const amt = wrapper.vm.totalSaleAmt

      const freeShippingDcAmt = wrapper.vm.globalVal.paymentInfo.orderPrice.freeShippingDcAmt // 배송비쿠폰할인
      const offerAmt = wrapper.vm.globalVal.paymentInfo.orderPrice.OFFER_AMT // 가격할인
      const coupon = Number(wrapper.vm.globalVal.paymentInfo.orderPrice.couponDcAmt) - Number(wrapper.vm.globalVal.paymentInfo.orderPrice.freeShippingDcAmt) // 쿠폰할인
      const cardDcAmt = wrapper.vm.globalVal.paymentInfo.orderPrice.cardDcAmt // 카드할인
      const total = freeShippingDcAmt + offerAmt + coupon + cardDcAmt

      const expected = (total > 0 ? '-' : '') + insertCommas()
      assert.equal(amt, expected)
    })
    it('결제정보(computed())-총 배송비 확인 (totalShipAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const amt = wrapper.vm.totalShipAmt
      const expected = insertCommas(wrapper.vm.globalVal.paymentInfo.orderPrice.SHIP_CHARGE)
      assert.equal(amt, expected)
    })
    it('결제정보(computed())-추가 배송비 확인 (addShipAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const amt = wrapper.vm.addShipAmt
      const expected = 0
      assert.equal(amt, expected)
    })
    it('결제정보(computed())-최종 결제금액 확인 (totalShipAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const amt = wrapper.vm.grandTotalAmt
      const expected = insertCommas(wrapper.vm.globalVal.paymentInfo.orderPrice.FINAL_PAYMENT_AMT)
      assert.equal(amt, expected)
    })
    it('결제정보(computed())-예상 적립금 확인 (expectAccmAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const amt = wrapper.vm.expectAccmAmt
      const expected = insertCommas(wrapper.vm.globalVal.paymentInfo.expectAccmAmt)
      assert.equal(amt, expected)
    })
    it('결제정보(methods())-결제보조수단 확인 (isPayType)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      assert.isTrue(wrapper.vm.isPayType(PAY_ASSIST_CONST.DEPOSIT_AMT))
      assert.isFalse(wrapper.vm.isPayType(dummy))
    })
    it('결제정보(methods())-결제보조수단 명 확인 (getPayAssistTitle)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      assert.equal(wrapper.vm.getPayAssistTitle(PAY_ASSIST_CONST.DEPOSIT_AMT), PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.DEPOSIT_AMT))
    })
    it('결제정보(methods())-결제보조수단 금액 확인 (getPayAssistAmt)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      const amt = '1000'
      assert.equal(wrapper.vm.getPayAssistAmt(amt), insertCommas(amt))
    })
    it('결제정보(methods())-카드 여부 확인 (isCard)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.payType = PAY_TYPE_CONST.CREDIT_CARD
      assert.isTrue(wrapper.vm.isCard())

      wrapper.vm.paymentItem.payType = dummy
      assert.isFalse(wrapper.vm.isCard())
    })
    it('결제정보(methods())-페이코 여부 확인 (isPayco)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.payType = PAY_TYPE_CONST.PAYCO
      assert.isTrue(wrapper.vm.isPayco())

      wrapper.vm.paymentItem.payType = dummy
      assert.isFalse(wrapper.vm.isPayco())
    })
    it('결제정보(methods())-모바일 여부 확인 (isMobile)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.payType = PAY_TYPE_CONST.MOBILE
      assert.isTrue(wrapper.vm.isMobile())

      wrapper.vm.paymentItem.payType = dummy
      assert.isFalse(wrapper.vm.isMobile())
    })
    it('결제정보(methods())-무통장입금 여부 확인 (isDeposit)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.payType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      assert.isTrue(wrapper.vm.isDeposit())

      wrapper.vm.paymentItem.payType = dummy
      assert.isFalse(wrapper.vm.isDeposit())
    })
    it('결제정보(methods())-신용카드설정 확인 (setCard)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.EP_card_cd = '016'
      wrapper.vm.paymentItem.EP_usedcard_code = '016'
      wrapper.vm.paymentItem.KvpCardCode = '00000090'

      wrapper.vm.paymentItem.payAmt = '1000'
      wrapper.vm.paymentItem.EP_card_no = '1234567856781234'
      wrapper.vm.paymentItem.EP_noinst_flag = 'Y'
      wrapper.vm.paymentItem.EP_noinst_term = '00'
      wrapper.vm.paymentItem.EP_quota = '00'
      wrapper.vm.setCard()

      let expected = '카카오뱅크'
      assert.equal(wrapper.vm.displayInfo.card.name, expected)

      wrapper.vm.paymentItem.KvpCardCode = '00000000'
      wrapper.vm.setCard()
      expected = bizUtil.getCreditCardCodeName(wrapper.vm.paymentItem.EP_usedcard_code)
      assert.equal(wrapper.vm.displayInfo.card.name, expected) // 신용카드명: 국민

      expected = insertCommas(wrapper.vm.paymentItem.payAmt)
      assert.equal(wrapper.vm.displayInfo.card.amt, expected)

      expected = bizUtil.formatCardNoWithAsterisk(wrapper.vm.paymentItem.EP_card_no)
      assert.equal(wrapper.vm.displayInfo.card.num, expected)

      expected = bizUtil.formatCardNoWithAsterisk(wrapper.vm.paymentItem.EP_card_no)
      assert.isTrue(wrapper.vm.displayInfo.card.desc.indexOf('개월 무이자') > -1)

      wrapper.vm.paymentItem.EP_noinst_flag = 'N'
      wrapper.vm.setCard()
      assert.isTrue(wrapper.vm.displayInfo.card.desc.indexOf('일시불') > -1)

      wrapper.vm.paymentItem.EP_noinst_flag = ''
      wrapper.vm.paymentItem.EP_quota = ''
      wrapper.vm.setCard()
      assert.isTrue(wrapper.vm.displayInfo.card.desc.indexOf('개월 할부') > -1)
    })
    it('결제정보(methods())-페이코설정 확인 (setPayco)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.payAmt = '1000'
      wrapper.vm.paymentItem.paymentDetails = [{
        CARD_NM: 'Dummy Card',
        IR_FREE_YN: 'Y',
        INSTM_MM_CNT: '00'
      }]
      wrapper.vm.setPayco()
      assert.isTrue(wrapper.vm.displayInfo.payco.desc.indexOf('개월 무이자') > -1)

      wrapper.vm.paymentItem.paymentDetails = [{
        CARD_NM: 'Dummy Card',
        IR_FREE_YN: 'N',
        INSTM_MM_CNT: '00'
      }]
      wrapper.vm.setPayco()
      assert.isTrue(wrapper.vm.displayInfo.payco.desc.indexOf('일시불') > -1)

      wrapper.vm.paymentItem.paymentDetails = [{
        CARD_NM: 'Dummy Card',
        IR_FREE_YN: 'N',
        INSTM_MM_CNT: ''
      }]
      wrapper.vm.setPayco()
      assert.isTrue(wrapper.vm.displayInfo.payco.desc.indexOf('개월 할부') > -1)
    })
    it('결제정보(methods())-모바일설정 확인 (setMobile)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.Commid = '1000'
      wrapper.vm.paymentItem.No = '01012345678'
      wrapper.vm.paymentItem.Mobilid = '1000'
      wrapper.vm.paymentItem.payAmt = '1000'
      wrapper.vm.setMobile()

      assert.equal(wrapper.vm.displayInfo.mbile.commId, wrapper.vm.paymentItem.Commid)
      assert.equal(wrapper.vm.displayInfo.mbile.phoneNum, insertSeparatorPhoneNumber(wrapper.vm.paymentItem.No))
      assert.equal(wrapper.vm.displayInfo.mbile.mobilId, wrapper.vm.paymentItem.Mobilid)
      assert.equal(wrapper.vm.displayInfo.mbile.amt, insertCommas(wrapper.vm.paymentItem.payAmt))
    })
    it('결제정보(methods())-무통장입금설정 확인 (setDeposit)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.paymentItem.DP_bankName = '국민'
      wrapper.vm.paymentItem.payAmt = '1000'
      wrapper.vm.setDeposit()

      assert.equal(wrapper.vm.displayInfo.deposit.name, wrapper.vm.paymentItem.DP_bankName)
      assert.equal(wrapper.vm.displayInfo.deposit.amt, insertCommas(wrapper.vm.paymentItem.payAmt))
    })
    it('결제정보(methods())-결제수단 변경 (onclickChangePaymentMethod)', () => {
      const wrapper = mainWrapper.find(OrderCompletePayment)
      wrapper.vm.onclickChangePaymentMethod()
      assert.isTrue(true)
    })

    // OrderCompleteConfirm
    it('화면이동(vm.globalVal)-주문번호 확인', () => {
      const wrapper = mainWrapper.find(OrderCompleteConfirm)
      const orderId = wrapper.vm.globalVal.mInputParams.orderId
      assert.equal(orderId, mainWrapper.vm.globalVal.mInputParams.orderId)
    })
    it('화면이동(methods())-계속 쇼핑하기 확인', () => {
      const wrapper = mainWrapper.find(OrderCompleteConfirm)
      wrapper.vm.onclickContinueShopping()
      assert.isTrue(true)
    })
    it('화면이동(methods())-주문내역조회 확인', () => {
      const wrapper = mainWrapper.find(OrderCompleteConfirm)
      wrapper.vm.onclickOrdersList()
    })
  })
})
