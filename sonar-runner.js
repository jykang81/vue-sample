'use strict'

require('dotenv').config({ path: '.env.sonar' })

const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const util = require('util')
const prepareExecEnvironment = require('./sonar-scan').prepareExecEnvironment
const execPromise = util.promisify(require('child_process').exec)
const argv = process.argv.slice(2)
const stage = argv[0]
/**
 * @since 2020.04.02
 * @author YongcheolKwon
 * @description Date 유틸
 */
const dateUtil = {

  /**
   * @memberof dateUtil
   * @description 현재날짜와 시간을 yyyy-MM-dd HH:mm:ss 형태로 리턴한다.
   * (커맨드로 폴더생성등에 사용되기 때문에 띄어쓰기나, 기호앞에 "\\" 값을 설정한다)
   * e.g. dateUtil.getTimeStamp()
   * @returns {String} `e.g. 2020-04-02 16:40:24`
   */
  getTimeStamp () {
    const currentDate = new Date()
    const returnDateString =
    `${this.leadingZeros(currentDate.getFullYear(), 4)}-${
    this.leadingZeros(currentDate.getMonth() + 1, 2)}-${
    this.leadingZeros(currentDate.getDate(), 2)}\\ ${
    this.leadingZeros(currentDate.getHours(), 2)}\\:${
    this.leadingZeros(currentDate.getMinutes(), 2)}\\:${
    this.leadingZeros(currentDate.getSeconds(), 2)}`
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

const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4'
})
const S3Config = {
  // 현재 DEV환경의 S3에 업로드되도록 임시 조치
  // 추후 TEST환경에 S3로 업로드하는 결정이 나면 그때 아래 주석 제거
  bucketName: 'nsm-dev-web-reports',
  targetFolder: 'sonarqube/'
}

/**
 * @description sonar-scanner를 이용한 소스검증 실행
 * @param {*} params SonarQube 실행정보 파라미터
 * @returns {Object} `stderr`, `stdout`
 */
async function scanCLI (params) {
  console.log('Starting SonarQube analysis...')

  const options = prepareExecEnvironment(params, process)

  const { stdout, stderr } = await execPromise(
    'sonar-scanner',
    options
  )

  return { error: stderr, result: stdout }
}

function getSonarServerUrl () {
  return process.env.SONAR_URL
}

// 소나큐브 실행정보
var params = {
  serverUrl: getSonarServerUrl(),
  currentStage: stage,
  options: {
    'sonar.sources': '.',
    'sonar.inclusions': 'client/**', // Entry point of your code
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.issuesReport.html.enable>': 'true',
    'sonar.coverage.exclusions': [
      '**/test/**',
      '**/tests/**',
      '**/router/**',
      '**/*Test.*',
      '**/main.js',
      '**/assets/**,',
      '**/sampleSimple.js',
      '**/sample.js',
      '**/native/**',
      '**/directives/**'
    ].join(','),
    'sonar.cpd.exclusions': '**/test/**, **/tests/**, **/router/**, **/*Test.*, **/main.js, **/assets/**, **/sampleSimple.js, **/sample.js, **/native/**, **/directives/**',
    'sonar.issue.ignore.multicriteria': 'e1,e2',
    'sonar.issue.ignore.multicriteria.e1.ruleKey': 'javascript:S2068', // Hard-coded credentials are security-sensitive
    'sonar.issue.ignore.multicriteria.e1.resourceKey': '**/tests/**',
    'sonar.issue.ignore.multicriteria.e2.ruleKey': 'javascript:S5122', // Permissive Cross-Origin Resource Sharing policy is security-sensitive
    'sonar.issue.ignore.multicriteria.e2.resourceKey': '**/tests/**'
  }
}

// 소나큐브 실행
scanCLI(params).then(data => {
  // 실행결과 S3 Upload
  const datetime = dateUtil.getTimeStamp()
  const filePath = path.join(__dirname, '.scannerwork/report-task.txt')
  fs.readFile(filePath, (error, fileContent) => {
    if (error) {
      throw error
    }

    S3.putObject({
      Bucket: S3Config.bucketName,
      Key: `${S3Config.targetFolder}${datetime.replace(/\\/gi, '')}/report-task.txt`,
      Body: fileContent
    }, res => {
      console.log(res)
      console.log('Successfully uploaded Sonarqube report!')
    })
  })

  // data.error에 WARNING과 ERROR가 동시에 있는경우
  if (data.error.indexOf('WARNING') !== -1) {
    const temp = data.error.split('\n')
    const temp2 = []
    let isError = false

    for (let i = 0; i < temp.length - 1; i++) {
      if (temp[i].indexOf('ERROR') !== -1) {
        temp2.push(temp[i])
        isError = true
      }
    }
    // data.error.length = 0
    data.error = temp2.slice()

    if (isError) {
      console.error(data.error)
      return process.exit(1)
    } else {
      console.log(data.result)
      return process.exit(0)
    }
    // data.error에 error만 있는경우
  } else if (data.error.indexOf('ERROR') !== -1) {
    console.error(data.error)
    return process.exit(1)
    // data.error가 없는 경우
  } else {
    console.log(data.result)
    return process.exit(0)
  }
})
