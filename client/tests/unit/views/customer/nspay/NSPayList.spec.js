import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import NSPayList from '@/views/customer/nspay/NSPayList'
import axios from 'axios'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import { nspayInfoAll, nspaySetMajor, nspayDeleteMajor } from '@unit/views/customer/nspay/mock/nspay'

const initNSPayListResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspayInfoAll)

  return mock
}

const initNSPayDeleteMajorResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspayDeleteMajor)

  return mock
}

const initNSPaySetMajorResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspaySetMajor)

  return mock
}

describe('마이페이지 > NS페이 관리 > 결제수단 관리', () => {
  let localVue
  let options
  let mock

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    Vue.prototype.$nsaxios = nsaxios

    delete router.history.current
    router.history.current = {
      name: 'nSPayList',
      meta: {},
      path: '/customer/info/nspay/method/management',
      hash: '',
      query: {},
      params: {
        type: ''
      },
      fullPath: '/',
      matched: []
    }

    mock = new MockAdapter(axios)

    options = {
      localVue,
      store,
      router
    }
  })

  it('등록된 전체 결제수단 조회 API 호출', async () => {
    initNSPayListResponse(mock)
    const wrapper = mount(NSPayList, options)
    const vm = wrapper.vm

    vm.getNSPayInfoAll()

    await flushPromises()

    assert.equal(vm.nspayList.length, nspayInfoAll.payInfo.payList.length)
  })

  it('NS페이 기본 결제수단 설정 API 호출', async () => {
    initNSPaySetMajorResponse(mock)
    const wrapper = mount(NSPayList, options)
    const vm = wrapper.vm
    const item = {
      cmdType: 'delPayInfo',
      payMethod: '',
      wpayToken: '',
      bankCardCode: '',
      bankCardNo: '',
      acntRegDttm: ''
    }
    vm.setNSPayMajor(item)

    await flushPromises()
  })

  it('NS페이 기본 결제수단 해제 API 호출', async () => {
    initNSPayDeleteMajorResponse(mock)
    const wrapper = mount(NSPayList, options)
    const vm = wrapper.vm
    const item = {
      cmdType: 'delPayInfo',
      payMethod: '',
      wpayToken: '',
      bankCardCode: '',
      bankCardNo: '',
      acntRegDttm: ''
    }
    vm.deleteNSPayMajor(item)

    await flushPromises()
  })

  it('결제수단 등록 버튼 클릭', () => {
    const wrapper = mount(NSPayList, options)
    const nspayRegisterButtonWrapper = wrapper.find('.btn')
    nspayRegisterButtonWrapper.trigger('click')
  })

  it('기본 결제수단 선택 버튼 클릭', () => {
    const wrapper = mount(NSPayList, {
      data () {
        return {
          nspayList: nspayInfoAll.payInfo.payList
        }
      }
    })
    const nspayMajorButtonWrapper = wrapper.find('.btn_star')
    nspayMajorButtonWrapper.trigger('click')
  })

  it('결제수단 삭제 버튼 클릭', () => {
    const wrapper = mount(NSPayList, {
      data () {
        return {
          nspayList: nspayInfoAll.payInfo.payList
        }
      }
    })

    const nspayDeleteButtonWrapper = wrapper.find('.btn_delete')
    nspayDeleteButtonWrapper.trigger('click')
  })
})
