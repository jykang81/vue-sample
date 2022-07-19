import isNull from '@utils/commonutil/isNull'

/**
 * 전화번호 앞자리, 가운데, 끝자리 구하기
 * 11-111-1111,02-111-1111 : 9자리
 * 02-1688-7700,031-111-1111 : 10자리
 * 010-1111-1111 : 11자리
 *
 * @param {String} pNumber
 * @param {String} gubunType
 * @returns {string}
 */
function getPhoneNumber (pNumber, gubunType) {
  let phone1 = ''
  let phone2 = ''
  let phone3 = ''
  let phone = ''
  if (isNull(pNumber)) {
    pNumber = ''
  } else {
    pNumber = pNumber.replace(/-/gi, '') // 하이픈이 추가된 경우 제거
  }

  if (['0130', '0303', '0502', '0503', '0504', '0505', '0506', '0507'].includes(pNumber.substring(0, 4))) {
    if (pNumber.length > 11) {
      phone1 = pNumber.substring(0, 4)
      phone2 = pNumber.substring(4, 8)
      phone3 = pNumber.substring(8, 12)
    } else if (pNumber.length > 7) {
      phone1 = pNumber.substring(0, 4)
      phone2 = pNumber.substring(4, 7)
      phone3 = pNumber.substring(7, 11)
    }
  } else if (pNumber.substring(0, 2) === '02') {
    if (pNumber.length > 9) {
      phone1 = pNumber.substring(0, 2)
      phone2 = pNumber.substring(2, 6)
      phone3 = pNumber.substring(6, 10)
    } else if (pNumber.length > 5) {
      phone1 = pNumber.substring(0, 2)
      phone2 = pNumber.substring(2, 5)
      phone3 = pNumber.substring(5, 9)
    }
  } else {
    if (pNumber.length > 10) {
      phone1 = pNumber.substring(0, 3)
      phone2 = pNumber.substring(3, 7)
      phone3 = pNumber.substring(7, 11)
    } else if (pNumber.length > 6) {
      phone1 = pNumber.substring(0, 3)
      phone2 = pNumber.substring(3, 6)
      phone3 = pNumber.substring(6, 10)
    }
  }

  switch (gubunType) {
    case '1' : phone = phone1
      break
    case '2' : phone = phone2
      break
    case '3' : phone = phone3
      break
    case '4' : phone = phone3
      break
    default: break
  }

  return phone
}

export default getPhoneNumber
