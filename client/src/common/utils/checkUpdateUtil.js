import axios from 'axios'
import CONST from '@/common/constants/framework/framework'
import localStorageUtil from '@frameworks/localStorageUtil'

const checkUpdateUtil = {
  /**
   * Vue 실행시 최초 'index.html'에 대한 LastModified 값 LocalStorage에 저장 처리
   */
  saveLatest () {
    axios.head('/index.html').then(response => {
      const lastModified = response.headers[CONST.UPDATE.KEY.SEPARATOR]
      localStorageUtil.set(CONST.UPDATE.KEY.SEPARATOR, lastModified)
    })
  },
  /**
   * 업데이트 체크 카운트를 0으로 초기화
   */
  clearCount () {
    localStorageUtil.set(CONST.UPDATE.KEY.COUNT, 0)
  },
  /**
   * 카운트 증감 처리
   */
  setCount () {
    let count = localStorageUtil.get(CONST.UPDATE.KEY.COUNT)
    if (count !== undefined) {
      localStorageUtil.set(CONST.UPDATE.KEY.COUNT, ++count)
    }
  },
  /**
   * 현재 카운트 가져오기
   */
  getCount () {
    return localStorageUtil.get(CONST.UPDATE.KEY.COUNT)
  },
  /**
   * 최초 요청시간 초기화
   */
  clearTime () {
    localStorageUtil.set(CONST.UPDATE.KEY.TIME, undefined)
  },
  /**
   * 최초 요청 현재시간 설정
   */
  setCurrentTime () {
    localStorageUtil.set(CONST.UPDATE.KEY.TIME, new Date().getTime())
  },
  /**
   * 마지막 요청시간 가져오기
   */
  getLastRequestTime () {
    return localStorageUtil.get(CONST.UPDATE.KEY.TIME)
  },
  /**
   * 마지막 요청시간과 비교할 현재시간 가져오기
   */
  getCurrentCompareTime () {
    const currentTime = new Date()
    currentTime.setSeconds(currentTime.getSeconds() - CONST.UPDATE.MAXIMUM_WAIT_TIME)
    return currentTime.getTime()
  },
  /**
   * LocalStorage에 저장된 LastModified값과 최신 값을 비교하여 업데이트(새로고침) 처리
   *
   * @param {string} type 업데이트 체크 방식 `CONST.UPDATE.CHECK_TYPE.COUNT`, `CONST.UPDATE.CHECK_TYPE.TIME`
   */
  check (type) {
    if (type === CONST.UPDATE.CHECK_TYPE.COUNT) {
      const count = checkUpdateUtil.getCount()
      if (count !== undefined) {
        if (count > CONST.UPDATE.MAXIMUM_COUNT) {
          return
        }
      }
    } else if (type === CONST.UPDATE.CHECK_TYPE.TIME) {
      const lastRequestTime = checkUpdateUtil.getLastRequestTime()
      if (lastRequestTime !== 'undefined') {
        const compareTime = checkUpdateUtil.getCurrentCompareTime()
        if (lastRequestTime > compareTime) {
          return
        } else {
          checkUpdateUtil.setCurrentTime()
        }
      }
    }

    axios.head('/index.html').then(response => {
      const LatestLastModified = localStorageUtil.get(CONST.UPDATE.KEY.SEPARATOR)
      const lastModified = response.headers[CONST.UPDATE.KEY.SEPARATOR]

      if (type === CONST.UPDATE.CHECK_TYPE.COUNT) {
        checkUpdateUtil.setCount()
      } else if (type === CONST.UPDATE.CHECK_TYPE.TIME) {
        const lastRequestTime = checkUpdateUtil.getLastRequestTime()
        if (lastRequestTime === 'undefined') {
          checkUpdateUtil.setCurrentTime()
        }
      }

      // 저장된 값이 없을 경우
      if (lastModified !== undefined) {
        // (업데이트필요) 저장된 값과 최신값이 다른 경우
        if (LatestLastModified !== lastModified) {
          localStorageUtil.set(CONST.UPDATE.KEY.SEPARATOR, lastModified)
          if (window && window.location && window.location.reload) {
            window.location.reload()
          }
        }
      } else {
        checkUpdateUtil.saveLatest()
      }
    })
  }
}

export default checkUpdateUtil
