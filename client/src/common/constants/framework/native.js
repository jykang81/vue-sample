
// TODO : native에서 사용하는 상수
const APP_MOBILE_HOST = process.env.VUE_APP_MOBILE_HOST
const NATIVE_CONST = {
  NATIVE_URL: {
    LOGIN: `${APP_MOBILE_HOST}/customer/login/regular-member`,
    MYPAGE_SETTING: `${APP_MOBILE_HOST}/customer/setting`,
    ORDER_SHEET: `${APP_MOBILE_HOST}/order/sheet`,
    ORDER_CONSULT: `${APP_MOBILE_HOST}/order/consult`,
    ORDER_NSPAY_CERT: `${APP_MOBILE_HOST}/native/order-nspay-cert`,
    CART_LIST: `${APP_MOBILE_HOST}/order/cart`,
    SEARCH: `${APP_MOBILE_HOST}/native/search`
  },
  STORAGE_KEY: {
    LOGIN_REDIRECT_PATH: 'loginRedirectPath', // 쿠키저장할 로그인 후 이동할 URL정보(router path)
    SIMPLE_LOGIN_PATH: 'simpleLoginPath', // simple login path
    LOGIN_TYPE: 'loginType', // 로그인 타입
    AUTO_LOGIN_YN: 'autoLoginYn', // 쿠키저장할 자동로그인 여부
    AUTO_LOGIN_ID: 'autoLoginId', // 쿠키저장할 자동로그인 ID
    AUTO_LOGIN_PW: 'autoLoginPw', // 쿠키저장할 자동로그인 PW
    AUTO_ENT_FLAG: 'autoEntFlag', // 쿠키저장할 자동로그인 entFlag(NAVER, FACEBOOK, FAYCO, KAKAO)
    AUTO_ENT_USER_ID: 'autoEntUserId', // 쿠키저장할 자동로그인 entUserId(NAVER, FACEBOOK, FAYCO, KAKAO)
    AUTO_ENT_REFRESH_TOKEN: 'autoEntRefreshToken', // 쿠키저장할 자동로그인 토큰(NAVER, FACEBOOK, FAYCO, KAKAO)
    AUTO_ENT_USER_INFO: 'autoEntUserInfo', // 쿠키저장할 자동로그인 정보(NAVER, FACEBOOK, FAYCO, KAKAO)
    VIEW_PRODUCT_NUMBER: 'viewProductNumber', // 쿠키저장할 최근본 상품 넘버
    ORDER_PARAMS: 'orderParams', // 주문/결제 화면으로 넘길 쿠키저장할 파라미터
    PRODUCT_DETAIL_PATH: 'productDetailPath', // 성인인증 후 상세로 갈 url
    GOING_INVOKE: 'goingInvoke', // 회원가입 완료페이지에 넘길 쿠키저장할 파라미터
    PUSH_UUID: 'pushUUID',
    PUSH_YN: 'pushYn' // PUSH UUID // PUSH UUID
  },
  CONSTANTS: {
    VIEW_HISTORY: 'viewhistory',
    CART_LIST: 'cartList',
    MYPAGE: 'mypage',
    PRODUCT_DETAIL: 'productDetail',
    SETTING: 'setting'
  }
}

export default NATIVE_CONST
