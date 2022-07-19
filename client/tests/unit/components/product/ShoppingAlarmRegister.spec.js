import Vuex from 'vuex'
import nsaxios from '@frameworks/axiosUtil'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'

// import router from '@/router'
import flushPromises from 'flush-promises'
import tvProductGlobalVal from '@unit/views/product/mock/tvProductGlobalVal'
import tvHomeShoppingAjaxResponse from '@unit/views/product/mock/tvHomeShoppingAjaxResponse'

import ShoppingAlarmRegister from '@components/product/ShoppingAlarmRegister'

const tVHomeShoppingAjaxResponse = mock => {
  mock.onPost(`${CONST.API_URL}/TVHomeShoppingAjax`)
    .reply(200, tvHomeShoppingAjaxResponse)

  return mock
}
/*
const tVAlarmRegisterAjaxResponse = mock => {
  mock.onPost(`${CONST.API_URL}/TVHomeShoppingAjax`)
    .reply(200, {
      month: ['10'],
      msg: {
        seccess: '0',
        resultCode: 'Success'
      },
      userId: ['110548084'],
      num: ['10'],
      langId: ['-9'],
      accptPath: ['500'],
      accptPathCd: ['500'],
      cellphone: ['010-3252-9307'],
      telYN: ['Y'],
      catalogId: ['14051'],
      viewTaskName: 'NSAjaxActionResponse',
      catentryId: ['26030598'],
      processFlag: ['updateAlarmMobile'],
      partNumber: ['26030598'],
      storeId: ['13001']
    })

  return mock
}
*/

describe('ShoppingAlarmRegister', () => {
  let localVue
  let options
  let mock

  beforeEach(async () => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.prototype.$nsaxios = nsaxios

    mock = new MockAdapter(axios)

    options = {
      localVue,
      store,
      propsData: {
        param: {
          globalVal: tvProductGlobalVal,
          registeredProductInfo: {
            catentryId: 24092153,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/3/24/153/24092153_Q.jpg',
            isCtcomProduct: null,
            partNumber: '24092153',
            productName: '[TV]이롬 황성주1일1생식 총 4박스/16주분+전용 쉐이커 1개+검은콩고칼슘두유 3박스'
          }
        }
      }
    }
  })
  /*
  it('sets the correct default data', () => {
    assert.equal(typeof ShoppingAlarmRegister.data, 'function')
    const defaultData = ShoppingAlarmRegister.data()
    assert.equal(defaultData.isRegistSuccess, false)
    assert.isEmpty(defaultData.registeredProduct)
    assert.equal(defaultData.getMobileInfoFlag, true)
    assert.equal(defaultData.isMarketingAgreeChecked, false)
    assert.equal(defaultData.pickedPeriod, '10')
    assert.equal(defaultData.pickedCnt, '10')
  })
  */

  describe('methods', () => {
    it('getAlarmInfoMobile', async () => {
      tVHomeShoppingAjaxResponse(mock)
      const wrapper = shallowMount(ShoppingAlarmRegister, options)
      const vm = wrapper.vm
      vm.getAlarmInfoMobile(wrapper.vm.registeredProduct)

      await flushPromises()
    })
    /*
    it('registerTvAlarmSettings', async () => {
      tVAlarmRegisterAjaxResponse(mock)
      const wrapper = shallowMount(ShoppingAlarmRegister, options)
      const vm = wrapper.vm
      vm.registerTvAlarmSettings()

      await flushPromises()
    })
    */
    it('clickRegisterAlarm ', async () => {
      const wrapper = shallowMount(ShoppingAlarmRegister, options)
      wrapper.vm.isMarketingAgreeChecked = true
      wrapper.vm.clickRegisterAlarm()
      // assert.isTrue(wrapper.vm.registeredProduct.mobileNum)
    })
    it('checkInputValue checked', async () => {
      const wrapper = shallowMount(ShoppingAlarmRegister, options)
      wrapper.vm.isMarketingAgreeChecked = true
      const result = wrapper.vm.checkInputValue()
      assert.isTrue(result)
    })
    it('checkInputValue unchecked', async () => {
      const wrapper = shallowMount(ShoppingAlarmRegister, options)
      wrapper.vm.isMarketingAgreeChecked = false
      const result = wrapper.vm.checkInputValue()
      assert.isFalse(result)
    })
    // it('closePopup', async () => {
    //   const wrapper = shallowMount(ShoppingAlarmRegister, options)
    //   wrapper.vm.closePopup()
    // })
  })
})
