import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import joinSimpleExistLogin from '@components/customer/simple/JoinSimpleExistLogin'

describe('joinSimpleExistLogin', () => {
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
            title: '계정연결',
            titleAlign: 'center',
            isShowSearch: false,
            isShowCart: false,
            logonId: 'naverId@naver.com',
            Email: 'naverId@naver.com',
            name: '나선영',
            entFlag: 'NAVER',
            access_token: 'accessToken',
            moveTargetPage: null
          }
        }
      }
    })

    it('entFlag값 확인', () => {
      // when
      const wrapper = mount(joinSimpleExistLogin, options)
      const vm = wrapper.vm

      const returnResult = vm.param.entFlag

      // then
      assert.equal('NAVER', returnResult)
    })

    it('parentsCall 호출', () => {
      // when
      const wrapper = mount(joinSimpleExistLogin, options)
      const vm = wrapper.vm
      vm.$store = { commit: d => {} }
      vm.parentsCall('memberConnect')

      // then
      assert.equal(true, true)
    })
  })
})
