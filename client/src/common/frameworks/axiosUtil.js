import axios from 'axios'
import {
  parse,
  stringify
} from 'qs'
import nslog from '@frameworks/logUtil'
import messageUtil from '@frameworks/messageUtil'
import COMM_CONST from '@constants/framework/constants'
import CONST from '@constants/framework/framework'
import MESSAGES from '@constants/framework/messages'
import loginUtil from '@utils/loginUtil'
import $store from '@/vuex'
import errorUtil from '@frameworks/errorUtil'
import checkUpdateUtil from '@/common/utils/checkUpdateUtil'
import {
  isOsApp,
  onReloadApp,
  sleep
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'

/**
 * axios request config (https://github.com/axios/axios#request-config)
 * @typedef {object} RequestConfig
 * @property {string} url
 * @property {string} method
 * @property {object} [headers]
 * @property {object} [data]
 */

axios.defaults.timeout = 100000

let activeRequestCount = 0 // 통신 중인 http request 갯수
let reloadAppFlag = true // 세션 오류 발생 시 새로고침을 한 번만 수행하기 위한 flag

// 요청 인터셉터
axios.interceptors.request.use(
  config => {
    activeRequestCount++ // 통신 요청에 따라 카운트 증가
    // preLoader 열기
    $store.commit('preLoader/show')

    return config
  },
  error => {
    // [로그] 발송전 오류 로그 적재
    nslog.sendRecord(CONST.LOG.TYPE.ERROR, {
      type: CONST.LOG.MESSAGE.REQUEST.ERROR,
      message: error.message,
      trace: error.stack,
      status: '500',
      page: errorUtil.getCurrentURL(),
      view: errorUtil.getComponentName()
    })
    return Promise.reject(error)
  }
)

/**
 * API 응답 성공 사전 처리
 * @param {object} response API response
 */
async function pretreatResponseSucess (response) {
  activeRequestCount-- // 통신 종료에 따라 카운트 감소
  if (activeRequestCount === 0) { // 모든 통신이 완료된 상태에서만 preLoader 닫음
    $store.commit('preLoader/hide') // preLoader 닫기
  }

  const config = response.config
  const { url, method } = config
  let resultResponse = response

  // NS MALL API 호출인 경우 별도 처리
  if (isInternalUrl(url)) {
    resultResponse = response.data

    // API 서버로 부터 content-type이 text/html인 response를 받았을 때 에러 페이지인지 체크]
    const headers = response.headers
    const contentType = headers ? headers['content-type'] : ''
    const isHtmlResponse = contentType ? contentType.includes('text/html;') : false
    if (isHtmlResponse && resultResponse.includes('찾을 수 없는 페이지입니다.')) {
      console.error(MESSAGES.PROCEDURE_ERROR)
    }

    // API 응답 오류 대응
    if (isAPIErrorMessageKey(resultResponse.errorMessageKey) && reloadAppFlag) {
      reloadAppFlag = false

      try {
        $store.commit('preLoader/show')

        await sendLog(response)

        if (CONST.IS_SERVER_STATE === 'REAL') {
          await requestDummy()
          await sleep(2500) // API session 초기화 대기
          await requestDummy()
        } else {
          await clearSessionCookies()
          await requestDummy() // 임시 쿠키 발급
          await fetchCartCount() // 회원 쿠키 재발급
        }
      } finally {
        onReloadApp()
      }
    }

    if (resultResponse && resultResponse.constructor === Object) {
      resultResponse.isSuccessful = response.status === 200
    }

    const data = parse(config.params || config.data)
    // 개발 환경에서 응답 결과 로깅
    if (CONST.IS_DEV_LOG && !CONST.IS_TEST_REPORT) {
      // 로깅 포맷을 위해 요청 파라미터를 Object로 변환
      console.groupCollapsed(url.replace(`${CONST.API_URL}/`, ''))
      console.log('request', {
        method,
        url,
        data
      })
      console.log('response', resultResponse)
      console.groupEnd()
    }

    // 응답 로그 전송
    if (CONST.IS_ALLOW_SUCCESS_LOG) {
      nslog.sendRecord(CONST.LOG.TYPE.RESPONSE, {
        url,
        request: data,
        response: resultResponse,
        status: response.status,
        page: errorUtil.getCurrentURL(),
        view: errorUtil.getComponentName()
      })
    }
  }

  return resultResponse
}

/**
 * API 응답 에러 사전 처리
 * @param {object} error 에러
 */
function pretreatResponseError (error) {
  activeRequestCount-- // 통신 종료에 따라 카운트 감소
  // preLoader 닫기
  if (activeRequestCount === 0) { // 모든 통신이 완료된 상태에서만 preLoader 닫음
    $store.commit('preLoader/hide')
  }

  // 로컬, 개발에서 에러 로그 출력
  if (CONST.IS_DEV_LOG) {
    if (isInternalUrl(error.config.url) && error.message === 'Network Error') {
      if (isOsApp()) {
        const params = {
          msg: 'API 서버 재시작 중...',
          ok: '확인'
        }
        nativeUtil.showAlert(JSON.stringify(params), '')
      } else {
        messageUtil.error('API 서버 재시작 중...')
      }
      console.error('API 서버 재시작 중...')

      return
    }

    messageUtil.error(error.message)
    console.error(error.message)
  }

  // [로그] 발송후 오류 로그 적재
  nslog.sendRecord(CONST.LOG.TYPE.ERROR, {
    type: CONST.LOG.MESSAGE.RESPONSE.ERROR,
    message: error.message,
    trace: error.stack,
    status: '500',
    page: errorUtil.getCurrentURL(),
    view: errorUtil.getComponentName()
  })

  return Promise.reject(error)
}

// 응답 인터셉터
axios.interceptors.response.use(
  pretreatResponseSucess,
  pretreatResponseError
)

/**
 * NS MALL API 호출 공통 파라미터 설정
 * @param {object} data 요청 파라미터
 * @param {string} url API tranId
 */
const setWCSCommonParameter = (data, url) => {
  data.accptPath = COMM_CONST.getAcceptPath()
  data.accptPathCd = COMM_CONST.getAcceptPath()
  data.req_co_cd = COMM_CONST.getCocd()
  // 슬롯매장 API이며 사내특가매장, 하림특가매장이 아닐때는 userId 파라미터 제외 (슬롯매장 조회 API가 userId 별로 캐시되는 이슈 처리)
  const isSeteUserIdParam = url !== 'NSSlotShopCmd' || [CONST.CATEGORY_ID_EMPLOYEE, CONST.CATEGORY_ID_HARIM].includes(data.topCategoryId)
  if (isSeteUserIdParam) {
    data.userId = data.userId || loginUtil.userId()
  }
  data.catalogId = data.catalogId || COMM_CONST.getDefaultCatalogId()
}

/**
 * NS MALL API 호출 URL인지 여부
 * @param {string} url 호출 URL
 * @returns {boolean}
 */
const isInternalUrl = url => url.startsWith(CONST.API_URL)

/**
 * 응답값 공통 에러 발생 여부
 * @param {object} response API response
 * @returns {boolean}
 */
const didCommonErrorOccur = response => {
  const typeOfResponse = typeof response

  return typeOfResponse === 'string'
}

/**
 * 에러 발생기
 * @param {object} response API response
 */
const generateError = response => {
  const typeOfResponse = typeof response

  if (typeOfResponse === 'string') {
    CONST.API_ERROR_MESSAGES.forEach((errorMessage, index) => {
      const isErrorMessageThere = response.includes(errorMessage)

      if (isErrorMessageThere) {
        throw new Error(CONST.API_ERROR_MESSAGES[index])
      }
    })
  }
}

/**
 * 에러 처리기
 * @param {object} error
 */
const handleCommonError = (error, apiName) => {
  if (!doesCommonErrorContains(error)) {
    return
  }

  // 결제하기
  if (apiName === 'PaymentApprovalRequestCmd') {
    error.includeSpecialCharacter = true
    error.message = CONST.API_ERROR_MESSAGES[1].replace('{0}', '수령장소')
  }
  messageUtil.error(error.message, null)
}

/**
 * 공통 에러 포함여부
 * @param {object} error
 * @returns {boolean}
 */
const doesCommonErrorContains = error => {
  const errorMessage = error.message

  return CONST.API_ERROR_MESSAGES.includes(errorMessage)
}

/**
 * Request method 공통 처리
 * @param {RequestConfig} config
 * @param {function} [successHandling] 성공 callback
 * @param {function} [errorHandling] 실패 callback
 * @returns {Promise}
 */
const common = (config, successHandling, errorHandling) => {
  const apiName = config.url
  if (!config.data) {
    Promise.reject(new Error('필수 입력 parameter가 부족합니다.'))
    return
  }

  if (!(config.url.startsWith('http') || config.url.startsWith('//'))) {
    // NS MALL API 호출
    if (config.method !== 'get') {
      // NS MALL API 호출 공통 파라미터 추가
      setWCSCommonParameter(config.data, config.url)
    }
    config.url = `${CONST.API_URL}/${config.url}` // NS MALL API URL을 붙여줌
  }

  config.withCredentials = isInternalUrl(config.url)
  config[config.method === 'get' ? 'params' : 'data'] = stringify(config.data, { arrayFormat: 'repeat' })

  // axios 호출
  const resultPromise = axios(config)

  // response 핸들링을 직접 처리하는 경우
  if (successHandling) {
    return resultPromise
      .then(response => {
        if (didCommonErrorOccur(response)) {
          generateError(response)
        }

        successHandling(response)
      })
      .catch(error => {
        // 업데이트 확인
        if (!CONST.IS_LOCAL_MODE && !CONST.IS_TEST_REPORT) {
          checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.NONE)
        }

        handleCommonError(error, apiName) // 공통 에러 처리

        if (errorHandling) {
          errorHandling(error)
        } else {
          console.error(error)
          // 결제하기
          if (Object.keys(error).includes('includeSpecialCharacter')) {
            throw new TypeError(error)
          }
        }
      })
  // response 핸들링을 다음 프로세스에게 위임하는 경우
  } else {
    return resultPromise
  }
}

// axios wrapping
const nsaxios = {
  /**
   * 동시 요청 처리
   * @param {Promise[]} iterable 동시 요청할 함수
   * @param {function} successHandling 성공 callback
   * @param {function} [errorHandling] 실패 callback
   * @returns {Promise} promise
   */
  all: (iterable, successHandling, errorHandling) => {
    if (!Array.isArray(iterable)) {
      Promise.reject(new Error('첫 번째 파라미터는 배열이여야 합니다.'))
      return
    }

    if (iterable.some(obj => Object.prototype.toString.call(obj) !== '[object Promise]')) {
      Promise.reject(new Error('배열의 요소는 Promise 객체여야 합니다.'))
      return
    }

    if (typeof successHandling !== 'function') {
      Promise.reject(new Error('successHandling은 필수입니다.'))
      return
    }

    return axios.all(iterable)
      .then(axios.spread((...result) => {
        successHandling(...result)
      }))
      .catch(error => {
        if (errorHandling) {
          errorHandling(error)
        } else {
          console.error(error.message)
          messageUtil.error(error.message)
        }
      })
  },
  /**
   * GET HTTP 요청
   * @param {string} url 요청 URL. NS MALL API 호출 시는 tranId만 입력. ex) 'DetailProductViewReal'
   * @param {object} data 요청 파라미터
   * @param {function} [successHandling] 성공 callback
   * @param {function} [errorHandling] 실패 callback
   * @returns {Promise} promise
   */
  get: (url, data, successHandling, errorHandling) => common({
    method: 'get',
    url,
    data
  }, successHandling, errorHandling),
  /**
   * POST HTTP 요청
   * @param {string} url 요청 URL. NS MALL API 호출 시는 tranId만 입력. ex) 'DetailProductViewReal'
   * @param {object} data 요청 파라미터
   * @param {function} [successHandling] 성공 callback
   * @param {function} [errorHandling] 실패 callback
   * @returns {Promise} promise
   */
  post: (url, data, successHandling, errorHandling) => common({
    method: 'post',
    url,
    data
  }, successHandling, errorHandling),
  /**
   * PUT HTTP 요청
   * @param {string} url 요청 URL. NS MALL API 호출 시는 tranId만 입력. ex) 'DetailProductViewReal'
   * @param {object} data 요청 파라미터
   * @param {function} [successHandling] 성공 callback
   * @param {function} [errorHandling] 실패 callback
   * @returns {Promise} promise
   */
  put: (url, data, successHandling, errorHandling) => common({
    method: 'put',
    url,
    data
  }, successHandling, errorHandling),
  /**
   * DELETE HTTP 요청
   * @param {string} url 요청 URL. NS MALL API 호출 시는 tranId만 입력. ex) 'DetailProductViewReal'
   * @param {object} data 요청 파라미터
   * @param {function} [successHandling] 성공 callback
   * @param {function} [errorHandling] 실패 callback
   * @returns {Promise} promise
   */
  delete: (url, data, successHandling, errorHandling) => common({
    method: 'delete',
    url,
    data
  }, successHandling, errorHandling),
  /**
   * PATCH HTTP 요청
   * @param {string} url 요청 URL. NS MALL API 호출 시는 tranId만 입력. ex) 'DetailProductViewReal'
   * @param {object} data 요청 파라미터
   * @param {function} [successHandling] 성공 callback
   * @param {function} [errorHandling] 실패 callback
   * @returns {Promise} promise
   */
  patch: (url, data, successHandling, errorHandling) => common({
    method: 'patch',
    url,
    data
  }, successHandling, errorHandling),
  /**
   * OPTION HTTP 요청
   * @param {string} url 요청 URL. NS MALL API 호출 시는 tranId만 입력. ex) 'DetailProductViewReal'
   * @param {object} data 요청 파라미터
   * @param {function} [successHandling] 성공 callback
   * @param {function} [errorHandling] 실패 callback
   * @returns {Promise} promise
   */
  options: (url, data, successHandling, errorHandling) => common({
    method: 'options',
    url,
    data
  }, successHandling, errorHandling),
  /**
   * axios(config)
   * @param {RequestConfig} config
   */
  request: config => axios(config)
}

/**
 * 임시 로그
 * @param {object} response
 * @returns {Promise}
 */
async function sendLog (response) {
  const tempAxios = axios.create()

  const targetURL = 'https://hook.dooray.com/services/2509989958368058757/2921769073088439315/SddokbFgRwWhCMJUB7fbJA'
  const format = {
    text: 'API 응답 오류 알림',
    botName: 'LogAlarm',
    botIconImage: 'https://nsm-dev-screenshots-bucket.s3.ap-northeast-2.amazonaws.com/icon/05.png',
    attachments: []
  }

  try {
    const { config, data, status } = response
    const { url, method, data: d, headers } = config

    const ipResponse = await tempAxios.get('https://jsonip.com/')
    const { ip } = ipResponse.data
    const environment = isOsApp() ? 'App' : 'Web'
    format.attachments.push({
      title: '클라이언트 정보',
      text: `
        환경: ${environment}
        에이전트: ${window.navigator.userAgent}
        IP: ${ip}
      `
    })

    format.attachments.push({
      title: '요청 정보',
      text: `
        url: ${url}
        method: ${method}
        headers: ${JSON.stringify(headers)}
        data: ${d}
      `
    })

    const responseInfo = {
      status,
      data
    }

    format.attachments.push({
      title: '응답 정보',
      text: `${JSON.stringify(responseInfo)}`
    })

    return tempAxios.post(targetURL, format)
  } catch {
    return Promise.resolve()
  }
}

/**
 * API 에러 메시지 key 일치 여부 반환
 * @param {string} errorMessageKey 에러 메시지 key
 * @returns {boolean}
 */
function isAPIErrorMessageKey (errorMessageKey) {
  return CONST.API_ERROR_MESSAGE_KEYS.includes(errorMessageKey)
}

/**
 * API 반복 요청
 * @param {object} response API 응답
 * @param {number} retryCount 반복 요청 횟수
 * @returns {Promise<object>|Promise<null>}
 */
// eslint-disable-next-line no-unused-vars
async function retryAPI (response, retryCount) {
  const retryAxios = axios.create()
  const { url, method, data } = response.config
  const config = {
    url,
    method,
    withCredentials: true
  }
  config[config.method === 'get' ? 'params' : 'data'] = data

  let count = 0
  let result = null

  while (count < retryCount) {
    count++

    try {
      await sleep(500)
      const requestResult = await retryAxios(config)
      const { errorMessageKey } = requestResult?.data

      console.log(`
      retryAPI
      url: ${url},
      count: ${count},
      requestResult:`, requestResult)

      if (!isAPIErrorMessageKey(errorMessageKey)) {
        result = requestResult.data
        break
      }
    } catch (error) {
      console.log('error', error)
      return result
    }
  }

  return result
}

/**
 * dummy API 요청
 * @returns {Promise}
 */
async function requestDummy () {
  const dummyAxios = axios.create()

  const config = {
    url: `https:${CONST.API_URL}/Dummy`,
    method: 'post',
    withCredentials: true
  }
  config.data = {}
  setWCSCommonParameter(config.data)
  config.data = stringify(config.data, { arrayFormat: 'repeat' })

  return await dummyAxios(config)
}

/**
 * API 서버 세션 쿠키 지우기
 * @returns {Promise}
 */
async function clearSessionCookies () {
  const tempAxios = axios.create()
  const clearConfig = {
    url: `https:${CONST.API_HOST}/nsmall/mobile/cookie/getCookie.jsp`,
    method: 'get',
    params: {
      cmd: 'clear'
    },
    withCredentials: true
  }
  try {
    return tempAxios(clearConfig)
  } catch {
    return null
  }
}

/**
 * 장바구니 갯수 조회
 * @returns {Promise}
 */
async function fetchCartCount () {
  const tempAxios = axios.create()

  const config = {
    url: `https:${CONST.API_URL}/NSBasketCountCmdReal`,
    method: 'post',
    withCredentials: true
  }
  config.data = {}
  setWCSCommonParameter(config.data)
  config.data = stringify(config.data, { arrayFormat: 'repeat' })

  try {
    return tempAxios(config)
  } catch {
    return null
  }
}

export {
  nsaxios as default,
  setWCSCommonParameter,
  doesCommonErrorContains,
  requestDummy
}
