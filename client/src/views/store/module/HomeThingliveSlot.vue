<template>
  <!-- Thinglive -->
  <section v-show="hasRemainingTime" class="home_thing_live_slot">
    <div class="thing_live">
      <p class="live_title">
        띵라이브
      </p>
      <section @click="clickedLiveProduct(thingliveImage, goodsName)">
        <div class="img_box">
          <figure>
            <ns-img
              v-if="thingliveImage !== ''"
              :src="thingliveImage"
              :alt="goodsName"
              type="WIDE"
            />
            <img
              v-else
              src="~@/assets/images/common/img_noImage_wide.png"
              alt="현재 편성정보 없음."
            >
          </figure>
          <p class="live">
            <i class="icons_live" />
            <time
              v-if="timeSetFlag"
            >
              {{ timeLimit.formattedLimitTime() }}
            </time>
          </p>
        </div>
        <p class="title">
          {{ goodsName }}
        </p>
      </section>
    </div>
  </section>
</template>

<script>
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  getDateParse,
  calcDate,
  getDateParse02
} from '@frameworks/dateutil/dateUtil'
import CommonTimer from '@/common/classes/CommonTimer'

import anchorMixin from '@/mixins/store/home/anchorMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'

export default {
  name: 'HomeThingliveSlot',
  components: {
    NsImg
  },
  mixins: [
    anchorMixin
  ],
  data () {
    return {
      timeLimit: null, // 방송 타이머
      goodsName: '', // 상품명
      thingliveImage: '', // 띵라이브 라이브 이미지
      timeSetFlag: false // 방송 타이머클래스 셋팅완료 여부
    }
  },
  computed: {
    areaHide () {
      if (this.thingliveImage === '') {
        return false
      } else {
        return true
      }
    },
    hasRemainingTime () {
      return !isNull(this.timeLimit) && (this.timeLimit.hours + this.timeLimit.minutes + this.timeLimit.seconds) > 0
    }
  },
  created () {
    this.onLoad()
  },
  destroyed () {
    if (this.timeLimit) { this.timeLimit = null }
  },
  methods: {
    isNull,
    /**
     * Life Cycle: created() 호출될 때, 순차적 흐름이 필요한 메소드 모음.
     */
    onLoad () {
      setTimeout(() => this.callThingliveInfo(), 1000)
    },
    /**
     * 씡라이브 편성 정보 호출
     */
    async callThingliveInfo () {
      const commandName = 'NSFixedShopNoCacheCmd'
      const parameters = {
        espotInfo: 'EZ_HOME_TOPC_THING_LIVE|CATEVOD_VODLIVE|1|9999|0'
      }
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      if (this.thingliveValidator(apiData)) { // 씡라이브 편성정보가 있으면 데이터 셋팅.
        const thingliveData = apiData.msg[0]._EZ_HOME_TOPC_THING_LIVE[0]
        this.setThingliveData(thingliveData)
      } else {
        this.thingliveDataInit()
      }
    },
    /**
     * 씡라이브 응답 데이터 정상유무 와 편성정보 유무.
     * @param {Object} data
     * @returns {bool}
     */
    thingliveValidator (data) {
      if (!isNull(data)) {
        const checker =
          !isNull(data.msg) &&
          (data.msg.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPC_THING_LIVE) &&
          (data.msg[0]._EZ_HOME_TOPC_THING_LIVE.length) &&
          !isNull(data.msg[0]._EZ_HOME_TOPC_THING_LIVE[0].vodPlayGubun) &&
          (data.msg[0]._EZ_HOME_TOPC_THING_LIVE[0].vodPlayGubun === 'LIVE')
        return checker
      }
      return false
    },
    /**
     * 씡라이브 데이터 셋팅.
     * @param {Array} data
     */
    setThingliveData (data) {
      const idx = this.getCurrentLiveItem(data)
      if (idx < 0) {
        return false
      }
      const thingliveData = data
      this.goodsName = htmlDecode(thingliveData.vodLiveGoodsNm)
      this.thingliveImage = thingliveData.vodLiveImg
      this.timeSetFlag = true
      this.detailData = data
    },
    /**
     * 현재 방송중인 씡라이브 타이머 셋팅.
     * @param {Object} data
     * @returns {Number} idx
     */
    getCurrentLiveItem (data) {
      let idx = -1
      try {
        const msecPerMinute = 1000 * 60
        const msecPerHour = msecPerMinute * 60
        const currentTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        const etime = getDateParse02(data.vodLiveEndDttm)

        let interval = (etime.getTime() - currentTime.getTime())
        const hours = Math.floor(interval / msecPerHour)

        interval = interval - (hours * msecPerHour)
        const minutes = Math.floor(interval / msecPerMinute)

        interval = interval - (minutes * msecPerMinute)
        const seconds = Math.floor(interval / 1000)
        const timerParam = {
          hours,
          minutes,
          seconds
        }
        this.timeLimit = new CommonTimer()
        this.timeLimit.setTimerOptions(timerParam)
        this.timeLimit.startTimer()
        ++idx
      } catch (e) {
        console.error('getCurrentLiveItem', e)
        idx = -1
      }
      return idx
    },
    /**
     * 씡라이브 슬롯 영역 클릭시 편성정보가 있으면 띵라이브 매장으로 이동.
     * @param {Number} image - 편성정보 유무 여부.
     */
    clickedLiveProduct (image, goodsName) {
      if (isNull(image)) { // 단순히 편성정보가 없을때는 아무 동작도 하지 않는다.
        return false
      } else {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: 'ONAIR_띵라이브',
            eventLabel: `방송보기_${goodsName}`,
            params: {
              t1: null
            }
          }
        })
        // E-commerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                name: goodsName,
                dimension16: 'eTV',
                dimension20: 'NS LIVE'
              }
            ],
            subparams: {
              t1: '메인',
              t2: '띵라이브',
              product_list: '메인_띵라이브'
            }
          }
        })

        this.$router.push('/store/media/thinglive')
      }
    },
    /**
     * 타이머 객체 null 체크.
     * 업데이트 훅에서 타이머 객체 null 체크 후 타이머 시간을 모두 소모했을때 API 재조회를 위함.
     * @param {Object || null} timer
     * @returns {bool}
     */
    timerIsNotNull (timer) {
      return !isNull(timer)
    },
    /**
     * 씡라이브 데이터 초기화. (편성 정보 없을때의 경우 등등..)
     */
    thingliveDataInit () {
      this.timeLimit = null // 방송 타이머
      this.goodsName = '' // 상품명
      this.thingliveImage = '' // 씡라이브 라이브 이미지
      this.timeSetFlag = false // 씡라이브 타이머클래스 셋팅완료 여부
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/HomeThingliveSlot";
</style>
