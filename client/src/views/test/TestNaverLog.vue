<template>
  <div>
    <h1>네이버 프리미엄 로그</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="naverLogSend1"
    >
      유입 추적 - [category: "TRACE_INFLOW"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="naverLogSend2"
    >
      전환 추적 - [category: "TRACE_TRANS"]
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
    naverLogSend1: () => {
      console.log('naverLogSend1')
      marketingUtil.naverLogger.send({
        type: marketingUtil.naverLogger.TRACE_INFLOW
      })
    },
    naverLogSend2: () => {
      console.log('naverLogSend2')
      marketingUtil.naverLogger.send({
        type: marketingUtil.naverLogger.TRACE_TRANS,
        data: {
          strTranSoft: '2', // 1:구매완료 페이지, 2:회원가입 완료 페이지, 3:장바구니 담기 페이지, 4:신청/예약 페이지, 5:기타 페이지
          strTranValue: '1' // 전환가치. 전환가치를 측정할 수 없는 경우 1 입력
        }
      })
    }
  }
}
</script>
