<template>
  <div class="attendance_event">
    <div class="attendence_top">
      <p class="btn_toll">
        <button
          type="button"
          @click="onClickGetTollPoint"
        >
          5000톨 받기
        </button>
      </p>
    </div>
    <div class="calendar_box">
      <p class="month">
        {{ calendar.month }}월
      </p>
      <table class="calendar" :summary="`${calendar.month}월 캘린더`">
        <caption><span class="blind">{{ calendar.month }}월 달력</span></caption>
        <tr>
          <th scope="col">
            일
          </th>
          <th scope="col">
            월
          </th>
          <th scope="col">
            화
          </th>
          <th scope="col">
            수
          </th>
          <th scope="col">
            목
          </th>
          <th scope="col">
            금
          </th>
          <th scope="col">
            토
          </th>
        </tr>
        <tr
          v-for="weekIndex in calendar.weekCnt"
          :key="`week${weekIndex}`"
        >
          <td
            v-for="weekDayIndex in 7"
            :key="`day${weekDayIndex + (weekIndex - 1) * 7}`"
            :class="setCalenderDaysClass(weekIndex, weekDayIndex)"
          >
            {{ setCalenderDays(weekIndex, weekDayIndex) }}
          </td>
        </tr>
      </table>
      <p class="btn_check">
        <button
          v-if="!calendar.todayAttendance"
          type="button"
          @click="onClickCheckAttendance"
        >
          오늘 출석체크하기
        </button>
        <button
          v-else
          disabled
          type="button"
        >
          오늘 출석체크 완료
        </button>
      </p>
    </div>
    <p class="event_guide_title">
      꼭 읽어보세요
    </p>
    <ul class="event_guide_list">
      <li>매일 출석 참여 마다 10톨 즉시 부여 (ID당 1일 1회)</li>
      <li>모바일앱에서 광고성(PUSH) 수신동의 고객만 출석체크 참여 가능<br>모바일앱 하단 더보기 > 설정 > 광고성<br>정보(PUSH) 수신 상태를 'ON'으로 설정</li>
      <li>당월 연속 7일 출석+ 당월 2회 이상 구매시(취소/반품제외), 익월 20일~말일 상단 톨받기 탭시 5000톨 즉시 부여</li>
      <li>7일 출석 &amp; 2회 이상 구매조건은 7일 연속 출석 및 해당월에 배송완료건이 2건 이상인 경우에 한하며, 무형상품(여행,보험,렌탈 등)은 제외</li>
      <li>한 달 출석 모두 완료시, 365톨 당월 말일 자동부여</li>
      <li>본 이벤트는 당사 사정에 의해 별도 고지 없이 수정되거나 종료될 수 있습니다.</li>
    </ul>
    <p class="toll_point_text">
      톨포인트란?
    </p>
    <ul class="event_guide_list border_none">
      <li>NS홈쇼핑 모바일에서 럭키박스 이벤트 응모를 통해 적립금으로 교환 할 수 있는 포인트입니다.</li>
      <li>상품리뷰 작성, 멤버십 승급 및 등급 유지, 다양한 이벤트 등을 통해 적립됩니다.</li>
      <li>톨 포인트 유효기간은 지급일로부터 1년이며, 이후 자동소멸 됩니다.</li>
    </ul>
  </div>
</template>

<script>
import {
  isNull,
  isOsApp,
  gettingPushStateHandler
} from '@utils/commonutil/commonUtil'
import COMMON_CONST from '@constants/common/common'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'

export default {
  data () {
    return {
      // 캘린더 데이터
      calendar: {
        todayAttendance: false, // 오늘 출석 여부
        month: '', // 이번달이 몇 월인지
        days: [], // 일별 출석여부
        today: '', // 오늘이 며칠인지
        startWeekDay: '', // 이번 달 1일 시작 요일 세팅(1:일, 2:월, 3:화, 4:수, 5:목, 6:금, 7:토)
        weekCnt: '', // 이번달 몇 주를 포함하고 있는지
        dayCnt: '' // 이번달 며칠을 포함하고 있는지
      },

      // 메시지 상수
      MESSAGES: {
        ONLY_AVAILABLE_ON_MOBILE_APP: '모바일 APP에서 가능한 이벤트입니다.',
        PLEASE_LOG_IN_AND_USE: '로그인 후 이용해 주세요.',
        CAN_PARTICIPATE_WHO_HAVE_AGREED_TO_RECEIVE_PUSH: '쇼핑알림(PUSH) 수신동의 고객만 참여 가능합니다.',
        ATTENDANCE_IS_COMPLETE: '출석완료 되었습니다.',
        ATTENDANCE_IS_NOT_COMPLETED_DUE_TO_AN_ERROR: '오류로 인해 출석체크가 완료되지 않았습니다.<br>잠시 후  다시 시도하여 주십시오.'
      }
    }
  },
  created () {
    // 출석이력 받아오기
    this.getAttendanceRecord()
  },
  mounted () {
    // 쇼핑히스토리 저장
    this.setShoppingHistory()
  },
  methods: {
    /**
     * 쇼핑히스토리 저장
     * @returns {void}
     */
    setShoppingHistory () {
      const historyObj = {
        pageParams: this.$route.params,
        offerIdfr: this.$route.name, // 출석체크 페이지는 따로 offerId가 존재 하지 않으므로 페이지 ID로 판단(단독페이지 이벤트이기 때문에)
        offerNm: this.$route.meta.title,
        eventPageId: this.$route.name,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.EVENT
      }
      bizUtil.setRecentlyViewedProducts(historyObj)
    },

    /**
     * 출석이력 받아오기 API 호출
     * @returns {void}
     */
    getAttendanceRecord () {
      const param = {
        cmd_gubun: 'Load',
        chn_gubun: 'Mobile',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        this.setAttendanceRecord(response.msg.root)
      }
      this.$nsaxios.post('NSCheckAttendanceMobileReal', param, successHandling)
    },

    /**
     * 출석체크 하기 API 호출
     * @returns {void}
     */
    checkAttendance () {
      const param = {
        cmd_gubun: 'basicAttn',
        chn_gubun: 'Mobile',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        this.callbackCheckAttendance(response)
      }
      this.$nsaxios.post('NSCheckAttendanceMobileReal', param, successHandling)
    },

    /**
     * 5000톨 받기 API 호출
     * @returns {void}
     */
    get5000TollPoint () {
      const param = {
        cmd_gubun: 'weekAttn',
        chn_gubun: 'Mobile',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        this.callbackGet5000TollPoint(response)
      }
      this.$nsaxios.post('NSCheckAttendanceMobileReal', param, successHandling)
    },

    /**
     * 출석체크 하기 API 콜백함수
     * @param {object} data - 출석체크 하기 API response data
     * @returns {void}
     */
    callbackCheckAttendance (data) {
      // 성공
      if (data.attnYn === 'Y') {
        messageUtil.alert(this.MESSAGES.ATTENDANCE_IS_COMPLETE)
        // 출석이력 받아오기
        this.getAttendanceRecord()
      // 실패
      } else {
        messageUtil.alert(this.MESSAGES.ATTENDANCE_IS_NOT_COMPLETED_DUE_TO_AN_ERROR)
      }
    },

    /**
     * 5000톨 받기 API 콜백함수
     * @param {object} data - 5000톨 받기 API response data
     * @returns {void}
     */
    callbackGet5000TollPoint (data) {
      // 성공
      if (!isNull(data.msg.root) && !isNull(data.msg.root.rsltMsg)) {
        // rsltMsg
        // 매월 20일 ~ 말일 동안만 신청하실 수 있습니다.
        // 고객님은 이미 해당 이벤트에 참여하셨습니다.\n(매달 1회 참여 가능)
        // 전월에 7일 연속 출석한 내역이 없습니다.
        // 전월 주문건수가 2건 미만입니다.
        // 5,000톨을 지급하였습니다.
        // 알 수 없는 오류로 인해 톨포인트 지급에 실패하였습니다.
        messageUtil.alert(data.msg.root.rsltMsg)
      }
    },

    /**
     * 출석이력 세팅
     * @param {object} data - 출석이력 받아오기 API response data
     * @returns {void}
     */
    setAttendanceRecord (data) {
      if (!isNull(data)) {
        // 오늘 출석 여부
        this.calendar.todayAttendance = (data.attnYn === 'Y')
        // 이번달이 몇 월인지
        this.calendar.month = data.nMonth
        // 오늘이 며칠인지
        this.calendar.today = data.nDay
        // 몇 주를 포함하고 있는지
        this.calendar.weekCnt = data.weekCnt
        // 며칠을 포함하고 있는지
        this.calendar.dayCnt = data.calLength
        // 일별 출석여부
        this.calendar.days = data.calData
        // 이번 달 1일 시작 요일 세팅
        this.calendar.startWeekDay = Number(data.calData[0].weekSeq)
      }
    },

    /**
     * 캘린더 날짜를 반환한다
     * (v-for에서 사용하기 위함)
     *
     * @param {number} weekIndex - 몇 주차
     * @param {number} weekDayIndex - 요일(1:일, 2:월, 3:화, 4:수, 5:목, 6:금, 7:토)
     * @returns {string} 캘린더 날짜
     */
    setCalenderDays (weekIndex, weekDayIndex) {
      const numberOfWeekday = 7
      const calenderDay = weekDayIndex + (weekIndex - 1) * numberOfWeekday - this.calendar.startWeekDay + 1
      if (calenderDay >= 1 && calenderDay <= this.calendar.dayCnt) {
        return String(calenderDay)
      } else {
        return ''
      }
    },

    /**
     * 캘린더 날짜별 CSS 클래스를 결정한다
     * (v-for에서 사용하기 위함)
     *
     * @param {number} weekIndex - 몇 주차
     * @param {number} weekDayIndex - 요일(1:일, 2:월, 3:화, 4:수, 5:목, 6:금, 7:토)
     * @returns {string} 날짜별 CSS 클래스
     */
    setCalenderDaysClass (weekIndex, weekDayIndex) {
      const numberOfWeekday = 7
      const calenderDay = weekDayIndex + (weekIndex - 1) * numberOfWeekday - this.calendar.startWeekDay + 1
      if (calenderDay >= 1 && calenderDay <= this.calendar.dayCnt) {
        if (this.calendar.days[calenderDay - 1].couponPoint) {
          return 'stamp'
        } else if (calenderDay === this.calendar.today) {
          return 'today'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },

    /**
     * '오늘 출석체크하기' 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickCheckAttendance () {
      // 네이티브 앱이 아니면
      if (!isOsApp()) {
        messageUtil.alert(this.MESSAGES.ONLY_AVAILABLE_ON_MOBILE_APP)
      // 로그인이 되어있지 않으면
      } else if (!loginUtil.checkLogonStatus()) {
        messageUtil.alert(this.MESSAGES.PLEASE_LOG_IN_AND_USE, () => {
          // 로그인 페이지로 이동
          bizUtil.gotoLogin()
        })
      } else {
        // 콜백 함수
        const handlerOptions = {
          callback: stringParams => {
            const param = JSON.parse(stringParams)
            const { pushState = 'N' } = param

            // 푸시 수신 동의일 경우
            if (pushState === 'Y') {
              // 출석체크 하기 API 호출
              this.checkAttendance()
            // 푸시 수신 거부일 경우
            } else {
              messageUtil.alert(this.MESSAGES.CAN_PARTICIPATE_WHO_HAVE_AGREED_TO_RECEIVE_PUSH, () => {
                // 설정 페이지 오픈
                this.$router.push({ name: 'mypageSetting' })
              })
            }
          },
          name: 'attendancePushStatHandler'
        }
        // 네이티브 앱이면
        if (isOsApp()) {
          gettingPushStateHandler(handlerOptions)
        } else {
          handlerOptions.callback(JSON.stringify({ pushState: 'N' }))
        }
      }
    },
    /**
     * '5000톨 받기' 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickGetTollPoint () {
      // 네이티브 앱이 아니면
      if (!isOsApp()) {
        messageUtil.alert(this.MESSAGES.ONLY_AVAILABLE_ON_MOBILE_APP)
      // 로그인이 되어있지 않으면
      } else if (!loginUtil.checkLogonStatus()) {
        // 로그인 페이지로 이동
        bizUtil.gotoLogin()
      } else {
        // 5000톨 받기 API 호출
        this.get5000TollPoint()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/event/AttendanceEvent";
</style>
