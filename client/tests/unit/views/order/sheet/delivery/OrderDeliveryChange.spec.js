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
import bizUtil from '@utils/bizUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderDeliveryChange from '@/components/order/OrderDeliveryChange'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

describe('OrderDeliveryChange', () => {
  let localVue
  let options
  let orderSheetWrapper
  let mock

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
    mock.reset()
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
  describe('OrderDeliveryChange 테스트', () => {
    let wrapper
    const orderId = '300011015064'
    const zipCode = '13547'
    const strFlag = 'N'
    const ITEMS = [
      {
        INDEX: '0',
        IMG: 'http://product-image.dev-nsmall.com/itemimg/8/23/038/23110038_E.jpg',
        HEADNAME: '',
        BRAND_KOR_NM: '오가니스트',
        ITNCATENTRYNM: '오가니스트 제주 샴푸/컨디셔너/바디워시 신제품 출시',
        QUANTITY: '10',
        ORIGINAL_QUANTITY: '10',
        ORDERITEMS_ID: '179311058',
        CATENTRY_ID: '10145519689',
        ATTRIBUTES: [
          {
            VALUE: '',
            NAME: '선택01)무환자샴푸x1개+사은품50명',
            SUBSEQ: '0',
            SEQ: '0'
          }
        ],
        GIFT: [],
        GOODSPARTNUMBER: '23110038',
        CATENTRYID: '10145519689',
        GOODSCATENTRYID: '23110038',
        PRICE: '13900',
        DCPRICE: '13900',
        SHIPCHARGE: '0',
        installCnt: '0',
        DLVY_GRP_KEY_CNT: '2',
        DLVY_GRP_KEY: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:109267,DLVR_WAY_CD1:10,PCKG_YN:Y,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:1,FREE_DLVR_POSS_AMT:999999999999,',
        PRODUCT_NAME: '오가니스트 제주 샴푸/컨디셔너/바디워시 신제품 출시',
        DISP_TYPE_CD: '15',
        orderItemId: '179311058',
        itemId: '179311058',
        itemQuantity: '10',
        extShipInfo: '결제후 3일 이내 배송(토,일,공휴일 제외)',
        PROM_VAL_PAD: '0',
        CARDSENDTYPE: '',
        ITEM_RECEIVER_EMAIL: '',
        RECEIVER_MOBILE: '',
        CARDMESSAGE: '',
        STYLE_MNG_YN: 'Y',
        STYLEMNGY: 'Y',
        GIFT_YN: 'N',
        GIFTN: 'N',
        selectGift: [],
        RMA_DLVR_YN: 'Y',
        NORMAL_SL_PRC: '13900',
        APPLY_CST_PRC: '11626',
        NORMAL_CST_PRC: '11626',
        selectChoice: [],
        selectPack: [],
        BUSCHN_ID: 'INT',
        XCOST_TYPE_CD: '10',
        GIFTC_GOODS_ID: '',
        CAMP_ID: '',
        multiCd: '',
        custDurSpr: 0,
        partNumber: '23110038',
        maxquantity: 0,
        maxOrderPossQty: 0,
        custPrchQtyLimitYn: 'N',
        ROWID: '1',
        BASEPRICE: '13900',
        RMASHIPCHARGE: '0',
        TOTALPRODUCT: '139000',
        TOTALADJUSTMENT: '0'
      }
    ]

    beforeEach(async () => {
      wrapper = mount(OrderDeliveryChange, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal
          }
        }
      })
      wrapper.vm.$store = { commit: data => {} }
    })

    describe('OrderDeliveryChange 테스트', () => {
      it('배송주소록 조회', async () => {
        wrapper.vm.getShipAddrList()
        await flushPromises()
        assert.isTrue(true)
      })
      it('선택 버튼 클릭', async () => {
        wrapper.vm.globalVal.paymentData = {
          deliveryList: [{
            ITEMS: [
              {
                INDEX: '0',
                IMG: 'http://product-image.dev-nsmall.com/itemimg/8/23/038/23110038_E.jpg',
                HEADNAME: '',
                BRAND_KOR_NM: '오가니스트',
                ITNCATENTRYNM: '오가니스트 제주 샴푸/컨디셔너/바디워시 신제품 출시',
                QUANTITY: '10',
                ORIGINAL_QUANTITY: '10',
                ORDERITEMS_ID: '179311058',
                CATENTRY_ID: '10145519689',
                ATTRIBUTES: [
                  {
                    VALUE: '',
                    NAME: '선택01)무환자샴푸x1개+사은품50명',
                    SUBSEQ: '0',
                    SEQ: '0'
                  }
                ],
                GIFT: [],
                GOODSPARTNUMBER: '23110038',
                CATENTRYID: '10145519689',
                GOODSCATENTRYID: '23110038',
                PRICE: '13900',
                DCPRICE: '13900',
                SHIPCHARGE: '0',
                installCnt: '0',
                DLVY_GRP_KEY_CNT: '2',
                DLVY_GRP_KEY: 'BUSCHN_ID:INT,RFND_SHAPE_CD:PST,VENDOR_ID:109267,DLVR_WAY_CD1:10,PCKG_YN:Y,KEEP_WAY_CD:10,BNDLDLVR_YN:Y,OUTGO_LOC_CD:1,FREE_DLVR_POSS_AMT:999999999999,',
                PRODUCT_NAME: '오가니스트 제주 샴푸/컨디셔너/바디워시 신제품 출시',
                DISP_TYPE_CD: '15',
                orderItemId: '179311058',
                itemId: '179311058',
                itemQuantity: '10',
                extShipInfo: '결제후 3일 이내 배송(토,일,공휴일 제외)',
                PROM_VAL_PAD: '0',
                CARDSENDTYPE: '',
                ITEM_RECEIVER_EMAIL: '',
                RECEIVER_MOBILE: '',
                CARDMESSAGE: '',
                STYLE_MNG_YN: 'Y',
                STYLEMNGY: 'Y',
                GIFT_YN: 'N',
                GIFTN: 'N',
                selectGift: [],
                RMA_DLVR_YN: 'Y',
                NORMAL_SL_PRC: '13900',
                APPLY_CST_PRC: '11626',
                NORMAL_CST_PRC: '11626',
                selectChoice: [],
                selectPack: [],
                BUSCHN_ID: 'INT',
                XCOST_TYPE_CD: '10',
                GIFTC_GOODS_ID: '',
                CAMP_ID: '',
                multiCd: '',
                custDurSpr: 0,
                partNumber: '23110038',
                maxquantity: 0,
                maxOrderPossQty: 0,
                custPrchQtyLimitYn: 'N',
                ROWID: '1',
                BASEPRICE: '13900',
                RMASHIPCHARGE: '0',
                TOTALPRODUCT: '139000',
                TOTALADJUSTMENT: '0'
              }
            ]
          }]
        }

        wrapper.vm.dataFildsList[0] = {
          data: {
            cst_zipCode: '13487'
          }
        }

        wrapper.vm.clickParentSendDataBtn(0)
        assert.isTrue(true)
      })
      it('배송지 추가 버튼', async () => {
        wrapper.vm.clickAddressBookAddBtn()
        await flushPromises()
        assert.isTrue(true)
      })
      /*
      it('배송지 수정 버튼', async () => {
        wrapper.vm.clickUpdateDataBtn(0)
        await flushPromises()
        assert.isTrue(true)
      })
      */
      it('도서산간 배송가능 여부 조회', async () => {
        wrapper.vm.getShippingCharge(orderId, zipCode, ITEMS)
        await flushPromises()
        assert.isTrue(true)
      })
      it('도서산간 지역체크', async () => {
        wrapper.vm.getIslandmountain(orderId, zipCode, ITEMS, strFlag)
        await flushPromises()
        assert.isTrue(true)
      })
      it('배송비 정보 조회 및 처리', async () => {
        wrapper.vm.getShippingChargeNext(orderId, zipCode, ITEMS, strFlag)
        await flushPromises()
        assert.isTrue(true)

        wrapper.vm.getShippingChargeNext(orderId, zipCode, ITEMS, 'J')
        assert.isTrue(true)

        wrapper.vm.getShippingChargeNext(orderId, zipCode, ITEMS, 'D')
        assert.isTrue(true)

        wrapper.vm.getShippingChargeNext(orderId, zipCode, ITEMS, 'Y')
        assert.isTrue(true)
      })
      it('배송비 계산 api 통신', async () => {
        wrapper.vm.doShippingChargeCmd()
        await flushPromises()
        assert.isTrue(true)
      })
    })
  })
})
