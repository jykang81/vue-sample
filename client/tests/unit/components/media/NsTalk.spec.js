import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import CONST from '@constants/framework/framework'
import MEDIA_CONST from '@constants/media/media'
import nsaxios from '@frameworks/axiosUtil'
import {
  arraySort
} from '@utils/commonutil/commonUtil'
import NsTalk from '@components/media/NsTalk'

const localVue = createLocalVue()
localVue.use(VueRouter)

// 필수 테스트 할 대상 파일명을 넣음
describe('NsTalk 테스트', () => {
  let wrapper
  let vm
  let mock
  const TEST_TALK = [
    {
      msg: '너무 좋아요',
      msgDate: '20200810160101',
      convertMsgDate: '16:01',
      type: '1',
      msgKey: '1',
      broadcastYn: 'N',
      userId: 'testId',
      myTalk: false,
      userTel: '0000'
    },
    {
      msg: '칭찬 감사합니다.',
      msgDate: '20200810160202',
      convertMsgDate: '16:02',
      type: '2',
      msgKey: '2',
      broadcastYn: 'N',
      userId: '한 PD',
      myTalk: false,
      userTel: '0000'
    },
    {
      msg: '구매했어요. 이벤트 당첨되길...',
      msgDate: '20200810160303',
      convertMsgDate: '16:03',
      type: '3',
      msgKey: '3',
      broadcastYn: 'N',
      userId: 'testId',
      myTalk: false,
      userTel: '0000'
    },
    {
      msg: '공지사항글 입니다.',
      msgDate: '20200810160403',
      convertMsgDate: '16:04',
      type: '4',
      msgKey: '4',
      broadcastYn: 'N',
      userId: 'testId',
      myTalk: false,
      userTel: '0000'
    }
  ]

  before(() => {
    Vue.prototype.$nsaxios = nsaxios

    // mock axios
    mock = new MockAdapter(axios)

    // 주문 목록 조회
    mock.onPost(`${CONST.API_URL}/NSMobNsTalkForInfoBankCmd`).reply(200,
      {
        msg: {
          root: {
            orders: [{
              cats: [{
                brandName: '테스트 브랜드',
                catentryName: '테스트 상품',
                status: 'D',
                attrs: [],
                quantity: 1,
                goodsCd: '12345',
                statusName: '결제대기',
                orderSeq: 1,
                ordersId: '123456'
              }],
              ordersId: '123456',
              timeplaced: '2020-06-04'
            }]
          }
        }
      }
    )

    wrapper = shallowMount(NsTalk, {
      localVue,
      router
    })
    vm = wrapper.vm

    // 채팅 데이터 mocking
    vm.talkList = TEST_TALK

    // 웹소켓 mocking
    vm.websocket = {
      close: () => {},
      send: () => {}
    }
    vm.websocket.readyState = MEDIA_CONST.WEBSOCKET_STATE.OPEN
  })

  describe('sortedTalkList', () => {
    it('최신 메시지가 제일 하단에 나오도록 정렬된 채팅 메시지', () => {
      const expected = arraySort(TEST_TALK, 'msgDate', 'asc')
      assert.deepEqual(vm.sortedTalkList, expected)
    })
  })

  describe('isNoticeTalk', () => {
    it('공지글 여부', () => {
      const noticeTalk = TEST_TALK.find(talk => talk.type === MEDIA_CONST.NSTALK.TYPE.NOTICE)
      assert.isTrue(vm.isNoticeTalk(noticeTalk.type))
    })
  })
  describe('isEventWinTalk', () => {
    it('이벤트 당첨글 여부', () => {
      const eventWinTalk = TEST_TALK.find(talk => talk.type === MEDIA_CONST.NSTALK.TYPE.EVENT)
      assert.isTrue(vm.isEventWinTalk(eventWinTalk.type))
    })
  })
  describe('getTalkClass', () => {
    it('채팅글 class', () => {
      const replyTalk = TEST_TALK.find(talk => talk.type === MEDIA_CONST.NSTALK.TYPE.REPLY)
      const actual = vm.getTalkClass(replyTalk)
      const expected = {
        my_talk: false,
        host_talk: false,
        host_reply: true
      }
      assert.deepEqual(actual, expected)
    })
  })
  describe('openWebsocket', () => {
    it('웹소켓 열기', () => {
      // vm.openWebsocket()
    })
  })
  describe('onMessage', () => {
    it('에러 발생', () => {
      vm.onMessage({
        code: MEDIA_CONST.NSTALK.RESPONSE_CODE.ERROR,
        errors: [
          {
            msg: ''
          }
        ]
      })
    })
    it('메시지 수신 (program type) - 최초 진입', () => {
      vm.joinFlag = false
      vm.onMessage({
        type: 'program',
        program: {
          id: '-1'
        }
      })
    })
    it('메시지 수신 (program type) - 최초 진입 아님', () => {
      vm.joinFlag = true
      vm.onMessage({
        type: 'program',
        program: {
          id: '1'
        }
      })
    })
    it('메시지 수신 (message type)', () => {
      vm.onMessage({
        type: 'message',
        messages: [
          {
            msg_key: '5',
            msg: '',
            msg_date: '',
            user_tel: '',
            type: MEDIA_CONST.NSTALK.TYPE.INPUT,
            broadcast_yn: '',
            user_id: '',
            o_msg: '',
            o_user_tel: ''
          },
          {
            msg_key: '6',
            msg: '',
            msg_date: '',
            user_tel: '',
            type: MEDIA_CONST.NSTALK.TYPE.EVENT,
            broadcast_yn: '',
            user_id: '',
            o_msg: '',
            o_user_tel: ''
          },
          {
            msg_key: '7',
            msg: '',
            msg_date: '',
            user_tel: '',
            type: MEDIA_CONST.NSTALK.TYPE.NOTICE,
            broadcast_yn: '',
            user_id: '',
            o_msg: '',
            o_user_tel: ''
          }
        ]
      })
    })
  })
  describe('sendMyTalk', () => {
    it('채팅 메시지 없을 때', () => {
      assert.isFalse(vm.sendFlag)
    })
    it('채팅 메시지 전송', () => {
      // 채팅 mocking
      vm.myTalk = '반갑습니다.'

      // 채팅 메시지 전송
      vm.sendMyTalk()

      assert.isTrue(vm.sendFlag)
    })
  })
  describe('gotoNsTalkBack', () => {
    it('Ns Talk 뒤로가기', () => {
      vm.gotoNsTalkBack()
    })
  })
})
