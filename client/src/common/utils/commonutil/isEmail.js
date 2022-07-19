/**
 * 이메일 포맷 체크
 *
 * @param {String} value (필수) 검사 대상 이메일
 * @returns {Boolean} 이메일 포맷 일치 여부
 */
function isEmail (value) {
  /** 체크사항
- @가 2개이상일 경우
- .이 붙어서 나오는 경우
-  @.나  .@이 존재하는 경우
- 맨처음이.인 경우
- @이전에 하나이상의 문자가 있어야 함
- @가 하나있어야 함
- Domain명에 .이 하나 이상 있어야 함
- Domain명의 마지막 문자는 영문자 2~4개이어야 함
*/

  const check1 = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/

  const check2 = /^[a-z0-9\-._]+@[a-z0-9\-.]+\.[a-z]{2,4}$/

  return !check1.test(value.toLowerCase()) && check2.test(value.toLowerCase())
}

export default isEmail
