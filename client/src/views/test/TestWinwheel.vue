<template>
  <div>
    <figure class="img">
      <img
        id="img"
        src="~@/assets/images/event/img_roulette.png"
        alt="톨 이벤트 행운의 룰렛 하루1번 룰렛 돌리고 적립금 받자!"
        @click="spinRoulette('0')"
      >
    </figure>
  </div>
</template>

<script>
import externalUtil from '@utils/externalUtil'

export default {
  data () {
    return {
      // Vars used by the code in this page to do power controls.
      wheelPower: 0,
      wheelSpinning: false,
      theWheel: ''
    }
  },
  mounted () {
    externalUtil.getScript('//cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js').then(() => {
      // Do nothing
    })
  },
  methods: {
    /**
     * 등수별 멈출 위치 선정 (시계방향)
     * 1등 : 0˚~60˚
     * 2등 : 61˚~120˚
     * 3등 : 121˚~180˚
     * 4등 : 181˚~240˚
     * 5등 : 241˚~300˚
     * 6등 : 301˚~360˚
     */
    spinRoulette (value) {
      const GRADE = {
        10000: 1,
        5000: 2,
        1000: 3,
        500: 4,
        100: 5,
        0: 6
      }

      const GRADE_CNT = 6 // 당첨 등급 갯수
      const DEFAULT_ANGLE = 360 / GRADE_CNT // 당첨 목록수별 기본 각도(60˚)
      const ROTATION_CNT = 10 // 룰렛 회전 수
      const RANDOM_NUM = Math.floor(Math.random() * DEFAULT_ANGLE * 0.8) - DEFAULT_ANGLE * 0.4 // 정 가운데가 아닌 양 사이드가 선택 되도록 -20˚~20˚사이의 랜덤 숫자 추출

      const TEMP_ANGLE = (DEFAULT_ANGLE * GRADE[value]) - DEFAULT_ANGLE / 2 + RANDOM_NUM // 등수별 정지 각도 계산
      const FINAL_ANGLE = TEMP_ANGLE - (360 * ROTATION_CNT) // 총 회전 각도

      const param = {
        duration: 5,
        ease: 'elastic.inOut(0.1, 1)',
        delay: 0,
        rotation: -FINAL_ANGLE
      }

      window.gsap.to('img', param)
    }
  }
}
</script>

<style lang="scss">
  .img {

      img {
          width: 100%;
      }
  }
</style>
