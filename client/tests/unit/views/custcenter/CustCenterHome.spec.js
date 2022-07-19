import Vue from 'vue'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CustCenterHome from '@/views/custcenter/CustCenterHome'

describe('고객센터 > 홈', () => {
  const localVue = createLocalVue()

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  it('moveChatCounseling 시간 내', async () => {
    const wrapper = mount(CustCenterHome, options)

    wrapper.vm.moveChatCounseling()
    wrapper.vm.searchInputLogging()
    wrapper.vm.categoryClickLogging()
    wrapper.vm.categoryClickLogging()
    wrapper.vm.inquiryClickLogging()
    wrapper.vm.telClickLogging()
  })

  it('moveChatCounseling 시간 외', async () => {
    const wrapper = mount(CustCenterHome, options)

    wrapper.vm.nowTime = 80000
    wrapper.vm.moveChatCounseling()
  })
})
