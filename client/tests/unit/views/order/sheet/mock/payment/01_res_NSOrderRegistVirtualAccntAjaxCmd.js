/*
<select id="DP_depositBankCd" title="은행 선택" class="form theme-a x-small" onchange="CurrentView.event.onchange_depositBankCd(this);">
  <option value="">입금하실 은행을 선택해 주세요</option>
  <option value="{"RNUM":"1","BANKNAME":"국민","BANKCODE":"VAK","ACCT_NUM":"356-49-0142-75224","VIRTUALACCNT_FLAG":"Y"}">국민  356-49-0142-75224</option>
  <option value="{"RNUM":"2","BANKNAME":"우리","BANKCODE":"VAW","ACCT_NUM":"271-85-4645-18531","VIRTUALACCNT_FLAG":"Y"}">우리  271-85-4645-18531</option>
  <option value="{"ACCT_NUM":"5620-70-5103-7089","BANKCODE":"VAS","BANKNAME":"신한","RNUM":"3","VIRTUALACCNT_FLAG":"Y"}">신한  5620-70-5103-7089</option>
  <option value="{"RNUM":"4","BANKNAME":"농협","BANKCODE":"VA","ACCT_NUM":"nothing","VIRTUALACCNT_FLAG":"Y"}">농협  [전용계좌신청하기]</option>
  <option value="{"RNUM":"5","BANKNAME":"하나","BANKCODE":"VAH","ACCT_NUM":"nothing","VIRTUALACCNT_FLAG":"Y"}">하나  [전용계좌신청하기]</option>
  <option value="{"RNUM":"6","BANKNAME":"제일","BANKCODE":"VAJ","ACCT_NUM":"nothing","VIRTUALACCNT_FLAG":"Y"}">제일  [전용계좌신청하기]</option>
  <option value="{"ACCT_NUM":"8005-27-5709-139","BANKCODE":"VAG","BANKNAME":"경남","RNUM":"7","VIRTUALACCNT_FLAG":"Y"}">경남  8005-27-5709-139</option>
</select>
*/

const temp01ResNSOrderRegistVirtualAccntAjaxCmd = {}
temp01ResNSOrderRegistVirtualAccntAjaxCmd.get = (_code, _name) => {
  return {
    root: {
      USERS_ID: '30124193',
      VIRTUALACCNT_NO: '56207051037089',
      BANKNAME: `${_name}(가상)`,
      BANKCODE: _code
    },
    isSuccessful: true,
    responseHeaders: {
      Server: 'WebSphere Application Server/7.0',
      'Transfer-Encoding': 'chunked',
      'Content-Language': 'en-US',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 28 Apr 2020 04:01:41 GMT',
      'X-Scouter-Callee-Obj': '822818710'
    },
    userId: [
      '30124193'
    ],
    tranId: 'webapp/wcs/stores/servlet/NSOrderRegistVirtualAccntAjaxCmd',
    bankName: [
      _name
    ],
    bankCode: [
      _code
    ],
    langId: [
      '-9'
    ],
    accptPath: [
      '500'
    ],
    accptPathCd: [
      '500'
    ],
    responseTime: 169,
    totalTime: 170,
    req_co_cd: [
      '110'
    ],
    catalogId: [
      '97001'
    ],
    statusReason: 'OK',
    mobAPI: [
      'NSOrderRegistVirtualAccntAjaxCmd'
    ],
    uuid: [
      '057ddc6c-ca56-4d69-9d1a-78eed49d0c59'
    ],
    storeId: [
      '13001'
    ],
    accessTm: [
      '20200428130141577'
    ],
    statusCode: 200
  }
}

export default temp01ResNSOrderRegistVirtualAccntAjaxCmd
