import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { shallowMount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import HomeThingliveSlot from '@/views/store/module/HomeThingliveSlot'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import { getProcessedWCSParameter } from '@unit/testUtil'

describe('HomeThingliveSlot', () => {
  let localVue
  let options
  let wrapper
  let mock
  let url

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(anchorMixin)

    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('img-lazy-load', {})
    options = {
      localVue,
      store
    }
    mock = new MockAdapter(axios)
    const params = {
      espotInfo: 'EZ_HOME_TOPC_THING_LIVE|CATEVOD_VODLIVE|1|9999|0',
      accptPath: '',
      accptPathCd: '500',
      req_co_cd: '110',
      userId: '',
      catalogId: '97001'
    }
    const response = {
      msg: [
        {
          _EZ_HOME_TOPC_THING_LIVE: [{
            vodLivePdNm: '박보람',
            vodLiveShNm: '박태양 문성식',
            vodLiveImg: 'https://image.nsmall.com/ec_comimages/nsupload/espot/images/easy/EZ_THING_LIVE_HIGHLIGHT_3.jpg',
            vodLiveEndDttm: '20210126165000',
            vodLiveMdNm: '',
            vodPlayGubun: 'LIVE',
            vodCmmtYn: 'N',
            vodNstalkYn: 'Y',
            vodLiveId: '144',
            vodVideoEndDttm: '20210119145400',
            vodLiveStartDttm: '20210126163800',
            vodVideoStartDttm: '20201221095500',
            _vod_main_product: [{
              dlvrFreeYn: 'Y',
              orderQty: '59',
              promPadYn: 'N',
              brandCd: '705484',
              price: '34900',
              dcPrice: '34900',
              promLspCd: 'N',
              isFlashSale: 'N',
              promPadVal: '0',
              promPadCd: '',
              promIfiVal: '0',
              catentryId: '28276625',
              promLspVal: '0',
              dlvrMsg: '0',
              rccode: '',
              seq: '1',
              espotContentText: '',
              badge: [],
              buschnId: 'INT',
              dlvrPrice: '0',
              brandKorNm: '제주푸드',
              defsortcnt: '',
              headname: '',
              initRegiDttm: '2019-05-14 13:51:02',
              totDataRowCnt: '1',
              espotImgUrl: '',
              adultItemFlag: 'N',
              totProdCnt: '1',
              multiCd: '',
              prcWaveDisp: '',
              partnumber: '28276625',
              dispTypeCd: '10',
              mmRntalPrc: '',
              itncatentrynm: '제주 초당옥수수 20개입(개당 14cm이상)',
              promLspYn: 'N',
              dcRate: '0'
            }],
            vodLiveGoodsNm: '생으로 먹어도 맛있는 원조 초당옥수수 10개 16,900원 / 20개 29,900원',
            _vod_relation_product: [
              {
                dlvrFreeYn: 'Y',
                orderQty: '83',
                promPadYn: 'Y',
                brandCd: '814855',
                price: '16900',
                dcPrice: '16900',
                promLspCd: 'N',
                isFlashSale: 'Y',
                promPadVal: '5',
                promPadCd: 'RTO',
                promIfiVal: '0',
                catentryId: '29816468',
                promLspVal: '0',
                dlvrMsg: '0',
                rccode: '',
                seq: '1',
                espotContentText: '',
                badge: [],
                buschnId: 'INT',
                dlvrPrice: '0',
                brandKorNm: '식탁이 있는 삶',
                defsortcnt: '',
                headname: '',
                initRegiDttm: '2020-06-16 14:54:55',
                totDataRowCnt: '2',
                espotImgUrl: '',
                adultItemFlag: 'N',
                totProdCnt: '2',
                multiCd: '',
                prcWaveDisp: '~',
                partnumber: '29816468',
                dispTypeCd: '15',
                mmRntalPrc: '',
                itncatentrynm: '[띵라이브]생으로 먹어도 달콤한 초당옥수수 10개/정품(14cm이상)',
                promLspYn: 'N',
                dcRate: '0'
              },
              {
                dlvrFreeYn: 'Y',
                orderQty: '62',
                promPadYn: 'N',
                brandCd: '459430',
                price: '17900',
                dcPrice: '17900',
                promLspCd: 'N',
                isFlashSale: 'Y',
                promPadVal: '0',
                promPadCd: '',
                promIfiVal: '0',
                catentryId: '29819226',
                promLspVal: '0',
                dlvrMsg: '0',
                rccode: '',
                seq: '2',
                espotContentText: '',
                badge: [],
                buschnId: 'INT',
                dlvrPrice: '0',
                brandKorNm: '자연애',
                defsortcnt: '',
                headname: '',
                initRegiDttm: '2020-06-17 11:30:37',
                totDataRowCnt: '2',
                espotImgUrl: '',
                adultItemFlag: 'N',
                totProdCnt: '2',
                multiCd: '',
                prcWaveDisp: '',
                partnumber: '29819226',
                dispTypeCd: '10',
                mmRntalPrc: '',
                itncatentrynm: '제주에서 온 초당옥수수 10통 (특품15cm이상)',
                promLspYn: 'N',
                dcRate: '0'
              }
            ],
            vodVideoUrl: 'http://nsplay.nsmall.com/nsplay_vod/2020/20200625/55541444946314027.mp4'
          }]
        },
        {
          espotExtendList: {}
        }
      ],
      req_co_cd: ['110'],
      catalogId: ['97001'],
      espotInfo: ['EZ_HOME_TOPC_THING_LIVE|CATEVOD_VODLIVE|1|9999|0'],
      userId: [''],
      langId: ['-9'],
      accptPath: ['500'],
      accptPathCd: ['500'],
      storeId: ['13001']
    }
    url = `${CONST.API_URL}/NSFixedShopNoCacheCmd`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, response)
    wrapper = shallowMount(HomeThingliveSlot, options)
  })

  it('data() check.', () => {
    const defaultData = wrapper.vm.defaultData
    console.debug('[ defaultData ]\n', defaultData)
  })
})
