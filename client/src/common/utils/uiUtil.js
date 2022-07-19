import throttle from 'lodash/throttle'
import smoothscroll from 'smoothscroll-polyfill'
import $store from '@/vuex'
import {
  isiOS,
  viewType
} from '@utils/commonutil/commonUtil'

const uiUtil = {
  EL_SCROLL_MOVE_APP_HEADER: -55,
  windowScrollPosition: 0, // 최상위 스크롤 포지션
  layerScrollPosition: 0, // 레이어 스크롤 포지션
  fixedElements: [], // fixed 요소 목록
  canShowFixedElement: true, // fixed 요소 표시 가능 여부

  /**
   * 스크롤 이동
   *
   * @param {string} id (필수) 이동할 엘리먼트 ID
   * @param {number} [addHeight=0] (선택) 보정 높이 (엘리먼트 ID 위치로만은 원하는 위치로의 이동 제어가 되지 않는 경우 보정 높이를 더해서 높이를 보정함)
   */
  scrollMove (id, addHeight = 0) {
    smoothscroll.polyfill()

    const element = document.getElementById(id)

    // DOM 유효성 검사
    if (typeof (element) === 'undefined' || element === null) {
      return
    }

    const fullLayerElment = document.querySelector('.full_layer')
    if ($store.getters['popup/hasFullLayerPopup'] && fullLayerElment) { // fullayer
      const destination = fullLayerElment.scrollTop + element.getBoundingClientRect().top + addHeight
      fullLayerElment.scrollTo({
        top: destination,
        left: 0,
        behavior: 'smooth' // smooth, auto
      })
    } else { // 일반
      const destination = window.pageYOffset + element.getBoundingClientRect().top + addHeight
      window.scrollTo({
        top: destination,
        left: 0,
        behavior: 'smooth' // smooth, auto
      })
    }
  },
  /**
   * 무한 스크롤 콜백 바인딩
   *
   * @param {Object} vueObject 컴포넌트 인스턴스 (라이프사이클 접근용)
   * @param {Object} paramObject 스크롤 설정용 오브젝트
   * @param {Function} paramObject.callback
   *  스크롤 발생 시 실행될 콜백 함수 (필수)
   * @param {Boolean} [paramObject.isEnable=true]
   *  콜백 실행 허용 여부. 동적제어 필요시 사용 (옵션)
   * @param {Number} [paramObject.interval=1000]
   *  콜백 실행 주기. ms 단위 (옵션)
   * @param {Object} [paramObject.eventTarget=window]
   *  스크롤 이벤트 바인딩 대상 (옵션)
   * @param {Number} [paramObject.triggerHeightPercent=100]
   *  콜백 허용 높이. 퍼센티지(%) 단위 (옵션)
   */
  bindInfiniteScroll (vueObject, paramObject) {
    this.validateVueInstance(vueObject)
    this.validateParam(paramObject)
    this.setDefaultPropertiesOnParam(paramObject)

    let currentTime, lastExecutionTime, timer

    /**
     * wrapper scroll event 콜백
     * @returns
     */
    const handleScroll = () => {
      /* 콜백 호출 가능 여부 확인 */
      if (!paramObject.isEnable) {
        return
      }

      // 스크롤 도달 여부 검증
      if (!this.getIsTriggerHeight(paramObject.eventTarget, paramObject.triggerHeightPercent)) {
        return
      }

      // 스크롤 괴리 보정 처리
      if (this.isOverRestrictedTriggerHeight()) {
        return
      }

      /** throttle 처리 */
      currentTime = Date.now()

      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      if (lastExecutionTime) {
        const diff = paramObject.interval - (currentTime - lastExecutionTime)

        if (diff < 0) {
          paramObject.callback()
          lastExecutionTime = currentTime
        } else {
          timer = setTimeout(() => {
            paramObject.callback()
            lastExecutionTime = currentTime
          }, diff)
        }
      } else {
        paramObject.callback()
        lastExecutionTime = currentTime
      }
    }

    // 무한 스크롤 콜백 설정
    const deobuncedFunction = throttle(handleScroll, 1000)
    paramObject.eventTarget.addEventListener('scroll', deobuncedFunction)

    // 컴포넌트 삭제될 때, 무한 스크롤 콜백 설정 해제
    this.deferUnbindInfiniteScroll(vueObject, paramObject.eventTarget, deobuncedFunction)
  },
  /**
   * 기본 프로퍼티 설정
   * @param {Object} paramObject 스크롤 설정용 오브젝트
   */
  setDefaultPropertiesOnParam (paramObject) {
    if (!Object.prototype.hasOwnProperty.call(paramObject, 'isEnable')) {
      paramObject.isEnable = true
    }

    if (!Object.prototype.hasOwnProperty.call(paramObject, 'interval')) {
      paramObject.interval = 1000
    }

    if (!Object.prototype.hasOwnProperty.call(paramObject, 'eventTarget')) {
      paramObject.eventTarget = window
    }

    if (!Object.prototype.hasOwnProperty.call(paramObject, 'triggerHeightPercent')) {
      paramObject.triggerHeightPercent = 100
    }
  },
  /**
   * 무한 스크롤 콜백 해제
   *
   * @param {object} vueObject 컴포넌트 인스턴스 (라이프사이클 접근용)
   * @param {object} element DOM 오브젝트
   * @param {function} eventCallback wrapper scroll event 콜백
   */
  deferUnbindInfiniteScroll (vueObject, element, eventCallback) {
    /** 일반 컴포넌트 후처리 */
    vueObject.$on('hook:beforeDestroy', function () {
      element.removeEventListener('scroll', eventCallback)
    })

    /** keep-alive 컴포넌트 후처리 */
    vueObject.$on('hook:deactivated', function () {
      element.removeEventListener('scroll', eventCallback)
    })
  },
  /**
   * vue instance 검증
   *
   * @param {object} vueObject 컴포넌트 인스턴스
   */
  validateVueInstance (vueObject) {
    if (!vueObject) {
      throw new Error('vue instance 매개변수 누락')
    }

    if (!vueObject._isVue) {
      throw new Error('vue 형식의 객체가 아닙니다')
    }
  },
  /**
   * 스크롤 이벤트 콜백용 파라미터 객체 검증
   *
   * @param {object} paramObject 스크롤 이벤트 콜백용 파라미터
   */
  validateParam (paramObject) {
    const { callback } = paramObject

    if (typeof callback !== 'function') {
      throw new Error('callback 함수 누락')
    }
  },
  /**
   * 콜백 트리거 높이 확인
   *
   * @param {object} element DOM 오브젝트
   * @param {number} triggerHeightPercent 콜백 트리거 높이
   * @returns {boolean}
   */
  getIsTriggerHeight (element, triggerHeightPercent) {
    const footerElement = document.querySelector('.app_footer')
    const currentHeight = window.pageYOffset + document.documentElement.clientHeight
    // 페이지에 footer 있으면, footer 높이 감산 처리
    const triggerHeight = footerElement
      ? (document.documentElement.scrollHeight - footerElement.clientHeight) * (triggerHeightPercent / 100)
      : document.documentElement.scrollHeight * (triggerHeightPercent / 100)

    return currentHeight >= triggerHeight
  },
  /**
   * intersection observer API 기반 무한스크롤 함수
   *
   * @param {object} vueObject component instance 객체 (this)
   * @param {object} paramObject 스크롤 이벤트 바인딩용 옵션 객체
   * @param {function} paramObject.callback
   *  Element가 가시 범위에 들어올 때 실행될 콜백 함수 (필수)
   * @param {function} [paramObject.conditionCallback]
   *  콜백 실행 허용 여부 함수. 동적으로 콜백 실행여부를 제어할 때 사용 (옵션)
   * @param {object} [paramObject.options]
   *  intersection observer option 객체 (옵션)
   *  https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver
   * @param {object} [paramObject.targetElement]
   *  교차 영역 대상 Element (옵션)
   * @returns {object} intersection observer 객체 반환
   */
  setInfiniteScroll (vueObject, paramObject) {
    const {
      callback,
      conditionCallback = null,
      options = {
        root: null, // default: null
        rootMargin: '0px 0px 0px 0px', // top, right, bottom, left. default: '0px'
        threshold: [0] // array or number. default: [0]
      },
      targetElement = document.getElementById('global_io_target')
    } = paramObject

    const io = new IntersectionObserver(entries => {
      if (conditionCallback) {
        const isApproved = conditionCallback(paramObject)
        if (!isApproved) { return }
      }

      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return
        }

        callback(entry)
      })
    }, options)

    /** observe intersection */
    io.observe(targetElement)

    /** unset when component destory */
    vueObject.$on('hook:beforeDestroy', function () {
      if (io) {
        io.disconnect()
      }
    })

    /** unset when component destory */
    vueObject.$on('hook:deactivated', function () {
      if (io) {
        io.disconnect()
      }
    })

    return io
  },
  /**
   * 높이 제한 해당 여부 반환
   * 콜백이 반복됨에 따라, trigger가 동작하는 스크롤 절대값(px)이 점점 커짐.
   * 괴리되는 값 보정용
   */
  isOverRestrictedTriggerHeight () {
    const BASE_DOCUMENT_HEIGHT = 10000
    const RESTRICTED_HEIGHT = 2500

    const wholeHeight = document.documentElement.scrollHeight

    // 기준 문서 높이 보다 작으면, method 종료
    if (wholeHeight <= BASE_DOCUMENT_HEIGHT) {
      return false
    }

    const currentHeight = window.pageYOffset + document.documentElement.clientHeight
    const gapOfHeight = wholeHeight - currentHeight

    return gapOfHeight >= RESTRICTED_HEIGHT
  },
  /**
   * 스크롤 허용 처리
   * @param {Element} targetElement 스크롤 허용 대상
   */
  enableScroll (targetElement) {
    const el = targetElement || document.body

    if ($store.state.popup.popupList.length > 0 && el === document.body) { // 팝업 있을 때 최상위 스크롤 해제 방지
      return
    }

    if ($store.state.message.isShow) { // 메시지 팝업 있을 때 스크롤 해제 방지
      return
    }

    if (this.isItNecessaryForScrollPolyfill()) {
      if (el.style.overflow !== 'hidden') { // enable 상태에서 중복호출 방지
        return
      }

      el.style.removeProperty('overflow')
      el.style.removeProperty('position')
      el.style.removeProperty('top')
      el.style.removeProperty('left')
      el.style.removeProperty('right')
      el.style.removeProperty('max-width')

      const layerEl = document.querySelector('.full_layer')
      if (layerEl !== null) {
        layerEl.scrollTo(0, this.layerScrollPosition)
      } else {
        window.scrollTo(0, this.windowScrollPosition)
      }
    } else {
      // 풀 레이어가 존재하지 않으면 스크롤 허용 처리
      if (!$store.getters['popup/hasFullLayerPopup']) {
        el.classList.remove('no_scroll')
      }
    }
  },
  /**
   * 스크롤 불가 처리
   * @param {Element} targetElement 스크롤 불가 대상
   */
  disableScroll (targetElement) {
    const el = targetElement || document.body

    if (this.isItNecessaryForScrollPolyfill()) {
      if (el.style.overflow === 'hidden') { // disable 상태에서 중복호출 방지
        return
      }

      const layerEl = document.querySelector('.full_layer')
      let scrollPosition
      if (layerEl !== null) {
        scrollPosition = layerEl.scrollTop
        this.layerScrollPosition = scrollPosition
      } else {
        scrollPosition = window.pageYOffset
        this.windowScrollPosition = scrollPosition
      }

      const widthOfEl = el.clientWidth

      el.style.overflow = 'hidden'
      el.style.position = 'fixed'
      el.style.top = `-${scrollPosition}px`
      el.style.left = 0
      el.style.right = 0
      el.style.maxWidth = `${widthOfEl}px`
    } else {
      el.classList.add('no_scroll')
    }
  },
  /**
   * 스크롤 토글 처리
   * @param {Element} targetElement 스크롤 토글 대상
   */
  toggleScroll (targetElement) {
    const el = targetElement || document.body

    if (this.isItNecessaryForScrollPolyfill()) {
      if (this.isScrollEnable()) {
        this.disableScroll()
      } else {
        this.enableScroll()
      }
    } else {
      el.classList.toggle('no_scroll')
    }
  },
  /**
   * iOS version 정보 반환
   * @returns {Array}
   */
  getIOSVersion () {
    const versionInfo = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
    const versionArray = [parseInt(versionInfo[1], 10), parseInt(versionInfo[2], 10), parseInt(versionInfo[3] || 0, 10)] // ex) 10_3_1 -> [10, 3, 1]

    return versionArray
  },
  /**
   * scroll polyfill 필요 여부 반환
   * @returns {Boolean}
   */
  isItNecessaryForScrollPolyfill () {
    if (isiOS()) {
      return true // iOS version 구분 없이 polyfill 처리
    } else {
      return false
    }
  },
  /**
   * 스크롤 가능 여부 반환 (iOS 12 이하 대응용)
   * @param {Element} targetElement 스크롤 상태 판단 대상
   * @returns {Boolean}
   */
  isScrollEnable (targetElement) {
    const el = targetElement || document.body

    if (el.style.position === 'fixed' &&
      el.style.overflow === 'hidden' &&
      el.style.width === '100%') {
      return false
    } else {
      return true
    }
  },
  /**
   * fixed 요소 깨짐 방지 (iOS 웹뷰 버그 대응용)
   * @param {HTMLElement} fixedElement 고정 요소
   */
  preventFixedElementCracking (fixedElement) {
    if (viewType() !== 'ios') {
      return
    }

    if (!fixedElement) {
      return
    }

    this.fixedElements.push(fixedElement)
  },
  /**
   * fixed 요소 깨짐 방지 처리 설정 (iOS 웹뷰 버그 대응용)
   */
  setPreventFixedElementCracking () {
    if (viewType() !== 'ios') {
      return
    }

    const hideFixedElement = fixedElement => {
      this.canShowFixedElement = false
      fixedElement.style.bottom = 'unset'
    }

    const showFixedElement = fixedElement => {
      this.canShowFixedElement = true

      setTimeout(() => {
        let count = 5

        const intervalRef = setInterval(() => {
          if (count <= 0) {
            clearInterval(intervalRef)
          }

          if (this.canShowFixedElement) {
            fixedElement.style.removeProperty('bottom')
          }

          count--
        }, 100)
      }, 100)
    }

    const filterRemovedElement = () => {
      this.fixedElements = this.fixedElements.filter(el => {
        return document.body.contains(el)
      })
    }

    document.addEventListener('focusin', () => {
      filterRemovedElement() // 고정 요소 갱신

      this.fixedElements.forEach(hideFixedElement)
    })

    document.addEventListener('focusout', () => {
      this.fixedElements.forEach(showFixedElement)
    })
  }
}

export default uiUtil
