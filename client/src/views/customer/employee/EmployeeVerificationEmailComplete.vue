<template>
  <div class="employee_verification_email_complete">
    <div class="msg_box">
      <p class="msg">
        인증 이메일을 발송하였습니다.<br>인증코드는 24시간동안 유효합니다.<br>이메일의 인증 링크로 접속하셔서 연동을 완료한 후 특가매장을 이용할 수 있습니다.
      </p>
    </div>
    <button
      type="button"
      class="btn_go_store"
      @click="chkStaff"
    >
      <span>특가매장 바로가기</span>
    </button>
  </div>
</template>

<script>
import staffInfoMixin from '@/mixins/customer/staffInfoMixin'

export default {
  mixins: [
    // 현재페이지의 이벤트는 staffInfoMixin에서 처리함
    staffInfoMixin
  ],
  data () {
    return {}
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/employee/EmployeeVerificationEmailComplete";
</style>
