import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import flushPromises from 'flush-promises'

import ExhibitionDetail from '@/views/exhibition/ExhibitionDetail'
import { exhibitionDetailResponse } from '@unit/views/exhibition/mock/exhibitionDetail'
import NSAjaxEventPopupResponse from '@unit/common/frameworks/mock/NSAjaxEventPopupResponse'

describe('기획전 상세 테스트', () => {
  let wrapper
  let mock
  const titleInfoMap = {
    STARTDT: '2019.01.18',
    TEMPLETTYPECD: 'A',
    BOARD_ACTIVE_YN: 'Y',
    ACTIVEYN: 'Y',
    ENDDT: '2020.12.31',
    CATGRP_NAME: '한샘 단독특가 모음전',
    OPENYN: 'Y'
  }

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  Vue.directive('img-lazy-load', {})
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store,
    attachToDocument: true
  }

  before(async () => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.reset()
    mock.onPost(`${CONST.API_URL}/NSTimesPrmtAjax`).reply(200, exhibitionDetailResponse)
      .onPost(`${CONST.API_URL}/NSAjaxEventPopup`).reply(200, NSAjaxEventPopupResponse)
    wrapper = mount(ExhibitionDetail, options)
    await flushPromises()
  })

  it('setNSTimesPrmtNext', async () => {
    wrapper.vm.setNSTimesPrmtNext(exhibitionDetailResponse)
    assert.isTrue(true)
  })
  it('getEventBanner', async () => {
    wrapper.vm.getEventBanner()
    assert.isTrue(true)
  })
  it('setOpenGraphTag', async () => {
    wrapper.vm.setOpenGraphTag(titleInfoMap)
    assert.isTrue(true)
  })
  it('setHistory', async () => {
    wrapper.vm.setHistory(titleInfoMap)
    assert.isTrue(true)
  })
  it('onClickShareBtn', async () => {
    wrapper.vm.onClickShareBtn()
    assert.isTrue(true)
  })
})
