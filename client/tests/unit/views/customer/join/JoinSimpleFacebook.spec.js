
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'
import JoinSimpleFacebook from '@/views/customer/join/JoinSimpleFacebook'

import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('JoinSimpleFacebook', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
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
      logonId: 'ns9981@naver.com',
      Email: 'ns9981@naver.com',
      access_token: null,
      name: '나선영',
      entFlag: 'FACEBOOK',
      gender: '',
      birthday: ''
    },
    fullPath: '/',
    matched: []
  }
  router.history.current = current

  const options = {
    localVue,
    router,
    store
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof JoinSimpleFacebook.data, 'function')
    const defaultData = JoinSimpleFacebook.data()
    assert.equal(defaultData.idParams.isSuccess, false)
  })

  describe('함수 처리', () => {
    it('created 함수', () => {
      const wrapper = mount(JoinSimpleFacebook, options)
      const vm = wrapper.vm
      assert.notEqual('', vm.idParams.value)
    })

    it('페이스북 준회원등록 처리', async () => {
      delete router.history.current
      const current = {
        name: null,
        meta: {},
        path: '/',
        hash: '',
        query: {},
        params: {
          logonId: 'ns9981@naver.com',
          Email: 'ns9981@naver.com',
          access_token: null,
          name: '나선영',
          entFlag: 'FACEBOOK',
          gender: '',
          birthday: ''
        },
        fullPath: '/',
        matched: []
      }
      router.history.current = current
      const wrapper = mount(JoinSimpleFacebook, options)
      const vm = wrapper.vm
      vm.isCheckAgree = true

      const responseResult = {
        msg: {
          root: {
            snsregistcheck: {
              processMsg: '',
              processCode: 'S'
            }
          }
        }
      }

      const url = `${CONST.API_URL}/NSSessionCheckMobile`

      const compResponseResult = {
        msg: {
          root: {
            Registresult: {
              resultMsg: '',
              resultCode: 'Y'
            },
            memberInfo: {
              logonId: 'lsd251@nsmall.com'
            }
          }
        }
      }

      const compUrl = `${CONST.API_URL}/RegistrationCompleteViewMobile`

      try {
        mock
          .onPost(url)
          .reply(200, responseResult)

        mock
          .onPost(compUrl)
          .reply(200, compResponseResult)

        vm.joinFacebooSimple()

        await flushPromises()
        await wrapper.vm.$nextTick()
        assert.equal(true, vm.isCheckAgree)
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })
})
