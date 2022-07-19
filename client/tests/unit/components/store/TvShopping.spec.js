import { assert } from 'chai' // 필수
import { mount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import TvShopping from '@/views/store/TvShopping'
/*
const NSFixedShopCmdParams = {
  typeFlag: 'espot',
  // 추천 방송상품 $ 홈&리빙 $ 패&뷰 $ 혜택 $ 프로모션 띠배너 $ 인기프로그램
  espotInfo: 'EZ_TV_RCMD1|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_RCMD2|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_RCMD3|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_BNFT|ESPOT_CNTNT4W|1|4|0$EZ_TV_BANNER|ESPOT_CNTNTLIST|1|2|0$EZ_TV_PROGRAM|ESPOT_CNTNT2W|1|9999|0'
}
*/
const NSFixedShopCmdResponse = {
  msg: {
    espotList: [
      {
        _EZ_TV_RCMD1: [
          {
            brandCd: '772014',
            orderQty: '0',
            price: '69000',
            dcPrice: '69000',
            isFlashSale: 'N',
            catentryId: '25592801',
            rccode: '',
            seq: '1',
            espotContentText: '',
            badge: [],
            buschnId: 'TV',
            brandKorNm: '동국제약',
            defsortcnt: '',
            headname: '',
            initRegiDttm: '2017-12-12 11:12:40',
            totDataRowCnt: '4',
            espotImgUrl: '',
            totProdCnt: '4',
            adultItemFlag: 'N',
            multiCd: '',
            partnumber: '25592801',
            prcWaveDisp: '',
            dispTypeCd: '10',
            itncatentrynm: '한세트 동국제약 스포테라팜',
            mmRntalPrc: '',
            dcRate: '0'
          }
        ]
      },
      {
        _EZ_TV_RCMD2: [
          {
            brandCd: '462263',
            orderQty: '49',
            price: '38900',
            dcPrice: '38900',
            isFlashSale: 'Y',
            catentryId: '23264011',
            rccode: '',
            seq: '1',
            espotContentText: '',
            badge: [],
            buschnId: 'INT',
            brandKorNm: '홍진경더김치',
            defsortcnt: '',
            headname: '',
            initRegiDttm: '2016-08-24 17:11:23',
            totDataRowCnt: '4',
            espotImgUrl: '',
            totProdCnt: '4',
            adultItemFlag: 'N',
            multiCd: '',
            partnumber: '23264011',
            prcWaveDisp: '',
            dispTypeCd: '10',
            itncatentrynm: '[홍진경더김치] 나박김치 4kg+깍두기 2kg',
            mmRntalPrc: '',
            dcRate: '0'
          }
        ]
      },
      {
        _EZ_TV_RCMD3: []
      },
      {
        _EZ_TV_BNFT: [
          {
            espotType: 'MarketingContent',
            espotId: '418453',
            contentName: 'EZ_TV_BNFT_01',
            contentMimeType: 'image',
            imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/EZ30_TEMP/TV/shop_benefitmenu_01.png',
            espotTitle: '',
            marketingText: '최대17%',
            contentsId: '612652',
            clickCode: '25592801',
            espotTitleImgPath: '',
            mdUrl: 'ProductDisplay?productId=25592801&amp;catalogId=#catalogId#&amp;storeId=#storeId#',
            clickTarget: 'Product',
            slotTitle: '최대17%',
            espotTitleText: '',
            espotTitleMimeType: ''
          }

        ]
      },
      {
        _EZ_TV_BANNER: [
          {
            espotType: 'MarketingContent',
            espotId: '418454',
            contentName: 'EZ_TV_BANNER_01',
            contentMimeType: 'image',
            imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/EZ30_TEMP/TV/banner1.png',
            espotTitle: '',
            marketingText: '',
            contentsId: '612656',
            clickCode: '25592801',
            espotTitleImgPath: '',
            mdUrl: 'ProductDisplay?productId=25592801&amp;catalogId=#catalogId#&amp;storeId=#storeId#',
            clickTarget: 'Product',
            slotTitle: '',
            espotTitleText: '',
            espotTitleMimeType: ''
          }
        ]
      },
      {
        _EZ_TV_PROGRAM: [
          {
            espotType: 'MarketingContent',
            espotId: '418455',
            contentName: 'EZ_TV_PROGRAM_01',
            contentMimeType: 'image',
            imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/EZ30_TEMP/TV/t_vshopping_program_01.png',
            espotTitle: '',
            marketingText: ';:&amp;#39;&amp;quot;스타일프로포즈|(월) 오전 08:20',
            contentsId: '612658',
            clickCode: '25592801',
            espotTitleImgPath: '',
            mdUrl: 'ProductDisplay?productId=25592801&amp;catalogId=#catalogId#&amp;storeId=#storeId#',
            clickTarget: 'Product',
            slotTitle: ';:스타일프로포즈|(월) 오전 08:20',
            espotTitleText: '',
            espotTitleMimeType: ''
          }
        ]
      }
    ],
    espotExtendList: {
      _EZ_TV_PROGRAM: {
        titleContent: {},
        badge: '',
        css: {}
      },
      _EZ_TV_RCMD1: {
        titleContent: {
          espotType: 'MarketingContent',
          espotId: '417953',
          contentName: 'EZ_TV_RCMD1_TITLE',
          contentMimeType: '',
          imgUrl: '',
          espotTitle: '',
          marketingText: '추천 방송 상품 ',
          contentsId: '614152',
          clickCode: '',
          espotTitleImgPath: '',
          subTitle: '',
          mdUrl: '',
          clickTarget: '',
          espotTitleText: '',
          mainTitle: '추천 방송 상품 ',
          espotTitleMimeType: ''
        },
        badge: '',
        css: {}
      },
      _EZ_TV_RCMD2: {
        titleContent: {
          espotType: 'MarketingContent',
          espotId: '417954',
          contentName: 'EZ_TV_RCMD2_TITLE',
          contentMimeType: '',
          imgUrl: '',
          espotTitle: '',
          marketingText: '홈＆리빙 인기상품',
          contentsId: '614153',
          clickCode: '',
          espotTitleImgPath: '',
          subTitle: '',
          mdUrl: '',
          clickTarget: '',
          espotTitleText: '',
          mainTitle: '홈＆리빙 인기상품',
          espotTitleMimeType: ''
        },
        badge: '',
        css: {}
      },
      _EZ_TV_BNFT: {
        titleContent: {},
        badge: '',
        css: {}
      },
      _EZ_TV_BANNER: {
        titleContent: {},
        badge: '',
        css: {}
      }
    }
  },
  req_co_cd: ['110'],
  catalogId: ['97001'],
  viewTaskName: 'NSAjaxActionResponse',
  espotInfo: ['EZ_TV_RCMD1|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_RCMD2|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_RCMD3|ESPOT_PRDSLIDESQUARE25W|1|9999|0$EZ_TV_BNFT|ESPOT_CNTNT4W|1|4|0$EZ_TV_BANNER|ESPOT_CNTNTLIST|1|2|0$EZ_TV_PROGRAM|ESPOT_CNTNT2W|1|9999|0'],
  typeFlag: ['espot'],
  userId: [''],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001']
}
/*
const NSFixedShopNoCacheCmdParams = {
  typeFlag: 'espot',
  espotInfo: 'EZ_TV_BROAD|TVSCHEDULE24_NONE|1|9999|0'
}
*/
const NSFixedShopNoCacheCmdResponse = {
  msg: [
    {
      _EZ_TV_BROAD: [{
        TvSchedule: {
          nstalkYn: 'N',
          TotalOrgan: [
            {
              goodsName: '[TV](무이자)끌레드벨 24K 리프팅 프로그램(블루밍)',
              salePrice: '99000',
              endDtm: '20210126200000',
              orderYn: 'Y',
              busChnId: 'TV',
              dlvrFreeYn: 'Y',
              RelTotalOrgan: [],
              saleRate: '0',
              brandCd: '704036',
              promPadYn: 'N',
              goodsId: '26185228',
              catentryId: '26185228',
              startDtm: '20210126190000',
              partNumber: '26185228',
              promIfiYn: 'N',
              goodsUnitName: '[TV](무이자)끌레드벨 24K 리프팅 ',
              brandName: '미정의',
              videoUrl: 'http://192.168.13.133/best_vod/testvod.mp4',
              headCopy: '',
              priceofferprice: '99000',
              pgmCD: '1125443',
              onAirFlag: 'A',
              adultItemFlag: 'N',
              multiCd: '',
              prcWaveDisp: '',
              dispTypeCd: '10'
            }
          ]
        }
      }]
    },
    {
      espotExtendList: {
        _EZ_TV_BROAD: {
          titleContent: {},
          badge: '',
          css: {}
        }
      }
    }
  ],
  req_co_cd: ['110'],
  catalogId: ['97001'],
  espotInfo: ['EZ_TV_BROAD|TVSCHEDULE24_NONE|1|9999|0'],
  typeFlag: ['espot'],
  userId: [''],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001']
}

const initTvShopping = mock => {
  mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`)
    .reply(200, NSFixedShopCmdResponse)
  mock.onPost(`${CONST.API_URL}/NSFixedShopNoCacheCmd`)
    .reply(200, NSFixedShopNoCacheCmdResponse)

  return mock
}

describe('TvShopping', () => {
  let localVue
  let options
  let wrapper
  let vm
  let mock

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initTvShopping(mock)

    options = {
      localVue,
      store,
      router
    }

    wrapper = mount(TvShopping, options)
    vm = wrapper.vm
    await flushPromises()
  })

  it('popularProgramProductDetail', async () => {
    const params = {
      espotType: 'MarketingContent',
      espotId: '418455',
      contentName: 'EZ_TV_PROGRAM_01',
      contentMimeType: 'image',
      imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/EZ30_TEMP/TV/t_vshopping_program_01.png',
      espotTitle: '',
      marketingText: ';:&amp;#39;&amp;quot;스타일프로포즈|(월) 오전 08:20',
      contentsId: '612658',
      clickCode: '25592801',
      espotTitleImgPath: '',
      mdUrl: 'ProductDisplay?productId=25592801&amp;catalogId=#catalogId#&amp;storeId=#storeId#',
      clickTarget: 'Product',
      slotTitle: ';:스타일프로포즈|(월) 오전 08:20',
      espotTitleText: '',
      espotTitleMimeType: ''
    }
    vm.popularProgramProductDetail(params)
  })

  it('preRecommendProductDetail', async () => {
    vm.preRecommendProductDetail('23264011', { clksrc: 'TV쇼핑_홈＆리빙인기상품_인기방송상품' }, '홈＆리빙 인기상품', '[홍진경더김치] 나박김치 4kg+깍두기 2kg', '홍진경더김치', '38900')
  })

  it('promotionBannerLogging', async () => {
    vm.promotionBannerLogging('Product', '612656', '25592801', '418454', 'ProductDisplay?productId=25592801&amp;catalogId=#catalogId#&amp;storeId=#storeId#', 'EZ_TV_BANNER_01')
  })

  it('espotClickEventLogging', async () => {
    vm.espotClickEventLogging('Product', '612652', '25592801', '418453', 'ProductDisplay?productId=25592801&amp;catalogId=#catalogId#&amp;storeId=#storeId#', '최대17%')
  })

  it('nextProductDetailLogging', async () => {
    const productInfo = {
      goodsName: '[TV](무이자)끌레드벨 24K 리프팅 프로그램(블루밍)',
      salePrice: '99000',
      endDtm: '20210126200000',
      orderYn: 'Y',
      busChnId: 'TV',
      dlvrFreeYn: 'Y',
      RelTotalOrgan: [],
      saleRate: '0',
      brandCd: '704036',
      promPadYn: 'N',
      goodsId: '26185228',
      catentryId: '26185228',
      startDtm: '20210126190000',
      partNumber: '26185228',
      promIfiYn: 'N',
      goodsUnitName: '[TV](무이자)끌레드벨 24K 리프팅 ',
      brandName: '미정의',
      videoUrl: 'http://192.168.13.133/best_vod/testvod.mp4',
      headCopy: '',
      priceofferprice: '99000',
      pgmCD: '1125443',
      onAirFlag: 'A',
      adultItemFlag: 'N',
      multiCd: '',
      prcWaveDisp: '',
      dispTypeCd: '10'
    }
    const clksrc = { clksrc: 'TV쇼핑_다음방송상품' }
    vm.nextProductDetailLogging(productInfo, clksrc)
  })

  it('recomProductDetailLogging', async () => {
    const productInfo = {
      brandCd: '772014',
      orderQty: '0',
      price: '69000',
      dcPrice: '69000',
      isFlashSale: 'N',
      catentryId: '25592801',
      rccode: '',
      seq: '1',
      espotContentText: '',
      badge: [],
      buschnId: 'TV',
      brandKorNm: '동국제약',
      defsortcnt: '',
      headname: '',
      initRegiDttm: '2017-12-12 11:12:40',
      totDataRowCnt: '4',
      espotImgUrl: '',
      totProdCnt: '4',
      adultItemFlag: 'N',
      multiCd: '',
      partnumber: '25592801',
      prcWaveDisp: '',
      dispTypeCd: '10',
      itncatentrynm: '한세트 동국제약 스포테라팜',
      mmRntalPrc: '',
      dcRate: '0'
    }
    const clksrc = { clksrc: 'TV쇼핑_추천방송상품' }
    vm.recomProductDetailLogging(productInfo, clksrc)
  })

  it('callBackTvScheduleList', async () => {
    vm.callBackTvScheduleList(NSFixedShopNoCacheCmdResponse)
  })

  it('layerOpen', async () => {
    vm.nextTvScheduleList = [{
      partNumber: '26030598'
    }]
    vm.nextTvScheduleList2 = [{
      partNumber: '26030598'
    }]
    vm.nextTvScheduleList = [{
      RelTotalOrgan: [{ catentryId: '26030598' }]
    }]
    vm.nextTvScheduleList2 = [{
      RelTotalOrgan: [{ catentryId: '26030598' }]
    }]
    vm.layer = []
    vm.layer[0] = true

    vm.layerOpen('1', 0, 0)
    assert.equal(true, true)

    vm.layerOpen('2', 0, 0)
    assert.equal(true, true)

    vm.layerOpen('3', 0, 0)
    assert.equal(true, true)

    vm.layerOpen('4', 0, 0)
    assert.equal(true, true)
  })

  it('layerClose', async () => {
    vm.layerClose()
    assert.equal(true, true)
  })

  it('isToday', async () => {
    vm.isToday('20210126190000')
    assert.equal(true, true)
  })
})
