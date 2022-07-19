import insertCommas from '@utils/commonutil/insertCommas'

/**
 * 금액을 한글로 변환
 *
 * @param {string} number (필수) 한글로 변환할 금액
 * @returns {string} 한글로 변환된 금액
 */
function getHangulPrice (number) {
  const numStr = String(number).replace(/,/g, '')
  let overManStr = '' // 한글로 변환된 만 단위 이상 금액
  let underManStr = '' // 한글로 변환된 만 단위 미만 금액
  let numberUnderMan = '' // 만 단위 미만 금액

  // 최대 단위가 만 단위라 만 단위 이상 금액은 콤마 처리후 '만' 문자열 붙여줌
  const numberIndex = numStr.length
  const manIndex = numberIndex - 4
  if (manIndex > 0) { // 금액이 만 단위 이상이면
    overManStr = `${insertCommas(numStr.substr(0, manIndex))}만 `
    numberUnderMan = numStr.substr(manIndex, numberIndex)
  } else { // 금액이 만 단위 미만이면
    numberUnderMan = numStr
  }

  // 만 단위 미만은 1의 자리 부터 한 자리씩 단위를 붙여줌.
  const underManLength = numberUnderMan.length
  for (let i = underManLength - 1; i >= 0; i--) {
    const digit = numberUnderMan[i]
    // 숫자가 0 이면 생략 (0원 일때만 예외)
    if ((underManLength === 1 && digit === '0') || digit !== '0') {
      underManStr = `${digit}${['', '십', '백', '천'][underManLength - i - 1]} ${underManStr}`
    }
  }

  return String(overManStr + underManStr).trim()
}

export default getHangulPrice
