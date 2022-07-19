
import COMM_CONST from '@constants/framework/constants'
import nsaxios from '@frameworks/axiosUtil'
import cookieUtil from '@frameworks/cookieUtil'
import {
  isNull,
  isOsApp
} from '@utils/commonutil/commonUtil'
import {
  getNowTime,
  calcTime
} from '@frameworks/dateutil/dateUtil'
import localStorageUtil from '@frameworks/localStorageUtil'

const externalUtil = {
  /**
   * 동적 스크립트 호출
   *
   * @param {string} source 호출할 스크립트 URL
   * @param {element} [beforeEl] 스크립트를 삽입할 부모 노드
   * @param {boolean} [async=true] async
   * @param {boolean} [defer=true] defer
   * @returns {promise}
   */
  getScript: (source, beforeEl, async = true, defer = true) => {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script')
      script.async = async
      script.defer = defer
      const prior = beforeEl || document.getElementsByTagName('script')[0] || document.getElementsByTagName('body')[0]

      const onloadHander = (_, isAbort) => {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
          script.onload = null
          script.onreadystatechange = null
          script = undefined

          if (isAbort) {
            reject(new Error('getScript Error'))
          } else {
            resolve()
          }
        }
      }

      script.onload = onloadHander
      script.onreadystatechange = onloadHander

      script.src = source
      prior.parentNode.insertBefore(script, prior)
    })
  },
  /**
   * 그룹사 임직원 전용 상품 접근 가능여부 체크
   *
   * @param {Array<Object>} prdList 체크 할 상품 리스트
   * @param {Function} callback 콜백함수
   * @returns 접근 불가 상품 존재시 : 해당 상품 리스트, 접근 불가 상품 미존재 : false
   */
  chkStaffOnlyPrd: (prdList, callback) => {
    if (!prdList && !callback && typeof callback !== 'function') {
      return false
    }
    const params = {
      productList: JSON.stringify(prdList.map(product => ({
        orderItemsId: product.orderItemsId,
        catentryId: product.catentryId
      })))
    }
    nsaxios.post('SeparateStaffOnlyProducts', params, data => {
      let retData = false
      if (data && !data.authorizedStaff) {
        if (data.staffOnlyProductList && data.staffOnlyProductList.length) {
          retData = data.staffOnlyProductList
        }
      }
      callback(retData, data.staffBnft)
    })
  },
  /**
   * 외부 link Page에서 서비스 호출 시 중계페이지에서 외부 link Page에서 보낸 Parameters를 parsing
   *
   * @param {String} nowAddress URI
   * @returns {Object} 외부 link Page의 parameters
   */
  getBroadCastParam: nowAddress => {
    const param = {}
    let varName = ''
    let value = ''
    let parameters = ''
    if (nowAddress.indexOf('?') !== -1) {
      parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1, nowAddress.length)).split('&')
      for (let i = 0; i < parameters.length; i++) {
        if (parameters[i] && parameters[i].indexOf('=') > -1) {
          varName = decodeURIComponent(parameters[i].split('=')[0])
          value = decodeURIComponent(parameters[i].split('=')[1])
          if (varName === 'referrer' && parameters[i].split('=').length > 2 && !isNull(parameters[i].split('=')[2])) {
            value += `=${decodeURIComponent(parameters[i].split('=')[2])}`
          }
          param[varName] = value
        }
      }
    }
    return param
  },
  /**
   * cocd 시간 체크 후 3시간이 지났으면 default cocd 변경
   *
   */
  cocdTimeCheck: () => {
    let cocd = COMM_CONST.getCocd()

    // 110이면 기본 값이기 때문에 함수 종료
    if (cocd === '110' || cocd === '50000') {
      return
    }

    // co_cd_gate 관련 로직 삭제

    const cocdLastTime = localStorageUtil.get('cocdTimeCheck')

    // cocdTimeCheck 없으면 시간 설정 후 함수 종료
    if (isNull(cocdLastTime)) {
      localStorageUtil.set('cocdTimeCheck', getNowTime())
      return
    }

    // cocdLastTime 값이 세팅되어 있고 3시간 경과 시 초기화
    if (!calcTime(cocdLastTime, 3, 0, 0, 'after')) {
      localStorageUtil.del('cocdTimeCheck') // 체키 시간 지움
      cookieUtil.deleteCookie('co_cd', null, '.nsmall.com') // 쿠키 cocd 지움
      cocd = COMM_CONST.getWebAppDefaultCocd(isOsApp()) // 기본 co_cd 으로 세팅
      COMM_CONST.setCocd(cocd)
      return
    }

    // 110이 아니면 시간 다시 세팅
    if (cocd === '110' || cocd === '50000') {
      localStorageUtil.set('cocdTimeCheck', getNowTime())
    }
  },
  /**
   * URI parameter에서 key & value를 추출하여 객체 형태로 반환한다.
   * @param {String} uri URI 문자열
   * @returns {Object} 파라미터 객체
   */
  deriveParametersFromURI (uri) {
    let paramObject = null
    let queryString = ''

    if (uri.indexOf('?') > -1) {
      const queryStartOffset = uri.indexOf('?')
      queryString = uri.substring(queryStartOffset)
    }

    paramObject = this.getBroadCastParam(queryString)

    return paramObject
  },
  /**
   * parameter 오브젝트에서 값을 꺼내 GA 관련 값을 설정한다
   * @param {Object} paramObject GA 관련 값이 저장되어있는 파라미터 객체
   * @param {String} [url] 필요할 경우 url 명시
   */
  setGA360Values (paramObject, url) {
    // param invalidation
    if (!paramObject || !paramObject.referrer) {
      return
    }

    const gaReferrer = paramObject.referrer
    const gaCampaignSource = paramObject.utm_source
    const gaCampaignMedium = paramObject.utm_medium
    const gaCampaignName = paramObject.utm_campaign
    const gaCampaignContent = paramObject.utm_content
    const gaCampaignKeyword = paramObject.utm_term
    const gaNativeUrl = url || location.pathname
    const gaCocdValue = paramObject.co_cd

    if (gaCocdValue !== undefined) {
      localStorageUtil.set('GA.co_cd', gaCocdValue)
    }

    if (gaReferrer !== undefined) {
      localStorageUtil.set('GA.ga_re', gaReferrer)
    }
    if (gaCampaignSource !== undefined) {
      localStorageUtil.set('GA.utm_s', gaCampaignSource)
    }
    if (gaCampaignMedium !== undefined) {
      localStorageUtil.set('GA.utm_m', gaCampaignMedium)
    }
    if (gaCampaignName !== undefined) {
      localStorageUtil.set('GA.utm_ca', gaCampaignName)
    }
    if (gaCampaignContent !== undefined) {
      localStorageUtil.set('GA.utm_co', gaCampaignContent)
    }
    if (gaCampaignKeyword !== undefined) {
      localStorageUtil.set('GA.utm_t', gaCampaignKeyword)
    }
    if (gaCampaignSource !== undefined) {
      localStorageUtil.set('GA.ga_url', gaNativeUrl)
    }
  },
  /**
   * cocd 체크 및 cocd 갱신
   * @param {Object} [paramObject] 쿼리스트링을 key - value 형태로 바꾼 파라미터 객체.
   */
  updateCocd (paramObject = {}) {
    let cocd = cookieUtil.getCookie('co_cd') // cocd 값 체크. 없을 경우 '' 반환

    if (!isNull(paramObject.co_cd)) {
      cocd = paramObject.co_cd
    }

    // 참조할 cocd 있을 경우
    if (cocd !== '') {
      // 네이버광고쇼핑 처리
      if (paramObject.nv_ad === 'pla') {
        COMM_CONST.setCocd('134')
      } else {
        COMM_CONST.setCocd(cocd)
      }
    } else { // 참조할 cocd 없을 경우
      // 기본 app web cocd값 구분
      const defaultCocd = COMM_CONST.getWebAppDefaultCocd(isOsApp())

      // 기존에 cocd값이 있는 경우에는 유지, 없는 경우엔 기본값으로 설정
      if (COMM_CONST.getCocd() === defaultCocd) {
        COMM_CONST.setCocd(defaultCocd)
      }

      // search.naver.com 처리
      if (isOsApp() === false) {
        if (document.referrer.indexOf('search.naver') !== -1 &&
        COMM_CONST.getCocd() === COMM_CONST.DEFAULT_PARAMS.webCocd) {
          COMM_CONST.setCocd('132')
        }
      }

      this.cocdTimeCheck()
    }
  }
}

export default externalUtil
