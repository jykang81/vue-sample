// import { assert } from 'chai'
import { showSafePostCodeWindows } from '@utils/commonutil/commonUtil'

describe('showSafePostCodeWindows', () => {
  describe('주소찾기 팝업 열기', () => {
    const mockCallback = () => {}
    const isShowMenu = true
    const title = '안녕'

    it('콜백만 입력하는 경우', () => {
      showSafePostCodeWindows(mockCallback)
    })

    it('두번째 인자로 true를 전달하면 메뉴 관련 값을 설정한다', () => {
      showSafePostCodeWindows(mockCallback, isShowMenu)
    })

    it('세번째 인자로 문자열을 타이틀 관련 값을 설정한다', () => {
      showSafePostCodeWindows(mockCallback, isShowMenu, title)
    })
  })
})
