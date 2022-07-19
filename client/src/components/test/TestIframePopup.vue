<template>
  <div>
    <p>
      <span>
        <button @click="setCard('006', '하나카드')">
          하나카드
        </button>
      </span>
      &nbsp;|&nbsp;
      <span>
        <button @click="setCard('027', '현대카드')">
          현대카드
        </button>
      </span>
    </p>
    <p>
      <iframe id="certView" :src="iframeSrc" title="결제 진행중" name="certView" style="border: 0px;" />
    </p>
  </div>
</template>

<script>
import CONST from '@constants/framework/framework'

export default {
  data () {
    return {
      iframeSrc: '',
      enableCallbackResult: true
    }
  },
  created () {
  },
  mounted () {
    this.resize('certView')
  },
  methods: {
    setCard (code, name) {
      const url = `https:${CONST.API_HOST}/nsmall/mobile/kicc/easypay_mob_request.jsp?`
      this.iframeSrc = `${url}FINAL_PAYMENT_AMT=159000&Additionalpaymentamount=0&couponDcAmt=0&cardDcAmt=5000&freeShippingDcAmt=0&SHIP_CHARGE=0&RMA_SHIP_CHARGE=0&SHIP_CHARGE_ONE_DELIVERY=0&SHIP_CHARGE_MULTI_DELIVERY=0&EP_mall_id=T0002493&EP_noinst_flag=N&EP_noinst_term=&EP_quota=00&payType=100&requestCommand=RequestInfo&orderCompleteYn=N&payAmt=159000&EP_product_amt=undefined&EP_user_nm=테스터&EP_user_mail=test@test.com&EP_user_phone2=010-1234-5678&EP_usedcard_code=${code}&EP_card_no=&EP_point_useyn=N&custNum=688655818&str_apvl_chain_no_lt=&VAN_CO=00&moduleGubun=E&usedcard_code=HN&EcompCardName=${code}|${name}&EP_order_no=300070489165&EP_user_type=1&EP_user_id=arisu23@naver.com&EP_user_phone1=010-1234-5678&EP_user_addr=판교로 15 Ns 7층&EP_product_type=0&EP_product_nm=[TV]보국 쿡스클럽 미니저당밥솥 블랙BKKR19150BK텀블러블렌더&EP_product_expr=&EP_tax_flg=N&EP_cert_type=0&EP_mall_id_temp=T0002493&EP_mall_id_free_temp=T0002494&EP_currency=00&EP_agent_ver=JSP&EP_mall_nm=테스트 상점&EP_mall_pwd=1111&EP_lang_flag=KOR&EP_ci_url=testgw.easypay.co.kr&EP_pay_type=11&EP_card_code=&EP_card_prefix=&EP_ret_pay_type=&EP_trace_no=&EP_min_install_cnt=10&targetType=payment&target=certView&successFunc=&failFunc=&MOB_RET_URL=${location.origin}/test/test-iframe-return&MOB_ERR_URL=${location.origin}/test/test-iframe-return&MOB_PASS=WEB&MOB_VIEW_TYPE=other`
    },
    /**
     * iframe 사이즈 설정
     * @returns {void}
     */
    resize (id) {
      const iframe = document.getElementById(id)
      iframe.style.width = '100%'
      iframe.style.height = `${window.innerHeight}px`
    }
  }
}
</script>

<style>

</style>
