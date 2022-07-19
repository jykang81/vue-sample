import Vuex from 'vuex'
import { assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'

import ProductList from '@components/common/ProductList'

const localVue = createLocalVue()
localVue.use(Vuex)

// 필수 테스트 할 대상 파일명을 넣음
describe('ProductList 테스트', () => {
  let wrapper
  let vm

  beforeEach(async () => {
    wrapper = shallowMount(ProductList, {
      localVue,
      store,
      propsData: {
        productList: [
          {
            productDetail: {
              orderYn: 'Y',
              busChnId: 'INT',
              arsAmt: 0,
              cardBnftList: null,
              orderItemCount: 0,
              brandShopUrl: '',
              catalogId: '78501',
              plusCoupon2EndTime: '',
              _type: 'JavaClass',
              partNumber: '23110038',
              isDepartment: 'N',
              isTvShopPlus: 'N',
              padDcWay: '',
              defsort: 'N',
              lspValue: 0,
              giftBnftList: null,
              dlvRexPnsCalcType: '10',
              latestOrderQty: 0,
              arsValue: 0,
              goodsTypeCd: 'CMM',
              padAmt: 0,
              coBuyId: null,
              plusCoupon1EndTime: '',
              saleStat: null,
              costBase: 12788,
              lspAmt: 0,
              everyCpExcptYn: 'Y',
              nation: '',
              brandCd: '765226',
              discountFlag: 'N',
              cpcAmt: 0,
              creditCardBnftSpr: '',
              modelName: '',
              allianceCardBnftSpr: '',
              priodDlvrYn: 'N',
              plusCoupon0EndTime: '',
              urlParam: '',
              plusCoupon1Way: '',
              isHappyDeal: 'Y',
              sequenceNo: '',
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
              priceofferprice: 13900,
              class: 'com.ns.commerce.nscatentrylists.bean.NSCatentryCommonDataBean',
              brdctYn: 'N',
              multiCd: null,
              cpcValue: 0,
              applyPrice: 13900,
              company: '',
              dispTypeCd: '15',
              mmRntalPrc: 0,
              cardChrgdcExcptYn: 'N',
              catName: null,
              vendorId: 109267,
              _classname: 'com.ns.commerce.nscatentrylists.bean.NSCatentryCommonDataBean',
              orderQty: 0,
              plusCoupon1OddTime: 0,
              image_url: '',
              brdctSttDtm: null,
              score: 86,
              catentryId: '23110038',
              creditCardSalePrice: 0,
              alliMallGoodsCd: null,
              padValue: 0,
              allianceCardBnft: '',
              vipSalePrice: 0,
              lspDcWay: '',
              catGrpId: '',
              finishDealFlag: '',
              outgoLocCd: '',
              plusCoupon0OddTime: 0,
              arsDcWay: '',
              deliveryPrice: 0,
              isShoppingBook: 'N',
              plusCoupon2Way: '',
              creditCardBnftVal: '',
              allianceCardBnftVal: '',
              pricedcprice: 13900,
              deliveryInfo: '',
              saleRate: 0,
              clickUrl: '',
              brand_kor_nm: '오가니스트',
              lumpsumdcExcptYn: 'N',
              earlyMorningDiscountFlag: '',
              plusCoupon0: 0,
              plusCoupon1: 0,
              plusCoupon2: 0,
              chcChildYn: null,
              isTvShopping: 'N',
              join_cnt: 4,
              dlvrSaveYn: '',
              maxItemCountOnOnce: 0,
              installItemFlag: '',
              dlvrPriceMsg: '',
              newMemberBenefit: '',
              couponList: null,
              dlvrWayCd1: '',
              ifiValue: '0',
              brdctEndDtm: null,
              goodEvalYn: 'P',
              bonusGift: '',
              okCashbackUrl: '',
              adultItemFlag: 'N',
              cpcDcWay: 'N',
              prcWaveDisp: '~',
              minCntrbPfRate: 0.0,
              itncatentrynm: '오가니스트 제주 샴푸/컨디셔너/바디워시 신제품 출시',
              plusCoupon0Way: ''
            },
            espotTitle: 'easy_hpd_today_title',
            espotType: 'CatalogEntryId',
            espotId: '414953',
            espotTitleImgPath: '',
            productId: '23110038',
            espotTitleText: '매일 새롭게 찾아오는 해피딜 상품',
            espotTitleMimeType: ''
          }
        ]
      }
    })
    vm = wrapper.vm
  })

  it('리스트 / 그리드 토글', () => {
    // 최초 그리드형
    assert.isTrue(vm.listGridClass)

    // 토글 클릭
    vm.listGrid()

    // 리스트형으로 변경 확인
    assert.isFalse(vm.listGridClass)
  })
})
