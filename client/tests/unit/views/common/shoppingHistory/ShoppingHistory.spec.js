import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import CONST from '@constants/framework/framework'
import COMM_CONST from '@constants/framework/constants'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import ShoppingHistory from '@/views/common/ShoppingHistory'
import { GetWishList, RegisterWish, RemoveWish, ErrorWish } from '@unit/views/common/shoppingHistory/mock/shoppingHistoryResponse'
import { shoppingHistoryLocalStorage, shoppingHistoryInput } from '@unit/views/common/shoppingHistory/mock/shoppingHistoryStorage'
import localStorageUtil from '@/common/frameworks/localStorageUtil'
import sessionStorageUtil from '@/common/frameworks/sessionStorageUtil'
import loginUtil from '@utils/loginUtil'
import {
  calcDate,
  getDateParse
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@/common/utils/bizUtil'

const initResponse = mock => {
  mock.onPost(`${CONST.API_URL}/GetWishList`)
    .reply(200, GetWishList)
  mock.onPost(`${CONST.API_URL}/RegisterWish`)
    .reply(200, RegisterWish)
  mock.onPost(`${CONST.API_URL}/RemoveWish`)
    .reply(200, RemoveWish)
}

const clearLocalStorage = () => {
  localStorageUtil.del(COMM_CONST.STORAGE_KEY.RVP_VISIT)
  localStorageUtil.del(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS)
}

const setLocalStorage = StorageInput => {
  localStorageUtil.set(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS, JSON.stringify(StorageInput))
}

describe('최근본상품 테스트', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
    initResponse(mock)
    clearLocalStorage()
    loginUtil.login({ userId: '1234', loginyn: 'Y' })
  })

  it('Init functions --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm

    const visited = localStorageUtil.get(COMM_CONST.STORAGE_KEY.RVP_VISIT)
    assert.equal(visited, 'true') // 토스트 메세지 출력여부

    const vmData = vm.historyData
    assert.deepEqual(vmData, shoppingHistoryLocalStorage) // 로컬 스토리지 할당 여부

    const wishListLength = vm.wishListLength
    assert.equal(wishListLength, GetWishList.msg.data.pageInfo.totalCnt) // 찜 개수
    assert.equal(vm.showHistory, true) // 최근본상품 화면 출력 여부
  })

  it('Delete History All --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm
    vm.deleteAllHistory()
    assert.equal(vm.historyData, null)
    assert.deepEqual(vm.parseHistoryData, {})
    assert.equal(vm.showHistory, false)
  })

  it('Delete History --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm

    vm.deleteHistory(7, '오늘', 0)
    const assertHistory = bizUtil.getRecentlyViewedProducts()
    assert.deepEqual(vm.historyData, assertHistory)
  })

  it('Delete History Sliced --->', async () => {
    const tempHis = shoppingHistoryInput.slice() // 전체 길이가 1개일 때
    tempHis.splice(1, 7)
    setLocalStorage(tempHis)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm

    vm.deleteHistory(0, '오늘', 0)
    const assertHistory = bizUtil.getRecentlyViewedProducts()
    assert.deepEqual(vm.historyData, assertHistory)
    assert.deepEqual(vm.parseHistoryData['오늘'], undefined)

    const FIXED_DATE_MINUS_ONE = calcDate('', 0, 0, 0, -1, 'yyyy-MM-dd HH:mm:ss')
    const ONE_DAY_BEFORE = new Intl.DateTimeFormat('kr-KR', {
      timzone: 'Asia/Seoul',
      month: 'long',
      day: '2-digit',
      weekday: 'short'
    }).format(getDateParse(FIXED_DATE_MINUS_ONE))
    vm.deleteHistory(0, ONE_DAY_BEFORE, 0)
    assert.deepEqual(vm.parseHistoryData[ONE_DAY_BEFORE], undefined)
  })

  it('Go to Home --->', () => {
    const wrapper = mount(ShoppingHistory, options)
    const vm = wrapper.vm

    vm.goToHome()
    assert.isTrue(true)
  })

  it('JjimClick --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm

    let wishListLengthOrigin = vm.wishListLength
    const event = {
      target: {
        class: '',
        classList: {
          contains: v => {
            return false
          },
          remove: () => {
            event.target.class = ''
            return false
          },
          add: () => {
            event.target.class = 'on'
            return true
          }
        }
      }
    }
    // 찜 등록
    vm.jjimClick(event, vm.parseHistoryData['오늘'][1])
    await flushPromises()
    assert.equal(event.target.class, 'on', `-1: ${event.target.class}`)
    assert.equal(vm.wishListLength, wishListLengthOrigin, `-2: ${vm.wishListLength}, ${wishListLengthOrigin}`)

    wishListLengthOrigin = vm.wishListLength
    // 찜 취소
    vm.jjimClick(vm.parseHistoryData['오늘'][0])
    await flushPromises()
    assert.equal(vm.parseHistoryData['오늘'][0].jjimFlag, true, `-3: ${vm.parseHistoryData['오늘'][0].jjimFlag}`)
    assert.equal(vm.wishListLength, wishListLengthOrigin, `-4: ${vm.wishListLength}, ${wishListLengthOrigin}`)
  })

  it('jjimClick without login --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm
    // 로그아웃 상태에서 찜 선택
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
    const voidResult = vm.jjimClick(vm.parseHistoryData['오늘'][0])
    assert.isNotNull(voidResult, `-->> a1 - ${voidResult}`)
  })
  it('jjimClick with Error Response --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm
    // 비정상적 로그인상태 (성인상품 등)
    mock.reset()
    mock.onPost(`${CONST.API_URL}/RegisterWish`)
      .reply(200, ErrorWish)
    mock.onPost(`${CONST.API_URL}/RemoveWish`)
      .reply(200, ErrorWish)
    const wishListLengthOrigin = vm.wishListLength
    // 찜 등록
    vm.jjimClick(vm.parseHistoryData['오늘'][1])
    await flushPromises()
    assert.equal(vm.parseHistoryData['오늘'][1].jjimFlag, false)
    assert.equal(vm.wishListLength, wishListLengthOrigin)
    // 찜 취소
    vm.jjimClick(vm.parseHistoryData['오늘'][0])
    await flushPromises()
    assert.equal(vm.parseHistoryData['오늘'][0].jjimFlag, true)
    assert.equal(vm.wishListLength, wishListLengthOrigin)
  })
  it('moveHistoryClick --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm

    vm.moveHistoryClick(vm.parseHistoryData['오늘'][0]) // P Type
    vm.moveHistoryClick(vm.parseHistoryData['오늘'][2]) // C Type
    assert.isTrue(true)
  })
  it('allJjimAreaClick --->', async () => {
    setLocalStorage(shoppingHistoryInput)
    const wrapper = mount(ShoppingHistory, options)
    await flushPromises()
    const vm = wrapper.vm
    vm.allJjimAreaClick()
    assert.isTrue(true)
  })
})
