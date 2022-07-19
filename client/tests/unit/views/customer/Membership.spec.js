import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import router from '@/router'
import VueRouter from 'vue-router'
import nsaxios from '@frameworks/axiosUtil'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import store from '@/vuex'
import flushPromises from 'flush-promises'
import Membership from '@/views/customer/Membership'
import loginUtil from '@utils/loginUtil'

describe('membership', () => {
  let mock
  let wrapper

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  const memberInfo = {
    tcode: 't123',
    gender: 'F',
    loginType: 'K',
    userId: 111103108,
    hpNo: '010-9898-9342',
    isSSORequest: 'false',
    isAdult: 'true',
    custNum: '30124937',
    gradeNm: '패밀리',
    userName: '강진영',
    adultAuthYN: 'N',
    entFlag: 'Y',
    userMargetingTM: 'N',
    lastOrder: '2020-03-12 18:21:20.125',
    registration: '2020-03-12 16:44:06.125',
    email: 'lsd251@nsmall.com',
    telNo: '010-9898-9342',
    userMargetingEmail: 'N',
    birthday: '19840425',
    userMarketingSMS: 'N',
    logonId: 'lsd251@nsmall.com',
    failcount: '0',
    sessionid: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    sessionId: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    loginyn: 'Y',
    logonType: 'WEB',
    memberGradeCss: 'family',
    staffInfo: false,
    staffInfoName: '대표',
    staffBnft: 'Y'
  }

  const nsMembershipRealUrl = `${CONST.API_URL}/NsMembershipReal`
  const ajaxMembershipViewUrl = `${CONST.API_URL}/AjaxMembershipView`

  const nsMembershipRealResult = {
    msg: {
      root: {
        GrdCondition: {
          conditionInfo: [],
          requiredOrderAmt: 0,
          orderAmt: 0,
          requiredOrderCnt: 1,
          orderCnt: 0,
          standardDate: {
            startDate: '2020.01',
            endDate: '2020.06'
          }
        },
        PurchaseGrd: {
          nextGradeRule: 'H',
          currentGrd: 'R10',
          nextGrd: 'R2',
          currentGrdName: '패밀리',
          currentGrdRank: '5',
          bonusTolPointHdg: 0,
          bonusTolPointUpg: 0,
          lastMonthGrd: '',
          nextGrdName: '실버',
          memGubun: 'K',
          lastMonthGrdName: '',
          lastMonthGrdRank: '',
          deliveryGrantYn: 'X',
          isEmpMbr: 'N'
        },
        GrdBenefit: {
          liveCpDownYn: 'X',
          plusCpBnftVal: '2',
          liveCpIdfr: 1020318,
          normalCpDownYn: 'Y',
          normalCpIdfr: 1020316,
          hdgPointGrantYn: 'X',
          upgPointGrantYn: 'X',
          nomarCpBnftVal: '2000',
          plusCpDownYn: 'Y',
          liveCpBnftVal: '3',
          plusCpIdfr: 1020317
        }
      }
    },
    catalogId: '14051',
    userId: '111103108',
    langId: '-9',
    accptPath: '500',
    accptPathCd: '500',
    storeId: '13001'
  }
  const ajaxMembershipViewResult = {
    resultMsg: '',
    cmdType: 'A1',
    catalogId: '14051',
    userId: '111115173',
    langId: '-9',
    accptPath: '500',
    accptPathCd: '500',
    storeId: '13001',
    result: true
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    wrapper = mount(Membership, options)
    loginUtil.login(memberInfo)
  })

  beforeEach(() => {
    mock.reset()
  })

  it('onLoad call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(nsMembershipRealUrl)
      .reply(200, nsMembershipRealResult)

    try {
      vm.onLoad()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal('family', vm.membershipInfo.isGrade)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('downloadAll call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(ajaxMembershipViewUrl)
      .reply(200, ajaxMembershipViewResult)

    try {
      vm.downloadAll()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal(false, vm.membershipInfo.isCouponDown)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('onCollapseGrade call', () => {
    const vm = wrapper.vm

    vm.collapseGrade = false
    vm.onCollapseGrade()
    assert.equal(true, vm.collapseGrade)
  })

  it('onCollapseBenefit call', () => {
    const vm = wrapper.vm

    vm.collapseBenefit = false
    vm.onCollapseBenefit()
    assert.equal(true, vm.collapseBenefit)
  })
})
