<template>
  <div class="id_find_certification">
    <div class="msg_box">
      <strong class="subject">
        {{ subject }} 찾는 방법을 선택해주세요.
      </strong>
      <p class="msg">
        개인정보 보호를 위해 본인확인이 필요합니다.
      </p>
    </div>
    <a
      class="btn_phone_auth"
      @click="pageMove('authPhone')"
    >
      <span>휴대폰 인증으로 찾기</span>
    </a>
    <a
      class="btn_email_auth"
      @click="pageMove('authEmail')"
    >
      <span>이메일 인증으로 찾기</span>
    </a>
  </div>
</template>
<script>
import {
  isNull
} from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'IdFindCertification',
  data () {
    return {
      viewType: '',
      logonId: '',
      subject: ''
    }
  },
  created () {
    this.viewType = this.$route.meta.pageKey

    this.onLoad()
  },
  activated () {
    this.viewType = this.$route.meta.pageKey

    this.onLoad()
  },
  methods: {
    /**
     * 초기 설정값 세팅
     *
     */
    onLoad () {
      /** 점유인증모듈 타입에 따른 타이틀 설정 */
      if (this.viewType === 'PASS') {
        this.subject = '비밀번호'
      } else {
        this.subject = '아이디'
      }

      if (this.viewType === 'PASS') {
        if (!isNull(this.$route.params.logonId)) {
          this.logonId = this.$route.params.logonId
        }
      }
    },
    /**
     * Page이동함수
     *
     * @param {string} pathName 호출할 router link name
     * @returns {void}
     */
    pageMove (pathName) {
      // 마케팅 스크립트 적용 부분
      // GA 360
      if (this.viewType === 'PASS') {
        if (pathName === 'authPhone') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_비밀번호찾기',
              eventAction: '인증방법',
              eventLabel: '휴대폰인증',
              params: {
                t1: null
              }
            }
          })
        } else if (pathName === 'authEmail') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_비밀번호찾기',
              eventAction: '인증방법',
              eventLabel: '이메일인증',
              params: {
                t1: null
              }
            }
          })
        }
      } else {
        if (pathName === 'authPhone') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_아이디찾기',
              eventAction: '인증방법',
              eventLabel: '휴대폰인증',
              params: {
                t1: null
              }
            }
          })
        } else if (pathName === 'authEmail') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_아이디찾기',
              eventAction: '인증방법',
              eventLabel: '이메일인증',
              params: {
                t1: null
              }
            }
          })
        }
      }

      let targetPathNmae = ''

      if (this.viewType === 'PASS') {
        if (pathName === 'authPhone') {
          targetPathNmae = 'authPassPhone'
        } else if (pathName === 'authEmail') {
          targetPathNmae = 'authPassEmail'
        }
      } else {
        targetPathNmae = pathName
      }

      const goingInvok = {
        name: targetPathNmae,
        params: {
          viewType: this.viewType,
          logonId: this.logonId
        }
      }

      this.$router.push(goingInvok)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/IdFindCertification";
</style>
