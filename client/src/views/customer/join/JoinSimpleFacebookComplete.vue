<template>
  <div class="join_simple_facebook_complete">
    <ol class="step">
      <li>
        가입확인 및 약관동의
      </li>
      <li class="active">
        가입완료 후 이용하기
      </li>
    </ol>
    <div class="msg_box">
      <i class="icons_facebook" />
      <strong>간편회원가입이 정상적으로 완료되었습니다.</strong>
      <p class="guide">
        간편회원가입은 본인인증을 하지 않은 관계로<br>NSmall 모바일의 일부 서비스 이용에 제한이<br>있을 수 있습니다.
      </p>
    </div>
    <div class="join_guide">
      회원가입 시 간편회원 계정으로 적립된 포인트와<br>적립금 혜택은 그대로 사용하실 수 있습니다.
    </div>
    <router-link
      class="btn_home"
      :to="{ name: 'storeHome' }"
    >
      <span>홈으로 가기</span>
    </router-link>
  </div>
</template>

<script>
import facebookMixin from '@/mixins/customer/facebookMixin'
import loginUtil from '@utils/loginUtil'
export default {
  mixins: [
    facebookMixin
  ],
  data () {
    return {
      joinCompleteParams: {}
    }
  },
  created () {
    this.joinCompleteParams = this.$route.params
    if (!loginUtil.isLoggedIn()) {
      this.sendFBLogin(this.joinCompleteParams)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/join/JoinSimpleFacebookComplete";
</style>
