<template>
  <div class="mypage_main">
    <section v-if="isLoggedIn && isLoadding">
      <div class="user_if">
        <!-- 회원정보 영역 -->
        <div class="my_info">
          <a
            :class="`user ${memberInfo.gradeIcon}`"
            @click="clickMemberInfo"
          >
            <span class="user_family">
              <span :class="`name ${memberNameLengthCheck}`">{{ memberInfo.name }}</span>
            </span>
            <span
              v-if="memberInfo.memberType !== 'S'"
              class="unit"
            >
              {{ memberInfo.gradeName }}
            </span>
          </a>
          <div class="user_btn">
            <router-link
              :to="{ name: 'myMembership' }"
              class="btn_membership"
              @click.native="memberShipClick()"
            >
              멤버십
            </router-link>
            <router-link
              :to="{ name: 'mypageSetting' }"
              class="btn_setting"
              event=""
              @click.native.prevent="gotoSetting()"
            >
              설정
            </router-link>
          </div>
        </div>
        <div class="my_shopping">
          <router-link
            :to="{
              name: 'managementMyReview',
              params: {
                type: 'registered'
              }
            }"
            event=""
            @click.native.prevent="reviewClick()"
          >
            <dl>
              <dt>상품평</dt>
              <dd><strong>{{ memberInfo.reviewCnt }}</strong></dd>
            </dl>
          </router-link>
          <router-link :to="{ name : 'wishList' }" @click.native="wishListClick()">
            <dl>
              <dt>찜한상품</dt>
              <dd><strong>{{ memberInfo.wishListCnt }}</strong></dd>
            </dl>
          </router-link>
          <router-link :to="{ name : 'shoppingHistory' }" @click.native="recentPrdClick()">
            <dl>
              <dt>최근본상품</dt>
              <dd><strong>{{ memberInfo.recentPrdCnt }}</strong></dd>
            </dl>
          </router-link>
        </div>
        <!-- 혜택 영역 -->
        <div class="my_point">
          <router-link
            :to="{ name: 'mypageBenefit', params: { type: 'savings'}}"
            @click.native="saveMoneyLogging()"
          >
            <dl>
              <dt>적립금</dt>
              <dd><strong>{{ memberBenefit.savedMoney }}</strong>원</dd>
            </dl>
          </router-link>
          <router-link
            :to="{ name: 'mypageBenefit', params: { type: 'coupon'}}"
            @click.native="couponCntLogging()"
          >
            <dl>
              <dt>쿠폰</dt>
              <dd><strong>{{ memberBenefit.couponCnt }}</strong>장</dd>
            </dl>
          </router-link>
          <router-link
            :to="{ name: 'mypageBenefit', params: { type: 'toll'}}"
            @click.native="tolPoingLogging()"
          >
            <dl>
              <dt>톨포인트</dt>
              <dd><strong>{{ memberBenefit.tolPoint }}</strong>톨</dd>
            </dl>
          </router-link>
        </div>
        <div class="my_amount">
          <div v-if="memberBenefit.deposit !== '0' || memberBenefit.giftcard !== '0'" class="amount">
            <dl v-if="memberBenefit.deposit !== '0'">
              <dt>예치금</dt>
              <dd>
                <router-link
                  :to="{ name: 'mypageBenefit', params: { type: 'deposit'}}"
                  @click.native="depositLogging()"
                >
                  <strong>{{ memberBenefit.deposit }}</strong>원
                </router-link>
              </dd>
            </dl>
            <dl v-if="memberBenefit.giftcard !== '0' && memberInfo.memberType !== 'S'">
              <dt>상품권 보유 금액</dt>
              <dd>
                <router-link
                  :to="{ name: 'mypageBenefit', params: { type: 'gift-card'}}"
                  @click.native="giftcardLogging()"
                >
                  <strong>{{ memberBenefit.giftcard }}</strong>원
                </router-link>
              </dd>
            </dl>
          </div>
          <div
            v-if="memberInfo.isHarimStaff && memberInfo.memberType !== 'S'"
            :class="`staff_amount ${!memberInfo.isNSStaff || (memberBenefit.staffBalance === '0' && isNull(staffStoreNumber)) ? 'bg_none' : ''}`"
          >
            <dl v-if="memberInfo.isNSStaff && memberBenefit.staffBalance !== '0'">
              <dt>NS임직원 잔여한도</dt>
              <dd>
                <router-link
                  to=""
                >
                  <strong>{{ memberBenefit.staffBalance }}</strong>원
                </router-link>
              </dd>
            </dl>
            <div class="btn_group">
              <button type="button" class="btn_staff" @click="groupStaffLogging()">
                <span>그룹 임직원 특가</span>
              </button>
              <button v-if="memberInfo.isNSStaff && !isNull(staffStoreNumber)" type="button" class="btn_staff" @click="nsStaffLogging()">
                <span>NS 사내판매</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="isLoggedIn && isLoadding">
      <!-- 주문/배송조회 영역 -->
      <div class="order_delivery">
        <h3 class="subject"
            @click="$router.push({ name: 'mypageOrderList' })"
        >
          주문/배송조회
        </h3>
        <ul class="order_step_list">
          <li :class="`${memberOrder.receiptOrder === 0 ? '':'selected'}`"
              @click="receiptOrderClick()"
          >
            <span class="count">{{ memberOrder.receiptOrder }}</span>
            <strong>주문접수</strong>
          </li>
          <li :class="`${memberOrder.paymentCompleted === 0 ? '':'selected'}`"
              @click="paymentCompletedClick()"
          >
            <span class="count">{{ memberOrder.paymentCompleted }}</span>
            <strong>결제완료</strong>
          </li>
          <li :class="`${memberOrder.preparingProduct === 0 ? '':'selected'}`"
              @click="preparingProductClick()"
          >
            <span class="count">{{ memberOrder.preparingProduct }}</span>
            <strong>상품준비중</strong>
          </li>
          <li :class="`${memberOrder.duringDelivery === 0 ? '':'selected'}`"
              @click="duringDeliveryClick()"
          >
            <span class="count">{{ memberOrder.duringDelivery }}</span>
            <strong>배송중</strong>
          </li>
          <li :class="`${memberOrder.completedDelivery === 0 ? '':'selected'}`"
              @click="completedDeliveryClick()"
          >
            <span class="count">{{ memberOrder.completedDelivery }}</span>
            <strong>배송완료</strong>
          </li>
        </ul>
        <!-- TODO : NSMall4.0에 진행예정, UI까지만 반영하기로 함 -->
        <ul v-if="0" class="delivery_list">
          <li>
            <a href="#none">
              <figure>
                <ns-img
                  src="/images/@thumb_img250.png"
                  alt="상품이미지"
                />
              </figure>
              <div class="field">
                <p class="title">CJ대한통운</p>
                <strong class="blue">4/7(화) 도착예정</strong>
              </div>
            </a>
          </li>
          <li>
            <a href="#none">
              <figure>
                <ns-img
                  src="/images/@thumb_img250.png"
                  alt="상품이미지"
                />
              </figure>
              <div class="field">
                <p class="title">CJ대한통운</p>
                <strong class="blue">4/7(화) 도착예정</strong>
              </div>
            </a>
          </li>
          <li>
            <a href="#none">
              <figure>
                <ns-img
                  src="/images/@thumb_img250.png"
                  alt="상품이미지"
                />
              </figure>
              <div class="field">
                <p class="title">CJ대한통운</p>
                <strong class="blue">4/7(화) 도착예정</strong>
              </div>
            </a>
          </li>
        </ul>
        <!-- TODO : NSMall4.0에 진행예정, UI까지만 반영하기로 함 -->
        <button type="button" class="btn_more" style="display:none">
          <span>배송중 상품 더보기</span>
        </button>
      </div>
    </section>
    <!-- 일반 메뉴 영역 -->
    <section v-if="!isLoggedIn && isLoadding">
      <div class="user_if">
        <router-link
          class="user_login"
          :to="{ name: 'memberLogin'}"
          event=""
          @click.native.prevent="gotoLogin"
        >
          <span>{{ loginText }}</span>
        </router-link>
        <p class="copy">
          NSmall 회원만의 다양한 구매혜택을 받으세요.
        </p>
        <router-link
          class="user_join"
          :to="{ name: 'memberJoinSelect'}"
        >
          <span>{{ memberJoinText }}</span>
        </router-link>
      </div>
    </section>
    <section>
      <ul class="menu_list">
        <li><a class="icons_orderlist" @click.prevent="mypageOrderListClick()">주문목록</a></li>
        <li><a class="icons_return" @click.prevent="mypageCancelReturnExchangeListClick()">취소/반품/교환 목록</a></li>
        <li><a class="icons_written" @click.prevent="reviewInfoClick()">상품평 관리</a></li>
        <li><a class="icons_card" @click.prevent="nsPayRegisteredClick()">NS페이 관리</a></li>
        <li><a class="icons_receipt" @click.prevent="cashReceiptClick()">현금영수증 발급</a></li>
        <li><a class="icons_giftcard" @click.prevent="giftCartClick()">상품권 등록</a></li>
        <li><a class="icons_helpdesk" @click.prevent="customerServiceClick()">고객센터</a></li>
        <li><a class="icons_chat" @click.prevent="chatCounselingLogging()">채팅상담/내역</a></li>
        <li><a class="icons_qna" @click.prevent="qnaClick()">문의내역</a></li>
        <li><a class="icons_birth" @click.prevent="joinEventClick()">참여한 이벤트</a></li>
        <li>
          <router-link class="icons_noticebell" :to="{ name : 'shoppingAlarm' }" @click.native="noticebellLogging()">
            방송알림
          </router-link>
        </li>
        <li v-if="isLoggedIn">
          <a class="icons_certcompany" @click="employeeVerificationEmailClick()">그룹사 임직원 신청</a>
        </li>
        <li v-if="!isLoggedIn">
          <a class="icons_nonmember" @click="$router.push({ name: 'nonMemberLogin' })">비회원 주문조회</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import staffInfoMixin from '@/mixins/customer/staffInfoMixin'
import {
  isNull,
  isOsApp,
  getBytes
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import messageUtil from '@frameworks/messageUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import CONST from '@constants/framework/framework'

export default {
  name: 'MypageMain',
  components: {
    NsImg
  },
  mixins: [
    staffInfoMixin
  ],
  data () {
    return {
      // 회원 정보
      memberInfo: {
        name: '', // 고객 명
        memberType: '', // 로그인 타입
        isNSStaff: false, // NS 임직원 여부
        isHarimStaff: false, // 하림 그룹사 임직원 여부
        gradeName: '', // 고객 등급 명
        gradeIcon: '', // 고객 등급 아이콘
        reviewCnt: 0, // 상품평 개수
        wishListCnt: 0, // 찜한 상품 개수
        recentPrdCnt: 0 // 최근 본 상품 개수
      },
      // 혜택 정보
      memberBenefit: {
        savedMoney: '0', // 적립금
        couponCnt: 0, // 쿠폰
        tolPoint: '', // 톨포인트
        deposit: '0', // 예치금
        giftcard: '0', // 상품권
        staffBalance: '0' // NS임직원 잔여한도
      },
      // 주문/배송조회 정보
      memberOrder: {
        receiptOrder: 0, // 주문접수
        paymentCompleted: 0, // 결제완료
        preparingProduct: 0, // 상품준비중
        duringDelivery: 0, // 배송중
        completedDelivery: 0 // 배송완료
      },
      // 로그인 여부
      isLoggedIn: false,
      // 화면로드여부
      isLoadding: false,
      // NS 임직원 몰 매장번호
      staffStoreNumber: null,
      loginText: '로그인 하세요',
      memberJoinText: '회원가입'
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    nativeUtil () {
      return nativeUtil
    },
    /**
     * 회원이름이 한글 기준 7자 이상일 경우 small_size 클래스를 추가한다
     * @returns {string}
     */
    memberNameLengthCheck () {
      return getBytes(this.memberInfo.name) > 18 ? 'small_size' : ''
    }
  },
  created () {
    console.log('팝업호출입니다.')
    bizUtil.secessionMemberCheker().then(data => {
      if (data) {
        if (loginUtil.isLoggedIn()) {
          // API 호출 함수
          this.callAPI()
          // 로그인 여부를 세팅해 준다
          this.setIsLoggedIn()
          // 회원 이름을 세팅해 준다
          this.setName()
          // 최근본상품 개수를 세팅해 준다
          this.setRecentPrdCnt()
        }
        this.isLoadding = true
      }
    })
  },
  mounted () {
    // 마케팅 스크립트 적용 부분
    // GA360
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true,
        subparams: {
          t1: '마이페이지',
          t2: '메인페이지',
          t3: isNull(loginUtil.userId()) ? '비회원' : '일반회원',
          t4: ''
        }
      }
    })
  },
  methods: {
    isNull,
    /**
     *  멤버십 클릭
     */
    memberShipClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기본정보',
          eventLabel: '멤버십',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  상품평 클릭
     */
    reviewClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기본정보',
          eventLabel: '상품평',
          params: {
            t1: null
          }
        }
      })

      // 미작성 상품평이 있을 경우 상품평 작성 탭으로 이동, 없을 경우 내 상품평 탭으로 이동
      this.$router.push({
        name: 'managementMyReview',
        params: {
          type: this.memberInfo.reviewCnt > 0 ? 'unregistered' : 'registered'
        }
      })
    },
    /**
     *  찜한상품 클릭
     */
    wishListClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기본정보',
          eventLabel: '찜한상품',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  최근본상품 클릭
     */
    recentPrdClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기본정보',
          eventLabel: '최근본상품',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  적립금 클릭
     */
    saveMoneyLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '혜택',
          eventLabel: '적립금',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  쿠폰 클릭
     */
    couponCntLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '혜택',
          eventLabel: '쿠폰',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  톨포인트 클릭
     */
    tolPoingLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '혜택',
          eventLabel: '톨포인트',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  예치금 클릭
     */
    depositLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '혜택',
          eventLabel: '예치금',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  상품권보유금액 클릭
     */
    giftcardLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '혜택',
          eventLabel: '상품권보유금액',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  그룹임직원특가 클릭
     */
    groupStaffLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '임직원 인증회원',
          eventLabel: '그룹임직원특가',
          params: {
            t1: null
          }
        }
      })
      this.$router.push({
        name: 'slotStore',
        params: {
          categoryId: CONST.CATEGORY_ID_HARIM
        }
      })
    },
    /**
     *  NS사내판매클릭
     */
    nsStaffLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '임직원 인증회원',
          eventLabel: 'NS사내판매',
          params: {
            t1: null
          }
        }
      })
      if (!isNull(this.staffStoreNumber)) {
        this.$router.push({
          name: 'slotStore',
          params: {
            categoryId: this.staffStoreNumber
          }
        })
      }
    },
    /**
     *  주문접수 클릭
     */
    receiptOrderClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '주문/배송조회',
          eventLabel: '주문접수',
          params: {
            t1: null
          }
        }
      })

      this.$router.push({
        name: 'mypageOrderList',
        query: { state: 'orderReceipt' }
      })
    },
    /**
     *  결제완료 클릭
     */
    paymentCompletedClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '주문/배송조회',
          eventLabel: '결제완료',
          params: {
            t1: null
          }
        }
      })

      this.$router.push({
        name: 'mypageOrderList',
        query: { state: 'orderComplete' }
      })
    },
    /**
     *  상품준비중 클릭
     */
    preparingProductClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '주문/배송조회',
          eventLabel: '상품준비중',
          params: {
            t1: null
          }
        }
      })

      this.$router.push({
        name: 'mypageOrderList',
        query: { state: 'goodsPrepare' }
      })
    },
    /**
     *  배송중 클릭
     */
    duringDeliveryClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '주문/배송조회',
          eventLabel: '배송중',
          params: {
            t1: null
          }
        }
      })

      this.$router.push({
        name: 'mypageOrderList',
        query: { state: 'shippingPrepare' }
      })
    },
    /**
     *  배송완료 클릭
     */
    completedDeliveryClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '주문/배송조회',
          eventLabel: '배송완료',
          params: {
            t1: null
          }
        }
      })

      this.$router.push({
        name: 'mypageOrderList',
        query: { state: 'shippingComplete' }
      })
    },
    /**
     *  주문목록 클릭
     */
    mypageOrderListClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '주문/배송조회',
          eventLabel: '주문목록',
          params: {
            t1: null
          }
        }
      })

      this.$router.push({
        name: 'mypageOrderList'
      })
    },
    /**
     *  취소/반품/교환 클릭
     */
    mypageCancelReturnExchangeListClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '취소/반품/교환',
          eventLabel: '취소/반품/교환',
          params: {
            t1: null
          }
        }
      })

      this.$router.push({
        name: 'mypageCancelReturnExchangeList'
      })
    },
    /**
     *  상품평 관리 클릭
     */
    reviewInfoClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기타활동',
          eventLabel: '상품평관리',
          params: {
            t1: null
          }
        }
      })

      // 미작성 상품평이 있을 경우 상품평 작성 탭으로 이동, 없을 경우 내 상품평 탭으로 이동
      this.$router.push({
        name: 'managementMyReview',
        params: {
          type: this.memberInfo.reviewCnt > 0 ? 'unregistered' : 'registered'
        }
      })
    },
    /**
     *  NS페이관리 클릭
     */
    nsPayRegisteredClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기타활동',
          eventLabel: 'NS페이관리',
          params: {
            t1: null
          }
        }
      })
      this.$router.push({ name: 'nSPayManagement' })
    },
    /**
     * 현금영수증 발급 클릭
     */
    cashReceiptClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기타활동',
          eventLabel: '현금영수증발급',
          params: {
            t1: null
          }
        }
      })
      this.$router.push({
        name: 'cashReceipt'
      })
    },
    /**
     * 상품권등록 클릭
     */
    giftCartClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기타활동',
          eventLabel: '상품권등록',
          params: {
            t1: null
          }
        }
      })
      // 준회원 체크
      this.checkFacebookMember(() => {
        this.$router.push({
          name: 'mypageBenefit',
          params: {
            type: 'gift-card'
          }
        })
      })
    },
    /**
     * 참여한 이벤트 클릭
     */
    joinEventClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기타활동',
          eventLabel: '참여한이벤트',
          params: {
            t1: null
          }
        }
      })

      // 참여한 이벤트로 이동
      this.$router.push({ name: 'participationHistory' })
    },
    /**
     * 방송알림 클릭
     */
    noticebellLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '기타활동',
          eventLabel: '방송알림',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 그룹사 임직원신청 클릭
     */
    employeeVerificationEmailClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '고객CS',
          eventLabel: '그룹사임직원신청',
          params: {
            t1: null
          }
        }
      })
      // 준회원 체크
      this.checkFacebookMember(() => {
        this.$router.push({ name: 'employeeVerificationEmail' })
      })
    },
    /**
     * 고객센터 클릭
     */
    customerServiceClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '고객CS',
          eventLabel: '고객센터',
          params: {
            t1: null
          }
        }
      })
      this.$router.push({ name: 'custCenterMain' })
    },
    /**
     * 채팅상담/내역 클릭
     */
    chatCounselingLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '고객CS',
          eventLabel: '채팅상담',
          params: {
            t1: null
          }
        }
      })
      // 준회원 체크
      this.checkFacebookMember(() => {
        this.$router.push({ name: 'chatCounselingRequest' })
      })
    },
    /**
     * 문의내역 클릭
     */
    qnaClick () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_마이페이지',
          eventAction: '고객CS',
          eventLabel: '문의내역',
          params: {
            t1: null
          }
        }
      })
      this.$router.push({ name: 'custCenterBoardInquiry' })
    },
    /**
     * API 호출 함수
     * @returns {Promise}
     */
    callAPI () {
      // 상품평 정보 조회 API 호출
      this.getReviewInfo()

      // 마이페이지 메인 정보 조회 API 호출
      this.getMypageMainInfo()

      // 임직원 여부에 따른 조회 API 호출
      this.callChkStaff()
    },

    /**
     * 마이페이지 메인 정보 조회 API 호출
     * @returns {Promise}
     */
    getMypageMainInfo () {
      const param = {
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        // 회원 정보
        this.setMemberType(response.msg.root.GradeInfo.memberGubun)
        this.setGradeName(response.msg.root.GradeInfo.currentGrdName)
        this.setGradeIcon(response.msg.root.GradeInfo.currentGrd)
        this.setWishListCnt(response.msg.root.BenefitInfo.wishListCnt)
        // 혜택 정보
        this.setSavedMoney(response.msg.root.BenefitInfo.saveMoney)
        this.setCouponCnt(response.msg.root.BenefitInfo.couponCnt)
        this.setTolPoint(response.msg.root.BenefitInfo.tolPoint)
        this.setDeposit(response.msg.root.BenefitInfo.balance)
        this.setGiftcard(response.msg.root.BenefitInfo.giftCard)
        // 주문/배송조회 정보
        this.setOrderStatusCnt(response.msg.root.StatusCnt)
      }

      this.$nsaxios.post('MypageMainReal', param, successHandling)
    },

    /**
     * 상품평 정보 조회 API 호출
     * @returns {Promise}
     */
    getReviewInfo () {
      const param = {
        users_id: loginUtil.userId(),
        rowPerPage: 1
      }

      const successHandling = response => {
        this.setReviewCnt(response.msg.root.totalCount)
      }

      this.$nsaxios.post('NotYetReviewedListReal', param, successHandling)
    },

    /**
     * 로그인 여부를 세팅해 준다
     * @returns {void}
     */
    setIsLoggedIn () {
      this.isLoggedIn = loginUtil.isLoggedIn()
    },

    /**
     * 회원 이름을 세팅해 준다
     * @returns {void}
     */
    setName () {
      this.memberInfo.name = loginUtil.userName()
    },

    /**
     * 로그인 타입 세팅해 준다
     * K: 일반회원
     * G: 비회원
     * S: 준회원(페이스북회원)
     *
     * @param {string} data - 로그인 타입
     * @returns {void}
     */
    setMemberType (data) {
      this.memberInfo.memberType = data
    },

    /**
     * 회원 등급명을 세팅해 준다
     * @param {string} data - 회원 등급 명
     * @returns {void}
     */
    setGradeName (data) {
      this.memberInfo.gradeName = (isNull(data) ? '패밀리' : data)
    },

    /**
     * 회원 등급 아이콘 클래스를 세팅해 준다
     * (class : family, gold, silver, diamond, markloven, user facebook)
     *
     * @param {string} data - 회원 등급 코드(R12:LOVE.N, R1:다이아몬드 R13:골드, R2:실버, R10:패밀리)
     * @returns {void}
     */
    setGradeIcon (data) {
      // 준회원(페이스북회원)이면, 페이스북 아이콘 노출
      if (this.memberInfo.memberType === 'S') {
        this.memberInfo.gradeIcon = 'facebook'
      // 정회원이면, 등급별 아이콘 노출
      } else {
        switch (data) {
          case 'R12':
            this.memberInfo.gradeIcon = 'markloven'
            break
          case 'R1':
            this.memberInfo.gradeIcon = 'diamond'
            break
          case 'R13':
            this.memberInfo.gradeIcon = 'gold'
            break
          case 'R2':
            this.memberInfo.gradeIcon = 'silver'
            break
          case 'R10':
            this.memberInfo.gradeIcon = 'family'
            break
          default:
            this.memberInfo.gradeIcon = 'family'
            break
        }
      }
    },

    /**
     * 상품평 개수를 세팅해 준다
     * @param {number} data - 상품평 개수
     * @returns {void}
     */
    setReviewCnt (data) {
      this.memberInfo.reviewCnt = data
    },

    /**
     * 찜한상품 개수를 세팅해 준다
     * @param {number} data - 찜한상품 개수
     * @returns {void}
     */
    setWishListCnt (data) {
      this.memberInfo.wishListCnt = data
    },

    /**
     * 최근본상품 개수를 세팅해 준다
     * @returns {void}
     */
    setRecentPrdCnt () {
      // 최근본상품 데이터를 가져온다
      const data = bizUtil.getRecentlyViewedProducts()
      // 최근본상품이 있을경우, 개수 세팅
      if (!isNull(data)) {
        let productListLength = 0
        for (const his of data) {
          productListLength = his.hisGubun === 'P' ? ++productListLength : productListLength
        }
        this.memberInfo.recentPrdCnt = productListLength
      }
    },

    /**
     * 적립금 금액을 세팅해 준다
     * @param {string} data - 적립금 금액
     * @returns {void}
     */
    setSavedMoney (data) {
      this.memberBenefit.savedMoney = data
    },

    /**
     * 쿠폰 개수를 세팅해 준다
     * @param {number} data - 쿠폰 개수
     * @returns {void}
     */
    setCouponCnt (data) {
      this.memberBenefit.couponCnt = data
    },

    /**
     * 톨포인트를 세팅해 준다
     * @param {string} data - 톨포인트
     * @returns {void}
     */
    setTolPoint (data) {
      this.memberBenefit.tolPoint = data
    },

    /**
     * 예치금 금액을 세팅해 준다
     * @param {string} data - 예치금 금액
     * @returns {void}
     */
    setDeposit (data) {
      this.memberBenefit.deposit = data
    },

    /**
     * 상품권 보유 금액을 세팅해 준다
     * @param {string} data - 상품권 보유 금액
     * @returns {void}
     */
    setGiftcard (data) {
      this.memberBenefit.giftcard = data
    },

    /**
     * 주문상태 별 카운트를 세팅해 준다
     * @param {array} data - 주문상태
     * @returns {void}
     */
    setOrderStatusCnt (data) {
      for (let i = 0; i < data.length; i++) {
        switch (data[i].statusName) {
          case '결제대기' : // 주문접수
            this.memberOrder.receiptOrder += Number(data[i].cnt)
            break
          case '결제완료' : // 결제완료
            this.memberOrder.paymentCompleted += Number(data[i].cnt)
            break
          case '주문전달' : // 상품준비중
          case '상품준비중' : // 상품준비중
            this.memberOrder.preparingProduct += Number(data[i].cnt)
            break
          case '배송중' : // 배송중
            this.memberOrder.duringDelivery += Number(data[i].cnt)
            break
          case '배송완료' : // 배송완료
            this.memberOrder.completedDelivery += Number(data[i].cnt)
            break
          default:
            break
        }
      }
    },
    /**
     * 로그인 페이지로 이동
     * @returns {void}
     */
    gotoLogin () {
      bizUtil.gotoLogin()
    },
    /**
     * 설정 페이지로 이동
     * @returns {void}
     */
    gotoSetting () {
      this.$router.push({ name: 'mypageSetting' })
    },
    /**
     * 설정 페이지로 이동 (테스트용 삭제예정)
     * @returns {void}
     */
    gotoSettingTest () {
      if (isOsApp()) { // APP
        // nativeUtil.gotoURL('/native/naSetting?entFlag=test')
        this.$router.push({ name: 'mypageSetting' })
      } else {
        this.$router.push({ name: 'mypageSetting' })
      }
    },
    clickMemberInfo () {
      // 준회원 체크
      this.checkFacebookMember(() => {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_마이페이지',
            eventAction: '기본정보',
            eventLabel: '내정보',
            params: {
              t1: null
            }
          }
        })
        this.$router.push({ name: 'memberModifyIntro' })
      })
    },
    /**
     * 준회원(페이스북 회원) 메뉴 접근 불가 메시지 노출
     * @param {function} callback 정회원일 경우 실행할 콜백함수
     * @returns {void}
     */
    checkFacebookMember (callback) {
      // 정회원이면
      if (this.memberInfo.memberType !== 'S') {
        callback()
      // 준회원이면,
      } else {
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
        }, null, '회원가입 하기', '그냥 이용하기')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/mypage/MypageMain";
</style>
