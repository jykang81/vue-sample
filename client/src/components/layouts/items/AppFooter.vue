<template>
  <footer class="app_footer">
    <div v-if="!isNative" class="policy_wrap">
      <a @click="openPCApp">
        PC버전
      </a>
      <a :id="marketLinkID">
        APP 설치
      </a>
    </div>
    <div class="corp_info">
      <p>(주)엔에스쇼핑 공동대표이사 도상철, 조항목</p>
      <address>경기도 성남시 분당구 판교로 228번길 15 판교세븐벤처밸리 1단지</address>
      <p>
        <span>사업자 등록번호 : 117-81-33642</span>
        <a
          v-if="!isNative"
          href="https://ftc.go.kr/info/bizinfo/communicationView.jsp?wrkr_no=1178133642&apv_perm_no=2010378019330200938"
          target="_blank"
          rel="noopener noreferrer"
          class="info_cfrm"
        >
          사업자 정보 확인
        </a>
        <a
          v-if="isNative"
          rel="noopener noreferrer"
          class="info_cfrm"
          @click="openWebBrowser('https://ftc.go.kr/info/bizinfo/communicationView.jsp?wrkr_no=1178133642&apv_perm_no=2010378019330200938')"
        >
          사업자 정보 확인
        </a>
      </p>
      <p>통신판매업 신고번호 : 제2010-경기성남-0938호</p>
      <p>
        <router-link
          :to="{ name: 'guarantee' }"
        >
          우리은행 채무지급보증 안내
        </router-link>
      </p>
      개인정보보호책임자 : 김기환 / 이메일 :
      <a
        href="mailto:secure@nsmall.com"
        class="send_email"
      >
        secure@nsmall.com
      </a>
      <div class="btn_wrap">
        <router-link to="/common/footer/site-info/terms-of-use">
          이용약관
        </router-link>
        <router-link to="/common/footer/site-info/privacy-policy">
          개인정보처리방침
        </router-link>
        <router-link to="/common/footer/site-info/youth-policy">
          청소년 보호정책
        </router-link>
      </div>
      <a
        href="tel:1800-0770"
        class="customer_call"
      >
        고객센터
        <strong>1800-0770 (유료)</strong>
      </a>
      <p class="copyright">
        © NS Shopping All Rights Reserved.
      </p>
    </div>
  </footer>
</template>
<script>
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'

export default {
  name: 'AppFooter',
  data () {
    return {
      marketLinkID: 'market-link',
      intervalID: null
    }
  },
  computed: {
    /**
     * 네이티브 환경 여부 반환
     * @returns {Boolean}
     */
    isNative () {
      return isOsApp()
    }
  },
  mounted () {
    this.bindAppMarketLink()
  },
  methods: {
    /**
     * PC 어플리케이션 열기
     */
    openPCApp () {
      window.open(`${location.origin}/gate.html?mtype=gotopc`)
    },
    /**
     * RL 웹브라우져 오픈
     */
    openWebBrowser (url) {
      if (isOsApp()) {
        nativeUtil.gotoWebBrowser(url)
      }
    },
    /**
     * 어플리케이션 마켓 이동 링크 설정
     * @param {String} elementID 요소 아이디
     */
    setAppMarketLink (elementID) {
      if (window.airbridge && window.airbridge.setDeeplinks) {
        window.airbridge.setDeeplinks({
          buttonID: elementID,
          deeplinks: {
            ios: 'nsmall://',
            android: 'nsmall://'
          },
          fallbacks: {
            ios: 'itunes-appstore',
            android: 'google-play'
          }
        })

        clearInterval(this.intervalID)
      }
    },
    /**
     * 어플리케이션 마켓 이동 링크 바인딩
     */
    bindAppMarketLink () {
      this.intervalID = setInterval(() => {
        this.setAppMarketLink(this.marketLinkID)
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/layouts/items/AppFooter";
</style>
