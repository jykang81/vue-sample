import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import NSPayManagement from '@/views/customer/nspay/NSPayManagement'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import axios from 'axios'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import { nspayInfoAll, nspayUse, nspayOneTouchUse, nspayOneTouchUseFlagChange, nspayPasswordChangeCallbackResult, nspayPasswordCheckCallbackResult } from '@unit/views/customer/nspay/mock/nspay'

const initNSPayListResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspayInfoAll)

  return mock
}

const initNSPayUseResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspayUse)

  return mock
}

const initNSPayOneTouchUseResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspayOneTouchUse)

  return mock
}

const nspayOneTouchUseFlagChange1Response = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspayOneTouchUseFlagChange.nspayMember)

  return mock
}

const nspayOneTouchUseFlagChange2Response = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSWPay`)
    .reply(200, nspayOneTouchUseFlagChange.nspayNonMember)

  return mock
}

describe('마이페이지 > NS페이 관리', () => {
  let localVue
  let options
  let mock

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(VueAwesomeSwiper)
    localVue.prototype.$nsaxios = nsaxios

    delete router.history.current
    router.history.current = {
      name: 'nSPayManagement',
      meta: {},
      path: '/customer/info/nspay/management',
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
      router
    }
  })

  it('등록된 전체 결제수단 조회 API 호출', async () => {
    initNSPayListResponse(mock)
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.getNSPayInfoAll()

    await flushPromises()

    assert.equal(vm.nspayList.length, nspayInfoAll.payInfo.payList.length)
  })

  it('사용여부 조회 API 호출', async () => {
    initNSPayUseResponse(mock)
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.getNSPayUseCheck()

    await flushPromises()

    assert.equal(nspayOneTouchUse.msg.useYn, 'Y')
  })

  it('원터치 결제 사용여부 조회 API 호출', async () => {
    initNSPayOneTouchUseResponse(mock)
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.getNSPayOneTouchUseCheck()

    await flushPromises()

    const checkBoxInputWrapper = wrapper.find({ ref: 'checkBoxInput' }).element.checked
    assert.equal(checkBoxInputWrapper, nspayOneTouchUse.msg.useYn === 'Y')
  })

  it('원터치 결제 사용여부 변경 API 호출(NS페이 가입 회원)', async () => {
    nspayOneTouchUseFlagChange1Response(mock)
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.setNSPayOneTouchUseFlag()

    await flushPromises()
  })

  it('원터치 결제 사용여부 변경 API 호출(NS페이 미가입 회원)', async () => {
    nspayOneTouchUseFlagChange2Response(mock)
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.setNSPayOneTouchUseFlag()

    await flushPromises()
  })

  // it('원터치 결제 사용여부 토글 변경 시 호출되는 함수', () => {
  //   const wrapper = mount(NSPayManagement, options)
  //   const vm = wrapper.vm

  //   vm.onClickNSPayOneTouchUseFlag()
  // })

  it('결제 비밀번호 확인', () => {
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.checkNSPayPassword()
  })

  it('결제 비밀번호 변경 후 호출될 callback 함수', () => {
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.callbackNspayPasswordChangeResult(nspayPasswordChangeCallbackResult.success)
    vm.callbackNspayPasswordChangeResult(nspayPasswordChangeCallbackResult.fail)
  })

  it('결제 비밀번호 확인 후 호출될 callback 함수', () => {
    const wrapper = mount(NSPayManagement, options)
    const vm = wrapper.vm

    vm.callbackNspayPasswordResult(nspayPasswordCheckCallbackResult.success)
    vm.callbackNspayPasswordResult(nspayPasswordCheckCallbackResult.fail)
  })

  it('결제 비밀번호 변경 클릭 이벤트', () => {
    const wrapper = mount(NSPayManagement, options)

    const changePasswordButtonWrapper = wrapper.find('.menu_list a')
    changePasswordButtonWrapper.trigger('click')
  })
})
