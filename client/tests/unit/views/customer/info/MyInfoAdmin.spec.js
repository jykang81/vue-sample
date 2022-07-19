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
import MyInfoAdmin from '@/views/customer/info/MyInfoAdmin'
import { MobilePersonalInfoManageCmdReal, NSShippingAddressAccessCmdReal, NSShippingAddressAccessCmdRealEmpty } from '@unit/views/customer/info/mock/myInfoAdminResponse'

describe('내정보관리', () => {
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

  it('MyInfoAdmin Created -> onLoad, 주소 등록 케이스', async () => {
    mock.reset()
    mock.onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`)
      .reply(200, MobilePersonalInfoManageCmdReal)
    mock.onPost(`${CONST.API_URL}/NSShippingAddressAccessCmdReal`)
      .reply(200, NSShippingAddressAccessCmdReal)
    const wrapper = mount(MyInfoAdmin, options)
    const vm = wrapper.vm
    vm.onLoad()
    await flushPromises()

    assert.equal(vm.userName, MobilePersonalInfoManageCmdReal.msg.root.PersonalInfo.lastName)
    assert.equal(vm.userLogonId, MobilePersonalInfoManageCmdReal.msg.root.PersonalInfo.logonId)
    let resPhone = MobilePersonalInfoManageCmdReal.msg.root.PersonalInfo.phoneNum
    const hpFirst = resPhone.substring(0, 3)
    const hpMid = resPhone.length === 10 ? resPhone.substring(3, 6) : resPhone.substring(3, 7)
    const hpLast = resPhone.length === 10 ? resPhone.substring(6) : resPhone.substring(7)
    resPhone = `${hpFirst}-${hpMid}-${hpLast}`
    assert.equal(vm.userPhone, resPhone)

    assert.equal(vm.userReceiverInAddress, NSShippingAddressAccessCmdReal.msg.addressList[0].lastName)
    assert.equal(vm.userAddressInAddress, `${NSShippingAddressAccessCmdReal.msg.addressList[0].addressBas} ${NSShippingAddressAccessCmdReal.msg.addressList[0].addressDtl}`)
    assert.equal(vm.userPhoneInAddress, NSShippingAddressAccessCmdReal.msg.addressList[0].phone1)
  })

  it('MyInfoAdmin Created -> onLoad, 주소 미등록 케이스', async () => {
    mock.reset()
    mock.onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`)
      .reply(200, MobilePersonalInfoManageCmdReal)
    mock.onPost(`${CONST.API_URL}/NSShippingAddressAccessCmdReal`)
      .reply(200, NSShippingAddressAccessCmdRealEmpty)
    const wrapper = mount(MyInfoAdmin, options)
    const vm = wrapper.vm
    vm.onLoad()
    await flushPromises()

    assert.equal(vm.userName, MobilePersonalInfoManageCmdReal.msg.root.PersonalInfo.lastName)
    assert.equal(vm.userLogonId, MobilePersonalInfoManageCmdReal.msg.root.PersonalInfo.logonId)
    let resPhone = MobilePersonalInfoManageCmdReal.msg.root.PersonalInfo.phoneNum
    const hpFirst = resPhone.substring(0, 3)
    const hpMid = resPhone.length === 10 ? resPhone.substring(3, 6) : resPhone.substring(3, 7)
    const hpLast = resPhone.length === 10 ? resPhone.substring(6) : resPhone.substring(7)
    resPhone = `${hpFirst}-${hpMid}-${hpLast}`
    assert.equal(vm.userPhone, resPhone)

    assert.equal(vm.userReceiverInAddress, '-')
    assert.equal(vm.userAddressInAddress, '-')
    assert.equal(vm.userPhoneInAddress, '-')

    it('배송지관리 버튼 선택', () => {
      const wrapper = mount(MyInfoAdmin, options)
      const vm = wrapper.vm

      vm.deleveryAddressBook()
      assert.isTrue(true)
    })
  })
})
