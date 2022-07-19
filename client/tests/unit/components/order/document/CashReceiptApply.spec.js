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
import CashReceiptApply from '@/components/order/document/CashReceiptApply'
import { NSMypageCommCmd } from '@unit/components/order/document/mock/cashReceiptApplyResponse'
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
  mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`)
    .reply(200, NSMypageCommCmd)
}

describe('현금영수증신청 테스트', () => {
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
  })

  describe('현금영수증신청 생성', () => {
    let wrapper
    let vm
    beforeEach(() => {
      wrapper = mount(CashReceiptApply, {
        propsData: {
          param: {
            ordersId: cashReceiptWrapper.vm.receiptList[0].orderNum,
            totalpayment: cashReceiptWrapper.vm.receiptList[0].totalpayment,
            cashreceiptAmount: cashReceiptWrapper.vm.receiptList[0].cashReceiptAmount
          }
        },
        ...options
      })
      vm = wrapper.vm
    })

    describe('휴대폰/사업자번호 영역 선택', () => {
      it('휴대폰 선택', () => {
        vm.clickPhone()
        assert.equal(vm.phoneOrBusiness.phone, true)
        assert.equal(vm.phoneOrBusiness.business, false)
        assert.equal(vm.phoneErrorNotInput, true)
        assert.equal(vm.phoneErrorNotAccurate, false)
      })
      it('사업자번호 선택', () => {
        vm.clickBusiness()
        assert.equal(vm.phoneOrBusiness.phone, false)
        assert.equal(vm.phoneOrBusiness.business, true)
        assert.equal(vm.businessErrorNotInput, true)
        assert.equal(vm.businessErrorNotAccurate, false)
      })
    })

    describe('버튼 영역 선택', async () => {
      it('취소 선택', () => {
        vm.onClickCancle()
        assert.isTrue(true)
      })

      it('휴대폰 입력하지 않고 신청하기 선택', () => {
        vm.clickPhone()
        assert.equal(vm.phoneOrBusiness.phone, true)
        assert.equal(vm.phoneOrBusiness.business, false)
        vm.onClickSubmit()
        assert.equal(vm.receiptApplyFlag, false)
        assert.equal(vm.phoneErrorNotInput, true)
        assert.equal(vm.phoneErrorNotAccurate, false)
        assert.equal(vm.businessErrorNotInput, true)
        assert.equal(vm.businessErrorNotAccurate, false)
      })

      it('사업자번호 입력하지 않고 신청하기 선택', () => {
        vm.clickBusiness()
        assert.equal(vm.phoneOrBusiness.phone, false)
        assert.equal(vm.phoneOrBusiness.business, true)
        vm.onClickSubmit()
        assert.equal(vm.receiptApplyFlag, false)
        assert.equal(vm.phoneErrorNotInput, true)
        assert.equal(vm.phoneErrorNotAccurate, false)
        assert.equal(vm.businessErrorNotInput, true)
        assert.equal(vm.businessErrorNotAccurate, false)
      })

      describe('휴대폰 입력하고 신청하기 선택', () => {
        let phoneInput
        beforeEach(() => {
          vm.clickPhone()
          assert.equal(vm.phoneOrBusiness.phone, true)
          assert.equal(vm.phoneOrBusiness.business, false)
          phoneInput = wrapper.find('#label_phone')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (Focus)', async () => {
          await phoneInput.trigger('focus')
          assert.equal(phoneInput.attributes().type, 'number')
          assert.equal(phoneInput.element.value, '')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (keydown)', async () => {
          await phoneInput.trigger('keydown', {
            keyCode: '65'
          })
          await phoneInput.trigger('keydown', {
            keyCode: '161'
          })
          phoneInput.setValue('123')
          await phoneInput.trigger('keydown', {
            keyCode: '52'
          })
          phoneInput.setValue('123456789012')
          await phoneInput.trigger('keydown', {
            keyCode: '51'
          })
          assert.equal(phoneInput.attributes().type, 'number')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (keyup)', async () => {
          phoneInput.setValue('123')
          await phoneInput.trigger('keyup', {
            keyCode: '65'
          })
          assert.equal(phoneInput.attributes().type, 'number')
          assert.equal(phoneInput.element.value, '123')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (blur -> success)', async () => {
          phoneInput.setValue('0109995172')
          await phoneInput.trigger('blur')
          assert.equal(vm.phoneErrorNotInput, false)
          assert.equal(vm.phoneErrorNotAccurate, false)
          assert.equal(phoneInput.attributes().type, 'text')
          assert.equal(phoneInput.element.value, '010-999-5172')
          assert.equal(vm.phoneNum, '0109995172')
          phoneInput.setValue('01099951723')
          await phoneInput.trigger('blur')
          assert.equal(vm.phoneErrorNotInput, false)
          assert.equal(vm.phoneErrorNotAccurate, false)
          assert.equal(phoneInput.attributes().type, 'text')
          assert.equal(phoneInput.element.value, '010-9995-1723')
          assert.equal(vm.phoneNum, '01099951723')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (blur -> fail)', async () => {
          phoneInput.setValue('')
          await phoneInput.trigger('blur')
          assert.equal(vm.phoneErrorNotInput, true)
          assert.equal(vm.phoneErrorNotAccurate, false)
          assert.equal(vm.phoneErrorMessage, '휴대폰 번호를 입력해 주세요.')
          assert.equal(phoneInput.attributes().type, 'number')
          assert.equal(phoneInput.element.value, '')
          assert.equal(vm.phoneNum, '')
          phoneInput.setValue('0')
          await phoneInput.trigger('blur')
          assert.equal(vm.phoneErrorNotInput, false)
          assert.equal(vm.phoneErrorNotAccurate, true)
          assert.equal(vm.phoneErrorMessage, '휴대폰 번호를 정확히 입력해 주세요.')
          assert.equal(phoneInput.attributes().type, 'number')
          assert.equal(phoneInput.element.value, '0')
          assert.equal(vm.phoneNum, '0')
        })
        it('신청하기 선택', async () => {
          assert.equal(vm.phoneOrBusiness.phone, true)
          assert.equal(vm.phoneOrBusiness.business, false)
          phoneInput.setValue('01012345678')
          await phoneInput.trigger('blur')
          assert.equal(phoneInput.element.value, '010-1234-5678')
          assert.equal(vm.phoneNum, '01012345678')
          assert.equal(vm.phoneErrorNotInput, false)
          assert.equal(vm.phoneErrorNotAccurate, false)

          vm.onClickSubmit()
          await flushPromises()
          assert.equal(vm.receiptApplyFlag, false)
          assert.equal(vm.phoneErrorNotInput, false)
          assert.equal(vm.phoneErrorNotAccurate, false)
          assert.equal(vm.businessErrorNotInput, true)
          assert.equal(vm.businessErrorNotAccurate, false)
        })
      })

      describe('사업자번호 입력하고 신청하기 선택', () => {
        let businessInput
        beforeEach(async () => {
          vm.clickBusiness()
          await vm.$nextTick()
          assert.equal(vm.phoneOrBusiness.phone, false)
          assert.equal(vm.phoneOrBusiness.business, true)
          businessInput = wrapper.find('#label_business')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (Focus)', async () => {
          await businessInput.trigger('focus')
          assert.equal(businessInput.attributes().type, 'number')
          assert.equal(businessInput.element.value, '')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (keydown)', async () => {
          await businessInput.trigger('keydown', {
            keyCode: '65'
          })
          await businessInput.trigger('keydown', {
            keyCode: '161'
          })
          businessInput.setValue('123')
          await businessInput.trigger('keydown', {
            keyCode: '52'
          })
          businessInput.setValue('123456789012')
          await businessInput.trigger('keydown', {
            keyCode: '51'
          })
          assert.equal(businessInput.attributes().type, 'number')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (keyup)', async () => {
          businessInput.setValue('123')
          await businessInput.trigger('keyup', {
            keyCode: '65'
          })
          assert.equal(businessInput.attributes().type, 'number')
          assert.equal(businessInput.element.value, '123')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (blur -> success)', async () => {
          businessInput.setValue('1234567890')
          await businessInput.trigger('blur')
          assert.equal(vm.businessErrorNotInput, false)
          assert.equal(vm.businessErrorNotAccurate, false)
          assert.equal(businessInput.attributes().type, 'text')
          assert.equal(businessInput.element.value, '123-45-67890')
          assert.equal(vm.businessNum, '1234567890')
        })
        it('기초 이벤트 트리거 정상작동 테스트 (blur -> fail)', async () => {
          businessInput.setValue('')
          await businessInput.trigger('blur')
          assert.equal(vm.businessErrorNotInput, true)
          assert.equal(vm.businessErrorNotAccurate, false)
          assert.equal(vm.businessErrorMessage, '사업자등록번호를 입력해 주세요.')
          assert.equal(businessInput.attributes().type, 'number')
          assert.equal(businessInput.element.value, '')
          assert.equal(vm.businessNum, '')
          businessInput.setValue('0')
          await businessInput.trigger('blur')
          assert.equal(vm.businessErrorNotInput, false)
          assert.equal(vm.businessErrorNotAccurate, true)
          assert.equal(vm.businessErrorMessage, '사업자등록번호를 정확히 입력해 주세요.')
          assert.equal(businessInput.attributes().type, 'number')
          assert.equal(businessInput.element.value, '0')
          assert.equal(vm.businessNum, '0')
        })
        it('신청하기 선택', async () => {
          assert.equal(vm.phoneOrBusiness.phone, false)
          assert.equal(vm.phoneOrBusiness.business, true)
          businessInput.setValue('0101234567')
          await businessInput.trigger('blur')
          assert.equal(businessInput.element.value, '010-12-34567')
          assert.equal(vm.businessNum, '0101234567')
          assert.equal(vm.businessErrorNotInput, false)
          assert.equal(vm.businessErrorNotAccurate, false)

          vm.onClickSubmit()
          await flushPromises()
          assert.equal(vm.receiptApplyFlag, false)
          assert.equal(vm.phoneErrorNotInput, true)
          assert.equal(vm.phoneErrorNotAccurate, false)
          assert.equal(vm.businessErrorNotInput, false)
          assert.equal(vm.businessErrorNotAccurate, false)
        })
      })
    })
  })
})
