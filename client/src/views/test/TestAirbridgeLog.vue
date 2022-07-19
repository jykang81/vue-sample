<template>
  <div>
    <h1>Airbridge 로깅</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend1"
    >
      회원가입 이벤트 - [event : 'airbridge.user.signup']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend2"
    >
      로그인 이벤트 - [event : 'airbridge.user.signin']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend3"
    >
      로그아웃 이벤트 - [event : 'airbridge.user.signout']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend4"
    >
      홈 화면 조회 이벤트 - [event : 'airbridge.ecommerce.home.viewed']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend5"
    >
      상품상세 조회 이벤트 - [event : 'airbridge.ecommerce.product.viewed']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend6"
    >
      상품 리스트 조회 이벤트 - [event : 'airbridge.ecommerce.productList.viewed']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend7"
    >
      검색결과 조회 이벤트 - [event : 'airbridge.ecommerce.searchResults.viewed']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend8"
    >
      장바구니 담기 이벤트 - [event : 'airbridge.ecommerce.product.addedToCart']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend9"
    >
      결제 이벤트 - [event : 'airbridge.ecommerce.order.completed']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend10"
    >
      사용자 이벤트 - [event : 'airbridge.ecommerce.order.canceled']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend11"
    >
      사용자 이벤트 - [event : 'add_wishlist']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend12"
    >
      사용자 이벤트 - [event : 'view_productchart']
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend13"
    >
      사용자 이벤트 - [event : 'view_itemshop___CATEGORY_NM__']
    </button>
    <!-- <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="airbridgeLogSend14"
    >
      사용자 이벤트 - [event : 'view_appstart']
    </button> -->
  </div>
</template>

<script>
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  data () {
    return {
    }
  },
  methods: {
    airbridgeLogSend1: () => {
      console.log('airbridgeLogSend1')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SIGN_UP, // 회원가입
        data: {
          action: '일반회원',
          label: '회원가입'
        }
      })
    },
    airbridgeLogSend2: () => {
      console.log('airbridgeLogSend2')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SIGN_IN, // 로그인
        data: {
          action: '일반회원로그인',
          label: '로그인'
        }
      })
    },
    airbridgeLogSend3: () => {
      console.log('airbridgeLogSend3')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SIGN_OUT, // 로그아웃
        data: {
          action: '로그아웃',
          label: '로그아웃'
        }
      })
    },
    airbridgeLogSend4: () => {
      console.log('airbridgeLogSend4')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.HOME_VIEW, // 홈 화면 조회
        data: {
          action: '모바일 웹 실행',
          label: '홈화면조회'
        }
      })
    },
    airbridgeLogSend5: () => {
      console.log('airbridgeLogSend5')
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
          ],
          customAttributes: {
            categoryNm: '카테고리명',
            gradeNm: '패밀리'
          },
          action: '상품상세조회',
          label: '상품상세조회'
        }
      })
    },
    airbridgeLogSend6: () => {
      console.log('airbridgeLogSend6')
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
          ],
          customAttributes: {
            categoryNm: '카테고리명', // 카테고리 매장의 중/소/세 명
            gradeNm: '패밀리'
          },
          action: '카테고리매장>중',
          label: '상품리스트조회'
        }
      })
    },
    airbridgeLogSend7: () => {
      console.log('airbridgeLogSend7')
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
          ],
          customAttributes: {
            categoryNm: '',
            gradeNm: '패밀리'
          },
          action: '검색결과 조회',
          label: '검색결과 조회'
        }
      })
    },
    airbridgeLogSend8: () => {
      console.log('airbridgeLogSend8')
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
          ],
          customAttributes: {
            categoryNm: '카테고리명',
            gradeNm: '패밀리'
          },
          action: '장바구니 담기',
          label: '장바구니 담기'
        }
      })
    },
    airbridgeLogSend9: () => {
      console.log('airbridgeLogSend9')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PURCHASED, // 결제
        data: {
          transactionID: String(Math.floor(Math.random() * (100000 - 10000)) + 10000), // 중복된 orderId는 전송하지 않음. 테스트를 위해서 난수 발생
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
              productID: 'productID5', // 상품ID
              name: 'name5', // 상품명
              price: 500, // 가격
              quantity: 10, // 개수
              currency: 'KRW', // 통화
              position: 2 // index??
            }
          ],
          customAttributes: {
            categoryNm: '',
            gradeNm: '패밀리'
          },
          action: '구매완료',
          label: '구매완료'
        }
      })
    },
    airbridgeLogSend10: () => {
      console.log('airbridgeLogSend10')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.CANCELED, // 취소
        data: {
          semanticAttributes: { // 기본 이벤트처럼 전송하면 상품정보가 넘어가지 않는다.
            products: [
              {
                productID: 'productID3', // 상품ID
                name: 'name3', // 상품명
                price: 1000, // 가격
                quantity: 10, // 개수
                currency: 'KRW', // 통화
                position: 1 // index??
              }
            ]
          },
          customAttributes: {
            categoryNm: '',
            gradeNm: '패밀리',
            transactionDtm: '2020-09-16 09:09:09'
          },
          action: '구매취소',
          label: '구매취소'
        }
      })
    },
    airbridgeLogSend11: () => {
      console.log('airbridgeLogSend11')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.ADD_WISHLIST, // 찜
        data: {
          semanticAttributes: { // 기본 이벤트처럼 전송하면 상품정보가 넘어가지 않는다.
            products: [
              {
                productID: 'partNumber', // 상품ID
                name: 'productName', // 상품명
                price: 1000, // 가격
                currency: 'KRW', // 통화
                position: 1 // index
              }
            ]
          },
          customAttributes: {
            categoryNm: 'productCategoryName',
            gradeNm: '패밀리'
          },
          action: '찜하기',
          label: '찜하기' // productCategoryName
        }
      })
    },
    airbridgeLogSend12: () => {
      console.log('airbridgeLogSend12')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PRODUCT_CHART, // 편성표
        data: {
          action: '편성표 조회',
          label: '편성표 조회'
        }
      })
    },
    airbridgeLogSend13: () => {
      console.log('airbridgeLogSend13')
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP, // 편성매장
        data: {
          action: '편집매장',
          label: '편집매장 조회',
          categoryNm: 'thinglive'
        }
      })
    }
  }
}
</script>
