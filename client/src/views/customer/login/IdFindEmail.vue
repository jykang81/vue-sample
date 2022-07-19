<template>
  <div class="id_find_email">
    <div class="msg_box">
      <strong class="subject">
        이메일 인증으로 찾기
      </strong>
      <p class="msg">
        회원정보에 등록된 이메일 주소로 인증이 가능합니다.
      </p>
    </div>
    <!-- 이름 default -->
    <ns-input
      :params="userNameParams"
      @input="checkUserNameKeyUp($event, userNameParams)"
      @blur="checkUserName($event, userNameParams)"
    />
    <!-- 이메일 default -->
    <div class="dropdown_wrap">
      <ns-input
        :params="userEmailParams"
        @input="checkEmail"
        @blur="checkMoveTarget($event);emailCheck();"
      />
      <ul
        v-if="isActive"
        id="domainList"
      >
        <li
          v-for="(data, key) in emailList"
          :key="key"
          @click="changeValue(data[0], data[1])"
        >
          <span class="user_id">{{ data[0] }}</span>{{ data[1] }}
        </li>
      </ul>
    </div>
    <button
      v-if="!isAuthSend"
      type="button"
      class="btn_send_mail"
      @click="sendVerificationCodeEmail"
    >
      <span>{{ authBtnName }}</span>
    </button>
    <!-- 인증번호 default -->
    <email-auth
      v-show="isAuthSend"
      ref="emailAuth"
      :email="userEmailParams.value"
      :email-error="userEmailParams.isError"
      :auth-type="emailAuthType"
      :user-name="userNameParams.value"
      :user-name-error="userNameParams.isError"
      @sendVerificationCode="handleSendVerificationCodeEmail"
      @checkVerificationCode="handleCheckVerificationCodeEmail"
      @validateStateOfProps="handleValidateStateOfProps"
    />
  </div>
</template>

<script>
import {
  isNull,
  isEmail
} from '@utils/commonutil/commonUtil'
import NsInput from '@components/common/NsInput'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import MEMBER_CONST from '@/common/constants/customer/member'
import EmailAuth from '@components/customer/EmailAuth'
import EMAIL_AUTH_CONST from '@/common/constants/customer/emailAuth'

export default {
  name: 'IdFindEmail',
  components: {
    NsInput,
    EmailAuth
  },
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      isAuthSend: false,
      isAuthSendError: false,
      isAuthSendSuccess: false,
      authBtnName: EMAIL_AUTH_CONST.BUTTON_NAME,
      authSendMsg: MEMBER_CONST.MEMBER_TEXT.AUTHSENDMSG,
      authSendErrorMsg: MEMBER_CONST.MEMBER_TEXT.PHONE10,
      message: MEMBER_CONST.MEMBER_TEXT.PHONE11,
      isSendCode: false,
      isDisabled: false,
      authNumber: '',
      userId: '',
      logonId: '',
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
      userEmailParams: {
        value: '',
        iconClass: 'id',
        title: MEMBER_CONST.MEMBER_TEXT.EMAIL06,
        placeholder: MEMBER_CONST.MEMBER_TEXT.EMAIL07,
        maxlength: 40,
        isLabel: false,
        disabled: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.EMAIL09
      },
      emailDomainList: [
        'naver.com',
        'hanmail.net',
        'nate.com',
        'gmail.com',
        'daum.net',
        'hotmail.com',
        'yahoo.co.kr',
        'lycos.co.kr',
        'dreamwiz.com',
        'korea.com'
      ],
      invoke: {},
      viewType: '',
      emailList: [],
      searchQuery: '',
      isActive: false,
      emailAuthType: EMAIL_AUTH_CONST.AUTH_TYPE.FIND_ID
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
    this.userEmailParams.value = ''
    this.logonId = ''
    this.isAuthSend = false

    // 입력 기본 에러메세지 초기화
    this.userNameParams.isError = false
    this.userNameParams.isSuccess = false
    this.userEmailParams.isError = false
    this.userEmailParams.isSuccess = false
    this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME04
    this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL09
    this.$refs.emailAuth.initState()
    this.authBtnName = EMAIL_AUTH_CONST.BUTTON_NAME // 버튼명 초기화
  },
  mounted () {
    window.addEventListener('click', this.windowListenerCallback)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.windowListenerCallback)
  },
  methods: {
    /**
     * 초기 설정값 세팅
     *
     */
    onLoad () {
      if (this.viewType === 'PASS') {
        if (!isNull(this.$route.params.logonId)) {
          this.logonId = this.$route.params.logonId
        }
      }

      if (!isNull(this.logonId)) {
        if (isEmail(this.logonId)) {
          this.userEmailParams.value = this.logonId
        }
      }
    },
    /**
     * window 이벤트 콜백
     *
     * @param {object} e click 이벤트
     */
    windowListenerCallback (e) {
      const pathArray = e.composedPath()
      let checkUi = true

      pathArray.forEach(element => {
        const elementId = element.id

        if (elementId === 'domainList') {
          checkUi = false
        }
      })

      if (checkUi) {
        this.closeUi()
      }
    },
    /**
     * 도메인 목록 초기화후 닫기
     */
    closeUi () {
      this.isActive = false
    },
    /**
     * 포커스를 잃을경우 도메인리스트 노출하지 않는다.
     *
     * @param {object} e blur 이벤트
     */
    checkMoveTarget (e) {
      const relatedTarget = e.relatedTarget

      if (!isNull(relatedTarget)) {
        this.closeUi()
      }
    },
    /**
     * E-Mail ID 형식 체크 및 메일도메인처리 함수
     *
     * @param {string} value input 값
     * @param {Event} event 이벤트 객체
     * @returns {Boolean}
     */
    checkEmail (value, event) {
      // 한글입력 막기
      const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

      if (reg.exec(this.userEmailParams.value) !== null) {
        this.userEmailParams.value = this.userEmailParams.value.slice(0, -1)
        event.target.value = this.userEmailParams.value // chrome mobile 대응
        return false
      }
      if (this.userEmailParams.value.length >= this.userEmailParams.maxlength) {
        this.userEmailParams.value = this.userEmailParams.value.slice(0, this.userEmailParams.maxLength - 1)
        event.target.value = this.userEmailParams.value // chrome mobile 대응
        this.userEmailParams.isError = true
        this.userEmailParams.errorMessage = `40${MEMBER_CONST.MEMBER_TEXT.MESSAGE_MAXLENGTH_OVER}`
        return false
      } else {
        this.userEmailParams.isError = false
        this.userEmailParams.value = this.userEmailParams.value.replace(/ /gi, '')
        const loginId = this.userEmailParams.value

        const validationPattern = /[^a-zA-Z0-9-_.@]/.test(loginId)
        if (validationPattern) {
          this.userEmailParams.value = loginId.slice(0, -1)
          event.target.value = this.userEmailParams.value // chrome mobile 대응
          return false
        }
      }

      this.getEmailAuto(this.userEmailParams) // 도메인 목록처리
    },
    /**
     * ID의 형식체크 함수
     * E-Mail 또는 일반ID인지 확인한다.
     *
     * @returns {Boolean}
     */
    emailCheck () { /* id의 EMail형식 체크 */
      const notEmailRegExp = /^[a-zA-Z0-9._-]/i
      const id = this.userEmailParams.value.trim()
      let notEmailRegChk = true

      if (isNull(id)) {
        this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL09
        this.userEmailParams.isError = true
        return false
      } else {
        for (let i = 0; i < id.length; i++) {
          if (!isNull(id.charAt(i)) && !notEmailRegExp.test(id.charAt(i))) {
            notEmailRegChk = false
            break
          }
        }

        if (!isEmail(id) && !notEmailRegChk) {
          this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL01
          this.userEmailParams.isError = true
          return false
        } else {
          this.userEmailParams.errorMessage = ''
          this.userEmailParams.isError = false
          return true
        }
      }
    },
    /**
     * 이메일 도메인셋팅
     *
     * @param {String} id 이메일아이디
     * @param {String} domain 도메인
     */
    changeValue (id, domain) {
      this.isActive = false
      this.userEmailParams.value = id.trim() + domain
      this.emailCheck()
    },
    /**
     * 이메일 인증 모듈 호출
     */
    async sendVerificationCodeEmail () {
      const userName = this.userNameParams.value
      const email = this.userEmailParams.value.toLowerCase()

      if (isNull(userName) && isNull(email)) {
        this.userNameParams.isError = true
        this.userEmailParams.isError = true
        this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME04
        this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL09

        return
      } else {
        if (isNull(userName)) {
          this.userNameParams.isError = true
          this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME04

          return
        }
        // 메일주소 유효성 체크
        if (isNull(email)) {
          this.userEmailParams.isError = true
          this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL09

          return
        }
      }

      if (!isEmail(email)) {
        this.userEmailParams.isError = true
        this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL01

        return
      }

      if (this.viewType === 'PASS') {
        this.emailAuthType = EMAIL_AUTH_CONST.AUTH_TYPE.FIND_PASSWORD
      } else {
        this.emailAuthType = EMAIL_AUTH_CONST.AUTH_TYPE.FIND_ID
      }
      await this.$nextTick(() => {})

      await this.$refs.emailAuth.sendVerificationCode() // 이메일 인증번호 발송
    },
    /**
     * 이메일 인증번호 발송 후처리
     *
     * @param {import('@components/ui/EmailAuth.vue').resultObject}
     */
    handleSendVerificationCodeEmail (resultObject) {
      if (resultObject.response) {
        const res = resultObject.response.msg.root.Searchresult

        if (res.search_yn === 'N') {
          this.isAuthSend = false
          this.userEmailParams.isError = true
          this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL08
        } else {
          this.isAuthSend = true
          this.isAuthSendSuccess = true
          this.userEmailParams.isError = false
        }
      }
    },
    /**
     * 이메일 인증번호 확인 후처리
     *
     * @param {import('@components/ui/EmailAuth.vue').resultObject}
     */
    handleCheckVerificationCodeEmail (resultObject) {
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
              userName: ''
            }
          }

          if (this.viewType === 'PASS') {
            goingInvok.name = 'passComplete'
            goingInvok.params.userId = resultObject.response.userId
            goingInvok.params.logonId = resultObject.response.email1
          } else {
            goingInvok.name = 'idFindComplete'
            goingInvok.params.search_Id = res.search_Id
            goingInvok.params.userName = res.name
          }

          this.$router.push(goingInvok)
        }
      }
    },
    /**
     * 이메일 인증 모듈 prop(고객명 및 이메일) 에러 처리
     */
    handleValidateStateOfProps () {
      const userName = this.userNameParams.value
      const email = this.userEmailParams.value.toLowerCase()

      if (isNull(userName)) {
        this.userNameParams.isError = true
        this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME04

        return
      }

      if (isNull(email)) {
        this.userEmailParams.isError = true
        this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL09
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/IdFindEmail";
</style>
