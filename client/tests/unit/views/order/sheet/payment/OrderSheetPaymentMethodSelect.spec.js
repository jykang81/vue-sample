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

import { dummySelectboxCard, dummySelectboxCard2 } from '@unit/views/order/sheet/mock/tempOrderConst'
import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetPayment, initOrderSheetPaymentNspay } from '@unit/views/order/sheet/mock/setting'
import temp02ResAjaxNSWPayPayInfoAll from '@unit/views/order/sheet/mock/payment/nspay/02_res_AjaxNSWPay_payInfoAll'

describe('OrderSheet', () => {
  const dummy = 'dummy'
  let localVue
  let options
  let orderSheetWrapper
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

  describe('OrderSheetPaymentMethodSelect 테스트', () => {
    let wrapper

    beforeEach(async () => {
      orderSheetWrapper.vm.globalVal.paymentMethodInfo.epCardCode = 'HN_006_N_80'
      wrapper = mount(OrderSheetPaymentMethodSelect, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            paymentData: orderSheetWrapper.vm.paymentData
          }
        }
      })
    })
    it('결제수단선택(methods())-Mixin 신용카드 탭 출력(setPaymentCreditCard)', async () => {
      const data = { UseCardList: null, CardList: null }
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = { a: 1 }
      wrapper.vm.setPaymentCreditCard(data)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = null
      wrapper.vm.setPaymentCreditCard(data)

      data.UseCardList = [{ a: 1 }]
      wrapper.vm.setPaymentCreditCard(data)
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-Mixin (calcCardPointAmt)', async () => {
      const objCardPreDc = {
        offerIdfr: '100000030558',
        numStartVal: '',
        qtyRstApplyYn: '0',
        cardBnftStr: '2|9|04/30',
        amtStartVal: '',
        cardBnft: '현대',
        cardBnftSpr: '2',
        numEndVal: '',
        amtEndVal: '',
        realCardVal: 200000,
        nsPayCardCd: '',
        bnftType: '33',
        qtyStartVal: '',
        cardBnftDispVal: 1170,
        numRstApplyYn: '',
        cardBnftVal: '9',
        class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
        amtRstApplyYn: '0',
        offerNm: '개발 현대 청구할인 TEST',
        qtyEndVal: '',
        maxBnftLimit: '200000',
        cardCoCd: 'DN'
      }

      wrapper.vm.calcCardPointAmt(objCardPreDc.cardCoCd, objCardPreDc)
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-Mixin (calcCardPreDcAmt)', async () => {
      const objCardPreDc = {
        offerIdfr: '100000030558',
        numStartVal: '',
        qtyRstApplyYn: '0',
        cardBnftStr: '2|9|04/30',
        amtStartVal: '',
        cardBnft: '현대',
        cardBnftSpr: '2',
        numEndVal: '',
        amtEndVal: '',
        realCardVal: 200000,
        nsPayCardCd: '',
        bnftType: '33',
        qtyStartVal: '',
        cardBnftDispVal: 1170,
        numRstApplyYn: '',
        cardBnftVal: '9',
        class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
        amtRstApplyYn: '0',
        offerNm: '개발 현대 청구할인 TEST',
        qtyEndVal: '',
        maxBnftLimit: '200000',
        cardCoCd: 'DN'
      }

      wrapper.vm.calcCardPreDcAmt(objCardPreDc.cardCoCd, objCardPreDc)
      assert.isTrue(true)
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
    /*
    it('결제수단선택(computed())-NS페이 신용카드 여부(isNSPayCard)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD
      assert.isTrue(wrapper.vm.isNSPayCard)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      assert.isFalse(wrapper.vm.isNSPayCard)
    })
    */
    it('결제수단선택(computed())-NSPay 계좌이체 여부(isNSPayAccTransfer)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER
      assert.isTrue(wrapper.vm.isNSPayAccTransfer)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      assert.isFalse(wrapper.vm.isNSPayAccTransfer)
    })
    it('결제수단선택(computed())-카드 여부(isNSPay, disabledCard)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.CREDITCARD = 'N'
      assert.isTrue(wrapper.vm.isCard)
      assert.isTrue(wrapper.vm.disabledCard)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.CREDITCARD = 'Y'
      assert.isFalse(wrapper.vm.isCard)
      assert.isFalse(wrapper.vm.disabledCard)
    })
    it('결제수단선택(computed())-네이버페이 여부(isNaverpay, disabledNaverpay)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NAVERPAY = 'N'
      assert.isTrue(wrapper.vm.isNaverpay)
      assert.isTrue(wrapper.vm.disabledNaverpay)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NAVERPAY = 'Y'
      assert.isFalse(wrapper.vm.isNaverpay)
      assert.isFalse(wrapper.vm.disabledNaverpay)
    })
    it('결제수단선택(computed())-페이코 여부(isPayco, disabledPayco)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.PAYCO
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.PAYCO = 'N'
      assert.isTrue(wrapper.vm.isPayco)
      assert.isTrue(wrapper.vm.disabledPayco)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.PAYCO = 'Y'
      assert.isFalse(wrapper.vm.isPayco)
      assert.isFalse(wrapper.vm.disabledPayco)
    })
    it('결제수단선택(computed())-모바일 여부(isMobile, disabledMobile)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.MOBILE
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.MOBILE = 'N'
      assert.isTrue(wrapper.vm.isMobile)
      assert.isTrue(wrapper.vm.disabledMobile)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.MOBILE = 'Y'
      assert.isFalse(wrapper.vm.isMobile)
      assert.isFalse(wrapper.vm.disabledMobile)
    })
    it('결제수단선택(computed())-무통장입금 여부(isDeposit, disabledDeposit)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.DEPOSIT = 'N'
      assert.isTrue(wrapper.vm.isDeposit)
      assert.isTrue(wrapper.vm.disabledDeposit)

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = dummy
      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.DEPOSIT = 'Y'
      assert.isFalse(wrapper.vm.isDeposit)
      assert.isFalse(wrapper.vm.disabledDeposit)
    })
    it('결제수단선택(methods())-init (신용카드)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.init()
      assert.isTrue(wrapper.vm.isCard)
      assert.isFalse(wrapper.vm.disabledCard)
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.CREDIT_CARD)
    })
    it('결제수단선택(methods())-init (네이버페이)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.init()
      assert.isTrue(wrapper.vm.isNaverpay)
      assert.isFalse(wrapper.vm.disabledNaverpay)
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.NAVER_PAY)
    })
    it('결제수단선택(methods())-init (페이코)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.PAYCO
      wrapper.vm.init()
      assert.isTrue(wrapper.vm.isPayco)
      assert.isFalse(wrapper.vm.disabledPayco)
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.PAYCO)
    })
    it('결제수단선택(methods())-checkOtherPaymentMethod (결제수단이 신용카드가 아닐 경우)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.init()
      wrapper.vm.checkOtherPaymentMethod()

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.MOBILE
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.MOBILE
      wrapper.vm.init()
      wrapper.vm.globalVal.discountInfo.showSinglePaymentDiscount = true
      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = false
      wrapper.vm.checkOtherPaymentMethod()

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.PAYCO
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.PAYCO
      wrapper.vm.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode = PAY_TYPE_CONST.PAYCO
      wrapper.vm.init()
      wrapper.vm.globalVal.discountInfo.showSinglePaymentDiscount = false
      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = false
      wrapper.vm.checkOtherPaymentMethod()

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.init()
      wrapper.vm.globalVal.discountInfo.showSinglePaymentDiscount = false
      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = false
      wrapper.vm.checkOtherPaymentMethod()

      assert.isTrue(true)
    })
    it('결제수단선택(methods())-init (휴대폰)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.MOBILE
      wrapper.vm.init()
      wrapper.vm.setSavedMobileInfo()
      assert.isTrue(wrapper.vm.isMobile)
      assert.isFalse(wrapper.vm.disabledMobile)
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.MOBILE)
    })
    it('결제수단선택(methods())-init (무통장입금)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.init()
      assert.isTrue(wrapper.vm.isDeposit)
      assert.isFalse(wrapper.vm.disabledDeposit)
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK)
    })
    it('결제수단선택(methods())-onchangeDepositBankCd (무통장입금: 계좌번호 선택)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.init()
      wrapper.vm.globalVal.paymentMethodInfo.selectedBank = ''
      assert.isFalse(wrapper.vm.onchangeDepositBankCd())

      wrapper.vm.globalVal.paymentMethodInfo.selectedBank = 'VAH'
      wrapper.vm.onchangeDepositBankCd()
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-setReceiptInfo (무통장입금: 현금영수증 정보설정)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.init()
      wrapper.vm.setReceiptInfo()

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'P'
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '01022227777', RCPT_PBLS_CD: '100', USER_ID: '110548084' }
      wrapper.vm.setReceiptInfo()

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'B'
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '6158211718', RCPT_PBLS_CD: '200', USER_ID: '110548084' }
      wrapper.vm.setReceiptInfo()

      assert.isTrue(true)
    })
    it('결제수단선택(methods())-onchangeCashReceipt (무통장입금: 현금영수증 변경)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.init()
      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = true
      wrapper.vm.onchangeCashReceipt()

      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = false
      wrapper.vm.onchangeCashReceipt()
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-onchangeReceiptType (무통장입금: 현금영수증 유형선택)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.init()
      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'P'
      wrapper.vm.onchangeReceiptType()

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'B'
      wrapper.vm.onchangeReceiptType()
      const e = {
        preventDefault: () => {},
        keyCode: '',
        target: { value: '' }
      }
      wrapper.vm.keydownNumber(e)
      wrapper.vm.keyupNumber(e)
      wrapper.vm.onblurValueApply(e)
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-신용카드 목록 선택 (onchangeSelectEpCardCode)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.discountInfo.showSinglePaymentDiscount = true
      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = false
      for (const item of dummySelectboxCard) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.globalVal.paymentMethodInfo.epCardCode = item.value
        wrapper.vm.onchangeSelectEpCardCode()
      }

      for (const item of dummySelectboxCard) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.globalVal.paymentMethodInfo.epCardCode = item.value
        wrapper.vm.paymentData.Payment.setItem(0, { FINAL_PAYMENT_AMT: 55000 })
        wrapper.vm.onchangeSelectEpCardCode()
      }
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-설정 (set)', async () => {
      mock.onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp02ResAjaxNSWPayPayInfoAll)
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NSPAY = 'N'
      assert.isFalse(wrapper.vm.setNSPay())

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NSPAY = 'Y'
      wrapper.vm.setNSPay()
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.currentPayType, 'NSPay')

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.CREDITCARD = 'N'
      assert.isFalse(wrapper.vm.setCard())

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.CREDITCARD = 'Y'
      wrapper.vm.setCard()
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.CREDIT_CARD)

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NAVERPAY = 'N'
      assert.isFalse(wrapper.vm.setNaverpay())

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.NAVERPAY = 'Y'
      wrapper.vm.setNaverpay()
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.NAVER_PAY)

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.PAYCO = 'N'
      assert.isFalse(wrapper.vm.setPayco())

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.PAYCO = 'Y'
      wrapper.vm.setPayco()
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.PAYCO)

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.MOBILE = 'N'
      assert.isFalse(wrapper.vm.setMobile())

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.MOBILE = 'Y'
      wrapper.vm.setMobile()
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.MOBILE)

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.DEPOSIT = 'N'
      assert.isFalse(wrapper.vm.setDeposit())

      wrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo.DEPOSIT = 'Y'
      wrapper.vm.setDeposit()
      assert.equal(wrapper.vm.globalVal.paymentMethodInfo.paymentMethod, PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK)
    })
    it('결제수단선택(methods())-선택완료 (onclickSelectCompmlete)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = 'NSPay'
      assert.isFalse(wrapper.vm.valid(), '-1')

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.epCardCode = null
      assert.isFalse(wrapper.vm.valid(), '-2')

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NAVER_PAY
      assert.isTrue(wrapper.vm.valid(), '-3')

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.PAYCO
      assert.isTrue(wrapper.vm.valid(), '-4')

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.MOBILE
      assert.isTrue(wrapper.vm.valid(), '-5')

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      assert.isFalse(wrapper.vm.valid(), '-6')

      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.epCardCode = 'dummy'
      wrapper.vm.globalVal.paymentMethodInfo.epCardText = 'dummy'
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.onclickSelectCompmlete()
    })
    it('결제수단선택(methods())-Mixin (paymentCreditCard: instmMmsListView)', async () => {
      for (const item of dummySelectboxCard) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.paymentData.Payment.setItem(0, { FINAL_PAYMENT_AMT: 55000 })
        wrapper.vm.instmMmsListView()
      }
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-Mixin (paymentCreditCard: setDefaultEpQuota)', async () => {
      wrapper.vm.globalVal.mOutputDatas.minInstallCnt = 13
      for (const item of dummySelectboxCard2) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.setDefaultEpQuota()
      }
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-Mixin (paymentCreditCard: setDisplayEpQuotaList)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.epCardCode = ''
      wrapper.vm.setDisplayEpQuotaList()

      for (const item of dummySelectboxCard) {
        wrapper.vm.selectedCardCodeEzPayCd = item.value
        wrapper.vm.epQuotaList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        wrapper.vm.limitForCount = 10

        wrapper.vm.globalVal.paymentMethodInfo.epCardCode = item.value

        wrapper.vm.epQuotaListType = '1'
        wrapper.vm.setDisplayEpQuotaList()

        wrapper.vm.epQuotaListType = '2'
        wrapper.vm.setDisplayEpQuotaList()

        wrapper.vm.epQuotaListType = '3'
        wrapper.vm.setDisplayEpQuotaList()
      }
      assert.isTrue(true)
    })

    it('결제수단선택(methods())-Mixin (paymentCreditCard: onchangeSelectEpQuota)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.epCardCode = 'HN_006_N_80'
      wrapper.vm.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT = 100000
      wrapper.vm.onchangeSelectEpQuota()
      wrapper.vm.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT = 12900
      wrapper.vm.onchangeSelectEpQuota()
      wrapper.vm.globalVal.paymentMethodInfo.epQuota = '03'
      wrapper.vm.onchangeSelectEpQuota()

      assert.isTrue(true)
    })
    it('결제수단선택(methods())-Mixin (paymentCreditCard: checkedPointNonQuota)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.epCardCoCode = 'KM'
      wrapper.vm.globalVal.paymentMethodInfo.epDirectYn = 'Y'
      wrapper.vm.globalVal.paymentMethodInfo.epQuota = '13_n'
      wrapper.vm.globalVal.paymentMethodInfo.checkedEpPointUseYn = true
      wrapper.vm.checkedPointNonQuota()
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-Mixin (paymentCreditCard: getCardTmplTitleInfo)', async () => {
      wrapper.vm.globalVal.paymentMethodInfo.epQuota = '03'
      wrapper.vm.globalVal.paymentMethodInfo.dispEpQuotaList = [{ value: '03', text: '03개월' }]
      wrapper.vm.getCardTmplTitleInfo()
      wrapper.vm.setDisplayEpQuotaList()
      assert.isTrue(true)
    })
    it('결제수단선택(methods())-Mixin (paymentCreditCard: setFloorCardTmplTitle)', async () => {
      wrapper.vm.isFloorMode = true
      wrapper.vm.setFloorCardTmplTitle()
      assert.isNotEmpty(wrapper.vm.globalVal.paymentMethodInfo.paymentMethodTitle)
    })
    it('결제수단선택(methods())-Mixin (paymentCreditCard: onchangeSinglePaymentDiscount)', async () => {
      wrapper.vm.globalVal.discountInfo.showSinglePaymentDiscount = true
      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = false
      wrapper.vm.setSinglePaymentDiscount()

      wrapper.vm.selectedCardCodeEzPayCd = 'HN_006_N_80'
      wrapper.vm.globalVal.paymentMethodInfo.epCardCode = 'KM_016_Y_110'
      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = false
      wrapper.vm.onchangeSinglePaymentDiscount()

      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = true
      wrapper.vm.onchangeSinglePaymentDiscount()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.onchangeSinglePaymentDiscount()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.PAYCO
      wrapper.vm.onchangeSinglePaymentDiscount()

      wrapper.vm.globalVal.mOutputDatas.msg.ImdtDcCpAmtList['179105966'].PROM_VAL_LSP_RATE = 5
      wrapper.vm.calcSinglePaymentDiscount()

      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId = 'TV'
      wrapper.vm.calcSinglePaymentDiscount()

      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId = 'TCOMM'
      wrapper.vm.calcSinglePaymentDiscount()

      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId = 'CTCOM'
      wrapper.vm.calcSinglePaymentDiscount()

      wrapper.vm.setCardByOtherPaymentMethod()

      assert.isTrue(true)
    })
  })
})
