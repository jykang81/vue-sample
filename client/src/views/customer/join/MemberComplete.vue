<template>
  <div class="member_complete">
    <div class="msg_box">
      <i class="icons_complete" />
      <p class="subject">
        환영합니다!
        <strong>{{ userName }}님 ({{ userEMail }})</strong>
        회원가입이 완료되었습니다!
      </p>
      <div class="summary">
        <p>
          마케팅 정보의 선택 정보 입력 및 수신 동의하시면
          쿠폰 혜택 및 다양한 이벤트 정보를 알려드립니다.
        </p>
        <p>
          선택 정보에 동의하지 않더라도 주문/배송 정보는
          수신 동의와 관계없이 발송됩니다.
        </p>
      </div>
    </div>
    <div class="btn_group">
      <button
        type="button"
        class="btn_other_info"
        @click="setMarketing"
      >
        <span>선택정보 입력</span>
      </button>
      <button
        type="button"
        class="btn_go_home"
        @click="goHome"
      >
        <span>홈으로 가기</span>
      </button>
    </div>
  </div>
</template>

<script>
import nativeUtil from '@frameworks/nativeUtil'
import {
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import COMM_CONST from '@constants/framework/constants'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import loginUtil from '@utils/loginUtil'

export default {
  name: 'MemberComplete',
  data () {
    return {
      userName: '',
      userEMail: '',
      userPhone: '',
      userPass: '',
      userId: '',
      affilEntCd: '',
      entEmail: '',
      entFlag: '',
      entUserId: '',
      refresh_token: '',
      entName: '',
      snsLinkCtnt: '',
      custNum: '',
      isKeepAlive: false
    }
  },
  activated () {
    this.isKeepAlive = true
    this.init()
  },
  created () {
    this.isKeepAlive = false
    this.init()
  },
  methods: {
    /**
     * 초기 load설정
     */
    init () {
      this.custNum = loginUtil.getUserInfo('custNum')
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

      // 이전 페이지가 회원가입페이지가 아닌경우에만 마케팅스크립트 실행
      const referer = this.$route.meta.refer
      if (!this.isKeepAlive && (referer === 'memberJoin' || referer === 'simple')) {
        // 마케팅 스크립트 적용 부분
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
        // Airbridge
        marketingUtil.airbridgeLogger.send({
          event: marketingUtil.airbridgeLogger.EVENT.SIGN_UP, // 회원가입
          data: {
            action: '일반회원',
            label: '회원가입'
          }
        })
        // Recobell
        marketingUtil.recobellLogger.send({
          data: {
            category: marketingUtil.CATEGORY_ADD_LOGIN,
            action: this.userId,
            memberInfo: {
              userId: this.userId,
              userName: this.userName,
              userEmail: this.userEMail,
              userPhone: this.userPhone
            }
          }
        })
        // AIQUA
        marketingUtil.aiquaLogger.send({
          type: marketingUtil.aiquaLogger.USER_PROFILE,
          data: {
            userId: this.custNum,
            name: '', // this.userName,
            email: '', // this.userEMail,
            phoneNumber: '', // this.userPhone,
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
      }
    },
    /**
     * 마케팅정보수신 설정페이지로 이동변수처리
     *
     * @param
     * @returns
     */
    setMarketing () {
      const param = {
        name: 'memberAgreeMarketing',
        params: {
          userName: this.userName,
          userEMail: this.userEMail,
          userPhone: this.userPhone,
          userPass: this.userPass,
          userId: this.userId,
          affilEntCd: this.affilEntCd,
          entEmail: this.entEmail,
          entFlag: this.entFlag,
          entUserId: this.entUserId,
          refresh_token: this.refresh_token,
          entName: this.entName,
          snsLinkCtnt: this.snsLinkCtnt
        }
      }
      this.$router.push(param)
    },
    /**
     * 홈으로가기 처리
     */
    goHome () {
      if (isOsApp()) { // APP
        nativeUtil.goHome()
      } else { // WEB
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/join/MemberComplete";
</style>
