<template>
  <div class="cooperative_companies">
    <div class="partner_wrap">
      <p class="partner_info">
        &#60;그 외 협력사&#62; 위탁업무내용 - 상품배송, 주문상담, CS처리, 교환·환불 업무
      </p>
      <table summary="개인정보 처리를 위탁한 협력사 업체명">
        <caption>개인정보 처리 위탁 협력사 업체명</caption>
        <colgroup>
          <col width="100%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              협력사
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(cooperativeCompany, index) in displayCompanies">
            <tr :key="index">
              <td>
                {{ htmlDecode(cooperativeCompany.VNDRNM) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import cooperativeCompaniesService from '@services/common/footer/siteinfo/cooperativeCompaniesService'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import uiUtil from '@utils/uiUtil'

export default {
  data () {
    return {
      cooperativeCompanies: [], // 전체 협력사 목록
      displayCompanies: [], // 화면에 표시되는 협력사 목록
      infiniteScrollParams: {
        callback: this.showMoreCompany,
        triggerHeightPercent: 80
      }
    }
  },
  async mounted () {
    await this.init()
    this.showMoreCompany()
    uiUtil.bindInfiniteScroll(this, this.infiniteScrollParams)
  },
  methods: {
    htmlDecode,
    /**
     * 협력사 목록 반환
     * @returns {Promise}
     */
    async getCooperativeCompanies () {
      return await cooperativeCompaniesService.fetchCooperativeCompanies()
    },
    /**
     * 협력사 목록 할당
     */
    setCooperativeCompanies (response) {
      this.cooperativeCompanies = response.msg.root.jsonArrCnsgnmntBizPrtnr
    },
    async init () {
      const response = await this.getCooperativeCompanies()
      this.setCooperativeCompanies(response)
    },
    /**
     * 더 표시할 회사 존재 여부
     * @returns {Boolean}
     */
    hasOthereCompanyToShow () {
      return this.displayCompanies.length < this.cooperativeCompanies.length
    },
    /**
     * 회사 더표시하기
     */
    showMoreCompany () {
      if (!this.hasOthereCompanyToShow()) {
        this.infiniteScrollParams.isEnable = false
        return
      }

      const COMPANY_ADDITION_COUNT = 100

      const currentOffset = this.displayCompanies.length
      const nextOffset = currentOffset + COMPANY_ADDITION_COUNT

      this.displayCompanies = [...this.displayCompanies, ...this.cooperativeCompanies.slice(currentOffset, nextOffset)]
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/common/footer/siteinfo/CooperativeCompanies";
</style>
