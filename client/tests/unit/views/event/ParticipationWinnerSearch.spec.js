import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@utils/loginUtil'
import ParticipationWinnerSearch from '@/views/event/ParticipationWinnerSearch' // 테스트 할 대상 컴포넌트
import { nsaJaxMTimesEventCmdUrl, winnerListRes, memberInfo } from '@unit/views/event/mock/participation'

// 필수 테스트 할 대상 파일명을 넣음
describe('ParticipationWinnerSearch.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null
  let mock
  const e = {
    preventDefault: () => {},
    keyCode: '',
    target: { value: '' }
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    loginUtil.login(memberInfo)
  })

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    Vue.prototype.$store = store
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    const current = {
      name: null,
      meta: {},
      path: '/',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    // options 정의
    options = {
      localVue,
      router,
      store
    }

    mock.reset()
  })

  // 여기서부터는 테스트 할 메소드 디스크립션
  describe('method : 테스트 코드 커버리지 용', () => {
    it('onSearchClick Function Call', async () => {
      mock
        .onPost(nsaJaxMTimesEventCmdUrl)
        .reply(200, winnerListRes)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ParticipationWinnerSearch, options)
      const vm = wrapper.vm

      try {
        await flushPromises()

        await vm.$nextTick()

        e.keyCode = 13
        vm.searchKeyword = '이벤트'
        vm.onTextWrite(e)

        await flushPromises()

        await vm.$nextTick()

        vm.searchKeyword = '이벤트'
        vm.onSearchClick()

        await flushPromises()

        await vm.$nextTick()

        const searchKeyword = vm.searchKeyword
        assert.notEqual('', searchKeyword)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('removeSearchKeyword Function Call', async () => {
      mock
        .onPost(nsaJaxMTimesEventCmdUrl)
        .reply(200, winnerListRes)

      e.keyCode = 13
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ParticipationWinnerSearch, options)
      const vm = wrapper.vm

      try {
        await flushPromises()

        await vm.$nextTick()

        vm.removeSearchKeyword()

        const isList = vm.isList
        assert.equal(false, isList)

        const isGetList = vm.isGetList()
        assert.equal(true, isGetList)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    // it('setNoticeListMobile Function Call', async () => {
    //   mock
    //     .onPost(nsaJaxMTimesEventCmdUrl)
    //     .reply(200, nsaJaxMTimesEventCmdRes)

    //   // 테스트 대상 컴포넌 명 입력
    //   const wrapper = shallowMount(ParticipationWinnerSearch, options)
    //   const vm = wrapper.vm

    //   try {
    //     await flushPromises()

    //     await vm.$nextTick()

    //     vm.setNoticeListMobile(nsaJaxMTimesEventCmdRes)

    //     const partListLength = vm.partList.length
    //     assert.notEqual(0, partListLength)
    //   } catch (e) {
    //     assert.fail(e.message)
    //   }
    // })
  })
})
