<template>
  <div>
    <h1>타이머 테스트</h1>
    <span class="timer_limit_time">남은 시간: {{ formattedLimitTime }}</span>
    <button class="timer_button timer_start" @click="handleStartTimer">
      타이머 시작
    </button>
    <button class="timer_button timer_stop" @click="handleStopTimer">
      타이머 중지
    </button>
    <button class="timer_button timer_init" @click="handleInitTimer">
      타이머 초기화
    </button>
  </div>
</template>

<script>
import CommonTimer from '@/common/classes/CommonTimer'

export default {
  data () {
    return {
      timer: new CommonTimer(),
      timerOptions: {
        hours: 1,
        minutes: 0,
        seconds: 30
      }
    }
  },
  computed: {
    formattedLimitTime () {
      return this.timer.formattedLimitTime()
    }
  },
  mounted () {
    this.timer.setTimerOptions(this.timerOptions) // 타이머 옵션 설정
    this.timer.startTimer() // 타이머 시작
  },
  methods: {
    handleStartTimer () {
      this.timer.startTimer()
    },
    handleStopTimer () {
      this.timer.stopTimer()
    },
    handleInitTimer () {
      this.timer.initTimer()
    }
  }
}
</script>

<style lang="scss">
  .timer_limit_time {
    display: block;
    text-align: center;
    padding: 2rem;
  }

  .timer_button {
    display: block;
    padding: 1rem;
  }

  .timer_start {
    color: indianred;
  }

  .timer_stop {
    color: aquamarine;
  }

</style>
