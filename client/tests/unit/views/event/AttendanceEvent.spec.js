import AttendanceEvent from '@/views/event/AttendanceEvent'
import { getAttendanceRecord, checkAttendance, get5000TollPoint } from '@unit/views/event/mock/attendance'
import { assert, expect } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'

// MockAdapter 사용 시 추가
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'

// messageUtil 테스트시 추가
import ContainerMessage from '@components/frameworks/ContainerMessage'
import Vuex from 'vuex'
import store from '@/vuex'

// router 추가
import VueRouter from 'vue-router'

// 본문에서 $route 사용 시 추가
import router from '@/router'

// 본문에서 $nsaxios 사용 시 추가
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
Vue.prototype.$nsaxios = nsaxios

const localVue = createLocalVue()

localVue.use(VueRouter)
localVue.use(Vuex)

describe('AttendanceEvent', () => {
  const mock = new MockAdapter(axios)
  describe('setAttendanceRecord 함수', () => {
    describe('값 세팅 확인', () => {
      const mockData = getAttendanceRecord.msg.root
      let wrapper
      let vm

      before(async () => {
        mock.onPost(`${CONST.API_URL}/NSCheckAttendanceMobileReal`)
          .reply(200, getAttendanceRecord)

        delete router.history.current
        router.history.current = {
          name: 'attendanceEvent',
          meta: { title: '' },
          path: '/event/attendance',
          hash: '',
          query: {},
          params: {},
          fullPath: '/',
          matched: []
        }

        wrapper = mount(AttendanceEvent, { router })
        vm = wrapper.vm

        vm.setAttendanceRecord(mockData)
        await vm.$nextTick()
      })

      it('todayAttendance', () => {
        assert.equal(vm.calendar.todayAttendance, mockData.attnYn === 'Y')
      })
      it('month', () => {
        assert.equal(vm.calendar.month, mockData.nMonth)
      })
      it('today', () => {
        assert.equal(vm.calendar.today, mockData.nDay)
      })
      it('weekCnt', () => {
        assert.equal(vm.calendar.weekCnt, mockData.weekCnt)
      })
      it('dayCnt', () => {
        assert.equal(vm.calendar.dayCnt, mockData.calLength)
      })
      it('days', () => {
        expect(vm.calendar.days).to.eql(mockData.calData)
      })
      it('startWeekDay', () => {
        assert.equal(vm.calendar.startWeekDay, Number(mockData.calData[0].weekSeq))
      })
    })
  })

  describe('클릭 이벤트', () => {
    let wrapper
    let vm
    let messageUtilWrapper

    beforeEach(() => {
      delete router.history.current
      router.history.current = {
        name: 'attendanceEvent',
        meta: { title: '' },
        path: '/event/attendance',
        hash: '',
        query: {},
        params: {},
        fullPath: '/',
        matched: []
      }

      wrapper = mount(AttendanceEvent, { router })
      vm = wrapper.vm
      messageUtilWrapper = mount(ContainerMessage, {
        localVue,
        router,
        store
      })
    })

    describe('출석체크 하기 API 콜백함수', () => {
      it('성공일 때, alert 노출됨 확인', async function () {
        vm.callbackCheckAttendance(checkAttendance)
        await vm.$nextTick()
        // messageUtil.alert 노출됨 확인
        expect(messageUtilWrapper.text()).include(wrapper.vm.MESSAGES.ATTENDANCE_IS_COMPLETE)
      })

      it('실패일 때, alert 노출됨 확인', async function () {
        vm.callbackCheckAttendance({ attnYn: 'N' })
        await vm.$nextTick()
        // messageUtil.alert 노출됨 확인
        expect(messageUtilWrapper.text()).include(wrapper.vm.MESSAGES.ATTENDANCE_IS_NOT_COMPLETED_DUE_TO_AN_ERROR.split(/<br\s*\/?>|\n/)[0])
      })
    })

    describe('5000톨 받기 API 콜백함수', () => {
      it('데이터가 있을 때, alert 노출됨 확인', async function () {
        vm.callbackGet5000TollPoint(get5000TollPoint)
        await vm.$nextTick()
        // messageUtil.alert 노출됨 확인
        expect(messageUtilWrapper.text()).include(get5000TollPoint.msg.root.rsltMsg)
      })
    })

    describe('오늘 출석체크하기 버튼 클릭 이벤트', () => {
      it('App이 아닐때, alert 노출됨 확인', async function () {
        vm.onClickCheckAttendance()
        await vm.$nextTick()
        // messageUtil.alert 노출됨 확인
        expect(messageUtilWrapper.text()).include(wrapper.vm.MESSAGES.ONLY_AVAILABLE_ON_MOBILE_APP)
      })
    })

    describe('5000톨 받기 버튼 클릭 이벤트', () => {
      it('App이 아닐때, alert 노출됨 확인', async function () {
        vm.onClickGetTollPoint()
        await vm.$nextTick()
        // messageUtil.alert 노출됨 확인
        expect(messageUtilWrapper.text()).include(wrapper.vm.MESSAGES.ONLY_AVAILABLE_ON_MOBILE_APP)
      })
    })
  })
})
