<template>
  <div>
    <h1>페이스북 픽셀 로그</h1>
    <br>
    <!-- <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="fbpixelLogSend1"
    >
      PageView
    </button> -->
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="fbpixelLogSend2"
    >
      ViewContent
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="fbpixelLogSend3"
    >
      AddToCart
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="fbpixelLogSend4"
    >
      Purchase
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="fbpixelLogSend5"
    >
      CompleteRegistration
    </button>
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
    // fbpixelLogSend1: () => {
    //   console.log('fbpixelLogSend1')
    //   marketingUtil.fbpixelLogger.send({
    //     type: marketingUtil.fbpixelLogger.EVENT.PAGE_VIEW
    //   })
    // },
    fbpixelLogSend2: () => {
      console.log('fbpixelLogSend2')
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
    },
    fbpixelLogSend3: () => {
      console.log('fbpixelLogSend3')
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.ADD_TO_CART
      })
    },
    fbpixelLogSend4: () => {
      console.log('fbpixelLogSend4')
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.PURCHASE,
        data: {
          value: 2000, // 구매 금액
          currency: 'KRW'
        }
      })
    },
    fbpixelLogSend5: () => {
      console.log('fbpixelLogSend5')
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.COMPLETE_REGISTRATION
      })
    }
  }
}
</script>
