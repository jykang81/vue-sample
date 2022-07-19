<template>
  <div class="password_change">
    <div class="msg_box">
      <strong class="subject">
        새로운 비밀번호를 입력해주세요.
      </strong>
      <p class="msg">
        8~16자의 영문, 숫자, 특수문자 중 2가지 이상 조합
      </p>
    </div>
    <!-- 새 비밀번호 체크: default -->
    <ns-password
      :params="inputNewPwdParams"
      @input="passPress"
    />
    <!-- 새 비밀번호 도일여부 체크: default -->
    <ns-password
      :params="inputPwdConfirmParams"
      @input="passwordCompare"
    />
    <button
      type="button"
      class="btn_confirm"
      @click="chagePassword"
    >
      <span>확인</span>
    </button>
  </div>
</template>

<script>
import {
  isNull,
  validatePassword
} from '@utils/commonutil/commonUtil'
import cipherUtil from '@frameworks/cipherUtil'
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import NsPassword from '@components/customer/NsPassword'
import MEMBER_CONST from '@/common/constants/customer/member'

export default {
  name: 'PasswordChange',
  components: {
    NsPassword
  },
  data () {
    return {
      isPasswordCheck: false,
      inputNewPwdParams: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 16,
        title: MEMBER_CONST.MEMBER_TEXT.PASSCHANGETITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.PASSCHANGEPLACEHOLDER,
        isLabel: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        defaultMessage: '',
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS02
      },
      inputPwdConfirmParams: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 16,
        title: MEMBER_CONST.MEMBER_TEXT.PASSCHANGECONFIRMTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.PASSCHANGECONFIRMPLACEHOLDER,
        isLabel: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        defaultMessage: '',
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS03
      },
      invoke: {},
      toast: false,
      message: MEMBER_CONST.MEMBER_TEXT.PASSWORD_CHANGE_SUCCESS
    }
  },
  created () {
    this.invoke.userId = isNull(this.$route.params.userId) ? '' : this.$route.params.userId[0]
    this.invoke.logonId = isNull(this.$route.params.logonId) ? '' : this.$route.params.logonId[0]
  },
  activated () {
    this.invoke.userId = isNull(this.$route.params.userId) ? '' : this.$route.params.userId[0]
    this.invoke.logonId = isNull(this.$route.params.logonId) ? '' : this.$route.params.logonId[0]
  },
  deactivated () {
    this.inputNewPwdParams.value = ''
    this.inputPwdConfirmParams.value = ''
    this.isAuthSend = false

    // 입력 기본 에러메세지 초기화
    this.inputNewPwdParams.isError = false
    this.inputNewPwdParams.isSuccess = false
    this.inputPwdConfirmParams.isError = false
    this.inputPwdConfirmParams.isSuccess = false
    this.inputNewPwdParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS02
    this.inputPwdConfirmParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS03
  },
  methods: {
    /**
     * 암호 Key Down이벤트
     */
    passPress () {
      this.inputNewPwdParams.value = this.inputNewPwdParams.value.replace(/ /gi, '')
      const validPassword = validatePassword(this.inputNewPwdParams.value.trim())

      this.pwdGradeCode = validPassword.validStatus // 비밀번호 안전 등급
      this.pwdMsg = validPassword.validMsg // 비밀번호 유효성 검사 메시지

      const inputPwdConfirm = this.inputPwdConfirmParams.value.trim()
      if (!isNull(inputPwdConfirm)) {
        this.passwordCompare()
      }

      if (this.pwdGradeCode === '00') {
        this.inputNewPwdParams.isSuccess = true
        this.inputNewPwdParams.isError = false
        this.isPasswordCheck = true
        this.inputNewPwdParams.errorMessage = this.pwdMsg
      } else {
        this.inputNewPwdParams.isSuccess = false
        this.inputNewPwdParams.isError = true
        this.isPasswordCheck = false
        this.inputNewPwdParams.errorMessage = this.pwdMsg
      }
    },
    /**
     * 변경암호 검증
     */
    passwordCompare () {
      this.inputPwdConfirmParams.value = this.inputPwdConfirmParams.value.replace(/ /gi, '')
      const inputNewPwd = this.inputNewPwdParams.value.trim()
      const inputPwdConfirm = this.inputPwdConfirmParams.value.trim()

      if (inputNewPwd !== inputPwdConfirm) {
        this.inputPwdConfirmParams.isSuccess = false
        this.inputPwdConfirmParams.isError = true
        this.isPasswordCheck = false
      } else {
        this.inputPwdConfirmParams.isSuccess = true
        this.inputPwdConfirmParams.isError = false
        this.isPasswordCheck = true
      }
    },
    /**
     * 암호변경 API호출
     *
     * @returns {void|boolean}
     */
    chagePassword () {
      const inputNewPwd = this.inputNewPwdParams.value.trim()
      const inputPwdConfirm = this.inputPwdConfirmParams.value.trim()

      if (isNull(inputNewPwd)) {
        this.inputNewPwdParams.isError = true
        this.inputNewPwdParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS02
        return false
      }
      if (!this.isPasswordCheck) {
        this.inputPwdConfirmParams.isError = true
        this.inputPwdConfirmParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS03
        return false
      } else {
        if (isNull(inputPwdConfirm)) {
          this.inputPwdConfirmParams.isError = true
          this.inputPwdConfirmParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS03
          return false
        }

        if (this.inputNewPwdParams.isError || this.inputPwdConfirmParams.isError) {
          this.inputPwdConfirmParams.isError = true
          this.inputPwdConfirmParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS06
          return false
        }

        this.invoke.userPwd = inputNewPwd
        this.invoke.accptPath = '500'
        this.invoke.accptPathCd = '500'
        this.invoke.catalogId = '97001'
        this.invoke.req_co_cd = '110'

        const parmas = cipherUtil.encryptValue(JSON.stringify(this.invoke))

        const successHandling = response => {
          const chgYn = response.msg.root.Searchresult.change_yn
          if (chgYn === 'Y') {
            toastUtil.show(this.message)
            this.$router.push('/customer/login/regular-member')
          } else {
            const failMsg = response.msg.root.Searchresult.validMsg

            this.inputNewPwdParams.isSuccess = false
            this.inputNewPwdParams.isError = true
            this.inputNewPwdParams.errorMessage = failMsg
          }
        }
        const errorHandling = () => {
          messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
        }

        this.$nsaxios.post('NSMobPWChangeCmdReal', { param: parmas }, successHandling, errorHandling)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/PasswordChange";
</style>
