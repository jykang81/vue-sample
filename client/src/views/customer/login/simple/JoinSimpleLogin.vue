<template>
  <div class="join_simple_login">
    <div
      v-if="param.entFlag === 'NAVER'"
      class="join_simple_login_guide"
    >
      <i class="icons_naver" />
      <strong class="subject">네이버 계정 인증이 완료되었습니다.</strong>
      <p class="msg">
        NSmall 아이디와 연결하여 간편하게 로그인하세요.
      </p>
    </div>
    <div
      v-if="param.entFlag === 'KAKAO'"
      class="join_simple_login_guide"
    >
      <i class="icons_kakao" />
      <strong class="subject">카카오 계정 인증이 완료되었습니다.</strong>
      <p class="msg">
        NSmall 아이디와 연결하여 간편하게 로그인하세요.
      </p>
    </div>
    <div
      v-if="param.entFlag === 'PAYCO'"
      class="join_simple_login_guide"
    >
      <i class="icons_payco" />
      <strong class="subject">페이코 계정 인증이 완료되었습니다.</strong>
      <p class="msg">
        NSmall 아이디와 연결하여 간편하게 로그인하세요.
      </p>
    </div>
    <div
      v-if="param.entFlag === 'FACEBOOK'"
      class="join_simple_login_guide"
    >
      <i class="icons_facebook" />
      <strong class="subject">페이스북 계정 인증이 완료되었습니다.</strong>
      <p class="msg">
        NSmall 아이디와 연결하여 간편하게 로그인하세요.
      </p>
    </div>
    <div class="dropdown_wrap">
      <!-- 아이디 Area -->
      <ns-input
        :params="idParams"
        @input="idHangelCheck"
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
    <ns-password
      :params="passwordParams"
      @input="loginValidation"
    />
    <div
      v-if="autoInputPrevention"
      class="captcha"
    >
      <p class="captcha_txt">
        안전한 로그인을 위해 아래 보안문자를 입력해 주세요.
      </p>
      <keep-alive>
        <component
          :is="currentComponent"
          @matchNaverCaptcha="getCaptchaProc"
          @changeCaptchaComponent="getCaptchaType"
          @noticeCaptchaActivation="handleNoticeCaptchaActivation"
        />
      </keep-alive>
    </div>
    <div class="login_util">
      <button
        type="button"
        class="btn_linkage"
        @click="toLogon"
      >
        <span>연결하기</span>
      </button>
      <div class="login_link">
        <router-link
          class="btn_find_id"
          :to="{ name : 'findUserId' }"
          replace
        >
          <span>아이디 찾기</span>
        </router-link>
        <router-link
          class="btn_find_password"
          :to="{ name : 'checkId' }"
          replace
        >
          <span>비밀번호 찾기</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import LOGIN_CONST from '@constants/customer/login'
import MEMBER_CONST from '@constants/customer/member'
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import bizUtil from '@utils/bizUtil'
import {
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'

import NsInput from '@components/common/NsInput'
import NsPassword from '@components/customer/NsPassword'

import NaverImageCaptcha from '@components/customer/NaverImageCaptcha'
import NaverVoiceCaptcha from '@components/customer/NaverVoiceCaptcha'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import nativeUtil from '@/common/frameworks/nativeUtil'

export default {
  components: {
    NsInput,
    NsPassword,
    NaverImageCaptcha,
    NaverVoiceCaptcha
  },
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      txtUserId: '',
      txtPassword: '',
      inputType: 'password',
      isAutoLoginCheck: false, // 자동로그인 체크여부
      autoInputPrevention: false,
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
        errorMessage: MEMBER_CONST.MEMBER_TEXT.EMAIL01
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
      emailList: [],
      searchQuery: '',
      isActive: false,
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
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS02
      },
      param: {},
      isCaptcha: false,
      currentComponent: null,
      captchaObject: null
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 마케팅 스크립트 적용 부분
    // SNS 계정 페이지 뷰 강제 로깅
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true,
        subparams: {
          t1: '로그인',
          t2: '회원가입',
          t3: '계정연결',
          t4: '기존아이디와연결'
        }
      }
    })

    window.addEventListener('click', this.windowListenerCallback)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.windowListenerCallback)
  },
  methods: {
    /**
     * init function
     *
     */
    init () {
      // 이미 로그인된 경우 메인으로 이동
      if (loginUtil.isLoggedIn()) {
        toastUtil.show(LOGIN_CONST.PAGE_MESSAGES.IS_LOGIN)
        if (isOsApp()) { // native 이면
          nativeUtil.closeWebView()
        } else {
          bizUtil.gotoMain()
        }
      }

      this.param = this.$route.params

      // 네이버 캡차 컴포넌트 초기화
      this.getCaptchaType(true)

      // 설정에서 넘어온경우 처리
      if (!isNull(this.param.fromPage) && this.param.fromPage === 'mypageSetting') {
        if (!isNull(this.param.logonId)) {
          this.idParams.value = this.param.logonId
          this.emailCheck()
        }
        if (!isNull(this.param.logonPassword)) {
          this.passwordParams.value = this.param.logonPassword
          this.loginValidation()
        }
        this.toLogon()
      }
    },
    /**
     * 이미지/사운드캡차 컴포넌트 호출
     *
     * @param {boolean} isImageCaptcha 이미지캡차여부
     * @returns {void}
     */
    getCaptchaType (isImageCaptcha) {
      if (isImageCaptcha) {
        this.currentComponent = 'NaverImageCaptcha'
      } else {
        this.currentComponent = 'NaverVoiceCaptcha'
      }
    },
    /**
     * 네이버캡차의 리턴결과에 따른 자동입력방지 문자결과 처리
     *
     * @param {object} resultObject 캡차인증결과데이터
     */
    getCaptchaProc (resultObject) {
      if (resultObject.result) {
        this.isCaptcha = true
      } else {
        this.isCaptcha = false
      }
    },
    /**
     * window 이벤트 콜백
     *
     * @param {object} e 클릭 이벤트
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
     * Login 처리 API호출
     *
     * @param {String} logonType 로그인유형
     * @returns {Promise<Boolean>|Promise<void>}
     */
    async toLogon (logonType) {
      let isCaptChaYn = 'N'

      if (!isNull(this.captchaObject)) {
        const resultObject = await this.captchaObject.matchNaverCaptchaValue()
        this.getCaptchaProc(resultObject)
        isCaptChaYn = this.checkRecaptchaYn = this.checkRecaptcha()
        if (!isCaptChaYn) {
          return false
        }
      }

      logonType = logonType ? '' : 'normal'
      this.idParams.isError = false
      this.passwordParams.isError = false
      const param = {
        logonId: '',
        logonPassword: '',
        logonType,
        resAction: null,
        entFlag: this.param.entFlag,
        entUserId: this.param.entUserId,
        refresh_token: this.param.access_token,
        entName: this.param.name,
        isSSORequest: false,
        entEmail: this.param.Email,
        isCaptChaYn,
        snsLinkCtnt: this.param.snsLinkCtnt
      }

      let fildValidation = true
      const idCheck = isNull(this.idParams.value.trim())
      const passCheck = isNull(this.passwordParams.value.trim())

      if (idCheck) {
        this.idParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[902]
        this.idParams.isError = true
        fildValidation = false
      }

      if (passCheck) {
        this.passwordParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[903]
        this.passwordParams.isError = true
        fildValidation = false
      }

      if (!fildValidation) {
        return false
      }

      param.logonId = this.idParams.value.trim().toLowerCase()
      param.logonPassword = this.passwordParams.value.trim()
      if (isOsApp) { // APP
        // 자동로그인 여부
        this.isAutoLoginCheck = true
        if (!isNull(this.param.fromPage) && this.param.fromPage === 'mypageSetting') {
          param.redirectName = { name: this.param.fromPage }
        }
      } else {
        if (!isNull(this.param.fromPage) && this.param.fromPage === 'mypageSetting') {
          param.redirectName = { name: this.param.fromPage }
        } else {
          param.redirectName = { name: 'storeHome' }
        }
      }

      const succesHandling = response => {
        const linkYN = response.msg.result.linkYN // ID가 이미 연동되어있는지 여부
        let message = ''

        if (linkYN === 'Y' && this.param.entFlag === 'NAVER') {
          message = '해당 NSmall 아이디는 다른 네이버 계정과 연동되어있습니다.'
          this.idParams.errorMessage = message
          this.idParams.isError = true
          return false
        } else if (linkYN === 'Y' && this.param.entFlag === 'PAYCO') {
          message = '해당 NSmall 아이디는 다른 페이코 계정과 연동되어있습니다.'
          this.idParams.errorMessage = message
          this.idParams.isError = true
          return false
        } else if (linkYN === 'Y' && this.param.entFlag === 'KAKAO') {
          message = '해당 NSmall 아이디는 다른 카카오 계정과 연동되어있습니다.'
          this.idParams.errorMessage = message
          this.idParams.isError = true
          return false
        } else if (linkYN === 'Y' && this.param.entFlag === 'FACEBOOK') {
          message = '해당 NSmall 아이디는 다른 페이스북 계정과 연동되어있습니다.'
          this.idParams.errorMessage = message
          this.idParams.isError = true
          return false
        } else {
          this.sendLogin(param)
        }
      }

      const failureHandler = () => {
        messageUtil.error('통신 오류가 발생하였습니다.', null)
      }
      this.$nsaxios.post('NsMobileMemberSignupCmd', { cmdType: 'checkEntUser', logonid: this.idParams.value.trim().toLowerCase(), entFlag: this.param.entFlag }, succesHandling, failureHandler)
    },
    /**
     * ID의 형식체크 함수
     * E-Mail 또는 일반ID인지 확인한다.
     * @returns {Boolean}
     */
    emailCheck () { /* id의 EMail형식 체크 */
      const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      const notEmailRegExp = /^[a-zA-Z0-9._-]/i
      const id = this.idParams.value.trim()
      let notEmailRegChk = true

      if (!isNull(id)) {
        for (let i = 0; i < id.length; i++) {
          if (!isNull(id.charAt(i)) && !notEmailRegExp.test(id.charAt(i))) {
            notEmailRegChk = false
            break
          }
        }

        if (!emailRegExp.test(id) && !notEmailRegChk) {
          this.passwordParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[20]
          this.passwordParams.isError = true
          return false
        } else {
          this.idParams.errorMessage = LOGIN_CONST.LOGIN_ERROR['000']
          this.idParams.isError = false
          this.passwordParams.isError = false
          return true
        }
      }
    },
    /**
     * 이메일 도메인셋팅
     *
     * @param {String} id 아이디
     * @param {String} domain 도메인
     */
    changeValue (id, domain) {
      this.isActive = false
      this.idParams.value = id.trim() + domain
      this.emailCheck()
    },
    /**
     * Login입력정보 체크함수
     *
     * @returns {Boolean}
     */
    loginValidation () {
      this.passwordParams.value = this.passwordParams.value.replace(/ /gi, '')
      const idCheck = isNull(this.idParams.value.trim())
      const passCheck = isNull(this.passwordParams.value.trim())

      if (idCheck) {
        this.idParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[902]
        this.idParams.isError = true
        return false
      }

      if (passCheck) {
        this.passwordParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[903]
        this.passwordParams.isError = true
        return false
      }

      if (!idCheck && !passCheck) {
        this.idParams.isError = false
        this.passwordParams.isError = false
        return true
      }
    },
    /**
     * ID입력필드 한글입력 불가처리 함수
     *
     * @param {string} value input 값
     * @param {Event} event 이벤트 객체
     * @returns {void|Boolean}
     */
    idHangelCheck (value, event) {
      // 한글입력 막기
      const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

      if (reg.exec(this.idParams.value) !== null) {
        this.idParams.value = this.idParams.value.slice(0, -1)
        event.target.value = this.idParams.value // chrome mobile 대응
        return false
      }

      this.idParams.value = this.idParams.value.replace(/ /gi, '')

      /**
       * 이메일 도메인목록처리
       */
      this.getEmailAuto(this.idParams)
    },
    /**
     * 캡차컨포넌트 LOAD
     *
     * @param {object} captchaObject 컨포넌트오브젝트
     */
    handleNoticeCaptchaActivation (captchaObject) {
      this.captchaObject = captchaObject
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/simple/JoinSimpleLogin";
</style>
