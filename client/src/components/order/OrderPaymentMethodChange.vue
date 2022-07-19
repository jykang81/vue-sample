<template>
  <div v-if="isLoadingSuccess" class="order_payment_method_change">
    <h3 class="subject">
      주문내역
    </h3>
    <div class="order_list">
      <ul class="product_info">
        <li>
          <strong class="order_num">주문번호 <span>{{ ordersId }}</span></strong>
          <div v-for="(item, indexItem) in orderGoods"
               :key="indexItem"
               class="box"
          >
            <figure>
              <ns-img
                :product-number="item.goodsCd"
                :width="144"
                :height="144"
                :alt="item.catentryName"
              />
            </figure>
            <div class="field">
              <p class="title">
                {{ htmlDecode(getProductTitle(item)) }} {{ htmlDecode(item.catentryName) }}
              </p>
              <ns-price
                :dc-price="item.price"
                :buschn-id="item.buschnId"
                :disp-type-cd="item.dispTypeCd"
              />
              <p class="option">
                <template v-if="item.subProducts.length > 0">
                  수량 {{ item.quantity }}개 /
                  <span
                    v-for="(attrInfo, attrIdx) in item.attrs"
                    :key="attrIdx + '_1'"
                  >
                    {{ htmlDecode(attrInfo.attrvalDesc) }}
                  </span>
                  <span
                    v-for="(subInfo, subIdx) in item.subProducts"
                    :key="subIdx + '_2'"
                  >
                    <span v-if="subInfo.partgubun === 'CHOICE'">
                      <!-- 초이스 상품일 경우 -->
                      {{ htmlDecode(subInfo.name) }}<span v-if="subInfo.attrs.length > 0"> {{ htmlDecode(subInfo.attrs.value) }}</span> : {{ subInfo.quantity }}개
                    </span>
                    <span v-else-if="subInfo.partgubun === 'PACK'">
                      <!-- PACK 일 경우 -->
                      {{ htmlDecode(subInfo.name) }}<span v-if="subInfo.attrs.length > 0"> {{ htmlDecode(subInfo.attrs.value) }}</span>
                    </span>
                  </span>
                </template>
                <template v-else>
                  수량 {{ item.quantity }}개 /
                  <span
                    v-for="(attrInfo, attrIdx) in item.attrs"
                    :key="attrIdx + '_3'"
                  >
                    {{ htmlDecode(attrInfo.attrvalDesc) }}
                  </span>
                </template>
              </p>
              <dl v-show="item.giftSubPrd.length > 0" class="free_gift">
                <dt>사은품</dt>
                <dd
                  v-for="(giftInfo, giftIdx) in item.giftSubPrd"
                  :key="giftIdx + '_6'"
                >
                  {{ giftIdx + 1 }}. {{ htmlDecode(giftInfo.name) }}
                  <span
                    v-for="(giftAttrInfo, giftAttrIdx) in giftInfo.attrs"
                    :key="giftAttrIdx + '_7'"
                  >
                    {{ htmlDecode(giftAttrInfo.value) }}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
          <dl class="deposit_info">
            <dt>입금금액</dt>
            <dd><span class="red">{{ dpstSchdAmt }}원</span></dd>
            <dt>무통장 입금</dt>
            <dd>
              <ul>
                <li>{{ dpstBankNm }} {{ dpstAcctNum }}</li>
                <li>예금주: (주)엔에스쇼핑</li>
                <li>입금자: {{ htmlDecode(rmitr) }}</li>
                <li><strong class="red">{{ dpstLimitTm }} 입금마감</strong></li>
              </ul>
            </dd>
          </dl>
        </li>
      </ul>
    </div>
    <h3 class="subject mt32">
      결제하기
    </h3>
    <label class="select mt16">
      <select v-model="epCardCode" @change="onchangeSelectEpCardCode()">
        <option value="">
          카드선택
        </option>
        <template v-for="(cardItem, indexCardItem) in useCardList">
          <option
            :key="`${indexCardItem}${cardItem.CARD_SEQ}${cardItem.CARD_CO_CD}`"
            :value="`${cardItem.CARD_CO_CD}_${cardItem.EZPAYCD}_${cardItem.DIRECT_YN}_${cardItem.CARD_SEQ}`"
          >
            {{ cardItem.CARD_CO_NM }}
          </option>
        </template>
      </select>
    </label>
    <label class="select mt8">
      <select v-model="epQuota" @change="onchangeSelectEpQuota()">
        <template v-for="(dispEpQuotaItem, indexDispEpQuota) in dispEpQuotaList">
          <option
            :key="indexDispEpQuota"
            :value="dispEpQuotaItem.value"
          >{{ dispEpQuotaItem.text }}
          </option>
        </template>
      </select>
    </label>
    <ul class="msg_bullet_list">
      <li>결제수단변경 시에는 카드 청구할인 대상에서 제외됩니다.</li>
      <li>결제변경 시, 일시불할인 및 추가할인혜택은 적용 불가합니다.</li>
    </ul>
    <div class="total_price line">
      <p class="agree_guide">
        주문하실 상품, 가격, 배송정보, 할인 내역 등을<br> 최종 확인하였으며, 구매에 동의 하시겠습니까?
      </p>
    </div>
    <div class="buy_box">
      <label class="agree_check">
        <input v-model="isCheckAgreePurchage" type="checkbox" class="checkbox square">
        <span class="check_label">동의합니다.(전자상거래법 제8조 제2항)</span>
      </label>
      <div class="btn_group">
        <button type="button" class="btn gray_border" @click="onclickChangeCancel()">
          <span>변경취소</span>
        </button>
        <button type="button" class="btn coral" @click="onclickCheckValid()">
          <span>결제하기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CONST from '@constants/framework/framework'
import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import {
  iframeReceiveMessage,
  insertCommas,
  insertSeparatorPhoneNumber,
  isNull,
  extend,
  isOsApp,
  serializeToObject,
  viewType,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import orderPaymentMethodChangeService from '@services/order/orderPaymentMethodChangeService'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import uiUtil from '@utils/uiUtil'

export default {
  name: 'OrderPaymentMethodChange',
  components: {
    NsImg,
    NsPrice
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoadingSuccess: false,
      mInputParams: {},
      mOutputDatas: {},
      paymentMethodInitData: {}, // 결제수단별 초기화 기본 데이터
      orgPaymentMethodInitData: {},

      orderGoods: [],
      ordersId: '', // 주문번호
      dpstLimitTm: '', // 입금마감
      dpstBankNm: '', // 은행명
      dpstAcctNum: '', // 계좌번호
      rmitr: '', // 입금자명
      dpstSchdAmt: '', // 입금금액

      minNoinst: 999,
      singlePaymentDc: 'N',

      disabledSelect: false,
      useCardList: [],
      epQuotaList: [],
      epQuotaListType: '',
      selectedCardCodeEzPayCd: '',
      dispEpQuotaList: [{ value: '00', text: '일시불' }],
      limitForCount: 0,

      epCardCode: '',
      epQuota: '00',

      isCheckAgreePurchage: false, // 전자상거래법 동의 여부
      enableCallbackResult: true
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  watch: {
    isLoadingSuccess (value) {
      if (value) {
        this.$nextTick(() => {
          uiUtil.preventFixedElementCracking(document.querySelector('.buy_box'))
        })
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    iframeReceiveMessage(this, this.callbackResult)
    // 마케팅 스크립트 적용 부분
    // GA360
    let [pageDepth1, pageDepth2, pageDepth3, pageDepth4] = window.marketingRoute.meta.depth.split('>')
    pageDepth1 = isNull(pageDepth1) ? '' : pageDepth1.trim()
    pageDepth2 = isNull(pageDepth2) ? '' : pageDepth2.trim()
    pageDepth3 = isNull(pageDepth3) ? '' : pageDepth3.trim()
    pageDepth4 = isNull(pageDepth4) ? '' : pageDepth4.trim()
    if (isNull(pageDepth1)) {
      pageDepth1 = '결제수단변경'
      pageDepth2 = ''
      pageDepth3 = ''
      pageDepth4 = ''
    } else if (isNull(pageDepth2)) {
      pageDepth2 = '결제수단변경'
      pageDepth3 = ''
      pageDepth4 = ''
    } else if (isNull(pageDepth3)) {
      pageDepth3 = '결제수단변경'
      pageDepth4 = ''
    } else if (isNull(pageDepth4)) {
      pageDepth4 = '결제수단변경'
    } else {
      pageDepth4 = `${pageDepth4}>결제수단변경`
    }
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true,
        subparams: {
          t1: pageDepth1,
          t2: pageDepth2,
          t3: pageDepth3,
          t4: pageDepth4
        }
      }
    })
  },
  methods: {
    htmlDecode,
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      this.mInputParams = this.param

      const param = {
        ordsid: this.mInputParams.ordersId,
        tidx: '', // "". 전체. 1. 일반상품 / 2. 상품권 / 3. NS정기배달 / 4. 서비스상품 /
        channel: 'mobile',
        vwtyp: !loginUtil.checkLogonStatus() ? 'g' : '' // 비회원일 경우 g
      }
      orderPaymentMethodChangeService.init(param, this.setProductInfo)
    },
    /**
     * 상품정보 설정
     * @param {Object} data - 조회정보
     * @returns {void}
     */
    setProductInfo (data) {
      const cats = data.msg.root.orders[0].cats
      for (const item of cats) {
        const giftSubPrd = []
        for (const _subProducts of item.subProducts) {
          if (_subProducts.partgubun === 'GIFT') {
            const attrs = []
            if (_subProducts.attrs.length > 0) {
              for (const _attrs of _subProducts.attrs) {
                attrs.push({ value: _attrs.value })
              }
            } else {
              attrs.push({ value: '' })
            }
            giftSubPrd.push({
              name: _subProducts.name,
              attrs
            })
          }
        }

        this.orderGoods.push({
          goodsCd: item.goodsCd,
          brandName: item.brandName,
          catentryName: item.catentryName,
          price: item.price,
          quantity: item.quantity,
          subProducts: item.subProducts,
          attrs: item.attrs,
          buschnId: item.buschnId,
          dispTypeCd: item.dispTypeCd,
          giftSubPrd
        })
      }

      const param = {}
      param.storeId = '13001' // storeentId
      param.co_cd = COMM_CONST.getCocd() // api 내부적으로 주문시 cocd 추출한다고함, 일단 화면에서는 현 cocd 적재
      param.catalogId = '' // 미입력
      param.accptPath = COMM_CONST.getAcceptPath()
      param.orderId = this.mInputParams.ordersId // 주문번호

      orderPaymentMethodChangeService.setProductInfo(param, this.setPaymentInfo)
    },
    /**
     * 결제정보 설정
     * @param {Object} data - 결제정보
     * @returns {void}
     */
    setPaymentInfo (data) {
      this.mOutputDatas.msg = data.msg.root

      this.ordersId = this.mInputParams.ordersId // 주문번호
      this.dpstLimitTm = this.mOutputDatas.msg.withoutBankInfo.dpstLimitTm // 입금마감
      this.dpstBankNm = this.mOutputDatas.msg.withoutBankInfo.dpstBankNm // 은행명
      this.dpstAcctNum = this.mOutputDatas.msg.withoutBankInfo.dpstAcctNum // 계좌번호
      this.rmitr = this.mOutputDatas.msg.withoutBankInfo.rmitr // 입금자명
      this.dpstSchdAmt = insertCommas(this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt) // 입금금액

      this.setCardList() // 카드목록
      this.setEpNoinstFlagN() // 할부여부 설정

      for (let i = 0; this.mOutputDatas.msg.OrderGoodList.length > i; i++) {
        if (this.minNoinst > Number(this.mOutputDatas.msg.OrderGoodList[i].goodsDetail.PROM_VAL_IFI)) {
          // 사은품일 때에는 무이자 개월수 적용하지 않는다.
          if (this.mOutputDatas.msg.OrderGoodList[i].goodsDetail.GIFT_YN === 'N') {
            this.minNoinst = Number(this.mOutputDatas.msg.OrderGoodList[i].goodsDetail.PROM_VAL_IFI)
          }
        }
      }

      // 일시불할인을 받았다면 할부선택막기EP_noinst_flag
      if (this.mOutputDatas.msg.withoutBankInfo.singlePaymentDc !== undefined) {
        this.singlePaymentDc = this.mOutputDatas.msg.withoutBankInfo.singlePaymentDc
      }

      this.disabledSelect = this.singlePaymentDc === 'Y'
      if (this.disabledSelect) {
        this.epQuota = '00'
      }

      // 결제수단에대한 초기화 기본데이터를 조회 적재
      this.doPaymentApprovalRequest(
        { paymentList: JSON.stringify({ paymentList: [{ payType: '100', requestCommand: 'RequestInfo', payAmt: this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt }] }) },
        data => {
          if (data.msg && data.msg.result === 'success') {
            let strEpUserAddr = ''

            // 비회원 체크, 비회원이면 false
            if (loginUtil.checkLogonStatus()) {
              if (this.mOutputDatas.msg.UserInfo.ADDRESS1.replace(/&amp;:/g, '').trim() !== '') {
                strEpUserAddr = this.mOutputDatas.msg.UserInfo.ADDRESS1.replace(/&amp;:/g, ' ')
              } else {
                strEpUserAddr = ''
              }
            }

            // 결제수단별 초기화 기본데이터 저장
            this.paymentMethodInitData = {
              EP_order_no: this.mInputParams.ordersId,
              EP_user_type: (this.mOutputDatas.msg.UserInfo.REGISTERTYPE === 'G' ? '2' : '1'),
              EP_user_id: this.mOutputDatas.msg.UserInfo.LOGONID,
              EP_user_nm: this.mOutputDatas.msg.UserInfo.LASTNAME,
              EP_user_mail: this.mOutputDatas.msg.UserInfo.EMAIL1,
              EP_user_phone1: insertSeparatorPhoneNumber(this.mOutputDatas.msg.UserInfo.PHONE1),
              EP_user_addr: strEpUserAddr,
              EP_product_type: '0',
              EP_product_nm: this.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName,
              EP_product_expr: '',
              EP_tax_flg: 'N',
              EP_cert_type: data.msg.EP_cert_type,
              EP_mall_id: data.msg.EP_mall_id,
              EP_mall_id_temp: data.msg.EP_mall_id,
              EP_mall_id_free_temp: data.msg.EP_mall_id_free,
              EP_currency: data.msg.EP_currency,
              EP_agent_ver: data.msg.EP_agent_ver,
              EP_mall_nm: data.msg.EP_mall_nm,
              EP_mall_pwd: data.msg.EP_mall_pwd,
              EP_lang_flag: data.msg.EP_lang_flag,
              EP_ci_url: data.msg.EP_ci_url,
              EP_pay_type: '11',
              EP_card_code: '',
              EP_card_prefix: '',
              EP_ret_pay_type: '',
              EP_trace_no: '',
              EP_min_install_cnt: this.minNoinst, // 최대 무이자 개월수
              order_amount: '0',
              order_cardname: '',
              apvl_chain_no_lt: '',
              cavv: '',
              xid: '',
              EP_kvpcardcode: '',
              EP_card_no: ''
            }

            this.orgPaymentMethodInitData = JSON.parse(JSON.stringify(this.paymentMethodInitData))
          }
        }
      )

      this.isLoadingSuccess = true
    },
    /**
     * 주문상품정보 출력: 상품 아이템 출력 - title
     * @param {Object} data - 상품 아이템정보
     * @returns {String}
     */
    getProductTitle (data) {
      return (!isNull(data.brandName) && data.brandName !== '미정의' ? `[${data.brandName}]` : '')
    },
    /**
     * 주문상품정보 출력: 상품 아이템 출력 - price
     * @param {Object} data - 상품 아이템정보
     * @returns {String}
     */
    getProductAmt (data) {
      return insertCommas(data.price)
    },
    /**
     * 카드목록
     * @returns {void}
     */
    setCardList () {
      const tempUseCardList = this.mOutputDatas.msg.UseCardList || []
      for (let i = 0; i < tempUseCardList.length; i++) {
        // KAKAO BANK 직승인이 아니면 카드리스트에서 노출되지 않도록 함
        if (!(tempUseCardList[i].CARD_CO_NM.indexOf('카카오') >= 0 &&
              tempUseCardList[i].DIRECT_YN === 'N')) {
          this.useCardList.push(tempUseCardList[i])
        }
      }
    },
    /**
     * 신용카드 목록 선택 select onchange
     * @returns {void}
     */
    onchangeSelectEpCardCode () {
      this.epQuota = '00' // 할부개월 초기화

      this.selectedCardCodeEzPayCd = this.epCardCode
      if (this.selectedCardCodeEzPayCd.length > 6) {
        this.selectedCardCodeEzPayCd = this.selectedCardCodeEzPayCd.substring(0, 6)
      }

      if (isNull(this.epCardCode)) {
        this.dispEpQuotaList = [{ value: '00', text: '일시불' }]
      } else {
        this.instmMmsListView()
      }
    },
    /**
     * 신용카드 할부 선택 select onchange
     * @returns {void}
     */
    onchangeSelectEpQuota () {
      if (!this.setEpNoinstFlagN()) {
        this.instmMmsListView()
      }
    },
    /**
     * 일시불 설정
     * @returns {Boolean}
     */
    setEpNoinstFlagN () {
      const isLt = this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt < 50000
      if (isLt) {
        this.dispEpQuotaList = [{ value: '00', text: `일시불${isLt ? '(5만원 이상할부가능)' : ''}` }]
        this.epQuota = '00' // 일시불 선택시, 할부유형을 일반할부로 변경
      }
      return isLt
    },
    /**
     * 카드 무이자 할부 리스트 호출
     * @returns {void}
     */
    instmMmsListView () {
      if (this.setEpNoinstFlagN()) {
        return
      }

      // 카드사별 무이자 할부 정보 API 호출
      // API 호출을 위한 기존 6자리에서 앞 2자리 substring
      let tCardVal = this.epCardCode.substring(0, 2)
      const tEasyCode = this.epCardCode.substring(3, 6)

      // 신한카드의 경우는 SH --> LG로 변경한다.
      if (tCardVal === 'SH' && tEasyCode === '029') {
        tCardVal = 'LG'
      }

      // 무이자 할부 확인하여 할부 option 다시 그림
      let nMaxForCnt = 12

      const successHandling = data => {
        if (data !== null && data.isSuccessful) { // API를 통해서 카드 무이자 개월수를 받아 왔다면..
          if (this.minNoinst > 12 && data.list.length > 11) {
            nMaxForCnt = this.minNoinst
          }

          if (nMaxForCnt < 13) { // 무이자 12개월 이하이면 무조건 2~12개월만 보여준다.
            this.limitForCount = 11
          } else if (nMaxForCnt - 1 > data.list.length) { // 무이자 상품 개월수가 카드 무이자 개월수보다 많으면 카드가 내려주는 무이자 개월수를 보여준다.
            this.limitForCount = data.list.length
          } else { // 무이자 상품 개월수를 보여준다.
            this.limitForCount = nMaxForCnt
          }

          if (data.list.length > 0) {
            this.epQuotaListType = '1'
            this.epQuotaList = data.list
          } else {
            this.epQuotaListType = '2'
            this.epQuotaList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          }
        } else {
          this.setDefaultEpQuota()
        }
        this.setDisplayEpQuotaList()
      }

      const errorHandling = err => {
        console.error(err)
        this.setDefaultEpQuota()
        this.setDisplayEpQuotaList()
      }

      orderPaymentMethodChangeService.instmMmsListView({ tasknm: 'instmMmsList', var: tCardVal }, successHandling, errorHandling)
    },

    /**
     * 카드 무이자 할부 리스트
     * API 호출에 실패하면 기존 하드코딩 로직을 탄다.
     * @returns {void}
     */
    setDefaultEpQuota () {
      let nMaxForCnt = 12
      this.epQuotaListType = '3'
      this.epQuotaList = []

      if (this.minNoinst > 12 &&
            (this.selectedCardCodeEzPayCd === 'KM_016' || // 국민
             this.selectedCardCodeEzPayCd === 'SS_031' || // 삼성
             this.selectedCardCodeEzPayCd === 'SH_029' || // 신한
             this.selectedCardCodeEzPayCd === 'DN_027' || // 현대
             this.selectedCardCodeEzPayCd === 'BC_026' || // BC
             this.selectedCardCodeEzPayCd === 'AM_047' // 롯데
            )) {
        nMaxForCnt = this.minNoinst
      }

      for (let k = 2; k <= nMaxForCnt; k++) {
        this.epQuotaList.push(k)
      }
    },
    /**
     * 무이자 개월수 설정
     * @returns {void}
     */
    setDisplayEpQuotaList () {
      const list = [{ value: '00', text: '일시불' }]
      const setOption = (_epQuota, flag) => {
        const epQuota = _epQuota < 10 ? `0${_epQuota}` : _epQuota
        if (flag) {
          return { value: `${epQuota}_n`, text: `${epQuota}개월(무이자)`, flag }
        } else {
          return { value: `${epQuota}`, text: `${epQuota}개월`, flag }
        }
      }

      if (this.epQuotaListType === '1') {
        for (let index = 0; index < this.limitForCount; index++) {
          const epQuotaItem = this.epQuotaList[index]
          const isFreeInterest = (index > this.limitForCount) ||
                                    (epQuotaItem <= this.minNoinst)

          list.push(setOption(epQuotaItem, isFreeInterest))
        }
      } else if (this.epQuotaListType === '2') {
        for (let index = 0; index < this.limitForCount; index++) {
          const epQuotaItem = this.epQuotaList[index]
          const isFreeInterest = (epQuotaItem <= this.minNoinst)

          list.push(setOption(epQuotaItem, isFreeInterest))
        }
      } else if (this.epQuotaListType === '3') {
        for (let index = 0; index < this.limitForCount; index++) {
          const epQuotaItem = this.epQuotaList[index]
          if (epQuotaItem > 12) { // 12개월 초과일 경우
            // 국민, 삼성, 신한 - 2~24, 36
            if ((this.selectedCardCodeEzPayCd === 'KM_016' ||
                  this.selectedCardCodeEzPayCd === 'SS_031' ||
                  this.selectedCardCodeEzPayCd === 'SH_029') &&
                  (epQuotaItem <= 24 || epQuotaItem === 36)) {
              list.push(setOption(epQuotaItem, true))
            }

            // 현대 - 2~12, 24, 36
            if ((this.selectedCardCodeEzPayCd === 'DN_027') &&
                  (epQuotaItem <= 12 || epQuotaItem === 24 || epQuotaItem === 36)) {
              list.push(setOption(epQuotaItem, true))
            }

            // 롯데 - 최대할부 24개월 - 2~24
            if ((this.selectedCardCodeEzPayCd === 'AM_047') &&
                  (epQuotaItem <= 24)) {
              list.push(setOption(epQuotaItem, true))
            }
          } else {
            // BC카드 최대 12개월까지만 표기
            const isFreeInterest = (epQuotaItem <= this.minNoinst)
            list.push(setOption(epQuotaItem, isFreeInterest))
          }
        }
      }
      const temp = list.filter(o => {
        return o.flag
      })
      if (temp.length > 0) {
        const maxEpQuota = temp[temp.length - 1].value.replace('_n', '')
        list[0] = { value: '00', text: `일시불(무이자최대 ${maxEpQuota}개월 가능)` }
      }
      this.dispEpQuotaList = list
    },
    /**
     * selectbox trigger change EP_card_code
     * @param {String} epCardCode - 카드코드 (${CARD_CO_CD}_${EZPAYCD}_${DIRECT_YN}_${CARD_SEQ})
     * @returns {void}
     */
    triggerChangeSelectEpCardCode (epCardCode = '') {
      this.epCardCode = epCardCode
      this.onchangeSelectEpCardCode()
    },

    /**
     * selectbox trigger change EP_noinst_flag
     * @param {String} epQuota - 할부개월수
     * @returns {void}
     */
    triggerChangeSelectEpNoinstFlag (epQuota = '00') {
      this.epQuota = epQuota
      this.onchangeSelectEpQuota()
    },

    /**
     * 결제승인 요청
     * @param {Object} param - 결제정보
     * @param {Function} callback - 결제승인 요청 후 Function
     * @returns {void}
     */
    doPaymentApprovalRequest (param, callback) {
      param = extend({
        userId: this.mOutputDatas.msg.UserInfo.USERS_ID,
        orderId: this.mInputParams.ordersId,
        ordersId: this.mInputParams.ordersId,
        originOrdersId: this.mInputParams.ordersId,
        custNum: this.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
        userNm: this.mOutputDatas.msg.UserInfo.LASTNAME,
        loginId: this.mOutputDatas.msg.UserInfo.LOGONID,
        co_cd: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PTN_CD,
        dispTypeCd: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD
      }, param)

      // vdn_cd (모바일 주문 접수 응대 번호) 데이터 다음 API 호출 시 추가
      if (isOsApp()) { // App
        param.vdn_cd = '54101'
      } else { // Web
        param.vdn_cd = '54102'
      }

      orderPaymentMethodChangeService.doPaymentApprovalRequest(param, callback)
    },
    /**
     * 결제 전 인증 전후 값 로그 적재
     * @param {String} reqresType - 인증전 E, 인증후 O
     * @param {String} ordersId - 주문번호
     * @param {String} payAmt - 결제금액
     * @param {String} payTypeCd - 결제유형
     * @param {Object} frmPay - 결제정보
     * @returns {void}
     */
    loadPaymentLogJS (reqresType, ordersId, payAmt, payTypeCd, frmPay) {
      const invokeParams = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nspayment.helper.NSPaymentLogTableJDBCHelper',
          mnm: 'xpayapprLog',
          args: {
            ordersId,
            paySeq: '0',
            apprSeq: '0',
            reqresType,
            payClssfCd: '000',
            payTypeCd,
            requestCmd: 'Certification',
            payAmt,
            apprLog: frmPay

          }
        })
      }

      // 결제 인증 전후 로그 적재 실행
      orderPaymentMethodChangeService.loadPaymentLogJS(invokeParams, data => {
        if (reqresType === 'E') { // 인증 전 콜백처리 진행
          //
        } else if (reqresType === 'O') { // 인증 후 콜백처리 진행
          let objData = {}

          if (undefined === frmPay) {
            objData = JSON.parse(data.var).args.apprLog
          } else {
            objData = serializeToObject(frmPay)
          }

          // 1. 롯데카드 직승인일 경우
          if (this.paymentMethodInitData.VAN_CO === '20' && this.paymentMethodInitData.usedcard_code === 'AM') {
            if (objData.result === '0000') {
              this.paymentMethodInitData.EP_card_prefix = objData.card_no.substring(0, 6)
              this.paymentMethodInitData.EP_card_chain_id = '1178133642' // 가맹점 번호 추가
              this.paymentMethodInitData.EP_card_cocd = this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PTN_CD

              this.paymentMethodInitData.PAY = 'SPS'// 안심클릭 인지 간편결제인지 판단 SPS   ,  EACS 값

              this.paymentMethodInitData.card_no = objData.card_no // 인증시 받은 카드 번호
              this.paymentMethodInitData.order_amount = this.paymentMethodInitData.payAmt
              this.paymentMethodInitData.order_cardname = 'LOTTECARD'// 카드명   LOTTECARD
              this.paymentMethodInitData.apvl_chain_no_lt = this.paymentMethodInitData.strApvlChainNoLt // 인증시 사용한 가맹점
              this.paymentMethodInitData.cavv = objData.cavv // 인증시 받은 복호화된 값
              this.paymentMethodInitData.xid = objData.xid

              this.paymentMethodInitData.EP_kvpcardcode = objData.card_no // 인증시 받은 카드 번호
              this.paymentMethodInitData.EP_card_no = objData.card_no

              this.gotoPaymentComplete(this.paymentMethodInitData) // 결제 완료 호출
            } else {
              messageUtil.alert(`결제요청이 실패하였습니다. ${objData.msg}`)

              if (!isOsApp()) {
                this.$store.commit('popup/hide')
              }
            }

            // 2. KB국민카드 직승인일 경우
          } else if (this.paymentMethodInitData.VAN_CO === '20' &&
                                    this.paymentMethodInitData.usedcard_code === 'KM') {
            for (const key in frmPay) {
              frmPay[key] = decodeURIComponent(frmPay[key])
            }

            if (frmPay.SendCode === '10001000') { // 성공
              frmPay.EncData = encodeURIComponent(frmPay.EncData)
              this.gotoPaymentComplete(frmPay) // 결제 완료 호출
            } else {
              if (frmPay.SendCode === '22002200') { // ISP 인증 취소
                messageUtil.alert('결제요청을 취소하셨습니다.')
              } else if (frmPay.SendCode === '00130013') {
                messageUtil.alert('ISP인증이 정상적으로 처리되지 않았습니다.')
              } else {
                messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.')
              }

              if (!isOsApp() && viewType() !== 'iosweb') {
                this.$store.commit('popup/hide')
              }
            }

            // 신한 직승인 추가
          } else if (this.paymentMethodInitData.VAN_CO === '20' &&
                            this.paymentMethodInitData.moduleGubun === 'P') {
            // 성공 , 실패 관계 없이 인증 결과값을 수신 받았을 경우
            if (objData.sendCode === 'success') {
              for (const key in frmPay) {
                objData[key] = encodeURIComponent(decodeURIComponent(frmPay[key]))
              }
              this.gotoPaymentComplete(objData) // 결제 완료 호출

              // 고객이 인증을 취소 했을 경우
            } else if (frmPay.sendCode === 'cancel') {
              this.$store.commit('popup/hide')
            }
          } else {
            const unParams = {}
            for (const key in objData) {
              /*
               * EP8.0에서 kvp_sessionkey, kvp_encdata에 개항문자가 포함되어 SyntaxError 발생.
               * android app일 경우 decoding data가 넘어온다.
               */
              if (viewType() === 'android' && (key === 'EP_kvp_sessionkey' || key === 'EP_kvp_encdata')) {
                unParams[key] = `${encodeURIComponent(frmPay[key])}`
              } else if ((viewType() === 'ios' || viewType() === 'iosweb') && (key === 'EP_kvp_sessionkey' || key === 'EP_kvp_encdata')) {
                unParams[key] = `${frmPay[key]}`
              } else {
                unParams[key] = `${decodeURIComponent(frmPay[key])}`
              }
            }

            if (unParams.EP_res_cd === '0000') { // 성공
              this.fncGetCardChainId(unParams) // 가맹점 번호 조회
            } else {
              messageUtil.alert(`결제요청이 실패하였습니다. ${JSON.stringify(unParams.EP_res_msg)}`)
              if (!isOsApp()) {
                this.$store.commit('popup/hide')
              }
            }
          }
        }
      })
    },

    /**
     * 가맹점 번호 조회하여 paymentList에 추가되어 넘어갈 수 있도록....
     * 가맹점 번호 조회
     * @param {Object} params - 결제처리정보
     * @returns {void}
     */
    fncGetCardChainId (params) {
      params.EP_card_prefix = params.EP_card_prefix.substring(0, 6) // card_prefix를 무조건 6자리로 자른다

      const cardPrefixNum = params.EP_card_prefix // 카드사 코드
      const acctPath = 'MOBIL' // 유입경로 MOBIL
      const irFreeYn = this.paymentMethodInitData.EP_noinst_flag // 무이자 할부 여부 ; 무이자:Y,일반할부:N
      const ispApprYn = params.EP_req_type === '1' ? 'Y' : 'N' // ISP결제여부 : ISP결제일경우:Y,그외:N ; 1(ISP), 2(안심클릭), 3(PIN)
      const CARD_COCD = this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PTN_CD
      const dispTypeCd = this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD // 전시유형코드

      const invokeParams = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nscart.helper.NSOrderBizJDBCHelper',
          mnm: 'getCardChainId',
          args: {
            cardPrefixNum,
            acctPath,
            dispTypeCd,
            irFreeYn,
            ispApprYn,
            cocd: CARD_COCD
          }
        })
      }

      // 가맹점 번호 조회 API 통신 및 콜백
      orderPaymentMethodChangeService.fncGetCardChainId(invokeParams, data => {
        params.EP_card_chain_id = data.list.cardChainId // 가맹점 번호 추가
        params.EP_card_cocd = this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PTN_CD
        this.gotoPaymentComplete(params) // 결제 완료 호출
      })
    },
    /**
     * 최종 결제 정보 통신
     * @param {Object} params - 결제정보
     * @returns {void}
     */
    gotoPaymentComplete (params) {
      // 폼 데이터에 반영
      const data = {}
      for (const key in params) {
        if (params[key] && params[key].length > 0) {
          data[key] = String(params[key])
        }
      }
      data.orderCompleteYn = 'Y'
      data.requestCommand = 'LastApproval'
      data.payType = '100'
      data.EP_card_code = params.EP_kvpcardcode
      data.EP_card_prefix = params.EP_card_prefix
      data.EP_ret_pay_type = params.EP_pay_type
      // data['EP_trace_no'] = params.EP_m_cert_no;
      // easypay 8.0추가
      data.EP_trace_no = params.EP_cno
      data.EP_card_req_type = params.EP_req_type
      data.EP_kmotion_useyn = params.EP_kmotion_useyn
      data.EP_kvp_pgid = ''
      data.EP_kvp_cardcode = params.EP_kvp_cardcode
      data.EP_kvp_sessionkey = params.EP_kvp_sessionkey
      data.EP_kvp_encdata = params.EP_kvp_encdata
      data.EP_kvp_payset_flag = params.EP_kvp_payset_flag
      data.EP_kvp_using_point = params.EP_kvp_using_point

      if (undefined !== this.paymentMethodInitData.EP_noinst_term && this.paymentMethodInitData.EP_noinst_term !== '') {
        data.EP_noinst_term = this.paymentMethodInitData.EP_noinst_term.split('-')[1]
      }

      // usedcard_code 카드 세팅 ; 026은 BC로 등등등 각 카드코드에 해당하는 카드사 약자
      const objCardList = this.mOutputDatas.msg.UseCardList
      for (let i = 0; i < objCardList.length; i++) {
        if (objCardList[i].EZPAYCD === params.EP_card_cd) {
          data.usedcard_code = objCardList[i].CARD_CO_CD
          break
        }
      }

      // EP_card_prefix가 이상이 있으면 000000000으로 세팅한다.
      if (params.EP_card_prefix === null || undefined === params.EP_card_prefix || params.EP_card_prefix === '') {
        data.EP_card_prefix = '000000000'
      }

      extend(true, this.paymentMethodInitData, this.paymentMethodInitData, data)

      const orderItem = {
        orderItemIds: [],
        catEntryIds: [],
        orderItemQuantitys: [],
        orderItemAmount: []
      }

      for (let i = 0; this.mOutputDatas.msg.OrderGoodList.length > i; i++) {
        orderItem.orderItemIds.push(this.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID)
        orderItem.catEntryIds.push(this.mOutputDatas.msg.OrderGoodList[i].goodsDetail.CATENTRY_ID_CHILD)
        orderItem.orderItemQuantitys.push(this.mOutputDatas.msg.OrderGoodList[i].goodsDetail.QUANTITY)
        orderItem.orderItemAmount.push(this.mOutputDatas.msg.OrderGoodList[i].goodsDetail.PRICE)
      }

      let param = {
        amtPrice: this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt,
        totImdtDcCpAmt: '0',
        caltotalShipCharge: '0',
        registerType: this.mOutputDatas.msg.UserInfo.REGISTERTYPE,
        orderTotalAmt: this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt,
        sfinalPaymentAmtSaveExclude: this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt, //  - sfinalPaymentAmtSaveExclude 부가결제 수단을 재외한 화면에 뿌려지는 값 세팅
        expectAccmAmt: '0',
        couponDcAmt: '0',
        cardDcAmt: '0',
        orderCompleteYn: 'Y',
        classifyCd: '100', // 결제 분류코드(100=승인, 200=취소)
        productList: '',
        deliveryList: '',
        discountList: '',
        paymentList: JSON.stringify({ paymentList: [this.paymentMethodInitData] }),
        orderName: this.mOutputDatas.msg.UserInfo.LASTNAME,
        orderMail: this.mOutputDatas.msg.UserInfo.EMAIL1,
        contactNum: insertSeparatorPhoneNumber(this.mOutputDatas.msg.UserInfo.PHONE1, '-', true),
        parentCatEntryId: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.CATENTRY_ID_PARENT,
        catEntryIds: orderItem.catEntryIds,
        orderItemQuantitys: orderItem.orderItemQuantitys,
        orderItemIds: orderItem.orderItemIds,
        orderItemAmount: orderItem.orderItemAmount,
        orderUserInfo: '',
        user_type: this.mOutputDatas.msg.UserInfo.USER_TYPE

      }

      param = extend({
        userId: this.mOutputDatas.msg.UserInfo.USERS_ID,
        orderId: this.mInputParams.ordersId,
        ordersId: this.mInputParams.ordersId,
        orginOrdersId: this.mInputParams.ordersId,
        custNum: this.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
        userNm: this.mOutputDatas.msg.UserInfo.LASTNAME,
        loginId: this.mOutputDatas.msg.UserInfo.LOGONID,
        req_co_cd: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PTN_CD,
        co_cd: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PTN_CD,
        dispTypeCd: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD
      }, param)

      if (isOsApp()) {
        param.vdn_cd = '54101'
      } else {
        param.vdn_cd = '54102'
      }

      orderPaymentMethodChangeService.gotoPaymentComplete(param, data => {
        if (data.msg && data.msg.result === 'success') {
          messageUtil.alert('결제수단이 변경되었습니다.', () => {
            this.$router.replace({
              name: 'mypageOrderList',
              params: {
                isReload: true
              }
            })
          })
        } else {
          let strAlertSubMsg = ''
          if (undefined !== data.msg && undefined !== data.msg.resultMessage) {
            strAlertSubMsg = ` ${data.msg.resultMessage}`
          }

          messageUtil.alert(`결제를 실패하였습니다.${strAlertSubMsg}`, () => {
            this.$router.replace({
              name: 'mypageOrderList',
              params: {
                isReload: true
              }
            })
          })
        }
      })
    },
    /**
     * 변경취소
     * @returns {void}
     */
    onclickChangeCancel () {
      this.$store.commit('popup/hide')
    },
    /**
     * [NSSR-39811] 무통장입금 -> 신용카드 결제로 변경 시 체크로직 추가
     * @returns {void}
     */
    async onclickCheckValid () {
      if (this.mInputParams.from === 'OrderCompletePayment') {
        this.onclickConfirm()
        return false
      }

      const ordersId = this.mInputParams.ordersId
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
      const lastupdateall = this.mInputParams.lastupdateall
      const latestOperationId = this.mInputParams.latestOperationId

      await orderPaymentMethodChangeService.checkOrderStatus(invokeParams1, data => {
        if (data.list.lockedOrderYn === 'Y') { // 상담사 Lock 여부 (DB Transaction)
          messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.', () => {
            if (!isOsApp()) {
              this.$store.commit('popup/hide')
            }
          })
        } else if ((String(data.list.lastupdateall) !== String(lastupdateall) ||
                    String(data.list.latestOperationId) !== String(latestOperationId))) { //  주문 수정일자 & 임시 처리 순번 체크 (DB Transaction)
          messageUtil.alert('주문상태가 변경 되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의주시기 바랍니다.', () => {
            if (!isOsApp()) {
              this.$store.commit('popup/hide')
            }
          })
        }
      })

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

      await orderPaymentMethodChangeService.chkRcOrderDtlStats(invokeParams2, data => {
        if (data.list.respCd !== 'S') { // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
          messageUtil.alert('주문상태가 변경 되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의주시기 바랍니다.', () => {
            if (!isOsApp()) {
              this.$store.commit('popup/hide')
            }
          })
        } else if (data.list.depositInYN === 'Y') {
          messageUtil.alert('이미 무통장입금 완료된 주문 입니다.<br />주문내역으로 이동합니다.', () => {
            if (!isOsApp()) {
              this.$store.commit('popup/hide')
            }
          })
        } else {
          this.onclickConfirm()
        }
      })
    },
    /**
     * 결제하기
     * @returns {void}
     */
    onclickConfirm () {
      if (isNull(this.epCardCode)) {
        messageUtil.alert('신용카드사를 선택해 주세요.')
        return false
      }

      if (isNull(this.epQuota)) {
        messageUtil.alert('할부기간을 선택해 주세요.')
        return false
      }

      if (!this.isCheckAgreePurchage) {
        messageUtil.alert('전자상거래법 제8조 제2항에 동의하셔야 합니다.')
        return false
      }

      const arrSelectedEpCardCode = this.epCardCode.split('_')
      const objSeltdData = this.useCardList.filter(o => {
        return o.CARD_CO_CD === arrSelectedEpCardCode[0] &&
               o.EZPAYCD === arrSelectedEpCardCode[1] &&
               o.DIRECT_YN === arrSelectedEpCardCode[2] &&
               o.CARD_SEQ === arrSelectedEpCardCode[3]
      })[0] || { CARD_CO_CD: '', CARD_CO_NM: '', DIRECT_YN: '', CARD_SEQ: '' }

      let noinstFlagYn = 'N'
      if (this.epQuota.indexOf('_n') > -1) {
        noinstFlagYn = 'Y'
      }
      let strVanCo = '00' // 직승인 여부 코드
      const moduleGubun = objSeltdData.moduleGubun

      // 직승인 구분
      // L : 롯데
      // I : 국민
      // P : 신한
      if (moduleGubun === 'L' || moduleGubun === 'I' || moduleGubun === 'P') {
        if (objSeltdData.DIRECT_YN === 'Y') {
          strVanCo = '20'
        }
      }

      let strApvlChainNoLt = '' // 가맹점 번호
      // 1. 롯데카드 직승인일 경우
      if (objSeltdData.CARD_CO_CD === 'AM' && strVanCo === '20') {
        this.paymentMethodInitData.EP_mall_id = 'M201502243642M'
        this.paymentMethodInitData.mId = 'M201502243642M'
        this.paymentMethodInitData.VIEW_TYPE = viewType()

        if (noinstFlagYn === 'Y') { // 무이자
          strApvlChainNoLt = '9988286207'
        } else {
          strApvlChainNoLt = '9988189394'
        }
        // 2. KB국민카드 직승인일 경우
      } else if (strVanCo === '20' && moduleGubun === 'I') {
        this.paymentMethodInitData.defaultPaymentData = JSON.stringify({
          userId: this.mOutputDatas.msg.UserInfo.USERS_ID,
          orderId: this.mInputParams.ordersId,
          ordersId: this.mInputParams.ordersId,
          originOrdersId: this.mInputParams.ordersId,
          custNum: this.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
          userNm: this.mOutputDatas.msg.UserInfo.LASTNAME,
          loginId: this.mOutputDatas.msg.UserInfo.LOGONID,
          co_cd: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.PTN_CD,
          dispTypeCd: this.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD,

          storeId: this.mInputParams.storeId,
          langId: this.mOutputDatas.msg.langId,
          accptPath: COMM_CONST.getAcceptPath(),
          accptPathCd: COMM_CONST.getAcceptPath()
        })

        this.paymentMethodInitData.EP_point_useyn = 'N'// 포인트 사용여부
        this.paymentMethodInitData.moduleGubun = objSeltdData.moduleGubun // ISP, Easypay 등 결제모듈구분 변수
      } else {
        this.paymentMethodInitData.EP_mall_id = this.orgPaymentMethodInitData.EP_mall_id
        this.paymentMethodInitData.mId = this.orgPaymentMethodInitData.mId
        this.paymentMethodInitData.VIEW_TYPE = this.orgPaymentMethodInitData.VIEW_TYPE
      }

      this.paymentMethodInitData.EP_noinst_flag = noinstFlagYn
      if (strVanCo === '20') { // 롯데 카드일 경우
        this.paymentMethodInitData.EP_mall_id_free_temp = this.paymentMethodInitData.EP_mall_id
        this.paymentMethodInitData.EP_mall_id_temp = this.paymentMethodInitData.EP_mall_id
      } else {
        if (noinstFlagYn === 'Y') {
          this.paymentMethodInitData.EP_mall_id = this.orgPaymentMethodInitData.EP_mall_id_free_temp
        } else {
          this.paymentMethodInitData.EP_mall_id = this.orgPaymentMethodInitData.EP_mall_id_temp
        }
      }

      if (noinstFlagYn === 'Y') {
        this.paymentMethodInitData.EP_noinst_term = `${objSeltdData.EZPAYCD}-${this.epQuota.replace('_n', '')}`
      } else {
        this.paymentMethodInitData.EP_noinst_term = ''
      }

      this.paymentMethodInitData.EP_product_amt = this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt
      this.paymentMethodInitData.EP_quota = this.epQuota.replace('_n', '')
      this.paymentMethodInitData.EP_usedcard_code = objSeltdData.EZPAYCD
      this.paymentMethodInitData.EP_user_phone2 = insertSeparatorPhoneNumber(this.mOutputDatas.msg.UserInfo.PHONE1)
      this.paymentMethodInitData.FINAL_PAYMENT_AMT = Number(this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt)
      this.paymentMethodInitData.OFFER_AMT = 0

      this.paymentMethodInitData.SHIP_CHARGE = 0
      this.paymentMethodInitData.SHIP_CHARGE_MULTI_DELIVERY = 0
      this.paymentMethodInitData.SHIP_CHARGE_ONE_DELIVERY = 0

      this.paymentMethodInitData.TOTAL_PRODUCT_AMT = Number(this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt)
      this.paymentMethodInitData.VAN_CO = strVanCo
      this.paymentMethodInitData.moduleGubun = moduleGubun // 폼데이터에 모듈구분값 추가

      this.paymentMethodInitData.cardDcAmt = 0
      this.paymentMethodInitData.couponDcAmt = 0
      this.paymentMethodInitData.custNum = this.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER
      this.paymentMethodInitData.orderCompleteYn = 'N'
      this.paymentMethodInitData.payAmt = Number(this.mOutputDatas.msg.withoutBankInfo.dpstSchdAmt)
      this.paymentMethodInitData.payType = PAY_TYPE_CONST.CREDIT_CARD
      this.paymentMethodInitData.requestCommand = 'RequestInfo' // LastApproval
      this.paymentMethodInitData.strApvlChainNoLt = strApvlChainNoLt
      this.paymentMethodInitData.usedcard_code = objSeltdData.CARD_CO_CD
      this.paymentMethodInitData.targetType = 'payment'

      // url encode 문제 처리 start
      // 스트링 안에 '%' 문자가 들어가면 그 뒤 2자리의 hex값으로 문자 변환을 하기 때문에
      // %뒤에 정상적인 hex 값이 안들어와서 나는 에러
      if (moduleGubun === 'E') { // EZ pay 인경우만 처리
        const productName = this.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName.replace('%', '%25')
        this.paymentMethodInitData.EP_product_nm = productName
      } else {
        this.paymentMethodInitData.EP_product_nm = this.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName
      } // url encode 문제 처리 end

      // KB 직승인 추가
      if (moduleGubun === 'I' && strVanCo === '20') {
        const currentViewType = viewType()
        let WAPUrl = ''
        let CancelUrl = ''
        const returnUrl = `https:${CONST.API_HOST}/nsmall/mobile/isp/isp_mob_result.jsp`
        let issuerCode = '' // 카카오뱅크 국민 구분 코드 추가

        if (currentViewType === 'ios' || currentViewType === 'iosweb') {
          WAPUrl = 'nsmobilecert://isp'
          CancelUrl = 'nsmobilecert://isp'
        }
        // 카카오 뱅크 추가로 인한 KB와 분기 처리
        if (objSeltdData.CARD_CO_NM.indexOf('카카오') >= 0) {
          issuerCode = 'KA'
        } else {
          issuerCode = 'KBC'
        }

        const ispData = {
          LoginGubun: '1',
          PgId: '',
          ReturnUrl: returnUrl,
          WAPUrl,
          GoodName: this.paymentMethodInitData.EP_product_nm,
          Price: this.paymentMethodInitData.FINAL_PAYMENT_AMT,
          Currency: 'WON',
          NoInt: (this.paymentMethodInitData.EP_noinst_flag === 'N' ? 0 : 1),
          Noint_Inf: this.paymentMethodInitData.EP_quota,
          HpNum: this.paymentMethodInitData.EP_user_phone1,
          MerchantNo: '',
          PubCertPrice: '',
          Tcode: '',
          IpAddr: '',
          TID: this.paymentMethodInitData.EP_order_no,
          CancelUrl,
          CardCode: '',
          issuerCode,
          payMthd: '', // 포인트 사용여부
          EP_card_cocd: COMM_CONST.getCocd(),
          VAN_CO: strVanCo,
          moduleGubun,
          appGubun: 'HUB'
        }
        const paymentList = this.paymentMethodInitData
        extend(paymentList, ispData)

        this.doPaymentApprovalRequest({
          paymentList: JSON.stringify({ paymentList: [paymentList] })
        }, data => {
          if (data.msg.RESULTCODE === '10001000') {
            // 폼 데이터에 반영
            this.paymentMethodInitData.TId = data.msg.TID
            this.paymentMethodInitData.MerchantNo = data.msg.MerchantNo
            this.paymentMethodInitData.IpAddr = data.msg.IpAddr

            // 외부결제 실행  함수 호출로 변경
            this.showPayWindows()
          } else {
            messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
              this.$store.commit('popup/hide')
            })
          }
        })

        // 신한 직승인 추가
      } else if (moduleGubun === 'P' && strVanCo === '20') {
        this.paymentMethodInitData.Amt = this.paymentMethodInitData.FINAL_PAYMENT_AMT
        this.paymentMethodInitData.NoInt = this.paymentMethodInitData.EP_noinst_flag

        this.doPaymentApprovalRequest({
          paymentList: JSON.stringify({ paymentList: [this.paymentMethodInitData] })
        }, data => {
          if (data.msg.result === 'success') {
            const payLineData = {
              GoodsCnt: this.mOutputDatas.msg.OrderGoodList.length,
              MID: data.msg.merchantID,
              EdiDate: data.msg.ediDate,
              EncryptData: data.msg.hash_String,
              payUrl: data.msg.payUrl,
              UserIP: data.msg.userIp,
              Moid: data.msg.Moid,
              BuyerTel: data.msg.buyerTel,
              BuyerName: data.msg.buyerNm,
              BuyerEmail: data.msg.buyerEmail,
              BuyerAddr: data.msg.buyerAddres,
              ReturnURL: `https:${CONST.API_HOST}/nsmall/mobile/payline/payline_mob_result.jsp`
            }
            const paymentList = this.paymentMethodInitData
            extend(paymentList, payLineData)

            this.showPayWindows()
          } else {
            messageUtil.alert('서버와 통신이 원활하지 못합니다. 잠시 후 다시 시도해 주십시오.', () => {
              this.$store.commit('popup/hide')
            })
          }
        })
      } else {
        /*
         * - 외부 결제 호출
         *   중복 소스 생성으로 별도 함수로 분리
         */
        this.showPayWindows()
      }
    },
    /**
     * 로그 적재 후 외부 결제 호출
     * @returns {void}
     */
    showPayWindows () {
      this.loadPaymentLogJS('E', this.paymentMethodInitData.EP_order_no, this.paymentMethodInitData.payAmt, this.paymentMethodInitData.payType, this.paymentMethodInitData)
      const paramPopup = {
        title: '결제수단 변경',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        orderPaymentParams: this.paymentMethodInitData
      }
      popupUtil.show('order/OrderPaymentCert.vue', paramPopup, () => {})
    },
    /**
     * 결제완료처리
     * @param {Object} data - 결제처리정보
     * @returns {void}
     */
    callbackResult (data) {
      if (this.enableCallbackResult && data.cmd === 'callbackPaymentResult') {
        this.enableCallbackResult = false
        this.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      } else if (this.enableCallbackResult && data.cmd === 'close') {
        this.enableCallbackResult = false
        this.$store.commit('popup/hide')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/OrderPaymentMethodChange";
</style>
