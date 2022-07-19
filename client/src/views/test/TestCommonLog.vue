<template>
  <div>
    <h1>공통 로깅</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="commonLogging1"
    >
      공통 로그 전송 - [category: "add_category"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="commonLogging2"
    >
      공통 로그 전송 - [category: "add_productview"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="commonLogging3"
    >
      공통 로그 전송 - [category: "add_addcart"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="commonLogging4"
    >
      공통 로그 전송 - [category: "add_refund"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="commonLogging5"
    >
      공통 로그 전송 - [category: "add_vieworder"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="commonLogging6"
    >
      공통 로그 전송 - [category: "add_purchase"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="commonLogging7"
    >
      공통 로그 전송 - [category: "add_search"]
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
    commonLogging1: () => {
      console.log('commonLogging1')
      marketingUtil.commonLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_CATEGORY,
          action: '카테고리명'
        }
      })
    },
    commonLogging2: () => {
      console.log('commonLogging2')
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
    },
    commonLogging3: () => {
      console.log('commonLogging3')
      marketingUtil.commonLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_CART,
          action: [
            {
              catalog: '카탈로그',
              name: '제품명',
              id: 'id1',
              price: 1000,
              sale: 10,
              quantity: 1,
              attrs: 'attrs'
            }
          ]
        }
      })
    },
    commonLogging4: () => {
      console.log('commonLogging4')
      marketingUtil.commonLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_REFOUND,
          action: [
            {
              name: '제품명',
              id: 'id1',
              orderId: 'orderId',
              del: 'del',
              attrs: 'attrs',
              price: 1000,
              quantity: 1,
              sale: 10
            }
          ]
        }
      })
    },
    commonLogging5: () => {
      console.log('commonLogging5')
      marketingUtil.commonLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_VIEWORDER,
          action: [
            {
              name: '제품명',
              id: 'id1',
              orderId: 'orderId',
              del: 'del',
              attrs: 'attrs',
              price: 1000,
              quantity: 1,
              totalsale: 0
            }
          ]
        }
      })
    },
    commonLogging6: () => {
      console.log('commonLogging6')
      marketingUtil.commonLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PURCHASE,
          action: [
            {
              productName: '제품명',
              productId: 'id1',
              orderId: 'orderId',
              price: 1000,
              quantity: 1,
              discount: 100,
              del: 2500,
              attrs: 'attrs'
            }
          ],
          lastPrice: 1000,
          totalPrice: 2000,
          orderId: 'orderId'
        }
      })
    },
    commonLogging7: () => {
      console.log('commonLogging7')
      marketingUtil.commonLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_SEARCH,
          action: [
            {
              id: 'partNumber',
              name: 'name',
              price: 100,
              search: '검색어'
            }
          ]
        }
      })
    }
  }
}
</script>
