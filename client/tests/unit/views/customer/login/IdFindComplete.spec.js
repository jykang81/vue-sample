import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import IdFindComplete from '@/views/customer/login/IdFindComplete'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('IdFindComplete', () => {
  let localVue
  let options
  let wrapper

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    Vue.prototype.$store = store
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    const current = {
      name: null,
      meta: {},
      path: '/',
      hash: '',
      query: {},
      params: {
        viewType: 'ID',
        search_Id: 'bljplz@naver.com|astral06@naver.com|crow5468@naver.com|pwmodtest@nsmall.com|emptest181226@nsmall.com|pwtest190130@nsmall.com|pwmodtest2@nsmall.com|mopwtest190130@nsmall.com|kjihee99@nsmall.com|umanul200@naver.com|ryuhogwon@gmail.com|cityshow|foxlim|lalang22@nate.com|hwk1230@gmail.com|lalang@nate.com|wowkny2@nsmall.com|muto02@naver.com|0907my@gmail.com|eukymi@naver.com|johnny11@hotmail.com|skyksit@nsmall.com|sinsu2@nsmall.com|wowkny5@nsmall.com|lalang2@nate.com|wowkny9@nsmall.com|muto06@naver.com|test02@test02.com|wowkny3@nsmall.com|muto01@naver.com|wowkny7@nsmall.com|lalang@naver.com|muto03@naver.com|enisjey@naver.com|muto806@nsmall.com|lalang@fasol.co.kr|wowkny8@nsmall.com|wowkny@nsmall.com|asdfasdfasdfasd2@naver.com|zxcv@etc.net|asdfsadf@naver.com|qwefqwef@naver.com|trueleesh@nsmall.com|trueleesh@hanmail.net|whitejini77@hotmail.com|sdljkflaskdf@daum.net|asdiofjasodijf@naver.com|ytlee9@itwise.co.kr|hstestiddev4@nsmall.com|testtest0001@naver.com|pji226@nsmall.com|juan22@naver.com|asidfjasdio@naver.com|qefwefqwe@naver.com|sdfasdf@naver.com|llmkhsll@naver.com|mkmk@naver.com|bradlee@nsmall.com|sjjung@nsmall.com|asdfasdf@naver.com|hstestiddev5@nsmall.com|hstestiddev7@nsmall.com|sjjungtest@nsmall.com|lalang1@fasol.co.kr|lalang2@fasol.co.kr|makemuch2@naver.com|asdfqwefqwef@naver.com|testtest002@naver.com|nsmalltest01@naver.com|kmeo04@nsmall.com|leeminh@nsmall.com|hstestiddev12@nsmall.com|suji@nsmall.com|vsdvsdvd@naver.com|aass@naver.com|brad4@nsmall.com|crow5485@naver.com|kimhyuk@nsmall.com|dtimer11212@naver.com|hyojunkim87@gmail.com|brad2@nsmall.com|kss5967@naver.com|sjjung3@daum.net|hawoong12@nsmall.com|aaafafa@naver.com|hstestiddev9@nsmall.com'
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    options = {
      localVue,
      router,
      store
    }

    wrapper = mount(IdFindComplete, options)
  })

  it('setLogonId Call Process', () => {
    wrapper.vm.setLogonId(router.history.current.params.search_Id, 'ID')
    const mailIdLen = wrapper.vm.mailId.length
    const notMailIdLen = wrapper.vm.notMailId.length
    assert.notEqual(0, mailIdLen + notMailIdLen)
  })
})
