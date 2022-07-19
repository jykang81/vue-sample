<template>
  <div>
    <h1>RECOBELL</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="recobellLogSend0"
    >
      페이지 뷰 로그 전송
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="recobellLogSend1"
    >
      페이지 뷰 로그 전송 - [category: "add_productview"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="recobellLogSend1_1"
    >
      페이지 뷰 로그 전송 - [category: "add_productview2"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="recobellLogSend2"
    >
      페이지 뷰 로그 전송 - [category: "add_purchase"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="recobellLogSend3"
    >
      페이지 뷰 로그 전송 - [category: "add_search"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="recobellLogSend4"
    >
      페이지 뷰 로그 전송 - [category: "add_login"]
    </button>
  </div>
</template>

<script>
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import loginUtil from '@utils/loginUtil'

export default {
  data () {
    return {
      ordersId: '123456' // 주문번호
    }
  },
  methods: {
    recobellLogSend0: () => {
      console.log('recobellLogSend0')
      marketingUtil.recobellLogger.send({
        data: {
          category: '',
          initFlag: true
        }
      })
    },
    recobellLogSend1: () => {
      console.log('recobellLogSend1')
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PRODUCTVIEW,
          action: {
            catalog: '1358062',
            name: '종근당 6년근 홍삼정 애니타임 + 고급 쇼핑백',
            id: '24745657',
            price: 28900,
            sale: ''
          },
          searchTerm: '',
          clickUrl: 'yunTest1',
          itemType: '',
          CTCOMitemYn: '',
          TVitemYn: ''
        }
      })
    },

    recobellLogSend1_1: () => {
      console.log('recobellLogSend2')
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PRODUCTVIEW,
          action: {
            catalog: '1618559',
            name: '[단하루]완도산 참전복이 370원부터!! 모든 사이즈 구비 전복 골라담기',
            id: '23121817',
            price: 370,
            sale: ''
          },
          searchTerm: '',
          clickUrl: 'yunTest1',
          itemType: '',
          CTCOMitemYn: '',
          TVitemYn: ''
        }
      })
    },

    recobellLogSend2: () => {
      console.log('recobellLogSend2')
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
    },
    recobellLogSend3: () => {
      console.log('recobellLogSend3')
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_SEARCH,
          action: [
            {
              name: '1395573',
              id: '25174064',
              price: 268900,
              search: '구찌 295419 A0VBR 1060'
            },
            {
              name: '1395574',
              id: '25174065',
              price: 268800,
              search: '구찌 295419 A0VBR 1060 111'
            }
          ], // 제휴사 adbrix 정보 전달
          searchTerm: '구찌 295419 A0VBR 1060'
        }
      })
    },
    recobellLogSend4: () => {
      console.log('recobellLogSend4')
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_LOGIN,
          action: loginUtil.getUserInfo('logonId'),
          memberInfo: loginUtil.getMemberInfo()
        }
      })
    }
  }
}
</script>
