/**
 * HTML Encode
 *
 * @param {*} str (필수) 인코딩 대상 HTML
 * @returns {String} 인코딩된 HTML
 */
function htmlEncode (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default htmlEncode
