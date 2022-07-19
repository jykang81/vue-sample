<template>
  <div class="password_change_3th">
    <div class="msg_box">
      <h2 class="subject">
        <span class="user_id">{{ userName }} 고객님,</span> 개인정보보호를 위해<br>
        비밀번호를 변경해주세요.
      </h2>
      <p class="msg">
        NSmall은 고객님의 소중한 개인정보를
        보다 안전하게 관리하여 도용피해를 방지하고자
        3개월 이상 비밀번호를 변경하지 않은 고객님을
        대상으로 비밀번호 변경 캠페인을 시행합니다.
      </p>
    </div>
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
    <button
      type="button"
      class="btn_password_change"
      @click="chagePassword"
    >
      <span>비밀번호 변경</span>
    </button>
    <button
      type="button"
      class="btn_later_change"
      @click="laterChange"
    >
      <span>30일 후에 변경하기</span>
    </button>
    <ul class="msg_bullet_list">
      <li>영문 숫자 특수문자 2가지 이상 조합 8~16자</li>
      <li>아이디, 전화번호, 생일 등 개인정보와 관련된 것, 연속된 숫자/문자는 사용하지 않는 것이 좋습니다.</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import MEMBER_CONST from '@constants/customer/member'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import {
  isNull,
  validatePassword,
  isOsApp,
  isEmpty
} from '@utils/commonutil/commonUtil'
import cipherUtil from '@frameworks/cipherUtil'
import loginUtil from '@utils/loginUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import nativeUtil from '@frameworks/nativeUtil'
import NATIVE_CONST from '@constants/framework/native'

import NsPassword from '@components/customer/NsPassword'

import COMM_CONST from '@constants/framework/constants'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립

export default {
  components: {
    NsPassword
  },
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      isPasswordCheck: false,
      userName: '',
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
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS03
      },
      invoke: {},
      memberInfo: {},
      toast: false,
      message: MEMBER_CONST.MEMBER_TEXT.PASSWORD_CHANGE_SUCCESS
    }
  },
  computed: {
    ...mapGetters('login', ['getReturnRoute', 'getLoginParam'])
  },
  created () {
    if (isOsApp()) {
      console.log('ysjoo>>userId>>>', this.getLoginParam.memberInfo.userId)
      this.invoke.userId = isNull(this.getLoginParam.memberInfo.userId) ? '' : this.getLoginParam.memberInfo.userId
      this.invoke.logonId = isNull(this.getLoginParam.memberInfo.logonId) ? '' : this.getLoginParam.memberInfo.logonId
      this.userName = isNull(this.getLoginParam.memberInfo.userName) ? '' : this.getLoginParam.memberInfo.userName
      this.memberInfo = this.getLoginParam.memberInfo
    } else {
      this.invoke.userId = isNull(this.$route.params.memberInfo.userId) ? '' : this.$route.params.memberInfo.userId
      this.invoke.logonId = isNull(this.$route.params.memberInfo.logonId) ? '' : this.$route.params.memberInfo.logonId
      this.userName = isNull(this.$route.params.memberInfo.userName) ? '' : this.$route.params.memberInfo.userName
      this.memberInfo = this.$route.params.memberInfo
    }
  },
  methods: {
    ...mapMutations('login', ['resetReturnRoute, resetLoginParam']),
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
     * @returns {boolean|void}
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
            this.logout()
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
    },
    /**
     * 30일 동안 변경대상 유예처리 로컬스토리지에 저장
     *
     * @returns {void}
     */
    laterChange () {
      const endDate = calcDate('', 0, 0, 0, 30, 'yyyyMMdd')
      localStorageUtil.set(`passChk_${this.memberInfo.logonId}`, endDate)

      loginUtil.login(this.memberInfo) // 최종 세션스토리지에 저장
      if (isOsApp()) { // APP
        // Native에 멤버정보전달
        // nativeUtil.setLoginMemberInfo(JSON.stringify(this.memberInfo))

        // 마케팅 스크립트
        // AIQUA User Profile
        // 간헐적으로 전송이 안되는 경우 때문에 추가한 부분
        marketingUtil.aiquaLogger.send({
          type: marketingUtil.aiquaLogger.USER_PROFILE,
          data: {
            userId: this.memberInfo.custNum,
            name: '', // this.memberInfo.userName,
            email: '', // this.memberInfo.email,
            phoneNumber: '',
            birthday: '',
            gender: '',
            loginStatus: 'Y',
            devicePushAgree: '',
            notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
            isEmployee: this.memberInfo.staffBnft,
            level: this.memberInfo.gradeNm,
            coCd: COMM_CONST.getCocd(),
            lastLogin: '' // qg_fileter_last_login 값
          }
        })

        let returnRoute = {}
        const loginRedirectPath = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH)
        if (!isNull(loginRedirectPath)) {
          returnRoute = window.returnRoute
        } else if (!isNull(this.getReturnRoute)) {
          returnRoute = this.getReturnRoute
        }

        if (!isEmpty(returnRoute)) {
          this.$router.replace(returnRoute).then(() => {
            //  초기화
            this.resetReturnRoute()
            this.resetLoginParam()
            this.$store.commit('login/resetReturnRoute')
            this.$store.commit('login/resetLoginParam')
            localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH)
          })
        } else {
          nativeUtil.closeWebView()
        }
      } else {
        this.$router.replace(this.getReturnRoute)
        this.resetReturnRoute()
        if (isOsApp()) {
          this.$store.commit('login/resetLoginParam')
        }
      }
    },
    /**
     * 로그아웃 후 로그인페이지로 보내는 함수
     *
     * @returns {void}
     */
    async logout () {
      if (loginUtil.isLoggedIn) {
        await loginUtil.logout('/customer/login/regular-member').then(() => {
          toastUtil.show(this.message)
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/PasswordChange3th";
</style>
