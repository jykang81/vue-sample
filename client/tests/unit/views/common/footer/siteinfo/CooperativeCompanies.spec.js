import { assert } from 'chai' // 필수
import { mount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
// import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import CooperativeCompanies from '@/views/common/footer/siteinfo/CooperativeCompanies'

describe('CooperativeCompanies', () => {
  let localVue
  let options
  let wrapper
  let vm
  let mock

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    options = {
      localVue,
      store,
      router
    }

    Vue.prototype.$nsaxios = nsaxios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock
      .onPost(`${CONST.API_URL}/CnsgnmntBizPrtnrM`)
      .reply(200, {
        msg: {
          root: {
            jsonArrCnsgnmntBizPrtnr: [
              {
                VNDRNM: '아이타올(주)'
              }
            ]
          }
        }
      })

    wrapper = mount(CooperativeCompanies, options)
    vm = wrapper.vm
  })

  after(() => {
    mock.reset()
  })

  describe('setCooperativeCompanies', () => {
    it('협력사 목록 할당한다.', () => {
      vm.setCooperativeCompanies({
        msg: {
          root: {
            jsonArrCnsgnmntBizPrtnr: [
              {
                VNDRNM: '아이타올(주)'
              }
            ]
          }
        }
      })
    })
  })

  describe('showMoreCompany', () => {
    it('회사 더표시하기 노출한다.', () => {
      vm.showMoreCompany()
    })
  })

  describe('hasOthereCompanyToShow', () => {
    it('더 표시할 회사 존재 여부를 반환한다', () => {
      const isShow = vm.hasOthereCompanyToShow()
      assert.equal(isShow, false)
    })
  })
})
