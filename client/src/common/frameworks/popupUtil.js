import $store from '@/vuex'
import COMM_CONST from '@constants/framework/constants'
import {
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import axiosUtil from '@frameworks/axiosUtil'
import nativeUtil from '@frameworks/nativeUtil'

// 팝업 유틸
const popupUtil = {
  /**
   * 공통 레이어 팝업 호출
   *
   * @param {String} component 팝업 컨테이너에 담을 팝업 vue 파일의 경로. @components/ 하위의 경로부터 입력합니다. ex) 'customer/MemberAgree'
   * @param {Object} param 팝업 컨테이너에 담을 팝업 vue 파일에 전달할 파라미터
   * @param {Function} callbackFunction 팝업 종료 시 실행할 콜백
   * @param {boolean} [isShowHeader = true] 헤더 노출 여부
  */
  show (component, param, callbackFunction, isShowHeader = true) {
    const popupObj = {
      param,
      callbackFunction,
      isFullLayer: true,
      isShowHeader,
      // eslint-disable-next-line prefer-template
      path: () => import(/* webpackChunkName: "[request]" */ '@components/' + component)
    }
    $store.commit('popup/setPopupList', popupObj)
    $store.commit('popup/show')
    if (isOsApp() &&
    component.indexOf('order/detail/MypageOrderDetail') < 0 &&
    component.indexOf('order/cancel/OrderCancelDetailStatement') < 0) {
      if (component.indexOf('common/SearchLayer') > -1) {
        nativeUtil.setRoutePath('/native/search') // 음성검색 띄우기 위해 검색 Path 통일
      } else {
        nativeUtil.setRoutePath('/popup')
      }
    }
  },
  /**
   * 공통 레이어 팝업 닫기
   *
   * @param {*} [callbackData] 팝업을 호출한 컴포넌트에 넘겨줄 callback Data
   */
  close (callbackData) {
    $store.commit('popup/hide', callbackData)
  },
  /**
   * 공통 레이어 팝업 모두 닫기
   *
   */
  closeAll () {
    $store.commit('popup/hideAll')
  },
  /**
   * 이벤트 팝업 열기
   * @param {Object} params API 호출 및 컴포넌트 전달용 파라미터
   * @param {String} [params.type] 이벤트 타입 (STORAGE_KEY 참고)
   * @param {String} [params.vendorId] 업체식별자
   * @param {String} [params.partNumber] 상품번호
   * @param {String} [params.categoryId] 카테고리식별자
   * @param {String} [params.brandCode] 브랜드코드
   * @param {Function} [params.okCallback] 이벤트 팝업 컴포넌트 버튼 콜백 (기본: 오늘 하루 보지 않기)
   * @param {Function} [params.cancelCallback] 이벤트 팝업 컴포넌트 버튼 콜백 (기본: 닫기)
   */
  openEventPopup (params) {
    const {
      categoryId = null,
      partNumber = null,
      brandCode = null,
      vendorId = null
    } = params

    const apiParams = {
      cmdType: 'getList',
      isMobileYn: 'Y',
      req_co_cd: COMM_CONST.getCocd()
    }

    if (params.type === COMM_CONST.STORAGE_KEY.EVENT_POPUP_LOGIN) { // 로그인
      apiParams.popAreaLv1 = '02'
    } else if (params.type === COMM_CONST.STORAGE_KEY.EVENT_POPUP_REGIST) { // 회원가입
      apiParams.popAreaLv1 = '03'
    } else if (params.type === COMM_CONST.STORAGE_KEY.EVENT_POPUP_MAIN) { // 메인
      apiParams.popAreaLv1 = '01'
      apiParams.categoryId = categoryId
    } else if (params.type === COMM_CONST.STORAGE_KEY.EVENT_POPUP_EXHABIT) { // 전시매장
      apiParams.popAreaLv1 = '05'
      apiParams.categoryId = categoryId
    } else if (params.type === COMM_CONST.STORAGE_KEY.EVENT_POPUP_DETAIL) { // 상품상세
      apiParams.popAreaLv1 = '04'
      apiParams.partNumber = partNumber
      apiParams.brandCode = brandCode
      apiParams.vendorId = vendorId
    }

    const handleSuccess = response => {
      if (!isNull(response.eventPopupList) && response.eventPopupList.length > 0) {
        const props = {
          msg: response.eventPopupList,
          okCb: params.okCallback,
          canCb: params.cancelCallback || null,
          okTxt: params.okTxt || null,
          cancelTxt: params.cancelTxt || null,
          topScroll: params.top || null,
          close: true,
          type: 'event'
        }

        $store.commit('popup/setPopupList', {
          param: props,
          callbackFunction: null,
          path: () => import(/* webpackChunkName: "EventPopup" */ '@components/common/EventPopup')
        })

        $store.commit('popup/show')
      }
    }

    axiosUtil.post('NSAjaxEventPopup', apiParams, handleSuccess)
  }
}

export default popupUtil
