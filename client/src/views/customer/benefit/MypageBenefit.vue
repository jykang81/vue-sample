<template>
  <div class="mypage_benefit">
    <!-- tabs -->
    <div class="tabs">
      <router-link
        v-for="(category, index) in categories"
        :key="index"
        tag="a"
        :to="category.path"
        class="tab"
        exact-active-class="active"
        replace
      >
        <span>
          {{ category.displayName }}
        </span>
      </router-link>
    </div>
    <!-- //tabs -->

    <!-- tab_content -->
    <div class="tab_content">
      <div class="data_info">
        <!-- savings || coupon || toll -->
        <template v-if="pageType === 'savings' || pageType === 'coupon' || pageType === 'toll'">
          <div class="top_box">
            <!-- 사용 가능 -->
            <dl class="usable">
              <dt>
                <!-- 타이틀 -->
                <strong>
                  <template v-if="pageType === 'savings'">
                    사용가능한 적립금
                  </template>
                  <template v-else-if="pageType === 'coupon'">
                    사용가능한 쿠폰
                  </template>
                  <template v-else-if="pageType === 'toll'">
                    사용가능한 톨포인트
                  </template>
                </strong>
                <!-- //타이틀 -->

                <!-- 적립금 안내 툴팁 -->
                <button
                  v-if="pageType === 'savings'"
                  type="button"
                  class="button_tooltip"
                  @click="savings.isShowTooltip = true"
                >
                  적립금 안내
                </button>
                <container-tooltip
                  v-if="pageType === 'savings'"
                  :show="savings.isShowTooltip"
                  @close="savings.isShowTooltip = false"
                >
                  <template #title>
                    적립금 안내
                  </template>
                  <template #content>
                    <p class="msg">
                      적립금은 이벤트에 따라 유효기간이 각각 다릅니다. 적립금을 지급받은 이벤트 페이지를 참고하세요.
                    </p>
                  </template>
                </container-tooltip>
                <!-- //적립금 안내 툴팁 -->

                <!-- 톨포인트 안내 툴팁 -->
                <button
                  v-if="pageType === 'toll'"
                  type="button"
                  class="button_tooltip"
                  @click="toll.isShowTooltip = true"
                >
                  톨포인트 안내
                </button>
                <container-tooltip
                  v-if="pageType === 'toll'"
                  :show="toll.isShowTooltip"
                  @close="toll.isShowTooltip = false"
                >
                  <template #title>
                    톨포인트 안내
                  </template>
                  <template #content>
                    <p class="msg">
                      톨포인트의 유효기간은 적립일로부터 1년입니다.
                    </p>
                  </template>
                </container-tooltip>
                <!-- //톨포인트 안내 툴팁 -->
              </dt>
              <dd>
                <strong>{{ getUsableAmount }}</strong> {{ getBenefitUnit }}
              </dd>
            </dl>
            <!-- //사용 가능 -->

            <!-- 소멸 예정 -->
            <dl class="useless">
              <dt>
                <template v-if="pageType === 'savings' || pageType === 'toll'">
                  30일 이내 소멸 예정
                </template>
                <template v-else-if="pageType === 'coupon'">
                  1일 이내 소멸 예정
                </template>
              </dt>
              <dd>
                <strong>{{ getUselessAmount }}</strong> {{ getBenefitUnit }}
              </dd>
            </dl>
            <!-- //소멸 예정 -->

            <!-- 쿠폰 등록 링크 -->
            <router-link
              v-if="pageType === 'coupon'"
              to="/event/coupon-register"
              class="coupon_register"
            >
              <span>쿠폰등록</span>
            </router-link>
            <!-- //쿠폰 등록 링크 -->
          </div>

          <!-- 멤버십 쿠폰 다운받기 -->
          <div
            v-if="pageType === 'coupon' && coupon.isMembershipShow && coupon.memGubun === 'K'"
            class="top_box"
          >
            <div class="grade_benefit">
              <!-- class : family, gold, silver, diamond, markloven -->
              <div
                class="user"
                :class="classForCurrentGrade"
              >
                <strong>{{ coupon.userName }}님,<br><span class="unit">{{ coupon.currentGrdName }}</span> 등급 혜택을 받으세요.</strong>
                <p>{{ coupon.membershipCoupon }}</p>
              </div>
              <button type="button" class="btn" @click="memberShipClick()">
                <span>멤버십 쿠폰 받기</span>
              </button>
            </div>
          </div>
          <!-- //멤버십 쿠폰 다운받기 -->
        </template>
        <!-- //savings || coupon || toll -->

        <!-- gift -->
        <template v-if="pageType==='gift'">
          <div class="top_box">
            <dl class="usable">
              <dt>
                <strong>사용가능한 금액</strong>
              </dt>
              <dd>
                <strong>{{ gift.giftCardBalance }}</strong>원
              </dd>
            </dl>
            <a
              class="coupon_register"
              @click="registerGift"
            >
              <span>상품권 등록</span>
            </a>
          </div>
          <p class="copy">
            상품권 잔액 환불 신청은<br>
            <router-link to="/custcenter/board-inquiry/inquire">
              고객센터 > 1:1문의하기
            </router-link> 를 이용해주세요.
          </p>
        </template>
        <!-- //gift -->

        <!-- deposit -->
        <template v-if="pageType==='deposit'">
          <div class="top_box">
            <dl class="usable">
              <dt>
                <strong>사용가능한 예치금</strong>
              </dt>
              <dd>
                <strong>{{ deposit.amount }}</strong>원
              </dd>
            </dl>
          </div>
          <p class="copy">
            예치금 반환 신청 접수는<br>
            <router-link to="/custcenter/board-inquiry/inquire">
              고객센터 > 1:1문의하기
            </router-link> 를 이용해주세요.
          </p>
        </template>
        <!-- //deposit -->
      </div>

      <div class="data_wrap">
        <!-- month_list -->
        <ul
          v-if="pageType !== 'coupon'"
          class="month_list"
        >
          <li
            v-if="pageType !== 'gift'"
          >
            <button
              :class="[period === 'weekly' ? 'selected' : '']"
              type="button"
              @click="setPagePeriod('weekly')"
            >
              1주일
            </button>
          </li>
          <li>
            <button
              :class="[period === '1monthly' ? 'selected' : '']"
              type="button"
              @click="setPagePeriod('1monthly')"
            >
              1개월
            </button>
          </li>
          <li>
            <button
              :class="[period === '3monthly' ? 'selected' : '']"
              type="button"
              @click="setPagePeriod('3monthly')"
            >
              3개월
            </button>
          </li>
          <li>
            <button
              :class="[period === '6monthly' ? 'selected' : '']"
              type="button"
              @click="setPagePeriod('6monthly')"
            >
              6개월
            </button>
          </li>
          <li
            v-if="pageType === 'gift'"
          >
            <button
              :class="[period === 'all' ? 'selected' : '']"
              type="button"
              @click="setPagePeriod('all')"
            >
              전체
            </button>
          </li>
        </ul>
        <!-- //month_list -->

        <!-- savings -->
        <template v-if="pageType === 'savings' && isPageLoadding">
          <ul
            v-if="savings.benefitList.length > 0"
            class="data_list"
          >
            <li
              v-for="(item, index) in savings.benefitList"
              :key="index"
            >
              <div class="date_state">
                <span class="date">{{ item.displayDate }}</span>
                <span class="state">{{ item.state }}</span>
              </div>
              <p class="title">
                {{ item.usage }}
              </p>
              <span
                v-if="item.sign === 'minus'"
                class="price minus"
              >
                <strong>- {{ item.usedAmt }}</strong>원
              </span>
              <span
                v-if="item.sign === 'plus'"
                class="price plus"
              >
                <strong>+ {{ item.usedAmt }}</strong>원
              </span>
              <p
                v-if="item.sign === 'plus' && item.expiryDate"
                class="rate"
              >
                유효기간: <span>~{{ item.expiryDate }}</span>
              </p>
            </li>
          </ul>

          <ul
            v-if="savings.benefitList.length === 0"
          >
            <li>
              <p class="nodata">
                해당 기간 적립금 적립/사용 내역이 없습니다.
              </p>
            </li>
          </ul>
        </template>
        <!-- //savings -->

        <!-- coupon -->
        <template v-if="pageType === 'coupon' && isPageLoadding">
          <ul
            v-if="coupon.benefitList.length > 0"
            class="coupon_list"
          >
            <li
              v-for="(item, index) in coupon.benefitList"
              :key="index"
            >
              <dl>
                <dt class="item">
                  <em>할인쿠폰</em>
                  <template v-if="item.rateType === 'won'">
                    <strong>{{ item.rate }}</strong>원
                  </template>
                  <template v-if="item.rateType === 'percent'">
                    <strong>{{ item.rate }}</strong>%
                  </template>
                </dt>
                <dd>
                  <p class="title">
                    {{ item.cpName }}
                  </p>
                  <p class="terms">
                    {{ item.inMediaCd }}
                  </p>
                  <p class="date_state">
                    <span
                      v-if="item.expiryDateYMD"
                      class="data"
                    >
                      ~{{ item.expiryDateYMD }}
                    </span>
                    <span class="state">{{ item.expiryDateStr }}</span>
                  </p>
                </dd>
              </dl>
            </li>
          </ul>
          <ul
            v-if="coupon.benefitList.length === 0"
          >
            <li>
              <p class="nodata">
                사용가능한 쿠폰이 없습니다.
              </p>
            </li>
          </ul>
        </template>
        <!-- //coupon -->

        <!-- toll -->
        <template v-if="pageType === 'toll' && isPageLoadding">
          <ul
            v-if="toll.benefitList.length > 0"
            class="data_list"
          >
            <li
              v-for="(item, index) in toll.benefitList"
              :key="index"
            >
              <div class="date_state">
                <span class="date">{{ item.displayDate }}</span>
                <span class="state">{{ item.state }}</span>
              </div>
              <p class="title">
                {{ item.usage }}
              </p>
              <span
                v-if="item.sign === 'minus'"
                class="price minus"
              >
                <strong>- {{ item.usedAmt }}</strong>톨
              </span>
              <span
                v-if="item.sign === 'plus'"
                class="price plus"
              >
                <strong>+ {{ item.usedAmt }}</strong>톨
              </span>
              <p
                v-if="item.sign === 'plus' && item.expiryDate"
                class="rate"
              >
                유효기간: <span>~{{ item.expiryDate }}</span>
              </p>
            </li>
          </ul>
          <ul
            v-if="toll.benefitList.length === 0"
          >
            <li>
              <p class="nodata">
                해당 기간 톨포인트 적립/사용 내역이 없습니다.
              </p>
            </li>
          </ul>
        </template>
        <!-- //toll -->

        <template v-if="pageType === 'gift' && isPageLoadding">
          <ul
            v-if="gift.benefitList.length > 0"
            class="data_list"
          >
            <li
              v-for="(item, index) in gift.benefitList"
              :key="index"
            >
              <div class="date_state">
                <span class="date">등록일 <span>{{ item.gcRegDate }}</span></span>
              </div>
              <p class="title">
                {{ item.giftCardName }}
                <span class="number">({{ item.giftCardId }})</span>
              </p>
              <span class="price plus">
                <strong>{{ item.gcBalance }}</strong>원
              </span>
              <p class="expiration_date">
                유효기간: <span>{{ item.gcStartDate }}~{{ item.gcEndDate }}</span>
              </p>
              <div
                :class="item.isCollapseUseListShow ? 'open' : ''"
                class="collapse_wrap"
              >
                <button
                  type="button"
                  class="btn_collapse"
                  :class="item.isCollapseUseListShow ? 'active' : ''"
                  @click="item.isCollapseUseListShow = !item.isCollapseUseListShow"
                >
                  <span>
                    사용내역
                    <template
                      v-if="!item.isCollapseUseListShow"
                    >
                      보기
                    </template>
                    <template
                      v-else
                    >
                      닫기
                    </template>
                  </span>
                </button>
                <div class="table">
                  <table>
                    <caption><span class="blind">사용내역 목록</span></caption>
                    <colgroup>
                      <col style="width: 30%">
                      <col>
                      <col style="width: 30%">
                    </colgroup>
                    <thead>
                      <tr>
                        <th scope="col">
                          사용일
                        </th>
                        <th scope="col">
                          사용내역
                        </th>
                        <th scope="col">
                          사용금액
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(useItem, useIndex) in item.giftUseList"
                        :key="useIndex"
                      >
                        <td>{{ useItem.gcDate }}</td>
                        <td class="subject">
                          {{ useItem.description }}
                        </td>
                        <td
                          v-if="useItem.sign === 'plus'"
                        >
                          +{{ useItem.price }}원
                        </td>
                        <td
                          v-if="useItem.sign === 'minus'"
                        >
                          -{{ useItem.price }}원
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
          </ul>
          <ul
            v-if="gift.benefitList.length === 0"
          >
            <li>
              <p class="nodata">
                해당 기간 상품권 등록/사용 내역이 없습니다.
              </p>
            </li>
          </ul>
        </template>

        <!-- deposit -->
        <template v-if="pageType === 'deposit' && isPageLoadding">
          <ul
            v-if="deposit.benefitList.length > 0"
            class="data_list"
          >
            <li
              v-for="(item, index) in deposit.benefitList"
              :key="index"
            >
              <div class="date_state">
                <span class="date">{{ item.displayDate }}</span>
              </div>
              <p class="title">
                {{ item.usage }}
              </p>
              <span
                v-if="item.sign === 'minus'"
                class="price minus"
              >
                <strong>- {{ item.usedAmt }}</strong>원
              </span>
              <span
                v-if="item.sign === 'plus'"
                class="price plus"
              >
                <strong>+ {{ item.usedAmt }}</strong>원
              </span>
            </li>
          </ul>
          <ul
            v-if="deposit.benefitList.length === 0"
          >
            <li>
              <p class="nodata">
                해당 기간 예치금 보관/사용 내역이 없습니다.
              </p>
            </li>
          </ul>
        </template>
        <!-- //deposit -->
      </div>
    </div>
    <!-- //tab_content -->
  </div>
</template>

<script>
import {
  insertCommas
} from '@utils/commonutil/commonUtil'
import uiUtil from '@utils/uiUtil'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import loginUtil from '@utils/loginUtil'
import modalUtil from '@frameworks/modalUtil'
import messageUtil from '@frameworks/messageUtil'
import ContainerTooltip from '@components/frameworks/ContainerTooltip'
import giftCardRegisterMixin from '@/mixins/customer/giftCardRegisterMixin'
import PROMOTION_CONST from '@constants/promotion/toll'
import MEMBERSHIP_CONST from '@/common/constants/customer/memberShip'
import nativeUtil from '@/common/frameworks/nativeUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import router from '@/router'
import localStorageUtil from '@/common/frameworks/localStorageUtil'

export default {
  components: {
    ContainerTooltip
  },
  mixins: [
    giftCardRegisterMixin
  ],
  data () {
    return {
      categories: [
        {
          path: '/customer/info/benefit/savings',
          displayName: '적립금'
        },
        {
          path: '/customer/info/benefit/coupon',
          displayName: '쿠폰'
        },
        {
          path: '/customer/info/benefit/toll',
          displayName: '톨포인트'
        },
        {
          path: '/customer/info/benefit/gift-card',
          displayName: '상품권'
        },
        {
          path: '/customer/info/benefit/deposit',
          displayName: '예치금'
        }
      ],
      pageType: '',
      period: 'weekly',
      pageNum: 1,
      isPageLoadding: false,
      savings: {
        pageSize: 10,
        amount: '0',
        expiredAmt: '0',
        isShowTooltip: false,
        benefitList: [],
        totalCount: 0,
        intersectionObserverObj: null
      },
      coupon: {
        pageSize: 5,
        cpCnt: '0',
        benefitList: [],
        totalCount: 0,
        intersectionObserverObj: null,
        userName: '',
        currentGrdName: '',
        isMembershipShow: false,
        membershipCoupon: '',
        memGubun: '',
        expiredCoupon: 0
      },
      toll: {
        pageSize: 10,
        amount: '0',
        expiredAmt: '0',
        isShowTooltip: false,
        benefitList: [],
        totalCount: 0,
        intersectionObserverObj: null
      },
      gift: {
        pageSize: 10,
        giftCardBalance: 0,
        benefitList: [],
        totalCount: 0,
        intersectionObserverObj: null
      },
      deposit: {
        pageSize: 10,
        amount: '0',
        expiredAmt: '0',
        benefitList: [],
        totalCount: 0,
        intersectionObserverObj: null
      }
    }
  },
  computed: {
    /**
     * 현재 등급 반환 (쿠폰 페이지 전용)
     * family, gold, silver, diamond, markloven
     * @returns {String}
     */
    classForCurrentGrade () {
      if (this.pageType === 'coupon') { // 쿠폰 페이지
        if (this.coupon.isMembershipShow && this.coupon.memGubun === 'K') {
          const currentGradeName = this.coupon.currentGrdName

          if (currentGradeName === MEMBERSHIP_CONST.GRADE_NAME.R12) {
            return MEMBERSHIP_CONST.STYLE_AT_GRADE.R12
          } else if (currentGradeName === MEMBERSHIP_CONST.GRADE_NAME.R1) {
            return MEMBERSHIP_CONST.STYLE_AT_GRADE.R1
          } else if (currentGradeName === MEMBERSHIP_CONST.GRADE_NAME.R13) {
            return MEMBERSHIP_CONST.STYLE_AT_GRADE.R13
          } else if (currentGradeName === MEMBERSHIP_CONST.GRADE_NAME.R2) {
            return MEMBERSHIP_CONST.STYLE_AT_GRADE.R2
          } else if (currentGradeName === MEMBERSHIP_CONST.GRADE_NAME.R10) {
            return MEMBERSHIP_CONST.STYLE_AT_GRADE.R10
          } else {
            return ''
          }
        } else {
          return ''
        }
      } else {
        return ''
      }
    },

    /**
     * 사용 가능한 혜택 구하기
     * @returns {Number} 사용 가능한 혜택
     */
    getUsableAmount () {
      let amount

      if (this.pageType === 'savings') {
        amount = this.savings.amount
      } else if (this.pageType === 'coupon') {
        amount = this.coupon.cpCnt
      } else if (this.pageType === 'toll') {
        amount = this.toll.amount
      }

      return amount
    },

    /**
     * 소멸 예정 혜택 구하기
     * @returns {Number} 사용 가능한 혜택
     */
    getUselessAmount () {
      let amount

      if (this.pageType === 'savings') {
        amount = this.savings.expiredAmt
      } else if (this.pageType === 'coupon') {
        amount = this.coupon.expiredCoupon
      } else if (this.pageType === 'toll') {
        amount = this.toll.expiredAmt
      }

      return amount
    },

    /**
     * 사용 가능한 혜택 단위 구하기
     * @returns {String} 사용 가능한 혜택 단위
     */
    getBenefitUnit () {
      let unit

      if (this.pageType === 'savings') {
        unit = '원'
      } else if (this.pageType === 'coupon') {
        unit = '장'
      } else if (this.pageType === 'toll') {
        unit = '톨'
      }

      return unit
    }
  },
  watch: {
    'savings.isShowTooltip' (isShowTooltip) {
      if (isShowTooltip) {
        nativeUtil.setRoutePath('/modal')
      } else {
        nativeUtil.setRoutePath(router.history.current.path)
      }
    },
    'toll.isShowTooltip' (isShowTooltip) {
      if (isShowTooltip) {
        nativeUtil.setRoutePath('/modal')
      } else {
        nativeUtil.setRoutePath(router.history.current.path)
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.setPageType()
  },
  created () {
    this.setPageType()
  },
  methods: {
    /**
     *  멤버십 쿠폰 받기 버튼 클릭
     */
    memberShipClick () {
      this.$router.push({
        name: 'myMembership'
      })
    },
    /**
     * 라우터 타입에 따라 페이지 타입 설정
     * 타입이 맞지 않는 경우 mypage 메인으로 이동
     * @returns {void}
     */
    setPageType () {
      // 적립금 : savings, 쿠폰 : coupon, 톨포인트 : toll, 상품권 : gift-card, 예치금 : deposit
      const pageTypeArr = ['savings', 'coupon', 'toll', 'gift-card', 'deposit']
      if (this.pageType !== '') {
        if (this[this.pageType].intersectionObserverObj) {
          this[this.pageType].intersectionObserverObj.disconnect()
        }
      }
      // URL 타입이 맞을 경우에만 페이지 로드
      if (pageTypeArr.includes(this.$route.params.type)) {
        this.pageType = this.$route.params.type.split('-')[0]
      } else {
        this.$router.push('/mypage')
        return false
      }

      if (this.pageType === 'gift' && loginUtil.getUserInfo('entFlag') === 'FACEBOOK') {
        messageUtil.confirm(`페이스북 로그인 회원에게는 제공하지 않는 메뉴입니다.
        회원가입 하시면 다양한 혜택과 모든 서비스를 이용하실 수 있습니다.
        적립금, 예치금 통합이 필요할 경우, 신규가입 후 고객센터(1800-0770) 으로 요청해 주세요.`,
        () => {
          const joinParams = {
            name: 'memberJoin',
            params: {
              email: loginUtil.email(),
              userName: loginUtil.userName()
            }
          }
          localStorageUtil.set('tmpFacebookMemberInfo', loginUtil.getMemberInfo())
          loginUtil.logout(joinParams)
        },
        () => {
          this.$router.replace('/customer/info/benefit/savings')
        }, '회원가입 하기', '그냥 이용하기')

        return false
      }

      // 타입 변경 시 초기화
      this.period = 'weekly'
      this.pageNum = 1

      if (this.pageType !== '') {
        this[this.pageType].benefitList = []

        if (this[this.pageType].intersectionObserverObj) {
          this[this.pageType].intersectionObserverObj.disconnect()
        }

        // 상품권 페이지는 1주일이 없어서 예외
        if (this.pageType === 'gift') {
          this.period = '1monthly'
        }

        this.isPageLoadding = false
        this.getDataByPageType()
      }
    },

    /**
     * 조회 기간 설정
     * @param {string} period
     */
    setPagePeriod (period) {
      this.period = period

      // 탭 변경 시 페이지 초기화
      this.pageNum = 1

      if (this.pageType !== '') {
        this[this.pageType].benefitList = []

        if (this[this.pageType].intersectionObserverObj) {
          this[this.pageType].intersectionObserverObj.disconnect()
        }

        this.getDataByPageType()
      }
    },

    /**
     * 페이지 타입에 따른 데이터 요청 분기
     * @returns {void|boolean}
     */
    getDataByPageType () {
      const param = {}
      let tranId = ''

      param.toDate = calcDate('', 0, 0, 0, 0, 'yyyyMMdd')
      param.fromDate = this.getFromDate()
      param.pageNum = this.pageNum
      param.pageSize = this[this.pageType].pageSize

      let menuDepth = ''
      switch (this.pageType) {
        case 'savings':
          tranId = 'MileageReal'
          menuDepth = '적립금'
          break

        case 'coupon':
          tranId = 'CpInfoReal'
          menuDepth = '쿠폰'

          delete param.toDate
          delete param.fromDate

          this.getMemberGrade()
          this.getExpiredCoupon()
          break

        case 'toll':
          tranId = 'TolPointReal'
          menuDepth = '톨포인트'
          param.schFlag = this.getSchFlag()
          break

        case 'gift':
          tranId = 'GiftCardInfoReal'
          menuDepth = '상품권'
          break

        case 'deposit':
          tranId = 'AccumulatedMoneyReal'
          menuDepth = '예치금'
          break

        default:
          return false
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '마이페이지',
            t2: '기타활동',
            t3: '나의혜택',
            t4: menuDepth
          }
        }
      })

      const successHandling = data => {
        if (data && data.msg && data.msg.root) {
          switch (this.pageType) {
            case 'savings':
              this.setSavingsTollDepositData(data)
              this.savings.totalCount = data.msg.root.common.totalCount
              break

            case 'coupon':
              this.setCouponData(data)
              this.coupon.totalCount = data.msg.root.Common.cpCnt
              break

            case 'toll':
              this.setSavingsTollDepositData(data)
              this.toll.totalCount = data.msg.root.common.totalCount
              break

            case 'gift':
              this.setGiftData(data)
              this.gift.totalCount = data.msg.root.common.totalCount
              break

            case 'deposit':
              this.setSavingsTollDepositData(data)
              this.deposit.totalCount = data.msg.root.common.totalCount
              break

            default:
              return false
          }

          // 현재 렌더링된 리스트보다 더 불러올 리스트가 있으면 인피니티 스크롤 셋
          if (this.pageNum * this[this.pageType].pageSize < this[this.pageType].totalCount) {
            this[this.pageType].intersectionObserverObj = uiUtil.setInfiniteScroll(this, {
              callback: () => {
                if (this[this.pageType].intersectionObserverObj) {
                  this[this.pageType].intersectionObserverObj.disconnect()
                  this.pageNum = this.pageNum + 1
                  this.getDataByPageType()
                }
              },
              options: {
                rootMargin: '100% 0px'
              }
            })
          }
          if (!this.isPageLoadding) {
            this.isPageLoadding = true
          }
        }
      }

      this.$nsaxios.post(tranId, param, successHandling)
    },

    /**
     * FromDate를 문자열로 리턴
     * @returns {string|boolean} fromDate
     */
    getFromDate () {
      let fromDate

      switch (this.period) {
        case 'weekly':
          fromDate = calcDate('', 0, 0, -1, 0, 'yyyyMMdd')
          break

        case '1monthly':
          fromDate = calcDate('', 0, -1, 0, 0, 'yyyyMMdd')
          break

        case '3monthly':
          fromDate = calcDate('', 0, -3, 0, 0, 'yyyyMMdd')
          break

        case '6monthly':
          fromDate = calcDate('', 0, -6, 0, 0, 'yyyyMMdd')
          break

        case 'all':
          fromDate = '20020101'
          break

        default:
          return false
      }

      return fromDate
    },

    /**
     * SchFlag 문자열로 리턴
     * @returns {string|boolean} schFlag
     */
    getSchFlag () {
      let schFlag

      switch (this.period) {
        case 'weekly':
          schFlag = PROMOTION_CONST.SCH_FLAG.FOR_A_WEEK
          break

        case '1monthly':
          schFlag = PROMOTION_CONST.SCH_FLAG.FOR_ONE_MONTHS
          break

        case '3monthly':
          schFlag = PROMOTION_CONST.SCH_FLAG.FOR_THREE_MONTHS
          break

        case '6monthly':
          schFlag = PROMOTION_CONST.SCH_FLAG.FOR_SIX_MONTHS
          break

        default:
          return false
      }

      return schFlag
    },

    /**
     * 적립금, 톨포인트, 예치금 렌더링에 필요한 데이터 세팅
     * @param {Object} data 적립금, 톨, 예치금 데이터
     */
    setSavingsTollDepositData (data) {
      const dataRoot = data.msg.root
      this[this.pageType].amount = insertCommas(dataRoot.common.amount)
      this[this.pageType].expiredAmt = insertCommas(dataRoot.common.expiredAmt)

      // 리스트가 있으면
      if (dataRoot.usageList) {
        for (let i = 0; i < dataRoot.usageList.length; i++) {
          const item = dataRoot.usageList[i]

          if (item.usedAmt !== undefined || item.usedAmt !== null) {
            item.usedAmt = Number(item.usedAmt.replace(/,/g, ''))
            item.usedAmt = insertCommas(item.usedAmt)
          }

          item.displayDate = item.useDate

          if (item.sign === 'minus') {
            if (this.pageType !== 'deposit') {
              item.state = '사용'
            }
          } else if (item.sign === 'plus') {
            if (this.pageType !== 'deposit') {
              item.state = '적립'
            }
          }
        }

        this[this.pageType].benefitList = this[this.pageType].benefitList.concat(dataRoot.usageList)
      }
    },

    /**
     * 쿠폰 렌더링에 필요한 데이터 세팅
     * @param {Object} data 쿠폰 데이터
     */
    setCouponData (data) {
      const dataRoot = data.msg.root

      this.coupon.cpCnt = insertCommas(dataRoot.Common.cpCnt)
      this.coupon.userName = loginUtil.userName()

      for (let i = 0; i < dataRoot.CpInfo.length; i++) {
        const item = dataRoot.CpInfo[i]

        if (item.rate.indexOf('%') > 0) {
          item.rateType = 'percent'
          item.rate = item.rate.replace('%', '')
        } else if (item.rate.indexOf('원') > 0) {
          item.rateType = 'won'
          item.rate = item.rate.replace('원', '')
        }

        item.expiryDateStr = item.expiryDate

        if (item.expiryDateStr !== '무제한') {
          item.expiryDateStr = `${item.expiryDateStr} 남음`
          item.expiryDateYMD = calcDate('', 0, 0, 0, parseInt(item.expiryDateStr, 10), 'yyyy.MM.dd')
        }
      }

      this.coupon.benefitList = this.coupon.benefitList.concat(dataRoot.CpInfo)
    },

    /**
     * 상품권 렌더링에 필요한 데이터 세팅
     * @param {Object} data 상품권 데이터
     */
    setGiftData (data) {
      const dataRoot = data.msg.root

      this.gift.giftCardBalance = insertCommas(dataRoot.common.giftCardBalance)

      // giftCardBalanceList가 없으면 문자열로 내려옴...
      if (Array.isArray(dataRoot.giftCardBalanceList) && dataRoot.giftCardBalanceList.length > 0) {
        for (let i = 0; i < dataRoot.giftCardBalanceList.length; i++) {
          const item = dataRoot.giftCardBalanceList[i]
          item.isCollapseUseListShow = false
        }

        if (this.pageNum === 1) {
          this.gift.benefitList = dataRoot.giftCardBalanceList
        } else {
          this.gift.benefitList = this.gift.benefitList.concat(dataRoot.giftCardBalanceList)
        }
      }

      this.$forceUpdate()
    },

    /**
     * 멤버십 등급 조회
     */
    getMemberGrade () {
      const successHandling = data => {
        if (data.msg && data.msg.root) {
          const purchaseGrd = data.msg.root.PurchaseGrd // 나의 구매 등급 정보
          const grdBenefit = data.msg.root.GrdBenefit // 등급별 이 달의 할인 쿠폰

          let isActive

          if (grdBenefit.plusCpDownYn === 'N' ||
              grdBenefit.liveCpDownYn === 'N' ||
              grdBenefit.upgPointGrantYn === 'N' ||
              grdBenefit.normalCpDownYn === 'N' ||
              purchaseGrd.deliveryGrantYn === 'N') {
            isActive = true
          } else {
            isActive = false
          }

          this.coupon.memGubun = purchaseGrd.memGubun

          if (this.coupon.memGubun === 'K') {
            switch (purchaseGrd.currentGrd) {
              case 'R12': // lovens
                this.coupon.membershipCoupon = '(5% 할인 외 쿠폰 3장)'
                break

              case 'R1': // diamond
                this.coupon.membershipCoupon = '(5% 할인 외 쿠폰 3장)'
                break

              case 'R13': // gold
                this.coupon.membershipCoupon = '(5% 할인 외 쿠폰 3장)'
                break

              case 'R2': // silver
                this.coupon.membershipCoupon = '(3% 할인 외 쿠폰 2장)'
                break

              case 'R10': // family
                this.coupon.membershipCoupon = '(2% 할인 외 쿠폰 2장)'
                break

              default: // family
                this.coupon.membershipCoupon = '(2% 할인 외 쿠폰 2장)'
                break
            }
          }

          this.coupon.currentGrdName = purchaseGrd.currentGrdName
          this.coupon.isMembershipShow = isActive
        }
      }

      this.$nsaxios.post('NsMembershipReal', {}, successHandling)
    },

    /**
     * 상품권 등록 함수
     */
    registerGift () {
      // const callback = this.giftCardRegisterMypageCallBack
      const callback = result => {
        this.getDataByPageType()
      }

      const globalVal = {
        parent: 'mypage'
      }
      const paymentData = {}

      modalUtil.show('order/sheet/OrderSheetDiscountGiftCard', { globalVal, paymentData }, callback)
    },

    /**
     * 1일 이내 소멸 예정 쿠폰
     */
    getExpiredCoupon () {
      const param = {
        userId: loginUtil.userId()
      }

      const successHandling = data => {
        if (data.msg && data.msg.isSuccess === 'S') {
          this.coupon.expiredCoupon = data.msg.couponCnt
        }
      }

      this.$nsaxios.post('NSCustExpCouponCountReal', param, successHandling)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/benefit/MypageBenefit";
</style>
