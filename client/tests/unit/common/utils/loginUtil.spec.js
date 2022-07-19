import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import loginUtil from '@utils/loginUtil'
import { assert } from 'chai'

describe('loginUtil', () => {
  let mock

  before(() => {
    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  // 로컬스토리지에 테스트사용자 정보 적재
  const memberInfo = {
    tcode: 't123',
    gender: 'F',
    userId: 111103108,
    hpNo: '010-9898-9342',
    isSSORequest: 'false',
    isAdult: 'true',
    custNum: '30124937',
    gradeNm: '패밀리',
    userName: '강진영',
    adultAuthYN: 'N',
    entFlag: 'Y',
    userMargetingTM: 'N',
    lastOrder: '2020-03-12 18:21:20.125',
    registration: '2020-03-12 16:44:06.125',
    email: 'lsd251@nsmall.com',
    telNo: '010-9898-9342',
    userMargetingEmail: 'N',
    birthday: '19840425',
    userMarketingSMS: 'N',
    logonId: 'lsd251@nsmall.com',
    failcount: '0',
    sessionid: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    sessionId: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    loginyn: 'Y',
    logonType: 'WEB',
    memberGradeCss: 'family',
    staffInfo: false,
    staffInfoName: '대표',
    staffBnft: 'Y'
  }

  describe('초기 작업', () => {
    it('초기 Login처리하고 진행', () => {
      loginUtil.login(memberInfo)
      const isLoggedIn = loginUtil.isLoggedIn()
      assert.notEqual('', isLoggedIn)
    })
  })

  describe('사용자 정보 가져오기', () => {
    it('userId', () => {
      const returnVal = loginUtil.userId()
      assert.notEqual('', returnVal)
    })
    it('logonType', () => {
      const returnVal = loginUtil.logonType()
      assert.notEqual('', returnVal)
    })
    it('userName', () => {
      const returnVal = loginUtil.userName()
      assert.notEqual('', returnVal)
    })
    it('custNum', () => {
      const returnVal = loginUtil.custNum()
      assert.notEqual('', returnVal)
    })
    it('logonId', () => {
      const returnVal = loginUtil.logonId()
      assert.notEqual('', returnVal)
    })
    it('email', () => {
      const returnVal = loginUtil.email()
      assert.notEqual('', returnVal)
    })
    it('hpNo', () => {
      const returnVal = loginUtil.hpNo()
      assert.notEqual('', returnVal)
    })
    it('birthday', () => {
      const returnVal = loginUtil.birthday()
      assert.notEqual('', returnVal)
    })
    it('isAdult', () => {
      const returnVal = loginUtil.isAdult()
      assert.notEqual('', returnVal)
    })
    it('adultAuthYN', () => {
      const returnVal = loginUtil.adultAuthYN()
      assert.notEqual('', returnVal)
    })
    it('tcode', () => {
      const returnVal = loginUtil.tcode()
      assert.notEqual('', returnVal)
    })
    it('telNo', () => {
      const returnVal = loginUtil.telNo()
      assert.notEqual('', returnVal)
    })
    it('isVip', () => {
      const returnVal = loginUtil.isVip()
      assert.notEqual('', returnVal)
    })
    it('sessionId', () => {
      const returnVal = loginUtil.sessionId()
      assert.notEqual('', returnVal)
    })
    it('entFlag', () => {
      const returnVal = loginUtil.entFlag()
      assert.notEqual('', returnVal)
    })
  })

  // 로그인 정보 처리
  describe('로그인 정보 처리', () => {
    beforeEach(() => {
      mock.reset()
      loginUtil.login(memberInfo)
    })

    it('로그인 여부 체크 (브라우저 세션 확인)', () => {
      const returnVal = loginUtil.isLoggedIn()
      assert.equal(true, returnVal)
    })

    it('로그아웃 처리 (브라우저 세션 초기화)', async () => {
      const url = `${CONST.API_URL}/NSLogoutMoblieCmdReal`
      const mockResponseResult = {
        msg: {
          root: {
            Logonresult: {
              custNum: '30124937',
              login_yn: 'Y',
              text: '로그아웃 되었습니다.'
            }
          }
        }
      }

      mock
        .onPost(url)
        .reply(200, mockResponseResult)

      try {
        loginUtil.logout()
        await flushPromises()

        const returnVal = await loginUtil.isLoggedIn()
        assert.equal(false, returnVal)
      } catch (error) {
        assert.fail(error.message)
      }
    })

    it('getMemberInfo 사용자 정보 조회 (브라우저 세션 확인)', () => {
      const returnVal = loginUtil.getMemberInfo()
      assert.notEqual(null, returnVal)
    })

    it('checkLogonStatus 로그인 여부를 체크', () => {
      const returnVal = loginUtil.checkLogonStatus()
      assert.equal(true, returnVal)

      loginUtil.memberInfo = null
      sessionStorage.clear()
      localStorage.clear()

      const returnVal2 = loginUtil.checkLogonStatus()
      assert.equal(false, returnVal2)
    })
    it('비 회원 여부', () => {
      // 로그인 상태는 비회원이 아님
      assert.isFalse(loginUtil.isNonMember())

      // 비회원 로그인
      loginUtil.memberInfo = {
        logonType: 'nonmember'
      }

      // 비회원 확인
      assert.isTrue(loginUtil.isNonMember())
    })
  })
})
