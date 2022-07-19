import COMM_CONST from '@constants/framework/constants'
import cookieUtil from '@frameworks/cookieUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

/**
 * 앱 재시작 (1회만 시도)
 */
const onReloadApp = () => {
  if (window.location.hash !== '#retry') {
    window.location.hash = '#retry'

    sessionStorageUtil.clear()

    cookieUtil.setCookie('co_cd', COMM_CONST.getCocd(), null, '/', 'nsmall.com') // 현재 co_cd 쿠키에 저장

    window.location.reload()
  }
}

export default onReloadApp
