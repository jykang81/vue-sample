/**
 * JSON 데이터를 QueryString 파라미터 형식으로 변환
 *
 * @param {Obejct} params (필수) JSON Object
 * @param {boolean} [isEnc=false] (선택) URI 인코딩 여부
 * @returns {String} QueryString
 */
function objectToQueryString (params, isEnc = false) {
  return Object.keys(params).map(key => {
    const value = params[key]

    if (Array.isArray(value)) {
      return value.map(val => `${key}=${isEnc ? encodeURIComponent(val) : val}`).join('&')
    } else {
      return `${key}=${isEnc ? encodeURIComponent(value) : value}`
    }
  }).join('&')
}

export default objectToQueryString
