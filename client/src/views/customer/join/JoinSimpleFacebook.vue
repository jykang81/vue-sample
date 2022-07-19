<template>
  <div class="join_simple_facebook">
    <ol class="step">
      <li class="active">
        가입확인 및 약관동의
      </li>
      <li>
        가입완료 후 이용하기
      </li>
    </ol>
    <ns-input
      :params="idParams"
    />
    <div class="input_field">
      <label for="label_sns_agree" class="label_text">NSmall 모바일에서 제공하는 이벤트, 쿠폰, 할인특가 등 다양한 정보를 이메일로 받아보시겠습니까?</label>
      <div class="radio_box">
        <span>
          <input
            id="sns_agree"
            v-model="pickedPeriod"
            class="radio"
            type="radio"
            name="sort"
            value="true"
          >
          <label for="sns_agree">수신동의</label>
        </span>
        <span>
          <input
            id="sns_non_agree"
            v-model="pickedPeriod"
            class="radio"
            type="radio"
            name="sort"
            value="false"
          >
          <label for="sns_non_agree">수신안함</label>
        </span>
      </div>
    </div>
    <p class="join_simple_facebook_guide">
      NSmall 모바일 서비스 이용약관 및 정보이용 안내에 대한 동의를 해주세요.  가입 전에 반드시 읽어보시고 동의를 하셔야 회원가입을 하실 수 있습니다.
    </p>
    <div class="join_simple_facebook_guide_checkbox">
      <label>
        <input
          v-model="isCheckAgree"
          type="checkbox"
          class="checkbox square"
        >
        <span class="check_label">이용약관 동의</span>
      </label>
      <a
        href="#none"
        class="btn_layer"
        @click="onclickBtnUsageShow"
      >
        보기
      </a>
    </div>
    <button
      type="button"
      class="btn_join"
      @click="joinFacebooSimple"
    >
      <span>동의하고 가입하기</span>
    </button>
  </div>
</template>

<script>
import NsInput from '@components/common/NsInput'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import MEMBER_CONST from '@/common/constants/customer/member'
import facebookMixin from '@/mixins/customer/facebookMixin'

export default {
  components: {
    NsInput
  },
  mixins: [
    facebookMixin
  ],
  data () {
    return {
      isSnsAgree: false,
      facebookParams: {},
      idParams: {
        value: '',
        iconClass: 'id',
        title: 'SNS계정',
        placeholder: MEMBER_CONST.MEMBER_TEXT.LOGINIDPLACEHOLDER,
        maxlength: 40,
        isLabel: true,
        labelKind: 'label_text',
        isSuccess: false,
        isError: false,
        disabled: true,
        errorMessage: ''
      },
      isCheckAgree: false,
      pickedPeriod: true
    }
  },
  created () {
    this.facebookParams = this.$route.params

    if (isNull(this.facebookParams)) {
      messageUtil.alert('FaceBook정보가 없습니다.\n로그인 화면으로 이동합니다.', () => {
        this.$router.push({ name: 'memberLogin' })
      })
    } else {
      this.idParams.value = this.facebookParams.Email
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/join/JoinSimpleFacebook";
</style>
