<template>
  <div class="employee_verification_email">
    <div class="delivery_search_guide">
      <span>
        그룹사 임직원은 사내메일을 통해 인증하셔야 <br>임직원 아이디 사용이 가능합니다.
      </span>
    </div>
    <p class="gray_guide">
      이메일 주소를 입력하시면 사내 이메일과 NSmall 아이디를 <br>연동합니다. 연동유지기간은 6개월입니다.
    </p>
    <ns-input
      :params="idParams"
      @input="isProc($event)"
    />
    <div class="input_field">
      <label
        for="email_address"
        class="blind"
      >
        이메일 주소
      </label>
      <span class="input_group">
        <span class="select">
          <select
            id="email_address"
            v-model="groupDomainSelect"
          >
            <option
              v-for="(data, code) in companyGroupList"
              :key="code"
              :value="data.companyCd"
            >
              {{ data.text }}
            </option>
          </select>
        </span>
      </span>
    </div>
    <p class="btn_certification">
      <!-- 활성화시 disabled 제거 -->
      <button
        type="button"
        class="btn"
        :disabled="isDisabled"
        @click="getGroupDomainParam"
      >
        <span>인증메일 발송</span>
      </button>
    </p>
  </div>
</template>

<script>
import {
  isNull
} from '@utils/commonutil/commonUtil'
// import loginUtil from '@/common/utils/loginUtil'
// import CUST_CENTER_CONST from '@/common/constants/custcenter'
import MEMBER_CONST from '@/common/constants/customer/member'
// import messageUtil from '@frameworks/messageUtil'
import staffInfoMixin from '@/mixins/customer/staffInfoMixin'

import NsInput from '@components/common/NsInput'

export default {
  components: {
    NsInput
  },
  mixins: [
    staffInfoMixin
  ],
  data () {
    return {
      groupDomainSelect: '',
      isDisabled: true,
      idParams: {
        value: '',
        iconClass: 'email_address',
        title: MEMBER_CONST.MEMBER_TEXT.EMAILTITLE,
        placeholder: MEMBER_CONST.MEMBER_TEXT.EMP_MAILID_PLACEHOLDER,
        maxlength: 40,
        isLabel: false,
        labelKind: 'label_icon',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.EMAIL11
      },
      companyGroupList: []
    }
  },
  created () {
    this.getGroupDomain()
  },
  methods: {
    /**
     * 메일주소 값이 입력할경우 인증메일발송버튼 활성화
     *
     * @param {Event} e 이벤트객체
     * @returns {void}
     */
    isProc (e) {
      this.idParams.value = this.idParams.value.replace(/ /gi, '')
      const idVal = this.idParams.value

      if (!isNull(idVal)) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    /**
     * 임직원 인증메일 발송
     *
     * @param {Event} e 이벤트객체
     * @returns {void}
     */
    getGroupDomainParam (e) {
      const groupCompanyCd = this.groupDomainSelect
      const domainParams = {}

      domainParams.companyCd = groupCompanyCd
      this.companyGroupList.forEach((data, idx) => {
        if (groupCompanyCd === data.companyCd) {
          domainParams.domain = data.domain
        }
      })

      if (isNull(this.idParams.value)) {
        this.idParams.isError = true
        this.idParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL11
      } else {
        this.idParams.isError = false
        this.onclickBtnCallAuth(this.idParams, domainParams, e)
      }
    }
  }

}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/employee/EmployeeVerificationEmail";
</style>
