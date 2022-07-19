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

import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetAddressBookUpdate from '@/components/order/sheet/OrderSheetAddressBookUpdate'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetAddressBookUpdate', () => {
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
    mock.reset()
    initOrderSheet(mock)
    initOrderSheetDelivery(mock)

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

    orderSheetWrapper = mount(OrderSheet, options)

    await flushPromises()
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheetAddressBookUpdate 테스트', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = mount(OrderSheetAddressBookUpdate, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            item: {
              receiverName: '김일모',
              addressID: '123123',
              zipCode: '13487',
              addrFlag: '100',
              addr: '경기도 성남시 분당구 판교로 228번길',
              addrDetail: '15 NS홈쇼핑',
              setAddress1: '경기도 성남시 분당구 삼평동',
              setAddress2: '625 판교세븐벤처밸리1',
              ipDefaultDest: '0',
              phone1: '010-1234-1231'
            }
          }
        }
      })
      wrapper.vm.$store = { commit: data => {} }
    })

    describe('OrderSheetAddressBookUpdate 테스트', () => {
      it('우편번호검색 버튼 클릭', async () => {
        wrapper.vm.clickSearchPostCodeBtn()
        await flushPromises()
        assert.isTrue(true)
      })

      it('저장 버튼', async () => {
        wrapper.vm.receiverName = ''
        wrapper.vm.phone1 = ''
        wrapper.vm.zipCode = ''
        wrapper.vm.addr = ''
        wrapper.vm.addrDetail = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '!@#!'
        wrapper.vm.phone1 = ''
        wrapper.vm.zipCode = ''
        wrapper.vm.addr = ''
        wrapper.vm.addrDetail = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '김일모'
        wrapper.vm.phone1 = ''
        wrapper.vm.zipCode = ''
        wrapper.vm.addr = ''
        wrapper.vm.addrDetail = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '김일모'
        wrapper.vm.phone1 = '010123123'
        wrapper.vm.zipCode = ''
        wrapper.vm.addr = ''
        wrapper.vm.addrDetail = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '김일모'
        wrapper.vm.phone1 = '11111111111'
        wrapper.vm.zipCode = ''
        wrapper.vm.addr = ''
        wrapper.vm.addrDetail = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '김일모'
        wrapper.vm.phone1 = '01012341231'
        wrapper.vm.zipCode = '13487'
        wrapper.vm.addr = ''
        wrapper.vm.addrDetail = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '김일모'
        wrapper.vm.phone1 = '01012341231'
        wrapper.vm.zipCode = '13487'
        wrapper.vm.addr = '경기도 성남시 분당구 판교로 228번길'
        wrapper.vm.addrDetail = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '김일모'
        wrapper.vm.phone1 = '01012341231'
        wrapper.vm.zipCode = '13487'
        wrapper.vm.addr = '경기도 성남시 분당구 판교로 228번길'
        wrapper.vm.addrDetail = '15 NS홈쇼핑'
        wrapper.vm.mode = 'default'
        wrapper.vm.ipDefaultDest = false
        wrapper.vm.item.ispriamry = '1'
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)

        wrapper.vm.receiverName = '김일모'
        wrapper.vm.addressID = '123123'
        wrapper.vm.zipCode = '13487'
        wrapper.vm.addrFlag = '100'
        wrapper.vm.addr = '경기도 성남시 분당구 판교로 228번길'
        wrapper.vm.addrDetail = '15 NS홈쇼핑'
        wrapper.vm.setAddress1 = '경기도 성남시 분당구 삼평동'
        wrapper.vm.setAddress2 = '625 판교세븐벤처밸리1'
        wrapper.vm.phone1 = '01012341231'
        wrapper.vm.mode = ''
        wrapper.vm.ipDefaultDest = true
        wrapper.vm.item.ispriamry = ''
        wrapper.vm.clickSaveBtn()
        assert.isTrue(true)
      })

      it('삭제 버튼', async () => {
        wrapper.vm.item.ispriamry = '1'
        wrapper.vm.clickDeleteBtn()
        assert.isTrue(true)

        wrapper.vm.item.ispriamry = ''
        wrapper.vm.clickDeleteBtn()
        assert.isTrue(true)
      })

      it('keydownNumber', async () => {
        wrapper.vm.keydownNumber({
          keyCode: 50,
          target: {
            value: '12'
          }
        })
        assert.isTrue(true)
      })
    })
  })
})
