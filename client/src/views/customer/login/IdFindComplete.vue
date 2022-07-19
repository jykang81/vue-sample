<template>
  <div class="id_find_complete">
    <dl class="id_result">
      <dt><strong>{{ userName }}</strong>님의 아이디는</dt>
      <dd
        v-for="userId in notMailId"
        :key="userId"
        class="ns_id"
      >
        <span>{{ userId }}</span>
      </dd>
      <dd
        v-for="userMailId in mailId"
        :key="userMailId"
      >
        <span>{{ userMailId }}</span>
      </dd>
    </dl>
    <div class="btn_group">
      <a
        class="btn_find_password"
        @click="$router.push({ name : 'checkId' })"
      >
        <span>비밀번호 찾기</span>
      </a>
      <a
        class="btn_login"
        @click="$router.push('/customer/login/regular-member')"
      >
        <span>로그인</span></a>
    </div>
  </div>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import toastUtil from '@frameworks/toastUtil'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'IdFindComplete',
  data () {
    return {
      userName: '',
      notMailId: [],
      mailId: []
    }
  },
  computed: {
    ...mapState('member', ['vuexUserName', 'vuexSearchId'])
  },
  activated () {
    this.userName = ''
    this.notMailId = []
    this.mailId = []
    this.init()
  },
  created () {
    this.init()
  },
  methods: {
    ...mapMutations('member', ['setUserName', 'setSearchId']),
    /**
     * 초기 Load함수
     */
    init () {
      console.log('route log >> ', this.$route.params.userName, this.$route.params.search_Id)
      this.userName = isNull(this.$route.params.userName) ? this.vuexUserName : this.$route.params.userName
      const searchId = isNull(this.$route.params.search_Id) ? this.vuexSearchId : this.$route.params.search_Id
      this.setLogonId(searchId)

      if (isNull(this.userName) && isNull(searchId)) {
        toastUtil.show('잘못된 접근입니다.')
        bizUtil.gotoMain()
        return false
      }
    },
    /**
     * 조회된 ID목록을 화면에 처리하는 함수
     *
     * @param {String} searchId String
     * @param {String} type String
     * @returns {void}
     */
    setLogonId (searchId, type) {
      // searchId = 'lsd61@nsmall.com|lsd25|lsd280@nsmall.com|lsd252|lsd252@gmail.com'
      const searchIdArray = searchId.split('|')
      let mailIdSeq = 0
      let notMailIdSeq = 0
      const idMapArray = []
      const mailIdMapArray = []

      for (let arrayNum = 0; arrayNum < searchIdArray.length; arrayNum++) {
        if (searchIdArray[arrayNum].indexOf('@') > -1) {
          idMapArray[mailIdSeq] = searchIdArray[arrayNum]
          mailIdSeq++
        } else {
          mailIdMapArray[notMailIdSeq] = searchIdArray[arrayNum]
          notMailIdSeq++
        }
      }

      this.mailId = idMapArray
      this.notMailId = mailIdMapArray

      this.setUserName(this.userName)
      this.setSearchId(searchId)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/IdFindComplete";
</style>
