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
import ShoppingAlarmPopup from '@/components/customer/shopping/ShoppingAlarmPopup' // 테스트 할 대상 컴포넌트
import { TVHomeShoppingAjaxRes, ModifyAlarmRealRes, memberInfo } from '@unit/components/customer/shopping/alarmMock'
// 필수 테스트 할 대상 파일명을 넣음
describe('ShoppingAlarmPopup.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null
  let mock

  // API URL
  const TVHomeShoppingAjaxUrl = `${CONST.API_URL}/TVHomeShoppingAjax`
  const ModifyAlarmRealUrl = `${CONST.API_URL}/ModifyAlarmReal`

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

    // options 정의
    options = {
      localVue,
      router,
      store,
      propsData: {
        param: {
          infrId: 1140,
          isShowModifyPopup: true,
          isSmsMarcketingAgreeChecked: true,
          mobileNum: '01065999341',
          partNumber: '26185228',
          pickedCnt: '20',
          pickedPeriod: '20',
          productName: '[TV](무이자)끌레드벨 24K 리프팅 ',
          rcvCnt: '방송시마다',
          rcvPeriod: '2개월'
        }
      }
    }

    mock.reset()
  })

  // 여기서부터는 테스트 할 메소드 디스크립션
  describe('method : 테스트 코드 커버리지 용', () => {
    // 테스트 결과에 기대 조건 ... 대한 설명
    it('초기 created시 발생', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ShoppingAlarmPopup, options)
      const vm = wrapper.vm

      try {
        await flushPromises()

        await vm.$nextTick()
        const pickedCnt = vm.pickedCnt
        assert.equal('20', pickedCnt)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('getAlarmInfoMobile Function Call', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ShoppingAlarmPopup, options)
      const vm = wrapper.vm

      try {
        mock
          .onPost(TVHomeShoppingAjaxUrl)
          .reply(200, TVHomeShoppingAjaxRes)

        const params = {
          partNumber: '26196200',
          catentryId: '',
          imageUrl: '//product-image.dev-nsmall.com/itemimg/0/26/200/26196200_C.jpg',
          productName: 'TRY 풍기인견 남성 더위사냥 6종 패키지\t'
        }

        vm.$store = { commit: data => {} }
        vm.getAlarmInfoMobile(params)

        await flushPromises()

        await vm.$nextTick()

        assert.notEqual(false, vm.isShowRegistPopup)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('registerAlarmSettings Function Call', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ShoppingAlarmPopup, options)
      const vm = wrapper.vm

      try {
        mock
          .onPost(TVHomeShoppingAjaxUrl)
          .reply(200, TVHomeShoppingAjaxRes)

        vm.modifyProduct.partNumber = '010-6599-9341'
        vm.pickedPeriod = 10
        vm.pickedCnt = 10

        vm.$store = { commit: data => {} }
        vm.registerAlarmSettings()

        await flushPromises()

        await vm.$nextTick()

        assert.equal(false, vm.isShowRegistPopup)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('confirmAlarm Function Call', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ShoppingAlarmPopup, options)
      const vm = wrapper.vm

      try {
        await flushPromises()

        await vm.$nextTick()

        mock
          .onPost(ModifyAlarmRealUrl)
          .reply(200, ModifyAlarmRealRes)

        vm.isShowRegistPopup = false
        vm.modifyProduct.partNumber = '010-6599-9341'
        vm.pickedPeriod = 10
        vm.pickedCnt = 10

        vm.$store = { commit: data => {} }
        vm.confirmAlarm()

        await flushPromises()

        await vm.$nextTick()

        assert.equal(false, vm.isShowRegistPopup)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('modifyAlarm Function Call', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ShoppingAlarmPopup, options)
      const vm = wrapper.vm

      try {
        vm.$store = { commit: data => {} }

        vm.modifyAlarm()

        await flushPromises()

        await vm.$nextTick()
        assert.notEqual(false, vm.isShowModifyPopup)
      } catch (e) {
        assert.fail(e.message)
      }
    })
  })
})
