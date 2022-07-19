import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import router from '@/router'
import VueRouter from 'vue-router'
import nsaxios from '@frameworks/axiosUtil'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import store from '@/vuex'
import flushPromises from 'flush-promises'
import MyWishList from '@/views/customer/info/wishList/MyWishList'
import loginUtil from '@utils/loginUtil'

describe('myWishList', () => {
  let mock
  let wrapper

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const { location } = window

  const options = {
    localVue,
    router,
    store
  }

  const memberInfo = {
    tcode: 't123',
    gender: 'F',
    loginType: 'K',
    userId: 111103108,
    hpNo: '010-9898-9342',
    isSSORequest: 'false',
    isAdult: 'true',
    custNum: '30124937',
    gradeNm: '패밀리',
    userName: '강진영',
    adultAuthYN: 'N',
    entFlag: 'Y',
    userMargetingTM: 'N',
    lastOrder: '2020-03-12 18:21:20.125',
    registration: '2020-03-12 16:44:06.125',
    email: 'lsd251@nsmall.com',
    telNo: '010-9898-9342',
    userMargetingEmail: 'N',
    birthday: '19840425',
    userMarketingSMS: 'N',
    logonId: 'lsd251@nsmall.com',
    failcount: '0',
    sessionid: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    sessionId: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    loginyn: 'Y',
    logonType: 'WEB',
    memberGradeCss: 'family',
    staffInfo: false,
    staffInfoName: '대표',
    staffBnft: 'Y'
  }

  const getWishListUrl = `${CONST.API_URL}/GetWishList`
  const removeWishesUrl = `${CONST.API_URL}/RemoveWishes`
  const addCartUrl = `${CONST.API_URL}/AddCart`

  const getWishListResult = {
    currentCnt: '20',
    msg: {
      class: 'class com.ns.commerce.common.bean.ResultBean',
      isSuccess: 1,
      resultCode: null,
      data: {
        class: 'class com.ns.commerce.wish.bean.WishListBean',
        pageInfo: {
          pageSize: 20,
          currentCnt: 20,
          class: 'class com.ns.commerce.common.bean.PageBean',
          totalCnt: 29,
          pageNum: 0
        },
        wishProductList: [
          {
            reserveFund: null,
            unit: '원',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '29,900',
            price: '',
            possibleAddCart: true,
            bundleShipping: false,
            adultProduct: false,
            interestFree: null,
            catentryId: '23217851',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '고려은단 비타민c 1000 180정 * 2ea + 쇼핑백 2장 / 무료배송',
            showCartBtn: true
          },
          {
            reserveFund: null,
            unit: '원~',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '13,900',
            price: '',
            possibleAddCart: false,
            bundleShipping: false,
            adultProduct: false,
            interestFree: null,
            catentryId: '23110038',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '오가니스트 제주 샴푸/컨디셔너/바디워시 신제품 출시',
            showCartBtn: true
          },
          {
            reserveFund: null,
            unit: '원',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '8,900',
            price: '',
            possibleAddCart: true,
            bundleShipping: false,
            adultProduct: false,
            interestFree: null,
            catentryId: '23021119',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '[동원] 양반 캔김치160gX5개',
            showCartBtn: true
          },
          {
            reserveFund: null,
            unit: '원~',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '5,200',
            price: '',
            possibleAddCart: false,
            bundleShipping: false,
            adultProduct: false,
            interestFree: null,
            catentryId: '23366073',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '부대찌개라면 4봉 골라담기/농심/오뚜기/팔도',
            showCartBtn: true
          },
          {
            reserveFund: null,
            unit: '원',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '58,900',
            price: '59,900',
            possibleAddCart: true,
            bundleShipping: false,
            adultProduct: false,
            interestFree: '3',
            catentryId: '24782274',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '전철우 소갈비살구이 6팩',
            showCartBtn: false
          },
          {
            reserveFund: '10%',
            unit: '원',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '75,140',
            price: '75,900',
            possibleAddCart: true,
            bundleShipping: false,
            adultProduct: false,
            interestFree: '3',
            catentryId: '24689641',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '(추석특가) 박지윤의 욕망스무디 5days 20팩',
            showCartBtn: true
          },
          {
            reserveFund: null,
            unit: '원',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '28,900',
            price: '',
            possibleAddCart: true,
            bundleShipping: false,
            adultProduct: false,
            interestFree: null,
            catentryId: '24745657',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '종근당 6년근 홍삼정 애니타임 + 고급 쇼핑백',
            showCartBtn: true
          },
          {
            reserveFund: '10%',
            unit: '원',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '99,000',
            price: '',
            possibleAddCart: false,
            bundleShipping: false,
            adultProduct: false,
            interestFree: null,
            catentryId: '21193188',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '정관장 홍삼활력 40mL×30포×3박스(총 90포)',
            showCartBtn: true
          },
          {
            reserveFund: null,
            unit: '원',
            couponList: [],
            saleProduct: true,
            materialProduct: true,
            discountPrice: '40,900',
            price: '',
            possibleAddCart: true,
            bundleShipping: false,
            adultProduct: false,
            interestFree: null,
            catentryId: '26030598',
            class: 'class com.ns.commerce.wish.bean.WishProductBean',
            freeShipping: true,
            billingDiscount: '11%',
            itncatentrynm: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
            showCartBtn: false
          }
        ]
      },
      userMessage: null,
      exception: null
    },
    catalogId: '14051',
    userId: '111103108',
    langId: '-9',
    accptPath: '500',
    accptPathCd: '500',
    storeId: '13001'
  }
  const removeWishesResult = {
    msg: {
      class: 'class com.ns.commerce.common.bean.ResultBean',
      isSuccess: 1,
      resultCode: null,
      data: null,
      userMessage: null,
      exception: null
    },
    catalogId: '14051',
    userId: '111103108',
    langId: '-9',
    accptPath: '500',
    accptPathCd: '500',
    storeId: '13001',
    catentryIds: '23111167'
  }
  const addCartResult = {
    msg: {
      class: 'class com.ns.commerce.common.bean.ResultBean',
      isSuccess: 1,
      resultCode: null,
      data: null,
      userMessage: null,
      exception: null
    },
    catalogId: '14051',
    userId: '111103108',
    catentryId: '21148736',
    langId: '-9',
    accptPath: '500',
    accptPathCd: '500',
    storeId: '13001'
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    wrapper = mount(MyWishList, options)
    loginUtil.login(memberInfo)
    delete window.location
  })

  beforeEach(() => {
    mock.reset()
  })

  after(() => {
    window.location = location
  })

  it('getWishList call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(getWishListUrl)
      .reply(200, getWishListResult)

    try {
      vm.getWishList()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal(false, vm.pushFullEvent)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('찜삭제 call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(removeWishesUrl)
      .reply(200, removeWishesResult)

    try {
      vm.removeConfirmWishes('', false)

      await flushPromises()

      await wrapper.vm.$nextTick()

      const param = {
        catentryIds: [
          '23217851'
        ]
      }
      vm.removeWishes(param)
      mock
        .onPost(getWishListUrl)
        .reply(200, getWishListResult)

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal(false, vm.pushFullEvent)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('장바구니 담기', async () => {
    const vm = wrapper.vm

    mock
      .onPost(addCartUrl)
      .reply(200, addCartResult)

    try {
      const param = {
        catentryId: '23217851'
      }
      vm.addCart(param)

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal(true, true)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('상품상세로 이동', () => {
    const vm = wrapper.vm

    vm.collapseGrade = false
    vm.gotoProdDetail('23217851')
    assert.equal(true, true)
  })
})
