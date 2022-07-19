import popupUtil from '@frameworks/popupUtil'

/**
 * 주소찾기 팝업 열기
 *
 * @param {Function} callback callback function
 * @param {Boolean} [isShowMenu] 상단 레이아웃 메뉴가 안보여 지면 타이틀 가운데 정렬, 상단 레이아웃 오른쪽 메뉴 보여줌 안보여줌
 * @param {String} [title] 상단 레이아웃 타이틀명 변경
 * @param {Boolean} [is1Dept] 1단계 주소만 선택 여부
 */
function showSafePostCodeWindows (callback, isShowMenu, title, is1Dept) {
  const param = {
    title: '주소찾기',
    titleAlign: 'center',
    isShowSearch: false,
    isShowCart: false,
    is1Dept: false
  }

  if (isShowMenu) {
    param.titleAlign = ''
    param.isShowSearch = true
    param.isShowCart = true
  }
  if (title) {
    param.title = title
  }

  if (is1Dept) {
    param.is1Dept = is1Dept
  }

  popupUtil.show('common/SearchAddress', param, callback)
}

export default showSafePostCodeWindows
