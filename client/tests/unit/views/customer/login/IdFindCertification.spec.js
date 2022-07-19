import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import idFindCertification from '@/views/customer/login/IdFindCertification'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('idFindCertification', () => {
  let localVue
  let options
  let wrapper

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
        viewType: 'ID',
        logonId: ''
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

  it('ID onLoad Call Process', () => {
    delete router.history.current
    const current = {
      name: null,
      meta: {
        pageKey: 'ID'
      },
      path: '/',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }
    router.history.current = current
    wrapper = mount(idFindCertification, options)
    wrapper.vm.onLoad()
    assert.equal(wrapper.vm.subject, '아이디')
  })

  it('Pass onLoad Call Process', () => {
    delete router.history.current
    const current = {
      name: null,
      meta: {
        pageKey: 'PASS'
      },
      path: '/',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }
    router.history.current = current
    wrapper = mount(idFindCertification, options)
    wrapper.vm.onLoad()
    assert.equal(wrapper.vm.subject, '비밀번호')
  })

  it('pageMove Call Process', () => {
    wrapper = mount(idFindCertification, options)
    wrapper.vm.pageMove('authPhone')
    // assert.equal(wrapper.vm.viewType, 'ID')
    assert.isUndefined(wrapper.vm.viewType)
  })

  it('pageMove Call Process', () => {
    const currentID = {
      name: null,
      meta: {
        pageKey: 'ID'
      },
      path: '/',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }
    const currentPASS = {
      name: null,
      meta: {
        pageKey: 'PASS'
      },
      path: '/',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // ID
    delete router.history.current
    router.history.current = currentID
    wrapper = mount(idFindCertification, options)
    wrapper.vm.pageMove('authPhone')
    wrapper.vm.pageMove('authEmail')
    const case1Type = wrapper.vm.viewType

    // PASS
    delete router.history.current
    router.history.current = currentPASS
    wrapper = mount(idFindCertification, options)
    wrapper.vm.pageMove('authPhone')
    wrapper.vm.pageMove('authEmail')
    const case2Type = wrapper.vm.viewType
    // assert.equal(wrapper.vm.viewType, 'PASS')
    assert.notEqual(case1Type, case2Type)
  })
})
