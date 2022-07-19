<template>
  <div class="login">
    <p v-if="isAdult" class="adult_certify">
      이 정보내용은 청소년 유해매체물로서 <strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong> 및 <strong>청소년 보호법</strong>에 따라 19세 미만의 청소년이 이용할 수 없습니다. 이용을 원하시면 로그인해주시기 바랍니다. <strong class="msg_order">이 상품은 비회원 주문이 불가한 상품입니다.</strong>
    </p>
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
    <!-- 자동가입방지 -->
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
    <button
      id="btnLogin"
      type="button"
      class="btn_login"
      @click="toLogon"
    >
      <span>로그인</span>
    </button>
    <div class="login_util">
      <label class="auto_login">
        <input
          id="autoYn"
          v-model="isAutoLoginCheck"
          type="checkbox"
          class="checkbox square"
          @change="autoYnChangeEvent($event)"
        >
        <span class="check_label">자동 로그인</span>
      </label>
      <span class="btn_group">
        <a
          class="btn_find"
          @click="findMove('findUserId', 'ID')"
        >
          <span>아이디 찾기</span>
        </a>
        <router-link
          class="btn_find"
          :to="{
            name : 'checkId',
            params : {
              marketing : findPwLogging
            }
          }"
        >
          <span>비밀번호 찾기</span>
        </router-link>
      </span>
    </div>
    <div v-show="isSnsDiv" class="login_sns">
      <p class="title">
        <span>SNS 계정 로그인</span>
      </p>
      <ul>
        <li>
          <a
            class="btn naver"
            @click="simpleLogin('NAVER')"
          >
            네이버
          </a>
        </li>
        <li>
          <a
            class="btn kakao"
            @click="simpleLogin('KAKAO')"
          >
            카카오
          </a>
        </li>
        <li>
          <a
            class="btn payco"
            @click="simpleLogin('PAYCO')"
          >
            페이코
          </a>
        </li>
        <li>
          <a
            class="btn facebook"
            @click="simpleLogin('FACEBOOK')"
          >
            페이스북
          </a>
        </li>
        <li
          v-show="isApple"
        >
          <a
            class="btn apple"
            @click="appleLogin()"
          >
            애플
          </a>
        </li>
      </ul>
    </div>
    <div class="login_bottom_btn">
      <router-link
        class="btn_join"
        :to="{
          name : 'memberJoinSelect',
          params : {
            marketing : memberJoinLogging
          }
        }"
      >
        <span>회원가입</span>
      </router-link>
      <router-link
        v-if="noMemberType==='G' && !isAdult"
        class="btn_non_member"
        :to="{
          name : 'nonMemberLogin',
          params : {
            marketing : nonMemberOrderLogging
          }
        }"
      >
        <span>비회원 주문조회</span>
      </router-link>
      <a
        v-if="noMemberType==='O' && !isAdult"
        class="btn_non_member"
        @click="noMemberOrder"
      >
        <span>비회원 구매하기</span>
      </a>
    </div>
    <div v-show="isView">
      <iframe id="iframeFacebook" :src="iframeSrc" title="페이스북 로그인" name="iframeFacebook" style="border: 0px;" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import LOGIN_CONST from '@constants/customer/login'
import MEMBER_CONST from '@constants/customer/member'
import MESSAGES from '@constants/framework/messages'
import toastUtil from '@frameworks/toastUtil'
import routerUtil from '@frameworks/routerUtil'
import nativeUtil from '@frameworks/nativeUtil'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import {
  isOsApp,
  viewType,
  isNull,
  isEmpty
} from '@utils/commonutil/commonUtil'
// import externalUtil from '@utils/externalUtil'
import loginUtil from '@utils/loginUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import facebookMixin from '@/mixins/customer/facebookMixin'

import NsInput from '@components/common/NsInput'
import NsPassword from '@components/customer/NsPassword'
import localStorageUtil from '@frameworks/localStorageUtil'
import NATIVE_CONST from '@constants/framework/native'

import NaverImageCaptcha from '@components/customer/NaverImageCaptcha'
import NaverVoiceCaptcha from '@components/customer/NaverVoiceCaptcha'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import nsaxios from '@frameworks/axiosUtil'

export default {
  name: 'Login',
  components: {
    NsInput,
    NsPassword,
    NaverImageCaptcha,
    NaverVoiceCaptcha
  },
  mixins: [
    customerInputMixin,
    facebookMixin
  ],
  props: {
    loginRedirectPath: {
      type: String,
      default: ''
    },
    adultFlag: {
      type: String,
      default: ''
    },
    loginType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      txtUserId: '',
      txtPassword: '',
      inputType: 'password',
      isAutoLoginCheck: true, // 자동로그인 체크여부
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
      noMemberType: '',
      isAdult: false,
      productData: {},
      isView: false,
      iframeSrc: '',
      isCaptcha: false,
      isImageCaptcha: true,
      currentComponent: '',
      captchaObject: null,
      isApple: false,
      isSnsDiv: false,
      redirectName: ''
    }
  },
  computed: {
    ...mapState('login', ['loginPopupType', 'isAdultLogin', 'loginParam', 'returnRoute'])
  },
  created () {
    this.init()
  },
  mounted () {
    if (isOsApp()) { // APP
      window.callbackNaverLogin = this.callbackNaverLogin // 네이버 login 콜백함수
      window.callbackNaverProfile = this.callbackNaverProfile // 네이버 login profile 콜백함수
      window.callbackKakaoLogin = this.callbackKakaoLogin // 카카오 login 콜백함수
      window.callbackKakaoProfile = this.callbackKakaoProfile // 카카오 login profile 콜백함수
      window.callbackPaycoLogin = this.callbackPaycoLogin // 페이코 login 콜백함수
      window.callbackPaycoProfile = this.callbackPaycoProfile // 페이코 login profile 콜백함수
      window.callbackAppleLogin = this.callbackAppleLogin // apple login 콜백함수
      window.nativeSimpleLoginLink = this.nativeSimpleLoginLink // 간편로그인 링크를 위한 Native 호출
    }
    window.addEventListener('click', this.windowListenerCallback)
    window.vm = this // customerInputMixin에서 팝업호출후 opener객체 반환을 위한 선언
    this.loadFacebookSDK(document, 'script', 'facebook-jssdk')
  },
  beforeDestroy () {
    // 로그인 팝업 타입 초기화
    this.$store.commit('login/setLoginPopupType', LOGIN_CONST.LOGIN_POPUP_TYPE.GLOBAL)
    window.removeEventListener('click', this.windowListenerCallback)
  },
  methods: {
    /**
     * init function
     *
     */
    async init () {
      // 이미 로그인된 경우 메인으로 이동
      if (loginUtil.isLoggedIn()) {
        if (isOsApp()) { // Native 인경우
          nativeUtil.closeWebView()
        } else {
          toastUtil.show(LOGIN_CONST.PAGE_MESSAGES.IS_LOGIN)
          bizUtil.gotoMain()
        }
      }

      // 로그인 타입에 따른 비회원 버튼 제어
      if (this.loginPopupType === LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER) {
        this.noMemberType = 'M'
      } else if (this.loginPopupType === LOGIN_CONST.LOGIN_POPUP_TYPE.ORDER) {
        this.noMemberType = 'O'
      } else {
        this.noMemberType = 'G'
      }

      this.redirectName = this.returnRoute
      if (isOsApp()) { // APP
        nsaxios.post('Dummy', {})

        if (this.loginType === 'global') {
          this.noMemberType = 'G'
        } else if (this.loginType === 'member') {
          this.noMemberType = 'M'
        } else if (this.loginType === 'order') {
          this.noMemberType = 'O'
        }

        if (this.adultFlag === 'true') {
          this.isAdult = true
          this.noMemberType = 'O'
        } else if (this.isAdultLogin) {
          this.isAdult = this.isAdultLogin || false
          this.noMemberType = 'O'
        }
        localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.LOGIN_TYPE)

        if (!isNull(this.loginRedirectPath)) {
          localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH, this.loginRedirectPath)
          window.returnRoute = { path: this.loginRedirectPath }
        }
      } else {
        this.isAdult = this.isAdultLogin || false
      }

      // 비회원 주문시 필요한 상품정보 취득
      this.productData = this.loginParam

      if (isOsApp()) { // APP
        // 자동로그인 여부
        this.isAutoLoginCheck = true
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN, 'Y') // 자동로그인여부 쿠키
      }

      // 브라우저 체크하여 IOS이면 Apple Login 영역 노출
      if (viewType() === 'ios') {
        // 자동로그인 여부
        window.callbackOSVersion = this.callbackOSVersion // IOS 버전 콜백함수
        nativeUtil.getOSVersion('callbackOSVersion') // IOS 버전 브리지 호출
      }

      // 네이버 캡차 컴포넌트 초기화
      this.getCaptchaType(true)

      // SNS 간편 회원 로그인 영역 노출 여부 처리 (default 미 노출)
      await this.$nsaxios.post('NSSnsMemberDispAjax', { cmdType: 'getSnsMemberDisplayYn' }, data => {
        const snsMemberDispYn = data.msg?.result?.snsMemberDispYn // SNS 영역 노출 여부 처리
        if (!isNull(snsMemberDispYn) && snsMemberDispYn === 'N' && viewType() === 'ios') {
          // 미노출 노출
          this.isSnsDiv = false
        } else {
          this.isSnsDiv = true
        }
      })
    },
    /**
     * 이미지/사운드캡차 컴포넌트 호출
     *
     * @param {boolean} isImageCaptcha 이미지캡차여부
     * @returns {void}
     */
    getCaptchaType (isImageCaptcha) {
      this.isImageCaptcha = isImageCaptcha
      if (isImageCaptcha) {
        this.currentComponent = 'NaverImageCaptcha'
      } else {
        this.currentComponent = 'NaverVoiceCaptcha'
      }
    },
    /**
     * 네이버캡차의 리턴결과에 따른 자동입력방지 문자결과 처리
     *
     * @param {import('@components/ui/NaverPopupLinkReturn.vue').matchNaverCaptchaValue|import('@components/ui/NaverVoiceCaptcha.vue').matchNaverCaptchaValue} resultObject
     */
    getCaptchaProc (resultObject) {
      if (resultObject.result) {
        this.isCaptcha = true
      } else {
        this.isCaptcha = false
      }
    },
    /**
     * 비밀번호 찾기 버튼 클릭 이벤트
     *
     */
    findPwLogging () {
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_로그인',
          eventAction: '로그인부가메뉴',
          eventLabel: '비밀번호찾기',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 회원가입 버튼 클릭 이벤트
     */
    memberJoinLogging () {
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_로그인',
          eventAction: '로그인부가메뉴',
          eventLabel: '회원가입',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 비회원 주문조회 버튼 클릭 이벤트
     */
    nonMemberOrderLogging () {
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_로그인',
          eventAction: '비회원전환',
          eventLabel: '비회원주문조회',
          params: {
            t1: null
          }
        }
      })
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
        fromLoginPage: true
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
      param.isCaptChaYn = isCaptChaYn

      if (this.productData) {
        param.productData = this.productData

        if (!isNull(this.redirectName)) {
          if (this.redirectName.name === 'orderConsultSheet') {
            param.redirectName = 'orderConsultSheet'
          } else if (this.redirectName.name === 'inquiryList' || this.redirectName.name === 'reviewList') {
            // 상품문의 및 상품평 페이지의 경우 로그인 후 현재 페이지로 돌아와야 하기 때문에 빈 문자열 설정
            param.redirectName = ''
          } else {
            param.redirectName = 'orderSheet'
          }
        }
      }
      if (isOsApp()) {
        this.sendLogin(param).then(() => {
          window.location.reload()
        })
      } else {
        this.sendLogin(param)
      }
    },
    /**
     * ID의 형식체크 함수
     * E-Mail 또는 일반ID인지 확인한다.
     *
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
      this.idParams.isError = false
      this.passwordParams.isError = false
      this.idParams.value = this.idParams.value.replace(/ /gi, '')
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
      this.idParams.isError = false
      this.passwordParams.isError = false

      // 한글입력 막기
      const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

      if (reg.exec(this.idParams.value) !== null) {
        this.idParams.value = this.idParams.value.slice(0, -1)
        event.target.value = this.idParams.value // chrome mobile 대응
        return false
      }

      this.idParams.value = this.idParams.value.replace(/ /gi, '')

      this.getEmailAuto(this.idParams)
    },
    /**
     * id/password find router page move
     *
     * @param {string} urlName router link name
     * @param {string} type view형태
     * @returns {boolean}
     */
    findMove (urlName, type) {
      const goingInvok = {
        name: urlName,
        params: {
          viewType: type
        }
      }

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_로그인',
          eventAction: '로그인부가메뉴',
          eventLabel: '아이디찾기',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })

      this.$router.push(goingInvok)
      return true
    },
    /**
     * 비회원 주문하기 버튼 이벤트
     *
     */
    noMemberOrder () {
      // TODO : 추후 적용대상
      // GA.sendEventData(event_obj,subparam);
      // mainCtrl.NOMEMBER_ORDER = true;

      // step 1. 상품 상세에서 전달된 parameter 정보를 가지고 바로주문 transaction을 실행
      // step 2. 성공하면 바로주문 화면으로 이동한다.
      // step 3. 실패하면 뒤로가기 이동한다.
      if (!this.productData) {
        // 상품정보가 없으면 뒤로가기처리
        routerUtil.back()
      } else {
        const invoke = this.productData.invoke
        if (this.productData.isOnlyUser !== undefined && this.productData.isOnlyUser) {
          // 로그인 유저만 가능한 액션. NS정기배달 같은 경우. 비회원주문은 되지 않는다.
          messageUtil.alert('비회원 주문이 불가한 상품입니다.', () => {
            routerUtil.back()
          })
        } else {
          document.cookie = 'JSESSIONID=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT'

          // 쿠폰 자동 다운로드
          const vdnCd = isOsApp() ? '54101' : '54102'
          if (this.productData.coupons != null) {
            this.$nsaxios.post('NSItemDetailAjax', {
              ...this.productData.coupons,
              vdn_cd: vdnCd
            })
          }

          // 초이스 기획전 > 성인 로그인 > 성인인증 > 주문서 이동 시....
          invoke.vdn_cd = vdnCd
          if (invoke.adultItemFlag === 'Y' && loginUtil.adultAuthYN() !== 'Y') {
            messageUtil.alert('성인 상품 구매는 성인 인증이 필요합니다.', () => {
              // 성인인증 후 성인인경우 주문서로 이동, 성인이 아닌경우 뒤로가기처리
              bizUtil.openCert(true, data => {
                const birthday = data.BIRTHDAY
                const age = data.AGE

                if (!isNull(birthday) && isNull(age, '0') > '19') {
                  messageUtil.alert('미성년자는 성인 상품을 구매 하실수 없습니다.', () => {
                    return routerUtil.back()
                  })
                } else {
                  this.goOrderSheet(invoke)
                }
              })
            })
          } else {
            this.goOrderSheet(invoke)
          }
        }
      }
    },

    /**
     * 비회원 주문서로 이동
     *
     * @param {object} invoke 주문상품정보
     */
    goOrderSheet (invoke) {
      const apiUrl = this.$route.meta.refer === 'cartList' ? 'AjaxNSOrderSheet4Worklight' : 'AjaxNSOrderPayNow4Worklight'
      this.$nsaxios.post(apiUrl, invoke, data => {
        const orderId = data.orderId
        if (orderId) {
          // 주문서정보 페이지로 이동
          bizUtil.gotoOrdersheet({
            orderId,
            invoke: this.productData.invoke // inputData를 같이 담아 넘긴다.
          })
        } else {
          messageUtil.alert(`바로 주문하기를 처리하지 못했습니다.${MESSAGES.UNEXPECTED_ERROR}`, () => {
            routerUtil.back()
          })
          /** TODO 추후 공통에서 추가되면 주석해제 */
          // externalUtil.callPageLogging('LoggingPage', {
          //   ErrorCode: 'UE',
          //   p_espotid: 'AjaxNSOrderPayNow4Worklight'
          // })
        }
      })
    },

    /**
     * 자동로그인 값 변경 이벤트 쿠키에 값 저장
     *
     * @param {object} e change 이벤트
     */
    autoYnChangeEvent (e) {
      if (isOsApp()) { // APP
        if (e.target.checked) {
          localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN, 'Y')
        } else {
          localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN, 'N')
          localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_ID)
          localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_PW)
        }
      }
    },
    /**
     * 캡차컨포넌트 LOAD
     *
     * @param {object} captchaObject 컨포넌트오브젝트
     */
    handleNoticeCaptchaActivation (captchaObject) {
      this.captchaObject = captchaObject
    },
    /**
     * Apple Login 처리(비동기처리(콜백함수))
     */
    appleLogin () {
      // TODO 앱개발팀에서 작업필요
      if (viewType() === 'ios') {
        this.simpleLogin('APPLE')
      }
    },
    /**
     * Apple Login 콜백함수
     *
     * @param {object} returnValue apple login  리턴값
     */
    callbackAppleLogin (returnValue) {
      console.debug('returnValue::', returnValue)
    },
    /**
     * Apple Login visible 처리
     *
     * @param {object} returnValue IOS Version 값
     */
    callbackOSVersion (returnValue) {
      if (Number(returnValue) >= 13) {
        this.isApple = true
      }
    },
    /**
     * 네이버 Login 콜백함수
     *
     * @param {String} jsonString 네이버 login  리턴값
     */
    callbackNaverLogin (jsonString) {
      if (jsonString.length < 1) {
        messageUtil.alert('네이버 연동시 에러가 발생하였습니다.')
        return false
      }
      console.log('ysjoo>>naver jsonString', jsonString)
      const jsonObj = JSON.parse(jsonString)
      if (jsonObj.access_token_secret === 'fail') {
        messageUtil.alert('네이버 연동시 에러가 발생하였습니다.')
      } else {
        if (viewType() === 'android') {
          this.accessToken = jsonObj.accessToken
          this.expiresAt = jsonObj.expiresAt
          if (!isNull(jsonObj.refreshToken)) {
            this.refreshToken = jsonObj.refreshToken
            const accessToken = [{ accessToken: this.accessToken }]
            nativeUtil.doNaverLogin('userProfile', 'callbackNaverProfile', JSON.stringify(accessToken))
          }
        } else if (viewType() === 'ios') {
          this.refreshToken = jsonObj.refreshToken
          const invoke = {
            refresh_token: this.refreshToken,
            email: jsonObj.email,
            name: jsonObj.name,
            id: jsonObj.id
          }
          nativeUtil.doNaverLogin('logout', '', '') // 페이코 로그아웃
          const callbackData = { root: invoke }
          this.snsLoginCallback(callbackData, 'NAVER')
        }
      }
    },
    /**
     * 네이버 Login  userProfile 콜백함수
     *
     * @param {String} jsonString 네이버 login userProfile 리턴값
     */
    callbackNaverProfile (jsonString) {
      const jsonObj = JSON.parse(jsonString)
      nativeUtil.doNaverLogin('logout', '', '') // 네이버 로그아웃
      if (jsonObj.access_token_secret === 'fail') {
        messageUtil.alert('로그인에 실패하였습니다.')
      } else {
        const invoke = {
          id: jsonObj.id,
          refresh_token: this.refreshToken,
          expiresAt: this.expiresAt,
          refreshToken: this.refreshToken,
          email: jsonObj.email,
          name: jsonObj.name
        }
        const callbackData = { root: invoke }
        this.snsLoginCallback(callbackData, 'NAVER')
      }
    },
    /**
     * 페이코 Login 콜백함수
     *
     * @param {String} jsonString 페이코 login  리턴값
     */
    callbackPaycoLogin (jsonString) {
      if (jsonString.length < 1) {
        messageUtil.alert('페이코 연동시 에러가 발생하였습니다.')
        return false
      }
      console.log('ysjoo>>payco jsonString', jsonString)
      const jsonObj = JSON.parse(jsonString)
      if (jsonObj.access_token_secret === 'fail') {
        messageUtil.alert('페이코 연동시 에러가 발생하였습니다.')
      } else {
        if (viewType() === 'android') {
          this.accessToken = jsonObj.accessToken
          this.expiresAt = jsonObj.expiresAt
          if (!isNull(jsonObj.refreshToken)) {
            this.refreshToken = jsonObj.refreshToken
            const accessToken = [{ accessToken: this.accessToken }]
            nativeUtil.doPaycoLogin('userProfile', 'callbackPaycoProfile', JSON.stringify(accessToken))
          }
        } else if (viewType() === 'ios') {
          this.refreshToken = jsonObj.refreshToken
          const paycoId = !isEmpty(jsonObj.email) ? jsonObj.email : (!isEmpty(jsonObj.mobile) ? jsonObj.mobile : jsonObj.paycoId)
          const invoke = {
            refresh_token: this.refreshToken,
            email: paycoId,
            name: jsonObj.name,
            id: paycoId,
            paycoId: jsonObj.paycoId
          }
          nativeUtil.doPaycoLogin('logout', '', '') // 페이코 로그아웃
          const callbackData = { root: invoke }
          this.snsLoginCallback(callbackData, 'PAYCO')
        }
      }
    },
    /**
     * 페이코 Login  userProfile 콜백함수
     *
     * @param {String} jsonString 페이코 login userProfile 리턴값
     */
    callbackPaycoProfile (jsonString) {
      const jsonObj = JSON.parse(jsonString)
      nativeUtil.doPaycoLogin('logout', '', '') // 페이코 로그아웃
      if (jsonObj.access_token_secret === 'fail') {
        messageUtil.alert('로그인에 실패하였습니다.')
      } else {
        // ID: 이메일, 핸드폰, ID 순으로
        const paycoId = !isEmpty(jsonObj.email) ? jsonObj.email : (!isEmpty(jsonObj.mobile) ? jsonObj.mobile : jsonObj.paycoId)
        const invoke = {
          id: paycoId,
          paycoId: jsonObj.paycoId,
          access_token: this.accessToken,
          expiresAt: this.expiresAt,
          refresh_token: this.refreshToken,
          email: paycoId,
          name: jsonObj.name
        }
        const callbackData = { root: invoke }
        this.snsLoginCallback(callbackData, 'PAYCO')
      }
    },
    /**
     * 카카오 Login 콜백함수
     *
     * @param {String} jsonString 카카오 login  리턴값
     */
    callbackKakaoLogin (jsonString) {
      if (jsonString.length < 1) {
        messageUtil.alert('카카오 연동시 에러가 발생하였습니다.')
        return false
      }
      const jsonObj = JSON.parse(jsonString)
      if (jsonObj.access_token_secret === 'fail') {
        messageUtil.alert('카카오 연동시 에러가 발생하였습니다.')
        return false
      } else {
        if (!isNull(jsonObj.accessToken)) {
          this.accessToken = jsonObj.accessToken
          this.refreshToken = jsonObj.refreshToken
          if (viewType() === 'android') {
            const accessToken = [{ accessToken: this.accessToken }]
            nativeUtil.doKakaoLogin('userProfile', 'callbackKakaoProfile', JSON.stringify(accessToken))
          } else if (viewType() === 'ios') {
            // nativeUtil.doKakaoLogin('userProfile', 'callbackKakaoProfile', '')
            const invoke = {
              id: jsonObj.id,
              refresh_token: this.refreshToken,
              access_token: this.accessToken,
              email: jsonObj.email,
              name: jsonObj.name
            }
            const callbackData = { root: invoke }
            this.snsLoginCallback(callbackData, 'KAKAO')
          }
        }
      }
    },
    /**
     * 카카오 Login  userProfile 콜백함수
     *
     * @param {String} jsonString 카카오 login userProfile 리턴값
     */
    callbackKakaoProfile (jsonString) {
      const jsonObj = JSON.parse(jsonString)
      if (jsonObj.access_token_secret === 'fail') {
        messageUtil.alert('로그인에 실패하였습니다.')
      } else {
        const invoke = {
          id: jsonObj.id,
          refresh_token: this.refreshToken,
          access_token: this.accessToken,
          email: jsonObj.email,
          name: jsonObj.name
        }
        const callbackData = { root: invoke }
        this.snsLoginCallback(callbackData, 'KAKAO')
      }
    },
    /**
     * 간편로그인 링크를 위한 Native 호출
     *
     * @param {String} param 로그인 구분값 파라미터
     */
    nativeSimpleLoginLink (param) {
      if (param === 'NAVER') {
        this.simpleLogin('NAVER')
      } else if (param === 'KAKAO') {
        this.simpleLogin('KAKAO')
      } else if (param === 'PAYCO') {
        this.simpleLogin('PAYCO')
      } else if (param === 'FACEBOOK') {
        this.simpleLogin('FACEBOOK')
      } else if (param === 'APPLE') {
        this.appleLogin()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/Login";
</style>
