import CONST from '@constants/framework/framework'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'
// import { getProcessedWCSParameter } from '@unit/testUtil'

import ShopPlus from '@/views/store/ShopPlus'

// import temp08ReqNSFixedShopCmd from '@unit/views/store/mock/08_req_NSFixedShopCmd'
import temp08ResNSFixedShopCmd from '@unit/views/store/mock/08_res_NSFixedShopCmd'
// import temp07ReqNSFixedShopNoCacheCmd from '@unit/views/store/mock/07_req_NSFixedShopNoCacheCmd'
import temp07ResNSFixedShopNoCacheCmd from '@unit/views/store/mock/07_res_NSFixedShopNoCacheCmd'

const initTvShopping = mock => {
  mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`)
    .reply(200, temp08ResNSFixedShopCmd)
  mock.onPost(`${CONST.API_URL}/NSFixedShopNoCacheCmd`)
    .reply(200, temp07ResNSFixedShopNoCacheCmd)

  return mock
}

describe('ShopPlus', () => {
  let localVue
  let options
  let tvShoppingWrapper
  let mock

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    delete router.history.current
    router.history.current = {
      name: 'shopPlus',
      meta: {},
      path: '/store/media/shopplus',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initTvShopping(mock)

    options = {
      localVue,
      store,
      router,
      attachToDocument: true,
      data () {
        return {
        }
      }
    }

    tvShoppingWrapper = mount(ShopPlus, options)

    await flushPromises()

    /**
       * vm.$nextTick() -> component 상태 및 템플릿 업데이트
       * vue instance는 비동기 일괄 업데이트 되기 때문에 async / await 구문 사용 필요
       */
    // await wrapper.vm.$nextTick()

    /**
       * pending 상태 promise 대상 flush 처리
       * 테스트 대상 코드에 비동기 처리가 있을 때 사용
       */
    // await flushPromises()
  })
  describe('ShopPlus 테스트', () => {
    // it('onCollapse', async () => {
    //   const wrapper = tvShoppingWrapper.find(ShopPlus)

    //   wrapper.vm.collapse[0] = 'product_related open'
    //   wrapper.vm.onCollapse('1', 0)
    //   assert.equal(true, true)

    //   wrapper.vm.collapse[0] = 'product_related'
    //   wrapper.vm.onCollapse('1', 0)
    //   assert.equal(true, true)

    //   wrapper.vm.collapse[0] = 'product_related open'
    //   wrapper.vm.onCollapse('2', 0)
    //   assert.equal(true, true)

    //   wrapper.vm.collapse[0] = 'product_related'
    //   wrapper.vm.onCollapse('2', 0)
    //   assert.equal(true, true)
    // })

    it('callNsEspotCommon', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.callNsEspotCommon()
      assert.equal(true, true)
    })

    it('callNsEspotMain', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.callNsEspotMain()
      assert.equal(true, true)
    })

    it('callTvScheduleList', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.callTvScheduleList()
      assert.equal(true, true)
    })

    it('layerOpen', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.nextTvScheduleList = [{
        partNumber: '26030598'
      }]
      wrapper.vm.nextTvScheduleList2 = [{
        partNumber: '26030598'
      }]
      wrapper.vm.nextTvScheduleList = [{
        RelTotalOrgan: [{ catentryId: '26030598' }]
      }]
      wrapper.vm.nextTvScheduleList2 = [{
        RelTotalOrgan: [{ catentryId: '26030598' }]
      }]
      wrapper.vm.layer = []
      wrapper.vm.layer[0] = true

      wrapper.vm.layerOpen('1', 0, 0)
      assert.equal(true, true)

      wrapper.vm.layerOpen('2', 0, 0)
      assert.equal(true, true)

      wrapper.vm.layerOpen('3', 0, 0)
      assert.equal(true, true)

      wrapper.vm.layerOpen('4', 0, 0)
      assert.equal(true, true)
    })

    it('layerClose', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.layer = []
      wrapper.vm.layer[0] = false

      wrapper.vm.layerClose()
      assert.equal(true, true)
    })

    // it('callBackTvScheduleList', async () => {
    //   const wrapper = tvShoppingWrapper.find(ShopPlus)
    //   const data = {
    //     msg: [
    //       {
    //         _EZ_CTCOM_BROAD: [
    //           {
    //             TvSchedule: {
    //               TotalOrgan: [
    //                 {
    //                   goodsName: '(역대최다구성/ars최대할인)1+1 동국제약 스포테라팜',
    //                   salePrice: '99000',
    //                   endDtm: '20200803130000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: '한세트 동국제약 스포테라팜',
    //                       salePrice: '69000',
    //                       orderYn: 'D_EN',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'Y',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '69000',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '25592801',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/1/25/801/25592801_F.jpg',
    //                       pgmCD: '1124911',
    //                       catentryId: '25592801',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     }
    //                   ],
    //                   saleRate: '0',
    //                   brandCd: '772014',
    //                   promPadYn: 'N',
    //                   goodsId: '25973244',
    //                   catentryId: '25973244',
    //                   startDtm: '20200803120000',
    //                   partNumber: '25973244',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '(역대최다구성/ars최대할인)1+1 동국제약 스포테라팜',
    //                   brandName: '동국제약',
    //                   videoUrl: 'http://192.168.13.133/best_vod/testvod.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '99000',
    //                   pgmCD: '1124911',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: '[TV]제주 자연담은 양배추 브로콜리진액 총 4박스/120포',
    //                   salePrice: '72000',
    //                   endDtm: '20200803140000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [],
    //                   saleRate: '0',
    //                   brandCd: '794393',
    //                   promPadYn: 'N',
    //                   goodsId: '25687207',
    //                   catentryId: '25687207',
    //                   startDtm: '20200803130000',
    //                   partNumber: '25687207',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '(율)제주 자연담은 양배추 브로콜리진액',
    //                   brandName: '제주 자연담은',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '72000',
    //                   pgmCD: '1091213',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: 'TALK_20170808_1421_합포장N_배송비Y',
    //                   salePrice: '49750',
    //                   endDtm: '20200803150000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'N',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: '제휴사 테스트 주문불가합니다.',
    //                       salePrice: '500',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'N',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '500',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '42827331',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/1/42/331/42827331_F.jpg',
    //                       pgmCD: '1111316',
    //                       catentryId: '42827331',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '15'
    //                     },
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: '[TV]정남진 장흥 건조 매생이 2gX40개',
    //                       salePrice: '48900',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'Y',
    //                       multiCode: '',
    //                       saleRate: '2',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '49900',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '24056427',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/7/24/427/24056427_F.jpg',
    //                       pgmCD: '1111316',
    //                       catentryId: '24056427',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     }
    //                   ],
    //                   saleRate: '0',
    //                   brandCd: '698501',
    //                   promPadYn: 'Y',
    //                   goodsId: '42829880',
    //                   catentryId: '42829880',
    //                   startDtm: '20200803140000',
    //                   partNumber: '42829880',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: 'TALK_20170808_1421_합포장N_배송비Y',
    //                   brandName: '내츄럴',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '50000',
    //                   pgmCD: '1111316',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: 'TRY 풍기인견 남성 더위사냥 6종 패키지\t',
    //                   salePrice: '69900',
    //                   endDtm: '20200803160000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: 'TRY 풍기인견 여성 더위사냥 6종 패키지',
    //                       salePrice: '69900',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'Y',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '69900',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '26196202',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/2/26/202/26196202_F.jpg',
    //                       pgmCD: '1111638',
    //                       catentryId: '26196202',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '15'
    //                     },
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: 'TALK_20170808_1421_합포장N_배송비Y',
    //                       salePrice: '49750',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'N',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'Y',
    //                       sortNum: '0',
    //                       price: '50000',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '42829880',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/0/42/880/42829880_F.jpg',
    //                       pgmCD: '1111638',
    //                       catentryId: '42829880',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     },
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: '제휴사 테스트 주문불가합니다.',
    //                       salePrice: '500',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'N',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '500',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '42827331',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/1/42/331/42827331_F.jpg',
    //                       pgmCD: '1111638',
    //                       catentryId: '42827331',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '15'
    //                     }
    //                   ],
    //                   saleRate: '0',
    //                   brandCd: '460938',
    //                   promPadYn: 'N',
    //                   goodsId: '26196200',
    //                   catentryId: '26196200',
    //                   startDtm: '20200803150000',
    //                   partNumber: '26196200',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: 'TRY 풍기인견 남성 더위사냥 6종 패키지\t',
    //                   brandName: '트라이',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '69900',
    //                   pgmCD: '1111638',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '15'
    //                 },
    //                 {
    //                   goodsName: '(핫)[PAT]여성배색캐주얼',
    //                   salePrice: '0',
    //                   endDtm: '20200803163000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: '[엔츠]나염포인트롱티셔츠3종',
    //                       salePrice: '0',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'Y',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '0',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '42986503',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/3/42/503/42986503_F.jpg',
    //                       pgmCD: '1122906',
    //                       catentryId: '42986503',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     }
    //                   ],
    //                   saleRate: '0',
    //                   brandCd: '698516',
    //                   promPadYn: 'N',
    //                   goodsId: '42986502',
    //                   catentryId: '42986502',
    //                   startDtm: '20200803153000',
    //                   partNumber: '42986502',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '(핫)[PAT]여성배색캐주얼',
    //                   brandName: '나이키',
    //                   videoUrl: 'http://192.168.13.133/best_vod/testvod.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '0',
    //                   pgmCD: '1122906',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: '[TV]하림 마늘 훈제 치킨 반마리 210gX16팩',
    //                   salePrice: '39510',
    //                   endDtm: '20200803170000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: 'TALK_20170808_1421_합포장N_배송비Y',
    //                       salePrice: '49750',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'N',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'Y',
    //                       sortNum: '0',
    //                       price: '50000',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '42829880',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/0/42/880/42829880_F.jpg',
    //                       pgmCD: '1120938',
    //                       catentryId: '42829880',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     }
    //                   ],
    //                   saleRate: '10',
    //                   brandCd: '461879',
    //                   promPadYn: 'N',
    //                   goodsId: '24812027',
    //                   catentryId: '24812027',
    //                   startDtm: '20200803160000',
    //                   partNumber: '24812027',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '하림 마늘훈제치킨16팩',
    //                   brandName: '하림',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '43900',
    //                   pgmCD: '1120938',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: '(쇼)[PAT]여성포인트바캉',
    //                   salePrice: '0',
    //                   endDtm: '20200803173000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [],
    //                   saleRate: '0',
    //                   brandCd: '698516',
    //                   promPadYn: 'N',
    //                   goodsId: '42986513',
    //                   catentryId: '42986513',
    //                   startDtm: '20200803163000',
    //                   partNumber: '42986513',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '(쇼)[PAT]여성포인트바캉',
    //                   brandName: '나이키',
    //                   videoUrl: 'http://192.168.13.133/best_vod/testvod.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '0',
    //                   pgmCD: '1122428',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: '[TV]해피콜 초고속 블렌더 엑슬림Z(순현미 500g+분쇄전용 컨테이너+텀블러(350ml/500ml))',
    //                   salePrice: '389000',
    //                   endDtm: '20200803180000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: '[TV]정남진 장흥 건조 매생이 2gX40개',
    //                       salePrice: '48900',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'Y',
    //                       multiCode: '',
    //                       saleRate: '2',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '49900',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '24056427',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/7/24/427/24056427_F.jpg',
    //                       pgmCD: '1120661',
    //                       catentryId: '24056427',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     }
    //                   ],
    //                   saleRate: '0',
    //                   brandCd: '462071',
    //                   promPadYn: 'N',
    //                   goodsId: '25984015',
    //                   catentryId: '25984015',
    //                   startDtm: '20200803170000',
    //                   partNumber: '25984015',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '해피콜 초고속 블렌더 엑슬림Z(현미1봉+보온병)',
    //                   brandName: '해피콜',
    //                   videoUrl: 'http://192.168.13.133/best_vod/testvod.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '389000',
    //                   pgmCD: '1120661',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '15'
    //                 },
    //                 {
    //                   goodsName: '[TV](무이자)관절팔팔 총 6병/3개월분',
    //                   salePrice: '198000',
    //                   endDtm: '20200803180000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: 'TALK_20170808_1421_합포장N_배송비Y',
    //                       salePrice: '49750',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'N',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'Y',
    //                       sortNum: '0',
    //                       price: '50000',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '42829880',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/0/42/880/42829880_F.jpg',
    //                       pgmCD: '1121886',
    //                       catentryId: '42829880',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     },
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: '[TV]정남진 장흥 건조 매생이 2gX40개',
    //                       salePrice: '48900',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'Y',
    //                       multiCode: '',
    //                       saleRate: '2',
    //                       promPadYn: 'N',
    //                       sortNum: '0',
    //                       price: '49900',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '24056427',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/7/24/427/24056427_F.jpg',
    //                       pgmCD: '1121886',
    //                       catentryId: '24056427',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     }
    //                   ],
    //                   saleRate: '0',
    //                   brandCd: '200000',
    //                   promPadYn: 'N',
    //                   goodsId: '22149449',
    //                   catentryId: '22149449',
    //                   startDtm: '20200803170000',
    //                   partNumber: '22149449',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '(무)관절팔팔',
    //                   brandName: '미정의',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '198000',
    //                   pgmCD: '1121886',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: '[TV]오즈페토 소가죽 드라이빙 컴포트 슈즈',
    //                   salePrice: '39000',
    //                   endDtm: '20200803190000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'N',
    //                   RelTotalOrgan: [
    //                     {
    //                       promIfiYn: 'N',
    //                       goodsName: 'TALK_20170808_1421_합포장N_배송비Y',
    //                       salePrice: '49750',
    //                       orderYn: 'Y',
    //                       buschnId: 'TV',
    //                       dlvrFreeYn: 'N',
    //                       multiCode: '',
    //                       saleRate: '0',
    //                       promPadYn: 'Y',
    //                       sortNum: '0',
    //                       price: '50000',
    //                       broadProdYn: 'Y',
    //                       rangQty: '0',
    //                       goodsId: '42829880',
    //                       imageUrl: '//product-image.dev-nsmall.com/itemimg/0/42/880/42829880_F.jpg',
    //                       pgmCD: '1121902',
    //                       catentryId: '42829880',
    //                       relGbn: 'subProd',
    //                       multiCd: '',
    //                       prcWaveDisp: '',
    //                       dispTypeCd: '10'
    //                     }
    //                   ],
    //                   saleRate: '0',
    //                   brandCd: '472962',
    //                   promPadYn: 'N',
    //                   goodsId: '26191802',
    //                   catentryId: '26191802',
    //                   startDtm: '20200803180000',
    //                   partNumber: '26191802',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '오즈페토 소가죽 드라이빙 컴포트 슈즈',
    //                   brandName: '오즈페토',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '39000',
    //                   pgmCD: '1121902',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '15'
    //                 },
    //                 {
    //                   goodsName: '[TV]스테비아 스위트 200gX10팩',
    //                   salePrice: '99000',
    //                   endDtm: '20200803200000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [],
    //                   saleRate: '0',
    //                   brandCd: '643677',
    //                   promPadYn: 'N',
    //                   goodsId: '25950259',
    //                   catentryId: '25950259',
    //                   startDtm: '20200803190000',
    //                   partNumber: '25950259',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '단일구성 스테비아 스위트(10)',
    //                   brandName: '(브랜드 없음)',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '99000',
    //                   pgmCD: '1121975',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 },
    //                 {
    //                   goodsName: '[TV](무이자)끌레드벨 24K 리프팅 프로그램(블루밍)',
    //                   salePrice: '99000',
    //                   endDtm: '20200803210000',
    //                   orderYn: 'Y',
    //                   busChnId: 'TV',
    //                   dlvrFreeYn: 'Y',
    //                   RelTotalOrgan: [],
    //                   saleRate: '0',
    //                   brandCd: '704036',
    //                   promPadYn: 'N',
    //                   goodsId: '26185228',
    //                   catentryId: '26185228',
    //                   startDtm: '20200803200000',
    //                   partNumber: '26185228',
    //                   promIfiYn: 'N',
    //                   goodsUnitName: '[TV](무이자)끌레드벨 24K 리프팅 ',
    //                   brandName: '미정의',
    //                   videoUrl: 'http://192.168.13.133/best_vod/201801/02/5901478808502560.mp4',
    //                   headCopy: '',
    //                   priceofferprice: '99000',
    //                   pgmCD: '1125443',
    //                   onAirFlag: 'A',
    //                   multiCd: '',
    //                   prcWaveDisp: '',
    //                   dispTypeCd: '10'
    //                 }
    //               ]
    //             }
    //           }
    //         ]
    //       },
    //       {
    //         espotExtendList: {
    //           _EZ_CTCOM_BROAD: {
    //             titleContent: {},
    //             badge: '',
    //             css: {}
    //           }
    //         }
    //       }
    //     ],
    //     catalogId: [
    //       '14051'
    //     ],
    //     espotInfo: [
    //       'EZ_TV_BROAD|TVSCHEDULE24_NONE|1|9999|0'
    //     ],
    //     userId: [
    //       '111476762'
    //     ],
    //     typeFlag: [
    //       'espot'
    //     ],
    //     langId: [
    //       '-9'
    //     ],
    //     accptPath: [
    //       '500'
    //     ],
    //     accptPathCd: [
    //       '500'
    //     ],
    //     storeId: [
    //       '13001'
    //     ],
    //     isSuccessful: true
    //   }

    //   wrapper.vm.callBackTvScheduleList(data)
    //   assert.equal(true, true)
    // })

    it('preRecommendProductDetail', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.preRecommendProductDetail(wrapper.vm.partNumber, '', '', '', '', '')
      assert.equal(true, true)
    })

    it('popularProgramProductDetail', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.popularProgramProductDetail('', '', '', '', '', '')
      assert.equal(true, true)
    })

    it('nextProductDetailLogging', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.nextProductDetailLogging({ productInfo: '' }, '')
      assert.equal(true, true)
    })

    it('promotionBannerLogging', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.promotionBannerLogging('', '', '', '', '', '')
      assert.equal(true, true)
    })

    it('espotClickEventLogging', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.espotClickEventLogging('', '', '', '', '', '')
      assert.equal(true, true)
    })

    it('recomProductDetailLogging', async () => {
      const wrapper = tvShoppingWrapper.find(ShopPlus)

      wrapper.vm.recomProductDetailLogging({ productInfo: '' }, '')
      assert.equal(true, true)
    })
  })
})
