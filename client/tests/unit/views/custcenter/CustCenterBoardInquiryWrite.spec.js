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
import CustCenterBoardInquiryWrite from '@/views/custcenter/CustCenterBoardInquiryWrite'
import {
  FooterInquirySelectMobileReal,
  FooterInquiryMobileReal
} from '@unit/views/custcenter/mock/CustCenterResponse'

describe('고객센터 > 1:1 문의 > 작성', () => {
  const localVue = createLocalVue()
  let mock

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(VueRouter)

  const options = {
    localVue,
    router
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios

    mock
      .onPost(`${CONST.API_URL}/FooterInquirySelectMobileReal`)
      .reply(200, FooterInquirySelectMobileReal)
    mock
      .onPost(`${CONST.API_URL}/FooterInquiryMobileReal`)
      .reply(200, FooterInquiryMobileReal)
  })

  it('getSelect', async () => {
    const wrapper = mount(CustCenterBoardInquiryWrite, options)

    wrapper.vm.getFooterInquirySelectMobile()
    await flushPromises()

    wrapper.vm.bigSelectGroup()
    await flushPromises()

    wrapper.vm.mediumSelectGroup()
    await flushPromises()

    wrapper.vm.onWrite('title')
    wrapper.vm.onWrite('text')

    assert.equal(Array.isArray(wrapper.vm.bigGroup), true)
    assert.equal(Array.isArray(wrapper.vm.mediumGroup), true)
    assert.equal(Array.isArray(wrapper.vm.smallGroup), true)
    assert.equal(typeof wrapper.vm.bigGroupVal, 'string')
    assert.equal(typeof wrapper.vm.mediumGroupVal, 'string')
    assert.equal(typeof wrapper.vm.smallGroupVal, 'string')
    assert.equal(typeof wrapper.vm.titleVal, 'string')
    assert.equal(typeof wrapper.vm.textVal, 'string')
  })

  it('writeBoardInquiry', async () => {
    const wrapper = mount(CustCenterBoardInquiryWrite, options)

    wrapper.vm.bigGroupVal = '1'
    wrapper.vm.mediumGroupVal = '1'
    wrapper.vm.smallGroupVal = '1'

    wrapper.vm.titleVal = 'lkasdflkjalsk;j'
    wrapper.vm.textVal = 'skdjfklajekljs;dlkfj'
    wrapper.vm.userEmail = 'test@nsmall.com'

    wrapper.vm.selectedProduct = {
      catentryName: '[TV](무이자)끌레드벨 24K 리프팅 프로그램(블루밍)',
      goodsCd: '26185228',
      goodsName: '[TV](무이자)끌레드벨 24K 리프팅 프로그램(블루밍)',
      options: '끌레드벨 24K 리프팅 ',
      orderSeq: '1',
      ordersId: '300011414034',
      quantity: '0',
      status: 'X',
      statusName: '취소완료',
      totalPrice: '99,000'
    }

    wrapper.vm.isSmsNotice = true
    wrapper.vm.userHpNo = '01012341234'

    wrapper.vm.writeBoardInquiry()
    await flushPromises()
  })

  it('onCollapse', () => {
    const wrapper = mount(CustCenterBoardInquiryWrite, options)

    wrapper.vm.toggleClass = true
    wrapper.vm.onCollapse()

    assert.equal(wrapper.vm.toggleClass, false)
  })

  it('select & delete product', () => {
    const wrapper = mount(CustCenterBoardInquiryWrite, options)
    const product = {
      catentryName: '[TV](무이자)끌레드벨 24K 리프팅 프로그램(블루밍)',
      goodsCd: '26185228',
      goodsName: '[TV](무이자)끌레드벨 24K 리프팅 프로그램(블루밍)',
      options: '끌레드벨 24K 리프팅 ',
      orderSeq: '1',
      ordersId: '300011414034',
      quantity: '0',
      status: 'X',
      statusName: '취소완료',
      totalPrice: '99,000'
    }

    wrapper.vm.selectProduct(product)
    assert.equal(wrapper.vm.selectedProduct.goodsCd, product.goodsCd)

    wrapper.vm.deleteProduct()
    assert.equal(wrapper.vm.selectedProduct, null)
  })
})
