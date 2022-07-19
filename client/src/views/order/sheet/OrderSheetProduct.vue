<template>
  <div class="order_sheet_product">
    <!-- 주문상품 -->
    <h3 class="subject">
      주문상품
    </h3>
    <ul class="product_info">
      <li
        v-for="(item, itemIdx) in itemList"
        :key="itemIdx"
      >
        <div class="box">
          <div v-show="isDispImgShow">
            <figure>
              <ns-img
                :product-number="item.itemDetailInfo.partNumber"
                :width="144"
                :height="144"
                :alt="item.itemDetailInfo.productName"
                :is-adult="item.itemDetailInfo.adultItemFlag"
              />
              <strong class="sold-out">품절</strong>
            </figure>
          </div>
          <div v-show="isDispImg25Show">
            <!-- <a
              href="javascript:;"
              @click="onclickLinkProductDetail(item.itemDetailInfo.partNumber)"
            > -->
            <a href="javascript:;">
              <figure>
                <ns-img
                  :product-number="item.itemDetailInfo.partNumber"
                  :width="144"
                  :height="144"
                  :alt="item.itemDetailInfo.productName"
                  :is-adult="item.itemDetailInfo.adultItemFlag"
                />
              </figure>
            </a>
          </div>
          <div class="field">
            <div v-show="isDispTitleShow">
              <p class="title">
                {{ (item.itemDetailInfo.brandName && item.itemDetailInfo.brandName !== '미정의' ? '[' + item.itemDetailInfo.brandName + ']' : '') }}{{ htmlDecode(item.itemDetailInfo.productName) }}
              </p>
            </div>
            <div v-show="isDispTitle25Show">
              <p class="title">
                <!-- <a
                  href="javascript:;"
                  @click="onclickLinkProductDetail(item.itemDetailInfo.partNumber)"
                > -->
                <a href="javascript:;">
                  {{ (item.itemDetailInfo.brandName && item.itemDetailInfo.brandName !== '미정의' ? '[' + item.itemDetailInfo.brandName + ']' : '') }}{{ htmlDecode(item.itemDetailInfo.productName) }}
                </a>
              </p>
            </div>
            <ns-price
              :dc-price="item.goodsDetail.PRICE * item.goodsDetail.QUANTITY"
              :buschn-id="item.goodsDetail.XBUSCHN_ID"
              :disp-type-cd="item.goodsDetail.DISP_TYPE_CD"
            />
            <div>
              <div v-if="item.goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD">
                <p class="option">
                  {{ item.goodsDetail.QUANTITY }}개
                </p>
              </div>
              <div v-else-if="item.goodsDetail.STYLE_MNG_YN === 'Y' && item.attributes && item.attributes.length > 0">
                <p class="option">
                  {{ item.goodsDetail.QUANTITY }}개 /
                  <span
                    v-for="(attr, attrIdx) in item.attributes"
                    :key="attrIdx"
                  >
                    <span v-if="attrIdx === 0">
                      {{ attr.VALUE || attr.NAME }}
                    </span>
                    <span v-else>
                      , {{ attr.VALUE || attr.NAME }}
                    </span>
                  </span>
                </p>
              </div>
              <div v-else>
                <p class="option">
                  {{ item.goodsDetail.QUANTITY }}개
                </p>
              </div>
            </div>
            <div>
              <div
                v-for="(val, valIdx) in item.selectChoice"
                :key="valIdx"
              >
                <!-- 초이스 상품 -->
                <div v-if="item.goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.CHOICE">
                  <div v-if="valIdx === 0">
                    <div v-if="item.goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PACK">
                      <p class="option">
                        {{ item.goodsDetail.QUANTITY }}개
                      </p>
                    </div>
                  </div>
                  <div v-else>
                    <p class="option">
                      {{ undefined === val[valIdx].quantity ? '' : item.goodsDetail.QUANTITY }}개 / {{ val[valIdx].name }} {{ undefined === val[valIdx].value ? '' : val[valIdx].value }}
                    </p>
                  </div>
                </div>
                <!-- 팩상품 -->
                <div v-else-if="item.goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PACK">
                  <div
                    v-for="(val2, val2Idx) in item.selectPack"
                    :key="val2Idx"
                  >
                    <div v-if="val2Idx === 0">
                      <div v-if="item.goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PACK">
                        <p class="option">
                          {{ item.goodsDetail.QUANTITY }}개
                        </p>
                      </div>
                    </div>
                    <div v-else>
                      <p class="option">
                        {{ undefined === val2[val2Idx].quantity ? '' : item.goodsDetail.QUANTITY }}개 / {{ val2[val2Idx].name }} / {{ undefined === val2[val2Idx].value ? '' : val2[val2Idx].value }}
                      </p>
                    </div>
                  </div>
                </div>
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
          </div>
        </div>
      </li>
      <div v-show="isDeliveryDateShow" class="collapse_wrap">
        <dl>
          <dt :class="toggleClass ? 'active' : ''">
            <strong class="title">배송일 지정</strong>
            <button
              type="button"
              class="btn collapse"
              @click="onCollapse()"
            >
              펼치기/접기
            </button>
          </dt>
          <dd>
            <ul class="date_list">
              <li
                :class="globalVal.productInfo.deliveryNoDataClass"
                @click="clickDeliveryData('', '')"
              >
                순차배송
              </li>
              <li
                v-for="(option, index) in deliveryDateOptions"
                :key="index"
                :class="globalVal.productInfo.deliveryDataClass[index]"
                @click="clickDeliveryData(index, option)"
              >
                {{ option }}
              </li>
            </ul>
            <ul class="delivery_guide">
              <li>배송일 지정은 주문 다음날 부터 3일까지 가능하며 공휴일은 제외 됩니다.</li>
              <li>배송일을 지정하면 제주/ 도서산간 지역은 주문이 불가하며 또한 주문확인 이후 배송지 변경이 불가합니다.</li>
              <li>배송일 지정 가능 상품은 여러 곳으로 배송 받기가 불가합니다.</li>
            </ul>
          </dd>
        </dl>
      </div>
    </ul>
  </div>
</template>

<script>
import { PRODUCT_CONST } from '@/common/constants/product/product'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import {
  htmlDecode,
  isNull,
  getPhoneNumber,
  extend,
  insertCommas,
  getImageUrl
} from '@utils/commonutil/commonUtil'
import routerUtil from '@frameworks/routerUtil'
import Const from '@constants/framework/framework'
import checkStaffOnlyPrdMixin from '@/mixins/order/sheet/confirm/checkStaffOnlyPrdMixin'
import shippingChargeMixin from '@/mixins/order/sheet/delivery/shippingChargeMixin'
import doShippingChargeCmdMixin from '@/mixins/order/sheet/delivery/doShippingChargeCmdMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import orderSheetProductService from '@services/order/sheet/orderSheetProductService'
import loginUtil from '@utils/loginUtil'

export default {
  name: 'OrderSheetProduct',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    checkStaffOnlyPrdMixin,
    shippingChargeMixin,
    doShippingChargeCmdMixin,
    finalPaymentAmountMixin
  ],
  props: {
    paymentData: {
      type: Object,
      required: true
    },
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      toggleClass: false,
      itemList: [],
      isDispImgShow: false,
      isDispImg25Show: false,
      isDispTitleShow: false,
      isDispTitle25Show: false,
      isDeliveryDateShow: false, // 배송일 지정
      deliveryDateOptions: null, // 지정 배송일
      Const
    }
  },
  computed: {
    PRODUCT_CONST  () {
      return PRODUCT_CONST
    }
  },
  mounted () {
    this.setOrderItemList(this.globalVal.mOutputDatas.msg.OrderGoodList)
    this.globalVal.completeOrderSheetProduct = true
  },
  methods: {
    htmlDecode,
    insertCommas,
    /**
     * 배송일 지정 펼치기/접기
     */
    onCollapse () {
      const collapseWrap = document.querySelector('.collapse_wrap dd')
      const height = collapseWrap.scrollHeight
      if (!this.toggleClass) {
        collapseWrap.style.height = `${height}px`
      } else {
        collapseWrap.style.height = 0
      }
      this.toggleClass = !this.toggleClass
    },
    /**
     * 주문하실 상품 목록을 출력한다.
     * @param {Object} data - 주문정보 object
     */
    setOrderItemList (data) {
      this.itemList = data

      let inventoryQuantityYn = 'Y' // 상품의 재고 유무
      const inventoryQuantityNoneNm = [] // 재고부족 상품목록
      const orderItemList = {
        orderItemIds: [],
        catEntryIds: []
      }

      for (let index = 0; index < data.length; index++) {
        orderItemList.orderItemIds.push(data[index].goodsDetail.ORDERITEMS_ID)
        orderItemList.catEntryIds.push(data[index].itemDetailInfo.partNumber)

        // 배송일지정
        this.globalVal.productInfo.deliveryDesignatedDayCount += data[index].goodsDetail.SLCT_DAY_OBJT_GOODS_YN
        this.globalVal.productInfo.deliveryAagreeDline.push(data[index].goodsDetail.AGREE_DLINE)

        for (let i = 0; i < this.globalVal.productInfo.deliveryAagreeDline.length; i++) {
          if (this.globalVal.productInfo.deliveryAagreeDline[i] <= 2) {
            this.globalVal.productInfo.deliveryAagreeStatus = 'Y'
          } else {
            this.globalVal.productInfo.deliveryAagreeStatus = 'N'
            break
          }
        }

        if (this.globalVal.productInfo.deliveryDesignatedDayCount.indexOf('N') === -1 && this.globalVal.productInfo.deliveryAagreeStatus === 'Y') {
          this.globalVal.productInfo.deliveryDesignatedDayFlag = 'Y'

          this.deliveryDateView() // 배송지정일 날짜 출력

          this.globalVal.productInfo.deliveryIndexSelectHideStatus = 'Y'
          this.isDeliveryDateShow = true
        } else {
          this.globalVal.productInfo.deliveryDesignatedDayFlag = 'N'
          this.isDeliveryDateShow = false
        }

        // 상품 목록 출력R*
        this.setProductItem(index, data[index])

        // 상품 재고 여부 체크
        if (data[index].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.CHOICE) {
          // 초이스 상품일 경우 재고 체크 여부 체크 하지 않음
        } else {
          if (Number(data[index].goodsDetail.INVENTORY_QUANTITY) < Number(data[index].goodsDetail.QUANTITY)) {
            inventoryQuantityYn = 'N'
            inventoryQuantityNoneNm.push(data[index].itemDetailInfo.productName)
          }
        }
      }
      // 배송비 조회 및 계산 및 출력
      this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
        , { zipCode: this.globalVal.deliveryInfo.zipCode, addrId: this.globalVal.deliveryInfo.addrId }
        , this.paymentData.Delivery.deliveryList[0].ITEMS)

      // 상품유형 확인
      if (data[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD ||
          data[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PAPER_GIFTCARD) { // 카드(상품권)
        this.globalVal.dispTypeCd = 'CARD'
      } else if (data[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.DELIVERY &&
                  data[0].goodsDetail.PAY_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PACK) { // 정기주문
        this.globalVal.dispTypeCd = 'DELIVERY'
      } else { // 일반상품 or 정기배송
        this.globalVal.dispTypeCd = 'GENERAL'
      }

      // 상품 재고 여부 체크
      if (inventoryQuantityYn === 'N') {
        messageUtil.alert('품절되었습니다.<br/>빠른 시간 내에 상품을 준비하겠습니다.', () => {
          routerUtil.back()
        })
        return false
      }

      // 최초진입시 상품 종류 갯수
      this.globalVal.productInfo.nCountGds = this.paymentData.Discount.discountList.length

      // 임직원 상품 체크
      this.checkStaffOnlyPrd(orderItemList, 'init')
    },
    /**
     * 배송지정일 날짜 출력
     */
    deliveryDateView () {
      // 예약순차배송으로 인한 개발
      let orderItemIds = ''
      if (this.globalVal.mOutputDatas.msg.OrderGoodList.length > 1 && this.globalVal.mOutputDatas.msg.OrderGoodList.length !== 0) {
        for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
          if (i === this.globalVal.mOutputDatas.msg.OrderGoodList.length - 1) {
            orderItemIds = orderItemIds + this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID
          } else {
            orderItemIds = `${orderItemIds + this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID},`
          }
        }
      } else {
        orderItemIds = orderItemIds + this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.ORDERITEMS_ID
      }
      try {
        const param = {
          tasknm: 'slctDayList',
          var: this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DLVR_WAY_CD1,
          orderid: orderItemIds
        }

        const successHandling = data => {
          if (data.list === undefined || data.list === null || data.list.length === 0) {
            this.isDeliveryDateShow = false
            return ''
          }

          if (this.globalVal.productInfo.fcallProc === 'N') {
            this.deliveryDateOptions = data.list
          }
          this.globalVal.productInfo.fcallProc = 'Y'
        }

        orderSheetProductService.deliveryDateView(param, successHandling)
      } catch (e) {
        // handle exception
        console.error(e)
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(deliveryDateView)${e}`, () => {
          routerUtil.back()
        })
      }
    },
    /**
     * 상품 아이템 출력
     * @param {Number} index - 상품 index
     * @param {Object} data - 상품정보 object
     */
    setProductItem (index, data) {
      if (data.itemDetailInfo.adultItemFlag === 'Y') {
        this.globalVal.productInfo.haveAdultItem = 'Y'
        this.globalVal.productInfo.adultItems.push(data.goodsDetail.ORDERITEMS_ID)
      }

      if (data.goodsDetail.DISP_TYPE_CD !== '25' && data.goodsDetail.INVENTORY_QUANTITY === 0) { // 초이스 상품은 패스
        this.isDispImgShow = true
        this.isDispImg25Show = false
        this.isDispTitleShow = true
        this.isDispTitle25Show = false
      } else {
        this.isDispImgShow = false
        this.isDispImg25Show = true
        this.isDispTitleShow = false
        this.isDispTitle25Show = true
      }

      // 주문 상품 json 데이터에 임시 저장
      this.globalVal.mOutputDatas.orderItem.orderItemIds.push(data.goodsDetail.ORDERITEMS_ID)
      this.globalVal.mOutputDatas.orderItem.catEntryIds.push(data.goodsDetail.CATENTRY_ID_CHILD)
      this.globalVal.mOutputDatas.orderItem.orderItemQuantitys.push(data.goodsDetail.QUANTITY)
      this.globalVal.mOutputDatas.orderItem.orderItemAmount.push(data.goodsDetail.PRICE)
      this.globalVal.mOutputDatas.orderItem.isFlashSaleNew.push(data.itemDetailInfo.isFlashSaleNew)

      // 사은품 목록을 ITEMS에 담아줄 키값으로 파싱
      const arrGift = []
      for (let k = 0; data.selectGift.length > k; k++) {
        const objGeft = {}
        objGeft.GIFTNAME = data.selectGift[k].name
        objGeft.GIFTVALUE = data.selectGift[k].value
        arrGift[arrGift.length] = objGeft
      }
      // 최대구매수량
      let custDurSpr = 0
      let partNumber = 0
      let maxQuantity = 0
      let maxOrderPossQty = 0
      let custPrchQtyLimitYn = 0

      if (data.itemDetailInfo.custDurSpr !== undefined && data.itemDetailInfo.custDurSpr !== null) {
        custDurSpr = data.itemDetailInfo.custDurSpr
      }

      if (data.itemDetailInfo.partNumber !== undefined && data.itemDetailInfo.partNumber !== null) {
        partNumber = data.itemDetailInfo.partNumber
      }

      if (data.itemDetailInfo.maxquantity !== undefined && data.itemDetailInfo.maxquantity !== null) {
        maxQuantity = data.itemDetailInfo.maxquantity
      }

      if (data.itemDetailInfo.maxOrderPossQty !== undefined && data.itemDetailInfo.maxOrderPossQty !== null) {
        maxOrderPossQty = data.itemDetailInfo.maxOrderPossQty
      }

      if (data.itemDetailInfo.custPrchQtyLimitYn !== undefined && data.itemDetailInfo.custPrchQtyLimitYn !== null) {
        custPrchQtyLimitYn = data.itemDetailInfo.custPrchQtyLimitYn
      }
      // 휴일등록상품 메일에 들어갈 휴일문구 수정
      let extShipInfo = `결제후 ${data.goodsDetail.AGREE_DLINE || '3'}일 이내 배송(토,일,공휴일 제외)`
      if (!isNull(data.goodsDetail.CUST_GET_DATE)) {
        const week = ['일', '월', '화', '수', '목', '금', '토']
        const dt = `${data.goodsDetail.CUST_GET_DATE.substring(4, 6)}/${data.goodsDetail.CUST_GET_DATE.substring(6, 8)}/${data.goodsDetail.CUST_GET_DATE.substring(0, 4)}`
        const date = new Date(dt)

        const month = date.getMonth() + 1
        const day = date.getDate()

        extShipInfo = `${month}/${day}(${week[date.getDay()]})까지 <br />배송예정`
      }
      // 휴일등록상품 end

      // 폼 데이터에 반영
      this.paymentData.Product.addItem({
        INDEX: String(index),
        IMG: getImageUrl(data.itemDetailInfo.partNumber, 144, 144),
        HEADNAME: data.goodsDetail.XCATENTRY_DISP_MFNAME,
        GOODSPARTNUMBER: data.itemDetailInfo.partNumber,
        CATENTRYID: data.goodsDetail.CATENTRY_ID_CHILD,
        GOODSCATENTRYID: data.itemDetailInfo.partNumber,
        PRICE: data.goodsDetail.PRICE,
        DCPRICE: data.goodsDetail.DCPRICE,
        SHIPCHARGE: data.goodsDetail.SHIPCHARGE,
        installCnt: data.itemDetailInfo.ifiValue,
        DLVY_GRP_KEY_CNT: data.goodsDetail.DLVY_GRP_KEY_CNT,
        DLVY_GRP_KEY: data.goodsDetail.DLVY_GRP_KEY,
        INTRV: data.goodsDetail.INTRV,
        CNVEY_NUM: data.goodsDetail.CNVEY_NUM,
        BRAND_KOR_NM: data.itemDetailInfo.brandName,
        ITNCATENTRYNM: data.itemDetailInfo.productName,
        PRODUCT_NAME: data.itemDetailInfo.productName,
        DISP_TYPE_CD: data.goodsDetail.DISP_TYPE_CD,
        QUANTITY: data.goodsDetail.QUANTITY,
        ORIGINAL_QUANTITY: data.goodsDetail.QUANTITY,
        ORDERITEMS_ID: data.goodsDetail.ORDERITEMS_ID,
        orderItemId: data.goodsDetail.ORDERITEMS_ID,
        CATENTRY_ID: data.goodsDetail.CATENTRY_ID_CHILD,
        itemId: data.goodsDetail.ORDERITEMS_ID,
        itemQuantity: data.goodsDetail.QUANTITY,
        itemAmt: String(Number(data.goodsDetail.DCPRICE) * Number(data.goodsDetail.QUANTITY)),
        BasePrice: String(Number(data.goodsDetail.PRICE) * Number(data.goodsDetail.QUANTITY)),
        adjustment: String((data.goodsDetail.PRICE - data.goodsDetail.DCPRICE) * Number(data.goodsDetail.QUANTITY) * -1),
        shipCharge: data.goodsDetail.SHIPCHARGE,
        rmaShipCharge: data.goodsDetail.RMASHIPCHARGE,
        DiscountPrice: String(0),
        extShipInfo, // 휴일등록상품 메일에 들어갈 휴일문구 수정.
        PROM_VAL_PAD: data.goodsDetail.PROM_VAL_PAD,
        CARDSENDTYPE: data.goodsDetail.CARDSENDTYPE,
        ITEM_RECEIVER_EMAIL: data.goodsDetail.ITEM_RECEIVER_EMAIL,
        RECEIVER_MOBILE: getPhoneNumber(data.goodsDetail.RECEIVER_MOBILE, '-'),
        CARDMESSAGE: data.goodsDetail.CARDMESSAGE,
        STYLE_MNG_YN: data.goodsDetail.STYLE_MNG_YN,
        STYLEMNGY: data.goodsDetail.STYLE_MNG_YN,
        GIFT_YN: data.goodsDetail.GIFT_YN,
        GIFTN: data.goodsDetail.GIFT_YN,
        selectGift: arrGift,
        ATTRIBUTES: data.attributes,
        RMA_DLVR_YN: data.goodsDetail.RMA_DLVR_YN, // 도서산간 주문 가능 여부, 전문 변경으로 추가

        NORMAL_SL_PRC: data.goodsDetail.NORMAL_SL_PRC,
        APPLY_CST_PRC: data.goodsDetail.APPLY_CST_PRC,
        NORMAL_CST_PRC: String(data.goodsDetail.NORMAL_CST_PRC),

        selectChoice: data.selectChoice, // 초이스상품 리스트
        selectPack: data.selectPack, // 팩상품 리스트

        // 전문 병경으로 추가
        BUSCHN_ID: data.goodsDetail.XBUSCHN_ID,
        XCOST_TYPE_CD: data.goodsDetail.XCOST_TYPE_CD,

        // 전문 변경으로 추가
        GIFTC_GOODS_ID: data.goodsDetail._XCatEntChn_GIFTC_GOODS_ID,
        CAMP_ID: data.goodsDetail._XCatEntChn_CAMP_ID,

        multiCd: data.goodsDetail.MULTI_CD,
        // 최대구매수량
        custDurSpr,
        partNumber,
        maxquantity: maxQuantity,
        maxOrderPossQty,
        custPrchQtyLimitYn,

        intuitiveShippingDate: data.goodsDetail.intuitiveShippingDate,
        busChnId: data.itemDetailInfo.busChnId,
        orderPostPrdnFlag: data.itemDetailInfo.orderPostPrdnFlag,
        custGetDttm: data.itemDetailInfo.custGetDttm,
        installItemFlag: data.itemDetailInfo.installItemFlag,
        deliveryType: data.itemDetailInfo.deliveryType
      })

      for (let j = 0; j < this.paymentData.Product.size(); j++) {
        const item = extend({}, this.paymentData.Product.getItem(j))
        item.ROWID = String(j + 1)
        item.BASEPRICE = item.PRICE
        item.SHIPCHARGE = item.shipCharge
        item.RMASHIPCHARGE = item.rmaShipCharge
        item.TOTALPRODUCT = String(Number(item.BASEPRICE) * Number(item.QUANTITY))
        item.TOTALADJUSTMENT = String(Number(item.adjustment) * -1)
        delete item.itemAmt
        delete item.BasePrice
        delete item.adjustment
        delete item.shipCharge
        this.paymentData.Delivery.setProductItem(0, j, item)
      }
    },
    /**
     * 상품상세 이동
     * @param {String} partNumber - 상품id
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
    //
    /**
     * 배송일 지정 클릭 시
     * @param {Number} index - 배송일 지정 index
     * @param {String} option - 지정 배송일
     */
    async clickDeliveryData (index, option) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      this.globalVal.productInfo.deliveryNoDataClass = ''
      this.globalVal.productInfo.deliveryDataClass[0] = ''
      this.globalVal.productInfo.deliveryDataClass[1] = ''
      this.globalVal.productInfo.deliveryDataClass[2] = ''

      if (index === '' && option === '') {
        // 순차배송
        this.globalVal.productInfo.deliveryNoDataClass = 'active'
        this.globalVal.productInfo.deliveryDateSelected = ''
      } else {
        // 배송일 지정
        this.globalVal.productInfo.deliveryDataClass[index] = 'active'
        this.globalVal.productInfo.deliveryDateSelected = option
        this.$root.$emit('clearPaymentMethodChangeDeliveryDateEmit')
      }
      this.$forceUpdate()

      // 배송비 조회 및 계산 및 출력
      this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
        , { zipCode: this.globalVal.deliveryInfo.zipCode, addrId: this.globalVal.deliveryInfo.addrId }
        , this.paymentData.Delivery.deliveryList[0].ITEMS)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetProduct";
</style>
