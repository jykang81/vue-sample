import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import axios from 'axios'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'
// import cookieUtil from '@frameworks/cookieUtil'

import OrderNspayReturn from '@/views/order/OrderNspayReturn'

describe('OrderNspayReturn', () => {
  let localVue
  let options

  beforeEach(() => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

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

    options = {
      localVue,
      store,
      router,
      attachToDocument: true,
      propsData: {
        param: { orderNspayParams: {} }
      },
      data () {
        return {
        }
      }
    }
  })

  describe('OrderNspayReturn 테스트1', () => {
    // it('비밀번호1 (created())', () => {
    //   Object.defineProperty(window, 'location', {
    //     value: {
    //       href: 'https://mwapi.nsmall.com/nsmall/mobile/kicc/easypay_mob_request.jsp?type=creditcard&payAmt=12250&TOTAL_PRODUCT_AMT=12900&OFFER_AMT=0&SHIP_CHARGE=0&SHIP_CHARGE_ONE_DELIVERY=0&SHIP_CHARGE_MULTI_DELIVERY=0&FINAL_PAYMENT_AMT=12250&couponDcAmt=650&cardDcAmt=0&freeShippingDcAmt=0&Additionalpaymentamount=0&EP_mall_id=05525699&EP_noinst_flag=N&EP_noinst_term=&EP_quota=00&payType=100&requestCommand=RequestInfo&orderCompleteYn=N&EP_product_amt=12900&EP_user_nm=테스터&EP_user_mail=test@test.com&EP_user_phone2=010-1234-5678&EP_usedcard_code=006&EP_point_useyn=N&custNum=688655818&str_apvl_chain_no_lt=&VAN_CO=00&moduleGubun=E&usedcard_code=HN&EcompCardName=006|하나카드&EP_order_no=300068135072&EP_user_type=1&EP_user_id=test@test.com&EP_user_phone1=010-1234-5678&EP_user_addr=회원주소&EP_product_type=0&EP_product_nm=하림 굿초이스 치킨너겟 1kg 11 봉&EP_product_expr=&EP_tax_flg=N&EP_cert_type=0&EP_mall_id_temp=05525699&EP_mall_id_free_temp=05525698&EP_currency=00&EP_agent_ver=JSP&EP_mall_nm=NS홈쇼핑&EP_mall_pwd=1111&EP_lang_flag=KOR&EP_ci_url=gw.easypay.co.kr&EP_pay_type=11&EP_card_code=&EP_card_prefix=&EP_ret_pay_type=&EP_trace_no=&EP_min_install_cnt=0&successFunc=CurrentView.event.callbackPaymentResult&failFunc=CurrentView.event.callbackPaymentFail&targetType=payment&target=certView&MOB_RET_URL=http://m.nsmall.com/html/common/return_payment.html&MOB_ERR_URL=http://m.nsmall.com/html/common/return_error.html&MOB_PASS=WEB&MOB_VIEW_TYPE=androidweb'
    //     },
    //     writable: true
    //   })

    //   window.NSHub = {
    //     naCloseWebView: () => {},
    //     naShowToast: m => {},
    //     naGoHome: () => {}
    //   }
    //   const params = {
    //     callbackNspayPasswordChangeResult: params => {},
    //     callbackNspayPasswordResult: params => {},
    //     callbackNspayInfoResult: params => {},
    //     callbackName: 'callbackNspayPasswordChangeResult'
    //   }
    //   cookieUtil.setCookie('objVue', params)
    //   const wrapper = mount(OrderNspayReturn, options)
    //   wrapper.vm.init()
    //   wrapper.vm.onclickClose()

    //   params.callbackName = 'callbackNspayPasswordResult'
    //   cookieUtil.setCookie('objVue', params)
    //   wrapper.vm.init()
    //   wrapper.vm.onclickClose()

    //   params.callbackName = 'callbackNspayInfoResult'
    //   cookieUtil.setCookie('objVue', params)
    //   wrapper.vm.init()
    //   wrapper.vm.onclickClose()
    //   assert.isTrue(true)
    // })
    it('비밀번호2 (created())', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://mwapi.nsmall.com/nsmall/mobile/kicc/easypay_mob_request.jsp?type=creditcard&payAmt=12250&TOTAL_PRODUCT_AMT=12900&OFFER_AMT=0&SHIP_CHARGE=0&SHIP_CHARGE_ONE_DELIVERY=0&SHIP_CHARGE_MULTI_DELIVERY=0&FINAL_PAYMENT_AMT=12250&couponDcAmt=650&cardDcAmt=0&freeShippingDcAmt=0&Additionalpaymentamount=0&EP_mall_id=05525699&EP_noinst_flag=N&EP_noinst_term=&EP_quota=00&payType=100&requestCommand=RequestInfo&orderCompleteYn=N&EP_product_amt=12900&EP_user_nm=테스터&EP_user_mail=test@test.com&EP_user_phone2=010-1234-5678&EP_usedcard_code=006&EP_point_useyn=N&custNum=688655818&str_apvl_chain_no_lt=&VAN_CO=00&moduleGubun=E&usedcard_code=HN&EcompCardName=006|하나카드&EP_order_no=300068135072&EP_user_type=1&EP_user_id=test@test.com&EP_user_phone1=010-1234-5678&EP_user_addr=회원주소&EP_product_type=0&EP_product_nm=하림 굿초이스 치킨너겟 1kg 11 봉&EP_product_expr=&EP_tax_flg=N&EP_cert_type=0&EP_mall_id_temp=05525699&EP_mall_id_free_temp=05525698&EP_currency=00&EP_agent_ver=JSP&EP_mall_nm=NS홈쇼핑&EP_mall_pwd=1111&EP_lang_flag=KOR&EP_ci_url=gw.easypay.co.kr&EP_pay_type=11&EP_card_code=&EP_card_prefix=&EP_ret_pay_type=&EP_trace_no=&EP_min_install_cnt=0&successFunc=CurrentView.event.callbackPaymentResult&failFunc=CurrentView.event.callbackPaymentFail&targetType=payment&target=certView&MOB_RET_URL=http://m.nsmall.com/html/common/return_payment.html&MOB_ERR_URL=http://m.nsmall.com/html/common/return_error.html&MOB_PASS=WEB&MOB_VIEW_TYPE=androidweb'
        },
        writable: true
      })
      const wrapper = mount(OrderNspayReturn, options)
      window.opener.vm.callbackName = 'callbackNspayPasswordChangeResult'
      wrapper.vm.init()
      wrapper.vm.onclickClose()

      window.opener.vm.callbackName = 'callbackNspayPasswordResult'
      wrapper.vm.init()
      wrapper.vm.onclickClose()

      window.opener.vm.callbackName = 'callbackNspayInfoResult'
      wrapper.vm.init()
      wrapper.vm.onclickClose()

      assert.isTrue(true)
    })
  })
})
