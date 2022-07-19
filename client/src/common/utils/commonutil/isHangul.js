/**
 * 한글체크
 *
 * @param {String} value (필수) 검사 대상 문자열
 * @param {boolean} [isAlpha=false] (선택) 영문 문자 포함 가능 여부
 * @returns {boolean} 한글 여부
 */
function isHangul (value, isIncludeAlphabet = false) {
  const length = value.length
  for (let i = 0; i < length; i++) {
    const char = value.charCodeAt(i)

    const isHangulJamo = char >= 0x1100 && char <= 0x11FF
    const isHangulCompatibilityJamo = char >= 0x3130 && char <= 0x318F
    const isHangulSyllables = char >= 0xAC00 && char <= 0xD7A3
    const isHangul = isHangulJamo || isHangulCompatibilityJamo || isHangulSyllables
    // 한글이 아닌 경우 영문 문자 포함 가능 체크 후 영문도 아니면 false return
    if (!isHangul) {
      const upperCase = char >= 0x0041 && char <= 0x005A
      const lowerCase = char >= 0x0061 && char <= 0x007A
      const isAlphabet = lowerCase || upperCase
      return isIncludeAlphabet && isAlphabet
    }
  }

  return true
}

export default isHangul
