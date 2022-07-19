import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import NaverPopupLinkReturn from '@/views/customer/login/simple/NaverPopupLinkReturn'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('NaverPopupLinkReturn', () => {
  let mock

  let localVue
  let options
  let wrapper
  const realLocation = window.location
  const url = `${CONST.API_URL}/jsp/epg/MobileSimpleLoginData.jsp`

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    Vue.prototype.$store = store
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    // localVue.use(window.location.href = 'https://local.nsmall.com:3000/customer/login/simple/kakao?code=WSOqQpllTeeu7CQkWp3excmp&state=821_http')
    // window.location = realLocation

    options = {
      localVue,
      router,
      store,
      realLocation
    }

    wrapper = mount(NaverPopupLinkReturn, options)
  })

  // 마운트 할 때 컴포넌트 인스턴스를 검사합니다.
  it('url정보 취득 ', () => {
    delete window.location
    // @ts-ignore
    window.location = new URL('https://local.nsmall.com:3000/customer/login/simple/kakao?code=WSOqQpllTeeu7CQkWp3excmp&state=821_http')

    const mockResponseResult = {
      msg: {
        root: {
          Logonresult: {
            Email: 'lsd25@naver.com',
            access_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
            fnType: 'memberConnect',
            isShowSearch: false,
            logonId: '6338379',
            entUserId: '6338379',
            name: '나선영',
            title: '간편로그인',
            titleAlign: 'center'
          }
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    wrapper.vm.onLoad()
    assert.notEqual(wrapper.vm.hpUrl, '')
  })
})
