'use strict'

const axios = require('axios')
const args = process.argv.slice(2)
const UTIL_NAME = 'check-last-deploy-time'
const ERROR_MESSAGE = `[${UTIL_NAME}] Stage 정보가 올바르지 않습니다. \n\ne.g. npm run info:lastdeploytime:dev\ne.g. npm run info:lastdeploytime:test`

const dateUtil = {

  /**
   * @memberof dateUtil
   * @description 현재날짜와 시간을 yyyy-MM-dd HH:mm:ss 형태로 리턴한다.
   * (커맨드로 폴더생성등에 사용되기 때문에 띄어쓰기나, 기호앞에 "\\" 값을 설정한다)
   * e.g. dateUtil.getTimeStamp()
   * @returns {String} `e.g. 2020-04-02 16:40:24`
   */
  getTimeStamp (date) {
    const returnDateString =
    `[${UTIL_NAME}] 최종배포시간: ${this.leadingZeros(date.getFullYear(), 4)}-${
    this.leadingZeros(date.getMonth() + 1, 2)}-${
    this.leadingZeros(date.getDate(), 2)} ${
    this.leadingZeros(date.getHours(), 2)}:${
    this.leadingZeros(date.getMinutes(), 2)}:${
    this.leadingZeros(date.getSeconds(), 2)}`
    return returnDateString
  },

  /**
   * @memberof dateUtil
   * @description 입력받은 숫자(n)를 자릿수(digits)에 맞게 '0'으로 LeftPadding 처리 한 문자열을 반환
   * e.g. dateUtil.leadingZeros(5, 2)
   *
   * @param {*} n (필수) 숫자의 본연의 값
   * @param {*} digits (필수) 제작할 자릿수
   * @returns {String} `e.g. "05"`
   */
  leadingZeros (n, digits) {
    var zero = ''
    n = n.toString()

    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) {
        zero += '0'
      }
    }
    return zero + n
  }
}

function getTargetUrl (stage) {
  if (stage === 'dev') {
    return 'https://devm2.nsmall.com'
  } else if (stage === 'test') {
    return 'https://testm2.nsmall.com'
  } else if (stage === 'prod') {
    return 'https://mw.nsmall.com'
  } else {
    return undefined
  }
}

function getLastDeployTime () {
  if (args.length === 0) {
    console.error(ERROR_MESSAGE)
    return
  }

  const url = getTargetUrl(args[0])
  if (url === undefined) {
    console.error(ERROR_MESSAGE)
    return
  }

  axios.head(url).then(response => {
    const lastDeployTimeKST = new Date(response.headers['last-modified'])
    console.log(dateUtil.getTimeStamp(lastDeployTimeKST))
  })
}

getLastDeployTime()
