import Vue from 'vue'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import { assert } from 'chai'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CustCenterMain from '@/views/custcenter/CustCenterMain'

describe('고객센터', () => {
  const localVue = createLocalVue()

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  it('main', () => {
    const wrapper = mount(CustCenterMain, options)

    assert.equal(wrapper.vm.categories[0].displayName, '홈')
    assert.equal(wrapper.vm.categories[1].displayName, 'FAQ')
    assert.equal(wrapper.vm.categories[2].displayName, '문의내역')
    assert.equal(wrapper.vm.categories[3].displayName, '공지사항')

    wrapper.vm.categoryPathLogging()
  })
})
