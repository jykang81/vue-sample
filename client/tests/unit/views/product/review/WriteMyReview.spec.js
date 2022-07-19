import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import WriteMyReview from '@/views/product/review/WriteMyReview'

import { writeReviewResponse, getRitedReviewResponse, modifyReviewResponse } from '@unit/views/product/review/mock/reviewResponse'

describe('마이페이지 > 상품평 관리 > 상품평 작성/수정', () => {
  let mock
  let index = 0
  let options

  const localVue = createLocalVue()

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios
  })

  beforeEach(() => {
    mock.reset() // reset mock adapter

    delete router.history.current
    if (index < 3) {
      router.history.current = {
        name: 'writeMyReview',
        meta: {},
        path: '/product/review/write',
        hash: '',
        query: {
          catGb: '10',
          goodsName: '불고기브라더스',
          option: 'COLOR%20단품속성',
          dan_catentry_id: 10020565405,
          orders_id: 300011325008
        },
        params: {
          id: '14740166'
        },
        fullPath: '/',
        matched: []
      }
    } else {
      router.history.current = {
        name: 'modifyMyReview',
        meta: {},
        path: '/product/review/modify',
        hash: '',
        query: {
          catGb: '30',
          goodsName: '유료배송비_수수료_반품_교환배송비',
          dan_catentry_id: 10118773508,
          goodgrdSeq: 2517353,
          orders_id: 300011325010,
          photoYN: 'Y'
        },
        params: {
          id: '20941718'
        },
        fullPath: '/',
        matched: []
      }
    }

    options = {
      localVue,
      router,
      store
    }

    index++
  })

  it('created', () => {
    const wrapper = mount(WriteMyReview, options)

    assert.equal(wrapper.vm.productId, router.history.current.params.id)
    assert.equal(wrapper.vm.catGb, router.history.current.query.catGb)
    assert.equal(wrapper.vm.goodsName, router.history.current.query.goodsName)
    assert.equal(wrapper.vm.option, router.history.current.query.option)
    assert.equal(wrapper.vm.danCatentryId, router.history.current.query.dan_catentry_id)
    assert.equal(wrapper.vm.ordersId, router.history.current.query.orders_id)
    assert.equal(wrapper.vm.pageType, 'write')
    assert.equal(wrapper.vm.isTextareaHide, true)

    // 취소 버튼 클릭
    wrapper.vm.cancelWrite()
  })

  it('isReady', () => {
    const wrapper = mount(WriteMyReview, options)

    assert.equal(wrapper.vm.isReady, false)

    wrapper.vm.catePicked.item1 = 3
    wrapper.vm.catePicked.item2 = 3
    wrapper.vm.catePicked.item3 = 3
    wrapper.vm.catePicked.item4 = 5
    wrapper.vm.catePicked.item5 = 10
    wrapper.vm.catePicked.item6 = 10
    wrapper.vm.reviewTextarea = 'asdfkljaskldefjklaswejflk;asjdklf'

    assert.equal(wrapper.vm.isReady, true)
  })

  it('regReview & writeReview', async () => {
    router.history.current.query.catGb = '30'
    const wrapper = mount(WriteMyReview, options)

    mock
      .onPost(`${CONST.API_URL}/NSAjaxCustomerReview`)
      .reply(200, writeReviewResponse)

    wrapper.vm.regReview()
    await flushPromises()

    wrapper.vm.catePicked.item1 = 1
    wrapper.vm.catePicked.item2 = 3
    wrapper.vm.catePicked.item3 = 3
    wrapper.vm.catePicked.item4 = 5
    wrapper.vm.catePicked.item5 = 10
    wrapper.vm.catePicked.item6 = 10
    wrapper.vm.reviewTextarea = ''
    wrapper.vm.regReview()
    await flushPromises()

    wrapper.vm.reviewTextarea = 'asd'
    wrapper.vm.regReview()
    await flushPromises()

    wrapper.vm.reviewTextarea = 'asdfkljaskldefjklaswejflk;asjdklf'
    wrapper.vm.regReview()
    await flushPromises()
  })

  it('getWirtedReview', async () => {
    const wrapper = mount(WriteMyReview, options)

    mock
      .onPost(`${CONST.API_URL}/NSAjaxProductReview`)
      .reply(200, getRitedReviewResponse)

    wrapper.vm.getWirtedReview()
    await flushPromises()
  })

  it('regReview & modifyReview', async () => {
    const wrapper = mount(WriteMyReview, options)

    mock
      .onPost(`${CONST.API_URL}/NSAjaxProductReview`)
      .reply(200, modifyReviewResponse)

    wrapper.vm.modifyReview()
    await flushPromises()
  })

  it('removeImage', async () => {
    const wrapper = mount(WriteMyReview, options)

    mock
      .onPost(`${CONST.API_URL}/NSAjaxProductReview`)
      .reply(200, getRitedReviewResponse)

    wrapper.vm.storedFiles.push({ src: 'test' })
    wrapper.vm.storedFiles.push({ src: 'test' })
    wrapper.vm.storedFiles.push({ src: 'test' })

    wrapper.vm.removeImage(1)
    await flushPromises()

    assert.equal(wrapper.vm.storedFiles.length, 2)
  })

  it('checkReviewLength', () => {
    const wrapper = mount(WriteMyReview, options)

    mock
      .onPost(`${CONST.API_URL}/NSAjaxProductReview`)
      .reply(200, getRitedReviewResponse)

    wrapper.vm.reviewTextarea = 'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ'
    wrapper.vm.checkReviewLength()
  })

  it('removePlistImage', async () => {
    const wrapper = mount(WriteMyReview, options)

    mock
      .onPost(`${CONST.API_URL}/NSAjaxProductReview`)
      .reply(200, getRitedReviewResponse)

    wrapper.vm.writedPlist = [
      { filePath: 'itemval/353/2517353_1.jpg', fileSeq: 1, goodgrdSeq: 2517353, index: 1 },
      { filePath: 'itemval/353/2517353_2.jpg', fileSeq: 2, goodgrdSeq: 2517353, index: 2 },
      { filePath: 'itemval/353/2517353_3.png', fileSeq: 3, goodgrdSeq: 2517353, index: 3 }
    ]

    wrapper.vm.removePlistImage(wrapper.vm.writedPlist[1])
    await flushPromises()

    assert.equal(wrapper.vm.removePlistSeq.length, 1)
  })
})
