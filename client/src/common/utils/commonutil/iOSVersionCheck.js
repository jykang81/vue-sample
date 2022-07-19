/**
 * TODO : 확인필요
 * iOS version return
 *
 * @returns iOS version
 */
function iOSVersionCheck () {
  return /iP(hone|od|ad)/.test(navigator.platform) ? (navigator.appVersion).replace('OS ', '').split('_').join('.') : ''
}

export default iOSVersionCheck
