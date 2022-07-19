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

import Cntnt4w from '@/components/store/slot/cntnt/Cntnt4w'

describe('Cntnt4w 테스트', () => {
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
        '': {
          clickTarget: '',
          contentsId: '',
          clickCode: '',
          espotId: '',
          mdUrl: '',
          imgUrl: '',
          marketingText: ''
        }
      },
      espotExtendData: {
        '': {
          titleContent: {
            mainTitle: '',
            subTitle: '',
            clickTarget: '',
            contentsId: '',
            clickCode: '',
            espotId: '',
            mdUrl: ''
          }
        }

      },
      totalOrgan: {
      }
    }
  }

  before(() => {
    axios.defaults.timeout = 100000
    wrapper = mount(Cntnt4w, options)
  })

  it('computed - bizUtil', () => {
    assert.isNotNull(wrapper.vm.bizUtil)
  })
  it('computed - getId', () => {
    assert.isEmpty(wrapper.vm.getId)
  })
  it('espotDraw', () => {
    wrapper.vm.espotDraw()
    assert.isTrue(true)
  })
})
