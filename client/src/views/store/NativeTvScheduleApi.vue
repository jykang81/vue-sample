<template>
  <div>
    {{ responseTotal }}
  </div>
</template>
<script>
import getAddDate from '@frameworks/dateutil/getAddDate'
import {
  isNull
} from '@utils/commonutil/commonUtil'

export default {
  name: 'NativeTvScheduleApi',
  data () {
    return {
      selectDay: '', // 선택 날짜
      responseTv: [],
      responseShop: [],
      responseTotal: {
        responseTv: '',
        responseShop: ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      for (let i = -7; i < 8; i++) {
        this.getNSTvBroadCmd(i)
      }
      for (let j = -7; j < 8; j++) {
        this.getNSShopPlusBroadCmd(j)
      }

      this.responseTotal.responseTv = this.responseTv
      this.responseTotal.responseShop = this.responseShop
    },
    /**
     * 편성표 조회
     * @param {int} cnt - 일수
     */
    getSelectDay (cnt) {
      const selectDate = getAddDate('day', cnt)
      return selectDate
    },
    /**
     * 편성표 조회
     * @param {int} cnt - 일수
     */
    async getNSTvBroadCmd (cnt) {
      const param = {
        selectDay: this.getSelectDay(cnt),
        processFlag: 'brodcastingMobileScroll'
      }
      const successHandling = response => {
        if (!isNull(response.msg)) {
          this.responseTv.push(response)
        }
      }
      await this.$nsaxios.post('NSTvBroadCmd', param, successHandling)
    },
    /**
     * 편성표 조회
     * @param {int} cnt - 일수
     */
    async getNSShopPlusBroadCmd (cnt) {
      const param = {
        selectDay: this.getSelectDay(cnt),
        processFlag: 'shopPlusBrodcastingMobileScroll'
      }
      const successHandling = response => {
        if (!isNull(response.msg)) {
          this.responseShop.push(response)
        }
      }
      await this.$nsaxios.post('NSShopPlusBroadCmd', param, successHandling)
    }
  }
}
</script>
