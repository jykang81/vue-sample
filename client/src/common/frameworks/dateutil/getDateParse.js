/**
 * 특정 날짜 Date Type으로 파싱
 * iOS의 경우, date.parse 구문은 NaN을 뱉어냄..
 * date 값이 null 일 경우에는 split 오류 발생함. null이 아닐 경우에만 처리하도록 수정
 * 개발의 21135543 상품 편성표 정보값 중 date가 null인 부분이 존재함.
 *
 * @param {String} date (필수) 특정 날짜 ex) '2020-12-31 00:00:00'
 * @returns {Date} 특정 날짜
 */
function getDateParse (date) {
  if (date !== null && date !== undefined) {
    const arr = date.split(/[- :]/)
    date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])

    return date
  }
}

export default getDateParse
