<template>
  <div class="ns_pay_list">
    <dl class="nspay_list">
      <dt v-if="nspayAccountList.length > 0">
        등록계좌 {{ nspayAccountList.length }}개
      </dt>
      <dd v-for="item in nspayAccountList" :key="item.bankCardNo">
        <div :class="`logo bank ${getCardandBankInfo(item.payMethod, item.bankCardCode, 'class')}`" />
        <div class="name_number">
          <p class="name">
            {{ getCardandBankInfo(item.payMethod, item.bankCardCode, 'name') }}
          </p>
          <p class="number">
            {{ item.bankCardNo }}
          </p>
        </div>
        <div class="btn_group">
          <button
            type="button"
            class="btn_star"
            :class="item.majYn === 'Y'? 'on' : ''"
            @click="onClickMajorButton(item)"
          >
            즐겨찾기
          </button>
          <button
            type="button"
            class="btn_delete"
            @click="onClickDeleteButton(item)"
          >
            삭제
          </button>
        </div>
      </dd>
      <dt v-if="nspayCardList.length > 0">
        등록카드 {{ nspayCardList.length }}개
      </dt>
      <dd v-for="item in nspayCardList" :key="item.bankCardNo">
        <div :class="`logo card ${getCardandBankInfo(item.payMethod, item.bankCardCode, 'class')}`" />
        <div class="name_number">
          <p class="name">
            {{ getCardandBankInfo(item.payMethod, item.bankCardCode, 'name') }}
          </p>
          <p class="number">
            {{ item.bankCardNo }}
          </p>
        </div>
        <div class="btn_group">
          <button
            type="button"
            class="btn_star"
            :class="item.majYn === 'Y'? 'on' : ''"
            @click="onClickMajorButton(item)"
          >
            즐겨찾기
          </button>
          <button
            type="button"
            class="btn_delete"
            @click="onClickDeleteButton(item)"
          >
            삭제
          </button>
        </div>
      </dd>
    </dl>
    <div class="btn_group_block">
      <button
        type="button"
        class="btn"
        @click="$router.push('/customer/info/nspay/method/register')"
      >
        <span>+ 결제수단 등록</span>
      </button>
    </div>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import nspayMixin from '@/mixins/customer/nspayMixin'

export default {
  mixins: [
    nspayMixin
  ],
  data () {
    return {
      // NSPay 결제 수단
      nspayList: []
    }
  },
  computed: {
    /**
     * NSPay 결제 수단(카드
     * @returns {Array}
     */
    nspayCardList () {
      return this.nspayList.filter(list => list.payMethod === '01')
    },

    /**
     * NSPay 결제 수단(계좌)
     * @returns {Array}
     */
    nspayAccountList () {
      return this.nspayList.filter(list => list.payMethod === '16')
    }
  },
  created () {
    this.getNSPayInfoAll()
  },
  methods: {
    /**
     * NSPay 등록된 전체 결제수단 조회 API 호출
     * @returns {void}
     */
    getNSPayInfoAll () {
      const param = {
        cmdType: 'payInfoAll',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        // 등록된 결제 수단이 없을 경우
        if (isNull(response.payInfo)) {
          // NSPay 소개 페이지로 이동
          this.$router.push('/customer/info/nspay/intro')

        // 등록된 결제 수단이 있을 경우
        } else {
          this.nspayList = response.payInfo.payList
        }
      }

      this.$nsaxios.post('AjaxNSWPay', param, successHandling)
    },

    /**
     * NSPay 기본 결제수단 선택 버튼 클릭
     *
     * @param {Object} item - 클릭한 결제수단 정보
     * @returns {void}
     */
    onClickMajorButton (item) {
      this.setNSPayMajor(item)
    },

    /**
     * NSPay 결제수단 삭제 버튼 클릭
     *
     * @param {Object} item - 클릭한 결제수단 정보
     * @returns {void}
     */
    onClickDeleteButton (item) {
      messageUtil.confirm(
        '해당 결제정보를 삭제하시겠습니까?',
        () => { // 예
          this.deleteNSPayMajor(item)
        },
        () => { // 취소
        },
        '예',
        '취소'
      )
    },

    /**
     * NSPay 기본 결제수단 셋팅 API 호출
     *
     * @param {Object} item - 세팅할 결제수단 정보
     * @returns {void}
     */
    setNSPayMajor (item) {
      const param = {
        cmdType: item.majYn === 'Y' ? 'delMajorPayInfo' : 'setMajorPayInfo',
        payMethod: item.payMethod,
        wpayToken: item.wpayToken,
        bankCardCode: item.bankCardCode,
        bankCardNo: item.bankCardNo,
        acntRegDttm: item.acntRegDttm
      }

      const successHandling = () => {
        this.getNSPayInfoAll()
      }

      this.$nsaxios.post('AjaxNSWPay', param, successHandling)
    },

    /**
     * NSPay 결제수단 삭제 API 호출
     *
     * @param {Object} item - 삭제할 결제수단 정보
     * @returns {void}
     */
    deleteNSPayMajor (item) {
      const param = {
        cmdType: 'delPayInfo',
        payMethod: item.payMethod,
        wpayToken: item.wpayToken,
        bankCardCode: item.bankCardCode,
        bankCardNo: item.bankCardNo,
        acntRegDttm: item.acntRegDttm
      }

      const successHandling = () => {
        this.getNSPayInfoAll()
      }

      this.$nsaxios.post('AjaxNSWPay', param, successHandling)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/nspay/NSPayList";
</style>
