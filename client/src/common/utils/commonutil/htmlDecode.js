import replaceAll from '@utils/commonutil/replaceAll'

/**
 * HTML Decode
 *
 * @param {String} str 디코딩 대상 HTML
 * @returns {String} 디코딩된 HTML
 */
function htmlDecode (str) {
  if (typeof str !== 'string') {
    return
  }

  let strReturn = String(str)
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')

  if (strReturn.includes('&gt;') ||
  strReturn.includes('&lt;') ||
  strReturn.includes('&#39;') ||
  strReturn.includes('&quot;') ||
  strReturn.includes('&amp;')) {
    strReturn = replaceAll(strReturn, '&gt;', '>')
    strReturn = replaceAll(strReturn, '&lt;', '<')
    strReturn = replaceAll(strReturn, '&#39;', "'")
    strReturn = replaceAll(strReturn, '&quot;', '"')
    strReturn = replaceAll(strReturn, '&amp;', '&')
  }
  return strReturn
}

export default htmlDecode
