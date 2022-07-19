<template>
  <div class="member_modify_intro">
    <div v-show="isSnsRegisteredPwd" class="msg_box">
      <p class="msg">
        고객님의 개인정보를 안전하게 보호하기 위해<br>인증 후 변경이 가능합니다.
      </p>
    </div>
    <!-- SNS간편가입 회원중 비밀번호 미등록한 회원 -->
    <div v-show="!isSnsRegisteredPwd" class="msg_box">
      <p class="msg">
        소중한 개인정보보호를 위해<br><strong>비밀번호를 등록</strong>해주세요.
      </p>
      <p class="sub_msg">
        비밀번호를 등록하지 않을 경우,<br>NSmall 이용 및 주문, 결제 가능하나<br>일부 정보 관리 페이지 이용이 제한됩니다.
      </p>
    </div>
    <!-- 아이디, 비밀번호 입력 -->
    <div v-show="isSnsRegisteredPwd" class="input_box">
      <ns-input
        :params="idParams"
      />
      <ns-password
        :params="passwordParams"
      />
    </div>
    <!-- SNS간편가입 비밀번호 입력, 비밀번호 확인 -->
    <div v-show="!isSnsRegisteredPwd" class="input_box">
      <!-- 새 비밀번호 체크: default -->
      <ns-password
        :params="inputNewPwdParams"
        @input="passPress"
      />
      <!-- 새 비밀번호 동일여부 체크: default -->
      <ns-password
        :params="inputPwdConfirmParams"
        @input="passwordCompare"
      />
    </div>
    <button
      type="button"
      class="btn_confirm"
      @click="getSubmit"
    >
      <span>확인</span>
    </button>
  </div>
</template>

<script>
import NsInput from '@components/common/NsInput'
import NsPassword from '@components/customer/NsPassword'
import {
  isNull,
  isOsApp,
  validatePassword
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import cookieUtil from '@frameworks/cookieUtil'
import loginUtil from '@/common/utils/loginUtil'
import MEMBER_CONST from '@/common/constants/customer/member'
import nativeUtil from '@/common/frameworks/nativeUtil'

export default {
  components: {
    NsInput,
    NsPassword
  },
  props: {
    isNativeSetting: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isError: false,
      apiErrorMsg: '',
      entUserId: '',
      entFlag: '',
      failCnt: 0,
      idParams: {
        value: '',
        iconClass: 'id',
        title: MEMBER_CONST.MEMBER_TEXT.EMAILTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.LOGINIDPLACEHOLDER,
        maxlength: 40,
        isLabel: false,
        labelKind: 'label_icon',
        isSuccess: false,
        isError: false,
        disabled: true,
        errorMessage: ''
      },
      passwordParams: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 16,
        title: MEMBER_CONST.MEMBER_TEXT.PASSTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.PASSPLACEHOLDER,
        isLabel: false,
        labelKind: 'label_icon',
        isSuccess: false,
        isError: false,
        default_msg: '',
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS04
      },
      isSnsRegisteredPwd: true,
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
        defaultMessage: MEMBER_CONST.MEMBER_TEXT.PASS01,
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
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS03,
        referer: ''
      }
    }
  },
  created () {
    this.referer = this.$route.meta.refer
    this.initUserInfo()
  },
  methods: {
    /**
     * 화면 초기값 세팅
     *
     * @param
     * @returns
     */
    initUserInfo () {
      this.idParams.value = loginUtil.getUserInfo('logonId')
      this.entUserId = loginUtil.getUserInfo('entUserId')
      this.entFlag = loginUtil.getUserInfo('entFlag')
      this.snsPswMmt(loginUtil.getUserInfo('userId')).then(data => {
        if (!isNull(data.msg) && data.msg.root.isSuccess !== undefined) {
          const isRegisteredPwd = data.msg.root.isRegisteredPwd
          if (isRegisteredPwd === 'N') {
            this.isSnsRegisteredPwd = false
          }
        } else {
          this.isSnsRegisteredPwd = true
        }
      })
    },
    /**
     * SNS계정여부확인
     *
     * @param {string} nsId 회원메일ID
     * @returns {Promise<boolean>}
     */
    async snsPswMmt (nsId) {
      const invoke = {
        cmdType: 1,
        request_userId: nsId,
        entUserId: this.entUserId,
        entFlag: this.entFlag
      }

      return await this.$nsaxios.post('NSMobileSnsPswMgmt', invoke)
    },
    /**
     * 일반사용자 / SNS사용자 검증 분기처리
     *
     * @returns {void}
     */
    getSubmit () {
      if (this.isSnsRegisteredPwd) {
        this.checkPassword()
      } else {
        this.registerPassword()
      }
    },
    /**
     * 사용자 암호 검증 API호출
     *
     * @returns {boolean|void}
     */
    checkPassword () {
      this.passwordParams.value = this.passwordParams.value.replace(/ /gi, '')
      const pass = {}
      const txtPass = this.passwordParams.value.trim()
      pass.logonpassword = txtPass

      if (isNull(txtPass)) {
        this.passwordParams.isError = true
        this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS04
        this.passwordParams.value = ''

        return false
      }

      // 비밀번호 확인후 성공시 변경페이지로 이동
      const successHandling = response => {
        const result = response.passwordIdentify

        if (result === 'Y' || result === 'y') {
          // 쿠키 등록
          cookieUtil.setCookie('securityVerification', 'Y')

          this.$router.replace('/customer/info/modify')
          // this.$router.replace('/customer/info')
        } else {
          this.passwordParams.isError = true
          this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS05
          this.passwordParams.value = ''
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }
      this.$nsaxios.post('NSPasswordIdentifyAjaxCmd', pass, successHandling, errorHandling)
    },
    /**
     * SNS계정 초기 암호 validation검증
     * @returns {boolean}
     */
    registerPasswordValidation () {
      const inputNewPwd = this.inputNewPwdParams.value.trim()
      const inputPwdConfirm = this.inputPwdConfirmParams.value.trim()

      if (!this.isPasswordCheck) {
        return false
      } else if (isNull(inputNewPwd) || isNull(inputPwdConfirm)) {
        return false
      } else if (this.inputNewPwdParams.isError || this.inputPwdConfirmParams.isError) {
        return false
      } else {
        return true
      }
    },
    /**
     * SNS계정 초기 변경암호 저장
     *
     * @returns {boolean|void}
     */
    async registerPassword () {
      const inputNewPwd = this.inputNewPwdParams.value.trim()

      if (this.registerPasswordValidation()) {
        const params = {
          cmdType: 2,
          request_userId: loginUtil.getUserInfo('userId'),
          logonpassword: inputNewPwd,
          entUserId: this.entUserId,
          entFlag: this.entFlag
        }

        const successHandling = data => {
          if (data.msg.root.isSuccess === 'Y') {
            // 쿠키 등록
            cookieUtil.setCookie('securityVerification', 'Y')

            if (this.referer === 'mypageSetting' || this.isNativeSetting === 'true') {
              if (isOsApp()) {
                nativeUtil.closeWebView() // 설정으로 이동
              } else {
                this.$router.replace({ name: this.referer })
              }
            } else {
              this.$router.replace('/customer/info/modify')
              // this.$router.replace('/customer/info')
            }
          } else {
            messageUtil.alert(`${data.resultMsg} 비밀번호 등록을 실패했습니다.`)
          }
        }

        const errorHandling = () => {
          // 통신오류가 발생하면 최대 3번까지 재호출후 3회이상 오류난경우 통신오류 메세지팝업 호출한다.
          if (this.failCnt <= 3) {
            this.failCnt += 1
            this.registerPassword()
          } else {
            messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
          }
        }

        await this.$nsaxios.post('NSMobileSnsPswMgmt', params, successHandling, errorHandling)
      }
    },
    /**
     * SNS사용자 암호 Key Down이벤트
     *
     * @returns {void}
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
        this.inputNewPwdParams.isError = false
        this.isPasswordCheck = true
        this.inputNewPwdParams.errorMessage = this.pwdMsg
      } else {
        this.inputNewPwdParams.isError = true
        this.isPasswordCheck = false
        this.inputNewPwdParams.errorMessage = this.pwdMsg
      }
    },
    /**
     * SNS사용자 변경암호 검증
     *
     * @returns {void}
     */
    passwordCompare () {
      this.inputPwdConfirmParams.value = this.inputPwdConfirmParams.value.replace(/ /gi, '')
      const inputNewPwd = this.inputNewPwdParams.value.trim()
      const inputPwdConfirm = this.inputPwdConfirmParams.value.trim()

      if (inputNewPwd !== inputPwdConfirm) {
        this.inputPwdConfirmParams.isError = true
        this.isPasswordCheck = false
      } else {
        this.inputPwdConfirmParams.isError = false
        this.isPasswordCheck = true
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/info/MemberModifyIntro";
</style>
