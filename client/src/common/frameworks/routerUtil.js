// 라우터 유틸
import VueRouter from 'vue-router'
import router from '@/router'
import nativeUtil from '@frameworks/nativeUtil'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import NATIVE_CONST from '@constants/framework/native'

const routerUtil = {
  /**
   * history back
   *
   */
  back: () => {
    if (isOsApp() && router.history.current.fullPath.indexOf('/order/list#popup') > -1) { // APP
      router.go(-1)
    } else if (isOsApp() && router.history.current.name === 'mypageOrderList') { // APP
      router.replace({
        name: 'mypageMain'
      })
    } else if (isOsApp()) { // APP
      localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH)
      nativeUtil.goBack()
    } else { // WEB
      router.back()
    }
  },
  /* 라우터 이동 간 발생하는 오류를 global하게 핸들링하기 위해 작성
   * 원본 코드 : https://gist.github.com/bponomarenko/253c64d355373b8e7afccc11581b240a
   *
   * This shim adds support for onAbort global hook (similar to onError by behavior), which allows to
   * register callbacks for aborted navigations globally.
   * At the moment, library doesn't support this api out of the box. This solution is based on workaround
   * proposed in https://github.com/vuejs/vue-router/issues/3157 ticket.
   */
  onRouterAbortShim () {
    const abortCallbacks = []

    // Registers onAbort callback
    VueRouter.prototype.onAbort = callback => {
      abortCallbacks.push(callback)
    }

    const processAbortCallbacks = () => {
      abortCallbacks.forEach(callback => {
        callback()
      })
    }

    // "router.history" is undocumented api, but it is the only way to handle aborted navigations as of now
    const historyTransitionTo = router.history.constructor.prototype.transitionTo

    // This method will be called for both "router.push" and "router.replace" methods under the hood
    router.history.constructor.prototype.transitionTo = function (location, onComplete, onAbort) {
      return historyTransitionTo.call(this, location, onComplete, async error => {
        processAbortCallbacks()
        if (onAbort) {
          const message = error.message
          if (message.startsWith('Redirected') && message.endsWith('via a navigation guard.')) {
            // (주로) 로그인 필요 페이지를 비 로그인 상태에서 접근 시 로그인 페이지로 이동하며 발생하는 오류 무시
          } else if (message.includes('Avoided redundant navigation to current location')) {
            // 동일 경로로 이동할 때 발생하는 오류 무시
          } else {
            onAbort(error)
          }
        }
      })
    }
  }
}

export default routerUtil
