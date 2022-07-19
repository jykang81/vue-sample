import CONST from '@/common/constants/framework/framework'
import logUtil from '@frameworks/logUtil'

const errorUtil = {
  /**
   * 현재 Url 가져오기
   *
   * @returns {string} 현재 URL
   */
  getCurrentURL () {
    const currentURL = location.href

    return currentURL
  },
  /**
   * 컴포넌트명 가져오기
   *
   * @param {object} vm - View Model 객체
   * @returns {string} 컴포넌트 name
   */
  getComponentName (vm) {
    let componentName = ''

    if (vm) {
      componentName = vm.$options.name
    }

    return componentName
  },
  /**
   * 에러 파라미터 생성
   *
   * @param {Error} error - 오류 객체
   * @param {object} vm - View Model 객체
   * @returns {ErrorLogParam}
   */
  generateErrorParam (error, vm) {
    const { message, stack } = error
    const currentURL = this.getCurrentURL()
    const componentName = this.getComponentName(vm)

    const params = {
      type: CONST.LOG.MESSAGE.REQUEST.ERROR,
      message,
      trace: stack,
      status: '500',
      page: currentURL,
      view: componentName
    }

    return params
  },
  /**
   * 공통 에러 기록
   *
   * @param {Error} error - 오류 객체
   * @param {object} vm - View Model 객체
   */
  logError (error, vm) {
    const params = this.generateErrorParam(error, vm)

    logUtil.sendRecord(CONST.LOG.TYPE.ERROR, params)
  },
  /**
   * 공통 에러 처리
   *
   * @param {object} error - error 객체
   * @param {object} vm - View Model 객체
   */
  handleError (error, vm) {
    this.logError(error, vm)
  }
}

/**
 * 에러 로그용 매개변수 객체
 * @typedef {object} ErrorLogParam
 * @property {string} type - 에러 타입 ex) CONST.LOG.MESSAGE.REQUEST.ERROR
 * @property {string} message - 에러 메시지
 * @property {string} trace - 에러 stack
 * @property {string} status - 상태 (임시로 '500' 사용)
 * @property {string} page - 에러가 발생한 시점의 URL
 * @property {string} view - 에러가 발생한 컴포넌트 name
 */

export default errorUtil
