import viewType from '@utils/commonutil/viewType'

/**
 * 마켓으로 이동
 *
 * @param {boolean} directMarket (선택) 마켓으로 바로 이동 여부. false인 경우 앱을 실행
 * @returns
 */
function gotoAppMarket (directMarket) {
  const _APP_INSTALL_URL_IOS = 'https://itunes.apple.com/kr/app/nshomsyoping/id405015280?mt=8'
  const _APP_EXEC_URL_IOS = 'nsmobilecert://'
  const _APP_MARKET_URL_ANDROID = 'market://details?id=com.nsmobilehub&hl=ko'
  const _APP_EXEC_URL_ANDROID = 'intent://sendurl?page=MainView#Intent;scheme=nsmall;package=com.nsmobilehub;end;'

  if (directMarket) {
    if (viewType() === 'ios' || viewType() === 'iosweb') {
      // TODO : 웹뷰 새창 열기 확인
      // WL.App.openURL(_APP_INSTALL_URL_IOS)
      window.open(_APP_INSTALL_URL_IOS, '_blank')
    } else {
      // TODO : 웹뷰 새창 열기 확인
      // WL.App.openURL(_APP_MARKET_URL_ANDROID)
      window.open(_APP_MARKET_URL_ANDROID, '_blank')
    }
  } else {
    if (viewType() === 'ios' || viewType() === 'iosweb') {
      const b = +new Date()
      setTimeout(function () {
        if (+new Date() - b < 2000) {
          // TODO : 웹뷰 새창 열기 확인
          // WL.App.openURL(_APP_INSTALL_URL_IOS)
          window.open(_APP_INSTALL_URL_IOS, '_blank')
        }
      }, 1500)

      // TODO : 웹뷰 새창 열기 확인
      // WL.App.openURL(_APP_EXEC_URL_IOS)
      window.open(_APP_EXEC_URL_IOS, '_blank')
    } else if (viewType() === 'android' || viewType() === 'androidweb') {
      // TODO : 웹뷰 새창 열기 확인
      // WL.App.openURL(_APP_EXEC_URL_ANDROID)
      window.open(_APP_EXEC_URL_ANDROID, '_blank')
    }
  }
}

export default gotoAppMarket
