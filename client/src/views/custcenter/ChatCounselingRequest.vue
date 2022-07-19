<template>
  <div class="chat_counseling_request">
    <section>
      <dl class="chat_info">
        <dt>NSmall 채팅상담</dt>
        <dd class="time">
          운영시간 09:00~18:00
        </dd>
        <dd class="copy">
          고객님의 개인정보 노출을 막기 위하여
          개인정보는 기록하지 않도록 주의하여 주십시오.
        </dd>
      </dl>
    </section>
    <section>
      <strong class="subject">
        상담하실 상품을 선택하세요
      </strong>
      <button
        type="button"
        class="btn_select"
        @click="layer = true"
      >
        <span>상품 선택</span>
      </button>
      <div v-if="selectedProduct" class="select_product">
        <div class="top_box">
          <figure>
            <ns-img
              :product-number="selectedProduct.goodsCd"
              :width="144"
              :height="144"
              :alt="selectedProduct.goodsName"
            />
          </figure>
          <p class="title">
            {{ selectedProduct.goodsName }}
          </p>
        </div>
        <button
          type="button"
          class="btn_delete"
          @click="deleteProduct()"
        >
          <span>삭제</span>
        </button>
      </div>
      <div v-else class="checkbox_wrap">
        <label>
          <input
            v-model="isWithoutProduct"
            type="checkbox"
            class="checkbox"
            @click="resetOption()"
          >
          <span class="label_check">상품선택 안함</span>
        </label>
      </div>
      <strong class="subject">
        원하시는 상담유형을 선택하세요
      </strong>
      <div class="select_wrap">
        <label class="select">
          <select v-model="selectedBigGroup" :disabled="!showBigGroup" @change="changeBigGroup()">
            <option value="">상담유형</option>
            <option v-for="(option, index) in validBigGroup" :key="index" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </label>
        <label class="select">
          <select v-model="selectedMediumGroup" :disabled="!selectedBigGroup || !showBigGroup">
            <option value="">세부유형</option>
            <option v-for="(option, index) in validMediumGroup" :key="index" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </label>
        <button
          type="button"
          class="btn_counsel"
          :class="{ in_active : !selectedMediumGroup || !selectedBigGroup || !showBigGroup }"
          :disabled="!selectedMediumGroup || !selectedBigGroup || !showBigGroup"
          @click="openConsultation()"
        >
          <span>상담신청</span>
        </button>
      </div>
    </section>

    <select-product-layer
      v-show="layer === true"
      @select-product="selectProduct"
      @close-select-product="layer = false"
    />
  </div>
</template>

<script>
import CUST_CENTER_CONST from '@constants/custcenter/custcenter'
import COMM_CONST from '@constants/framework/constants'
import CONST from '@constants/framework/framework'
import { ORDER_CONST } from '@constants/order/order'
import {
  getNowTime
} from '@frameworks/dateutil/dateUtil'
import messageUtil from '@frameworks/messageUtil'
import nativeUtil from '@frameworks/nativeUtil'
import bizUtil from '@utils/bizUtil'
import {
  iframeReceiveMessage,
  isNull,
  isOsApp,
  htmlDecode,
  getImageUrl,
  objectToQueryString
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import uiUtil from '@utils/uiUtil'

import NsImg from '@components/common/NsImg'
import SelectProductLayer from '@components/custcenter/SelectProductLayer'

export default {
  name: 'ChatCounselingRequest',
  components: {
    NsImg,
    SelectProductLayer
  },
  props: {
    ordersId: { // 주문번호
      type: String,
      default: ''
    }
  },
  data () {
    return {
      customerId: '', // 고객 아이디
      win: null, // 팝업 윈도우 객체
      callbackFunction: null, // 채팅상담 윈도우 => 바닥 페이지 postMessage 시 발생하는 callback
      layer: false, // 주문 목록 레이어
      selectedProduct: null, // 선택된 상품 정보
      isWithoutProduct: false, // 상품선택 안함 체크 여부
      bigGroupOption: [], // 채팅상담 대분류 목록
      mediumGroupOption: [], // 채팅상담 중분류 목록
      selectedBigGroup: '', // 선택된 채팅상담 대분류
      selectedMediumGroup: '' // 선택된 채팅상담 중분류
    }
  },
  computed: {
    /**
     * 대분류 노출 가능 여부
     *
     * @returns {boolean} 대분류 노출 가능 여부
     */
    showBigGroup () {
      return this.selectedProduct || this.isWithoutProduct
    },
    /**
     * 주문 상태별 노출 가능한 채팅상담 대분류 목록
     *
     * @returns {array} 주문 상태별 노출 가능한 채팅상담 대분류 목록
     */
    validBigGroup () {
      const L_CD = CUST_CENTER_CONST.CHAT_CONSULT.L_CD

      // 선택된 상품 유무에 관계 없이 이벤트/서비스 문의는 기본으로 노출
      let validBigGroupOption = [
        L_CD.EVENT
      ]
      // 선택된 상품이 있으면
      if (this.selectedProduct) {
        // 주문, 배송/수거 옵션은 기본으로 노출
        validBigGroupOption = validBigGroupOption.concat([
          L_CD.ORDER,
          L_CD.DELIVERY
        ])

        // 배송중, 배송완료 상태면 반품, 교환 옵션 노출
        if (this.selectedProduct.status === ORDER_CONST.STATUS.SHIPPING || // 배송중
          this.selectedProduct.status === ORDER_CONST.STATUS.DELIVERY_COMPLETE) { // 배송완료
          validBigGroupOption = validBigGroupOption.concat([
            L_CD.RETURN,
            L_CD.EXCHANGE
          ])
        }
      }

      return this.bigGroupOption.filter(option => validBigGroupOption.includes(option.id))
    },
    /**
     * 주문 상태별 노출 가능한 채팅상담 중분류 목록
     *
     * @returns {array} 주문 상태별 노출 가능한 채팅상담 중분류 목록
     */
    validMediumGroup () {
      const M_CD = CUST_CENTER_CONST.CHAT_CONSULT.M_CD

      // 선택된 상품 유무에 관계 없이 이벤트/서비스 문의는 기본으로 노출
      let validMediumGroupOption = [
        M_CD.EVENT, // 참여이벤트문의
        M_CD.SERVICE // 서비스/사이트이용/장애문의
      ]

      // 선택된 상품이 있으면
      if (this.selectedProduct) {
        // 수정, 결제 옵션은 기본으로 노출
        validMediumGroupOption = validMediumGroupOption.concat([
          M_CD.UPDATE,
          M_CD.PAYMENT
        ])

        // 각 주문상태에서 상담 가능한 옵션 노출
        if (this.selectedProduct.status === ORDER_CONST.STATUS.PAYMENT_WAIT) { // 결제대기
          validMediumGroupOption = validMediumGroupOption.concat([
            M_CD.CANCEL,
            M_CD.COLLECT
          ])
        } else if (this.selectedProduct.status === ORDER_CONST.STATUS.PAYMENT_COMPLETE || // 결제완료
            this.selectedProduct.status === ORDER_CONST.STATUS.ORDER_SEND) { // 주문전달
          validMediumGroupOption = validMediumGroupOption.concat([
            M_CD.CANCEL,
            M_CD.DELIVERY,
            M_CD.COLLECT
          ])
        } else if (this.selectedProduct.status === ORDER_CONST.STATUS.PRODUCT_PREPARE) { // 상품 준비중
          validMediumGroupOption = validMediumGroupOption.concat([
            M_CD.DELIVERY,
            M_CD.COLLECT
          ])
        } else if (this.selectedProduct.status === ORDER_CONST.STATUS.SHIPPING) { // 배송중
          validMediumGroupOption = validMediumGroupOption.concat([
            M_CD.COLLECT,
            M_CD.RETURN,
            M_CD.EXCHANGE
          ])
        } else if (this.selectedProduct.status === ORDER_CONST.STATUS.DELIVERY_COMPLETE) { // 배송완료
          validMediumGroupOption = validMediumGroupOption.concat([
            M_CD.DELIVERY,
            M_CD.COLLECT,
            M_CD.RETURN,
            M_CD.EXCHANGE
          ])
        } else {
          validMediumGroupOption = validMediumGroupOption.concat([
            M_CD.COLLECT
          ])
        }
      }

      return this.mediumGroupOption.filter(option => validMediumGroupOption.includes(option.id))
    }
  },
  watch: {
    layer (newVal) {
      if (newVal) {
        uiUtil.disableScroll()
        if (isOsApp()) {
          nativeUtil.setRoutePath('/popup')
        }
      } else {
        uiUtil.enableScroll()
        if (isOsApp()) {
          nativeUtil.setRoutePath('/custcenter/chat-counseling/request')
        }
      }
    }
  },
  created () {
    this.callbackFunction = iframeReceiveMessage(this, this.funcPostMsg)
    this.customerId = loginUtil.custNum()

    // 마이페이지 > 주문 목록 조회에서 넘어온 경우 선택된 상품을 표시
    if (this.$route.params.ordersId) {
      const item = this.$route.params
      const brandName = item.brandName
      const brand = !isNull(brandName) && brandName !== '미정의' ? `[${brandName}]` : ''

      this.selectProduct({
        goodsName: htmlDecode(brand + item.catentryName),
        status: item.status,
        catentryName: htmlDecode(item.catentryName),
        goodsCd: item.goodsCd,
        orderSeq: item.orderSeq,
        ordersId: item.ordersId
      })
    }

    // 채팅 상담 분류 조회
    this.getFooterInquirySelectMobile()
  },
  methods: {
    /**
     * 스펙트라 callback function (postMessage로 수신할 callback)
     *
     * @param {string} data (필수) postMessage로 수신한 callback function 정보
     */
    funcPostMsg (data) {
      let vData

      try {
        vData = JSON.parse(data)
      } catch (e) {
        return
      }

      const functionName = vData.func_name
      if (functionName && typeof (this[functionName]) === 'function') {
        this[functionName](vData.param)
      }
    },
    /**
     * 로그인 확인 (postMessage로 호출됨. function명 변경 금지!)
     *
     * @param {object} data customer_id
     *
     */
    loginCheck (data) {
      if (this.customerId === data.customer_id) {
        const loginYn = true
        this.win.self.postMessage(loginYn, '*')
      } else {
        bizUtil.gotoMain()
      }
    },
    /**
     * 상담이력 페이지 refresh (postMessage로 호출됨. function명 변경 금지!)
     *
     */
    pageMove () {
      if (this.win && this.win.close !== undefined) {
        this.win.close()
        this.win = null
      }

      this.$router.replace({ name: 'chatCounselingHistory' })
    },
    /**
     * 채팅상담 대분류 변경
     *
     */
    changeBigGroup () {
      this.selectedMediumGroup = ''

      // 일부 사용자 bypass
      const BYPASS_USERS = ['208861292', '102273697', '12648425', '159619649', '101131676', '103004738', '101092675']
      if (BYPASS_USERS.includes(loginUtil.userId())) {
        this.getFooterInquirySelectMobile()
      } else {
        if (Number(getNowTime()) < 90000 || Number(getNowTime()) > 180000) {
          messageUtil.alert('채팅상담 가능시간은 09:00~18:00 입니다.', () => {
            this.tabIndex = 0
            this.monthly = ''
            this.pageidx = ''
            window.removeEventListener('message', this.callbackFunction, false)
          })
        } else {
          this.getFooterInquirySelectMobile()
        }
      }
    },
    /**
     * 상담할 상품 선택
     *
     * @param {object} product 선택된 상품 정보
     */
    selectProduct (product) {
      this.selectedProduct = product
      this.layer = false
      this.resetOption()
    },
    /**
     * 선택된 상품 삭제
     *
     */
    deleteProduct () {
      this.selectedProduct = null
      this.resetOption()
    },
    /**
     * 채팅상담 분류 초기화
     *
     */
    resetOption () {
      this.selectedBigGroup = ''
      this.selectedMediumGroup = ''
    },
    /**
     * 채팅상담 분류 목록 조회
     *
     */
    getFooterInquirySelectMobile () {
      const invoke = {
        cmd_gubun: 'QC2',
        largeCate_id: this.selectedBigGroup
      }
      this.$nsaxios.post('FooterInquirySelectMobileReal', invoke, data => {
        const { bigGroup, mediumGroup } = data.msg.root[0]
        if (bigGroup) {
          this.bigGroupOption = bigGroup.map(bigGroupItem => ({
            name: bigGroupItem.name,
            id: bigGroupItem.id
          }))
        }
        if (mediumGroup) {
          this.mediumGroupOption = mediumGroup.map(mediumGroupItem => ({
            name: mediumGroupItem.name,
            id: mediumGroupItem.id
          }))
        }
      })
    },
    /**
     * 채팅상담 팝업 열기
     *
     */
    openConsultation () {
      let ordersId = ''
      let catentryName = ''
      let imageUrl = ''
      let orderSeq = ''
      if (this.selectedProduct) {
        ordersId = this.selectedProduct.ordersId
        catentryName = this.selectedProduct.catentryName
        imageUrl = getImageUrl(this.selectedProduct.goodsCd, 143, 143)
        orderSeq = this.selectedProduct.orderSeq
      }

      const parameters = objectToQueryString({
        customerId: loginUtil.custNum(), // 고객아이디
        customerName: loginUtil.userName(), // 고객이름
        orderNo: ordersId, // 주문번호
        productName: catentryName, // 상품명
        // lCat :  1: 주문, 2: 배송/수거, 731: 이벤트/서비스문의
        // sCat : 16: 수정, 18: 결제, 31: 배송문의, 749: 수거문의, 732: 참여이벤트문의, 734: 서비스/사이트이용/장애문의
        csCode: `${this.selectedBigGroup}_${this.selectedMediumGroup}`, // CS상담분류코드 - 대분류_중분류(구분자 _ 사용)
        productImages: imageUrl, // 상품 썸네일 이미지 경로
        marginTop: '40', // 상단 height
        marginBottom: '', // 하단 height
        orderNumber: orderSeq, // 주문순번
        appType: COMM_CONST.getAcceptPath(), // Push I/F 발송에 필요한 Key값들
        ssl: location.protocol.indexOf('https'),
        type: 'TALKPAGE',
        requestUrl: CONST.IS_SERVER_STATE, // 운영 & 개발 구분
        deviceId: loginUtil.userId() // 플랫폼고객번호
      })

      const url = `//talk.nsmall.com/app/jsp/talk/talkCheck.jsp?${parameters}`

      if (isOsApp()) {
        nativeUtil.openEnomixTalk(`https:${url}`, loginUtil.custNum()) // 앱인 경우 https로만 보내기
      } else {
        this.win = window.open(url, '_hub', 'location=no,zoom=no,hardwareback=no,clearsessioncache=no,clearcache=yes')
        if (!this.win) {
          messageUtil.alert('단말기 설정에서 팝업 차단을 풀어주세요.')
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/ChatCounselingRequest";
</style>
