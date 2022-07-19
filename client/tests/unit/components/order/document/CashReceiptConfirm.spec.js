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
import CashReceiptConfirm from '@/components/order/document/CashReceiptConfirm'
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

describe('현금영수증 승인번호확인 테스트', () => {
  let mock
  let cashReceiptWrapper
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

  beforeEach(async () => {
    mock.reset()
    initResponse(mock)
    cashReceiptWrapper = mount(CashReceipt, options)
    await flushPromises()
    cashReceiptWrapper.vm.selectPeriod(1)
    await flushPromises()
  })
  it('현금영수증발급 컴포넌트 생성 확인', () => {
    assert.equal(cashReceiptWrapper.vm.periodMonth, 1)
    assert.equal(cashReceiptWrapper.vm.currentSelected, 1)
    assert.equal(cashReceiptWrapper.vm.periodIdx, 3)
    assert.equal(cashReceiptWrapper.vm.startDate, calcDate('', 0, -(cashReceiptWrapper.vm.periodMonth), 0, 0, 'yyyy.MM.dd'))
    assert.equal(cashReceiptWrapper.vm.endDate, calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'))
    assert.equal(cashReceiptWrapper.vm.tableShow, true)
    assert.equal(cashReceiptWrapper.vm.pageIdx, 2)
    assert.equal(cashReceiptWrapper.vm.receiptList[0].orderNum, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].ordersId)
    assert.equal(cashReceiptWrapper.vm.receiptList[0].productName, NSIssueReceiptCmd.msg.root.pageData[0].cats[0].catentryName)
    assert.equal(cashReceiptWrapper.vm.receiptList[0].buttonText, '신청불가')
    assert.equal(cashReceiptWrapper.vm.receiptList[0].totalPayment, insertCommas(NSIssueReceiptCmd.msg.root.pageData[0].totalpayment))
    assert.equal(cashReceiptWrapper.vm.receiptList[0].cashReceiptAmount, NSIssueReceiptCmd.msg.root.pageData[0].cashreceiptAmount)
    assert.equal(cashReceiptWrapper.vm.receiptList[0].apprNum, NSIssueReceiptCmd.msg.root.pageData[0].apprNum)
    assert.equal(cashReceiptWrapper.vm.receiptList[0].selfDealDate, NSIssueReceiptCmd.msg.root.pageData[0].selfDealDate)
    assert.equal(cashReceiptWrapper.vm.receiptList[0].selfAmt, NSIssueReceiptCmd.msg.root.pageData[0].selfAmt)
    assert.equal(cashReceiptWrapper.vm.receiptList[0].payDttm, NSIssueReceiptCmd.msg.root.pageData[0].payms[0].payDttm)
    assert.equal(cashReceiptWrapper.vm.totalCount, NSIssueReceiptCmd.msg.root.totalcnt)
    assert.equal(cashReceiptWrapper.vm.isCallCashReceiptListInLoading, false)
  })

  describe('승인번호확인 생성', () => {
    let wrapper
    let vm

    describe('팝업 컴포넌트 Created Hook 테스트', () => {
      it('apprNum = null, selfDealDate = null 지정 onLoad', () => {
        wrapper = mount(CashReceiptConfirm, {
          propsData: {
            param: {
              apprNum: null,
              selfDealDate: null,
              selfAmt: cashReceiptWrapper.vm.receiptList[0].selfAmt,
              payDttm: cashReceiptWrapper.vm.receiptList[0].payDttm
            }
          },
          ...options
        })
        vm = wrapper.vm
        vm.onLoad()
        assert.equal(vm.buttonShow, false)
        assert.equal(vm.selfCashReceiptData.apprNum, '결제 후 48시간 후 확인가능')
        assert.equal(vm.selfCashReceiptData.selfDealDate, null)
        assert.equal(vm.selfCashReceiptData.selfAmt, insertCommas(cashReceiptWrapper.vm.receiptList[0].selfAmt.selfAmt))
        assert.equal(vm.selfCashReceiptData.payDttm, cashReceiptWrapper.vm.receiptList[0].payDttm.substring(0, 10))
      })

      it('apprNum = null, selfDealDate != null 지정 onLoad', () => {
        wrapper = mount(CashReceiptConfirm, {
          propsData: {
            param: {
              apprNum: cashReceiptWrapper.vm.receiptList[0].apprNum,
              selfDealDate: '20200808',
              selfAmt: cashReceiptWrapper.vm.receiptList[0].selfAmt,
              payDttm: cashReceiptWrapper.vm.receiptList[0].payDttm
            }
          },
          ...options
        })
        vm = wrapper.vm
        vm.onLoad()
        assert.equal(vm.buttonShow, false)
        assert.equal(vm.selfCashReceiptData.apprNum, '2020-08-10 09시 생성예정')
        assert.equal(vm.selfCashReceiptData.selfDealDate, '20200808')
        assert.equal(vm.selfCashReceiptData.selfAmt, insertCommas(cashReceiptWrapper.vm.receiptList[0].selfAmt.selfAmt))
        assert.equal(vm.selfCashReceiptData.payDttm, cashReceiptWrapper.vm.receiptList[0].payDttm.substring(0, 10))
      })

      it('apprNum != null, selfDealDate != null 지정 onLoad', () => {
        wrapper = mount(CashReceiptConfirm, {
          propsData: {
            param: {
              apprNum: '2020080812345678',
              selfDealDate: '20200808',
              selfAmt: cashReceiptWrapper.vm.receiptList[0].selfAmt,
              payDttm: cashReceiptWrapper.vm.receiptList[0].payDttm
            }
          },
          ...options
        })
        vm = wrapper.vm
        vm.onLoad()
        assert.equal(vm.buttonShow, true)
        assert.equal(vm.selfCashReceiptData.apprNum, '2020080812345678')
        assert.equal(vm.selfCashReceiptData.selfDealDate, '20200808')
        assert.equal(vm.selfCashReceiptData.selfAmt, insertCommas(cashReceiptWrapper.vm.receiptList[0].selfAmt.selfAmt))
        assert.equal(vm.selfCashReceiptData.payDttm, cashReceiptWrapper.vm.receiptList[0].payDttm.substring(0, 10))
      })
    })

    describe('버튼 선택 테스트', () => {
      it('취소 버튼 선택', () => {
        wrapper = mount(CashReceiptConfirm, {
          propsData: {
            param: {
              apprNum: cashReceiptWrapper.vm.receiptList[0].apprNum,
              selfDealDate: cashReceiptWrapper.vm.receiptList[0].selfDealDate,
              selfAmt: cashReceiptWrapper.vm.receiptList[0].selfAmt,
              payDttm: cashReceiptWrapper.vm.receiptList[0].payDttm
            }
          },
          ...options
        })
        vm = wrapper.vm
        vm.onClickCancle()
        assert.isTrue(true)
      })

      it('홈택스 버튼 선택', () => {
        wrapper = mount(CashReceiptConfirm, {
          propsData: {
            param: {
              apprNum: cashReceiptWrapper.vm.receiptList[0].apprNum,
              selfDealDate: cashReceiptWrapper.vm.receiptList[0].selfDealDate,
              selfAmt: cashReceiptWrapper.vm.receiptList[0].selfAmt,
              payDttm: cashReceiptWrapper.vm.receiptList[0].payDttm
            }
          },
          ...options
        })
        vm = wrapper.vm
        vm.onClickHomeTax()
        assert.isTrue(true)
      })
    })
  })
})
