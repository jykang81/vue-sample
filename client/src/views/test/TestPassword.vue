<template>
  <div>
    <ns-password
      :params="passwordParams"
      @input="resetSuccess(passwordParams);"
      @blur="validPassword(passwordParams);"
    />
    <h1>
      비밀번호: {{ passwordParams.value }}
    </h1>
    <button @click="setValidPassword(passwordParams);">
      유효 비밀번호 생성
    </button>

    <ns-password
      :params="passwordParams2"
      @input="resetSuccess(passwordParams2);"
      @blur="validPassword(passwordParams2);"
    />
    <h1>
      비밀번호: {{ passwordParams2.value }}
    </h1>
    <button @click="setValidPassword(passwordParams2);">
      유효 비밀번호 생성
    </button>
  </div>
</template>

<script>
import NsPassword from '@components/customer/NsPassword'

export default {
  components: {
    NsPassword
  },
  data () {
    return {
      passwordParams: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 16,
        title: '비밀번호',
        placeholder: '비밀번호를 입력하세요',
        isSuccess: false,
        isError: false,
        defaultMessage: '영문, 숫자, 특수문자 2가지 이상 조합 8~16자',
        errorMessage: '비밀번호는 8~16자 이내여야 합니다.'
      },
      passwordParams2: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 16,
        title: '비밀번호',
        placeholder: '비밀번호를 입력하세요',
        isSuccess: false,
        isError: false,
        defaultMessage: '영문, 숫자, 특수문자 2가지 이상 조합 8~16자',
        errorMessage: '비밀번호는 8~16자 이내여야 합니다.'
      }
    }
  },
  methods: {
    /**
     * 비밀번호 유효성 검사 상태 초기화
     *
     * @param {object} params
     * @param {boolean} params.isSuccess 비밀번호 유효성 상태
     */
    resetSuccess (params) {
      params.isSuccess = false
    },
    /**
     * 비밀번호 유효성 검사
     *
     * @param {object} params
     * @param {string} params.value 입력된 비밀번호
     * @param {boolean} params.isSuccess 비밀번호 유효성 상태
     * @param {boolean} params.isError 에러 발생 여부
     */
    validPassword (params) {
      const password = params.value.trim()
      const passwordLength = password.length

      if (passwordLength === 0) {
        params.isSuccess = false
        params.isError = false

        return
      }

      const isPasswordValid = passwordLength >= 8 && passwordLength <= 16

      if (isPasswordValid) {
        params.isSuccess = true
        params.isError = false
      } else {
        params.isSuccess = false
        params.isError = true
      }
    },
    /**
     * 유효 비밀번호 설정
     *
     * @param {object} params
     * @param {string} params.value 입력된 비밀번호
     */
    setValidPassword (params) {
      params.value = 'a'.repeat(8)
    }
  }
}
</script>
