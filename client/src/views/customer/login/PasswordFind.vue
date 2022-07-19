<template>
  <div class="password_find">
    <div class="msg_box">
      <h2 class="subject sm">
        아이디를 입력해주세요.
      </h2>
    </div>
    <div class="dropdown_wrap">
      <!-- 이메일(아이디) default : start -->
      <ns-input
        :params="userIdParams"
        @input="clearCheck"
        @blur="checkMoveTarget($event)"
      />
      <ul
        v-if="isActive"
        id="domainList"
      >
        <li
          v-for="(data, key) in emailList"
          :key="key"
          @click="changeValue(data[0], data[1])"
        >
          <span class="user_id">{{ data[0] }}</span>{{ data[1] }}
        </li>
      </ul>
    </div>
    <button
      v-if="isNewSend"
      type="button"
      class="btn_confirm"
      @click="sendIdCheck"
    >
      <span>확인</span>
    </button>
    <!-- 이메일(아이디) default : end -->
    <div
      v-if="isFailSend"
      class="btn_group"
    >
      <router-link
        class="btn_find"
        :to="{ name : 'findUserId' }"
      >
        <span>아이디 찾기</span>
      </router-link>
      <a
        class="btn_retry"
        @click="sendIdCheck"
      >
        <span>재시도</span>
      </a>
    </div>
    <!-- 이메일(아이디) error : end  -->
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'
import NsInput from '@components/common/NsInput'
import MEMBER_CONST from '@/common/constants/customer/member'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import customerInputMixin from '@/mixins/customer/customerInputMixin'

export default {
  name: 'PasswordFind',
  components: {
    NsInput
  },
  mixins: [
    customerInputMixin
  ],
  data () {
    return {
      userIdParams: {
        value: '',
        iconClass: 'id',
        title: MEMBER_CONST.MEMBER_TEXT.LOGINIDPLACEHOLDER,
        placeholder: MEMBER_CONST.MEMBER_TEXT.LOGINIDPLACEHOLDER,
        maxlength: 40,
        type: 'text',
        isLabel: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        errorMessage: MEMBER_CONST.MEMBER_TEXT.EMAIL08
      },
      emailDomainList: [
        'naver.com',
        'hanmail.net',
        'nate.com',
        'gmail.com',
        'daum.net',
        'hotmail.com',
        'yahoo.co.kr',
        'lycos.co.kr',
        'dreamwiz.com',
        'korea.com'
      ],
      emailList: [],
      searchQuery: '',
      isActive: false,
      isNewSend: true,
      isFailSend: false
    }
  },
  activated () {
    this.userIdParams.value = ''
    this.userIdParams.isError = false
    this.userIdParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL08
    this.isFailSend = false
    this.isNewSend = true
  },
  mounted () {
    window.addEventListener('click', this.windowListenerCallback)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.windowListenerCallback)
  },
  methods: {
    /**
     * window 이벤트 콜백
     *
     * @param {object} e 클릭 이벤트
     */
    windowListenerCallback (e) {
      const pathArray = e.composedPath()
      let checkUi = true

      pathArray.forEach(element => {
        const elementId = element.id

        if (elementId === 'domainList') {
          checkUi = false
        }
      })

      if (checkUi) {
        this.closeUi()
      }
    },
    /**
     * 도메인 목록 초기화후 닫기
     */
    closeUi () {
      this.isActive = false
    },
    /**
     * 포커스를 잃을경우 도메인리스트 노출하지 않는다.
     *
     * @param {object} e blur 이벤트
     */
    checkMoveTarget (e) {
      const relatedTarget = e.relatedTarget

      if (!isNull(relatedTarget)) {
        this.closeUi()
      }
    },
    /**
     * ID 검증
     *
     * @param {string} value input 값
     * @param {Event} event 이벤트 객체
     * @returns {boolean|void}
     */
    clearCheck (value, event) {
      this.isSuccess = false
      this.userIdParams.value = this.userIdParams.value.replace(/ /gi, '')

      const loginId = this.userIdParams.value
      this.userIdParams.isError = false
      this.userIdParams.errorMessage = ''

      // 한글입력 막기
      // const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
      const validationPattern = /[^a-zA-Z0-9-_.@]/.test(loginId)
      if (validationPattern) {
        this.userIdParams.value = loginId.slice(0, -1)
        event.target.value = this.userIdParams.value // chrome mobile 대응
        return false
      }

      /**
       * 이메일 도메인목록처리
       */
      this.getEmailAuto(this.userIdParams)
    },
    /**
     * 이메일 도메인셋팅
     *
     * @param {String} id 아이디
     * @param {String} domain 도메인
     */
    changeValue (id, domain) {
      this.isActive = false
      this.userIdParams.value = id.trim() + domain
    },
    /**
     * ID API연계 체크
     *
     * @returns {void|boolean}
     */
    sendIdCheck () {
      if (isNull(this.userIdParams.value)) {
        this.userIdParams.isError = true
        this.userIdParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL02
        return false
      }

      const reqParams = {
        lastName: '',
        param: this.userIdParams.value.toLowerCase(),
        type: 'F',
        mode: 'F'
      }

      const successHandling = data => {
        const processMsg = data.msg.root.Checkresult.processMsg

        if (processMsg === 'E') {
          this.userIdParams.isError = true
          this.userIdParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL08
          this.isNewSend = false
          this.isFailSend = true

          return false
        } else {
          this.snsPswMmt(reqParams.param).then(data => {
            const isRegisteredPwd = data.msg.root.isRegisteredPwd

            if (isRegisteredPwd === 'N') {
              messageUtil.alert(MEMBER_CONST.WARNING_MESSAGES.SNS_PASSWORD_IS_REGISTERED, () => {
                this.$router.push({ name: 'memberLogin' })
              })
            } else {
              const goingInvoke = {
                name: 'certifiedSelect',
                params: {
                  logonId: reqParams.param,
                  name: reqParams.lastName,
                  type: reqParams.type,
                  viewType: 'PASS'
                }
              }

              this.$router.push(goingInvoke)
              return true
            }
          })
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      this.$nsaxios.post('NSPWCheckMoblieCmdReal', reqParams, successHandling, errorHandling)
    },
    /**
     * SNS계정여부확인
     *
     * @param {string} nsId 회원메일ID
     * @returns {boolean}
     */
    async snsPswMmt (nsId) {
      const invoke = {
        cmdType: 3,
        nsId
      }

      return await this.$nsaxios.post('NSMobileSnsPswMgmt', invoke)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/login/PasswordFind";
</style>
