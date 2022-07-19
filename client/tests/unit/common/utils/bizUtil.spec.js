import { assert } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import COMMON_CONST from '@constants/common/common'
import CONST from '@constants/framework/framework'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'

describe('bizUtil', () => {
  let mock

  // 로그인
  function login () {
    loginUtil.login({
      userId: 111214420,
      logonId: 'qhanq19@gmail.com',
      loginyn: 'Y'
    })
  }

  // 로그아웃
  function logout () {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  }

  before(() => {
    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    // 찜 하기
    mock.onPost(`${CONST.API_URL}/RegisterWish`).reply(200, {
      msg: {
        isSuccess: 1,
        resultCode: null,
        userMessage: null
      }
    })

    // 찜 취소
    mock.onPost(`${CONST.API_URL}/RemoveWish`).reply(200, {
      msg: {
        isSuccess: 1,
        resultCode: null,
        userMessage: null
      }
    })
  })

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(function () {
    logout()
  })

  describe('getCreditCardCodeName', () => {
    it('card code를 1만 입력해도 조흥 카드가 매핑된다', () => {
      const cardCode = '1'

      const result = bizUtil.getCreditCardCodeName(cardCode)

      const expecetedCardName = '조흥'

      assert(result, expecetedCardName)
    })

    it('card code를 029를 입력하면 신한 카드가 매핑된다', () => {
      const cardCode = '029'

      const result = bizUtil.getCreditCardCodeName(cardCode)

      const expecetedCardName = '신한'

      assert(result, expecetedCardName)
    })
  })

  describe('getCartCount', () => {
    beforeEach(() => {
      sessionStorage.clear()
      localStorage.clear()
    })

    it('비로그인 고객은 장바구니 개수가 0이다', async () => {
      const url = `${CONST.API_URL}/NSBasketCountCmdReal`
      const mockResponseResult = {
        msg: {
          common: {
            basketCnt: 0
          }
        }
      }

      mock
        .onPost(url)
        .reply(200, mockResponseResult)

      bizUtil.getCartCount()
      await flushPromises()
    })

    it('로그인 고객은 장바구니 개수가 갱신된다', async () => {
      const url = `${CONST.API_URL}/NSBasketCountCmdReal`
      const mockResponseResult = {
        msg: {
          common: {
            basketCnt: 10
          }
        }
      }

      mock
        .onPost(url)
        .reply(200, mockResponseResult)

      const memberInfo = {
        userId: '9999'
      }
      sessionStorageUtil.set('memberInfo', memberInfo)

      try {
        bizUtil.getCartCount()
        await flushPromises()
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })

  describe('formatCardNoWithAsterisk', () => {
    it('카드번호를 기입하면 중간 4자리 * 표시 및 포매팅', () => {
      const cardNo = '5555000066660000'

      const formattedCardNo = bizUtil.formatCardNoWithAsterisk(cardNo)

      const expectedCardNo = '5555-0000-****-0000'

      assert.equal(formattedCardNo, expectedCardNo)
    })
    it('카드번호가 16자리가 아니면 그대로 return', () => {
      const cardNo = '555500006666000'

      const formattedCardNo = bizUtil.formatCardNoWithAsterisk(cardNo)

      const expectedCardNo = '555500006666000'

      assert.equal(formattedCardNo, expectedCardNo)
    })
  })

  describe('espotClickEvent', () => {
    it('타켓이 상품상세일 경우 상품상세로 이동', () => {
      bizUtil.espotClickEvent('Product', '12345', '12345', '12345', '/test/test?a=b&c=1', '12345')
    })
  })

  describe('gotoMain', () => {
    it('앱 환경일 때, 메인 화면으로 전환된다', () => {
      bizUtil.gotoMain()
    })

    it('웹 환경일 때, 메인 url로 이동한다', () => {
      bizUtil.gotoMain()
    })
  })

  describe('gotoProductDetail', () => {
    it('상품번호를 넘기면 해당 상품 페이지로 이동한다', () => {
      bizUtil.gotoProductDetail('123456')
    })
  })

  describe('gotoOrdersheet', () => {
    bizUtil.gotoOrdersheet()
  })

  describe('wishToggle', () => {
    const e = {
      target: {
        classList: {
          classes: 'on',
          contains: classTxt => e.target.classList.classes.includes(classTxt),
          remove: () => {
            e.target.classList.classes = ''
          },
          add: classTxt => {
            e.target.classList.classes = classTxt
          }
        }
      }
    }

    it('로그인 안했을 때는 찜하기 API 호출 안함', async () => {
      loginUtil.memberInfo = null

      // 로그인 안했을 때는 찜하기 API 호출 안함
      const noLoginResult = await bizUtil.wishToggle(e, 12345)

      assert.isUndefined(noLoginResult)
    })

    it('찜 하기', async () => {
      // 로그인
      login()

      // 찜완료 class 제거
      e.target.classList.classes = ''

      bizUtil.wishToggle(e, 12345)
    })

    it('찜 취소', async () => {
      // 로그인
      login()

      // 찜완료 class 등록
      e.target.classList.classes = 'on'

      bizUtil.wishToggle(e, 12345)
    })
  })

  describe('openCert', () => {
    it('본인/성인 인증 팝업 호출', () => {
      bizUtil.openCert()
    })
  })

  describe('setRecentlyViewedProducts', () => {
    it('최근 본 상품 저장', () => {
      const TEST_PARTNUMBER = '111111'
      bizUtil.setRecentlyViewedProducts({
        partNumber: TEST_PARTNUMBER,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT
      })
      const resultObj = bizUtil.getRecentlyViewedProducts()
      assert.equal(resultObj[0].partNumber, TEST_PARTNUMBER)
    })
    it('최근 본 상품 2개 저장', () => {
      const TEST_PARTNUMBER_1 = '111111'
      const TEST_PARTNUMBER_2 = '222222'
      bizUtil.setRecentlyViewedProducts({
        partNumber: TEST_PARTNUMBER_1,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT
      })
      bizUtil.setRecentlyViewedProducts({
        partNumber: TEST_PARTNUMBER_2,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT
      })
      const resultObj = bizUtil.getRecentlyViewedProducts()
      assert.equal(resultObj[0].partNumber, TEST_PARTNUMBER_2)
    })
  })

  describe('getHistoryPushFlag', () => {
    const dataInfo = {
      partNumber: '111111',
      categoryId: 12345,
      catgroupId: 12345,
      offerIdfr: 12345
    }
    const hisInfo = {
      partNumber: '111111',
      categoryId: 12345,
      catgroupId: 12345,
      offerIdfr: 12345
    }
    const writeMonDay = '20200727'
    let readMonDay = '20200727'
    it('최근 본 상품 쌓는 여부 체크 (상품 중복 case)', () => {
      hisInfo.hisGubun = COMMON_CONST.HISTORY_GUBUN.PRODUCT
      assert.isTrue(bizUtil.getHistoryPushFlag(dataInfo, hisInfo, writeMonDay, readMonDay))
    })
    it('최근 본 상품 쌓는 여부 체크 (카테고리 중복 case)', () => {
      hisInfo.hisGubun = COMMON_CONST.HISTORY_GUBUN.CATEGORY
      assert.isTrue(bizUtil.getHistoryPushFlag(dataInfo, hisInfo, writeMonDay, readMonDay))
    })
    it('최근 본 상품 쌓는 여부 체크 (기획전 중복 case)', () => {
      hisInfo.hisGubun = COMMON_CONST.HISTORY_GUBUN.EXHIBITION
      assert.isTrue(bizUtil.getHistoryPushFlag(dataInfo, hisInfo, writeMonDay, readMonDay))
    })
    it('최근 본 상품 쌓는 여부 체크 (이벤트 중복 case)', () => {
      hisInfo.hisGubun = COMMON_CONST.HISTORY_GUBUN.EVENT
      assert.isTrue(bizUtil.getHistoryPushFlag(dataInfo, hisInfo, writeMonDay, readMonDay))
    })
    it('최근 본 상품 쌓는 여부 체크 (중복 없는 case)', () => {
      readMonDay = '20200728'
      assert.isFalse(bizUtil.getHistoryPushFlag(dataInfo, hisInfo, writeMonDay, readMonDay))
    })
  })
  describe('delHistoryList', () => {
    it('최근 본 상품 삭제', () => {
      // 최근 본 상품 저장
      const TEST_PARTNUMBER = '111111'
      bizUtil.setRecentlyViewedProducts({
        partNumber: TEST_PARTNUMBER,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT
      })

      // 삭제 전에는 최근 본 상품 존재함
      const resultObj = bizUtil.getRecentlyViewedProducts()
      assert.equal(resultObj[0].partNumber, TEST_PARTNUMBER)

      // 삭제 후에 최근 본 상품 없음
      bizUtil.delHistoryList(0)
      assert.equal(0, bizUtil.getRecentlyViewedProducts().length)
    })
  })
})
