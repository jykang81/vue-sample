/**
 * 비밀번호 유효성 검사
 *
 * @param {String} str 유효성 검사 문자열
 * @returns {Object} 비밀번호 유효성 검사 결과
 */
function validatePassword (str) {
  const pattern1 = '.*[ㄱ-ㅎㅏ-ㅣ가-힣\\s]+.*' // 한글+공백
  const pattern2 = '^.{8,16}$' // 글자수는 8~16자
  const pattern3 = '^(?=.*?[A-Z])(?=.*?[a-z]).*$' + // 적어도 대문자 하나와 소문자 하나가 포함되어 있는 문자열 - (^)시작 ($)종료 (|) or
'|^(?=.*?[A-Z])(?=.*?[0-9]).*$' + // 적어도 대문자 하나와 숫자 하나가 포함되어 있는 문자열
'|^(?=.*?[A-Z])(?=.*?[^0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]).*$' + // 적어도 대문자 하나와 특문 하나가 포함되어 있는 문자열
'|^(?=.*?[a-z])(?=.*?[0-9]).*$' + // 적어도 소문자 하나와 숫자 하나가 포함되어 있는 문자열
'|^(?=.*?[a-z])(?=.*?[^0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]).*$' + // 적어도 소문자 하나와 특문 하나가 포함되어 있는 문자열
'|^(?=.*?[0-9])(?=.*?[^0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]).*$' // 적어도 숫자 하나와 특문 하나가 포함되어 있는 문자열
  const pattern4 = '^(?=.*?(012|123|234|345|456|567|678|789)).*$' + // 연속적으로 증가하는 숫자 3개의 패턴이 포함되어 있는 문자열 (감소는 적용하지 않음)
'|^(?=.*?(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy' +
'|ABC|BCD|CDE|DEF|EFG|FGH|GHI|HIJ|IJK|JKL|KLM|LMN|MNO|NOP|OPQ|PQR|QRS|RST|STU|TUV|UVW|VWX|WXY' +
'|qwe|QWE|asd|ASD|zxc|ZXC)).*$' // 연속적으로 증가하는 영문자 및 키보드 자판배열 3가지
  const pattern5 = '^(?=.*?(.)\\1\\1).*$' // 동일한 문자(알파벳,숫자)를 3연속 사용하였을 경우

  if (str.match(pattern1)) {
    return {
      validStatus: '99',
      validMsg: '공백이나 한글은 사용할 수 없습니다.'
    }
  } else if (!str.match(pattern3)) {
    return {
      validStatus: '99',
      validMsg: '영문, 숫자, 특수문자 중 두가지 이상을 조합해야 합니다.'
    }
  } else if (str.match(pattern4)) {
    return {
      validStatus: '99',
      validMsg: '연속된 문자/숫자는 사용할 수 없습니다. 예)123, abc'
    }
  } else if (str.match(pattern5)) {
    return {
      validStatus: '99',
      validMsg: '동일한 문자/숫자를 연속으로 사용할 수 없습니다. 예)111, ddd'
    }
  } else if (!str.match(pattern2)) {
    return {
      validStatus: '99',
      validMsg: '비밀번호는 8-16자 이내여야 합니다.'
    }
  } else {
    return {
      validStatus: '00',
      validMsg: '안전한 비밀번호입니다.'
    }
  }
}

export default validatePassword
