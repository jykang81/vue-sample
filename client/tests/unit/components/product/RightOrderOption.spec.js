import flushPromises from 'flush-promises'
import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import RightOrderOption from '@components/product/RightOrderOption'
import globalVal from '@unit/views/product/mock/globalVal'
import { detailProductViewRealResponse, detailProductViewRealResponseGiftProduct } from '@unit/views/product/mock/productDetailMock'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import loginUtil from '@utils/loginUtil'

const nSItemDetailAjaxResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSItemDetailAjax`).reply(200, {
    jsonData: {
      custDurSpr: 1,
      rtn: {
        DAY_P_QTY: 1,
        MONTH_P_QTY: 1,
        DATE_P_QTY: 1,
        flag: 'Y'
      }
    }
  })

  return mock
}
const ajaxNSOrderPayNow4WorklightResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSOrderPayNow4Worklight`).reply(200,
    {
      vdn_cd: ['54102'],
      userId: ['110548084'],
      orderId: '300011361006',
      itemBuschnId_1: ['TV'],
      accptPath: ['500'],
      accptPathCd: ['500'],
      catalogId: ['14051'],
      calculationUsage: ['-1,-2,-5,-6,-7'],
      outOrderId: '300011361006',
      DIRECT_ORDER_YN: 'Y',
      extPtncd_1: ['110'],
      storeId: ['13001'],
      extCatalogId_1: ['97001'],
      catEntryId_1: ['10157843442'],
      langId: ['-9'],
      hpNoSmsAuthYn: 'Y',
      itemType: ['product'],
      inventoryValidation: ['false'],
      cartType: ['15'],
      directOrderYN: ['Y'],
      orderItemId: ['181100968'],
      quantity_1: ['1']
    })

  return mock
}
const ajaxNSXorderItemAdd4WorklightResponse = mock => {
  mock.onPost(`${CONST.API_URL}/AjaxNSXorderItemAdd4Worklight`).reply(200,
    {
      extCatalogId_1: ['97001'],
      userId: ['110548084'],
      orderId: ['300011359205'],
      itemBuschnId_1: ['TV'],
      langId: ['-9'],
      catEntryId_1: ['10157843443'],
      accptPath: ['500'],
      accptPathCd: ['500'],
      itemType: ['product'],
      catalogId: ['14051'],
      inventoryValidation: ['false'],
      calculationUsage: ['-1,-2,-5,-6,-7'],
      cartType: ['15'],
      extPtncd_1: ['110'],
      storeId: ['13001'],
      orderItemId: ['181100970'],
      quantity_1: ['1']
    }

  )

  return mock
}
const nSItemDetailRemainCntAjaxResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSItemDetailRemainCntAjax`).reply(200,
    {
      offerIdfr: [''],
      busChnId: ['INT'],
      userId: ['110548084'],
      arsAmt: ['0'],
      langId: ['-9'],
      accptPath: ['500'],
      accptPathCd: ['500'],
      coCd: ['110'],
      jsonData: {
        rtnData: 98,
        rtnPrice: '8900'
      },
      cpcAmt: ['0'],
      catalogId: ['14051'],
      cmdType: ['1'],
      multiCd: [''],
      itemNumber: ['10145519709'],
      partNumber: ['23110041'],
      storeId: ['13001']
    }

  )

  return mock
}
const nSBasketMobileCmdRealResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSBasketMobileCmdReal`).reply(200,
    {
      goodsType: ['GENERAL'],
      msg: {
        goods: [
          {
            goodsName: '[TV](일시불)대동모피 폭스 베스트',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '133',
            couponDiscountRate: 0,
            quantity: '1',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 24001696,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/6/24/696/24001696_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10157843442',
            selectOpt: [
              {
                value: '블랙',
                name: 'COLOR 단품속성'
              },
              {
                value: '55',
                name: '여성의류상의(사이즈'
              }
            ],
            rfndShapeCd: 'PST',
            partNumber: '24001696',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '15',
            brandName: '대동모피',
            free_dlvr_spr_cd: '20',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '1583596',
              catgrpCd: null,
              cate2Code: '1583575',
              cate3Code: '1583642',
              cpcAmt: 0,
              cate4Code: '1590096',
              cate5Code: '1590103',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: 'HOME &amp; LIFESTYLE',
              cate2Nm: '주방/생활/건강',
              dcVal: null,
              cate3Nm: '생활잡화',
              cate4Nm: '공구/철물/산업재',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '드라이버/펜치/니퍼',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '45900',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '55900',
            selectGift: [],
            orderItemsId: '181100969',
            maxItemCountOnOnce: '999999999',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:TV,RFND_SHAPE_CD:PST,VENDOR_ID:108434,DLVR_WAY_CD1:10,PCKG_YN:N,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:8,FREE_DLVR_POSS_AMT:,SUB_ID:181100969,',
            cardDiscountYn: 'N',
            styleMngYn: 'Y',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: '',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '99999',
            couponDiscountRate: 0,
            quantity: '1',
            dlvr_expns_calc_type: '',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 0,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/0/26/200/26196200_M.jpg',
            custPrchQtyLimitYn: '',
            catentryId: '10187819760',
            selectOpt: [{
              value: '105',
              name: '남성/캐주얼(상의)'
            }],
            rfndShapeCd: 'PRE',
            partNumber: '26196200',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '',
            brandName: '',
            free_dlvr_spr_cd: '',
            deliveryPrice: '0',
            saleYn: '',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '',
              catgrpCd: null,
              cate2Code: '',
              cate3Code: '',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: '',
              cate2Nm: '',
              dcVal: null,
              cate3Nm: '',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '0',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '0',
            selectGift: [],
            orderItemsId: '181091509',
            maxItemCountOnOnce: '9999999999',
            dlvRexPns: '',
            dlvyGrpKey: '',
            cardDiscountYn: 'N',
            styleMngYn: '',
            interestFreeMonth: '',
            interestFreeYn: 'Y',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'N',
            endYmd: '',
            adultItemFlag: '',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '999626',
            couponDiscountRate: 0,
            quantity: '2',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 26030598,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/8/26/598/26030598_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10185775741',
            selectOpt: [{
              value: '',
              name: '비비고 왕교자만두세트'
            }],
            rfndShapeCd: 'PRE',
            partNumber: '26030598',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '10',
            brandName: '비비고',
            free_dlvr_spr_cd: '20',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '1603056',
              catgrpCd: null,
              cate2Code: '1603057',
              cate3Code: '',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: '홈매장(리뉴얼2019)',
              cate2Nm: '위클리홈',
              dcVal: null,
              cate3Nm: '',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '40900',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '40900',
            selectGift: [{
              name: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원'
            }],
            orderItemsId: '181091363',
            maxItemCountOnOnce: '3',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:TV,RFND_SHAPE_CD:PRE,VENDOR_ID:105964,DLVR_WAY_CD1:10,PCKG_YN:N,KEEP_WAY_CD:30,BNDLDLVR_YN:Y,OUTGO_LOC_CD:6,FREE_DLVR_POSS_AMT:,SUB_ID:181091363,',
            cardDiscountYn: 'N',
            styleMngYn: 'N',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '999626',
            couponDiscountRate: 0,
            quantity: '1',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 26030598,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/8/26/598/26030598_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10185775741',
            selectOpt: [{
              value: '',
              name: '비비고 왕교자만두세트'
            }],
            rfndShapeCd: 'PRE',
            partNumber: '26030598',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '10',
            brandName: '비비고',
            free_dlvr_spr_cd: '20',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '1603056',
              catgrpCd: null,
              cate2Code: '1603057',
              cate3Code: '',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: '홈매장(리뉴얼2019)',
              cate2Nm: '위클리홈',
              dcVal: null,
              cate3Nm: '',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '40900',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '40900',
            selectGift: [{
              name: '(경품)vip쿠폰달력 1월 깜짝적립금 1만원'
            }],
            orderItemsId: '181091346',
            maxItemCountOnOnce: '3',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:TV,RFND_SHAPE_CD:PRE,VENDOR_ID:105964,DLVR_WAY_CD1:10,PCKG_YN:N,KEEP_WAY_CD:30,BNDLDLVR_YN:Y,OUTGO_LOC_CD:6,FREE_DLVR_POSS_AMT:,SUB_ID:181091346,',
            cardDiscountYn: 'N',
            styleMngYn: 'N',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: 'TRY 풍기인견 남성 더위사냥 6종 패키지 ',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '99981',
            couponDiscountRate: 0,
            quantity: '6',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 26196200,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/0/26/200/26196200_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10187819759',
            selectOpt: [{
              value: '100',
              name: '남성/캐주얼(상의)'
            }],
            rfndShapeCd: 'PRE',
            partNumber: '26196200',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '15',
            brandName: '트라이',
            free_dlvr_spr_cd: '20',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '',
              catgrpCd: null,
              cate2Code: '',
              cate3Code: '',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: '',
              cate2Nm: '',
              dcVal: null,
              cate3Nm: '',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '69900',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '69900',
            selectGift: [],
            orderItemsId: '181091342',
            maxItemCountOnOnce: '9999999999',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:TV,RFND_SHAPE_CD:PRE,VENDOR_ID:108661,DLVR_WAY_CD1:10,PCKG_YN:N,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:1,FREE_DLVR_POSS_AMT:999999999999,SUB_ID:181091342,',
            cardDiscountYn: 'N',
            styleMngYn: 'Y',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [
              '',
              ''
            ],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '999626',
            couponDiscountRate: 0,
            quantity: '2',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 26030598,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/8/26/598/26030598_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10185775741',
            selectOpt: [{
              value: '',
              name: '비비고 왕교자만두세트'
            }],
            rfndShapeCd: 'PRE',
            partNumber: '26030598',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '10',
            brandName: '비비고',
            free_dlvr_spr_cd: '20',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '1603056',
              catgrpCd: null,
              cate2Code: '1603057',
              cate3Code: '',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: '홈매장(리뉴얼2019)',
              cate2Nm: '위클리홈',
              dcVal: null,
              cate3Nm: '',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '40900',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '40900',
            selectGift: [],
            orderItemsId: '181091334',
            maxItemCountOnOnce: '3',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:TV,RFND_SHAPE_CD:PRE,VENDOR_ID:105964,DLVR_WAY_CD1:10,PCKG_YN:N,KEEP_WAY_CD:30,BNDLDLVR_YN:Y,OUTGO_LOC_CD:6,FREE_DLVR_POSS_AMT:,SUB_ID:181091334,',
            cardDiscountYn: 'N',
            styleMngYn: 'N',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: '불고기브라더스 구이&amp;불고기A세트( 안창살칼집구이2팩+서울식불고기2팩)',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '868',
            couponDiscountRate: 0,
            quantity: '24',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 14740166,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/6/14/166/14740166_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10020565405',
            selectOpt: [
              {
                value: '공통',
                name: 'COLOR 단품속성'
              },
              {
                value: '공통',
                name: 'STYLE 단품속성'
              }
            ],
            rfndShapeCd: 'PST',
            partNumber: '14740166',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '15',
            brandName: '미정의',
            free_dlvr_spr_cd: '20',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '1618559',
              catgrpCd: null,
              cate2Code: '1619066',
              cate3Code: '',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: '카테고리매장_이지',
              cate2Nm: '패션의류_이지',
              dcVal: null,
              cate3Nm: '',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '30000',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '30000',
            selectGift: [],
            orderItemsId: '181091333',
            maxItemCountOnOnce: '999999999',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:105038,DLVR_WAY_CD1:10,PCKG_YN:Y,KEEP_WAY_CD:30,BNDLDLVR_YN:Y,OUTGO_LOC_CD:6,FREE_DLVR_POSS_AMT:10000,',
            cardDiscountYn: 'N',
            styleMngYn: 'Y',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: '정관장 홍삼활력 40mL×30포×3박스(총 90포)',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '445',
            couponDiscountRate: 0,
            quantity: '12',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 21193188,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/8/21/188/21193188_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10121738418',
            selectOpt: [{
              value: '',
              name: '정관장 홍삼활력 40mL×30포×3박스'
            }],
            rfndShapeCd: 'PST',
            partNumber: '21193188',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '15',
            brandName: '정관장',
            free_dlvr_spr_cd: '20',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '1603056',
              catgrpCd: null,
              cate2Code: '1603057',
              cate3Code: '',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: '홈매장(리뉴얼2019)',
              cate2Nm: '위클리홈',
              dcVal: null,
              cate3Nm: '',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '99000',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '99000',
            selectGift: [],
            orderItemsId: '181091336',
            maxItemCountOnOnce: '500',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:103581,DLVR_WAY_CD1:10,PCKG_YN:N,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:12,FREE_DLVR_POSS_AMT:,SUB_ID:181091336,',
            cardDiscountYn: 'N',
            styleMngYn: 'Y',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          },
          {
            goodsName: '유료배송비_수수료_반품_교환배송비',
            payTypeCd: '',
            outYn: 'N',
            saveDeliveryYn: 'N',
            inventoryQuantity: '875',
            couponDiscountRate: 0,
            quantity: '4',
            dlvr_expns_calc_type: '10',
            freeDeliverYn: 'Y',
            staYmd: '',
            goodsId: 20941718,
            imageUrl: '//product-image.dev-nsmall.com/itemimg/8/20/718/20941718_M.jpg',
            custPrchQtyLimitYn: 'N',
            catentryId: '10118773508',
            selectOpt: [{
              value: '',
              name: 'CASE2_스타킹1'
            }],
            rfndShapeCd: 'PST',
            partNumber: '20941718',
            noSaleCatalogYN: 'N',
            cnveyNum: '',
            custDurSpr: '',
            goodsType: '15',
            brandName: 'BR_FP100',
            free_dlvr_spr_cd: '10',
            deliveryPrice: '0',
            saleYn: 'Y',
            mparam: {
              intAddInfo: null,
              usersId: 0,
              couponBeforePrice: 0,
              busChnId: null,
              _classname: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              arsAmt: 0,
              staffSaleRate: 0,
              itemCatentryId: null,
              accptPathCd: 0,
              offerPrice: null,
              acceptPath: null,
              packYn: null,
              cate1Code: '1266580',
              catgrpCd: null,
              cate2Code: '1267082',
              cate3Code: '1267092',
              cpcAmt: 0,
              cate4Code: '',
              cate5Code: '',
              childCatentryId: null,
              catalogId: 0,
              itemCnt: 0,
              catentryId: null,
              _type: 'JavaClass',
              cardPreDcLst: null,
              storeId: 0,
              partNumber: null,
              cate1Nm: 'NS·ShopPL',
              cate2Nm: '샵하위3',
              dcVal: null,
              cate3Nm: '샵하위3테마1리',
              cate4Nm: '',
              flashCpIDFR: null,
              loginId: null,
              cate5Nm: '',
              custDurSpr: null,
              costTypeCd: null,
              langId: 0,
              ptnCd: null,
              rownum: 0,
              coCd: null,
              deviceChnId: null,
              cpIdfr: 0,
              class: 'com.ns.commerce.nsitemdetails.bean.NSItemDetailParamBean',
              multiCd: null
            },
            salePrice: '9220',
            dlvyGrpKeyCnt: '1',
            saleRate: 0,
            wishProduct: false,
            price: '9220',
            selectGift: [],
            orderItemsId: '181091335',
            maxItemCountOnOnce: '100',
            dlvRexPns: '',
            dlvyGrpKey: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:107213,DLVR_WAY_CD1:10,PCKG_YN:Y,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:8,FREE_DLVR_POSS_AMT:30000,',
            cardDiscountYn: 'N',
            styleMngYn: 'Y',
            interestFreeMonth: '0',
            interestFreeYn: 'N',
            adjustment: [],
            maxOrderPossQty: 0,
            noSaleCatalogMsg: '',
            cardDiscountRate: 0,
            intrv: '',
            itemLiveYN: 'Y',
            endYmd: '',
            adultItemFlag: 'N',
            multiCd: '',
            couponDiscountYn: 'N',
            subscribeYn: 'N'
          }
        ],
        member: {
          orderId: 300011359205
        },
        common: {
          goodsCnt: 9,
          deliveryCnt: 0,
          giftcardCnt: 0,
          coNm: 'NS몰'
        }
      },
      catalogId: ['14051'],
      userId: ['110548084'],
      DISP_TYPE_CD: ['15'],
      langId: ['-9'],
      accptPath: ['500'],
      accptPathCd: ['500'],
      storeId: ['13001']
    }

  )

  return mock
}

describe('RightOrderOption', () => {
  let localVue
  let options
  let mock
  let url
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)

    options = {
      localVue,
      store,
      propsData: {
        globalVal: {
          getProductInfoFlag: false,
          partNumber: '23110038',
          productInfo: detailProductViewRealResponse.msg.goods[0].info
        }
      }
    }

    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    url = `${CONST.API_URL}/DetailProductViewReal`

    const mockResponseResult = {
      productInfo: detailProductViewRealResponse.msg.goods[0].info,
      response: detailProductViewRealResponse
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    store.state.product.productInfo = detailProductViewRealResponse.msg.goods[0].info
    store.state.product.productData = detailProductViewRealResponse
    store.state.product.selectedGiftList = {}

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
  })

  afterEach(() => {
    store.state.product.productInfo = detailProductViewRealResponse.msg.goods[0].info
    store.state.product.productData = detailProductViewRealResponse
    store.state.product.selectedGiftList = {}
    mock.reset()
  })

  it('상품상세정보 호출', () => {
    globalVal.getProductInfoFlag = true
    mount(RightOrderOption, options)
  })

  describe('computed test', () => {
    it('isTVProduct 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isTVProduct)
    })
    it('isTVProduct 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      store.state.product.productInfo.isTVProduct = [1, 2]
      assert.isNotNull(wrapper.vm.isTVProduct)
    })
    it('isRentalProduct 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isRentalProduct)
    })
    it('isTravelProduct 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isTravelProduct)
    })
    it('isPhoneProduct 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isPhoneProduct)
    })
    it('isCouponInfoShowConditions 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isCouponInfoShowConditions)
    })
    it('isCouponInfoShowProduct 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isCouponInfoShowProduct)
    })
    it('isGiftishowProduct  값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isGiftishowProduct)
    })
    it('isLoginRequiredProduct  값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.isLoginRequiredProduct)
    })
    it('couponInfoList 값 ', () => {
      const wrapper = shallowMount(RightOrderOption, options)
      assert.isNotNull(wrapper.vm.couponInfoList)
    })
    it('totalPriceTxt(총 주문금액) 값 ', () => {
      wrapper = shallowMount(RightOrderOption, options)
      wrapper.vm.totalPrice = 12900

      assert.equal(wrapper.vm.totalPriceTxt, '12,900')
    })
    it('totalProductPrice(총 합산 주문금액) 값 ', () => {
      wrapper = shallowMount(RightOrderOption, options)
      wrapper.vm.selectedCount = 2
      store.state.product.productInfo.salePrice = 12900

      assert.equal(wrapper.vm.singleTotalPrice, '25,800')
    })
    it('isSingleOption(단품 여부) 값 ', () => {
      store.state.product.productInfo.styleMngYn = 'N'
      wrapper = shallowMount(RightOrderOption, options)
      // assert.isTrue(wrapper.vm.isSingleOption)
    })
    it('isSingleOption(단품 여부) 값 ', () => {
      store.state.product.productInfo.styleMngYn = 'Y'
      wrapper = shallowMount(RightOrderOption, options)
      // assert.isNotTrue(wrapper.vm.isSingleOption)
    })
    it('isBuyButtonActive 값 ', () => {
      wrapper = shallowMount(RightOrderOption, options)
      wrapper.vm.invoiceProducts = [{ catentryId: 1 }, { catentryId: 2 }]
      assert.isNotTrue(wrapper.vm.isBuyButtonActive)
    })
  })

  describe('methods', () => {
    // it('info parameters', () => {
    //   wrapper = shallowMount(RightOrderOption, options)
    //   const infoParams = wrapper.vm.setProductDetailParams()

    //   const expected = {
    //     cocd: '110',
    //     partNumber: '23110038',
    //     imgSizeType: 'Q'
    //   }
    //   assert.deepEqual(infoParams, expected)
    // })
    it('layerClose', function () {
      wrapper = shallowMount(RightOrderOption, options)
      wrapper.emitted()
    })

    it('getItem', function () {
      const optionList = [
        {
          buyable: false,
          bnftVal: null,
          essnOfferYn: null,
          styleMngYn: 'N',
          name: '브이솔루션 아사이베리 파우더 100g / 무료배송',
          uniqueID: null,
          unitRegiTypeCd: 'OPT',
          SKUs: [
            {
              buyable: true,
              calPrmo: 0,
              numberOfSKUs: null,
              SKUs: null,
              attributes: [

              ],
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemAttrSKUsDataBean',
              field: '4873',
              name: '브이솔루션 브라질산 아사이베리 파우더 100g X 1통',
              uniqueID: '10119997968',
              storeID: null,
              partNumber: null
            }
          ],
          numberOfSKUs: '0',
          attributes: [

          ],
          class: 'class com.ns.commerce.nsitemdetails.bean.NSItemAttrDataBean',
          partNumber: '20874208',
          storeID: null
        }
      ]
      wrapper = shallowMount(RightOrderOption, options)
      const responseItem = wrapper.vm.getItem(optionList, '20874208')
      assert.isNotEmpty(responseItem)
    })
    it('getItem', function () {
      const optionList = [
        {
          buyable: false,
          bnftVal: null,
          essnOfferYn: null,
          styleMngYn: 'N',
          name: '브이솔루션 아사이베리 파우더 100g / 무료배송',
          uniqueID: null,
          unitRegiTypeCd: 'OPT',
          SKUs: [
            {
              buyable: true,
              calPrmo: 0,
              numberOfSKUs: null,
              SKUs: null,
              attributes: [

              ],
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemAttrSKUsDataBean',
              field: '4873',
              name: '브이솔루션 브라질산 아사이베리 파우더 100g X 1통',
              uniqueID: '10119997968',
              storeID: null,
              partNumber: null
            }
          ],
          numberOfSKUs: '0',
          attributes: [

          ],
          class: 'class com.ns.commerce.nsitemdetails.bean.NSItemAttrDataBean',
          partNumber: '20874208',
          storeID: null
        }
      ]
      wrapper = shallowMount(RightOrderOption, options)
      const responseItem = wrapper.vm.getItem(optionList, 'differentPartNumber')
      assert.isNull(responseItem)
    })
    it('setInvokeParameters', function () {
      wrapper = shallowMount(RightOrderOption, options)
      const responseParams = wrapper.vm.setInvokeParameters()
      assert.isNotEmpty(responseParams)
    })
    it('setProdCategory', function () {
      wrapper = shallowMount(RightOrderOption, options)
      wrapper.vm.setProdCategory(detailProductViewRealResponse)
      assert.isNotEmpty(wrapper.vm.productCategoryName)
    })
    it('calculateLineTotal ', function () {
      store.state.product.productInfo.custPrchQtyLimitYn = 'Y'
      wrapper = shallowMount(RightOrderOption, options)
      const invoiceProduct = {
        productPrice: 10000,
        selectedOptionCount: 1,
        lineTotal: 0
      }
      wrapper.vm.invoiceProducts = []
      wrapper.vm.invoiceProducts.push(invoiceProduct)

      wrapper.vm.calculateLineTotal(invoiceProduct)

      assert.equal(wrapper.vm.totalPrice, 10000)
      assert.equal(wrapper.vm.totalCnt, 1)
    })
    // it('deleteRow  ', function () {
    //   wrapper = shallowMount(RightOrderOption, options)
    //   wrapper.vm.optionList = [
    //     {
    //       id: '1_10145519689_선택01)무환자샴푸x1개+사은품50명',
    //       fieldTxt: '999992',
    //       value: '선택01)무환자샴푸x1개+사은품50명',
    //       valueId: '10145519689'
    //     }
    //   ]
    //   wrapper.vm.selectedOptions = [0, 1]
    //   const invoiceProduct = {
    //     productPrice: 10000,
    //     selectedOptionCount: 1,
    //     lineTotal: 0,
    //     productName: '선택01)무환자샴푸x1개+사은품50명'
    //   }
    //   wrapper.vm.invoiceProducts = []
    //   wrapper.vm.invoiceProducts.push(invoiceProduct)

    //   wrapper.vm.deleteRow(invoiceProduct)

    //   assert.equal(wrapper.vm.totalPrice, 0)
    //   assert.equal(wrapper.vm.totalCnt, 0)
    // })
  })

  it('execCouponAutoSave', async () => {
    nSItemDetailAjaxResponse(mock)
    const wrapper = shallowMount(RightOrderOption, options)
    wrapper.vm.execCouponAutoSave()
    await flushPromises()
  })
  it('getOptionPrice', async () => {
    const wrapper = shallowMount(RightOrderOption, options)
    assert.isNotNull(wrapper.vm.getOptionPrice(0))
  })
  it('selectOptionIndex', async () => {
    nSItemDetailRemainCntAjaxResponse(mock)
    const optionItem = {
      fieldTxt: '487',
      id: '1_10145519709_선택03)토알7오리지널치약x6개+사은품50명',
      optionSalePrice: '8,900',
      value: '선택03)토알7오리지널치약x6개+사은품50명',
      valueId: '10145519709'
    }
    const wrapper = shallowMount(RightOrderOption, options)
    wrapper.vm.selectOptionIndex(optionItem, 0, 0)
    await flushPromises()
  })
  it('selectOptionIndex', async () => {
    mock.onPost(`${CONST.API_URL}/NSItemDetailRemainCntAjax`).reply(200,
      {
        jsonData: {
          rtnData: 0,
          rtnPrice: '8900'
        }
      }

    )

    const optionItem = {
      fieldTxt: '487',
      id: '1_10145519709_선택03)토알7오리지널치약x6개+사은품50명',
      optionSalePrice: '8,900',
      value: '선택03)토알7오리지널치약x6개+사은품50명',
      valueId: '10145519709'
    }
    const wrapper = shallowMount(RightOrderOption, options)
    wrapper.vm.selectOptionIndex(optionItem, 0, 0)
    await flushPromises()
  })
  it('clickBuyButton', async () => {
    ajaxNSOrderPayNow4WorklightResponse(mock)
    const wrapper = shallowMount(RightOrderOption, options)
    wrapper.vm.clickBuyButton()
    await flushPromises()
  })
  it('addToCart', async () => {
    ajaxNSXorderItemAdd4WorklightResponse(mock)
    nSBasketMobileCmdRealResponse(mock)
    const wrapper = shallowMount(RightOrderOption, options)
    wrapper.vm.addToCart()
    await flushPromises()
  })
  it('layerClose 클릭 이벤트', () => {
    const wrapper = mount(RightOrderOption, options)

    const layerCloseWrapper = wrapper.find('.dimmed_all')
    layerCloseWrapper.trigger('click')
  })
  it('checkIsGiftSelected', () => {
    const wrapper = mount(RightOrderOption, options)

    wrapper.vm.checkIsGiftSelected()
  })
  it('initOptions', () => {
    const wrapper = mount(RightOrderOption, options)

    wrapper.vm.initOptions()
  })
  it('clickBuyButton', async () => {
    nSItemDetailAjaxResponse(mock)
    ajaxNSOrderPayNow4WorklightResponse(mock)
    const mockResponseResult = {
      productInfo: detailProductViewRealResponseGiftProduct.msg.goods[0].info,
      response: detailProductViewRealResponseGiftProduct
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    store.state.product.productInfo = detailProductViewRealResponseGiftProduct.msg.goods[0].info
    store.state.product.productData = detailProductViewRealResponseGiftProduct
    store.state.product.selectedGiftList = {}

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    const wrapper = mount(RightOrderOption, options)

    wrapper.vm.clickBuyButton()
    await flushPromises()
  })
})
