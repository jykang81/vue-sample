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
import ParticipationWinnerDetail from '@/views/event/ParticipationWinnerDetail' // 테스트 할 대상 컴포넌트
import { nsaJaxMTimesEventCmdUrl, winnerDetilRes, memberInfo } from '@unit/views/event/mock/participation'

// 필수 테스트 할 대상 파일명을 넣음
describe('ParticipationWinnerDetail.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null
  let mock

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
      params: {
        eventState: '',
        offerIdfr: '',
        itemData: {
          startDt: '',
          drwCnfrmYn: '0',
          offerIdfr: '',
          num: '1',
          eventState: '',
          offerPrgrsStatSpr: '0',
          title: '[일반] 이벤트 당첨자 _ test 3',
          artclNum: '2057',
          recGb: '일반',
          wnrDt: '2020.02.27',
          endDt: '',
          offerNm: ''
        },
        artclNum: '2057'
      },
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
    it('getEventWinningInfo Function Call', async () => {
      mock
        .onPost(nsaJaxMTimesEventCmdUrl)
        .reply(200, winnerDetilRes)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ParticipationWinnerDetail, options)
      const vm = wrapper.vm

      try {
        await flushPromises()

        await vm.$nextTick()

        const title = vm.winnerApiData.eventWinDetail.title
        assert.notEqual('', title)
      } catch (e) {
        assert.fail(e.message)
      }
    })
  })
})
