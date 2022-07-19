<template>
  <div
    class="input_field password"
    :class="[isPasswordShowing ? 'show_hide' : '']"
  >
    <!--레이블 표기 부분 -->
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
        type="password"
        class="form text"
        :readonly="params.readonly"
        :disabled="params.disabled"
        :maxlength="params.maxlength"
        :title="params.title"
        :placeholder="params.placeholder"
        @input.stop="changeValue"
        @click.stop="emitEvent"
        @keypress.stop="emitEvent"
        @focus.stop="handleFocus($event); emitEvent($event)"
        @blur.stop="handleFocus($event); handleBlur($event); emitEvent($event)"
        @change.stop="emitEvent"
        @focusin.stop="handleFocus($event); emitEvent($event)"
      >
      <!-- 비밀번호 평문 표시 -->
      <span
        v-if="isPasswordShowing"
        class="show_text"
      >{{ params.value }}</span>
      <span class="btn_box">
        <!-- 삭제 버튼 표시 부분 -->
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
        <!-- 비밀번호 보기/숨기기 버튼 -->
        <button
          v-show="!isInitialState && (isFocused || !params.isSuccess)"
          ref="togglePasswordButton"
          type="button"
          class="btn_show_hide"
          tabindex="-1"
        >
          <span
            ref="showPassword"
            class="btn show"
            :style="[isPasswordShowing ? styleButtonHide : '']"
            @click="setShowingPassword(true)"
          >
            보기
          </span>
          <span
            ref="hidePassword"
            class="btn hide"
            :style="[isPasswordShowing ? '' : styleButtonHide]"
            @click="setShowingPassword(false)"
          >
            숨기기
          </span>
        </button>
      </span>
      <!-- 성공 체크 표시 표기 부분 -->
      <span
        v-if="params.isSuccess && !isFocused"
        class="icons_check_success"
      />
    </span>
    <!-- 안내 메시지 -->
    <p
      v-show="isDefaultMessageVisible"
      class="default_msg"
      v-html="params.defaultMessage"
    />
    <!-- 에러 메시지 -->
    <p
      v-show="params.isError"
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
  name: 'NsPassword',
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
      isPasswordShowing: false,
      styleButtonHide: { display: 'none' },
      isFocused: false,
      inputId: '', // 웹접근성 고유ID를 위해 추가
      focusTimerId: null // focus timer 갱신용
    }
  },
  computed: {
    /**
     * 지우기 버튼 표시여부
     * @returns {Boolean}
     */
    isDeleteButton () {
      let result = true
      const hasSuccess = this.params.isSuccess !== undefined
      if (
        this.params.value.length === 0 ||
        this.params.disabled ||
        this.params.readonly ||
        (hasSuccess && !this.isFocused && this.params.isSuccess)
      ) {
        result = false
      }
      return result
    },
    /**
     * 컴포넌트 initial state 확인
     * @returns {Boolean}
     */
    isInitialState () {
      return this.params.value.length === 0
    },
    isDefaultMessageVisible () {
      return !this.params.isError && this.params.defaultMessage
    }
  },
  watch: {
    params: {
      deep: true,

      handler ({ value }) {
        if (value.length === 0) {
          this.isPasswordShowing = false
        }
      }
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
      this.params.isError = false
      this.params.isSuccess = false
      this.params.value = ''
      this.$emit('input', this.params.value)

      this.$refs.input.focus()
      this.isPasswordShowing = false
    },
    /**
     * input 값이 변경될 때마다 emit
     * @param {Event} e
     */
    changeValue (e) {
      this.params.isSuccess = false
      this.params.value = e.target.value // safari 대응 (양방향 바인딩 지연)
      this.$emit('input', this.params.value, e)
    },
    /**
     * 현재 발생 이벤트를 부모 객체로 전달한다
     * @param {Event} e
     */
    emitEvent (e) {
      this.$emit(e.type, e)
    },
    /**
     * 부모 컴포넌트 focus 콜백으로 인한 사이드 이펙트 방지용
     * @param {Event} e
     */
    handleBlur (e) {
      const clickedElement = e.relatedTarget

      /** 지우기 버튼 */
      const clearButtonRef = this.$refs.clearButton
      if (clearButtonRef === clickedElement) {
        this.clearInputData()
        return
      }

      /** 비밀번호 보기/숨김 버튼 */
      const togglePasswordButton = this.$refs.togglePasswordButton
      if (togglePasswordButton === clickedElement) {
        const childNodes = togglePasswordButton.childNodes
        let currentShowing = null
        for (const childNode of childNodes) {
          if (childNode.style.display !== 'none') {
            currentShowing = childNode
          }
        }

        /** 비밀번호 보기 */
        const showPasswordButtonRef = this.$refs.showPassword
        if (showPasswordButtonRef === currentShowing) {
          this.setShowingPassword((true))
          this.$refs.input.focus()
          return
        }

        /** 비밀번호 숨김 */
        const hidePasswordRef = this.$refs.hidePassword
        if (hidePasswordRef === currentShowing) {
          this.setShowingPassword((false))
          this.$refs.input.focus()
        }
      }
    },
    /**
     * 비밀번호 보기/숨김 처리
     * @param {Boolean} bool 비밀번호 표시 상태
     */
    setShowingPassword (bool) {
      this.isPasswordShowing = bool
      this.$refs.input.focus() // iOS 대응용
    },
    /**
     * input focus 여부 감지
     * @param {Event} event
     */
    handleFocus (event) {
      const FOCUS_OUT = 'blur'
      const FOCUS_IN = 'focusin'

      const eventType = event.type

      if (FOCUS_OUT === eventType) {
        // iOS 대응용 timeout 설정
        this.focusTimerId = setTimeout(() => {
          this.isFocused = false
        }, 200)
      } else if (FOCUS_IN === eventType) {
        if (this.focusTimerId) {
          clearTimeout(this.focusTimerId)
          this.focusTimerId = null
        }

        this.isFocused = true
      }
    }
  }
}
</script>
