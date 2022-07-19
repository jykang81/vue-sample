<template>
  <div>
    <p>
      <span>
        <button @click="goPayment()">
          결제하기
        </button>
      </span>
    </p>
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import {
  iframeReceiveMessage
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'

export default {
  data () {
    return {
      iframeSrc: '',
      enableCallbackResult: true
    }
  },
  created () {
  },
  mounted () {
    iframeReceiveMessage(this, this.callbackResult)
  },
  methods: {
    goPayment () {
      popupUtil.show('test/TestIframePopup.vue', {}, () => {})
    },
    callbackResult (data) {
      const temp = this.enableCallbackResult
      console.log('data: ', data, ' - ', data.cmd)
      if (this.enableCallbackResult && data.cmd === 'callbackPaymentResult') {
        this.enableCallbackResult = false
        console.log('data.cmd: ', data.cmd, ' before: ', temp, 'after: ', this.enableCallbackResult)
        messageUtil.alert(`1: data.cmd: ${data.cmd}\n before: ${temp}\n after: ${this.enableCallbackResult}`, () => {
          this.$store.commit('popup/hide')
        })
      } else if (this.enableCallbackResult && data.cmd === 'close') {
        this.enableCallbackResult = false
        console.log('data.cmd: ', data.cmd, ' before: ', temp, 'after: ', this.enableCallbackResult)
        messageUtil.alert(`2: data.cmd: ${data.cmd}\n before: ${temp}\n after: ${this.enableCallbackResult}`, () => {
          this.$store.commit('popup/hide')
        })
      }
    }
  }
}
</script>

<style>

</style>
