import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/vuex'
import 'intersection-observer'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import Vue2TouchEvents from 'vue2-touch-events'
import VueMeta from 'vue-meta'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'
import 'video.js/dist/video-js.min.css'
import '@videojs/http-streaming/dist/videojs-http-streaming.min'
import VueVideoPlayer from 'vue-video-player'

import CONST from '@constants/framework/framework'
import COMM_CONST from '@constants/framework/constants'
import nsaxios from '@frameworks/axiosUtil'
import errorUtil from '@frameworks/errorUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import nslog from '@frameworks/logUtil'
import routerUtil from '@frameworks/routerUtil'
import checkUpdateUtil from '@utils/checkUpdateUtil'
import {
  getUUID
} from '@utils/commonutil/commonUtil'
import storageValidationUtil from '@utils/storageValidationUtil'

Vue.use(VueAwesomeSwiper)
Vue.use(Vue2TouchEvents, {
  disableClick: true, // 터치 해제 이후에도 버튼 강조 해제 안되는 버그 수정
  touchClass: 'pressed' // 공통 터치 클래스
})
Vue.use(VueMeta)
Vue.use(VueVideoPlayer)

Vue.config.productionTip = false

/**
 * custom error hanlder
 * @param {Object} err 에러 객체
 * @param {Object} vm view model
 * @param {Object} info
 */
Vue.config.errorHandler = function (err, vm, info) {
  // 업데이트 확인
  if (!CONST.IS_LOCAL_MODE && !CONST.IS_TEST_REPORT) {
    checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.NONE)
  }
  nslog.sendRecord(CONST.LOG.TYPE.ERROR, {
    type: info,
    message: err.message,
    trace: err.stack,
    status: '500',
    page: errorUtil.getCurrentURL(),
    view: errorUtil.getComponentName(vm)
  })
  if (CONST.IS_DEV_LOG) {
    console.error(err)
    console.info(vm)
    console.info(info)
  }
}

// nsaxios global 설정
Vue.prototype.$nsaxios = nsaxios

/**
 * 설정 초기화
 */
const init = async () => {
  try {
    // 최초 세션을 받아오기 위한 dummy API 호출
    await nsaxios.post('Dummy', {})

    // storage 초기화 필요 여부 확인
    storageValidationUtil.checkStorageResetRequired()

    // LocalStorage에 UUID 가 없으면 생성 후 저장
    if (!localStorageUtil.get(COMM_CONST.STORAGE_KEY.UUID)) {
      localStorageUtil.set(COMM_CONST.STORAGE_KEY.UUID, getUUID())
    }

    // 업데이트 확인 인자값(index.html의 LastModified값) 최초 LocalStorage 저장
    checkUpdateUtil.saveLatest()

    // 라우터 이동 간 발생하는 오류를 global하게 핸들링
    routerUtil.onRouterAbortShim()
  } finally {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
}

init()
