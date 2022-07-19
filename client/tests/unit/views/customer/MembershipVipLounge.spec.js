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
import MemberShipVipLounge from '@/views/customer/MemberShipVipLounge'
import loginUtil from '@utils/loginUtil'

describe('memberShipVipLounge', () => {
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

  const espotCommonUrl = `${CONST.API_URL}/NSEspotCommon`
  const ajaxMTimesEventCmdUrl = `${CONST.API_URL}/NSAjaxMTimesEventCmd`

  const espotCommonResult = {
    msg: {
      root: {
        _MOB_VIP_EVENT_BANNERLIST: [
          {
            espotType: 'MarketingContent',
            espotId: '398953',
            contentMimeType: 'image',
            imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/banner/event/2020/02/banner_viplounge01.png',
            espotTitle: '',
            marketingText: '',
            contentsId: '594152',
            clickCode: '',
            espotTitleImgPath: '',
            mdUrl: 'http://devm.nsmall.com/NSTimesEvent?offer_id=100000030529&amp;btn=off',
            clickTarget: 'External',
            espotTitleText: '',
            espotTitleMimeType: ''
          },
          {
            espotType: 'MarketingContent',
            espotId: '398953',
            contentMimeType: 'image',
            imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/banner/mobile/etv/2018/05/(m)d0521_event_bn_etv105.jpg',
            espotTitle: '',
            marketingText: 'Offer_01:100000029649,Offer_02:100000029649',
            contentsId: '551652',
            clickCode: '',
            espotTitleImgPath: '',
            mdUrl: 'http://devm.nsmall.com/NSTVEvent',
            clickTarget: 'External',
            espotTitleText: '',
            espotTitleMimeType: ''
          },
          {
            espotType: 'MarketingContent',
            espotId: '398953',
            contentMimeType: 'image',
            imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/mobile/03_Event/tall_luxckybox/D_1_ev_150707_luckybox.png',
            espotTitle: '',
            marketingText: 'NO-DISPLAY',
            contentsId: '357652',
            clickCode: '',
            espotTitleImgPath: '',
            mdUrl: 'http://m.nsmall.com/NSLuckyboxEvent',
            clickTarget: 'External',
            espotTitleText: '',
            espotTitleMimeType: ''
          },
          {
            espotType: 'MarketingContent',
            espotId: '398953',
            contentMimeType: 'image',
            imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/mobile/13_push/1708/(m)d170829_event_bn_app_push_moz84.jpg',
            espotTitle: '',
            marketingText: '',
            contentsId: '333652',
            clickCode: '',
            espotTitleImgPath: '',
            mdUrl: 'http://devm.nsmall.com/NSPushAgreementEvent?offer_id=100000029354',
            clickTarget: 'External',
            espotTitleText: '',
            espotTitleMimeType: ''
          }
        ]
      }
    },
    catalogId: '14051',
    viewTaskName: 'NSAjaxActionResponse',
    espotInfo: 'MOB_VIP_EVENT_BANNERLIST|Content',
    userId: '111140012',
    langId: '-9',
    accptPath: '500',
    accptPathCd: '500',
    storeId: '13001'
  }
  const ajaxMTimesEventCmdResult = {
    msg: {
      totCnt: 0,
      rowPerPage: 3,
      tab_gubun: 3,
      eventList: [
        {
          eventState: 'A',
          offerIdfr: '123',
          artclNum: '1234',
          recGb: 'VIP',
          title: '샘플이벤트결과',
          wnrDt: '2020-01-01 00:00:00'
        }
      ],
      pageIdx: 1
    },
    tab_gubun: '3',
    userId: '111140012',
    sel_gubun: 'AL',
    langId: '-9',
    accptPath: '500',
    recGb: '99',
    accptPathCd: '500',
    pageIdx: '1',
    rowPerPage: '3',
    cmdType: '101',
    catalogId: '14051',
    storeId: '13001',
    imgType: 'BANNIMGIDSEQ1'
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    wrapper = mount(MemberShipVipLounge, options)
    loginUtil.login(memberInfo)
  })

  beforeEach(() => {
    mock.reset()
  })

  it('init call', async () => {
    mock
      .onPost(espotCommonUrl)
      .reply(200, espotCommonResult)
      .onPost(ajaxMTimesEventCmdUrl)
      .reply(200, ajaxMTimesEventCmdResult)

    try {
      await flushPromises()

      await wrapper.vm.$nextTick()
      // then
      assert.equal(true, true)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('setNSMTimesEvent call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(espotCommonUrl)
      .reply(200, espotCommonResult)
      .onPost(ajaxMTimesEventCmdUrl)
      .reply(200, ajaxMTimesEventCmdResult)

    try {
      await flushPromises()

      await wrapper.vm.$nextTick()
      vm.setNSMTimesEvent(espotCommonResult)

      // then
      assert.equal(true, vm.isEvent)
    } catch (e) {
      assert.fail(e.message)
    }
  })

  it('setNoticeListMobile call', async () => {
    const vm = wrapper.vm

    mock
      .onPost(espotCommonUrl)
      .reply(200, espotCommonResult)
      .onPost(ajaxMTimesEventCmdUrl)
      .reply(200, ajaxMTimesEventCmdResult)

    try {
      await flushPromises()

      await wrapper.vm.$nextTick()
      vm.setNoticeListMobile(ajaxMTimesEventCmdResult)

      const itemData = ajaxMTimesEventCmdResult.msg.eventList[0]
      const eventState = itemData.eventState
      const offerIdfr = itemData.offerIdfr
      const artclNum = itemData.artclNum

      vm.onclickDetailNotice(eventState, offerIdfr, itemData, artclNum)
      // then
      assert.equal(true, vm.isEventWinningResult)
    } catch (e) {
      assert.fail(e.message)
    }
  })
})
