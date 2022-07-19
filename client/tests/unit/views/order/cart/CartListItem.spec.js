import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import VueRouter from 'vue-router'
import { assert } from 'chai'
import flushPromises from 'flush-promises'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'
import router from '@/router'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import {
  arrayGroupBy
} from '@utils/commonutil/commonUtil'

import CartListItem from '@/views/order/cart/CartListItem'
import cartList from '@unit/views/order/cart/mock/cartList'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

// 필수 테스트 할 대상 파일명을 넣음
describe('CartListItem 테스트', () => {
  const TEST_CHECKED_ITEMS = ['179280968', '179280969']
  // TEST_PRODUCT1 : 구매제한 상품, 무료배송, TEST_PRODUCT2 : 착불, TEST_PRODUCT3 : 구매제한 상품, 유료배송
  // const [TEST_PRODUCT1, TEST_PRODUCT2, TEST_PRODUCT3] = cartList.msg.goods
  const [TEST_PRODUCT1, TEST_PRODUCT2] = cartList.msg.goods
  let wrapper
  let vm
  let mock

  // 상품 체크
  function checkProduct (checkedItemsId) {
    vm.setCheckedItemIdsByType({
      cartType: 'GENERAL',
      value: checkedItemsId
    })
  }

  before(async () => {
    Vue.prototype.$nsaxios = nsaxios
    Vue.filter('htmlDecode', text => text)

    // mock axios
    mock = new MockAdapter(axios)

    // 바로 구매
    mock.onPost(`${CONST.API_URL}/NSItemDetailAjax`).reply(200,
      {
        jsonData: {
          custDurSpr: 1,
          rtn: {
            DAY_P_QTY: 1,
            MONTH_P_QTY: 1,
            DATE_P_QTY: 1,
            flag: 'Y'
          }
        }
      }
    )
  })

  beforeEach(async () => {
    delete router.history.current
    router.history.current = {
      name: 'cartList',
      meta: {},
      path: '/order/cart',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // 테스트 대상 컴포넌트 명 입력
    wrapper = shallowMount(CartListItem, {
      localVue,
      store,
      router,
      propsData: {
        cartType: 'GENERAL'
      }
    })
    vm = wrapper.vm

    // 상품 mock 데이터 세팅
    vm.$store.commit('cart/setCartData', cartList.msg)

    // 상품 체크해제
    checkProduct([])

    await flushPromises()
  })

  it('상품타입별(일반/상품권) 전체 상품 목록', () => {
    const expected = vm.productList.length
    const actual = cartList.msg.goods.length
    assert.equal(actual, expected)
  })
  it('상품타입별(일반/상품권) 전체 상품 개수', () => {
    const expected = vm.productList.length
    const actual = cartList.msg.goods.length
    assert.equal(actual, expected)
  })
  it('상품타입별(일반/상품권) 체크된 상품 아이템ID 목록', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    assert.deepEqual(vm.checkedItemIds, TEST_CHECKED_ITEMS)
  })
  it('상품타입별(일반/상품권) 체크된 상품 목록', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    const actual = vm.checkedProductList
    const expected = vm.checkedProductList.filter(product => TEST_CHECKED_ITEMS.includes(product.orderItemsId))
    assert.deepEqual(actual, expected)
  })
  it('상품타입별(일반/상품권) 체크된 상품 개수', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    const actual = vm.checkedItemIds.length
    const expected = TEST_CHECKED_ITEMS.length
    assert.equal(actual, expected)
  })
  it('묶음배송별로 group by', async () => {
    const actual = vm.productListGroupByBundle.length
    const expected = Object.values(arrayGroupBy(cartList.msg.goods, 'dlvyGrpKey')).length
    assert.equal(actual, expected)
  })
  it('품절상품, 방송상품을 제외한 모든 상품 아이템ID 목록 (전체 체크 시 제외할 항목을 제외함)', async () => {
    const actual = vm.productListExceptSoldout
    const expected = cartList.msg.goods
      .filter(product => (product.outYn === 'N' && product.saleYn === 'Y' && product.itemLiveYN === 'Y') && product.livePrdtYn !== 'Y')
      .map(product => product.orderItemsId)
    assert.deepEqual(actual.sort(), expected.sort())
  })
  it('품절상품, 방송상품을 제외한 모든 상품 아이템ID 목록 개수', async () => {
    const actual = vm.productCountExceptSoldout
    const expected = cartList.msg.goods.filter(product => (product.outYn === 'N' && product.saleYn === 'Y' && product.itemLiveYN === 'Y') && product.livePrdtYn !== 'Y').length
    assert.equal(actual, expected)
  })
  it('체크박스 전체 선택', async () => {
    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    // 전체 체크 비활성화
    assert.isFalse(vm.checkAll)

    // 상품 3개 모두 체크
    checkProduct(['179280967', '179280968', '179280969'])

    // 전체 체크 활성화
    assert.isTrue(vm.checkAll)
  })
  it('체크박스 개별 선택', async () => {
    const TO_BE_CHECKED_ITEM = ['179280967']
    // 상품 1개만 체크
    checkProduct(TO_BE_CHECKED_ITEM)

    const actual = vm.checkEach
    const expected = TO_BE_CHECKED_ITEM

    assert.deepEqual(actual, expected)
  })
  it('품절 여부', async () => {
    assert.isFalse(vm.isSoldout(TEST_PRODUCT1))
  })
  it('무료 배송 여부', async () => {
    const freeDeliveryGroup = [{ ...TEST_PRODUCT1 }, { ...TEST_PRODUCT2 }]
    assert.isTrue(vm.isFreeDelivery(freeDeliveryGroup))
  })
  it('선택 삭제', async () => {
    // 상품 체크없이 삭제
    vm.deleteProductChecked()

    // 상품 2개 체크
    checkProduct(TEST_CHECKED_ITEMS)

    // 상품 삭제
    vm.deleteProductChecked()
  })
  // it('상품 개별 삭제', async () => {
  //   // 테스트 상품 삭제
  //   vm.deleteProductEach(TEST_PRODUCT1)

  //   // emit 된 상품번호와 테스트 상품의 상품번호 일치 여부 체크
  //   const actual = wrapper.emitted()['delete:product'][0][0].orderItemId
  //   const expected = TEST_PRODUCT1.orderItemsId
  //   assert.equal(actual, expected)
  // })
  // it('바로구매', async () => {
  //   // 구매제한 상품 바로구매 시에는 구매 불가능
  //   vm.orderProductEach(TEST_PRODUCT1)
  //   assert.isUndefined(wrapper.emitted()['goto:ordersheet'])
  //   vm.orderProductEach(TEST_PRODUCT3)
  //   assert.isUndefined(wrapper.emitted()['goto:ordersheet'])

  //   // 구매 미 제한 상품 바로구매 시는 emit 된 상품번호와 테스트 상품의 상품번호 일치 여부 체크
  //   vm.orderProductEach(TEST_PRODUCT2)
  //   const actual = wrapper.emitted()['goto:ordersheet']
  //   const expected = TEST_PRODUCT2.orderItemsId
  //   assert.equal(actual, expected)
  // })
  // it('묶음배송 주문하기', async () => {
  //   const bundleGroup = vm.productListGroupByBundle[0]
  //   vm.orderProductBundle(bundleGroup)

  //   // emit 된 묶음배송 상품의 개수와 테스트 상품의 묶음배송 개수 일치 여부 체크
  //   const actual = wrapper.emitted()['goto:ordersheet'].length
  //   const expected = bundleGroup.length
  //   assert.equal(actual, expected)
  // })
  // it('방송알림', async () => {
  //   const bundleGroup = vm.productListGroupByBundle

  //   vm.gotoShoppingAlarm(bundleGroup)
  // })
  it('배송비 정책', async () => {
    const [bundleGroup1, bundleGroup2] = vm.productListGroupByBundle
    assert.equal(vm.getDeliveryPolicy(bundleGroup1), '')
    assert.equal(vm.getDeliveryPolicy(bundleGroup2), '착불배송')
  })
  // it('배송비 절약 상품보기 노출 여부', async () => {
  // })
  it('배송비 절약 상품 보기', async () => {
    const bundleGroup = [{ goodsId: '', brandName: '', freeDeliverYn: '', partNumber: '' }]
    vm.gotoDeliverySaving(bundleGroup)
  })
  // it('총 결제 예상 금액 합계 재조정', async () => {
  // })

  // it('getSalePrice', async () => {
  //   vm.getSalePrice(vm.product)
  // })

  // it('gotoProductDetail', async () => {
  //   vm.gotoProductDetail(vm.product)
  // })

  it('deleteProductEach', async () => {
    vm.deleteProductEach(vm.product)
  })

  it('orderProductEach', async () => {
    vm.orderProductEach(vm.product)
  })

  it('orderProductBundle', async () => {
    vm.orderProductBundle(vm.product)
  })

  it('gotoShoppingAlarm', async () => {
    vm.gotoShoppingAlarm(vm.product)
  })

  it('closeAlarmRegister', async () => {
    vm.closeAlarmRegister(vm.product)
  })
})
