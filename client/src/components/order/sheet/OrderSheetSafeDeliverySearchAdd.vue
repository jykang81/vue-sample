<template>
  <div class="order_sheet_safe_delivery_search_add">
    <div class="order_delivery_add">
      <div>
        <div class="input_field user_name">
          <label
            for="label_user_name"
            class="label_icon"
          >
            받는 분
          </label>
          <span class="input_group">
            <input
              id="label_user_name"
              v-model="recipientName"
              type="text"
              title="받는 분 입력"
              maxlength="10"
              class="form text"
              value=""
              placeholder="받는 분"
            >
          </span>
        </div>
        <div class="input_field phone">
          <label
            for="label_phone"
            class="label_icon"
          >
            휴대전화
          </label>
          <span class="input_group">
            <input
              id="label_phone"
              v-model="phone"
              type="number"
              title="휴대전화 입력"
              maxlength="11"
              class="form text"
              value=""
              placeholder="휴대폰 번호 (‘-’ 없이 입력)"
            >
          </span>
        </div>
        <div class="input_field address">
          <label
            for="label_address"
            class="label_icon"
          >
            우편번호 찾기
          </label>
          <div class="address_box">
            <!-- 우편번호 선택완료시 노출 -->
            <div class="text_address">
              {{ postcode }}<br>
              {{ addr }}
            </div>
            <p class="btn_search">
              <button
                type="button"
                disabled="disabled"
                @click="clickSearchPostCodeBtn()"
              >
                우편번호 검색
              </button>
            </p>
          </div>
          <span class="input_group address_detail">
            <input
              id="label_address"
              v-model="addrDetail"
              type="text"
              title="상세주소 입력"
              class="form text"
              placeholder="상세주소 입력"
              maxlength="100"
            >
          </span>
        </div>
        <label class="mt8">
          <input
            v-model="ipDefaultDest"
            type="checkbox"
            class="checkbox square"
          >
          <span class="check_label">기본 배송지로 저장</span>
        </label>
      </div>
      <p class="bottom_button">
        <button
          type="button"
          class="btn"
          @click="clickSetAddressBtn()"
        >
          <span>저장</span>
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import {
  showSafePostCodeWindows,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import orderSheetSafeDeliverySearchAddService from '@services/order/sheet/orderSheetSafeDeliverySearchAddService'
import bizUtil from '@utils/bizUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {},
      safeData: {},
      customerData: {},
      recipientName: '', // 받는 분
      phone: '', // 휴대폰
      postcode: '', // 우편번호
      zipCode: '',
      addr: '', // 주소
      addrDetail: '', // 상세주소
      addrFlag: '100', // 우편번호 형식(100:지번, 200:도로명주소)
      setAddress1: '', // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
      setAddress2: '', // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
      ipDefaultDest: false, // 기본배송지로 저장 체크박스
      returnData: {}
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.safeData = this.param.safeData
    this.customerData = this.param.customerData

    this.recipientName = this.customerData.recipientName
    this.phone = this.customerData.phone
    this.postcode = this.safeData.newZipCode // 우편번호
    this.zipCode = this.safeData.newZipCode
    this.addr = this.safeData.addr1 // 주소
    this.addrDetail = this.safeData.addr2 // 상세주소
    this.setAddress1 = this.safeData.road1
    this.setAddress2 = this.safeData.road2
  },
  methods: {
    /**
     * 우편번호검색 버튼 클릭
     */
    async clickSearchPostCodeBtn () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      try {
        const callback = result => {
          this.zipCode = (result.picked === 'road' ? result.roadPost : result.addressPost)
          this.postcode = (result.picked === 'road' ? result.roadPost : result.addressPost)
          this.addrFlag = (result.picked === 'road' ? '200' : '100') // 주소타입(100: 지번주소, 200: 도로명주소)
          this.addr = (result.picked === 'road' ? result.road : result.address)
          this.addrDetail = (result.picked === 'road' ? result.roadOther : result.addressOther)
          this.setAddress1 = (result.picked === 'road' ? result.address : result.road) // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
          this.setAddress2 = (result.picked === 'road' ? result.addressOther : result.roadOther) // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
        }

        showSafePostCodeWindows(callback)
      } catch (e) {
        // handle exception
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(clickSearchPostCodeBtn)${e}`, () => {
          this.$store.commit('popup/hide')
        })
      }
    },
    /**
     * 저장 버튼 클릭
     */
    async clickSetAddressBtn () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      try {
        const param = {
          tasknm: 'maxCnt',
          var: loginUtil.userId()
        }

        const successHandling = data => {
          if (data != null && data.list !== null && data.list.resultCd === 'insert') { // 입력 가능 상태
            this.insertShippingAddress()
          } else {
            // 30개 이상 등록 불가
            messageUtil.alert('배송지는 30개까지 등록하실 수 있습니다. 배송주소록을 관리하신 후 추가해 주세요.')
            return false
          }
        }

        // 배송주소록 max size(30)을 넘는지 check
        orderSheetSafeDeliverySearchAddService.clickSetAddressBtn(param, successHandling)
      } catch (e) {
        // handle exception
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(clickSetAddressBtn)${e}`, () => {
          this.$store.commit('popup/hide')
        })
      }
    },
    /**
     * 배송주소록 추가
     */
    insertShippingAddress () {
      if (this.recipientName.trim() === '' || this.recipientName.trim().length < 2) {
        messageUtil.alert('받으시는 분 이름을 정확히 입력하세요.')
        return false
      } else if (this.phone === '' || this.phone.length < 10) {
        messageUtil.alert('휴대폰 연락처를 정확히 입력하세요.')
        return false
      } else if (this.postcode === '') {
        messageUtil.alert('우편번호를 검색하세요.')
        return false
      } else if (this.addr.trim() === '') {
        messageUtil.alert('주소를 입력하세요..')
        return false
      } else if (this.addrDetail.trim() === '') {
        messageUtil.alert('상세 주소를 입력하세요..')
        return false
      }

      const param = {
        processFlag: 'INSERT',
        address_id: '',
        userId: loginUtil.userId(),
        nickName: this.recipientName.trim(),
        lastName: this.recipientName.trim(),
        zip_code: this.postcode,
        zip_codeS: this.postcode,
        zipType: this.addrFlag,
        addressBas: this.addr.trim(),
        addressDtl: this.addrDetail.trim(),
        // 배송지 개편 start
        addressBasS: this.setAddress1,
        addressDtlS: this.setAddress2,
        // 배송지 개편 end
        isPrimary: this.ipDefaultDest === true ? '1' : '0',
        phone1: insertSeparatorPhoneNumber(this.phone.trim(), '-'),
        URL: 'NSShippingAddressCmd'
      }

      const successHandling = data => {
        let message = data.msg.message
        let isSuccess = data.msg.isSuccess

        // api output이 개발과 운영이 상이하여 일단 별개 예외처리
        if (message === null || undefined === message) {
          message = data.msg.msg.message
          isSuccess = data.msg.msg.isSuccess
        }

        if (isSuccess === 1) {
          this.getShipAddrList()
        } else {
          messageUtil.alert(message)
        }
      }

      orderSheetSafeDeliverySearchAddService.insertShippingAddress(param, successHandling)
    },
    /**
     * 배송주소록 조회
     */
    getShipAddrList () {
      try {
        const param = {
          tasknm: 'ShipAddrList',
          var: loginUtil.userId()
        }

        const successHandling = data => {
          if (data.ShipAddrList.length === 1) {
            this.returnData = {
              addr1: this.addr,
              addr2: this.addrDetail,
              zipCode: this.zipCode,
              phone: this.phone,
              addrId: data.ShipAddrList[0].addressID,
              recipientName: this.recipientName
            }

            this.$store.commit('popup/hide', this.returnData)
          } else if (data.ShipAddrList.length > 1) {
            if (this.ipDefaultDest) {
              this.returnData = {
                addr1: this.addr,
                addr2: this.addrDetail,
                zipCode: this.zipCode,
                phone: this.phone,
                addrId: data.ShipAddrList[0].addressID,
                recipientName: this.recipientName
              }
            } else {
              this.returnData = {
                addr1: this.addr,
                addr2: this.addrDetail,
                zipCode: this.zipCode,
                phone: this.phone,
                addrId: data.ShipAddrList[1].addressID,
                recipientName: this.recipientName
              }
            }

            this.$store.commit('popup/hide', this.returnData)
          }
        }

        orderSheetSafeDeliverySearchAddService.getShipAddrList(param, successHandling)
      } catch (e) {
        // handle exception
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(getShipAddrList)${e}`)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetSafeDeliverySearchAdd";
</style>
