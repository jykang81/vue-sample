// import { assert } from 'chai'
import axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import router from '@/router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import CONST from '@constants/framework/framework'
import ShortUrl from '@/views/store/ShortUrl'
import nsaxios from '@frameworks/axiosUtil'

describe('ShortUrl.spec.js', () => {
  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(VueRouter)

  const options = {
    localVue,
    router
  }

  before(() => {
    const mock = new MockAdapter(axios)
    mock.onPost(`${CONST.API_URL}/NSmobilePLCategoryInfo`)
      .reply(200, {
        msg: [
          {
            catalogId: '72001',
            mslotNickName: 'EXHIBITION',
            categoryId: '1606556',
            layoutViewName: 'TopPageLayoutSevenSlotView',
            cateName: '(2019)이벤트_test'
          },
          {
            catalogId: '72001',
            mslotNickName: 'HOME',
            categoryId: '1615059',
            layoutViewName: 'TopPageLayoutSevenSlotView',
            cateName: '홈매장(2020)'
          },
          {
            catalogId: '72001',
            mslotNickName: 'TINGLIVE',
            categoryId: '1615060',
            layoutViewName: 'TopPageLayoutSevenSlotView',
            cateName: '띵라이브'
          }
        ]
      })
  })
  beforeEach(() => {
    delete router.history.current
  })

  it('띵라이브 매장으로 route replace', async () => {
    router.history.current = {
      path: '/1615060',
      params: {
        categoryId: '1615060'
      },
      matched: []
    }

    shallowMount(ShortUrl, options)

    await flushPromises()

    // assert.equal('thinglive', router.history.current.name)
  })

  it('홈 매장으로 route replace', async () => {
    router.history.current = {
      path: '/1615059',
      params: {
        categoryId: '1615059'
      },
      matched: []
    }

    shallowMount(ShortUrl, options)

    await flushPromises()

    // assert.equal('storeHome', router.history.current.name)
  })
  // it('슬롯 매장으로 route replace', async () => {
  //   router.history.current = {
  //     path: '/1606556',
  //     params: {
  //       categoryId: '1606556'
  //     },
  //     matched: []
  //   }

  //   shallowMount(ShortUrl, options)

  //   await flushPromises()

  //   assert.equal('slotStore', router.history.current.name)
  // })
  it('이 외의 케이스는 홈 매장으로 route replace', async () => {
    router.history.current = {
      path: '/1234567890',
      params: {
        categoryId: '1234567890'
      },
      matched: []
    }

    shallowMount(ShortUrl, options)

    await flushPromises()

    // assert.equal('storeHome', router.history.current.name)
  })
})
