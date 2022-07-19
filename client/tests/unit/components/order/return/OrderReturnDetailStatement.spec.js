import Vue from 'vue'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import nsaxios from '@frameworks/axiosUtil'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import cancelDetail from '@components/order/return/OrderReturnDetailStatement'

describe('마이페이지 > 주문/배송조회 > 반품상세', () => {
  let mock
  let wrapper
  let apiUrl
  let responseResult

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios

  const options = {
    localVue,
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
    apiUrl = `${CONST.API_URL}/NSChangeOrderCmd`
    responseResult = {
      msg: {
        root: {
          vdn_cd: '6950',
          pagelmt: '',
          tasknm: 'RETURN',
          subTasknm: 'form',
          orders: [
            {
              validPayYn: 'N',
              totalpayment: '30300',
              cancelProcType: 'PST',
              timeplaced: '2020-07-13',
              payms: [
                {
                  paymenttype: 'CASH',
                  payAmt: '30300',
                  paySchdAdjustAmt: '30300',
                  payTypeCnt: '1',
                  availAdjustAmt: '30300',
                  displayorder: ' 00080',
                  paymentname: '무통장 입금',
                  payDttm: '2020.07.13 16:22',
                  payClssfNm: '승인',
                  paySchdAmt: '30300',
                  paySeq: '1',
                  availAmt: '30300',
                  paymdtls: [
                    {
                      payAmt: '30300',
                      dpstAcctNum: '35649014266554',
                      dpstLimitTm: null,
                      dpstBankNm: '국민(가상)',
                      dpstBankCd: 'VAK',
                      rmitr: '홍길동',
                      cashRcptApprNum: '',
                      finalRvisDttm: '2020.07.13 16:22:45',
                      apprSeq: '1',
                      dpstSchdAmt: '30300',
                      apprNo: '',
                      finalRvisDt: '2020-07-13 16:22:45',
                      relNm: '국민(가상)',
                      payDt: '2020-07-13 16:22:45',
                      availAmt: '30300',
                      relNo: '010-****-1236'
                    }
                  ],
                  ordersId: '300011236084',
                  totalPayment: '30300',
                  cancelDttm: null,
                  priority: '8',
                  stdAmt: '30300',
                  pstAdjustAmt: '0',
                  payTypeSum: '30300',
                  paymentpath: 'EXTERNAL',
                  receiptYn: 'Y',
                  displaytext: '무통장/실시간 계좌이체 사용',
                  paymentcode: '200',
                  canceltype: 'PARTIAL',
                  payClssfCd: '100',
                  pstAmt: '0',
                  payTypeSeq: '1'
                }
              ],
              currency: 'KRW',
              rtnExcgNotAvailYn: 'Y',
              memberId: '100286013',
              totaltaxshipping: '0',
              lockedOrderYn: 'N',
              latestOperationId: null,
              cats: [
                {
                  statusIndex: '6',
                  totalproductTax: '2727',
                  unitCd: '10020565405',
                  catentryName: '불고기브라더스 구이&amp;불고기A세트( 안창살칼집구이2팩+서울식불고기2팩)',
                  selfAddress: {
                    lotnZipcode1: '157010',
                    lotnZipcode2: null,
                    phone1: '010-1234-1234',
                    phone2: '010-1234-1234',
                    roadZipcode: '157010',
                    phone11: '010',
                    zipcode: '157010',
                    phone12: '1234',
                    phone13: '1234',
                    lotnZipcode: '157010',
                    memberId: '100286013',
                    addrbookId: '21181631',
                    teltype01: null,
                    teltype02: null,
                    businesstitle: null,
                    lotnAddress1: '서울 강서구 우장산동',
                    lotnAddress2: '77-29번지 301호',
                    ziptype: '200',
                    lastname: '홍길동',
                    roadZipcode1: '157010',
                    zipcode1: '157010',
                    roadZipcode2: null,
                    zipcode2: null,
                    dispAddressPlus: '[157010] 서울 강서구 화곡로43가길 75 (화곡동) 301호',
                    phone21: '010',
                    nickname: '테스트',
                    phone22: '1234',
                    addressId: '20639661003',
                    phone23: '1234',
                    roadAddress1: '서울 강서구 화곡로43가길 75',
                    address1: '서울 강서구 화곡로43가길 75',
                    roadAddress2: '(화곡동) 301호',
                    address2: '(화곡동) 301호'
                  },
                  relaxGb: 'N',
                  quantity: '1',
                  btnctrls: [
                    {
                      btns: 'DELIVERY_STATUS',
                      btnnm: '배송조회'
                    },
                    {
                      btns: 'PRODUCT_COMMENT_WRITE',
                      btnnm: '상품평 쓰기'
                    }
                  ],
                  orgQuantity: '1',
                  orderitemsBillTax: '2727',
                  imageUrl: '//product-image.dev-nsmall.com/itemimg/6/14/166/14740166_C.jpg',
                  convinGb: 'N',
                  catentryId: '10020565405',
                  availQuantity: '870',
                  displayType: 'NORMAL',
                  statusName: '배송완료',
                  addressChangeable: 'N',
                  phoneReqDate: null,
                  orgship: {
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
                    ordersId: '300011236084',
                    lastname: '홍길동',
                    sendType: null,
                    roadZipcode1: '157010',
                    zipcode1: '157010',
                    roadZipcode2: null,
                    zipcode2: null,
                    contactnum: '010-1234-1234',
                    dispAddressPlus: '[157010] 서울 강서구 화곡로43가길 75 (화곡동) 301호',
                    receiverEmail: 'test@nsmall.com',
                    orderitemsId: '180441086',
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
                  barOpt: null,
                  attrs: [
                    {
                      ordersId: '300011236084',
                      attrvalDesc: '공통',
                      sequence: '1',
                      attrDesc: 'COLOR 단품속성',
                      attrvalId: '3159',
                      attrId: '101',
                      orderitemsId: '180441086'
                    },
                    {
                      ordersId: '300011236084',
                      attrvalDesc: '공통',
                      sequence: '2',
                      attrDesc: 'STYLE 단품속성',
                      attrvalId: '1002451',
                      attrId: '501',
                      orderitemsId: '180441086'
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
                  modQuantity: '1',
                  addressId: '20639661003',
                  stdOrderitemsId: '180441086',
                  orderSeq: '1',
                  totaladjustment: '0',
                  slctDay: null,
                  brandName: null,
                  exceptionMsg: null,
                  ordercatsKey: '300011236084_20639661003_10020565405_S',
                  addressSum: '30000',
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
                    ordersId: '300011236084',
                    lastname: '홍길동',
                    sendType: null,
                    roadZipcode1: '157010',
                    zipcode1: '157010',
                    roadZipcode2: null,
                    zipcode2: null,
                    contactnum: '010-1234-1234',
                    dispAddressPlus: '[157010] 서울 강서구 화곡로43가길 75 (화곡동) 301호',
                    receiverEmail: 'test@nsmall.com',
                    orderitemsId: '180441086',
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
                  orgattrs: [
                    {
                      ordersId: '300011236084',
                      attrvalDesc: '공통',
                      sequence: '1',
                      attrDesc: 'COLOR 단품속성',
                      attrvalId: '3159',
                      attrId: '101',
                      orderitemsId: '180441086'
                    },
                    {
                      ordersId: '300011236084',
                      attrvalDesc: '공통',
                      sequence: '2',
                      attrDesc: 'STYLE 단품속성',
                      attrvalId: '1002451',
                      attrId: '501',
                      orderitemsId: '180441086'
                    }
                  ],
                  subProducts: [],
                  stepOpt: 'ir_b_cnts order_step',
                  price: '30000',
                  addressSeq: '1',
                  flashSaleYn: null,
                  existAnotherOpts: 'N',
                  catentryIdOrg: '10020565405',
                  exchangeQuantity: '0',
                  availQuantitySchdDate: '20200805',
                  memberId: '100286013',
                  addressCnt: '2',
                  goodsCd: '14740166',
                  orderitemsBill: '30000',
                  returnQuantity: '0',
                  ordersId: '300011236084',
                  msgCardWriteYn: 'N',
                  dlvrWayCd1: '10',
                  shipcharge: '0',
                  status: 'S',
                  intrv: null,
                  availQuantityType: '10',
                  commentWriteYn: 'Y',
                  rmashipcharge: '0',
                  createdatetime: '2020.07.13 16:21:19',
                  multiCd: null,
                  dispTypeCd: '15'
                },
                {
                  statusIndex: '2',
                  totalproductTax: '0',
                  unitCd: '10118795797',
                  catentryName: '해피딜상품1',
                  relaxGb: 'N',
                  quantity: '0',
                  btnctrls: [],
                  orgQuantity: '1',
                  orderitemsBillTax: '0',
                  imageUrl: '//product-image.dev-nsmall.com/itemimg/0/42/780/42827780_C.jpg',
                  convinGb: 'N',
                  catentryId: '10118795797',
                  availQuantity: '13',
                  displayType: 'NORMAL',
                  statusName: '반품진행',
                  addressChangeable: 'N',
                  phoneReqDate: null,
                  orgship: {
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
                    ordersId: '300011236084',
                    lastname: '홍길동',
                    sendType: null,
                    roadZipcode1: '157010',
                    zipcode1: '157010',
                    roadZipcode2: null,
                    zipcode2: null,
                    contactnum: '010-1234-1234',
                    dispAddressPlus: '[157010] 서울 강서구 화곡로43가길 75 (화곡동) 301호',
                    receiverEmail: 'test@nsmall.com',
                    orderitemsId: '180441087',
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
                  barOpt: null,
                  attrs: [
                    {
                      ordersId: '300011236084',
                      attrvalDesc: 'CASE2_젖병',
                      sequence: '30',
                      attrDesc: '옵션',
                      attrvalId: '30',
                      attrId: '1',
                      orderitemsId: '180441087'
                    }
                  ],
                  buschnId: 'MOBIL',
                  cancelQuantity: '0',
                  prsntPackYn: 'N',
                  steps: [
                    {
                      step: '반품신청'
                    },
                    {
                      step: '반품진행'
                    },
                    {
                      step: '반품완료'
                    }
                  ],
                  cnveyNum: null,
                  createdate: '2020.07.13',
                  totalproduct: '300',
                  phoneReqClssfNm: null,
                  modQuantity: '0',
                  addressId: '20639661003',
                  stdOrderitemsId: '180441087',
                  orderSeq: '2',
                  totaladjustment: '0',
                  slctDay: null,
                  brandName: null,
                  exceptionMsg: '수거진행',
                  ordercatsKey: '300011236084_20639661003_10118795797_U',
                  addressSum: '30000',
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
                    ordersId: '300011236084',
                    lastname: '홍길동',
                    sendType: null,
                    roadZipcode1: '157010',
                    zipcode1: '157010',
                    roadZipcode2: null,
                    zipcode2: null,
                    contactnum: '010-1234-1234',
                    dispAddressPlus: '[157010] 서울 강서구 화곡로43가길 75 (화곡동) 301호',
                    receiverEmail: 'test@nsmall.com',
                    orderitemsId: '180441087',
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
                  orgattrs: [
                    {
                      ordersId: '300011236084',
                      attrvalDesc: 'CASE2_젖병',
                      sequence: '30',
                      attrDesc: '옵션',
                      attrvalId: '30',
                      attrId: '1',
                      orderitemsId: '180441087'
                    }
                  ],
                  subProducts: [],
                  stepOpt: 'ir_b_cnts order_step returnOk',
                  price: '300',
                  addressSeq: '2',
                  flashSaleYn: null,
                  existAnotherOpts: 'Y',
                  catentryIdOrg: '10118795797',
                  exchangeQuantity: '0',
                  availQuantitySchdDate: '20200805',
                  memberId: '100286013',
                  addressCnt: '2',
                  goodsCd: '42827780',
                  orderitemsBill: '0',
                  returnQuantity: '0',
                  ordersId: '300011236084',
                  msgCardWriteYn: 'N',
                  dlvrWayCd1: '10',
                  shipcharge: '0',
                  status: 'U',
                  intrv: null,
                  availQuantityType: '10',
                  commentWriteYn: 'Y',
                  rmashipcharge: '0',
                  createdatetime: '2020.07.13 16:21:19',
                  multiCd: null,
                  pickup: {},
                  dispTypeCd: '15'
                }
              ],
              cashreceiptAmount: '30300',
              ordersId: '300011236084',
              lastupdateall: '20200713162119',
              media: '모바일',
              ourCoPayYn: 'Y',
              storeentId: '13001',
              totaltax: '2781',
              shipascomplete: 'Y',
              totalproduct: '30000',
              hasCantTraceCardYn: 'N',
              catType: '1',
              totaladjustment: '0',
              orderitems: [
                {
                  ordersId: '300011236084',
                  modDlvrDcAmt: '0',
                  buschnId: 'MOBIL',
                  dlvrDcAmt: '0',
                  cancelQuantity: '0',
                  price: '30000',
                  totalproduct: '30000',
                  quantity: '1',
                  catentryIdOrg: '10020565405',
                  orderitemsId: '180441086',
                  modQuantity: '1',
                  exchangeQuantity: '0',
                  addressId: '20639661003',
                  shipcharge: '0',
                  totaladjustment: '0',
                  orderSeq: '1',
                  ordercatsKey: '300011236084_20639661003_10020565405_S',
                  memberId: '100286013',
                  addressIdOrg: '20639661003',
                  rmashipcharge: '0',
                  catentryId: '10020565405',
                  stdAmount: '30000',
                  returnQuantity: '0'
                },
                {
                  ordersId: '300011236084',
                  modDlvrDcAmt: '0',
                  buschnId: 'MOBIL',
                  dlvrDcAmt: '0',
                  cancelQuantity: '0',
                  price: '300',
                  totalproduct: '300',
                  quantity: '0',
                  catentryIdOrg: '10118795797',
                  orderitemsId: '180441087',
                  modQuantity: '0',
                  exchangeQuantity: '0',
                  addressId: '20639661003',
                  shipcharge: '0',
                  totaladjustment: '0',
                  orderSeq: '2',
                  ordercatsKey: '300011236084_20639661003_10118795797_U',
                  memberId: '100286013',
                  addressIdOrg: '20639661003',
                  rmashipcharge: '0',
                  catentryId: '10118795797',
                  stdAmount: '0',
                  returnQuantity: '0'
                }
              ],
              preCancelYn: 'N',
              status: '-',
              totalshipping: '3000',
              totalstdamount: '30000',
              cpBnftVal: '0',
              totalavailpayment: '30300',
              pstRefundAvailYn: 'Y',
              orderLastPaySeq: '1',
              taxbillreceiptAmount: '30300'
            }
          ],
          userId: '100286013',
          rowpage: '',
          tidx: '',
          langId: '-9',
          accptPath: '500',
          vwtyp: '',
          ordsid: '300011236084',
          pageidx: '',
          counselorOrderCancel: 'refunddetail',
          midx: '',
          odt1: '',
          tmtyp: '',
          status: '',
          req_co_cd: '110',
          odt2: '',
          viewTaskName: 'NSChangeOrderForm',
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
          onTouchPaymentYn: '',
          storeId: '13001'
        }
      }
    }

    mock
      .onPost(apiUrl)
      .reply(200, responseResult)

    await flushPromises()
  })

  it('데이터 가져오기 및 세팅', () => {
    assert.equal(wrapper.vm.orderId, '300011236083')
    assert.equal(wrapper.vm.orders.status, responseResult.msg.root.orders[0].status)
    assert.equal(wrapper.vm.orderDate, responseResult.msg.root.orders[0].timeplaced.replace(/-/gi, '.'))
  })

  it('주문상세', () => {
    wrapper.vm.onclickOrderDetailLink('300011236083')
  })
})
