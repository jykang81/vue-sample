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
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@utils/loginUtil'
import ShoppingAlarmList from '@/views/media/ShoppingAlarmList' // 테스트 할 대상 컴포넌트
import { ShowAlarmRealRes, DeleteAlarmRealRes, memberInfo } from '@unit/views/media/mock/alarmMock'
// 필수 테스트 할 대상 파일명을 넣음
describe('shoppingAlarmList.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null
  let mock

  // API URL
  const ShowAlarmRealUrl = `${CONST.API_URL}/ShowAlarmReal`
  const DeleteAlarmRealUrl = `${CONST.API_URL}/DeleteAlarmReal`

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
    it('removeShoppingAlarm Function Call', async () => {
      mock
        .onPost(ShowAlarmRealUrl)
        .reply(200, ShowAlarmRealRes)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ShoppingAlarmList, options)
      const vm = wrapper.vm

      try {
        await flushPromises()

        await vm.$nextTick()

        mock
          .onPost(DeleteAlarmRealUrl)
          .reply(200, DeleteAlarmRealRes)

        vm.removeShoppingAlarm(1076)
        mock
          .onPost(ShowAlarmRealUrl)
          .reply(200, ShowAlarmRealRes)

        await flushPromises()

        await vm.$nextTick()

        const shoppingAlarmListLength = vm.shoppingAlarmList.length
        assert.notEqual(0, shoppingAlarmListLength)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('modifyAlarmSettings Function Call', async () => {
      mock
        .onPost(ShowAlarmRealUrl)
        .reply(200, ShowAlarmRealRes)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ShoppingAlarmList, options)
      const vm = wrapper.vm

      try {
        await flushPromises()

        await vm.$nextTick()

        const params = {
          infrId: 1076,
          mobileNum: '010-6599-9341',
          rcvPeriod: 10,
          rcvCnt: 10,
          productName: 'TRY 풍기인견 남성 더위사냥 6종 패키지\t',
          partNumber: '123456'
        }

        vm.modifyAlarmSettings(params)

        assert.notEqual(false, vm.isShowModifyPopup)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    // it('resetList Function Call', async () => {
    //   mock
    //     .onPost(ShowAlarmRealUrl)
    //     .reply(200, ShowAlarmRealRes)

    //   // 테스트 대상 컴포넌 명 입력
    //   const wrapper = shallowMount(ShoppingAlarmList, options)
    //   const vm = wrapper.vm

    //   try {
    //     await flushPromises()

    //     await vm.$nextTick()

    //     vm.resetList()

    //     await flushPromises()

    //     await vm.$nextTick()
    //     const shoppingAlarmListLength = vm.shoppingAlarmList.length
    //     assert.notEqual(0, shoppingAlarmListLength)
    //   } catch (e) {
    //     assert.fail(e.message)
    //   }
    // })
  })
})
