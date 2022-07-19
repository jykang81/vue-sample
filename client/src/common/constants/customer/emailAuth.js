const EMAIL_AUTH_CONST = {
  AUTH_TYPE: {
    MEMBER_MODIFY: 'memberModify',
    FIND_ID: 'findID',
    FIND_PASSWORD: 'findPassword'
  },
  MESSAGES: {
    SERVER_ERROR: '서버 통신 오류가 발생했습니다.',
    AFTER_SEND_CODE: '인증 메일이 발송 되었습니다.',
    TIMEOUT: '인증번호 입력 시간이 초과하였습니다.<br>다시 시도해 주세요.',
    INVALID_INPUT: '이메일 형식이 올바르지 않습니다.',
    DUPLICATED_EMAIL: '이미 가입된 이메일입니다.<br>다른 이메일을 입력해 주세요.',
    EMPTY_VERIFICATION_CODE: '인증번호를 입력해주세요.',
    INVALID_VERIFICATION_CODE: '인증번호를 다시 한 번 확인 후 입력해주세요.'
  },
  BUTTON_NAME: '인증메일 전송'
}

export default EMAIL_AUTH_CONST
