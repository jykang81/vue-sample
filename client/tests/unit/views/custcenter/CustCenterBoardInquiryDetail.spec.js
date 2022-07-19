import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  mount,
  createLocalVue
} from '@vue/test-utils'
import {
  assert
} from 'chai'
import router from '@/router'
import axios from 'axios'
import nsaxios from '@frameworks/axiosUtil'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import CustCenterBoardInquiryDetail from '@/views/custcenter/CustCenterBoardInquiryDetail'
import {
  QnaDetailReal,
  QuestionItemDetailCmd,
  QnaDeleteReal,
  ItemQnaDeleteReal
} from '@unit/views/custcenter/mock/CustCenterResponse'

describe('고객센터 > 1:1 문의 > 상세', () => {
  let mock
  let index = 0
  let options

  const localVue = createLocalVue()

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(VueRouter)

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios
  })

  beforeEach(() => {
    mock.reset() // reset mock adapter

    delete router.history.current
    if (index === 0) {
      router.history.current = {
        name: 'custCenterBoardInquiryDetail',
        meta: {},
        path: '/custcenter/board-inquiry/detail/board/606',
        hash: '',
        query: {},
        params: {
          type: 'board',
          id: '606'
        },
        fullPath: '/',
        matched: []
      }
    } else {
      router.history.current = {
        name: 'custCenterBoardInquiryDetail',
        meta: {},
        path: '/custcenter/board-inquiry/detail/product/6200',
        hash: '',
        query: {},
        params: {
          type: 'product',
          id: '6200'
        },
        fullPath: '/',
        matched: []
      }
    }

    options = {
      localVue,
      router
    }

    index++
  })

  it('getBoardQnaDetail', async () => {
    const wrapper = mount(CustCenterBoardInquiryDetail, options)

    mock
      .onPost(`${CONST.API_URL}/QnaDetailReal`)
      .reply(200, QnaDetailReal)
    mock
      .onPost(`${CONST.API_URL}/QnaDeleteReal`)
      .reply(200, QnaDeleteReal)

    wrapper.vm.getBoardQnaDetail()
    await flushPromises()

    assert.equal(wrapper.vm.typeText, '1:1문의')

    wrapper.vm.deleteInquiry()
    await flushPromises()
  })

  it('getProductQnaDetail', async () => {
    const wrapper = mount(CustCenterBoardInquiryDetail, options)

    mock
      .onPost(`${CONST.API_URL}/QuestionItemDetailCmd`)
      .reply(200, QuestionItemDetailCmd)
    mock
      .onPost(`${CONST.API_URL}/ItemQnaDeleteReal`)
      .reply(200, ItemQnaDeleteReal)

    wrapper.vm.getProductQnaDetail()
    await flushPromises()

    assert.equal(wrapper.vm.typeText, '상품문의')

    wrapper.vm.deleteInquiry()
    await flushPromises()
  })
})
