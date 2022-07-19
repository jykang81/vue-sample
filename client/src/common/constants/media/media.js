
const MEDIA_CONST = {
  WEBSOCKET_STATE: {
    CONNECTING: 0, // 소켓이 생성됨. 연결이 아직 열려 있지 않음
    OPEN: 1, // 연결이 열려 있고, 통신할 준비가 됨
    CLOSING: 2, // 연결이 닫히는 중
    CLOSED: 3 // 연결이 닫혔거나 열 수 없음
  },
  NSTALK: {
    TYPE: { // NS TALK 채팅글 타입
      INPUT: '1', // 입력글
      REPLY: '2', // 댓글
      EVENT: '3', // 이벤트 당첨글
      NOTICE: '4' // 공지글
    },
    RESPONSE_CODE: { // 웹소켓 통신 결과 코드
      SUCCESS: '0', // 성공
      ERROR: '1' // 실패
    }
  }
}

export default MEDIA_CONST
