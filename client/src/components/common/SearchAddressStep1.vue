<template>
  <div class="search_address_step1">
    <div class="search_items">
      <div class="items">
        <div class="zipcode_keyword_box">
          <ns-input :params="addressParams" @keypress="searchEnter('address')" />
        </div>
        <div v-if="!isSearchDongShow" class="zipcode_tip_box">
          <p>
            도로명+건물번호<em>예) 판교로 15</em>
          </p>
          <p>
            건물명<em>예) 판교세븐벤처밸리1</em>
          </p>
          <p>
            동/읍/면/리+번지<em>예) 삼평동 625</em>
          </p>
        </div>
      </div>
      <div v-if="isSearchDongShow" class="items">
        <div class="zipcode_keyword_box">
          <ns-input :params="addressDongParams" @keypress="searchEnter('dong')" />
        </div>
        <div v-if="isSearchDongShow" class="zipcode_tip_box">
          <p>
            통합검색이 안되는 경우, 읍/면/동으로 검색해주세요.
          </p>
          <p>
            <em>예) 삼평동, 수지면</em>
          </p>
        </div>
      </div>

      <button type="button" class="btn_search" @click="search">
        <span>검색</span>
      </button>

      <div v-show="canShowSearchResult" class="search_result">
        <strong class="count">
          검색결과 <em>{{ addressListCount }}</em>건
        </strong>
        <p class="copy">
          해당하는 주소를 선택하시면 자동 입력됩니다.
        </p>
        <div class="table_address">
          <table>
            <caption><span class="blind">주소 찾기</span></caption>
            <colgroup>
              <col>
              <col style="width: 21%">
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
            <tbody>
              <!-- 읍면동 검색 데이터-->
              <template v-if="isSearchDong">
                <tr v-for="(address, index) in addressList" :key="index">
                  <td>
                    <a href="#otherAddressIn" @click.prevent="choiceAddress(address)">
                      <span class="sort gray">지번</span>
                      <address>{{ address.defAddr }} {{ address.house_num }} {{ address.bld_nm }}</address>
                    </a>
                  </td>
                  <td>
                    <a class="selected" href="#otherAddressIn" @click.prevent="choiceAddress(address)">
                      {{ address.zipCode }}<span>[선택]</span>
                    </a>
                  </td>
                </tr>
              </template>
              <!-- 도로명 검색 데이터 -->
              <template v-else>
                <tr v-for="(address, index) in addressList" :key="index">
                  <td>
                    <a href="#otherAddressIn" @click.prevent="choiceAddress(address)">
                      <span class="sort">도로명</span>
                      <address>{{ address.NADR1 }} {{ address.NADR3 }} {{ address.BLD }}</address>
                    </a>
                    <a href="#otherAddressIn" @click.prevent="choiceAddress(address)">
                      <span class="sort gray">지번</span>
                      <address>{{ address.ADR1 }} {{ address.BUNJI }} {{ address.BLD }}</address>
                    </a>
                  </td>
                  <td>
                    <a class="selected" href="#otherAddressIn" @click.prevent="choiceAddress(address)">
                      {{ address.ZIP }}<span>[선택]</span>
                    </a>
                  </td>
                </tr>
              </template>
              <tr v-if="addressListCount === 0">
                <td colspan="2" class="nodata">
                  검색 결과가 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="isOtherAddressShow" id="otherAddressIn" class="search_detail">
      <strong>나머지 주소를 입력하신 후 확인버튼을 눌러주세요.</strong>
      <div class="address_box">
        <p>{{ postParams.value }}</p>
        <p>{{ choiceAddressParams.value }}</p>
      </div>
      <div class="items">
        <ns-input :params="otherAddressParams" @keypress="searchEnter('other')" @keyup="activeButton()" />
      </div>
      <button ref="btnStep2Next" type="button" class="btn_confirm" :class="isActiive" @click="sendAddress">
        <span>확인</span>
      </button>
    </div>
  </div>
</template>
<script>
import NsInput from '@components/common/NsInput'
import nsaxios, { doesCommonErrorContains } from '@/common/frameworks/axiosUtil'
import messageUtil from '@frameworks/messageUtil'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

export default {
  components: {
    NsInput
  },
  props: {
    addressInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      OTHER_ADDRESS_ERROR_MESSAGE_1: '상세 주소 입력하세요.',
      OTHER_ADDRESS_ERROR_MESSAGE_2: '상세 주소를 50자 이내로 입력하세요.',
      isActiive: '',
      /* *** Params는 input 속성설정 */
      addressParams: {
        value: '',
        maxlength: 100,
        title: '도로명 입력',
        placeholder: '도로명+건물번호, 건물명, 지번입력',
        isLabel: false,
        isError: false,
        errorMessage: '도로명을 입력하세요.'
      },
      addressDongParams: {
        value: '',
        maxlength: 100,
        title: '읍/면/동 입력',
        placeholder: '(읍면동검색) 읍/면/동 입력',
        isLabel: false,
        isError: false,
        errorMessage: '읍/면/동을 입력하세요.'
      },
      postParams: {
        value: ''
      },
      choiceAddressParams: {
        value: ''
      },
      otherAddressParams: {
        value: '',
        maxlength: 100,
        title: '나머지 주소 입력',
        placeholder: '나머지 주소 입력',
        isLabel: false,
        isError: false,
        errorMessage: '상세 주소 입력하세요.'
      },
      returnAddress: {
        address: null,
        otherAddress: '',
        isSearchDong: false
      },
      addressList: [], // 검색 된 주소 목록
      addressListCount: 0, // 검색 된 주소 개수
      isOtherAddressShow: false, // 상세주소 입력 폼 보임 여부, 검색 된 주소를 클릭 시 true
      isSearchDong: false, // 읍면동 검색 여부
      isSearchDongShow: false, // 읍면동 검색 필드 보임여부
      canShowSearchResult: false
    }
  },
  methods: {
    /**
     * 검색단어 입력 후 엔트 입력 시 검색 동작
     *
     * @param {String} callMethod 엔터 구분
     * @returns {void}
     */
    searchEnter (callMethod) {
      if (window.event.keyCode === 13) {
        if (callMethod === 'address') {
          this.searchAddress()
        } else if (callMethod === 'dong') {
          this.searchAddressDong()
        } else {
          this.sendAddress()
        }
      }
    },
    /**
     * 도로명이거나 지번 주소 검색
     *
     * @returns {void}
     */
    search () {
      if (!this.isSearchDong && !this.isSearchDongShow) {
        this.searchAddress()
      } else {
        if (this.addressDongParams.value === '' && this.addressParams.value === '') {
          this.searchAddress()
        } else if (this.addressDongParams.value !== '' && this.addressParams.value !== '') {
          this.searchAddressDong()
        } else if (this.addressDongParams.value === '' && this.addressParams.value !== '') {
          this.searchAddress()
        } else {
          this.searchAddressDong()
        }
      }
    },
    /**
     * 도로명 주소 검색
     * @returns {void}
     */
    searchAddress () {
      this.isSearchDong = false
      this.addressParams.isError = false

      // validation
      if (this.addressParams.value === '') {
        this.addressParams.isError = true
        return
      }

      const params = {
        processFlag: 'NSearch',
        addrText: this.addressParams.value
      }

      const successHandler = response => {
        this.addressList = response.postList.map(post => {
          if (post.BLD) {
            post.BLD = htmlDecode(post.BLD)
          }

          return post
        })
        this.addressListCount = response.resultPageTotalCnt
        this.canShowSearchResult = true

        if (this.addressListCount === 0 || this.addressListCount === undefined) {
          this.isSearchDong = true
          this.isSearchDongShow = true
        }
      }

      const failureHandler = error => {
        console.error(error)

        if (!doesCommonErrorContains(error)) {
          messageUtil.error('통신 오류가 발생하였습니다,', null)
        }
      }

      nsaxios.post('NSNewPostSearchCmd', params, successHandler, failureHandler)
    },
    /**
     * 지번 검색
     *
     * @returns {void}
     */
    searchAddressDong () {
      this.isSearchDong = true
      this.addressDongParams.isError = false

      if (this.addressDongParams.value === '') {
        this.addressDongParams.isError = true
        return
      }

      const params = {
        processFlag: 'LSearch',
        addrText: this.addressDongParams.value
      }

      const successHandler = response => {
        this.addressList = response.postList.map(post => {
          if (post.BLD) {
            post.BLD = htmlDecode(post.BLD)
          }

          return post
        })
        this.addressListCount = response.resultPageTotalCnt
        this.canShowSearchResult = true
      }

      const failureHandler = error => {
        console.error(error)

        if (!doesCommonErrorContains(error)) {
          messageUtil.error('통신 오류가 발생하였습니다,', null)
        }
      }

      nsaxios.post('NSNewPostSearchCmd', params, successHandler, failureHandler)
    },
    /**
     * 조회된 주소 정보 중 선택된 주소 처리
     *
     * @param {Object} address 조회된 주소 정보 중 선택된 주소
     * @returns {void}
     */
    choiceAddress (address) {
      if (this.isSearchDong) {
        this.returnAddress = address
        this.postParams.value = address.zipCode
        this.choiceAddressParams.value = `${address.defAddr} ${address.bld_nm}`
      } else {
        this.returnAddress = address
        this.postParams.value = address.ZIP
        this.choiceAddressParams.value = `${address.NADR1} ${address.NADR3}`
      }

      if (this.addressInfo.is1Dept) {
        this.otherAddressParams.value = ' '
        this.sendAddress()
      } else {
        this.isOtherAddressShow = true
        // 확인 버튼 생성(updated hook 발생) 후 확인 버튼으로 스크롤 이동
        this.$nextTick(function () {
          this.$refs.btnStep2Next.scrollIntoView()
        })
      }
    },
    /**
     * 상세주소를 입력 후 최종 선택 화면으로 이동
     *
     * @returns {void}
     */
    sendAddress () {
      // validation
      if (this.otherAddressParams.value === '') {
        this.otherAddressParams.errorMessage = this.OTHER_ADDRESS_ERROR_MESSAGE_1
        this.otherAddressParams.isError = true

        return
      }

      if (this.otherAddressParams.value.length >= 50) {
        this.otherAddressParams.errorMessage = this.OTHER_ADDRESS_ERROR_MESSAGE_2
        this.otherAddressParams.isError = true

        return
      }

      this.otherAddressParams.isError = false
      this.returnAddress.otherAddress = this.otherAddressParams.value
      this.returnAddress.isSearchDong = this.isSearchDong

      this.$emit('result', this.returnAddress)
    },
    activeButton () {
      if (this.otherAddressParams.value !== '') {
        this.isActiive = 'active'
      } else {
        this.isActiive = ''
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/SearchAddressStep1";
</style>
