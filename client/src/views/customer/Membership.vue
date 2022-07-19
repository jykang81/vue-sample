<template>
  <div class="membership">
    <section>
      <strong class="my_grade">{{ membershipInfo.userName }}님은 {{ membershipInfo.purchaseGrdName }} 등급입니다.</strong>
      <!-- class : family, gold, silver, diamond, markloven -->
      <!-- 패밀리 등급일 때 -->
      <p v-if="(membershipInfo.nextGradeRule === 'H' || membershipInfo.nextGradeRule === 'D') && membershipInfo.currentGrd === 'R10'" class="grade_guide silver">
        다음달 <strong class="unit">실버</strong>등급이 되시려면<br><strong>{{ membershipInfo.requiredOrderCount }}</strong>건, <strong>{{ membershipInfo.requiredOrderAmt }}</strong>원이 필요합니다.
      </p>
      <p v-if="membershipInfo.nextGradeRule === 'U' && membershipInfo.currentGrd === 'R10'" class="grade_guide silver">
        축하드립니다!<br>
        다음달 <strong class="unit">실버</strong>등급으로 승급 예정입니다.
      </p>
      <!-- 실버 등급일 때 -->
      <p v-if="membershipInfo.nextGradeRule === 'H' && membershipInfo.currentGrd === 'R2'" class="grade_guide gold">
        다음달 <strong class="unit">골드</strong>등급이 되시려면<br><strong>{{ membershipInfo.requiredOrderCount }}</strong>건, <strong>{{ membershipInfo.requiredOrderAmt }}</strong>원이 필요합니다.
      </p>
      <p v-if="membershipInfo.nextGradeRule === 'D' && membershipInfo.currentGrd === 'R2'" class="grade_guide gold">
        다음달 <strong class="unit">실버</strong>등급을 유지하시려면<br><strong>{{ membershipInfo.requiredOrderCount }}</strong>건, <strong>{{ membershipInfo.requiredOrderAmt }}</strong>원이 필요합니다.
      </p>
      <p v-if="membershipInfo.nextGradeRule === 'U' && membershipInfo.currentGrd === 'R2'" class="grade_guide gold">
        축하드립니다!<br>
        다음달 <strong class="unit">골드</strong>등급으로 승급 예정입니다.
      </p>
      <!-- 골드 등급일 때 -->
      <p v-if="membershipInfo.nextGradeRule === 'H' && membershipInfo.currentGrd === 'R13'" class="grade_guide diamond">
        다음달 <strong class="unit">다이아몬드</strong>등급이 되시려면<br><strong>{{ membershipInfo.requiredOrderCount }}</strong>건, <strong>{{ membershipInfo.requiredOrderAmt }}</strong>원이 필요합니다.
      </p>
      <p v-if="membershipInfo.nextGradeRule === 'D' && membershipInfo.currentGrd === 'R13'" class="grade_guide diamond">
        다음달 <strong class="unit">골드</strong>등급을 유지하시려면<br><strong>{{ membershipInfo.requiredOrderCount }}</strong>건, <strong>{{ membershipInfo.requiredOrderAmt }}</strong>원이 필요합니다.
      </p>
      <p v-if="membershipInfo.nextGradeRule === 'U' && membershipInfo.currentGrd === 'R13'" class="grade_guide diamond">
        축하드립니다!<br>
        다음달 <strong class="unit">다이아몬드</strong>등급으로 승급 예정입니다.
      </p>
      <!-- 다이아몬드 등급일 때 -->
      <p v-if="membershipInfo.nextGradeRule === 'D' && membershipInfo.currentGrd === 'R1'" class="grade_guide diamond">
        다음달 <strong class="unit">다이아몬드</strong> 등급을 유지하시려면<br><strong>{{ membershipInfo.requiredOrderCount }}</strong>건, <strong>{{ membershipInfo.requiredOrderAmt }}</strong>원이 필요합니다.
      </p>
      <p v-if="(membershipInfo.nextGradeRule === 'U' || membershipInfo.nextGradeRule === 'H') && membershipInfo.currentGrd === 'R1'" class="grade_guide diamond">
        축하드립니다.<br>다음달 <strong class="unit">다이아몬드</strong>등급으로 유지 예정입니다
      </p>
      <!-- Love.N 등급일 때 -->
      <p v-if="membershipInfo.currentGrd === 'R12' || (membershipInfo.currentGrd !== 'R12' && membershipInfo.isVip)" class="grade_guide markloven">
        축하드립니다.<br>NS멤버십 최고 등급 혜택을 누리세요!
      </p>
      <!-- 간편회원 또는 등급이 없을 때 -->
      <p v-if="membershipInfo.currentGrd === 'simple'" class="grade_guide silver">
        정회원으로 전환하시면 다양한 혜택이 마련되어 있습니다.
      </p>
      <ul class="grade_list">
        <li class="markloven" :class="[ membershipInfo.isGrade === 'markloven' ? 'active' : '']">
          <span>LOVE.N</span>
        </li>
        <li class="diamond" :class="[ membershipInfo.isGrade === 'diamond' ? 'active' : '']">
          <span>다이아몬드</span>
        </li>
        <li class="gold" :class="[ membershipInfo.isGrade === 'gold' ? 'active' : '']">
          <span>골드</span>
        </li>
        <li class="silver" :class="[ membershipInfo.isGrade === 'silver' ? 'active' : '']">
          <span>실버</span>
        </li>
        <li class="family" :class="[ membershipInfo.isGrade === 'family' ? 'active' : '']">
          <span>패밀리</span>
        </li>
      </ul>
      <div class="my_shopping">
        <dl>
          <dt>현재 구매건수</dt>
          <dd><strong>{{ membershipInfo.currentOrderCount }}</strong>건</dd>
        </dl>
        <dl>
          <dt>현재 구매금액</dt>
          <dd><strong>{{ membershipInfo.currentOrderAmt }}</strong>원</dd>
        </dl>
      </div>
      <p class="info_guide">
        산정기준 {{ membershipInfo.standardDate.startDate }} ~ {{ membershipInfo.standardDate.endDate }}
      </p>
    </section>
    <section>
      <strong class="subject">
        NS 멤버십 안내
      </strong>
      <div class="tabs">
        <button
          type="button"
          class="tab markloven"
          :class="[ currentTab === 'markloven' ? 'active' : '']"
          @click="currentTab='markloven'"
        >
          <span>LOVE.N</span>
        </button>
        <button
          type="button"
          class="tab diamond"
          :class="[ currentTab === 'diamond' ? 'active' : '']"
          @click="currentTab='diamond'"
        >
          <span>다이아몬드</span>
        </button>
        <button
          type="button"
          class="tab gold"
          :class="[ currentTab === 'gold' ? 'active' : '']"
          @click="currentTab='gold'"
        >
          <span>골드</span>
        </button>
        <button
          type="button"
          class="tab silver"
          :class="[ currentTab === 'silver' ? 'active' : '']"
          @click="currentTab='silver'"
        >
          <span>실버</span>
        </button>
        <button
          type="button"
          class="tab family"
          :class="[ currentTab === 'family' ? 'active' : '']"
          @click="currentTab='family'"
        >
          <span>패밀리</span>
        </button>
      </div>
      <div
        v-if="currentTab ==='markloven'"
        class="tab_content markloven"
      >
        <p class="title">
          <strong class="unit">LOVE.N</strong> 등급에게 드리는 혜택
        </p>
        <p class="sub_copy">
          최근 6개월 20회 &amp; 150만원 이상 구매 고객
        </p>
        <ul class="coupon_list">
          <li>
            <div class="item">
              <em>상시쿠폰</em>
              <strong>7</strong>%
            </div>
          </li>
          <li>
            <div class="item tv">
              <em>TV전용쿠폰</em>
              <strong>12</strong>%
            </div>
          </li>
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>7,000</strong>원
            </div>
          </li>
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>5</strong>%
            </div>
          </li>
        </ul>
        <ul class="special_list">
          <li>
            <i class="icons_special toll_point" />
            <p>
              등업 톨포인트<br>10,000톨
            </p>
          </li>
          <li>
            <i class="icons_special vip_lounge" />
            <p>
              VIP라운지<br>이용
            </p>
          </li>
          <li>
            <i class="icons_special free_delivery_third" />
            <p>
              무료배송 쿠폰<br>월 3회 부여
            </p>
          </li>
          <li>
            <i class="icons_special counsel" />
            <p>
              전용<br>상담 서비스
            </p>
          </li>
        </ul>
        <button
          v-if="membershipInfo.isGrade === 'markloven' && membershipInfo.isCouponDown"
          type="button"
          class="btn_download"
          @click="downloadAll"
        >
          <span>쿠폰 전체 다운받기</span>
        </button>
        <button
          v-if="membershipInfo.isGrade === 'markloven' && !membershipInfo.isCouponDown"
          type="button"
          class="btn_download in_active"
        >
          <span>쿠폰 전체 다운로드 완료</span>
        </button>
      </div>
      <div
        v-if="currentTab ==='diamond'"
        class="tab_content diamond"
      >
        <p class="title">
          <strong class="unit">다이아몬드</strong> 등급에게 드리는 혜택
        </p>
        <p class="sub_copy">
          최근 6개월 8건 &amp; 80만원 이상 구매 고객
        </p>
        <ul class="coupon_list">
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>7,000</strong>원
            </div>
          </li>
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>5</strong>%
            </div>
          </li>
          <li>
            <div class="item tv">
              <em>TV전용쿠폰</em>
              <strong>12</strong>%
            </div>
          </li>
          <li>
            <div class="item toll_point">
              <em>등업 톨포인트</em>
              <strong>10,000</strong>톨
            </div>
          </li>
        </ul>
        <ul class="special_list">
          <li>
            <i class="icons_special vip_lounge" />
            <p>
              VIP라운지<br>이용
            </p>
          </li>
          <li>
            <i class="icons_special free_delivery_first" />
            <p>
              무료배송 쿠폰<br>월 1회 부여
            </p>
          </li>
        </ul>
        <button
          v-if="membershipInfo.isGrade === 'diamond' && membershipInfo.isCouponDown"
          type="button"
          class="btn_download"
          @click="downloadAll"
        >
          <span>쿠폰 전체 다운받기</span>
        </button>
        <button
          v-if="membershipInfo.isGrade === 'diamond' && !membershipInfo.isCouponDown"
          type="button"
          class="btn_download in_active"
        >
          <span>쿠폰 전체 다운로드 완료</span>
        </button>
      </div>
      <div
        v-if="currentTab ==='gold'"
        class="tab_content gold"
      >
        <p class="title">
          <strong class="unit">골드</strong> 등급에게 드리는 혜택
        </p>
        <p class="sub_copy">
          최근 6개월 3건 &amp; 20만원 이상 구매 고객
        </p>
        <ul class="coupon_list">
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>5,000</strong>원
            </div>
          </li>
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>5</strong>%
            </div>
          </li>
          <li>
            <div class="item tv">
              <em>TV전용쿠폰</em>
              <strong>7</strong>%
            </div>
          </li>
          <li>
            <div class="item toll_point">
              <em>등업 톨포인트</em>
              <strong>5,000</strong>톨
            </div>
          </li>
        </ul>
        <button
          v-if="membershipInfo.isGrade === 'gold' && membershipInfo.isCouponDown"
          type="button"
          class="btn_download"
          @click="downloadAll"
        >
          <span>쿠폰 전체 다운받기</span>
        </button>
        <button
          v-if="membershipInfo.isGrade === 'gold' && !membershipInfo.isCouponDown"
          type="button"
          class="btn_download in_active"
        >
          <span>쿠폰 전체 다운로드 완료</span>
        </button>
      </div>
      <div
        v-if="currentTab ==='silver'"
        class="tab_content silver"
      >
        <p class="title">
          <strong class="unit">실버</strong> 등급에게 드리는 혜택
        </p>
        <p class="sub_copy">
          최근 6개월 1건 이상 구매 고객
        </p>
        <ul class="coupon_list">
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>2,000</strong>원
            </div>
          </li>
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>3</strong>%
            </div>
          </li>
          <li>
            <div class="item tv">
              <em>TV전용쿠폰</em>
              <strong>5</strong>%
            </div>
          </li>
        </ul>
        <button
          v-if="membershipInfo.isGrade === 'silver' && membershipInfo.isCouponDown"
          type="button"
          class="btn_download"
          @click="downloadAll"
        >
          <span>쿠폰 전체 다운받기</span>
        </button>
        <button
          v-if="membershipInfo.isGrade === 'silver' && !membershipInfo.isCouponDown"
          type="button"
          class="btn_download in_active"
        >
          <span>쿠폰 전체 다운로드 완료</span>
        </button>
      </div>
      <div
        v-if="currentTab ==='family'"
        class="tab_content family"
      >
        <p class="title">
          <strong class="unit">패밀리</strong> 등급에게 드리는 혜택
        </p>
        <p class="sub_copy">
          최근 6개월 신규가입 또는 미구매 고객
        </p>
        <ul class="coupon_list">
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>2,000</strong>원
            </div>
          </li>
          <li>
            <div class="item">
              <em>할인쿠폰</em>
              <strong>2</strong>%
            </div>
          </li>
          <li>
            <div class="item tv">
              <em>TV전용쿠폰</em>
              <strong>3</strong>%
            </div>
          </li>
        </ul>
        <button
          v-if="membershipInfo.isGrade === 'family' && membershipInfo.isCouponDown"
          type="button"
          class="btn_download"
          @click="downloadAll"
        >
          <span>쿠폰 전체 다운받기</span>
        </button>
        <button
          v-if="membershipInfo.isGrade === 'family' && !membershipInfo.isCouponDown"
          type="button"
          class="btn_download in_active"
        >
          <span>쿠폰 전체 다운로드 완료</span>
        </button>
      </div>
      <div class="vip_benefit">
        <div>
          <router-link :to="{ name : 'viplounge' }" class="banner_link">
            <ns-img
              src="//image.nsmall.com/ec_comimages/nsupload/espot/images/banner/vip/bnr_vip_mobile.jpg"
              alt="NS 우수고객님을 위한 특별한 혜택 VIP 라운지"
            />
            <!-- <img src="~@/assets/images/mypage/img_vipLounge.png" alt="NS 우수고객님을 위한 특별한 혜택 VIP 라운지"> -->
          </router-link>
        </div>
        <dl
          class="txt_list"
          :class="collapseGrade ? 'active' : ''"
        >
          <dt>
            <button
              type="button"
              class="btn_collapse"
              @click="onCollapseGrade()"
            >
              <span>NS 멤버십 등급 선정 기준</span>
            </button>
          </dt>
          <dd>등급선정 : 매월 1일</dd>
          <dd>대상고객 : NS홈쇼핑 모든 고객</dd>
          <dd>
            <ul>
              <li>대상주문 : NS홈쇼핑 전체 주문</li>
              <li>모바일, 인터넷, 카카오톡주문, TV리모컨, 전화(상담사/ARS)</li>
              <li>단, 보험(금융) / 렌탈 / 상품권 / 비회원 구매 등 일부 주문 제외</li>
            </ul>
          </dd>
          <dd>
            <ul>
              <li>등급기준 : 최근 6개월 구매건수 &amp; 구매금액(결제완료)</li>
              <li>구매건수는 주문번호 기준이며, 주문 취소/반품된 주문건 제외(배송비 제외)</li>
              <li>LOVE.N 등급 고객은 다이아몬드 등급 고객 중 내부 기준에 의해 매년 2회(1월, 7월) 별도 선정됩니다.(임직원 제외)</li>
            </ul>
          </dd>
          <dd>혜택지급방법 : NS홈쇼핑 멤버십 페이지에서 직접 다운로드</dd>
          <dd>다음등급 필요조건의 경우 일별 오차에 따라 다소 상이할 수 있습니다.</dd>
        </dl>
        <dl
          class="txt_list"
          :class="collapseBenefit ? 'active' : ''"
        >
          <dt>
            <button
              type="button"
              class="btn_collapse"
              @click="onCollapseBenefit()"
            >
              <span>NS 멤버십 혜택 유의사항</span>
            </button>
          </dt>
          <dd>등급별 쿠폰은 모바일/인터넷에서 사용 가능합니다. (ARS/상담사 전화 주문 시에는 사용 불가)</dd>
          <dd>등급별 쿠폰은 사용기한 내 쿠폰당 1회 사용 가능합니다. (미사용 시 자동 소멸, 쿠폰 사용 후 취소/반품 시에는 재발행 되지 않습니다.)</dd>
          <dd>등급별 쿠폰은 일부상품(초특가, 행사상품 등)에는 적용되지 않습니다.</dd>
          <dd>무료배송 쿠폰은 배송비 최대 3천원 이하인 경우에만 사용 가능합니다.</dd>
          <dd>쿠폰은 타 사이트 경유 없이, NSmall ‘바로방문’ 시 사용 가능합니다.</dd>
          <dd>등급 업그레이드 톨포인트의 경우, 목표 등급에 승급 시 해당월에 톨포인트로 받을 수 있습니다.</dd>
          <dd>다음등급 필요조건의 경우 일별 오차에 따라 다소 상이할 수 있습니다.</dd>
          <dd>NS 멤버십 제도는 당사 사정에 따라 변경될 수 있습니다.</dd>
          <dd>부당한 방법(상업적 목적의 대량주문, 대리주문 등)으로 획득한 고객 등급은 사후 심사 후 조정될 수 있습니다.</dd>
        </dl>
      </div>
    </section>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import {
  isNull,
  insertCommas
} from '@utils/commonutil/commonUtil'
import MEMBER_CONST from '@/common/constants/customer/member'
import MEMBERSHIP_CONST from '@/common/constants/customer/memberShip'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import NsImg from '@components/common/NsImg'

export default {
  components: {
    NsImg
  },
  data () {
    return {
      currentTab: 'family',
      collapseGrade: '',
      collapseBenefit: '',
      membershipInfo: {
        userName: '',
        purchaseGrdName: '',
        isVip: false,
        isCouponDown: true,
        grdBenefit: {},
        styleAtGrade: '',
        nextGradeRule: '',
        nextGradeGuide: '',
        currentGrd: '',
        currentOrderCount: 0,
        requiredOrderCount: 0,
        currentOrderAmt: 0,
        requiredOrderAmt: 0,
        isGrade: 'family',
        standardDate: {
          startDate: '',
          endDate: ''
        }
      }
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    /**
     * 초기 설정값 세팅
     *
     * @returns {Promise}
     */
    async onLoad () {
      // 비로그인시 메세지 없이 로그인 페이지로 이동.
      if (!loginUtil.isLoggedIn()) {
        this.$router.push('/customer/login/regular-member')
      }

      // 회원명
      this.membershipInfo.userName = loginUtil.userName()

      // 초기데이터 취득
      const successHandling = response => {
        this.resultMyMembershipInfo(response)
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBERSHIP_CONST.MESSAGES.ERROR_MESSAGES.PROCEDURE_ERROR, () => {
        })
      }
      await this.$nsaxios.post('NsMembershipReal', {}, successHandling, errorHandling)
    },
    /**
     * 멤버십 초기데이터 callback함수
     *
     * @param {object} data API Response Data
     * @returns {void|boolean}
     */
    resultMyMembershipInfo (data) {
      const grdCondition = data.msg.root.GrdCondition // 다음 승급 조건
      const purchaseGrd = data.msg.root.PurchaseGrd // 나의 구매 등급 정보
      const grdBenefit = data.msg.root.GrdBenefit // 등급별 이 달의 할인 쿠폰
      this.membershipInfo.grdBenefit = grdBenefit // 등급별 이 달의 할인 쿠폰

      if (isNull(grdCondition) || isNull(purchaseGrd)) {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.PROCEDURE_ERROR, () => {
          routerUtil.back()
        })
        return false
      }

      /*
        * shhwang 고객등급통합건
        * 0) 기본기능: 등급에 따라서 아이콘, 등급명, 탭을클릭 한다.
        * 1) 간편회원일때 JSON으로 넘겨받은 등급명을 표시하는것이 아니라 '간편회원'이라고 표시함.
        * 2) 간편회원일때 JSON으로 넘겨받은 등급코드에 따라 아이콘을 표시하는것이 아니라 간편회원 전용 아이콘을 표시한다.
        * 3) AS-IS 기준 멤버십이거나 ''이 넘어올 경우 NS멤버십 혜택 탭을 family탭을 클릭한다.
      */
      const currentGrdName = purchaseGrd.currentGrdName

      if (purchaseGrd.memGubun === 'S') {
        this.membershipInfo.purchaseGrdName = '간편회원'
      }
      if (isNull(currentGrdName)) {
        this.membershipInfo.purchaseGrdName = '패밀리'
      } else {
        this.membershipInfo.purchaseGrdName = currentGrdName
      }

      /*
        * shhwang 고객등급통합건
        * 0) 기본기능: 다음 등급 만족 | 불만족 여부에 따라 표시할 문구가 각각 다르며 DIAMOND와 LOVE.NS는 예외처리한다.
        * 1) LOVE.N일때에는 무조건 'NS 멤버십 최고 등급 혜택을 누리세요' 표시
        * 2) 다이아몬드가 다음등급승급조건을 만족시키면 다음등급인 LOVE.NS로 승급이 아니라 다이아몬드를 '유지'한다고 표시해야한다.
        * 3) 간편회원은 정회원 전환 문구만 표시한다.
        * 4) + 추가 nextGradeRule에 따라서 등급상승/유지/하강이 결정되는데, 등급을 유지할경우엔 다음등급에 대한 정보를 표시하고 하강의 경우에는 현재등급을 유지하기위한 정보를 표시한다.
        */
      const nextGradeRule = purchaseGrd.nextGradeRule // 등급 상승(U)/유지(H)/하강(D)

      if (purchaseGrd.memGubun === 'K') {
        if (purchaseGrd.currentGrd === 'R12') { // LOVE.NS의 경우
          this.membershipInfo.isVip = true
        } else { // 나머지 등급
          this.membershipInfo.isGrade = MEMBERSHIP_CONST.STYLE_AT_GRADE[purchaseGrd.currentGrd || 'R10']
          this.currentTab = MEMBERSHIP_CONST.STYLE_AT_GRADE[purchaseGrd.currentGrd || 'R10']
          this.membershipInfo.nextGradeGuide = purchaseGrd.nextGrd || 'R2'
          this.membershipInfo.currentGrd = purchaseGrd.currentGrd || 'R10'
          this.membershipInfo.nextGradeRule = nextGradeRule // 승급구분 U : 승급, H : 현재등급유지, D : 현재등급하향예정

          // 최초 초기화시 쿠폰 다운로드 버튼처리
          const isActive = (grdBenefit.plusCpDownYn === 'N' || grdBenefit.liveCpDownYn === 'N' || grdBenefit.upgPointGrantYn === 'N' || grdBenefit.normalCpDownYn === 'N' || purchaseGrd.deliveryGrantYn === 'N')
          this.membershipInfo.isCouponDown = isActive
        }
      } else { // 간편회원이거나 회원구분에 값이 없는경우
        this.membershipInfo.currentGrd = 'simple'
        this.membershipInfo.isGrade = 'simple'
        this.currentTab = 'simple'
      }

      // 다음 승급 조건
      this.membershipInfo.currentOrderCount = insertCommas(grdCondition.orderCnt) // 현재 누적 주문건수
      this.membershipInfo.requiredOrderCount = insertCommas(grdCondition.requiredOrderCnt) // 다음등급까지 남은 주문건수
      this.membershipInfo.currentOrderAmt = insertCommas(grdCondition.orderAmt) // 현재 누적 주문금액
      this.membershipInfo.requiredOrderAmt = insertCommas(grdCondition.requiredOrderAmt) // 다음등급까지 남은 주문건수

      this.setStandardDate(grdCondition.standardDate) // 등급 산정기준 날짜
    },
    /**
     * shhwang
     * 최근 6개월 날짜를 뿌려준다.
     *
     * @param {String} standardDate 기준일자
     */
    setStandardDate (standardDate) {
      if (standardDate !== {} && standardDate.startDate !== '' && standardDate.endDate !== '') {
        this.membershipInfo.standardDate.startDate = standardDate.startDate
        this.membershipInfo.standardDate.endDate = standardDate.endDate
      }
    },
    /**
     * 쿠폰전체 다운로드
     *
     * @returns {Promise}
     */
    async downloadAll () {
      const successHandling = response => {
        if (response.result) {
          messageUtil.alert('멤버십 혜택 쿠폰이 발급되었습니다.')
          this.membershipInfo.isCouponDown = false // 성공시 쿠폰전체가 다운받았다고 가정하고 버튼을 비활성화 + 쿠폰다운로드 완료처리.
        } else {
          messageUtil.alert(response.resultMsg) // 실패시
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBERSHIP_CONST.MESSAGES.ERROR_MESSAGES.PROCEDURE_ERROR)
      }
      await this.$nsaxios.post('AjaxMembershipView', { cmdType: 'A1' }, successHandling, errorHandling)
    },
    /**
     * NS 멤버십 등급 선정 기준 collapse 제어
     *
     * @returns {void}
     */
    onCollapseGrade () {
      this.collapseGrade = !this.collapseGrade
    },
    /**
     * NS 멤버십 혜택 유의사항 collapse 제어
     *
     * @returns {void}
     */
    onCollapseBenefit () {
      this.collapseBenefit = !this.collapseBenefit
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/Membership";
</style>
