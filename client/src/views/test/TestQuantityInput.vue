<template>
  <div>
    <h1>Qunatity Input Test</h1>
    <div class="cart_wrap">
      <ul class="cart_list">
        <li>
          <!-- 장바구니 상품 목록 -->
          <ul class="product_list">
            <li>
              <div class="count_buy">
                <quantity-input
                  :params="params"
                  @change="changeEvent"
                />
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import QuantityInput from '@components/common/QuantityInput'

export default {
  components: {
    QuantityInput
  },
  data () {
    return {
      // 파라메터 객체 바인딩
      params: {
        value: 1, // binding 될 값 value
        max: 10 // 최대값
      }
    }
  },
  methods: {
    /**
     * 수량이 변경될 때마다 실행할 이벤트
     */
    changeEvent (value) {
      console.log('value : ', value)
    }
  }
}
</script>
