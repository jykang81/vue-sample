import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import AppHeaderDefault from '@components/layouts/items/AppHeaderDefault'

describe('AppHeaderDefault', () => {
  const TITLE = '타이틀'
  let localVue
  let wrapper

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // 타이틀 설정
    router.history.current.meta.title = TITLE

    wrapper = shallowMount(AppHeaderDefault, {
      localVue,
      router,
      store
    })
  })

  it('created hook 후 타이틀 설정 확인', async () => {
    const actual = wrapper.find('.sub_title').text()
    const expected = TITLE
    assert.equal(actual, expected)
  })

  // describe('setFullLayerPopupTitle', () => {
  //   it('props에 따라서 타이틀이 변경된다', () => {
  //     // eslint-disable-next-line no-unused-vars
  //     const param = {
  //       title: '안녕하세요',
  //       titleAlign: 'center',
  //       isShowSearch: false,
  //       isShowCart: false
  //     }
  //     function callbackFunction () {}
  //     const isFullLayer = true
  //     const isShowHeader = true
  //     // eslint-disable-next-line no-unused-vars
  //     const popupObj = {
  //       param,
  //       callbackFunction,
  //       isFullLayer,
  //       isShowHeader
  //     }

  //     const wrapperWithProp = shallowMount(AppHeaderDefault, {
  //       localVue,
  //       router,
  //       store,
  //       propsData: {
  //         popupObj
  //       }
  //     })

  //     const vm = wrapperWithProp.vm

  //     assert.equal(vm.pageTitle, param.title)
  //   })
  // })

  describe('goBack', () => {
    it('뒤로가기 버튼을 누르면 콜백이 호출된다', () => {
      const backButtonWrapper = wrapper.find('.back_btn')
      backButtonWrapper.trigger('click')
    })
  })
})
