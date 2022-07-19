<template>
  <div v-show="isLoadComplete" class="member_ship_vip_lounge">
    <section>
      <strong class="subject">
        NS 우수고객님을 위한 VIP 라운지
      </strong>
      <p class="sub_copy">
        LOVE.N &amp; 다이아몬드 고객님을 위한 특별한 혜택
      </p>
      <div
        v-if="!isEvent"
        class="img_list"
      >
        <ul>
          <li>진행중인 이벤트가 없습니다.</li>
        </ul>
      </div>
      <div
        v-if="isEvent"
        class="img_list"
        :class="!collapseBanner ? 'open' : ''"
      >
        <ul>
          <li
            v-for="(items, index) in eventList" :key="index"
          >
            <router-link :to="getEventDetailUrl(items.mdUrl)">
              <ns-img
                :src="items.imgUrl"
                :alt="items.espotTitleText"
              />
            </router-link>
          </li>
        </ul>
        <!-- 전체 배너 갯수가 2개 이하인 경우 더보기 노출안함-->
        <button
          v-if="maxEventCount > 2"
          type="button"
          class="btn_collapse"
          @click="onCollapseBanner()"
        >
          <span>{{ seen.text }}</span>
        </button>
      </div>
    </section>
    <section>
      <div class="title_wrap">
        <strong class="subject">
          당첨자 발표
        </strong>
        <router-link
          class="btn_total"
          :to="{ name: 'participationWinner', params: { recGb: 99 } }"
        >
          전체보기
        </router-link>
      </div>
      <div class="prizewinner">
        <ul
          v-if="isEventWinningResult"
          class="list"
        >
          <li
            v-for="(items, index) in eventResultList" :key="index"
          >
            <router-link to="#" event="" @click.native.prevent="onclickDetailNotice(items)">
              <span class="label_vip">{{ items.recGb }}</span>
              <dl>
                <dt>{{ htmlDecode(items.title) }}</dt>
                <dd>당첨발표일 : {{ items.wnrDt }}</dd>
              </dl>
            </router-link>
          </li>
        </ul>
        <ul
          v-if="!isEventWinningResult"
          class="list"
        >
          <li>
            <p class="nodata">
              당첨자 발표 게시물이 없습니다.
            </p>
          </li>
        </ul>
      </div>
    </section>
    <section>
      <strong class="subject">
        VIP 혜택 활용법
      </strong>
      <div class="vip_benefit">
        <dl>
          <dt>우수고객</dt>
          <dd>
            LOVE.N (최근 6개월 20회 &amp; 150만원 이상 구매 고객)<br>
            다이아몬드 (최근 6개월 8회 &amp; 80만원 이상 구매 고객)
          </dd>
        </dl>
        <dl>
          <dt>선정기준</dt>
          <dd>
            매월 1일 우수고객 등급을 새롭게 선정합니다.<br>
            단, LOVE.N 등급은 매년 2회(1월, 7월) 선정(임직원 제외)<br>
            (최근 6개월 -> 1일 ~ 말일, 취소/반품 적용하여 선정)
          </dd>
        </dl>
        <dl>
          <dt>우수고객 혜택</dt>
          <dd>
            <ul>
              <li><em>VIP 7% 상시할인</em>(LOVE.N 고객)</li>
              <li><em>전용 상담 서비스</em>(LOVE.N 고객)</li>
              <li><em>우수고객 전용 VIP 라운지 이용</em>(다이아몬드 이상 고객)</li>
              <li><em>무료배송 쿠폰 지급</em>(다이아몬드 이상 고객)</li>
            </ul>
            <!-- <p>※ 코로나 19 확산에 따라 기존에 운영 예정이었던 “문화 공연 초청 이벤트”는 잠정 중단되고 다른 혜택으로 변경 운영 예정입니다. 이점 양해 부탁드립니다.</p> -->
          </dd>
        </dl>
      </div>
    </section>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import MEMBERSHIP_CONST from '@/common/constants/customer/memberShip'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import NsImg from '@components/common/NsImg'

import winnerMixin from '@/mixins/event/winnerMixin'
export default {
  name: 'MemberShipVipLounge',
  components: {
    NsImg
  },
  mixins: [
    winnerMixin
  ],
  data () {
    return {
      collapseBanner: '',
      seen: {
        text: '더보기'
      },
      pageIdx: 1,
      rowPerPage: 3,
      maxEventCount: 0,
      isEvent: false,
      isEventWinningResult: false,
      eventList: [],
      eventResultList: [],
      isLoadComplete: false
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  activated () {
    // 이전 페이지가 참여한 이벤트 페이지일때만 검색 이력 초기화
    const referer = this.$route.meta.refer
    if (referer === 'myMembership' && this.collapseBanner !== '') {
      this.collapseBanner = ''
      this.onCollapseBanner()
    }
  },
  created () {
    this.init()
  },
  methods: {
    htmlDecode,
    /**
     * 초기 실행 함수
     */
    async init () {
      // 비로그인시 메세지 없이 로그인 페이지로 이동.
      if (!loginUtil.isLoggedIn()) {
        this.$router.push('/customer/login/regular-member')
      }

      await this.getNSMTimesEvent()
      await this.getVipAnnouncemnet()
      this.onCollapseBanner()
    },
    /**
     * 더보기 이벤트
     *
     * @returns {void}
     */
    onCollapseBanner () {
      this.collapseBanner = !this.collapseBanner
      this.seen.text = this.collapseBanner ? '더보기' : '닫기'
    },
    /**
     * 이벤트 배너 조회
     *
     * @returns {Promise<void>}
     */
    async getNSMTimesEvent () {
      const invoke = {
        espotInfo: 'MOB_VIP_EVENT_BANNERLIST|Content'
      }

      const errorHandling = () => {
        messageUtil.alert(MEMBERSHIP_CONST.MESSAGES.ERROR_MESSAGES.PROCEDURE_ERROR, () => {})
      }

      await this.$nsaxios.post('NSEspotCommon', invoke, this.setNSMTimesEvent, errorHandling)
    },
    /**
     * 이벤트 배너 조회결과 처리
     *
     * @param {object} data 목록정보데이터
     * @returns {void}
     */
    setNSMTimesEvent (data) {
      const event = data.msg.root._MOB_VIP_EVENT_BANNERLIST

      if (event === undefined || event.length === 0) {
        this.isEvent = false
      } else {
        this.isEvent = true
        this.maxEventCount = event.length // 전체 이벤트 배너 갯수

        this.eventList = event
      }
      setTimeout(() => {
        this.isLoadComplete = true
      }, 50)
    },
    /**
     * VIP 당첨자발표 결과목록
     *
     * @returns {Promise<void>}
     */
    async getVipAnnouncemnet () {
      const invoke = {
        cmdType: 101,
        tab_gubun: 3, // 1-이벤트 발표및 공지 , 2-이벤트 목록"
        sel_gubun: 'AL', // AL'-전체, CL-진행중, FL-종료
        imgType: 'BANNIMGIDSEQ1',
        userId: loginUtil.userId(),
        rowPerPage: this.rowPerPage,
        pageIdx: this.pageIdx,
        recGb: 99 // 98:일반, 99:VIP
      }

      const errorHandling = () => {
        messageUtil.alert(MEMBERSHIP_CONST.MESSAGES.ERROR_MESSAGES.PROCEDURE_ERROR, () => {})
      }

      await this.$nsaxios.post('NSAjaxMTimesEventCmd', invoke, this.setNoticeListMobile, errorHandling)
    },
    /**
     * VIP 당첨자발표 결과목록결과 처리
     * @param {object} data 목록정보데이터
     * @returns {void|boolean}
     */
    setNoticeListMobile (data) {
      if (isNull(data.msg)) {
        messageUtil.alert(MEMBERSHIP_CONST.MESSAGES.ERROR_MESSAGES.PROCEDURE_ERROR)
        return false
      }

      const eventList = data.msg.eventList
      if (eventList === undefined || eventList.length === 0) {
        this.isEventWinningResult = false
        return false
      } else {
        this.isEventWinningResult = true
        this.eventResultList = eventList
      }
    },
    /**
     * 이벤트 상세 URL
     *
     * @param {object} mdUrl 이벤트 상세 URL
     * @returns {String} 이벤트 상세 URL
     */
    getEventDetailUrl (mdUrl) {
      const domain = 'nsmall.com'
      mdUrl = htmlDecode(decodeURIComponent(mdUrl))
      return mdUrl.substring(mdUrl.indexOf(domain) + domain.length, mdUrl.length) // SPA에 맞는 라우팅 경로 변경하기 위해 도메인 잘라내기
    }
  }
}
</script>

<style lang="scss">
  @import '~@/assets/styles/views/customer/MemberShipVipLounge';
</style>
