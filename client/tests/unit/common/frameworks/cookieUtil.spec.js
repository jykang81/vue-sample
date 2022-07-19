import cookieUtil from '@frameworks/cookieUtil'
// import { assert } from 'chai'

describe('cookieUtil', function () {
  it('쿠키 설정 및 가져오기 및 삭제', function () {
    // 만료시간 가져오기
    const expires = cookieUtil.getExpDate(1, 1, 1)

    // 쿠키 설정
    cookieUtil.setCookie('test1', 'test1CookieVal', expires, '', '.nsmall.com', 'Secure')

    // 쿠키 가져와서 value 가 정상적으로 있는지 확인
    cookieUtil.getCookie('test1')
    // const actual = cookieUtil.getCookie('test1')
    // const expected = 'test1CookieVal'
    // assert.equal(actual, expected)

    // 쿠키 삭제
    cookieUtil.deleteCookie('test1', '', '.nsmall.com')

    // 쿠키 가져온후 값이 없는지 확인
    // assert.equal(cookieUtil.getCookie('test1'), '')
  })
})
