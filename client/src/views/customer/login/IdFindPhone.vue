<template>
  <div class="id_find_phone">
    <div class="msg_box">
      <strong class="subject">
        휴대폰 인증으로 찾기
      </strong>
      <p class="msg">
        회원정보에 등록된 휴대폰 번호로 인증이 가능합니다.
      </p>
    </div>
    <!-- 이름 default -->
    <ns-input
      :params="userNameParams"
      @input="checkUserNameKeyUp($event, userNameParams)"
      @blur="checkUserName($event, userNameParams)"
    />
    <!-- 휴대전화 default -->
    <ns-input
      :params="userPhoneParams"
      @focus="onKeyUpOnlyNumber"
      @input="isPhonePattern($event, userPhoneParams);"
      @blur="checkPhone"
    />
    <button
      v-if="!isAuthSend"
      type="button"
      class="btn_send_phone"
      @click="sendVerificationCode"
    >
      <span>{{ authBtnName }}</span>
    </button>
    <!-- 인증번호 default -->
    <phone-auth
      v-show="isAuthSend"
      ref="phoneAuth"
      :phone-number="userPhoneParams.value"
      :phone-error="userPhoneParams.isError"
      :auth-type="authType"
      :user-name="userNameParams.value"
      :user-name-error="userNameParams.isError"
      :logon-id="logonId"
      @sendVerificationCode="handleSendVerificationCode"
      @checkVerificationCode="handleCheckVerificationCode"
    />
  </div>
</template>

<script>
import {
  isNull,
  onKeyUpOnlyNumber
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import NsInput from '@components/common/NsInput'
import inputMixin from '@/mixins/ui/inputMixin'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import MEMBER_CONST from '@/common/constants/customer/member'
import PhoneAuth from '@components/common/PhoneAuth'
import PHONE_AUTH_CONST from '@constants/customer/phoneAuth'

export default {
  name: 'IdFindPhone',
  components: {
    NsInput,
    PhoneAuth
  },
  mixins: [
    inputMixin,
    customerInputMixin
  ],
  data () {
    return {
      isAuthSend: false,
      authBtnName: MEMBER_CONST.MEMBER_TEXT.AUTHBTNNAME,
      authSendMsg: MEMBER_CONST.MEMBER_TEXT.AUTHSENDMSG,
      authSendErrorMsg: MEMBER_CONST.MEMBER_TEXT.PHONE10,
      message: MEMBER_CONST.MEMBER_TEXT.PHONE11,
      authMaxLength: 4,
      isSendCode: false,

      authNumber: '',
      userId: '',
      logonId: '',
      timeLimit: '0:00',
      userNameParams: {
        value: '',
        iconClass: 'user_name',
        title: MEMBER_CONST.MEMBER_TEXT.NAMETITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.NAMEPLACEHOLDER,
        maxlength: 10,
        isLabel: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.NAME04
      },
      userPhoneParams: {
        value: '',
        iconClass: 'phone',
        title: MEMBER_CONST.MEMBER_TEXT.PHONETITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.PHONEPLACEHOLDER02,
        maxlength: 11,
        type: 'tel',
        isLabel: false,
        disabled: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PHONE12
      },
      invoke: {},
      viewType: '',
      isSendButtonShow: true,
      authType: ''
    }
  },
  created () {
    this.viewType = this.$route.meta.pageKey

    this.onLoad()
  },
  activated () {
    this.viewType = this.$route.meta.pageKey

    this.onLoad()
  },
  deactivated () {
    this.userNameParams.value = ''
    this.userPhoneParams.value = ''
    this.isAuthSend = false

    // 입력 기본 에러메세지 초기화
    this.userNameParams.isError = false
    this.userNameParams.isSuccess = false
    this.userPhoneParams.isError = false
    this.userPhoneParams.isSuccess = false
    this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME04
    this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12
    this.$refs.phoneAuth.initState()
    this.authBtnName = MEMBER_CONST.MEMBER_TEXT.AUTHBTNNAME // 버튼명 초기화
  },
  methods: {
    /**
     * 초기 설정값 세팅
     *
     */
    onLoad () {
      /** 점유인증모듈 타입 설정 */
      if (this.viewType === 'PASS') {
        this.authType = PHONE_AUTH_CONST.AUTH_TYPE.FIND_PASSWORD
        if (!isNull(this.$route.params.logonId)) {
          this.logonId = this.$route.params.logonId
        }
      } else {
        this.authType = PHONE_AUTH_CONST.AUTH_TYPE.FIND_ID
      }
    },
    /**
     * 휴대폰번호입력 필드 타입변경
     */
    onKeyUpOnlyNumber () {
      this.userPhoneParams.type = 'tel'
      onKeyUpOnlyNumber(this.userPhoneParams)
    },
    /**
     * 핸드폰번호 입력값 체크
     *
     * @returns {boolean|void}
     */
    checkPhone () {
      const tel = this.userPhoneParams.value.trim().replace(/-/gi, '')

      this.userPhoneParams.isError = false
      // 입력된 핸드폰번호가 없으면 휴대폰번호 체크하지 않는다.
      if (tel.length === 0) {
        return false
      }

      // 핸드폰자리가 11자리 이하일 경우
      if (tel.length < 10) {
        this.userPhoneParams.isError = true
        this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12
        return false
      }

      this.userPhoneParams.type = 'text'
      const hpFirst = tel.substring(0, 3)
      const hpMid = tel.length === 10 ? tel.substring(3, 6) : tel.substring(3, 7)
      const hpLast = tel.length === 10 ? tel.substring(6) : tel.substring(7)
      this.userPhoneParams.value = `${hpFirst}-${hpMid}-${hpLast}`
    },
    /**
     * 휴대폰 점유인증 인증 모듈 호출
     */
    async sendVerificationCode () {
      const name = this.userNameParams.value
      const phoneNo = this.userPhoneParams.value.trim().replace(/-/gi, '')

      if (isNull(name)) {
        this.userNameParams.isError = true
        this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME04

        return
      }

      // 폰번호 유효성 체크
      if (isNull(phoneNo) || phoneNo.length < 10) {
        this.userPhoneParams.isError = true
        if (isNull(phoneNo)) {
          this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE13
        } else {
          this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12
        }

        return
      }

      this.userPhoneParams.isError = false
      this.$refs.phoneAuth.phoneError = false

      await this.$refs.phoneAuth.sendVerificationCode()
    },
    /**
     * 인증번호 전송 후처리
     *
     * @param {import('@components/ui/PhoneAuth.vue').resultObject} resultObject
     */
    handleSendVerificationCode (resultObject) {
      if (resultObject.response) {
        const res = resultObject.response.msg.root.Searchresult

        if (res.search_yn === 'N') {
          this.isAuthSend = false
          this.userPhoneParams.isError = true
          this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.AUTHSENDERRMSG
        } else {
          this.isAuthSend = true
          // this.authBtnName = MEMBER_CONST.MEMBER_TEXT.AUTHRESENDBTNNAME
        }
      }
    },
    /**
     * 인증번호 확인 후처리
     *
     * @param {import('@components/ui/PhoneAuth.vue').resultObject} resultObject
     */
    handleCheckVerificationCode (resultObject) {
      if (resultObject.response) {
        const res = resultObject.response.msg.root.Searchresult
        const searchYn = res.search_yn

        if (searchYn !== 'N') {
          const goingInvok = {
            name: '',
            params: {
              userId: '',
              logonId: '',
              search_Id: '',
              userNmae: ''
            }
          }

          if (this.viewType === 'PASS') {
            goingInvok.name = 'passComplete'
            goingInvok.params.userId = resultObject.response.userId
            goingInvok.params.logonId = resultObject.response.strLogonId
          } else {
            goingInvok.name = 'idFindComplete'
            goingInvok.params.search_Id = res.search_Id
            goingInvok.params.userName = res.name
          }

          this.$router.push(goingInvok)
        }
      } else {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/IdFindPhone";
</style>
