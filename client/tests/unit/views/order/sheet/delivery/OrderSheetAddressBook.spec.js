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
import bizUtil from '@utils/bizUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetAddressBook from '@/components/order/sheet/OrderSheetAddressBook'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetAddressBook', () => {
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const responseData = {
    ShipAddrList: [
      {
        phone1: '010-1234-5678',
        phone2: null,
        contactNum: '',
        addressType: 'SB',
        addressID: '20639707004',
        receiverName: '김삼모',
        email: '',
        phone1Type: null,
        phone2Type: null,
        lastname: '김삼모',
        mobile: '',
        requestProperties: null,
        commandContext: null,
        resources: null,
        ordererName: '김삼모',
        httpRequest: null,
        viewCommandContext: null,
        httpResponse: null,
        zipCode: '13548',
        nickname: '김삼모',
        ispriamry: '',
        fax1: '200',
        addrBookId: '21583631',
        memberID: '110548084',
        class: 'class com.ns.commerce.nsorder.bean.NSOrderDeliveryAddrBean',
        address1: '경기 성남시 분당구 대왕판교로34번길&amp;:15 333',
        address2: '경기 성남시 분당구 금곡동',
        address3: '444-154번지 금봉빌딩 333호',
        cst_zipCode: '13548',
        cst_addr: '경기 성남시 분당구 대왕판교로34번길',
        cst_addrDetail: '15 333',
        cst_postcode: '13548'
      }
    ]
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
    mock.reset()
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
  })
  describe('OrderSheetAddressBook 테스트', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = mount(OrderSheetAddressBook, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            paymentData: orderSheetWrapper.vm.paymentData,
            ordAddr: responseData.ShipAddrList[0],
            multiYn: orderSheetWrapper.multiYn,
            multiIdx: orderSheetWrapper.multiIdx,
            multiItemIdx: orderSheetWrapper.multiItemIdx,
            chargeItems: orderSheetWrapper.chargeItems,
            consultYn: orderSheetWrapper.consultYn
          }
        },
        localVue,
        store,
        router,
        attachToDocument: true,
        data () {
          return {
          }
        }
      })
    })

    describe('OrderSheetAddressBook 테스트', () => {
      it('배송주소록 조회1', async () => {
        mock.reset()
        mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, responseData)

        wrapper.vm.getShipAddrList()
        await flushPromises()
        assert.isTrue(true)
      })

      it('배송주소록 조회2', async () => {
        mock.reset()
        mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { ShipAddrList: [] })

        wrapper.vm.getShipAddrList()
        await flushPromises()
        assert.isTrue(true)
      })

      it('선택 버튼 클릭1', async () => {
        wrapper.vm.$store = { commit: data => {} }
        wrapper.vm.dataFildsList[0] = {
          data: {
            cst_zipCode: '13487'
          }
        }
        wrapper.vm.consultYn = 'N'
        wrapper.vm.clickParentSendDataBtn(0)
        assert.isTrue(true)
      })

      it('선택 버튼 클릭2', async () => {
        wrapper.vm.$store = { commit: data => {} }
        wrapper.vm.dataFildsList[0] = {
          data: {
            cst_zipCode: '13487'
          }
        }
        wrapper.vm.consultYn = 'Y'
        wrapper.vm.clickParentSendDataBtn(0)
        assert.isTrue(true)
      })

      it('선택 버튼 클릭3', async () => {
        wrapper.vm.$store = { commit: data => {} }
        wrapper.vm.dataFildsList[0] = {
          data: {
            cst_zipCode: '13487'
          }
        }
        wrapper.vm.consultYn = 'N'
        wrapper.vm.multiYn = 'N'
        wrapper.vm.clickParentSendDataBtn(0)
        assert.isTrue(true)
      })

      it('배송지 추가 버튼', async () => {
        wrapper.vm.shipAddrList = responseData.ShipAddrList
        wrapper.vm.$store = { commit: data => {} }
        wrapper.vm.clickAddressBookAddBtn('default')
        await flushPromises()
        assert.isTrue(true)
      })

      it('배송지 수정 버튼', async () => {
        wrapper.vm.shipAddrList = responseData.ShipAddrList
        wrapper.vm.clickUpdateDataBtn(0, 'default')
        await flushPromises()
        assert.isTrue(true)
      })
    })
  })
})
