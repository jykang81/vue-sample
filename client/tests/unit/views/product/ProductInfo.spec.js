// import CONST from '@constants/framework/framework'
import {
  extend
} from '@utils/commonutil/commonUtil'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import globalVal from '@unit/views/product/mock/globalVal'
import globalValCTcomProduct from '@unit/views/product/mock/globalVal_cTcomProduct'
import globalValTthingLiveProduct from '@unit/views/product/mock/globalVal_tthingLiveProduct'
import globalValTvLiveProduct from '@unit/views/product/mock/globalVal_tvLiveProduct'
import globalValCouponProduct from '@unit/views/product/mock/globalVal_couponProduct'
import ProductInfo from '@/views/product/ProductInfo'

describe('ProductInfo', () => {
  let localVue
  let options

  Vue.use(VueAwesomeSwiper)

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)

    options = {
      localVue,
      store,
      propsData: {
        globalVal
      }
    }
  })

  // 초기값 비교
  /*
  it('sets the correct default data', () => {
    assert.equal(typeof ProductInfo.data, 'function')
    const defaultData = ProductInfo.data()
    assert.exists(defaultData.swiperOption)
  })
  */

  describe('computed test', () => {
    it('isLiveProduct 값 ', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValTvLiveProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isTrue(wrapper.vm.isLiveProduct)
    })
    it('computedPlayerOption  ', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValTthingLiveProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isNotNull(wrapper.vm.computedPlayerOption)
    })
    it('saleInfo 값 ', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValCTcomProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isNotNull(wrapper.vm.saleInfo)
    })
    it('saleInfo 값 ', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValCouponProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isNotNull(wrapper.vm.saleInfo)
    })
    it('isCtcomProduct 값 ', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValCTcomProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isTrue(wrapper.vm.isCtcomProduct)
    })
    it('isCtcomLiveProduct 값 ', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValCTcomProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isTrue(wrapper.vm.isCtcomLiveProduct)
    })
    it('isTVProduct 값 ', () => {
      // const wrapper = shallowMount(ProductInfo, options)
      // assert.isNull(wrapper.vm.isTVProduct)
    })
    it('showTvShopping 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showTvShopping, false)
    })
    it('showLiveShopping  값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showLiveShopping, false)
    })
    it('remainingtimeText   값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.remainingtimeText, '')
    })
    it('showRatingStar 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showRatingStar, true)
    })
    it('showHappyDealArea 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showHappyDealArea, true)
    })
    it('computedSwiperOption 값 ', () => {
      const singleSwiperOption = {
        slidesPerView: 'auto',
        watchOverflow: true
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.deepEqual(wrapper.vm.computedSwiperOption, singleSwiperOption)
    })
    it('computedSwiperOption 값 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.photoList = [
        {
          class: 'class com.ns.commerce.nsphoto.bean.NSProductPhotoDataBean',
          zoomPath: null,
          thumbnailPath: null,
          photoPath: '//product-image.dev-nsmall.com/itemimg/8/23/038/23110038_O.jpg'
        },
        {
          class: 'class com.ns.commerce.nsphoto.bean.NSProductPhotoDataBean',
          zoomPath: null,
          thumbnailPath: null,
          photoPath: '//product-image.dev-nsmall.com/itemimg/8/23/038/23110039_O.jpg'
        }
      ]
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.deepEqual(wrapper.vm.computedSwiperOption, wrapper.vm.swiperOption)
    })
    it('showPaginationArea 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showPaginationArea, false)
    })
    it('showPaginationArea 값 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.photoList = null
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isNull(wrapper.vm.showPaginationArea)
    })
    it('showSalesButton(할인보기버튼) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showSalesButton, false)
    })
    it('showSalesButton(할인보기버튼) 값 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.dispTypeCd = '35'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showSalesButton, false)
    })
    it('showSalesButton(할인보기버튼) 값 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.busChnId = 'TV'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.equal(wrapper.vm.showSalesButton, false)
    })
    it('offerPrice(판매가) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      const expected = '13,900'
      assert.equal(wrapper.vm.offerPrice, expected)
    })
    it('discountedPrice 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      assert.isNotNull(wrapper.vm.discountedPrice)
    })
    it('starRating(별점 점수) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      const expected = '86%'
      assert.equal(wrapper.vm.starRating, expected)
    })
    it('reviewCnt(상품평 개수) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      const expected = '(4)'
      assert.equal(wrapper.vm.reviewCnt, expected)
    })
    it('reviewCnt(상품평 개수) 값 없는 경우', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.join_cnt = 0
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      const expected = ''
      assert.equal(wrapper.vm.reviewCnt, expected)
    })
    it('orderQty(구매수량) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      const expected = '30개 구매중'
      assert.equal(wrapper.vm.orderQty, expected)
    })
    it('orderQty(구매수량) 값 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.ordQty = 0
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      const expected = ''
      assert.equal(wrapper.vm.orderQty, expected)
    })
    it('staffPrice(임직원 할인가) 값 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.staffSalePrice = 1000
      thisGlobalVal.productInfo.staffBnft.empYn = 'Y'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      const expected = '1,000~'
      assert.equal(wrapper.vm.staffPrice, expected)
    })
    it('staffPrice(임직원 할인가) 값 null pointer exception ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.staffBnft = null
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      assert.isNull(wrapper.vm.staffPrice)
    })
    it('salePrice(알뜰할인가) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      const expected = '13,900'
      assert.isFalse(wrapper.vm.salePrice.indexOf(expected) > 0)
    })
    it('productName(상품명) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      const expected = '오가니스트 제주 샴푸/컨디셔너/바디워시 신제품 출시'
      assert.equal(wrapper.vm.productName, expected)
    })
    it('photoList(상품이미지) 값 ', () => {
      const wrapper = shallowMount(ProductInfo, options)
      const expected = true
      assert.equal(wrapper.vm.photoList.length > 0, expected)
    })
  })

  describe('methods', () => {
    it('addSaleInfo method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      const result = wrapper.vm.addSaleInfo('title', '10000')
      assert.equal(result.title, 'title')
    })
    it('getCurrentLiveItem method', async function () {
      const data = [{
        goodsName: '[TV]국내산 손질 주꾸미 400gX5팩/총 2kg',
        orderYn: 'Y',
        busChnId: 'TV',
        arsAmt: 1000,
        cardBnftList: null,
        orderItemCount: 0,
        goodsId: '29552179',
        brandShopUrl: '',
        catalogId: '',
        imageUrl: '//product-image.prod-nsmall.com/itemimg/9/29/179/29552179_F.jpg',
        plusCoupon2EndTime: '',
        isTvShopPlus: '',
        isDepartment: '',
        partNumber: '29552179',
        padDcWay: '',
        defsort: '',
        giftBnftList: null,
        lspValue: 0,
        dlvRexPnsCalcType: '',
        latestOrderQty: 0,
        arsValue: 1000,
        goodsTypeCd: 'CMM',
        padAmt: 0,
        coBuyId: null,
        plusCoupon1EndTime: '',
        type: '',
        saleStat: null,
        costBase: 34930,
        lspAmt: 0,
        everyCpExcptYn: 'N',
        salePrice: '48900',
        nation: '',
        brandCd: '200000',
        wishProduct: false,
        price: '49900',
        discountFlag: 'N',
        creditCardBnftSpr: '',
        cpcAmt: 0,
        allianceCardBnftSpr: '',
        modelName: '',
        priodDlvrYn: 'N',
        plusCoupon0EndTime: '',
        plusCoupon1Way: '',
        urlParam: '',
        sequenceNo: '',
        isHappyDeal: '',
        creditCardBnft: '',
        dlvrPrice: 0,
        goUrl: '',
        costTypeCd: '10',
        designName: '',
        plusCoupon2OddTime: 0,
        styleMngYn: null,
        giftCardWriteFlag: '',
        installPrice: '',
        dutyUseDur: 0,
        giftPackFlag: '',
        headCopy: null,
        priceofferprice: 49900,
        brdctYn: '',
        multiCd: null,
        cpcValue: 0,
        applyPrice: 49900,
        company: '',
        dispTypeCd: '10',
        mmRntalPrc: 0,
        cardChrgdcExcptYn: 'N',
        catName: '',
        vendorId: 1001935,
        endDttm: '20200521171000',
        orderQty: 0,
        startDttm: '20200521163000',
        plusCoupon1OddTime: 0,
        image_url: '',
        brdctSttDtm: '',
        score: 0,
        catentryId: '29552179',
        creditCardSalePrice: 0,
        alliMallGoodsCd: '',
        padValue: 0,
        allianceCardBnft: '',
        vipSalePrice: 0,
        lspDcWay: '',
        catGrpId: '',
        finishDealFlag: '',
        outgoLocCd: '',
        plusCoupon0OddTime: 0,
        arsDcWay: 'AMT',
        goodsType: 'CMM',
        brandName: '',
        deliveryPrice: 0,
        isShoppingBook: '',
        plusCoupon2Way: '',
        creditCardBnftVal: '',
        allianceCardBnftVal: '',
        pricedcprice: 48900,
        deliveryInfo: '',
        clickUrl: '',
        saleRate: 2,
        brand_kor_nm: '',
        lumpsumdcExcptYn: 'N',
        time: '',
        earlyMorningDiscountFlag: '',
        plusCoupon0: 0,
        plusCoupon1: 0,
        plusCoupon2: 0,
        chcChildYn: null,
        join_cnt: 0,
        isTvShopping: '',
        dlvrSaveYn: '',
        maxItemCountOnOnce: 0,
        installItemFlag: '',
        dlvrPriceMsg: '',
        newMemberBenefit: '',
        couponList: [],
        ifiValue: '0',
        dlvrWayCd1: '',
        brdctEndDtm: '',
        goodEvalYn: '',
        bonusGift: '',
        videoUrl: 'http://192.168.13.133/best_vod/testvod.mp4',
        adultItemFlag: 'N',
        okCashbackUrl: '',
        cpcDcWay: 'N',
        prcWaveDisp: '',
        minCntrbPfRate: 0.0,
        itncatentrynm: '[TV]국내산 손질 주꾸미 400gX5팩/총 2kg',
        plusCoupon0Way: ''
      }]
      const wrapper = shallowMount(ProductInfo, options)
      const result = wrapper.vm.getCurrentLiveItem(data)
      assert.isNotNull(result)
    })
    it('openDataWarning  method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.$refs.swiper.$swiper = {
        destroy: () => {}
      }
      wrapper.vm.openDataWarning()
      assert.isTrue(wrapper.vm.showDataWarning)
    })
    it('closeDataWarning method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.closeDataWarning()
      assert.isFalse(wrapper.vm.showDataWarning)
    })
    it('tooltipSaleOpen method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.tooltipSaleOpen()
      assert.isTrue(wrapper.vm.tooltipSale)
    })
    it('tooltipSaleClose method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.tooltipSaleClose()
      assert.isFalse(wrapper.vm.tooltipSale)
    })
    it('onPlayerReadied method', async function () {
      // const wrapper = shallowMount(ProductInfo, options)
      // wrapper.vm.onPlayerReadied()
      // assert.isTrue(wrapper.vm.showRemainingTime)
    })
    it('onPlayerPause method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.onPlayerPause()
      assert.isTrue(wrapper.vm.showRemainingTime)
    })
    it('onPlayerPlay method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.onPlayerPlay()
      assert.isFalse(wrapper.vm.showRemainingTime)
    })
    it('openImageSlider method', async function () {
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.openImageSlider()
    })
    it('closePlayer method', async function () {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValCTcomProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.closePlayer()
      assert.isFalse(wrapper.vm.isPlaying)
    })
    it('closeAlarmRegister method', async function () {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValCTcomProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.closeAlarmRegister(true)
    })
    it('closeAlarmRegister method', async function () {
      options = {
        localVue,
        store,
        propsData: {
          globalVal: globalValCTcomProduct
        }
      }
      const wrapper = shallowMount(ProductInfo, options)
      wrapper.vm.closeAlarmRegister(false)
    })
  })
})
