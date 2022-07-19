<template>
  <div>
    <h1>NHN 유입 추적 스크립트</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px;"
      @click="nhnLogSend"
    >
      로그 전송
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
    nhnLogSend: () => {
      marketingUtil.nhnLogger.send({
        CN: marketingUtil.nhnLogger.CN_CART,
        CK: '주문번호',
        CA: String(6000),
        CDN: '상품명1;상품명2',
        CDE: '2;5',
        CDC: '500;1000',
        CDT: '',
        ETC1: '나이=34'
      })
    }
  }
}
</script>
