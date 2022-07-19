
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import EmployeeVerificationEmailComplete from '@/views/customer/employee/EmployeeVerificationEmailComplete'

describe('EmployeeVerificationEmailComplete', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  it('Mount', () => {
    const wrapper = mount(EmployeeVerificationEmailComplete, options)
    const vm = wrapper.vm
    assert.notEqual('function', typeof vm.data)
  })
})
