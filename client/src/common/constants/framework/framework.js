// framework 상수 정의
const CONST = {
  API_HOST: process.env.VUE_APP_API_HOST,
  API_URL: `${process.env.VUE_APP_API_HOST}/webapp/wcs/stores/servlet`,
  MOBILE_HOST: process.env.VUE_APP_MOBILE_HOST,
  PC_HOST: process.env.VUE_APP_PC_HOST,
  NSMALL_API_HOST: process.env.VUE_APP_NSMALL_API_HOST,
  NSMALL_API_COMMON_PATH: process.env.VUE_APP_NSMALL_API_COMMON_PATH,
  NSMALL_API_URL: process.env.VUE_APP_NSMALL_API_HOST + process.env.VUE_APP_NSMALL_API_COMMON_PATH,
  NSMALL_API_MARKETING_PUSH_PATH: '/marketing-push',
  NSMALL_API_MARKETING_PUSH_VERSION: '/v1',
  CIPHER_ENC_KEY: process.env.VUE_APP_CIPHER_ENC_KEY,
  CIPHER_SALT: process.env.VUE_APP_CIPHER_SALT,
  CIPHER_IV: process.env.VUE_APP_CIPHER_IV,
  DELIVERY_SECRET_TOKEN: process.env.VUE_APP_DELIVERY_SECRET_TOKEN,
  LOG: {
    STREAM: {
      URL: {
        // BASE: 'https://7uz9s9v44m.execute-api.ap-northeast-2.amazonaws.com/dev/streams/nsm-dev-mobile-web-log',
        BASE: process.env.VUE_APP_LOG_HOST,
        SINGLE: '/record'
      }
    },
    TYPE: {
      ERROR: 'ERROR',
      RESPONSE: 'RESPONSE'
    },
    MESSAGE: {
      VALID: {
        TYPE_NOT_VALID: 'LogUtil validate: Type is not valid',
        ARGS_LENGTH_ZERO: 'LogUtil validate: Arguments length is zero'
      },
      REQUEST: {
        ERROR: 'Axios interceptors: RequestError',
        NOT_READY: 'LogUtil sendRecord: Send data is not ready',
        LOCAL_MODE: '[NSLog] The current mode is local. it does not send logs.'
      },
      RESPONSE: {
        ERROR: 'Axios interceptors: ResponseError',
        WCSERROR: 'WCSERROR'
      },
      CUSTOMER: {
        JOIN_API_FAILED: 'JoinAPIFailed',
        JOIN_EMAIL_VERIFY_FAILED: 'JoinEmailVerifyFailed',
        JOIN_PHONE_VERIFY_DUPPLICATION: 'JoinPhoneVerifyDupplication',
        JOIN_PHONE_TV_MEMBER: 'JoinPhoneTVMember'
      },
      ORDER: {
        CANCEL: {
          NO_PRODUCT_DETAIL: 'NoProductDetail'
        }
      }
    }
  },
  IS_SERVER_STATE: process.env.VUE_APP_IS_SERVER_STATE,
  IS_DEV_MODE: process.env.VUE_APP_IS_DEV_MODE === 'true', // (운영상태 : false, 개발상태 : true)
  IS_DEV_LOG: process.env.VUE_APP_IS_DEV_LOG === 'true', // (로그를 출력 : true, 출력하지 않음 : false)
  IS_ALLOW_LOG: process.env.VUE_APP_IS_ALLOW_LOG === 'true', // Kinesis Log 적재 여부 (로그를 적재 : true, 로그를 미적재 : false)
  IS_TEST_REPORT: process.env.VUE_APP_IS_TEST_REPORT === 'true', // vue.config.js 빌드 파일에서 동적으로 변경. 추후 test 용도로 사용
  IS_ALLOW_SUCCESS_LOG: process.env.VUE_APP_IS_ALLOW_SUCCESS_LOG === 'true', // WCS API 성공로그 적재 여부
  IS_LOCAL_MODE: process.env.VUE_APP_IS_LOCAL_MODE === 'true', // vue.config.js 빌드 파일에서 동적으로 변경.
  MOBILE_NSMALL_PATH: process.env.VUE_APP_MOBILE_NSMALL_PATH,
  NS_IMAGE_CUST_SRV: '//image.nsmall.com/ec_custimages/',
  NS_IMAGE_EXHI_SRV: '//image.nsmall.com/ec_comimages/nsupload/xplat/',
  NS_IMAGE: process.env.VUE_APP_NS_IMAGE,
  NS_IMAGE_PRODUCT: `${process.env.VUE_APP_NS_IMAGE}/itemimg`,
  NS_IMAGE_CATE: '//image.nsmall.com/ec_comimages/nsupload/espot/images/mobile/icons/cate/',
  LIVE: {
    url: {
      etc: 'https://livestream.nsmall.com:443/IPHONE/nsmallMobile.m3u8',
      ios: 'https://livestream.nsmall.com:443/IPHONE/nsmallMobile.m3u8',
      android: 'https://livestream.nsmall.com:443/IPHONE/nsmallMobile.m3u8',
      shopPlus: 'https://shoppstream.nsmall.com:443/IPHONE/mobile.m3u8',
      thinglive: 'https://shopplaylive.nsmall.com:443/IPHONE/live.m3u8'
    }
  },
  NSTALK_TVLIVE_PATH: process.env.VUE_APP_NSTALK_TVLIVE_PATH,
  NSTALK_THINGLIVE_PATH: process.env.VUE_APP_NSTALK_THINGLIVE_PATH,
  UPDATE: {
    CHECK_TYPE: {
      NONE: 'NONE',
      TIME: 'TIME',
      COUNT: 'COUNT'
    },
    KEY: {
      SEPARATOR: 'last-modified',
      COUNT: 'update-check-request-count',
      TIME: 'update-check-request-time'
    },
    MAXIMUM_COUNT: 5,
    MAXIMUM_WAIT_TIME: 5
  },
  IS_CIPHER_ON_STORAGE: process.env.VUE_APP_IS_CIPHER_ON_STORAGE === 'true',
  API_ERROR_MESSAGES: [
    '사용할 수 없는 문자 오류', '{0}에는 특수문자를 사용할 수 없습니다.'
  ],
  CATEGORY_ID_EMPLOYEE: process.env.VUE_APP_CATEGORY_ID_EMPLOYEE,
  CATEGORY_ID_HARIM: process.env.VUE_APP_CATEGORY_ID_HARIM,
  API_ERROR_MESSAGE_KEYS: [
    '_ERR_DIDNT_LOGON', // CMN3101E {0}(으)로 인해 시스템을 사용할 수 없습니다.
    '_ERR_INVALID_COOKIE' // 사용자에 대해 올바르지 않은 쿠키가 수신되었습니다. 다른 사용자가 해당 로그인 ID를 사용하고 있을 수 있습니다.
  ]
}

const APP_CONFIG = {
  LOCAL: 'LOCAL',
  DEV: 'DEV',
  TEST: 'TEST',
  PROD: 'PROD',
  ACTIVE_PROFILE: CONST.IS_SERVER_STATE,
  getActiveProfile () {
    return APP_CONFIG.ACTIVE_PROFILE
  },
  isActiveProfile (state) {
    return APP_CONFIG.ACTIVE_PROFILE === state
  },
  isLocal () {
    return APP_CONFIG.ACTIVE_PROFILE === APP_CONFIG.LOCAL
  },
  isDev () {
    return APP_CONFIG.ACTIVE_PROFILE === APP_CONFIG.DEV
  },
  isTest () {
    return APP_CONFIG.ACTIVE_PROFILE === APP_CONFIG.TEST
  },
  isProd () {
    return APP_CONFIG.ACTIVE_PROFILE === APP_CONFIG.PROD
  }
}

export { CONST as default, APP_CONFIG }
