/**
 * 핸드폰 번호 체크
 *
 * @param {String} strValue (필수) 검사 대상 핸드폰 번호
 * @returns {Boolean} 핸드폰 번호 포맷 일치 여부
 */
function isHPNo (strValue) {
  const hpNoArr = strValue.split('-')

  if (strValue.length >= 12 && hpNoArr.length === 3) {
    const case1 = ['0504', '0505', '010', '011', '016', '017', '018', '019'].includes(hpNoArr[0])
    const case2 = /^\d{3,4}$/.test(hpNoArr[1])
    const case3 = /^\d{4}$/.test(hpNoArr[2])

    if (case1 && case2 && case3) {
      return true
    }
  }

  return false
}

export default isHPNo
