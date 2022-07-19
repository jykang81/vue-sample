<template>
  <div class="rest_become">
    <div class="rest_become_contents">
      <div class="rest_become_title">
        <i class="icons_logo" />
        <i class="icons_lock" />
        <strong class="title">휴면 아이디 안내</strong>
      </div>
      <p class="rest_become_guide">
        회원님의 아이디는 1년 이상 로그인 되지 않아
        휴면 아이디로 전환되었습니다.
      </p>
      <p class="copy">
        아래  ‘휴면 해제하기‘ 버튼을 선택 하시면
        휴면 계정 해제되어 전체 서비스 이용 가능합니다.
      </p>
    </div>

    <button
      type="button"
      class="btn_cancel"
      @click="recoverMemberLogin(isNameCkecked, invoke)"
    >
      <span>휴면해제하기</span>
    </button>
  </div>
</template>

<script>
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import messageUtil from '@/common/frameworks/messageUtil'
import bizUtil from '@/common/utils/bizUtil'

export default {
  name: 'RestBecome',
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      invoke: {},
      isNameCkecked: false
    }
  },
  created () {
    this.invoke = this.$route.params.memberInfo
    this.getRecoverMember(this.invoke.logonId, data => {
      if (data && data.msg && data.msg.root.result.rtnCode === 'Y') {
        this.isNameCkecked = true
      } else if (data && data.msg && data.msg.root.result.rtnCode === 'E') {
        messageUtil.alert('API 통신 중 문제가 발생하여 로그인페이지로 이동합니다.', () => {
          // Login 페이지로 이동처리
          bizUtil.gotoLogin()
        })
      } else {
        this.isNameCkecked = false
      }
    })
  },
  mounted () {
    window.vm = this // customerInputMixin에서 팝업호출후 opener객체 반환을 위한 선언
  },
  methods: {}
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/rest/RestBecome";
</style>
