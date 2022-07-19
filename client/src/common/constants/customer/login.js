
// TODO : Login기능에 정의돼있던 상수
const LOGIN_CONST = {
  LOGIN_ERROR: {
    '00': '로그인에 성공하였습니다.',
    10: '로그인에 성공하였습니다.',
    20: '아이디 또는 비밀번호를 다시 확인해 주세요.',
    21: 'SNS간편가입 아이디입니다. <br />SNS 로그인(네이버,카카오,페이코)를 이용해주세요.', // SNS회원(비밀번호가 없는 경우)이 일반계정 로그인 시
    30: '당사의 운영방침에 따라 쇼핑몰 이용이 어렵습니다. 감사합니다.',
    40: '고객님께서는 탈퇴를 신청하셨습니다.<br/>탈퇴 신청을 취소하시려면 고객센터를 이용해 주세요.',
    50: '로그인에 성공하였습니다.', // 비밀번호 변경일 90일 이상지난경우
    60: '<span style=color:#FF0000;>고객님의 휴면계정이 활성화 되었습니다.</span><br />이제 Nsmall에서 다양한 혜택을 제공받으실 수 있습니다.<br />Nsmall은 앞으로 고객님의 개인정보를 소중히 관리하고, 편리한 서비스를 제공할 수 있도록 더 노력하겠습니다.<br />감사합니다.',
    70: '현재 시스템 상황이 원활하지 않습니다.<br />잠시 후 다시 시도 바랍니다.',
    80: '정보보호를 위해 자동입력 방지문자를 함께 입력해 주세요.',
    90: '네이버 계정 연동이 완료되었습니다!',
    100: '페이코 계정 연동이 완료되었습니다!',
    901: 'ID가 형식에 맞지 않습니다.',
    902: '아이디를 입력해 주세요.',
    903: '비밀번호를 입력해 주세요.',
    904: '아이디를 정확하게 입력해 주세요.',
    '000': ''
  },
  PAGE_MESSAGES: {
    IS_LOGIN: '로그인상태입니다.'
  },
  FACEBOOK_LOGIN_FAIL: {
    IS_LOGIN: '페이스북으로 가입 된 사용자가 존재하지 않습니다.'
  },
  SIMPLE_LOGIN: {
    PAYCO: {
      URL: process.env.VUE_APP_PAYCO_URL,
      CLIENT_ID: process.env.VUE_APP_PAYCO_CLIENT_ID
    },
    NAVER: {
      URL: 'https://nid.naver.com/oauth2.0/authorize',
      CLIENT_ID: process.env.VUE_APP_NAVER_CLIENT_ID
    },
    KAKAO: {
      URL: 'https://kauth.kakao.com/oauth/authorize',
      CLIENT_ID: process.env.VUE_APP_KAKAO_CLIENT_ID
    },
    FACEBOOK: {
      URL: '',
      APP_ID: process.env.VUE_APP_FACEBOOK_APP_KEY
    }
  },
  LOGIN_POPUP_TYPE: { // 로그인 팝업 타입
    GLOBAL: 'GLOBAL', // 범용 로그인
    MEMBER: 'MEMBER', // 회원 전용 로그인
    ORDER: 'ORDER' // 상품구매 로그인
  }
}

export default LOGIN_CONST
