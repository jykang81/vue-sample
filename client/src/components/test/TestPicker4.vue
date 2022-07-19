<template>
  <div class="popup_container">
    <div
      class="dimmed_all"
      @click="datePickerClose"
    />
    <div class="popup">
      <!-- datePicker 시작 -->
      <h3 class="title">
        기간설정
      </h3>
      <div class="datepicker_wrap">
        <scroll-picker :item-list="yearList" />
        <scroll-picker :item-list="monthList" />
      </div>
      <div class="button">
        <button
          type="button"
          class="btn gray"
          @click="datePickerClose"
        >
          취소
        </button>
        <button
          type="button"
          class="btn coral"
          @click="datePickerClose"
        >
          확인
        </button>
      </div>
      <!-- datePicker 끝 -->
    </div>
  </div>
</template>

<script>
import ScrollPicker from '@components/common/ScrollPicker'
import uiUtil from '@utils/uiUtil'

export default {
  components: {
    ScrollPicker
  },
  data () {
    return {
      yearList: [
        { value: 2015, name: '2015년', selected: true },
        { value: 2016, name: '2016년', selected: false },
        { value: 2017, name: '2017년', selected: false },
        { value: 2018, name: '2018년', selected: false },
        { value: 2019, name: '2019년', selected: false },
        { value: 2020, name: '2020년', selected: false }
      ],
      monthList: [
        { value: '01', name: '1월', selected: true },
        { value: '02', name: '2월', selected: false },
        { value: '03', name: '3월', selected: false },
        { value: '04', name: '4월', selected: false },
        { value: '05', name: '5월', selected: false },
        { value: '06', name: '6월', selected: false },
        { value: '07', name: '7월', selected: false },
        { value: '08', name: '8월', selected: false },
        { value: '09', name: '9월', selected: false },
        { value: '10', name: '10월', selected: false },
        { value: '11', name: '11월', selected: false },
        { value: '12', name: '12월', selected: false }
      ],
      currentYear: '',
      currentMonth: ''
    }
  },
  mounted () {
    uiUtil.disableScroll()
  },
  methods: {
    // 메세지 팝업 닫기
    datePickerClose () {
      uiUtil.enableScroll()
      this.$emit('datePickerClose')
    }
  }
}
</script>
