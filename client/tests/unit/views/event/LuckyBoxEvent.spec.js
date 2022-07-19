import { mount, createLocalVue } from '@vue/test-utils'
import { expect, assert } from 'chai'
import LuckyBoxEvent from '@/views/event/LuckyBoxEvent'
import { getTollPoint, applyLuckyBox, applyLuckyBoxFail } from '@unit/views/event/mock/luckybox'

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

import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

// router 추가
import VueRouter from 'vue-router'
const localVue = createLocalVue()
let wrapper
let messageUtilWrapper

Vue.prototype.$nsaxios = nsaxios
localVue.use(VueRouter)
localVue.use(Vuex)
const router = new VueRouter()
const mock = new MockAdapter(axios)

describe('LuckyBoxEvent', function () {
  beforeEach(() => {
    wrapper = mount(LuckyBoxEvent, {
      localVue,
      router
    })
    messageUtilWrapper = mount(ContainerMessage, {
      localVue,
      router,
      store
    })
  })

  describe('computed', function () {
    it('bizUtil 확인', function () {
      assert.isNotNull(wrapper.vm.bizUtil)
    })
  })

  it('기본 UI 정상 노출 확인', function () {
    expect(wrapper.text()).include('나의 톨')
    expect(wrapper.text()).include('유의사항')
    expect(wrapper.text()).include('톨포인트 모으는 방법')
    expect(wrapper.text()).include('톨포인트란?')
  })

  it('톨포인트 받아오기 API 호출', function () {
    mock.onPost(`${CONST.API_URL}/TolPointReal`).reply(200, getTollPoint)
    wrapper.vm.getTollPoint()
    // callback 함수에 대한 케이스는 별도로 진행
  })

  it('럭키박스 응모하기 API 호출', function () {
    mock.onPost(`${CONST.API_URL}/NSMTimesLuckyBoxReal`).reply(200, applyLuckyBox)
    wrapper.vm.applyLuckyBox()
    // callback 함수에 대한 케이스는 별도로 진행
  })

  describe('톨포인트 세팅', async function () {
    it('데이터가 있으면', async function () {
      wrapper.vm.setTollPoint(getTollPoint)
      await wrapper.setData({ isLogin: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tollPoint).to.equal('6,310')
      expect(wrapper.text()).include('6,310')
    })
    it('데이터가 없으면', async function () {
      // 함수 호출
      wrapper.vm.setTollPoint({ msg: { } })
      await wrapper.vm.$nextTick()
      // html 디코딩 후 <br> 기준으로 첫번째 줄만 추출
      const decodingRtnMsg = htmlDecode(wrapper.vm.MESSAGES.FAIL_TO_GET_TOLL).split(/<br\s*\/?>|\n/)[0]
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include(decodingRtnMsg)
    })
  })

  describe('럭키박스 응모 결과 세팅', function () {
    it('rtnCode가 0이면', async function () {
      // 함수 호출
      wrapper.vm.setApplyLuckyBoxResult(applyLuckyBox)
      await wrapper.vm.$nextTick()
      // html 디코딩 후 <br> 기준으로 첫번째 줄만 추출
      const decodingRtnMsg = htmlDecode(applyLuckyBox.msg.rtn.rtnMsg).split(/<br\s*\/?>|\n/)[0]
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include('축하합니다')
      expect(messageUtilWrapper.text()).include(decodingRtnMsg)
    })
    it('rtnCode가 0이 아니면', async function () {
      // 함수 호출
      wrapper.vm.setApplyLuckyBoxResult(applyLuckyBoxFail)
      await wrapper.vm.$nextTick()
      // html 디코딩 후 <br> 기준으로 첫번째 줄만 추출
      const decodingRtnMsg = htmlDecode(applyLuckyBoxFail.msg.rtn.rtnMsg).split(/<br\s*\/?>|\n/)[0]
      // messageUtil.alert 노출됨 확인
      assert.notInclude(messageUtilWrapper.text(), '축하합니다')
      expect(messageUtilWrapper.text()).include(decodingRtnMsg)
    })
  })

  describe('응모하기 버튼 클릭 이벤트', function () {
    it('1000톨보다 작으면, alert 노출됨 확인', async function () {
      // 톨포인트를 0으로 셋팅
      wrapper.setData({ tollPoint: 0 })
      await wrapper.vm.$nextTick()
      // 함수 호출
      wrapper.vm.onClickToApply()
      await wrapper.vm.$nextTick()
      // html 디코딩 후 <br> 기준으로 첫번째 줄만 추출
      const decodingRtnMsg = htmlDecode(wrapper.vm.MESSAGES.DO_NOT_HAVE_ENOUGH_TOLL).split(/<br\s*\/?>|\n/)[0]
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include(decodingRtnMsg)
    })

    it('1000톨 이상 있으면, alert 노출됨 확인', async function () {
      // 톨포인트를 0으로 셋팅
      wrapper.setData({ tollPoint: 1000 })
      await wrapper.vm.$nextTick()
      // 함수 호출
      wrapper.vm.onClickToApply()
      await wrapper.vm.$nextTick()
      // html 디코딩 후 <br> 기준으로 첫번째 줄만 추출
      const decodingRtnMsg = htmlDecode(wrapper.vm.MESSAGES.CONFIRM_AGREE_TO_APPLY).split(/<br\s*\/?>|\n/)[0]
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include(decodingRtnMsg)
    })
  })

  describe('톨 내역 보러가기 버튼 클릭 이벤트', function () {
    it('톨포인트 내역 조회 페이지로 router 정상 이동 확인', function () {
      wrapper.vm.onClickGoTollHistory()
      // router 정상 이동 확인
      expect(wrapper.vm.$route.path).to.equal('/customer/info/benefit/toll')
    })
  })
})
