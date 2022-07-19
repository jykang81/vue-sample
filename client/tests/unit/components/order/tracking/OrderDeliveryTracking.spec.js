import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import VueRouter from 'vue-router'
import router from '@/router'
// import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'

import CONST from '@constants/framework/framework'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderDeliveryTracking from '@/components/order/tracking/OrderDeliveryTracking'

describe('OrderDeliveryTracking', () => {
  let localVue
  let options
  let mainWrapper
  let mock

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'orderDeliveryTracking',
      meta: {},
      path: '/order/list',
      hash: '',
      query: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200, {
      msg: {
        root: {
          vdn_cd: '6950',
          rvCnt: '',
          userId: '732040392',
          tidx: '',
          accptPath: '500',
          tab3Cnt: '0',
          ordsid: '300074306130',
          tab1Cnt: '0',
          pageidx: '1',
          odt1: '',
          odt2: '',
          statusCnt: [],
          userInfo: {
            gender: 'M',
            phone1: '010-1010-1010',
            phone2: null,
            phone11: '010',
            zipcode: '16649',
            phone12: '1010',
            phone13: '1010',
            addrbookId: '28620631',
            memberId: '732040392',
            teltype01: null,
            teltype02: null,
            ziptype: '200',
            registertype: 'K',
            lastname: '장성우',
            zipcode1: '16649',
            zipcode2: null,
            phone21: null,
            nickname: 'dogbooktest@naver.com',
            phone22: null,
            addressId: '20654501503',
            phone23: null,
            custNum: '48551629',
            address: '경기 수원시 권선구 고산로 12 테스트투투',
            address1: '경기 수원시 권선구 고산로 12',
            address2: '테스트투투',
            age: null
          },
          storeId: '13001',
          pagelmt: '10',
          orders: [
            {
              validPayYn: 'N',
              totalpayment: '68900',
              cancelProcType: 'PRE',
              timeplaced: '2020-10-07',
              payms: [
                {
                  paymenttype: 'POINT',
                  payAmt: '68900',
                  paySchdAdjustAmt: '68900',
                  payTypeCnt: '1',
                  availAdjustAmt: '68900',
                  displayorder: ' 00020',
                  paymentname: '적립금 사용',
                  payDttm: '2020.10.07 15:23',
                  payClssfNm: '승인',
                  paySchdAmt: '68900',
                  paySeq: '1',
                  availAmt: '68900',
                  paymdtls: [
                    {
                      payAmt: '68900',
                      payDttm: '2020.10.07 15:23:04',
                      apprNo: '-',
                      payDt: '2020/10/07',
                      relNm: '',
                      availAmt: '68900',
                      relNo: '***-****-****'
                    }
                  ],
                  ordersId: '300074306130',
                  totalPayment: '68900',
                  cancelDttm: null,
                  priority: '6',
                  stdAmt: '68900',
                  pstAdjustAmt: '0',
                  payTypeSum: '68900',
                  paymentpath: 'INTERNAL',
                  receiptYn: 'N',
                  oneTouchYn: 'N',
                  displaytext: '적립금/포인트/예치금 사용',
                  paymentcode: '600',
                  canceltype: 'PARTIAL',
                  payClssfCd: '100',
                  pstAmt: '0',
                  payTypeSeq: '1'
                }
              ],
              currency: 'KRW',
              rtnExcgNotAvailYn: 'N',
              memberId: '732040392',
              totaltaxshipping: '0',
              lockedOrderYn: 'N',
              latestOperationId: null,
              cats: [
                {
                  statusIndex: '6',
                  totalproductTax: '6263',
                  unitCd: '10217300302',
                  freeDlvrSprCd: '20',
                  catentryName: '[Shop+]실크테라피 오리지널 에센스 패키지(에센스(150mlX3 + 60mlX3 + 15mlX7)+실크인퓨전+샴푸)',
                  selfAddress: {
                    lotnZipcode1: '16649',
                    lotnZipcode2: null,
                    phone1: '010-1234-1234',
                    phone2: null,
                    roadZipcode: '16649',
                    phone11: '010',
                    zipcode: '16649',
                    phone12: '1234',
                    phone13: '1234',
                    lotnZipcode: '16649',
                    memberId: '732040392',
                    addrbookId: '28620631',
                    teltype01: null,
                    teltype02: null,
                    businesstitle: null,
                    lotnAddress1: '경기 수원시 권선구 고색동',
                    lotnAddress2: '290-45번지 테스트투투',
                    ziptype: '200',
                    lastname: '테스트맨',
                    roadZipcode1: '16649',
                    zipcode1: '16649',
                    roadZipcode2: null,
                    zipcode2: null,
                    dispAddressPlus: '[16649] 경기 수원시 권선구 고산로 12 테스트투투',
                    phone21: null,
                    nickname: '테스트맨',
                    phone22: null,
                    addressId: '20654534504',
                    phone23: null,
                    roadAddress1: '경기 수원시 권선구 고산로 12',
                    address1: '경기 수원시 권선구 고산로 12',
                    roadAddress2: '테스트투투',
                    address2: '테스트투투'
                  },
                  relaxGb: 'Y',
                  quantity: '1',
                  btnctrls: [
                    {
                      btns: 'DELIVERY_STATUS',
                      btnnm: '배송조회'
                    },
                    {
                      btns: 'PRODUCT_COMMENT_READ',
                      btnnm: '상품평 보기'
                    }
                  ],
                  orgQuantity: '1',
                  orderitemsBillTax: '6263',
                  imageUrl: '//product-image.prod-nsmall.com/itemimg/8/28/628/28642628_C.jpg',
                  convinGb: 'N',
                  catentryId: '10217300302',
                  displayType: 'NORMAL',
                  statusName: '배송완료',
                  addressChangeable: 'N',
                  phoneReqDate: null,
                  barOpt: null,
                  attrs: [
                    {
                      ordersId: '300074306130',
                      attrvalDesc: '실크테라피 오리지널 에센스 패키지',
                      sequence: '10',
                      attrDesc: '옵션',
                      attrvalId: '10',
                      attrId: '1',
                      orderitemsId: '262586386'
                    }
                  ],
                  buschnId: 'MOBIL',
                  cancelQuantity: '0',
                  prsntPackYn: 'N',
                  steps: [
                    {
                      step: '주문접수'
                    },
                    {
                      step: '결제완료'
                    },
                    {
                      step: '주문전달'
                    },
                    {
                      step: '상품준비중'
                    },
                    {
                      step: '배송중'
                    },
                    {
                      step: '배송완료'
                    }
                  ],
                  cnveyNum: null,
                  createdate: '2020.10.07',
                  totalproduct: '69900',
                  phoneReqClssfNm: null,
                  modQuantity: '1',
                  addressId: '20654534504',
                  stdOrderitemsId: '262586386',
                  orderSeq: '1',
                  totaladjustment: '1000',
                  slctDay: null,
                  brandName: '실크테라피',
                  exceptionMsg: null,
                  ordercatsKey: '300074306130_20654534504_10217300302_S',
                  addressSum: '69900',
                  shipchargeSum: '0',
                  ship: {
                    lotnZipcode1: '16649',
                    lotnZipcode2: null,
                    phone1: '010-1234-1234',
                    phone2: null,
                    cardsender: '전호열',
                    orderername: '전호열',
                    message: null,
                    roadZipcode: '16649',
                    zipcode: '16649',
                    phone11: '010',
                    phone12: '1234',
                    phone13: '1234',
                    lotnZipcode: '16649',
                    addrbookId: '28620631',
                    memberId: '732040392',
                    teltype01: null,
                    teltype02: null,
                    businesstitle: null,
                    lotnAddress1: '경기 수원시 권선구 고색동',
                    lotnAddress2: '290-45번지 테스트투투',
                    ziptype: '200',
                    email: 'dogbooktest@naver.com',
                    ordersId: '300074306130',
                    lastname: '테스트맨',
                    sendType: null,
                    roadZipcode1: '16649',
                    zipcode1: '16649',
                    roadZipcode2: null,
                    zipcode2: null,
                    contactnum: '010-1010-1010',
                    dispAddressPlus: '[16649] 경기 수원시 권선구 고산로 12 테스트투투',
                    receiverEmail: null,
                    orderitemsId: '262586386',
                    phone21: null,
                    nickname: '테스트맨',
                    phone22: null,
                    phone23: null,
                    addressId: '20654534504',
                    cardmessage: null,
                    roadAddress1: '경기 수원시 권선구 고산로 12',
                    address1: '경기 수원시 권선구 고산로 12',
                    roadAddress2: '테스트투투',
                    address2: '테스트투투',
                    cardreceiver: '테스트맨'
                  },
                  subProducts: [],
                  stepOpt: 'ir_b_cnts order_step',
                  price: '69900',
                  addressSeq: '1',
                  flashSaleYn: null,
                  existAnotherOpts: 'Y',
                  catentryIdOrg: '10217300302',
                  exchangeQuantity: '0',
                  modelName: null,
                  memberId: '732040392',
                  addressCnt: '1',
                  goodsCd: '28642628',
                  orderitemsBill: '68900',
                  returnQuantity: '0',
                  ordersId: '300074306130',
                  msgCardWriteYn: 'N',
                  dlvrWayCd1: '10',
                  shipcharge: '0',
                  status: 'S',
                  intrv: null,
                  commentWriteYn: 'Y',
                  rmashipcharge: '0',
                  createdatetime: '2020.10.07 15:22:58',
                  multiCd: null,
                  dispTypeCd: '10'
                }
              ],
              cashreceiptAmount: '0',
              ordersId: '300074306130',
              lastupdateall: '20201007152304',
              media: '모바일',
              ourCoPayYn: 'Y',
              storeentId: '13001',
              totaltax: '0',
              shipascomplete: 'Y',
              totalproduct: '69900',
              hasCantTraceCardYn: 'N',
              catType: '1',
              totaladjustment: '1000',
              orderitems: [
                {
                  ordersId: '300074306130',
                  modDlvrDcAmt: '0',
                  buschnId: 'MOBIL',
                  dlvrDcAmt: '0',
                  cancelQuantity: '0',
                  price: '69900',
                  totalproduct: '69900',
                  quantity: '1',
                  catentryIdOrg: '10217300302',
                  orderitemsId: '262586386',
                  modQuantity: '1',
                  exchangeQuantity: '0',
                  addressId: '20654534504',
                  shipcharge: '0',
                  totaladjustment: '1000',
                  orderSeq: '1',
                  ordercatsKey: '300074306130_20654534504_10217300302_S',
                  memberId: '732040392',
                  addressIdOrg: '20654534504',
                  rmashipcharge: '0',
                  catentryId: '10217300302',
                  stdAmount: '69900',
                  returnQuantity: '0'
                }
              ],
              preCancelYn: 'N',
              status: 'S',
              totalshipping: '0',
              totalstdamount: '69900',
              cpBnftVal: '0',
              totalavailpayment: '68900',
              pstRefundAvailYn: 'Y',
              orderLastPaySeq: '1',
              discs: [
                {
                  ordersId: '300074306130',
                  totaladjustment: '1000',
                  dcAmt: '1000',
                  applyTypeCd: '200',
                  discountname: 'ARS 할인'
                }
              ],
              taxbillreceiptAmount: '68900'
            }
          ],
          langId: '-9',
          rowpage: '5',
          tab4Cnt: '0',
          vwtyp: '',
          tab2Cnt: '0',
          midx: '',
          tmtyp: '',
          status: '',
          req_co_cd: '110',
          viewTaskName: 'NSMypageDetailView'
        }
      },
      channel: [
        'mobile'
      ],
      authorizedStaff: true,
      userId: [
        '732040392'
      ],
      langId: [
        '-9'
      ],
      tidx: [
        ''
      ],
      accptPath: [
        '500'
      ],
      vwtyp: [
        ''
      ],
      accptPathCd: [
        '500'
      ],
      ordsid: [
        '300074306130'
      ],
      staffInfo: {
        class: 'class com.ns.commerce.staff.bean.StaffInfoBean',
        companyGroupMail: 'dogbookTest@harimholdings.com',
        nsEmpTopCategoryId: null,
        expiredDate: '2021-01-24',
        userId: '732040392',
        companyGroupCode: 'HARIMGROUP'
      },
      req_co_cd: [
        '110'
      ],
      catalogId: [
        '97001'
      ],
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
      storeId: [
        '13001'
      ],
      isSuccessful: true
    })
      .onGet(`${CONST.NSMALL_API_HOST}/order-delivery-tracking/v1/04/9971467`)
      .reply(200, {
        data: {
          companyInfo: {
            name: '대한통운',
            tel: '1588-1255'
          },
          senderName: '',
          receiverName: '',
          invoiceNo: '9971467',
          trackingDetails: []
        },
        status: 200,
        statusText: '',
        headers: { 'content-length': '134', 'content-type': 'application/json' },
        config: {
          url: 'https://api.dev-nsmall.com/order-delivery-tracking/v1/04/9971467',
          method: 'get',
          headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: 'Lo7cIIF45c87hC323TxbaPy+GE0kPvY+L1LETCO4Nxc='
          },
          transformRequest: [null],
          transformResponse: [null],
          timeout: 100000,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          maxContentLength: -1
        },
        request: {}
      })

    options = {
      localVue,
      store,
      router,
      propsData: {
        param: {
          title: '배송조회',
          isShowSearch: true,
          isShowCart: true,
          footerShow: true,
          bottomShow: true,
          ordersId: '300074306130',
          guestResultYn: 'N',
          logonType: 'normal',
          intPrdYn: 'N',
          dlvrEntCd: '04',
          wblNum: '9971467',
          catsIdx: 0
        }
      }
    }
    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    mainWrapper = mount(OrderDeliveryTracking, options)
  })

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })
  describe('OrderDeliveryTracking 테스트', () => {
    it('배송조회', async () => {
      assert.isNotNull(mainWrapper.vm)
    })
    it('computed', async () => {
      assert.isNotNull(mainWrapper.vm.bizUtil)
    })
    it('getOrderDeliveryTracking', async () => {
      assert.isFalse(await mainWrapper.vm.getOrderDeliveryTracking('', ''))
    })
    it('clickBoardInquiryWrite', async () => {
      mainWrapper.vm.clickBoardInquiryWrite()
      assert.isTrue(true)
    })
    it('inquiryClickLogging', async () => {
      mainWrapper.vm.inquiryClickLogging()
      assert.isTrue(true)
    })
  })
})
