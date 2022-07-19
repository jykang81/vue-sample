<template>
  <div v-show="globalVal.showStep1" id="orderReturnArea" class="order_return_step1">
    <ol class="return_step">
      <li class="active">
        사유/수거지 선택
      </li>
      <li>
        환불정보확인
      </li>
      <li>
        반품신청완료
      </li>
    </ol>
    <h3 class="subject">
      반품사유
    </h3>
    <div class="order_list">
      <ul class="product_info">
        <li>
          <div v-for="(catInfo, catIdx) in catList"
               :key="catIdx + '_0'"
               class="box"
          >
            <figure>
              <a @click="bizUtil.gotoProductDetail(catInfo.goodsCd)">
                <ns-img
                  :product-number="catInfo.goodsCd"
                  :width="144"
                  :height="144"
                  :alt="catInfo.catentryName"
                />
              </a>
            </figure>
            <div class="field">
              <p class="title">
                {{ htmlDecode(catInfo.name) }}
              </p>
              <p class="price">
                <strong>{{ catInfo.price }}</strong>원
              </p>
              <p class="option">
                {{ catInfo.quantity }}개 /
                <span v-for="(attrInfo, attrIdx) in catInfo.attrs"
                      :key="attrIdx + '_1'"
                >
                  {{ htmlDecode(attrInfo) }}
                </span>
              </p>
              <dl v-show="catInfo.showGift" class="free_gift">
                <dt>사은품</dt>
                <dd
                  v-for="(giftInfo, giftIdx) in catInfo.gifts"
                  :key="giftIdx + '_6'"
                >
                  {{ catInfo.gifts.length === 1 ? '' : (giftIdx + 1) + '.' }} {{ htmlDecode(giftInfo.name) }}
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
        </li>
      </ul>
    </div>
    <label class="select mt8">
      <select v-model="globalVal.reasonOptionValue" @change="onchangeReasonOption">
        <template v-for="(reasonOptionItem, indexReasonOption) in reasonOptionList">
          <option
            :key="indexReasonOption"
            :value="reasonOptionItem.value"
          >{{ reasonOptionItem.text }}
          </option>
        </template>
      </select>
    </label>
    <span class="input_group">
      <label>
        <textarea v-model="globalVal.reasonTextValue"
                  :disabled="disabledReasonText"
                  placeholder="반품 상세 사유를 입력해 주세요.(한글 50자 이내)"
                  class="form textarea"
                  @keyup="keyupReasonMessage"
        />
      </label>
    </span>
    <div class="title_wrap">
      <h3 class="subject line">
        수거지 선택
      </h3>
      <button
        type="button"
        class="btn"
        @click="onclickChangeReturnAddress()"
      >
        <span>회수지 변경</span>
      </button>
    </div>
    <div class="order_list">
      <ul class="product_info">
        <li>
          <div class="delivery_point">
            <div class="flex">
              <p class="name">
                {{ pickupInfoData.receiverName }}
              </p>
            </div>
            <div class="address">
              {{ pickupInfoData.address1 }} {{ isNull(pickupInfoData.address2) ? '' : pickupInfoData.address2 }}
            </div>
            <p class="phone">
              휴대폰: {{ isNull(pickupInfoData.phone2) ? pickupInfoData.phone1 : pickupInfoData.phone2 }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <label class="select mt8">
      <select v-model="globalVal.pickupOptionValue" @change="onchangePickupOption()">
        <option value="">수거 메세지 선택</option>
        <option value="수거 전 연락바랍니다.">수거 전 연락바랍니다.</option>
        <option value="경비실(관리실)에서 수거하여 주세요.">경비실(관리실)에서 수거하여 주세요.</option>
        <option value="부재시 휴대폰으로 연락바랍니다.">부재시 휴대폰으로 연락바랍니다.</option>
        <option value="직접 입력(20자 이내)">직접 입력(20자 이내)</option>
      </select>
    </label>
    <span class="input_group">
      <label>
        <input
          v-model="globalVal.pickupTextValue"
          :disabled="disabledPickupText"
          type="text"
          title="직접 입력(20자 이내)"
          placeholder="직접 입력(20자 이내)"
          maxlength="20"
          class="form text"
          @keyup="keyupPickupMessage"
        >
      </label>
    </span>
    <div class="btn_group">
      <button
        type="button"
        class="btn"
        @click="onclickNextStep()"
      >
        <span>다음</span>
      </button>
    </div>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import {
  getCutBytes,
  isNull,
  getPhoneNumber,
  getBytes,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import popupUtil from '@frameworks/popupUtil'
import uiUtil from '@utils/uiUtil'

import orderReturnStepMixin from '@/mixins/order/return/orderReturnStepMixin'
import PaymentData from '@/common/order/sheet/paymentData'
import NsImg from '@components/common/NsImg'
import orderReturnStep1Service from '@services/order/return/orderReturnStep1Service'

export default {
  name: 'OrderReturnStep1',
  components: {
    NsImg
  },
  mixins: [
    orderReturnStepMixin
  ],
  props: {
    globalVal: {
      type: Object,
      required: true
    },
    orderReturnInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      catList: [],
      reasonOptionList: [],
      disabledReasonText: true,
      disabledPickupText: true
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    pickupInfoData () {
      return this.globalVal.pickupInfoData
    }
  },
  created () {
    this.init()
  },
  methods: {
    isNull,
    htmlDecode,
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      if (loginUtil.isLoggedIn()) {
        this.globalVal.reasonPhoneValue = this.globalVal.mOutputDatas.msg.root.userInfo.phone1
      }
      this.setRefundOrdersInfo()
      this.getReason()
      this.setChangeReturnAddress()
    },
    /**
     * 반품사유 조회
     * @returns {void}
     */
    getReason () {
      const invokeParams = {
        tasknm: 'ordrsn',
        var: 'RETURN'
      }
      orderReturnStep1Service.getReason(invokeParams, this.responseCommnCode)
    },
    /**
     * 반품사유 조회 callback
     * @param {Object} data - 요청 결과 data
     * @returns {void}
     */
    responseCommnCode (data) {
      this.reasonOptionList.push({ text: '반품사유를 선택하세요.', value: '' })
      for (let i = 0; i < data.list.length; i++) {
        this.reasonOptionList.push({ text: data.list[i].LV3_NAME, value: data.list[i].LV3_ID })
      }
    },
    /**
     * 반품사유 선택
     * @returns {void}
     */
    onchangeReasonOption () {
      this.disabledReasonText = this.globalVal.reasonOptionValue === ''
      this.globalVal.reasonOptionText = this.getReasonText()
      this.globalVal.reasonTextValue = ''
    },
    /**
     * 반품사유 Text
     * @returns {String}
     */
    getReasonText () {
      const temp = this.reasonOptionList.filter(o => {
        return o.value === this.globalVal.reasonOptionValue
      })
      return temp.length > 0 ? temp[0].text : ''
    },
    /**
     * 반품사유 입력
     * @returns {void}
     */
    keyupReasonMessage (e) {
      const text = getCutBytes(e.target.value, 100)
      e.target.value = text
      this.globalVal.reasonTextValue = text
    },
    /**
     * 회수지설정
     * @returns {void}
     */
    setChangeReturnAddress () {
      const data = this.globalVal.mOutputDatas.orders.cats[0]
      let isApply = false

      if (!isNull(data.selfAddress) &&
            this.globalVal.mInputParams.objCats.addressId === data.selfAddress.addressId) {
        this.globalVal.pickupInfoData = data.selfAddress
        this.globalVal.pickupInfoData.receiverName = data.selfAddress.lastname
        isApply = true
      }

      if (!isApply && !isNull(data.orgship) &&
            this.globalVal.mInputParams.objCats.addressId === data.orgship.addressId) {
        this.globalVal.pickupInfoData = data.orgship
        this.globalVal.pickupInfoData.receiverName = data.orgship.lastname
      }
    },
    /**
     * 회수지변경
     * @returns {void}
     */
    onclickChangeReturnAddress () {
      const ordAddr = this.globalVal.pickupInfoData
      this.globalVal.productInfo = { deliveryDateSelected: '' }

      const param = {
        title: '회수지 선택',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        paymentData: {
          Delivery: new PaymentData.Delivery()
        },
        consultYn: 'Y',
        ordAddr,
        multiYn: 'N',
        multiIdx: 0,
        chargeItems: [],
        mypageYn: 'N'
      }

      const callback = result => {
        this.checkPickupAddress(result)
      }

      popupUtil.show('order/sheet/OrderSheetAddressBook', param, callback)
    },
    /**
     * 수거가능지역 여부 조회
     * @param {Object} result - 회수지 정보
     * @returns {void}
     */
    checkPickupAddress (result) {
      if (!isNull(result)) {
        const invokeParams = {
          tasknm: 'checkPickupAddress',
          var: `${loginUtil.userId()},${result.cst_addrId},${this.globalVal.mInputParams.ordersId}`
        }
        orderReturnStep1Service.checkPickupAddress(invokeParams, data => {
          if (data.list.resultCd === '00') {
          // 수거가능
            this.globalVal.pickupInfoData.addressId = result.cst_addrId
            this.globalVal.pickupInfoData.lastname = result.lastname
            this.globalVal.pickupInfoData.phone1 = result.phone1.trim()
            this.globalVal.pickupInfoData.phone2 = isNull(result.phone2) ? '' : result.phone2.trim()
            this.globalVal.pickupInfoData.address1 = result.cst_addr
            this.globalVal.pickupInfoData.address2 = result.cst_addrDetail
            this.globalVal.pickupInfoData.zipcode = result.cst_zipCode
            this.globalVal.pickupInfoData.receiverName = result.receiverName
            this.globalVal.pickupInfoData.ziptype = result.fax1
          } else if (data.list.resultCd === '98') {
            messageUtil.alert('해당 지역으로 수거가 불가합니다. 다른 수거지를 선택해주세요.')
          } else {
            messageUtil.alert('본 상품의 반품은 상담원을 통해서 신청해 주시기 바랍니다.', () => {
              this.orderReturnInfo.result = 'FAIL'
              this.$store.commit('popup/hide', { result: this.orderReturnInfo.result })
            })
          }
        })
      }
    },
    /**
     * 수거메시지 선택
     * @returns {void}
     */
    onchangePickupOption () {
      if (this.globalVal.pickupOptionValue === '직접 입력(20자 이내)') {
        this.globalVal.pickupTextValue = ''
        this.disabledPickupText = false
      } else {
        this.globalVal.pickupTextValue = this.globalVal.pickupOptionValue
        this.disabledPickupText = true
      }
    },
    /**
     * 수거 메시지
     * @returns {void}
     */
    keyupPickupMessage () {
      this.globalVal.pickupTextValue = getCutBytes(this.globalVal.pickupTextValue, 40)
    },
    /**
     * 반품신청 다음단계
     * @returns {void}
     */
    onclickNextStep () {
      if (!this.validate()) {
        return false
      }
      this.setRefundData()
    },
    /**
     * 유효성 검사 (ASIS: callRefundSecondStepInfo)
     * @returns {boolean}
     */
    validate () {
      if (isNull(this.globalVal.reasonOptionValue)) {
        messageUtil.alert('반품사유를 선택해주세요.')
        return false
      }

      if (isNull(this.globalVal.reasonTextValue)) {
        messageUtil.alert('반품 상세사유를 입력해주세요.')
        return false
      }

      if (this.globalVal.pickupOptionValue === '직접 입력(20자 이내)' &&
        this.globalVal.pickupTextValue.length > 0 &&
        (getBytes(this.globalVal.pickupTextValue) > 120)) {
        messageUtil.alert('수거메시지는 120byte를 초과할 수 없습니다.')
        return false
      }

      return true
    },
    /**
     * 반품정보 설정
     * @returns {void}
     */
    setRefundData () {
      const data = this.globalVal.pickupInfoData
      const type = data.ziptype === '200' ? '2' : '1'

      this.globalVal.mOutputDatas.orders.cats[0].pickupInfo = {
        addressId: data.addressId,
        businesstitle: '',
        conv_dt: '',
        conv_tel11: '',
        conv_tel12: '',
        conv_tel13: '',
        deliv_addr1: data.address1,
        deliv_addr2: data.address2,
        deliv_message: this.globalVal.pickupTextValue,
        deliv_name: data.receiverName,
        deliv_tel11: getPhoneNumber(data.phone1, '1'),
        deliv_tel12: getPhoneNumber(data.phone1, '2'),
        deliv_tel13: getPhoneNumber(data.phone1, '3'),
        deliv_tel21: getPhoneNumber(data.phone2, '1'),
        deliv_tel22: getPhoneNumber(data.phone2, '2'),
        deliv_tel23: getPhoneNumber(data.phone2, '3'),
        deliv_zipcd1: '',
        deliv_ziptype: data.ziptype,
        ordersId: this.globalVal.mInputParams.ordersId,
        type
      }

      this.globalVal.mOutputDatas.orders.orderitems[0].returnInfo = {
        occurType: '100',
        ordersId: this.globalVal.mInputParams.ordersId,
        phone11: getPhoneNumber(data.phone1, '1'),
        phone12: getPhoneNumber(data.phone1, '2'),
        phone13: getPhoneNumber(data.phone1, '3'),
        rsn: this.globalVal.reasonOptionValue,
        rsnDesc: this.globalVal.reasonOptionText,
        rsnDtl: this.globalVal.reasonTextValue,
        orderitemsId: this.globalVal.mOutputDatas.orders.orderitems[0].orderitemsId
      }

      this.globalVal.mOutputDatas.orders.cats[0].returnInfo = {
        occurType: '100',
        ordersId: this.globalVal.mInputParams.ordersId,
        phone11: getPhoneNumber(data.phone1, '1'),
        phone12: getPhoneNumber(data.phone1, '2'),
        phone13: getPhoneNumber(data.phone1, '3'),
        rsn: this.globalVal.reasonOptionValue,
        rsnDesc: this.globalVal.reasonOptionText,
        rsnDtl: this.globalVal.reasonTextValue
      }

      this.globalVal.mOutputDatas.orders.cats[0].exchangeInfo = {
        occurType: '200',
        ordersId: this.globalVal.mInputParams.ordersId
      }

      this.globalVal.mOutputDatas.orders.cats[0].cancelInfo = {
        occurType: '600',
        ordersId: this.globalVal.mInputParams.ordersId
      }

      this.globalVal.mOutputDatas.orders.cats[0].modQuantity = 0 // 반품할 수량
      this.globalVal.mOutputDatas.orders.cats[0].custChargeYn = 'N' // 추가비용 여부

      const dataset = []
      dataset[0] = {}

      this.globalVal.mOutputDatas.orders.newAddrs = dataset
      const pageDataset = []
      pageDataset[0] = this.globalVal.mOutputDatas.orders

      const invokeParams = {
        subTasknm: 'payment',
        tasknm: 'RETURN',
        ordsid: this.globalVal.mInputParams.ordersId,
        channel: 'mobile',
        counselorOrderCancel: 'Y',
        pageData: JSON.stringify(pageDataset)
      }
      // 환불정보확인 단계 정보 조회
      orderReturnStep1Service.setRefundData(invokeParams, data => {
        if (!data.msg || !data.msg.root || !data.msg.root.orders || data.msg.root.orders.length === 0 ||
                data.msg.root.orders[0] == null || data.msg.root.orders[0] === '') {
          messageUtil.alert('본 상품의 반품은 상담원을 통해서 신청해 주시기 바랍니다.', () => {
            this.orderReturnInfo.result = 'FAIL'
            this.$store.commit('popup/hide', { result: this.orderReturnInfo.result })
          })
        } else {
          this.globalVal.mOutputDatas.orders = data.msg.root.orders[0]
          this.globalVal.showStep1 = false
          uiUtil.scrollMove('orderReturnArea')
          setTimeout(() => {
            this.globalVal.showStep2 = true
            this.$root.$emit('orderReturnStep2Emit')
          }, 50)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/return/OrderReturnStep1";
</style>
