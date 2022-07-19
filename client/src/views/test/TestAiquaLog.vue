<template>
  <div>
    <h1>AIQUA</h1>
    <br>
    <h5>[상품정보이벤트]</h5>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="aiquaLogSend0"
    >
      user 이벤트 로그 전송 - [event type: "page_viewed"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="aiquaLogSend1"
    >
      user 이벤트 로그 전송 - [event type: "product_viewed"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="aiquaLogSend2"
    >
      user 이벤트 로그 전송 - [event type: "product_added_to_wishlist"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="aiquaLogSend3"
    >
      user 이벤트 로그 전송 - [event type: "product_added_to_cart"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="aiquaLogSend4"
    >
      user 이벤트 로그 전송 - [event type: "product_removed_from_cart"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="aiquaLogSend5"
    >
      user 이벤트 로그 전송 - [event type: "product_purchased"]
    </button>
    <br>
    <h5>[결제이벤트]</h5>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: pink;"
      @click="aiquaLogSend6"
    >
      user 이벤트 로그 전송 - [event type: "checkout_completed"]
    </button>
    <br>
    <h5>[기타]</h5>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="aiquaLogSend7"
    >
      user 이벤트 로그 전송 - [event type: "category_viewed"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="aiquaLogSend8"
    >
      user 이벤트 로그 전송 - [event type: "page_viewed"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="aiquaLogSend9"
    >
      user 이벤트 로그 전송 - [event type: "login"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="aiquaLogSend10"
    >
      user 이벤트 로그 전송 - [event type: "logout"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="aiquaLogSend11"
    >
      user 이벤트 로그 전송 - [event type: "registration_completed"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darksalmon;"
      @click="aiquaLogSend12"
    >
      user 이벤트 로그 전송 - [event type: "payment_info_added"]
    </button>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: darkkhaki;"
      @click="aiquaLogSend13"
    >
      user profile 로그 전송 - [type: "USER_PROFILE"]
    </button>
  </div>
</template>

<script>
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
// import loginUtil from '@utils/loginUtil'
import {
  viewType
} from '@utils/commonutil/commonUtil'
import COMM_CONST from '@constants/framework/constants'

export default {
  data () {
    return {
    }
  },
  methods: {
    aiquaLogSend0: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'page_viewed'
        }
      })
    },
    aiquaLogSend1: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'product_viewed',
          params: {
            category_name: '카테고리명',
            product_id: 'info.partNumber',
            product_name: 'info.productName',
            product_image_url: 'http://aaa.com/aaa.jpg',
            product_price: 1000,
            product_channel: 'info.busChnId',
            md_name: 'md_name',
            md_team_name: 'md_team_name'
          }
        }
      })
    },

    aiquaLogSend2: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'product_added_to_wishlist',
          params: {
            category_name: 'productCategoryName',
            product_id: 'productInfo.partNumber',
            product_name: 'productInfo.productName',
            product_image_url: 'http://aaa.com/aaa.jpg',
            product_price: 5000,
            product_channel: 'productInfo.busChnId',
            md_name: 'md_name',
            md_team_name: 'md_team_name'
          }
        }
      })
    },

    aiquaLogSend3: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'product_added_to_cart',
          params: {
            category_name: '카테고리명',
            product_id: 'this.product.partNumber',
            product_name: 'this.product.productName',
            product_image_url: 'http://aaa.com/aaa.jpg',
            product_price: 500,
            product_channel: 'this.product.busChnId',
            md_name: 'md_name',
            md_team_name: 'md_team_name'
          }
        }
      })
    },

    aiquaLogSend4: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'product_removed_from_cart',
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
    },

    aiquaLogSend5: () => {
      [
        {
          product_id: '42985725',
          product_name: '고무신',
          product_image_url: '',
          product_price: 50000,
          product_channel: 'aiquaTest',
          md_name: 'test',
          md_team_name: 'marketingScript'
        },
        {
          product_id: '11223344',
          product_name: '고무신',
          product_image_url: '',
          product_price: 50000,
          product_channel: 'aiquaTest',
          md_name: 'test',
          md_team_name: 'marketingScript'
        }
      ].forEach(function (item, index, array) {
        marketingUtil.aiquaLogger.send({
          type: marketingUtil.aiquaLogger.USER_EVENT,
          data: {
            event: 'product_purchased',
            params: item
          }
        })
      })
    },

    aiquaLogSend6: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'checkout_completed',
          params: {
            order_id: '1122334455',
            order_amount: 1122,
            payment_method: '100',
            payment_card: '삼성',
            coupon_used: '11111,22222,33333',
            number_of_products: 1, // 상품의 총 주문 개수 전송
            point_used: 0, // 적립금 사용금액 전송
            media: viewType(),
            co_cd: COMM_CONST.getCocd()
          }
        }
      })
    },
    // 추가
    aiquaLogSend7: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'category_viewed',
          params: {
            categoryName: '1266580'
          }
        }
      })
    },

    aiquaLogSend8: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'page_viewed',
          params: {
            pageId: window.marketingRoute.name // name넘어가는지 로그 확인해보기
          }
        }
      })
    },

    aiquaLogSend9: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'login'
        }
      })
    },

    aiquaLogSend10: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'logout'
        }
      })
    },

    aiquaLogSend11: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'registration_completed'
        }
      })
    },

    aiquaLogSend12: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'payment_info_added',
          params: {
            payment_method: '100',
            payment_card: '삼성'
          }
        }
      })
    },

    aiquaLogSend13: () => {
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_PROFILE,
        data: {
          userId: '',
          name: '',
          email: '',
          phoneNumber: '',
          birthday: '',
          gender: '',
          loginStatus: 'N',
          devicePushAgree: '',
          notificationModifiedDate: '',
          isEmployee: '',
          level: '',
          coCd: ''
        }
      })
    }
  }
}
</script>
