<template>
  <section class="select_product_layer active">
    <div
      class="dimmed_all"
      @click="$emit('close-select-product')"
    />
    <div class="layer_inner">
      <div class="title_wrap">
        <h3 class="title">
          상담하실 상품을 선택하세요
        </h3>
        <button
          type="button"
          class="btn_cancel"
          @click="$emit('close-select-product')"
        >
          <span>취소</span>
        </button>
      </div>
      <ul class="product_list">
        <template v-if="orderList.length">
          <li v-for="(order, orderIndex) in orderList" :key="orderIndex">
            <strong class="subject">
              {{ order.ordersDate }}<span class="order_number">(주문번호 {{ order.ordersId }})</span>
            </strong>
            <div v-for="(product, productIndex) in order.productList" :key="productIndex" class="item">
              <p class="state">
                {{ product.statusName }}
              </p>
              <div class="row">
                <figure>
                  <ns-img
                    :product-number="product.goodsCd"
                    :width="144"
                    :height="144"
                    :alt="product.goodsName"
                  />
                </figure>
                <div class="price_title">
                  <p class="title">
                    {{ product.goodsName }}
                  </p>
                  <ns-price
                    :dc-price="product.totalPrice"
                    :buschn-id="product.buschnId"
                    :disp-type-cd="product.dispTypeCd"
                  />
                  <p class="option">
                    {{ product.quantity }}개 / {{ product.options }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="btn_select"
                @click="$emit('select-product', product)"
              >
                <span>선택</span>
              </button>
            </div>
          </li>
        </template>
        <li v-if="isAPIcalled && orderList.length === 0">
          <p class="nodata">
            해당 기간에 주문하신 내역이 없습니다.
          </p>
        </li>
        <li ref="io_target" /><!-- 무한 스크롤 교차 영역 대상 Element -->
      </ul>
    </div>
  </section>
</template>

<script>
import {
  isNull,
  htmlDecode,
  insertCommas
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import uiUtil from '@utils/uiUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'

export default {
  name: 'SelectProductLayer',
  components: {
    NsImg,
    NsPrice
  },
  data () {
    return {
      pageDataset: [], // 주문 목록 원본 데이터
      isAPIcalled: false, // 주문 목록 조회 API가 호출됐는지 여부
      isAPIcalling: false, // 주문 목록 조회 API가 호출 중인지 여부
      pageIdx: 1, // 페이지 번호
      rowpage: 5, // 페이지당 노출 주문 수
      monthly: 6, // 조회 개월 수 (6개월)
      intersectionObserverObj: null // 스크롤 시 요소 감지를 위한 IntersectionObserver 객체
    }
  },
  computed: {
    /**
     * 주문 목록
     *
     * @returns {object} 주문 목록
     */
    orderList () {
      return this.pageDataset.map(order => {
        const productList = order.cats.map(item => {
          const brandName = item.brandName
          const brand = !isNull(brandName) && brandName !== '미정의' ? `[${brandName}]` : ''

          return {
            goodsName: htmlDecode(brand + item.catentryName),
            status: item.status,
            options: htmlDecode(item.attrs.map(attr => attr.attrvalDesc).join(' / ')),
            totalPrice: item.quantity ? insertCommas(item.totalproduct) : 0,
            quantity: item.quantity,
            catentryName: htmlDecode(item.catentryName),
            statusName: item.statusName,
            orderSeq: item.orderSeq,
            ordersId: item.ordersId,
            goodsCd: item.goodsCd,
            buschnId: item.buschnId,
            dispTypeCd: item.dispTypeCd
          }
        })

        return {
          productList,
          ordersId: order.ordersId,
          ordersDate: order.timeplaced.replace(/-/g, '.'),
          dispTypeCd: order.dispTypeCd
        }
      })
    }
  },
  mounted () {
    this.intersectionObserverObj = uiUtil.setInfiniteScroll(this, {
      callback: this.getOrderList,
      targetElement: this.$refs.io_target
    })
  },

  methods: {
    /**
     * 주문 상세로 이동
     *
     * @param {string} ordersId 주문번호
     */
    goOrderDetail (ordersId) {
      const param = {
        ordersId,
        intPrdYn: 'N', // TODO : 무형상품여부 API로 안내려옴
        title: '주문상세내역',
        guestResultYn: 'N',
        logonType: loginUtil.logonType(),
        footerShow: true,
        bottomShow: true
      }

      popupUtil.show('mypage/MypageOrderDetail', param, null)
    },
    /**
     * 주문 목록 조회
     * @returns {void}
     */
    getOrderList () {
      if (this.isAPIcalling) {
        return
      }
      this.isAPIcalling = true

      const params = {
        odt1: calcDate('', 0, -this.monthly, 0, 0, 'yyyy.MM.dd'),
        odt2: calcDate('', 0, 0, 0, 0, 'yyyy.MM.dd'),
        pageidx: this.pageIdx,
        rowpage: this.rowpage,
        pagelmt: 10,
        tidx: 0, // Tab Index  ("". 전체. 1. 일반상품 / 2. 상품권 / 3. NS정기배달 / 4. 서비스상품)
        midx: 2, // Menu Index (1. Default / 2. 주문배송조회 / 3. 주문취소변경 / 4. 교환반품)
        userId: loginUtil.userId(),
        ordsid: '', // 상세조회할 대 값 설정.
        channel: 'mobile',
        status: '',
        lcs_cd: '',
        mcs_cd: ''
      }

      this.$nsaxios.post('NSMypageCmd', params, data => {
        this.isAPIcalling = false
        this.isAPIcalled = true

        const orders = data.msg.root.orders

        // 상품이 없으면 무한 스크롤 요소 감지 중지
        if (!orders.length) {
          this.intersectionObserverObj.disconnect()
          return
        }

        // 주문정보 조회결과 저장
        this.pageDataset = this.pageDataset.concat(orders)

        // 카카오 알림톡 랜딩 추가
        if (this.ordersId) {
          // 로그인여부 확인
          if (!loginUtil.checkLogonStatus()) {
            bizUtil.gotoLogin()
            return
          }

          // 랜딩할 오더번호가 존재할 경우
          const orderInfo = JSON.parse(JSON.stringify(orders))
          if (orderInfo.some(item => item.ordersId === this.ordersId)) {
            this.goOrderDetail(this.ordersId)
            return
          }
          this.ordersId = ''
        }

        this.pageIdx++
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/custcenter/SelectProductLayer";
</style>
