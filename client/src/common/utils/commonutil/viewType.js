import isOsApp from '@utils/commonutil/isOsApp'

/**
 * view type 반환
 * @returns {String} view type (android|ios|androidweb|iosweb|other)
 */
function viewType () {
  const uagent = navigator.userAgent.toLocaleLowerCase()

  if (isOsApp()) {
    if (uagent.search('android') > -1) {
      return 'android'
    } else if (uagent.search('iphone') > -1 || uagent.search('ipad') > -1) {
      return 'ios'
    } else {
      return 'other'
    }
  } else {
    if (uagent.search('android') > -1) {
      return 'androidweb'
    } else if (uagent.search('iphone') > -1 || uagent.search('ipod') > -1 || uagent.search('ipad') > -1) {
      return 'iosweb'
    } else {
      return 'other'
    }
  }
}

export default viewType
