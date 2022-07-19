// 쿠키 유틸
const cookieUtil = {
  /**
   * 쿠키 가져오기
   *
   * @param {string} name (필수) 쿠키 이름
   * @returns {string} 쿠키 이름에 대한 값을 반환. 없는 경우에는 ""를 반환.
   */
  getCookie: name => {
    const arg = `${name}=`
    const alen = arg.length
    const clen = document.cookie.length
    let i = 0
    while (i < clen) {
      const j = i + alen
      if (document.cookie.substring(i, j) === arg) {
        return cookieUtil.getCookieVal(j)
      }
      i = document.cookie.indexOf(' ', i) + 1
      if (i === 0) {
        break
      }
    }
    return ''
  },
  /**
   * 쿠키 저장
   *
   * @param {string} name (필수) 쿠키 이름
   * @param {string} value (필수) 쿠키 값
   * @param {string} [expires] (선택) 쿠키의 유효 일
   * @param {string} [path='/'] (선택) path
   * @param {string} [domain=''] (선택) 도메인
   * @param {string} [secure=''] (선택) 보안옵션
   */
  setCookie: (name, value, expires, path = '/', domain = '', secure = '') => {
    document.cookie = `${name}=${escape(value)
                        }${(expires) ? `; expires=${expires}` : ''
                        }${(path) ? `; path=${path}` : ''
                        }${(domain) ? `; domain=${domain}` : ''
                        }${(secure) ? '; secure' : ''}`
  },
  /**
   * 쿠키 삭제
   *
   * @param {String} name (필수) 삭제할 쿠키 이름
   * @param {string} [path='/'] (선택) path
   * @param {string} [domain=''] (선택) 도메인
   */
  deleteCookie: (name, path = '/', domain = '') => {
    if (cookieUtil.getCookie(name)) {
      const pathStr = path ? `; path=${path}` : ''
      const domainStr = domain ? `; domain=${domain}` : ''
      document.cookie = `${name}=${pathStr}${domainStr}; expires=Thu, 01-Jan-70 00:00:01 GMT`
    }
  },
  /**
   * 쿠키를 저장할 때 필요한 적합한 형식의 유효기간을 반환
   *
   * @param {number} days (필수) 쿠키가 유효할 일 (예를 들어 3 일 동안 유효해야 하면 3을 입력)
   * @param {number} hours (필수) 쿠키가 유효할 시간 (예를 들어 2 시간 동안 유효해야 하면 2를 입력)
   * @param {number} minutes (필수) 쿠키가 유효할 분 (예를 들어 30 분 동안 유효해야 하면 30을 입력)
   * @returns {string} 쿠키 유효기간
   */
  getExpDate: (days, hours, minutes) => {
    const expDate = new Date()
    if (typeof days === 'number' && typeof hours === 'number' && typeof minutes === 'number') {
      expDate.setDate(expDate.getDate() + Number(days))
      expDate.setHours(expDate.getHours() + Number(hours))
      expDate.setMinutes(expDate.getMinutes() + Number(minutes))
    }
    return expDate.toGMTString()
  },
  /**
   * 쿠키 값을 읽을 때 사용하는 보조 함수
   *
   * @param {object} offset
   * @returns
   */
  getCookieVal: offset => {
    let endstr = document.cookie.indexOf(';', offset)
    if (endstr === -1) {
      endstr = document.cookie.length
    }
    return unescape(document.cookie.substring(offset, endstr))
  }
}

export default cookieUtil
