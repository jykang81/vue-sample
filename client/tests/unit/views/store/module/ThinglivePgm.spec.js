import ThinglivePgm from '@/views/store/module/ThinglivePgm'
import { pgmTab, pgmVod } from '@unit/views/store/mock/thinglive'
import { mount } from '@vue/test-utils'
import { assert } from 'chai'
import nsaxios from '@frameworks/axiosUtil'
import Vue from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'

const responseData = pgmTab.msg
let wrapper

// $nsaxios 추가
Vue.prototype.$nsaxios = nsaxios

describe('ThinglivePgm', () => {
  before(() => {
    const mock = new MockAdapter(axios)
    mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`)
      .reply(200, pgmVod)
  })

  beforeEach(function () {
    wrapper = mount(ThinglivePgm, {
      propsData: {
        responseData
      }
    })
  })

  describe('computed', () => {
    it('dateUtil', () => {
      assert.isNotNull(wrapper.vm.dateUtil)
    })
  })

  describe('methods', () => {
    it('setPgmAreaTitle', () => {
      const title = responseData.espotExtendList._EZ_THING_LIVE_VODPGMCATE.titleContent.mainTitle
      wrapper.vm.setPgmAreaTitle(title)
      assert.equal(wrapper.vm.pgmAreaTitle, title)
    })

    it('setPgmTab', () => {
      const tab = responseData.espotList[0]._EZ_THING_LIVE_VODPGMCATE
      wrapper.vm.setPgmTab(tab)
      assert.equal(wrapper.vm.currentCategoryId, tab[0].categoryId)
    })

    it('getPgmVod', async () => {
      wrapper.vm.getPgmVod()
    })

    it('onClickPgmTab', () => {
      const index = 0
      const categoryId = responseData.espotList[0]._EZ_THING_LIVE_VODPGMCATE.categoryId
      wrapper.vm.onClickPgmTab(index, categoryId)
      assert.equal(wrapper.vm.pageIdx, 0)
      assert.equal(wrapper.vm.currentTab, index)
      assert.equal(wrapper.vm.currentCategoryId, categoryId)
      assert.equal(wrapper.vm.loadVideoPlayer, false)
    })

    it('initScrollObject', () => {
      wrapper.vm.initScrollObject()
      assert.equal(wrapper.vm.isLoading, false)
      assert.equal(wrapper.vm.scrollObject.callback, wrapper.vm.getPgmVod)
      assert.equal(wrapper.vm.scrollObject.isEnable, true)
      assert.equal(wrapper.vm.scrollObject.interval, 500)
      assert.equal(wrapper.vm.scrollObject.triggerHeightPercent, 80)
    })
  })
})
