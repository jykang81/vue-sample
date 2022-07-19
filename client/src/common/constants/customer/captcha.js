const NAVER_CAPTCHA_CONST = {
  KEY: {
    CLIENT_ID: process.env.VUE_APP_NAVER_RECAPTCHA_CLIENT_ID
  },
  IMAGE: {
    API_URL: `https://customer.${process.env.VUE_APP_STAGE}-nsmall.com/login/recaptcha/image`,
    FILE_URL: 'https://naveropenapi.apigw.ntruss.com/captcha-bin/v1/ncaptcha'
  },
  VOICE: {
    API_URL: `https://customer.${process.env.VUE_APP_STAGE}-nsmall.com/login/recaptcha/voice`,
    FILE_URL: 'https://naveropenapi.apigw.ntruss.com/scaptcha-bin/v1/scaptcha',
    IDLE_BUTTON_NAME: '음성듣기',
    PLAYING_BUTTON_NAME: '음성멈춤'
  },
  INPUT_TEXT: {
    TITLE: '인증번호',
    PLACEHOLDER: '자동입력 방지문자'
  },
  VALIDATION_MESSAGES: {
    NULL: '자동입력 방지문자를 입력해 주세요.',
    FAIL: '자동입력 방지문자를 정확하게 입력해 주세요.'
  },
  RESULT_MESSAGES: {
    VERIFICATION_SUCCESS: '인증 성공',
    VERIFICATION_FAILURE: '인증 실패',
    SERVICE_PROC_ERROR_COMMON: '일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.'
  }
}

export { NAVER_CAPTCHA_CONST }
