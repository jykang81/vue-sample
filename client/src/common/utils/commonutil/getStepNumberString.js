/**
 * 숫자를 문자열로 변환
 *
 * @param {number} index (필수) 문자열로 변환할 index
 * @returns {string} 문자열로 변환된 index
 */
function getStepNumberString (index) {
  return ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두', '열세', '열네', '열다섯', '열여섯'][index]
}

export default getStepNumberString
