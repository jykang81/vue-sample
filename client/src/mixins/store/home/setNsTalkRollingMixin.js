import CONST from '@constants/framework/framework'
import {
  isNull
} from '@utils/commonutil/commonUtil'

const setNsTalkRollingMixin = {
  data () {
    return {
      /** ns톡 관련 속성 시작. */
      paramData: null, // 전 화면에서 넘겨받은 파라메터 객체.
      nsTalkCode: '', // 응답코드
      nsTalkMessage: [], // 최대 5개의 ns채팅 메세지.
      nsTalkCount: 0, // 메세지 갯수.
      nsTalkEnable: false, // ns톡 활성화 여부.
      nsTalkInterval: null, // 10초간격 조회용 인터벌 객체
      nsTalkInfoInterval: null // 홈매장 Invoke 세팅 인터벌 객체
      /** ns톡 관련 속성 끝. */
    }
  },
  beforeDestroy () {
    if (!isNull(this.nsTalkInterval)) { clearInterval(this.nsTalkInterval) }
    if (!isNull(this.nsTalkInfoInterval)) { clearInterval(this.nsTalkInfoInterval) }
  },
  methods: {
    /**
     * NSTALK API Invoke 속성 세팅
     * @param {String} identify - tv live와 띵라이브 구분자
     * @param {String} goodId - 상품코드
     * @param {String} startdtm - 방송 시작시간
     * @param {String} enddtm - 방송 종료시간
     * @param {Number} count - 조회할 메세지의 수
     * @returns { void }
     */
    setNsTalkInfo (identify = '', goodId, startdtm, enddtm, count = 5) {
      this.paramData = { identify, goodId, startdtm, enddtm, count }
    },
    /**
     * 서버에 요청하여 nstalk 이용가능 여부, 메세지, 카운트 를 반환.
     * @returns {Object} promise - 응답 데이터 객체.
     */
    async setNsTalkRollingAjax () {
      const { identify, goodId, startdtm, enddtm, count } = this.paramData
      let nstalkRollingUrl = ''
      let resultData = null
      switch (identify) {
        case 'tv':
          nstalkRollingUrl = `https://${CONST.NSTALK_TVLIVE_PATH}/api/messages`
          break
        case 'ting':
          nstalkRollingUrl = `https://${CONST.NSTALK_THINGLIVE_PATH}/api/messages`
          break
        default:
          return false
      }
      const invoke = {
        crossDomain: true,
        dataType: 'json',
        code: goodId,
        count,
        start_date: startdtm,
        end_date: enddtm
      }
      const response = await this.$nsaxios.post(nstalkRollingUrl, invoke)
      if (!isNull(response.data)) { resultData = response.data }
      return resultData
    },
    /**
     * nstalk rolling api 콜(공통함수) 호출
     */
    async nsTalkRollingCall () {
      const nstalkRollingCallData = await this.setNsTalkRollingAjax()
      if (!isNull(nstalkRollingCallData)) {
        if (nstalkRollingCallData.talk_enable) {
          this.nsTalkCode = nstalkRollingCallData.code
          this.nsTalkMessage = []
          for (const msgObj of nstalkRollingCallData.messages) {
            this.nsTalkMessage.push(msgObj.msg)
          }
          const swiper = document.querySelector('.swiper-container')?.swiper
          if (!isNull(swiper)) {
            swiper.once('transitionStart', () => { // Swiper duplicate slide의 업데이트를 강제
              swiper.loopDestroy()
              swiper.loopCreate()
            })
          }
        }
        this.nsTalkCount = nstalkRollingCallData.count
        this.nsTalkEnable = nstalkRollingCallData.talk_enable
      }
    },
    /**
     * 한번 호출 이후 10초마다 요청 갱신
     */
    setNsTalkRolling () {
      if (!isNull(this.nsTalkInterval)) { clearInterval(this.nsTalkInterval) }
      this.nsTalkRollingCall()
      this.nsTalkInterval = setInterval(this.nsTalkRollingCall, 10000)
    },
    /**
     * 홈매장을 위한 nstalk rolling 메소드.
     * @param {String} identify - tv live와 띵라이브 구분자
     * @param {String} goodId - 상품코드
     * @param {String} startdtm - 방송 시작시간
     * @param {String} enddtm - 방송 종료시간
     * @param {Number} count - 조회할 메세지의 수
     */
    setNsTalkRollingForHome (identify = '', goodId, startdtm, enddtm, count = 5) {
      if (!isNull(this.nsTalkInterval)) { clearInterval(this.nsTalkInterval) }
      if (!isNull(this.nsTalkInfoInterval)) { clearInterval(this.nsTalkInfoInterval) }
      this.setNsTalkInfo(identify, goodId, startdtm, enddtm, count)
      this.nsTalkRollingCall()
      this.nsTalkInfoInterval = setInterval(this.setNsTalkInfo, 10000, identify, goodId, startdtm, enddtm, count)
      this.nsTalkInterval = setInterval(this.nsTalkRollingCall, 10000)
    }
  }

}

export default setNsTalkRollingMixin
