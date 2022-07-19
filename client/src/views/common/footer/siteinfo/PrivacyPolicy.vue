<template>
  <div class="privacy_policy">
    <!-- 개인정보처리방침 -->
    <div
      class="terms_frame"
      v-html="privateGuide"
    />

    <!-- 역대 처리방침 목록 -->
    <div class="enforcement_date">
      <p
        v-for="(agreement, index) in agreementList"
        :key="`${agreement.DISPLAYSTARTDD}-${index}`"
      >
        <a @click="handleAgreementClick(agreement.STARTDD)">
          <span>{{ agreement.DISPLAYSTARTDD }} 시행 {{ agreement.titleName }}</span>
        </a>
      </p>
    </div>

    <!-- 청소년 가이드 (미사용) -->
    <div
      v-show="youthGuide"
      class="terms_frame"
      v-html="youthGuide"
    />
  </div>
</template>

<script>
import {
  htmlDecode,
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'
import privacyPolicyService from '@services/common/footer/siteinfo/privacyPolicyService'
import uiUtil from '@utils/uiUtil'
import replaceAll from '@utils/commonutil/replaceAll'

export default {
  data () {
    return {
      privateGuide: '', // 개인정보 처리방침 template
      agreementList: [], //
      youthGuide: '' // 미사용
    }
  },
  async mounted () {
    window.handleViewCoperativeCompanyClick = this.handleViewCoperativeCompanyClick // 전역에 협력사보기 메소드 바인딩
    await this.createPrivacyPolicy()
  },
  methods: {
    /**
     * 개인정보처리방침 조회
     * @param {string} [enforcementDate] 시행일자
     */
    async getPrivacyPolicyData (enforcementDate) {
      const param = {}

      if (enforcementDate) {
        param.startdd = enforcementDate
      }

      return await privacyPolicyService.fetchPrivacyPolicy(param)
    },
    /**
     * 개인정보처리방침 데이터 갱신
     * @param {object} response 개인정보처리방침 API 반환값
     */
    setPrivacyPolicyData (response) {
      const commmonResultPath = response.msg.root

      // 개인정보처리방침 갱신
      if (isOsApp() && viewType() === 'android') { // APP
        this.privateGuide = replaceAll(htmlDecode(commmonResultPath.PerInfo), '_blank', '_self')
      } else {
        this.privateGuide = htmlDecode(commmonResultPath.PerInfo)
      }

      // 역대 개인정보처리방침 리스트 전처리
      const agreementList = commmonResultPath.AgreementsList
      agreementList.forEach(agreement => {
        agreement.DISPLAYSTARTDD < '2016-07-28'
          ? agreement.titleName = '개인정보취급방침'
          : agreement.titleName = '개인정보처리방침'
      })
      this.agreementList = agreementList

      // 청소년 가이드
      this.youthGuide = commmonResultPath.TeenAger
    },
    /**
     * 협력사 보기
     */
    handleViewCoperativeCompanyClick () {
      this.$router.push({ name: 'consignment' }) // 개인정보 처리 위탁 페이지로 이동
    },
    /**
     * 개인정보처리방침 html 생성
     * @param {string} [enforcementDate] 시행일자
     */
    async createPrivacyPolicy (enforcementDate) {
      const response = await this.getPrivacyPolicyData(enforcementDate)

      this.setPrivacyPolicyData(response)

      this.$nextTick(() => {
        this.replaceViewCoperativeCompany()
      })
    },
    /**
     * 협력사 보기 최신화
     */
    replaceViewCoperativeCompany () {
      const outdatedEl = document.querySelector('#viewCnsgnmntBizPrtnr')

      if (!outdatedEl) {
        return
      }

      outdatedEl.remove()

      const aHTML = `<a
        id="getCnsgnmntBizPrtnr"
        onclick="handleViewCoperativeCompanyClick()"
      </a>`
      const aEl = this.htmlToElement(aHTML)
      document.querySelector('#tdCnsgnmntBizPrtnr').append(aEl)

      const strongHTML = '<strong>&nbsp;(협력사 보기)</strong>'
      const strongEl = this.htmlToElement(strongHTML)
      aEl.appendChild(strongEl)
    },
    /**
     * string html -> element 객체 변환
     * @param {String} htmlString 단일 엘리먼트
     * @returns {Element}
     */
    htmlToElement (htmlString) {
      const template = document.createElement('template')

      const trimmedHtmlString = htmlString.trim() // Never return a text node of whitespace as the result
      template.innerHTML = trimmedHtmlString

      return template.content.firstChild
    },
    /**
     * 시행일자 클릭 후처리
     * @param {string} [enforcementDate] 시행일자
     */
    async handleAgreementClick (enforcementDate) {
      await this.createPrivacyPolicy(enforcementDate)

      uiUtil.scrollMove('app') // 스크롤 최상위
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/common/footer/siteinfo/PrivacyPolicy";
</style>
