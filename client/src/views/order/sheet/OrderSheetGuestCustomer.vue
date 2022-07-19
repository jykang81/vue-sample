<template>
  <div class="order_sheet_guest_customer">
    <div id="guestCertArea" class="non_member_guide">
      <div v-show="isCertAreaShow">
        <p :class="globalVal.customerInfo.isErrorMessageAuth ? 'error_msg' : '' ">
          비회원으로 주문하시려면 본인인증이 필요합니다.
        </p>
        <button
          type="button"
          class="btn_certify"
          @click="showCertView()"
        >
          <span>본인인증</span>
        </button>
      </div>
      <div class="member_join">
        <p class="text">
          NSmall 회원가입을 하시면 다양한 혜택을 받으실 수 있습니다.
        </p>
        <p class="button_join">
          <router-link to="/customer/join">
            회원가입
          </router-link>
        </p>
      </div>
    </div>
    <!-- 구매자 정보 -->
    <h3 id="guestBuyerArea" class="subject">
      구매자 정보
    </h3>
    <div class="form_group">
      <div class="input_field">
        <label
          for="label_ipt_name"
          class="label_text"
        >
          이름<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input
            id="label_ipt_name"
            v-model="ordererInfo.name"
            type="text"
            class="form text"
            maxlength="8"
            readonly
          >
        </span>
      </div>
      <div class="input_field">
        <label
          for="label_ipt_phone"
          class="label_text"
        >
          휴대폰<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input
            v-show="isUserPhoneNumShow"
            id="label_ipt_phone"
            v-model="ordererInfo.hpNo"
            type="text"
            class="form text"
            readonly
            @click="clickDeliveryHpNo()"
          >
          <input
            v-show="isUserAuthPhoneNumShow"
            id="label_ipt_phone"
            v-model="updateHpno"
            type="tel"
            class="form text"
            title="휴대폰 입력"
            maxlength="11"
            @keydown="keydownNumber($event)"
            @blur="blurUpdateHpno($event)"
            @keyup="inputOlnyNumber($event)"
          >
        </span>
      </div>
      <div v-show="isOrderHpNoErrMsgShow1" class="input_field">
        <label class="label_text" />
        <div class="input_group">
          <p class="error_msg">
            주문하시는 분의 휴대폰을 정확히 입력해 주세요.
          </p>
        </div>
      </div>
      <div class="input_field">
        <label
          for="label_ipt_email"
          class="label_text"
        >
          이메일<span class="essential">필수입력</span>
        </label>
        <div class="input_group">
          <input
            id="label_ipt_email"
            v-model="ordererInfo.email"
            type="text"
            class="form text"
            @input="clearCheck($event)"
            @blur="blurEmail($event)"
          >
          <ul
            v-if="isActive"
            id="domainList"
            class="domain_list"
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
      </div>
      <div v-show="isOrderEmailErrMsgShow1 || isOrderEmailErrMsgShow2" class="input_field">
        <label class="label_text" />
        <div class="input_group">
          <p v-show="isOrderEmailErrMsgShow1" class="error_msg">
            이메일을 입력해 주세요.
          </p>
          <p v-show="isOrderEmailErrMsgShow2" class="error_msg">
            이메일 형식이 올바르지 않습니다.
          </p>
        </div>
      </div>
      <div
        class="input_field password"
        :class="[isPasswordShowing ? 'show_hide' : '']"
      >
        <label
          for="label_ipt_password"
          class="label_text"
        >
          비밀번호<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input
            id="label_ipt_password"
            ref="passwordInput"
            v-model="ordererInfo.paassword"
            type="password"
            class="form text"
            @input="passPress()"
            @blur="handleFocusPassword($event); blurPassword($event)"
            @focus="handleFocusPassword($event)"
          >
          <!-- 비밀번호 평문 표시 -->
          <span
            v-if="isPasswordShowing"
            class="show_text"
          >{{ ordererInfo.paassword }}</span>
          <span
            v-show="ordererInfo.paassword.length !== 0 && (isPasswordFocused || !isPasswordSuccessShow)"
            class="btn_box"
          >
            <button
              v-show="isPasswordDelBtnShow"
              ref="passwordClearButton"
              tabindex="-1"
              type="button"
              class="btn_delete"
              @click="clickClearPassword()"
            >
              삭제
            </button>
            <button
              ref="togglePasswordButton"
              type="button"
              class="btn_show_hide"
              @click="clickPasswordShow()"
            >
              <span v-show="isPasswordTextShow" class="btn show">보기</span>
              <span v-show="isPasswordTextHide" class="btn hide">숨기기</span>
            </button>
          </span>
          <span v-show="isPasswordSuccessShow && !isPasswordFocused" class="icons_check_success" />
        </span>
      </div>
      <div v-show="isOrderPaasswordErrMsgShow1 || isOrderPaasswordErrMsgShow2 || isOrderPaasswordErrMsgShow3" class="input_field">
        <label class="label_text" />
        <div class="input_group">
          <p v-show="isOrderPaasswordErrMsgShow1" class="error_msg">
            주문하시는 분의 비밀번호를 입력해주세요.
          </p>
          <p v-show="isOrderPaasswordErrMsgShow2" class="error_msg">
            영문, 숫자, 특수문자 중 두가지 이상을 조합해야 합니다.
          </p>
          <p v-show="isOrderPaasswordErrMsgShow3" class="error_msg">
            {{ orderPasswordErrMsg }}
          </p>
        </div>
      </div>
      <div
        class="input_field password"
        :class="[isPwConfirmShowing ? 'show_hide' : '']"
      >
        <label
          for="label_ipt_password_confirm"
          class="label_text confirm"
        >
          비밀번호<br>확인<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input
            id="label_ipt_password_confirm"
            ref="pwConfirmInput"
            v-model="ordererInfo.pwConfirm"
            type="password"
            class="form text"
            @input="confirmPress()"
            @blur="handleFocusPwConfirm($event); blurPwConfirm($event)"
            @focus="handleFocusPwConfirm($event)"
          >
          <!-- 비밀번호확인 평문 표시 -->
          <span
            v-if="isPwConfirmShowing"
            class="show_text"
          >{{ ordererInfo.pwConfirm }}</span>
          <span
            v-show="ordererInfo.pwConfirm.length !== 0 && (isPwConfirmFocused || !isPwConfirmSuccessShow)"
            class="btn_box"
          >
            <button
              v-show="isPwConfirmDelBtnShow"
              ref="pwConfirmClearButton"
              tabindex="-1"
              type="button"
              class="btn_delete"
              @click="clickClearPwConfirm()"
            >
              삭제
            </button>
            <button
              ref="togglePwConfirmButton"
              type="button"
              class="btn_show_hide"
              @click="clickPwConfirmShow()"
            >
              <span v-show="isPwConfirmTextShow" class="btn show">보기</span>
              <span v-show="isPwConfirmTextHide" class="btn hide">숨기기</span>
            </button>
          </span>
          <span v-show="isPwConfirmSuccessShow && !isPwConfirmFocused" class="icons_check_success" />
        </span>
      </div>
      <div v-show="isOrderPwConfirmErrMsgShow1 || isOrderPwConfirmErrMsgShow2" class="input_field">
        <label class="label_text" />
        <div class="input_group">
          <p v-show="isOrderPwConfirmErrMsgShow1" class="error_msg">
            비밀번호 확인을 정확히 입력해 주세요.
          </p>
          <p v-show="isOrderPwConfirmErrMsgShow2" class="error_msg">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  getPhoneNumber,
  insertSeparatorPhoneNumber,
  isNull,
  isEmail,
  validatePassword
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'

export default {
  mixins: [
    customerInputMixin
  ],
  props: {
    paymentData: {
      type: Object,
      required: true
    },
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      ordererInfo: {
        name: '', // 구매자 이름
        email: '', // 구매자 이메일
        hpNo: '', // 구매자 휴대폰
        paassword: '', // 비밀번호
        pwConfirm: '', // 비밀번호 확인
        ci: '',
        di: ''
      },
      isCertAreaShow: true, // 본인인증 영역
      isUserPhoneNumShow: false, // 휴대폰번호
      isUserAuthPhoneNumShow: true, // 휴대폰번호 입력
      updateHpno: '', // 입력한 폰번호
      // isOrderInfoNameReadOnly: false, // 이름
      isOrderHpNoErrMsgShow1: false, // 주문하시는 분의 휴대폰을 정확히 입력해 주세요.
      isOrderEmailErrMsgShow1: false, // 주문하시는 분의 이메일 주소를 입력해 주세요.
      isOrderEmailErrMsgShow2: false, // 주문하시는 분의 이메일주소를 정확히 입력해 주세요.
      isOrderPaasswordErrMsgShow1: false, // 주문하시는 분의 비밀번호를 입력해주세요.
      isOrderPaasswordErrMsgShow2: false, // 비밀번호는 영문소문자+숫자 조합으로 입력해주세요.
      isOrderPaasswordErrMsgShow3: false,
      orderPasswordErrMsg: '',
      isOrderPwConfirmErrMsgShow1: false, // 주문하시는 분의 비밀번호 확인을 정확히 입력해 주세요.
      isOrderPwConfirmErrMsgShow2: false, // 비밀번호가 일치하지 않습니다.
      isPasswordTextShow: false, // 비밀번호 보기
      isPasswordTextHide: false, // 비밀번호 숨기기
      isPwConfirmTextShow: false, // 비밀번호 확인 보기
      isPwConfirmTextHide: false, // 비밀번호 확인 숨기기
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
      isActive: false,
      searchQuery: '',
      isPasswordShowing: false,
      isPwConfirmShowing: false,
      isPasswordSuccessShow: false,
      isPwConfirmSuccessShow: false,
      isPwConfirmDelBtnShow: false,
      isPasswordDelBtnShow: false,
      isPasswordBtnBoxShow: false,
      authVno: '',
      isPasswordFocused: false,
      isPwConfirmFocused: false,
      focusTimerId: null, // focus timer 갱신용
      focusTimerId2: null
    }
  },
  mounted () {
    // 주문하시는분 정보(기본값으로 회원정보를 표시함)
    this.setUpdateOrderer({
      ordererName: this.globalVal.mOutputDatas.msg.UserInfo.LASTNAME,
      ordererHpNo: this.globalVal.mOutputDatas.msg.UserInfo.PHONE1,
      ordererEmail: this.globalVal.mOutputDatas.msg.UserInfo.EMAIL1
    })

    // 주문하시는분 출력
    this.setOrdererInfo(this.globalVal.mOutputDatas.msg)

    /**
     * 구매자정보 - 이메일
     *  - this.$root.$emit('blurEmailEmit')
     * @returns {void}
     */
    this.$root.$on('blurEmailEmit', () => {
      this.blurEmail('')
    })

    /**
     * 구매자정보 - 비밀번호
     *  - this.$root.$emit('blurPasswordEmit')
     * @returns {void}
     */
    this.$root.$on('blurPasswordEmit', () => {
      this.blurPassword('')
    })

    /**
     * 구매자정보 - 비밀번호 확인
     *  - this.$root.$emit('blurPwConfirmEmit')
     * @returns {void}
     */
    this.$root.$on('blurPwConfirmEmit', () => {
      this.blurPwConfirm('')
    })
  },
  updated () {
    this.globalVal.orderDeliveryInfo.iptOrdererName = this.ordererInfo.name
    this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo1 = getPhoneNumber(this.updateHpno, '1')
    this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo2 = getPhoneNumber(this.updateHpno, '2')
    this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo3 = getPhoneNumber(this.updateHpno, '3')
    this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererEmail = this.ordererInfo.email
    this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererPwd = this.ordererInfo.paassword
    this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererPwdConfirm = this.ordererInfo.pwConfirm
    this.globalVal.orderDeliveryInfo.ci = this.ordererInfo.ci
    this.globalVal.orderDeliveryInfo.di = this.ordererInfo.di
  },
  methods: {
    isNull,
    /**
     * 주문하시는분 정보 출력
     * @param {Object} data - 주문정보 object
     */
    setUpdateOrderer (data) {
      if (data == null) {
        return false
      }

      if ((undefined === data.ordererName || data.ordererName === '') &&
        (undefined !== this.ordererInfo && this.ordererInfo.name)) {
        data.ordererName = this.ordererInfo.name
      }

      if ((undefined === data.ordererHpNo || data.ordererHpNo === '') &&
        (undefined !== this.ordererInfo && this.ordererInfo.hpNo)) {
        data.ordererHpNo = this.ordererInfo.hpNo
      }

      if ((undefined === data.ordererEmail || data.ordererEmail === '') &&
        (undefined !== this.ordererInfo && this.ordererInfo.email)) {
        data.ordererEmail = this.ordererInfo.email
      }

      // 보내는분 세팅 - 구매자
      this.ordererName = data.ordererName

      // data의 휴대폰번호는 빈스트링이지만 입력된것이 있을 경우
      if (data.ordererHpNo === '') {
        if (this.ordererInfo.hpNo !== '') {
          data.ordererHpNo = this.ordererInfo.hpNo
        }
      }

      // 주문하시는 분
      this.globalVal.orderDeliveryInfo.iptOrdererName = data.ordererName
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo1 = getPhoneNumber(data.ordererHpNo, '1')
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo2 = getPhoneNumber(data.ordererHpNo, '2')
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo3 = getPhoneNumber(data.ordererHpNo, '3')
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererEmail = data.ordererEmail

      // 받는 분
      this.globalVal.deliveryInfo.recipientName = data.ordererName
      this.globalVal.deliveryInfo.phone11 = getPhoneNumber(data.ordererHpNo, '1')
      this.globalVal.deliveryInfo.phone12 = getPhoneNumber(data.ordererHpNo, '2')
      this.globalVal.deliveryInfo.phone13 = getPhoneNumber(data.ordererHpNo, '3')

      // 폼 데이터에 반영
      this.paymentData.OrderUserInfo.setItem({
        LASTNAME: data.ordererName,
        NICKNAME: data.ordererName,
        PHONE1TYPE: 'K',
        PHONE1: insertSeparatorPhoneNumber(data.ordererHpNo, '-'),
        MOBILE_NO11: getPhoneNumber(data.ordererHpNo, '1'),
        MOBILE_NO12: getPhoneNumber(data.ordererHpNo, '2'),
        MOBILE_NO13: getPhoneNumber(data.ordererHpNo, '3'),
        EMAIL1: data.ordererEmail
      })
    },
    /**
     * 주문하시는분/본인인증하기/비밀번호 정보 출력
     * 간편로그인 및 로그인 회원 첫주문인경우 본인인증하기 출력
     * @param {Object} data - 주문정보 object
     */
    setOrdererInfo (data) {
      this.globalVal.customerInfo.phNumber = insertSeparatorPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1, '')
      // 회원가입 점유인증 제거 - SMS 인증하지 않았을 경우 인증 정보 노출
      this.globalVal.customerInfo.mHpNoSmsAuthYn = data.hpNoSmsAuthYn

      this.isUserAuthPhoneNumShow = true // 휴대폰 번호 입력
    },
    /**
     * key down 방향기, 백스페이스, Del키,  숫자 외 입력 금지
     * maxlength (16) 이상은 방향기, 백스페이스, Del키 만 허용
     * @param {object} e event object
     * @returns {void}
     */
    keydownNumber (e) {
      const code = e.keyCode
      const ALLOW_KEYS = [
        COMM_CONST.KEY_CODE.BACK_SPACE,
        COMM_CONST.KEY_CODE.DELETE,
        COMM_CONST.KEY_CODE.LEFT,
        COMM_CONST.KEY_CODE.RIGHT
      ]

      if (!ALLOW_KEYS.includes(code) && (code < COMM_CONST.KEY_CODE.NUM_0 || code > COMM_CONST.KEY_CODE.NUM_9)) {
        e.preventDefault()
      }

      if (e.target.value.length >= 16) {
        if (!ALLOW_KEYS.includes(code)) {
          e.preventDefault()
        }
      }
    },
    inputOlnyNumber (e) {
      const targetVal = e.target.value.replace(/[^0-9]/g, '')
      e.target.value = targetVal
      this.updateHpno = targetVal
    },
    /**
     * 휴대폰 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurUpdateHpno (e) {
      this.updateHpno = this.updateHpno.replace(/[^0-9]/g, '')

      this.isOrderHpNoErrMsgShow1 = false

      if (this.updateHpno === '') {
        this.isOrderHpNoErrMsgShow1 = true
        return false
      } else if ((this.updateHpno.length < 10 || this.updateHpno.length > 11) || this.updateHpno.substring(0, 1) !== '0') {
        this.isOrderHpNoErrMsgShow1 = true
        return false
      }

      this.isUserAuthPhoneNumShow = false
      this.isUserPhoneNumShow = true

      this.ordererInfo.hpNo = `${getPhoneNumber(this.updateHpno, '1')}-${getPhoneNumber(this.updateHpno, '2')}-${getPhoneNumber(this.updateHpno, '3')}`
    },
    clickDeliveryHpNo () {
      if (this.authVno === 'ipin') {
        this.isUserAuthPhoneNumShow = true
        this.isUserPhoneNumShow = false
      }
    },
    /**
     * 인증팝업 호출을 위한 검증
     */
    showCertView () {
      const param = {
        title: '본인인증',
        isAdultDiv: false
      }

      const callback = result => {
        if (!isNull(result)) {
          if (loginUtil.adultAuthYN() === 'Y') {
            this.authVno = result.AUTH_VNO

            // 배송지 받는분 이름 설정
            this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName = result.LASTNAME
            // 배송지 받는분 휴대폰 설정
            this.globalVal.guestInfo.deliveryHpNo = result.PHONE1
            this.globalVal.guestInfo.updateHpno = `${getPhoneNumber(result.PHONE1, '1')}${getPhoneNumber(result.PHONE1, '2')}${getPhoneNumber(result.PHONE1, '3')}`

            this.isCertAreaShow = false
            // this.isOrderInfoNameReadOnly = true

            this.ordererInfo.name = result.LASTNAME
            this.ordererInfo.hpNo = result.PHONE1
            this.updateHpno = `${getPhoneNumber(result.PHONE1, '1')}${getPhoneNumber(result.PHONE1, '2')}${getPhoneNumber(result.PHONE1, '3')}`
            this.ordererInfo.ci = result.CI
            this.ordererInfo.di = result.DI

            this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER = result.CUSTOM_NUMBER
            this.globalVal.orderDeliveryInfo.iptOrdererName = result.LASTNAME
            this.paymentData.OrderUserInfo.setItem(result)
            this.paymentData.OrderUserInfo.setItem({ NICKNAME: result.LASTNAME, BUSINESSTITLE: result.LASTNAME })

            if (result.AUTH_VNO === 'ipin') {
              this.globalVal.guestInfo.isUserAuthPhoneNumShow = true
              this.globalVal.guestInfo.isUserPhoneNumShow = false

              this.isUserAuthPhoneNumShow = true
              this.isUserPhoneNumShow = false
            } else {
              this.globalVal.guestInfo.isUserAuthPhoneNumShow = false
              this.globalVal.guestInfo.isUserPhoneNumShow = true

              this.isUserAuthPhoneNumShow = false
              this.isUserPhoneNumShow = true
            }

            if (!isNull(this.updateHpno)) {
              this.isOrderHpNoErrMsgShow1 = false
            }
            if (!isNull(this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName)) {
              this.globalVal.guestInfo.isRecipientNameErrMsgShow1 = false
            }
            if (!isNull(this.globalVal.guestInfo.updateHpno)) {
              this.globalVal.guestInfo.isDeliveryHpNoErrMsgShow1 = false
            }
          }
        }
      }

      popupUtil.show('customer/info/OrderNoMemberCertify', param, callback)
    },
    /**
     * 이메일아이디 처리
     *
     * @param {Event} e 이벤트객체
     * @returns {boolean|void}
     */
    clearCheck (e) {
      this.isSuccess = false
      this.ordererInfo.email = this.ordererInfo.email.replace(/ /gi, '')

      const loginId = this.ordererInfo.email

      // 한글입력 막기
      // const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
      const validationPattern = /[^a-zA-Z0-9-_.@]/.test(loginId)
      if (validationPattern) {
        this.ordererInfo.email = loginId.slice(0, -1)
        e.target.value = this.idParams.value // chrome mobile 대응
        return false
      }

      /**
       * 이메일 도메인목록처리
       */
      this.getEmailAuto({ value: this.ordererInfo.email })
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
      this.ordererInfo.email = id.trim() + domain
      // this.checkJoinId()

      this.isOrderEmailErrMsgShow1 = false
      this.isOrderEmailErrMsgShow2 = false
    },
    /**
     * 이메일 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurEmail (e) {
      this.isOrderEmailErrMsgShow1 = false
      this.isOrderEmailErrMsgShow2 = false

      if (this.ordererInfo.email.trim() === '') {
        this.isOrderEmailErrMsgShow1 = true
        this.isOrderEmailErrMsgShow2 = false
      } else if (!isEmail(this.ordererInfo.email)) {
        this.isOrderEmailErrMsgShow1 = false
        this.isOrderEmailErrMsgShow2 = true
      }
    },
    /**
     * 암호 Key Down이벤트
     *
     * @param
     * @returns
     */
    passPress () {
      this.isPasswordSuccessShow = false
      this.isPwConfirmSuccessShow = false

      this.isOrderPaasswordErrMsgShow2 = false
      this.isOrderPaasswordErrMsgShow3 = false

      if (isNull(this.ordererInfo.paassword.trim())) {
        this.isOrderPaasswordErrMsgShow2 = false

        this.isPasswordTextShow = false
        this.isPasswordTextHide = false

        this.isPasswordDelBtnShow = false

        return false
      } else {
        this.isOrderPaasswordErrMsgShow1 = false
        this.isPasswordTextShow = true
        this.isPasswordTextHide = false

        this.isPasswordDelBtnShow = true
      }

      const validPassword = validatePassword(this.ordererInfo.paassword.trim())

      this.pwdGradeCode = validPassword.validStatus // 비밀번호 안전 등급
      this.pwdMsg = validPassword.validMsg // 비밀번호 유효성 검사 메시지

      if (this.pwdGradeCode === '00') {
        this.isOrderPaasswordErrMsgShow3 = false
        this.isPasswordSuccessShow = true
      } else {
        this.isOrderPaasswordErrMsgShow3 = true
        this.isPasswordSuccessShow = false
      }
      this.orderPasswordErrMsg = this.pwdMsg
    },
    confirmPress () {
      this.isPwConfirmSuccessShow = false

      if (isNull(this.ordererInfo.pwConfirm.trim())) {
        this.isPwConfirmTextShow = false
        this.isPwConfirmTextHide = false

        this.isPwConfirmDelBtnShow = false
      } else {
        this.isPwConfirmTextShow = true
        this.isPwConfirmTextHide = false

        this.isPwConfirmDelBtnShow = true
      }
    },
    /**
     * input focus 여부 감지
     *
     * @param {object} event
     */
    handleFocusPassword (event) {
      const FOCUS_OUT = 'blur'
      const FOCUS_IN = 'focus'

      const eventType = event.type

      if (FOCUS_OUT === eventType) {
        // iOS 대응용 timeout 설정
        this.focusTimerId = setTimeout(() => {
          this.isPasswordFocused = false
        }, 200)
      } else if (FOCUS_IN === eventType) {
        if (this.focusTimerId) {
          clearTimeout(this.focusTimerId)
          this.isPasswordFocused = true
        }
      }
    },
    handleFocusPwConfirm (event) {
      const FOCUS_OUT = 'blur'
      const FOCUS_IN = 'focus'

      const eventType = event.type

      if (FOCUS_OUT === eventType) {
        // iOS 대응용 timeout 설정
        this.focusTimerId2 = setTimeout(() => {
          this.isPwConfirmFocused = false
        }, 200)
      } else if (FOCUS_IN === eventType) {
        if (this.focusTimerId2) {
          clearTimeout(this.focusTimerId2)
          this.isPwConfirmFocused = true
        }
      }
    },
    /**
     * 비밀번호 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurPassword (e) {
      if (e.relatedTarget === this.$refs.togglePasswordButton || e.relatedTarget === this.$refs.passwordClearButton) {
        this.$refs.passwordInput.focus()
      }

      this.isOrderPaasswordErrMsgShow2 = false
      this.isOrderPwConfirmErrMsgShow1 = false
      this.isOrderPwConfirmErrMsgShow2 = false

      if (this.ordererInfo.paassword.length === 0) {
        this.isOrderPaasswordErrMsgShow2 = false
        this.isOrderPwConfirmErrMsgShow1 = false
        this.isOrderPwConfirmErrMsgShow2 = false
      } else {
        if (this.ordererInfo.paassword === this.ordererInfo.pwConfirm) {
          this.isPwConfirmSuccessShow = true
        } else {
          this.isPwConfirmSuccessShow = false
        }

        // 비밀번호가 일치하지 않습니다.
        if (!isNull(this.ordererInfo.pwConfirm) && this.ordererInfo.paassword !== this.ordererInfo.pwConfirm) {
          this.isOrderPaasswordErrMsgShow2 = false
          this.isOrderPwConfirmErrMsgShow1 = false
          this.isOrderPwConfirmErrMsgShow2 = true
        }
        // 비밀번호는 영문소문자+숫자 조합으로 입력해주세요.
        if (!(/^[~!@#$%^&*()_+|<>?:{}a-z0-9]/).test(this.ordererInfo.paassword)) {
          this.isOrderPaasswordErrMsgShow2 = true
        }
      }
    },
    /**
     * 비밀번호 확인 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurPwConfirm (e) {
      if (e.relatedTarget === this.$refs.togglePwConfirmButton || e.relatedTarget === this.$refs.pwConfirmClearButton) {
        this.$refs.pwConfirmInput.focus()
      }

      this.isOrderPwConfirmErrMsgShow2 = false

      // 비밀번호가 일치하지 않습니다.
      if (this.ordererInfo.paassword !== this.ordererInfo.pwConfirm) {
        this.isOrderPwConfirmErrMsgShow2 = true
      }

      if (this.ordererInfo.pwConfirm.length !== 0) {
        if (this.ordererInfo.paassword === this.ordererInfo.pwConfirm) {
          this.isPwConfirmSuccessShow = true
        } else {
          this.isPwConfirmSuccessShow = false
        }
      }
    },
    /**
     * 비밀번호 보기 숨기기
     */
    clickPasswordShow () {
      if (this.isPasswordTextShow) {
        this.isPasswordTextShow = false
        this.isPasswordTextHide = true

        this.isPasswordShowing = true
      } else {
        this.isPasswordTextShow = true
        this.isPasswordTextHide = false

        this.isPasswordShowing = false
      }

      this.$refs.passwordInput.focus()
    },
    /**
     * 비밀번호 확인 보기 숨기기
     */
    clickPwConfirmShow () {
      if (this.isPwConfirmTextShow) {
        this.isPwConfirmTextShow = false
        this.isPwConfirmTextHide = true

        this.isPwConfirmShowing = true
      } else {
        this.isPwConfirmTextShow = true
        this.isPwConfirmTextHide = false

        this.isPwConfirmShowing = false
      }

      this.$refs.pwConfirmInput.focus()
    },
    /**
     * 비밀번호 초기화
     */
    clickClearPassword () {
      this.ordererInfo.paassword = ''

      this.isPasswordTextShow = false
      this.isPasswordTextHide = false
      this.isPasswordDelBtnShow = false
      this.isPasswordSuccessShow = false
      this.isOrderPaasswordErrMsgShow1 = true

      this.$refs.passwordInput.focus()
      this.clickPasswordShow()
    },
    /**
     * 비밀번호확인 초기화
     */
    clickClearPwConfirm () {
      this.ordererInfo.pwConfirm = ''

      this.isPwConfirmTextShow = false
      this.isPwConfirmTextHide = false
      this.isPwConfirmDelBtnShow = false
      this.isPwConfirmSuccessShow = false

      this.$refs.pwConfirmInput.focus()
      this.clickPwConfirmShow()
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetGuestCustomer";
</style>
