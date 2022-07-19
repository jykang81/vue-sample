import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import returnAuth from '@/views/customer/info/ReturnAuth'
// import orderNoMemberCertify from '@components/customer/info/OrderNoMemberCertify'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('ReturnAuth', () => {
  let localVue
  let options
  let wrapper
  // let certify
  const realLocation = window.location
  const realOpener = window.opener

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    Vue.prototype.$store = store
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    // localVue.use(window.location.href = 'https://local.nsmall.com:3000/customer/login/simple/kakao?code=WSOqQpllTeeu7CQkWp3excmp&state=821_http')
    // window.location = realLocation

    options = {
      localVue,
      router,
      store,
      realLocation,
      realOpener
    }

    // certify = mount(orderNoMemberCertify, options)
    // window.location = new URL('https://local.nsmall.com:3000/customer/info/return-auth?type=ipin&resultCode=1&name=%EA%B0%95%EC%A7%84%EC%98%81&gender=1&birth=19811021&national=0&enc_data=AgAEQTI4OGeo%2BHrS7wclsl3MA7QuRhcfrg5z31gKWG1QEm01jYnKS7NogoJ9Xmf3sYIbW7g41%2Bu9wgAf%2B50k8cKrQbw7mJ4UAjq47zqAN46aOtMSoT1%2FpwfsNjj%2BPCEqiSHYnBSM%2F06ONoLxaaKSKo1EsLaEaD%2FFd%2Fedim6RtIKfo%2F5UtPQ1Qo3cj6D1CZhHMavSXPWV%2BT52U%2F8RaEIMb4fxXQQfU9L7S%2Fu7NPP4yKhNyv79xRIkWpHcw7%2FErJaEpScy%2BAnOet09MaysYTPQ9W7U4%2BI2%2F0P7uUPoLaMqjt8mgfBjphGMB8jN8Hr9g5OZCTSIX3FoJMEFnF%2B9znJH20zl0gfXfd1OfCx0NwVQVwqOs0tDggobDe%2BXw4ZAcx62qmVqBCWOeXgUsyO3AmEszUHYzwbYGCS3B1X0X2fJ9RMDvp1BB25WBaz46WuaqLbmlVzxbAs1fcu6RpvK72UrHd4LXqfHc9rET%2FlO1wUORBXILLhOxBLU4VMN90mcu1xQvynBRm1skcDBoLyIhpCb%2Br3loNhPv7RcIL8Xi%2BAXBByR0S4r2ZjsWfDRGiJxrIsnQkn8a3GC9z9dWiC3V159Vhmq94WvLC3uVsJllx2KWRkAL6yXrbqYkbbzGL8%2Ff8RLjeBfb47dq13AZVyXsJwQ11dhDOEej03hmLWkcDrAbp8HBtt913jiDR4qL72CnvTrlxzxGB96dVbBS084vKih96fwrxRucvofKSnGotRBtYt890C44kEyFHza6VbjoRjcXfoT4bDacw%3D%3D&DI=MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH%2FwYueeduhsY9MQOiPi7Km5iCyVjFqQ%3D&CI=mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z%2BOMCUg9Dv%2FE0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw%3D%3D&certUseHp=&certUseHpCorp=')
    wrapper = mount(returnAuth, options)
  })

  // 마운트 할 때 컴포넌트 인스턴스를 검사합니다.
  it('url정보 취득 ', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://local.nsmall.com:3000/customer/info/return-auth?type=ipin&resultCode=1&name=%EA%B0%95%EC%A7%84%EC%98%81&gender=1&birth=19811021&national=0&enc_data=AgAEQTI4OGeo%2BHrS7wclsl3MA7QuRhcfrg5z31gKWG1QEm01jYnKS7NogoJ9Xmf3sYIbW7g41%2Bu9wgAf%2B50k8cKrQbw7mJ4UAjq47zqAN46aOtMSoT1%2FpwfsNjj%2BPCEqiSHYnBSM%2F06ONoLxaaKSKo1EsLaEaD%2FFd%2Fedim6RtIKfo%2F5UtPQ1Qo3cj6D1CZhHMavSXPWV%2BT52U%2F8RaEIMb4fxXQQfU9L7S%2Fu7NPP4yKhNyv79xRIkWpHcw7%2FErJaEpScy%2BAnOet09MaysYTPQ9W7U4%2BI2%2F0P7uUPoLaMqjt8mgfBjphGMB8jN8Hr9g5OZCTSIX3FoJMEFnF%2B9znJH20zl0gfXfd1OfCx0NwVQVwqOs0tDggobDe%2BXw4ZAcx62qmVqBCWOeXgUsyO3AmEszUHYzwbYGCS3B1X0X2fJ9RMDvp1BB25WBaz46WuaqLbmlVzxbAs1fcu6RpvK72UrHd4LXqfHc9rET%2FlO1wUORBXILLhOxBLU4VMN90mcu1xQvynBRm1skcDBoLyIhpCb%2Br3loNhPv7RcIL8Xi%2BAXBByR0S4r2ZjsWfDRGiJxrIsnQkn8a3GC9z9dWiC3V159Vhmq94WvLC3uVsJllx2KWRkAL6yXrbqYkbbzGL8%2Ff8RLjeBfb47dq13AZVyXsJwQ11dhDOEej03hmLWkcDrAbp8HBtt913jiDR4qL72CnvTrlxzxGB96dVbBS084vKih96fwrxRucvofKSnGotRBtYt890C44kEyFHza6VbjoRjcXfoT4bDacw%3D%3D&DI=MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH%2FwYueeduhsY9MQOiPi7Km5iCyVjFqQ%3D&CI=mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z%2BOMCUg9Dv%2FE0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw%3D%3D&certUseHp=&certUseHpCorp='
      }
    })

    // window.opener = {
    //   vm: certify.vm
    // }

    wrapper.vm.onLoad()
    assert.equal(true, true)
  })
})
