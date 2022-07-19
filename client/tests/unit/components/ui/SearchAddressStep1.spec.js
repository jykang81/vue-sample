import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
// import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import SearchAddressStep1 from '@components/common/SearchAddressStep1'
// import NsInput from '@components/common/NsInput'
import CONST from '@constants/framework/framework'
// import { getProcessedWCSParameter } from '@unit/testUtil'

(function (window) {
  window.event = {}
  window.event.keyCode = 13
})(window)

describe('SearchAddressStep1', () => {
  let localVue
  let options

  describe('searchAddress', () => {
    it('검색어를 기입하고 도로명을 검색하면, 도로명 목록을 API 서버로부터 반환 받는다', async () => {
      localVue = createLocalVue()
      localVue.use(Vuex)
      localVue.use(VueRouter)

      options = {
        localVue,
        store,
        router,
        propsData: {
          addressInfo: {
            roadAddress: '',
            is1Dept: false
          }
        }
      }

      // mock axios
      axios.defaults.timeout = 100000
      const mock = new MockAdapter(axios)
      const mockResponseResult = {
        postList: [
          {
            NADR1: '강원 강릉시 사천면 뒷말길',
            ZIP: '25435',
            ZIPS: '607',
            NADR3: '118-66',
            ADR1: '강원 강릉시 사천면',
            NNMB: '4215036024102380002000001',
            NNMR: '421504460361',
            RI: '판교리',
            BLD: '',
            BUNJI: '238-2',
            BJC: '4215036024'
          },
          {
            NADR1: '강원 강릉시 사천면 뒷말길',
            ZIP: '25435',
            ZIPS: '607',
            NADR3: '118-68',
            ADR1: '강원 강릉시 사천면',
            NNMB: '4215036024102380002000002',
            NNMR: '421504460361',
            RI: '판교리',
            BLD: '',
            BUNJI: '238-30',
            BJC: '4215036024'
          }
        ]
      }

      const wrapper = mount(SearchAddressStep1, options)

      const url = `${CONST.API_URL}/NSNewPostSearchCmd`
      /**
       * 어댑터 설정 적용
       * mock.onGet('/apple') method: get,  url: '/apple'
       * mock.onPost('banana') method: post, url: '/banana'
       * mock.onAny('cherry') method: get, post, etc..., url: 'cherry'
       */
      mock
        .onPost(url)
        .reply(200, mockResponseResult)

      wrapper.vm.searchEnter('address')

      wrapper.vm.searchEnter('dong')

      wrapper.vm.searchEnter('send')

      wrapper.vm.searchAddress()

      wrapper.vm.addressParams.value = 'tt'
      wrapper.vm.searchAddress()

      wrapper.vm.searchAddressDong()

      wrapper.vm.addressDongParams.value = 'tt'
      wrapper.vm.searchAddressDong()

      wrapper.vm.isSearchDong = true
      wrapper.vm.choiceAddress({ zipCode: 'zip', defAddr: 'defAddr', bld_nm: 'bld_nm', is1Dept: false })

      wrapper.vm.isSearchDong = false
      wrapper.vm.choiceAddress({ ZIP: 'zip', NADR1: 'defAddr', NADR3: 'bld_nm', is1Dept: false })

      wrapper.vm.sendAddress()

      wrapper.vm.otherAddressParams.value = 'ttt'
      wrapper.vm.sendAddress()
    })
  })
})
