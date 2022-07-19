<template>
  <div class="member_agree_marketing">
    <p
      v-if="isSaveError"
      class="error_msg"
    >
      {{ saveErrorMsg }}
    </p>
    <ns-input
      :params="birthDayParams"
      @input="numberCheck"
    />
    <div class="input_field sex">
      <label class="label_text">성별</label>
      <div class="radio_wrap">
        <label>
          <input
            type="radio"
            class="radio"
            name="radio_sex"
            value="F"
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
    <div class="btn_group">
      <button
        type="button"
        class="btn_later"
        @click="saveLater"
      >
        <span>다음에 하기</span>
      </button>
      <button
        type="button"
        class="btn_save"
        @click="saveAgree"
      >
        <span>선택정보 저장</span>
      </button>
    </div>
  </div>
</template>

<script>
import MEMBER_CONST from '@constants/customer/member'
// import LOGIN_CONST from '@constants/customer/login'
import {
  getAgeInFull,
  getNowDate
} from '@frameworks/dateutil/dateUtil'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import modalUtil from '@frameworks/modalUtil'
import COMM_CONST from '@constants/framework/constants'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsInput from '@components/common/NsInput'

export default {
  name: 'MemberAgreeMarketing',
  components: {
    NsInput
  },
  data () {
    return {
      memberSex: '',
      isAllAgree: false,
      isAgreeEmail: false,
      isAgreeSMS: false,
      isAgreeTel: false,
      isSaveError: false,
      isTestCase: false,
      userName: '',
      userEMail: '',
      userPhone: '',
      userPass: '',
      userId: '',
      affilEntCd: '',
      entEmail: '',
      entFlag: '',
      entUserId: '',
      entName: '',
      refresh_token: '',
      snsLinkCtnt: '',
      saveErrorMsg: '',
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
      }
    }
  },
  created () {
    if (loginUtil.isLoggedIn()) {
      const memberInfo = loginUtil.getMemberInfo()
      this.userName = memberInfo.userName
      this.userEMail = memberInfo.logonId
      this.userPhone = memberInfo.userPhone
      this.userPass = memberInfo.userPass
      this.userId = memberInfo.userId
      this.affilEntCd = isNull(memberInfo.affilEntCd) ? '' : memberInfo.affilEntCd
      this.entEmail = isNull(memberInfo.entEmail) ? '' : memberInfo.entEmail
      this.entFlag = isNull(memberInfo.entFlag) ? '' : memberInfo.entFlag
      this.entUserId = isNull(memberInfo.entUserId) ? '' : memberInfo.entUserId
      this.refresh_token = isNull(memberInfo.refresh_token) ? '' : memberInfo.refresh_token
      this.entName = isNull(memberInfo.entName) ? '' : memberInfo.entName
      this.snsLinkCtnt = isNull(memberInfo.snsLinkCtnt) ? '' : memberInfo.snsLinkCtnt
    } else {
      this.userName = this.$route.params.userName
      this.userEMail = this.$route.params.userEMail
      this.userPhone = this.$route.params.userPhone
      this.userPass = this.$route.params.userPass
      this.userId = this.$route.params.userId
      this.affilEntCd = isNull(this.$route.params.affilEntCd) ? '' : this.$route.params.affilEntCd
      this.entEmail = isNull(this.$route.params.entEmail) ? '' : this.$route.params.entEmail
      this.entFlag = isNull(this.$route.params.entFlag) ? '' : this.$route.params.entFlag
      this.entUserId = isNull(this.$route.params.entUserId) ? '' : this.$route.params.entUserId
      this.refresh_token = isNull(this.$route.params.refresh_token) ? '' : this.$route.params.refresh_token
      this.entName = isNull(this.$route.params.entName) ? '' : this.$route.params.entName
      this.snsLinkCtnt = isNull(this.$route.params.snsLinkCtnt) ? '' : this.$route.params.snsLinkCtnt
    }
  },
  methods: {
    /**
     * 생년월일 숫자형체크
     *
     * @returns {boolean|void}
     */
    numberCheck () {
      let birthVal = this.birthDayParams.value.trim()
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
      }
    },
    /**
     * 생년월일 validDate
     *
     * @param {String} dateStr 생년월일8자
     * @returns {object} jsonObject 검증결과Object
     */
    isBirthDayFourteenValidDate (dateStr) {
      const year = Number(dateStr.substr(0, 4))
      const month = Number(dateStr.substr(4, 2))
      const day = Number(dateStr.substr(6, 2))
      const today = new Date() // 날자 변수 선언
      const yearNow = today.getFullYear()
      const adultYear = yearNow - 13
      const ageInFull = getAgeInFull(dateStr, true)

      if (year >= adultYear || !ageInFull) {
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
     * 성별값 Param변수에 담기
     *
     * @param {String} val 성별값
     * @returns {void}
     */
    setSex (val) {
      this.memberSex = val
    },
    /**
     * 선택정보 전체선택 콤보박스 처리
     *
     * @returns {void}
     */
    setAllAgree () {
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
    },
    /**
     * 선택정보 개별선택 콤보박스 처리
     *
     * @param {string} type 선택정보유형
     * @returns {void}
     */
    setAgree (type) {
      if (type === 'mail') {
        if (!this.isAgreeEmail) {
          this.isAgreeEmail = true
        } else {
          this.isAgreeEmail = false
        }
      } else if (type === 'sms') {
        if (!this.isAgreeSMS) {
          this.isAgreeSMS = true
        } else {
          this.isAgreeSMS = false
        }
      } else if (type === 'tel') {
        if (!this.isAgreeTel) {
          this.isAgreeTel = true
        } else {
          this.isAgreeTel = false
        }
      }

      if (this.isAgreeEmail && this.isAgreeSMS && this.isAgreeTel) {
        this.isAllAgree = true
        this.$refs.allAgree.checked = true
      } else {
        this.isAllAgree = false
        this.$refs.allAgree.checked = false
      }
    },
    /**
     * 선택정보 저장 API호출
     *
     * @returns {boolean|void}
     */
    saveAgree () {
      const isSMS = this.isAgreeSMS ? 'Y' : 'N'
      const isEmail = this.isAgreeEmail ? 'Y' : 'N'
      const isTel = this.isAgreeTel ? 'Y' : 'N'
      const gender = this.memberSex

      const phone = this.userPhone
      const phoneType = ''
      const birth = this.birthDayParams.value

      // [TODO] - 기획요청으로 삭제하였으나 추후 살릴수 있도록 남겨놓음
      // TM 수신동의 시 - 성별 및 생년월일 값 필수확인 - 기획요청으로 삭제
      // if (isTel === 'Y') {
      //   if (gender === '') {
      //     if (isNull(birth)) { // 성별 및 생년월일이 입력되지 않은 경우
      //       messageUtil.alert(MEMBER_CONST.MEMBER_TEXT.BIRTH07)
      //       return false
      //     } else {
      //       messageUtil.alert(MEMBER_CONST.MEMBER_TEXT.GENDER01) // 성별이 입력되지 않은 경우
      //       return false
      //     }
      //   } else if (isNull(birth) || this.birthDayParams.isError) { // 생년월일만 입력되지 않은 경우 또는 오류인경우
      //     messageUtil.alert(MEMBER_CONST.MEMBER_TEXT.BIRTH08)
      //     return false
      //   }
      // }

      // 생년월일이 입력되어 있을 경우 - 생년월일 Validation 체크
      if (!isNull(birth)) {
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

        const strInYear = birth.substring(0, 4) // 입력받은 연도
        const strInMonth = birth.substring(4, 6) // 입력받은 월
        const strInDay = birth.substring(6, 8) // 입력받은 일

        // 월이 1 ~ 12월 사이인가
        if (Number(strInMonth) < 1 || Number(strInMonth) > 12) {
          this.birthDayParams.isError = true
          this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH06
          return false
        }

        const nMonthLastDay = new Date(Number(new Date(strInYear, strInMonth, 1)) - 86400000).getDate() // 해당 년,월의 마지막 일

        // 일이 1 ~ 해당 년월의 마지막날 사이인가
        if (Number(strInYear) <= 1700 || Number(strInDay) < 1 || Number(strInDay) > nMonthLastDay) {
          this.birthDayParams.isError = true
          this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.BIRTH06
          return false
        }

        const fourteenValidDate = this.isBirthDayFourteenValidDate(birth)
        if (!fourteenValidDate.stat) {
          this.birthDayParams.isError = true
          this.birthDayParams.errorMessage = fourteenValidDate.msg
          return false
        }
      }

      // 통신사 값이 있을 경우 - 전화번호 입력 여부를 확인한다
      if (!isNull(phoneType) && isNull(phone)) {
        this.birthDayParams.isError = true
        this.birthDayParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE00
        return false
      }

      const invoke = {
        gender,
        cmdType: 'saveAdd',
        name: this.userName,
        agreeEmail: isEmail,
        agreeSms: isSMS,
        agreeTel: isTel,
        birthDay: birth
      }
      if (phoneType !== '') {
        invoke.phoneType = ''
        invoke.phone = phone
      }

      const successHandling = response => {
        const code = response.msg.result.resultCode
        // const saveAgreeGender = (code === 'y' || code === 'Y') ? response.gender[0] : null
        // const saveAgreeBirth = `${birth.substring(0, 4)}-${birth.substring(4, 6)}-${birth.substring(6, 8)}`

        if (code === 'y' || code === 'Y') {
          // 마케팅 스크립트 적용 부분
          // AIQUA
          marketingUtil.aiquaLogger.send({
            type: marketingUtil.aiquaLogger.USER_PROFILE,
            data: {
              userId: loginUtil.getUserInfo('custNum'),
              name: '', // loginUtil.getUserInfo('userName'),
              email: '', // loginUtil.getUserInfo('email'),
              phoneNumber: '', // loginUtil.getUserInfo('telNo'),
              birthday: '', // saveAgreeBirth,
              gender: '', // saveAgreeGender,
              loginStatus: loginUtil.getUserInfo('loginyn'),
              devicePushAgree: '', // pushState,
              notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
              isEmployee: loginUtil.getUserInfo('staffBnft'),
              level: loginUtil.getUserInfo('gradeNm'),
              coCd: COMM_CONST.getCocd(),
              lastLogin: '' // qg_fileter_last_login 값
            }
          })

          const layPopParam = {
            title: '마케팅 수신동의',
            agreeDate: this.formatDateWithHangul(getNowDate()),
            isSms: (response.agreeSms[0] === 'Y' ? '동의' : '미동의'),
            isEmail: (response.agreeEmail[0] === 'Y' ? '동의' : '미동의'),
            isTel: (response.agreeTel[0] === 'Y' ? '동의' : '미동의')
          }

          const callback = data => {
            if (data.isOk) {
              this.getLogin()
            }
          }

          if (!this.isTestCase) {
            modalUtil.show('customer/AgreeMarketingLayer', layPopParam, callback)
          }
        } else {
          this.isSaveError = true
          this.saveErrorMsg = response.msg.result.resultMsg
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      this.$nsaxios.post('NsMobileMemberSignupCmd', invoke, successHandling, errorHandling)
    },
    /**
     * 다음에 하기 기능 처리
     *
     * @returns {void}
     */
    saveLater () {
      const isSMS = this.isAgreeSMS
      const isEmail = this.isAgreeEmail
      const isTel = this.isAgreeTel
      const gender = this.memberSex
      const birth = this.birthDayParams.value.trim()

      const okCallback = () => {
        bizUtil.gotoMain()
      }
      const cancelCallback = () => {
        // 라우터 이동 취소
        this.saveAgree()
      }

      if (isSMS || isEmail || isTel || !isNull(gender) || !isNull(birth)) {
        messageUtil.confirm(`${MEMBER_CONST.WARNING_MESSAGES.SAVE_LATER_TITLE}\n${MEMBER_CONST.WARNING_MESSAGES.SAVE_LATER}`, okCallback, cancelCallback, MEMBER_CONST.WARNING_MESSAGES.NEXT_TIME, MEMBER_CONST.WARNING_MESSAGES.SAVE_LATER_NOW)
      } else {
        okCallback()
      }
    },
    /**
     * 정보저장후 로그인 처리
     *
     * @returns {void}
     */
    getLogin () {
      const param = {
        logonId: this.userEMail,
        logonPassword: this.userPass,
        logonType: 'normal',
        reLogonURL: 'LogonForm',
        URL: 'QuickCheckoutSummaryView',
        isCaptChaYn: 'N',
        login_check: 'login_hub_ssl',
        entFlag: this.entFlag,
        entUserId: this.entUserId,
        refresh_token: this.refresh_token,
        entName: this.entName,
        entEmail: this.entEmail,
        fromLoginPage: true,
        snsLinkCtnt: this.snsLinkCtnt
      }

      const successHandling = response => {
        const logonresult = response.msg.root.Logonresult
        /** 로그인 성공처리 */
        if (logonresult.resCode === '00' || logonresult.resCode === '10' || logonresult.resCode === '50') {
          const memberInfo = response.msg.root.memberInfo
          memberInfo.failcount = logonresult.failcount
          memberInfo.sessionid = logonresult.session_id
          memberInfo.loginyn = logonresult.login_yn
          memberInfo.logonPassword = param.logonPassword
          memberInfo.staffBnft = 'N'
          // 일반로그인 사용자 처리
          memberInfo.loginType = 'K'
          loginUtil.login(memberInfo)

          bizUtil.gotoMain()
        } else {
          bizUtil.gotoMain()
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      this.$nsaxios.post('NSLogonMoblieCmdReal', param, successHandling, errorHandling)
    },
    formatDateWithHangul (stringDate) {
      if (isNull(stringDate) || stringDate.length < 8) {
        return ''
      }

      const year = stringDate.substr(0, 4)
      let month = stringDate.substr(4, 2)
      let day = stringDate.substr(6, 2)

      if (Number(month) < 10) {
        month = month.replace('0', '')
      }

      if (Number(day) < 10) {
        day = day.replace('0', '')
      }

      return `${year}년 ${month}월 ${day}일`
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/join/MemberAgreeMarketing";
</style>
