<template>
  <div class="order_no_member_certify">
    <!-- 성인인증 일 때 -->
    <p
      v-if="isAdultDiv"
      class="adult_certify"
    >
      이 정보내용은 청소년 유해매체물로서 <strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong> 및 <strong>청소년 보호법</strong>에 따라 19세 미만의 청소년이 이용할 수 없습니다.
    </p>
    <!-- // 성인인증 일 때 -->
    <div
      v-if="!isAdultDiv"
      class="order_no_member_certify_head"
    >
      <p>
        NSmall에 회원으로 가입하시면<br> 다양하고 풍성한
        혜택을 제공받으실 수 있습니다.<br>
        고객님께서 원하시는 인증방법을 선택해주세요.
      </p>
    </div>
    <div class="order_no_member_certify_contents">
      <button
        type="button"
        class="btn_certify_phone"
        @click="setCurrentTab(1)"
      >
        <span>본인 휴대폰 인증</span>
      </button>
      <button
        type="button"
        class="btn_certify_ipin"
        @click="setCurrentTab(2)"
      >
        <span>아이핀(i-PIN) 인증</span>
      </button>
      <dl class="guide">
        <dt>본인 휴대폰 인증이란?</dt>
        <dd>
          고객님 명의의 휴대폰을 통해 본인임을 확인합니다.<br>
          본인인증 버튼을 클릭하여 인증 절차를 진행해주세요.
        </dd>
        <dt>본인인증 안내</dt>
        <dd>
          본인인증을 위해 입력하신 개인정보는 본인인증기관에서 수집하는 정보이며, 이때 수집된 정보는 본인인증 외 어떠한 용도로도 이용되거나 별도 저장되지 않습니다.<br>
          정보통신망 이용촉진 및 정보보호 등의 관한 법률 제 23조 2. “주민등록번호의 사용 제한”에 따라 NSmall은 고객님의 주민등록번호를 수집, 이용하지 않습니다.
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import {
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
export default {
  name: 'OrderNoMemberCertify',
  mixins: [
    customerInputMixin
  ],
  props: {
    param: {
      type: Object,
      required: false,
      default: Object
    },
    adultFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentTab: 1,
      isAdultDiv: false,
      isPopup: false, // 팝업으로 호출된경우 true, Page로 호출된경우 false
      partNumber: ''
    }
  },
  created () {
    if (isOsApp() && this.$route.name === 'adult') { // APP
      this.isAdultDiv = this.adultFlag
    } else {
      const isAdultDivTemp = isNull(this.$route) || isNull(this.$route.params) ? false : this.$route.params.isAdultDiv
      this.isAdultDiv = this.param.isAdultDiv || (isAdultDivTemp || false)
      if (!isNull(this.param.isAdultDiv)) {
        this.isPopup = true
      }
    }

    if (!isNull(this.$route.params.partNumber)) {
      this.partNumber = this.$route.params.partNumber
    }
  },
  mounted () {
    window.vm = this // customerInputMixin에서 팝업호출후 opener객체 반환을 위한 선언
  },
  methods: {
    /**
     * 아이핀/휴대폰 인증선택 변경
     *
     * @param {number} type 아이핀/휴대폰구분값
     */
    setCurrentTab (type) {
      this.currentTab = type
      this.showCertView()
    },
    /**
     * 인증팝업 호출을 위한 검증
     *
     * @returns {boolean|void}
     */
    showCertView () {
      try {
        const params = {
          certType: this.currentTab,
          targetType: 'cert',
          successFunc: 'certSuccess',
          failFunc: 'certFail',
          MOB_RET_URL: ''
        }

        params.MOB_RET_URL = `${location.origin}/customer/info/return-auth`

        this.showCertificationWindow(params)
        return false
      } catch (e) {
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/customer/info/OrderNoMemberCertify";
</style>
