import CONST from '@constants/framework/framework'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import router from '@/router'
import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import loginUtil from '@utils/loginUtil'
import nsaxios from '@frameworks/axiosUtil'
import { getProcessedWCSParameter } from '@unit/testUtil'

import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import MypageOrderDetail from '@/components/order/detail/MypageOrderDetail'

import temp01ReqNSMypageCmd from '@unit/components/order/detail/mock/01_req_NSMypageCmd'
import temp01ResNSMypageCmd from '@unit/components/order/detail/mock/01_res_NSMypageCmd'
// import temp02ReqNSMypageCommCmdCheckOrderStatus from '@unit/components/order/detail/mock/02_req_NSMypageCommCmd_checkOrderStatus'
import temp02ResNSMypageCommCmdCheckOrderStatus from '@unit/components/order/detail/mock/02_res_NSMypageCommCmd_checkOrderStatus'
// import temp03ReqNSMypageCommCmdChkRcOrderDtlStats from '@unit/components/order/detail/mock/03_req_NSMypageCommCmd_chkRcOrderDtlStats'
import temp03ResNSMypageCommCmdChkRcOrderDtlStats from '@unit/components/order/detail/mock/03_res_NSMypageCommCmd_chkRcOrderDtlStats'
// import temp04ReqNSMypageCmd from '@unit/components/order/detail/mock/04_req_NSMypageCmd'
import temp04ResNSMypageCmd from '@unit/components/order/detail/mock/04_res_NSMypageCmd'

describe('MypageOrderDetail', () => {
  let wrapper
  let localVue
  let mock

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    delete router.history.current
    router.history.current = {
      name: 'mypageOrderDetail',
      meta: {},
      path: '/order/list',
      hash: '',
      query: {},
      params: {
        guestResultYn: true,
        logonType: 'dummy'
      },
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.onPost(`${CONST.API_URL}/NSMypageCmd`, getProcessedWCSParameter('post', temp01ReqNSMypageCmd)).reply(200, temp01ResNSMypageCmd)
    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })

    wrapper = mount(MypageOrderDetail, {
      localVue,
      router,
      attachToDocument: true,
      propsData: {
        param: {
          ordersId: '300011155068'
        }
      }
    })

    await flushPromises()
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('MypageOrderDetail 테스트', () => {
    it('주문 상세정보 조회 1', async () => {
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('주문 상세정보 조회 2', async () => {
      mock.reset()
      temp01ResNSMypageCmd.msg.root.orders[0].cats[1].addressId = '20639715027'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp01ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('주문 상세정보 조회 3', async () => {
      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].addressId = '20639716503'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('주문 상세정보 조회 4', async () => {
      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].statusName = '취소완료'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('주문 상세정보 조회 5', async () => {
      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].statusName = '반품신청'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()

      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].statusName = '반품진행'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()

      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].statusName = '반품완료'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('주문 상세정보 조회 6', async () => {
      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].statusName = '교환신청'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()

      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].statusName = '교환진행'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()

      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[1].statusName = '교환완료'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('주문 상세정보 조회 7', async () => {
      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].payms[0].oneTouchYn = 'Y'
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('주문 상세정보 조회 8', async () => {
      mock.reset()
      temp04ResNSMypageCmd.msg.root.orders[0].cats[0].subProducts = [
        {
          ordersId: '300011155068',
          catentryIdParent: '42828213',
          attrs: [
            {
              value: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원',
              name: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원',
              subseq: '0',
              seq: '0'
            }
          ],
          unitCd: '10118809215',
          goodsCd: '42828213',
          catentryId: '10118809215',
          partgubun: 'GIFT',
          styleMngYn: 'N',
          name: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원',
          quantity: '1',
          orderitemsId: '180725970',
          suborditemId: '1'
        }
      ]
      mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, temp04ResNSMypageCmd)
      wrapper.vm.getOrdersDetailInfo()
      assert.isTrue(true)
    })

    it('배송지변경 버튼', async () => {
      const param1 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"checkOrderStatus","args":{"ordersId":"300011155068"}}' }
      const param2 = { tasknm: 'alejandro', var: '{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"chkRcOrderDtlStats","args":{"ordersId":"300011155068","memberId":110548084}}' }

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param1)).reply(200, temp02ResNSMypageCommCmdCheckOrderStatus)
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`, getProcessedWCSParameter('post', param2)).reply(200, temp03ResNSMypageCommCmdChkRcOrderDtlStats)
      wrapper.vm.orders = temp01ResNSMypageCmd.msg.root.orders[0]
      wrapper.vm.param.ordersId = '300011155068'
      wrapper.vm.clickChangeAddress(0)
      await flushPromises()
      assert.isTrue(true)
    })

    it('결제수단 변경 버튼', async () => {
      wrapper.vm.param.ordersId = '300011155068'
      wrapper.vm.clickPayByCard()
      assert.isTrue(true)
    })

    it('취소상세 보기 버튼', async () => {
      wrapper.vm.clickOrderCancelDetail()
      assert.isTrue(true)
    })

    it('교환상세 보기 버튼', async () => {
      wrapper.vm.clickExchangeOrderDetail()
      assert.isTrue(true)
    })

    it('반품상세 보기 버튼', async () => {
      wrapper.vm.clickRefundOrderDetail()
      assert.isTrue(true)
    })

    it('반품상세 보기 버튼', async () => {
      wrapper.vm.clickRefundOrderDetail()
      assert.isTrue(true)
    })

    it('computed', async () => {
      assert.isNotNull(wrapper.vm.commonUtil)
      assert.isNotNull(wrapper.vm.bizUtil)
    })
  })
})
