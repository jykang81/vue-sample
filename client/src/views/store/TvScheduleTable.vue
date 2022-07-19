<template>
  <div
    :class="floatingTableClass"
    class="tv_schedule_table"
  >
    <div class="tv_schedule_top">
      <swiper
        ref="scheduleSwiper"
        :options="scheduleSwiperOption"
        class="swiper_schedule"
      >
        <swiper-slide
          v-for="(dateIdx, idx) in 15"
          :key="idx"
        >
          <div
            class="day_item"
            :class="[ selectDay === calcDate('', 0, 0, 0, dateIdx-8, 'yyyyMMdd') ? 'active' : '']"
            @click="categoryTab(idx, calcDate('', 0, 0, 0, dateIdx-8, 'yyyyMMdd'))"
          >
            <div v-if="calcDate('', 0, 0, 0, dateIdx-8, 'yyyyMMdd') === getNowDate()" class="day today">
              오늘
              <span>{{ getDay(dateIdx-8) }}일</span>
            </div>
            <div v-else class="day">
              {{ calcDate('', 0, 0, 0, dateIdx-8, 'E') }}
              <span>{{ getDay(dateIdx-8) }}일</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="schedule_tab">
        <div
          :class="toggle"
          class="toggle"
        >
          <button
            class="btn_nshome"
            @click="toggleLeft"
          >
            NS홈쇼핑
          </button>
          <button
            class="btn_nsshop"
            @click="toggleRight"
          >
            NS Shop+
          </button>
        </div>
        <button
          type="button"
          class="btn_search"
          @click="clickOpenSearchPop()"
        >
          TV쇼핑
        </button>
      </div>
    </div>
    <div class="time_table_floating">
      <button
        v-show="isToggleShow"
        type="button"
        class="btn_tv_time"
        @click="timeListToggle"
      >
        <i class="icons_clock" />
        <span>방송시간</span>
      </button>
      <div class="time_wrap">
        <div class="time_swiper">
          <button
            type="button"
            class="btn_view"
            @click="clickBeforeTvScheduleList()"
          >
            <strong>{{ calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, -1, 'MM.dd') }}({{ format(calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, -1, 'yyyyMMdd'), 'E') }})</strong>
            <p>편성표</p>
          </button>
          <span class="date">{{ selectDay.substr(4,2) + '.' + selectDay.substr(6,2) + '(' + format(selectDay, 'E') }})</span>
          <span
            v-for="(timeInfo, timeIdx) in totalOrgan"
            :key="timeIdx"
          >
            <span class="item" @click="clickTimeInfo(timeIdx)">
              <figure>
                <ns-img
                  :product-number="timeInfo.partNumber"
                  :width="104"
                  :height="104"
                  :alt="timeInfo.goodsName"
                />
              </figure>
              <p class="time">
                {{ calcDate(getDateParse02(timeInfo.startDtm),0,0,0,0,"HH:mm") }}
              </p>
            </span>
          </span>
          <button
            type="button"
            class="btn_view"
            @click="clickNextTvScheduleList()"
          >
            <strong>{{ calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, 1, 'MM.dd') }}({{ format(calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, 1, 'yyyyMMdd'), 'E') }})</strong>
            <p>편성표</p>
          </button>
        </div>
      </div>
    </div>
    <div
      v-for="(info, infoIdx) in totalOrgan"
      :key="infoIdx"
      ref="tvTableSection"
      class="tv_item"
      :class="[isLive(info) ? 'live' : '']"
    >
      <div v-if="infoIdx === 0" class="date_schedule multi">
        <button
          v-if="infoIdx === 0 && selectDay > calcDate('', 0, 0, 0, -7, 'yyyyMMdd')"
          type="button"
          class="btn_view"
          @click="clickBeforeTvScheduleList()"
        >
          <span>
            {{ calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, -1, 'MM.dd') }}({{ format(calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, -1, 'yyyyMMdd'), 'E') }}) 편성표 보기 +
          </span>
        </button>
        <strong>{{ selectDay.substr(4,2) + '.' + selectDay.substr(6,2) + '(' + format(selectDay, 'E') }})</strong>
      </div>
      <div class="time_box">
        <div
          v-if="isLive(info)"
          class="live_box"
        >
          <i class="icons_live" />
          <span :id="'itemTime' + infoIdx" class="time">{{ calcDate(getDateParse02(info.startDtm), 0, 0, 0, 0, "HH:mm") }}</span>
        </div>
        <div v-else class="live_box">
          <span :id="'itemTime' + infoIdx" class="time">{{ calcDate(getDateParse02(info.startDtm), 0, 0, 0, 0, "HH:mm") }}</span>
        </div>
        <span class="benefit">{{ info.headCopy }}</span>
      </div>
      <div :id="'relProductList'+infoIdx" class="product_item">
        <div
          class="product"
          @click="productDetailLogging(
            info,
            {clksrc: isLive(info) ? `편성표_${toggle === 'active' ? 'NSShop+' : 'NSLIVE'}` : '편성표_다음방송상품'},
            `${toggle === 'active' ? 'NSSHOP+' : 'TVLIVE'}`
          )"
        >
          <div class="img_box">
            <figure>
              <ns-img
                :product-number="info.partNumber"
                :alt="info.goodsName"
                type="WIDE"
              />
            </figure>
            <div
              v-if="isLive(info)"
            >
              <span v-show="isRemainingTimeShow" class="remaining_time">
                {{ limitTime }} 남음
                <i class="icons_play" />
              </span>
              <span v-show="isRemainingTimeEndShow" class="remaining_time">방송종료</span>
            </div>
          </div>
          <ns-price
            :dc-price="info.salePrice"
            :dc-rate="info.saleRate"
            :price="info.priceofferprice"
            :buschn-id="info.busChnId"
            :disp-type-cd="info.dispTypeCd"
          />
          <!-- <p v-if="info.brandCd === '200000' || info.brandCd === '250000' || isNull(info.brandName)" class="title">
            {{ htmlDecode(info.goodsName) }}
          </p>
          <p v-else class="title">
            [{{ htmlDecode(info.brandName) }}] {{ htmlDecode(info.goodsName) }}
          </p> -->
          <p class="title">
            <template v-if="info.brandCd !== '200000' && info.brandCd !== '250000' && !isNull(info.brandName)">
              [{{ htmlDecode(info.brandName) }}]
            </template>
            {{ htmlDecode(info.goodsName) }}
          </p>
        </div>
        <div class="benefit_button">
          <ul class="benefit">
            <li class="tv">
              TV쇼핑
            </li>
            <li v-if="info.dlvrFreeYn === 'Y' && !PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(info.dispTypeCd)">
              무료배송
            </li>
            <li v-if="info.promIfiYn === 'Y'">
              무이자
            </li>
            <li v-if="info.promPadYn === 'Y'">
              적립금
            </li>
          </ul>
          <div
            v-if="isLive(info) ||
              info.orderYn === 'Y' || info.orderYn === 'T_EN' || info.orderYn === 'D_EN'"
          >
            <div
              v-if="PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(info.dispTypeCd)"
              class="btn_group"
            >
              <button
                v-if="isIconVisible(info, alarmTalkClassName[infoIdx])"
                type="button"
                :class="alarmTalkClassName[infoIdx]"
                @click="clickShoppingAlarm(info, alarmTalkClassName[infoIdx])"
              >
                <i />
              </button>
              <button
                type="button"
                class="btn_buy"
                @click="layerOpen(infoIdx, 'N', info.goodsName, info.partNumber)"
              >
                바로구매
              </button>
            </div>
            <div
              v-else
              class="btn_group"
            >
              <button
                v-if="isIconVisible(info, alarmTalkClassName[infoIdx])"
                type="button"
                :class="alarmTalkClassName[infoIdx]"
                @click="clickShoppingAlarm(info, alarmTalkClassName[infoIdx])"
              >
                <i />
              </button>
              <button
                type="button"
                class="btn_buy"
                @click="moveConsultationRequest(info.partNumber)"
              >
                상담신청
              </button>
            </div>
          </div>
          <div v-else>
            <p class="btn_group">
              <button
                v-if="isIconVisible(info, alarmTalkClassName[infoIdx])"
                type="button"
                :class="alarmTalkClassName[infoIdx]"
                @click="clickShoppingAlarm(info, alarmTalkClassName[infoIdx])"
              >
                <i />
              </button>
              <button
                type="button"
                class="btn_buy in_active"
                @click="clickLiveItemBuy()"
              >
                방송중 구매가능
              </button>
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="info.RelTotalOrgan.length > 0"
        :class="collapse[infoIdx]"
      >
        <ul class="product_list">
          <li
            v-for="(relInfo, relIdx) in info.RelTotalOrgan"
            :key="relIdx"
          >
            <div
              v-if="relInfo.relGbn === 'subProd'"
              class="item_box"
            >
              <div
                class="item"
                @click="gotoProductDetail(relInfo)"
              >
                <figure>
                  <ns-img
                    :src="relInfo.imageUrl"
                    :alt="relInfo.goodsName"
                  />
                </figure>
                <div class="price_title">
                  <ns-price
                    :dc-price="relInfo.salePrice"
                    :buschn-id="relInfo.buschnId"
                    :disp-type-cd="relInfo.dispTypeCd"
                  />
                  <p class="title">
                    {{ htmlDecode(relInfo.goodsName) }}
                  </p>
                </div>
              </div>
              <div class="benefit_button">
                <ul class="benefit">
                  <li class="tv">
                    TV쇼핑
                  </li>
                  <li v-if="relInfo.dlvrFreeYn === 'Y' && !PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(relInfo.dispTypeCd)">
                    무료배송
                  </li>
                  <li v-if="relInfo.promIfiYn === 'Y'">
                    무이자
                  </li>
                  <li v-if="relInfo.promPadYn === 'Y'">
                    적립금
                  </li>
                </ul>
                <div
                  v-if="relInfo.orderYn === 'Y' || relInfo.orderYn === 'T_EN' || relInfo.orderYn === 'D_EN'"
                >
                  <div
                    v-if="PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(relInfo.dispTypeCd)"
                    class="btn_group"
                  >
                    <button
                      type="button"
                      class="btn_alarm"
                      @click="clickShoppingAlarm(relInfo)"
                    >
                      <i />
                    </button>
                    <button
                      type="button"
                      class="btn_buy"
                      @click="layerOpen(infoIdx, 'Y', relInfo.goodsName, relInfo.goodsId)"
                    >
                      바로구매
                    </button>
                  </div>
                  <div
                    v-else
                    class="btn_group"
                  >
                    <button
                      type="button"
                      class="btn_alarm"
                      @click="clickShoppingAlarm(relInfo)"
                    >
                      <i />
                    </button>
                    <button
                      type="button"
                      class="btn_buy"
                      @click="moveConsultationRequest(relInfo.goodsId)"
                    >
                      상담신청
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p class="btn_group">
                    <button
                      type="button"
                      class="btn_alarm"
                      @click="clickShoppingAlarm(relInfo)"
                    >
                      <i />
                    </button>
                    <button
                      type="button"
                      class="btn_buy in_active"
                      @click="clickLiveItemBuy()"
                    >
                      방송중 구매가능
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <div
              v-else
              class="item_box"
            >
              <div v-if="relNotSubPrdFirst[infoIdx][relIdx] === 'Y'">
                같이 보면 좋은 상품
              </div>
              <div
                class="item"
                @click="gotoProductDetail(relInfo)"
              >
                <figure>
                  <ns-img
                    :src="relInfo.imageUrl"
                    :alt="relInfo.goodsName"
                  />
                </figure>
                <div class="price_title">
                  <p class="price_product">
                    <strong class="price_current">{{ insertCommas(relInfo.salePrice) }}<span class="price_unit">원</span></strong>
                  </p>
                  <p class="title">
                    {{ htmlDecode(relInfo.goodsName) }}
                  </p>
                </div>
              </div>
              <div class="benefit_button">
                <ul class="benefit">
                  <li class="tv">
                    TV쇼핑
                  </li>
                  <li v-if="relInfo.dlvrFreeYn === 'Y' && !PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(relInfo.dispTypeCd)">
                    무료배송
                  </li>
                  <li v-if="relInfo.promIfiYn === 'Y'">
                    무이자
                  </li>
                  <li v-if="relInfo.promPadYn === 'Y'">
                    적립금
                  </li>
                </ul>
                <div
                  v-if="relInfo.orderYn === 'Y' || relInfo.orderYn === 'T_EN' || relInfo.orderYn === 'D_EN'"
                >
                  <div
                    v-if="PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(relInfo.dispTypeCd)"
                    class="btn_group"
                  >
                    <button
                      type="button"
                      class="btn_alarm"
                      @click="clickShoppingAlarm(relInfo)"
                    >
                      <i />
                    </button>
                    <button
                      type="button"
                      class="btn_buy"
                      @click="layerOpen(infoIdx, 'Y', relInfo.goodsName, relInfo.goodsId)"
                    >
                      바로구매
                    </button>
                  </div>
                  <div
                    v-else
                    class="btn_group"
                  >
                    <button
                      type="button"
                      class="btn_alarm"
                      @click="clickShoppingAlarm(relInfo)"
                    >
                      <i />
                    </button>
                    <button
                      type="button"
                      class="btn_buy"
                      @click="moveConsultationRequest(relInfo.goodsId)"
                    >
                      상담신청
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p class="btn_group">
                    <button
                      type="button"
                      class="btn_alarm"
                      @click="clickShoppingAlarm(relInfo)"
                    >
                      <i />
                    </button>
                    <button
                      type="button"
                      class="btn_buy in_active"
                      @click="clickLiveItemBuy()"
                    >
                      방송중 구매가능
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <button
          v-if="info.RelTotalOrgan.length > 0"
          type="button"
          class="btn collapse"
          @click="onCollapse(infoIdx)"
        >
          <span v-show="isRelOpenShow[infoIdx]">관련 상품 ({{ info.RelTotalOrgan.length }}개)</span>
          <span v-show="isRelCloseShow[infoIdx]">닫기</span>
        </button>
      </div>
      <div v-if="isLive(info)" class="time_table_live">
        <span class="title">
          <i class="icons_clock" />
          <span>방송시간</span>
        </span>
        <div class="time_wrap">
          <div class="time_swiper">
            <button
              type="button"
              class="btn_view"
              @click="clickBeforeTvScheduleList()"
            >
              <strong>{{ calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, -1, 'MM.dd') }}({{ format(calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, -1, 'yyyyMMdd'), 'E') }})</strong>
              <p>편성표</p>
            </button>
            <span class="date">{{ selectDay.substr(4,2) + '.' + selectDay.substr(6,2) + '(' + format(selectDay, 'E') }})</span>
            <span
              v-for="(timeInfo2, timeIdx2) in totalOrgan"
              :key="timeIdx2"
            >
              <span class="item" @click="clickTimeInfo(timeIdx2)">
                <figure>
                  <ns-img
                    :product-number="timeInfo2.partNumber"
                    :width="104"
                    :height="104"
                    :alt="timeInfo2.goodsName"
                  />
                </figure>
                <p class="time">
                  {{ calcDate(getDateParse02(timeInfo2.startDtm),0,0,0,0,"HH:mm") }}
                </p>
              </span>
            </span>
            <button
              type="button"
              class="btn_view"
              @click="clickNextTvScheduleList()"
            >
              <strong>{{ calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, 1, 'MM.dd') }}({{ format(calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, 1, 'yyyyMMdd'), 'E') }})</strong>
              <p>편성표</p>
            </button>
          </div>
        </div>
      </div>
      <div v-if="infoIdx === totalOrgan.length - 1" class="date_schedule">
        <button
          v-if="infoIdx === totalOrgan.length - 1 && selectDay < calcDate('', 0, 0, 0, 7, 'yyyyMMdd')"
          type="button"
          class="btn_view"
          @click="clickNextTvScheduleList()"
        >
          <span>
            {{ calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, 1, 'MM.dd') }}({{ format(calcDate(format(selectDay, 'yyyy') + '-' + format(selectDay, 'MM') +'-' + format(selectDay, 'dd'), 0, 0, 0, 1, 'yyyyMMdd'), 'E') }}) 편성표 보기 +
          </span>
        </button>
      </div>
    </div>
    <div v-if="getBroadcastingMobileListCallFlag && totalOrgan.length === 0" class="tv_schedule_empty">
      <p class="guide">
        편성 상품이 없습니다
      </p>
      <p class="sub_guide">
        본 편성표는 방송 확정된 프로그램의 상품만 제공하며,
        NS홈쇼핑 내부 사정에 따라 변경 될 수 있습니다.
      </p>
    </div>
    <!-- 바로구매 레이어 컴포넌트 -->
    <right-order-option
      v-if="!isNull(partNumber)"
      :key="partNumber"
      :shows-layer="layer[layerIdx]"
      :global-val="{partNumber: partNumber, getProductInfoFlag: true}"
      @layerClose="layerClose()"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import RightOrderOption from '@/components/product/RightOrderOption'
import {
  getNowDate,
  getDateParse02,
  getDateParse,
  calcDate,
  getPeriodDate,
  format
} from '@frameworks/dateutil/dateUtil'
import {
  isNull,
  timerObject,
  htmlDecode,
  insertCommas,
  getImageUrl
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import popupUtil from '@frameworks/popupUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import LOGIN_CONST from '@constants/customer/login'
import CONST from '@constants/framework/framework'
import loginUtil from '@utils/loginUtil'
import modalUtil from '@frameworks/modalUtil'
import consultationMixin from '@/mixins/product/consultationMixin'
import messageUtil from '@frameworks/messageUtil'

export default {
  name: 'TvScheduleTable',
  components: {
    NsImg,
    NsPrice,
    RightOrderOption
  },
  mixins: [
    consultationMixin
  ],
  data () {
    return {
      toggle: '', // NS홈쇼핑 NS Shop+ 토글 버튼 class
      layer: [], // 바로 구매 레이어 표시 여부
      currentTab: 0, // 선택 탭
      scheduleSwiperOption: { // 날짜 스와이퍼 옵션
        loop: false,
        spaceBetween: 8,
        slidesPerGroup: 1,
        slidesPerView: '7',
        initialSlide: 6
      }, // 날짜 스와이퍼 옵션
      collapse: [], // 더보기
      totalOrgan: [], // 편성표 리스트
      limitTime: '', // 남은 생방송 시간
      isRemainingTimeShow: true, // 남은 생방송 시간
      isRemainingTimeEndShow: false, // 방송종료
      selectDay: '', // 선택 날짜
      isRelOpenShow: [], // 관련상품보기
      isRelCloseShow: [], // 관련상품보기 닫기
      partNumber: '', // 상품코드
      liveFlg: true, // 생방송 여부
      layerIdx: '', // 모달 index
      relSubPrdLng: [], // 연관상품 리스트(노출)
      relNotSubPrdLng: [], // 연관상품 리스트(비노출)
      relNotSubPrdFirst: [], // 같이보면 좋은 상품 리스트
      isShowSettingsPopup: false,
      talkInfo: {
        productCode: '', // 상품코드
        userId: '', // 유저 id
        userTel: '' // 유저 폰번호
      },
      isToggleShow: true,
      floatingTimeTableIO: null, // floating time table 조정용 intersection observer 객체
      hasLiveBroadcasting: false, // 실시간 방송 상품 유무
      nstalkYn: false, // NsTalk 편성여부
      autoSynchronizeFloatingTableIntervalID: null, // 플로팅 테이블 자동 동기화용
      isFloatingTableOpen: false, // 플로팅 테이블 열림 여부
      nsTalkYnCheckInterval: null, // NSTalk 가능 여부 체크 인터벌
      getBroadcastingMobileListCallFlag: false
    }
  },
  computed: {
    ...mapState('popup', ['popupList']),
    ...mapState('tvScheduleTable', ['alarmTalkClassName']),
    scheduleSwiper () {
      return this.$refs.scheduleSwiper.$swiper
    },
    bizUtil () {
      return bizUtil
    },
    PRODUCT_CONST () {
      return PRODUCT_CONST
    },
    /**
     * 플로팅 테이블 class 반환
     * @returns {String}
     */
    floatingTableClass () {
      return this.isFloatingTableOpen ? 'open' : ''
    }
  },
  watch: {
    async '$route' () {
      await this.init()
      this.scheduleSwiper.slideTo(7 + Number(getPeriodDate(this.selectDay, 'days')), 100)
    },
    /**
     * 플로팅 테이블 상태 변화에 따른 처리
     * 열림 상태: 탭바 스크롤 이벤트 해제
     * 닫힘 상태: 탭바 스크롤 이벤트 설정
     */
    isFloatingTableOpen (value) {
      if (value) {
        this.$store.dispatch('layouts/offLayoutScrollEvent')
        this.$store.dispatch('layouts/onTabBarOnlyScrollEvent')
      } else {
        this.$store.dispatch('layouts/offTabBarOnlyScrollEvent')
        this.$store.dispatch('layouts/onLayoutScrollEvent')
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.setAutoSynchronizeFloatingTable()
    this.synchronizeLiveItemWithLiveTable()

    this.addSettingAutoSynchornizationWhenWindowIsScrolled()
    this.addUnsettingAutoSynchornizationWhenFloatingTableIsSCrolled()
  },
  updated () {
    if (this.liveFlg) {
      if (!isNull(document.querySelector('.icons_live'))) {
        // 기억된 스크롤 위치가 있을 때(뒤로가기/ 앞으로가기 시)에는 스크롤 이동 하지 않음
        if (!this.$route.meta.hasSavedPosition) {
          this.$nextTick(() => {
            this.setScrollTo(this.selectDay)
            this.synchronizeLiveItemWithLiveTable()
          })
        }
      }
      this.liveFlg = false
    }
  },
  beforeDestroy () {
    this.unsetFloatingTimeTable()
    this.unsetAutoSynchronizeFloatingTable()
    this.removeSettingAutoSynchornizationWhenWindowIsScrolled()
    this.removeUnsettingAutoSynchornizationWhenFloatingTableIsSCrolled()

    this.$store.dispatch('layouts/offTabBarOnlyScrollEvent')
    this.$store.dispatch('layouts/onLayoutScrollEvent')

    if (!isNull(this.nsTalkYnCheckInterval)) { clearInterval(this.nsTalkYnCheckInterval) }
  },
  methods: {
    htmlDecode,
    insertCommas,
    isNull,
    calcDate,
    getNowDate,
    getDateParse02,
    format,
    async init () {
      if (isNull(this.$route.params.mediaDay)) {
        this.currentTab = Number(calcDate('', 0, 0, 0, 0, 'yyyyMMdd'))
        this.selectDay = calcDate('', 0, 0, 0, 0, 'yyyyMMdd')
        this.toggle = ''
      } else {
        if (this.$route.params.mediaDay.indexOf('shopplus') === 0) { // 샵플러스
          this.toggle = 'active' // 샵플러스 탭 활성화

          if (isNull(this.$route.params.mediaDay.substr(8, 8))) {
            this.currentTab = Number(calcDate('', 0, 0, 0, 0, 'yyyyMMdd'))
            this.selectDay = calcDate('', 0, 0, 0, 0, 'yyyyMMdd')
          } else {
            this.currentTab = Number(this.$route.params.mediaDay.substr(8, 8))
            this.selectDay = this.$route.params.mediaDay.substr(8, 8)
          }
        } else { // 홈쇼핑
          this.toggle = '' // 홈쇼핑 탭 활성화

          if (isNull(this.$route.params.mediaDay.substr(2, 8))) {
            this.currentTab = Number(calcDate('', 0, 0, 0, 0, 'yyyyMMdd'))
            this.selectDay = calcDate('', 0, 0, 0, 0, 'yyyyMMdd')
          } else {
            this.currentTab = Number(this.$route.params.mediaDay.substr(2, 8))
            this.selectDay = this.$route.params.mediaDay.substr(2, 8)
          }
        }
      }

      let searchFlg = false
      for (let i = 1; i < 16; i++) {
        if (this.selectDay === calcDate('', 0, 0, 0, i - 8, 'yyyyMMdd')) {
          searchFlg = true
        }
      }

      if (searchFlg) {
        await this.getBroadcastingMobileList(this.selectDay)
      } else {
        this.totalOrgan = []
        this.getBroadcastingMobileListCallFlag = true
      }

      this.setLimitLiveTime() // 생방송 남은 시간 설정

      this.resetFloatingTimeTable() // 플로팅 타임 테이블 재설정

      // 마케팅 스크립트 적용 부분
      // Airbridge
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PRODUCT_CHART, // 편성표 조회
        data: {
          action: '편성표 조회',
          label: '편성표 조회'
        }
      })
    },
    /**
     * 상품상세 클릭
     * @param {string} partnumber 상품번호
     * @param {string} clksrc 전자상거래코드
     * @param {string} scheduleTblName 제목
     */
    productDetailLogging (productInfo, clksrc, scheduleTblName) {
      if (productInfo.orderYn === 'Y' || productInfo.orderYn === 'T_EN' || productInfo.orderYn === 'D_EN') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_TV편성표',
            eventAction: '상품상세',
            eventLabel: `상품상세_편성표_${productInfo.goodsName}`,
            params: {
              t1: null
            }
          }
        })
        // E-commerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: productInfo.partNumber,
                name: productInfo.goodsName,
                brand: productInfo.brandName,
                dimension16: 'eTV'
              }
            ],
            subparams: {
              t1: '편성표',
              t2: scheduleTblName,
              product_list: `편성표_${scheduleTblName}`
            }
          }
        })

        bizUtil.gotoProductDetail(productInfo.partNumber, { clksrc, scheduleTblName })
      } else {
        this.clickLiveItemBuy()
      }
    },
    /**
     * NS홈쇼핑 버튼
     * @returns {void}
     */
    toggleLeft () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '미디어',
            t2: '편성표',
            t3: 'TVLIVE',
            t4: ''
          }
        }
      })
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV편성표',
          eventAction: '편성표',
          eventLabel: 'NSLIVE',
          params: {
            t1: null
          }
        }
      })
      this.toggle = ''

      this.$router.push({ name: 'tvScheduleTable', params: { mediaDay: `tv${this.selectDay}` } })
    },
    /**
     * SHOP+ 버튼
     * @returns {void}
     */
    toggleRight () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '미디어',
            t2: '편성표',
            t3: 'NSSHOP+',
            t4: ''
          }
        }
      })
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV편성표',
          eventAction: '편성표',
          eventLabel: 'NSShop+',
          params: {
            t1: null
          }
        }
      })
      this.toggle = 'active'

      this.$router.push({ name: 'tvScheduleTable', params: { mediaDay: `shopplus${this.selectDay}` } })
    },
    /**
     * 바로주문 열기
     * @param {Number} infoIdx - 선택 index (필수)
     * @param {String} intPrdYn - 상담하기 여부 : 상담하기=Y 바로구매=N
     * @param {String} goodsName - 상품명
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    layerOpen (infoIdx, intPrdYn, goodsName, partNumber) {
      let eventAction = ''
      let eventLabel = ''
      if (intPrdYn === 'Y') {
        eventAction = '상담신청'
        eventLabel = `상담신청_편성표_${goodsName}`
      } else {
        eventAction = '바로구매'
        eventLabel = `바로구매_편성표_${goodsName}`
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV편성표',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      this.layerIdx = infoIdx
      this.partNumber = partNumber
      this.layer[this.layerIdx] = true
    },
    /**
     * 바로주문 닫기
     * @returns {void}
     */
    layerClose () {
      this.partNumber = ''
      this.layer[this.layerIdx] = false
    },
    /**
     * 날짜 클릭
     * @param {Number} index - 선택 index (필수)
     * @param {String} calDate - 선택 날짜 (필수)
     */
    async categoryTab (index, calDate) {
      this.liveFlg = true
      this.currentTab = index
      this.scheduleSwiper.slideTo(index - 1, 100)

      this.resetFloatingTimeTable()

      this.$router.push({ name: 'tvScheduleTable', params: { mediaDay: (this.toggle === 'active' ? 'shopplus' : 'tv') + calDate } })
    },
    /**
     * 방송시간 리스트 보기/닫기
     * @returns {void}
     */
    timeListToggle () {
      this.sendFloatingButtonClickLog() // 이벤트 로그

      if (this.isFloatingTableOpen) {
        this.resetFloatingTablePosition()
        this.isFloatingTableOpen = false // 테이블 가리기
      } else {
        this.adjustFloatingTablePosition()
        this.isFloatingTableOpen = true // 테이블 표시

        this.$nextTick(this.synchronizeShowingItemWithFloatingTable) // 플로팅 테이블 동기화
      }
    },
    /**
     * 관련 상품 보기/닫기
     * @param {Number} infoIdx - 선택 index (필수)
     * @returns {void}
     */
    onCollapse (infoIdx) {
      if (this.collapse[infoIdx] === 'product_related open') {
        this.collapse[infoIdx] = 'product_related'
        this.isRelOpenShow[infoIdx] = true
        this.isRelCloseShow[infoIdx] = false

        this.$nextTick(() => {
          const product = document.querySelector(`#relProductList${infoIdx}`)
          window.scrollTo(0, product.offsetTop - this.getOffsetHeight())
        })
      } else {
        this.collapse[infoIdx] = 'product_related open'
        this.isRelOpenShow[infoIdx] = false
        this.isRelCloseShow[infoIdx] = true

        // android offset 보정
        const pageYOffset = window.pageYOffset
        this.$nextTick(() => {
          const product = document.querySelector(`#relProductList${infoIdx}`)
          const relatedProduct = product.nextSibling

          let trialCount = 0
          const intervalRef = setTimeout(() => {
            if (trialCount > 10) {
              clearInterval(intervalRef)
              return
            }

            trialCount++
            const isItOpen = relatedProduct.classList.contains('open')

            if (isItOpen) {
              window.scrollTo(0, pageYOffset)
              clearInterval(intervalRef)
            }
          }, 10)
        })
      }

      this.collapse = [...this.collapse]
      this.isRelOpenShow = [...this.isRelOpenShow]
      this.isRelCloseShow = [...this.isRelCloseShow]
    },
    /**
     * 전날 편성표 보기
     * @returns {void}
     */
    clickBeforeTvScheduleList () {
      const beforeDay = calcDate(`${this.selectDay.substr(0, 4)}-${this.selectDay.substr(4, 2)}-${this.selectDay.substr(6, 2)}`, 0, 0, 0, -1, 'yyyyMMdd')

      this.$router.push({ name: 'tvScheduleTable', params: { mediaDay: (this.toggle === 'active' ? 'shopplus' : 'tv') + beforeDay } })
    },
    /**
     * 다음날 편성표 보기
     * @returns {void}
     */
    clickNextTvScheduleList () {
      const nextDay = calcDate(`${this.selectDay.substr(0, 4)}-${this.selectDay.substr(4, 2)}-${this.selectDay.substr(6, 2)}`, 0, 0, 0, 1, 'yyyyMMdd')

      this.$router.push({ name: 'tvScheduleTable', params: { mediaDay: (this.toggle === 'active' ? 'shopplus' : 'tv') + nextDay } })
    },
    /**
     * 편성표 전용 NsTalk Enable 반환 함수
     * @return {Promise} promise
     */
    async getNsTalkEnableForTvSchedule (identify, goodId, startdtm, enddtm, count) {
      let result = false
      if (identify === 'tv') {
        const nstalkRollingUrl = `https://${CONST.NSTALK_TVLIVE_PATH}/api/messages`
        const invoke = {
          crossDomain: true,
          dataType: 'json',
          code: goodId,
          count,
          start_date: startdtm,
          end_date: enddtm
        }
        const response = await this.$nsaxios.post(nstalkRollingUrl, invoke)
        if (!isNull(response.data)) {
          result = response.data.talk_enable
        }
      }
      return result
    },
    /**
     * 각 편성 데이터의 Button ClassName 설정 함수
     *
     * @return {Promise} promise
     */
    async setAlarmTalkClassName () {
      if (isNull(this.totalOrgan) || !this.totalOrgan.length > 0) {
        return
      }
      if (this.nstalkYn) {
        for (let i = 0; i < this.totalOrgan.length; i++) {
          const isLive = this.isLive(this.totalOrgan[i])
          if (isLive) {
            this.hasLiveBroadcasting = true // 실시간 방송 여부 갱신
            const isCurrentOpened = this.alarmTalkClassName[i] === 'btn_nstalk'
            const nsTalkEnable = await this.getNsTalkEnableForTvSchedule('tv', this.totalOrgan[i].partNumber, this.totalOrgan[i].startDtm, this.totalOrgan[i].endDtm)
            if (isCurrentOpened && (!nsTalkEnable || !this.nstalkYn)) {
              this.$store.commit('tvScheduleTable/setAlarmTalkClassName', { index: i, el: 'btn_alarm' })
            } else if (this.nstalkYn && nsTalkEnable) {
              this.$store.commit('tvScheduleTable/setAlarmTalkClassName', { index: i, el: 'btn_nstalk' })
            }
          } else {
            this.$store.commit('tvScheduleTable/setAlarmTalkClassName', { index: i, el: 'btn_alarm' })
          }
        }
      } else {
        for (let i = 0; i < this.totalOrgan.length; i++) {
          const isLive = this.isLive(this.totalOrgan[i])
          if (isLive) {
            this.hasLiveBroadcasting = true // 실시간 방송 여부 갱신
          }
        }
      }
    },
    /**
     * 각 편성 데이터의 Button ClassName 설정 함수 인터벌 설정
     */
    setAlarmTalkClassNameRoll () {
      this.setAlarmTalkClassName()
      this.nsTalkYnCheckInterval = setInterval(this.setAlarmTalkClassName, 10000)
    },
    /**
     * 편성표 조회
     * @param {String} date - 선택 날짜 (필수)
     */
    async getBroadcastingMobileList (date) {
      this.selectDay = date

      const param = {
        selectDay: this.selectDay,
        processFlag: this.toggle === 'active' ? 'shopPlusBrodcastingMobileScroll' : 'brodcastingMobileScroll'
      }

      // 상담원 처리 유무 체크 통신
      // this.$nsaxios.post('TVHomeShoppingAjaxMob', param, successHandling)
      const data = await this.$nsaxios.post(this.toggle === 'active' ? 'NSShopPlusBroadCmd' : 'NSTvBroadCmd', param)

      this.totalOrgan = data?.msg?.TotalOrgan || []
      this.nstalkYn = data?.msg?.nstalkYn === 'Y' || false

      this.layer = []
      this.collapse = []
      this.isRelOpenShow = []
      this.isRelCloseShow = []
      this.relNotSubPrdFirst = []
      this.hasLiveBroadcasting = false // 실시간 방송 여부 초기화

      for (let i = 0; i < this.totalOrgan.length; i++) {
        this.collapse[i] = 'product_related'
        this.isRelOpenShow[i] = true
        this.isRelCloseShow[i] = false
        this.layer[i] = false

        if (!this.alarmTalkClassName[i] || this.alarmTalkClassName[i] !== 'btn_nstalk') {
          this.$store.commit('tvScheduleTable/setAlarmTalkClassName', { index: i, el: 'btn_alarm' })
        }

        let subProdLng = 0
        let notSubProdLng = 0
        for (let j = 0; j < this.totalOrgan[i].RelTotalOrgan.length; j++) {
          if (this.totalOrgan[i].RelTotalOrgan[j].relGbn === 'subProd') {
            subProdLng++
          } else {
            notSubProdLng++
          }

          if (notSubProdLng > 0) {
            this.relNotSubPrdFirst[i] = ['Y']
          } else {
            this.relNotSubPrdFirst[i] = ['N']
          }
        }
        this.relSubPrdLng[i] = subProdLng
        this.relNotSubPrdLng[i] = notSubProdLng
      }
      this.getBroadcastingMobileListCallFlag = true
      this.setAlarmTalkClassNameRoll()
      // 기억된 스크롤 위치가 있을 때(뒤로가기/ 앞으로가기 시)에는 스크롤 이동 하지 않음
      if (!this.$route.meta.hasSavedPosition) {
        this.$nextTick(() => {
          this.setScrollTo(date)
        })
      }
    },
    /**
     * 생방송 남은 시간 설정
     * @returns {void}
     */
    setLimitLiveTime () {
      timerObject.checkTimerObject()
      timerObject.m_timer = setInterval(this.setRemainedTime, 1000)
    },
    /**
     * 생방송 남은 시간 설정
     * @returns {void}
     */
    setRemainedTime () {
      let remainingTime = null
      const nowTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))

      for (let i = 0; i < this.totalOrgan.length; i++) {
        if (getDateParse02(this.totalOrgan[i].startDtm) <= nowTime && getDateParse02(this.totalOrgan[i].endDtm) > nowTime) {
          remainingTime = this.totalOrgan[i].endDtm
        }
      }

      if (remainingTime === null) {
        timerObject.checkTimerObject()
        return
      }

      const timeLimit = getPeriodDate(remainingTime, 'json')

      if (timeLimit.hour === 23 && timeLimit.minute === 59 && timeLimit.second >= 30) {
        timerObject.checkTimerObject()

        this.isRemainingTimeShow = false
        this.isRemainingTimeEndShow = true
      } else {
        this.limitTime = `${timeLimit.hour}:${timeLimit.minute}:${timeLimit.second}`

        this.isRemainingTimeShow = true
        this.isRemainingTimeEndShow = false
      }
    },
    /**
     * 방송알림 버튼 클릭
     * @param {Number} info - 상품정보 (필수)
     * @param {String} buttonType - 버튼타입
     * @returns {void}
     */
    clickShoppingAlarm (info, buttonType = '') {
      const isLogon = loginUtil.checkLogonStatus()
      if (!isLogon) {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER)
        return
      }

      if (buttonType === 'btn_nstalk') {
        const params = {
          identify: 'tv',
          goodId: info.partNumber,
          startdtm: info.startDtm,
          enddtm: info.endDtm,
          nsTalkOnlyFlag: true
        }

        popupUtil.show('store/HomeBridge', params, null, false)
      } else {
        const registeredProductInfo = {
          partNumber: isNull(info.partNumber) ? info.catentryId : info.partNumber, // '26196200', // bundleGroup[0].partNumber,
          catentryId: info.catentryId, // '26196200', // bundleGroup[0].partNumber,
          productName: info.goodsName,
          isCtcomProduct: this.toggle === 'active', // 샵플러스 상품 여부
          imageUrl: getImageUrl(isNull(info.partNumber) ? info.catentryId : info.partNumber, 88, 88, info.adultItemFlag)
        }
        const param = {
          globalVal: {
            productInfo: {
              ctcomTvList: [{
                pgmCd: this.toggle === 'active' ? info.pgmCD : ''
              }]
            }
          },
          registeredProductInfo
        }

        modalUtil.show('product/ShoppingAlarmRegister', param, responseData => this.closeAlarmRegister(responseData))
      }
    },
    /**
     * 방송알리미 등록창 닫기
     * @param {Boolean} 등록 성공 여부
     */
    closeAlarmRegister (isRegistSuccess) {
      if (isRegistSuccess === true) {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_TV편성표',
            eventAction: '방송알림',
            eventLabel: '방송알림on',
            params: {
              t1: null
            }
          }
        })
      } else {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_TV편성표',
            eventAction: '방송알림',
            eventLabel: '방송알림off',
            params: {
              t1: null
            }
          }
        })
      }

      this.isShowSettingsPopup = false
    },
    /**
     * 방송시간 클릭 시
     * @param {Number} infoIdx - 선택 index (필수)
     * @returns {void}
     */
    clickTimeInfo (timeIdx) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV편성표',
          eventAction: '방송시간플로팅',
          eventLabel: '시간선택',
          params: {
            t1: null
          }
        }
      })

      const el = document.getElementById(`itemTime${timeIdx}`)
      if (!isNull(el)) {
        window.scrollTo(0, el.offsetTop - this.getOffsetHeight())
      }
    },
    /**
     * 방송중 구매가능 버튼 클릭
     * @returns {void}
     */
    clickLiveItemBuy () {
      messageUtil.alert('해당 상품은 방송시간 중에만 구매하실 수 있습니다.')
    },
    /**
     * 검색 팝업창 오픈
     * @returns {void}
     */
    clickOpenSearchPop () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV편성표',
          eventAction: 'TV쇼핑검색',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
      let mediaDivParam = ''
      if (this.toggle === 'active') {
        mediaDivParam = 'ShopPlus'
      } else {
        mediaDivParam = 'TvShopping'
      }

      bizUtil.openSearchLayer({
        tvTableFlag: true,
        mediaDiv: mediaDivParam
      })
    },
    /**
     * top 마진 계산
     * @returns {Number}
     */
    getOffsetHeight () {
      const tvTab = document.querySelector('.schedule_tab')
      const dateSchedule = document.querySelector('.date_schedule')
      const categoryWrapper = document.querySelector('.category_wrapper')

      if (!tvTab || !dateSchedule || !categoryWrapper) {
        return
      }

      let offsetHeight = 0
      const mainTopHeight = tvTab.offsetHeight
      const dateScheduleHeight = dateSchedule.offsetHeight
      const categoryWrapperHeight = categoryWrapper.offsetHeight

      offsetHeight = mainTopHeight + dateScheduleHeight + (isNull(this.$route.params.mediaDay) ? categoryWrapperHeight : 0)

      return offsetHeight
    },
    /**
     * 조회 후 top 위치 설정
     * @param {String} _day - 선택 날짜 (필수)
     * @returns {void}
     */
    setScrollTo (_day) {
      if (!this.totalOrgan ||
        (Array.isArray(this.totalOrgan) && this.totalOrgan.length === 0) ||
        this.popupList.length >= 1 // popup 사이드 이펙트 방지
      ) {
        return
      }
      if (!isNull(this.$route.params.mediaDay)) {
        document.getElementById('app').classList.value = 'hide'
      }

      if (_day !== getNowDate()) {
        if (!isNull(document.getElementById(`itemTime${0}`))) {
          window.scrollTo({
            top: document.getElementById(`itemTime${0}`).offsetTop - this.getOffsetHeight(),
            behavior: 'smooth'
          })
        }
      } else {
        if (!isNull(document.querySelector('.icons_live'))) {
          setTimeout(() => { // image 로딩 대기
            window.scrollTo({
              top: document.querySelector('.icons_live').offsetTop - this.getOffsetHeight(),
              behavior: 'smooth'
            })
          }, 1000)
        } else {
          if (!isNull(document.getElementById(`itemTime${0}`))) {
            window.scrollTo({
              top: document.getElementById(`itemTime${0}`).offsetTop - this.getOffsetHeight(),
              behavior: 'smooth'
            })
          }
        }
      }
    },
    /**
     * 현재 방송 중 여부
     *
     * @param {Object} info 방송 데이터
     * @returns {boolean} 현재 방송 중 여부
     */
    isLive (info) {
      const { startDtm, endDtm, onAirFlag } = info
      if (this.toggle === 'active') {
        const nowTime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        return getDateParse02(startDtm) <= nowTime &&
          getDateParse02(endDtm) > nowTime &&
          getNowDate() === this.selectDay
      } else {
        return onAirFlag === 'O'
      }
    },
    /**
     * 상품상세 이동
     */
    gotoProductDetail (info) {
      if (info.orderYn === 'Y' || info.orderYn === 'T_EN' || info.orderYn === 'D_EN') {
        bizUtil.gotoProductDetail(info.goodsId)
      }
    },
    /**
     * 아이콘 표시여부
     * @param {Object} info
     * @param {String} buttonType 아이콘 종류 (alarm | nstalk)
     */
    isIconVisible (info, buttonType) {
      const live = this.isLive(info)

      if (live) {
        if (buttonType === 'btn_nstalk') {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    /**
     * 타임 플로팅 설정
     */
    setFloatingTimeTable () {
      if (this.hasLiveBroadcasting) { // 실시간 방송 중일 때
        const io = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const tvTable = document.querySelector('.time_table_floating')

            if (!tvTable) {
              return
            }

            if (entry.isIntersecting) {
              tvTable.style.display = 'none'
            } else {
              tvTable.style.display = 'block'
            }
          })
        }, {
          root: null, // default: null
          rootMargin: '0px 0px 0px 0px', // top, right, bottom, left. default: '0px'
          threshold: [0] // array or number. default: [0]
        })

        const targetElement = document.querySelector('.time_table_live')

        /** observe intersection */
        io.observe(targetElement)
      } else {
        if (isNull(this.totalOrgan) || !this.totalOrgan.length > 0) {
          const tvTable = document.querySelector('.time_table_floating')

          if (!tvTable) {
            return
          }

          tvTable.style.display = 'none'
        } else {
          const tvTable = document.querySelector('.time_table_floating')

          if (!tvTable) {
            return
          }

          tvTable.style.display = 'block'
        }
      }
    },
    /**
     * 타임 플로팅 설정 해제
     */
    unsetFloatingTimeTable () {
      if (this.floatingTimeTableIO) {
        this.floatingTimeTableIO.disconnect()
        this.floatingTimeTableIO = null
      }

      const tvTable = document.querySelector('.time_table_floating')

      if (!tvTable) {
        return
      }

      tvTable.style.display = 'none'
    },
    /**
     * 플로팅 타임 테이블 재설정
     */
    resetFloatingTimeTable () {
      this.unsetFloatingTimeTable()
      this.setFloatingTimeTable()
    },
    /**
     * 타임 테이블 수평 스크롤 위치 변경
     * @param {String} type 'live' or 'floating'
     * @param {Number} itemIndex
     */
    moveToTimeTableItem (type, itemIndex) {
      if (!type) {
        return
      }

      if (!itemIndex) {
        itemIndex = 0
      }

      const targetClass = type === 'live' ? '.time_table_live' : '.time_table_floating'
      const container = document.querySelector(`${targetClass} .time_wrap`)

      if (!container) {
        return
      }

      const scheduleOfYesterdayWidth = document.querySelector(`${targetClass} .time_wrap .btn_view`)?.clientWidth || 0
      const dateWidth = document.querySelector(`${targetClass} .time_wrap .date`)?.clientWidth || 0
      const PSEUDO_WIDTH = 8
      const ITEM_WIDTH = 52
      const ITEM_PADDING = 16
      const ITEM_MARGIN = 8

      const destination = PSEUDO_WIDTH + scheduleOfYesterdayWidth + dateWidth + ((ITEM_WIDTH + ITEM_PADDING) * itemIndex) + ITEM_MARGIN

      container.scrollTo({
        top: 0,
        left: destination,
        behavior: 'smooth'
      })
    },
    /**
     * 실시간 방송 아이템 인덱스 반환
     * @returns {Number}
     */
    getLiveItemIndex () {
      let currentScheduleIndex = 0

      for (let i = 0; i < this.totalOrgan.length; i++) {
        if (getNowDate() === this.selectDay &&
        getDateParse02(this.totalOrgan[i].startDtm) <= getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss')) &&
        getDateParse02(this.totalOrgan[i].endDtm) > getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))) {
          currentScheduleIndex = i
          break
        }
      }

      return currentScheduleIndex
    },
    /**
     * 플로팅 버튼 클릭 로그 전송
     */
    sendFloatingButtonClickLog () {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_TV편성표',
          eventAction: '방송시간플로팅',
          eventLabel: '시간펼침',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 화면에 노출되고 있는 방송 상품 index 반환
     */
    getShowingItemIndex () {
      const tvItems = document.querySelectorAll('.tv_item')

      if (!tvItems || tvItems.length === 0) {
        return
      }

      const pageYOffset = window.pageYOffset || 0

      const heightOfHeader = document.querySelector('#app')?.classList.contains('hide')
        ? 0
        : document.querySelector('#appHeaderMain')?.offsetHeight || 0
      const heightOfCategory = document.querySelector('.app_category')?.offsetHeight || 0
      const heightOfTVScheduleTable = document.querySelector('.tv_schedule_table .swiper-container')?.offsetHeight || 0
      const hegihtOfTvTab = document.querySelector('.schedule_tab')?.offsetHeight || 0

      const currentHeightIncludesUpperElements = pageYOffset + heightOfHeader + heightOfCategory + heightOfTVScheduleTable + hegihtOfTvTab

      let itemIndex = 0
      for (let i = 0; i < tvItems.length; i++) {
        const tvItem = tvItems[i]
        const heightTopFromItem = tvItem.offsetHeight + tvItem.offsetTop

        if (i === 0) {
          const offsetTopOfFirstITem = tvItems[0].offsetTop

          if (offsetTopOfFirstITem > currentHeightIncludesUpperElements) { // 첫번째 요소의 상단보다 위에 있을 경우
            itemIndex = 0
            break
          }
        }

        if (heightTopFromItem > currentHeightIncludesUpperElements && tvItem.offsetTop <= currentHeightIncludesUpperElements) {
          itemIndex = i
          break
        }
      }

      return itemIndex
    },
    /**
     * 화면에 노출되고 있는 방송 상품에 맞춰 플로팅 테이블 동기화
     */
    synchronizeShowingItemWithFloatingTable () {
      this.moveToTimeTableItem('floating', this.getShowingItemIndex())
    },
    /**
     * 플로팅 테이블 자동 동기화 설정
     */
    setAutoSynchronizeFloatingTable () {
      if (this.autoSynchronizeFloatingTableIntervalID === null) {
        this.autoSynchronizeFloatingTableIntervalID = setInterval(this.synchronizeShowingItemWithFloatingTable, 1000)
      }
    },
    /**
     * 플로팅 테이블 자동 동기화 설정 해제
     */
    unsetAutoSynchronizeFloatingTable () {
      if (this.autoSynchronizeFloatingTableIntervalID !== null) {
        clearInterval(this.autoSynchronizeFloatingTableIntervalID)
        this.autoSynchronizeFloatingTableIntervalID = null
      }
    },
    /**
     * 플로팅 테이블 자동 동기화 처리 (전역 스크롤 이벤트 콜백 추가)
     */
    addSettingAutoSynchornizationWhenWindowIsScrolled () {
      window.addEventListener('scroll', this.setAutoSynchronizeFloatingTable)
    },
    /**
     * 플로팅 테이블 자동 동기화 처리 (전역 스크롤 이벤트 콜백 삭제)
     */
    removeSettingAutoSynchornizationWhenWindowIsScrolled () {
      window.removeEventListener('scroll', this.setAutoSynchronizeFloatingTable)
    },
    /**
     * 플로팅 테이블 자동 동기화 해제 (플로팅 테이블 스크롤 이벤트 콜백 추가)
     */
    addUnsettingAutoSynchornizationWhenFloatingTableIsSCrolled () {
      const scrollTarget = document.querySelector('.time_table_floating .time_wrap')

      if (!scrollTarget) {
        return
      }

      scrollTarget.addEventListener('scroll', this.unsetAutoSynchronizeFloatingTable)
    },
    /**
     * 플로팅 테이블 자동 동기화 해제 (플로팅 테이블 스크롤 이벤트 콜백 삭제)
     */
    removeUnsettingAutoSynchornizationWhenFloatingTableIsSCrolled () {
      const scrollTarget = document.querySelector('.time_table_floating .time_wrap')

      if (!scrollTarget) {
        return
      }

      scrollTarget.removeEventListener('scroll', this.unsetAutoSynchronizeFloatingTable)
    },
    /**
     * 라이브 타임 테이블 동기화
     */
    synchronizeLiveItemWithLiveTable () {
      this.moveToTimeTableItem('live', this.getLiveItemIndex())
    },
    /**
     * 오늘로부터 일자 차이만큼의 일자 반환
     */
    getDay (day) {
      const calculatedDate = calcDate('', 0, 0, 0, day, 'dd')

      return calculatedDate[0] === '0' ? calculatedDate.substring(1) : calculatedDate
    },
    /**
     * 플로팅 테이블 요소 반환
     * @returns {Element|null}
     */
    getFloatingTable () {
      return document.querySelector('.time_table_floating')
    },
    /**
     * 플로팅 테이블 포지션 조정 (레이아웃 상태에 따른 조정)
     */
    adjustFloatingTablePosition () {
      const navigation = document.querySelector('.navigation')
      const floatingTable = document.querySelector('.time_table_floating')

      if (!navigation || !floatingTable) {
        return
      }

      const isTabBarHiding = navigation.classList.contains('hide')
      if (isTabBarHiding) {
        floatingTable.classList.remove('position')
      } else {
        floatingTable.classList.add('position')
      }
    },
    /**
     * 플로팅 테이블 포지션 초기화
     */
    resetFloatingTablePosition () {
      const floatingTable = document.querySelector('.time_table_floating')

      if (!floatingTable) {
        return
      }

      floatingTable.classList.remove('position')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/TvScheduleTable";
</style>
