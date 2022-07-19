<template>
  <div class="order_sheet_address_multi">
    <h3 class="subject">
      여러 곳으로 배송 받기
    </h3>
    <label class="select">
      <select
        v-model="multiDeliveryCount"
        @change="changeMultiDeliverySelect()"
      >
        <option
          v-for="(deliveryCnt, deliveryCntIdx) in maxTotalDeliveryCountList"
          :key="deliveryCntIdx"
          :value="deliveryCnt"
        >{{ deliveryCnt }}군데</option>
      </select>
    </label>
    <ul>
      <!-- 배송지 -->
      <li
        v-for="(multiDelivery, multiIdx) in multiDeliveryCount"
        :key="multiIdx"
      >
        <h3 class="subject mt32">
          배송지 {{ multiDelivery }}
        </h3>
        <div :id="'delivery_'+multiIdx" class="delivery_point" :class="[isDeliveryWrong[multiIdx] ? 'coral_border' : '']" @click="clickAddressBookLink(multiIdx)">
          <div v-if="multi[multiIdx].isDeliveryPointShow">
            <p class="name">
              {{ multi[multiIdx].recipientName }}
              <span v-show="multi[multiIdx].isDeliveryBasicIconShow" class="coral">기본 배송지</span>
              <span v-show="multi[multiIdx].isDeliveryLatestIconShow" class="mint">최근 배송지</span>
              <span v-show="multi[multiIdx].isDeliverySafeIconShow" class="blue">안심 택배함</span>
            </p>
            <div class="address">
              {{ multi[multiIdx].addr }} {{ multi[multiIdx].addrDetail }}
            </div>
            <p class="phone">
              휴대폰: {{ multi[multiIdx].phone11 }}-{{ multi[multiIdx].phone12 }}-{{ multi[multiIdx].phone13 }}
            </p>
          </div>
          <div v-else>
            <p>
              배송지를 입력해 주세요.
            </p>
            <p v-show="isDeliveryWrong[multiIdx]" class="wrong">
              필수입력 사항입니다. 선택해 주세요.
            </p>
          </div>
        </div>
        <p class="delivery_box" :style="globalVal.deliveryInfo.checkFlag === 1 ? '' : 'display:none;'">
          <button type="button" @click="clickSafeDeliveryLink(multiIdx)">
            안심 택배함으로 받기
          </button>
        </p>
        <label class="select">
          <select
            v-model="multi[multiIdx].shippingMessageSelected"
            @change="changeShippingMsg(multiIdx)"
          >
            <option value="">
              수령장소를 선택해 주세요.
            </option>
            <option value="문앞">
              문앞
            </option>
            <option value="경비실">
              경비실
            </option>
            <option value="직접수령, 부재 시 경비실">
              직접수령, 부재 시 경비실
            </option>
            <option value="택배함">
              택배함
            </option>
            <option
              v-for="(custDeliveryMsg, msgIdx) in custDeliveryMsgList"
              :key="msgIdx"
              :value="custDeliveryMsg.value"
            >
              {{ custDeliveryMsg.text }}
            </option>
            <option value="직접입력(20자 이내)">
              직접입력(20자 이내)
            </option>
          </select>
        </label>
        <!-- 셀렉트 박스 직접 입력(20자 이내) 선택시 노출 -->
        <span v-show="multi[multiIdx].isShippingMessageShow" class="input_group">
          <label>
            <input
              :value="multi[multiIdx].shippingMessage"
              type="text"
              title="직접입력(20자 이내)"
              class="form text"
              placeholder="직접입력(20자 이내)"
              @input="multi[multiIdx].shippingMessage = $event.target.value"
              @keyup="keyupShippingMessage(multiIdx)"
            >
          </label>
        </span>
        <h3 class="subject mt32">
          받으실 상품
        </h3>
        <ul class="receive_list">
          <li
            v-for="(item, itemIdx) in itemList"
            :key="itemIdx"
          >
            <p class="title">
              {{ (item.itemDetailInfo.brandName && item.itemDetailInfo.brandName !== '미정의' ? '[' + item.itemDetailInfo.brandName + ']' : '') }}{{ htmlDecode(item.itemDetailInfo.productName) }}
            </p>
            <div class="option_box">
              <div class="option_wrap">
                <template v-if="item.goodsDetail.STYLE_MNG_YN === 'Y' && item.attributes && item.attributes.length > 0">
                  <p
                    v-for="(attr, attrIdx) in item.attributes"
                    :key="attrIdx"
                    class="option"
                  >
                    {{ attr.VALUE || attr.NAME }}
                  </p>
                </template>
              </div>
              <div>
                <label class="select">
                  <select
                    v-model="globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx]"
                    @change="changeItemCntSelect(multiIdx, itemIdx)"
                  >
                    <option value="0">0</option>
                    <option
                      v-for="qty in toNumeric(item.goodsDetail.QUANTITY)"
                      :key="qty"
                      :value="qty"
                    >
                      {{ qty }}
                    </option>
                  </select>
                </label>
                <span>/ {{ item.goodsDetail.QUANTITY }}</span>
              </div>
            </div>
            <div v-if="item.selectGift && item.selectGift.length > 0">
              <dl class="free_gift">
                <dt>사은품</dt>
                <div
                  v-for="(gift, giftIdx) in item.selectGift"
                  :key="giftIdx"
                >
                  <div v-if="gift.value === undefined">
                    <dd>{{ gift.name }}</dd>
                  </div>
                  <div v-else>
                    <dd>{{ gift.value }}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </li>
        </ul>
        <p class="delivery_charge">
          <!-- 배송비 <strong>{{ Number(globalVal.deliveryInfo.multi[multiIdx].shipCharge) + Number(globalVal.deliveryInfo.multi[multiIdx].rmaShipCharge) }}</strong>원 -->
          배송비 <strong>{{ insertCommas(Number(globalVal.deliveryInfo.multi[multiIdx].shipCharge)) }}</strong>원
        </p>
      </li>
    </ul>
    <div class="button_save">
      <button
        type="button"
        class="btn"
        @click="clickMultiDeliverySaveBtn()"
      >
        <span>저장</span>
      </button>
    </div>
  </div>
</template>

<script>
import {
  htmlDecode,
  getPhoneNumber,
  isNull,
  getCutBytes,
  toNumeric,
  getBytes,
  insertCommas
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import messageUtil from '@frameworks/messageUtil'
import shippingChargeMixin from '@/mixins/order/sheet/delivery/shippingChargeMixin'
import doShippingChargeCmdMixin from '@/mixins/order/sheet/delivery/doShippingChargeCmdMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import orderSheetAddressMultiService from '@services/order/sheet/orderSheetAddressMultiService'
import uiUtil from '@utils/uiUtil'
import bizUtil from '@utils/bizUtil'

export default {
  mixins: [
    shippingChargeMixin,
    doShippingChargeCmdMixin,
    finalPaymentAmountMixin
  ],
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {},
      paymentData: {},
      resultMulti: {},
      maxTotalDeliveryCount: 0,
      maxTotalDeliveryCountList: [],
      multiDeliveryNumOptions: [], // 배송받을 주소 횟수 옵션
      multiDeliveryCount: '1', // 배송받을 주소 횟수
      multi: [{
        recipientName: '', // 배송지명
        addressId: '',
        addr: '', // 배송지 주소
        addrDetail: '', // 배송지 상세주소
        phone11: '', // 배송지 휴대폰번호1
        phone12: '', // 배송지 휴대폰번호2
        phone13: '', // 배송지 휴대폰번호3
        zipCode: '',
        addrFlag: '',
        secAddress1: '',
        secAddress2: '',
        isDeliveryBasicIconShow: false, // 기본 배송지 아이콘
        isDeliveryLatestIconShow: false, // 최근 배송지 아이콘
        isDeliverySafeIconShow: false, // 안심 택배함 아이콘
        shippingMessageSelected: '', // 배송메세지
        shippingMessage: '', // 배송메세지
        isShippingMessageShow: false, // 배송메세지
        isDeliveryPointShow: true,
        sumShipCharge: 0,
        sumRmaShipCharge: 0,
        addInfo: ''
        // selectedCnt: []
      }],
      custDeliveryMsgCallbackData: [],
      custDeliveryMsgList: [], // 배송메세지 리스트
      isShippingMessage: false,
      itemList: [], // 상품리스트
      chargeItems: [],
      multiItemIdx: 0,
      isDeliveryWrong: []
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.paymentData = this.param.paymentData
    this.resultMulti = this.param.resultMulti

    this.init()
  },
  methods: {
    toNumeric,
    htmlDecode,
    insertCommas,
    /**
     * 화면 진입 시 복수 배송지 셋팅
     */
    init () {
      this.chargeItems = this.paymentData.Delivery.deliveryList[0].ITEMS

      // 복수배송지 최대 가능 횟수
      this.maxTotalDeliveryCount = this.globalVal.mOutputDatas.TOTAL_ITEM_COUNT
      if (this.maxTotalDeliveryCount > this.globalVal.deliveryInfo.maxDeliveryCount) {
        this.maxTotalDeliveryCount = this.globalVal.deliveryInfo.maxDeliveryCount // 복수배송지 최대 가능 횟수
      }
      for (let i = 2; i <= this.maxTotalDeliveryCount; i++) {
        this.maxTotalDeliveryCountList.push(i)
      }

      // 상품리스트
      this.itemList = this.globalVal.mOutputDatas.msg.OrderGoodList

      this.clickGetCustDeliveryMsg()

      if (this.resultMulti.length > 0) {
        this.multiDeliveryCount = this.resultMulti.length // n군데

        for (let i = 0; i < this.multiDeliveryCount; i++) {
          this.multi[i] = {
            recipientName: this.resultMulti[i].recipientName, // 배송지명
            addressId: this.resultMulti[i].addressId,
            addr: this.resultMulti[i].addr, // 배송지 주소
            addrDetail: this.resultMulti[i].addrDetail, // 배송지 상세주소
            phone11: this.resultMulti[i].phone11, // 배송지 휴대폰번호1
            phone12: this.resultMulti[i].phone12, // 배송지 휴대폰번호2
            phone13: this.resultMulti[i].phone13, // 배송지 휴대폰번호3
            zipCode: this.resultMulti[i].zipCode,
            addrFlag: this.resultMulti[i].addrFlag,
            secAddress1: this.resultMulti[i].secAddress1,
            secAddress2: this.resultMulti[i].secAddress2,
            isDeliveryBasicIconShow: this.resultMulti[i].isDeliveryBasicIconShow, // 기본 배송지 아이콘
            isDeliveryLatestIconShow: this.resultMulti[i].isDeliveryLatestIconShow, // 최근 배송지 아이콘
            isDeliverySafeIconShow: this.resultMulti[i].isDeliverySafeIconShow, // 안심 택배함 아이콘
            shippingMessageSelected: this.resultMulti[i].shippingMessageSelected, // 배송메세지
            shippingMessage: this.resultMulti[i].shippingMessage, // 배송메세지
            isShippingMessageShow: this.resultMulti[i].isShippingMessageShow, // 배송메세지
            isDeliveryPointShow: this.resultMulti[i].isDeliveryPointShow
          }
        }
      } else {
        // 기본배송지 확인
        let baseAddressLine = null
        if (this.globalVal.mOutputDatas.msg.AddressList && this.globalVal.mOutputDatas.msg.AddressList.length > 0) {
          baseAddressLine = this.globalVal.mOutputDatas.msg.AddressList[0]
          for (let i = 0; i < this.globalVal.mOutputDatas.msg.AddressList.length; i++) {
            if (this.globalVal.mOutputDatas.msg.AddressList[i].ISPRIMARY === '1') {
              baseAddressLine = this.globalVal.mOutputDatas.msg.AddressList[i]
              break
            }
          }
        }
        if (baseAddressLine !== null) {
          this.multi[0].isDeliveryPointShow = true
          this.setBaseAddressLine(baseAddressLine)
        } else {
          // 기본배송지가 없는 경우
          this.multi[0].isDeliveryPointShow = false
        }

        for (let i = 0; i < this.itemList.length; i++) {
          this.globalVal.deliveryInfo.multi[0].selectedCnt[i] = '0'
          this.globalVal.deliveryInfo.multi[0].orderItemsId[i] = this.itemList[i].goodsDetail.ORDERITEMS_ID
          this.globalVal.deliveryInfo.multi[0].catentryId[i] = this.itemList[i].goodsDetail.CATENTRY_ID
        }

        this.multiDeliveryCount = 2
        this.changeMultiDeliverySelect()
      }
      this.isDeliveryWrong[0] = false

      this.$forceUpdate()
    },
    /**
     * 배송지1 출력
     * @param {Object} data - 배송지 정보 object
     */
    setBaseAddressLine (data) {
      // 주소 및 우편번호 분리
      if (data.ADDRESS1.trim().length > 0) {
        const strAddr1 = htmlDecode(data.MOBILE_ADDRESS1)
        if (strAddr1.indexOf('&:') > -1) {
          const arrAddr = strAddr1.split('&:')
          data.ADDRESS2 = arrAddr[0]
          data.ADDRESS3 = arrAddr[1]
        } else {
          data.ADDRESS2 = data.MOBILE_ADDRESS1
          data.ADDRESS3 = ''
        }
      } else {
        data.ZIPCODE = (data.FAX2 || data.ZIPCODE)
      }

      this.multi[0].recipientName = (`${data.LASTNAME} ${data.FIRSTNAME}`).trim() // 배송지명
      this.multi[0].addressId = data.ADDRESS_ID
      this.multi[0].addr = data.ADDRESS2.trim() // 배송지 주소
      this.multi[0].addrDetail = data.ADDRESS3.trim() // 배송지 상세주소
      this.multi[0].phone11 = getPhoneNumber(data.PHONE1.trim(), '1') // 배송지 휴대폰번호1
      this.multi[0].phone12 = getPhoneNumber(data.PHONE1.trim(), '2') // 배송지 휴대폰번호2
      this.multi[0].phone13 = getPhoneNumber(data.PHONE1.trim(), '3') // 배송지 휴대폰번호3
      this.multi[0].zipCode = data.ZIPCODE
      this.multi[0].isDeliveryBasicIconShow = true // 기본 배송지 아이콘
      this.multi[0].isDeliveryLatestIconShow = false // 최근 배송지 아이콘
      this.multi[0].isDeliverySafeIconShow = false // 안심 택배함 아이콘

      // 폼 데이터에 반영
      this.paymentData.Delivery.setItem(0, {
        ADDRESS_ID: data.ADDRESS_ID
      })

      // 배송비 조회 및 계산 및 출력
      this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
        , { zipCode: this.postcode, addrId: data.ADDRESS_ID }
        , this.paymentData.Delivery.deliveryList[0].ITEMS
        , '1'
        , 0
        , this.multiItemIdx)
    },
    /**
     * 배송주소 클릭 시
     * @param {Number} index - 선택된 주소 index
     */
    async clickAddressBookLink (index) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const ordAddr = {
        addrId: this.multi[index].addressId,
        zipCode: this.multi[index].zipCode,
        addr: this.multi[index].addr,
        addrDetail: this.multi[index].addrDetail,
        recipientName: this.multi[index].recipientName,
        phone: `${this.multi[index].phone11}-${this.multi[index].phone12}-${this.multi[index].phone13}`
      }

      const param = {
        title: '배송지 선택',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        paymentData: this.paymentData,
        ordAddr,
        multiYn: 'Y',
        multiIdx: index,
        multiItemIdx: this.multiItemIdx,
        chargeItems: this.chargeItems,
        consultYn: 'N',
        mypageYn: 'N'
      }

      const callback = async result => {
        if (!isNull(result)) {
          this.multi[index].isDeliveryPointShow = true
          this.$forceUpdate()

          this.multi[index].recipientName = result.receiverName
          this.multi[index].isDeliveryBasicIconShow = (result.ispriamry === '1')
          this.multi[index].addressId = result.cst_addrId
          this.multi[index].addr = result.cst_addr
          this.multi[index].addrDetail = result.cst_addrDetail
          this.multi[index].phone11 = getPhoneNumber(result.phone1.trim(), '1')
          this.multi[index].phone12 = getPhoneNumber(result.phone1.trim(), '2')
          this.multi[index].phone13 = getPhoneNumber(result.phone1.trim(), '3')
          this.multi[index].zipCode = result.cst_zipCode
          this.multi[index].addrFlag = result.fax1
          this.multi[index].secAddress1 = result.fax1 === '100' ? result.address2 : result.address1
          this.multi[index].secAddress2 = result.fax1 === '100' ? result.address3 : result.address1

          if (result.cst_addrDetail.substr(result.cst_addrDetail.length - 5, 4) === '무인택배') {
            this.multi[index].isDeliverySafeIconShow = true
            this.multi[index].addInfo = 'X'
            this.multi[index].shippingMessage = '무인택배함 보관'
          } else {
            this.multi[index].isDeliverySafeIconShow = false
          }

          this.isDeliveryWrong[index] = false

          this.paymentData.Delivery.setItem(index, {
            ADDRESS_ID: result.cst_addrId
          })

          // 배송비 조회 및 계산 및 출력
          this.getShippingCharge(index, String(this.globalVal.mInputParams.orderId)
            , { zipCode: this.multi[index].zipCode, addrId: result.cst_addrId }
            , this.paymentData.Delivery.deliveryList[0].ITEMS
            , '1'
            , index
            , this.multiItemIdx)
        }
      }

      popupUtil.show('order/sheet/OrderSheetAddressBook', param, callback)
    },
    /**
     * 안심택배함으로 받기 클릭 시
     * @param {Number} index - 선택된 주소 index
     */
    async clickSafeDeliveryLink (index) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const param = {
        title: '안심 택배함 찾기',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        paymentData: this.paymentData,
        customerData: {
          recipientName: this.globalVal.mOutputDatas.msg.UserInfo.LASTNAME,
          phone: this.globalVal.customerInfo.phNumber
        }
      }

      const callback = result => {
        this.multi[index].isDeliveryPointShow = true

        this.multi[index].isDeliveryBasicIconShow = false
        this.multi[index].isDeliveryLatestIconShow = false
        this.multi[index].isDeliverySafeIconShow = true
        this.multi[index].recipientName = result.recipientName
        this.multi[index].addressId = result.addrId
        this.multi[index].addr = result.addr1
        this.multi[index].addrDetail = result.addr2
        this.multi[index].phone11 = getPhoneNumber(result.phone.trim(), '1')
        this.multi[index].phone12 = getPhoneNumber(result.phone.trim(), '2')
        this.multi[index].phone13 = getPhoneNumber(result.phone.trim(), '3')
        this.multi[index].addInfo = 'X'
        this.multi[index].shippingMessage = '무인택배함 보관'

        // 배송지역 변경시 적립금/예치금, 무료배송 쿠폰 초기화
        this.$root.$emit('changeShippingEmit')

        // 배송비 조회 및 계산 및 출력
        this.getShippingCharge(index, String(this.globalVal.mInputParams.orderId)
          , { zipCode: this.multi[index].zipCode, addrId: result.addrId }
          , this.paymentData.Delivery.deliveryList[0].ITEMS
          , '1'
          , index
          , this.multiItemIdx)

        // 폼 데이터에 반영
        this.paymentData.Delivery.setItem(index, {
          ADDRESS_ID: result.addrId
        })
      }

      popupUtil.show('order/sheet/OrderSheetSafeDeliverySearch', param, callback)
    },
    /**
     * 최근 배송 메세지 목록 호출
     */
    clickGetCustDeliveryMsg () {
      // API가 호출된 적이 없고 비회원이 아니면, API 호출
      if (!this.globalVal.deliveryInfo.bSetCustDeliveryMsg && !isNull(loginUtil.userId())) {
        // NSCustDeliveryMsg API 호출
        const param = {
          userId: loginUtil.userId()
        }

        const successHandling = data => {
          if (!isNull(data) && !isNull(data.msg)) {
            this.custDeliveryMsgCallbackData = data.msg

            // 최근 배송 메시지 목록 개수 만큼 for문 실행
            for (let i = 0; i < this.custDeliveryMsgCallbackData.length; i++) {
              this.custDeliveryMsgList[i] = {
                value: this.custDeliveryMsgCallbackData[i].DELI_MSG,
                text: `(최근) ${this.custDeliveryMsgCallbackData[i].DELI_MSG}`
              }
            }
          }

          // 최근 배송 메시지 리스트 세팅 완료 여부 변경
          this.globalVal.deliveryInfo.bSetCustDeliveryMsg = true

          // 배송 메시지 리스트 가져온 여부 추가
          this.isShippingMessage = true

          this.$forceUpdate()
        }

        orderSheetAddressMultiService.clickGetCustDeliveryMsg(param, successHandling)

      // API가 호출된적이 있거나, 비회원일 경우
      } else {
        // 최근 배송 메시지를 리스트에 추가하지 않았고, 비회원이 아니면, 기존에 받아온 최근 배송 메시지 추가
        if (!this.isShippingMessage && !isNull(loginUtil.userId())) {
          // 최근 배송 메시지 리스트 추가
          for (let i = 0; i < this.custDeliveryMsgCallbackData.length; i++) {
            this.custDeliveryMsgList[i] = {
              value: this.custDeliveryMsgCallbackData[i].DELI_MSG,
              text: `(최근) ${this.custDeliveryMsgCallbackData[i].DELI_MSG}`
            }
          }
        }

        // 배송 메시지 리스트 가져온 여부 추가
        this.isShippingMessage = true

        this.$forceUpdate()
      }
    },
    /**
     * 배송메세지 변경
     * @param {Number} index - 선택된 주소 index
     */
    changeShippingMsg (index) {
      if (this.multi[index].shippingMessageSelected === '직접입력(20자 이내)') {
        this.multi[index].isShippingMessageShow = true
        this.multi[index].shippingMessage = ''
      } else {
        this.multi[index].shippingMessage = this.multi[index].shippingMessageSelected
        this.multi[index].isShippingMessageShow = false
      }
      this.$forceUpdate()
    },
    /**
     * 배송메세지 입력
     * @param {Number} index - 선택된 주소 index
     */
    keyupShippingMessage (index) {
      if (getBytes(this.multi[index].shippingMessage) > 40) {
        messageUtil.alert('한글20글자를 초과 입력할 수 없습니다. 초과된 내용은 자동으로 삭제됩니다.', () => {
          this.multi[index].shippingMessage = getCutBytes(this.multi[index].shippingMessage, 40)
        }, '확인')
      }
    },
    /**
     * 배송 받는 곳 횟수 변경 시
     */
    changeMultiDeliverySelect () {
      this.multi = [{
        recipientName: this.multi[0].recipientName, // 배송지명
        addressId: this.multi[0].addressId,
        addr: this.multi[0].addr, // 배송지 주소
        addrDetail: this.multi[0].addrDetail, // 배송지 상세주소
        phone11: this.multi[0].phone11, // 배송지 휴대폰번호1
        phone12: this.multi[0].phone12, // 배송지 휴대폰번호2
        phone13: this.multi[0].phone13, // 배송지 휴대폰번호3
        zipCode: this.multi[0].zipCode,
        addrFlag: '',
        secAddress1: '',
        secAddress2: '',
        isDeliveryBasicIconShow: this.multi[0].isDeliveryBasicIconShow, // 기본 배송지 아이콘
        isDeliveryLatestIconShow: this.multi[0].isDeliveryLatestIconShow, // 최근 배송지 아이콘
        isDeliverySafeIconShow: this.multi[0].isDeliverySafeIconShow, // 안심 택배함 아이콘
        shippingMessageSelected: '', // 배송메세지
        shippingMessage: '', // 배송메세지
        isShippingMessageShow: false, // 배송메세지
        isDeliveryPointShow: this.multi[0].isDeliveryPointShow
      }]

      for (let i = 1; i < this.multiDeliveryCount; i++) {
        this.globalVal.deliveryInfo.multi[i] = {
          orderItemsId: [],
          selectedCnt: [],
          catentryId: [],
          shipCharge: 0, // 총 배송비
          rmaShipCharge: 0 // 추가 배송비
        }

        this.multi[i] = {
          recipientName: '', // 배송지명
          addressId: '',
          addr: '', // 배송지 주소
          addrDetail: '', // 배송지 상세주소
          phone11: '', // 배송지 휴대폰번호1
          phone12: '', // 배송지 휴대폰번호2
          phone13: '', // 배송지 휴대폰번호3
          isDeliveryBasicIconShow: false, // 기본 배송지 아이콘
          isDeliveryLatestIconShow: false, // 최근 배송지 아이콘
          isDeliverySafeIconShow: false, // 안심 택배함 아이콘
          shippingMessageSelected: '', // 배송메세지
          shippingMessage: '', // 배송메세지
          isShippingMessageShow: false, // 배송메세지
          isDeliveryPointShow: false
        }

        for (let j = 0; j < this.itemList.length; j++) {
          this.globalVal.deliveryInfo.multi[i].selectedCnt[j] = 0
          this.globalVal.deliveryInfo.multi[i].orderItemsId[j] = this.itemList[j].goodsDetail.ORDERITEMS_ID
          this.globalVal.deliveryInfo.multi[i].catentryId[j] = this.itemList[j].goodsDetail.CATENTRY_ID
        }

        this.isDeliveryWrong[i] = false
      }

      this.$forceUpdate()
    },
    /**
     * 받으실 상품 수량 변경 시
     * @param {Number} multiIdx - 선택된 주소 index
     * @param {Number} itemIdx - 선택된 상품 index
     */
    async changeItemCntSelect (multiIdx, itemIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      let sumCnt = 0
      this.multiItemIdx = itemIdx

      for (let i = 0; i < this.multiDeliveryCount; i++) {
        if (i !== multiIdx) {
          sumCnt += Number(this.globalVal.deliveryInfo.multi[i].selectedCnt[itemIdx])
        }
      }

      if ((sumCnt + Number(this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx])) > this.itemList[itemIdx].goodsDetail.QUANTITY) {
        messageUtil.alert('주문 수량보다 많은 수량을 입력 할 수 없습니다.')
        this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx] = '0'
        this.globalVal.deliveryInfo.multi[multiIdx].shipCharge = '0'
        this.globalVal.deliveryInfo.multi[multiIdx].rmaShipCharge = '0'
        this.$forceUpdate()
      }

      if (this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx] === '0') {
        this.globalVal.deliveryInfo.multi[multiIdx].shipCharge = '0'
        this.globalVal.deliveryInfo.multi[multiIdx].rmaShipCharge = '0'
        this.$forceUpdate()
      }

      // 배송비 조회 및 계산 및 출력
      this.getShippingCharge(multiIdx, String(this.globalVal.mInputParams.orderId)
        , { zipCode: this.multi[multiIdx].zipCode, addrId: '' }
        , this.chargeItems
        , '1'
        , multiIdx
        , this.multiItemIdx)
    },
    /**
     * 저장 버튼 클릭 시
     */
    async clickMultiDeliverySaveBtn () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      let sumCnt = 0

      this.multi[0].sumShipCharge = 0
      this.multi[0].sumRmaShipCharge = 0
      for (let i = 0; i < this.multiDeliveryCount; i++) {
        this.multi[0].sumShipCharge += Number(this.globalVal.deliveryInfo.multi[i].shipCharge) // 총 배송비 합계
        this.multi[0].sumRmaShipCharge += Number(this.globalVal.deliveryInfo.multi[i].rmaShipCharge) // 추가 배송비 합계

        if (this.multi[i].recipientName.trim() === '') {
          // messageUtil.alert('배송지를 입력하세요.')
          this.isDeliveryWrong[i] = true
          uiUtil.scrollMove(`delivery_${i}`, uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.$forceUpdate()
          return false
        } else {
          this.isDeliveryWrong[i] = false
        }

        for (let k = 0; k < this.multiDeliveryCount; k++) {
          if (i !== k) {
            if (this.multi[i].addressId === this.multi[k].addressId) {
              messageUtil.alert('중복된 배송지가 있습니다.')
              return false
            }
          }
        }
      }

      for (let j = 0; j < this.itemList.length; j++) {
        for (let z = 0; z < this.multiDeliveryCount; z++) {
          let isCheckCount = false
          for (let q = 0; q < this.itemList.length; q++) {
            if (Number(this.globalVal.deliveryInfo.multi[z].selectedCnt[q]) !== 0) {
              isCheckCount = true
            }
          }
          if (!isCheckCount) {
            messageUtil.alert('배송지별 상품적용이 완료되지 않았습니다.<br />배송지 수를 다시 선택하거나, 상품을 나누어 적용해주시기 바랍니다.')
            return false
          }

          sumCnt += Number(this.globalVal.deliveryInfo.multi[z].selectedCnt[j])
        }

        if (sumCnt < this.itemList[j].goodsDetail.QUANTITY) {
          messageUtil.alert('주문 수량을 확인하세요.')
          return false
        }
        sumCnt = 0
      }

      this.globalVal.deliveryInfo.resultMulti = this.multi

      this.$store.commit('popup/hide', this.multi)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetAddressMulti";
</style>
