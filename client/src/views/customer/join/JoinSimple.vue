<template>
  <div class="join_simple">
    <div
      v-if="param.entFlag === 'NAVER'"
      class="join_simple_sns"
    >
      <i class="icons_naver" />
      <strong class="subject">네이버 계정 인증이 완료되었습니다.</strong>
      <p class="join_simple_guide">
        회원가입 이후, 간편 로그인이 가능합니다.
      </p>
    </div>
    <div
      v-if="param.entFlag === 'PAYCO'"
      class="join_simple_sns"
    >
      <i class="icons_payco" />
      <strong class="subject">페이코 계정 인증이 완료되었습니다.</strong>
      <p class="join_simple_guide">
        회원가입 이후, 간편 로그인이 가능합니다.
      </p>
    </div>
    <div
      v-if="param.entFlag === 'KAKAO'"
      class="join_simple_sns"
    >
      <i class="icons_kakao" />
      <strong class="subject">카카오 계정 인증이 완료되었습니다.</strong>
      <p class="join_simple_guide">
        회원가입 이후, 간편 로그인이 가능합니다.
      </p>
    </div>
    <div
      v-if="param.entFlag === 'FACEBOOK'"
      class="join_simple_sns"
    >
      <i class="icons_facebook" />
      <strong class="subject">페이스북 계정 인증이 완료되었습니다.</strong>
      <p class="join_simple_guide">
        회원가입 이후, 간편 로그인이 가능합니다.
      </p>
    </div>
    <!-- 아이디 입력: success -->
    <div class="dropdown_wrap">
      <ns-input
        :params="emailParams"
        @input="clearCheck"
        @blur="handleBlurIDInput($event);"
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
    <div
      v-if="emailChecked"
      class="btn_group_flex"
    >
      <router-link
        class="btn_login"
        to="/customer/login/regular-member" replace
      >
        <span>로그인</span>
      </router-link>
      <router-link
        class="btn_find_password"
        :to="{ name : 'checkId' }" replace
      >
        <span>비밀번호 찾기</span>
      </router-link>
    </div>
    <!-- 이름 default -->
    <ns-input
      :params="userNameParams"
      @input="checkUserNameKeyUp"
      @blur="checkUserName"
    />
    <!-- 휴대전화 default -->
    <ns-input
      :params="userPhoneParams"
      @focus="onKeyUpOnlyNumber"
      @input="isPhonePattern($event, userPhoneParams); isPhoneFailMed($event); hidePhoneAuth();"
      @blur="handleBlurPhoneInput($event)"
    />
    <p
      v-if="hasVerified"
      class="default_msg"
      v-html="successMessage"
    />
    <div
      v-if="isPhoneFail"
      class="btn_group_flex"
    >
      <router-link
        v-if="isPhoneAuth && !isTvMember"
        class="btn_login"
        to="/customer/login/regular-member"
      >
        <span>로그인</span>
      </router-link>
      <button
        v-if="isPhoneAuth"
        type="button"
        class="btn_auth"
        @click="sendVerificationCode"
      >
        <span>인증번호 전송</span>
      </button>
    </div>
    <phone-auth
      v-show="isPhoneAuthVisible"
      ref="phoneAuth"
      :phone-number="userPhoneParams.value"
      :auth-type="authType"
      :user-name="userNameParams.value"
      @sendVerificationCode="handleSendVerificationCode"
      @checkVerificationCode="handleCheckVerificationCode"
      @expiredVerificationCode="handleExpiredVerificationCode"
    />
    <!-- 저장 이슈 메세지 처리 -->
    <p v-if="saveChecked" class="error_msg">
      {{ saveErrorMsg }}
    </p>
    <!-- 약관 -->
    <div class="collapse_wrap">
      <dl>
        <dt>
          <label>
            <input
              ref="allAgree"
              type="checkbox"
              class="checkbox square"
              @click="isAgreeAllChecked"
            >
            <span class="check_label">
              <p class="agree_title">
                전체 동의
              </p>
            </span>
            <p
              v-if="isAgreeError"
              class="error_msg"
              v-html="isAgreeErrorMsg"
            />
          </label>
        </dt>
        <dt>
          <label>
            <input
              ref="agreeAge"
              type="checkbox"
              class="checkbox square"
              @click="isAgreeChecked('agreeAge')"
            >
            <span class="check_label">
              <p class="title">
                만 14세 이상입니다.
              </p>
            </span>
          </label>
        </dt>
        <dt>
          <label>
            <input
              ref="agree"
              type="checkbox"
              class="checkbox square"
              @click="isAgreeChecked('terms')"
            >
            <span class="check_label">
              <strong class="title">[필수] 이용약관</strong>
              <button type="button" class="btn_layer" @click="agreePopup">
                보기
              </button>
            </span>
          </label>
        </dt>
        <dt :class="toggleClass ? 'active' : ''">
          <label>
            <input
              ref="agreeContent"
              type="checkbox"
              class="checkbox square"
              @click="isAgreeChecked('content')"
            >
            <span class="check_label">
              <strong class="title">[필수] 개인정보 수집 및 이용</strong>
              <button
                type="button"
                class="btn_collapse"
                @click="onCollapse()"
              >
                펼치기/접기
              </button>
            </span>
          </label>
        </dt>
        <dd>
          <div class="table">
            <table>
              <caption><span class="blind">상품/이벤트/금융정보 알림</span></caption>
              <thead>
                <tr>
                  <th scope="col">
                    수집시점
                  </th>
                  <th scope="col">
                    수집항목
                  </th>
                  <th scope="col">
                    이용목적
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="2" class="table_title">
                    가입
                  </td>
                  <td class="table_content">
                    *필수: 이름, 아이디(이메일 주소), 비밀번호, 휴대폰전화번호
                  </td>
                  <td class="table_content">
                    <p>- 이용자 식별 및 회원관리</p>
                    <p>- 민원처리 및 고객 피해보상, 고객주문ㆍ배송ㆍ상담처리 등 서비스 전반 제공</p>
                  </td>
                </tr>
                <tr>
                  <td class="table_content">
                    *선택: 이메일 주소,휴대폰전화번호,성별,생년월일
                  </td>
                  <td class="table_content">
                    <p>- 고객 맞춤형 상품 및 서비스 개발 및 제공</p>
                    <p>- 새로운 서비스, 상품 및 이벤트 등의 정보 안내, 마케팅(광고성 정보 수신 동의 고객에 한함)</p>
                  </td>
                </tr>
                <tr>
                  <td rowspan="2" class="table_title">
                    주문
                  </td>
                  <td class="table_content">
                    *필수: 배송지 정보(성명, 휴대폰 전화번호, 주소)
                  </td>
                  <td class="table_content">
                    <p>- 상품, 사은품 또는 경품 등의 배송</p>
                    <p>- 민원처리 및 고객 피해보상, 고객주문ㆍ배송ㆍ상담처리 등 서비스 전반 제공</p>
                  </td>
                </tr>
                <tr>
                  <td class="table_content">
                    *선택: 신용카드정보, 은행계좌정보
                  </td>
                  <td class="table_content">
                    - 주문에 대한 결제 또는 환불
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="table_msg">
              보유 기간 : 동의 철회 시 또는 법정 의무 보유기간까지
            </p>
          </div>
          <p class="agree_msg">
            개인정보 수집 및 이용에 대한 동의는 서비스 이용을 위해 꼭 필요합니다. 동의 거부하실 수 있으나, 이 경우 서비스 이용에 제한됩니다.
          </p>
        </dd>
      </dl>
    </div>
    <!-- 가입하기 버튼 -->
    <div class="agree_join">
      <button
        ref="saveJoinButton"
        type="button"
        class="btn_join"
        @mousedown="isMouseDown=true"
        @click="saveJoin($event)"
      >
        <span>동의하고 가입하기</span>
      </button>
    </div>
  </div>
</template>

<script>
import flushPromises from 'flush-promises'
import modalUtil from '@frameworks/modalUtil'
import messageUtil from '@frameworks/messageUtil'
import NsInput from '@components/common/NsInput'
import CONST from '@constants/framework/framework'
import nslog from '@frameworks/logUtil'
import errorUtil from '@frameworks/errorUtil'

import {
  isNull,
  isEmail,
  getBytes,
  getCutBytes,
  isHangul,
  onKeyUpOnlyNumber,
  insertSeparatorPhoneNumber,
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'
import inputMixin from '@/mixins/ui/inputMixin'
import loginUtil from '@/common/utils/loginUtil'
import PHONE_CONST from '@/common/constants/customer/phone'
import MEMBER_CONST from '@/common/constants/customer/member'
import LOGIN_CONST from '@/common/constants/customer/login'
import toastUtil from '@frameworks/toastUtil'
import bizUtil from '@utils/bizUtil'
import PhoneAuth from '@components/common/PhoneAuth'
import PHONE_AUTH_CONST from '@constants/customer/phoneAuth'
import customerInputMixin from '@/mixins/customer/customerInputMixin'

import COMM_CONST from '@constants/framework/constants'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import nativeUtil from '@frameworks/nativeUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import NATIVE_CONST from '@constants/framework/native'
import cipherUtil from '@frameworks/cipherUtil'

export default {
  components: {
    NsInput,
    PhoneAuth
  },
  mixins: [
    inputMixin,
    customerInputMixin
  ],
  beforeRouteLeave (to, from, next) {
    // 이 컴포넌트를 렌더링하는 라우트가 이전으로 네비게이션 될 때 호출됩니다.
    // this 컴포넌트 인스턴스에 접근 할 수 있습니다.

    // 이전 페이지로 이동 시
    if (to.name === 'memberComplete' || to.name === 'checkId' || to.name === 'memberLogin') {
      next()
    } else {
      const okCallback = () => {
        // 이전 라우터로 이동
        next()
      }
      const cancelCallback = () => {
        // 라우터 이동 취소
        next(false)
      }
      messageUtil.confirm(`${MEMBER_CONST.MEMBER_TEXT.HISTORYBACK_TITLE}\n${MEMBER_CONST.MEMBER_TEXT.HISTORYBACK}`, cancelCallback, okCallback, '아니오', '네')
    }
  },
  data () {
    return {
      userName: '',
      toggleClass: false,
      pwdGradeCode: 99,
      pwdMsg: MEMBER_CONST.MEMBER_TEXT.PASS01,
      emailChecked: false,
      isPasswordCheck: false,
      isEmailCheck: false,
      isEmailDiapuse: false,
      isDuplicationHpNo: false,
      passwordError: MEMBER_CONST.MEMBER_TEXT.PASS01,
      saveChecked: false,
      saveErrorMsg: '',
      isSendCertNumber: false,
      isPhoneFail: false, // 입력된 휴대전화로 가입된 ID존재여부
      isSendAuthCode: false,
      isActive: false,
      isTvMember: false,
      isMouseDown: false,
      emailParams: {
        value: '',
        iconClass: 'id',
        title: MEMBER_CONST.MEMBER_TEXT.EMAILTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.EMAILPLACEHOLDER,
        maxlength: 40,
        type: 'email',
        isLabel: true,
        labelKind: 'label_icon',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.EMAIL01
      },
      userNameParams: {
        value: '',
        iconClass: 'user_name',
        title: MEMBER_CONST.MEMBER_TEXT.NAMETITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.NAMEPLACEHOLDER,
        type: 'text',
        maxlength: 30,
        defaultKeyboard: 'korea',
        isLabel: true,
        labelKind: 'label_icon',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.NAME01
      },
      userPhoneParams: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 11,
        type: 'tel',
        title: MEMBER_CONST.MEMBER_TEXT.PHONETITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.PHONEPLACEHOLDER,
        isSuccess: false,
        isError: false,
        errorMessage: '',
        iconClass: 'phone',
        isLabel: true,
        labelKind: 'label_icon',
        verification: {
          value: '',
          readonly: false,
          disabled: false,
          maxlength: 6,
          title: MEMBER_CONST.MEMBER_TEXT.PHONEAUTHTITLE,
          placeholder: MEMBER_CONST.MEMBER_TEXT.PHONEAUTHPLACEHOLDER,
          isVerficationMode: false,
          timeLimit: '', /* 시간 제한 ex)05:00 or 04:59 ... */
          isSuccess: false,
          isError: false,
          isSendCode: false,
          sendBtnName: MEMBER_CONST.MEMBER_TEXT.AUTHSENDNAME01,
          sendMessage: MEMBER_CONST.MEMBER_TEXT.PHONE01,
          errorMessage: MEMBER_CONST.MEMBER_TEXT.PHONE02,
          successMessage: MEMBER_CONST.MEMBER_TEXT.PHONE03
        }
      },
      authObj: {
        authnumber: '',
        phone: ''
      },
      agreeLayerParam: {
        title: '이용약관'
      },
      singleLayerCallback: {
        isAgreeTerms: false
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
      authType: PHONE_AUTH_CONST.AUTH_TYPE.MEMBER_JOIN,
      isPhoneAuthVisible: false, // 휴대폰 점유인증 영역 표시여부
      successMessage: MEMBER_CONST.MEMBER_TEXT.PHONE03, // 휴대폰 점유인증 성공 메시지
      hasVerified: false, // 휴대폰 점유인증 통과여부
      param: {},
      isSaveFailCnt: 0, // 회원가입 저장실패수
      isAgreeAll: false,
      isAgree: false,
      isAgreeContent: false,
      isAgreeError: false,
      isAgreeErrorMsg: '필수항목에 모두 동의해 주세요.'
    }
  },
  computed: {
    /**
     * 휴대폰번호 중복에 따른 액션 버튼 표시 여부
     *
     * @returns {boolean}
     */
    isPhoneAuth () {
      return !this.isPhoneAuthVisible && !this.hasVerified
    }
  },
  watch: {
    emailParams: {
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler () {
        const emailVal = this.emailParams.value

        if (emailVal.length === 0) {
          this.emailChecked = false
        }
      }
    }
  },
  created () {
    if (loginUtil.isLoggedIn()) {
      toastUtil.show(LOGIN_CONST.PAGE_MESSAGES.IS_LOGIN)
      bizUtil.gotoMain()
    }

    this.param = this.$route.params
    if (!isNull(this.param.Email) && isEmail(this.param.Email)) {
      this.emailParams.value = this.param.Email
      this.closeUi()
      this.checkJoinId()
    }
    if (!isNull(this.param.name)) {
      this.userNameParams.value = this.param.name
      this.checkUserNameKeyUp()
      this.checkUserName()
    }
  },
  mounted () {
    // 마케팅 스크립트 적용 부분
    // SNS 계정 페이지 뷰 강제 로깅
    let snsTypeName = ''
    if (this.param.entFlag === 'NAVER') {
      snsTypeName = '네이버'
    } else if (this.param.entFlag === 'KAKAO') {
      snsTypeName = '카카오'
    } else if (this.param.entFlag === 'PAYCO') {
      snsTypeName = '페이코'
    } else if (this.param.entFlag === 'FACEBOOK') {
      snsTypeName = '페이스북'
    }
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true,
        subparams: {
          t1: '로그인',
          t2: '회원가입',
          t3: '계정연결',
          t4: `${snsTypeName}계정연결`
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
     * 변경/취소 버튼처리
     */
    onCollapse () {
      const collapseWrap = document.querySelector('.collapse_wrap dd')
      const height = collapseWrap.scrollHeight
      if (!this.toggleClass) {
        collapseWrap.style.height = `${height}px`
      } else {
        collapseWrap.style.height = 0
      }
      this.toggleClass = !this.toggleClass
    },
    /**
     * 가입 E-Mail ID 검증
     *
     * @returns {boolean|void}
     */
    async checkJoinId () {
      const joinIdVal = this.emailParams.value.trim()
      const substrId = joinIdVal.substring(0, joinIdVal.indexOf('@'))
      const idEmailCheck = isEmail(joinIdVal)

      if (isNull(joinIdVal)) {
        this.emailParams.isError = true
        this.emailParams.isSuccess = false
        this.isEmailCheck = false
        this.isEmailDiapuse = false
        this.emailChecked = false
        this.emailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL02

        return false
      } else if (joinIdVal.length < 4 || (idEmailCheck && substrId.length < 4)) {
        this.emailParams.isError = true
        this.emailParams.isSuccess = false
        this.isEmailCheck = false
        this.isEmailDiapuse = false
        this.emailChecked = false
        this.emailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL13

        return false
      } else if (!idEmailCheck) {
        this.emailParams.isError = true
        this.emailParams.isSuccess = false
        this.isEmailCheck = false
        this.isEmailDiapuse = false
        this.emailChecked = false
        this.emailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL01

        return false
      } else {
        this.emailParams.isSuccess = true
        this.emailParams.isError = false
        this.isEmailCheck = false
        this.isEmailDiapuse = false
        this.emailChecked = false
      }

      const invoke = {
        cmdType: 'checkLogonIdUsability',
        logonid: this.emailParams.value.trim()
      }

      const successHandling = response => {
        const code = response.msg.result.resultCode.toUpperCase()

        // 휴면계정 체크 추가
        if (code === 'Y') {
          this.isEmailCheck = true
          this.isEmailDiapuse = true
          this.emailChecked = false
          this.emailParams.errorMessage = ''
        } else if (code === 'R') {
          this.emailParams.isError = true
          this.emailParams.isSuccess = false
          this.isEmailCheck = true
          this.isEmailDiapuse = false
          this.emailChecked = true
          this.emailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL03
        } else {
          this.emailParams.isError = true
          this.emailParams.isSuccess = false
          this.isEmailCheck = false
          this.isEmailDiapuse = true
          this.emailChecked = true
          this.emailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL04

          // 이메일검증시 미정의된 오류로그 적제
          nslog.sendRecord(CONST.LOG.TYPE.ERROR, {
            type: CONST.LOG.MESSAGE.RESPONSE.WCSERROR,
            message: CONST.LOG.MESSAGE.CUSTOMER.JOIN_EMAIL_VERIFY_FAILED,
            trace: response,
            status: '500',
            page: errorUtil.getCurrentURL(),
            view: errorUtil.getComponentName()
          })
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('NsMobileMemberSignupCmd', invoke, successHandling, errorHandling)
      return Promise.resolve()
    },
    /**
     * 사용자명 검증 keyUp
     *
     * @param {string} value input 값
     * @param {Event} event 이벤트 객체
     * @returns {boolean|void}
     */
    checkUserNameKeyUp (value, event) {
      this.userNameParams.value = this.userNameParams.value.replace(/ /gi, '')
      const userName = this.userNameParams.value
      const strKorRegExp = /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(userName)
      const strEngRegExp = /[^A-Za-z]/g.test(userName)

      if (strKorRegExp && strEngRegExp) {
        this.userNameParams.isError = true
        this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME01
        return false
      } else {
        if (!strKorRegExp) {
          this.userNameParams.maxlength = 10
          if (userName.length > 10) {
            this.userNameParams.value = userName.slice(0, -1)
            if (!isNull(event.target)) {
              event.target.value = this.userNameParams.value // chrome mobile 대응
            }
          }
        } else if (!strEngRegExp) {
          this.userNameParams.maxlength = 20
          if (userName.length > 20) {
            this.userNameParams.value = userName.slice(0, -1)
            if (!isNull(event.target)) {
              event.target.value = this.userNameParams.value // chrome mobile 대응
            }
          }
        }
      }

      this.userNameParams.isError = false
      this.userNameParams.isSuccess = false
    },
    /**
     * 사용자명 검증 blur
     */
    checkUserName () {
      const name = this.userNameParams.value.trim()
      const validation = this.checkUserNameValidation(this.userNameParams)

      if (getBytes(name) > 20) {
        this.userNameParams.value = getCutBytes(name, 20)
      } else if (isNull(name) || !validation) {
        this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME01
        this.userNameParams.isError = true
        this.userNameParams.isSuccess = false
      } else if (name.length < 2) {
        this.userNameParams.isError = true
        this.userNameParams.isSuccess = false
        this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME02
      } else {
        this.userNameParams.isError = false
        this.userNameParams.isSuccess = true
      }
    },
    /**
     * 이메일아이디 처리
     *
     * @param {string} value input 값
     * @param {Event} event 이벤트 객체
     * @returns {boolean|void}
     */
    clearCheck (value, event) {
      this.isSuccess = false
      this.emailParams.value = this.emailParams.value.replace(/ /gi, '')

      const loginId = this.emailParams.value

      // 한글입력 막기
      const validationPattern = /[^a-zA-Z0-9-_.@]/.test(loginId)
      if (validationPattern) {
        this.emailParams.value = loginId.slice(0, -1)
        event.target.value = this.emailParams.value // chrome mobile 대응
        return false
      }

      /**
       * 이메일 도메인목록처리
       */
      this.getEmailAuto(this.emailParams)
    },
    /**
     * 가입정보저장하기 API호출
     *
     * @returns {boolean|void}
     */
    async saveJoin () {
      this.isMouseDown = false

      if (!this.isAgree || !this.isAgreeContent || !this.isAgreeAge) {
        this.isAgreeError = true
        return false
      } else {
        this.isAgreeError = false
      }

      const validateInputs = async () => {
        await this.checkJoinId()
        await flushPromises()

        if (this.userNameParams.isError) {
          this.checkUserName()
        }

        await this.checkPhone()
        await flushPromises()

        return Promise.resolve()
      }

      await validateInputs()
      await flushPromises()

      /** check state */
      const checkSuccessState = () => {
        if (this.emailParams.isSuccess && this.userNameParams.isSuccess && this.userPhoneParams.isSuccess) {
          return true
        }

        return false
      }

      const isAllSuccess = checkSuccessState()
      if (isAllSuccess) {
        const id = this.emailParams.value.toLowerCase()
        const password = this.makePassword()
        let idFlag = false // ID flag값

        if (id.indexOf('@') < 1) {
          idFlag = true
        }

        if (idFlag) {
          this.emailParams.isError = true
          this.emailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL01
          return false
        }

        const name = this.userNameParams.value.trim()

        // 이름 validation 체크
        if (!isHangul(name, true)) {
          this.userNameParams.isError = true
          this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME03
          return false
        }

        if (name.length < 2) {
          this.userNameParams.isError = true
          this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME02
          return false
        }

        let authNumber = ''

        // 회원가입 점유인증제거 - 핸드폰번호로 처음 가입 요청일 경우 인증번호 확인하지 않음
        if (this.isDuplicationHpNo) {
          authNumber = this.$refs.phoneAuth.verificationCode
          if (authNumber.length !== 4) {
            this.$refs.phoneAuth.verificationCode.isError = true
            this.$refs.phoneAuth.verificationCode.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE06
            return false
          }
        }

        const tempUserId = this.authObj.tempUserId
        const tel = this.userPhoneParams.value.trim().replace(/-/gi, '')
        const hpFirst = tel.substring(0, 3)
        const hpMid = tel.length === 10 ? tel.substring(3, 6) : tel.substring(3, 7)
        const hpLast = tel.length === 10 ? tel.substring(6) : tel.substring(7)

        const phone = `${hpFirst}-${hpMid}-${hpLast}`

        const invoke = {
          cmdType: 'save',
          memberType: 'K',
          phone,
          authNumber,
          tempUserId,
          agree: 'Y,Y,Y,Y',
          termsCd: 'SA-011,SX-001,SY-001,SZ-001',
          userProfileField2: 'Y',
          registpath: 'M',
          URL: 'NsMobileMemberSignupCmd',
          logonid: id,
          name,
          firstName: name,
          lastName: name,
          logonPassword: password,
          logonPasswordVerify: password,
          affilEntCd: COMM_CONST.getCocd(),
          entEmail: this.param.Email,
          entFlag: this.param.entFlag,
          entUserId: this.param.entUserId,
          refresh_token: this.param.access_token,
          entName: this.param.name,
          isDuplicationHpNo: this.isDuplicationHpNo,
          isSSORequest: false,
          snsLinkCtnt: JSON.stringify(this.param.snsLinkCtnt)
        }

        const successHandling = response => {
          const code = response.msg.result.resultCode
          const msg = response.msg.result.resultMsg

          if (code === 'Y' || code === 'y') {
            // 마케팅 스크립트 적용 부분
            // Airbridge
            let snsName = ''
            if (this.param.entFlag === 'NAVER') {
              snsName = '네이버'
            } else if (this.param.entFlag === 'KAKAO') {
              snsName = '카카오'
            } else if (this.param.entFlag === 'PAYCO') {
              snsName = '페이코'
            }
            if (!isNull(snsName)) {
              marketingUtil.airbridgeLogger.send({
                event: marketingUtil.airbridgeLogger.EVENT.SIGN_UP, // 회원가입
                data: {
                  action: '간편회원',
                  label: `${snsName}회원가입`
                }
              })
            }
            // AIQUA
            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_PROFILE,
              data: {
                userId: response.msg.memberInfo.custNum,
                name: '', // response.msg.memberInfo.userName,
                email: '', // response.msg.memberInfo.logonId,
                phoneNumber: '', // response.msg.memberInfo.userPhone,
                birthday: null,
                gender: null,
                loginStatus: 'N',
                devicePushAgree: '', // pushState,
                notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
                isEmployee: null,
                level: null,
                coCd: COMM_CONST.getCocd(),
                lastLogin: '' // qg_fileter_last_login 값
              }
            })
            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_EVENT,
              data: {
                event: 'registration_completed'
              }
            })
            // DTSI
            marketingUtil.dtsiLogger.send({
              data: {
                isSignUp: true // 회원가입 완료 페이지인 경우
              }
            })
            // 페이스북 픽셀
            marketingUtil.fbpixelLogger.send({
              type: marketingUtil.fbpixelLogger.EVENT.COMPLETE_REGISTRATION
            })
            // Recobell
            marketingUtil.recobellLogger.send({
              data: {
                category: marketingUtil.CATEGORY_ADD_LOGIN,
                action: response.msg.memberInfo.userId,
                memberInfo: {
                  userId: response.msg.memberInfo.userId,
                  userName: response.msg.memberInfo.userName,
                  userEmail: response.msg.memberInfo.logonId,
                  userPhone: response.msg.memberInfo.userPhone
                }
              }
            })
            // 소나 버그로 사용시 주석 해제 후 사용
            // if (isOsApp()) {
            // adbirx 송신용 파라미터
            // const invoke = {
            //   category: 'firstTimeExperience',
            //   action: 'join_complete'
            // }
            // Ns.Native.sendAdbrix(invoke)

            // invoke.category = 'Retention'
            // Ns.Native.sendAdbrix(invoke)

            // 회원가입 후 자동 로그인처리
            loginUtil.setUserInfo('userPass', password)
            loginUtil.setUserInfo('memberGradeCss', 'family')
            loginUtil.setUserInfo('gradeNm', '패밀리')
            loginUtil.setUserInfo('staffInfo', false)
            loginUtil.setUserInfo('staffInfoName', '')
            loginUtil.setUserInfo('logonId', response.msg.memberInfo.logonId)
            loginUtil.setUserInfo('phone1', response.msg.memberInfo.userPhone)
            loginUtil.setUserInfo('custNum', response.msg.memberInfo.custNum)
            loginUtil.setUserInfo('userId', response.msg.memberInfo.userId)
            loginUtil.setUserInfo('userName', response.msg.memberInfo.userName)
            loginUtil.setUserInfo('loginyn', 'Y')
            loginUtil.setUserInfo('entEmail', this.param.Email)
            loginUtil.setUserInfo('entFlag', this.param.entFlag)
            loginUtil.setUserInfo('entUserId', this.param.entUserId)
            loginUtil.setUserInfo('refresh_token', this.param.access_token)
            loginUtil.setUserInfo('entName', this.param.name)
            loginUtil.setUserInfo('snsLinkCtnt', this.param.snsLinkCtnt)
            // 구글 스마트락 로그인 저장 시작 및 자동로그인 정보 저장
            if (isOsApp()) {
              if (viewType() === 'android' && !isNull(password)) {
                nativeUtil.saveCredential(response.msg.memberInfo.logonId, password)
              }
              localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_ID, cipherUtil.encryptValue(response.msg.memberInfo.logonId))
              localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_PW, cipherUtil.encryptValue(password))
              localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_FLAG, this.param.entFlag)
              localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_USER_ID, this.param.entUserId)
              localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_REFRESH_TOKEN, this.param.access_token)
              /*
              const autoLoginInfo = {}
              autoLoginInfo.entFlag = this.param.entFlag
              autoLoginInfo.entUserId = this.param.entUserId
              autoLoginInfo.refreshToken = this.param.access_token
              autoLoginInfo.entName = this.param.entName
              autoLoginInfo.entEmail = this.param.entEmail
              localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_USER_INFO, autoLoginInfo)
              */
              const memberInfo = loginUtil.getMemberInfo()
              // Native 로그인 정보 전달
              memberInfo.birthday = ''
              memberInfo.gender = ''
              memberInfo.isAutoLoginCheck = true
              memberInfo.registration = ''
              memberInfo.staffBnft = ''
              memberInfo.lastOrder = ''
              memberInfo.userMargetingEmail = ''
              memberInfo.userMargetingTM = ''
              memberInfo.userMarketingSMS = ''
              memberInfo.adultAuthYN = 'N'
              memberInfo.coCd = COMM_CONST.getCocd()
              memberInfo.userPass = ''
              nativeUtil.setLoginMemberInfo(JSON.stringify(memberInfo))

              // 마케팅 스크립트
              // AIQUA User Profile
              // 간헐적으로 전송이 안되는 경우 때문에 추가한 부분
              marketingUtil.aiquaLogger.send({
                type: marketingUtil.aiquaLogger.USER_PROFILE,
                data: {
                  userId: memberInfo.custNum,
                  name: '', // memberInfo.userName,
                  email: '', // memberInfo.email,
                  phoneNumber: '',
                  birthday: '',
                  gender: '',
                  loginStatus: 'Y',
                  devicePushAgree: '',
                  notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
                  isEmployee: '',
                  level: memberInfo.gradeNm,
                  coCd: memberInfo.coCd,
                  lastLogin: '' // qg_fileter_last_login 값
                }
              })

              const userInfo = {
                logonId: response.msg.memberInfo.logonId,
                userId: response.msg.memberInfo.userId,
                userName: response.msg.memberInfo.userName,
                entFlag: '',
                entEmail: '',
                entUserId: '',
                birthday: '',
                gender: '',
                isAutoLoginCheck: false,
                registration: '',
                staffInfo: '',
                staffBnft: '',
                lastOrder: '',
                loginyn: 'Y',
                userMargetingEmail: '',
                userMargetingTM: '',
                userMarketingSMS: '',
                gradeNm: '패밀리',
                custNum: response.msg.memberInfo.custNum,
                adultAuthYN: ''
              }
              nativeUtil.setLoginMemberInfo(JSON.stringify(userInfo))
            }

            const goingInvoke = {
              name: 'memberComplete',
              params: {
                userName: response.msg.memberInfo.userName,
                userPhone: response.msg.memberInfo.userPhone,
                userEMail: response.msg.memberInfo.logonId,
                userPass: password,
                userId: response.msg.memberInfo.userId,
                affilEntCd: 110,
                entEmail: this.param.Email,
                entFlag: this.param.entFlag,
                entUserId: this.param.entUserId,
                refresh_token: this.param.access_token,
                entName: this.param.name,
                snsLinkCtnt: this.param.snsLinkCtnt
              }
            }

            this.$router.push(goingInvoke)
          } else {
            this.saveChecked = true
            this.saveErrorMsg = msg

            // 정의되지않은 회원가입실패 오류LOG적재
            nslog.sendRecord(CONST.LOG.TYPE.ERROR, {
              type: CONST.LOG.MESSAGE.RESPONSE.WCSERROR,
              message: CONST.LOG.MESSAGE.CUSTOMER.JOIN_API_FAILED,
              trace: response,
              status: '500',
              page: errorUtil.getCurrentURL(),
              view: errorUtil.getComponentName()
            })
          }
        }
        this.$nsaxios.post('NsMobileMemberSignupCmd', invoke, successHandling, this.errorHandling)
      } else {
        const isSuccessArray = [
          {
            stat: this.emailParams.isSuccess,
            inputName: 'email'
          },
          {
            stat: this.userNameParams.isSuccess,
            inputName: 'name'
          },
          {
            stat: this.userPhoneParams.isSuccess,
            inputName: 'phone'
          }
        ]

        for (let i = 0; i < isSuccessArray.length; i++) {
          const tmpMap = isSuccessArray[i]
          if (!tmpMap.stat) {
            if (tmpMap.inputName === 'email') {
              this.emailParams.isError = true
              if (this.emailParams.errorMessage === '') {
                this.emailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL02
              }
            } else if (tmpMap.inputName === 'name') {
              this.userNameParams.isError = true

              if (this.userNameParams.errorMessage === '') {
                this.userNameParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME01
              }
            } else if (tmpMap.inputName === 'phone') {
              this.userPhoneParams.isError = true

              if (this.userPhoneParams.errorMessage === '') {
                this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE00
              }
            }
          }
        }
        return false
      }
    },
    /**
     * saveJoin errorHandling
     * 저장시 통신에러 발생시 최대 5번까지 재통신하도록 구현
     */
    errorHandling (error) {
      console.error(error)
      if (this.isSaveFailCnt < 6) {
        this.saveJoin()
      }
    },
    /**
     * 휴대폰번호 숫자형 처리
     */
    onKeyUpOnlyNumber () {
      this.userPhoneParams.type = 'tel'
      onKeyUpOnlyNumber(this.userPhoneParams)
    },
    /**
     * 휴대폰인증번호 수신 실패초기화
     */
    isPhoneFailMed () {
      this.isPhoneFail = false
    },
    /**
     * 휴대폰번호 검증
     *
     * @returns {boolean|void}
     */
    async checkPhone () {
      const tel = this.userPhoneParams.value.replace(/-/gi, '')

      // 이미인증된경우 핸드폰번호 검증을 하지 않는다.
      if (this.userPhoneParams.verification.isSuccess) {
        return false
      }

      // 입력된 핸드폰번호가 없으면 휴대폰번호 체크하지 않는다.
      if (tel.length === 0) {
        this.userPhoneParams.isError = true
        this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE00

        return false
      }

      // 핸드폰자리가 11자리 이하일 경우
      if (tel.length < 10 && !this.isPhoneFail) {
        this.userPhoneParams.isError = true
        this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12

        return Promise.resolve(false)
      } else if (this.isPhoneFail) {
        this.phoneAuth()

        return Promise.resolve(false)
      }

      const dialing = PHONE_CONST.HP_DIALING
      const inputDialing = tel.substring(0, 3)
      let isPattern = false

      for (let i = 0; i < dialing.length; i++) {
        if (dialing[i] === inputDialing) {
          isPattern = true
        }
      }

      if (!isPattern) {
        this.userPhoneParams.isError = true
        this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12

        return Promise.resolve(false)
      }

      this.userPhoneParams.type = 'text'
      const hpFirst = tel.substring(0, 3)
      const hpMid = tel.length === 10 ? tel.substring(3, 6) : tel.substring(3, 7)
      const hpLast = tel.length === 10 ? tel.substring(6) : tel.substring(7)
      this.userPhoneParams.value = `${hpFirst}-${hpMid}-${hpLast}`

      const phone = `${hpFirst}-${hpMid}-${hpLast}`
      const invoke = {
        cmdType: 'getDuplicationHpNo',
        phone
      }

      // 인증번호 요청시마다 항태 초기화
      this.authObj.phone = phone

      if (this.isSendCertNumber === false) {
        this.isSendCertNumber = true

        const successHandling = response => {
          this.isSendCertNumber = false
          this.userPhoneParams.type = 'tel'

          const msg = response.msg.result.resultMsg
          const code = response.msg.result.resultCode

          // 중복 값이 있을경우 A
          if (code === 'A') {
            this.isPhoneFail = true // 중복값 존재 영역 노출
            this.isTvMember = false
            this.isPhoneAuthVisible = false
            this.userPhoneParams.isError = true // 중복값 존재 영역 노출

            this.userPhoneParams.isSuccess = false // 인증완료 영역 미노출

            this.sendMsg = ''

            const arrIds = response.msg.logonIds.split('|')
            let strIds = ''
            for (let i = 0; i < arrIds.length; i++) {
              if (i === 0) {
                strIds = arrIds[i]
              } else {
                strIds += `, ${arrIds[i]}`
              }
            }

            this.searchEmail = strIds
            const messageList = MEMBER_CONST.MEMBER_TEXT.EMAIL05
            const errorMessage = `${strIds}${messageList}`
            this.userPhoneParams.errorMessage = errorMessage
            return false
          } else if (code === 'A1') {
            // TV 회원 정보가 있을 경우
            this.isPhoneFail = true // 중복값 존재 영역 노출
            this.isTvMember = true
            this.userPhoneParams.isError = true // 중복값 존재 영역 노출
            this.isPhoneAuthVisible = false

            this.userPhoneParams.isSuccess = false // 인증완료 영역 미노출

            this.sendMsg = ''
            this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.TVMEMBERMSG

            return false
          } else if (code === 'S0') {
            this.isPhoneFail = false // 중복값 존재 영역 미노출
            this.isTvMember = false
            this.isDuplicationHpNo = false
            this.isPhoneAuthVisible = false
            this.userPhoneParams.isError = false
            this.userPhoneParams.isSuccess = true

            this.isResend = false // 인증번호발송 영역 미노출

            return true
          } else {
            this.userPhoneParams.isSuccess = true
            // 정의되지않은 휴대폰인증검증 오류LOG적재
            nslog.sendRecord(CONST.LOG.TYPE.ERROR, {
              type: CONST.LOG.MESSAGE.RESPONSE.WCSERROR,
              message: CONST.LOG.MESSAGE.CUSTOMER.JOIN_PHONE_VERIFY_DUPPLICATION,
              trace: response,
              status: '500',
              page: errorUtil.getCurrentURL(),
              view: errorUtil.getComponentName()
            })
          }
          messageUtil.alert(msg)
        }
        const errorHandling = () => {
          messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
        }

        await this.$nsaxios.post('NsMobileMemberSignupCmd', invoke, successHandling, errorHandling)
      }
    },
    /**
     * 이용약관 레이어팝업 호출
     */
    async agreePopup () {
      const termsDate = await this.getTermsOfUseData()
      this.agreeLayerParam.mallUserGuide = termsDate.mallUserGuide
      this.agreeLayerParam.mobileGuide = termsDate.mobileGuide

      modalUtil.show('customer/MemberAgree.vue', this.agreeLayerParam, this.agreeLayerCallback, true, true)

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '로그인',
            t2: '회원가입',
            t3: '간편회원가입',
            t4: '약관동의전문보기'
          }
        }
      })
    },
    /**
     * 이용약관 레이어팝업 callback처리
     *
     * @param {object} callbackData 이용약관 콜백데이터
     */
    agreeLayerCallback (callbackData) {
      if (callbackData) {
        this.singleLayerCallback.isAgreeTerms = callbackData.isAgreeTerms
      }
      this.isAgreeChecked('terms')
    },
    /**
     * 인증모드 전환
     */
    phoneAuth () {
      this.userPhoneParams.verification.isVerficationMode = !this.userPhoneParams.verification.isVerficationMode
    },
    /**
     * 이메일 도메인셋팅
     *
     * @param {String} id 이메일아이디
     * @param {String} domain 이메일도메인
     */
    changeValue (id, domain) {
      this.isActive = false
      this.emailParams.value = id.trim() + domain
      this.checkJoinId()
    },
    /**
     * 휴대폰 인증 영역 표시
     */
    showPhoneAuth () {
      this.isPhoneAuthVisible = true
      this.isPhoneFail = false
      this.userPhoneParams.isError = false // phone input error 메시지 가리기
    },
    /**
     * 휴대폰 인증 영역 가리기
     */
    hidePhoneAuth () {
      this.isPhoneAuthVisible = false
    },
    /**
     * 휴대폰 점유인증 인증 모듈 호출
     */
    async sendVerificationCode () {
      this.showPhoneAuth()

      await this.$refs.phoneAuth.sendVerificationCode()
    },
    /**
     * 인증번호 전송 후처리
     *
     * @param {import('@components/ui/PhoneAuth.vue').resultObject} resultObject 인증번호전송데이터
     */
    handleSendVerificationCode (resultObject) {
      const phoneNumber = this.userPhoneParams.value.trim().replace(/-/gi, '')

      this.authObj.phone = ''
      this.authObj.phone = insertSeparatorPhoneNumber(phoneNumber, '-')

      if (resultObject.response) {
        const code = resultObject.response.msg.result.resultCode

        this.authObj = {
          authnumber: '',
          phone: ''
        }

        // 인증번호 발송 완료
        if (code === 'Y') {
          this.isDuplicationHpNo = true

          this.authObj.authnumber = resultObject.response.msg.authnumber
          this.authObj.tempUserId = resultObject.response.msg.tempUserId
          this.authObj.phone = phoneNumber
        }
      }
    },
    /**
     * 인증번호 확인 후처리
     *
     * @param {import('@components/ui/PhoneAuth.vue').resultObject} resultObject 인증후결과데이터
     */
    handleCheckVerificationCode (resultObject) {
      if (resultObject.response) {
        const result = resultObject.response.msg.result.processMsg

        if (result === 'S') {
          this.userPhoneParams.isSuccess = true
          this.userPhoneParams.verification.isSuccess = true
          this.userPhoneParams.disabled = true
          this.isPhoneAuthVisible = false
          this.hasVerified = true
        }
      }
    },
    /**
     * 아이디 input용 blur 이벤트 콜백
     * @param {Object} event blur 이벤트
     */
    handleBlurIDInput (event) {
      if (this.isMouseDown) {
        this.saveJoin()
        return
      }

      this.checkMoveTarget(event)
      this.checkJoinId()
    },
    /**
     * 휴대폰 input용 blur 이벤트 콜백
     * @param {Object} event blur 이벤트
     */
    handleBlurPhoneInput (event) {
      if (this.isMouseDown) {
        this.saveJoin()
        return
      }

      this.checkPhone()
    },
    /**
     * 휴대폰 인증 만료 후처리
     */
    handleExpiredVerificationCode () {
      this.userPhoneParams.isSuccess = false
      this.userPhoneParams.verification.isSuccess = false
      this.userPhoneParams.disabled = false
      this.isPhoneAuthVisible = true
      this.userPhoneParams.isError = false // phone input error 메시지 가리기
      this.hasVerified = false
    },
    /**
     * 패스워드 랜덤값생성
     *
     * @returns {string}
     */
    makePassword () {
      let text = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

      for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }

      return text
    },
    /**
     * 약관 전체동의 클릭이벤트
     * @returns {void}
     */
    isAgreeAllChecked () {
      const isAgreeAll = this.$refs.allAgree.checked

      if (isAgreeAll) {
        if (!this.singleLayerCallback.isAgreeTerms) {
          messageUtil.alert('이용약관을 확인해주세요.', () => {
            this.$refs.allAgree.checked = false
            this.isAgreeAll = false
          })
        } else {
          this.isAgreeAll = true
          this.isAgree = true
          this.isAgreeContent = true
          this.isAgreeAge = true
          this.$refs.agree.checked = true
          this.$refs.agreeContent.checked = true
          this.$refs.agreeAge.checked = true
          this.isAgreeError = false
        }
      } else {
        this.isAgreeAll = false
        this.isAgree = false
        this.isAgreeContent = false
        this.isAgreeAge = false
        this.$refs.agree.checked = false
        this.$refs.agreeContent.checked = false
        this.$refs.agreeAge.checked = false
        this.isAgreeError = true
      }
    },
    /**
     * 약관/개인정보 수집동의 클릭처리
     * @param {string} type 약관 or 개인정보 수집동의 구분값
     * @returns {void}
     */
    isAgreeChecked (type) {
      if (type === 'terms') {
        const isTerms = this.$refs.agree.checked
        if (isTerms) {
          if (!this.singleLayerCallback.isAgreeTerms) {
            messageUtil.alert('이용약관을 확인해주세요.', () => {
              this.$refs.agree.checked = false
              this.isAgree = false
            })
          } else {
            this.isAgree = true
            this.isAgreeError = false
          }
        } else {
          this.isAgree = false
        }
      } else if (type === 'content') {
        const isContent = this.$refs.agreeContent.checked
        if (isContent) {
          this.isAgreeContent = true
          this.isAgreeError = false
        } else {
          this.isAgreeContent = false
        }
      } else if (type === 'agreeAge') {
        const isAge = this.$refs.agreeAge.checked
        if (isAge) {
          this.isAgreeAge = true
          this.isAgreeError = false
        } else {
          this.isAgreeAge = false
        }
      }

      if (this.isAgree && this.isAgreeContent && this.isAgreeAge) {
        this.$refs.allAgree.checked = true
        this.isAgreeAll = true
      } else {
        this.$refs.allAgree.checked = false
        this.isAgreeAll = false
        this.isAgreeError = true
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/join/JoinSimple";
</style>
