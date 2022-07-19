<template>
  <div class="order_sheet_safe_delivery_search">
    <div class="delivery_search_guide">
      안심 택배 : <strong>상품보관 후 48시간까지 무료,</strong><br>
      이후 <strong>초과 1일당 1,000원</strong>씩 부과 됩니다.
    </div>
    <p class="title_location">
      찾고자 하는 지역을 검색하세요.
    </p>
    <div class="location">
      <label class="select">
        <select v-model="addrCitySelected" @change="changeAddrCitySelect()">
          <option value="">시/도</option>
          <option
            v-for="(option, index) in addrCityOptions"
            :key="index"
            :value="option.SelData"
          >
            {{ option.SelData }}
          </option>
        </select>
      </label>
      <label class="select">
        <select v-model="addrCitySelected2">
          <option value="">시/군/구</option>
          <option
            v-for="(option, index) in addrCityOptions2"
            :key="index"
            :value="option.SelData"
          >
            {{ option.SelData }}
          </option>
        </select>
      </label>
    </div>
    <p class="delivery_search">
      <button
        type="button"
        class="btn"
        @click="clickSearchDetailAddrBtn()"
      >
        <span>검색</span>
      </button>
    </p>
    <p class="title_search_result">
      검색결과 {{ addrList.length }}건
    </p>
    <p>
      해당하는 주소를 선택하시면 자동 입력됩니다.
    </p>
    <div class="table table_address">
      <table>
        <caption><span class="blind">주소</span></caption>
        <colgroup>
          <col style="width: 80%">
          <col style="width: 20%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              주소
            </th>
            <th scope="col">
              우편번호
            </th>
          </tr>
        </thead>
        <tbody
          v-for="(addrDtl, addrIdx) in addrList"
          :key="addrIdx"
        >
          <tr>
            <td>
              <button type="button" @click="clickPostItemBtn(addrDtl)">
                <span class="sort">도로명</span>
                <address>{{ addrDtl.road1 }} {{ addrDtl.road2 }}</address>
              </button>
              <button type="button" @click="clickPostItemBtn(addrDtl)">
                <span class="sort gray">지번</span>
                <address>{{ addrDtl.addr1 }} {{ addrDtl.addr2 }}</address>
              </button>
            </td>
            <td>
              <button
                type="button"
                class="selected"
                @click="clickPostItemBtn(addrDtl)"
              >
                {{ addrDtl.newZipCode }}<span>[선택]</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'
import popupUtil from '@frameworks/popupUtil'
import orderSheetSafeDeliverySearchService from '@services/order/sheet/orderSheetSafeDeliverySearchService'
import loginUtil from '@utils/loginUtil'
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
      paymentData: {},
      customerData: {},
      addrCityOptions: null, // 시/도
      addrCitySelected: '', // 시/도
      addrCityOptions2: null, // 시/군/구
      addrCitySelected2: '', // 시/군/구
      addrList: []
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.paymentData = this.param.paymentData
    this.customerData = this.param.customerData

    this.getSafeCity()
  },
  methods: {
    /**
     * 처음 시/도 정보를 가지고 오는 곳
     */
    getSafeCity () {
      const addrCity = null

      const param = {
        tasknm: 'alejandrolist',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.helper.NSMypageCommJDBCHelper',
          mnm: 'getSigugun',
          args: {
            ADDR_CITY: addrCity
          }
        })
      }

      const successHandling = data => {
        this.addrCityOptions = data.list
      }

      orderSheetSafeDeliverySearchService.getSafeCity(param, successHandling)
    },
    /**
     * 시/도 변경 시
     */
    async changeAddrCitySelect () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      this.addrCityOptions2 = null
      this.addrCitySelected2 = ''

      const addrCity = this.addrCitySelected.trim()

      const param = {
        tasknm: 'alejandrolist',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.helper.NSMypageCommJDBCHelper',
          mnm: 'getSigugun',
          args: {
            ADDR_CITY: addrCity
          }
        })
      }

      const successHandling = data => {
        this.addrCityOptions2 = data.list
      }

      orderSheetSafeDeliverySearchService.changeAddrCitySelect(param, successHandling)
    },
    /**
     * 검색 버튼 클릭 시
     */
    async clickSearchDetailAddrBtn () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const addrCity = this.addrCitySelected.trim()
      const addrDstr = this.addrCitySelected2.trim()

      const param = {
        tasknm: 'alejandrolist',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.helper.NSMypageCommJDBCHelper',
          mnm: 'getRelaxAddrList',
          args: {
            ADDR_CITY: addrCity,
            ADDR_DSTR: addrDstr
          }
        })
      }

      const successHandling = data => {
        const addrCity = this.addrCitySelected.trim()
        const addrDstr = this.addrCitySelected2.trim()

        if (addrCity === '' || addrCity === null) {
          messageUtil.alert('시/도를 선택해 주세요.')
          return
        }

        if (addrDstr === '' || addrDstr === null) {
          messageUtil.alert('시/군/구를 선택해 주세요.')
          return
        }

        this.addrList = data.list
      }

      orderSheetSafeDeliverySearchService.clickSearchDetailAddrBtn(param, successHandling)
    },
    /**
     * 주소 선택 클릭 시
     * @param {Object} data
     */
    async clickPostItemBtn (data) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      if (this.globalVal.isGuest) {
        this.$store.commit('popup/hide', data)
      } else {
        const param = {
          title: '배송지 추가',
          titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
          isShowSearch: false, // 검색메뉴 안보임
          isShowCart: false, // 장바구니메뉴 안보임
          globalVal: this.globalVal,
          safeData: data,
          customerData: this.customerData
        }

        const callback = result => {
          this.$store.commit('popup/hide', result)
        }

        popupUtil.show('order/sheet/OrderSheetSafeDeliverySearchAdd', param, callback)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetSafeDeliverySearch";
</style>
