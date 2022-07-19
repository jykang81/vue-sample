import Vue from 'vue'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import Banner15SlideList from '@/views/store/module/Banner15SlideList'
import firstResponse from '@unit/views/store/mock/firstResponse'

describe('Banner15SlideList', () => {
  let localVue
  let options
  let wrapper

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('img-lazy-load', {})
    const propsParam = {
      espotData: firstResponse.msg.espotList[2]._EZ_HOME_TOPE_ESPOT_CNTNTSLIDE15W,
      espotExtendList: firstResponse.msg.espotExtendList._EZ_HOME_TOPE_ESPOT_CNTNTSLIDE15W
    }
    options = {
      localVue,
      store,
      propsData: propsParam
    }
    wrapper = shallowMount(Banner15SlideList, options)
  })

  it('data() 체크.', () => {
    const defaultData = wrapper.vm.data
    console.debug('[ defaultData ]\n', defaultData)
  })

  it('setChildEspotData test.', () => {
    wrapper.vm.espotData = [{ aaa: 'bbb' }]
    wrapper.vm.setChildEspotData()
  })
})
