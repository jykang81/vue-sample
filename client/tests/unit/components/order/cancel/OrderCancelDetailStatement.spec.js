import Vue from 'vue'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import nsaxios from '@frameworks/axiosUtil'
import router from '@/router'
import store from '@/vuex'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import cancelDetail from '@components/order/cancel/OrderCancelDetailStatement'

describe('마이페이지 > 주문/배송조회 > 취소상세', () => {
  let mock
  let wrapper
  let apiUrl
  let responseResult

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios

  delete router.history.current
  router.history.current = {
    name: 'mypageMain',
    meta: {},
    path: '/mypage',
    hash: '',
    query: {},
    params: {},
    fullPath: '/',
    matched: []
  }

  const options = {
    localVue,
    router,
    store,
    attachToDocument: true,
    propsData: {
      param: {
        ordersId: '300011236083'
      }
    }
  }

  before(async () => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    wrapper = mount(cancelDetail, options)
    apiUrl = `${CONST.API_URL}/NSAjaxMypageCmd`
    responseResult = {
      msg: {
        root: {
          vdn_cd: '6950',
          rvCnt: '',
          userId: '100286013',
          tidx: '',
          accptPath: '500',
          tab3Cnt: '0',
          ordsid: '300011236083',
          tab1Cnt: '0',
          pageidx: '1',
          odt1: '',
          odt2: '',
          statusCnt: [],
          userInfo: {
            gender: 'M',
            phone1: '010-1234-1236',
            phone2: '010-1234-1234',
            phone11: '010',
            zipcode: '157010',
            phone12: '1234',
            phone13: '1236',
            addrbookId: '21181631',
            memberId: '100286013',
            teltype01: '10',
            teltype02: null,
            ziptype: '200',
            registertype: 'K',
            lastname: '전호열',
            zipcode1: '157010',
            zipcode2: null,
            phone21: '010',
            nickname: '홍길동',
            phone22: '1234',
            addressId: '20638964503',
            phone23: '1234',
            custNum: '30118305',
            address: '서울 강서구 화곡로43가길 75 (화곡동) 301호',
            address1: '서울 강서구 화곡로43가길 75',
            address2: '(화곡동) 301호',
            age: null
          },
          storeId: '13001',
          pagelmt: '10',
          orders: [
            {
              validPayYn: 'Y',
              totalpayment: '0',
              cancelProcType: 'PST',
              timeplaced: '2020-07-13',
              payms: [],
              currency: 'KRW',
              rtnExcgNotAvailYn: 'Y',
              memberId: '100286013',
              totaltaxshipping: '0',
              lockedOrderYn: 'N',
              latestOperationId: '2020071300047314',
              cats: [
                {
                  statusIndex: '0',
                  totalproductTax: '0',
                  unitCd: '10020565405',
                  catentryName: '불고기브라더스 구이&amp;불고기A세트( 안창살칼집구이2팩+서울식불고기2팩)',
                  relaxGb: 'N',
                  quantity: '0',
                  btnctrls: [],
                  orgQuantity: '1',
                  orderitemsBillTax: '0',
                  imageUrl: '//product-image.dev-nsmall.com/itemimg/6/14/166/14740166_C.jpg',
                  convinGb: 'N',
                  catentryId: '10020565405',
                  displayType: 'NORMAL',
                  statusName: '취소완료',
                  addressChangeable: 'N',
                  phoneReqDate: null,
                  barOpt: null,
                  attrs: [
                    {
                      ordersId: '300011236083',
                      attrvalDesc: '공통',
                      sequence: '1',
                      attrDesc: 'COLOR 단품속성',
                      attrvalId: '3159',
                      attrId: '101',
                      orderitemsId: '180441082'
                    },
                    {
                      ordersId: '300011236083',
                      attrvalDesc: '공통',
                      sequence: '2',
                      attrDesc: 'STYLE 단품속성',
                      attrvalId: '1002451',
                      attrId: '501',
                      orderitemsId: '180441082'
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
                  createdate: '2020.07.13',
                  totalproduct: '30000',
                  phoneReqClssfNm: null,
                  modQuantity: '0',
                  addressId: '20639661003',
                  stdOrderitemsId: '180441082',
                  orderSeq: '1',
                  totaladjustment: '0',
                  slctDay: null,
                  brandName: null,
                  exceptionMsg: null,
                  ordercatsKey: '300011236083_20639661003_10020565405_X',
                  addressSum: '0',
                  shipchargeSum: '0',
                  ship: {
                    lotnZipcode1: '157010',
                    lotnZipcode2: null,
                    phone1: '010-1234-1234',
                    phone2: '010-1234-1234',
                    cardsender: '홍길동',
                    orderername: '홍길동',
                    message: null,
                    roadZipcode: '157010',
                    zipcode: '157010',
                    phone11: '010',
                    phone12: '1234',
                    phone13: '1234',
                    lotnZipcode: '157010',
                    addrbookId: '21181631',
                    memberId: '100286013',
                    teltype01: null,
                    teltype02: null,
                    businesstitle: null,
                    lotnAddress1: '서울 강서구 우장산동',
                    lotnAddress2: '77-29번지 301호',
                    ziptype: '200',
                    email: 'test@nsmall.com',
                    ordersId: '300011236083',
                    lastname: '홍길동',
                    sendType: null,
                    roadZipcode1: '157010',
                    zipcode1: '157010',
                    roadZipcode2: null,
                    zipcode2: null,
                    contactnum: '010-1234-1236',
                    dispAddressPlus: '[157010] 서울 강서구 화곡로43가길 75 (화곡동) 301호',
                    receiverEmail: null,
                    orderitemsId: '180441082',
                    phone21: '010',
                    nickname: '테스트',
                    phone22: '1234',
                    phone23: '1234',
                    addressId: '20639661003',
                    cardmessage: null,
                    roadAddress1: '서울 강서구 화곡로43가길 75',
                    address1: '서울 강서구 화곡로43가길 75',
                    roadAddress2: '(화곡동) 301호',
                    address2: '(화곡동) 301호',
                    cardreceiver: '홍길동'
                  },
                  subProducts: [],
                  stepOpt: 'ir_b_cnts order_step close',
                  price: '30000',
                  addressSeq: '1',
                  flashSaleYn: null,
                  existAnotherOpts: 'N',
                  catentryIdOrg: '10020565405',
                  exchangeQuantity: '0',
                  memberId: '100286013',
                  addressCnt: '1',
                  goodsCd: '14740166',
                  orderitemsBill: '0',
                  returnQuantity: '0',
                  ordersId: '300011236083',
                  msgCardWriteYn: 'N',
                  dlvrWayCd1: '10',
                  shipcharge: '0',
                  status: 'X',
                  intrv: null,
                  commentWriteYn: 'Y',
                  rmashipcharge: '0',
                  createdatetime: '2020.07.13 16:17:39',
                  multiCd: null,
                  dispTypeCd: '15'
                }
              ],
              cashreceiptAmount: '0',
              canPayms: [
                {
                  paymentcode: '500',
                  receiptYn: 'Y',
                  paymentname: '무통장 입금',
                  payTypeCnt: '1',
                  payTypeSum: '10000',
                  payDttm: '2020.07.17 14:55',
                  pstAmt: '0',
                  paySchdAdjustAmt: '10000',
                  canceltype: 'PARTIAL',
                  paymentpath: 'INTERNAL',
                  payAmt: '10000',
                  payClssfNm: '\ucde8\uc18c',
                  paymenttype: 'POINT',
                  priority: '7',
                  availAdjustAmt: '0',
                  displaytext: '',
                  displayorder: ' 00040',
                  totalPayment: '0',
                  availAmt: '0',
                  ordersId: '300011251004',
                  paySchdAmt: '10000',
                  paySeq: '2',
                  cancelDttm: '2020-07-17 14:56:20',
                  payClssfCd: '200',
                  pstAdjustAmt: '0',
                  stdAmt: '0',
                  paymdtls: [
                    {
                      relNo: '***-****-****',
                      payDt: '2020/07/17',
                      relNm: '',
                      payAmt: '10000',
                      payDttm: '2020.07.17 14:55:08',
                      apprNo: '-',
                      availAmt: '0'
                    }
                  ],
                  payTypeSeq: '1'
                }
              ],
              ordersId: '300011236083',
              lastupdateall: '20200713161954',
              media: '모바일',
              ourCoPayYn: 'Y',
              storeentId: '13001',
              totaltax: '0',
              shipascomplete: 'Y',
              totalproduct: '0',
              hasCantTraceCardYn: 'N',
              catType: '1',
              totaladjustment: '0',
              orderitems: [
                {
                  ordersId: '300011236083',
                  modDlvrDcAmt: '0',
                  buschnId: 'MOBIL',
                  dlvrDcAmt: '0',
                  cancelQuantity: '0',
                  price: '30000',
                  totalproduct: '30000',
                  quantity: '0',
                  catentryIdOrg: '10020565405',
                  orderitemsId: '180441082',
                  modQuantity: '0',
                  exchangeQuantity: '0',
                  addressId: '20639661003',
                  shipcharge: '0',
                  totaladjustment: '0',
                  orderSeq: '1',
                  ordercatsKey: '300011236083_20639661003_10020565405_X',
                  memberId: '100286013',
                  addressIdOrg: '20639661003',
                  rmashipcharge: '0',
                  catentryId: '10020565405',
                  stdAmount: '0',
                  returnQuantity: '0'
                }
              ],
              preCancelYn: 'N',
              status: 'D',
              totalshipping: '0',
              totalstdamount: '0',
              cpBnftVal: '0',
              totalavailpayment: '0',
              pstRefundAvailYn: 'Y',
              orderLastPaySeq: '1',
              discs: [],
              taxbillreceiptAmount: '0'
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
      }
    }

    mock
      .onPost(apiUrl)
      .reply(200, responseResult)

    await flushPromises()
  })

  it('데이터 가져오기 및 세팅', () => {
    let totalPayms = 0

    assert.equal(wrapper.vm.orderId, '300011236083')
    assert.equal(wrapper.vm.orders.status, responseResult.msg.root.orders[0].status)
    assert.equal(wrapper.vm.orderDate, responseResult.msg.root.orders[0].timeplaced.replace(/-/gi, '.'))

    for (let i = 0; i < responseResult.msg.root.orders[0].canPayms.length; i++) {
      totalPayms = totalPayms + Number(responseResult.msg.root.orders[0].canPayms[i].payAmt)
    }

    assert.equal(wrapper.vm.totalPayms, totalPayms)

    wrapper.vm.onclickOrdersList()
  })

  it('주문상세', () => {
    wrapper.vm.onclickOrderDetailLink('300011236083')
  })
})
