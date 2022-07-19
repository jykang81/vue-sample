<template>
  <div>
    <h1>DTSI 로그</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="dtsiLogSend0"
    >
      초기화
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="dtsiLogSend1"
    >
      구매완료 - [category: "add_purchase"] (광고 클릭 후)
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="dtsiLogSend2"
    >
      회원가입 완료
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
    dtsiLogSend0: () => {
      console.log('dtsiLogSend')
      marketingUtil.dtsiLogger.send({
        data: {
          initFlag: true
        }
      })
    },
    dtsiLogSend1: () => {
      console.log('dtsiLogSend1')
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
          orderId: String(Math.floor(Math.random() * (100000 - 10000)) + 10000), // 중복된 orderId는 전송하지 않음. 테스트를 위해서 난수 발생
          lastPrice: 2970,
          totalPrice: 300
        }
      })
    },
    dtsiLogSend2: () => {
      console.log('dtsiLogSend2')
      marketingUtil.dtsiLogger.send({
        data: {
          isSignUp: true // 회원가입 완료 페이지인 경우
        }
      })
    }
  }
}
</script>
