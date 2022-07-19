<template>
  <div>
    <h2>장바구니 A</h2>
    <div>
      {{ basketA }}
    </div>

    <h2>장바구니 B</h2>
    <div>
      {{ basketB }}
    </div>
    <button
      style="display: block"
      @click="mergeObject"
    >
      장바구니 상품 합치기
    </button>
    <button
      style="display: block"
      @click="mergeObjectDeep"
    >
      장바구니 상품 합치기 (deep)
    </button>
    <h2>합쳐진 장바구니 (A + B)</h2>
    <div>
      {{ result }}
    </div>
  </div>
</template>

<script>
import {
  extend
} from '@utils/commonutil/commonUtil'

export default {
  data () {
    return {
      basketA: {
        f1: '사과',
        f2: '바나나',
        f3: '딸기',
        ex: {
          ex_f: '박스 속 사과',
          ex_price: '200원'
        }
      },
      basketB: {
        f1: 'mango',
        f4: 'melon',
        b1: 'juice',
        ex: {
          ex_price: '$200'
        }
      },
      /** 장바구니 합치기 결과 객체 */
      result: null
    }
  },
  methods: {
    /**
     * 장바구니 합치기
     */
    mergeObject () {
      this.result = extend(this.reuslt, this.basketA, this.basketB)
    },
    /**
     * 장바구니 합치기 (deep copy)
     */
    mergeObjectDeep () {
      this.result = extend(true, this.reuslt, this.basketA, this.basketB)
    }
  }
}
</script>
