<template>
  <div class="order_complete_detail">
    <h3 class="subject">
      주문내역
    </h3>
    <div v-for="(deliveryItem, index) in deliveryList" :key="index" class="order_list">
      <ul class="product_info">
        <li>
          <div class="delivery_point">
            <div class="flex">
              <p class="name">
                <template v-if="deliveryList.length > 1">
                  <span>배송지 {{ index + 1 }}</span>
                </template>
                {{ recipientName[index] }}
              </p>
              <button v-show="!isNspayOneToch()" type="button" class="btn" @click="onclickChangeDelivery(index)">
                <span>배송지 변경</span>
              </button>
            </div>

            <div class="address">
              {{ addr[index] }} {{ addrDetail[index] }}
            </div>
            <p class="phone">
              휴대폰: {{ phone11[index] }}-{{ phone12[index] }}-{{ phone13[index] }}
            </p>
            <p
              v-if="isNotGifticonAndMessage(deliveryItem)"
              class="delivery_msg"
            >
              {{ htmlDecode(deliveryItem.DLVY_MESSAGE) }}
            </p>
          </div>
        </li>

        <!-- 주문상품정보 -->
        <li v-for="(productItem, indexProductItem) in deliveryItem.ITEMS"
            :key="indexProductItem"
        >
          <!-- 상품 아이템 출력 -->
          <div class="box">
            <figure>
              <a href="javascript:;" @click="onclickProductDetail(productItem.GOODSPARTNUMBER, productItem.multiCd)">
                <ns-img
                  :product-number="productItem.GOODSPARTNUMBER"
                  :width="144"
                  :height="144"
                  :alt="productItem.PRODUCT_NAME"
                />
              </a>
            </figure>
            <div class="field">
              <a href="javascript:;" @click="onclickProductDetail(productItem.GOODSPARTNUMBER, productItem.multiCd)">
                <p class="title">
                  {{ getProductTitle(productItem) }}{{ htmlDecode(productItem.PRODUCT_NAME) }}
                </p>
              </a>
              <ns-price
                :dc-price="productItem.BASEPRICE * productItem.QUANTITY"
                :buschn-id="productItem.BUSCHN_ID"
                :disp-type-cd="productItem.DISP_TYPE_CD"
              />
              <p class="option">
                <template
                  v-if="productItem.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.CHOICE"
                >
                  <span
                    v-for="(selectItem, indexSelectItem) in productItem.selectChoice"
                    :key="indexSelectItem"
                  >
                    {{ selectItem.quantity }}개 / {{ selectItem.name }} {{ selectItem.value }}
                  </span>
                </template>

                <template
                  v-if="productItem.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PACK"
                >
                  <span
                    v-for="(selectItem, indexSelectItem) in productItem.selectPack"
                    :key="indexSelectItem"
                  >
                    {{ selectItem.quantity }}개 / {{ selectItem.name }} {{ selectItem.value }}
                  </span>
                </template>

                <template
                  v-show="!(productItem.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.CHOICE || productItem.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PACK)"
                >
                  {{ productItem.QUANTITY }}개
                  <template v-if="productItem.DISP_TYPE_CD !== '55' && productItem.STYLE_MNG_YN === 'Y'">
                    <span
                      v-for="(attributeItem, indexAttributeItem) in productItem.ATTRIBUTES"
                      :key="indexAttributeItem"
                    > / {{ (attributeItem.VALUE || attributeItem.NAME) }}</span>
                  </template>
                </template>

                <template
                  v-if="productItem.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.DELIVERY"
                >
                  <strong class="head">배송주기</strong>
                  <span class="text">
                    <span class="option">간격 : {{ productItem.INTRV }}일</span>
                    <span class="option">배송 : {{ productItem.CNVEY_NUM }}회</span>
                  </span>
                </template>
              </p>

              <dl
                v-if="productItem.selectGift && productItem.selectGift.length > 0"
                class="free_gift"
              >
                <dt>사은품</dt>
                <dd v-for="(giftItem, indexGiftItem) in productItem.selectGift"
                    :key="indexGiftItem"
                >
                  <template v-if="giftItem.GIFTVALUE === undefined">
                    {{ giftItem.GIFTNAME }}
                  </template>
                  <template v-else>
                    {{ giftItem.GIFTVALUE }}
                  </template>
                </dd>
              </dl>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  getDateWithDayFormat
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@utils/bizUtil'
import {
  htmlDecode,
  getPhoneNumber,
  isNull,
  insertCommas,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import popupUtil from '@frameworks/popupUtil'
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@utils/loginUtil'
import toastUtil from '@frameworks/toastUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import orderCompleteDetailService from '@services/order/complete/orderCompleteDetailService'

export default {
  name: 'OrderCompleteDetail',
  components: {
    NsImg,
    NsPrice
  },
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      deliveryList: null,
      ordAddrId: [],
      recipientName: [], // 배송받는자명
      phone11: [], // 휴대폰번호1
      phone12: [], // 휴대폰번호2
      phone13: [], // 휴대폰번호3
      addr: [], // 주소
      addrDetail: [], // 상세주소
      zipCode: [], // 우편번호
      addrFlag: [], // 지번 도로명 구분
      secAddress1: [], // 세컨 주소
      secAddress2: [] // 세컨 상세주소
    }
  },
  computed: {
    /**
     * 복수배송 배송지 정보: 기프티콘일 경우 ui 변경
     * @returns {Boolean}
     */
    isGifticon () {
      return (this.globalVal.detailInfo.productList[0].DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_GIFTISHOW ||
                  this.globalVal.detailInfo.productList[0].DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD)
    },
    PRODUCT_CONST  () {
      return PRODUCT_CONST
    }
  },
  created () {
    this.deliveryList = this.globalVal.detailInfo.deliveryList

    for (let i = 0; i < this.deliveryList.length; i++) {
      this.ordAddrId[i] = this.deliveryList[i].ADDRESS_ID
      this.recipientName[i] = this.deliveryList[i].LASTNAME
      this.addr[i] = this.deliveryList[i].ADDRESS1
      this.addrDetail[i] = this.deliveryList[i].ADDRESS2
      this.phone11[i] = getPhoneNumber(this.deliveryList[i].PHONE1.trim(), '1')
      this.phone12[i] = getPhoneNumber(this.deliveryList[i].PHONE1.trim(), '2')
      this.phone13[i] = getPhoneNumber(this.deliveryList[i].PHONE1.trim(), '3')
    }
  },
  methods: {
    htmlDecode,
    /**
     * 복수배송 배송지 정보: 배송 메시지 - 기프티콘이 아니고, 내용이 있는 경우만 출력
     * @param {Object} data - 배송지 정보 object
     * @returns {void}
     */
    isNotGifticonAndMessage (data) {
      return ((data.ITEMS[0].DISP_TYPE_CD !== '50' || data.ITEMS[0].DISP_TYPE_CD !== '55') && data.DLVY_MESSAGE !== '')
    },

    /**
    * 배송일
    * @param {Object} item - 상품 정보 object
    * @returns {void}
    */
    shippingDate (item) {
      if (isNull(item.intuitiveShippingDate)) {
        return ''
      } else {
        let infoString = '결제후 3일이내 배송(토,일,공휴일제외)'
        if (item.intuitiveShippingDate) {
          if (item.intuitiveShippingDate === '29990101') {
            if (item.busChnId === 'CTCOM' || item.busChnId === 'TV') {
              infoString = '설치/직배송상품 별도 해피콜 예정 <br/>(약 3일 소요)'
            } else {
              infoString = '설치/직배송상품 별도 해피콜 예정'
            }
          } else if (item.intuitiveShippingDate === '29990102') {
            infoString = '상품설명 내 상세배송일정 참고'
          } else {
            infoString = `${getDateWithDayFormat(item.intuitiveShippingDate)} 이내 도착예정`
          }

          if (item.orderPostPrdnFlag === 'Y') {
            infoString += '<p>[주문제작상품]</p>'
          }
        } else if (item.custGetDttm) {
          const custGetDttmInfo = getDateWithDayFormat(item.custGetDttm)
          infoString = custGetDttmInfo

          if (item.installItemFlag === 'Y') {
            infoString += '이내 해피콜 예정'
          } else {
            infoString += '이내 도착 예정'
          }

          if (item.deliveryType === '10') {
            infoString = '예약일정에 따라 출고'
          }
          if (item.orderPostPrdnFlag === 'Y') {
            infoString += '<p>[주문제작상품]</p>'
          }
        }
        return infoString
      }
    },

    /**
     * 주문상품정보 출력: 상품 아이템 출력 - title
     * @param {Object} data - 상품 정보 object
     * @returns {void}
     */
    getProductTitle (data) {
      return (!isNull(data.BRAND_KOR_NM) && data.BRAND_KOR_NM !== '미정의' ? `[${data.BRAND_KOR_NM}]` : '')
    },

    /**
     * 주문상품정보 출력: 상품 아이템 출력 - price
     * @param {Object} data - 상품 정보 object
     * @returns {void}
     */
    getProductAmt (data) {
      return insertCommas(data.BASEPRICE * data.QUANTITY)
    },

    /**
     * 상품 상세보기 링크
     * @param {String} partNumber - 상품코드
     * @param {String} multiCd - 상품코드
     * @returns {void}
     */
    onclickProductDetail (partNumber, multiCd) {
      bizUtil.gotoProductDetail(partNumber, { multiCd })
    },
    /**
     * NSPAY 원터치 결제 여부
     */
    isNspayOneToch () {
      return (this.globalVal.paymentInfo.paymentList[0].payType === '1600' || this.globalVal.paymentInfo.paymentList[0].payType === '1700') &&
      !isNull(this.globalVal.paymentInfo.paymentList[0].nspayOneTouchYn) && this.globalVal.paymentInfo.paymentList[0].nspayOneTouchYn === 'Y'
    },
    /**
     * 배송지 변경
     * @param {Number} index - 배송지 index
     * @returns {void}
     */
    async onclickChangeDelivery (index) {
      if (!this.globalVal.isGuest) {
        await bizUtil.secessionMemberCheker()
      }

      // 주문변경시 주문 lock체크를 하지 않아 체크 로직 추가
      const param = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
          mnm: 'checkOrderStatus',
          args: {
            ordersId: this.globalVal.mInputParams.ordersId
          }
        })
      }

      const successHandling = data => {
        // 상담사 Lock 여부 (DB Transaction)
        if (data.list.lockedOrderYn === 'Y') {
          messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.', () => {
            return false
          })
        }

        const param2 = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
            mnm: 'chkRcOrderDtlStats',
            args:
            {
              ordersId: this.globalVal.mInputParams.ordersId,
              memberId: loginUtil.userId()
            }
          })
        }

        const successHandling2 = data => {
          // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
          if (data.list.respCd !== 'S') {
            messageUtil.alert('주문 상태가 변경되었습니다. 1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.', () => {
              return false
            })
          }

          if (!this.globalVal.isGuest) {
            const deliveryChngGlobalVal = {
              deliveryInfo: '',
              mInputParams: {
                orderId: this.globalVal.mInputParams.ordersId,
                slctDayVal: this.globalVal.mInputParams.slctDayVal,
                bSetCustDeliveryMsg: false
              },
              paymentData: {
                deliveryList: [{
                  ITEMS: this.globalVal.paymentData.deliveryList[index].ITEMS
                }]
              }
            }
            deliveryChngGlobalVal.paymentData.deliveryList[0].ITEMS[0].addressId = this.globalVal.paymentData.deliveryList[index].ADDRESS_ID

            const callback = result => {
              if (result != null) {
                this.recipientName[index] = result.receiverName
                this.phone11[index] = getPhoneNumber(result.phone1.trim(), '1')
                this.phone12[index] = getPhoneNumber(result.phone1.trim(), '2')
                this.phone13[index] = getPhoneNumber(result.phone1.trim(), '3')
                this.addr[index] = result.cst_addr
                this.addrDetail[index] = result.cst_addrDetail
                this.zipCode[index] = result.cst_zipCode
                this.addrFlag[index] = result.fax1
                this.secAddress1[index] = result.fax1 === '100' ? result.address1 : result.address2
                this.secAddress2[index] = result.fax1 === '100' ? result.address1 : result.address3

                const param3 = {
                  orders_id: this.globalVal.mInputParams.ordersId,
                  users_id: loginUtil.userId(),
                  cust_num: loginUtil.custNum(),
                  accptPath: COMM_CONST.DEFAULT_PARAMS.accptPath,
                  deliveryModifyList: `[${JSON.stringify({
                    orgAddress_id: this.ordAddrId[index],
                    ADDRESS_ID: result.addressID,
                    NICKNAME: result.nickname,
                    LASTNAME: this.recipientName[index],
                    DLVY_NICNAME: this.recipientName[index],
                    DLVY_POSTCODE1: this.zipCode[index],
                    DLVY_POSTCODE2: this.zipCode[index],
                    DLVY_ADDRESS1: this.addr[index],
                    DLVY_ADDRESS2: this.addrDetail[index],
                    FAX1: this.addrFlag[index],
                    ZIPCODE: this.zipCode[index],
                    ADDRESS1: this.addr[index],
                    ADDRESS2: this.addrDetail[index],
                    ADDRESS3: this.secAddress2[index],
                    PHONE1TYPE: 'K',
                    PHONE2TYPE: 'T',
                    PHONE1: insertSeparatorPhoneNumber(this.phone11[index] + this.phone12[index] + this.phone13[index], '-'),
                    PHONE2: '',
                    MOBILE_NO11: this.phone11[index],
                    MOBILE_NO12: this.phone12[index],
                    MOBILE_NO13: this.phone13[index],
                    MOBILE_NO21: '',
                    MOBILE_NO22: '',
                    MOBILE_NO23: '',
                    DLVY_MESSAGE: '',
                    ziptype: this.addrFlag[index],
                    SEC_ZIPCODE: this.zipCode[index],
                    SEC_ADDRESS1: this.secAddress1[index],
                    SEC_ADDRESS2: this.secAddress2[index],
                    ADDINFO: ''
                  })}]`,
                  slctDayVal: this.globalVal.mInputParams.slctDayVal // 지정일 배송
                }

                const successHandling3 = data => {
                  if (undefined === data.msg) {
                    messageUtil.alert('배송지 변경을 실패하였습니다.')
                  }
                  // NSSR-28019 배송지 변경 이후 페이지 이동으로 처리(navi.moveBack()으로 할 경우 최근배송지, 배송주소록 선택 시 주문서상세 페이지로 이동하지 않음)
                  if (data.msg.result === 'success' && data.msg.resultCode === '0') {
                    this.ordAddrId[index] = result.addressID
                    this.globalVal.paymentData.deliveryList[index].ADDRESS_ID = result.addressID
                    deliveryChngGlobalVal.paymentData.deliveryList[0].ITEMS[0].addressId = result.addressID
                    this.$forceUpdate()
                    toastUtil.show('배송지가 변경되었습니다.')
                  // 배송지선택 개편 start
                  } else if (data.msg.result === 'failure' && data.msg.resultCode === '1' && data.msg.errorCode === 'M') {
                    if (data.msg.resultMessage !== null && data.msg.resultMessage === 'ADDRESS3_byte_error') { // [NSSR-41375] 주소 변경 시 ADDRESS3 length 길이 체크 추가.
                      messageUtil.alert('주소 상세는 100byte를 초과할 수 없습니다.')
                    } else {
                      messageUtil.alert('배송이 완료되어 주문변경 및 취소 불가능상태입니다.') // inQkang 배송지선택 개편 end
                    }
                  } else {
                    messageUtil.alert('배송지 변경을 실패하였습니다.')
                  }
                }

                orderCompleteDetailService.changeAddress(param3, successHandling3)
              }
            }

            popupUtil.show('order/OrderDeliveryChange', { title: '배송지 변경', titleAlign: 'center', globalVal: deliveryChngGlobalVal }, callback)
          } else {
            popupUtil.show('order/OrderDeliveryChangeGuest', {}, () => {})
          }
        }

        orderCompleteDetailService.chkRcOrderDtlStats(param2, successHandling2)
      }

      orderCompleteDetailService.checkOrderStatus(param, successHandling)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/complete/OrderCompleteDetail";
</style>
