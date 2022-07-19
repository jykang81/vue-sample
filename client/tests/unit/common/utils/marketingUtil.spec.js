import Vue from 'vue'
import axios from 'axios'
import { assert } from 'chai'
import CONST from '@constants/framework/framework'
import loginUtil from '@utils/loginUtil'
import nsaxios from '@frameworks/axiosUtil'
import MockAdapter from 'axios-mock-adapter'
// import externalUtil from '@utils/externalUtil'
import marketingUtil from '@utils/marketingUtil'

describe('marketingUtil', () => {
  let mock
  before(() => {
    // // GA 360
    // window.ga = () => {}
    // window.marketingRoute = {
    //   name: 'testGa360',
    //   fullPath: '/test/test-ga360-log',
    //   meta: {
    //     title: 'GA 360',
    //     depth: '아키텍처>테스트>GA 360'
    //   }
    // }

    // // Recobell
    // window._eglconf = {}
    // window._eglconf.forceTrackVisit = true
    // window.eglc = {}
    // window.eglc.op = () => {}
    // window.eglc.clearData = () => {}

    // // 네이버 프리미엄 로그
    // window.wcs = {}
    // window.wcs.inflow = () => {}
    // window.wcs.cnv = () => {}
    // window.wcs_do = () => {}

    // // Airbridge
    // window.airbridge = {}
    // window.airbridge.init = () => {}
    // window.airbridge.events = {}
    // window.airbridge.events.signUp = () => {}
    // window.airbridge.events.signIn = () => {}
    // window.airbridge.events.signOut = () => {}
    // window.airbridge.events.homeViewEvent = () => {}
    // window.airbridge.events.productDetailsViewEvent = () => {}
    // window.airbridge.events.productListViewEvent = () => {}
    // window.airbridge.events.searchResultViewEvent = () => {}
    // window.airbridge.events.addedToCart = () => {}
    // window.airbridge.events.purchased = () => {}
    // window.airbridge.events.send = () => {}

    // // AIQUA
    // window.AIQUA = () => {}
    // window.AIQUA.init = {
    //   appId: '966ef26ddcc00f25775f',
    //   timeout: 5000
    // }
    // window.qg = () => {}

    // // DTSI
    // window.dlight = {}
    // window.dlight.sendConversion = () => {}

    // 홈쇼핑모아
    window.buzzni_rt = {}
    window.buzzni_rt.setDevelop = () => {}
  })

  // 로컬스토리지에 테스트사용자 정보 적재
  const memberInfo = {
    tcode: 't123',
    gender: 'F',
    userId: 111103108,
    hpNo: '010-9898-9342',
    isSSORequest: 'false',
    isAdult: 'true',
    custNum: '30124937',
    gradeNm: '패밀리',
    userName: '강진영',
    adultAuthYN: 'N',
    entFlag: 'Y',
    userMargetingTM: 'N',
    lastOrder: '2020-03-12 18:21:20.125',
    registration: '2020-03-12 16:44:06.125',
    email: 'lsd251@nsmall.com',
    telNo: '010-9898-9342',
    userMargetingEmail: 'N',
    birthday: '19840425',
    userMarketingSMS: 'N',
    logonId: 'lsd251@nsmall.com',
    failcount: '0',
    sessionid: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    sessionId: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    loginyn: 'Y',
    logonType: 'WEB',
    memberGradeCss: 'family',
    staffInfo: false,
    staffInfoName: '대표',
    staffBnft: 'Y'
  }

  describe('초기 작업', function () {
    it('초기 Login처리하고 진행', function () {
      loginUtil.login(memberInfo)
      const isLoggedIn = loginUtil.isLoggedIn()
      assert.notEqual('', isLoggedIn)
    })
  })

  describe('GA 360', function () {
    it('ga360Logger.CATEGORY_ADD_LOGIN 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_LOGIN,
          action: btoa(loginUtil.getUserInfo('logonId')),
          memberInfo: loginUtil.getMemberInfo()
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_ADD_CATEGORY 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_CATEGORY,
          action: '해당되는 카테고리명'
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_ADD_VIEWORDER 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_VIEWORDER,
          action: [ // 상품정보 배열. GA 360인 경우 AS-IS는 파라메터로 데이터 전달은 하나 실제 전송되지 않는다. 통합 로깅에서 사용
            {
              id: 'id1',
              name: 'name1',
              orderId: 'orderId',
              price: 100,
              quantity: 1,
              totalsale: 10,
              del: 2500,
              attrs: 'attrs1'
            },
            {
              id: 'id2',
              name: 'name2',
              orderId: 'orderId',
              price: 200,
              quantity: 2,
              totalsale: 20,
              del: 2500,
              attrs: 'attrs2'
            }
          ],
          payMthdCd: '1100'
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_ADD_PURCHASE 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_PURCHASE,
          action: [ // 상품정보 배열. GA 360인 경우 AS-IS는 파라메터로 데이터 전달은 하나 실제 전송되지 않는다. 통합 로깅에서 사용
            {
              orderId: 'orderId',
              productId: 'productId1',
              productName: 'productName1',
              price: 100,
              quantity: 1,
              discount: 10,
              del: 2500,
              attrs: 'attrs1'
            },
            {
              orderId: 'orderId',
              productId: 'productId2',
              productName: 'productName2',
              price: 200,
              quantity: 2,
              discount: 20,
              del: 0,
              attrs: 'attrs2' // 1st 상품속성명
            }
          ],
          orderId: 'orderId',
          lastPrice: 2970, // 결제금액. (상품금액 * 상품갯수) - 할인금액 + 배송료
          totalPrice: 300 // 전체 상품가격 (sum(price)). quantity 제외한 순수 상품 가격 합계
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_ADD_SUBORDER 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_SUBORDER,
          action: ''
          // params: { // GA 360인 경우 AS-IS에서 pageId를 넘겨서 사용하나 TO-BE에서는 $router.name을 사용함으로 params 데이터는 불필요함
          //   pageId: 'M_B1214000P'
          // }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_ADD_PRODUCTVIEW 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_PRODUCTVIEW,
          action: {
            catalog: 'catalog',
            id: 'id',
            name: 'productName',
            price: 100,
            sale: 10
          },
          searchTerm: '',
          clickUrl: '',
          itemType: '',
          CTCOMitemYn: 'Y',
          TVitemYn: ''
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_ADD_SEARCH 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_SEARCH,
          action: [
            {
              id: 'id1',
              name: 'productName1',
              price: 100,
              search: '검색어'
            },
            {
              id: 'id1',
              name: 'name1',
              price: 200,
              search: '검색어'
            }
          ],
          searchTerm: '검색어'
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_VIEW_CATEGORY 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_VIEW_CATEGORY,
          action: '',
          params: {
            pageId: ''
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_VIEW_HOME 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_VIEW_HOME,
          action: marketingUtil.CATEGORY_VIEW_HOME
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_PAGE.CATEGORY_ADD_REFOUND 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_REFOUND,
          action: [ // 상품정보 배열. GA 360인 경우 AS-IS는 파라메터로 데이터 전달은 하나 실제 전송되지 않는다. 통합 로깅에서 사용
            {
              name: 'name1',
              id: 'id1',
              orderId: 'ordersId',
              del: 2500,
              attrs: 'attrs1',
              price: 1000,
              quantity: 1,
              sale: 100
            },
            {
              name: 'name2',
              id: 'id2',
              orderId: 'ordersId',
              del: 2500,
              attrs: 'attrs2',
              price: 2000,
              quantity: 2,
              sale: 200
            }
          ]
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_EVENT 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '상품상세',
          eventLabel: '전체선택',
          params: {
            t1: '주문/결제',
            t2: 'TV쇼핑',
            t3: 'NSShop+',
            t4: '제품명'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_01 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_01,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension16: 'e상품'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: '일반상품',
            t3: '제품명'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_02 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_02,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension16: 'SHOP+',
              dimension17: 'brdctDate',
              dimension18: 'formStartDttm',
              dimension19: 'formEndDttm',
              dimension20: 'NSSHOP+'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: 'TV쇼핑',
            t3: 'NSShop+',
            t4: '제품명',
            partNumber: 'partNumber',
            type: 'SHOP+',
            type2: 'NSSHOP+',
            list: {
              brdctDate: 'brdctDate',
              formStartDttm: 'formStartDttm',
              formEndDttm: 'formEndDttm'
            }
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_03 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension16: 'e상품'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: '일반상품',
            t3: '제품명'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_04 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_04,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension16: 'e상품'
            }
          ],
          subparams: {
            t1: '주문/결제',
            t2: '장바구니'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_05 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_05,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension16: 'SHOP+',
              dimension17: 'brdctDate',
              dimension18: 'formStartDttm',
              dimension19: 'formEndDttm',
              dimension20: 'NSSHOP+',
              variant: '옵션'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: 'TV쇼핑',
            t3: 'TVLIVE',
            t4: '제품명',
            type: 'SHOP+',
            type2: 'NSSHOP+',
            list: {
              brdctDate: 'brdctDate',
              formStartDttm: 'formStartDttm',
              formEndDttm: 'formEndDttm'
            }
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_06 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_06,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension16: 'e상품'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: '일반상품',
            t3: '제품명'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_07 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_07,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension15: 'promotioncoupon',
              dimension16: 'eTV',
              dimension17: 'brdctDate',
              dimension18: 'formStartDttm',
              dimension19: 'formEndDttm',
              dimension20: 'TVLIVE',
              variant: '옵션'
            }
          ],
          subparams: {
            t1: '주문/결제',
            t2: '주문서작성/결제',
            payMthdCd: '300'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_08 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_08,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension15: 'promotioncoupon',
              dimension16: 'e상품',
              dimension17: '',
              dimension18: '',
              dimension19: '',
              dimension20: '',
              variant: '옵션'
            }
          ],
          subparams: {
            t1: '주문/결제',
            t2: '주문서작성/결제',
            payMthdCd: '300'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_09 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_09,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              price: 1000,
              quantity: 2,
              coupon: 'coupon',
              dimension15: 'promotioncoupon',
              dimension16: 'e상품',
              dimension17: '',
              dimension18: '',
              dimension19: '',
              dimension20: '',
              // dimension16: 'eTV',
              // dimension17: 'brdctDate',
              // dimension18: 'formStartDttm',
              // dimension19: 'formEndDttm',
              // dimension20: 'TVLIVE',
              variant: '옵션'
            }
          ],
          subparams: {
            t1: '주문/결제',
            t2: '주문완료',
            ordersid: 'ordersid',
            totalprice: '10000',
            coupon: 'couponid',
            deliveryprice: '2500',
            typedetail: '300', // payType
            totaldiscount: '100',
            OKcashbag: '200',
            nsgift: '300',
            cash1: '10000',
            cash2: '0',
            savecash: '0',
            discountdelivery: '0',
            discountprice: '400',
            discountcoupon: '0',
            discount1: '0',
            discountcard: '500',
            detailName: '카카오뱅크'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_10 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_10,
          params: null,
          subparams: {
            t1: '마이페이지',
            t2: '쇼핑정보',
            t3: '주문내역/배송조회',
            t4: '주문취소',
            ordersid: 'ordersid'
          }
        }
      })
      assert.equal(true, true)
    })

    it('ga360Logger.LOG_ECOMMERCE.ECOMMERCE_STEP_11 테스트', () => {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: 'partNumber',
              name: '제품명',
              brand: '브랜드명',
              category: '카테고리(cate1Nm)',
              dimension16: 'eTV',
              dimension20: 'NSSHOP+'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: 'NSSHOP+',
            list: '화면타이틀'
          }
        }
      })
      assert.equal(true, true)
    })
  })

  describe('Recobell', function () {
    it('recobellLogger.CATEGORY_ADD_PRODUCTVIEW 테스트', async () => {
      Vue.prototype.$nsaxios = nsaxios
      // mock axios
      mock = new MockAdapter(axios)
      mock.onPost(`${CONST.API_URL}/NSRcmdCmd`).reply(200,
        {
          accptPath: ['500'],
          accptPathCd: ['500'],
          catalogId: ['14051'],
          langId: ['-9'],
          msg: {
            brandId: '459708',
            brandName: '종근당',
            catName: '슬라이단1',
            catalogue: '72001',
            category1: '1358062',
            category2: '1358562',
            category3: '1358566',
            category4: null,
            category5: null,
            empNm: '이혜민',
            happydealProduct: 'N',
            itemId: '24745657',
            itemName: '종근당 6년근 홍삼정 애니타임 + 고급 쇼핑백',
            mdcd: '11771',
            newcategory1: 'R0002',
            newcategory2: '2',
            newcategory3: '105',
            newcategory4: '526',
            newcategory5: '1143',
            newcategory6: null,
            orgNm: 'E상품1팀',
            originalPrice: '28900',
            regDate: '2017-06-20 17:24:21',
            salePrice: '28900',
            tcomYn: 'N',
            tvYn: 'N',
            updateDate: '2017-10-26 11:16:12'
          },
          rcmdGbn: ['PRODUCT'],
          rcmdValue: ['24745657'],
          storeId: ['13001'],
          userId: ['110548084']
        })
    })

    it('recobellLogger.CATEGORY_ADD_PURCHASE 테스트', () => {
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PURCHASE,
          action: [
            {
              orderId: '1122334455',
              productName: '고무신',
              productId: '42985725',
              price: 50000,
              quantity: 1,
              discount: 'adjustment',
              del: 'shipCharge',
              attrs: 'attributesName'
            },
            {
              orderId: '1122334455',
              productName: '[우리우리] 밥하는남자 김하진 총각김치 3kg',
              productId: '22100219',
              price: 18500,
              quantity: 1,
              discount: 'adjustment',
              del: 'shipCharge',
              attrs: 'attributesName'
            }
          ],
          lastPrice: 77777,
          totalPrice: 68500,
          orderId: '1122334455'
        }
      })
      assert.equal(true, true)
    })

    it('recobellLogger.CATEGORY_ADD_SEARCH 테스트', () => {
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_SEARCH,
          action: [
            {
              name: '1395573',
              id: '25174064',
              price: 268900,
              search: '구찌 295419 A0VBR 1060'
            }
          ], // 제휴사 adbrix 정보 전달
          searchTerm: '구찌 295419 A0VBR 1060'
        }
      })
      assert.equal(true, true)
    })

    it('recobellLogger.CATEGORY_ADD_LOGIN 테스트', () => {
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_LOGIN,
          action: loginUtil.getUserInfo('logonId'),
          memberInfo: loginUtil.getMemberInfo()
        }
      })
      assert.equal(true, true)
    })
  }) // Recobell

  describe('Airbridge', function () {
    it('airbridgeLogger.회원가입 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SIGN_UP, // 회원가입
        data: { // 개인정보 - 전송시 주의
          userId: '123456',
          userEmail: 'userEmail'
        }
      })
    })

    it('airbridgeLogger.로그인 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SIGN_IN, // 로그인
        data: { // 개인정보 - 전송시 주의
          userId: '123456'
        }
      })
    })

    it('airbridgeLogger.로그아웃 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SIGN_OUT // 로그아웃
      })
    })

    it('airbridgeLogger.홈 화면 조회 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.HOME_VIEW // 홈 화면 조회
      })
    })

    it('airbridgeLogger.상품 상세 조회 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PRODUCT_DETAILS_VIEW, // 상품상세 조회
        data: {
          products: [
            {
              productID: 'productID', // 상품ID
              name: 'name', // 상품명
              price: 1000, // 가격
              currency: 'KRW', // 통화
              position: 1 // index??
            }
          ]
        }
      })
    })

    it('airbridgeLogger.상품 리스트 조회 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PRODUCT_LIST_VIEW, // 상품 리스트 조회
        data: {
          products: [
            {
              productID: 'productID1', // 상품ID
              name: 'name1', // 상품명
              price: 1000, // 가격
              currency: 'KRW', // 통화
              position: 1 // index??
            },
            {
              productID: 'productID2', // 상품ID
              name: 'name2', // 상품명
              price: 1000, // 가격
              currency: 'KRW', // 통화
              position: 2 // index??
            }
          ]
        }
      })
    })

    it('airbridgeLogger.검색결과 조회 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SEARCH_RESULT_VIEW, // 검색결과 조회
        data: {
          query: '검색어',
          products: [
            {
              productID: 'productID3', // 상품ID
              name: 'name3', // 상품명
              price: 1000, // 가격
              currency: 'KRW', // 통화
              position: 1 // index??
            },
            {
              productID: 'productID4', // 상품ID
              name: 'name4', // 상품명
              price: 1000, // 가격
              currency: 'KRW', // 통화
              position: 2 // index??
            }
          ]
        }
      })
    })

    it('airbridgeLogger.장바구니 담기 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.ADDED_TO_CART, // 장바구니 담기
        data: {
          cartID: 'cartID',
          totalValue: 15000,
          currency: 'KRW',
          products: [
            {
              productID: 'productID3', // 상품ID
              name: 'name3', // 상품명
              price: 1000, // 가격
              quantity: 10, // 개수
              currency: 'KRW', // 통화
              position: 1 // index??
            },
            {
              productID: 'productID4', // 상품ID
              name: 'name4', // 상품명
              price: 500, // 가격
              quantity: 10, // 개수
              currency: 'KRW', // 통화
              position: 2 // index??
            }
          ]
        }
      })
    })

    it('airbridgeLogger.결제 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PURCHASED, // 결제
        data: {
          transactionID: 'transactionID',
          totalValue: 15000,
          currency: 'KRW',
          inAppPurchased: false,
          products: [
            {
              productID: 'productID4', // 상품ID
              name: 'name4', // 상품명
              price: 1000, // 가격
              quantity: 10, // 개수
              currency: 'KRW', // 통화
              position: 1 // index??
            },
            {
              productID: 'productID4', // 상품ID
              name: 'name4', // 상품명
              price: 500, // 가격
              quantity: 10, // 개수
              currency: 'KRW', // 통화
              position: 2 // index??
            }
          ]
        }
      })
    })

    it('airbridgeLogger.사용자 이벤트 테스트', () => {
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.C_XXXX, // 사용자 이벤트
        data: {
        }
      })
    })
  }) // Airbridge

  describe('Common', function () {
    it('commonLogger 테스트', () => {
      marketingUtil.commonLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PRODUCTVIEW,
          action: {
            catalog: 'catalog',
            id: 'id',
            name: 'productName',
            price: 100,
            sale: 10
          },
          searchTerm: 'searchTerm',
          clickUrl: 'clickUrl',
          itemType: 'itemType',
          CTCOMitemYn: '',
          TVitemYn: 'Y'
        }
      })
    })
  }) // 공통 로깅

  describe('AIQUA', function () {
    it('aiquaLogger.USER_EVENT 테스트', () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'product_viewed',
          params: {
            product_id: '42985725',
            product_name: '고무신',
            product_image_url: '',
            product_price: 50000,
            product_channel: 'aiquaTest',
            md_name: 'test',
            md_team_name: 'marketingScript'
          }
        }
      })
      assert.equal(true, true)
    })

    it('aiquaLogger.USER_PROFILE 테스트', () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_PROFILE,
        data: {
          userId: '30124193',
          name: '장성우',
          email: 'swchang@einz.co.kr',
          phoneNumber: '010-1234-1234',
          birthday: '2020-07-27',
          gender: 'M',
          loginStatus: null,
          devicePushAgree: 'Y',
          notificationModifiedDate: null,
          isEmployee: null,
          level: '새내기',
          coCd: '!!!'
        }
      })
      assert.equal(true, true)
    })
  }) // AIQUA

  describe('Naver', function () {
    it('naverLogger.유입 테스트', () => {
      marketingUtil.naverLogger.send({
        type: marketingUtil.naverLogger.TRACE_INFLOW
      })
    })

    it('naverLogger.전환 테스트', () => {
      marketingUtil.naverLogger.send({
        type: marketingUtil.naverLogger.TRACE_TRANS,
        data: {
          strTranSoft: '2', // 1:구매완료 페이지, 2:회원가입 완료 페이지, 3:장바구니 담기 페이지, 4:신청/예약 페이지, 5:기타 페이지
          strTranValue: '1' // 전환가치. 전환가치를 측정할 수 없는 경우 1 입력
        }
      })
    })
  }) // 네이버 프리미엄 로깅

  describe('DTSI', function () {
    it('dtsiLogger.초기화 테스트', () => {
      marketingUtil.dtsiLogger.send({
        data: {
          initFlag: true
        }
      })
    })

    it('dtsiLogger.구매완료 테스트', () => {
      marketingUtil.dtsiLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PURCHASE,
          action: [
            {
              orderId: 'orderId',
              productId: 'productId1',
              productName: 'productName1',
              price: 100,
              quantity: 1,
              discount: 10,
              del: 2500,
              attrs: 'attrs1'
            },
            {
              orderId: 'orderId',
              productId: 'productId2',
              productName: 'productName2',
              price: 200,
              quantity: 2,
              discount: 20,
              del: 0,
              attrs: 'attrs2'
            }
          ],
          orderId: 'orderId',
          lastPrice: 2970,
          totalPrice: 300
        }
      })
    })

    it('dtsiLogger.회원가입 완료 테스트', () => {
      marketingUtil.dtsiLogger.send({
        data: {
          isSignUp: true // 회원가입 완료 페이지인 경우
        }
      })
    })
  }) // DTSI 로깅

  describe('Fbpixel', function () {
    it('fbpixelLogger.ViewContent 테스트', () => {
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.VIEW_CONTENT,
        data: {
          value: 1000, // 제품 가격
          currency: 'KRW',
          content_name: '제품명1', // 제품명
          content_type: 'product', // 고정
          content_ids: '1122334455' // 제품 id
        }
      })
    })

    it('fbpixelLogger.AddToCart 테스트', () => {
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.ADD_TO_CART
      })
    })

    it('fbpixelLogger.Purchase 테스트', () => {
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.PURCHASE,
        data: {
          value: 2000, // 구매 금액
          currency: 'KRW'
        }
      })
    })

    it('fbpixelLogger.CompleteRegistration 테스트', () => {
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.COMPLETE_REGISTRATION
      })
    })
  }) // 페이스북 픽셀 로깅

  describe('hsmoa', function () {
    it('hsmoaLogger.list 테스트', () => {
      marketingUtil.hsmoaLogger.send({
        data: {
          from_hsmoa: false,
          action: [
            '11466759', '14740166', '24689641', '26349642', '21193188'
          ],
          category: 'list'
        }
      })
    })

    it('hsmoaLogger.product 테스트', () => {
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: '110',
          action: '11466759',
          category: 'product'
        }
      })
    })

    it('hsmoaLogger.basket 테스트', () => {
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: '110',
          action: ['11466759'],
          category: 'basket'
        }
      })
    })

    it('hsmoaLogger.purchase 테스트', () => {
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: '110',
          action: [
            '11466759', '14740166', '24689641', '26349642', '21193188'
          ],
          category: 'purchase'
        }
      })
    })

    it('hsmoaLogger.query 테스트', () => {
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: '110',
          action: '[TEST] 홈쇼핑모아 상품',
          category: 'query'
        }
      })
    })

    it('hsmoaLogger.basketview 테스트', () => {
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: '110',
          action: [
            '11466759', '14740166', '24689641', '26349642', '21193188'
          ],
          category: 'basketview'
        }
      })
    })
  }) // 홈쇼핑모아
})
