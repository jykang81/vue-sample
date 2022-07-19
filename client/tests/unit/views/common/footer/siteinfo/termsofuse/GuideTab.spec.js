import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import store from '@/vuex'
import router from '@/router'
import GuideTab from '@/views/common/footer/siteinfo/termsofuse/GuideTab'
import { nativeTestUtil } from '@unit/testUtil'

describe('GuideTab', () => {
  let localVue
  let options

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
  })

  beforeEach(() => {
    options = {
      localVue,
      store,
      router,
      propsData: {
        currentTab: 'tab1'
      }
    }
  })

  describe('gotoTermsOfUseNsmall', () => {
    it('버튼을 클릭하면 이용약관 페이지로 이동한다', async () => {
      options.propsData.currentTab = 'tab1'

      const wrapper = mount(GuideTab, options)
      wrapper.find('button.active').trigger('click')

      await flushPromises()
    })

    it('버튼을 클릭하면 이용약관 페이지로 이동한다 (App)', async () => {
      nativeTestUtil.setMockNativeUtil()
      options.propsData.currentTab = 'tab1'

      const wrapper = mount(GuideTab, options)
      wrapper.find('button.active').trigger('click')

      await flushPromises()
      nativeTestUtil.clearMockNativeUtil()
    })
  })

  describe('gotoTermsOfUseTvAndSb', () => {
    it('버튼을 클릭하면 쇼핑북 안내 페이지로 이동한다', async () => {
      options.propsData.currentTab = 'tab2'

      const wrapper = mount(GuideTab, options)
      wrapper.find('button.active').trigger('click')

      await flushPromises()
    })

    it('버튼을 클릭하면 쇼핑북 안내 페이지로 이동한다 (App)', async () => {
      nativeTestUtil.setMockNativeUtil()
      options.propsData.currentTab = 'tab2'

      const wrapper = mount(GuideTab, options)
      wrapper.find('button.active').trigger('click')

      await flushPromises()
      nativeTestUtil.clearMockNativeUtil()
    })
  })
})
