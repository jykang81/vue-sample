
import CouponRegister from '@/views/event/CouponRegister'
import { mount, createLocalVue } from '@vue/test-utils'
import { expect, assert } from 'chai'
import { registerCoupon } from '@unit/views/event/mock/couponregister'

// axios-mock-adapter 추가
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'

// 본문에서 $nsaxios 사용 시 추가
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

// messageUtil 테스트시 추가
import ContainerMessage from '@components/frameworks/ContainerMessage'
import Vuex from 'vuex'
import store from '@/vuex'

// router 추가
import VueRouter from 'vue-router'
const localVue = createLocalVue()

localVue.use(VueRouter)
localVue.use(Vuex)
const router = new VueRouter()
let wrapper
let messageUtilWrapper

Vue.prototype.$nsaxios = nsaxios
const mock = new MockAdapter(axios)

describe('CouponRegister', function () {
  beforeEach(() => {
    wrapper = mount(CouponRegister, {
      localVue,
      router
    })
    messageUtilWrapper = mount(ContainerMessage, {
      localVue,
      router,
      store
    })
  })

  it('기본 UI 정상 노출 확인', function () {
    // 고정 이벤트의 경우 고정된 UI가 노출됨 확인
    expect(wrapper.text()).include('쿠폰을 등록하세요')
    expect(wrapper.text()).include('유의사항')
  })

  it('쿠폰등록 API 호출', async function () {
    mock.onPost(`${CONST.API_URL}/NSTimesPrmtEventCmd`).reply(200, registerCoupon)
    await wrapper.vm.registerCoupon()
    // callback 함수는 별도 테스트
  })

  describe('쿠폰등록 API 호출 콜백함수', function () {
    it('데이터가 있을 경우, alert 정상 노출됨 확인', async function () {
      wrapper.vm.callbackRegisterCoupon(registerCoupon)
      await wrapper.vm.$nextTick()
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include(registerCoupon.msg.root.rtnMsg)
    })
  })

  describe('등록하기 버튼 클릭 이벤트', function () {
    it('쿠폰번호가 없을 경우, alert 정상 노출됨 확인', async function () {
      wrapper.vm.onClickCouponRegister()
      await wrapper.vm.$nextTick()
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include(wrapper.vm.MESSAGES.PLEASE_ENTER_THE_COUPON_NUMBER)
    })
  })

  describe('쿠폰번호 input 이벤트', function () {
    it('쿠폰번호가 208byte 보다 작을 경우, couponNubmer에 그대로 저장', async function () {
      wrapper.vm.inputEvent({ target: { value: '1234567890' } })
      await wrapper.vm.$nextTick()
      assert.equal(wrapper.vm.couponNumber, '1234567890')
    })

    it('쿠폰번호가 208byte 보다 클 경우, couponNubmer에 208byte만 저장', async function () {
      wrapper.vm.inputEvent({ target: { value: '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' } })
      await wrapper.vm.$nextTick()
      assert.equal(wrapper.vm.couponNumber, '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678')
    })
  })
})
