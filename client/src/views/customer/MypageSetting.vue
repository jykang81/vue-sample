<template>
  <div class="mypage_setting">
    <div class="set_box">
      <!-- 비로그인 시 -->
      <template v-if="!isLogin && isInit">
        <a class="user_login" @click="bizUtil.gotoLogin()">
          <span>로그인 해주세요</span>
        </a>
      </template>
      <!-- //비로그인 시 -->

      <!-- 로그인 시 -->
      <template v-if="isLogin && isInit">
        <div class="user_logout">
          <strong class="user_id">{{ logonId }}</strong>
          <button
            type="button"
            class="btn_logout"
            @click="logout()"
          >
            <span>로그아웃</span>
          </button>
        </div>

        <template
          v-if="isSnsShow"
        >
          <div v-if="!isFaceBook">
            <strong class="title">SNS 로그인 관리</strong>
            <ul class="menu_list">
              <li>
                <div class="switches_area">
                  <div class="switches_tit_wrap">
                    <span>네이버 로그인</span>
                  </div>
                  <div class="check_switches">
                    <label>
                      <input
                        v-model="sns.naver"
                        type="checkbox"
                        title="네이버 로그인 체크"
                        disabled
                      >
                      <div
                        class="custom_switch"
                        @click="setSnsAccount('naver')"
                      >
                        <div class="rail">
                          <span class="switch_label switch_off">off</span>
                          <span class="switch_label switch_on">on</span>
                          <span class="handle" />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </li>
              <li>
                <div class="switches_area">
                  <div class="switches_tit_wrap">
                    <span>카카오 로그인</span>
                  </div>
                  <div class="check_switches">
                    <label>
                      <input
                        v-model="sns.kakao"
                        type="checkbox"
                        title="카카오 로그인 체크"
                        disabled
                      >
                      <div
                        class="custom_switch"
                        @click="setSnsAccount('kakao')"
                      >
                        <div class="rail">
                          <span class="switch_label switch_off">off</span>
                          <span class="switch_label switch_on">on</span>
                          <span class="handle" />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </li>
              <li>
                <div class="switches_area">
                  <div class="switches_title">
                    <span>페이코 로그인</span>
                  </div>
                  <div
                    class="check_switches"
                    @click="setSnsAccount('payco')"
                  >
                    <label>
                      <input
                        v-model="sns.payco"
                        type="checkbox"
                        title="페이코 로그인 체크"
                        disabled
                      >
                      <div class="custom_switch">
                        <div class="rail">
                          <span class="switch_label switch_off">off</span>
                          <span class="switch_label switch_on">on</span>
                          <span class="handle" />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="txt_list">
              <li>자주 사용하는 SNS 계정과 연결 설정을 하여 간편하게 로그인 하실 수 있습니다.</li>
              <li>SNS 연결 설정 시, 해당 SNS 계정 인증이 필요합니다.</li>
            </ul>
          </div>
        </template>
      </template>
      <!-- //로그인 시 -->
    </div>
    <!-- 광고성 정보 수신 -->
    <template v-if="isNative">
      <div
        class="switches_area"
        :class="isLogin === true ? 'margin' : 'border'"
      >
        <div class="switches_title">
          <span>광고성 정보(PUSH)수신</span>
        </div>
        <div
          class="check_switches"
          @click="setPushAgree()"
        >
          <label>
            <input
              v-model="isPushAgree"
              type="checkbox"
              title="광고성 정보(PUSH)수신"
              disabled
            >
            <div class="custom_switch">
              <div class="rail">
                <span class="switch_label switch_off">off</span>
                <span class="switch_label switch_on">on</span>
                <span class="handle" />
              </div>
            </div>
          </label>
        </div>
      </div>
      <p class="receive_info_text">
        해당 설정은 해당 기기에서만 유효하며, 수신 거부 시 유용한 쇼핑혜택 알림이 발송되지 않습니다.
      </p>
      <div class="version_box">
        <p class="now_version">
          현재버전 <span>{{ appVersion }}</span>
        </p>
        <div v-if="isAppUpdated" class="update_btn">
          <button
            type="button"
            @click="setAppUpdate()"
          >
            <span>업데이트</span>
          </button>
        </div>
        <p v-else class="latest_version">
          최신버전입니다.
        </p>
      </div>
    </template>
    <!-- //광고성 정보 수신 -->
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import COMM_CONST from '@constants/framework/constants'
import {
  isOsApp,
  isNull,
  viewType,
  isEmpty,
  gettingPushStateHandler
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'
// import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import LOGIN_CONST from '@constants/customer/login'
import cookieUtil from '@frameworks/cookieUtil'
import popupUtil from '@frameworks/popupUtil'
import CONST from '@constants/framework/framework'

export default {
  props: {
    entFlag: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLogin: false,
      isFaceBook: false,
      isSnsShow: false,
      logonId: '',
      sns: {
        naver: false,
        payco: false,
        kakao: false
      },
      failCnt: 0,
      isInit: false,
      isPushAgree: false,
      isNative: false,
      appVersion: '',
      isAppUpdated: true
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  created () {
    bizUtil.secessionMemberCheker().then(data => {
      if (data) {
        this.init()
      }
    })
  },
  mounted () {
    window.vm = this
    if (isOsApp() && !isNull(this.entFlag)) {
      if (this.entFlag.indexOf('NAVER') > -1) {
        this.simpleLogin('NAVER')
      } else if (this.entFlag.indexOf('KAKAO') > -1) {
        this.simpleLogin('KAKAO')
      } else if (this.entFlag.indexOf('PAYCO') > -1) {
        this.simpleLogin('PAYCO')
      } else if (this.entFlag.indexOf('FACEBOOK') > -1) {
        this.simpleLogin('FACEBOOK')
      } else if (this.entFlag.indexOf('APPLE') > -1) {
        this.appleLogin()
      }
    }
  },
  methods: {
    isOsApp,
    /**
     * 탈퇴여부 체크
     */
    init () {
      if (isOsApp()) { // APP
        window.callbackNaverLogin = this.callbackNaverLogin // 네이버 login 콜백함수
        window.callbackNaverProfile = this.callbackNaverProfile // 네이버 login profile 콜백함수
        window.callbackKakaoLogin = this.callbackKakaoLogin // 카카오 login 콜백함수
        window.callbackKakaoProfile = this.callbackKakaoProfile // 카카오 login profile 콜백함수
        window.callbackPaycoLogin = this.callbackPaycoLogin // 페이코 login 콜백함수
        window.callbackPaycoProfile = this.callbackPaycoProfile // 페이코 login profile 콜백함수
        window.nativeSimpleLoginLink = this.nativeSimpleLoginLink // 간편로그인 링크를 위한 Native 호출
        window.settingClose = this.settingClose // 웹뷰 닫기

        // Natvie 여부
        this.isNative = true
        // 푸시동의여부
        this.getPushAgreeYn()
        // 앱버전
        this.getAppVersion()
      }

      this.isInit = true
      this.isLogin = loginUtil.isLoggedIn()

      if (isOsApp()) {
        this.checkSnsDisp()
      } else {
        this.isSnsShow = true
      }

      if (this.isLogin) {
        this.getUserInfo()
      }
    },
    /**
     * 유저 정보를 가져오는 함수
     */
    getUserInfo () {
      const param = {
        processFlag: 'List'
      }

      if (loginUtil.getUserInfo('logonType') === 'simple') {
        this.logonId = loginUtil.email()
        this.isFaceBook = true
      } else {
        const successHandling = data => {
          const entInfo = data.msg.root.entInfoList
          this.logonId = data.msg.root.PersonalInfo.logonId

          if (entInfo.length > 0) {
            for (let i = 0; i < entInfo.length; i++) {
              if (entInfo[i].entFlag === 'NAVER') {
                this.sns.naver = true
              }

              if (entInfo[i].entFlag === 'PAYCO') {
                this.sns.payco = true
              }

              if (entInfo[i].entFlag === 'KAKAO') {
                this.sns.kakao = true
              }
            }
          }
        }

        this.$nsaxios.post('MobilePersonalInfoManageCmdReal', param, successHandling)
      }
    },

    /**
     * 로그아웃 처리 함수
     */
    logout () {
      const okCallback = async () => {
        if (isOsApp()) { // APP
          loginUtil.logout().then(() => {
            if (viewType() === 'android') {
              nativeUtil.showToast('로그아웃 되었습니다.')
              nativeUtil.stopCredential() // 사용자 정보 요청 중단
            }
            nativeUtil.goHome()
          })
        } else { // WEB
          await loginUtil.logout('/')
          this.$store.commit('shoppingHistory/setIcon')
          toastUtil.show('로그아웃 되었습니다.')
        }

        // // 마케팅 스크립트 적용 부분
        // // Airbridge
        // marketingUtil.airbridgeLogger.send({
        //   event: marketingUtil.airbridgeLogger.EVENT.SIGN_OUT, // 로그아웃
        //   data: {
        //     action: '로그아웃',
        //     label: '로그아웃'
        //   }
        // })
        // // AIQUA
        // marketingUtil.aiquaLogger.send({
        //   type: marketingUtil.aiquaLogger.USER_PROFILE,
        //   data: {
        //     userId: '',
        //     name: '',
        //     email: '',
        //     phoneNumber: '',
        //     birthday: '',
        //     gender: '',
        //     loginStatus: 'N',
        //     devicePushAgree: '' // pushState
        //   }
        // })
        // // AIQUA
        // marketingUtil.aiquaLogger.send({
        //   type: marketingUtil.aiquaLogger.USER_EVENT,
        //   data: {
        //     event: 'logout'
        //   }
        // })
      }

      const cancelCallback = () => false
      if (isOsApp()) { // APP
        const callbackLogout = jsonString => {
          console.log('ysjoo>>jsonString>>>>', jsonString)
          if (jsonString.indexOf('Y') > -1) {
            loginUtil.logout().then(() => {
              if (viewType() === 'android') {
                nativeUtil.showToast('로그아웃 되었습니다.')
                nativeUtil.stopCredential() // 사용자 정보 요청 중단
              }
              nativeUtil.goHome()
            })
          }
        }
        window.callbackLogout = callbackLogout // 로그아웃 콜백
        const params = {
          msg: '로그아웃 하시겠습니까?',
          ok: '네',
          cancel: '아니오'
        }
        nativeUtil.showAlert(JSON.stringify(params), 'callbackLogout')
      } else {
        // 디자인 요구사항: 네 / 아니오 위치 변경
        // 요구사항 반영을 위해 ok <-> cancel 순서를 스위칭함
        messageUtil.confirm('로그아웃 하시겠습니까?', cancelCallback, okCallback, '아니오', '네')
      }
    },
    /**
     * SNS 현재 연결 상태에 따라 연동 및 해제 분기
     * @param {string} SNS 타입 문자열
     */
    setSnsAccount (type) {
      this.snsPswMmt().then(data => {
        let isSnsRegisteredPwd = true

        if (!isNull(data.msg)) {
          if (!isNull(data.msg.root.isSuccess)) {
            const isRegisteredPwd = data.msg.root.isRegisteredPwd
            if (isRegisteredPwd === 'N') {
              isSnsRegisteredPwd = false
            }
          }
        }

        if (this.sns[type]) {
          if (!isSnsRegisteredPwd) {
            if (isOsApp()) {
              const callbackFunc = jsonString => {
                if (jsonString.indexOf('Y') > -1) {
                  this.$router.push({ name: 'memberModifyIntro' })
                }
              }
              window.callbackFunc = callbackFunc // 콜백
              const params = {
                msg: 'SNS 로그인 연결을 해제하시려면 비밀번호를 먼저 등록해 주세요. 비밀번호 등록을 하시겠습니까?',
                ok: '확인',
                cancel: '아니오'
              }
              nativeUtil.showAlert(JSON.stringify(params), 'callbackFunc')
            } else {
              messageUtil.confirm(`SNS 로그인 연결을 해제하시려면 비밀번호를 먼저 등록해 주세요.
              비밀번호 등록을 하시겠습니까?`,
              () => {
                this.$router.push({ name: 'memberModifyIntro' })
              }, null, '확인', '취소')
            }
          } else {
            this.unlinkSnsConfirm(type)
          }
        } else if (!this.sns[type]) {
          if (!isSnsRegisteredPwd) {
            messageUtil.confirm(`SNS 로그인 연결하시려면 비밀번호를 먼저 등록해 주세요.
            비밀번호 등록을 하시겠습니까?`,
            () => {
              this.$router.push({ name: 'memberModifyIntro' })
            }, null, '확인', '취소')
          } else {
            this.simpleLogin(type.toUpperCase())
          }
        }
      })
    },
    /**
     * SNS계정여부확인
     *
     * @returns {Promise<boolean>}
     */
    async snsPswMmt () {
      const invoke = {
        cmdType: 1,
        request_userId: loginUtil.getUserInfo('userId'),
        entUserId: loginUtil.getUserInfo('entUserId'),
        entFlag: loginUtil.getUserInfo('entFlag')
      }

      return await this.$nsaxios.post('NSMobileSnsPswMgmt', invoke)
    },

    /**
     * SNS 해제 컨펌
     * @param {string} SNS 타입 문자열
     */
    unlinkSnsConfirm (type) {
      let typeKoStr = ''

      if (type === 'naver') {
        typeKoStr = '네이버'
      } else if (type === 'kakao') {
        typeKoStr = '카카오'
      } else if (type === 'payco') {
        typeKoStr = '페이코'
      }

      const okCallback = () => {
        this.unlinkSns(type)
      }

      const cancelCallback = () => false
      if (isOsApp()) {
        const callbackFunc = jsonString => {
          if (jsonString.indexOf('Y') > -1) {
            this.unlinkSns(type)
          }
        }
        window.callbackFunc = callbackFunc // 콜백
        const params = {
          msg: `${typeKoStr} 로그인 설정을 해제하시겠습니까?`,
          ok: '확인',
          cancel: '아니오'
        }
        nativeUtil.showAlert(JSON.stringify(params), 'callbackFunc')
      } else {
        messageUtil.confirm(`${typeKoStr} 로그인 설정을 해제하시겠습니까?`, okCallback, cancelCallback)
      }
    },

    /**
     * SNS 해제
     * @param {string} SNS 타입 문자열
     */
    unlinkSns (type) {
      const param = {
        processFlag: 'Unlink',
        userId: loginUtil.userId(),
        accptPath: COMM_CONST.getAcceptPath(),
        entFlag: type.toUpperCase()
      }

      const successHandling = data => {
        if (data.msg.root.successYn === 'Y') {
          this.sns[type] = false
        } else if (data.msg.root.successYn !== 'Y') {
          if (isOsApp()) { // APP 이면
            nativeUtil.showToast('연동 해제 시 에러가 발생하였습니다.')
          } else {
            toastUtil.show('연동 해제 시 에러가 발생하였습니다.')
          }
        }
        this.failCnt = 0
      }
      const errorHandling = () => {
        if (this.failCnt > 3) {
          this.unlinkSns(type)
        } else {
          this.failCnt = 0
          if (isOsApp()) { // APP 이면
            nativeUtil.showToast('SNS해제 시 통신에러가 발생하였습니다.')
          } else {
            toastUtil.show('SNS해제 시 통신에러가 발생하였습니다.')
          }
        }
      }

      this.$nsaxios.post('MobilePersonalInfoManageCmdReal', param, successHandling, errorHandling)
    },

    /**
     * SNS 로그인 노출 여부 체크
     */
    checkSnsDisp () {
      const successHandling = data => {
        const snsMemberDispYn = data.msg.result.snsMemberDispYn

        if (snsMemberDispYn === 'Y') {
          this.isSnsShow = true
        } else {
          this.isSnsShow = false
        }
        // if (!isNull(snsMemberDispYn) && snsMemberDispYn === 'N' && viewType() === 'ios') {
        //   // 미노출 노출
        //   this.isSnsDiv = false
        // } else {
        //   this.isSnsDiv = true
        // }
      }

      this.$nsaxios.post('NSSnsMemberDispAjax', { cmdType: 'getSnsMemberDisplayYn' }, successHandling)
    },
    /**
     * 간편로그인 팝업호출
     *
     * @param {string} name SNS이름
     */
    simpleLogin (name) {
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

      if (name === 'PAYCO') {
        if (isOsApp()) { // APP
          nativeUtil.doPaycoLogin('login', 'callbackPaycoLogin', '')
        } else {
          this.popupPayco(popupParam)
        }
      } else if (name === 'NAVER') {
        if (isOsApp() && viewType() === 'android') { // APP
          nativeUtil.doNaverLogin('login', 'callbackNaverLogin', '')
        } else {
          this.popupNaver(popupParam)
        }
      } else if (name === 'KAKAO') {
        if (isOsApp()) { // APP
          nativeUtil.doKakaoLogin('login', 'callbackKakaoLogin', '')
        } else {
          this.popupKakao(popupParam)
        }
      } else if (name === 'APPLE') {
        if (isOsApp()) { // APP
          nativeUtil.doAppleLogin('login', 'callbackAppleLogin')
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
          // TODO - safari 팝업차단 안내 팝업을 띄운다.
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
          // TODO - safari 팝업차단 안내 팝업을 띄운다.
        }
      }
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

      this.$nsaxios.post(hpUrl, data, successHandler, failureHandler)
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
        if (isOsApp()) {
          nativeUtil.showToast('SNS 연동시 에러가 발생하였습니다.')
        } else {
          toastUtil.show('SNS 연동시 에러가 발생하였습니다.')
        }
        return false
      }

      if (isNull(snsType)) {
        snsType = callbackData.entFlag
      }

      if (isNull(snsType) || (isNull(callbackData.root.refresh_token) && isNull(callbackData.root.id))) {
        if (isOsApp()) {
          nativeUtil.showToast('필수 연동정보가 누락되었습니다.')
        } else {
          toastUtil.show('필수 연동정보가 누락되었습니다.')
        }
        return false
      }

      console.log('callbackData2 >> ', callbackData)
      if (isNull(callbackData.root) && snsType === 'KAKAO') {
        if (isOsApp()) {
          nativeUtil.showToast('카카오 연동을 취소하셨습니다.')
        } else {
          toastUtil.show('카카오 연동을 취소하셨습니다.')
        }
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

        const params = {
          logonId: nsLogonId,
          Email: email,
          entUserId: id,
          access_token: accessToken,
          name,
          entFlag: snsType,
          nsLogonId,
          snsLinkCtnt
        }

        // 로그인처리
        if (linkYN === 'N') {
          const popupParam = {
            title: '비밀번호 확인',
            titleAlign: 'center',
            isShowSearch: false,
            isShowCart: false
          }
          popupUtil.show('customer/simple/NsLogin', popupParam, async data => {
            console.log('data >> ', data)
            if (!isNull(data) && data.isNsLoginData) {
              params.logonId = data.logonId
              params.logonPassword = data.logonPassword
              params.fromPage = 'mypageSetting'

              const joinParams = {
                name: 'simpleLogin',
                params
              }
              await loginUtil.logout(joinParams)
            } else {
              return false
            }
          })
        } else {
          // 다른ID와 이미 연동됨
          let typeKoStr = ''

          if (snsType === 'NAVER') {
            typeKoStr = '네이버'
          } else if (snsType === 'KAKAO') {
            typeKoStr = '카카오'
          } else if (snsType === 'PAYCO') {
            typeKoStr = '페이코'
          }
          if (isOsApp()) {
            const params = {
              msg: `해당 ${typeKoStr} 계정으로 이미 NSmall 아이디와 연결되어 있습니다.`,
              ok: '확인'
            }
            nativeUtil.showAlert(JSON.stringify(params), '')
          } else {
            messageUtil.alert(`해당 ${typeKoStr} 계정으로 이미 NSmall 아이디와 연결되어 있습니다.`)
          }
          return false
        }
      }
      const failureHandler = () => {
        if (isOsApp()) {
          const params = {
            msg: '통신 오류가 발생하였습니다.',
            ok: '확인'
          }
          nativeUtil.showAlert(JSON.stringify(params), '')
        } else {
          messageUtil.error('통신 오류가 발생하였습니다.', null)
        }
      }

      this.$nsaxios.post('NsMobileMemberSignupCmd', invoke, successHandler, failureHandler)
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
        return false
      } else if (jsonObj.cancel === 'true') {
        return false
      } else {
        if (viewType() === 'android') {
          this.accessToken = jsonObj.accessToken
          this.expiresAt = jsonObj.expiresAt
          if (!isNull(jsonObj.refreshToken)) {
            this.refreshToken = jsonObj.refreshToken
            const accessToken = [{ accessToken: this.accessToken }]
            nativeUtil.doPaycoLogin('userProfile', 'callbackPaycoProfile', JSON.stringify(accessToken))
          }
        } else {
          this.refreshToken = jsonObj.refreshToken
          const paycoId = !isEmpty(jsonObj.email) ? jsonObj.email : (!isEmpty(jsonObj.mobile) ? jsonObj.mobile : jsonObj.paycoId)
          const invoke = {
            refresh_token: this.refreshToken,
            email: paycoId,
            name: jsonObj.name,
            id: paycoId,
            paycoId: jsonObj.paycoId
          }
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
      } else if (jsonObj.cancel === 'true') {
        return false
      } else {
        if (!isNull(jsonObj.accessToken)) {
          this.accessToken = jsonObj.accessToken
          this.refreshToken = jsonObj.refreshToken
          if (viewType() === 'android') {
            const accessToken = [{ accessToken: this.accessToken }]
            nativeUtil.doKakaoLogin('userProfile', 'callbackKakaoProfile', JSON.stringify(accessToken))
          } else {
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
    },
    /**
     * 설정창 닫기
     * @returns {void}
     */
    settingClose () {
      nativeUtil.closeWebView()
    },
    /**
     * 푸시동의 여부
     */
    getPushAgreeYn () {
      const callbackPushAgreeYn = jsonString => {
        console.log('jsonString', jsonString)
        const data = JSON.parse(jsonString.replaceAll('\\', ''))
        const { pushState = 'N' } = data
        if (pushState === 'Y') {
          this.isPushAgree = true
        } else {
          this.isPushAgree = false
        }
      }
      const handlerOptions = {
        callback: callbackPushAgreeYn,
        name: 'settingInithandler'
      }
      gettingPushStateHandler(handlerOptions)
    },
    /**
     * 앱버전 구하기
     */
    getAppVersion () {
      const callbackAppVersion = jsonString => {
        console.log('ysjoo>>jsonString>>>', jsonString)
        const data = JSON.parse(jsonString.replaceAll('\\', ''))
        if (data.isAppUpdated === 'true') {
          this.appVersion = data.serverVersion
          this.isAppUpdated = true
        } else {
          this.appVersion = data.appVersion
          this.isAppUpdated = false
        }
      }
      window.callbackAppVersion = callbackAppVersion // 푸시 수신동의 콜백함수
      nativeUtil.getAppVersion('callbackAppVersion')
    },
    /**
     * 앱업데이트 하기
     */
    setAppUpdate () {
      nativeUtil.setAppUpdate()
    },
    /**
     * 광고성 정보(PUSH)수신 동의
     * @returns {void}
     */
    setPushAgree () {
      const callbackPushAgree = jsonString => {
        console.log(jsonString)
        const data = JSON.parse(jsonString.replaceAll('\\', ''))
        const currentDate = new Date()
        const returnDateString =
    `${this.leadingZeros(currentDate.getFullYear(), 4)}-${
    this.leadingZeros(currentDate.getMonth() + 1, 2)}-${
    this.leadingZeros(currentDate.getDate(), 2)}`
        if (data.result === 'true') {
          this.isPushAgree = true
          toastUtil.show(`[NSMall] 광고성 정보알림이 수신동의로 변경되었습니다.(${returnDateString})`)
        } else {
          this.isPushAgree = false
          toastUtil.show(`[NSMall] 광고성 정보알림이 수신거부로 변경되었습니다.(${returnDateString})`)
        }
      }
      window.callbackPushAgree = callbackPushAgree // 푸시 수신동의 콜백함수

      let param = {}
      if (this.isPushAgree) {
        param = { isPushAgree: 'false' }
      } else {
        param = { isPushAgree: 'true' }
      }
      nativeUtil.setPushAgree(JSON.stringify(param), 'callbackPushAgree')
    },
    /**
     * @description 입력받은 숫자(n)를 자릿수(digits)에 맞게 '0'으로 LeftPadding 처리 한 문자열을 반환
     * e.g. dateUtil.leadingZeros(5, 2)
     *
     * @param {*} n (필수) 숫자의 본연의 값
     * @param {*} digits (필수) 제작할 자릿수
     * @returns {String} `e.g. "05"`
     */
    leadingZeros (n, digits) {
      var zero = ''
      n = n.toString()

      if (n.length < digits) {
        for (let i = 0; i < digits - n.length; i++) {
          zero += '0'
        }
      }
      return zero + n
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/MypageSetting";
</style>
