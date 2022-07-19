'use strict'

const post = require('axios').post
const stringify = require('qs').stringify
const fs = require('fs')
const stage = process.argv.slice(2)[0]
const comment = '# EOF (아래의 작성된 파라미터는 Parameter-Store의 영역이므로, 고정값을 추가하려면 이 주석 위로 남겨주시면 됩니다. 임의로 작성하시면 사라지게 됩니다.)'
let originEnvFile

console.log('[get-parameter-store] # 고정 파라미터값을 불러옵니다..')

// 매개변수 확인 (dev, test, prod)
if (stage === undefined) {
  throw new Error('[get-parameter-store] \'stage\' 매개변수를 입력하세요 (e.g. node get-parameter-store.js dev)')
} else {
  switch (stage) {
    case 'local':
    case 'dev':
    case 'prod':
    case 'test':
      originEnvFile = `.env.${stage}`
      break

    default:
      throw new Error('[get-parameter-store] \'stage\' 매개변수가 올바르지 않습니다 (e.g. local, dev, test, prod)')
  }
  console.log(`[get-parameter-store] # Stage: ${stage}`)
}

// 스테이지 정보를 포함한 요청 URL 선언
const url = 'https://common.dev-nsmall.com/util/parameter'

console.log('[get-parameter-store] # 파라미터 스토어 Connecting..')
const requestData = {
  name: '/nsm/mobileweb',
  param: stage
}
post(url, stringify(requestData))
  .then(response => {
    console.log('[get-parameter-store] # 파라미터 스토어 값 가져오기 성공..')
    const parameter = response.data

    fs.readFile(originEnvFile, 'utf8', function (err, data) {
      if (err) { throw err }
      var linesExceptFirst = `${data.split(comment)[0]}${comment}`
      var keys = Object.keys(parameter)
      for (var i = 0; i < keys.length; i++) {
        linesExceptFirst += `\r\nVUE_APP_${keys[i]}='${parameter[keys[i]]}'`
      }
      fs.writeFileSync(originEnvFile, linesExceptFirst)
      console.log(`[get-parameter-store] # ${originEnvFile} 파일 설정 완료`)
    })
  })
  .catch(response => {
    console.error('[get-parameter-store] # 파라미터 스토어 값 가져오기 실패!')
    console.error(response)
  })
