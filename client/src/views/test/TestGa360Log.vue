<template>
  <div>
    <h1>GA 360</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend00"
    >
      페이지 뷰 로그 전송 - [category: ""]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend0"
    >
      로그인 로그 전송 - [category: "add_login"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend1"
    >
      페이지 뷰 로그 전송 - [category: "add_category"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend2"
    >
      페이지 뷰 로그 전송 - [category: "add_vieworder"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend3"
    >
      페이지 뷰 로그 전송 - [category: "add_purchase"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend4"
    >
      페이지 뷰 로그 전송 - [category: "add_suborder"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend5"
    >
      페이지 뷰 로그 전송 - [category: "add_productview"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend6"
    >
      페이지 뷰 로그 전송 - [category: "add_search"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend7"
    >
      페이지 뷰 로그 전송 - [category: "view_category"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend8"
    >
      페이지 뷰 로그 전송 - [category: "add_viewhome"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="ga360PageLogSend9"
    >
      페이지 뷰 로그 전송 - [category: "add_refound"]
    </button>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darkkhaki;"
      @click="ga360EventLogSend"
    >
      이벤트 로그 전송
    </button>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend1"
    >
      e-Commerce 로그 전송 - 1:상품상세(e-상품)
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend2"
    >
      e-Commerce 로그 전송 - 2:상품상세(SHOP+ || TV)
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend3"
    >
      e-Commerce 로그 전송 - 3:장바구니상품담기
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend4"
    >
      e-Commerce 로그 전송 - 4:장바구니상품삭제
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend5"
    >
      e-Commerce 로그 전송 - 5:주문요청(SHOP+ || TV)
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend6"
    >
      e-Commerce 로그 전송 - 6:주문요청(e-상품)
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend7"
    >
      e-Commerce 로그 전송 - 7:주문서작성/결제(SHOP+ || TV)
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend8"
    >
      e-Commerce 로그 전송 - 8:주문서작성/결제(e-상품)
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend9"
    >
      e-Commerce 로그 전송 - 9:주문완료
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend10"
    >
      e-Commerce 로그 전송 - 10:주문취소
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend11"
    >
      e-Commerce 로그 전송 - 11:상품리스트클릭
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="ga360ECommerceLogSend99"
    >
      파라메터 처리
      <!-- params=%7B"type"%3A"3","data"%3A%7B"step"%3A"9","params"%3A%5B%7B"id"%3A"partNumber","name"%3A"제품명","brand"%3A"브랜드명","category"%3A"카테고리%28cate1Nm%29","price"%3A1000,"quantity"%3A2,"coupon"%3A"coupon","dimension15"%3A"promotioncoupon","dimension16"%3A"e상품","dimension17"%3A"","dimension18"%3A"","dimension19"%3A"","dimension20"%3A"","variant"%3A"옵션"%7D%5D,"subparams"%3A%7B"t1"%3A"주문%2F결제","t2"%3A"주문완료","ordersid"%3A"ordersid","totalprice"%3A"10000","coupon"%3A"couponid","deliveryprice"%3A"2500","typedetail"%3A"300","totaldiscount"%3A"100","OKcashbag"%3A"200","nsgift"%3A"300","cash1"%3A"10000","cash2"%3A"0","savecash"%3A"0","discountdelivery"%3A"0","discountprice"%3A"400","discountcoupon"%3A"0","discount1"%3A"0","discountcard"%3A"500","detailName"%3A"카카오뱅크"%7D%7D%7D -->
    </button>
  </div>
</template>

<script>
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import loginUtil from '@utils/loginUtil'

export default {
  data () {
    return {
      params: { }
    }
  },
  methods: {
    ga360PageLogSend00: () => {
      console.log('ga360PageLogSend00')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true
        }
      })
    },
    ga360PageLogSend0: () => {
      console.log('ga360PageLogSend0')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_LOGIN,
          action: btoa(loginUtil.getUserInfo('logonId')),
          memberInfo: loginUtil.getMemberInfo()
        }
      })
    },
    ga360PageLogSend1: () => {
      console.log('ga360PageLogSend1')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_CATEGORY,
          action: '해당되는 카테고리명'
        }
      })
    },
    ga360PageLogSend2: () => {
      console.log('ga360PageLogSend2')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_VIEWORDER,
          action: [
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
    },
    ga360PageLogSend3: () => {
      console.log('ga360PageLogSend3')
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
    },
    ga360PageLogSend4: () => {
      console.log('ga360PageLogSend4')
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
    },
    ga360PageLogSend5: () => {
      console.log('ga360PageLogSend5')
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
    },
    ga360PageLogSend6: () => {
      console.log('ga360PageLogSend6')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_SEARCH,
          action: 'X/O', // 검색결과 존재: O, 없으면: X
          searchType: '직접입력',
          searchTerm: '김치'
        }
      })
    },
    ga360PageLogSend7: () => {
      console.log('ga360PageLogSend7')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_VIEW_CATEGORY,
          action: ''
        }
      })
    },
    ga360PageLogSend8: () => {
      console.log('ga360PageLogSend8')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_VIEW_HOME,
          action: marketingUtil.CATEGORY_VIEW_HOME
        }
      })
    },
    ga360PageLogSend9: () => {
      console.log('ga360PageLogSend9')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: marketingUtil.CATEGORY_ADD_REFOUND,
          action: [
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
    },
    ga360EventLogSend: () => {
      console.log('ga360EventLogSend')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '상품상세',
          eventLabel: '전체선택',
          params: {
            // t1: null
            t1: '테스트 t1',
            t2: '테스트 t2'
          }
        }
      })
    },
    ga360ECommerceLogSend1: () => {
      console.log('ga360ECommerceLogSend1')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_01,
          params: [
            {
              brand: '홍진경더김치',
              category: '해피딜/(리뉴얼)홈&amp;라이프',
              coupon: '',
              dimension15: null,
              dimension16: 'e상품',
              dimension17: null,
              dimension18: null,
              dimension19: null,
              dimension20: null,
              id: '23264011',
              name: '[홍진경더김치] 나박김치 4kg+깍두기 2kg',
              price: Number('38900'),
              quantity: Number('9808'),
              variant: '[홍진경더김치] 나박김치 4kg+깍두기 2kg(잔여:9808개)'
            },
            {
              brand: '비비고',
              category: '홈매장(리뉴얼2019)/위클리홈',
              coupon: '',
              dimension15: null,
              dimension16: 'eTV',
              dimension17: '20200922',
              dimension18: '16:00',
              dimension19: '17:00',
              dimension20: 'NS LIVE',
              id: '26030598',
              name: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
              price: Number('40900'),
              quantity: Number('999626'),
              variant: '비비고 왕교자만두세트(잔여:999626개)/(경품)vip쿠폰달력 1월 깜짝적립금 1만원(잔여:999999개)'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: '일반상품',
            t3: '[홍진경더김치] 나박김치 4kg+깍두기 2kg',
            product_list: '메인_상단배너'
          }
        }
      })
    },
    ga360ECommerceLogSend2: () => {
      console.log('ga360ECommerceLogSend2')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_02,
          params: [
            {
              brand: '비비고',
              category: '홈매장(리뉴얼2019)/위클리홈',
              coupon: '',
              dimension15: null,
              dimension16: 'eTV',
              dimension17: '20200922',
              dimension18: '16:00',
              dimension19: '17:00',
              dimension20: 'NS LIVE',
              id: '26030598',
              name: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
              price: Number('40900'),
              quantity: Number('999626'),
              variant: '비비고 왕교자만두세트(잔여:999626개)/(경품)vip쿠폰달력 1월 깜짝적립금 1만원(잔여:999999개)'
            }
          ],
          subparams: {
            partNumber: '26030598',
            t1: '상품상세',
            t2: 'TV쇼핑',
            t3: 'NS LIVE',
            t4: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
            type: 'eTV',
            type2: 'NS LIVE',
            list: {
              brdctDate: '20200922',
              formEndDttm: '17:00',
              formStartDttm: '16:00'
            },
            product_list: 'TV쇼핑_추천방송상품'
          }
        }
      })
    },
    ga360ECommerceLogSend3: () => {
      console.log('ga360ECommerceLogSend3')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       dimension16: 'e상품'
        //     }
        //   ],
        //   subparams: {
        //     t1: '상품상세',
        //     t2: '일반상품',
        //     t3: '제품명'
        //   }
        // }
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
        //   params: [
        //     {
        //       id: 'info.partNumber',
        //       name: 'info.productName',
        //       brand: 'info.brandName',
        //       category: 'categoryName',
        //       price: 6666,
        //       quantity: 66,
        //       variant: 'option',
        //       coupon: 'cpName',
        //       dimension15: null,
        //       dimension16: 'tvProduct',
        //       dimension17: 'liveTime',
        //       dimension18: 'liveStartTime',
        //       dimension19: 'liveEndTIme',
        //       dimension20: 'programName'
        //     }
        //   ],
        //   subparams: {
        //     t1: '상품상세',
        //     t2: 'liveT2',
        //     t3: 'info.productName',
        //     product_list: 'productList'
        //   }
        // }
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
        //   params: [
        //     {
        //       id: 'info.partNumber',
        //       name: 'info.productName',
        //       brand: 'info.brandName',
        //       category: 'categoryName',
        //       price: 77777,
        //       quantity: 77,
        //       variant: 'option',
        //       coupon: 'cpName',
        //       dimension15: null,
        //       dimension16: 'tvProduct',
        //       dimension17: 'liveTime',
        //       dimension18: 'liveStartTime',
        //       dimension19: 'liveEndTIme',
        //       dimension20: 'programName'
        //     }
        //   ],
        //   subparams: {
        //     t1: '상품상세',
        //     t2: 'liveT2',
        //     t3: 'info.productName',
        //     product_list: null // productList
        //   }
        // }
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
        //   params: [
        //     {
        //       id: 'catentryId',
        //       name: 'prdInfo.itncatentrynm',
        //       price: 88888,
        //       coupon: 'cpName'
        //     }
        //   ],
        //   subparams: {
        //     t1: '마이페이지',
        //     t2: '혜택정보',
        //     t3: '찜'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
          params: [
            {
              id: 'this.globalVal.detailInfo.productList[i].GOODSPARTNUMBER',
              name: 'this.globalVal.detailInfo.productList[i].PRODUCT_NAME',
              brand: 'this.globalVal.detailInfo.productList[i].BRAND_KOR_NM',
              dimension16: 'tvProduct'
            }
          ],
          subparams: {
            t1: '주문완료',
            t2: '장바구니담기',
            t3: 'this.globalVal.detailInfo.productList[i].PRODUCT_NAME'
          }
        }
      })
    },
    ga360ECommerceLogSend4: () => {
      console.log('ga360ECommerceLogSend4')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_04,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       dimension16: 'e상품'
        //     }
        //   ],
        //   subparams: {
        //     t1: '주문/결제',
        //     t2: '장바구니'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_04,
          params: [
            {
              id: 'aiquaParamArr[i].product_id',
              name: 'aiquaParamArr[i].product_name',
              brand: 'aiquaParamArr[i].brandName',
              category: 'aiquaParamArr[i].category_name',
              dimension16: 'tvProduct'
            }
          ],
          subparams: {
            t1: '장바구니',
            t2: '상품삭제'
          }
        }
      })
    },
    ga360ECommerceLogSend5: () => {
      console.log('ga360ECommerceLogSend5')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_05,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       dimension16: 'SHOP+',
        //       dimension17: 'brdctDate',
        //       dimension18: 'formStartDttm',
        //       dimension19: 'formEndDttm',
        //       dimension20: 'NSSHOP+',
        //       variant: '옵션'
        //     }
        //   ],
        //   subparams: {
        //     t1: '상품상세',
        //     t2: 'TV쇼핑',
        //     t3: 'TVLIVE',
        //     t4: '제품명',
        //     type: 'SHOP+',
        //     type2: 'NSSHOP+',
        //     list: {
        //       brdctDate: 'brdctDate',
        //       formStartDttm: 'formStartDttm',
        //       formEndDttm: 'formEndDttm'
        //     }
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_05,
          params: [
            {
              id: 'info.partNumber',
              name: 'info.productName',
              brand: 'info.brandName',
              category: 'categoryName',
              dimension16: 'tvProduct',
              dimension17: 'liveTime',
              dimension18: 'liveStartTime',
              dimension19: 'liveEndTIme',
              dimension20: 'programName',
              variant: 'option'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: 'TV쇼핑',
            t3: 'programName',
            t4: 'info.productName',
            type: 'tvProduct',
            type2: 'programName',
            list: {
              brdctDate: 'liveTime',
              formStartDttm: 'liveStartTime',
              formEndDttm: 'liveEndTIme'
            }
          }
        }
      })
    },
    ga360ECommerceLogSend6: () => {
      console.log('ga360ECommerceLogSend6')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_06,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       dimension16: 'e상품'
        //     }
        //   ],
        //   subparams: {
        //     t1: '상품상세',
        //     t2: '일반상품',
        //     t3: '제품명'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_06,
          params: [
            {
              id: 'info.partNumber',
              name: 'info.productName',
              brand: 'info.brandName',
              category: 'categoryName',
              dimension16: 'tvProduct'
            }
          ],
          subparams: {
            t1: '상품상세',
            t2: '일반상품',
            t3: 'info.productName'
          }
        }
      })
    },
    ga360ECommerceLogSend7: () => {
      console.log('ga360ECommerceLogSend7')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_07,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       dimension15: 'promotioncoupon',
        //       dimension16: 'eTV',
        //       dimension17: 'brdctDate',
        //       dimension18: 'formStartDttm',
        //       dimension19: 'formEndDttm',
        //       dimension20: 'TVLIVE',
        //       variant: '옵션'
        //     }
        //   ],
        //   subparams: {
        //     t1: '주문/결제',
        //     t2: '주문서작성/결제',
        //     payMthdCd: '300'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_07,
          params: [
            {
              id: 'orderProductList[1].goodsId',
              name: 'orderProductList[1].goodsName',
              brand: 'orderProductList[1].brandName',
              category: 'categoryName1',
              dimension16: 'tvProduct1'
            },
            {
              id: 'orderProductList[2].goodsId',
              name: 'orderProductList[2].goodsName',
              brand: 'orderProductList[2].brandName',
              category: 'categoryName2',
              dimension16: 'tvProduct2'
            }
          ],
          subparams: {
            t1: '주문/결제',
            t2: '주문서작성/결제'
          }
        }
      })
    },
    ga360ECommerceLogSend8: () => {
      console.log('ga360ECommerceLogSend8')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_08,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       dimension15: 'promotioncoupon',
        //       dimension16: 'e상품',
        //       dimension17: '',
        //       dimension18: '',
        //       dimension19: '',
        //       dimension20: '',
        //       variant: '옵션'
        //     }
        //   ],
        //   subparams: {
        //     t1: '주문/결제',
        //     t2: '주문서작성/결제',
        //     payMthdCd: '300'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_08,
          params: [
            {
              id: 'orderProductList[1].goodsId',
              name: 'orderProductList[1].goodsName',
              brand: 'orderProductList[1].brandName',
              category: 'categoryName1',
              dimension16: 'tvProduct1'
            },
            {
              id: 'orderProductList[2].goodsId',
              name: 'orderProductList[2].goodsName',
              brand: 'orderProductList[2].brandName',
              category: 'categoryName2',
              dimension16: 'tvProduct2'
            }
          ],
          subparams: {
            t1: '주문/결제',
            t2: '주문서작성/결제'
          }
        }
      })
    },
    ga360ECommerceLogSend9: () => {
      console.log('ga360ECommerceLogSend9')
      marketingUtil.ga360Logger.send({
        logger: '4',
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_09,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       price: 1000,
        //       quantity: 2,
        //       coupon: 'coupon',
        //       dimension15: 'promotioncoupon',
        //       dimension16: 'e상품',
        //       dimension17: '',
        //       dimension18: '',
        //       dimension19: '',
        //       dimension20: '',
        //       // dimension16: 'eTV',
        //       // dimension17: 'brdctDate',
        //       // dimension18: 'formStartDttm',
        //       // dimension19: 'formEndDttm',
        //       // dimension20: 'TVLIVE',
        //       variant: '옵션'
        //     }
        //   ],
        //   subparams: {
        //     t1: '주문/결제',
        //     t2: '주문완료',
        //     ordersid: 'ordersid',
        //     totalprice: '10000',
        //     coupon: 'couponid',
        //     deliveryprice: '2500',
        //     typedetail: '300', // payType
        //     totaldiscount: '100',
        //     OKcashbag: '200',
        //     nsgift: '300',
        //     cash1: '10000',
        //     cash2: '0',
        //     savecash: '0',
        //     discountdelivery: '0',
        //     discountprice: '400',
        //     discountcoupon: '0',
        //     discount1: '0',
        //     discountcard: '500',
        //     detailName: '카카오뱅크'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_09,
          params: [
            {
              id: 'item.GOODSPARTNUMBER',
              name: 'item.PRODUCT_NAME',
              price: Number('9999'),
              quantity: Number('99'),
              coupon: '쿠폰',
              varient: 'optionCheck',
              dimension16: 'tvProduct'
            }
          ],
          subparams: {
            t1: '주문/결제',
            t2: '주문완료',
            checkout_option: 'payType',
            ordersid: 'this.globalVal.mInputParams.orderId',
            revenue: 99999,
            coupon: 'couponNum',
            shipping: 999,
            dimension14: '{payType}_{this.globalVal.paymentInfo.paymentList[0].DP_bankName}',
            totaldiscount: 888, // 최종할인금액
            nsgift: 'nsGiftCard', // NS상품권
            cash1: 777, // 사용예치금
            cash2: 666, // 사용적립금
            savecash: 555, // 예상 적립포인트
            discountdelivery: 444, // 배송비할인
            discountprice: 333, // 가격할인
            discountcoupon: 222, // 쿠폰할인
            discount1: 111 // 일시불할인
          }
        }
      })
    },
    ga360ECommerceLogSend10: () => {
      console.log('ga360ECommerceLogSend10')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_10,
        //   params: null,
        //   subparams: {
        //     t1: '마이페이지',
        //     t2: '쇼핑정보',
        //     t3: '주문내역/배송조회',
        //     t4: '주문취소',
        //     ordersid: 'ordersid'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_10,
          params: null,
          subparams: {
            t1: '마이페이지',
            t2: '쇼핑정보',
            t3: '주문내역/배송조회',
            t4: '주문취소',
            product_list: 'this.globalVal.ordsid',
            id: 'this.globalVal.ordsid'
          }
        }
      })
    },
    ga360ECommerceLogSend11: () => {
      console.log('ga360ECommerceLogSend11')
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        // data: {
        //   step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
        //   params: [
        //     {
        //       id: 'partNumber',
        //       name: '제품명',
        //       brand: '브랜드명',
        //       category: '카테고리(cate1Nm)',
        //       dimension16: 'SHOP+',
        //       dimension17: 'brdctDate',
        //       dimension18: 'formStartDttm',
        //       dimension19: 'formEndDttm',
        //       dimension20: 'NSSHOP+'
        //     }
        //   ],
        //   subparams: {
        //     t1: '상품상세',
        //     t2: 'NSSHOP+',
        //     product_list: 'TV쇼핑_추천방송상품'
        //   }
        // }
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: 'productInfo.partnumber',
              name: 'productInfo.itncatentrynm',
              brand: 'productInfo.brandKorNm',
              price: 5555,
              category: 'categoryName',
              quantity: 33,
              dimension16: 'tvProduct',
              dimension20: 'NS LIVE'
            }
          ],
          subparams: {
            t1: 'HappyDeal',
            t2: 'btnName',
            t3: 'HappyDeal_ProductList',
            product_list: 'HappyDeal_ProductList'
          }
        }
      })
    },
    ga360ECommerceLogSend99: () => {
      console.log('ga360ECommerceLogSend99', this.params)
      marketingUtil.ga360Logger.send(this.params)
    }
  }
}
</script>
