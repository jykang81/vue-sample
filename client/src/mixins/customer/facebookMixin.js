import LOGIN_CONST from '@constants/customer/login'
import messageUtil from '@frameworks/messageUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import modalUtil from '@frameworks/modalUtil'

const facebookMixin = {
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      chkMsg: ''
    }
  },
  methods: {
    /**
     * 페이스북 모듈LOAD
     * @param {object} d Documents
     * @param {string} s LoadType
     * @param {string} id Documents ID
     * @returns {void}
     */
    loadFacebookSDK (d, s, id) {
      const djs = d.createElement(s) || {}
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }

      djs.id = id
      djs.src = 'https://connect.facebook.net/ko_KR/sdk.js'
      fjs.parentNode.insertBefore(djs, fjs)
    },
    /**
     * 페이스북 로그인 init
     **/
    async initFacebookInfo () {
      window.FB.init({
        appId: LOGIN_CONST.SIMPLE_LOGIN.FACEBOOK.APP_ID, // App ID
        status: true, // check login status
        cookie: false, // enable cookies to allow the server to access the session
        xfbml: true, // parse XFBML
        oauth: true,
        version: 'v13.0'
      })

      // 이미 로그인되어 있으면 로그아웃 시킴
      await window.FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          window.FB.logout()
        }
      })
    },
    /**
     * 페이스북 회원가입
     *
     * @returns {void}
     */
    joinFacebooSimple () {
      if (this.isCheckAgree === false) {
        messageUtil.alert('개인정보 수집 및 이용약관에 동의해 주세요.')
        return false
      }

      const reqParams = {
        // 고정값
        duplicationChk: 'N',
        userAuthorizationName: 'YK',
        snsEmail: '',
        snsUserId: '',
        userField1: '',
        userField2: 'S',
        userField3: '',
        agree: 'Y/SA-001',
        addressField1: '',
        addressField2: '',
        userProfileField2: 'N',
        userAuthorizationBirthDate: '2014-01-01',
        rcvSmsNotification: '0',
        myAcctMain: '',
        zipCode: '.',
        address1: '.',
        address2: '',
        phone1: '',
        phone2: '',
        catalogId: '97001',
        logonPassword: '1qazxsw2',
        logonPasswordVerify: '1qazxsw2',
        state: 'S',
        city: 'C',
        country: 'KR',
        registerType: 'Guest',
        primary: '1',
        profileType: 'C',
        memberType: 'S',
        termTitle: '',
        termText: '',
        integrationPoint: 'N',
        registpath: 'M',
        affilEntCd: '110',
        optionaltermYn: 'Y',
        URL: 'RegistrationCompleteViewCmd?',
        update_yn: 'Y',
        existYn: 'N',
        backend_yn: 'N',

        // 입력값
        name: '', // facebook name
        logonId: '', // 입력값
        email1: '', // facebook email
        gender: '', // 성별 M : 남자, F : 여자
        firstName: '', // facebook name
        lastName: '', // facebook name
        dateOfBirth: '', // facebook birth (yyyy-mm-dd)
        userDemoField2: 'Y' // 이메일 수신동의 여부
      }

      reqParams.name = this.facebookParams.name
      reqParams.email1 = this.facebookParams.Email
      reqParams.logonId = this.facebookParams.Email
      reqParams.firstName = this.facebookParams.name
      reqParams.lastName = this.facebookParams.name
      reqParams.dateOfBirth = this.reformBirthDay(this.facebookParams.birthday)
      reqParams.gender = (this.facebookParams.gender === 'male') ? 'M' : 'F'

      reqParams.userDemoField2 = this.pickedPeriod ? 'Y' : 'N'

      reqParams.logonType = this.facebookParams.logonType
      reqParams.entFlag = this.facebookParams.entFlag
      reqParams.entUserId = this.facebookParams.entUserId
      reqParams.entEmail = this.facebookParams.entEmail
      reqParams.isSSORequest = this.facebookParams.isSSORequest
      reqParams.entName = this.facebookParams.entName
      reqParams.birthday = this.facebookParams.birthday
      reqParams.saveYn = this.facebookParams.saveYn
      reqParams.autoYn = this.facebookParams.autoYn
      reqParams.faceBookJoin = true
      reqParams.logonType = 'simple'
      reqParams.resAction = 'none'

      this.$nsaxios.post('NSSessionCheckMobile', { email1: this.facebookParams.Email, checkview: '1' }, data => {
        const processCode = data.msg.root.snsregistcheck.processCode
        const processMsg = data.msg.root.snsregistcheck.processMsg

        if (processCode === 'E') {
          messageUtil.alert(processMsg)
        } else {
          this.registrationComplete(reqParams)
        }
      })
    },
    /**
     * 페이스북 간편가입 완료처리
     * @param {object} reqParams 회원가입정보
     * @returns {void}
     */
    registrationComplete (reqParams) {
      this.$nsaxios.post('RegistrationCompleteViewMobile', reqParams, data => {
        const resultMsg = data.msg.root.Registresult.resultMsg
        const resultCode = data.msg.root.Registresult.resultCode
        if (resultCode === 'Y') {
          reqParams.logonId = data.msg.root.memberInfo.logonId
          const goingInvoke = {
            name: 'facebookJoinComplete',
            params: reqParams
          }
          this.$router.push(goingInvoke)
        } else {
          messageUtil.alert(resultMsg)
        }
      })
    },
    /**
     * 페이스북 회원가입후 로그인
     *
     * @param {object} param 로그인정보
     * @returns {boolean|void}
     */
    sendFBLogin (param) {
      const fbParams = {
        logonId: param.logonId,
        logonPassword: param.logonPassword,
        logonType: 'simple',
        entFlag: param.entFlag,
        entUserId: param.entUserId,
        entEmail: param.entEmail,
        isSSORequest: param.isSSORequest,
        entName: param.entName,
        gender: param.gender,
        birthday: param.birthday,
        saveYn: param.saveYn,
        autoYn: param.autoYn,
        faceBookJoin: param.faceBookJoin
      }
      this.sendLogin(fbParams)
    },
    /**
     * 페이스북 생년월일 계산
     * @param {string} birthDay 생년월일
     * @returns {string}
     */
    reformBirthDay (birthDay) {
      if (isNull(birthDay) || birthDay.indexOf('/') === -1) {
        return ''
      }
      const array = birthDay.split('/')
      const year = array[2]
      const month = array[0]
      const day = array[1]
      return `${year}-${month}-${day}`
    },
    /**
     * 페이스북 약관레이어팝업 호출
     */
    async onclickBtnUsageShow () {
      const termsData = await this.setMemberAgreeGuide()
      const params = {
        mallUserGuide: termsData.mallUserGuide
      }

      modalUtil.show('customer/FacebookMemberAgree.vue', params, this.agreeLayerCallback, true, true)
    },
    /**
     * 페이스북 이용약관 API호출
     *
     * @returns {object}
     */
    async setMemberAgreeGuide () {
      const response = await this.$nsaxios.post('MallMemberGuideReal', {})
      return this.setTermsOfUseData(response)
    },
    /**
     * 이용약관 레이어팝업 callback처리
     *
     * @param {object} callbackData 이용약관 콜백데이터
     */
    agreeLayerCallback (callbackData) {
      if (callbackData) {
        this.isCheckAgree = callbackData.isAgreeTerms
      }
    },
    /**
     * 이용약관 데이터 갱신
     * @param {object} response 이용약관 API 반환값
     * @returns {object}
     */
    setTermsOfUseData (response) {
      const commonResultPath = response.msg.root
      const returnData = {
        mallUserGuide: ''
      }

      returnData.mallUserGuide = htmlDecode(commonResultPath.SNSUsingTerms)
      return returnData
    }
  }
}

export default facebookMixin
