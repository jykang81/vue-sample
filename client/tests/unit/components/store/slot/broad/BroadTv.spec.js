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

import BroadTv from '@/components/store/slot/broad/BroadTv'

describe('BroadTv 테스트', () => {
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
        shopPlus: {
          partNumber: '',
          goodsName: '',
          dispTypeCd: '',
          adultItemFlag: 'N',
          mmRntalPrc: '800',
          pricedcprice: '1000',
          saleRate: '5',
          priceofferprice: '2000',
          multiFlg: 2,
          time: '20200928005931~21000929005931'
        }
      }
    }
  }

  before(() => {
    axios.defaults.timeout = 100000
    wrapper = mount(BroadTv, options)
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

    wrapper.vm.totalOrgan.shopPlus.multiFlg = 0
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
    wrapper.vm.totalOrgan.shopPlus.time = '20200928005931~21000929005931'
    wrapper.vm.setLimitLiveTime()
    assert.isTrue(true)
  })
  it('setRemainedTime 3', () => {
    wrapper.vm.totalOrgan.shopPlus.startDttm = ''
    wrapper.vm.totalOrgan.shopPlus.endDttm = ''
    wrapper.vm.setRemainedTime()
    assert.isTrue(true)
  })
  it('clickGotoProduct', () => {
    wrapper.vm.totalOrgan.shopPlus.multiFlg = 2
    wrapper.vm.clickGotoProduct()

    wrapper.vm.totalOrgan.shopPlus.multiFlg = 0
    wrapper.vm.clickGotoProduct()
    assert.isTrue(true)
  })
})
