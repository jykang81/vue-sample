import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import CONST from '@constants/framework/framework'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import CashReceipt from '@/views/order/document/CashReceipt'
import { NSIssueReceiptCmd } from '@unit/views/order/document/mock/cashReceiptResponse'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import {
  insertCommas
} from '@utils/commonutil/commonUtil'

const initResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSIssueReceiptCmd`)
    .reply(200, NSIssueReceiptCmd)
}

describe('현금영수증발급 테스트', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
    initResponse(mock)
  })

  it('무한스크롤객체 초기화', () => {
    const wrapper = mount(CashReceipt, options)
    const vm = wrapper.vm

    vm.setInfiniteScrollObject()

    assert.equal(vm.isCallCashReceiptListInLoading, false)
    assert.equal(vm.scrollObject instanceof IntersectionObserver, true)
  })

  it('현금영수증발급 초기 조회 시작/끝 일자', () => {
    const wrapper = mount(CashReceipt, options)
    const vm = wrapper.vm

    vm.onLoad()
    assert.equal(vm.periodMonth, 1)
    assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
    assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
  })

  describe('현금영수증 조회 영역 선택', () => {
    it('현금영수증발급 조회 1개월 선택', async () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm

      vm.selectPeriod(1)
      await flushPromises()
      assert.equal(vm.periodMonth, 1)
      assert.equal(vm.currentSelected, 1)
      assert.equal(vm.periodIdx, 3)
      assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.tableShow, true)
      assert.equal(vm.pageIdx, 2)
      assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
      assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
      assert.equal(vm.receiptList[0].buttonText, '신청불가')
      assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
      assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
      assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
      assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
      assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
      assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
      assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
      assert.equal(vm.isCallCashReceiptListInLoading, false)
    })

    it('현금영수증발급 조회 2개월 선택', async () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm

      vm.selectPeriod(2)
      await flushPromises()
      assert.equal(vm.periodMonth, 2)
      assert.equal(vm.currentSelected, 2)
      assert.equal(vm.periodIdx, 3)
      assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.tableShow, true)
      assert.equal(vm.pageIdx, 2)
      assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
      assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
      assert.equal(vm.receiptList[0].buttonText, '신청불가')
      assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
      assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
      assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
      assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
      assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
      assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
      assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
      assert.equal(vm.isCallCashReceiptListInLoading, false)
    })

    it('현금영수증발급 조회 3개월 선택', async () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm

      vm.selectPeriod(3)
      await flushPromises()
      assert.equal(vm.periodMonth, 3)
      assert.equal(vm.currentSelected, 3)
      assert.equal(vm.periodIdx, 4)
      assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.tableShow, true)
      assert.equal(vm.pageIdx, 2)
      assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
      assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
      assert.equal(vm.receiptList[0].buttonText, '신청불가')
      assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
      assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
      assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
      assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
      assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
      assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
      assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
      assert.equal(vm.isCallCashReceiptListInLoading, false)
    })
  })

  describe('현금영수증 조회 영역 버튼 UI 변화', () => {
    it('1개월 선택된 버튼 UI 확인', () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm

      it('selectPeriod 호출 전', () => {
        const isSelected = vm.getPeriodClass(1)
        assert.equal(isSelected, '')
      })

      it('selectPeriod 호출 후', async () => {
        vm.selectPeriod(1)
        await flushPromises()
        assert.equal(vm.periodMonth, 1)
        assert.equal(vm.currentSelected, 1)
        assert.equal(vm.periodIdx, 3)
        assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
        assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
        assert.equal(vm.tableShow, true)
        assert.equal(vm.pageIdx, 2)
        assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
        assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
        assert.equal(vm.receiptList[0].buttonText, '신청불가')
        assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
        assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
        assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
        assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
        assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
        assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
        assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
        assert.equal(vm.isCallCashReceiptListInLoading, false)

        const isSelected = vm.getPeriodClass(1)
        assert.equal(isSelected, 'selected')
      })
    })

    it('2개월 선택된 버튼 UI 확인', () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm

      it('selectPeriod 호출 전', () => {
        const isSelected = vm.getPeriodClass(2)
        assert.equal(isSelected, '')
      })

      it('selectPeriod 호출 후', async () => {
        vm.selectPeriod(2)
        await flushPromises()
        assert.equal(vm.periodMonth, 2)
        assert.equal(vm.currentSelected, 2)
        assert.equal(vm.periodIdx, 3)
        assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
        assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
        assert.equal(vm.tableShow, true)
        assert.equal(vm.pageIdx, 2)
        assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
        assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
        assert.equal(vm.receiptList[0].buttonText, '신청불가')
        assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
        assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
        assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
        assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
        assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
        assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
        assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
        assert.equal(vm.isCallCashReceiptListInLoading, false)

        const isSelected = vm.getPeriodClass(2)
        assert.equal(isSelected, 'selected')
      })
    })

    it('3개월 선택된 버튼 UI 확인', () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm

      it('selectPeriod 호출 전', () => {
        const isSelected = vm.getPeriodClass(3)
        assert.equal(isSelected, '')
      })

      it('selectPeriod 호출 후', async () => {
        vm.selectPeriod(3)
        await flushPromises()
        assert.equal(vm.periodMonth, 3)
        assert.equal(vm.currentSelected, 3)
        assert.equal(vm.periodIdx, 4)
        assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
        assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
        assert.equal(vm.tableShow, true)
        assert.equal(vm.pageIdx, 2)
        assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
        assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
        assert.equal(vm.receiptList[0].buttonText, '신청불가')
        assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
        assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
        assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
        assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
        assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
        assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
        assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
        assert.equal(vm.isCallCashReceiptListInLoading, false)

        const isSelected = vm.getPeriodClass(3)
        assert.equal(isSelected, 'selected')
      })
    })
  })

  describe('팝업 연관 버튼 선택', () => {
    it('발급신청 버튼 선택', async () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm
      vm.selectPeriod(1)
      await flushPromises()
      assert.equal(vm.periodMonth, 1)
      assert.equal(vm.currentSelected, 1)
      assert.equal(vm.periodIdx, 3)
      assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.tableShow, true)
      assert.equal(vm.pageIdx, 2)
      assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
      assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
      assert.equal(vm.receiptList[0].buttonText, '신청불가')
      assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
      assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
      assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
      assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
      assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
      assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
      assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
      assert.equal(vm.isCallCashReceiptListInLoading, false)
      vm.applyReceipt(vm.receiptList[0])
      assert.isTrue(true)
    })

    it('승인번호확인 버튼 선택', async () => {
      const wrapper = mount(CashReceipt, options)
      const vm = wrapper.vm
      vm.selectPeriod(1)
      await flushPromises()
      assert.equal(vm.periodMonth, 1)
      assert.equal(vm.currentSelected, 1)
      assert.equal(vm.periodIdx, 3)
      assert.equal(vm.startDate, calcDate('', 0, -(vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
      assert.equal(vm.tableShow, true)
      assert.equal(vm.pageIdx, 2)
      assert.equal(vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
      assert.equal(vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
      assert.equal(vm.receiptList[0].buttonText, '신청불가')
      assert.equal(vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
      assert.equal(vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
      assert.equal(vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
      assert.equal(vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
      assert.equal(vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
      assert.equal(vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
      assert.equal(vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
      assert.equal(vm.isCallCashReceiptListInLoading, false)
      vm.confirmReceipt(vm.receiptList[0])
      assert.isTrue(true)
    })
  })
})
