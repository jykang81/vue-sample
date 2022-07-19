/**
 * parameter string을 JSON Object로 변환
 *
 * @param {String} data
 * @returns {Object} JSON Object
 */
function serializeToObject (data) {
  if (typeof (data) === 'string') {
    const paramsArray = data.split('&')
    const paramsObj = {}
    for (let i = 0; i < paramsArray.length; i++) {
      const pair = paramsArray[i].split('=')
      if (pair[0]) {
        const key = decodeURIComponent(pair.shift())
        const value = pair.length > 1 ? pair.join('=') : pair[0]
        paramsObj[key] = value !== undefined ? decodeURIComponent(value) : value
      }
    }
    return paramsObj
  }
  return data
}

export default serializeToObject
