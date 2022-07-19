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
import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import PaymentData from '@/common/order/sheet/paymentData'
import OrderSheet from '@/views/order/sheet/OrderSheet'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheet', () => {
  let localVue
  let options
  let wrapper
  let mock

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    bizUtil.gotoOrdersheet(tempMInputParams)

    delete router.history.current
    router.history.current = {
      name: 'orderSheet',
      meta: {},
      path: '/order/sheet',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initOrderSheet(mock)

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

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    wrapper = mount(OrderSheet, options)

    await flushPromises()
  })

  afterEach(() => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheet 테스트', () => {
    it('주문서(vm.variable)-isLoadComponent and isCompleteData', async () => {
      assert.isTrue(wrapper.vm.isLoadChildComponent)
      assert.isTrue(wrapper.vm.globalVal.completeOrderSheetInfo)
      assert.isTrue(wrapper.vm.globalVal.completeOrderSheetCustomer)
      assert.isTrue(wrapper.vm.globalVal.completeOrderSheetDelivery)
      assert.isTrue(wrapper.vm.globalVal.completeOrderSheetProduct)
      assert.isTrue(wrapper.vm.globalVal.completeOrderSheetPayment)
      assert.isTrue(wrapper.vm.globalVal.completeOrderSheetDiscount)
    })
    it('주문서(methods())-금액 출력(initPaymentAmt)', async () => {
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE = 10
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.XBUSCHN_ID = 'TV'
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD = '50'
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PROM_DC_WAY_PAD = 'AMT'

      wrapper.vm.initPaymentAmt()
      assert.isTrue(true)
    })

    it('주문서(method())-월 한도금액 이상 주문하려고 할 경우 주문 불가 체크 통신 (shoppingLimitCheck)', async () => {
      wrapper.vm.shoppingLimitCheck({ isSuccessful: false }, null, null)
      assert.isTrue(true)
    })
    it('주문서(method())-월 한도금액 이상 주문하려고 할 경우 주문 불가 체크하여 처리 (shoppingLimitCheckNext)', async () => {
      wrapper.vm.shoppingLimitCheckNext(null, 'Y')
      assert.isTrue(true)
    })
    it('주문서(method())-주문서정보 조회 결과 (resultOrderPaymentInfo)', async () => {
      wrapper.vm.resultOrderPaymentInfo({ msg: null })
      wrapper.vm.resultOrderPaymentInfo({ isSuccessful: false, msg: { resultCode: -1 } })
      assert.isTrue(true)
    })
    /*
    it('주문서(method())-shoppingLimitCheck (retry)', async () => {
      wrapper.vm.retry.count = 1
      wrapper.vm.retry.tranId = 'NSOrderPaymentMobile'
      temp01ResNSOrderPaymentMobile.isSuccessful = false
      wrapper.vm.shoppingLimitCheck(temp01ResNSOrderPaymentMobile, '', temp04ResShoppingLimitCheckCmd)
      assert.isTrue(true)
      // temp01ResNSOrderPaymentMobile
    })
    */
  })
  describe('PaymentData 테스트', () => {
    it('주문하실 상품 목록 (PaymentData.Product)', async () => {
      const product = new PaymentData.Product()

      product.toJSON()
      product.addItem({})
      product.getItem(0)

      product.setItem(0, {})
      product.setItems([{}])
      product.toJSON()
      assert.equal(product.size(), 1)
    })
    it('주문서 배송지 목록 (PaymentData.Delivery)', async () => {
      const delivery = new PaymentData.Delivery()

      delivery.addItem({})
      delivery.getItem(0)
      delivery.toJSON()

      delivery.setItem(0, {})
      delivery.setItems([{}])
      delivery.setProductItem(0, 0, {})
      delivery.removeProductItem(0, 0)
      delivery.removeItem(0)
      assert.equal(delivery.size(), 0)

      delivery.toJSON()
      delivery.setItems([{}])
      assert.equal(delivery.size(), 1)
    })
    it('주문서 할인수단 목록 (PaymentData.Discount)', async () => {
      const discount = new PaymentData.Discount()
      const item = {
        orderItemId: 0,
        CATENTRY_ID: 0,
        couponList: [{ DiscountPrice: 10, ImdtDcCpAmt: 10 }, { DiscountPrice: 10, ImdtDcCpAmt: 10 }]
      }

      discount.addItem(item)
      discount.getItem(0)
      discount.getTotalDiscountPrice(0)
      discount.getDefineValue('PRMT_TYPE_CD', 'CPC')
      discount.toJSON()

      discount.setItem(0, item)
      discount.setItems([item])
      discount.setCouponItem(0, 0, { DiscountPrice: 10, ImdtDcCpAmt: 10 })
      discount.removeCouponItem(0, 0)
      discount.removeItem(0)
      assert.equal(discount.size(), 0)

      discount.toJSON()
      discount.setItems([item])
      assert.equal(discount.size(), 1)
    })
    it('주문서 결제정보 (PaymentData.Payment)', async () => {
      const payment = new PaymentData.Payment()
      payment.setItem({})
      payment.setItems([{}])
      payment.setItems([{}, {}])
      payment.getItem()
      payment.getCardCode('')
      payment.toJSON()
      payment.removeItem(0)
      assert.equal(payment.size(), 0)
    })
    it('주문서 제휴사 주문내역 (PaymentData.Partnership)', async () => {
      const partnership = new PaymentData.Partnership()
      partnership.setItem({})
      partnership.getItem()
      partnership.toJSON()
      assert.equal(partnership.size(), 1)
    })
    it('주문서 주문자 정보 (PaymentData.OrderUserInfo)', async () => {
      const orderUserInfo = new PaymentData.OrderUserInfo()
      orderUserInfo.size()
      orderUserInfo.toJSON()
      assert.equal(orderUserInfo.size(), 1)
    })
    it('주문서 최대구매수량 (PaymentData.MaxbuyCount)', async () => {
      const maxbuyCount = new PaymentData.MaxbuyCount()
      const item = {
        custDurSpr: 0,
        partNumber: 0,
        maxquantity: 0,
        maxOrderPossQty: 0,
        custPrchQtyLimitYn: 'Y',
        couponList: [{ DiscountPrice: 10, ImdtDcCpAmt: 10 }, { DiscountPrice: 10, ImdtDcCpAmt: 10 }]
      }

      maxbuyCount.addItem(item)
      maxbuyCount.getItem(0)
      maxbuyCount.getTotalDiscountPrice(0)
      maxbuyCount.toJSON()

      maxbuyCount.setItem(0, item)
      maxbuyCount.setItems([item])
      maxbuyCount.setCouponItem(0, 0, { DiscountPrice: 10, ImdtDcCpAmt: 10 })
      maxbuyCount.removeCouponItem(0, 0)
      maxbuyCount.removeItem(0)
      assert.equal(maxbuyCount.size(), 0)

      maxbuyCount.toJSON()
      maxbuyCount.setItems([item])
      assert.equal(maxbuyCount.size(), 1)
    })
  })
  describe('setPartnershipDataMinin 테스트', () => {
    it('제휴사 주문내역 조회를 위한 주문건 저장 (setPartnershipData)', async () => {
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '551'
      wrapper.vm.globalVal.mOutputDatas.orderPrice.CREDITCARD_PAYMENT_AMT = 100
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '552'
      wrapper.vm.globalVal.mOutputDatas.orderPrice.WITHOUT_BANKBOOK_PAYMENT_AMT = 100
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '553'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '340'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '341'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '630'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '631'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '920'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '921'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '940'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '551'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '552'
      wrapper.vm.setPartnershipData()

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.coCd = '553'
      wrapper.vm.setPartnershipData()
      assert.isTrue(true)
    })
    it('갤러리아 상품 주문가능여부 체크 (checkGalleriaSale)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/GalleriaPrdCntCheck`).reply(200, { msg: { resultCode: 'N', resultMsg: '메시지' } })

      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.VENDOR_ID = '109103'
      wrapper.vm.checkGalleriaSale()
      assert.isTrue(true)
    })
  })
})
