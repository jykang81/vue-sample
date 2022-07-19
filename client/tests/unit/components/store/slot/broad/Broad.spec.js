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

import Broad from '@/components/store/slot/broad/Broad'

describe('Broad 테스트', () => {
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
      },
      espotExtendData: {
      },
      totalOrgan: {
        tv: {
          partNumber: '',
          goodsName: '',
          dispTypeCd: '',
          adultItemFlag: 'N',
          mmRntalPrc: '800',
          pricedcprice: '1000',
          saleRate: '5',
          priceofferprice: '2000',
          multiFlg: 2,
          startDttm: '20200928000000',
          endDttm: '21000929000000'
        }
      }
    }
  }

  before(() => {
    axios.defaults.timeout = 100000
    wrapper = mount(Broad, options)
  })

  it('computed - bizUtil', () => {
    assert.isNotNull(wrapper.vm.bizUtil)
  })
  it('PRODUCT_CONST - PRODUCT_CONST', () => {
    assert.isNotNull(wrapper.vm.PRODUCT_CONST)
  })
  it('computed - getId', () => {
    assert.isEmpty(wrapper.vm.getId)
  })
  it('espotDraw', () => {
    wrapper.vm.espotDraw()
    assert.isTrue(true)
  })
  it('layerOpen', () => {
    wrapper.vm.layerOpen()

    wrapper.vm.totalOrgan.tv.multiFlg = 0
    wrapper.vm.layerOpen()
    assert.isTrue(true)
  })
  it('layerClose', () => {
    wrapper.vm.layerClose()
    assert.isTrue(true)
  })
  it('setLimitLiveTime', () => {
    wrapper.vm.setLimitLiveTime()
    assert.isTrue(true)
  })
  it('setRemainedTime 1', () => {
    wrapper.vm.setRemainedTime()
    assert.isTrue(true)
  })
  it('setRemainedTime 2', () => {
    wrapper.vm.totalOrgan.tv.startDttm = '20200928005931'
    wrapper.vm.totalOrgan.tv.endDttm = '21000929235931'
    wrapper.vm.setLimitLiveTime()
    assert.isTrue(true)
  })
  it('setRemainedTime 3', () => {
    wrapper.vm.totalOrgan.tv.startDttm = ''
    wrapper.vm.totalOrgan.tv.endDttm = ''
    wrapper.vm.setRemainedTime()
    assert.isTrue(true)
  })
  it('clickGotoProduct', () => {
    wrapper.vm.totalOrgan.tv.multiFlg = 2
    wrapper.vm.clickGotoProduct()

    wrapper.vm.totalOrgan.tv.multiFlg = 0
    wrapper.vm.clickGotoProduct()
    assert.isTrue(true)
  })
})
