<template>
  <div class="nstalk_wrap">
    <div class="nstalk">
      <ul class="list">
        <template v-for="(talk, index) in sortedTalkList">
          <li
            v-if="talk.myTalk || isNoticeTalk(talk.type) || talk.confirmYn === '1'"
            :key="index" class="item"
            :class="getTalkClass(talk)"
          >
            <div class="talk_box">
              <span v-if="isEventWinTalk(talk.type)" class="label">이벤트 당첨</span>
              <span v-if="talk.broadcastYn === '1'" class="label">방송 노출</span>
              <i v-if="isNoticeTalk(talk.type)" class="icons_speaker" />
              <strong v-if="isNoticeTalk(talk.type)">알려드립니다</strong>
              <strong v-else>
                {{ talk.userTel }}
                <span v-if="talk.reply">에게 답장</span>
              </strong>
              <p class="text">
                {{ htmlDecode(talk.msg) }}
              </p>
              <div v-if="talk.reply" class="talk_reply">
                <p>{{ htmlDecode(talk.reply.msg) }}</p>
              </div>
            </div>
            <span class="time">{{ talk.convertMsgDate }}</span>
          </li>
        </template>
      </ul>
    </div>
    <div class="nstalk_input">
      <div class="talk_write">
        <input v-model="myTalk" type="text" class="text" placeholder="NS Talk에 참여해주세요" @keyup.enter="sendMyTalk">
        <button
          ref="nsTalkSendBtn"
          type="button"
          class="button_send"
          :class="{ active : myTalk.length > 0 }"
          @click="sendMyTalk"
        >
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bizUtil from '@utils/bizUtil'
import MEDIA_CONST from '@constants/media/media'
import CONST from '@constants/framework/framework'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import {
  arraySort,
  htmlDecode
} from '@utils/commonutil/commonUtil'
export default {
  name: 'NsTalk',
  props: {
    talkInfo: { // 사용자, 상품 정보
      type: Object,
      required: true,
      default: () => {
        return {
          productCode: '',
          userId: '',
          userTel: ''
        }
      }
    }
  },
  data () {
    return {
      websocket: null, // 웹소켓 객체
      retryCount: 3, // 웹소켓 연결 재시도 횟수
      sendFlag: false, // 참여글 입력 유무 체크
      timer: null, // ping pong timer
      closeNsTalkFlag: false, // true: Ns Talk 종료를 사용자가 직접 호출한 경우(뒤로가기 등..), false: 소켓 연결 3회 시도 후 실패 시 종료되는 경우
      programId: 0, // 프로그램 ID
      joinFlag: false, // 채팅방 최초 진입 여부
      talkList: [], // 전체 채팅 메시지
      myTalk: '' // 내 채팅 메시지
    }
  },
  computed: {
    ...mapGetters('popup', ['hasFullLayerPopup']),
    /**
     * 최신 메시지가 제일 하단에 나오도록 정렬된 채팅 메시지
     *
     * @returns {array} 최신 메시지가 제일 하단에 나오도록 정렬된 채팅 메시지
     */
    sortedTalkList () {
      return arraySort(this.talkList, 'msgDate', 'asc')
    }
  },
  watch: {
    talkInfo: {
      deep: true,
      handler () {
        this.openWebsocket()
      }
    },
    talkList () {
      // 채팅 목록 갱신되면 스크롤 최하단으로 이동
      if (this.hasFullLayerPopup) {
        // Full Layer일 때
        const scrollingElement = this.$root.$el.querySelector('.full_layer')
        scrollingElement.scrollTop = scrollingElement.scrollHeight
      } else {
        // 페이지일 때
        const scrollingElement = (document.scrollingElement || document.body)
        scrollingElement.scrollTop = scrollingElement.scrollHeight
      }
    }
  },
  created () {
    this.openWebsocket()
  },
  beforeDestroy () {
    // 사용자 호출로 인한 Ns Talk 종료라고 알려줌
    this.closeNsTalkFlag = true

    // 웹소켓 종료
    this.retryCount = 0
    if (this.websocket instanceof WebSocket) {
      this.websocket.close()
    }

    // ping pong 타이머 종료
    clearInterval(this.timer)
  },
  methods: {
    htmlDecode,
    /**
     * 공지글 여부
     *
     * @param {string} type 메시지 타입
     * @returns {boolean} 공지글 여부
     */
    isNoticeTalk (type) {
      return type === MEDIA_CONST.NSTALK.TYPE.NOTICE
    },
    /**
     * 이벤트 당첨글 여부
     *
     * @param {string} type 메시지 타입
     * @returns {boolean} 이벤트 당첨글 여부
     */
    isEventWinTalk (type) {
      return type === MEDIA_CONST.NSTALK.TYPE.EVENT
    },
    /**
     * 채팅글 class
     *
     * @param {object} talk 채팅 메시지
     * @returns {object} 채팅글 class
     */
    getTalkClass (talk) {
      return {
        my_talk: talk.myTalk,
        host_talk: talk.type === MEDIA_CONST.NSTALK.TYPE.NOTICE,
        host_reply: talk.type === MEDIA_CONST.NSTALK.TYPE.REPLY
      }
    },
    /**
     * 웹소켓 열기
     *
     */
    openWebsocket () {
      const { productCode, userId, userTel } = this.talkInfo
      if (!productCode || !userId || !userTel) {
        return
      }

      // 부모 컴포넌트가 TV LIVE / 띵라이브 인지에 따라 소켓 통신 서버 URL이 다름
      const parentComponentName = this.$parent.$options.name
      const baseUrl = parentComponentName === 'ThingliveLiveDetail' ? CONST.NSTALK_THINGLIVE_PATH : CONST.NSTALK_TVLIVE_PATH
      const url = [`wss://${baseUrl}/ws`, productCode, userId, userTel].join('/')
      this.websocket = new WebSocket(url)
      this.websocket.onopen = () => {
        // 성공시 재시도 횟수 재설정
        this.retryCount = 3

        // 서버 상태 체크를 위해 30초에 한번씩 ping message 전송
        this.timer = setInterval(this.websocket.send('{"type":"ping"}'), 30000)
      }
      this.websocket.onclose = () => {
        // 3회 시도
        if (this.retryCount > 0) {
          this.openWebsocket()
          this.retryCount--
        } else {
          // STOP Interval
          clearInterval(this.timer)

          // 소켓 연결 3회 시도 실패 시 뒤로가기 이동
          if (!this.closeNsTalkFlag) {
            messageUtil.alert('서버와의 연결에 실패하였습니다. 다시 시도해 주세요.', () => {
              this.gotoNsTalkBack()
            })
          }
        }
      }
      this.websocket.onmessage = evt => {
        this.onMessage(JSON.parse(evt.data))
      }
      this.websocket.onerror = () => {
        // onerror 발생 후 onclose 핸들러 호출됨
      }
    },
    /**
     * 서버로부터 메시지 수신 시 실행
     *
     * @param {object} rtnJsonResult 수신 메시지
     */
    onMessage (rtnJsonResult) {
      if (rtnJsonResult.code === MEDIA_CONST.NSTALK.RESPONSE_CODE.ERROR) { // ERROR CASE
        // 에러가 발생 되었으므로 뒤로가기 이동
        messageUtil.alert(rtnJsonResult.errors[0].msg, () => {
          this.gotoNsTalkBack()
        })
      } else {
        if (rtnJsonResult.type === 'program') {
          if (!this.joinFlag) {
            // 최초 진입 시, 프로그램ID 정의
            this.programId = rtnJsonResult.program.id
            if (this.programId < 0) {
              messageUtil.alert('채팅방이 종료 되었습니다.', () => {
                bizUtil.gotoMain()
              })
            }

            // 최초 진입 플레그 변경
            this.joinFlag = true
          } else {
            if (this.programId !== rtnJsonResult.program.id) {
              // 채팅방이 변경된 경우 뒤로가기
              messageUtil.alert('채팅방이 종료 되었습니다.', () => {
                bizUtil.gotoMain()
              })
            } else {
              // 채팅방 변경되지 않음
            }
          }
        } else if (rtnJsonResult.type === 'message') {
          // 사용자 호출로 인한 Ns Talk 종료 시 메시지 그리지 않음
          if (this.closeNsTalkFlag) {
            return
          }

          // 현재 채팅 데이터에서 키 값만 추출
          const msgKeyArr = this.talkList.map(data => data.msgKey)

          const arrMessages = rtnJsonResult.messages || []
          arrMessages.forEach(result => {
            const msg = result.msg.replace(/\n/g, '<br/>')
            const msgDate = result.msg_date
            const convertMsgDate = `${msgDate.slice(8, 10)}:${msgDate.slice(10, 12)}`
            const userTel = result.user_tel
            const type = result.type
            const msgKey = result.msg_key
            const broadcastYn = result.broadcast_yn
            const confirmYn = result.confirm_yn
            const userId = result.user_id
            const myTalk = this.talkInfo.userId === userId
            const oMsg = result.o_msg
            const oUserTel = result.o_user_tel

            // 현재 키 값의 글이 존재하면 업데이트, 존재하지 않으면 추가
            if (msgKeyArr.includes(result.msg_key)) {
              const matchedTalk = this.talkList.find(data => data.msgKey === result.msg_key)
              matchedTalk.broadcastYn = broadcastYn
              matchedTalk.confirmYn = confirmYn
              matchedTalk.type = type
            } else {
              if (type === MEDIA_CONST.NSTALK.TYPE.INPUT || type === MEDIA_CONST.NSTALK.TYPE.EVENT) { // 입력글, 당첨글
                this.talkList.push({
                  msg,
                  msgDate,
                  convertMsgDate,
                  type,
                  msgKey,
                  broadcastYn,
                  confirmYn,
                  userId,
                  myTalk,
                  userTel
                })
              } else if (type === MEDIA_CONST.NSTALK.TYPE.REPLY) { // 답글
                this.talkList.push({
                  msgDate,
                  convertMsgDate,
                  type,
                  msgKey,
                  broadcastYn,
                  confirmYn,
                  msg: oMsg,
                  userTel: oUserTel,
                  reply: {
                    msg: `[${userId}] ${msg}`
                  }
                })
              } else if (type === MEDIA_CONST.NSTALK.TYPE.NOTICE) { // 공지글
                this.talkList.push({
                  msg,
                  msgDate,
                  convertMsgDate,
                  type,
                  msgKey,
                  broadcastYn,
                  confirmYn,
                  userId,
                  myTalk,
                  userTel: userId
                })
              }
            }
          })

          if (this.sendFlag) {
            this.myTalk = ''
            this.$refs.nsTalkSendBtn.focus() // 모바일 환경에서 키패드 노출 제거를 위해 버튼으로 포커싱 처리
            this.sendFlag = false
          }
        } else {
          // Ping or another type case
        }
      }
    },
    /**
     * 채팅 메시지 전송
     *
     */
    sendMyTalk () {
      if (this.websocket && this.websocket.readyState === MEDIA_CONST.WEBSOCKET_STATE.OPEN) {
        let msg = this.myTalk
        msg = msg.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, '')
        msg = msg.replace(/(<([^>]+)>)/gi, '')
        msg = msg.trim()

        if (msg) {
          this.sendFlag = true

          this.websocket.send(JSON.stringify({
            type: 'message',
            method: 'put',
            properties: {
              msg
            }
          }))
        } else {
          messageUtil.alert('내용을 입력해 주세요.')
        }
      }
    },
    /**
     * Ns Talk 뒤로가기
     *
     */
    gotoNsTalkBack () {
      routerUtil.back()
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/media/NsTalk";
</style>
