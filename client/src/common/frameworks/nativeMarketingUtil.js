import {
  isOsApp
} from '@utils/commonutil/commonUtil'
const nativeMarketingUtil = {
  /**
   * 웹에서 GA360 native lib 이용 (GA360 log)
   * @param {String} type 타입
   * @param {Object} jsonObj JSON Object
   */
  ga360LoggerNativeSend (type, jsonObj) {
    if (isOsApp() && window.NSHub !== undefined) {
      try {
        window.NSHub.naGa360LoggerNativeSend(type, JSON.stringify(jsonObj))
      } catch (e) {
      }
    }
  },
  /**
   * 웹에서 AIQUA native lib 이용 (AIQUA log)
   * @param {String} type 타입
   * @param {Object} jsonObj JSON Object
   */
  aiquaLoggerNativeSend (type, jsonObj) {
    if (isOsApp() && window.NSHub !== undefined) {
      try {
        window.NSHub.naAiquaLoggerNativeSend(type, JSON.stringify(jsonObj))
      } catch (e) {
      }
    }
  },
  /**
   * 웹에서 AirBridge native lib 이용 (AirBridge log)
   * @param {String} type 타입
   * @param {Object} jsonObj JSON Object
   */
  airbridgeLoggerNativeSend (type, jsonObj) {
    if (isOsApp() && window.NSHub !== undefined) {
      try {
        window.NSHub.naAirbridgeLoggerNativeSend(type, JSON.stringify(jsonObj))
      } catch (e) {
      }
    }
  }
}
export default nativeMarketingUtil
