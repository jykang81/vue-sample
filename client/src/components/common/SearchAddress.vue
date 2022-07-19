<template>
  <div class="search_address">
    <search-address-step1 :address-info="addressInfo1" @result="resultAddressStep1" />
  </div>
</template>

<script>
import SearchAddressStep1 from '@components/common/SearchAddressStep1'
import messageUtil from '@frameworks/messageUtil'
import searchAddressService from '@services/common/searchAddressService'

export default {
  components: {
    SearchAddressStep1
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      addressInfo1: {
        roadAddress: '',
        is1Dept: false
      },
      step1AddressInfo: null,
      returnAddress: {
        picked: 'road',
        addressPost: '',
        address: '',
        addressOther: '',
        roadPost: '',
        road: '',
        roadOther: ''
      }
    }
  },
  created () {
    if (this.param.is1Dept) {
      this.addressInfo1.is1Dept = this.param.is1Dept
    }
  },
  methods: {
    /**
     * step 1 주소찾기 결과
     * @param {object} addressInfo 주소 객체
     * @returns {void}
     */
    resultAddressStep1 (addressInfo) {
      this.step1AddressInfo = addressInfo

      if (addressInfo.isSearchDong) {
        const params = {
          processFlag: 'LCheck',
          zipcode: addressInfo.zipCode,
          addr1: `${addressInfo.defAddr} ${addressInfo.bld_nm}`,
          addr2: addressInfo.otherAddress
        }

        this.refining(params)
      } else {
        const params = {
          processFlag: 'RCheck',
          zipcode: addressInfo.zipCode,
          addr1: `${addressInfo.NADR1} ${addressInfo.NADR3}`,
          addr2: addressInfo.otherAddress
        }

        this.refining(params)
      }
    },
    /**
     * 주소 데이터 정제
     * @param {Object} params
     * @returns {Promise}
     */
    refining (params) {
      const successHandler = response => {
        // response validation
        if (!response.postList.length > 0) {
          messageUtil.error('주소 정제가 정상적으로 진행 되지 않았습니다.', null)
        }

        const post = response.postList[0]

        this.returnAddress.addressPost = post.ZIPR === '' ? this.step1AddressInfo.zipCode : post.ZIPR
        this.returnAddress.address = post.ADDR1D
        this.returnAddress.addressOther = post.ADDR1D2

        if (post.NADR1S !== '') {
          const addressObject = this.createAddressObject(`${post.NADR1S} ${post.NADR3S}`)

          const roadAddress = addressObject.default
          const roadOther = addressObject.detail

          this.returnAddress.roadPost = post.ZIPR === '' ? this.step1AddressInfo.zipCode : post.ZIPR
          this.returnAddress.road = roadAddress
          this.returnAddress.roadOther = roadOther
          this.returnAddress.roadDong = post.NADRE
        } else {
          this.returnAddress.picked = 'address'
        }

        this.resultAddressStep2()
      }

      const failureHandler = error => {
        console.error(error)
        messageUtil.error('통신 오류가 발생하였습니다,', null)
      }

      return searchAddressService.refining(params, successHandler, failureHandler)
    },
    /**
     * step 2 주소찾기 결과
     * @param {object} addressInfo 주소 객체
     * @returns {void}
     */
    resultAddressStep2 () {
      this.$store.commit('popup/hide', this.returnAddress)
    },
    /**
     * 주소를 입력받아 기본주소와 상세주소 구분된 객체 반환
     * @param {String} 주소
     * @returns {Object} 주소 객체
     */
    createAddressObject (address) {
      const addressObject = {}

      var indexCount = 0
      var nROcount = address.lastIndexOf('로')
      var nGILcount = address.lastIndexOf('길')

      if (nROcount >= nGILcount) {
        indexCount = nROcount + 1
      } else if (nROcount <= nGILcount) {
        indexCount = nGILcount + 1
      }

      if (indexCount === 0) {
        indexCount = address.length
      }

      addressObject.default = address.substring(0, indexCount).trim() // 기본주소
      addressObject.detail = address.substring(indexCount, address.length).trim() // 상세주소

      return addressObject
    }
  }
}
</script>
