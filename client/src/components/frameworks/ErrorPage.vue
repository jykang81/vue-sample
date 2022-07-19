<template>
  <div class="error_page">
    <div class="error_container">
      <strong class="subject">
        오류가 발생하였습니다.
      </strong>
      <p class="copy">
        해당 문제가 지속적으로 발생하면 고객센터에 문의해 주세요.<br>{{ timeoutToSeconds }}초 후에 홈으로 이동합니다.
      </p>
      <router-link to="/" class="btn_home" event="" @click.native.prevent="goHome">
        <span>
          홈으로 가기
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import nativeUtil from '@frameworks/nativeUtil'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'

export default {
  data () {
    return {
      timeoutID: null,
      TIMEOUT: 3000
    }
  },
  computed: {
    /**
     * 타임아웃 변환 단위 반환 (ms -> s)
     * @returns {Number}
     */
    timeoutToSeconds () {
      return this.TIMEOUT / 1000
    }
  },
  mounted () {
    this.setAutoRouteToHome()
  },
  beforeDestroy () {
    this.unsetAutoRouteToHome()
  },
  methods: {
    /**
     * 자동 홈이동 예약
     */
    setAutoRouteToHome () {
      this.timeoutID = setTimeout(() => {
        if (isOsApp()) { // APP
          nativeUtil.goHome()
        } else {
          this.$router.push('/')
        }
      }, this.TIMEOUT)
    },
    /**
     * 홈이동 예약 취소
     */
    unsetAutoRouteToHome () {
      clearTimeout(this.timeoutID)
      this.timeoutID = null
    },
    /**
     * 홈으로 이동
     */
    goHome () {
      if (isOsApp()) { // APP
        nativeUtil.goHome()
      } else {
        this.$router.push('/').catch(() => {
          // 같은 경로 이동 오류 방어
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/frameworks/ErrorPage";
</style>
