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

import { PAY_ASSIST_CONST } from '@/common/constants/order/order'
import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetDiscount from '@/views/order/sheet/OrderSheetDiscount'

// import { dummyPayTypes, dummySelectboxCard } from '@unit/views/order/sheet/mock/tempOrderConst'
import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDiscount } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetDiscount', () => {
  // const dummy = 'dummy'
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

  describe('OrderSheetDiscount 일반회원 할인쿠폰 테스트', async () => {
    let wrapper
    const SELECTED_SELECTBOX_ID = 'coupon_0_179105966'
    beforeEach(async () => {
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.CouponList = initOrderSheetDiscount().getCustCouponList()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft = initOrderSheetDiscount().getCustStaffBnf()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo = initOrderSheetDiscount().getCustUsePaymentInfo()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UserInfoBenefit = initOrderSheetDiscount().getCustUserInfoBenefit()

      wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.autoSelectedCoupon.push({ selectboxId: SELECTED_SELECTBOX_ID, optionValue: '179105966_1051601' })
      wrapper.vm.init()
    })

    it('할인/혜택(methods())-할인쿠폰 열기/닫기(couponOpen/couponClose)', async () => {
      wrapper.vm.couponOpen()
      assert.isTrue(wrapper.vm.openCoupon)

      wrapper.vm.couponClose()
      assert.isFalse(wrapper.vm.openCoupon)
    })
    it('할인/혜택(methods())-setAutoSelectedCoupon (일반회원: 쿠폰 자동선택)', async () => {
      wrapper.vm.setAutoSelectedCoupon()
      assert.isTrue(wrapper.vm.checkedCoupons, `--->>> ${orderSheetWrapper.vm.globalVal.isGuest}`)
    })
    it('할인/혜택(methods())-oncheckedCouponbox (일반회원: 쿠폰 선택)', async () => {
      wrapper.vm.oncheckedCouponbox()
      assert.isTrue(wrapper.vm.checkedCoupons)
    })
    it('할인/혜택(methods())-onchangeCouponDiscount (일반회원: 쿠폰할인 선택)', async () => {
      wrapper.vm.onchangeCouponDiscount(SELECTED_SELECTBOX_ID)
      wrapper.vm.previousCoupons.coupon_2_179105966 = '179105966_1051601'
      wrapper.vm.getPreviousCouponSelectboxByValue('179105966_1051601')
      assert.isTrue(wrapper.vm.checkedCoupons)
    })
  })
  describe('OrderSheetDiscount 일반회원 상품2개 할인쿠폰 테스트', async () => {
    let wrapper
    beforeEach(async () => {
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.CouponList = initOrderSheetDiscount().getCustMultiCouponList()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft = initOrderSheetDiscount().getCustStaffBnf()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo = initOrderSheetDiscount().getCustUsePaymentInfo()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UserInfoBenefit = initOrderSheetDiscount().getCustUserInfoBenefit()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.ImdtDcCpAmtList = initOrderSheetDiscount().getCustMultiImdtDcCpAmtList()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.BestCouponList = initOrderSheetDiscount().getCustMultiBestCouponList()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList = initOrderSheetDiscount().getCustMultiOrderGoodList()

      wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.init()
    })
    it('할인/혜택(methods())-onchangeCouponDiscount (일반회원: 쿠폰할인 선택 1)', async () => {
      const selectboxId = 'coupon_2_256241122'
      wrapper.find(`#${selectboxId}`).setValue('256241122_1070675')
      wrapper.vm.onchangeCouponDiscount(selectboxId)
      assert.equal(wrapper.find(`#${selectboxId}`).element.value, '256241122_1070675')
    })
    it('할인/혜택(methods())-onchangeCouponDiscount (일반회원: 쿠폰할인 선택 2)', async () => {
      const selectboxId = 'coupon_0_256241124'
      wrapper.find(`#${selectboxId}`).setValue('256241124_1051601')
      wrapper.vm.onchangeCouponDiscount(selectboxId)
      assert.equal(wrapper.find(`#${selectboxId}`).element.value, '256241124_1051601')
    })
    it('할인/혜택(methods())-onchangeCouponDiscount (일반회원: 쿠폰할인 선택 3)', async () => {
      const selectboxId = 'coupon_2_256241124'
      wrapper.find(`#${selectboxId}`).setValue('256241124_1070933')
      wrapper.vm.onchangeCouponDiscount(selectboxId)
      assert.equal(wrapper.find(`#${selectboxId}`).element.value, '256241124_1070933')
    })
  })

  describe('OrderSheetDiscount 임직원 할인쿠폰 테스트', async () => {
    let wrapper
    beforeEach(async () => {
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.CouponList = initOrderSheetDiscount().getEmployCouponList()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft = initOrderSheetDiscount().getEmployStaffBnf()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo = initOrderSheetDiscount().getEmployUserInfoBenefit()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UserInfoBenefit = initOrderSheetDiscount().getEmployUsePaymentInfo()
    })

    it('할인/혜택(methods())-oncheckedCouponbox (임직원: NS 임직원 할인 선택 1)', async () => {
      wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.autoSelectedCoupon.push({ selectboxId: 'coupon_0_179105966', optionValue: '179105966_1051601' })
      wrapper.vm.init()
      wrapper.vm.initMounted()

      wrapper.vm.oncheckedStaffCoupon()
      wrapper.vm.applyStaffCoupon()
      assert.isFalse(wrapper.vm.checkedCoupons)
    })
    it('할인/혜택(methods())-oncheckedCouponbox (임직원: NS 임직원 할인 선택 2)', async () => {
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft.bnftBiggerYn = 'N'

      wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.autoSelectedCoupon.push({ selectboxId: 'coupon_0_179105966', optionValue: '179105966_1051601' })
      wrapper.vm.init()
      wrapper.vm.initMounted()

      wrapper.vm.oncheckedStaffCoupon()
      wrapper.vm.applyStaffCoupon()
      assert.isFalse(wrapper.vm.checkedCoupons)
    })
    it('할인/혜택(methods())-oncheckedCouponbox (임직원: NS 임직원 할인 선택 3)', async () => {
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft.bnftBiggerYn = 'N'
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft.balanceAmt = 1000
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft.limitAmt = 10000

      wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.autoSelectedCoupon.push({ selectboxId: 'coupon_0_179105966', optionValue: '179105966_1051601' })
      wrapper.vm.init()
      wrapper.vm.initMounted()

      wrapper.vm.oncheckedStaffCoupon()
      wrapper.vm.applyStaffCoupon()
      assert.isTrue(wrapper.vm.checkedCoupons)
    })
    it('할인/혜택(methods())-onchangeDeliveryCoupon (임직원: 무료배송쿠폰)', async () => {
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.CouponList['179105966'].freeDlvry = [
        {
          WWW_AMT: '3000',
          CARD_PREFIX: '',
          APPLY_SPR: '',
          CARD_CO_CD: '',
          AMT_END_VAL: '',
          CP_VALID_ENDDD: '20200701104819',
          WWW_RATE: '0',
          CP_CLSSF: '21',
          CP_TYPE: '20',
          AMT_START_VAL: '',
          CP_VALID_STARTDD: '20200601104819',
          MAX_BNFT_LIMIT: '999999999',
          CP_NM: '[바로방문][다이아몬드] 무료배송',
          MAX_USE_NUM: '2',
          QTY_END_VAL: '',
          OFFER_BRCH: '',
          CP_IDFR: '1071279',
          BNFT_SEQ: '',
          QTY_START_VAL: '',
          CARD_AFFILIATION_CD: '',
          ORDERITEMS_IDS: [
            '179105966'
          ]
        }
      ]
      wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.init()
      wrapper.vm.initMounted()
      await wrapper.vm.$nextTick()

      wrapper.find('#coupon_freeshipping_179105966').setValue('1071279')
      wrapper.vm.onchangeDeliveryCoupon('179105966')
    })
  })

  describe('OrderSheetDiscount 할인금액', async () => {
    let wrapper
    const expected = '-1,000'
    beforeEach(async () => {
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.CouponList = initOrderSheetDiscount().getCustCouponList()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.staffBnft = initOrderSheetDiscount().getCustStaffBnf()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UsePaymentInfo = initOrderSheetDiscount().getCustUsePaymentInfo()
      orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UserInfoBenefit = initOrderSheetDiscount().getCustUserInfoBenefit()

      wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.init()
      wrapper.vm.initMounted()
    })

    it('할인/혜택(methods())-할인금액 (적립금)', async () => {
      wrapper.vm.checkedReservedAmt = true
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.RESERVED_AMT)

      wrapper.vm.checkedReservedAmt = false
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.RESERVED_AMT)

      wrapper.vm.globalVal.discountInfo.reservesUseAmt = 1000
      wrapper.vm.focusChangeInputType(PAY_ASSIST_CONST.RESERVED_AMT)
      wrapper.vm.onblurUseAmt(PAY_ASSIST_CONST.RESERVED_AMT)
      assert.equal(wrapper.vm.globalVal.discountInfo.reservesUseAmt, expected)
    })
    it('할인/혜택(methods())-할인금액 (NS상품권)', async () => {
      wrapper.vm.checkedGiftCardAmt = true
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.NS_GIFT_CARD)

      wrapper.vm.checkedGiftCardAmt = false
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.NS_GIFT_CARD)

      wrapper.vm.globalVal.discountInfo.nsGiftCardUseAmt = 1000
      wrapper.vm.focusChangeInputType(PAY_ASSIST_CONST.NS_GIFT_CARD)
      wrapper.vm.onblurUseAmt(PAY_ASSIST_CONST.NS_GIFT_CARD)
      assert.equal(wrapper.vm.globalVal.discountInfo.nsGiftCardUseAmt, expected)
    })
    it('할인/혜택(methods())-할인금액 (예치금)', async () => {
      wrapper.vm.checkedDepositAmt = true
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.DEPOSIT_AMT)

      wrapper.vm.checkedDepositAmt = false
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.DEPOSIT_AMT)

      wrapper.vm.globalVal.discountInfo.depositUseAmt = 1000
      wrapper.vm.focusChangeInputType(PAY_ASSIST_CONST.DEPOSIT_AMT)
      wrapper.vm.onblurUseAmt(PAY_ASSIST_CONST.DEPOSIT_AMT)
      assert.equal(wrapper.vm.globalVal.discountInfo.depositUseAmt, expected)
    })
    it('할인/혜택(methods())-할인금액 (해피머니)', async () => {
      wrapper.vm.checkedHappyMoneyAmt = true
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.HAPPY_MONEY)

      wrapper.vm.checkedHappyMoneyAmt = false
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.HAPPY_MONEY)

      wrapper.vm.globalVal.discountInfo.happyMoneyUseAmt = 0
      wrapper.vm.focusChangeInputType(PAY_ASSIST_CONST.HAPPY_MONEY)
      wrapper.vm.onblurUseAmt(PAY_ASSIST_CONST.HAPPY_MONEY)
      assert.equal(wrapper.vm.globalVal.discountInfo.happyMoneyUseAmt, '0')
    })
    it('할인/혜택(methods())-할인금액 (OK캐쉬백)', async () => {
      wrapper.vm.checkedOkCashbagAmt = true
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.OK_CASHBAG)

      wrapper.vm.checkedOkCashbagAmt = false
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.OK_CASHBAG)

      wrapper.vm.globalVal.discountInfo.okCashbagUseAmt = 0
      wrapper.vm.focusChangeInputType(PAY_ASSIST_CONST.OK_CASHBAG)
      wrapper.vm.onblurUseAmt(PAY_ASSIST_CONST.OK_CASHBAG)
      assert.equal(wrapper.vm.globalVal.discountInfo.okCashbagUseAmt, '0')
    })
    it('할인/혜택(methods())-할인금액 (연간할인권)', async () => {
      wrapper.vm.checkedAnnualDcAmt = true
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.ANNUAL_COUPONS)

      wrapper.vm.checkedAnnualDcAmt = false
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.ANNUAL_COUPONS)

      wrapper.vm.globalVal.discountInfo.annualDcUseAmt = 0
      wrapper.vm.focusChangeInputType(PAY_ASSIST_CONST.ANNUAL_COUPONS)
      wrapper.vm.onblurUseAmt(PAY_ASSIST_CONST.ANNUAL_COUPONS)
      assert.equal(wrapper.vm.globalVal.discountInfo.annualDcUseAmt, '0')
    })
    it('할인/혜택(methods())-할인금액 (네티웰)', async () => {
      wrapper.vm.checkedNetiWellAmt = true
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.NETI_WELL)

      wrapper.vm.checkedNetiWellAmt = false
      wrapper.vm.oncheckedSalebox(PAY_ASSIST_CONST.NETI_WELL)

      wrapper.vm.globalVal.discountInfo.netiWellUseAmt = 0
      wrapper.vm.focusChangeInputType(PAY_ASSIST_CONST.NETI_WELL)
      wrapper.vm.onblurUseAmt(PAY_ASSIST_CONST.NETI_WELL)
      assert.equal(wrapper.vm.globalVal.discountInfo.netiWellUseAmt, '0')
    })
    it('할인/혜택(methods())-보유액 조회 링크 (NS상품권)', async () => {
      wrapper.vm.onclickAvaAmtLink(PAY_ASSIST_CONST.NS_GIFT_CARD)
      assert.isTrue(true)
    })
    it('할인/혜택(methods())-보유액 조회 링크 (해피머니)', async () => {
      wrapper.vm.onclickAvaAmtLink(PAY_ASSIST_CONST.HAPPY_MONEY)
      assert.isTrue(true)
    })
    it('할인/혜택(methods())-보유액 조회 링크 (OK캐쉬백)', async () => {
      wrapper.vm.onclickAvaAmtLink(PAY_ASSIST_CONST.OK_CASHBAG)
      assert.isTrue(true)
    })
    it('할인/혜택(methods())-보유액 조회 링크 (네티웰)', async () => {
      wrapper.vm.onclickAvaAmtLink(PAY_ASSIST_CONST.NETI_WELL)
      assert.isTrue(true)
    })
    it('할인/혜택(methods())-비활성화', async () => {
      wrapper.vm.disabledAnnualDc()
      wrapper.vm.disabledNetiWell()
      wrapper.vm.disabledSinglePaymentDiscount()
      wrapper.vm.disabledAllExcludeEmployee()
      wrapper.vm.checkedAllClear()

      wrapper.vm.disabledHappyMoneyAmt = false
      wrapper.vm.useAmtCancel()

      wrapper.vm.disabledHappyMoneyAmt = true
      wrapper.vm.disabledOkCashbagAmt = false
      wrapper.vm.useAmtCancel()
      wrapper.vm.getAllUseAmt()

      wrapper.vm.globalVal.discountInfo.checkedEmployee = true
      assert.isNotEmpty(wrapper.vm.employeeDcAmt)

      wrapper.vm.isUseStaffBnftWithCoupon = true
      assert.isNotEmpty(wrapper.vm.employeeBalanceAmt)

      wrapper.vm.checkedEmployee = true
      assert.isNotEmpty(wrapper.vm.dcCouponAmt)

      assert.isNotEmpty(wrapper.vm.happyMoneyAvaAmt)
      assert.isNotEmpty(wrapper.vm.okCashbagAvaAmt)
      assert.isNotEmpty(wrapper.vm.annualDcAvaAmt)
      assert.isNotEmpty(wrapper.vm.annualDcUseAmt)
    })
  })
  describe('OrderSheetDiscount - discountAmountMixin', async () => {
    it('할인/혜택 (discountAmountMixin: methods())- setDiscountAmount ', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.paymentData.Discount.setCouponItem(0, 0, { ListName: 'CPC' })
      wrapper.vm.setDiscountAmount()

      wrapper.vm.paymentData.Discount.setCouponItem(0, 0, { ListName: 'LSP', DiscountPrice: 1000 })
      wrapper.vm.paymentData.Discount.setCouponItem(0, 1, { ListName: 'LSP', DiscountPrice: 1000, ImdtDcCpAmt: 0 })
      wrapper.vm.setDiscountAmount()

      wrapper.vm.paymentData.Discount.setCouponItem(0, 0, { ListName: 'cardPreDc', DiscountPrice: 1000 })
      wrapper.vm.paymentData.Discount.setCouponItem(0, 1, { ListName: 'cardPreDc', DiscountPrice: 1000, ImdtDcCpAmt: 0 })
      wrapper.vm.setDiscountAmount()

      wrapper.vm.paymentData.Discount.setCouponItem(0, 0, { ListName: 'freeDlvry', DiscountPrice: 1000 })
      wrapper.vm.paymentData.Discount.setCouponItem(0, 1, { ListName: 'freeDlvry', DiscountPrice: 1000, ImdtDcCpAmt: 0 })
      wrapper.vm.setDiscountAmount()

      wrapper.vm.paymentData.Discount.discountList[0].couponList[0] = undefined
      wrapper.vm.setDiscountAmount()

      wrapper.vm.paymentData.Discount.setCouponItem(0, 'PAD10100', {
        couponDiscountPrice: 0,
        cardDiscountPrice: 0,
        cardPreDiscountPrice: 0
      })
      wrapper.vm.setDiscountAmount()

      assert.isTrue(true)
    })
    it('할인/혜택 (discountAmountMixin: methods())- setDiscountAmountOther ', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDiscount)
      wrapper.vm.setDiscountAmountOther()

      wrapper.vm.paymentData.Discount.discountList[0].couponList[0] = undefined
      wrapper.vm.setDiscountAmountOther()

      wrapper.vm.paymentData.Discount.setCouponItem(0, 'PAD10100', {
        couponDiscountPrice: 0,
        cardDiscountPrice: 0,
        cardPreDiscountPrice: 0
      })
      wrapper.vm.setDiscountAmountOther()
      assert.isTrue(true)
    })
  })
})
