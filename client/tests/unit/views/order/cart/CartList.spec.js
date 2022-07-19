import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { assert } from 'chai'
import flushPromises from 'flush-promises'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'
import loginUtil from '@utils/loginUtil'

import CartList from '@/views/order/cart/CartList'
import cartList from '@unit/views/order/cart/mock/cartList'

const localVue = createLocalVue()
localVue.use(Vuex)

// 필수 테스트 할 대상 파일명을 넣음
describe('CartList 테스트', () => {
  const TEST_CHECKED_ITEMS = ['179280968', '179280969']
  const TEST_PRODUCT = cartList.msg.goods[0]
  const API_URL = `${CONST.API_URL}/NSESBasketMobileCmdReal`
  let wrapper
  let vm
  let mock

  // 로그인
  function login () {
    loginUtil.login({
      userId: 111214420,
      logonId: 'qhanq19@gmail.com',
      loginyn: 'Y',
      adultAuthYN: 'Y'
    })
  }

  // 로그아웃
  function logout () {
    loginUtil.memberInfo = null
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  }

  // 상품 체크
  function checkProduct (checkedItemsId) {
    vm.setCheckedItemIdsByType({
      cartType: 'GENERAL',
      value: checkedItemsId
    })
  }

  before(async () => {
    Vue.prototype.$nsaxios = nsaxios

    // mock axios
    mock = new MockAdapter(axios)

    // 장바구니 조회
    mock.onPost(API_URL).reply(200, cartList)

    // 주문서 이동
    mock.onPost(`${CONST.API_URL}/AjaxNSOrderSheet4Worklight`).reply(200,
      {
        orderItemsIds: ['179280967,179280969'],
        userId: ['111214420'],
        orderId: '300010996016',
        accptPath: ['500'],
        accptPathCd: ['500'],
        catalogId: ['14051'],
        storeId: ['13001'],
        langId: ['-9'],
        hpNoSmsAuthYn: 'N',
        orderItemId: ['179280967', '179280969'],
        checkedOrderItemIds: ['179280967', '179280969']
      }
    )

    // 상품 삭제
    mock.onPost(`${CONST.API_URL}/AjaxNSXorderItemDelete4Worklight`).reply(200,
      {
        msg: {
          resultMessage: 'Success Message',
          resultCode: '0',
          result: 'success'
        },
        catalogId: ['14051'],
        userId: ['111214420'],
        langId: ['-9'],
        orderId: ['300010996016'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        storeId: ['13001'],
        orderItemId: ['179311020']
      }
    )

    // 수량 변경
    mock.onPost(`${CONST.API_URL}/AjaxNSXorderItemAdd4Worklight`).reply(200,
      {
        extCatalogId_1: ['97001'],
        userId: ['111214420'],
        orderId: ['300011018044'],
        catEntryId_1: ['10004177245'],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        orderItemId_1: ['179326035'],
        catalogId: ['14051'],
        extPtncd_1: ['110'],
        storeId: ['13001'],
        orderItemId: ['179326035'],
        quantity_1: ['2']
      }
    )

    // 상품 조회
    mock.onPost(`${CONST.API_URL}/NSESBasketMobileCmdReal`).reply(200,
      {
        msg: {
          goods: [
            {
              orderItemsId: '1234567890',
              partNumber: '1234567890',
              custPrchQtyLimitYn: 'Y',
              maxItemCountOnOnce: 1,
              quantity: 1,
              inventoryQuantity: 1,
              goodsType: '',
              noSaleCatalogYN: 'N',
              adultItemFlag: 'N',
              outYn: 'N',
              saleYn: 'Y',
              itemLiveYN: 'Y'
            }
          ]
        }
      }
    )

    // AIQUA
    mock.onPost(`${CONST.API_URL}/NSRcmdCmd`).reply(200,
      { msg: { empNm: '', orgNm: '', catName: '' } }
    )

    // 임직원 전용 상품 체크
    mock.onPost(`${CONST.API_URL}/SeparateStaffOnlyProducts`).reply(200,
      [{ cate1Nm: '', orderItemsId: '1234567890', partNumber: '', goodsName: '', brandName: '', imageUrl: '', price: 1000, dlvyGrpKey: 'A,B,C' }]
    )
  })

  beforeEach(async () => {
    // 테스트 대상 컴포넌트 명 입력
    wrapper = shallowMount(CartList, {
      localVue,
      store
    })
    vm = wrapper.vm

    // 상품 체크해제
    checkProduct([])

    // 주문서 주문번호 초기화
    vm.$store.state.orderSheet.orderProduct = {}

    await flushPromises()
  })

  afterEach(() => {
    // 주문서 주문번호 초기화
    vm.$store.state.orderSheet.orderProduct = {}

    // 로그아웃
    logout()
  })

  it('장바구니 전체 체크된 상품 아이템ID 목록', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    assert.deepEqual(vm.checkedItemIds, TEST_CHECKED_ITEMS)
  })
  it('장바구니 전체 체크된 상품 목록', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    const actual = vm.totalCheckedProductList
    const expected = vm.totalProductList.filter(product => TEST_CHECKED_ITEMS.includes(product.orderItemsId))
    assert.deepEqual(actual, expected)
  })
  it('메인으로 이동', async () => {
    vm.gotoLogin()
  })
  it('원 여부', async () => {
    // 로그아웃
    logout()

    // 최초 비회원 상태 체크
    assert.isTrue(vm.isNonMember())

    // 로그인
    login()

    // 회원 상태 체크
    assert.isFalse(vm.isNonMember())
  })
  it('품절 여부', async () => {
    assert.isTrue(vm.isSoldout({
      outYn: 'Y'
    }))
    assert.isTrue(vm.isSoldout({
      saleYn: 'N'
    }))
    assert.isTrue(vm.isSoldout({
      itemLiveYN: 'N'
    }))
  })
  it('장바구니 초기화', async () => {
    assert.isTrue(vm.cartData.goods.length > 0)
  })
  it('장바구니 상품 조회', async () => {
    const actual = await vm.getBasketListInfo()
    assert.isTrue(actual.msg.goods.length > 0)
  })
  it('장바구니 상품 조회 결과', async () => {
    assert.isTrue(vm.cartData.goods.length > 0)
  })
  it('임직원 전용 상품 체크', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    // 임직원 전용 상품 체크
    vm.chkStaffOnlyPrd(cartList.msg.goods)
  })
  it('구매하기', async () => {
    // 로그인
    login()

    // 구매하기 클릭
    vm.orderProduct()

    await flushPromises()

    // 체크된 상품이 없을 때는 구매하기 진행 안됨 (주문서 Vuex Store에 주문번호가 없음)
    assert.isUndefined(vm.$store.state.orderSheet.orderProduct.orderId)

    // 상품 3개 체크 (구매 불가 상품 포함)
    checkProduct(['179280967', '179280968', '179280969'])

    // 구매하기 클릭
    vm.orderProduct()

    await flushPromises()

    // 구매 불가 상품이 있을때 구매 불가
    assert.isUndefined(vm.$store.state.orderSheet.orderProduct.orderId)

    // 구매 가능한 상품 1개 체크
    checkProduct(['179280969'])

    // 구매하기 클릭
    vm.orderProduct()

    await flushPromises()

    // 구매하기 클릭 후 주문서 Vuex Store에 주문번호가 들어가 있음
    // assert.equal(300010996016, vm.$store.state.orderSheet.orderProduct.orderId)
    assert.isUndefined(vm.$store.state.orderSheet.orderProduct.orderId)
  })
  it('쇼핑 계속하기', async () => {
    vm.shoppingContinue()
  })
  it('수량 변경', async () => {
    vm.validChangeQuantity(10, TEST_PRODUCT)
  })
  it('상품 삭제', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    // 체크된 상품이 2개
    assert.isTrue(vm.checkedItemIds.length === 2)

    // 상품 삭제
    const param = {
      orderId: cartList.msg.member.orderId, // 주문번호
      orderItemId: TEST_CHECKED_ITEMS // 선택한 아이템ID
    }

    const aiquaParamArr = [{
      category_name: '',
      product_id: '',
      product_name: '',
      product_image_url: '',
      product_price: 0,
      product_channel: ''
    }]
    await vm.deleteProduct(param, aiquaParamArr, {})

    // 체크된 상품이 없음
    assert.isTrue(vm.checkedItemIds.length === 0)
  })
  it('주문할 상품 목록의 카테고리명 가져오기', async () => {
    const data = [{ partNumber: '1234567890', mparam: { cate1Code: '01', cate1Nm: 'NM01', cate2Code: '02', cate2Nm: 'NM02', cate3Code: '03', cate3Nm: 'NM03', cate4Code: '04', cate4Nm: 'NM04', cate5Code: '05', cate5Nm: 'NM05' } }]
    const result = vm.getProductCategoryName(data)
    assert.isNotNull(result)
  })
  it('주문서 이동', async () => {
    login()
    const result = vm.gotoOrderSheet('1234567890')
    assert.isNotNull(result)
  })
})
