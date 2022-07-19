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
import EmployeeVerificationEmail from '@/views/customer/employee/EmployeeVerificationEmail'
import loginUtil from '@utils/loginUtil'

describe('EmployeeVerificationEmail', () => {
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

  const getCompanyGroupListUrl = `${CONST.API_URL}/GetCompanyGroupList`
  const sendStaffAuthMailUrl = `${CONST.API_URL}/SendStaffAuthMail`
  const getStaffAuthInfoUrl = `${CONST.API_URL}/GetStaffAuthInfo`

  const getCompanyGroupListResult = {
    accptPath: '500',
    accptPathCd: '500',
    catalogId: '14051',
    companyGroupList: [
      {
        comm_cd_val_dfin: '하림지주',
        class: 'class com.ns.commerce.nscommon.bean.NSCommonCodeDataBean',
        comm_cd_nm: 'FAMILY_COM_GRP',
        comm_cd_instc: 'harimgroup.com',
        comm_cd_val: 'HARIMGROUP'
      },
      {
        comm_cd_val_dfin: '한국썸벧㈜',
        class: 'class com.ns.commerce.nscommon.bean.NSCommonCodeDataBean',
        comm_cd_nm: 'FAMILY_COM_GRP',
        comm_cd_instc: 'ktvt.kr',
        comm_cd_val: 'KTVT'
      }
    ],
    isSuccessful: true,
    langId: '-9',
    storeId: '13001',
    userId: '111098089',
    viewTaskName: 'NSAjaxActionResponse'
  }
  const sendStaffAuthMailResult = {
    accptPath: '500',
    accptPathCd: '500',
    authUrl: 'http://devwww.nsmall.com/ConfirmStaffAuthResult?token=kuUKIuhgWZ6bD5zU%2FolbDGGcBk5lnsrjQ74xnXu8Dv7MqASqZvPLcRNBxDSdI1rNCWZQZArOgWed8BlVAk5x7GN2%2FQ90baifx2MSahSDUT0tqNuw4t6PDghBdhP6ilhqABzFvpW5%2BuVqT17LaRcJTU5rzhnO%2BmR%2BhycmGyH7xj8%3D',
    catalogId: '14051',
    companyGroupCode: 'HARIMGROUP',
    isSuccessful: true,
    langId: '-9',
    loginId: 'lsd252@gmail.com',
    mailcode: '68',
    msg: '메일이 발송되었습니다. 수신이 되지 않는 경우에는 NS홈쇼핑 고객센터(1800-0770)로 문의해주세요',
    recipientMail: 'lsd256@harimgroup.com',
    recipientName: '강진영',
    storeId: '13001',
    success: true,
    userId: '111098089'
  }
  const getStaffAuthInfoResult = {
    accptPath: '500',
    accptPathCd: '500',
    catalogId: '14051',
    langId: '-9',
    staffBnft: {
      balanceAmt: 0,
      bnftBiggerYn: 'N',
      class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
      couponBnftRate: 0,
      couponId: '',
      empYn: 'N',
      limitAmt: 0,
      memberId: '',
      useAmt: 0,
      userId: 0
    },
    staffInfo: {
      class: 'class com.ns.commerce.staff.bean.StaffInfoBean',
      companyGroupCode: 'HARIMGROUP',
      companyGroupMail: 'lsd250@harimgroup.com',
      expiredDate: '2021-01-11',
      nsEmpTopCategoryId: null,
      userId: '111103108'
    },
    storeId: '13001',
    userId: '111103108'
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    wrapper = mount(EmployeeVerificationEmail, options)
    loginUtil.login(memberInfo)
  })

  beforeEach(() => {
    mock.reset()
  })

  it('getGroupDomain call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(getCompanyGroupListUrl)
      .reply(200, getCompanyGroupListResult)

    try {
      vm.getGroupDomain()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal('HARIMGROUP', vm.groupDomainSelect)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('isProc실행 아이디 null', () => {
    const vm = wrapper.vm

    vm.idParams.value = ''
    vm.isProc()
    assert.equal(true, vm.isDisabled)
  })

  it('isProc실행 아이디 존재', () => {
    const vm = wrapper.vm

    vm.idParams.value = 'lsd25'
    vm.isProc()
    assert.equal(false, vm.isDisabled)
  })

  it('임직원메일 발송', async () => {
    const vm = wrapper.vm

    mock
      .onPost(sendStaffAuthMailUrl)
      .reply(200, sendStaffAuthMailResult)

    try {
      vm.idParams.value = 'lsd25'
      vm.getGroupDomainParam()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal('HARIMGROUP', vm.groupDomainSelect)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('임직원 인증여부 확인', async () => {
    const vm = wrapper.vm

    mock
      .onPost(getStaffAuthInfoUrl)
      .reply(200, getStaffAuthInfoResult)

    try {
      vm.chkStaff()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal('HARIMGROUP', vm.groupDomainSelect)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('callChkStaff call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(getStaffAuthInfoUrl)
      .reply(200, getStaffAuthInfoResult)

    try {
      vm.callChkStaff()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal('HARIMGROUP', vm.groupDomainSelect)
    } catch (e) {
      assert.fail(e.message)
    }
  })
})
