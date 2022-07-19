<template>
  <span class="quantity_input">
    <button type="button" class="btn minus" @click="minus">
      <span class="blind">-</span>
    </button>
    <label>
      <input
        :id="`quantity_${params.id}`"
        ref="quantity"
        type="tel"
        :value="value"
        @keydown="validChange"
        @keyup="keyupNumber"
        @input="debouncedChange"
        @blur="checkEmpty"
      >
    </label>
    <button type="button" class="btn plus" @click="plus">
      <span class="blind">+</span>
    </button>
  </span>
</template>

<script>
import debounce from 'lodash/debounce'
import COMM_CONST from '@constants/framework/constants'
import toastUtil from '@frameworks/toastUtil'
import {
  arraySum
} from '@utils/commonutil/commonUtil'

export default {
  name: 'QuantityInput',
  props: {
    params: { // 수량 조절 stepper 파라미터
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      value: Number(this.params.value) || 1 // 현재 수량
    }
  },
  computed: {
    /**
     * 최대 구매 수량
     *
     * @returns {number} 최대 구매 수량
     */
    max () {
      return Number.isInteger(this.params.max) ? Number(this.params.max) : this.nMaxCount
    },
    /**
     * 1회 구매 제한 수량
     *
     * @returns {number} 1회 구매 제한 수량
     */
    nMaxCount () {
      return 99
    }
  },
  watch: {
    params (newVal, oldVal) {
      if (newVal.value !== oldVal.value) {
        this.value = Number(newVal.value)
      }
    }
  },
  methods: {
    /**
     * 수량 감소
     *
     */
    minus () {
      const fromValue = Number(this.value) // 현재 수량
      const toValue = fromValue - 1 // 감소될 수량

      if (toValue >= 1) { // 감소될 수량이 1 보다 같거나 크면 수량 감소
        if (this.max >= toValue) { // 감소할 수량이 max보다 같거나 작으면 수량 감소
          this.value = toValue
          this.$emit('change', this.value)
        } else if (this.max < toValue) { // 감소할 수량이 max보다 크면 수량 max로 설정
          this.$refs.quantity.value = this.max
          this.value = this.max
          this.$emit('change', this.max)
          this.maxToastAlert()
        }
      }
    },
    /**
     * 수량 증가
     *
     */
    plus () {
      // 바로구매 레이어 내부일 때는 옵션 수량의 합이 nMaxCount를 넘지 않았는지 체크함
      const $rightOrderLayer = this.$el.closest('#rightOrderOptionLayer')
      if ($rightOrderLayer) {
        const quantityInputs = Array.from($rightOrderLayer.querySelectorAll('input[id^=quantity_]'))
        if (quantityInputs.length > 0 && arraySum(quantityInputs.map(input => Number(input.value))) >= this.nMaxCount) {
          toastUtil.show(`1회 최대 ${this.nMaxCount}개 주문가능`)
          return
        }
      }

      const fromValue = Number(this.value) // 현재 수량
      const toValue = fromValue + 1 // 증가될 수량

      if (this.max >= toValue) { // 증가될 수량이 max보다 같거나 작으면 수량 증가
        this.value = toValue
        this.$emit('change', this.value)
      } else if (this.max < toValue) { // 증가될 수량이 max보다 크면 수량 max로 설정
        this.$refs.quantity.value = this.max
        this.value = this.max
        this.$emit('change', this.max)
        this.maxToastAlert()
      }
    },
    /**
     * 키 입력 검증
     *
     * @param {object} e (필수) keydown event
     */
    validChange (e) {
      const code = e.keyCode
      const ALLOW_KEYS = [
        COMM_CONST.KEY_CODE.BACK_SPACE,
        COMM_CONST.KEY_CODE.DELETE,
        COMM_CONST.KEY_CODE.LEFT,
        COMM_CONST.KEY_CODE.RIGHT
      ]

      // 방향기, 백스페이스, Del키,  숫자 외 입력 금지
      if (!ALLOW_KEYS.includes(code) && (code < COMM_CONST.KEY_CODE.NUM_0 || code > COMM_CONST.KEY_CODE.NUM_9)) {
        e.preventDefault()
      }
    },
    /**
     * 입력시 숫자를 제외한 값 제거 후 재할당
     *
     * @param {object} e (필수) keyup event
     */
    keyupNumber (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '')
    },
    /**
     * 수량 변경(debounced)
     *
     * @param {object} e (필수) input event
     */
    debouncedChange (e) {
      // debounce 적용
      debounce(() => {
        this.change(e)
      }, 300)()
    },
    /**
     * 수량 변경
     *
     * @param {object} e (필수) input event
     */
    change (e) {
      // 현재 수량
      const fromValue = Number(this.value)
      // 변경될 수량
      let toValue = Number(e.target.value)

      // 공백입력 시 return
      if (!e.target.value) {
        return
      }

      // 0으로 시작하는 수량 입력하거나, 한글 입력 시 이전 수량으로 원복
      if (e.target.value.startsWith('0') || Number.isNaN(toValue)) {
        e.target.value = fromValue
        return
      }

      // 현재 수량과 변경될 수량이 같으면 변경 처리 안함
      if (fromValue === toValue) {
        return
      }

      // 바로구매 레이어 내부일 때는 옵션 수량의 합이 nMaxCount를 넘지 않았는지 체크함
      const $rightOrderLayer = this.$el.closest('#rightOrderOptionLayer')
      if ($rightOrderLayer) {
        const quantityInputs = Array.from($rightOrderLayer.querySelectorAll('input[id^=quantity_]'))
        const sum = arraySum(quantityInputs.map(input => Number(input.value)))
        if (quantityInputs.length > 0 && sum >= this.nMaxCount) {
          // iOS 에서 키패드에 토스트 메시지 가려지는 현상을 수정하기 위해 포커스 아웃 시켜 키패드를 내림
          this.$refs.quantity.blur()

          toValue = this.nMaxCount - (sum - e.target.value) // 구매 가능 수량
          toastUtil.show(`1회 최대 ${this.nMaxCount}개 주문가능`)
        }
      }

      if (this.max >= toValue) { // 변경될 수량이 max보다 같거나 작으면 수량 증가
        this.$refs.quantity.value = toValue
        this.value = toValue
        this.$emit('change', toValue)
      } else { // 증가될 수량이 max보다 크면 수량 max로 설정
        this.$refs.quantity.value = this.max
        this.value = this.max
        this.$emit('change', this.max)
        this.maxToastAlert()
      }
    },
    /**
     * 빈 문자열 입력시 이전 수량으로 원복
     *
     * @param {object} e (필수) blur event
     */
    checkEmpty (e) {
      if (e.target.value.length === 0) {
        e.target.value = Number(this.value)
      }
    },
    /**
     * 최대 구매 가능 수량 도달 시 토스트 메시지
     *
     */
    maxToastAlert () {
      // iOS 에서 키패드에 토스트 메시지 가려지는 현상을 수정하기 위해 포커스 아웃 시켜 키패드를 내림
      this.$refs.quantity.blur()

      toastUtil.show(`1인 구매 가능한 수량은 ${this.max}개 입니다.`)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/QuantityInput";
</style>
