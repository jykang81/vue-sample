import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import AnchorToday from '@/views/store/module/AnchorToday'
import secondResponse from '@unit/views/store/mock/secondResponse'
import router from '@/router'
import VueRouter from 'vue-router'

describe('AnchorToday test case', () => {
  let localVue
  let options
  let wrapper

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('document', document)
    Vue.directive('window', window)
    Vue.directive('img-lazy-load', {})

    delete router.history.current
    const current = {
      name: null,
      meta: {},
      path: '/',
      hash: '',
      query: {},
      params: {
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    const propsParam = {
      espotData: {
        espotList: {
          _EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE:
            secondResponse.msg.espotList[4]._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE,
          _EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W:
            secondResponse.msg.espotList[5]._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W,
          _EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W:
            secondResponse.msg.espotList[6]._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W
        },
        espotExtendList: {
          _EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE,
          _EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W,
          _EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W
        }
      }
    }
    options = {
      localVue,
      store,
      router,
      propsData: propsParam
    }
    wrapper = shallowMount(AnchorToday, options)
  })

  it('data() check', () => {
    const defaultData = wrapper.vm.data
    console.debug('[ defaultData ]\n', defaultData)
  })

  it('keywordClicked test', () => {
    wrapper.vm.keywordClicked('keyword123')
  })

  it('searchSubmit test', () => {
    wrapper.vm.searchKeyword = 'keyword123'
    wrapper.vm.searchSubmit()
  })

  it('setUpDownNewSameClass test', () => {
    wrapper.vm.setUpDownNewSameClass('UP')
    wrapper.vm.setUpDownNewSameClass('DOWN')
    wrapper.vm.setUpDownNewSameClass('SAME')
    wrapper.vm.setUpDownNewSameClass('NEW')
    wrapper.vm.setUpDownNewSameClass('')
  })
})
