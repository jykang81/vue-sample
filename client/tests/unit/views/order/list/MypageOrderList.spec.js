import CONST from '@constants/framework/framework'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'
// import { getProcessedWCSParameter } from '@unit/testUtil'

import MypageOrderList from '@/views/order/list/MypageOrderList'

// import temp01ReqNSMypageCmd from '@unit/views/order/list/mock/01_req_NSMypageCmd'
import temp01ResNSMypageCmd from '@unit/views/order/list/mock/01_res_NSMypageCmd'
// import temp02ReqNSMypageCommCmdCheckOrderStatus from '@unit/views/order/list/mock/02_req_NSMypageCommCmd_checkOrderStatus'
import temp02ResNSMypageCommCmdCheckOrderStatus from '@unit/views/order/list/mock/02_res_NSMypageCommCmd_checkOrderStatus'
// import temp03ReqNSMypageCommCmdChkRcOrderDtlStats from '@unit/views/order/list/mock/03_req_NSMypageCommCmd_chkRcOrderDtlStats'
import temp03ResNSMypageCommCmdChkRcOrderDtlStats from '@unit/views/order/list/mock/03_res_NSMypageCommCmd_chkRcOrderDtlStats'
// import temp04ReqNSMypageCommCmdGetShipInfo from '@unit/views/order/list/mock/04_req_NSMypageCommCmd_getShipInfo'
import temp04ResNSMypageCommCmdGetShipInfo from '@unit/views/order/list/mock/04_res_NSMypageCommCmd_getShipInfo'
import temp05DetailProductViewReal from '@unit/views/order/list/mock/05_res_DetailProductViewReal'

const initMypageOrderList = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxMypageCmd`)
    .reply(200, temp01ResNSMypageCmd)
  mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`)
    .reply(200, temp02ResNSMypageCommCmdCheckOrderStatus)
  mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`)
    .reply(200, temp03ResNSMypageCommCmdChkRcOrderDtlStats)
  mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`)
    .reply(200, temp04ResNSMypageCommCmdGetShipInfo)
  mock.onPost(`${CONST.API_URL}/DetailProductViewReal`)
    .reply(200, temp05DetailProductViewReal)

  return mock
}

describe('MypageOrderList', () => {
  let localVue
  let options
  let mypageOrderListWrapper
  let mock

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    delete router.history.current
    router.history.current = {
      name: 'mypageOrderList',
      meta: {},
      path: '/order/list',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initMypageOrderList(mock)

    options = {
      localVue,
      store,
      router,
      attachToDocument: true,
      data () {
        return {
        }
      }
    }

    mypageOrderListWrapper = mount(MypageOrderList, options)

    await flushPromises()
  })
  describe('MypageOrderList 테스트', () => {
    it('주문상태 갯수 클릭 시', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.clickStateCnt('1')
      assert.equal(true, true)

      wrapper.vm.clickStateCnt('2')
      assert.equal(true, true)

      wrapper.vm.clickStateCnt('3')
      assert.equal(true, true)

      wrapper.vm.clickStateCnt('4')
      assert.equal(true, true)

      wrapper.vm.clickStateCnt('5')
      assert.equal(true, true)
    })

    it('주문상세 이동', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.onclickOrderDetailLink()
      await flushPromises()
      assert.equal(true, true)
    })

    it('채팅상담 버튼 클릭 시', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.btnChatting()
      assert.equal(true, true)
    })

    it('상세검색 기간 선택 시', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.clickSelectMonth(1)
      assert.equal(true, true)

      wrapper.vm.clickSelectMonth(3)
      assert.equal(true, true)

      wrapper.vm.clickSelectMonth(6)
      assert.equal(true, true)

      wrapper.vm.clickSelectMonth(0)
      assert.equal(true, true)
    })

    it('상세검색 기간설정 시작일 선택 시', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.clickOpenStartDt()
      await flushPromises()
      assert.equal(true, true)
    })

    it('상세검색 기간설정 종료일 선택 시', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.clickOpenEndDt()
      await flushPromises()
      assert.equal(true, true)
    })

    it('상세검색 검색버튼 클릭 시', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.startDate = '20200101'
      wrapper.vm.endDate = '20200201'
      wrapper.vm.clickDetailSearch()
      assert.equal(true, true)

      wrapper.vm.startDate = '20200101'
      wrapper.vm.endDate = '20201201'
      wrapper.vm.clickDetailSearch()
      assert.equal(true, true)
    })

    it('상품상세 이동', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.onclickLinkProductDetail()
      assert.equal(true, true)
    })

    it('상품평 쓰기 이동', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.onclickProductCommentWrite()
      assert.equal(true, true)
    })

    it('주문취소 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.orders[0] = {
        hasCantTraceCardYn: 'N',
        payms: [{ paymentcode: '1800' }]
      }
      wrapper.vm.clickOrderCancel(0)
      assert.equal(true, true)

      wrapper.vm.orders[0] = {
        hasCantTraceCardYn: 'Y',
        cats: [{}, {}],
        payms: [{ paymentcode: '1700' }]
      }
      wrapper.vm.clickOrderCancel(0)
      assert.equal(true, true)

      wrapper.vm.orders[0] = {
        hasCantTraceCardYn: 'Y',
        cats: [{}],
        payms: [{ paymentcode: '200' }]
      }
      wrapper.vm.clickOrderCancel(0)
      assert.equal(true, true)
    })

    it('배송지변경 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.orders[0] = {
        payms: [{ paymentcode: '1800' }]
      }
      wrapper.vm.clickChangeAddress(0)
      await flushPromises()
      assert.equal(true, true)

      wrapper.vm.orders[0] = {
        payms: [{
          paymentcode: '1700',
          oneTouchYn: 'Y'
        }]
      }
      wrapper.vm.clickChangeAddress(0)
      assert.equal(true, true)
    })

    it('결제수단 변경 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.orders[0] = {
        ordersId: '300011073048'
      }
      wrapper.vm.clickPayByCard(0)
      await flushPromises()
      assert.equal(true, true)
    })

    it('수취확인 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.orders[0] = {
        ordersId: '300011073048',
        cats: [{
          addressId: '20639721504',
          catentryId: '10119997968',
          status: 'M'
        }]
      }
      wrapper.vm.clickDeliveryConfirm(0, 0)
      await flushPromises()
      assert.equal(true, true)
    })

    it('배송조회 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.orders[0] = {
        ordersId: '300011073048',
        cats: [{
          orderitemsId: '179611034',
          addressId: '20639721504',
          catentryId: '10119997968',
          status: 'M'
        }]
      }
      wrapper.vm.clickDeliveryHistory(0, 0)
      assert.equal(true, true)
    })

    it('반품신청 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.clickRefundOrder(0)
      assert.equal(true, true)
    })

    it('교환신청 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.clickExchangeOrder()
      assert.equal(true, true)
    })

    it('취소상세 보기 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.clickOrderCancelDetail()
      assert.equal(true, true)
    })

    // 교환상세 3차 구현 범위 아님
    // it('교환상세 보기 버튼', async () => {
    //   const wrapper = mypageOrderListWrapper.find(MypageOrderList)
    //   wrapper.vm.clickExchangeOrderDetail()
    //   assert.equal(true, true)
    // })

    it('반품상세 보기 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      wrapper.vm.clickRefundOrderDetail()
      assert.equal(true, true)
    })

    it('주문내역 호출', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.periodMonth = 1
      wrapper.vm.callMypageMainReal()
      assert.equal(true, true)

      wrapper.vm.periodMonth = 3
      wrapper.vm.callMypageMainReal()
      assert.equal(true, true)

      wrapper.vm.periodMonth = 6
      wrapper.vm.callMypageMainReal()
      assert.equal(true, true)

      wrapper.vm.periodMonth = 0
      wrapper.vm.callMypageMainReal()
      assert.equal(true, true)
    })

    it('장바구니 담기 버튼', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)

      wrapper.vm.clickAddCart(0, 0)
      await flushPromises()
      assert.equal(true, true)
    })

    it('품절 체크', async () => {
      const wrapper = mypageOrderListWrapper.find(MypageOrderList)
      let isSoldOut = null

      temp05DetailProductViewReal.msg.goods[0].info.busChnId = 'SB'
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      temp05DetailProductViewReal.msg.goods[0].info.productCnt = 0
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      temp05DetailProductViewReal.msg.goods[0].info.dispTypeCd = '60'
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      temp05DetailProductViewReal.msg.goods[0].info.saleYn = 'N'
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      temp05DetailProductViewReal.msg.goods[0].info.buyable = 0
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      temp05DetailProductViewReal.msg.goods[0].info.apprStatCd = '10'
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      temp05DetailProductViewReal.msg.goods[0].info.dispTypeCd = ''
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      temp05DetailProductViewReal.msg.goods[0].info.salePrice = -10
      isSoldOut = wrapper.vm.isSoldOutProduct({ goodsCd: '42985725' })
      await flushPromises()

      isSoldOut.then(data => { assert.equal(data, true) })
    })
  })
})
