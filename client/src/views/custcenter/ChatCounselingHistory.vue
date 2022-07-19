<template>
  <div class="chat_counseling_history">
    <iframe ref="chatHistoryView" title="채팅리스트" />
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import CONST from '@constants/framework/framework'
import uiUtil from '@utils/uiUtil'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import {
  iframeReceiveMessage,
  objectToQueryString,
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  name: 'ChatCounselingHistory',
  props: {
    talkId: { // 상담이력ID (APP PUSH 용도)
      type: String,
      default: ''
    },
    talkType: { // 상담 종류 (APP PUSH 용도)
      type: String,
      default: ''
    }
  },
  data () {
    return {
      customerId: '', // 고객 아이디
      win: null // 팝업 윈도우 객체
    }
  },
  created () {
    iframeReceiveMessage(this, this.funcPostMsg)
    this.customerId = loginUtil.custNum()
  },
  mounted () {
    this.getChttingIframe()
    this.resize()
    uiUtil.setInfiniteScroll(this, {
      callback: this.addTalkList
    })
  },
  methods: {
    /**
     * 스펙트라 callback function (postMessage로 수신할 callback)
     *
     * @param {string} data (필수) postMessage로 수신한 callback function 정보
     */
    funcPostMsg (data) {
      let vData

      try {
        vData = JSON.parse(data)
      } catch (e) {
        return
      }

      const functionName = vData.func_name
      if (functionName && typeof (this[functionName]) === 'function') {
        this[functionName](vData.param)
      }
    },
    /**
     * IFRAME resize
     *
     * @param {number} iframeHeight (필수) iframe 높이 정보
     */
    resize (iframeHeight) {
      const height = iframeHeight || document.documentElement.scrollHeight
      this.$refs.chatHistoryView.height = `${height}px`
    },
    /**
     * IFRAME resize (postMessage로 호출됨. function명 변경 금지!)
     *
     * @param {object} data (필수) iframe 높이 정보
     */
    iframeResize (data) {
      this.resize(data.iframe_size)
    },
    /**
     * 상담이력 조회
     *
     */
    getChttingIframe () {
      const baseUrl = '//talk.nsmall.com/app/jsp/talk/myList.jsp?'
      const param = {
        customerId: this.customerId, // 고객아이디
        appType: COMM_CONST.getAcceptPath(), // 유입경로
        type: 'MYPAGE',
        ssl: location.protocol.indexOf('https'),
        source_url: document.location.href
      }

      if (isOsApp() && viewType() === 'ios') {
        param.appType = 500
      }

      if (this.talkId !== null && this.talkType === 'PUSH') {
        this.$nsaxios.post('InquiryCmdAjax', { cmdType: 'getCustNum' }, data => {
          param.customerId = data.custNum
          this.customerId = data.custNum

          this.$refs.chatHistoryView.src = baseUrl + objectToQueryString(param)

          this.pageCheck({
            pageName: 'TALKING',
            talkId: this.talkId
          })
        })
      } else {
        this.$refs.chatHistoryView.src = baseUrl + objectToQueryString(param)
      }
    },
    /**
     * 로그인 확인 (postMessage로 호출됨. function명 변경 금지!)
     *
     * @param {object} data (필수) customer_id
     *
     */
    loginCheck (data) {
      if (this.customerId === data.customer_id) {
        const loginYn = true
        if (this.win && this.win.close !== undefined) {
          this.win.self.postMessage(loginYn, '*')
        } else {
          const content = this.$refs.chatHistoryView.contentWindow
          content.postMessage(loginYn, '*')
        }
      } else {
        bizUtil.gotoMain()
      }
    },
    /**
     * 스펙트라 상담톡 CALLBACK (postMessage로 호출됨. function명 변경 금지!)
     *
     * @param {object} data (필수) talk_id, page_name
     */
    pageCheck (data) {
      const url = `//talk.nsmall.com/app/jsp/talk/talkPageCheck.jsp?${objectToQueryString({
          customerId: loginUtil.custNum(), // 고객아이디
          customerName: loginUtil.userName(), // 고객이름
          marginTop: '40', // 상단 height
          marginBottom: '', // 하단 height
          talkId: data.talk_id, // talkid
          pageName: data.page_name, // pagename
          appType: COMM_CONST.getAcceptPath(), // Push I/F 발송에 필요한 Key값들
          type: 'TALKPAGE',
          requestUrl: CONST.IS_SERVER_STATE, // 운영 & 개발 구분
          deviceId: loginUtil.userId() // 플랫폼고객번호
      })}`

      if (isOsApp()) {
        nativeUtil.openEnomixTalk(`https:${url}`, this.customerId) // 앱인 경우 https로만 보내기
      } else {
        this.win = window.open(url, '_hub', 'location=no,zoom=no,hardwareback=no,clearsessioncache=no,clearcache=yes')
        if (!this.win) {
          messageUtil.alert('단말기 설정에서 팝업 차단을 풀어주세요.')
        }
      }
    },
    /**
     * 상담이력 페이지 refresh (postMessage로 호출됨. function명 변경 금지!)
     *
     */
    pageMove () {
      if (this.win && this.win.close !== undefined) {
        this.win.close()
        this.win = null
      }
      const iframeUrl = this.$refs.chatHistoryView.src
      this.$refs.chatHistoryView.src = iframeUrl
    },
    /**
     * 상담이력 더보기
     *
     */
    addTalkList () {
      const content = this.$refs.chatHistoryView.contentWindow

      if (content) {
        content.postMessage(JSON.stringify({
          func_name: 'addTalkList',
          param: {}
        }), '*')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/ChatCounselingHistory";
</style>
