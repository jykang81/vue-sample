import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'
import { assert } from 'chai'

describe('orderConst-결제수단 (PAY_TYPE_CONST) 테스트', function () {
  const dummy = 'dummy'
  const langEn = 'en'
  describe('PAY_TYPE_CONST.isCodes', function () {
    it('결제수단확인-true', function () {
      const result = PAY_TYPE_CONST.isCodes('100')
      assert.equal(result, true)
    })
    it('결제수단확인-false', function () {
      const result = PAY_TYPE_CONST.isCodes()
      assert.equal(result, false)
    })
  })
  describe('PAY_TYPE_CONST.getTmplTitle', function () {
    it('신용카드', function () {
      const title = PAY_TYPE_CONST.getTmplTitle(PAY_TYPE_CONST.CREDIT_CARD, 'KB국민카드', '일시불')
      assert.equal(title, 'KB국민카드, 일시불')
    })
    it('무통장입금', function () {
      const title = PAY_TYPE_CONST.getTmplTitle(PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK, '국민')
      assert.equal(title, '무통장입금(국민은행)')
    })
    it('휴대폰', function () {
      const title = PAY_TYPE_CONST.getTmplTitle(PAY_TYPE_CONST.MOBILE)
      assert.equal(title, '휴대폰결제')
    })
    it('페이코', function () {
      const title = PAY_TYPE_CONST.getTmplTitle(PAY_TYPE_CONST.PAYCO)
      assert.equal(title, '페이코')
    })
    it('네이버페이', function () {
      const title = PAY_TYPE_CONST.getTmplTitle(PAY_TYPE_CONST.NAVER_PAY)
      assert.equal(title, '네이버페이')
    })
    it('NS페이 신용카드', function () {
      const title = PAY_TYPE_CONST.getTmplTitle(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD, 'KB국민카드', '일시불')
      assert.equal(title, 'NS페이(KB국민카드), 일시불')
    })
    it('NS페이 계좌이체', function () {
      const title = PAY_TYPE_CONST.getTmplTitle(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER, '국민')
      assert.equal(title, 'NS페이(국민은행)')
    })
    it('Empty Title', function () {
      const title = PAY_TYPE_CONST.getTmplTitle('', '')
      assert.equal(title, '')
    })
  })
  describe('PAY_TYPE_CONST.getName-ko', function () {
    it('신용카드-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.CREDIT_CARD)
      assert.equal(name, PAY_TYPE_CONST.INFO.CREDIT_CARD.KO)
    })
    it('무통장입금-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK)
      assert.equal(name, PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.KO)
    })
    it('실시간계좌이체-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER)
      assert.equal(name, PAY_TYPE_CONST.INFO.REALTIME_ACCOUNT_TRANSFER.KO)
    })
    it('휴대폰-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.MOBILE)
      assert.equal(name, PAY_TYPE_CONST.INFO.MOBILE.KO)
    })
    it('페이코-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.PAYCO)
      assert.equal(name, PAY_TYPE_CONST.INFO.PAYCO.KO)
    })
    it('네이버페이-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.NAVER_PAY)
      assert.equal(name, PAY_TYPE_CONST.INFO.NAVER_PAY.KO)
    })
    it('NS페이 신용카드-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD)
      assert.equal(name, PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.KO)
    })
    it('NS페이 계좌이체-ko', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER)
      assert.equal(name, PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.KO)
    })
    it('Empty Name', function () {
      const name = PAY_TYPE_CONST.getName('', '')
      assert.equal(name, '')
    })
  })

  describe('PAY_TYPE_CONST.getName-en', function () {
    it('신용카드-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.CREDIT_CARD, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.CREDIT_CARD.EN)
    })
    it('무통장입금-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.EN)
    })
    it('실시간계좌이체-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.REALTIME_ACCOUNT_TRANSFER.EN)
    })
    it('휴대폰-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.MOBILE, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.MOBILE.EN)
    })
    it('페이코-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.PAYCO, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.PAYCO.EN)
    })
    it('네이버페이-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.NAVER_PAY, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.NAVER_PAY.EN)
    })
    it('NS페이 신용카드-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.EN)
    })
    it('NS페이 계좌이체-en', function () {
      const name = PAY_TYPE_CONST.getName(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER, langEn)
      assert.equal(name, PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.EN)
    })
  })

  describe('PAY_TYPE_CONST.is... and PAY_TYPE_CONST.isNot...', function () {
    it('신용카드-is', function () {
      const result = PAY_TYPE_CONST.isCreditCard(PAY_TYPE_CONST.CREDIT_CARD)
      assert.equal(result, true)
    })
    it('신용카드-isNot', function () {
      const result = PAY_TYPE_CONST.isNotCreditCard(dummy)
      assert.equal(result, true)
    })
    it('무통장입금-is', function () {
      const result = PAY_TYPE_CONST.isDepositWithoutBankbook(PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK)
      assert.equal(result, true)
    })
    it('무통장입금-isNot', function () {
      const result = PAY_TYPE_CONST.isNotDepositWithoutBankbook(dummy)
      assert.equal(result, true)
    })
    it('실시간계좌이체-is', function () {
      const result = PAY_TYPE_CONST.isRealtimeAccountTransfer(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER)
      assert.equal(result, true)
    })
    it('실시간계좌이체-isNot', function () {
      const result = PAY_TYPE_CONST.isNotRealtimeAccountTransfer(dummy)
      assert.equal(result, true)
    })
    it('휴대폰-is', function () {
      const result = PAY_TYPE_CONST.isMobile(PAY_TYPE_CONST.MOBILE)
      assert.equal(result, true)
    })
    it('휴대폰-isNot', function () {
      const result = PAY_TYPE_CONST.isNotMobile(dummy)
      assert.equal(result, true)
    })
    it('페이코-is', function () {
      const result = PAY_TYPE_CONST.isPayco(PAY_TYPE_CONST.PAYCO)
      assert.equal(result, true)
    })
    it('페이코-isNot', function () {
      const result = PAY_TYPE_CONST.isNotPayco(dummy)
      assert.equal(result, true)
    })
    it('네이버페이-is', function () {
      const result = PAY_TYPE_CONST.isNaverpay(PAY_TYPE_CONST.NAVER_PAY)
      assert.equal(result, true)
    })
    it('네이버페이-isNot', function () {
      const result = PAY_TYPE_CONST.isNotNaverpay(dummy)
      assert.equal(result, true)
    })
    it('NS페이 신용카드-is', function () {
      const result = PAY_TYPE_CONST.isNSPayCreditCard(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD)
      assert.equal(result, true)
    })
    it('NS페이 신용카드-isNot', function () {
      const result = PAY_TYPE_CONST.isNotNSPayCreditCard(dummy)
      assert.equal(result, true)
    })
    it('NS페이 계좌이체-is', function () {
      const result = PAY_TYPE_CONST.isNSPayAccountTransfer(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER)
      assert.equal(result, true)
    })
    it('NS페이 계좌이체-isNot', function () {
      const result = PAY_TYPE_CONST.isNotNSPayAccountTransfer(dummy)
      assert.equal(result, true)
    })
  })
})

describe('orderConst-결제보조수단 (PAY_ASSIST_CONST) 테스트', function () {
  const dummy = 'dummy'
  const langEn = 'en'
  describe('PAY_ASSIST_CONST.isCodes', function () {
    it('결제보조수단확인-true', function () {
      const result = PAY_ASSIST_CONST.isCodes('500')
      assert.equal(result, true)
    })
    it('결제보조수단확인-false', function () {
      const result = PAY_ASSIST_CONST.isCodes()
      assert.equal(result, false)
    })
  })
  describe('PAY_ASSIST_CONST.getName-ko', function () {
    it('예치금-ko', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.DEPOSIT_AMT)
      assert.equal(name, PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.KO)
    })
    it('적립금-ko', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.RESERVED_AMT)
      assert.equal(name, PAY_ASSIST_CONST.INFO.RESERVED_AMT.KO)
    })
    it('NS상품권-ko', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.NS_GIFT_CARD)
      assert.equal(name, PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.KO)
    })
    it('OK캐쉬백-ko', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.OK_CASHBAG)
      assert.equal(name, PAY_ASSIST_CONST.INFO.OK_CASHBAG.KO)
    })
    it('네티웰-ko', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.NETI_WELL)
      assert.equal(name, PAY_ASSIST_CONST.INFO.NETI_WELL.KO)
    })
    it('해피머니-ko', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.HAPPY_MONEY)
      assert.equal(name, PAY_ASSIST_CONST.INFO.HAPPY_MONEY.KO)
    })
    it('연간할인권-ko', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.ANNUAL_COUPONS)
      assert.equal(name, PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.KO)
    })
    it('Empty getName', function () {
      const name = PAY_ASSIST_CONST.getName('')
      assert.equal(name, '')
    })
  })

  describe('PAY_ASSIST_CONST.getName-en', function () {
    it('예치금-en', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.DEPOSIT_AMT, langEn)
      assert.equal(name, PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.EN)
    })
    it('적립금-en', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.RESERVED_AMT, langEn)
      assert.equal(name, PAY_ASSIST_CONST.INFO.RESERVED_AMT.EN)
    })
    it('NS상품권-en', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.NS_GIFT_CARD, langEn)
      assert.equal(name, PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.EN)
    })
    it('OK캐쉬백-en', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.OK_CASHBAG, langEn)
      assert.equal(name, PAY_ASSIST_CONST.INFO.OK_CASHBAG.EN)
    })
    it('네티웰-en', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.NETI_WELL, langEn)
      assert.equal(name, PAY_ASSIST_CONST.INFO.NETI_WELL.EN)
    })
    it('해피머니-en', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.HAPPY_MONEY, langEn)
      assert.equal(name, PAY_ASSIST_CONST.INFO.HAPPY_MONEY.EN)
    })
    it('연간할인권-en', function () {
      const name = PAY_ASSIST_CONST.getName(PAY_ASSIST_CONST.ANNUAL_COUPONS, langEn)
      assert.equal(name, PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.EN)
    })
  })

  describe('PAY_ASSIST_CONST.is... and PAY_ASSIST_CONST.isNot...', function () {
    it('예치금-is', function () {
      const result = PAY_ASSIST_CONST.isDepositAmt(PAY_ASSIST_CONST.DEPOSIT_AMT)
      assert.equal(result, true)
    })
    it('예치금-isNot', function () {
      const result = PAY_ASSIST_CONST.isNotDepositAmt(dummy)
      assert.equal(result, true)
    })
    it('적립금-is', function () {
      const result = PAY_ASSIST_CONST.isReservedAmt(PAY_ASSIST_CONST.RESERVED_AMT)
      assert.equal(result, true)
    })
    it('적립금-isNot', function () {
      const result = PAY_ASSIST_CONST.isNotReservedAmt(dummy)
      assert.equal(result, true)
    })
    it('NS상품권-is', function () {
      const result = PAY_ASSIST_CONST.isNsGiftCard(PAY_ASSIST_CONST.NS_GIFT_CARD)
      assert.equal(result, true)
    })
    it('NS상품권-isNot', function () {
      const result = PAY_ASSIST_CONST.isNotNsGiftCard(dummy)
      assert.equal(result, true)
    })
    it('OK캐쉬백-is', function () {
      const result = PAY_ASSIST_CONST.isOkCashbag(PAY_ASSIST_CONST.OK_CASHBAG)
      assert.equal(result, true)
    })
    it('OK캐쉬백-isNot', function () {
      const result = PAY_ASSIST_CONST.isNotOkCashbag(dummy)
      assert.equal(result, true)
    })
    it('네티웰-is', function () {
      const result = PAY_ASSIST_CONST.isNetiWell(PAY_ASSIST_CONST.NETI_WELL)
      assert.equal(result, true)
    })
    it('네티웰-isNot', function () {
      const result = PAY_ASSIST_CONST.isNotNetiWell(dummy)
      assert.equal(result, true)
    })
    it('해피머니-is', function () {
      const result = PAY_ASSIST_CONST.isHappyMoney(PAY_ASSIST_CONST.HAPPY_MONEY)
      assert.equal(result, true)
    })
    it('해피머니-isNot', function () {
      const result = PAY_ASSIST_CONST.isNotHappyMoney(dummy)
      assert.equal(result, true)
    })
    it('연간할인권-is', function () {
      const result = PAY_ASSIST_CONST.isAnnualCoupons(PAY_ASSIST_CONST.ANNUAL_COUPONS)
      assert.equal(result, true)
    })
    it('연간할인권-isNot', function () {
      const result = PAY_ASSIST_CONST.isNotAnnualCoupons(dummy)
      assert.equal(result, true)
    })
  })
})
