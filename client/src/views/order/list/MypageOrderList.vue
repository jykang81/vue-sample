<template>
  <div class="mypage_order_list">
    <div v-show="loginUtil.checkLogonStatus()" class="order_search">
      <div class="order_search_detail">
        <ul class="month_list">
          <li>
            <button
              type="button"
              :class="[ currentSelected === 'month1' ? 'selected' : '']"
              @click="clickSelectMonth(1)"
            >
              1개월
            </button>
          </li>
          <li>
            <button
              type="button"
              :class="[ currentSelected === 'month2' ? 'selected' : '']"
              @click="clickSelectMonth(3)"
            >
              3개월
            </button>
          </li>
          <li>
            <button
              type="button"
              :class="[ currentSelected === 'month3' ? 'selected' : '']"
              @click="clickSelectMonth(6)"
            >
              6개월
            </button>
          </li>
          <li>
            <button
              type="button"
              :class="[ currentSelected === 'month4' ? 'selected' : '']"
              @click="clickSelectMonth(0)"
            >
              기간설정
            </button>
          </li>
        </ul>
        <div
          v-if="currentSelected ==='month4'"
          class="set_option"
        >
          <div class="option">
            <div class="input_field calendar">
              <label
                for="label_date1"
                class="label_text blind"
              >
                기간
              </label>
              <span class="input_group">
                <input
                  id="label_date1"
                  v-model="inputStartDt"
                  type="text"
                  class="form text"
                  title="시작일"
                  placeholder="시작일"
                  readonly
                  @click="clickOpenStartDt()"
                >
                <span class="dash">-</span>
                <input
                  id="label_date2"
                  v-model="inputEndDt"
                  type="text"
                  class="form text"
                  title="종료일"
                  placeholder="종료일"
                  readonly
                  @click="clickOpenEndDt()"
                >
              </span>
            </div>
          </div>
          <button
            type="button"
            :class="detailSearchBtnClass"
            :disabled="isDetailSearchBtnDisabled"
            @click="clickDetailSearch()"
          >
            <span>검색</span>
          </button>
        </div>
      </div>
      <ul
        v-if="pageType !== 'cancelReturnExchange'"
        class="order_step_list"
      >
        <li :class="isSelected1" @click="clickStateCnt('1')">
          <span class="count">{{ orderReceiptCnt }}</span>
          <strong>주문접수</strong>
        </li>
        <li :class="isSelected2" @click="clickStateCnt('2')">
          <span class="count">{{ orderCompleteCnt }}</span>
          <strong>결제완료</strong>
        </li>
        <li :class="isSelected3" @click="clickStateCnt('3')">
          <span class="count">{{ goodsPrepareCnt }}</span>
          <strong>상품준비중</strong>
        </li>
        <li :class="isSelected4" @click="clickStateCnt('4')">
          <span class="count">{{ shippingPrepareCnt }}</span>
          <strong>배송중</strong>
        </li>
        <li :class="isSelected5" @click="clickStateCnt('5')">
          <span class="count">{{ shippingCompleteCnt }}</span>
          <strong>배송완료</strong>
        </li>
      </ul>
    </div>
    <ul
      v-if="orders.length > 0"
      class="product_list"
    >
      <!-- 주문리스트 -->
      <li
        v-for="(order, orderIdx) in orders"
        :key="orderIdx"
      >
        <div class="top_box">
          <p class="date">
            <strong>{{ order.timeplaced.replace(/[\.-]/g, ".") }}</strong>
            <span v-if="order.cats[0].intPrdYn === 'Y'">
              (예약번호 {{ order.ordersId }})
            </span>
            <span v-else>
              (주문번호 {{ order.ordersId }})
            </span>
          </p>
          <p class="btn">
            <a
              href="javascript:;"
              @click="onclickOrderDetailLink(order.ordersId, order.cats[0].intPrdYn)"
            >
              <span v-if="order.cats[0].intPrdYn === 'Y'">
                상담상세보기
              </span>
              <span v-else>
                주문상세보기
              </span>
            </a>
          </p>
        </div>
        <!-- 상품 리스트 -->
        <div
          v-for="(cats, catsIdx) in order.cats"
          :key="catsIdx"
        >
          <div
            v-if="isNull(searchStatus) || searchStatus === cats.status || (searchStatus === 'TI' && (cats.status === 'T' || cats.status === 'I')) || (searchStatus === 'AXBCEFUR' && searchStatus.indexOf(cats.status) > 0)"
            class="middle_box"
          >
            <div class="state_box">
              <p v-if="cats.statusName === '주문전달'" class="state">
                상품준비중
              </p>
              <p v-else class="state">
                {{ cats.statusName }}
              </p>
              <!-- class명 blue, red -->
              <p v-if="cats.statusName==='결제대기'" class="date red">
                {{ order.depLimitDttm }}
              </p>
              <p v-else-if="cats.statusName==='배송완료' || cats.statusName==='반품완료' || cats.statusName==='교환완료'" class="date blue">
                {{ calcDate(format(cats.lastUpdate, 'yyyy') + '-' + format(cats.lastUpdate, 'MM') +'-' + format(cats.lastUpdate, 'dd'), 0, 0, 0, 0, 'MM/dd') }}({{ format(calcDate(format(cats.lastUpdate, 'yyyy') + '-' + format(cats.lastUpdate, 'MM') +'-' + format(cats.lastUpdate, 'dd'), 0, 0, 0, 0, 'yyyyMMdd'), 'E') }})
              </p>
              <p v-show="loginUtil.checkLogonStatus()" class="btn_chat">
                <button
                  type="button"
                  class="btn"
                  @click="btnChatting(cats)"
                >
                  <span>채팅상담</span>
                </button>
              </p>
            </div>
            <div class="box">
              <figure>
                <a
                  href="javascript:;"
                  @click="onclickLinkProductDetail(cats.goodsCd)"
                >
                  <ns-img
                    :product-number="cats.goodsCd"
                    :width="128"
                    :height="128"
                    :alt="htmlDecode(cats.catentryName)"
                  />
                </a>
              </figure>
              <div class="field">
                <a
                  href="javascript:;"
                  @click="onclickLinkProductDetail(cats.goodsCd)"
                >
                  <p>
                    {{ htmlDecode(cats.catentryName) }}
                  </p>
                  <div>
                    <ns-price
                      :dc-price="cats.price"
                      :buschn-id="cats.busChnId"
                      :disp-type-cd="cats.dispTypeCd"
                    />
                    <p class="option">
                      {{ cats.quantity }}개 / {{ htmlDecode(attrvalDesc[orderIdx][catsIdx]) }}
                    </p>
                  </div>
                  <dl v-show="cats.giftAttr.length > 0" class="free_gift">
                    <dt>사은품</dt>
                    <dd
                      v-for="(gift, giftIdx) in cats.giftAttr"
                      :key="giftIdx"
                    >
                      <p v-if="cats.giftAttr.length === 1">
                        {{ htmlDecode(gift.giftPrdNm) }}
                      </p>
                      <p v-else>
                        {{ giftIdx + 1 }}. {{ htmlDecode(gift.giftPrdNm) }}
                      </p>
                    </dd>
                  </dl>
                </a>
                <p v-show="loginUtil.checkLogonStatus() && order.cats[0].intPrdYn !== 'Y'" class="btn_buy">
                  <button
                    type="button"
                    class="btn"
                    @click="clickAddCart(orderIdx, catsIdx)"
                  >
                    <span>장바구니 담기</span>
                  </button>
                </p>
              </div>
            </div>
            <div v-if="cats.statusName === '주문접수' || cats.statusName === '결제대기'">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickOrderCancel(orderIdx)">
                    주문취소
                  </button>
                </li>
                <li>
                  <button type="button" @click="clickChangeAddress(orderIdx, catsIdx, order.ordersId, cats.intPrdYn)">
                    배송지변경
                  </button>
                </li>
                <li>
                  <button type="button" @click="clickPayByCard(orderIdx)">
                    결제수단 변경
                  </button>
                </li>
              </ul>
            </div>
            <div v-else-if="cats.statusName === '결제완료'">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickOrderCancel(orderIdx)">
                    주문취소
                  </button>
                </li>
                <li>
                  <button type="button" @click="clickChangeAddress(orderIdx, catsIdx, order.ordersId, cats.intPrdYn)">
                    배송지변경
                  </button>
                </li>
              </ul>
            </div>
            <div v-else-if="order.preCancelYn === 'Y' && (cats.statusName === '상품준비중' || cats.statusName === '주문전달')">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickOrderCancel(orderIdx)">
                    주문취소
                  </button>
                </li>
              </ul>
            </div>
            <div v-else-if="cats.statusName === '배송중'">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickDeliveryConfirm(orderIdx, catsIdx)">
                    수취확인
                  </button>
                </li>
                <li>
                  <button type="button" @click="clickDeliveryHistory(orderIdx, catsIdx)">
                    배송조회
                  </button>
                </li>
              </ul>
            </div>
            <div v-else-if="cats.statusName === '배송완료'">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickRefundOrder(orderIdx)">
                    반품신청
                  </button>
                </li>
                <li>
                  <button type="button" @click="clickExchangeOrder()">
                    교환신청
                  </button>
                </li>
                <li>
                  <button type="button" @click="clickDeliveryHistory(orderIdx, catsIdx)">
                    배송조회
                  </button>
                </li>
              </ul>
            </div>
            <div v-else-if="cats.statusName === '취소완료'">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickOrderCancelDetail(order.ordersId)">
                    취소상세 보기
                  </button>
                </li>
              </ul>
            </div>
            <!-- 교환상세 작업 범위 아님 -->
            <!-- <div v-else-if="cats.statusName === '교환신청' || cats.statusName === '교환진행' || cats.statusName === '교환완료'">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickExchangeOrderDetail()">
                    교환상세 보기
                  </button>
                </li>
              </ul>
            </div> -->
            <div v-else-if="cats.statusName === '반품신청' || cats.statusName === '반품진행' || cats.statusName === '반품완료'">
              <ul class="btn_list">
                <li>
                  <button type="button" @click="clickRefundOrderDetail(order.ordersId)">
                    반품상세 보기
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <!-- 배송완료이면서 6개월 이내인 경우 상품평쓰기/수정 버튼 노출 -->
          <div v-if="cats.statusName === '배송완료' && checkPeriodMonth(order.timeplaced, getNowDate(), 6)">
            <!-- 상품평 작성한 경우 쓰기 아닌 수정 버튼으로 노출 -->
            <p v-show="loginUtil.checkLogonStatus()" class="btn_review">
              <button
                type="button"
                class="btn"
                @click="handleProductCommentClick(cats.commtModyYn)"
              >
                <span v-if="cats.commtModyYn === 'Y'">상품평 수정</span>
                <span v-else>상품평 작성</span>
              </button>
            </p>
          </div>
        </div>
      </li>
    </ul>
    <div
      v-if="orders.length === 0 && pageType !== 'cancelReturnExchange' && isOrdersLoad"
      class="order_empty"
    >
      <p class="guide">
        해당 기간에 주문하신 내역이 없습니다.
      </p>
    </div>
    <div
      v-if="orders.length === 0 && pageType === 'cancelReturnExchange' && isOrdersLoad"
      class="order_empty"
    >
      <p class="guide">
        해당 기간에 취소/반품/교환 내역이 없습니다.
      </p>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import loginUtil from '@utils/loginUtil'
import {
  calcDate,
  openCalendar,
  checkPeriodMonth,
  getDateParse02,
  format,
  getNowDate,
  getLastDay
} from '@frameworks/dateutil/dateUtil'
import {
  isOsApp,
  isNull,
  // getPhoneNumber,
  insertCommas,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import popupUtil from '@frameworks/popupUtil'
import uiUtil from '@utils/uiUtil'
// import toastUtil from '@frameworks/toastUtil'
import addCartMixin from '@/mixins/order/cart/addCartMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import mypageOrderListService from '@services/order/list/mypageOrderListService'
import orderPaymentMethodChangeService from '@services/order/orderPaymentMethodChangeService'

export default {
  name: 'MypageOrderList',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    addCartMixin
  ],
  data () {
    return {
      isMoveOrderList: false, // 취/교/반 목록에서 주문목록으로 이동시에 사용
      pageIdx: 1,
      collapseSearch: '',
      currentSelected: 'month1',
      status: '', // 주문상태
      startDate: '', // 조회 시작일
      endDate: '', // 조회 종료일
      periodMonth: 1, // 조회 기간
      isSelected1: '', // 주문접수 Selected
      isSelected2: '', // 결제완료 Selected
      isSelected3: '', // 상품준비중 Selected
      isSelected4: '', // 배송중 Selected
      isSelected5: '', // 배송완료 Selected
      orderReceiptCnt: '0', // 주문접수 count
      orderCompleteCnt: '0', // 결제완료 count
      goodsPrepareCnt: '0', // 상품준비중 count
      shippingPrepareCnt: '0', // 배송중 count
      shippingCompleteCnt: '0', // 배송완료 count
      orders: [], // 주문 리스트
      inputStartDt: '', // 상세검색 시작일
      inputEndDt: '', // 상세검색 종료일
      object: {
        callback: this.callMypageMainReal
      },
      isCallMypageMainRealLoding: false,
      attrvalDesc: [], // 옵션명
      detailSearchBtnClass: 'btn gray_border',
      isDetailSearchBtnDisabled: true,
      pageType: '',
      totalPage: 0,
      globalVal: {
        mInputParams: {
          invoke: {
          }
        }
      },
      orderCancelInfo: {
        result: ''
      },
      orderReturnInfo: {
        result: ''
      },
      isOrdersLoad: false,
      searchStatus: ''
    }
  },
  computed: {
    loginUtil () {
      return loginUtil
    }
  },
  watch: {
    '$route' (to) {
      let isReload = to.params.isReload

      if (this.isMoveOrderList) {
        isReload = true
        this.isMoveOrderList = false
        this.pageType = ''
        this.status = ''
      } else if (to.meta.refer === 'mypageOrderList' && to.path.includes('cancel-return-exchange')) {
        isReload = true
        this.pageType = 'cancelReturnExchange'
        this.status = 'AXBCEFUR'
      }

      if (isReload) {
        // 주문/배송조회 타이틀
        this.orders = []
        this.pageIdx = 1
        this.callMypageMainReal('CLEAR')
      }
    }
  },
  mounted () {
    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)

    // 마케팅 스크립트 적용 부분
    // GA360
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true,
        subparams: {
          t1: '마이페이지',
          t2: '주문/배송조회',
          t3: '',
          t4: ''
        }
      }
    })
  },
  created () {
    // 로그인 여부 확인
    if (!loginUtil.checkLogonStatus()) {
      if (isOsApp()) { // APP
        this.$router.replace('/customer/login/regular-member').catch(() => {})
      }
    }

    // 취/교/반 목록일 경우
    if (this.$route.path.includes('cancel-return-exchange')) {
      this.pageType = 'cancelReturnExchange'
    }

    this.startDate = calcDate('', 0, -this.periodMonth, 0, 0, 'yyyy.MM.dd')
    this.endDate = calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd')

    // 마이페이지에서 넘어온 주문상태에 따른 셋팅
    if (this.$route.query.state === 'orderReceipt') {
      // 주문접수
      this.clickStateCnt('1')
    } else if (this.$route.query.state === 'orderComplete') {
      // 결제완료
      this.clickStateCnt('2')
    } else if (this.$route.query.state === 'goodsPrepare') {
      // 상품준비중
      this.clickStateCnt('3')
    } else if (this.$route.query.state === 'shippingPrepare') {
      // 배송중
      this.clickStateCnt('4')
    } else if (this.$route.query.state === 'shippingComplete') {
      // 배송완료
      this.clickStateCnt('5')
    } else {
      // 주문/배송조회 타이틀
      this.orders = []
      this.pageIdx = 1
      this.callMypageMainReal('CLEAR')
    }
  },
  methods: {
    insertCommas,
    htmlDecode,
    calcDate,
    getDateParse02,
    format,
    checkPeriodMonth,
    getNowDate,
    isNull,
    /**
     * 주문상태 갯수 클릭 시
     * @param {String} val - 주문상태
     */
    async clickStateCnt (val) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      if (val === '1') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '주문/배송조회',
            eventLabel: '주문접수',
            params: {
              t1: null
            }
          }
        })
        this.isSelected1 = 'selected' // 주문접수 Selected
        this.isSelected2 = '' // 결제완료 Selected
        this.isSelected3 = '' // 상품준비중 Selected
        this.isSelected4 = '' // 배송중 Selected
        this.isSelected5 = '' // 배송완료 Selected

        this.status = 'D'
      } else if (val === '2') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '주문/배송조회',
            eventLabel: '결제완료',
            params: {
              t1: null
            }
          }
        })
        this.isSelected1 = '' // 주문접수 Selected
        this.isSelected2 = 'selected' // 결제완료 Selected
        this.isSelected3 = '' // 상품준비중 Selected
        this.isSelected4 = '' // 배송중 Selected
        this.isSelected5 = '' // 배송완료 Selected

        this.status = 'M'
      } else if (val === '3') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '주문/배송조회',
            eventLabel: '상품준비중',
            params: {
              t1: null
            }
          }
        })
        this.isSelected1 = '' // 주문접수 Selected
        this.isSelected2 = '' // 결제완료 Selected
        this.isSelected3 = 'selected' // 상품준비중 Selected
        this.isSelected4 = '' // 배송중 Selected
        this.isSelected5 = '' // 배송완료 Selected

        this.status = 'TI'
      } else if (val === '4') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '주문/배송조회',
            eventLabel: '배송중',
            params: {
              t1: null
            }
          }
        })
        this.isSelected1 = '' // 주문접수 Selected
        this.isSelected2 = '' // 결제완료 Selected
        this.isSelected3 = '' // 상품준비중 Selected
        this.isSelected4 = 'selected' // 배송중 Selected
        this.isSelected5 = '' // 배송완료 Selected

        this.status = 'O'
      } else if (val === '5') {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '주문/배송조회',
            eventLabel: '배송완료',
            params: {
              t1: null
            }
          }
        })
        this.isSelected1 = '' // 주문접수 Selected
        this.isSelected2 = '' // 결제완료 Selected
        this.isSelected3 = '' // 상품준비중 Selected
        this.isSelected4 = '' // 배송중 Selected
        this.isSelected5 = 'selected' // 배송완료 Selected

        this.status = 'S'
      }

      // this.orders = []
      this.pageIdx = 1
      this.callMypageMainReal('CLEAR')
    },
    /**
     * 상세검색 기간 선택 시
     * @param {Number} val - 검색기간 구분 값
     */
    clickSelectMonth (val) {
      if (val === 1) {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '기간선택',
            eventLabel: '1개월',
            params: {
              t1: null
            }
          }
        })
        this.currentSelected = 'month1'
        this.periodMonth = 1
        this.startDate = calcDate('', 0, -this.periodMonth, 0, 0, 'yyyy.MM.dd')
        this.endDate = calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd')
        this.inputStartDt = ''
        this.inputEndDt = ''

        this.orders = []
        this.pageIdx = 1
        this.callMypageMainReal('CLEAR')
      } else if (val === 3) {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '기간선택',
            eventLabel: '3개월',
            params: {
              t1: null
            }
          }
        })
        this.currentSelected = 'month2'
        this.periodMonth = 3
        this.startDate = calcDate('', 0, -this.periodMonth, 0, 0, 'yyyy.MM.dd')
        this.endDate = calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd')
        this.inputStartDt = ''
        this.inputEndDt = ''

        this.orders = []
        this.pageIdx = 1
        this.callMypageMainReal('CLEAR')
      } else if (val === 6) {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '기간선택',
            eventLabel: '6개월',
            params: {
              t1: null
            }
          }
        })
        this.currentSelected = 'month3'
        this.periodMonth = 6
        this.startDate = calcDate('', 0, -this.periodMonth, 0, 0, 'yyyy.MM.dd')
        this.endDate = calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd')
        this.inputStartDt = ''
        this.inputEndDt = ''

        this.orders = []
        this.pageIdx = 1
        this.callMypageMainReal('CLEAR')
      } else {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_주문/배송조회',
            eventAction: '기간선택',
            eventLabel: '기간설정',
            params: {
              t1: null
            }
          }
        })
        // this.startDate = ''
        // this.endDate = ''
        this.inputStartDt = ''
        this.inputEndDt = ''
        this.currentSelected = 'month4'
        this.periodMonth = 0
      }
    },
    /** *
     * 상세검색 기간설정 시작일 선택 시
     */
    clickOpenStartDt () {
      const current = calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd')
      const param = {
        // isYearUsed: true,
        // isMonthUsed: true,
        isDayUsed: false,
        startYear: calcDate('', -4, 0, 0, 0, 'yyyy'),
        endYear: calcDate('', 0, 0, 0, 0, 'yyyy'),
        setDate: `${current.substr(0, 4)}-${current.substr(5, 2)}-${current.substr(7, 2)}`
      }

      const callbackFunction = result => {
        if (result && result.dateValue !== '') {
          this.startDate = `${result.dateValue.substr(0, 4)}.${result.dateValue.substr(5, 2)}.` + '01' // 조회 시작일
          this.inputStartDt = `${result.dateValue}-01`// + calcDate('', 0, 0, 0, 0, 'dd')

          if (!isNull(this.startDate) && !isNull(this.endDate)) {
            this.detailSearchBtnClass = 'btn coral'
            this.isDetailSearchBtnDisabled = false
          } else {
            this.detailSearchBtnClass = 'btn gray_border'
            this.isDetailSearchBtnDisabled = true
          }
        }
      }

      openCalendar(param, callbackFunction)
    },
    /** *
     * 상세검색 기간설정 종료일 선택 시
     */
    clickOpenEndDt () {
      const current = calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd')
      const param = {
        // isYearUsed: true,
        // isMonthUsed: true,
        isDayUsed: false,
        startYear: calcDate('', -4, 0, 0, 0, 'yyyy'),
        endYear: calcDate('', 0, 0, 0, 0, 'yyyy'),
        setDate: `${current.substr(0, 4)}-${current.substr(5, 2)}-${current.substr(7, 2)}`
      }

      const callbackFunction = result => {
        if (result && result.dateValue !== '') {
          let lastDay = ''
          if (result.dateValue.substr(0, 4) + result.dateValue.substr(5, 2) === calcDate('', 0, 0, 0, 0, 'yyyyMM')) {
            lastDay = calcDate('', 0, 0, 0, 0, 'dd')
          } else {
            lastDay = getLastDay(result.dateValue.substr(0, 4), result.dateValue.substr(5, 2))
          }

          this.endDate = `${result.dateValue.substr(0, 4)}.${result.dateValue.substr(5, 2)}.${lastDay}` // 조회 종료일
          this.inputEndDt = `${result.dateValue}-${lastDay}`

          if (!isNull(this.startDate) && !isNull(this.endDate)) {
            this.detailSearchBtnClass = 'btn coral'
            this.isDetailSearchBtnDisabled = false
          } else {
            this.detailSearchBtnClass = 'btn gray_border'
            this.isDetailSearchBtnDisabled = true
          }
        }
      }

      openCalendar(param, callbackFunction)
    },
    /** *
     * 상세검색 검색버튼 클릭 시
     */
    async clickDetailSearch () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const startDateTag = this.$el.querySelector('#label_date1')
      const endDateTag = this.$el.querySelector('#label_date2')

      // 다른 탭을 갔다왔을 때 날짜가 갱신되지 않는 부분 재설정
      if (startDateTag && startDateTag.value !== '' && this.startDate !== startDateTag.value.replace(/-/gi, '.')) {
        this.startDate = startDateTag.value.replace(/-/gi, '.')
      }

      // 다른 탭을 갔다왔을 때 날짜가 갱신되지 않는 부분 재설정
      if (endDateTag && endDateTag.value !== '' && this.endDate !== endDateTag.value.replace(/-/gi, '.')) {
        this.endDate = endDateTag.value.replace(/-/gi, '.')
      }

      if (checkPeriodMonth(this.startDate, this.endDate, 6)) {
        this.orders = []
        this.pageIdx = 1
        this.callMypageMainReal('CLEAR')
      } else {
        messageUtil.alert('조회 기간이 6개월을 넘었습니다.\n6개월 이내로 조정해 주세요.')
      }
    },
    /**
     * 주문내역 호출
     * @param {String} mode - 주문리스트 CLEAR 여부
     */
    async callMypageMainReal (mode) {
      // 마지막 페이지일 경우 데이터 요청하지 않음
      if (this.pageIdx > this.totalPage && this.totalPage !== 0) {
        return false
      }

      if (this.isCallMypageMainRealLoding) {
        return
      }

      this.isCallMypageMainRealLoding = true

      let periodIdx = 3

      if (this.periodMonth === 1) {
        periodIdx = 3
      } else if (this.periodMonth === 3) {
        periodIdx = 4
      } else if (this.periodMonth === 6) {
        periodIdx = 5
      } else {
        periodIdx = 3
      }

      // 취/교/반 목록일 경우
      if (this.$route.path.includes('cancel-return-exchange')) {
        this.status = 'AXBCEFUR'
      }

      const param = {
        pageidx: this.pageIdx, // 페이지 Index
        rowpage: 10, // 페이징 사이즈
        tmtyp: periodIdx, // 조회기간(1. 1주일 / 2. 15일 / 3. 1개월 / 4. 3개월 / 5. 6개월)
        odt1: this.startDate, // 조회시작일
        odt2: this.endDate, // 조회종료일
        status: this.status, // 주문상태
        userId: loginUtil.userId(), // 고객번호
        midx: 'navi_11', // Menu Index (navi_11 : Default, navi_12 : 주문취소/변경, navi_13 : 교환/반품 신청, navi_14 : 입금확인/계좌관리, navi_15 : 증빙서류신청발급)
        channel: 'mobile' // 조회채널
      }

      const successHandling = data => {
        if (isNull(data.msg)) {
          this.isOrdersLoad = true
          return false
        }
        if (isNull(data.msg.root)) {
          this.isOrdersLoad = true
          return false
        }
        let goodsPrepareCnt1 = 0
        let goodsPrepareCnt2 = 0

        this.orderReceiptCnt = '0' // 주문접수 count
        this.orderCompleteCnt = '0' // 결제완료 count
        this.goodsPrepareCnt = '0' // 상품준비중 count
        this.shippingPrepareCnt = '0' // 배송중 count
        this.shippingCompleteCnt = '0' // 배송완료 count
        this.totalPage = data.msg.root.totalpage
        this.searchStatus = data.msg.root.status

        // 주문상태 표시
        if (data.msg.root.statusCnt !== null) {
          for (let i = 0; i < data.msg.root.statusCnt.length; i++) {
            const items = data.msg.root.statusCnt[i]

            switch (items.statusName) {
              case '결제대기': // 주문접수 D
                this.orderReceiptCnt = insertCommas(items.cnt) // 주문접수 count
                break
              case '결제완료': // 결제완료 M
                this.orderCompleteCnt = insertCommas(items.cnt) // 결제완료 count
                break
              case '주문전달': // 상품준비중 T
                goodsPrepareCnt1 = items.cnt
                break
              case '상품준비중': // 상품준비중 I
                goodsPrepareCnt2 = items.cnt
                break
              case '배송중': // 배송중 O
                this.shippingPrepareCnt = insertCommas(items.cnt) // 배송중 count
                break
              case '배송완료': // 배송완료 S
                this.shippingCompleteCnt = insertCommas(items.cnt) // 배송완료 count
                break
              default:
                break
            }
          }
          this.goodsPrepareCnt = insertCommas((Number(goodsPrepareCnt1) + Number(goodsPrepareCnt2)).toString()) // 상품준비중
        }

        // 주문리스트 표시
        // if (mode === 'CLEAR') {
        //   this.orders = data.msg.root.orders
        // } else {
        //   this.orders = this.orders.concat(data.msg.root.orders)
        // }
        if (this.pageIdx === 1) {
          this.orders = data.msg.root.orders
        } else {
          this.orders = this.orders.concat(data.msg.root.orders)
        }

        for (let i = 0; i < this.orders.length; i++) {
          // 취/교/반 내역일 경우 cat 필터링
          if (this.pageType === 'cancelReturnExchange') {
            this.orders[i].cats = this.orders[i].cats.filter(cat => this.status.includes(cat.status))
          }

          for (let j = 0; j < this.orders[i].cats.length; j++) {
            if (j === 0) {
              this.attrvalDesc[i] = []
            }
            for (let k = 0; k < this.orders[i].cats[j].attrs.length; k++) {
              if (k === 0) {
                this.attrvalDesc[i][j] = this.orders[i].cats[j].attrs[k].attrvalDesc
              } else {
                this.attrvalDesc[i][j] += `, ${this.orders[i].cats[j].attrs[k].attrvalDesc}`
              }
            }

            // if (this.orders[i].cats[j].statusName === '결제대기') {
            //   // 무통장입금으로 주문시 입금전 신용카드로 결제수단 변경
            //   let bOnlyPaymentcode200 = false
            //   let bFalse100300400 = false

            //   for (let z = 0; z < this.orders[i].payms.length; z++) {
            //     if (this.orders[i].payms[z].paymentcode === '200' && this.orders[i].payms[z].paySchdAmt > 0 && this.orders.payms[z].availAmt === 0) {
            //       bOnlyPaymentcode200 = true
            //     }
            //     if (this.orders[i].payms[j].paymentcode === '100' || this.orders[i].payms[j].paymentcode === '300' || this.orders[i].payms[j].paymentcode === '400') {
            //       bFalse100300400 = true
            //     }
            //   }
            //   if (!bFalse100300400 && bOnlyPaymentcode200) {
            //     this.isPayByCardShow = true
            //   }
            // }
          }
        }

        // CurrentView.totalCount = data.msg.root.totalcnt

        this.isOrdersLoad = true
        this.pageIdx++
      }

      await mypageOrderListService.clickAddCart(param, successHandling)

      this.isCallMypageMainRealLoding = false
    },
    /**
     * 주문상세 이동
     * @param {String} ordersId - 주문 index
     * @param {String} intPrdYn - 무형상품여부
     */
    async onclickOrderDetailLink (ordersId, intPrdYn) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문/배송조회',
          eventAction: '주문상세보기',
          eventLabel: '주문상세_이동',
          params: {
            t1: null
          }
        }
      })
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '마이페이지',
            t2: '주문/배송조회',
            t3: '주문상세내역',
            t4: ''
          }
        }
      })

      const param = {
        title: intPrdYn === 'Y' ? '상담신청내역' : '주문상세내역',
        // titleAlign: 'center',
        isShowSearch: true,
        isShowCart: true,
        footerShow: true, // 팝업에 푸터 노출
        bottomShow: true, // 팝업에 하단 탭바 노출
        ordersId,
        guestResultYn: 'N',
        logonType: 'normal',
        intPrdYn
      }

      const callback = result => {
        if (!isNull(result) && result.cmd === 'MypageOrderList') {
          this.isMoveOrderList = true
          this.$router.push({ name: 'mypageOrderList' })
        }
      }

      popupUtil.show('order/detail/MypageOrderDetail', param, callback)
    },
    /**
     * 채팅상담 버튼 클릭 시
     *
     * @param {object} product 채팅상담 상품정보
     */
    async btnChatting (product) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문/배송조회',
          eventAction: '주문후활동',
          eventLabel: '채팅상담',
          params: {
            t1: null
          }
        }
      })
      this.$router.push({
        name: 'chatCounselingRequest',
        params: product
      })
    },
    /**
     * 상품상세 이동
     * @param {String} partNumber - 상품코드
     */
    onclickLinkProductDetail (partNumber) {
      try {
        bizUtil.gotoProductDetail(partNumber)
      } catch (e) {
        // handle exception
        console.error(e)
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(onclickLinkProductDetail)${e}`, () => {
          routerUtil.back()
        })
      }
    },
    /**
     * 상품평 쓰기 이동
     */
    onclickProductCommentWrite () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문/배송조회',
          eventAction: '주문후활동',
          eventLabel: '상품평작성',
          params: {
            t1: null
          }
        }
      })

      this.$router.push('/product/review/management/unregistered')
      /*
      if (cats.commtModyYn === 'Y') {
        // 상품평 수정 이동
        const param = {
          // catGb: cats.dispTypeCd, // 상품 분류(식품, 의류/슈즈 등)
          // goodsName: cats.catentryName, // 상품이름
          // dan_catentry_id: item.dan_catentry_id,
          // goodgrdSeq: item.goodgrd_seq, // 상품평 시퀀스
          // orders_id: cats.ordersId, // 주문번호
          // photoYN: item.photoYN // 상품평 사진포함 여부
        }
        this.$router.push({ path: `/product/review/modify/${cats.goodsCd}`, query: param })
      } else {
        // 상품평 쓰기 이동
        const param = {
          // catGb: cats.dispTypeCd, // 상품 분류(식품, 의류/슈즈 등)
          // goodsName: cats.catentryName, // 상품이름
          // quantity: cats.quantity, // 상품 (구매했던) 수량
          // option: cats.attrs[0].attrvalDesc, // 상품 (구매했던) 옵션
          // dan_catentry_id: item.dan_catentry_id,
          // orders_id: cats.ordersId // 주문번호
        }
        this.$router.push({ path: `/product/review/write/${cats.goodsCd}`, query: param })
      }
      */
    },
    /**
     * 주문취소 버튼
     * @param {String} orderIdx - 주문 index
     */
    async clickOrderCancel (orderIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문상세내역',
          eventAction: '주문후활동',
          eventLabel: '주문취소',
          params: {
            t1: null
          }
        }
      })
      let isWpayAcct = false
      for (let i = 0; i < this.orders[orderIdx].payms.length; i++) {
        if (this.orders[orderIdx].payms[i].paymentcode === '1700') {
          isWpayAcct = true
        }
      }
      if (isWpayAcct) {
        messageUtil.alert('NS페이 계좌이체로 결제 취소시 환불은 영업일 기준 2일 이내에 처리됩니다.', () => {
          this.orderCancel(orderIdx)
        })
      } else {
        this.orderCancel(orderIdx)
      }
    },
    /**
     * 주문취소
     * @param {String} orderIdx - 주문 index
     */
    orderCancel (orderIdx) {
      // 상담사 카드주문일 때
      if (this.orders[orderIdx].hasCantTraceCardYn === 'Y') {
        // 단일 상품이 아니고
        if (this.orders[orderIdx].cats.length > 1) {
          messageUtil.alert('본 상품의 취소/반품은 상담원을 통해서 신청해 주시기 바랍니다.')
          return false
        }
        // 무통장입금이 포함되어 있을 때
        for (let i = 0; i < this.orders[orderIdx].payms.length; i++) {
          if (this.orders[orderIdx].payms[i].paymentcode === '200') {
            messageUtil.alert('본 상품의 취소/반품은 상담원을 통해서 신청해 주시기 바랍니다.')
            return false
          }
        }
      }

      const param = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
          mnm: 'checkOrderStatus',
          args: {
            ordersId: this.orders[orderIdx].ordersId
          }
        })
      }

      const successHandling = data => {
        // 상담사 Lock 여부 (DB Transaction)
        if (data.list.lockedOrderYn === 'Y') {
          messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.')
          return false
        } else if (data.list.lastupdateall !== this.orders[orderIdx].lastupdateall || data.list.latestOperationId !== this.orders[orderIdx].latestOperationId) {
          messageUtil.alert('주문 상태가 변경되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.')
          return false
        } else if (undefined !== data.list.canYn && data.list.canYn === 'N') {
          messageUtil.alert('주문취소가 불가능한 상태입니다.<br />1:1 문의 또는 고객센터(1688-0770)로 문의주시기 바랍니다.')
          return false
        }

        const invokeParams = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
            mnm: 'chkRcOrderDtlStats',
            args: {
              ordersId: this.orders[orderIdx].ordersId,
              memberId: this.orders[orderIdx].memberId
            }
          })
        }

        const successHandling = data => {
          // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
          if (data.list.respCd !== 'S') {
            messageUtil.alert('주문 상태가 변경되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.')
            return false
          }

          // 주문취소 화면 이동
          this.orderCancelInfo.result = ''
          const param = {
            title: '주문취소',
            // titleAlign: 'center',
            isShowSearch: true,
            isShowCart: true,
            footerShow: true,
            bottomShow: true,
            ordersId: this.orders[orderIdx].ordersId,
            action: 'CANCEL',
            pageData: this.orders[orderIdx],
            tabIndex: 0,
            counselor: this.orders[orderIdx].hasCantTraceCardYn, // counselor 추가 (카드면서 상담사일 경우)
            orderCancelInfo: this.orderCancelInfo
          }

          const callback = data => {
            // 성공: SUCCESS(목록 새로고침), 취소: CANCEL, 실패: FAIL
            if ((!isNull(data) && data.result === 'SUCCESS') || this.orderCancelInfo.result === 'SUCCESS') {
              this.pageIdx = 1
              this.callMypageMainReal('CLEAR')
            }
          }

          popupUtil.show('order/cancel/OrderCancel', param, callback)

          // 마케팅 스크립트 적용 부분
          // GA360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_PAGE,
            data: {
              category: '',
              initFlag: true,
              subparams: {
                t1: '마이페이지',
                t2: '주문/배송조회',
                t3: '주문상세내역',
                t4: '주문취소'
              }
            }
          })
        }

        // RC DB와 주문 상세가 다른 경우 체크 통신
        mypageOrderListService.orderCancelChkRcOrderDtlStats(invokeParams, successHandling)
      }

      // 상담원 처리 유무 체크 통신
      mypageOrderListService.orderCanceclCheckOrderStatus(param, successHandling)
    },
    /**
     * 배송지변경 버튼
     * @param {String} orderIdx - 주문 index
     */
    async clickChangeAddress (orderIdx, catsIdx, ordersId, intPrdYn) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문/배송조회',
          eventAction: '주문후활동',
          eventLabel: '배송지변경',
          params: {
            t1: null
          }
        }
      })

      for (let i = 0; i < this.orders[orderIdx].payms.length; i++) {
        if ((this.orders[orderIdx].payms[i].paymentcode === '1600' || this.orders[orderIdx].payms[i].paymentcode === '1700') && this.orders[orderIdx].payms[i].oneTouchYn === 'Y') {
          messageUtil.alert('NS페이 원터치 결제 시 배송지 변경 불가합니다. 고객센터(1800-0770)로 요청해 주세요.')
          return false
        }
      }

      const param = {
        title: intPrdYn === 'Y' ? '상담신청내역' : '주문상세내역',
        // titleAlign: 'center',
        isShowSearch: true,
        isShowCart: true,
        footerShow: true, // 팝업에 푸터 노출
        bottomShow: true, // 팝업에 하단 탭바 노출
        ordersId,
        guestResultYn: 'N',
        logonType: 'normal',
        intPrdYn
      }

      const callback = result => {
        if (!isNull(result) && result.cmd === 'MypageOrderList') {
          this.isMoveOrderList = true
          this.$router.push({ name: 'mypageOrderList' })
        }
      }

      popupUtil.show('order/detail/MypageOrderDetail', param, callback)

      /*
      for (let i = 0; i < this.orders[orderIdx].payms.length; i++) {
        if ((this.orders[orderIdx].payms[i].paymentcode === '1600' || this.orders[orderIdx].payms[i].paymentcode === '1700') && this.orders[orderIdx].payms[i].oneTouchYn === 'Y') {
          messageUtil.alert('NS페이 원터치 결제 시 배송지 변경 불가합니다. 고객센터(1800-0770)로 요청해 주세요.')
          return false
        }
      }

      // 주문변경시 주문 lock체크를 하지 않아 체크 로직 추가
      const param = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
          mnm: 'checkOrderStatus',
          args: {
            ordersId: this.orders[orderIdx].ordersId
          }
        })
      }

      const successHandling = data => {
        // 상담사 Lock 여부 (DB Transaction)
        if (data.list.lockedOrderYn === 'Y') {
          messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.')
          return false
        } else if (data.list.lastupdateall !== this.orders[orderIdx].lastupdateall || data.list.latestOperationId !== this.orders[orderIdx].latestOperationId) {
          messageUtil.alert('주문 상태가 변경되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.')
          return false
        }

        const param2 = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
            mnm: 'chkRcOrderDtlStats',
            args:
            {
              ordersId: this.orders[orderIdx].ordersId,
              memberId: loginUtil.userId()
            }
          })
        }

        const successHandling2 = data => {
          // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
          if (data.list.respCd !== 'S') {
            messageUtil.alert('주문 상태가 변경되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.')
            return false
          }

          if (loginUtil.checkLogonStatus()) {
            const globalVal = {
              deliveryInfo: '',
              mInputParams: {
                orderId: this.orders[orderIdx].ordersId,
                slctDayVal: this.orders[orderIdx].cats[catsIdx].reqEndShipDttm, // 지정배송일
                bSetCustDeliveryMsg: false
              },
              paymentData: {
                deliveryList: [{
                  ITEMS: this.orders[orderIdx].cats
                }]
              }
            }
            // 목록 조회 시 orders[orderIdx].cats에 shipcharge, rmashipcharge 빠짐..

            const callback = result => {
              if (!isNull(result)) {
                const param3 = {
                  orders_id: this.orders[orderIdx].ordersId,
                  users_id: loginUtil.userId(),
                  cust_num: loginUtil.custNum(),
                  accptPath: COMM_CONST.DEFAULT_PARAMS.accptPath,
                  deliveryModifyList: `[${JSON.stringify({
                  orgAddress_id: this.orders[orderIdx].cats[catsIdx].addressId,
                  ADDRESS_ID: result.addressID,
                  NICKNAME: result.nickname,
                  LASTNAME: result.lastname,
                  DLVY_NICNAME: result.lastname,
                  DLVY_POSTCODE1: result.zipCode,
                  DLVY_POSTCODE2: result.zipCode,
                  DLVY_ADDRESS1: result.cst_addr,
                  DLVY_ADDRESS2: result.cst_addrDetail,
                  FAX1: result.fax1,
                  ZIPCODE: result.zipCode,
                  ADDRESS1: result.cst_addr,
                  ADDRESS2: result.cst_addrDetail,
                  PHONE1TYPE: result.phone1Type,
                  PHONE2TYPE: result.phone2Type,
                  PHONE1: result.phone1,
                  PHONE2: result.phone2,
                  MOBILE_NO11: getPhoneNumber(result.phone1, '1'),
                  MOBILE_NO12: getPhoneNumber(result.phone1, '2'),
                  MOBILE_NO13: getPhoneNumber(result.phone1, '3'),
                  MOBILE_NO21: getPhoneNumber(result.phone2, '1'),
                  MOBILE_NO22: getPhoneNumber(result.phone2, '2'),
                  MOBILE_NO23: getPhoneNumber(result.phone2, '3'),
                  DLVY_MESSAGE: result.commandContext,
                  ziptype: result.fax1,
                  SEC_ZIPCODE: result.zipCode,
                  SEC_ADDRESS1: result.address2,
                  SEC_ADDRESS2: result.address3,
                  ADDINFO: ''
                })}]`,
                  slctDayVal: this.orders[orderIdx].cats[catsIdx].reqEndShipDttm // 지정배송일
                }

                const successHandling3 = data => {
                  if (undefined === data.msg) {
                    messageUtil.alert('배송지 변경을 실패하였습니다.')
                  }
                  // NSSR-28019 배송지 변경 이후 페이지 이동으로 처리(navi.moveBack()으로 할 경우 최근배송지, 배송주소록 선택 시 주문서상세 페이지로 이동하지 않음)
                  if (data.msg.result === 'success' && data.msg.resultCode === '0') {
                    this.$forceUpdate()
                    this.orders[orderIdx].cats[catsIdx].addressId = result.addressID
                    toastUtil.show('배송지가 변경되었습니다.')
                  // 배송지선택 개편 start
                  } else if (data.msg.result === 'failure' && data.msg.resultCode === '1' && data.msg.errorCode === 'M') {
                    messageUtil.alert('배송이 완료되어 주문변경 및 취소 불가능상태입니다.')
                  // 배송지선택 개편 end
                  } else {
                    messageUtil.alert('배송지 변경을 실패하였습니다.')
                  }
                }

                mypageOrderListService.changeAddress(param3, successHandling3)
              }
            }

            // 회원 배송지 변경 팝업
            popupUtil.show('order/OrderDeliveryChange', { globalVal }, callback)

            // 마케팅 스크립트 적용 부분
            // GA360
            marketingUtil.ga360Logger.send({
              type: marketingUtil.ga360Logger.LOG_PAGE,
              data: {
                category: '',
                initFlag: true,
                subparams: {
                  t1: '마이페이지',
                  t2: '주문/배송조회',
                  t3: '배송지변경',
                  t4: ''
                }
              }
            })
          } else {
            // 비회원 배송지 변경 팝업
            popupUtil.show('order/OrderDeliveryChangeGuest', {}, () => {})
          }
        }

        mypageOrderListService.changeAddressChkRcOrderDtlStats(param2, successHandling2)
      }

      mypageOrderListService.changeAddressCheckOrderStatus(param, successHandling)
      */
    },
    /**
     * 결제수단 변경 버튼
     * @param {String} orderIdx - 주문 index
     */
    async clickPayByCard (orderIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문/배송조회',
          eventAction: '주문후활동',
          eventLabel: '결제수단변경',
          params: {
            t1: null
          }
        }
      })

      const ordersId = this.orders[orderIdx].ordersId
      let inVal = {
        cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
        mnm: 'checkOrderStatus',
        args:
          {
            ordersId
          }
      }

      const invokeParams1 = {
        tasknm: 'alejandro',
        var: JSON.stringify(inVal)
      }
      const lastupdateall = this.orders[orderIdx].lastupdateall
      const latestOperationId = this.orders[orderIdx].latestOperationId

      const data1 = await orderPaymentMethodChangeService.checkOrderStatus(invokeParams1)
      if (data1.list.lockedOrderYn === 'Y') { // 상담사 Lock 여부 (DB Transaction)
        messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.', () => {})
        return false
      } else if ((String(data1.list.lastupdateall) !== String(lastupdateall) ||
                  String(data1.list.latestOperationId) !== String(latestOperationId))) { //  주문 수정일자 & 임시 처리 순번 체크 (DB Transaction)
        messageUtil.alert('주문상태가 변경 되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의주시기 바랍니다.', () => {})
        return false
      }

      inVal = {
        cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
        mnm: 'chkRcOrderDtlStats',
        args:
          {
            ordersId,
            memberId: loginUtil.userId()
          }
      }

      const invokeParams2 = {
        tasknm: 'alejandro',
        var: JSON.stringify(inVal)
      }

      const data2 = await orderPaymentMethodChangeService.chkRcOrderDtlStats(invokeParams2)
      if (data2.list.respCd !== 'S') { // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
        messageUtil.alert('주문상태가 변경 되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의주시기 바랍니다.', () => {})
        return false
      } else if (data2.list.depositInYN === 'Y') {
        messageUtil.alert('이미 무통장입금 완료된 주문 입니다.<br />주문내역으로 이동합니다.', () => {})
        return false
      } else {
        const paramPopup = {
          title: '결제수단 변경',
          titleAlign: 'center',
          isShowSearch: false,
          isShowCart: false,
          from: this.$options.name,
          ordersId: this.orders[orderIdx].ordersId,
          lastupdateall: this.orders[orderIdx].lastupdateall,
          latestOperationId: this.orders[orderIdx].latestOperationId
        }

        popupUtil.show('order/OrderPaymentMethodChange', paramPopup)
      }
    },
    /**
     * 수취확인 버튼
     * @param {String} orderIdx - 주문 index
     * @param {String} catsIdx - 상품 index
     */
    async clickDeliveryConfirm (orderIdx, catsIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      messageUtil.confirm('상품을 실제로 수령하신 경우 수취확인을 통해 배송완료 상태로 직접 접수하실 수 있습니다.<br /><br />배송완료로 변경된 후에는 수정되지 않습니다. 이상품을 수취확인 하시겠습니까?', () => {
        const param = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.helper.NSMypageCommJDBCHelper',
            mnm: 'setConfirmReceipt',
            args: {
              ordersId: this.orders[orderIdx].ordersId,
              addressId: this.orders[orderIdx].cats[catsIdx].addressId,
              catentryId: this.orders[orderIdx].cats[catsIdx].catentryId,
              status: this.orders[orderIdx].cats[catsIdx].status
            }
          })
        }

        const successHandling = data => {
          if (!data.list || data.list.respCd !== 'S') {
            messageUtil.alert('수취확인이 실패하였습니다.')
          } else {
            messageUtil.confirm('상품평을 바로 작성하시겠습니까?', () => {
              if (this.orders[orderIdx].cats[catsIdx].commentWriteYn !== 'Y') {
                messageUtil.alert('상품평 작성 기한이 지났습니다.')
                return false
              }

              this.onclickProductCommentWrite()
            }, () => {})
          }
        }

        mypageOrderListService.clickDeliveryConfirm(param, successHandling)
      }, () => {}, '수취확인')
    },
    /**
     * 배송조회 버튼
     * @param {String} orderIdx - 주문 index
     * @param {String} catsIdx - 상품 index
     */
    async clickDeliveryHistory (orderIdx, catsIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // msg -> root -> orders[i] -> cats[catsIdx]
      // dlvrEntCd(택배사코드) / wblNum(운송장번호)
      const param = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.helper.NSMypageCommJDBCHelper',
          mnm: 'getShipInfo',
          args: {
            ordersId: this.orders[orderIdx].ordersId,
            orderitemsId: this.orders[orderIdx].cats[catsIdx].orderitemsId,
            addressId: this.orders[orderIdx].cats[catsIdx].addressId,
            catentryId: this.orders[orderIdx].cats[catsIdx].catentryId,
            status: this.orders[orderIdx].cats[catsIdx].status
          }
        })
      }

      const successHandling = data => {
        if (data && data.list && data.list.url) {
          if (isNull(data.list.dlvrEntCd)) {
            window.open(data.list.url)
          } else {
            // 배송조회 팝업 호출
            const param = {
              title: '배송조회',
              // titleAlign: 'center',
              isShowSearch: true,
              isShowCart: true,
              footerShow: true, // 팝업에 푸터 노출
              bottomShow: true, // 팝업에 하단 탭바 노출
              ordersId: this.orders[orderIdx].ordersId,
              guestResultYn: 'N',
              logonType: 'normal',
              intPrdYn: this.orders[orderIdx].cats[catsIdx].intPrdYn,
              dlvrEntCd: this.orders[orderIdx].cats[catsIdx].dlvrEntCd, // 택배사코드
              wblNum: this.orders[orderIdx].cats[catsIdx].wblNum, // 운송장번호
              catsIdx
            }

            const callback = result => {
            }

            popupUtil.show('order/tracking/OrderDeliveryTracking', param, callback)
          }
        } else {
          messageUtil.alert('배송정보가 존재하지 않습니다.')
        }
      }

      mypageOrderListService.clickDeliveryHistory(param, successHandling)
    },
    /**
     * 반품신청 버튼
     */
    async clickRefundOrder (orderIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 반품불가 상품 체크 -> 불가상품이면 alert 띄움
      // (1.단일주문(1개상품코드,1개단품코드) 외, 2. 복합결제)
      if (!(this.orders[orderIdx].payms.length === 1 && this.orders[orderIdx].cats.length === 1)) {
        // 임시 처리 - 반품신청 불가 상품은 무조건 막는다
        messageUtil.confirm('신청하신 상품의 반품은 고객센터(1800-0770)를 통해 요청 가능합니다.<br><br><b>고객센터로 전화연결을 하시겠습니까?</b><br>NSmall 상담시간(평일) : 09:00~18:00',
          () => {
            document.location.href = 'tel:1800-0770'
          },
          null,
          '전화연결',
          '취소'
        )
        return false
      }

      const param = {
        tasknm: 'checkRefundItem',
        var: this.orders[orderIdx].ordersId
      }

      const successHandling = data => {
        if (data.list.resultCd === 'Y') {
          // 반품신청화면 이동
          this.orderReturnInfo.result = ''
          const param = {
            title: '반품신청',
            // titleAlign: 'center',
            isShowSearch: true,
            isShowCart: true,
            footerShow: true,
            bottomShow: true,
            ordersId: this.orders[orderIdx].ordersId,
            action: 'RETURN',
            objOrder: this.orders[orderIdx],
            objCats: this.orders[orderIdx].cats[0],
            tabIndex: 0,
            orderReturnInfo: this.orderReturnInfo
          }

          const callback = data => {
            // 성공: SUCCESS(목록 새로고침), 취소: CANCEL, 실패: FAIL
            if ((!isNull(data) && data.result === 'SUCCESS') || this.orderReturnInfo.result === 'SUCCESS') {
              this.pageIdx = 1
              this.callMypageMainReal('CLEAR')
            }
          }
          popupUtil.show('order/return/OrderReturn', param, callback)

          // 마케팅 스크립트 적용 부분
          // GA360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_PAGE,
            data: {
              category: '',
              initFlag: true,
              subparams: {
                t1: '마이페이지',
                t2: '취소/반품',
                t3: '반품신청',
                t4: ''
              }
            }
          })
        } else {
          messageUtil.confirm('신청하신 상품의 반품은 고객센터(1800-0770)를 통해 요청 가능합니다.<br><br><b>고객센터로 전화연결을 하시겠습니까?</b><br>NSmall 상담시간(평일) : 09:00~18:00',
            () => {
              document.location.href = 'tel:1800-0770'
            },
            null,
            '전화연결',
            '취소'
          )
        }
      }

      mypageOrderListService.clickRefundOrder(param, successHandling)
    },

    /**
     * 교환신청 버튼
     */
    async clickExchangeOrder () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문/배송조회',
          eventAction: '주문후활동',
          eventLabel: '교환신청',
          params: {
            t1: null
          }
        }
      })

      messageUtil.confirm('신청하신 상품의 교환은 고객센터(1800-0770)를 통해 요청 가능합니다.<br><br><b>고객센터로 전화연결을 하시겠습니까?</b><br>NSmall 상담시간(평일) : 09:00~18:00',
        () => {
          document.location.href = 'tel:1800-0770'
        },
        null,
        '전화연결',
        '취소'
      )
    },
    /**
     * 취소상세 보기 버튼
     */
    async clickOrderCancelDetail (ordersId) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문상세내역',
          eventAction: '주문후활동',
          eventLabel: '취소상세보기',
          params: {
            t1: null
          }
        }
      })
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '마이페이지',
            t2: '취소/반품',
            t3: '취소상세내역',
            t4: ''
          }
        }
      })

      const param = {
        title: '취소상세내역',
        isShowSearch: true,
        isShowCart: true,
        ordersId,
        footerShow: true,
        bottomShow: true
      }

      const callback = result => {
        if (!isNull(result) && result.cmd === 'MypageOrderList') {
          this.isMoveOrderList = true
          this.$router.push({ name: 'mypageOrderList' })
        }
      }

      popupUtil.show('order/cancel/OrderCancelDetailStatement', param, callback)
    },
    /**
     * 교환상세 보기 버튼
     * 3차 작업 범위 아님
     */
    // clickExchangeOrderDetail () {
    //   // 추후 구현
    //   messageUtil.alert('교환상세 보기 버튼 추후 구현')
    // },
    /**
     * 반품상세 보기 버튼
     */
    async clickRefundOrderDetail (ordersId) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
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
            t2: '취소/반품',
            t3: '반품상세내역',
            t4: ''
          }
        }
      })

      const param = {
        title: '반품상세내역',
        isShowSearch: true,
        isShowCart: true,
        ordersId,
        footerShow: true,
        bottomShow: true
      }

      const callback = result => {
        if (!isNull(result) && result.cmd === 'MypageOrderList') {
          this.isMoveOrderList = true
          this.$router.push({ name: 'mypageOrderList' })
        }
      }

      popupUtil.show('order/return/OrderReturnDetailStatement', param, callback)
    },
    /** *
     * 장바구니 담기 버튼
     * @param {String} orderIdx - 주문 index
     * @param {String} catsIdx - 상품 index
     */
    async clickAddCart (orderIdx, catsIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      if (this.orders[orderIdx].cats[catsIdx].giftAttr.length > 0) {
        messageUtil.confirm('상품정보가 변경되어 장바구니에 담을 수 없습니다.<br>상품상세로 이동하시겠습니까?', () => {
          bizUtil.gotoProductDetail(this.orders[orderIdx].cats[catsIdx].goodsCd)
        }, () => {}, '확인', '취소')

        return false
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문/배송조회',
          eventAction: '주문후활동',
          eventLabel: '장바구니담기',
          params: {
            t1: null
          }
        }
      })
      const catalogId = COMM_CONST.getDefaultCatalogId()

      this.globalVal.mInputParams.invoke = {
        preParam: {
          extCatalogId_1: catalogId
        }
      }

      this.addCartItems = []
      this.addCartItems.push({
        DISP_TYPE_CD: this.orders[orderIdx].cats[catsIdx].dispTypeCd,
        QUANTITY: '1', // this.orders[orderIdx].cats[catsIdx].quantity === '0' ? '1' : this.orders[orderIdx].cats[catsIdx].quantity, // 장바구니 증가 수량 1개씩
        CATENTRY_ID: this.orders[orderIdx].cats[catsIdx].catentryId,
        busChnId: this.orders[orderIdx].cats[catsIdx].busChnId,
        goodsCd: this.orders[orderIdx].cats[catsIdx].goodsCd
      })
      // 사은품 valueId 추가 되어야함

      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
          params: [
            {
              id: String(this.orders[orderIdx].cats[catsIdx].goodsCd),
              name: this.orders[orderIdx].cats[catsIdx].catentryName,
              brand: this.orders[orderIdx].cats[catsIdx].brandName
            }
          ],
          subparams: {
            t1: '주문/배송조회',
            t2: '장바구니담기',
            t3: this.orders[orderIdx].cats[catsIdx].catentryName
          }
        }
      })

      this.isCartFlg = true
      this.addCart()
    },
    /**
     * 무한 스크롤용 객체 초기화
     */
    initParamObject () {
      this.isCallMypageMainRealLoding = false

      this.object.callback = this.callMypageMainReal
      this.object.isEnable = true
      this.object.interval = 500
      // this.object.eventTarget = this.$refs.target
      this.object.triggerHeightPercent = 90
    },
    /**
     * 상품평 버튼 영역 클릭 후처리
     * @param {String} canModifyComment 상품평 수정 가능여부 'Y' | 'N'
     */
    async handleProductCommentClick (canModifyComment) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      if (canModifyComment === 'Y') {
        this.$router.push('/product/review/management/registered')
      } else {
        this.onclickProductCommentWrite()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/list/MypageOrderList";
</style>
