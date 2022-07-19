<template>
  <div>
    <h1>홈쇼핑 모아</h1>
    <br>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="sendHsmoaLogger1"
    >
      이벤트 로그 전송 - [category: "list"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="sendHsmoaLogger2"
    >
      이벤트 로그 전송 - [category: "product"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="sendHsmoaLogger3"
    >
      이벤트 로그 전송 - [category: "basket"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="sendHsmoaLogger4"
    >
      이벤트 로그 전송 - [category: "purchase"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="sendHsmoaLogger5"
    >
      이벤트 로그 전송 - [category: "query"]
    </button>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px; background-color: skyblue;"
      @click="sendHsmoaLogger6"
    >
      이벤트 로그 전송 - [category: "basketview"]
    </button>
  </div>
</template>

<script>
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import COMM_CONST from '@constants/framework/constants'

export default {
  data () {
    return {
    }
  },
  methods: {
    sendHsmoaLogger1: () => {
      console.log('sendHsmoaLogger1')
      marketingUtil.hsmoaLogger.send({
        data: {
          from_hsmoa: false,
          action: ['11466759', '14740166', '24689641'],
          category: 'list'
        }
      })
    },

    sendHsmoaLogger2: () => {
      console.log('sendHsmoaLogger2')
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: COMM_CONST.getCocd(),
          action: '11466759',
          category: 'product'
        }
      })
    },

    sendHsmoaLogger3: () => {
      console.log('sendHsmoaLogger3')
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: COMM_CONST.getCocd(),
          action: ['11466759', '14740166', '24689641'],
          category: 'basket'
        }
      })
    },

    sendHsmoaLogger4: () => {
      console.log('sendHsmoaLogger4')
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: COMM_CONST.getCocd(),
          action: ['11466759', '14740166', '24689641', '26349642', '21193188'],
          category: 'purchase'
        }
      })
    },

    sendHsmoaLogger5: () => {
      console.log('sendHsmoaLogger5')
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: COMM_CONST.getCocd(),
          action: '[TEST] 전복',
          category: 'query'
        }
      })
    },

    sendHsmoaLogger6: () => {
      console.log('sendHsmoaLogger6')
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: COMM_CONST.getCocd(),
          action: ['11466759', '14740166', '24689641', '26349642', '21193188'],
          category: 'basketview'
        }
      })
    }
  }
}
</script>
