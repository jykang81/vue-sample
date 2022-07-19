import COMM_CONST from '@constants/framework/constants'
import nsaxios from '@frameworks/axiosUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'
import cipherUtil from '@frameworks/cipherUtil'
import bizUtil from '@utils/bizUtil'
import {
  isNull,
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'
import router from '@/router'
import nativeUtil from '@/common/frameworks/nativeUtil'
import NATIVE_CONST from '@constants/framework/native'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

/**
 * 사용자 인증 모듈 (로그인 여부, 사용자정보, etc...)
 */
const loginUtil = {
  memberInfo: null,
  /**
   * 고객 NS Mall ID
   * @returns {string}
   */
  userId: () => loginUtil.getUserInfo('userId'),
  /**
   * 로그인형태
   * @returns {String}
   */
  logonType: () => loginUtil.getUserInfo('logonType'),
  /**
   * 고객명
   * @returns {String}
   */
  userName: () => loginUtil.getUserInfo('userName'),
  /**
   * 고객번호
   * @returns {String}
   */
  custNum: () => loginUtil.getUserInfo('custNum'),
  /**
   * 고객 NS Mall Login ID
   * @returns {String}
   */
  logonId: () => loginUtil.getUserInfo('logonId'),
  /**
   * 고객 E-Mail
   * @returns {String}
   */
  email: () => loginUtil.getUserInfo('email'),
  /**
   * 고객 휴대폰번호
   * @returns {String}
   */
  hpNo: () => loginUtil.getUserInfo('hpNo'),
  /**
   * 고객 생년월일
   * @returns {String}
   */
  birthday: () => loginUtil.getUserInfo('birthday'),
  /**
   * 고객 인증여부
   * @returns {String}
   */
  isAdult: () => loginUtil.getUserInfo('isAdult') || 'N',
  /**
   * 고객 성인여부
   * @returns {String}
   */
  adultAuthYN: () => loginUtil.getUserInfo('adultAuthYN'),
  /**
   * 고객 tcode
   * @returns {String}
   */
  tcode: () => loginUtil.getUserInfo('tcode'),
  /**
   * 고객 연락처
   * @returns {String}
   */
  telNo: () => loginUtil.getUserInfo('telNo'),
  /**
   * 고객 VIP여부
   * @returns {String}
   */
  isVip: () => loginUtil.getUserInfo('isVip') === '' ? 'N' : 'Y',
  /**
   * 고객 세션ID
   * @returns {String}
   */
  sessionId: () => loginUtil.getUserInfo('sessionId'),
  /**
   * 간편로그인사용자 대표로그인사이트 Flag
   * @returns {String}
   */
  entFlag: () => loginUtil.getUserInfo('entFlag'),
  /**
   * 로그인 여부 체크
   * @returns {Boolean}
   */
  isLoggedIn () {
    this.synchronizeMemberInfo()

    if (!isNull(this.memberInfo)) {
      if (!isNull(this.memberInfo.loginyn) && this.memberInfo.loginyn === 'Y') {
        return true
      }
    }

    return false
  },
  /**
   * 로그인 처리
   * @param {Object} memberInfo 고객 로그인 정보
   */
  login (memberInfo) {
    const isAutoLoginCheck = memberInfo.isAutoLoginCheck === true
    if (memberInfo.isAutoLoginCheck) { // 자동 로그인 사용
      localStorageUtil.set('memberInfo', memberInfo)
    }
    localStorage.setItem('isAutoLoginCheck', isAutoLoginCheck)
    sessionStorageUtil.set('memberInfo', memberInfo)
    this.memberInfo = memberInfo

    if (isOsApp()) { // APP
      localStorageUtil.set('memberInfo', memberInfo)
      const autoLoginYn = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN)
      // Native에 멤버정보전달
      let nativeCustNum = ''
      let nativeAdultAuthYN = 'N'
      if (!isNull(memberInfo.nativeCustNum)) {
        nativeCustNum = memberInfo.nativeCustNum
      } else if (!isNull(memberInfo.custNum)) {
        nativeCustNum = memberInfo.custNum
      }
      if (!isNull(memberInfo.nativeAdultAuthYN)) {
        nativeAdultAuthYN = memberInfo.nativeAdultAuthYN
      } else if (!isNull(memberInfo.adultAuthYN)) {
        nativeAdultAuthYN = memberInfo.adultAuthYN
      }
      const userInfo = {
        logonId: memberInfo.logonId,
        userId: memberInfo.userId,
        userName: memberInfo.userName,
        entFlag: isNull(memberInfo.entFlag) ? '' : memberInfo.entFlag,
        entEmail: memberInfo.entEmail,
        entUserId: isNull(memberInfo.entUserId) ? '' : memberInfo.entUserId,
        birthday: memberInfo.birthday,
        gender: memberInfo.gender,
        isAutoLoginCheck: autoLoginYn === 'Y',
        registration: memberInfo.registration,
        staffInfo: memberInfo.staffInfo,
        staffBnft: memberInfo.staffBnft,
        lastOrder: memberInfo.lastOrder,
        loginyn: memberInfo.loginyn,
        userMargetingEmail: memberInfo.userMargetingEmail,
        userMargetingTM: memberInfo.userMargetingTM,
        userMarketingSMS: memberInfo.userMarketingSMS,
        gradeNm: memberInfo.gradeNm,
        custNum: nativeCustNum,
        adultAuthYN: nativeAdultAuthYN
      }
      nativeUtil.setLoginMemberInfo(JSON.stringify(userInfo))

      // 마케팅 스크립트
      // AIQUA User Profile
      // 간헐적으로 전송이 안되는 경우 때문에 추가한 부분
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_PROFILE,
        data: {
          userId: userInfo.custNum,
          name: '', // userInfo.userName,
          email: '', // userInfo.email,
          phoneNumber: '', // loginUtil.getUserInfo('telNo'),
          birthday: '', // loginUtil.getUserInfo('birthday'),
          gender: '', // loginUtil.getUserInfo('gender'),
          loginStatus: 'Y',
          devicePushAgree: '', // pushState,
          notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
          isEmployee: userInfo.staffBnft,
          level: userInfo.gradeNm,
          coCd: COMM_CONST.getCocd(),
          lastLogin: '' // qg_fileter_last_login 값
        }
      })

      // 자동 로그인 이면 ID, PW 쿠키 저장
      if (autoLoginYn === 'Y') {
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_ID, cipherUtil.encryptValue(memberInfo.logonId))
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_PW, cipherUtil.encryptValue(memberInfo.logonPassword))
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_FLAG, memberInfo.entFlag)
      }

      // 구글 스마트락에 사용자 정보 저장
      if (viewType() === 'android' && isNull(memberInfo.isCredential) && memberInfo.logonPassword !== 'N' && isNull(memberInfo.entFlag) && memberInfo.logonType === COMM_CONST.LOGON_TYPE.NORMAL) {
        if (isNull(memberInfo.fromLoginPage)) {
          nativeUtil.saveCredential(memberInfo.logonId, memberInfo.logonPassword)
        } else {
          nativeUtil.saveCredentialExcep(memberInfo.logonId, memberInfo.logonPassword)
        }
      } else if (viewType() === 'android' && isNull(memberInfo.isCredential) && !isNull(memberInfo.entFlag)) {
        nativeUtil.saveCredential(memberInfo.logonId, memberInfo.logonPassword)
      }
    }
  },
  /**
   * 로그아웃 처리
   * @param {Object} targetUrl 이동할 url정보
   * @returns {Promise}
   */
  logout (targetUrl) {
    return nsaxios.post('NSLogoutMoblieCmdReal', {
      userId: this.getUserInfo('userId'),
      sessionId: this.getUserInfo('sessionid')
    }).then(() => {
      sessionStorageUtil.del('memberInfo')
      localStorageUtil.del('memberInfo')
      localStorage.removeItem('isAutoLoginCheck')
      this.memberInfo = null

      // 마케팅 스크립트 적용 부분
      // Airbridge
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.SIGN_OUT, // 로그아웃
        data: {
          action: '로그아웃',
          label: '로그아웃'
        }
      })
      // AIQUA
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_PROFILE,
        data: {
          userId: '',
          name: '',
          email: '',
          phoneNumber: '',
          birthday: '',
          gender: '',
          loginStatus: 'N',
          devicePushAgree: '', // pushState
          lastLogin: '' // qg_fileter_last_login 값
        }
      })
      // AIQUA
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'logout'
        }
      })

      // 로그아웃 후 새로운 세션을 받아오기 위한 처리. 이 처리를 하지 않으면 다수의 새로운 세션이 동시에 생성되어 문제를 발생시킴
      return nsaxios.post('Dummy', {}).then(() => {
        if (!isOsApp()) {
          if (!isNull(targetUrl)) {
            nativeUtil.logOut('preventCloseWebView') // nativeUtil.logOut 브릿지 함수의 파라미터로 빈 값이 아닌 String을 넣어주면 Webview 닫히지 않는 걸로 App 팀에서 가이드 받음
            router.push(targetUrl)
            bizUtil.getCartCount()
          } else {
            window.location.reload()
            window.location.href = '/'
          }
        } else {
          if (!isNull(targetUrl) && targetUrl.name !== '/') {
            router.push(targetUrl)
            bizUtil.getCartCount()
          } else { // APP
            localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_ID) // 자동로그인ID 쿠키 삭제
            localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_PW) // 자동로그인PW 쿠키 삭제
            localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN) // 자동로그인여부 쿠키 삭제
            nativeUtil.logOut('')
          }
        }
      })
    })
  },
  /**
   * 사용자 정보 조회
   * @returns {(Object|null)} 로그인 시 고객정보. 비로그인 시 null
   */
  getMemberInfo () {
    const memberInfo = this.memberInfo
    return memberInfo || null
  },
  /**
   * 사용자 정보 가져오기
   * @param {String} name
   * @returns {String} 사용자 정보
   */
  getUserInfo: name => {
    if (!loginUtil.hasMemberInfo()) {
      return ''
    }

    loginUtil.synchronizeMemberInfo()

    const item = loginUtil.memberInfo[name]

    return item || ''
  },
  /**
   * 사용자 정보 등록
   * @param {String} name
   * @param {String} value
   */
  setUserInfo (name, value) {
    if (isNull(this.memberInfo)) {
      this.memberInfo = {}
    }

    this.memberInfo[name] = value
    sessionStorageUtil.set('memberInfo', this.memberInfo)
    if (isOsApp()) {
      localStorageUtil.set('memberInfo', this.memberInfo)
    } else {
      if (this.isAutoLoginUsed()) { // 자동 로그인 사용
        localStorageUtil.set('memberInfo', this.memberInfo)
      }
    }
  },
  /**
   * 쿠키 정보에 저장된 USER ID를 통해 로그인 여부를 체크한다.
   * @returns {Boolean} 로그인 여부
   */
  checkLogonStatus () {
    this.synchronizeMemberInfo()

    if (!this.memberInfo) {
      return false
    }

    // 비회원일 경우도 userId는 존재함. logonID로 판별해야함.
    if (isNull(this.memberInfo.userId) || isNull(this.memberInfo.logonId)) {
      return false
    }

    return true
  },
  /**
   * 비 회원 여부
   * @returns {Boolean} 비 회원 여부
   */
  isNonMember () {
    return this.getUserInfo('logonType') === COMM_CONST.LOGON_TYPE.NONMEMBER
  },
  /**
   * SNS 회원 여부
   * @returns {Boolean} SNS 회원 여부
   */
  isSnsMember () {
    return this.getUserInfo('logonType') === COMM_CONST.LOGON_TYPE.FACEBOOK ||
            this.getUserInfo('logonType') === COMM_CONST.LOGON_TYPE.TWITTER
  },
  /**
   * 고객정보 저장 여부 반환
   * @returns {Boolean}
   */
  hasMemberInfo () {
    let memberInfo = null
    if (isOsApp()) {
      memberInfo = localStorage.getItem('memberInfo')
    } else {
      if (this.isAutoLoginUsed()) { // 자동 로그인 사용
        memberInfo = localStorage.getItem('memberInfo')
      } else { // 자동 로그인 미사용
        memberInfo = sessionStorage.getItem('memberInfo')
      }
    }

    return memberInfo !== null
  },
  /**
   * 고객정보 동기화 (memory <-> storage)
   */
  synchronizeMemberInfo () {
    if (!this.hasMemberInfo()) {
      return
    }

    if (!this.memberInfo) { // 새로고침으로인한 메모리 초기화 대응
      if (isOsApp()) {
        this.memberInfo = localStorageUtil.get('memberInfo')
      } else {
        if (this.isAutoLoginUsed()) { // 자동 로그인 사용
          this.memberInfo = localStorageUtil.get('memberInfo')
        } else { // 자동 로그인 미사용
          this.memberInfo = sessionStorageUtil.get('memberInfo')
        }
      }
    }
  },
  /**
   * 자동 로그인 기능 사용여부
   * @returns {Boolean}
   */
  isAutoLoginUsed () {
    const isAutoLoginCheck = localStorage.getItem('isAutoLoginCheck')

    return isAutoLoginCheck === 'true'
  }
}

export default loginUtil
