/**
 * iOS 여부
 *
 * @return {Boolean} iOS 여부
 */
function isiOS () {
  return /iP(hone|od|ad)/.test(navigator.platform)
}

export default isiOS
