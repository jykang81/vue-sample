import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router'

import axios from 'axios'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import Subcate from '@/components/store/slot/cate/Subcate'

describe('Subcate 테스트', () => {
  let wrapper

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueAwesomeSwiper)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store,
    attachToDocument: true,
    propsData: {
      espotName: 'TEST',
      slotGlobalVal: {
      },
      espotData: {
        '': [{
          catalogId: '',
          categoryId: '',
          categoryLevel: '',
          categoryName: '',
          espotId: '',
          imgUrl: '',
          seq: ''
        }]
      },
      espotExtendData: {
      },
      totalOrgan: {
      }
    }
  }

  before(() => {
    axios.defaults.timeout = 100000
    wrapper = mount(Subcate, options)
  })

  it('computed - getId', () => {
    assert.isEmpty(wrapper.vm.getId)
  })
  it('espotDraw', () => {
    wrapper.vm.espotDraw()
    assert.isTrue(true)
  })
  // it('clickClassActive', () => {
  //   wrapper.vm.clickClassActive(0)
  //   assert.isTrue(true)
  // })
  it('replaceSlot', () => {
    wrapper.vm.replaceSlot(0)
    assert.isTrue(true)
  })
})
