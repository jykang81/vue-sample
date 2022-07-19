<template>
  <div
    class="input_field"
    :class="setInputClass"
  >
    <!-- 라벨 표기 부분 -->
    <label
      v-if="params.isLabel"
      :for="inputId"
      :class="params.labelKind"
    >{{ params.title }}</label>

    <span class="input_group">
      <input
        :id="inputId"
        ref="input"
        v-model="params.value"
        :type="getType"
        :class="setDisabledClass"
        :readonly="params.readonly"
        :disabled="params.disabled"
        :maxlength="params.maxlength"
        :title="params.title"
        :placeholder="params.placeholder"
        autocapitalize="off"
        @input.stop="changeValue"
        @click.stop="emitEvent"
        @keypress.stop="emitEvent"
        @keydown.stop="emitEvent"
        @keyup.stop="emitEvent"
        @focus.stop="emitEvent"
        @blur.stop="handleBlur($event); emitEvent($event);"
        @change="emitEvent"
      >
      <!-- 삭제 버튼 표시 부분 -->
      <span class="btn_box">
        <button
          v-show="isDeleteButton"
          ref="clearButton"
          tabindex="-1"
          type="button"
          class="btn_delete"
          @click="clearInputData"
        >
          삭제
        </button>
      </span>
      <!-- 성공 체크 표시 표기 부분 -->
      <span
        v-if="params.isSuccess"
        class="icons_check_success"
      />
    </span>
    <!-- 에러메세지 표시 -->
    <p
      v-if="params.isError"
      class="error_msg"
      v-html="params.errorMessage"
    />
  </div>
</template>

<script>
import {
  getUUID
} from '@utils/commonutil/commonUtil'

export default {
  name: 'NsInput',
  props: {
    // params
    params: {
      type: Object,
      required: true,
      default: null
    }
  },
  data () {
    return {
      inputId: '' // 웹접근성 고유ID를 위해 추가
    }
  },
  computed: {
    /**
     * icon 클래스 설정
     * @returns {string} string class
     */
    setInputClass () {
      let result = ''
      if (this.params.iconClass) {
        result = this.params.iconClass
      }
      if (this.isError) {
        result += ' has_error'
      }
      return result
    },
    /**
     * disabled 클래스 설정
     * @returns {string} string class
     */
    setDisabledClass () {
      let result = 'form text'
      if (this.params.defaultKeyboard === 'korea') {
        result += ' lang_ko'
      }
      if (this.params.disabled) {
        result += ' disabled'
      }
      return result
    },
    /**
     * 지우기 버튼 표시여부
     * @returns {boolean}
     */
    isDeleteButton () {
      let result = true
      if (
        this.params.value.length === 0 ||
        this.params.disabled ||
        this.params.readonly ||
        this.params.isSuccess
      ) {
        result = false
      }
      return result
    },
    /**
     * input type 설정용 getter
     * @returns {string} string type
     */
    getType () {
      return this.params.type ? this.params.type : 'email'
    }
  },
  created () {
    // 웹접근성 고유ID를 위해 추가
    this.inputId = getUUID()
  },
  methods: {
    /**
     * 삭제 버튼 클릭 시 input에 데이터를 삭제 한다.
     */
    clearInputData () {
      this.params.isSuccess = false
      this.params.isError = false
      this.params.value = ''
      this.$emit('input', this.params.value)

      this.$refs.input.focus()
    },
    /**
     * input의 값이 변경될때마다 부모의 이벤트를 호출
     *
     * @param {object} e
     */
    changeValue (e) {
      this.params.isSuccess = false
      this.params.value = e.target.value // chrome mobile 환경에서 v-model synchronize issue 대응
      this.$emit('input', this.params.value, e)
    },
    /**
     * 현재 발생 이벤트를 부모 객체로 전달한다
     *
     * @param {object} e
     */
    emitEvent (e) {
      // console.log(e)
      this.$emit(e.type, e)
    },
    /**
     * 부모 컴포넌트 focus 콜백으로 인한 사이드 이펙트 방지용
     *
     * @param {object} e
     */
    handleBlur (e) {
      const clearButtonRef = this.$refs.clearButton
      const clickedElement = e.relatedTarget

      if (clearButtonRef === clickedElement) {
        this.clearInputData()
      }
    }
  }
}
</script>
