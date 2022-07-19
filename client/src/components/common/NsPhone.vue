<template>
  <div
    class="input_field phone"
    :class="[params.verification.isVerficationMode ? 'auth' : '']"
  >
    <label
      :for="inputPhone1"
      class="label_icon"
    >
      {{ params.title }}
    </label>
    <span class="input_group">
      <input
        :id="inputPhone1"
        ref="input"
        v-model="params.value"
        :type="getType"
        class="form text"
        :readonly="params.readonly"
        :disabled="params.disabled"
        :maxlength="params.maxlength"
        :title="params.title"
        :placeholder="params.placeholder"
        @input.stop="changeValue($event); resetVerificationState();"
        @click.stop="emitEvent"
        @keypress.stop="emitEvent"
        @keyup.stop="emitEvent"
        @focus.stop="emitEvent"
        @blur.stop="handleBlur($event); emitEvent($event);"
        @change.stop="emitEvent"
      >
      <!-- 삭제 버튼 표시 부분 -->
      <span class="btn_box">
        <button
          v-if="isDeleteButton && !params.verification.isVerficationMode"
          ref="clearButton"
          type="button"
          class="btn_delete"
          tabindex="-1"
          @click="clearInputData"
        >
          삭제
        </button>
      </span>
      <!-- 성공 체크 표시 표기 부분 -->
      <span
        v-if="params.isSuccess || params.verification.isSuccess"
        class="icons_check_success"
      />
      <!-- 에러메세지 표시 -->
      <p
        v-if="params.isError && !params.verification.isVerficationMode"
        class="error_msg"
        v-html="params.errorMessage"
      />
      <!-- 인증 코드 전송 버튼 -->
      <button
        v-if="params.verification.isVerficationMode && !params.verification.isSuccess"
        type="button"
        class="btn"
        tabindex="-1"
        @click="$emit('sendVerificationCode');"
      >
        <span>{{ params.verification.sendBtnName }}</span>
      </button>
    </span>
    <template v-if="params.verification.isVerficationMode">
      <span class="input_group">
        <label
          :for="inputPhone2"
          class="blind"
        >
          인증번호 확인
        </label>
        <input
          :id="inputPhone2"
          v-model="params.verification.value"
          type="number"
          class="form text auth"
          :readonly="params.verification.readonly"
          :disabled="params.verification.disabled"
          :title="params.verification.title"
          :maxlength="params.verification.maxlength"
          :placeholder="params.verification.placeholder"
        >
        <span v-show="!params.verification.isSuccess" class="auth_time">
          {{ params.verification.timeLimit }}
        </span>
        <button
          type="button"
          class="btn"
          tabindex="-1"
          @click="$emit('verifyCode', params.verification.value)"
        >
          <span>인증하기</span>
        </button>
      </span>
      <p
        v-if="params.verification.isSendCode && !params.verification.isError && !params.verification.isSuccess"
        class="default_msg"
      >
        {{ params.verification.sendMessage }}
      </p>
      <p
        v-if="params.verification.isError"
        class="error_msg"
      >
        {{ params.verification.errorMessage }}
      </p>
      <p
        v-if="params.verification.isSuccess"
        class="default_msg"
      >
        {{ params.verification.successMessage }}
      </p>
    </template>
  </div>
</template>

<script>
import {
  getUUID
} from '@utils/commonutil/commonUtil'
import inputMixin from '@/mixins/ui/inputMixin'

export default {
  name: 'NsPhoneInput',
  mixins: [
    inputMixin
  ],
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
      inputPhone1: '', // 웹접근성 고유ID를 위해 추가
      inputPhone2: '' // 웹접근성 고유ID를 위해 추가
    }
  },
  computed: {
    /**
     * 지우기 버튼 표시여부
     *
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
     *
     * @returns {string} string type
     */
    getType () {
      return this.params.type ? this.params.type : 'number'
    }
  },
  created () {
    // 웹접근성 고유ID를 위해 추가
    this.inputPhone1 = getUUID()
    this.inputPhone2 = getUUID()
  },
  methods: {
    /**
     * 삭제 버튼 클릭 시 input에 데이터를 삭제 한다.
     */
    clearInputData () {
      this.params.isError = false
      this.params.isSuccess = false
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

      this.$emit('input', this.params.value, e)
    },
    /**
     * 현재 발생 이벤트를 부모 객체로 전달한다
     *
     * @param {object} e
     */
    emitEvent (e) {
      this.$emit(e.type, e)
    },
    /**
     * 부모 컴포넌트 blur 콜백으로 인한 사이드 이펙트 방지용
     *
     * @param {object} e
     */
    handleBlur (e) {
      const clickedElement = e.relatedTarget

      /** 지우기 버튼 */
      const clearButtonRef = this.$refs.clearButton
      if (clearButtonRef === clickedElement) {
        this.clearInputData()
      }
    },
    /**
     * 인증 상태 초기화
     */
    resetVerificationState () {
      if (this.params.verification.isVerficationMode) {
        this.params.verification.value = ''
        this.params.verification.isVerficationMode = false
        this.params.verification.isSuccess = false
        this.params.verification.isError = false
        this.params.verification.isSendCode = false
        this.params.verification.timeLimit = ''
      }
    },
    /**
     * input 등을 object로 받아 숫자로만 이루어 졌는지 판단한다.
     * 기본적으로 숫자 이외의 값을 삭제하고 숫자만 다시 입력한다.
     *
     * @param {object} params input data
     */
    onKeyUpOnlyNumber (params) {
      // onKeyUpOnlyNumber(params)
    }
  }
}
</script>
