<template>
  <div class="member_modify">
    <div class="member_modify_base">
      <strong class="member_modify_title">
        기본정보
      </strong>
      <div class="member_modify_form">
        <ns-input
          :params="userNameParams"
        />
        <div class="member_modify_accordion" :class="idCollapse ? 'active' : ''">
          <ns-input
            :params="logonParams"
          />
          <button
            type="button"
            class="btn_collapse"
            @click="onCollapse('id')"
          >
            <span>{{ seen.id.text }}</span>
          </button>
          <div class="collapse_wrap">
            <!-- 인증메일 발송 -->
            <template v-if="!isSendEmail">
              <p class="notice_msg">
                이메일 변경을 위해서 인증이 필요합니다. 변경하실 이메일 주소를 입력해 주세요.
              </p>
              <div class="dropdown_wrap">
                <ns-input
                  :params="userEmailParams"
                  @input="checkEmail"
                  @blur="checkMoveTarget($event)"
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
              <p
                v-if="isEmailAuthSendError"
                class="error_msg"
                v-html="emailAuthSendErrormsg"
              />
              <button
                type="button"
                class="btn_send_mail"
                @click="sendVerificationCodeEmail"
              >
                <span>인증메일 발송</span>
              </button>
            </template>
            <!-- //인증메일 발송 -->

            <!-- 인증번호 발송 -->
            <p
              v-show="isSendEmail"
              class="notice_msg"
            >
              입력하신 이메일({{ mailAddr }})으로 인증 메일이 발송되었습니다.
            </p>
            <email-auth
              v-show="isSendEmail"
              ref="emailAuth"
              :email="userEmailParams.value"
              :auth-type="emailAuthType"
              @sendVerificationCode="handleSendVerificationCodeEmail"
              @checkVerificationCode="handleCheckVerificationCodeEmail"
            />
            <!-- //인증번호 발송 -->
          </div>
        </div>
        <div class="member_modify_accordion" :class="passwordCollapse ? 'active' : ''">
          <ns-input
            :params="passwordParams"
          />
          <button
            type="button"
            class="btn_collapse"
            @click="onCollapse('pass')"
          >
            <span>{{ seen.password.text }}</span>
          </button>
          <div class="collapse_wrap">
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
            <div class="btn_group">
              <button
                type="button"
                class="btn_modify"
                @click="chagePassword"
              >
                <span>수정</span>
              </button>
            </div>
          </div>
        </div>

        <div class="member_modify_accordion" :class="phoneCollapse ? 'active' : ''">
          <ns-input
            :params="phoneParams"
          />
          <button
            type="button"
            class="btn_collapse"
            @click="onCollapse('phone')"
          >
            <span>{{ seen.phone.text }}</span>
          </button>
          <div class="collapse_wrap">
            <ns-input
              :params="userPhoneParams"
              @focus="onKeyUpOnlyNumber"
              @input="isPhonePattern($event, userPhoneParams);"
              @blur="checkPhone"
            />
            <!-- 인증번호 전송 -->
            <button
              v-if="!isPhoneAuthVisible"
              type="button"
              class="btn_send_phone"
              @click="sendVerificationCode"
            >
              <span>인증번호 전송</span>
            </button>
            <!-- //인증번호 전송 -->
            <!-- 인증번호 입력 -->
            <phone-auth
              v-show="isPhoneAuthVisible"
              ref="phoneAuth"
              :phone-number="userPhoneParams.value"
              :auth-type="authType"
              :user-name="userNameParams.value"
              @sendVerificationCode="handleSendVerificationCode"
              @checkVerificationCode="handleCheckVerificationCode"
            />
            <!-- //인증번호 입력 -->
          </div>
        </div>
      </div>
    </div>
    <div class="member_modify_delivery">
      <div class="member_modify_title_wrap">
        <strong class="member_modify_title">
          배송지 정보
        </strong>
        <a
          class="btn_delivery"
          @click="deleveryAddressBook"
        >
          <span>배송지 관리</span>
        </a>
      </div>
      <dl class="member_modify_delivery_info">
        <dt>받는분</dt>
        <dd>{{ userAddress.userReceiverInAddress }}</dd>
        <dt>주소</dt>
        <dd>{{ userAddress.userAddressInAddress }}</dd>
        <dt>연락처</dt>
        <dd>{{ userAddress.userPhoneInAddress }}</dd>
      </dl>
    </div>
    <div class="member_modify_additional_information">
      <strong class="member_modify_title">
        추가정보(선택)
      </strong>
      <div class="member_modify_form">
        <div class="birth_modify">
          <ns-input
            :params="birthDayParams"
            @input="numberCheck"
          />
          <button
            v-show="!birthDayParams.disabled"
            type="button"
            class="btn_save"
            @click="saveBirth"
          >
            <span>저장</span>
          </button>
        </div>
        <div class="input_field sex">
          <label class="label_text">성별</label>
          <div class="radio_wrap">
            <label>
              <input
                ref="genderF"
                type="radio"
                class="radio"
                value="F"
                name="radio_sex"
                :checked="isGenderF"
                @click="setSex('F')"
              >
              <span class="radio_label">여자</span>
            </label>
            <label>
              <input
                type="radio"
                class="radio"
                name="radio_sex"
                value="M"
                :checked="isGenderM"
                @click="setSex('M')"
              >
              <span class="radio_label">남자</span>
            </label>
          </div>
        </div>
        <div class="marketing_agree">
          <label class="label_text">상품 / 이벤트 / 금융정보 알림 수신 동의</label>
          <div class="checkbox_wrap">
            <p class="check_all">
              <label>
                <input
                  ref="allAgree"
                  type="checkbox"
                  class="checkbox square"
                  :checked="isAllAgree"
                  @click="setAllAgree"
                >
                <span class="check_label">전체동의</span>
              </label>
            </p>
            <ul class="check_list">
              <li>
                <label>
                  <input
                    ref="agreeEmail"
                    type="checkbox"
                    class="checkbox square"
                    :checked="isAgreeEmail"
                    @click="setAgree('mail')"
                  >
                  <span class="check_label">이메일</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    ref="agreeSms"
                    type="checkbox"
                    class="checkbox square"
                    :checked="isAgreeSMS"
                    @click="setAgree('sms')"
                  >
                  <span class="check_label">SMS</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    ref="agreeTel"
                    type="checkbox"
                    class="checkbox square"
                    :checked="isAgreeTel"
                    @click="setAgree('tel')"
                  >
                  <span class="check_label">전화</span>
                </label>
              </li>
            </ul>
            <div class="table">
              <table>
                <caption><span class="blind">상품/이벤트/금융정보 알림</span></caption>
                <thead>
                  <tr>
                    <th scope="col">
                      목적
                    </th>
                    <th scope="col">
                      항목
                    </th>
                    <th scope="col">
                      보유기간
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>재테크, 보험, 상조, 렌탈상품이나 할인, 이벤트 정보 안내</td>
                    <td>이메일주소, 휴대폰번호, 성별, 법정생년월일, 수신처</td>
                    <td>동의철회시 또는 회원탈퇴시까지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastUtil from '@frameworks/toastUtil'
import {
  getNowDate,
  getAgeInFull,
  getNowTime
} from '@frameworks/dateutil/dateUtil'
import NsInput from '@components/common/NsInput'
import NsPassword from '@components/customer/NsPassword'
import loginUtil from '@/common/utils/loginUtil'
import {
  isNull,
  onKeyUpOnlyNumber,
  validatePassword,
  isEmail
} from '@utils/commonutil/commonUtil'
import cipherUtil from '@frameworks/cipherUtil'
import MEMBER_CONST from '@/common/constants/customer/member'
import cookieUtil from '@frameworks/cookieUtil'
import messageUtil from '@frameworks/messageUtil'
import inputMixin from '@/mixins/ui/inputMixin'
import PhoneAuth from '@components/common/PhoneAuth'
import PHONE_AUTH_CONST from '@constants/customer/phoneAuth'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import EmailAuth from '@components/customer/EmailAuth'
import EMAIL_AUTH_CONST from '@/common/constants/customer/emailAuth'
import COMM_CONST from '@constants/framework/constants'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
// import bizUtil from '@utils/bizUtil'
import popupUtil from '@frameworks/popupUtil'

export default {
  components: {
    NsInput,
    NsPassword,
    PhoneAuth,
    EmailAuth
  },
  mixins: [
    inputMixin,
    customerInputMixin
  ],
  data () {
    return {
      idCollapse: '',
      passwordCollapse: '',
      phoneCollapse: '',
      mailAddr: '',
      isSendEmail: false,
      isSendPhone: false,
      isActive: false,
      isEmailDisabled: false,
      isEmailAuthSendError: false,
      isPhoneAuthSend: false,
      isPhoneAuthSendError: false,
      emailAuthNumber: '',
      phoneAuthNumber: '',
      emailAuthSendErrormsg: '',
      phoneAuthSendmsg: '',
      phoneAuthSendErrormsg: '',
      gender: '',
      isGenderF: false,
      isGenderM: false,
      isAllAgree: false,
      isAgreeEmail: false,
      isAgreeSMS: false,
      isAgreeTel: false,
      isAgreeApiCheck: false,
      isPasswordCheck: false,
      authMaxLength: 4,
      seen: {
        id: {
          text: '변경'
        },
        password: {
          text: '변경'
        },
        phone: {
          text: '변경'
        }
      },
      logonParams: {
        value: '',
        iconClass: 'line',
        title: '아이디',
        placeholder: '아이디(이메일)',
        maxlength: 40,
        type: 'text',
        readonly: true,
        disabled: true,
        isLabel: true,
        labelKind: 'label_text',
        isSuccess: false,
        isError: false,
        errorMessage: ''
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
        errorMessage: MEMBER_CONST.MEMBER_TEXT.EMAIL01
      },
      passwordParams: {
        value: '',
        iconClass: 'line',
        title: '비밀번호',
        placeholder: '',
        maxlength: 40,
        type: 'password',
        readonly: true,
        disabled: true,
        isLabel: true,
        labelKind: 'label_text',
        isSuccess: false,
        isError: false,
        errorMessage: ''
      },
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
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PASS03
      },
      userNameParams: {
        value: '',
        iconClass: 'line',
        title: '이름',
        placeholder: '이름',
        maxlength: 40,
        type: 'text',
        readonly: true,
        disabled: true,
        isLabel: true,
        labelKind: 'label_text',
        isSuccess: false,
        isError: false,
        errorMessage: ''
      },
      phoneParams: {
        value: '',
        iconClass: 'line',
        title: '휴대폰',
        placeholder: '휴대폰',
        maxlength: 13,
        type: 'text',
        readonly: true,
        disabled: true,
        isLabel: true,
        labelKind: 'label_text',
        isSuccess: false,
        isError: false,
        errorMessage: ''
      },
      userPhoneParams: {
        value: '',
        iconClass: 'phone',
        title: MEMBER_CONST.MEMBER_TEXT.PHONETITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.PHONEPLACEHOLDER,
        maxlength: 11,
        type: 'tel',
        isLabel: false,
        disabled: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.PHONE12
      },
      birthDayParams: {
        value: '',
        iconClass: 'birth',
        title: MEMBER_CONST.MEMBER_TEXT.BIRTH01,
        placeholder: MEMBER_CONST.MEMBER_TEXT.BIRTH02,
        maxlength: 8,
        type: 'tel',
        isLabel: true,
        labelKind: 'label_text',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.BIRTH03
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
      userAddress: {
        userReceiverInAddress: '',
        userAddressInAddress: '',
        userPhoneInAddress: ''
      },
      emailInvoke: {},
      passwordInvoke: {},
      phoneInvoke: {},
      emailList: [],
      searchQuery: '',
      isPhoneAuthVisible: false,
      authType: PHONE_AUTH_CONST.AUTH_TYPE.MEMBER_MODIFY,
      emailAuthType: EMAIL_AUTH_CONST.AUTH_TYPE.MEMBER_MODIFY
    }
  },
  created () {
    this.onLoad()
  },
  mounted () {
    window.addEventListener('click', this.windowListenerCallback)
  },
  beforeDestroy () {
    // 비밀번호 인증 완료 쿠키 삭제
    cookieUtil.deleteCookie('securityVerification')

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
     * 초기 사용자정보 조회한다.
     */
    onLoad () {
      const invoke = {
        processFlag: 'List'
      }
      const successHandling = response => {
        const logonId = response.msg.root.PersonalInfo.logonId
        const password = loginUtil.getUserInfo('logonPassword')
        let phone = response.msg.root.PersonalInfo.phoneNum
        const margetingTm = response.msg.root.PersonalInfo.tmYn
        const margetingSms = response.msg.root.PersonalInfo.smsYn
        const margetingEmail = response.msg.root.PersonalInfo.emailYn

        if (!isNull(phone)) {
          const hpFirst = phone.substring(0, 3)
          const hpMid = phone.length === 10 ? phone.substring(3, 6) : phone.substring(3, 7)
          const hpLast = phone.length === 10 ? phone.substring(6) : phone.substring(7)
          phone = `${hpFirst}-${hpMid}-${hpLast}`
        }

        this.logonParams.value = logonId
        // this.userEmailParams.value = ''
        // this.passwordParams.value = password
        this.inputNewPwdParams.value = ''
        this.phoneParams.value = phone || ''
        this.userNameParams.value = response.msg.root.PersonalInfo.lastName || ''
        // this.userPhoneParams.value = ''
        this.gender = response.msg.root.PersonalInfo.gender || ''

        if (!this.idCollapse) {
          this.userEmailParams.value = ''
        }

        if (!this.phoneCollapse) {
          this.userPhoneParams.value = ''
        }

        if (this.passwordCollapse) {
          this.passwordParams.value = ''
        } else {
          this.passwordParams.value = password || ''
        }

        // 생년월일 세팅
        this.birthDayParams.value = response.msg.root.PersonalInfo.relBirth || ''
        if (loginUtil.getUserInfo('adultAuthYN') === 'Y') {
          this.birthDayParams.disabled = true
        }
        // 성별세팅
        if (this.gender === '여성') {
          this.isGenderF = true
        } else if (this.gender === '남성') {
          this.isGenderM = true
        }
        // 마케팅 초기값
        if (margetingTm === 'Y') {
          this.isAgreeTel = true
        } else {
          this.isAgreeTel = false
        }
        if (margetingSms === 'Y') {
          this.isAgreeSMS = true
        } else {
          this.isAgreeSMS = false
        }
        if (margetingEmail === 'Y') {
          this.isAgreeEmail = true
        } else {
          this.isAgreeEmail = false
        }

        if (this.isAgreeEmail && this.isAgreeSMS && this.isAgreeTel) {
          this.isAllAgree = true
        }

        // 배송지 정보
        this.addressAccess()
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      this.$nsaxios.post('MobilePersonalInfoManageCmdReal', invoke, successHandling, errorHandling)
    },
    /**
     * 고객 배송지정보 데이터 가져오기
     * @returns {void}
     */
    async addressAccess () {
      const userAddressSuccessHandling = response => {
        const addressList = response.msg.addressList
        if (addressList.length > 0) {
          const primaryAddress = addressList[0]
          this.userAddress.userReceiverInAddress = primaryAddress.lastName
          this.userAddress.userAddressInAddress = `${primaryAddress.addressBas} ${primaryAddress.addressDtl}`
          this.userAddress.userPhoneInAddress = primaryAddress.phone1
        } else {
          this.userAddress.userReceiverInAddress = ''
          this.userAddress.userAddressInAddress = ''
          this.userAddress.userPhoneInAddress = ''
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }
      await this.$nsaxios.post('NSShippingAddressAccessCmdReal', { processFlag: 'List' }, userAddressSuccessHandling, errorHandling)
    },
    /**
     * 변경/취소 버튼처리
     *
     * @param {string} type 타입
     */
    onCollapse (type) {
      if (type === 'id') {
        this.idCollapse = !this.idCollapse
        this.seen.id.text = this.idCollapse ? '취소' : '변경'
        this.isActive = false
        this.isSendEmail = false
      } else if (type === 'pass') {
        this.passwordCollapse = !this.passwordCollapse
        this.seen.password.text = this.passwordCollapse ? '취소' : '변경'
        this.inputNewPwdParams.value = ''
        this.inputPwdConfirmParams.value = ''
        this.inputNewPwdParams.isError = false
        this.inputPwdConfirmParams.isError = false
        this.isPasswordCheck = false
      } else if (type === 'phone') {
        this.phoneCollapse = !this.phoneCollapse
        this.seen.phone.text = this.phoneCollapse ? '취소' : '변경'
        this.userPhoneParams.value = ''
        this.userPhoneParams.isError = false
        this.$refs.phoneAuth.$refs.verificationCodeInput.value = ''
        this.phoneAuthNumber = ''
        this.isPhoneAuthVisible = false
        this.userPhoneParams.disabled = false
      }
      this.setModifyDefData()
    },
    /**
     * 초기 정보 세팅
     */
    setModifyDefData () {
      const password = loginUtil.getUserInfo('logonPassword')

      if (!this.idCollapse) {
        this.userEmailParams.value = ''
      }

      if (!this.phoneCollapse) {
        this.userPhoneParams.value = ''
      }

      if (this.passwordCollapse) {
        this.passwordParams.value = ''
      } else {
        this.passwordParams.value = password
      }
    },
    /**
     * 메일주소 유효성 체크 및 메일도메인 처리
     *
     * @param {string} value input 값
     * @param {Event} event 이벤트 객체
     * @returns {boolean|void}
     */
    checkEmail (value, event) {
      // 한글입력 막기
      const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
      this.userEmailParams.value = this.userEmailParams.value.replace(/ /gi, '')

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
      }

      this.userEmailParams.isError = false

      this.isSuccess = false
      this.userEmailParams.value = this.userEmailParams.value.trim()

      const loginId = this.userEmailParams.value

      const validationPattern = /[^a-zA-Z0-9-_.@]/.test(loginId)
      if (validationPattern) {
        this.userEmailParams.value = loginId.slice(0, -1)
        event.target.value = this.userEmailParams.value // chrome mobile 대응
        return false
      }

      /**
       * 이메일 도메인목록처리
       */
      this.getEmailAuto(this.userEmailParams)
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
      const oldPhoneNo = this.phoneParams.value.trim().replace(/-/gi, '')

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

      if (oldPhoneNo === tel) {
        this.userPhoneParams.isError = true
        this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.AUTHSENDERRMSG2
        return false
      }

      this.userPhoneParams.isError = false
      this.$refs.phoneAuth.$refs.verificationCodeInput.value = ''
      this.phoneAuthNumber = ''
      this.isPhoneAuthVisible = false
    },
    /**
     * 이메일 도메인셋팅
     *
     * @param {String} id 이메일아이디
     * @param {String} domain 도메인
     * @returns {void}
     */
    changeValue (id, domain) {
      this.isActive = false
      this.userEmailParams.value = id.trim() + domain
    },
    /**
     * 생년월일 체크
     *
     * @param {String} id 이메일아이디
     * @param {String} domain 도메인
     * @returns {boolean|void}
     */
    numberCheck () {
      this.birthDayParams.value = this.birthDayParams.value.replace(/-/gi, '')
      let birthVal = this.birthDayParams.value
      const pattern = /^([0-9]{1,})$/ // 정규식 패턴
      let bOnlyNumber = true
      const maxLang = this.birthDayParams.maxlength

      if (birthVal !== '') {
        bOnlyNumber = pattern.test(birthVal)
      }

      // 숫자여부 판단 및 처리
      if (!bOnlyNumber) {
        this.birthDayParams.isError = true
        this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH03

        birthVal = birthVal.replace(/[^0-9]/gi, '') // 숫자만 나오도록 치환
        this.birthDayParams.value = birthVal // 치환된 값 적재

        return false
      }

      // 길이 체크 및 처리
      if (birthVal.length !== maxLang) {
        this.birthDayParams.isError = true
        this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH03

        this.birthDayParams.value = birthVal.substring(0, maxLang) // 잘라서 적재

        return false
      }

      const fourteenValidDate = this.isBirthDayFourteenValidDate(birthVal)
      if (!fourteenValidDate.stat) {
        this.birthDayParams.isError = true
        this.birthDayParams.errorMessage = fourteenValidDate.msg
        return false
      } else {
        this.birthDayParams.isError = false
        return true
      }
    },
    /**
     * 생년월일 validDate
     *
     * @param {Number} dateStr 생년월일8자
     * @returns {object} jsonObject 검증결과Object
     */
    isBirthDayFourteenValidDate (dateStr) {
      const year = Number(dateStr.substr(0, 4))
      const month = Number(dateStr.substr(4, 2))
      const day = Number(dateStr.substr(6, 2))
      // const today = new Date() // 날자 변수 선언
      // const yearNow = today.getFullYear()
      // const adultYear = yearNow - 14
      const strNowDate = getNowDate() // 시스템 년월일
      const ageInFull = getAgeInFull(dateStr, true)

      if (undefined !== strNowDate || strNowDate) { // 년월일이 이상 없으면...
        if (Number(strNowDate) < Number(dateStr)) { // 입력된 값이 시스템 년월일 보다 크면
          return {
            stat: false, msg: MEMBER_CONST.MEMBER_TEXT.BIRTH06
          }
        }
      }
      if (!ageInFull) {
        return {
          stat: false, msg: MEMBER_CONST.MEMBER_TEXT.BIRTH05
        }
      }
      if (month < 1 || month > 12) {
        return {
          stat: false, msg: MEMBER_CONST.MEMBER_TEXT.BIRTH06
        }
      }
      if (day < 1 || day > 31) {
        return {
          stat: false, msg: MEMBER_CONST.MEMBER_TEXT.BIRTH06
        }
      }
      if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
        return {
          stat: false, msg: MEMBER_CONST.MEMBER_TEXT.BIRTH06
        }
      }
      if (month === 2) {
        const isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
        if (day > 29 || (day === 29 && !isleap)) {
          return {
            stat: false, msg: MEMBER_CONST.MEMBER_TEXT.BIRTH06
          }
        }
      }
      return {
        stat: true, msg: ''
      }
    },
    /**
     * 성별값 Param변수에 담고 성별을 수정한다.
     *
     * @param {String} val 성별값
     */
    setSex (val) {
      this.gender = val

      const genderParams = {
        userId: loginUtil.userId(),
        processFlag: 'G',
        gender: this.gender
      }

      const successHandling = response => {
        const isSuccess = isNull(response.msg.isSuccess, 'E')

        if (isSuccess === 's' || isSuccess === 'S') {
          loginUtil.setUserInfo('gender', this.gender)
          toastUtil.show(MEMBER_CONST.SUCCESS_MESSAGES.CHANGE)
          this.setModifyDefData()

          // 마케팅 스크립트 적용 부분
          // AIQUA
          marketingUtil.aiquaLogger.send({
            type: marketingUtil.aiquaLogger.USER_PROFILE,
            data: {
              userId: loginUtil.getUserInfo('custNum'),
              name: '', // loginUtil.getUserInfo('userName'),
              email: '', // loginUtil.getUserInfo('email'),
              phoneNumber: '', // loginUtil.getUserInfo('telNo'),
              birthday: '', // loginUtil.getUserInfo('birthday'),
              gender: '', // loginUtil.getUserInfo('gender'),
              loginStatus: loginUtil.getUserInfo('loginyn'),
              devicePushAgree: '', // pushState,
              notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
              isEmployee: loginUtil.getUserInfo('staffBnft'),
              level: loginUtil.getUserInfo('gradeNm'),
              coCd: COMM_CONST.getCocd(),
              lastLogin: '' // qg_fileter_last_login 값
            }
          })
        } else {
          toastUtil.show(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      this.$nsaxios.post('NSCustInfoChangeReal', genderParams, successHandling, errorHandling)
    },
    /**
     * 선택정보 전체선택 콤보박스 처리
     */
    async setAllAgree () {
      if (!this.isAllAgree) {
        this.isAllAgree = true
        this.isAgreeEmail = true
        this.isAgreeSMS = true
        this.isAgreeTel = true
        this.$refs.allAgree.checked = true
        this.$refs.agreeEmail.checked = true
        this.$refs.agreeSms.checked = true
        this.$refs.agreeTel.checked = true
      } else {
        this.isAllAgree = false
        this.isAgreeEmail = false
        this.isAgreeSMS = false
        this.isAgreeTel = false
        this.$refs.allAgree.checked = false
        this.$refs.agreeEmail.checked = false
        this.$refs.agreeSms.checked = false
        this.$refs.agreeTel.checked = false
      }

      // TODO : API개발후 저장로직 구현필요
      await this.saveAgree().then(rtn => {
        if (rtn) {
          toastUtil.show(MEMBER_CONST.SUCCESS_MESSAGES.AGREE_CHANGE)
        } else {
          messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
          this.setModifyDefData()
        }
      })
    },
    /**
     * 선택정보 개별선택 콤보박스 처리
     *
     * @param {string} 선택유형
     */
    setAgree (type) {
      if (!this.isAgreeApiCheck) {
        this.isAgreeApiCheck = true
        this.chageAgree(type)
        // API개발후 저장로직 구현필요
        this.saveAgree().then(rtn => {
          console.log('rtn >>> ', rtn)
          if (rtn) {
            if (this.isAgreeEmail && this.isAgreeSMS && this.isAgreeTel) {
              this.isAllAgree = true
              this.$refs.allAgree.checked = true
            } else {
              this.isAllAgree = false
              this.$refs.allAgree.checked = false
            }

            toastUtil.show(MEMBER_CONST.SUCCESS_MESSAGES.AGREE_CHANGE)
          } else {
            this.chageAgree(type)
            messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
          }
        })
      }
    },
    /**
     * change Agree
     *
     * @param {string} type 선택유형
     */
    chageAgree (type) {
      if (type === 'mail') {
        this.isAgreeEmail = !this.isAgreeEmail
      } else if (type === 'sms') {
        this.isAgreeSMS = !this.isAgreeSMS
      } else if (type === 'tel') {
        this.isAgreeTel = !this.isAgreeTel
      }
    },
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
     * 변경암호 검증
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

        this.passwordInvoke.userId = loginUtil.getUserInfo('userId')
        this.passwordInvoke.logonId = loginUtil.getUserInfo('logonId')
        this.passwordInvoke.userPwd = inputNewPwd
        this.passwordInvoke.accptPath = '500'
        this.passwordInvoke.accptPathCd = '500'
        this.passwordInvoke.catalogId = '97001'
        this.passwordInvoke.req_co_cd = '110'

        const parmas = cipherUtil.encryptValue(JSON.stringify(this.passwordInvoke))

        const successHandling = response => {
          const chgYn = response.msg.root.Searchresult.change_yn
          if (chgYn === 'Y') {
            // 세션스토리지 및 로컬스토리지 logonId값 변경
            const memberInfo = loginUtil.getMemberInfo()

            memberInfo.logonPassword = inputNewPwd

            loginUtil.login(memberInfo)

            this.passwordParams.value = inputNewPwd
            this.onCollapse('pass')
            this.setModifyDefData()
            toastUtil.show(MEMBER_CONST.SUCCESS_MESSAGES.SAVE)

            // 마케팅 스크립트 적용 부분
            // AIQUA
            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_PROFILE,
              data: {
                userId: loginUtil.getUserInfo('custNum'),
                name: '', // loginUtil.getUserInfo('userName'),
                email: '', // loginUtil.getUserInfo('email'),
                phoneNumber: '', // loginUtil.getUserInfo('telNo'),
                birthday: '', // loginUtil.getUserInfo('birthday'),
                gender: '', // loginUtil.getUserInfo('gender'),
                loginStatus: loginUtil.getUserInfo('loginyn'),
                devicePushAgree: '', // pushState,
                notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
                isEmployee: loginUtil.getUserInfo('staffBnft'),
                level: loginUtil.getUserInfo('gradeNm'),
                coCd: COMM_CONST.getCocd(),
                lastLogin: '' // qg_fileter_last_login 값
              }
            })
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
     * 마케팅정보 개별저장 (생년월일)
     *
     * @param {Event} e 이벤트객체
     * @returns {boolean|void}
     */
    saveBirth (e) {
      const birth = this.birthDayParams.value
      const birthParams = {
        userId: loginUtil.userId(),
        processFlag: 'B',
        birthday: ''
      }

      if (this.numberCheck()) {
        if (isNull(birth)) { // 생년월일이 입력되지 않은 경우
          this.birthDayParams.isError = true
          this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH06
          return false
        } else {
          const strInYear = birth.substring(0, 4) // 입력받은 연도
          const strInMonth = birth.substring(4, 6) // 입력받은 월
          const strInDay = birth.substring(6, 8) // 입력받은 일
          birthParams.birthday = birth

          if (birth.length < 8) {
            this.birthDayParams.isError = true
            this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH03
            return false
          }

          const strNowDate = getNowDate() // 시스템 년월일

          if (undefined !== strNowDate || strNowDate) { // 년월일이 이상 없으면...
            if (Number(strNowDate) < Number(birth)) { // 입력된 값이 시스템 년월일 보다 크면
              this.birthDayParams.isError = true
              this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH06
              return false
            }
          }

          // 월이 1 ~ 12월 사이인가
          if (Number(strInMonth) < 1 || Number(strInMonth) > 12) {
            this.birthDayParams.isError = true
            this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH06
            return false
          }

          const nMonthLastDay = new Date(new Date(strInYear, strInMonth, 1) - 86400000).getDate() // 해당 년,월의 마지막 일

          // 일이 1 ~ 해당 년월의 마지막날 사이인가
          if (Number(strInYear) <= 1700 || Number(strInDay) < 1 || Number(strInDay) > nMonthLastDay) {
            this.birthDayParams.isError = true
            this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH06
            return false
          }

          const successHandling = response => {
            const isSuccess = isNull(response.msg.isSuccess, 'E')

            if (isSuccess === 's' || isSuccess === 'S') {
              const birthDay = `${strInYear}-${strInMonth}-${strInDay}`
              loginUtil.setUserInfo('birthday', birthDay)
              toastUtil.show(MEMBER_CONST.SUCCESS_MESSAGES.SAVE)
              this.setModifyDefData()

              // 마케팅 스크립트 적용 부분
              // AIQUA
              marketingUtil.aiquaLogger.send({
                type: marketingUtil.aiquaLogger.USER_PROFILE,
                data: {
                  userId: loginUtil.getUserInfo('custNum'),
                  name: '', // loginUtil.getUserInfo('userName'),
                  email: '', // loginUtil.getUserInfo('email'),
                  phoneNumber: '', // loginUtil.getUserInfo('telNo'),
                  birthday: '', // loginUtil.getUserInfo('birthday'),
                  gender: '', // loginUtil.getUserInfo('gender'),
                  loginStatus: loginUtil.getUserInfo('loginyn'),
                  devicePushAgree: '', // pushState,
                  notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
                  isEmployee: loginUtil.getUserInfo('staffBnft'),
                  level: loginUtil.getUserInfo('gradeNm'),
                  coCd: COMM_CONST.getCocd(),
                  lastLogin: '' // qg_fileter_last_login 값
                }
              })
            } else {
              toastUtil.show(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
            }
          }
          const errorHandling = () => {
            messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
          }

          this.$nsaxios.post('NSCustInfoChangeReal', birthParams, successHandling, errorHandling)
        }
      } else {
        return false
      }
    },
    /**
     * 마케팅정보 수정
     *
     * @returns {boolean|void}
     */
    async saveAgree () {
      let returnBoolean = false
      const isSMS = this.isAgreeSMS ? 'Y' : 'N'
      const isEmail = this.isAgreeEmail ? 'Y' : 'N'
      const isTel = this.isAgreeTel ? 'Y' : 'N'

      const agreeParams = {
        userId: loginUtil.userId(),
        processFlag: 'updateAd',
        emailYn: isEmail,
        smsYn: isSMS,
        TMYn: isTel
      }
      console.log('agreeParams >> ', agreeParams)

      const successHandling = response => {
        const isSuccess = isNull(response.msg.isSuccess, 9)

        if (isSuccess === 1) {
          loginUtil.setUserInfo('userMargetingEmail', agreeParams.EmailYn)
          loginUtil.setUserInfo('userMarketingSMS', agreeParams.SmsYn)
          loginUtil.setUserInfo('userMargetingTM', agreeParams.TmYn)

          returnBoolean = true
          this.isAgreeApiCheck = false

          // 마케팅 스크립트 적용 부분
          // AIQUA
          if (agreeParams.EmailYn === 'Y' || agreeParams.SmsYn === 'Y' || agreeParams.TmYn === 'Y') { // 체크된 경우
            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_PROFILE,
              data: {
                userId: loginUtil.getUserInfo('custNum'),
                name: '', // loginUtil.getUserInfo('userName'),
                email: '', // loginUtil.getUserInfo('email'),
                phoneNumber: '', // loginUtil.getUserInfo('telNo'),
                birthday: '', // loginUtil.getUserInfo('birthday'),
                gender: '', // loginUtil.getUserInfo('gender'),
                loginStatus: loginUtil.getUserInfo('loginyn'),
                devicePushAgree: '', // pushState,
                notificationModifiedDate: `${getNowDate('-')} ${getNowTime(':')}`, // 푸쉬 마케팅 수신 동의 처리 일시
                isEmployee: loginUtil.getUserInfo('staffBnft'),
                level: loginUtil.getUserInfo('gradeNm'),
                coCd: COMM_CONST.getCocd(),
                lastLogin: '' // qg_fileter_last_login 값
              }
            })
          }
        } else {
          returnBoolean = false
          this.isAgreeApiCheck = false
        }
      }
      const errorHandling = () => {
        returnBoolean = false
        this.isAgreeApiCheck = false
      }

      await this.$nsaxios.post('NSMobAdInfoCmd', agreeParams, successHandling, errorHandling)
      return returnBoolean
    },
    /**
     * 휴대폰 인증 영역 표시
     */
    showPhoneAuth () {
      this.isPhoneAuthVisible = true
    },
    /**
     * 휴대폰 점유인증 모듈 호출
     *
     * @returns {Promise.<boolean>}
     */
    async sendVerificationCode () {
      const phoneNo = this.userPhoneParams.value.trim()
      const oldPhoneNo = this.phoneParams.value.trim()

      // 폰번호 유효성 체크
      if (isNull(phoneNo) || phoneNo.length < 10) {
        this.userPhoneParams.isError = true
        if (isNull(phoneNo)) {
          this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE13
        } else {
          this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12
        }
        return false
      }

      if (oldPhoneNo === phoneNo) {
        this.userPhoneParams.isError = true
        this.userPhoneParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.AUTHSENDERRMSG2
        return false
      }

      this.showPhoneAuth()

      await this.$refs.phoneAuth.sendVerificationCode()
    },
    /**
     * 인증번호 전송 후처리
     *
     * @param {import('@components/ui/PhoneAuth.vue').resultObject} resultObject
     */
    handleSendVerificationCode (resultObject) {
      if (resultObject.response) {
        const code = resultObject.response.msg.root.processMsg.processMsg
        if (code === 'S') {
          this.isPhoneAuthVisible = true
          this.userPhoneParams.disabled = true
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
        const result = resultObject.response.msg.root.processMsg.processMsg

        if (result === 's' || result === 'S') {
          this.phoneParams.value = resultObject.response.Phone[0]
          this.onCollapse('phone')
          this.setModifyDefData()
          toastUtil.show(MEMBER_CONST.SUCCESS_MESSAGES.SAVE)
          this.isPhoneAuthVisible = false
          this.userPhoneParams.disabled = false

          // 마케팅 스크립트 적용 부분
          // AIQUA
          marketingUtil.aiquaLogger.send({
            type: marketingUtil.aiquaLogger.USER_PROFILE,
            data: {
              userId: loginUtil.getUserInfo('custNum'),
              name: '', // loginUtil.getUserInfo('userName'),
              email: '', // loginUtil.getUserInfo('email'),
              phoneNumber: '', // loginUtil.getUserInfo('telNo'),
              birthday: '', // loginUtil.getUserInfo('birthday'),
              gender: '', // loginUtil.getUserInfo('gender'),
              loginStatus: loginUtil.getUserInfo('loginyn'),
              devicePushAgree: '', // pushState,
              notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
              isEmployee: loginUtil.getUserInfo('staffBnft'),
              level: loginUtil.getUserInfo('gradeNm'),
              coCd: COMM_CONST.getCocd(),
              lastLogin: '' // qg_fileter_last_login 값
            }
          })
        }
      }
    },
    /**
     * 이메일 인증 모듈 호출
     */
    async sendVerificationCodeEmail () {
      const emailAddr = this.userEmailParams.value.toLowerCase()

      /** 메일주소 유효성 체크 start */
      if (isNull(emailAddr)) {
        this.userEmailParams.isError = true
        this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL01

        return
      }

      if (!isEmail(emailAddr)) {
        this.userEmailParams.isError = true
        this.userEmailParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL01

        return
      }
      /** 메일주소 유효성 체크 end */

      await this.$refs.emailAuth.sendVerificationCode() // 이메일 인증번호 발송
    },
    /**
     * 이메일 인증번호 발송 후처리
     *
     * @param {import('@components/ui/EmailAuth.vue').resultObject}
     */
    handleSendVerificationCodeEmail (resultObject) {
      this.mailAddr = resultObject.response.newLogonId[0]

      if (resultObject.response) {
        const processMsg = resultObject.response.processMsg

        if (processMsg === 'E') {
          this.isSendEmail = false
          this.isEmailAuthSendError = true
          this.emailAuthSendErrormsg = MEMBER_CONST.MEMBER_TEXT.EMAIL10
        } else {
          this.isSendEmail = true
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
        const processMsg = resultObject.response.processMsg
        if (processMsg !== 'E') {
          // 세션스토리지 및 로컬스토리지 logonId값 변경
          const memberInfo = loginUtil.getMemberInfo()

          memberInfo.logonId = resultObject.response.newLogonId[0]

          loginUtil.login(memberInfo)

          this.logonParams.value = resultObject.response.newLogonId
          this.onCollapse('id')
          this.setModifyDefData()
          toastUtil.show(MEMBER_CONST.SUCCESS_MESSAGES.SAVE)

          // 마케팅 스크립트 적용 부분
          // AIQUA
          marketingUtil.aiquaLogger.send({
            type: marketingUtil.aiquaLogger.USER_PROFILE,
            data: {
              userId: loginUtil.getUserInfo('custNum'),
              name: '', // loginUtil.getUserInfo('userName'),
              email: '', // loginUtil.getUserInfo('email'),
              phoneNumber: '', // loginUtil.getUserInfo('telNo'),
              birthday: '', // loginUtil.getUserInfo('birthday'),
              gender: '', // loginUtil.getUserInfo('gender'),
              loginStatus: loginUtil.getUserInfo('loginyn'),
              devicePushAgree: '', // pushState,
              notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
              isEmployee: loginUtil.getUserInfo('staffBnft'),
              level: loginUtil.getUserInfo('gradeNm'),
              coCd: COMM_CONST.getCocd(),
              lastLogin: '' // qg_fileter_last_login 값
            }
          })
        }
      }
    },
    /**
     * 내 배송지 관리 팝업 호출 함수
     */
    async deleveryAddressBook () {
      const tmpGlobalVal = {
        deliveryInfo: {
          shipAddrLength: 0,
          popIdx: 0
        },
        mInputParams: {
          orderId: ''
        },
        bSetCustDeliveryMsg: true
      }

      const ordAddr = {
        zipCode: '',
        addr: '',
        addrDetail: '',
        recipientName: '',
        phone: ''
      }

      const param = {
        title: '배송지 관리',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: tmpGlobalVal,
        paymentData: {},
        ordAddr,
        multiYn: 'N',
        multiIdx: 0,
        chargeItems: [],
        consultYn: 'N',
        mypageYn: 'Y'
      }

      popupUtil.show('order/sheet/OrderSheetAddressBook', param, () => { this.onLoad() })

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '마이페이지',
            t2: '개인정보',
            t3: '배송지관리',
            t4: ''
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/info/MemberModify";
</style>
