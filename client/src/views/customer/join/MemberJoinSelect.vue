<template>
  <div class="member_join_select">
    <p class="msg">
      NSmall에 오신 것을 환영합니다.<br>회원가입하시고 다양한 구매혜택 받으세요.
    </p>
    <router-link
      class="btn_join"
      :to="{ name : 'memberJoin' }"
      @click.native="memberJoinLogging"
    >
      <span>회원가입</span>
    </router-link>
    <div v-show="isSnsDiv" class="join_select_sns">
      <div class="title">
        <span>SNS 계정 회원가입</span>
      </div>
      <ul>
        <li>
          <a
            class="btn_sns naver"
            @click="simpleLogin('NAVER')"
          ><span>네이버 계정으로 회원가입</span></a>
        </li>
        <li>
          <a
            class="btn_sns kakao"
            @click="simpleLogin('KAKAO')"
          ><span>카카오 계정으로 회원가입</span></a>
        </li>
        <li>
          <a
            class="btn_sns payco"
            @click="simpleLogin('PAYCO')"
          ><span>페이코 계정으로 회원가입</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import loginUtil from '@/common/utils/loginUtil'
import LOGIN_CONST from '@/common/constants/customer/login'
import toastUtil from '@frameworks/toastUtil'
import bizUtil from '@utils/bizUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import {
  isOsApp,
  viewType,
  isNull,
  isEmpty
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import nativeUtil from '@frameworks/nativeUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import localStorageUtil from '@frameworks/localStorageUtil'
import NATIVE_CONST from '@constants/framework/native'

export default {
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      isSnsDiv: true
    }
  },
  created () {
    if (loginUtil.isLoggedIn()) {
      toastUtil.show(LOGIN_CONST.PAGE_MESSAGES.IS_LOGIN)
      bizUtil.gotoMain()
    }

    this.init()
  },
  mounted () {
    // 마케팅 스크립트 적용 부분
    // GA 360
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_EVENT,
      data: {
        eventCate: 'MOBILE_로그인',
        eventAction: '로그인부가메뉴',
        eventLabel: '회원가입',
        params: {
          t1: null // $router.meta.depth를 사용하는 경우
        }
      }
    })
    window.vm = this // 비로그인시 회원가입 클릭시 필요한 window객체
    if (isOsApp()) { // APP
      window.callbackNaverLogin = this.callbackNaverLogin // 네이버 login 콜백함수
      window.callbackNaverProfile = this.callbackNaverProfile // 네이버 login profile 콜백함수
      window.callbackKakaoLogin = this.callbackKakaoLogin // 카카오 login 콜백함수
      window.callbackKakaoProfile = this.callbackKakaoProfile // 카카오 login profile 콜백함수
      window.callbackPaycoLogin = this.callbackPaycoLogin // 페이코 login 콜백함수
      window.callbackPaycoProfile = this.callbackPaycoProfile // 페이코 login profile 콜백함수
      if (viewType() === 'ios') {
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.SIMPLE_LOGIN_PATH, '/customer/join')
      }
    }
  },
  methods: {
    /**
     * init function
     *
     */
    async init () {
      // SNS 간편 회원 로그인 영역 노출 여부 처리 (default 미 노출)
      await this.$nsaxios.post('NSSnsMemberDispAjax', { cmdType: 'getSnsMemberDisplayYn' }, data => {
        const snsMemberDispYn = data.msg.result.snsMemberDispYn // SNS 영역 노출 여부 처리
        if (!isNull(snsMemberDispYn) && snsMemberDispYn === 'N' && viewType() === 'ios') {
          // 미노출 노출
          this.isSnsDiv = false
        } else {
          this.isSnsDiv = true
        }
      })
    },
    /**
     * 회원가입 버튼 클릭
     */
    memberJoinLogging () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_회원가입',
          eventAction: '일반회원',
          eventLabel: '회원가입',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })
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
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/join/MemberJoinSelect";
</style>
