import { mount, createLocalVue } from '@vue/test-utils'
import { expect, assert } from 'chai'
import RouletteEvent from '@/views/event/RouletteEvent'
import { startRouletteSuccess, startRouletteFail, getTollPoint } from '@unit/views/event/mock/roulette'

import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

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

describe('RouletteEvent', function () {
  beforeEach(() => {
    wrapper = mount(RouletteEvent, {
      localVue,
      router
    })
    messageUtilWrapper = mount(ContainerMessage, {
      localVue,
      router,
      store
    })
    // 인입 param 세팅
    router.history.current.params.offerId = '100000030216'

    // GSAP mock 세팅
    window.gsap = {}
    window.gsap.to = () => {}
  })

  describe('computed', function () {
    it('bizUtil 확인', function () {
      assert.isNotNull(wrapper.vm.bizUtil)
    })
    it('offerId 확인', function () {
      // router param으로 넘어온 offerId가 data에 정상 셋팅됨 확인
      expect(wrapper.vm.offerId).to.equal('100000030216')
    })
  })

  it('기본 UI 정상 노출 확인', function () {
    // 고정 이벤트의 경우 고정된 UI가 노출됨 확인
    expect(wrapper.text()).include('나의 톨')
    expect(wrapper.text()).include('유의사항')
    expect(wrapper.text()).include('톨포인트란?')
  })

  describe('톨포인트 세팅', function () {
    it('데이터가 있을때, 톨포인트 업로드 확인', async function () {
      wrapper.vm.setTollPoint(getTollPoint)
      await wrapper.setData({ isLogin: true })
      await wrapper.vm.$nextTick()
      // data 변경됨 확인
      expect(wrapper.vm.tollPoint).to.equal('6,310')
      // UI 변경됨 확인
      expect(wrapper.text()).include('6,310')
    })

    it('데이터가 없을때, alert 노출됨 확인', async function () {
      wrapper.vm.setTollPoint({ msg: { root: {} } })
      await wrapper.vm.$nextTick()
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include(wrapper.vm.MESSAGES.FAIL_TO_GET_TOLL)
    })
  })

  describe('룰렛 결과 세팅', function () {
    it('리턴코드가 0이면, alert 노출됨 확인', async function () {
      wrapper.vm.setRouletteResult(startRouletteFail)
      await wrapper.vm.$nextTick()
      // html 디코딩 후 <br> 기준으로 첫번째 줄만 추출
      const decodingRtnMsg = htmlDecode(startRouletteFail.msg.root.rtnMsg).split(/<br\s*\/?>|\n/)[0]
      // messageUtil.alert 노출됨 확인
      expect(messageUtilWrapper.text()).include(decodingRtnMsg)
    })
    it('리턴코드가 0이 아니면,', async function () {
      wrapper.vm.setRouletteResult(startRouletteSuccess)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.resultMsg).to.equal('축하합니다. 적립금 500원에 당첨되었습니다.')
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
