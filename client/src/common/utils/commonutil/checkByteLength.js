import messageUtil from '@frameworks/messageUtil'

function checkByteLength (target, limit) {
  let ariMax = limit // limit 제한 글자수(여기서는 1000)
  const lsStr = target.value // 이벤트가 일어난 컨트롤의 value 값
  const liStrLen = lsStr.length // 전체길이

  // 변수초기화
  const liMax = ariMax // 제한할 글자수 크기
  let liByte = 0 // 한글일경우는 2 그밗에는 1을 더함
  let liLen = 0 // substring하기 위해서 사용
  let lsOneChar = '' // 한글자씩 검사한다
  let lsStr2 = '' // 글자수를 초과하면 제한할수 글자전까지만 보여준다.

  for (let i = 0; i < liStrLen; i++) {
    // 한글자추출
    lsOneChar = lsStr.charAt(i)

    // 한글이면 3를 더한다.
    if (escape(lsOneChar).length > 4) {
      liByte += 3
    } else { // 그 밖의 경우는 1을 더한다.
      liByte++
    }
    // 전체 크기가 liMax를 넘지않으면
    if (liByte <= liMax) {
      liLen = i + 1
    }
  }

  ariMax = Number(ariMax / 3)

  // 전체길이를 초과하면
  if (liByte > liMax) {
    messageUtil.alert(`한글${ariMax}글자를 초과 입력할 수 없습니다. 초과된 내용은 자동으로 삭제됩니다.`)
    lsStr2 = lsStr.substr(0, liLen)
    target.value = lsStr2
    return false
  }
  return true
}

export default checkByteLength
