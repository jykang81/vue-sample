const PHONE_AUTH_CONST = {
  AUTH_TYPE: {
    MEMBER_JOIN: 'memeberJoin',
    MEMBER_MODIFY: 'memberModify',
    FIND_ID: 'findID',
    FIND_PASSWORD: 'findPassword',
    ORDER: 'order'
  },
  MESSAGES: {
    SERVER_ERROR: '서버 통신 오류가 발생했습니다.',
    AFTER_SEND_CODE: '입력하신 번호로 인증번호가 발송되었습니다.',
    TIMEOUT: '인증번호 입력 시간이 초과하였습니다.<br>다시 시도해 주세요.',
    INVALID_INPUT: '인증번호를 다시 한번 확인 후 입력해 주세요.',
    EMPTY_VERIFICATION_CODE: '인증번호를 입력해주세요.',
    SUCCESS: '인증되었습니다. 가입을 진행해 주세요.',
    EXPIRED: '인증이 만료 되었습니다.<br/>재인증 해주세요.'
  }
}

export default PHONE_AUTH_CONST
