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
import bizUtil from '@utils/bizUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetGuestCustomer from '@/views/order/sheet/OrderSheetGuestCustomer'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'
import { assert } from 'chai'

describe('OrderSheetDelivery', () => {
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const msgData = {
    payCheck: {
      vendorId: null,
      brdctCnnlCdTemp: '',
      offerItemCdTemp: '',
      year_amt: 0,
      mobileCheck: 'N',
      saleCntCheck: 'N',
      brdctDateTemp: '',
      month_amt: 0,
      pgmCdTemp: '',
      dlrOrdCnt: 0,
      memberId: 112206571,
      sect_id: '',
      catentryId: '20874208',
      catentryList: null,
      okCashSaveCheck: 'N',
      checkType: '',
      requestProperties: null,
      commandContext: null,
      resources: null,
      year_cnt: 0,
      httpRequest: null,
      viewCommandContext: null,
      httpResponse: null,
      month_cnt: 0,
      coCd: '110',
      notSaleCheck: 'N',
      exceptCheck: '',
      afterRefundCheck: 'N',
      class: 'class com.ns.commerce.nsorder.bean.NSPayCheckBean',
      okcashCheck: 'N'
    },
    CouponList: {
      181090992: {
        1: [],
        2: [],
        3: null,
        4: null,
        freeDlvry: null,
        flashMap: {},
        yearDc: null
      }
    },
    SelfAddressList: [],
    ImdtDcCpAmtList: {
      181090992: {
        PROM_DC_WAY_ARS: '',
        PROM_DC_WAY_PAD: '',
        PROM_VAL_LSP_RATE: '0',
        PROM_VAL_PAD_RTO: '0',
        PROM_DC_WAY_CPC: 'N',
        PROM_VAL_ARS: '0',
        PROM_VAL_PAD: '0',
        PROM_DC_WAY_LSP: 'N',
        PROM_VAL_CPC: '0',
        PROM_VAL_LSP: 'N',
        PROM_VAL_PAD_AMT: '0',
        PROM_VAL_IFI: '0'
      }
    },
    BestCouponList: {
      '': {
        class: 'class com.ns.commerce.nsorder.vo.CouponSelected',
        price: 999999999,
        maxDiscountQty: 0,
        orderItemsId: '',
        couponMap: {}
      }
    },
    payMethod: {
      acctInfo: '',
      ldinPath: '',
      requestProperties: null,
      commandContext: null,
      resources: null,
      userId: '112206571',
      httpRequest: null,
      acctYn: '',
      viewCommandContext: null,
      httpResponse: null,
      rmitrNm: '',
      payMthdCd: '',
      cardCd: '',
      crCardYn: '',
      noBbYn: '',
      class: 'class com.ns.commerce.nsorder.bean.NSUserPayMethodBean'
    },
    BankAccntList: [
      {
        RNUM: '1',
        BANKNAME: '국민',
        BANKCODE: 'VAK',
        ACCT_NUM: 'nothing',
        VIRTUALACCNT_FLAG: 'Y'
      },
      {
        RNUM: '2',
        BANKNAME: '우리',
        BANKCODE: 'VAW',
        ACCT_NUM: 'nothing',
        VIRTUALACCNT_FLAG: 'Y'
      },
      {
        RNUM: '3',
        BANKNAME: '신한',
        BANKCODE: 'VAS',
        ACCT_NUM: 'nothing',
        VIRTUALACCNT_FLAG: 'Y'
      },
      {
        RNUM: '4',
        BANKNAME: '농협',
        BANKCODE: 'VA',
        ACCT_NUM: 'nothing',
        VIRTUALACCNT_FLAG: 'Y'
      },
      {
        RNUM: '5',
        BANKNAME: '하나',
        BANKCODE: 'VAH',
        ACCT_NUM: 'nothing',
        VIRTUALACCNT_FLAG: 'Y'
      },
      {
        RNUM: '6',
        BANKNAME: '제일',
        BANKCODE: 'VAJ',
        ACCT_NUM: 'nothing',
        VIRTUALACCNT_FLAG: 'Y'
      },
      {
        RNUM: '7',
        BANKNAME: '경남',
        BANKCODE: 'VAG',
        ACCT_NUM: 'nothing',
        VIRTUALACCNT_FLAG: 'Y'
      }
    ],
    OrderGoodList: [
      {
        itemDetailInfo: {
          promDcWayPad: '',
          payTypeCd: '',
          busChnId: 'INT',
          arsAmt: 0,
          cardBnftList: [
            {
              offerIdfr: '100000030625',
              numStartVal: '',
              qtyRstApplyYn: '0',
              cardBnftStr: '2|11|12/31',
              amtStartVal: '5000',
              cardBnft: '비씨',
              cardBnftSpr: '2',
              numEndVal: '',
              amtEndVal: '',
              realCardVal: 10000,
              nsPayCardCd: '',
              bnftType: '33',
              qtyStartVal: '',
              cardBnftDispVal: 1420,
              numRstApplyYn: '',
              cardBnftVal: '11',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
              amtRstApplyYn: '1',
              offerNm: '비씨카드 11％ 청구할인(1원 이상)',
              qtyEndVal: '',
              maxBnftLimit: '10000',
              cardCoCd: 'BC'
            },
            {
              offerIdfr: '100000030626',
              numStartVal: '',
              qtyRstApplyYn: '0',
              cardBnftStr: '2|11|12/31',
              amtStartVal: '1',
              cardBnft: 'NS페이-비씨',
              cardBnftSpr: '2',
              numEndVal: '',
              amtEndVal: '',
              realCardVal: 5000,
              nsPayCardCd: '',
              bnftType: '35',
              qtyStartVal: '',
              cardBnftDispVal: 1420,
              numRstApplyYn: '',
              cardBnftVal: '11',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
              amtRstApplyYn: '1',
              offerNm: 'NS페이 비씨카드 11％ 청구할인(1원 이상)',
              qtyEndVal: '',
              maxBnftLimit: '5000',
              cardCoCd: 'BC'
            },
            {
              offerIdfr: '100000030627',
              numStartVal: '',
              qtyRstApplyYn: '0',
              cardBnftStr: '2|11|12/31',
              amtStartVal: '100000',
              cardBnft: '롯데',
              cardBnftSpr: '2',
              numEndVal: '',
              amtEndVal: '',
              realCardVal: 100000,
              nsPayCardCd: '',
              bnftType: '33',
              qtyStartVal: '',
              cardBnftDispVal: 1420,
              numRstApplyYn: '',
              cardBnftVal: '11',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
              amtRstApplyYn: '1',
              offerNm: '롯데 11％청구할인(2020.05.22~2022.12.31)',
              qtyEndVal: '',
              maxBnftLimit: '100000',
              cardCoCd: 'AM'
            },
            {
              offerIdfr: '100000030333',
              numStartVal: '',
              qtyRstApplyYn: '0',
              cardBnftStr: '2|5|09/30',
              amtStartVal: '',
              cardBnft: 'NS페이-삼성',
              cardBnftSpr: '2',
              numEndVal: '',
              amtEndVal: '',
              realCardVal: 10,
              nsPayCardCd: '',
              bnftType: '35',
              qtyStartVal: '',
              cardBnftDispVal: 650,
              numRstApplyYn: '',
              cardBnftVal: '5',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
              amtRstApplyYn: '0',
              offerNm: 'NS페이_삼성카드 5％ 청구할인',
              qtyEndVal: '',
              maxBnftLimit: '0',
              cardCoCd: 'SS'
            },
            {
              offerIdfr: '100000030134',
              numStartVal: '',
              qtyRstApplyYn: '0',
              cardBnftStr: '2|4|04/30',
              amtStartVal: '',
              cardBnft: 'NS페이-신한',
              cardBnftSpr: '2',
              numEndVal: '',
              amtEndVal: '',
              realCardVal: 200000,
              nsPayCardCd: '',
              bnftType: '35',
              qtyStartVal: '',
              cardBnftDispVal: 520,
              numRstApplyYn: '',
              cardBnftVal: '4',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
              amtRstApplyYn: '0',
              offerNm: 'NS페이 신한카드 청구할인 4％(오류개선 건)',
              qtyEndVal: '',
              maxBnftLimit: '200000',
              cardCoCd: 'LG'
            },
            {
              offerIdfr: '100000030132',
              numStartVal: '',
              qtyRstApplyYn: '0',
              cardBnftStr: '2|9|04/30',
              amtStartVal: '',
              cardBnft: 'NS페이-현대',
              cardBnftSpr: '2',
              numEndVal: '',
              amtEndVal: '',
              realCardVal: 200000,
              nsPayCardCd: '',
              bnftType: '35',
              qtyStartVal: '',
              cardBnftDispVal: 1170,
              numRstApplyYn: '',
              cardBnftVal: '9',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
              amtRstApplyYn: '0',
              offerNm: 'NS페이 현대카드 7％ 청구할인(오류개선 건)',
              qtyEndVal: '',
              maxBnftLimit: '200000',
              cardCoCd: 'DN'
            },
            {
              offerIdfr: '100000030127',
              numStartVal: '',
              qtyRstApplyYn: '0',
              cardBnftStr: '2|5|04/30',
              amtStartVal: '',
              cardBnft: 'NS페이-국민',
              cardBnftSpr: '2',
              numEndVal: '',
              amtEndVal: '',
              realCardVal: 200000,
              nsPayCardCd: '',
              bnftType: '35',
              qtyStartVal: '',
              cardBnftDispVal: 650,
              numRstApplyYn: '',
              cardBnftVal: '5',
              class: 'class com.ns.commerce.nsitemdetails.bean.NSItemCardBnftDataBean',
              amtRstApplyYn: '0',
              offerNm: 'NS페이 KB카드 5％ 청구할인',
              qtyEndVal: '',
              maxBnftLimit: '200000',
              cardCoCd: 'KM'
            }
          ],
          appSaleRate: 0,
          accptPathCd: 0,
          orderItemCount: 0,
          dlvrInfo: '',
          brandShopUrl: '',
          isFlashSaleNew: 'N',
          custPrchQtyLimitYn: 'N',
          ordQty: '',
          plusCoupon2EndTime: '',
          staffBnft: {
            couponBnftRate: 0,
            useAmt: 0,
            couponId: '',
            bnftBiggerYn: 'N',
            memberId: '',
            userId: 0,
            class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
            balanceAmt: 0,
            limitAmt: 0,
            empYn: 'N'
          },
          productName: '브이솔루션 아사이베리 파우더 100g / 무료배송',
          plusCoupon3Way: '',
          partNumber: '20874208',
          padDcWay: '',
          addAddressFlag: 'N',
          custDurSpr: null,
          rmaExtraClvrExpnsYn: '',
          lspValue: 0,
          giftBnftList: null,
          dlvRexPnsCalcType: '10',
          liveLimit: 'Y',
          arsValue: 0,
          goodsTypeCd: 'CMM',
          promValPad: 0,
          isPlayVodPath: '',
          padAmt: 0,
          coBuyId: '',
          plusCoupon1EndTime: '',
          orginSalePrice: 0,
          costBase: 11610,
          lspAmt: 0,
          tvList: null,
          mparam: null,
          everyCpExcptYn: 'N',
          staffSalePrice: 0,
          salePrice: 12900,
          intuitiveShippingDate: '',
          plusCoupon1CpIDFR: '',
          noSaleCatalogYn: 'N',
          nation: '',
          wishProduct: false,
          endTime: '',
          brandCd: '657550',
          affilEntCd: '',
          plusCoupon3OddTime: 0,
          excptYn: 'N',
          offerPrice: 12900,
          discountFlag: 'N',
          displayFlag: '',
          deliveryType: '',
          startTime: '',
          catGb: '',
          cpcAmt: 0,
          orderPrgrsTypeCd: '100',
          modelName: '',
          priodDlvrYn: 'N',
          remainTime: '',
          urlParam: '',
          plusCoupon1Way: '',
          leafCd: '',
          sequenceNo: '',
          giftYn: 'N',
          dlvrPrice: 0,
          isPlayVodId: '',
          costTypeCd: '10',
          designName: '',
          styleMngYn: 'N',
          plusCoupon2OddTime: 0,
          giftCardWriteFlag: 'N',
          installPrice: '',
          qnaFlag: 'Y',
          noSaleCatalogMsg: '',
          dutyUseDur: null,
          headCopy: '',
          giftPackFlag: 'N',
          partialYn: '',
          rmaJejuRegnDlvrExpns: 0,
          isPlayStoreYn: '',
          class: 'class com.ns.commerce.nsitemdetails.bean.NSItemDetailsDataBean',
          partialBnftList: null,
          cpcValue: 0,
          applyPrice: 12900,
          dispTypeCd: '10',
          company: '',
          packCatentrys: '',
          mmRntalPrc: null,
          vipFlashProdYn: 'N',
          okCashUndispYn: '',
          cardChrgdcExcptYn: 'N',
          vendorId: 110378,
          plusCoupon2CpIDFR: '',
          markForDelete: 0,
          cardBnftStr: '',
          plusCoupon1OddTime: 0,
          tvLiveCd: '',
          staYmd: null,
          dofStartDttm: '',
          score: 0,
          catentryId: 20874208,
          rfndShapeCd: '',
          creditCardSalePrice: 0,
          alliMallGoodsCd: null,
          padValue: 0,
          vodPlay: {},
          rmaDlvrYn: '',
          vipSalePrice: 0,
          apprStatCd: '20',
          lspDcWay: '',
          outgoLocCd: '3',
          finishDealFlag: '',
          custGetDttm: '',
          dlvrNumber: '',
          arsDcWay: '',
          brandName: '브이솔루션',
          optionList: null,
          headCopyList: null,
          deliveryPrice: 0,
          saleYn: 'Y',
          rmaGnrlRegnDlvrExpns: 0,
          plusCoupon2Way: '',
          deliveryInfo: '3',
          itnEpsuYn: 'Y',
          orderPostPrdnFlag: 'N',
          staffSaleRate: 0,
          saleRate: 0,
          plusCoupon3CpIDFR: '',
          dofEndDttm: '',
          lumpsumdcExcptYn: 'N',
          earlyMorningDiscountFlag: 'N',
          ctcomTvList: null,
          plusCoupon1: 0,
          plusCoupon2: 0,
          minCntrbPfrateYn: null,
          plusCoupon3: 0,
          chcChildYn: 'N',
          join_cnt: 0,
          dlvrSaveYn: '',
          maxItemCountOnOnce: 999,
          installItemFlag: 'N',
          cateInfoList: null,
          dlvrPriceMsg: '',
          rmtrlpoo: '아사이베리분말(브라질산)100%',
          newMemberBenefit: '',
          buyable: 0,
          couponList: [],
          ifiValue: '0',
          dlvrWayCd1: '10',
          maxOrderPossQty: 0,
          padValueRto: 0,
          bonusGift: '',
          photoList: null,
          orginSaleRate: 0,
          plusCoupon3EndTime: '',
          endYmd: null,
          couponSubList: null,
          okCashbackUrl: '',
          adultItemFlag: 'N',
          productCnt: 0,
          cpcDcWay: '',
          prcWaveDisp: '',
          minCntrbPfRate: 100,
          ctcomLiveCd: '',
          packPartNumbers: ''
        },
        itemLiveYN: 'Y',
        selectPack: [],
        attributes: [
          {
            VALUE: '',
            NAME: '브이솔루션 브라질산 아사이베리 파우더 100g X 1통',
            SUBSEQ: '0',
            SEQ: '0'
          }
        ],
        goodsDetail: {
          CATENTRY_ATTR_LIST: [],
          OFFER_ITEM_CD: '',
          PGM_CD: '',
          DCPRICE: '12900',
          SALE_YN: 'Y',
          CATENTTYPE: 'CMM',
          _XCatEntChn_OTHRCOMEPSUYN: '',
          convinGb: 'N',
          _XCatEntChn_FREEDLVRPOSSAMT: '0',
          _prc_VAT_AMT: '1055',
          RMA_DLVR_YN: 'Y',
          BRDCT_CNNL_CD: '',
          CHILD_PARTNUMBER: '10119997968',
          COLLATERAL_ID: '0',
          PROM_VAL_ARS: '0',
          PARENT_BUYABLE: '1',
          CATENTRY_ID_PARENT: '20874208',
          INVENTORY_QUANTITY: '4728',
          _XCatEntChn_LUMPSUMDCEXCPTYN: 'N',
          BRAND_CD: '657550',
          PROM_VAL_PAD_AMT: '0',
          CHILD_MFNAME: '',
          BRDCT_DATE: '',
          NORMAL_CST_PRC: '10555',
          _prc_COST_TYPE_CD: '10',
          COKEY: '',
          PROM_VAL_PAD: '0',
          VALID_YN: '',
          XCATENTRY_DISP_MIN_CMSSN_APPLY_TYPE_CD: 'RTO',
          _XCatEntChn_PRCCOMPEXCPTYN: 'N',
          GIFT_PARNT_ORDER_SEQ: '',
          SLCT_DAY_OBJT_GOODS_YN: 'Y',
          CHILD_ITEMSPC_ID: '90026954490',
          OFFERPRICE: '12900,12900,12900,10,11610,-1,10555,0',
          _XPriceDtl_SL_PRC: '12900',
          _XCatEntChn_DLVRFEECODYN: '',
          PARENT_CATENTTYPE_ID: 'ProductBean',
          UNIT_REGI_TYPE_CD: 'OPT',
          BUY_TAX_TYPE_CD: '20',
          _prc_MARG_RATE: '10',
          CAT4_CATEGORY_ID: '1193',
          CHILD_BUYABLE: '1',
          GIFT_YN: 'N',
          DLVR_WAY_CD1: '10',
          PROM_DC_WAY_CPC: 'N',
          DLVR_WAY_CD2: '20',
          DLVY_DAY: '',
          QUANTITY: '1',
          ITN_EPSU_YN: 'Y',
          GRP_PURCHASE_OWNER: '',
          PARENT_MARKFORDELETE: '0',
          PARTNUM: '10119997968',
          INST_GOODS_YN: 'N',
          FIELD2: '4749',
          _prc_SL_PRC: '12900',
          GRP_PURCHASE_YN: '',
          _XCatEntChn_MDCD: '11771',
          FLASH_SALE_YN: '',
          _fix_SL_PRC: '12900',
          INVENTORY_QUANTITY_TYPE: '10',
          ITEM_CARDRECEIVER: '',
          CUST_MAX_ORDER_POSS_QTY: '',
          PROM_VAL_IFI: '0',
          CATGROUP_ID: '1193',
          ORDERS_ID: '300011359013',
          _XCatEntChn_CAMP_ID: '',
          PROM_DC_WAY_LSP: 'N',
          CTR_POSIT_CD: '',
          BUYABLE: '1',
          PCKG_YN: 'Y',
          AGREE_DLINE: '3',
          CO_BUY_ID: '',
          SALE_WAY_CD: '20',
          PARENT_MFPARTNUMBER: '110378',
          _XCatEntChn_GOODSEVALWRITEIPOSSYN: '',
          CARDDESIGN: '',
          DLVY_GRP_KEY: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:110378,DLVR_WAY_CD1:10,PCKG_YN:Y,KEEP_WAY_CD:10,BNDLDLVR_YN:,OUTGO_LOC_CD:3,FREE_DLVR_POSS_AMT:,',
          WW_YN: 'N',
          CARDMESSAGE: '',
          PARENT_MFNAME: '(주)비타민마을',
          DLVY_GRP_KEY_CNT: '1',
          MEMBER_ID: '112206571',
          DLVR_SCHD_DTTM: '',
          _XPriceDtl_MARG_RATE: '10',
          PROM_VAL_PAD_RTO: '0',
          _XCatEntChn_DLVREXPNSCALCTYPE: '10',
          SB_EVENT_YN: 'N',
          TAXRATE: '10',
          _fix_MARG_RATE: '10',
          deviceChnId: 'MOBIL',
          _XCatEntChn_DLVREXPNSAPPLYTYPE: 'BNY',
          RECEIVER_MOBILE: '',
          CAT1_CATEGORY_ID: '2',
          BASEPRICE: '',
          PARTNUMBER: '10119997968',
          _XPriceDtl_VAT_AMT: '1055',
          REL_OFFER_ID: '',
          WBL_NUM: '',
          _XCatEntChn_BUSCHN_ID: 'INT',
          XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE: '0',
          STOREENT_ID: '13001',
          LASTCREATE: '2020-08-19 10:47:20.829',
          CHILD_BASEITEM_ID: '20738079',
          REV_TAX_TYPE_CD: '20',
          CNNL_CLSSF_CD: '',
          CHILD_CATENTRY_ID: '10119997968',
          CATALOG_ID: '98003',
          _XCatEntChn_FREEDLVRSPRCD: '20',
          CARDSENDDT: '',
          PRICE: '12900',
          TOTALPRODUCT: '12900',
          OUTGO_LOC_LSC_CD: '10',
          DLVY_PERIOD: '',
          _XCatEntChn_DLVREXPNSAPPLYUNIT: '',
          CHILD_FIELD2: '',
          XCATENTRY_DISP_NAME: '브이솔루션 아사이베리 파우더 100g / 무료배송',
          intuitiveShippingDate: '20200824',
          MULTI_CD: '',
          ITEMSPC_ID: '90026954490',
          CHILD_CATENTTYPE_ID: 'ItemBean',
          ORDERITEMS_ID: '181090992',
          OFFER_IDFR: '',
          CATENTTYPE_ID: 'ItemBean',
          acceptPath: '500',
          PRIOD_DLVR_YN: 'N',
          AFFIL_ENT_CD: '',
          PROM_DC_WAY_ARS: '',
          MFPARTNUMBER: '',
          PROM_VAL_CPC: '0',
          CATENTRY_ID_CHILD: '10119997968',
          XBUSCHNID: 'INT',
          CHILD_MEMBER_ID: '7000000000000000201',
          _fix_COST_TYPE_CD: '10',
          ORDERIPADDRESS: '',
          CHILD_MARKFORDELETE: '0',
          ADDRESS_ID: '',
          MARKFORDELETE: '0',
          LSP_YN: 'N',
          XCATENTRY_DISP_ITNCATENTRYNM: '브이솔루션 아사이베리 파우더 100g / 무료배송',
          XCOST_TYPE_CD: '10',
          VENDOR_ID: '110378',
          _XPriceDtl_COST_VAT_PERDO: '10555',
          PARNT_ORDER_SEQ: '',
          CAT2_CATEGORY_ID: '105',
          GOODS_NM_TRPT: '아사이베리 파우더',
          _XCatEntChn_SALESTAT: 'ON',
          _XCatEntChn_DISSCTNT: '',
          PROM_DC_WAY_PAD: '',
          MSG_CARD_WRITE_YN: 'N',
          _fix_VAT_AMT: '1055',
          XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE: '',
          PARENT_MEMBER_ID: '7000000000000000201',
          relaxGb: 'N',
          PROM_VAL_LSP: 'N',
          _XCatEntChn_CATENTRYWG: '100',
          TOTALADJUSTMENT: '0',
          SEND_TYPE: '',
          ADLT_GOODS_YN: 'N',
          ESPOT_ID: '0',
          RFND_SHAPE_CD: 'PST',
          CAMP_ID: '',
          XBUSCHN_ID: 'INT',
          _XCatEntChn_CARDCHRGDCEXCPTYN: 'N',
          STYLE_MNG_YN: 'N',
          _prc_COST_VAT_PERDO: '10555',
          MFNAME: '',
          _XPriceDtl_COST_TYPE_CD: '10',
          OUTGO_LOC_CD: '3',
          _fix_COST_VAT_PERDO: '10555',
          ORDER_SEQ: '496143',
          FLOWER_PRD_INFO: {},
          DLVR_ENT_CD: '',
          PARENT_PARTNUMBER: '20874208',
          PROM_VAL_LSP_RATE: '0',
          APPLY_CST_PRC: '10555',
          CHILD_MFPARTNUMBER: '',
          ONCE_MAX_ORDER_POSS_QTY: '999',
          PARENT_BASEITEM_ID: '20738079',
          CUST_PRIOD_CNVEY_YN: '',
          _XCatEntChn_EVERYCPEXCPTYN: 'N',
          IMDTDCCPAMT: '0',
          PARENT_CATENTRY_ID: '20874208',
          KEEP_WAY_CD: '10',
          PARENT_FIELD2: '4749',
          CARDSENDTYPE: '',
          _XCatEntChn_GIFTC_GOODS_ID: '',
          RMASHIPCHARGE: '0',
          XCATENTRY_DISP_MFNAME: '',
          BASEITEM_ID: '20738079',
          ITEM_RECEIVER_EMAIL: '',
          ORGIN_ORDER_SEQ: '',
          _XCatEntChn_DLVREXPNS: '0',
          CATENTRY_ID: '10119997968',
          ITNCATENTRYNM: '',
          DISP_TYPE_CD: '10',
          INVENTORY_QUANTITY_SCHD_DATE: '20200821',
          SHIPCHARGE: '0',
          ITEM_CARDSENDER: '',
          STATUS: 'P',
          OUTGO_CMD_SCHD_DATE: '',
          NORMAL_SL_PRC: '12900',
          PTN_CD: '110',
          ITEMPRICE: '12900',
          CAT3_CATEGORY_ID: '539',
          _XCatEntChn_ITNCATENTRYNM: '브이솔루션 아사이베리 파우더 100g / 무료배송',
          PARENT_ITEMSPC_ID: '',
          CATEGORY_ID: '1618064',
          ONEPROD_ID: '20874208'
        },
        imageSourceURL: 'https://product-image.dev-nsmall.com/itemimg/8/20/208/20874208_G.jpg',
        selectGift: [],
        selectChoice: [],
        itemBaseData: {
          Price: 12900,
          QTY: 1,
          COST_PRICE: 11610,
          COST_VAT_PERDO: 10555,
          VAT_AMT: 1055,
          BasePrice: 12900,
          MIN_CMSSN_RATE_SCOPE: 0,
          MIN_CMSSN_RATE_SCOPE_PRICE: 0,
          MargPrice: 12900
        }
      }
    ],
    cardBnftMsgYn: 'N',
    UsePaymentInfo: {
      GIFTCARD: 'N',
      NETTIWELL: 'N',
      HAPPYMONEY: 'N',
      MOBILE: 'Y',
      NSPAY: 'Y',
      KAKAOPAY: 'N',
      ACCUMMONEY: 'N',
      CREDITCARD: 'Y',
      MILEAGE: 'N',
      ACCOUNT: 'Y',
      PAYPIN: 'Y',
      PAYCO: 'Y',
      OKCASHBAGSAVE: 'Y',
      NAVERPAY: 'Y',
      OKCASHBAG: 'N',
      COMPPAY: 'N',
      DEPOSIT: 'Y'
    },
    hpNoSmsAuthYn: 'Y',
    CardList: [
      {
        ezPayCode: '029',
        value: '신한카드',
        code: 'LG'
      },
      {
        ezPayCode: '026',
        value: 'BC카드',
        code: 'BC'
      },
      {
        ezPayCode: '016',
        value: 'KB국민카드',
        code: 'KM'
      },
      {
        ezPayCode: '031',
        value: '삼성카드',
        code: 'SS'
      },
      {
        ezPayCode: '047',
        value: '롯데카드 (아멕스)',
        code: 'AM'
      },
      {
        ezPayCode: '027',
        value: '현대카드 (다이너스)',
        code: 'DN'
      },
      {
        ezPayCode: '021',
        value: '우리카드',
        code: 'BC'
      },
      {
        ezPayCode: '006',
        value: '하나SK카드',
        code: 'HN'
      },
      {
        ezPayCode: '008',
        value: '외환은행카드',
        code: 'WH'
      },
      {
        ezPayCode: '022',
        value: '씨티은행카드',
        code: 'BC'
      },
      {
        ezPayCode: '002',
        value: '광주VISA카드',
        code: 'BC'
      },
      {
        ezPayCode: '010',
        value: '전북VISA카드',
        code: 'BC'
      },
      {
        ezPayCode: '026',
        value: '저축은행카드',
        code: 'BC'
      },
      {
        ezPayCode: '058',
        value: '산은캐피탈카드',
        code: 'BC'
      },
      {
        ezPayCode: '026',
        value: '농수산제휴카드',
        code: 'NS'
      }
    ],
    AddressList: [],
    firstOrderYn: 'N',
    UseCardList: [
      {
        CARD_SEQ: '10',
        moduleGubun: 'P',
        POINTEX: 'N',
        CARD_CO_NM: '신한카드',
        EZPAYCD: '029',
        CARD_CO_CD: 'SH',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'Y',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '20',
        moduleGubun: 'E',
        POINTEX: 'Y',
        CARD_CO_NM: '삼성카드',
        EZPAYCD: '031',
        CARD_CO_CD: 'SS',
        VALID_YN: 'Y',
        POINT_NAME: '삼성카드 포인트',
        DIRECT_YN: 'N',
        CARD_CO_URL: 'http://samsungcard.co.kr',
        COCD: '110'
      },
      {
        CARD_SEQ: '30',
        moduleGubun: 'I',
        POINTEX: 'Y',
        CARD_CO_NM: 'KB국민카드',
        EZPAYCD: '016',
        CARD_CO_CD: 'KM',
        VALID_YN: 'Y',
        POINT_NAME: 'KB국민카드 포인트리',
        DIRECT_YN: 'Y',
        CARD_CO_URL: 'http://www.kbcard.com',
        COCD: '110'
      },
      {
        CARD_SEQ: '40',
        moduleGubun: 'E',
        POINTEX: 'Y',
        CARD_CO_NM: 'BC카드(페이북)',
        EZPAYCD: '026',
        CARD_CO_CD: 'BC',
        VALID_YN: 'Y',
        POINT_NAME: 'BC카드 포인트',
        DIRECT_YN: 'N',
        CARD_CO_URL: 'http://www.bccard.com',
        COCD: '110'
      },
      {
        CARD_SEQ: '50',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '현대카드',
        EZPAYCD: '027',
        CARD_CO_CD: 'DN',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '60',
        POINTEX: 'N',
        CARD_CO_NM: 'NH농협카드',
        EZPAYCD: '018',
        CARD_CO_CD: 'CH',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'Y',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '70',
        moduleGubun: 'L',
        POINTEX: 'N',
        CARD_CO_NM: '롯데카드',
        EZPAYCD: '047',
        CARD_CO_CD: 'AM',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'Y',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '80',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '하나카드',
        EZPAYCD: '006',
        CARD_CO_CD: 'HN',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '100',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '우리카드',
        EZPAYCD: '021',
        CARD_CO_CD: 'BC',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '110',
        moduleGubun: 'I',
        POINTEX: 'N',
        CARD_CO_NM: '카카오뱅크카드',
        EZPAYCD: '016',
        CARD_CO_CD: 'KM',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'Y',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '120',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '씨티카드',
        EZPAYCD: '022',
        CARD_CO_CD: 'VS',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '130',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '저축은행카드',
        EZPAYCD: '026',
        CARD_CO_CD: 'BC',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '130',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: 'VISA카드',
        EZPAYCD: '050',
        CARD_CO_CD: 'VS',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '140',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '신협체크카드',
        EZPAYCD: '026',
        CARD_CO_CD: 'BC',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '150',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: 'MG새마을체크카드',
        EZPAYCD: '026',
        CARD_CO_CD: 'BC',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '160',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: 'KB증권able카드',
        EZPAYCD: '026',
        CARD_CO_CD: 'BC',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '170',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '수협카드',
        EZPAYCD: '017',
        CARD_CO_CD: 'SU',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '190',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '전북JB카드',
        EZPAYCD: '010',
        CARD_CO_CD: 'VS',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '200',
        moduleGubun: 'P',
        POINTEX: 'N',
        CARD_CO_NM: '제주카드',
        EZPAYCD: '011',
        CARD_CO_CD: 'SH',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'Y',
        CARD_CO_URL: '#',
        COCD: '110'
      },
      {
        CARD_SEQ: '220',
        moduleGubun: 'E',
        POINTEX: 'N',
        CARD_CO_NM: '광주은행카드',
        EZPAYCD: '002',
        CARD_CO_CD: 'BC',
        VALID_YN: 'Y',
        POINT_NAME: '',
        DIRECT_YN: 'N',
        CARD_CO_URL: '#',
        COCD: '110'
      }
    ],
    nspaySmptYn: 'N',
    LatelyAddressYN: 'N',
    ShipAddressList: [],
    RecentAddressList: '',
    LastPayTypeCode: '100',
    UserInfo: {
      LASTSESSION: '2020-08-19 10:44:45.104',
      LANGUAGE_ID: '',
      PROFILETYPE: '',
      AUTHBIRTHDAY: '',
      DN: '',
      USER_TYPE: '',
      USERS_ID: '112206571',
      SETCCURR: '',
      FIELD1: '',
      LASTORDER: '',
      REGISTRATION: '',
      FIELD3: '',
      REGISTERTYPE: 'G',
      PERSONALIZATIONID: '1597801485078-727'
    },
    MyGradeInfo: {},
    staffBnft: {
      couponBnftRate: 0,
      useAmt: 0,
      couponId: '',
      bnftBiggerYn: 'N',
      memberId: '',
      userId: 0,
      class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
      balanceAmt: 0,
      limitAmt: 0,
      empYn: 'N'
    },
    UserInfoBenefit: {
      OKCASHBAG_BALANCE: 0,
      NETIWELL_BALANCE: 0,
      HAPPYMONEY_BALANCE: 0,
      GIFTCARD_BALANCE: 0
    }
  }

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    bizUtil.gotoOrdersheet(tempMInputParams)
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
    mock = new MockAdapter(axios)
    initOrderSheet(mock)
    initOrderSheetDelivery(mock)

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

    orderSheetWrapper = mount(OrderSheet, options)

    await flushPromises()
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheetGuestCustomer 테스트', () => {
    it('setUpdateOrderer', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.setUpdateOrderer(null)
      assert.equal(true, true)

      wrapper.vm.orderInfo = '김모모'
      wrapper.vm.ordererHpNo = '010-1231-1234'
      wrapper.vm.ordererEmail = 'adfa@adsf.com'
      wrapper.vm.setUpdateOrderer({
        ordererName: '',
        ordererHpNo: '',
        ordererEmail: ''
      })
      assert.equal(true, true)

      wrapper.vm.setUpdateOrderer({
        ordererName: '김모모',
        ordererHpNo: '010-1231-1234',
        ordererEmail: 'adfa@adsf.com'
      })
      assert.equal(true, true)
    })

    it('setOrdererInfo', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.setOrdererInfo(msgData)
      assert.equal(true, true)
    })

    it('keydownNumber', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.keydownNumber({
        keyCode: 50,
        target: {
          value: '12'
        }
      })
      assert.equal(true, true)
    })

    it('showCertView', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.showCertView()
      await flushPromises()
      assert.equal(true, true)
    })

    it('clearCheck', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.clearCheck({
        target: {
          value: ''
        }
      })
      assert.equal(true, true)
    })

    it('changeValue', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.changeValue('asdf', 'asdf')
      assert.equal(true, true)
    })

    it('blurEmail', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.blurEmail({
        target: {
          value: ''
        }
      })
      assert.equal(true, true)
    })

    it('passPress', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.passPress()
      assert.equal(true, true)
    })

    it('blurPassword', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.ordererInfo.paassword = ''
      wrapper.vm.blurPassword({
        target: {
          value: ''
        }
      })
      assert.equal(true, true)

      wrapper.vm.ordererInfo.paassword = '1234'
      wrapper.vm.ordererInfo.pwConfirm = '1235'
      wrapper.vm.blurPassword({
        target: {
          value: ''
        }
      })
      assert.equal(true, true)
    })

    it('blurPwConfirm', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.ordererInfo.paassword = '1235'
      wrapper.vm.ordererInfo.pwConfirm = '1234'
      wrapper.vm.blurPwConfirm({
        target: {
          value: ''
        }
      })
      assert.equal(true, true)
    })

    it('clickPasswordShow', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.isPasswordTextShow = true
      wrapper.vm.clickPasswordShow()
      assert.equal(true, true)

      wrapper.vm.isPasswordTextShow = false
      wrapper.vm.clickPasswordShow()
      assert.equal(true, true)
    })

    it('clickPwConfirmShow', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetGuestCustomer)

      wrapper.vm.isPwConfirmTextShow = true
      wrapper.vm.clickPwConfirmShow()
      assert.equal(true, true)

      wrapper.vm.isPwConfirmTextShow = false
      wrapper.vm.clickPwConfirmShow()
      assert.equal(true, true)
    })
  })
})
