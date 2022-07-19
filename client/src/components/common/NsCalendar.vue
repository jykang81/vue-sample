<template>
  <div class="ns_calendar">
    <h3 class="title">
      {{ titleName }}
    </h3>
    <div class="ns_calendar_datepicker">
      <scroll-picker v-if="isYearUsed" :item-list="yearList" />
      <scroll-picker v-if="isMonthUsed" :item-list="monthList" />
      <scroll-picker v-if="isDayUsed" :item-list="dayList" />
    </div>
    <div class="btn_group">
      <button
        type="button"
        class="btn_cancel"
        @click="closeCalendar"
      >
        취소
      </button>
      <button
        type="button"
        class="btn_confirm"
        @click="closeCalendar('ok')"
      >
        확인
      </button>
    </div>
  </div>
</template>

<script>
import ScrollPicker from '@components/common/ScrollPicker'
import modalUtil from '@frameworks/modalUtil'
import {
  getNowDate,
  zf
} from '@frameworks/dateutil/dateUtil'

export default {
  components: {
    ScrollPicker
  },
  props: {
    /*    파라메터 예제
      const param = {
        isYearUsed: true, // 년도 사용 여부
        isMonthUsed: true, // 월 사용 여부
        isDayUsed: false, // 일 사용 여부
        startYear: 2010, // 년도 시작년
        endYear: 2020, // 년도 종료년
        setDate: '2019-07-05' // 디폴드 셋팅 날짜
      }
 */
    param: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      titleName: '기간설정', // 캘린더 타이틀
      isYearUsed: true, // 년도 사용 여부
      isMonthUsed: true, // 월 사용 여부
      isDayUsed: true, // 일 사용 여부
      yearList: [], // 년도 데이터
      monthList: [], // 월 데이터
      dayList: [] // 일 데이터
    }
  },
  created () {
    let arrayCurrentDate = getNowDate('-').split('-')
    const currentYear = Number(arrayCurrentDate[0])
    let setYear = Number(arrayCurrentDate[0])

    if (this.param.setDate) {
      arrayCurrentDate = this.param.setDate.split('-')
      setYear = Number(arrayCurrentDate[0])
    }

    if (this.param.startYear && this.param.endYear) {
      this.makeYear(this.param.endYear, this.param.startYear, setYear)
    } else {
      this.makeYear(currentYear, currentYear - 5, setYear)
    }

    this.makeMonth(Number(arrayCurrentDate[1]))
    this.makeDay(Number(arrayCurrentDate[2]))
    /*
    const dummyData = {}
    dummyData.value = ''
    dummyData.name = ''
    dummyData.selected = false
    this.yearList.push(dummyData)
    this.monthList.push(dummyData)
    this.dayList.push(dummyData)
 */
  },
  mounted () {
    if (this.param.isYearUsed !== undefined) {
      this.isYearUsed = this.param.isYearUsed
    }
    if (this.param.isMonthUsed !== undefined) {
      this.isMonthUsed = this.param.isMonthUsed
    }
    if (this.param.isDayUsed !== undefined) {
      this.isDayUsed = this.param.isDayUsed
    }
    if (this.param.titleName !== undefined) {
      this.titleName = this.param.titleName
    }
  },
  methods: {
    /**
     * 선택된 달력의 값을 콜백으로 넘기거나 취소 한다.
     *
     * @param {String} actionKey 취소, 확인 버튼 구분
     * @returns {Object} result = { keyName: '', dateValue: '' }
     */
    closeCalendar (actionKey) {
      const result = { keyName: '', dateValue: '' }
      if (actionKey === 'ok') {
        if (this.isYearUsed) {
          this.selectResult(this.yearList, result)
        }
        if (this.isMonthUsed) {
          if (this.isYearUsed) {
            result.dateValue += '-'
            result.keyName += ' '
          }
          this.selectResult(this.monthList, result)
        }
        if (this.isDayUsed) {
          if (this.isMonthUsed) {
            result.dateValue += '-'
            result.keyName += ' '
          }
          this.selectResult(this.dayList, result)
        }
      }
      modalUtil.close(result)
    },
    /**
     * 년도를 생성 한다.
     *
     * @param {Number} endYear    종료 년도
     * @param {Number} startYear  시작 년도
     * @param {Number} selectedYear 선택된 년도
     */
    makeYear (endYear, startYear, selectedYear) {
      startYear = Number(startYear)
      for (let i = startYear; i <= endYear; i++) {
        const yearData = {}
        yearData.value = i
        yearData.name = `${i}년`
        if (selectedYear === i) {
          yearData.selected = true
        }
        this.yearList.push(yearData)
      }
    },
    /**
     * 월을 생성한다.
     *
     * @param {String} 기본 선택 월
     */
    makeMonth (selectedMonth) {
      for (let i = 1; i <= 12; i++) {
        const monthData = {}
        monthData.value = zf(i, 2)
        monthData.name = `${i}월`
        if (selectedMonth === i) {
          monthData.selected = true
        }
        this.monthList.push(monthData)
      }
    },
    /**
     * 날짜를 생성한다.
     *
     * @param {String} 기본 선택 일
     */
    makeDay (selectedDay) {
      for (let i = 1; i <= 31; i++) {
        const dayData = {}
        dayData.value = zf(i, 2)
        dayData.name = `${i}일`
        if (selectedDay === i) {
          dayData.selected = true
        }
        this.dayList.push(dayData)
      }
    },
    /**
     * 데이터 목록에서 선택된 값을 리턴 해준다.
     *
     * @param {Array} dataList 데이터 목록
     * @returns {Object} result 선택된 값
     */
    selectResult (dataList, result) {
      if (dataList === null) {
        return result
      }
      dataList.forEach((item, index) => {
        if (item.selected === true) {
          result.dateValue += item.value
          result.keyName += item.name
          return false
        }
        return true
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/NsCalendar";
</style>
