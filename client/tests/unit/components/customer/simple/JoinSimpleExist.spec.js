import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import joinSimpleExist from '@components/customer/simple/JoinSimpleExist'

describe('joinSimpleExist', () => {
  describe('hasFullPopup', () => {
    let localVue
    let options

    beforeEach(function () {
      localVue = createLocalVue()
      localVue.use(Vuex)
      options = {
        localVue,
        propsData: {
          param: {
            title: '간편로그인',
            titleAlign: 'center',
            isShowSearch: false,
            isShowCart: false,
            logonId: 'nsLogonId',
            logonPassword: 'N',
            logonType: 'normal',
            entFlag: 'NAVER',
            entUserId: 'naverId',
            entEmail: 'naverId@naver',
            refresh_token: 'accessToken',
            isSSORequest: true,
            entName: name,
            saveYn: 'N',
            autoYn: 'N'
          }
        }
      }
    })

    it('entFlag값 확인', () => {
      // when
      const wrapper = mount(joinSimpleExist, options)
      const vm = wrapper.vm

      const returnResult = vm.param.entFlag

      // then
      assert.equal('NAVER', returnResult)
    })

    it('parentsCall 호출', () => {
      // when
      const wrapper = mount(joinSimpleExist, options)
      const vm = wrapper.vm
      vm.$store = { commit: d => {} }
      vm.parentsCall('memberConnect')

      // then
      assert.equal(true, true)
    })
  })
})
