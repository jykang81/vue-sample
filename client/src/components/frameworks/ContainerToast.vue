<template>
  <transition name="fade">
    <div v-if="isShow" ref="containerToast" class="toast_message_wrap" :class="toastClassName">
      <p class="toast_message">
        <template v-for="(message, index) in splittedMessage">
          <br v-if="index > 0" :key="index"> {{ message }}
        </template>
      </p>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('toast', ['isShow', 'splittedMessage', 'customClass']),
    ...mapState('layouts', ['bottomNavi']),

    /**
     * 상품상세 페이지이거나 AppBottomNavi가 있을때만 위치 상향 조정
     *
     * @returns {string} 토스트 메시지 class
     */
    toastClassName () {
      let toastClassName = this.$route.name === 'productDetail' || this.bottomNavi ? 'is_nav ' : ''
      toastClassName += this.customClass
      return toastClassName
    }
  },
  updated () {
    // 상품상세 > 구매하기 레이어 오픈 시 && 장바구니 토스트가 아닌 경우에는 토스트 메시지 위치 변경
    const rootEl = this.$root.$el
    const toastEl = this.$refs.containerToast
    const layerEl = rootEl.querySelector('#rightOrderOptionLayer')
    const rightOrderOptionEl = rootEl.querySelector('.right_order_option.active')
    if (this.isShow) { // 토스트 메시지 노출 시에만
      if (rightOrderOptionEl && this.customClass !== 'add_cart') {
        layerEl.appendChild(toastEl)
      } else {
        rootEl.appendChild(toastEl)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/frameworks/ContainerToast";
</style>
