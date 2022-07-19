import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import joinSimpleFacebookComplete from '@/views/customer/join/JoinSimpleFacebookComplete'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('joinSimpleFacebookComplete', () => {
  let localVue
  let options
  let wrapper
  let vm

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
        name: '나선영',
        email1: 'nsy85@nsmall.com',
        logonId: 'nsy85@gmail.com',
        firstName: '나선영',
        lastName: '나선영',
        dateOfBirth: '',
        gender: 'F',
        userDemoField2: 'N',
        entFlag: 'FACEBOOK',
        entUserId: 1234567890,
        entEmail: 'nsy85@gmail.com',
        isSSORequest: '',
        entName: '나선영',
        birthday: '19850101',
        saveYn: false,
        autoYn: 'N',
        faceBookJoin: true,
        logonType: 'simple',
        resAction: 'none'
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    options = {
      localVue,
      router,
      store
    }
  })
  // 초기값 비교
  it('sets the correct default data', () => {
    wrapper = mount(joinSimpleFacebookComplete, options)
    vm = wrapper.vm

    assert.notEqual(vm.joinCompleteParams.entUserId, '30125194')
  })
})
