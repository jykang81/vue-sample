<template>
  <div v-if="isLoadingSuccess" class="order_delivery_tracking">
    <div class="order_list">
      <ul class="product_info">
        <li
          v-for="(catInfo, catIdx) in multiInfo.cats"
          :key="catIdx + '_0'"
        >
          <div class="box">
            <figure>
              <a @click="bizUtil.gotoProductDetail(catInfo.goodsCd, {
                popupId: popupId
              })"
              >
                <ns-img
                  :product-number="catInfo.goodsCd"
                  :width="128"
                  :height="128"
                  :alt="catInfo.catentryName"
                />
              </a>
            </figure>
            <div class="field">
              <a @click="bizUtil.gotoProductDetail(catInfo.goodsCd, {
                popupId: popupId
              })"
              >
                <p class="title">
                  {{ !isNull(htmlDecode(catInfo.brandName)) && htmlDecode(catInfo.brandName) !== '미정의' ? '[' + htmlDecode(catInfo.brandName) + ']' : '' }} {{ htmlDecode(catInfo.catentryName) }}
                </p>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p class="title_delivery">
      배송정보
    </p>
    <dl class="delivery_content">
      <dt>받는분</dt>
      <dd>{{ multiInfo.lastname }}</dd>
    </dl>
    <template v-if="!isNull(trackingInfo) && !isNull(trackingInfo.companyInfo)">
      <p class="title_delivery">
        배송상세현황
      </p>
      <dl class="delivery_content">
        <dt v-show="showDeliveryCompany" class="delivery_company">
          택배사
        </dt>
        <dd v-show="showDeliveryCompany" class="delivery_tel">
          {{ trackingInfo.companyInfo.name }}
          <a :href="`tel:${trackingInfo.companyInfo.tel}`"><i />{{ trackingInfo.companyInfo.tel }}</a>
        </dd>
        <dt>송장번호</dt>
        <dd>{{ trackingInfo.invoiceNo }}</dd>
      </dl>
    </template>
    <template v-if="showTrackingInfo">
      <table class="table_delivery">
        <caption>배송조회 테이블</caption>
        <tr>
          <th scope="col">
            일자
          </th>
          <th scope="col">
            상품위치
          </th>
          <th scope="col">
            처리현황
          </th>
        </tr>
        <tr v-for="(detailInfo, detailIdx) in trackingInfo.trackingDetails"
            :key="detailIdx + '_2'"
        >
          <td v-if="!isNull(detailInfo.timeString)">
            {{ format(getDateParse(detailInfo.timeString), 'yyyy.MM.dd hh:mm') }}
          </td>
          <td v-else>
                &nbsp;
          </td>
          <td>{{ detailInfo.where }}</td>
          <td>
            {{ detailInfo.kind }}
            <template v-if="detailIdx === 0">
              <br><span class="state">[현재상태]</span>
            </template>
          </td>
        </tr>
      </table>
    </template>
    <template v-if="showNoneTrackingInfo">
      <div class="empty_box">
        <i class="icons_empty" />
        <p class="subject">
          배송조회는 배송완료 후 최대 90일간 가능합니다.
        </p>
        <p class="msg">
          기간이 만료된 배송 관련 문의 사항은<br>택배사로 문의해주세요.
        </p>
      </div>
    </template>
    <ul class="msg_bullet_list">
      <li>배송 현황의 경우 택배사에 직접 문의하시면 보다 빠른 확인이 가능합니다.</li>
      <li class="btn_chat">
        기타 문의가 있으시다면
        <button @click="clickBoardInquiryWrite">
          1:1 문의하기
        </button>
        를 이용해 주세요.
      </li>
    </ul>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  format,
  getDateParse
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@utils/bizUtil'
import popupUtil from '@frameworks/popupUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import mypageOrderDetailService from '@services/order/detail/mypageOrderDetailService'
import orderDeliveryTrackingService from '@services/order/tracking/orderDeliveryTrackingService'

export default {
  name: 'OrderDeliveryTracking',
  components: {
    NsImg
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoadingSuccess: false, // 로그인 성공 여부
      multiInfo: {
        addressId: '',
        lastname: '',
        address1: '',
        address2: '',
        cats: [{
          goodsCd: '',
          brandName: '',
          catentryName: ''
        }]
      }, // 배송지 정보
      orders: {}, // 주문 데이터
      guestResultYn: '', // 비회원여부
      logonType: '', // 로그인 타입
      guestType: 'g', // 비회원
      intPrdYn: '', // 무형상품여부
      catsIdx: '',
      dlvrEntCd: '', // 택배사코드
      wblNum: '', // 운송장번호
      popupId: '', // 팝업창. #popup-1
      trackingInfo: null,
      showDeliveryCompany: true,
      showTrackingInfo: false,
      showNoneTrackingInfo: false
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  created () {
    this.guestResultYn = this.param.guestResultYn // 비회원 여부
    this.logonType = this.param.logonType // 로그인 타입
    this.intPrdYn = this.param.intPrdYn // 무형상품여부
    this.catsIdx = this.param.catsIdx
    this.dlvrEntCd = this.param.dlvrEntCd
    this.wblNum = this.param.wblNum

    // 마케팅 스크립트를 위한 부분 (GA 360)
    this.popupId = this.$route.hash

    this.getOrdersDetailInfo() // 주문 상세정보 조회
    this.getOrderDeliveryTracking(this.dlvrEntCd, this.wblNum) // 주문 배송정보 조회
  },
  mounted () {
  },
  methods: {
    htmlDecode,
    isNull,
    format,
    getDateParse,
    /**
     * 주문 상세정보 조회
     */
    getOrdersDetailInfo () {
      const param = {
        ordsid: this.param.ordersId,
        tidx: '', // "". 전체. 1. 일반상품 / 2. 상품권 / 3. NS정기배달 / 4. 서비스상품 /
        channel: 'mobile',
        vwtyp: !loginUtil.checkLogonStatus() ? this.guestType : '' // 비회원일 경우 g
      }

      const successHandling = data => {
        this.orders = data.msg.root.orders[0]
        this.multiInfo = {
          addressId: this.orders.cats[this.catsIdx].ship.addressId || '',
          lastname: this.orders.cats[this.catsIdx].ship.lastname || '',
          address1: this.orders.cats[this.catsIdx].ship.address1 || '',
          address2: this.orders.cats[this.catsIdx].ship.address2 || '',
          cats: [{
            goodsCd: this.orders.cats[this.catsIdx].goodsCd,
            brandName: this.orders.cats[this.catsIdx].brandName,
            catentryName: this.orders.cats[this.catsIdx].catentryName
          }]
        }
        this.isLoadingSuccess = true
      }

      mypageOrderDetailService.getOrdersDetailInfo(param, successHandling)
    },

    /**
     * 주문배송조회
     * @param {Object} dlvrEntCd - 택배사코드
     * @param {Object} wblNum - 운송장번호
     */
    async getOrderDeliveryTracking (dlvrEntCd, wblNum) {
      if (isNull(dlvrEntCd) || isNull(wblNum)) {
        return false
      }

      const response = await orderDeliveryTrackingService.fetchOrderDeliveryTrackingV1(dlvrEntCd, wblNum)

      if (!isNull(response) && !isNull(response.data)) {
        this.trackingInfo = response.data
        this.showDeliveryCompany = this.trackingInfo.companyInfo.name !== '기타 택배사' && this.trackingInfo.companyInfo.tel !== '-'
        this.showTrackingInfo = !isNull(this.trackingInfo) && !isNull(this.trackingInfo.trackingDetails) && this.trackingInfo.trackingDetails.length > 0
        this.showNoneTrackingInfo = !this.showTrackingInfo
      } else {
        this.showNoneTrackingInfo = true
      }
    },
    clickBoardInquiryWrite () {
      const param = {
        title: '1:1 문의하기',
        // titleAlign: 'center',
        isShowSearch: true,
        isShowCart: true,
        footerShow: true, // 팝업에 푸터 노출
        bottomShow: true // 팝업에 하단 탭바 노출
      }
      const callback = result => {
      }
      this.inquiryClickLogging()
      popupUtil.show('order/tracking/OrderBoardInquiryWrite', param, callback)
    },
    /**
     * 1:1 문의하기 클릭
     */
    inquiryClickLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_배송조회',
          eventAction: '1:1 문의하기',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/tracking/OrderDeliveryTracking";
</style>
