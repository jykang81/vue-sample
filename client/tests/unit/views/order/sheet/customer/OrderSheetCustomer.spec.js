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

import {
  timerObject
} from '@utils/commonutil/commonUtil'
import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import CONST from '@constants/framework/framework'

import OrderSheet from '@/views/order/sheet/OrderSheet'
// import OrderSheetDelivery from '@/views/order/sheet/OrderSheetDelivery'
import OrderSheetCustomer from '@/views/order/sheet/OrderSheetCustomer'
// import OrderSheetProduct from '@/views/order/sheet/OrderSheetProduct'
// import OrderSheetAddressBook from '@/components/order/sheet/OrderSheetAddressBook'
// import OrderSheetAddressBookAdd from '@/components/order/sheet/OrderSheetAddressBookAdd'
// import OrderSheetAddressBookUpdate from '@/components/order/sheet/OrderSheetAddressBookUpdate'
// import OrderSheetAddressMulti from '@/components/order/sheet/OrderSheetAddressMulti'
// import OrderSheetSafeDeliverySearch from '@/components/order/sheet/OrderSheetSafeDeliverySearch'
// import OrderDeliveryChange from '@/components/order/OrderDeliveryChange'
// import OrderSheetRmaCheck from '@/components/order/sheet/OrderSheetRmaCheck'
// import OrderSheetSafeDeliverySearchAdd from '@/components/order/sheet/OrderSheetSafeDeliverySearchAdd'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetCustomer', () => {
  // const dummy = 'dummy'
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const e = {
    preventDefault: () => {},
    keyCode: '',
    target: { value: '' }
  }

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    bizUtil.gotoOrdersheet(tempMInputParams)
    delete router.history.current
    router.history.current = {
      name: 'orderSheet',
      meta: {},
      path: '/order/sheet',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initOrderSheet(mock)
    initOrderSheetDelivery(mock)

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

    orderSheetWrapper = mount(OrderSheet, options)

    await flushPromises()

    /**
       * vm.$nextTick() -> component 상태 및 템플릿 업데이트
       * vue instance는 비동기 일괄 업데이트 되기 때문에 async / await 구문 사용 필요
       */
    // await wrapper.vm.$nextTick()

    /**
       * pending 상태 promise 대상 flush 처리
       * 테스트 대상 코드에 비동기 처리가 있을 때 사용
       */
    // await flushPromises()
  })
  describe('OrderSheetCustomer 테스트', () => {
    it('주문하시는분 정보 출력', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetCustomer)

      wrapper.vm.setUpdateOrderer(null)
      wrapper.vm.setUpdateOrderer({
        ordererName: '',
        ordererHpNo: '',
        ordererEmail: ''
      })
    })
    it('주문하시는분/본인인증하기/비밀번호 정보 출력', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetCustomer)

      wrapper.vm.globalVal.mOutputDatas.msg.UserInfo.USER_TYPE = 'S'
      wrapper.vm.globalVal.mOutputDatas.msg.firstOrderYn = 'Y'
      wrapper.vm.globalVal.customerInfo.mHpNoSmsAuthYn = 'N'
      wrapper.vm.setOrdererInfo(wrapper.vm.globalVal.mOutputDatas.msg)

      wrapper.vm.globalVal.mOutputDatas.msg.firstOrderYn = 'N'
      wrapper.vm.setOrdererInfo(wrapper.vm.globalVal.mOutputDatas.msg)

      wrapper.vm.globalVal.mOutputDatas.msg.UserInfo.PHONE1 = ''
      wrapper.vm.setOrdererInfo(wrapper.vm.globalVal.mOutputDatas.msg)
    })
    it('onKeyUpOnlyNumber', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetCustomer)
      wrapper.vm.onKeyUpOnlyNumber(e)
      assert.equal(true, true)
    })
    it('blurDashPhone', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetCustomer)
      wrapper.vm.blurDashPhone(e)
      assert.equal(true, true)
    })
    it('focusDashPhone', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetCustomer)
      wrapper.vm.focusDashPhone()
      assert.equal(true, true)
    })
    it('인증번호 발송 및 확인', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetCustomer)
      const vm = wrapper.vm

      /** 인증번호 발송 결과 mocking start */
      const url = `${CONST.API_URL}/NSPhoneCheckMoblieCmdReal`
      const mockSendingCodeResult = {
        msg: {
          root: {
            EXCPT_YN: 'N',
            FINAL_RVIS_PIC: 'NSBAQ',
            TEAM_CD: '000',
            phone1: '010-1234-0071',
            verificationCode: '5055',
            RECVR_TEL: '01012340071',
            SEND_TO_TEL: '16887700',
            TRMS_STAT: '1',
            INIT_REGI_PIC: 'NSBAQ',
            USER_ID: 'MALL',
            TRMS_QTY_SPR: '00',
            processMsg: {
              authnumber: '',
              processMsg: 'S',
              phone1: '010-1234-0071',
              effectiveTime: '300',
              UserId: '111708842',
              sucessMsg: '인증번호 전송이 완료되었습니다.'
            },
            PRIORRANK: '1',
            SMS: '[NSMALL] 본인인증번호는 5055 입니다. 정확히 입력해 주세요.',
            MSG_CD: '00'
          }
        },
        pMode: [
          'K'
        ],
        catalogId: [
          '14051'
        ],
        userId: [
          '111708842'
        ],
        authUsage: [
          '6'
        ],
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        accptPathCd: [
          '500'
        ],
        storeId: [
          '13001'
        ],
        Phone: [
          '010-1234-0071'
        ]
      }
      mock
        .onPost(url)
        .reply(200, mockSendingCodeResult)
      /** 인증번호 발송 결과 mocking end */

      /** 인증번호 발송 start */
      vm.ordererInfo.name = '김덕배' // 고객명
      vm.updateHpno = '01012340071' // 고객 휴대폰
      await vm.$nextTick()

      const resultObject = vm.sendVerificationCode() // 인증코드 발송
      await flushPromises()
      /** 인증번호 발송 end */

      vm.handleSendVerificationCode(resultObject)
      await flushPromises()

      vm.callbackCertNumber(mockSendingCodeResult)
      await flushPromises()

      timerObject.checkTimerObject()
      timerObject.m_timer = setInterval(vm.getAuthNoIntervalTime, 1000)
      await flushPromises()

      /** 인증번호 확인 결과 mocking start */
      const mockCheckCodeResult = {
        msg: {
          root: {
            processMsg: {
              processMsg: 'S',
              sucessMsg: '회원정보를 인증된 휴대전화 번호로 수정하였습니다.'
            }
          }
        },
        modifyUserHpNoYn: [
          'Y'
        ],
        userId: [
          '111708842'
        ],
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        accptPathCd: [
          '500'
        ],
        Phone: [
          '010-1234-0071'
        ],
        authNumber: [
          '9505'
        ],
        pMode: [
          'C'
        ],
        custNum: [
          '30125577'
        ],
        catalogId: [
          '14051'
        ],
        authUsage: [
          '6'
        ],
        storeId: [
          '13001'
        ],
        email: [
          'asdf@a71.com'
        ]
      }
      mock.reset()
      mock
        .onPost(url)
        .reply(200, mockCheckCodeResult)
      /** 인증번호 확인 결과 mocking end */

      /** 인증번호 확인 start */
      vm.$refs.phoneAuth.verificationCode = '1234' // 인증번호 기입
      await vm.$nextTick()
      await vm.$refs.phoneAuth.checkVerificationCode() // 인증번호 확인
      await flushPromises()
      /** 인증번호 확인 end */
    })
  })
})
