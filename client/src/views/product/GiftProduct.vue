<template>
  <section v-if="isGiftExist"
           class="gift_product"
  >
    <div
      v-if="shouldGiftOptionSelect"
      class="gift_wrap"
    >
      <h4 class="subject">
        사은품
        <span class="sub">(선택) {{ giftsList.optionList.length }}</span>
      </h4>
      <label v-for="(giftOptionList, selectboxIndex) in giftsList.optionList"
             :key="selectboxIndex"
             class="select"
      >
        <select
          v-model="selectedGiftOptionList[selectboxIndex]"
          @change="onChangeSelGift(selectboxIndex)"
        >
          <option value="">선택해주세요.</option>
          <option
            v-for="(optionItem, optionItemIndex) in giftOptionList.attr"
            :key="optionItemIndex"
            :value="optionItem"
          >
            {{ optionItem.value }}
          </option>
        </select>
      </label>
    </div>

    <div
      v-else
      class="gift_wrap"
    >
      <h4 class="subject">
        사은품
      </h4>
      <dl class="row_group">
        <dd class="copy">
          <strong class="title">{{ giftsList.title }} {{ giftsList.name }}</strong>
        </dd>
      </dl>
    </div>
  </section>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  isNull,
  unique
} from '@utils/commonutil/commonUtil'
import giftProductService from '@services/product/giftProductService'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedGiftOptionList: [], // 선택된 사은품 목록
      giftAttrCnt: 0 // 사은품 개수
    }
  },
  computed: {
    /**
     * 사은품 존재 여부
     *
     * @returns {Boolean} 사은품 존재 여부
     */
    isGiftExist () {
      return this.globalVal.productInfo.giftBnftList && this.globalVal.productInfo.giftBnftList.length > 0
    },
    /**
     * 사은품 리스트
     *
     * @returns {Array} 사은품 리스트
     */
    giftsList () {
      try {
        const giftBnftList = this.globalVal.productInfo.giftBnftList
        const returnGiftsList = {}
        let giftOfferIdfrList = []

        giftBnftList.forEach(items => {
          giftOfferIdfrList.push(`${items.offerIdfr}_${items.bnftSeq}`)
        })
        giftOfferIdfrList = unique(giftOfferIdfrList)

        for (const srcOfferIdfr of giftOfferIdfrList) {
          let choiceCnt = 0
          const partNumbers = []
          const offerIdfrs = []

          for (const items of giftBnftList) {
            const offerIdfr2 = `${items.offerIdfr}_${items.bnftSeq}`
            if (srcOfferIdfr === offerIdfr2) {
              partNumbers.push(items.partNumber)
              offerIdfrs.push(offerIdfr2)
              choiceCnt = Number(items.choiceCnt)
            }
          }

          let title = '사은품'
          if (choiceCnt > 0 && partNumbers.length > 0) {
            title = `${title} (택${choiceCnt})`
          }

          returnGiftsList.title = title

          returnGiftsList.optionList = this.getGiftOption({ partNumbers, offerIdfrs, choiceCnt })

          for (let j = 0; j < partNumbers.length; j++) {
            const catalogEntryDetails = this.getItem(partNumbers[j])
            returnGiftsList.name = catalogEntryDetails.name
          }
        }

        return returnGiftsList || null
      } catch (error) {
        return null
      }
    },
    /**
     * 옵션 선택 selectbox 노출 여부
     *
     * @returns {Boolean} 옵션 선택 selectbox 노출 여부
     */
    shouldGiftOptionSelect () {
      try {
        return (!!this.giftsList && !!this.giftsList.optionList && this.giftsList.optionList[0].attr.length > 1) || this.giftAttrCnt > 1
      } catch (error) {
        console.error(error)
        return null
      }
    }
  },
  mounted () {
    if (!this.shouldGiftOptionSelect) {
      if (!!this.giftsList && !!this.giftsList.optionList) {
        let selectedGiftOptionList = []
        selectedGiftOptionList = this.giftsList.optionList[0].attr
        this.$store.commit('product/setSelectedGiftList', { selectedGiftOptionList })
      }
    } else {
      const selected = []
      this.giftsList.optionList.forEach(function (item, idx) {
        selected[idx] = ''
      })
      this.selectedGiftOptionList = selected
    }
  },
  methods: {
    /**
     * 옵션 선택
     *
     * @param {Number} selectBoxIndex 셀렉트박스 인덱스
     */
    onChangeSelGift (selectBoxIndex) {
      this.checkRemainedGiftCount(this.giftsList.optionList[selectBoxIndex].partNumber, this.selectedGiftOptionList[selectBoxIndex].valueId)
    },
    /**
     * 사은품 남은 수량 체크
     *
     * @param {String} partNumber 파트넘버
     * @param {String} itemNumber 아이템넘버
     */
    checkRemainedGiftCount (partNumber, itemNumber) {
      const multiCd = (isNull(this.globalVal.productInfo.mparam.multiCd)) ? '' : this.globalVal.productInfo.mparam.multiCd
      const cocd = COMM_CONST.getCocd()

      const params = {
        cmdType: 1,
        partNumber,
        itemNumber,
        multiCd,
        offerIdfr: '',
        cpcAmt: this.globalVal.productInfo.cpcAmt,
        arsAmt: this.globalVal.productInfo.arsAmt,
        busChnId: this.globalVal.productInfo.busChnId,
        coCd: cocd
      }

      const successHandling = _ => {
        const selectedGiftOptionList = this.selectedGiftOptionList
        this.$store.commit('product/setSelectedGiftList', { selectedGiftOptionList })
      }
      giftProductService.checkRemainedGiftCount(params, successHandling)
    },
    /**
     * 사은품 정보
     *
     * @param {object} option 옵션
     * @param {String} partNumbers 파트넘버
     * @param {String} offerIdfrs offerIdfr
     * @param {String} choiceCnt 선택개수
     * @returns {array} 사은품 옵션목록
     */
    getGiftOption ({ partNumbers, offerIdfrs, choiceCnt }) {
      const giftstyleDefiningAttributeList = []
      let isExistsAttr = false

      for (let j = 0; j < partNumbers.length; j++) {
        const catalogEntryDetails = this.getItem(partNumbers[j])
        const offerIdfr = offerIdfrs[j]

        const entitledItems = catalogEntryDetails.SKUs
        const name = catalogEntryDetails.name
        const partNumber = catalogEntryDetails.partNumber
        const styleMngYn = catalogEntryDetails.styleMngYn
        const unitRegiTypeCd = catalogEntryDetails.unitRegiTypeCd
        const essnOfferYn = catalogEntryDetails.essnOfferYn
        const bnftVal = catalogEntryDetails.bnftVal

        const valList = []

        for (const SKUs of entitledItems) {
          valList.push({
            valueId: SKUs.uniqueID,
            value: SKUs.name,
            overPrice: SKUs.calPrmo
          })
        }

        giftstyleDefiningAttributeList.push({
          name,
          partNumber,
          offerIdfr,
          styleMngYn,
          essnOfferYn,
          unitRegiTypeCd,
          bnftVal,
          choiceCnt,
          attr: valList
        })
        isExistsAttr = true
      }

      this.giftAttrCnt = giftstyleDefiningAttributeList.length

      if (!isExistsAttr) {
        this.giftAttrCnt = 1
      }

      return giftstyleDefiningAttributeList
    },
    /**
     * 유효성 체크
     * partNumber 일치하는 옵션 리스트
     *
     * @param {string} partNumber 파트넘버
     * @returns {object|null}
     */
    getItem (partNumber) {
      for (const item of this.globalVal.productInfo.optionList) {
        if (item.partNumber === partNumber) {
          return item
        }
      }

      return null
    }
  }

}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/GiftProduct";
</style>
