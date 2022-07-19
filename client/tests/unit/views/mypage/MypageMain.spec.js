import MypageMain from '@/views/mypage/MypageMain'
import { shallowMount } from '@vue/test-utils'
import { assert } from 'chai'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'
import loginUtil from '@utils/loginUtil'
import CONST from '@constants/framework/framework'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
// import flushPromises from 'flush-promises'
import { MypageMainReal, NotYetReviewedListReal, gradeClassName } from '@unit/views/mypage/mock/mypageMainResponse'

// $nsaxios 추가
Vue.prototype.$nsaxios = nsaxios

describe('MypageMain', () => {
  const mock = new MockAdapter(axios)
  mock.onPost(`${CONST.API_URL}/MypageMainReal`)
    .reply(200, MypageMainReal)
  mock.onPost(`${CONST.API_URL}/NotYetReviewedListReal`)
    .reply(200, NotYetReviewedListReal)

  describe('computed', () => {
    const wrapper = shallowMount(MypageMain)
    const vm = wrapper.vm

    it('bizUtil', () => {
      assert.equal(vm.bizUtil, bizUtil)
    })
    it('nativeUtil', () => {
      assert.equal(vm.nativeUtil, nativeUtil)
    })
  })

  describe('methods', () => {
    describe('getMypageMainInfo, 마이페이지 메인 정보 조회 API 호출', () => {
      const wrapper = shallowMount(MypageMain)
      const vm = wrapper.vm
      vm.getMypageMainInfo()

      it('memberType 확인', () => {
        assert.equal(vm.memberInfo.memberType, MypageMainReal.msg.root.GradeInfo.memberGubun)
      })
      it('gradeName 확인', () => {
        assert.equal(vm.memberInfo.gradeName, MypageMainReal.msg.root.GradeInfo.currentGrdName)
      })
      it('gradeIcon 확인', () => {
        assert.equal(vm.memberInfo.gradeIcon, gradeClassName[MypageMainReal.msg.root.GradeInfo.currentGrd])
      })
      it('wishListCnt 확인', () => {
        assert.equal(vm.memberInfo.wishListCnt, MypageMainReal.msg.root.BenefitInfo.wishListCnt)
      })
    })

    describe('getReviewInfo, 상품평 정보 조회 API 호출', () => {
      const wrapper = shallowMount(MypageMain)
      const vm = wrapper.vm
      vm.getReviewInfo()

      it('reviewCnt 확인', () => {
        assert.equal(vm.memberInfo.reviewCnt, NotYetReviewedListReal.msg.root.totalCount)
      })
    })

    describe('마케팅 스크립트 관련 함수 호출', () => {
      const wrapper = shallowMount(MypageMain)
      const vm = wrapper.vm

      it('memberShipClick, 멤버십 클릭', () => {
        vm.memberShipClick()
      })
      it('wishListClick, 찜한상품 클릭', () => {
        vm.wishListClick()
      })
      it('recentPrdClick, 최근본상품 클릭', () => {
        vm.recentPrdClick()
      })
      it('saveMoneyLogging, 적립금 클릭', () => {
        vm.saveMoneyLogging()
      })
      it('couponCntLogging, 쿠폰 클릭', () => {
        vm.couponCntLogging()
      })
      it('tolPoingLogging, 톨포인트 클릭', () => {
        vm.tolPoingLogging()
      })
      it('depositLogging, 예치금 클릭', () => {
        vm.depositLogging()
      })
      it('giftcardLogging, 상품권보유금액 클릭', () => {
        vm.giftcardLogging()
      })
      it('nsStaffLogging, NS사내판매 클릭', () => {
        vm.nsStaffLogging()
      })
      it('noticebellLogging, 방송알림 클릭', () => {
        vm.nsStaffLogging()
      })
    })

    it('setIsLoggedIn, 로그인 여부 세팅', () => {
      const wrapper = shallowMount(MypageMain)
      const vm = wrapper.vm
      vm.setIsLoggedIn()
      assert.equal(vm.isLoggedIn, loginUtil.isLoggedIn())
    })

    it('setName, 회원 이름 세팅', () => {
      const wrapper = shallowMount(MypageMain)
      const vm = wrapper.vm
      vm.setName()
      assert.equal(vm.memberInfo.name, loginUtil.userName())
    })

    it('setGradeIcon, 등급 아이콘 클래스 명 세팅', () => {
      const wrapper = shallowMount(MypageMain)
      const vm = wrapper.vm
      // 회원 정보
      vm.setGradeIcon('R12')
      assert.equal(vm.memberInfo.gradeIcon, gradeClassName.R12)
      vm.setGradeIcon('R1')
      assert.equal(vm.memberInfo.gradeIcon, gradeClassName.R1)
      vm.setGradeIcon('R13')
      assert.equal(vm.memberInfo.gradeIcon, gradeClassName.R13)
      vm.setGradeIcon('R2')
      assert.equal(vm.memberInfo.gradeIcon, gradeClassName.R2)
      vm.setGradeIcon('R10')
      assert.equal(vm.memberInfo.gradeIcon, gradeClassName.R10)
      vm.setGradeIcon('default')
      assert.equal(vm.memberInfo.gradeIcon, gradeClassName.R10)
    })
  })
})
