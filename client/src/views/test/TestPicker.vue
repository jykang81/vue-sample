<template>
  <div>
    <button @click="openCalendar">
      팝업 유틸 이용 달력 띄우기
    </button>
    <br>
    <br>
    <button @click="useDateUtil">
      date 유틸 이용 달력 띄우기
    </button>
    <br>
    <br>
    <button @click="testOpen">
      그냥 무식하게 임시로 달력 띄우기
    </button>
    <test-picker v-if="isTestShow" @datePickerClose="isTestShow=false" />
  </div>
</template>

<script>
import modalUtil from '@frameworks/modalUtil'
import TestPicker from '@components/test/TestPicker4'
import {
  openCalendar
} from '@frameworks/dateutil/dateUtil'

export default {
  components: {
    TestPicker
  },
  data () {
    return {
      isTestShow: false
    }
  },
  methods: {
    testOpen () {
      this.isTestShow = true
    },
    openCalendar () {
      const param = {
        // isYearUsed: true,
        // isMonthUsed: true,
        // isDayUsed: false
        // startYear: 2010,
        // endYear: 2020,
        // setDate: '2019-07-05'
      }
      const callbackFunction = function (param) {
        console.log('callbackFunction !! param : ', param)
      }
      modalUtil.show('common/NsCalendar', param, callbackFunction)
    },
    useDateUtil () {
      const param = {
        titleName: '이걸 맞나?',
        isYearUsed: true,
        isMonthUsed: true,
        isDayUsed: true,
        startYear: 2010,
        endYear: 2020,
        setDate: '2019-07-05'
      }
      const callbackFunction = function (result) {
        console.log('callbackFunction !! result : ', result)
      }
      openCalendar(param, callbackFunction)
    }
  }
}
</script>
