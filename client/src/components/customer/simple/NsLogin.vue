<template>
  <div class="ns_login">
    <div class="msg_box">
      <p class="msg">
        고객님의 개인정보를 안전하게 보호하기 위해 NSmall 비밀번호 인증 후 변경이 가능합니다.
      </p>
    </div>
    <!-- 아이디, 비밀번호 입력 -->
    <div class="input_box">
      <ns-input
        :params="idParams"
      />
      <ns-password
        :params="passwordParams"
      />
    </div>
    <button
      type="button"
      class="btn_confirm"
      @click="checkPassword"
    >
      <span>확인</span>
    </button>
  </div>
</template>

<script>
import NsInput from '@components/common/NsInput'
import NsPassword from '@components/customer/NsPassword'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@/common/utils/loginUtil'
import MEMBER_CONST from '@/common/constants/customer/member'

export default {
  components: {
    NsInput,
    NsPassword
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isError: false,
      apiErrorMsg: '',
      entUserId: '',
      entFlag: '',
      idParams: {
        value: '',
        iconClass: 'id',
        title: MEMBER_CONST.MEMBER_TEXT.EMAILTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.LOGINIDPLACEHOLDER,
        maxlength: 40,
        isLabel: true,
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
        isLabel: 'true',
        labelKind: 'label_icon',
        isSuccess: false,
        isError: false,
        default_msg: '',
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS04
      },
      isPasswordCheck: false
    }
  },
  created () {
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
      const resultData = {
        isNsLoginData: false
      }
      pass.logonpassword = txtPass

      if (isNull(txtPass)) {
        this.passwordParams.isError = true
        this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS04
        this.passwordParams.value = ''

        return false
      }

      // 비밀번호 확인후 성공시 ID와 암호 부모창에 보냄
      const successHandling = response => {
        const result = response.passwordIdentify

        if (result === 'Y' || result === 'y') {
          resultData.logonId = loginUtil.logonId()
          resultData.logonPassword = txtPass
          resultData.isNsLoginData = true
          this.$store.commit('popup/hide', resultData)
        } else {
          this.passwordParams.isError = true
          this.passwordParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PASS05
          this.passwordParams.value = ''
          return false
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }
      this.$nsaxios.post('NSPasswordIdentifyAjaxCmd', pass, successHandling, errorHandling)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/customer/simple/NsLogin";
</style>
