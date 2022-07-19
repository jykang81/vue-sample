import { mapState, mapGetters } from 'vuex'
import nsaxios from '@frameworks/axiosUtil'
import cookieUtil from '@frameworks/cookieUtil'
import {
  getBdDay,
  getAgeInFull,
  getTimeStamp,
  getDateParse02,
  calcDate
} from '@frameworks/dateutil/dateUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import messageUtil from '@frameworks/messageUtil'
import nativeUtil from '@frameworks/nativeUtil'
import popupUtil from '@frameworks/popupUtil'
import routerUtil from '@frameworks/routerUtil'
import toastUtil from '@frameworks/toastUtil'
import CONST from '@constants/framework/framework'
import LOGIN_CONST from '@constants/customer/login'
import MEMBER_CONST from '@constants/customer/member'
import {
  getBytes,
  getCutBytes,
  getUUID,
  isNull,
  isOsApp,
  viewType,
  objectToQueryString,
  serializeToObject,
  insertSeparatorPhoneNumber,
  htmlDecode,
  isEmpty
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import NATIVE_CONST from '@constants/framework/native'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import MESSAGES from '@constants/framework/messages'
import bizUtil from '@utils/bizUtil'
import COMM_CONST from '@constants/framework/constants'
import $store from '@/vuex'

const customerInputMixin = {
  data () {
    return {
      chkMsg: '',
      apiCallCnt: 0
    }
  },
  computed: {
    ...mapState('orderSheet', ['fromOrderSheetIsNoMemberOrder']),
    ...mapGetters('search', ['getSearchProductAdultStat']),
    ...mapGetters('login', ['getReturnRoute', 'setLoginParam'])
  },
  methods: {
    /**
     * 사용자명의 규칙검증
     *
     * @param {Event} e 이벤트객체
     * @param {Object} params prop of parent component
     * @returns {void|boolean}
     */
    checkUserNameKeyUp (e, params) {
      params.value = params.value.replace(/ /gi, '')
      const userName = params.value
      const strKorRegExp = /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(userName)
      const strEngRegExp = /[^A-Za-z]/g.test(userName)

      if (strKorRegExp && strEngRegExp) {
        params.isError = true
        params.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME01
        return
      } else {
        if (!strKorRegExp) {
          params.maxlength = 10

          if (userName.length > 10) {
            params.value = userName.slice(0, -1)
            if (!isNull(e.target)) {
              e.target.value = params.value
            }
          }
        } else if (!strEngRegExp) {
          params.maxlength = 20

          if (userName.length > 20) {
            params.value = userName.slice(0, -1)
            if (!isNull(e.target)) {
              e.target.value = params.value
            }
          }
        }
      }

      params.isError = false
      params.isSuccess = false
    },
    /**
     * focus out에 따른 사용자명 검증
     *
     * @param {Event} e 이벤트객체(DOM객체 순서문제로 제거하면 특정 함수가 인식하지 않음)
     * @param {Object} params prop of parent component
     * @returns {void|boolean}
     */
    checkUserName (e, params) {
      const name = params.value.replace(/ /gi, '')

      const validation = this.checkUserNameValidation(params)

      if (!validation) {
        params.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME01
        params.isError = true
        return
      }

      if (getBytes(name) > 20) {
        params.errorMessage = MEMBER_CONST.MEMBER_TEXT.NAME01
        params.isError = true
        params.value = getCutBytes(name, 20)
      } else {
        params.isError = false
      }
    },
    /**
     * 사용자명의 규칙검증
     *
     * @param {Object} params prop of parent component
     * @returns {void|boolean}
     */
    checkUserNameValidation (params) {
      const userName = params.value.replace(/ /gi, '')
      const strKorRegExp = /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(userName)
      const strEngRegExp = /[^A-Za-z]/g.test(userName)

      return !strKorRegExp || !strEngRegExp
    },
    /**
     * 이메일 자동완성 함수
     *
     * @param {object} params prop of parent component
     * @returns {void|boolean}
     */
    getEmailAuto (params) {
      /**
       * 이메일 도메인목록처리
       */
      const loginId = params.value
      const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(loginId)
      const domainCheck = this.checkDomain(loginId.substring(loginId.indexOf('@') + 1))

      if (domainCheck) {
        this.isActive = true
      }

      if (loginId.lastIndexOf('@') > 1 && !regExp && loginId.length === loginId.lastIndexOf('@') + 1) {
        this.searchQuery = loginId
        const str = this.searchQuery
        const reg = /[a-zA-Z0-9.@|\s]/.test(str)
        if (reg === true && str !== '' && str !== ' ') {
          this.isActive = true
          const dominList = this.emailDomainList
          const tmpList = []
          for (let ri = 0; ri < dominList.length; ri++) {
            const loginId = str.substring(0, str.indexOf('@') + 1)
            const data = [loginId, `${dominList[ri]}`]
            tmpList[ri] = data
          }
          this.emailList = tmpList
        } else {
          this.isActive = false
        }
      } else if (loginId.lastIndexOf('@') > 1 && ((this.emailList.length > 0 && loginId.length > loginId.lastIndexOf('@')) || !domainCheck)) {
        this.searchQuery = loginId
        const str = this.searchQuery
        const reg = /[a-zA-Z0-9.@|\s]/.test(str)

        if (reg === true && str !== '' && str !== ' ') {
          this.isActive = true
          const dominList = this.emailDomainList
          const tmpList = []
          let listIdx = 0
          for (let ri = 0; ri < dominList.length; ri++) {
            const loginId = str.substring(0, str.indexOf('@') + 1)
            const domain = str.substring(str.indexOf('@') + 1)
            const rowDomain = dominList[ri]
            if (rowDomain.indexOf(domain) === 0) {
              const data = [loginId + domain, dominList[ri].replace(domain, '')]
              tmpList[listIdx++] = data
            }
          }
          this.emailList = tmpList

          if (this.emailList.length === 0) {
            this.isActive = false
          }
        } else {
          this.isActive = false
        }
      } else {
        this.isActive = false
      }
    },
    /**
     * 아이디의 도메인목록에 존재여부 확인
     *
     * @param {string} domain
     * @returns {boolean}
     */
    checkDomain (domain) {
      const returnBoo = false
      this.emailDomainList.forEach(data => {
        if (data.indexOf(domain) > -1) {
          this.returnBoo = true
        }
      })

      return returnBoo
    },
    /**
     * 간편로그인 팝업 호출
     *
     * @param {string} name 간편로그인대상 사이트명
     */
    simpleLogin (name) {
      // 마케팅 스크립트 적용 부분
      // GA 360
      if (name === 'NAVER') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_회원가입',
            eventAction: '간편회원',
            eventLabel: '네이버회원가입',
            params: {
              t1: null
            }
          }
        })
      } else if (name === 'KAKAO') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_회원가입',
            eventAction: '간편회원',
            eventLabel: '카카오회원가입',
            params: {
              t1: null
            }
          }
        })
      } else if (name === 'PAYCO') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_회원가입',
            eventAction: '간편회원',
            eventLabel: '페이코회원가입',
            params: {
              t1: null
            }
          }
        })
      } else if (name === 'APPLE') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_회원가입',
            eventAction: '간편회원',
            eventLabel: '애플회원가입',
            params: {
              t1: null
            }
          }
        })
      }

      const popupParam = {
        state: null,
        accptPath: 500
      }
      const ranNum = Math.floor(Math.random() * (1001))

      if (location.protocol.indexOf('https') === -1) {
        popupParam.state = `${ranNum}_http`
      } else {
        popupParam.state = `${ranNum}_https`
      }

      let marketingSnsName = ''
      if (name === 'PAYCO') {
        if (isOsApp()) { // APP
          nativeUtil.doPaycoLogin('login', 'callbackPaycoLogin', '')
        } else {
          this.popupPayco(popupParam)
        }
        marketingSnsName = '페이코로그인'
      } else if (name === 'NAVER') {
        if (isOsApp()) { // APP
          nativeUtil.doNaverLogin('login', 'callbackNaverLogin', '')
        } else {
          this.popupNaver(popupParam)
        }
        marketingSnsName = '네이버로그인'
      } else if (name === 'KAKAO') {
        if (isOsApp()) { // APP
          nativeUtil.doKakaoLogin('login', 'callbackKakaoLogin', '')
        } else {
          this.popupKakao(popupParam)
        }
        marketingSnsName = '카카오로그인'
      } else if (name === 'FACEBOOK') {
        this.popupFacebook(popupParam)
        marketingSnsName = '페이스북로그인'
      } else if (name === 'APPLE') {
        marketingSnsName = '애플로그인'
        if (isOsApp()) { // APP
          nativeUtil.doAppleLogin('login', 'callbackAppleLogin')
        }
      }

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_로그인',
          eventAction: '간편로그인',
          eventLabel: marketingSnsName,
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })
    },
    /**
     * SNS사이트에서 전달받은 정보로 WCS API로 통신한다.
     * @param {object} data SNS사이트 결과정보
     * @returns {void}
     */
    snsDataCallBack (data) {
      const hpUrl = `${CONST.API_HOST}/jsp/epg/MobileSimpleLoginData.jsp`

      console.log('snsDataCallBack Param data >>> ', data)
      const successHandler = response => {
        console.log('snsDataCallBack response >>> ', response)
        this.snsLoginCallback(response.data, data.entFlag)
        this.apiCallCnt = 0
      }

      const failureHandler = () => {
        if (this.apiCallCnt < 5) {
          this.apiCallCnt++
          this.snsDataCallBack(data)
        } else {
          this.snsLoginCallback(null, data.entFlag)
          this.apiCallCnt = 0
        }
      }

      nsaxios.post(hpUrl, data, successHandler, failureHandler)
    },
    /**
     * Simplogin Callback
     *
     * @param {object} callbackData 간편로그인 고객정보
     * @param {String} snsType 간편로그인사이트
     * @returns {void|boolean}
     */
    snsLoginCallback (callbackData, snsType) {
      if (isNull(callbackData)) {
        toastUtil.show('SNS 연동시 에러가 발생하였습니다.')
        return false
      }

      if (isNull(snsType)) {
        snsType = callbackData.entFlag
      }

      if (isNull(snsType) || (isNull(callbackData.root.refresh_token) && isNull(callbackData.root.id))) {
        toastUtil.show('필수 연동정보가 누락되었습니다.')
        return false
      }

      if (isNull(callbackData.root) && snsType === 'KAKAO') {
        toastUtil.show('카카오 연동을 취소하셨습니다.')
        return false
      }

      const accessToken = callbackData.root.refresh_token // 네이버,페이코, 카카오 엑세스토큰
      const id = callbackData.root.id // 네이버, 페이코, 카카오 고유ID값
      const email = callbackData.root.email // 네이버,페이코, 카카오 메일주소
      const name = callbackData.root.name // 네이버,페이코, 카카오 이름
      const paycoUUID = callbackData.root.paycoId || '' // 페이코ID가 이미 연동되어있는지 여부
      const snsLinkCtnt = callbackData.root

      if (paycoUUID !== '') {
        cookieUtil.setCookie('paycoUUID', paycoUUID)
      }

      const invoke = {
        cmdType: 'checkEntUser',
        entUserId: id,
        entFlag: snsType
      }

      const successHandler = response => {
        const linkYN = response.msg.result.linkYN || 'N' // 네이버ID가 이미 연동되어있는지 여부
        const nsLogonId = response.msg.result.nsLogonId // 네이버ID와 연동된 NSMALL 로그인ID
        const dupYN = response.msg.result.dupYN || 'N' // 네이버ID가 NSMALL에 사용되고 있는지 여부

        let params = {
          logonId: isNull(email) ? id : email,
          Email: email,
          entUserId: id,
          access_token: accessToken,
          name,
          entFlag: snsType,
          nsLogonId,
          snsLinkCtnt
        }

        const autoYn = this.autoYn || 'N'
        let nowAddr = window.location.href
        if (viewType() === 'ios') { // ios 인경우 window.location.href 가 문제가 있어서 수정함
          const simpleLoginPath = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.SIMPLE_LOGIN_PATH)
          console.log('ysjoo>>nowAddr>>', nowAddr)
          console.log('ysjoo>>simpleLoginPath>>', simpleLoginPath)
          if (simpleLoginPath.indexOf('/customer/join') > -1) {
            nowAddr = simpleLoginPath
            localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.SIMPLE_LOGIN_PATH)
          }
        }

        // 로그인처리
        if (linkYN === 'Y') {
          params = {
            logonId: nsLogonId,
            logonPassword: 'N',
            logonType: 'normal',
            entFlag: snsType,
            entUserId: id,
            entEmail: email,
            refresh_token: accessToken,
            isSSORequest: true,
            entName: name,
            saveYn: 'N',
            autoYn,
            snsLinkCtnt
          }

          if (nowAddr.indexOf('/customer/join') > -1 && linkYN === 'Y') {
            popupUtil.show('customer/simple/JoinSimpleExistLogin', params, this.simpleLoginCallback)
            return
          }

          console.log('this.productData >>> ', this.productData)
          console.log('this.redirectName >>> ', this.redirectName)
          if (!isNull(this.productData) && !isNull(this.redirectName)) { // 비로그인 > 바로구매 > 로그인 > SNS로그인 > 주문서
            params.productData = this.productData
            if (this.redirectName.name === 'orderConsultSheet') {
              params.redirectName = 'orderConsultSheet'
            } else if (!isNull(this.productData.invoke)) {
              params.redirectName = 'orderSheet'
            } else {
              params.redirectName = this.returnRoute
            }
          } else if (!isNull(this.returnRoute)) { // 비로그인 > 성인상품상세 > 로그인 > SNS로그인 > target page
            params.redirectName = this.returnRoute
          }

          this.sendLogin(params)
        } else if (linkYN === 'N' && (dupYN === 'Y' || dupYN === 'N')) {
          if (nowAddr.indexOf('/customer/join') > -1 && dupYN === 'N') {
            if (!isNull(email)) {
              const invoke = {
                cmdType: 'checkLogonIdUsability',
                logonid: email
              }

              this.checkEntUserToNsUser(invoke).then(nsUserYn => {
                if (nsUserYn === 'Y') {
                  popupUtil.show('customer/simple/JoinSimpleExist', params, this.simpleLoginCallback)
                } else if (nsUserYn === 'E') {
                  toastUtil.show('SNS 연동시 에러가 발생하였습니다.')
                  return false
                } else {
                  params.fnType = 'join'
                  this.simpleLoginCallback(params)
                }
              })
            } else {
              params.fnType = 'join'
              this.simpleLoginCallback(params)
            }
          } else if (nowAddr.indexOf('/customer/join') > -1 && dupYN === 'Y') {
            console.log('ysjoo>>JoinSimpleExist call')
            popupUtil.show('customer/simple/JoinSimpleExist', params, this.simpleLoginCallback)
          } else {
            console.log('ysjoo>>memberConnect call')
            params.fnType = 'memberConnect'
            this.simpleLoginCallback(params)
          }
        }
      }
      const failureHandler = error => {
        console.error(error)
        messageUtil.error('통신 오류가 발생하였습니다.', null)
      }
      console.log('invoke>>', invoke)
      nsaxios.post('NsMobileMemberSignupCmd', invoke, successHandler, failureHandler)
    },
    /**
     * 회원가입시 SNS E-Mail이 NS ID와 중복되는지 확인
     *
     * @param {object} params 검증할 SNS정보데이터
     * @returns {string}
     */
    async checkEntUserToNsUser (params) {
      let resultYn = 'N'

      await this.$nsaxios.post('NsMobileMemberSignupCmd', params, response => {
        const code = response.msg.result.resultCode.toUpperCase()
        if (code !== 'Y') {
          resultYn = 'Y'
        }
      }, () => {
        resultYn = 'E'
      })

      return resultYn
    },
    /**
     * 유형에 따른 간편로그인 연동, 간편가입을 호출한다.
     *
     * @param {object} data 간편로그인콜백데이터
     */
    simpleLoginCallback (data) {
      const fnType = data.fnType

      const popupParam = {
        state: null,
        accptPath: 500
      }
      const ranNum = Math.floor(Math.random() * (1001))

      if (location.protocol.indexOf('https') === -1) {
        popupParam.state = `${ranNum}_http`
      } else {
        popupParam.state = `${ranNum}_https`
      }

      if (fnType === 'memberConnect') {
        const moveParam = {
          path: '/customer/login/simple',
          name: 'simpleLogin',
          params: data
        }
        this.$router.push(moveParam)
      } else if (fnType === 'join') {
        const moveParam = {
          name: 'simpleJoin',
          params: data
        }
        this.$router.push(moveParam)
      } else if (fnType === 'callPayco') {
        if (isOsApp()) { // APP
          nativeUtil.doPaycoLogin('login', 'callbackPaycoLogin', '')
        } else {
          this.popupPayco(popupParam)
        }
      } else if (fnType === 'callNaver') {
        if (isOsApp()) { // APP
          nativeUtil.doNaverLogin('login', 'callbackNaverLogin', '')
        } else {
          this.popupNaver(popupParam)
        }
      } else if (fnType === 'callKakao') {
        if (isOsApp()) { // APP
          nativeUtil.doKakaoLogin('login', 'callbackKakaoLogin', '')
        } else {
          this.popupKakao(popupParam)
        }
      } else if (fnType === 'nsLogin') {
        this.$router.push({ name: 'memberLogin' })
      } else if (fnType === 'nsJoin') {
        this.$router.push({ name: 'memberJoin' })
      }
    },
    /**
     * Login 처리 API호출(일반)
     *
     * @param {object} data 로그인 Param데이터
     * @returns {boolean|void}
     */
    sendLogin (data) {
      if (isNull(data)) {
        toastUtil.show('로그인정보가 누락되었습니다.')
        return false
      }

      const param = {
        logonId: data.logonId,
        logonPassword: data.logonPassword,
        logonType: data.logonType || 'normal',
        resAction: data.resAction,
        entFlag: data.entFlag,
        entUserId: data.entUserId,
        refresh_token: data.refresh_token,
        entName: data.entName,
        isSSORequest: data.isSSORequest || false,
        entEmail: data.entEmail,
        reLogonURL: 'LogonForm',
        isCaptChaYn: data.isCaptChaYn || 'N',
        login_check: 'login_hub_ssl',
        URL: 'QuickCheckoutSummaryView',
        isChangeLastName: data.isChangeLastName,
        phone1: data.phone1,
        lastName: data.lastName,
        isCredential: data.isCredential,
        fromLoginPage: data.fromLoginPage,
        snsLinkCtnt: JSON.stringify(data.snsLinkCtnt),
        nativeAdultAuthYN: '',
        nativeCustNum: ''
      }

      const successHandling = response => {
        const Logonresult = response.msg.root.Logonresult
        const faceBookJoin = data.faceBookJoin || false

        /** 로그인 성공처리 */
        if (Logonresult.resCode === '00' || Logonresult.resCode === '10' || Logonresult.resCode === '50' || Logonresult.resCode === '90') {
          const memberInfo = response.msg.root.memberInfo
          memberInfo.failcount = Logonresult.failcount
          memberInfo.sessionid = Logonresult.session_id
          memberInfo.loginyn = Logonresult.login_yn
          memberInfo.logonPassword = param.logonPassword
          memberInfo.isAutoLoginCheck = this.isAutoLoginCheck
          memberInfo.isCredential = param.isCredential
          memberInfo.fromLoginPage = param.fromLoginPage
          if (isOsApp()) {
            memberInfo.nativeAdultAuthYN = param.adultAuthYN
            memberInfo.nativeCustNum = param.custNum
            memberInfo.entEmail = data.entEmail
          }

          // 간편로그인 정보 누락된경우 등록해준다.
          const entUserId = isNull(memberInfo.entUserId) ? data.entUserId : memberInfo.entUserId
          const entFlag = isNull(memberInfo.entFlag) ? data.entFlag : memberInfo.entFlag
          memberInfo.entUserId = entUserId
          memberInfo.entFlag = entFlag

          // 고객등급처리
          const purchaseGrd = memberInfo.gradeNm
          if (purchaseGrd === 'R12' || purchaseGrd === 'LOVE.N') {
            memberInfo.gradeCss = 'markloven'
          } else if (purchaseGrd === 'R1' || purchaseGrd === '다이아몬드') {
            memberInfo.gradeCss = 'diamond'
          } else if (purchaseGrd === 'R13' || purchaseGrd === '골드') {
            memberInfo.gradeCss = 'gold'
          } else if (purchaseGrd === 'R2' || purchaseGrd === '실버') {
            memberInfo.memberGradeCss = 'silver'
          } else if (purchaseGrd === 'R10' || purchaseGrd === '패밀리') {
            memberInfo.memberGradeCss = 'family'
          } else {
            memberInfo.memberGradeCss = 'family'
            memberInfo.gradeNm = '패밀리'
          }

          // 임직원여부 확인처리
          const staffParam = {
            userId: memberInfo.userId
          }

          const staffSuccessHandling = response => { // 임직원 여부 조회후 callback
            if (response && Object.keys(isNull(response.staffInfo, '')).length > 0) {
              memberInfo.staffInfo = true
              memberInfo.staffInfoName = '임직원'
            } else {
              memberInfo.staffInfo = false
              memberInfo.staffInfoName = ''
            }

            if (response && Object.keys(isNull(response.staffBnft, '')).length > 0) {
              memberInfo.staffBnft = response.staffBnft.empYn
            } else {
              memberInfo.staffBnft = 'N'
            }

            // 일반로그인 사용자 처리
            if (faceBookJoin) { // 페이스북 인경우 LoginType는 S, 일반로그인 및 네이버, 페이코, 카카오인 경우 K
              memberInfo.loginType = 'S'
            } else {
              memberInfo.loginType = 'K'
            }
            memberInfo.logonType = data.logonType || 'normal'
            let passChkBoolen = false
            console.log('Logonresult.resCode >>>>>>> ', Logonresult.resCode)
            if (Logonresult.resCode === '50') { // 비밀번호 90일 변경대상
            // console.log(this.isAutoLoginCheck, isOsApp())
              const checkDate = localStorageUtil.get(`passChk_${memberInfo.logonId}`)
              if (!data.productData?.invoke && (checkDate === '' || !getBdDay(isNull(checkDate, '').toString()))) {
                loginUtil.login(memberInfo) // 우선 로그인처리
                passChkBoolen = true
                const goingInvoke = {
                  name: 'passwordChange3th',
                  params: {
                    memberInfo,
                    name: data.redirectName
                  }
                }
                if (isOsApp() && !this.isAutoLoginCheck) {
                  $store.commit('login/setLoginParam', {
                    memberInfo,
                    name: data.redirectName
                  })
                  this.$router.replace(goingInvoke)
                } else {
                  // 암호변경 페이지로 이동
                  this.$router.replace(goingInvoke)
                }
              }
            }

            if (!passChkBoolen) {
              loginUtil.login(memberInfo) // 최종 세션스토리지에 저장
              if (isOsApp()) { // APP
                // native 로그인 성공 후 route 이동
                this.goReturnRoute(data)
              } else {
                console.log('faceBookJoin >>>>>>>>> ', faceBookJoin)
                if (!faceBookJoin) {
                  // 로그인 후 이동할 라우트명
                  let returnRoute = {}

                  if (isNull(data.entFlag) && isNull(data.returnRoute)) {
                    returnRoute = this.getReturnRoute
                  } else {
                    // 간편로그인인경우 entFlag가 존재하면 redirect Name값은 data param에서 가져온다.
                    returnRoute = data.redirectName
                  }

                  // returnRoute가 없는 경우를 위한 방어로직
                  if (!returnRoute) {
                    returnRoute = { name: 'storeHome' }
                  }

                  // 상품상세에서 회원주문시 사용
                  if (!isNull(data.productData) && !isNull(data.productData.invoke) && !isNull(data.redirectName)) {
                    if (data.redirectName === 'orderSheet') {
                      const invoke = data.productData.invoke
                      const apiUrl = this.$route.meta.refer === 'cartList' ? 'AjaxNSOrderSheet4Worklight' : 'AjaxNSOrderPayNow4Worklight'

                      this.$nsaxios.post(apiUrl, invoke, res => {
                        const orderId = res.orderId
                        if (orderId) {
                          // 주문서정보 페이지로 이동
                          bizUtil.gotoOrdersheet({
                            orderId,
                            invoke: data.productData.invoke // inputData를 같이 담아 넘긴다.
                          })
                        } else {
                          messageUtil.alert(`바로 주문하기를 처리하지 못했습니다.${MESSAGES.UNEXPECTED_ERROR}`, () => {
                            routerUtil.back()
                          })
                        }
                      })
                    } else if (data.redirectName === 'orderConsultSheet' || (!isNull(data.redirectName.name) && data.redirectName.name === 'orderConsultSheet')) {
                      const invoke = data.productData.invoke
                      bizUtil.gotoOrderConsult(invoke)
                    } else {
                      this.$router.replace(returnRoute).then(() => {
                        //  returnRoute 초기화
                        this.$store.commit('login/resetReturnRoute')
                      })
                    }
                  } else if (this.getSearchProductAdultStat) { // 2020 1203 add:bjw - 검색결과 페이지에서 비로그인 상태로 성인 상품에 진입한 경우.
                    this.$router.replace(returnRoute).then(() => {
                      //  returnRoute 초기화
                      this.$store.commit('login/resetReturnRoute')
                    })
                  } else {
                    // 비회원 주문서 내에서 로그인을 해야 하는경우 사용
                    if (this.fromOrderSheetIsNoMemberOrder) {
                      this.$store.commit('orderSheet/setFromOrderSheetIsNoMemberOrder', false)
                      this.noMemberOrder()
                    } else {
                      this.$router.replace(returnRoute).then(() => {
                        //  returnRoute 초기화
                        this.$store.commit('login/resetReturnRoute')
                      })
                    }
                  }
                }
              }

              // 마케팅 스크립트 적용 부분
              // GA 360
              marketingUtil.ga360Logger.send({
                type: marketingUtil.ga360Logger.LOG_EVENT,
                data: {
                  eventCate: 'MOBILE_로그인',
                  eventAction: '일반회원로그인',
                  eventLabel: '로그인',
                  params: {
                    t1: null // $router.meta.depth를 사용하는 경우
                  }
                }
              })
              // Airbirdige
              let airbridgeAction = '일반회원로그인'
              let airbridgeLabel = '로그인'
              if (param.entFlag === 'FACEBOOK') {
                airbridgeAction = '간편회원'
                airbridgeLabel = '페이스북로그인'
              } else if (param.entFlag === 'PAYCO') {
                airbridgeAction = '간편회원'
                airbridgeLabel = '페이코로그인'
              } else if (param.entFlag === 'NAVER') {
                airbridgeAction = '간편회원'
                airbridgeLabel = '네이버로그인'
              } else if (param.entFlag === 'KAKAO') {
                airbridgeAction = '간편회원'
                airbridgeLabel = '카카오로그인'
              } else {}
              marketingUtil.airbridgeLogger.send({
                event: marketingUtil.airbridgeLogger.EVENT.SIGN_IN, // 로그인
                data: {
                  action: airbridgeAction,
                  label: airbridgeLabel,
                  userID: String(memberInfo.userId)
                }
              })

              // AIQUA
              // let isEmployeeYN = ''
              // if (Object.keys(response.staffInfo).length > 0) {
              //   isEmployeeYN = 'Y'
              // } else {
              //   isEmployeeYN = 'N'
              // }
              marketingUtil.aiquaLogger.send({
                type: marketingUtil.aiquaLogger.USER_PROFILE,
                data: {
                  userId: loginUtil.getUserInfo('custNum'),
                  name: '', // loginUtil.getUserInfo('userName'),
                  email: '', // loginUtil.getUserInfo('email'),
                  phoneNumber: '', // loginUtil.getUserInfo('telNo'),
                  birthday: '', // loginUtil.getUserInfo('birthday'),
                  gender: '', // loginUtil.getUserInfo('gender'),
                  loginStatus: 'Y',
                  devicePushAgree: '', // pushState,
                  notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
                  isEmployee: loginUtil.getUserInfo('staffBnft'), // isEmployeeYN,
                  level: loginUtil.getUserInfo('gradeNm'),
                  coCd: COMM_CONST.getCocd(),
                  lastLogin: 'Y' // qg_fileter_last_login 값
                }
              })
              // AIQUA
              marketingUtil.aiquaLogger.send({
                type: marketingUtil.aiquaLogger.USER_EVENT,
                data: {
                  event: 'login'
                }
              })
            }
          }
          const staffErrorHandling = error => {
            console.error(error)
            if (isOsApp()) {
              const params = {
                msg: `${MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION}`,
                ok: '확인'
              }
              nativeUtil.showAlert(JSON.stringify(params), '')
            } else {
              messageUtil.alert(`${MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION}(임직원)`)
            }
          }

          this.$nsaxios.post('GetStaffAuthInfo', staffParam, staffSuccessHandling, staffErrorHandling)
        } else if (Logonresult.resCode === '600') { // 휴면회원
          // 휴면회원안내페이지로 이동
          const memberInfo = response.msg.root.memberInfo
          const goingInvoke = {
            name: 'restBecome',
            params: {
              memberInfo
            }
          }

          this.$router.push(goingInvoke)
        } else { /** 로그인 실패 */
          if (isOsApp()) { // APP
            // 구글 스마트락 사용자 정보 삭제(구글 스마트락 로그인 실패인경우)
            if (!isNull(param.isCredential)) {
              nativeUtil.deleteCredential()
            }
          }
          if (Logonresult.resCode === '80') {
            this.autoInputPrevention = true
            if (localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN) === 'Y') {
              localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_ID) // 자동로그인ID  삭제
              localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_PW) // 자동로그인PW  삭제
            }
          } else {
            const nowAddr = window.location.href
            if (nowAddr.indexOf('/customer/rest/become') > -1) {
              messageUtil.alert(LOGIN_CONST.LOGIN_ERROR[Logonresult.resCode], () => {
                routerUtil.back()
              })
            } else if (!faceBookJoin) {
              this.passwordParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[Logonresult.resCode]
              this.passwordParams.isError = true
            }
          }

          if (data.isCaptChaYn === 'Y') {
            this.captchaObject.setParamMessess(true, LOGIN_CONST.LOGIN_ERROR[20])
            this.passwordParams.errorMessage = ''
            this.passwordParams.isError = false
          }
        }
      }
      const errorHandling = () => {
        if (isOsApp()) {
          const params = {
            msg: `${MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION}`,
            ok: '확인'
          }
          nativeUtil.showAlert(JSON.stringify(params), '')
        } else {
          messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
        }
      }

      this.$nsaxios.post('NSMobLogonCmdReal', param, successHandling, errorHandling)
    },
    /**
     * Login 처리 API호출(휴면해제용)
     *
     * @param {object} data 휴면회원로그인 처리를 위한 데이터
     * @returns {boolean|void}
     */
    sendBecomeLogin (data) {
      if (isNull(data)) {
        toastUtil.show('로그인정보가 누락되었습니다.')
        return false
      }

      const param = {
        logonId: data.logonId,
        logonPassword: data.logonPassword,
        logonType: data.logonType || 'normal',
        resAction: data.resAction,
        entFlag: data.entFlag,
        entUserId: data.entUserId,
        refresh_token: data.refresh_token,
        entName: data.entName,
        isSSORequest: data.isSSORequest || false,
        entEmail: data.entEmail,
        reLogonURL: 'LogonForm',
        isCaptChaYn: data.isCaptChaYn || 'N',
        login_check: 'login_hub_ssl',
        URL: 'QuickCheckoutSummaryView',
        isChangeLastName: data.isChangeLastName,
        phone1: data.phone1,
        lastName: data.lastName,
        isCredential: data.isCredential,
        fromLoginPage: data.fromLoginPage,
        snsLinkCtnt: JSON.stringify(data.snsLinkCtnt)
      }

      const successHandling = response => {
        const Logonresult = response.msg.root.Logonresult

        /** 로그인 성공처리 */
        if (Logonresult.resCode === '00' || Logonresult.resCode === '10' || Logonresult.resCode === '50' || Logonresult.resCode === '90') {
          const memberInfo = response.msg.root.memberInfo
          memberInfo.failcount = Logonresult.failcount
          memberInfo.sessionid = Logonresult.session_id
          memberInfo.loginyn = Logonresult.login_yn
          memberInfo.logonPassword = param.logonPassword
          memberInfo.isAutoLoginCheck = this.isAutoLoginCheck
          memberInfo.isCredential = param.isCredential
          memberInfo.fromLoginPage = param.fromLoginPage

          if (isNull(memberInfo.adultAuthYN)) {
            memberInfo.adultAuthYN = 'N'
          }

          if (isNull(memberInfo.custNum)) {
            memberInfo.custNum = ''
          }

          // 고객등급처리
          const purchaseGrd = memberInfo.gradeNm
          if (purchaseGrd === 'R12' || purchaseGrd === 'LOVE.N') {
            memberInfo.gradeCss = 'markloven'
          } else if (purchaseGrd === 'R1' || purchaseGrd === '다이아몬드') {
            memberInfo.gradeCss = 'diamond'
          } else if (purchaseGrd === 'R13' || purchaseGrd === '골드') {
            memberInfo.gradeCss = 'gold'
          } else if (purchaseGrd === 'R2' || purchaseGrd === '실버') {
            memberInfo.memberGradeCss = 'silver'
          } else if (purchaseGrd === 'R10' || purchaseGrd === '패밀리') {
            memberInfo.memberGradeCss = 'family'
          } else {
            memberInfo.memberGradeCss = 'family'
            memberInfo.gradeNm = '패밀리'
          }

          // 마케팅 스크립트 적용 부분
          // GA 360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_로그인',
              eventAction: '일반회원로그인',
              eventLabel: '로그인',
              params: {
                t1: null // $router.meta.depth를 사용하는 경우
              }
            }
          })
          // Airbirdige
          marketingUtil.airbridgeLogger.send({
            event: marketingUtil.airbridgeLogger.EVENT.SIGN_IN, // 로그인
            data: {
              action: '일반회원로그인',
              label: '로그인',
              userID: String(memberInfo.userId)
            }
          })

          // 임직원여부 확인처리
          const staffParam = {
            userId: memberInfo.userId
          }

          const staffSuccessHandling = response => { // 임직원 여부 조회후 callback
            if (response && Object.keys(isNull(response.staffInfo, '')).length > 0) {
              memberInfo.staffInfo = true
              memberInfo.staffInfoName = '임직원'
            } else {
              memberInfo.staffInfo = false
              memberInfo.staffInfoName = ''
            }

            if (response && Object.keys(isNull(response.staffBnft, '')).length > 0) {
              memberInfo.staffBnft = response.staffBnft.empYn
            } else {
              memberInfo.staffBnft = 'N'
            }

            // AIQUA
            // let isEmployeeYN = ''
            // if (Object.keys(isNull(response.staffInfo, '')).length > 0) {
            //   isEmployeeYN = 'Y'
            // } else {
            //   isEmployeeYN = 'N'
            // }
            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_PROFILE,
              data: {
                userId: loginUtil.getUserInfo('custNum'),
                name: '', // loginUtil.getUserInfo('userName'),
                email: '', // loginUtil.getUserInfo('email'),
                phoneNumber: '', // loginUtil.getUserInfo('telNo'),
                birthday: '', // loginUtil.getUserInfo('birthday'),
                gender: '', // loginUtil.getUserInfo('gender'),
                loginStatus: 'Y',
                devicePushAgree: '', // pushState,
                notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
                isEmployee: loginUtil.getUserInfo('staffBnft'), // isEmployeeYN,
                level: loginUtil.getUserInfo('gradeNm'),
                isInactiveUser: 'Y',
                coCd: COMM_CONST.getCocd(),
                lastLogin: 'Y' // qg_fileter_last_login 값
              }
            })
            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_EVENT,
              data: {
                event: 'login'
              }
            })

            // 일반로그인 사용자 처리
            memberInfo.loginType = 'K'
            memberInfo.logonType = data.logonType || 'normal'

            let passChkBoolen = false
            console.log('Logonresult.resCode >>>>>>> ', Logonresult.resCode)
            if (Logonresult.resCode === '50') { // 비밀번호 90일 변경대상
              // console.log(this.isAutoLoginCheck, isOsApp())
              const checkDate = localStorageUtil.get(`passChk_${memberInfo.logonId}`)
              loginUtil.login(memberInfo) // 우선 로그인처리
              if (checkDate === '' || !getBdDay(isNull(checkDate, '').toString())) {
                passChkBoolen = true
                const goingInvoke = {
                  name: 'passwordChange3th',
                  params: {
                    memberInfo,
                    name: this.$route.params.name
                  }
                }
                if (isOsApp()) {
                  $store.commit('login/setLoginParam', {
                    memberInfo,
                    name: data.redirectName
                  })
                  // nativeUtil.gotoURL('/customer/login/password-change-request')
                  this.$router.replace(goingInvoke)
                } else {
                  // 암호변경 페이지로 이동
                  this.$router.replace(goingInvoke)
                }
              }
            }

            if (!passChkBoolen) {
              loginUtil.login(memberInfo) // 최종 세션스토리지에 저장
              if (isOsApp()) { // APP
                // native 로그인 성공 후 route 이동
                this.goReturnRoute(data)
              } else {
                // 로그인 후 이동할 라우트명
                let returnRoute = {}

                if (isNull(data.entFlag) && isNull(data.returnRoute)) {
                  returnRoute = this.getReturnRoute
                } else {
                  // 간편로그인인경우 entFlag가 존재하면 redirect Name값은 data param에서 가져온다.
                  returnRoute = data.redirectName
                }

                // returnRoute가 없는 경우를 위한 방어로직
                if (!returnRoute) {
                  returnRoute = { name: 'storeHome' }
                }

                // 상품상세에서 회원주문시 사용
                if (data.productData.invoke && data.redirectName === 'orderSheet') {
                  const invoke = data.productData.invoke
                  const apiUrl = this.$route.meta.refer === 'cartList' ? 'AjaxNSOrderSheet4Worklight' : 'AjaxNSOrderPayNow4Worklight'

                  this.$nsaxios.post(apiUrl, invoke, res => {
                    const orderId = res.orderId
                    if (orderId) {
                      // 주문서정보 페이지로 이동
                      bizUtil.gotoOrdersheet({
                        orderId,
                        invoke: data.productData.invoke // inputData를 같이 담아 넘긴다.
                      })
                    } else {
                      messageUtil.alert(`바로 주문하기를 처리하지 못했습니다.${MESSAGES.UNEXPECTED_ERROR}`, () => {
                        routerUtil.back()
                      })
                    }
                  })
                } else if (data.productData.invoke && data.redirectName === 'orderConsultSheet') {
                  const invoke = data.productData.invoke
                  bizUtil.gotoOrderConsult(invoke)
                } else {
                  // 비회원 주문서 내에서 로그인을 해야 하는경우 사용
                  if (this.fromOrderSheetIsNoMemberOrder) {
                    this.$store.commit('orderSheet/setFromOrderSheetIsNoMemberOrder', false)
                    this.noMemberOrder()
                  } else {
                    this.$router.push(returnRoute).then(() => {
                      //  returnRoute 초기화
                      this.$store.commit('login/resetReturnRoute')
                    })
                  }
                }
              }
            }
          }
          const staffErrorHandling = () => {
            if (isOsApp()) {
              const params = {
                msg: `${MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION}(임직원)`,
                ok: '확인'
              }
              nativeUtil.showAlert(JSON.stringify(params), '')
            } else {
              messageUtil.alert(`${MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION}(임직원)`)
            }
          }

          this.$nsaxios.post('GetStaffAuthInfo', staffParam, staffSuccessHandling, staffErrorHandling)
        } else if (Logonresult.resCode === '600') { // 휴면회원
          // 휴면회원안내페이지로 이동
          const memberInfo = response.msg.root.memberInfo
          const goingInvoke = {
            name: 'restBecome',
            params: {
              memberInfo
            }
          }

          this.$router.push(goingInvoke)
        } else { /** 로그인 실패 */
          if (isOsApp()) { // APP
            // 구글 스마트락 사용자 정보 삭제(구글 스마트락 로그인 실패인경우)
            if (!isNull(param.isCredential)) {
              nativeUtil.deleteCredential()
            }
          }
          if (Logonresult.resCode === '80') {
            this.autoInputPrevention = true
          } else {
            const nowAddr = window.location.href
            if (nowAddr.indexOf('/customer/rest/become') > -1) {
              messageUtil.alert(LOGIN_CONST.LOGIN_ERROR[Logonresult.resCode], () => {
                routerUtil.back()
              })
            } else {
              this.passwordParams.errorMessage = LOGIN_CONST.LOGIN_ERROR[Logonresult.resCode]
              this.passwordParams.isError = true
            }
          }
        }
      }
      const errorHandling = () => {
        if (isOsApp()) {
          const params = {
            msg: `${MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION}`,
            ok: '확인'
          }
          nativeUtil.showAlert(JSON.stringify(params), '')
        } else {
          messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
        }
      }

      this.$nsaxios.post('NSLogonMoblieCmdReal', param, successHandling, errorHandling)
    },
    /**
     * 자동입력방지 처리유무
     *
     * @returns {string|boolean}
     */
    checkRecaptcha () {
      // recaptcha 실행 여부
      const checkCaptcha = this.autoInputPrevention

      // recaptcha 안떠있으면 패스
      if (!checkCaptcha) {
        return 'N'
      // 떠있으면 인증 여부 체크
      } else {
        const isResultCaptcha = this.isCaptcha

        if (isResultCaptcha) {
          return 'Y'
        } else {
          return false
        }
      }
    },
    /**
     * 페이코 간편로그인 사이트 팝업 호출
     *
     * @param {object} param 팝업호출 param Data
     * @returns
     */
    popupPayco (param) {
      const state = param.state
      const code = 'code'
      const friends = 'FRIENDS'
      const userLocale = 'ko_KR'
      const redirectUri = `${location.origin}/customer/login/simple/payco`
      const targetUrl = LOGIN_CONST.SIMPLE_LOGIN.PAYCO.URL
      const clientId = LOGIN_CONST.SIMPLE_LOGIN.PAYCO.CLIENT_ID

      const paycoUrl = `${targetUrl}?client_id=${clientId}&response_type=${code}&redirect_uri=${redirectUri}&state=${state}&serviceProviderCode=${friends}&userLocale=${userLocale}`

      const popup = window.open(paycoUrl)
      if (isNull(popup)) {
        if (!isOsApp() && viewType() === 'iosweb') {
          // TODO - safari 팝업차단 안내 팝업을 띄운다.
        }
      }
    },
    /**
     * 네이버 간편로그인 사이트 팝업 호출
     *
     * @param {object} param 팝업호출 param Data
     * @returns
     */
    popupNaver (param) {
      const state = param.state
      const code = 'code'
      const redirectUri = `${location.origin}/customer/login/simple/naver`
      const targetUrl = LOGIN_CONST.SIMPLE_LOGIN.NAVER.URL
      const clientId = LOGIN_CONST.SIMPLE_LOGIN.NAVER.CLIENT_ID

      const naverUrl = `${targetUrl}?client_id=${clientId}&response_type=${code}&redirect_uri=${redirectUri}&state=${state}`

      const popup = window.open(naverUrl)
      if (isNull(popup)) {
        if (!isOsApp() && viewType() === 'iosweb') {
          // safari 팝업차단 안내 팝업을 띄운다.
        }
      }
    },
    /**
     * 카카오 간편로그인 사이트 팝업 호출
     *
     * @param {object} param 팝업호출 param Data
     * @returns
     */
    popupKakao (param) {
      const state = param.state
      const code = 'code'
      const redirectUri = `${location.origin}/customer/login/simple/kakao`
      const targetUrl = LOGIN_CONST.SIMPLE_LOGIN.KAKAO.URL
      const clientId = LOGIN_CONST.SIMPLE_LOGIN.KAKAO.CLIENT_ID

      const kakaoUrl = `${targetUrl}?client_id=${clientId}&response_type=${code}&redirect_uri=${redirectUri}&state=${state}`

      const popup = window.open(kakaoUrl)
      if (isNull(popup)) {
        if (!isOsApp() && viewType() === 'iosweb') {
          // safari 팝업차단 안내 팝업을 띄운다.
        }
      }
    },
    /**
     * 본인인증 팝업 호출
     *
     * @param {object} authorizeParam 본인인증팝업호출을 위한 param data
     */
    showCertificationWindow (authorizeParam) {
      // const currentViewType = viewType()

      // 요청 Url
      let url = ''

      if (isNull(authorizeParam.target)) {
        authorizeParam.target = 'certification'
      }

      // 요청 파라미터
      const parameters = objectToQueryString(authorizeParam)

      // 인증타입에 따라 요청 Url 분기처리
      if (authorizeParam.certType === 1) { // 휴대폰 인증
        url = `${CONST.API_HOST}/nsmall/mobile/kmc/kmcis_mob_pop.jsp?${parameters}`
      } else if (authorizeParam.certType === 2) { // 아이핀 인증
        url = `${CONST.API_HOST}/nsmall/mobile/nice/ipincert_mob_pop.jsp?${parameters}&nocache=${getUUID()}`
      }

      const paramInfo = {}
      paramInfo.openUrl = url
      paramInfo.succFunc = authorizeParam.successFunc
      paramInfo.failFunc = authorizeParam.failFunc

      const targetUrl = `${url}&MOB_PASS=WEB&MOB_VIEW_TYPE=${viewType()}`
      const popup = window.open(targetUrl)

      if (isNull(popup)) {
        if (!isOsApp() && viewType() === 'iosweb') {
          // safari 팝업차단 안내 팝업을 띄운다.
        }
      }
    },
    /**
     * 본인인증/성인인증 후처리 Callback
     *
     * @param {object} data 인증정보 JSON
     * @returns {boolean|void}
     */
    certSuccess (data) {
      try {
        // Native에서 넘어오는 String 파라미터는 json으로 파싱
        data = serializeToObject(data)

        if (data.birth && data.birth.length >= 8) {
          data.age = (new Date()).getFullYear() - Number(data.birth.substring(0, 4)) + 1
        }
        if (data.type === 'kmc') {
          data.gender = (data.gender === '0' ? 'M' : 'F')
        } else if (data.type === 'ipin') {
          data.gender = (data.gender === '1' ? 'M' : 'F')
        }

        // return 데이터 json 생성
        const returnParam = {
          AUTH_RESULT_STATUS: data.enc_data,
          AUTH_VNO: data.type,
          LASTNAME: data.name,
          DI: data.DI,
          CI: data.CI,
          GENDER: data.gender,
          BIRTHDAY: data.birth,
          AGE: data.age,
          PHONE1: insertSeparatorPhoneNumber(data.certUseHp, '-'),
          CUSTOM_NUMBER: ''
        }

        if (!getAgeInFull(returnParam.BIRTHDAY, true)) {
          let strViewalerMsg = ''
          if (isNull(this.chkMsg)) {
            strViewalerMsg = 'CODE:1214000_01'
          } else {
            strViewalerMsg = this.chkMsg
          }

          messageUtil.alert(strViewalerMsg, function () {
            this.gotoReturnPage(this.isPopup, {}, this.partNumber)
          })
          return
        }

        /*
         * 로그인여부에 따라 스토리지의 값을 변경 또는 추가한다.
         */
        const loginChecked = loginUtil.isLoggedIn()
        const adultAuthYN = isNull(data.age) > 19 ? 'N' : 'Y'

        if (loginChecked) {
          loginUtil.setUserInfo('adultAuthYN', adultAuthYN)
          loginUtil.setUserInfo('birthday', data.birth)
          loginUtil.setUserInfo('gender', data.gender)
          loginUtil.setUserInfo('userName', data.name)
          loginUtil.setUserInfo('hpNo', insertSeparatorPhoneNumber(data.certUseHp, '-'))
        } else {
          const memberInfo = {}
          memberInfo.adultAuthYN = adultAuthYN
          memberInfo.birthday = data.birth
          memberInfo.gender = data.gender
          memberInfo.userName = data.name
          memberInfo.hpNo = insertSeparatorPhoneNumber(data.certUseHp, '-')

          loginUtil.login(memberInfo)
        }

        if (this.isAdultDiv) {
          // return 데이터 json 생성
          const returnParamAdult = {
            modeFlag: 'auth', // 동작플래그(필수)  예) auth 인증및등록
            mobileYn: 'Y', // 모바일여부(모바일은 필수)  예) Y모바일 (pc는 안줘도됨)
            userId: loginUtil.getUserInfo('userId'), // long타입 고객번호  (pc는 안줘도됨)
            NmChkName: data.name, // 인증후 넘어오는 이름값  (pc는 인증완료후 자동셋팅됨)
            NmChkBirthData: data.birth, // 인증후 넘어오는 생년월일 (pc는 인증완료후 자동셋팅됨)
            NmChkGender: data.gender,
            custNum: loginUtil.custNum(), // 고객번호
            ipinYn: this.currentTab === 1 ? 'N' : 'Y', // 아이핀 인증 여부  아이핀 인증 : 'Y', 핸드폰 인증 : 'N'
            strCipherDateTime: getTimeStamp(true)
          }

          const adultCheckCallback = result => {
            const data = result.msg
            const processMsg = data.processMsg // 코드값  S,F1,F2,F3    S성공, F1 19세미만, F2 인증정보불일치, F3 서버통신에러
            const sucessMsg = data.sucessMsg // 메세지  코드값관련 메세지(팝업내용)
            const adultAuthYN = data.adultAuthYN // 인증여부  Y인증함  N미인증

            if (processMsg === MEMBER_CONST.AUTH_RESULT.PROCESS_MSG.SUCCESS) {
              messageUtil.alert(sucessMsg, () => {
                loginUtil.setUserInfo('adultAuthYN', adultAuthYN) // opt.AdultAuthYN
                this.gotoReturnPage(this.isPopup, returnParam, this.partNumber)
              })
            } else if (processMsg === MEMBER_CONST.AUTH_RESULT.PROCESS_MSG.AGE19_ROW) {
              messageUtil.alert(sucessMsg, () => {
                this.gotoReturnPage(this.isPopup, returnParam, this.partNumber)
              })
            } else if (processMsg === MEMBER_CONST.AUTH_RESULT.PROCESS_MSG.AUTH_DATA_FALE) {
              messageUtil.alert(sucessMsg, () => {
                return false
              })
            } else {
              messageUtil.alert(sucessMsg, () => {
                this.gotoReturnPage(this.isPopup, returnParam, this.partNumber)
              })
            }
          }
          const errorHandling = () => {
            messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON)
          }

          this.$nsaxios.post('NSAdultAuthCmd', returnParamAdult, adultCheckCallback, errorHandling)

          return false
        }

        if (loginUtil.getUserInfo('loginType') === MEMBER_CONST.LOGIN_TYPE.NORMAL) { // 정회원 처리
          let rootResultMsg = null

          // 1차 : 고객정보변경에 대한 확인 여부
          data.modeFlag = 'C'

          this.registAuthMobileCmd(data, resultData1 => {
            rootResultMsg = resultData1.msg.root.RegusAuthMsg

            if (rootResultMsg.processMsg === MEMBER_CONST.ROOT_RESULT_MSG.PROCESS_MSG.MODE_A) { // 2차 확인 필요
              messageUtil.confirm(rootResultMsg.sucessMsg,
                () => {
                  // 2차 : 확인여부없이 넘어감
                  data.modeFlag = 'P'

                  this.registAuthMobileCmd(data, resultData2 => {
                    rootResultMsg = resultData2.msg.root.SetRegusAuthMsg

                    if (!isNull(rootResultMsg.birthday)) {
                      loginUtil.setUserInfo('birthday', rootResultMsg.birthday)
                      loginUtil.setUserInfo('isAdult', this.checkAdult(rootResultMsg.birthday))
                      loginUtil.setUserInfo('userName', data.name)
                      loginUtil.setUserInfo('userId', loginUtil.userId())
                      loginUtil.setUserInfo('hpNo', data.certUseHp)
                    }

                    let strViewalerMsg = ''
                    if (isNull(rootResultMsg.sucessMsg)) {
                      strViewalerMsg += 'CODE:1214000_02'
                    } else {
                      strViewalerMsg += rootResultMsg.sucessMsg
                    }

                    // 최종 완료
                    messageUtil.alert(strViewalerMsg, () => {
                      returnParam.CUSTOM_NUMBER = loginUtil.custNum()

                      // 부모창에 data를 전달하고 창을 닫는다.
                      this.gotoReturnPage(this.isPopup, returnParam, this.partNumber)
                    })
                  })
                },
                () => {
                  // 본인인증 창을 닫는다.
                  this.gotoReturnPage(this.isPopup, returnParam, this.partNumber)
                },
                '확인',
                '취소'
              )
            } else if (rootResultMsg.processMsg === MEMBER_CONST.ROOT_RESULT_MSG.PROCESS_MSG.MODE_P) {
              // 2차 : 확인여부없이 넘어감
              data.modeFlag = 'P'

              this.registAuthMobileCmd(data, resultData2 => {
                rootResultMsg = resultData2.msg.root.SetRegusAuthMsg

                if (!isNull(rootResultMsg.birthday)) {
                  loginUtil.setUserInfo('birthday', rootResultMsg.birthday)
                  loginUtil.setUserInfo('isAdult', this.checkAdult(rootResultMsg.birthday))
                  loginUtil.setUserInfo('userName', data.name)
                  loginUtil.setUserInfo('userId', loginUtil.userId())
                  loginUtil.setUserInfo('hpNo', data.certUseHp)
                }

                let strViewalerMsg = ''
                if (rootResultMsg.processMsg === MEMBER_CONST.ROOT_RESULT_MSG.PROCESS_MSG.MODE_P) {
                  strViewalerMsg += '인증이 완료 되었습니다.'
                } else {
                  if (isNull(rootResultMsg.sucessMsg)) {
                    strViewalerMsg += 'CODE:1214000_12'
                  } else {
                    strViewalerMsg += rootResultMsg.sucessMsg
                  }
                }

                // 최종 완료
                messageUtil.alert(strViewalerMsg, () => {
                  returnParam.CUSTOM_NUMBER = loginUtil.custNum()

                  // 부모창에 data를 전달하고 창을 닫는다.
                  this.gotoReturnPage(this.isPopup, returnParam, this.partNumber)
                })
              })
            } else {
              let strViewalerMsg = ''
              if (!isNull(rootResultMsg.processMsg) && rootResultMsg.processMsg === MEMBER_CONST.ROOT_RESULT_MSG.PROCESS_MSG.MODE_E3) {
                strViewalerMsg += rootResultMsg.sucessMsg

                let strShowId = ''
                if (isNull(rootResultMsg.rtnLogId)) {
                  // 별도 동작 없음
                } else {
                  const tmpUserLogId = rootResultMsg.rtnLogId
                  let tmpUserLogIdA = ''
                  let tmpUserLogIdB = ''
                  const wordLoaction = tmpUserLogId.indexOf('@')

                  if (wordLoaction > -1) {
                    tmpUserLogIdA = tmpUserLogId.substring(0, wordLoaction)
                    tmpUserLogIdB = tmpUserLogId.substring(wordLoaction)
                  } else {
                    tmpUserLogIdA = tmpUserLogId
                  }

                  const tmpUserLogIdALeng = tmpUserLogIdA.length - 3
                  let aLeng = ''

                  if (tmpUserLogIdALeng > 0) {
                    for (let li = 0; li < tmpUserLogIdALeng; li++) {
                      aLeng = `${aLeng}*`
                    }

                    tmpUserLogIdA = tmpUserLogIdA.substring(0, 3) + aLeng
                  }

                  strShowId = tmpUserLogIdA + tmpUserLogIdB
                }

                strViewalerMsg = `고객님께서는 ${strShowId} 아이디로 본인인증을 하신 기록이 있습니다. 아이디 및 비밀번호 찾기를 통해 로그인 하신 후, 주문을 진행해 주시기 바랍니다.`

                messageUtil.confirm(strViewalerMsg,
                  () => {
                    if (isOsApp()) { // APP
                      this.$router.push({ name: 'checkId', params: { backflag: 'home' } })
                    } else {
                      if (!this.isPopup) {
                        this.$router.push({ name: 'checkId' })
                      } else {
                        this.gotoReturnPage(this.isPopup, { paramsType: 'link', linkParam: { name: 'checkId' } })
                      }
                    }
                  },
                  () => {
                    if (isOsApp()) { // APP
                      this.$router.push({ name: 'findUserId', params: { backflag: 'home' } })
                    } else {
                      if (!this.isPopup) {
                        this.$router.push({ name: 'findUserId' })
                      } else {
                        this.gotoReturnPage(this.isPopup, { paramsType: 'link', linkParam: { name: 'findUserId' } })
                      }
                    }
                  },
                  '비밀번호 찾기',
                  '아이디찾기'
                )

                return
              } else {
                if (!isNull(rootResultMsg.sucessMsg)) {
                  strViewalerMsg += rootResultMsg.sucessMsg
                }
              }

              if (strViewalerMsg === '') {
                strViewalerMsg += 'CODE:1214000_03'
              }

              messageUtil.alert(strViewalerMsg, () => {
                // 본인인증 창을 닫는다.
                // 부모창에 data를 전달하고 창을 닫는다.
                this.gotoReturnPage(this.isPopup, {})
              })
            }
          })
        } else { // 간편회원 첫주문인 경우 or 비회원
          data = {
            CommandType: 'custNum', // 간편로그인 회원 첫 주문일 경우 snsMember로 세팅
            UserId: (loginUtil.userId() || ''),
            custNum: (loginUtil.custNum() || ''),
            USER_NAME: data.name,
            BIRTHDAY: data.birth,
            SEX: data.gender,
            CI: data.CI,
            DI: data.DI
          }

          this.getCustNum(data, data => {
            if (data && data.msg && data.msg.result === 'success') {
              returnParam.CUSTOM_NUMBER = data.msg.custNum
              this.gotoReturnPage(this.isPopup, returnParam, this.partNumber)
            } else {
              messageUtil.alert(`동일 인증 정보를 사용 중인 회원 계정이 존재합니다.<br />${data.msg.resultMessage || ''}`, () => {
                this.gotoReturnPage(this.isPopup, returnParam)
              })
            }
          })
        }
      } catch (e) {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON, () => {
          // 부모창에 data를 전달하고 창을 닫는다.
          this.gotoReturnPage(this.isPopup, {})
        })
      }
    },
    /**
     * 본인인증 확인
     *
     * @param {object} param 본인인증 사용자데이터
     * @param {object} callback 데이터처리 후 callback함수
     */
    registAuthMobileCmd (param, callback) {
      const objParam = {}
      objParam.userId = loginUtil.userId() // userId
      objParam.ipinYn = this.currentTab === 1 ? 'N' : 'Y' // 아이핀 인증 여부 ; 아이핀 인증 : 'Y', 핸드폰 인증 : 'N'
      objParam.modeFlag = param.modeFlag // 확인/처리여부 ; 처리여부 : 'C', 처리 : 'P'
      objParam.NmChkName = param.name // 이름
      objParam.NmChkGender = param.gender // 성별 ; 남 : 'M', 여 : 'F'
      objParam.NmChkBirthData = param.birth // 생년월일 : YYYYMMDD
      objParam.NmChkUseHp = param.certUseHp // 핸드폰 번호
      objParam.IpinChkCoInfo = param.CI // CI
      objParam.IpinChkDupInfo = param.DI // DI
      objParam.custNum = loginUtil.custNum() // 고객번호
      objParam.strCipherDateTime = getTimeStamp(true) // 인증 확인 시간 ; YYYYMMDDhhmmss

      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON)
      }

      this.$nsaxios.post('NSRegistAuthMobileCmdReal', objParam, callback, errorHandling)
    },
    /**
     * 성인여부 판단.
     *
     * @param {String} birthday 생년월일
     * @returns {String}
     */
    checkAdult (birthday) {
      if (isNull(birthday)) {
        return 'N'
      }

      birthday = String(birthday).replace(/-/gi, '')

      const current = getDateParse02(`${birthday}000000`)
      const adult = 19 * 12 // 성년 나이
      let adultDt = calcDate('', 0, -adult, 0, 0, 'yyyyMMdd')
      adultDt = getDateParse02(`${adultDt}000000`)
      const interval = adultDt.getTime() - current.getTime()

      if (interval < 0) {
        return 'N'
      }
      return 'Y'
    },
    /**
     * 비회원의 CustNum을 구한다.
     *
     * @param {object} param 비회원정보데이터
     * @param {object} callback 프로세스처리 후 호출할 callback 함수
     */
    getCustNum (param, callback) {
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON)
      }

      this.$nsaxios.post('NSOrderNonMemberCmd', { sandInfo: JSON.stringify(param) }, callback, errorHandling)
    },
    /**
     * 팝업 or page 리턴처리
     *
     * @param {boolean} isPopup 팝업여부
     * @param {object} returnParams 이동할 페이지정보
     * @param {string} partNumber 상품번호(상품상세이동시)
     */
    gotoReturnPage (isPopup = false, returnParams = null, partNumber = null) {
      if (isPopup) {
        this.$store.commit('popup/hide', returnParams)
      } else {
        const referer = this.$route.meta.refer

        if (referer === 'productDetail' && !isNull(returnParams)) {
          bizUtil.gotoProductDetail(partNumber)
        } else {
          routerUtil.back()
        }
      }
    },
    /**
     * 페이스북 간편로그인
     *
     * @returns {boolean}
     */
    async popupFacebook () {
      if (isOsApp() || location.protocol === 'https:') {
        await this.initFacebookInfo()
      }

      if (!isNull(this.productData)) {
        if (isNull(this.productData.isOnlyUser, false) && isNull(this.productData.cartType, '') === '30') {
          messageUtil.alert('페이스북 로그인으로 주문이 불가한 상품입니다.', () => {
            this.gotoReturnPage(false, {})
          })
        }
      }
      this.mobilewebFBlogin() // WEB
    },
    /**
     * 페이스북 로그인(모바일 웹)
     **/
    mobilewebFBlogin () {
      if (location.protocol !== 'http:') {
        window.FB.login(response => {
          console.log('response >> ', response)
          if (response.authResponse) {
            const apiUrl = `https://graph.facebook.com/${response.authResponse.userID}?fields=id,name,email,gender,birthday&access_token=${response.authResponse.accessToken}`

            this.$nsaxios.get(apiUrl, {}, res => {
              console.log('res >> ', res)
              const data = isNull(res.data, '{}')
              // 정보를 가져오고 로그아웃 시킴
              window.FB.logout()

              // 사용자 이메일 정보가 있을 경우
              if (isNull(data.email)) {
                messageUtil.alert('페이스북 정보를 가지고 올 수 없습니다.\n페이스북 설정에서 기본 이메일을 입력해 주세요.')
              } else {
                // 마케팅 스크립트 적용 부분
                // 페이스북(SNS 계정) 페이지 뷰 강제 로깅
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
                //
                const fbEmail = isNull(data.email, '')
                const fbName = isNull(data.name, '')
                const fbGender = isNull(data.gender, '')
                const fbBirthday = isNull(data.birthday, '')
                // 사용자 정보가 존재하는 경우
                const params = {
                  email: fbEmail,
                  name: fbName,
                  gender: fbGender,
                  birthday: fbBirthday,
                  logonType: 'simple'
                }
                this.simpleMemberJoinCheck(params)
              }
            }, null)
          } else {
            messageUtil.alert('facebook 로그인에 실패하였습니다.')
          }
        }, { scope: 'email', return_scopes: true })
      }
    },
    /**
    * 페이스북 로그인. 기존에 가입된 아이디가 있는지 체크
    *
    * @param {object} params 페이스북연동을 위한 데이터정보
    **/
    simpleMemberJoinCheck (params) {
      this.$nsaxios.post('ForSNSIdCheckMobile', { logonId: params.email }, data => {
        console.log('facebook data >> ', data)
        const joinYn = data.msg.root.snsregistcheck.isEmpty
        const logonId = data.msg.root.snsregistcheck.logonid
        const logonPassword = '1qazxsw2'

        const fbParams = {
          logonId,
          logonPassword,
          logonType: 'simple',
          entFlag: 'FACEBOOK',
          entUserId: logonId,
          entEmail: params.email,
          isSSORequest: true,
          entName: params.name,
          gender: params.gender,
          birthday: params.birthday,
          saveYn: 'N',
          autoYn: 'N'
        }

        if (joinYn === 'Y') {
          if (!isNull(this.productData) && !isNull(this.redirectName)) {
            fbParams.productData = this.productData
            if (this.redirectName.name === 'orderConsultSheet') {
              fbParams.redirectName = 'orderConsultSheet'
            } else if (!isNull(this.productData.invoke)) {
              fbParams.redirectName = 'orderSheet'
            } else {
              fbParams.redirectName = this.returnRoute
            }
          }
          this.sendLogin(fbParams)
        } else {
          // 기존회원 연동 프로세스
          fbParams.name = params.name
          fbParams.Email = params.email
          fbParams.access_token = null
          const moveJoinParams = {
            name: 'facebookJoin',
            params: fbParams
          }

          if (!isNull(this.productData) && !isNull(this.redirectName)) {
            fbParams.params.productData = this.productData
            if (this.redirectName.name === 'orderConsultSheet') {
              fbParams.params.redirectName = 'orderConsultSheet'
            } else {
              fbParams.params.redirectName = 'orderSheet'
            }
          }

          this.$router.push(moveJoinParams)
        }
      })
    },
    /**
     * 휴면회원해제전 이름확인 API
     *
     * @param {string} logonId 사용자logonId
     * @param {object} callback 프로세스처리 후 호출할 callback함수
     */
    getRecoverMember (logonId, callback) {
      const invoke = {
        logonId
      }

      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON)
      }

      this.$nsaxios.post('NSRecoverMemberAjax', invoke, callback, errorHandling)
    },
    /**
     * 휴면회원해제 처리
     *
     * @param {boolean} isNameCkecked 이름확인결과값
     * @param {object} loginParam 로그인을위한파라메터
     * @returns {void|boolean}
     */
    recoverMemberLogin (isNameCkecked = false, loginParam) {
      if (!isNameCkecked) {
        loginParam.isChangeLastName = 'N'

        this.sendBecomeLogin(loginParam)
      } else {
        const params = {
          certType: 1,
          MOB_RET_URL: `${location.origin}/customer/rest/phone-auth-return`
        }

        let url = ''

        if (isNull(params.target)) {
          params.target = 'certification'
        }

        // 요청 파라미터
        const parameters = objectToQueryString(params)

        url = `${CONST.API_HOST}/nsmall/mobile/kmc/kmcis_mob_pop.jsp?${parameters}`

        const targetUrl = `${url}&MOB_PASS=WEB&MOB_VIEW_TYPE=${viewType()}`
        const popup = window.open(targetUrl)

        if (isNull(popup)) {
          if (!isOsApp() && viewType() === 'iosweb') {
            // safari 팝업차단 안내 팝업을 띄운다.
          }
        }
      }
    },
    /**
     * 휴면회원해제 본인인증 결과처리
     * @param {object} data 휴면회원데이터
     * @returns {void}
     */
    recoverCertSuccess (data) {
      try {
        data = serializeToObject(data)

        if (data.birth && data.birth.length >= 8) {
          data.age = (new Date()).getFullYear() - Number(data.birth.substring(0, 4)) + 1
        }

        data.gender = (data.gender === '0' ? 'M' : 'F')

        const loginParam = this.invoke

        if (!isNull(loginParam)) {
          loginParam.isChangeLastName = 'Y'
          loginParam.phone1 = insertSeparatorPhoneNumber(data.certUseHp, '-')
          loginParam.lastName = data.name

          this.sendBecomeLogin(loginParam)
        } else {
          messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON)
        }
      } catch (e) {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON)
      }
    },
    /**
     * 이용약관 조회
     *
     * @returns {object}
     */
    async getTermsOfUseData () {
      const response = await this.$nsaxios.post('MallUserGuideContentReal', {})
      return this.setTermsOfUseData(response)
    },
    /**
     * 이용약관 데이터 갱신
     * @param {object} response 이용약관 API 반환값
     * @returns {object}
     */
    setTermsOfUseData (response) {
      const commonResultPath = response.msg.root
      const returnData = {
        mallUserGuide: '',
        mobileGuide: ''
      }

      returnData.mallUserGuide = htmlDecode(commonResultPath.MallUserGuide)
      returnData.mobileGuide = htmlDecode(commonResultPath.MobileAgree)
      return returnData
    },
    /**
     * native 로그인 성공 후 route 이동
     * @param {data} 로그인 Param데이터
     * @returns {void}
     */
    goReturnRoute (data) {
      // 로그인 후 이동할 라우트명
      let returnRoute = {}
      const loginRedirectPath = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH)
      // alert(loginRedirectPath)
      localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.SIMPLE_LOGIN_PATH)
      if (!isNull(loginRedirectPath)) {
        if (isEmpty(window.returnRoute)) {
          returnRoute = { path: loginRedirectPath }
        } else {
          console.log('ysjoo>>returnRoute', window.returnRoute)
          returnRoute = window.returnRoute
        }
      } else if (!isEmpty(this.getReturnRoute)) {
        returnRoute = this.getReturnRoute
      } else if (data.redirectName) {
        // 간편로그인인경우 entFlag가 존재하면 redirect Name값은 data param에서 가져온다.
        if (data.redirectname !== 'orderSheet' && data.redirectname !== 'orderConsultSheet') {
          if (isNull(data.redirectName.name)) {
            returnRoute = data.redirectName
          } else if (!isNull(data.redirectName.name) && data.redirectName.name !== 'storeHome') {
            returnRoute = data.redirectName
          } else {
            returnRoute = null
          }
        } else {
          returnRoute = null
        }
      }
      // alert(data.redirectName)
      // 비회원 주문서 내에서 로그인을 해야 하는경우 사용
      if (this.fromOrderSheetIsNoMemberOrder) {
        this.$store.commit('orderSheet/setFromOrderSheetIsNoMemberOrder', false)
        this.noMemberOrder()
      } else if (!isNull(loginRedirectPath) && loginRedirectPath.indexOf('/customer/push') > -1) {
        nativeUtil.openPushHistoryWindow()
      } else if (!isNull(loginRedirectPath) && loginRedirectPath.indexOf('shopping-alarm-register') > -1) {
        nativeUtil.closeWebView()
      } else if (!isEmpty(returnRoute)) {
        if (data.productData && data.redirectName === 'orderSheet') {
          // 상품상세에서 회원주문시 사용
          const invoke = data.productData.invoke
          const apiUrl = this.$route.meta.refer === 'cartList' ? 'AjaxNSOrderSheet4Worklight' : 'AjaxNSOrderPayNow4Worklight'
          this.$nsaxios.post(apiUrl, invoke, res => {
            const orderId = res.orderId
            if (orderId) {
              // 주문서정보 페이지로 이동
              bizUtil.gotoOrdersheet({
                orderId,
                invoke: data.productData.invoke // inputData를 같이 담아 넘긴다.
              })
            } else {
              messageUtil.alert(`바로 주문하기를 처리하지 못했습니다.${MESSAGES.UNEXPECTED_ERROR}`, () => {
                routerUtil.back()
              })
            }
          })
        } else if (data.productData && data.redirectName === 'orderConsultSheet') {
          const invoke = data.productData.invoke
          bizUtil.gotoOrderConsult(invoke)
        } else if (this.getSearchProductAdultStat) { // 2020 1203 add:bjw - 검색결과 페이지에서 비로그인 상태로 성인 상품에 진입한 경우.
          this.$router.replace(returnRoute).then(() => {
            //  returnRoute 초기화
            this.$store.commit('login/resetReturnRoute')
          })
        } else {
          // 비회원 주문서 내에서 로그인을 해야 하는경우 사용
          if (this.fromOrderSheetIsNoMemberOrder) {
            this.$store.commit('orderSheet/setFromOrderSheetIsNoMemberOrder', false)
            this.noMemberOrder()
          } else if (returnRoute.name === 'naShoppingAlarmRegister') {
            // 방송알림인경우 웹뷰 닫음
            nativeUtil.closeWebView()
          } else {
            this.$router.replace(returnRoute).then(() => {
              //  returnRoute 초기화
              console.log('ys>>>>> loginRedirectPath', loginRedirectPath)
              console.log('ys>>>>> returnRoute.path', returnRoute.path)
              this.$store.commit('login/resetReturnRoute')
              localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH)
            })
          }
        }
      } else {
        nativeUtil.closeWebView()
      }
    }
  }
}

export default customerInputMixin
