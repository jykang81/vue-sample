import messageUtil from '@frameworks/messageUtil'
import isNull from '@utils/commonutil/isNull'

/**
 * input 등을 object로 받아 숫자로만 이루어 졌는지 판단한다.
 * 기본적으로 숫자 이외의 값을 삭제하고 숫자만 다시 입력한다.
 * balert의 값이 true일 경우 "숫자만 입력하실 수 있습니다." alert 돌출
 * nMaxLeng 값이 있을 경우 alert을 돌출하며, 입력된 수만큼 잘라서 다시 입력한다.
 * 단, balert의 값에 의해 이미 alert이 돌출하였다면 해당 길이alert을 돌출하지 않는다.
 *
 * 최대 입력값도 체크 할 수 있도록 수정
 *       nMaxVal을 입력하면, 입력된 값의 최대 값을 체크한다.
 *       strMaxValAlertMsg 값에 alert을 표시하거나 미표시 하며, 빈스트링일경우 기본 문구를 출력한다.
 *
 * @param {Object} objThis (필수) input tag등
 * @param {Number} nMaxLeng (선택) 최고 입력 길이 ; 미입력시 미체크
 * @param {Boolean} balert (선택) 숫자만 입력 alert 표시 여부 ; 미입력시 alert 미노출
 * @param {Nubmer} nMaxVal (선택) 최대 입력 가능 숫자 ; 미입력시 미체크
 * @param {String} strMaxValAlertMsg (선택) 최대 입력 가능 숫자 초과시 alert 내용 ; 미입력시 미노출 ; 빈스트링일 경우 기본 문구
 */
function onKeyUpOnlyNumber (objThis, nMaxLeng, balert, nMaxVal, strMaxValAlertMsg) {
  let strText = String(objThis.value)
  const pattern = /^([0-9]{1,})$/ // 정규식 패턴
  let bOnlyNumber = true

  if (strText !== '') {
    bOnlyNumber = pattern.test(strText)
  }

  // 숫자여부 판단 및 처리
  if (!bOnlyNumber) {
    if (balert) {
      messageUtil.alert('숫자만 입력하실 수 있습니다.')
    }

    strText = strText.replace(/[^0-9]/gi, '') // 숫자만 나오도록 치환
    objThis.value = strText // 치환된 값 적재
  }

  // 길이 체크 및 처리
  if (!isNull(nMaxLeng) && strText.length > Number(nMaxLeng)) {
    if (balert) {
      messageUtil.alert(`최대${nMaxLeng}자 까지 입력 가능합니다.`)
    }

    objThis.value = strText.substring(0, Number(nMaxLeng)) // 잘라서 적재
  }

  // 최대 입력 숫자 체크
  if (!isNull(nMaxVal) && Number(strText) > Number(nMaxVal)) {
    if (!isNull(strMaxValAlertMsg)) { // 값이 없으면 alert 미표시
      messageUtil.alert(strMaxValAlertMsg)
    }

    objThis.value = Number(nMaxVal) // 최대값 세팅
  }
}

export default onKeyUpOnlyNumber
