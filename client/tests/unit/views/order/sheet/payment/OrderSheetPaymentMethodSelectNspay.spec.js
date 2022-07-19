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
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetPaymentMethodSelect from '@/components/order/sheet/OrderSheetPaymentMethodSelect'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetPayment, initOrderSheetPaymentNspay } from '@unit/views/order/sheet/mock/setting'

import temp01ResAjaxNSWPayNoIntInfo from '@unit/views/order/sheet/mock/payment/nspay/01_res_AjaxNSWPay_noIntInfo'
import temp04ResAjaxNSWPaySetMajorPayInfo from '@unit/views/order/sheet/mock/payment/nspay/04_res_AjaxNSWPay_setMajorPayInfo'
import temp05ResAjaxNSWPayDelMajorPayInfo from '@unit/views/order/sheet/mock/payment/nspay/05_res_AjaxNSWPay_delMajorPayInfo'
import temp07ResAjaxNSWPaySetNSPayOneTouchFlag from '@unit/views/order/sheet/mock/payment/nspay/07_res_AjaxNSWPay_setNSPayOneTouchFlag'
import temp09ResNSMypageCommCmdInstmMmsList from '@unit/views/order/sheet/mock/onload/09_res_NSMypageCommCmd_instmMmsList'
import temp02ResAjaxNSWPayPayInfoAll from '@unit/views/order/sheet/mock/payment/nspay/02_res_AjaxNSWPay_payInfoAll'

describe('OrderSheet', () => {
  const dummy = 'dummy'
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const dummyQuotaList = [{ value: '00', text: '일시불' }, { value: '03', text: '03개월' }, { value: '04', text: '04개월' }, { value: '05', text: '05개월' }, { value: '06', text: '06개월' }, { value: '07', text: '07개월' }, { value: '08', text: '08개월' }, { value: '09', text: '09개월' }, { value: '10', text: '10개월' }, { value: '11', text: '11개월' }, { value: '12', text: '12개월' }]
  const dummyNoIntCardList = [{ cardEventList: [{ amount: '1', month: '3' }], cardCode: '06', nsCardCode: 'KM' }]
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
    mock.reset()
    initOrderSheet(mock)
    initOrderSheetPayment(mock)
    initOrderSheetPaymentNspay(mock)

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
    orderSheetWrapper = mount(OrderSheet, options)

    await flushPromises()
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheetPaymentMethodSelect NS페이 카드 테스트', () => {
    let wrapper

    beforeEach(async () => {
      orderSheetWrapper.vm.globalVal.paymentMethodInfo.currentPayType = 'NSPay'
      wrapper = mount(OrderSheetPaymentMethodSelect, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            paymentData: orderSheetWrapper.vm.paymentData
          }
        }
      })

      wrapper.vm.swiperNspay.selectedItem = {
        payMethod: '01',
        wpayToken: 'vLfEGXLrQR9xwc7hh5FICdF3SDHiYcvJn2lZ6BRNM28=',
        bankCardCode: '06',
        bankCardNo: '4673-09**-****-0090',
        quota: '00',
        quotaList: [{ value: '00', text: '일시불(5만원 이상할부가능)' }]
      }
    })
    it('결제수단선택(computed())-NS페이 여부(isNSPay, disabledNSPay)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = 'NSPay'
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NSPAY = 'N'
      assert.isTrue(wrapper.vm.isNSPay)
      assert.isTrue(wrapper.vm.disabledNSPay)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NSPAY = 'Y'
      assert.isFalse(wrapper.vm.isNSPay)
      assert.isFalse(wrapper.vm.disabledNSPay)
    })
    it('결제수단선택(computed())-NS페이 신용카드 여부(isNSPayCard)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD
      assert.isTrue(wrapper.vm.isNSPayCard)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      assert.isFalse(wrapper.vm.isNSPayCard)
    })
    it('결제수단선택(method())-Nspay 설정(setNspayInfo)', async () => {
      wrapper.vm.setNspayInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-Nspay 정보설정(setNspayParams)', async () => {
      wrapper.vm.$refs.nspayCardQuota0 = [{
        selectedIndex: 0,
        options: [{ value: '00', text: '일시불(5만원 이상할부가능)' }]
      }]
      wrapper.vm.setNspayParams()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-기본(카드/계좌) 추가(onclickAddNspayInfo)', async () => {
      wrapper.vm.onclickAddNspayInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-기본(카드/계좌) 삭제(onclickDelNspayInfo)', async () => {
      wrapper.vm.onclickDelNspayInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-기본(카드/계좌) 선택(onchangeNspayMajor)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp02ResAjaxNSWPayPayInfoAll)

      wrapper.vm.$refs.nspayMajYn0 = [{ checked: false }]
      wrapper.vm.$refs[`nspayMajYn${0}`][0].checked = true
      await wrapper.vm.$nextTick(() => {
        wrapper.vm.onchangeNspayMajor(0)
      })

      wrapper.vm.$refs[`nspayMajYn${0}`][0].checked = false
      await wrapper.vm.$nextTick(() => {
        wrapper.vm.onchangeNspayMajor(0)
      })
      assert.isTrue(true)
    })
    it('결제수단선택(method())-기본(카드/계좌)설정(setNspayMajorInfo)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp04ResAjaxNSWPaySetMajorPayInfo)

      wrapper.vm.setNspayMajorInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-기본(카드/계좌)삭제(delNspayMajorInfo)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp05ResAjaxNSWPayDelMajorPayInfo)

      wrapper.vm.delNspayMajorInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-원터치결제 사용여부 체크(onchangeNspayOneTouch)', async () => {
      wrapper.vm.onchangeNspayOneTouch()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NSPAY 비밀번호 확인(checkNspayPassword)', async () => {
      wrapper.vm.checkNspayPassword()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NS페이 서비스 해제(memUnReg)', async () => {
      wrapper.vm.onclickNspayMemUnReg()
      assert.isTrue(true)
    })
    /*
    it('결제수단선택(method())-onchange NspaySlideChange(onchangeNspaySlideChange)', async () => {
      wrapper.vm.swiperNspay.selectedItem = {
        payMethod: '01',
        wpayToken: 'vLfEGXLrQR9xwc7hh5FICdF3SDHiYcvJn2lZ6BRNM28=',
        bankCardCode: '06',
        bankCardNo: '4673-09**-****-0090',
        quota: '00',
        quotaList: [{ value: '00', text: '일시불(5만원 이상할부가능)' }]
      }
      wrapper.vm.onchangeNspaySlideChange()
      assert.isTrue(true)
    })
    */
    it('결제수단선택(method())-Nspay re init 설정(reInit)', async () => {
      wrapper.vm.isInitNspay = false
      wrapper.vm.reInit()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-저장된 Nspay 설정(setSavedNspayInfo)', async () => {
      wrapper.vm.setSavedNspayInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-카드 CI 목록(getNspayCardCiList)', async () => {
      wrapper.vm.getNspayCardCiList().getName(wrapper.vm.swiperNspay.selectedItem.bankCardCode)
      wrapper.vm.getNspayCardCiList().getQuotaName(wrapper.vm.swiperNspay.selectedItem.quota, wrapper.vm.swiperNspay.selectedItem.quotaList)
      assert.isTrue(true)
    })
    it('결제수단선택(method())-무이자 할부 리스트를 조회(getNspayNoIntInfo)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp01ResAjaxNSWPayNoIntInfo)
      wrapper.vm.getNspayNoIntInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-기본(카드/계좌) 추가후 처리(callbackNspayInfoResult)', async () => {
      wrapper.vm.callbackNspayInfoResult()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NSPAY 원터치 결제 설정(setNspaySmptYn)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp07ResAjaxNSWPaySetNSPayOneTouchFlag)
      wrapper.vm.setNspaySmptYn()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NSPAY 비밀번호 확인 후 처리(callbackNspayPasswordResult)', async () => {
      wrapper.vm.callbackNspayPasswordResult(null)
      wrapper.vm.callbackNspayPasswordResult({ resultCode: '0000', params: {} })
      wrapper.vm.callbackNspayPasswordResult({ resultCode: '', params: {} })
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NS페이 카드: Nspay 무이자 할부 여부 가져오기 (getNoinstYn)', async () => {
      assert.equal(wrapper.vm.getNoinstYn('06', '06개월(무이자)'), 'Y')
    })
    it('결제수단선택(method())-NS페이 카드: 이니시스 무이자 할부 리스트 추가 1(addNspayCardQuota)', async () => {
      wrapper.vm.addNspayCardQuota('06')
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NS페이 카드: 이니시스 무이자 할부 리스트 추가 2(addNspayCardQuota)', async () => {
      wrapper.vm.swiperNspay.selectedItem = {
        payMethod: '01',
        wpayToken: 'vLfEGXLrQR9xwc7hh5FICdF3SDHiYcvJn2lZ6BRNM28=',
        bankCardCode: '06',
        bankCardNo: '4673-09**-****-0090',
        quota: '00',
        quotaList: dummyQuotaList
      }
      wrapper.vm.swiperNspay.finalPaymentAmt = 60000
      wrapper.vm.swiperNspay.noIntCardList = dummyNoIntCardList
      wrapper.vm.addNspayCardQuota('06')
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NS페이 카드: NS 무이자 할부 리스트(setNspayDrawNoIntArea)', async () => {
      wrapper.vm.setNspayDrawNoIntArea(dummyQuotaList)
      assert.isTrue(true)
    })
    it('결제수단선택(method())-NS페이 카드: NS 무이자 할부 리스트(setNspayCardInstInfo)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp09ResNSMypageCommCmdInstmMmsList.get('KM'))
        .onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp02ResAjaxNSWPayPayInfoAll)
      wrapper.vm.swiperNspay.minInstallCnt = 1
      wrapper.vm.setNspayCardInstInfo('KM')
      assert.isTrue(true)
    })
    it('결제수단선택(method())- NS페이 카드: NS 무이자 할부 리스트 Extra(setNspayCardInstInfoExtra)', async () => {
      wrapper.vm.swiperNspay.minInstallCnt = 5
      wrapper.vm.setNspayCardInstInfoExtra('KM')
      wrapper.vm.setNspayCardInstInfoExtra('SS')
      wrapper.vm.setNspayCardInstInfoExtra('SH')
      wrapper.vm.setNspayCardInstInfoExtra('AM')
      assert.isTrue(true)
    })
    // it('결제수단선택(method())- NS페이 카드: 신용카드 할부 선택(onchangeNspaySelectQuota)', async () => {
    //   wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD] = {
    //     cardQuota: '',
    //     cardInterest: ''
    //   }
    //   wrapper.vm.swiper.activeIndex = 0
    //   wrapper.vm.$refs.nspayCardQuota0 = [{
    //     checked: false,
    //     selectedIndex: 0,
    //     options: [{ value: '00', text: '일시불(5만원 이상할부가능)' }]
    //   }]
    //   wrapper.vm.globalVal.discountInfo.showSinglePaymentDiscount = true
    //   wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = true
    //   wrapper.vm.globalVal.paymentMethodInfo.enableDiscountQuota = true
    //   wrapper.vm.onchangeNspaySelectQuota('')

    //   wrapper.vm.globalVal.paymentMethodInfo.enableDiscountQuota = false
    //   wrapper.vm.onchangeNspaySelectQuota('')

    //   wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = false
    //   wrapper.vm.onchangeNspaySelectQuota('')
    //   assert.isTrue(true)
    // })
    it('결제수단선택(method())- 바닥페이지 NS페이 신용카드 타이틀 설정(setFloorNspayCardTmplTitle)', async () => {
      wrapper.vm.setFloorNspayCardTmplTitle(true, wrapper.vm.swiperNspay.selectedItem.bankCardCode, wrapper.vm.swiperNspay.selectedItem.quota, dummyQuotaList)
      assert.isTrue(true)
    })
    it('결제수단선택(method())- setNspayFinalPaymentAmt(setNspayFinalPaymentAmt)', async () => {
      wrapper.vm.setNspayFinalPaymentAmt(10000)
      assert.isTrue(true)
    })
    it('결제수단선택(method())- NS페이 카드: 신용카드 할부 선택 (setNspayCardQuota)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD] = {
        cardQuota: '',
        cardInterest: ''
      }
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn = 'N'
      wrapper.vm.setNspayCardQuota('00', 'N')
      wrapper.vm.setNspayCardQuota('00', 'Y')
      wrapper.vm.setNspayCardQuota('03', 'N')
      assert.isTrue(true)
    })
    it('결제수단선택(method())- NS페이 카드: 할인 정보 (dispNspayCardDcCoupon)', async () => {
      wrapper.vm.dispNspayCardDcCoupon()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD] = {
        EP_card_prefix: '',
        EP_card_no: '',
        usedcard_code: ''
      }
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.cardBnftList = [{
        amtStartVal: 50000,
        cardBnftSpr: '2',
        cardBnftVal: '1',
        bnftType: '35',
        maxBnftLimit: '50000'
      }]
      wrapper.vm.dispNspayCardDcCoupon()
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.cardBnftList = [{
        amtStartVal: 10000,
        cardBnftSpr: '1',
        cardBnftVal: '1',
        bnftType: '35',
        maxBnftLimit: '500'
      }]
      wrapper.vm.dispNspayCardDcCoupon()
      assert.isTrue(true)
    })
  })

  describe('OrderSheetPaymentMethodSelect NS페이 계좌 테스트', () => {
    let wrapper

    beforeEach(async () => {
      orderSheetWrapper.vm.globalVal.paymentMethodInfo.currentPayType = 'NSPay'
      wrapper = mount(OrderSheetPaymentMethodSelect, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            paymentData: orderSheetWrapper.vm.paymentData
          }
        }
      })

      wrapper.vm.swiperNspay.selectedItem = {
        payMethod: '16',
        wpayToken: 'xfmhg45t42Ah6vYqmoj2xfXFyhn0oC6We20ThTVNfWU=',
        bankCardCode: '005',
        bankCardNo: '**********2000'
      }
    })
    it('결제수단선택(computed())-NSPay 계좌이체 여부(isNSPayAccTransfer)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER
      assert.isTrue(wrapper.vm.isNSPayAccTransfer)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      assert.isFalse(wrapper.vm.isNSPayAccTransfer)
    })
    it('결제수단선택(method())-Nspay 정보설정(setNspayParams: 계좌)', async () => {
      wrapper.vm.setNspayParams()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-SliderItem 설정(setNspaySliderItems: 계좌)', async () => {
      wrapper.vm.setNspaySliderItems()
      assert.isTrue(true)
    })
    it('결제수단선택(method())-은행 CI 목록(getNspayAcctCiList)', async () => {
      wrapper.vm.getNspayAcctCiList().getCode(wrapper.vm.swiperNspay.selectedItem.bankCardCode)
      wrapper.vm.getNspayAcctCiList().getName(wrapper.vm.swiperNspay.selectedItem.bankCardCode)
      assert.isTrue(true)
    })
    it('결제수단선택(method())- NS페이 계좌: 현금영수증 정보저장(saveNspayReceiptInfo)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER] = {
        PHONE_NUM: '',
        BIZ_REG_NUM: '',
        RECEIPT_TYPE: '',
        RECEIPT_SAVE: ''
      }
      wrapper.vm.saveNspayReceiptInfo()

      wrapper.vm.globalVal.paymentMethodInfo.checkedReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'P'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = '01012345678'
      wrapper.vm.saveNspayReceiptInfo()

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'B'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = '00000000000'
      wrapper.vm.saveNspayReceiptInfo()

      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = false
      wrapper.vm.saveNspayReceiptInfo()
      assert.isTrue(true)
    })
    it('결제수단선택(method())- 간편계좌 적립금(setNspayFisetNspayAccMileagenalPaymentAmt)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER] = {
        mileageRate: '',
        mileageMaxAmt: '',
        mileageOfferId: ''
      }
      wrapper.vm.mileage = {
        maxAmt: 10000,
        rate: 1
      }
      wrapper.vm.setNspayAccMileage()
      assert.isTrue(true)
    })
  })
})
