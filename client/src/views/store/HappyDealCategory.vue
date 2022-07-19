<template>
  <product-list
    espot-name="_EZ_HAPPYDEAL_CATE_PRDGRID"
    :product-list="categoryProductList"
    :use-top="true"
    :parent-info="categoryId"
    :clksrc="clksrc"
    :total-count="categoryProductsTotalCnt"
    @get:product="getCategoryProductList"
  />
</template>

<script>
import ProductList from '@components/common/ProductList'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import uiUtil from '@utils/uiUtil'

export default {
  name: 'HappyDealCategory',
  components: {
    ProductList
  },
  props: {
    categoryId: { // 매장 카테고리 ID
      type: String,
      required: true
    },
    clksrc: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      categoryProductList: [], // 카테고리 상품
      scrollObject: null, // 무한스크롤 객체
      categoryProductsTotalCnt: '', // 카테고리 상품리스트 총개수
      categoryProductsIndex: 0 // 카테고리 상품리스트 조회 인덱스
    }
  },
  watch: {
    categoryId () {
      this.categoryProductList = []
      this.categoryProductsIndex = 0
      this.categoryProductsTotalCnt = ''
      this.scrollObject.disconnect()
      this.setInfiniteScrollObject()
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     *
     */
    init () {
      this.setInfiniteScrollObject()
    },
    /**
     * IO 기반 무한스크롤 객체 설정 함수
     * @returns {void}
     */
    setInfiniteScrollObject () {
      this.scrollObject = uiUtil.setInfiniteScroll(this, {
        callback: this.getCategoryProductList,
        options: {
          rootMargin: '100% 0px'
        }
      })
    },
    /**
     * TODO : 카테고리 상품 조회
     * @returns {object} promise
     */
    getCategoryProductList () {
      const index = this.categoryProductsIndex
      const seq = 40
      const successHandling = response => {
        // 카테고리 상품
        const productList = response.msg.espotList[0]._EZ_HAPPYDEAL_CATE_PRDGRID
        if (index === 0 && productList.length > 0) {
          this.categoryProductsTotalCnt = productList[0].totProdCnt
        }
        if (!productList || !productList.length > 0) {
          this.scrollObject.disconnect()
        } else {
          this.categoryProductList.push(...productList)
          this.categoryProductsIndex = index + seq
        }
        // 마케팅 스크립트 적용 부분
        // 네이버 프리미엄 로그
        marketingUtil.naverLogger.send({
          type: marketingUtil.naverLogger.TRACE_INFLOW
        })
      }
      const param = {
        espotInfo: `EZ_HAPPYDEAL_CATE_PRDGRID|CATEGORY_PRDLARGE|${index + 1}|${index + seq}|${this.categoryId}`
      }

      return this.$nsaxios.post('NSFixedShopCmd', param, successHandling)
    }
  }
}
</script>
