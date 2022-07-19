import nsaxios from '@frameworks/axiosUtil'
// import messageUtil from '@frameworks/messageUtil'
// import routerUtil from '@frameworks/routerUtil'

/**
 * 제휴몰 관련 처리
 */
const setPartnershipDataMixin = {
  methods: {
    /**
     * 제휴사 주문내역 조회를 위한 주문건 저장 (ASIS: checkPartnerPay)
     * 대상 제휴사: 아이라이크클릭(coCd - 340),       아이라이크클릭 애드웨어(coCd - 341), 링크프라이스(coCd - 630)
     *             아시아나 항공(coCd - 551),        아시아나 항공 배너(coCd - 552),     아시아나 항공 메일(coCd - 553)
     *             링크프라이스 애드웨어(coCd - 631), 파란샵링크(coCd - 910),            파란샵링크(new)(coCd - 912)
     *             클릭스토리(coCd - 920),           클릭스토리 애드웨어(coCd - 921),    KT 메가패스쇼핑(coCd - 940)
     *             Auction(coCd - 970)
     * @returns {void}
     */
    setPartnershipData () {
      const coCd = this.globalVal.mOutputDatas.msg.payCheck.coCd // 제휴사 코드
      const isAsiana = (coCd === '551' || coCd === '552' || coCd === '553') // 아시아나 제휴사
      let partner = 'N' // 제휴몰 체크

      const commCdVal = ['340', '341', '551', '552', '553', '630', '631', '910', '912', '920', '921', '940', '970']
      for (let i = 0; i < commCdVal.length; i++) {
        if (coCd === commCdVal[i]) {
          if (coCd === '551' || coCd === '552' || coCd === '553') {
            if (isAsiana) {
              partner = 'Y'
            } else {
              partner = 'N'
            }
          } else {
            partner = 'Y'
          }
        }
      }

      const coKey = ''
      const coType = ''
      let merchId = ''
      let traceCd = ''
      const feeCd = ''
      let settleCd = ''
      const cardCash = this.globalVal.mOutputDatas.orderPrice.CREDITCARD_PAYMENT_AMT // 카드결제금액
      const bankMoney = this.globalVal.mOutputDatas.orderPrice.WITHOUT_BANKBOOK_PAYMENT_AMT // 입금예정액 금액(무통장)
      if (bankMoney !== 0) {
        settleCd = 'O'
      } else if (cardCash !== 0) {
        settleCd = 'C'
      } else {
        settleCd = 'X'
      }

      if (partner === 'Y') {
        if (coCd === '340' || coCd === '341') {
          merchId = 'nsseshop'
        } else if (coCd === '630' || coCd === '631') {
          if (coType == null || coType.indexOf('nsseshop') < 0) {
            if (coCd === '630') {
              merchId = 'nsseshop'
            } else if (coCd === '631') {
              merchId = 'nsseshop1'
            } else {
              merchId = 'nsseshop'
            }
          }
        } else if (coCd === '920' || coCd === '921') {
          traceCd = '5'
        } else if (coCd === '940') {
          merchId = 'C010'
        } else if (coCd === '551' || coCd === '552' || coCd === '553') {
          // coKey = document.getElementById('asiana_cno').value // ASIS에 해당 설정값이 없음.
          merchId = 'NSE'
          traceCd = 'B'
        }

        // 파트너정보 데이터 셋팅
        this.paymentData.Partnership.setItem({
          partnerType: partner,
          COKEY: coKey,
          MERCH_ID: merchId,
          TRACECD: traceCd,
          FEECD: feeCd,
          SETTLECD: settleCd,
          COCD: coCd
        })
      }
    },
    /**
     * 갤러리아 상품 주문가능여부 체크
     * @returns {void}
     */
    checkGalleriaSale () {
      const data = this.globalVal.mOutputDatas
      const gallProdArray = []
      let existGallProd = false

      for (let i = 0; data.msg.OrderGoodList.length > i; i++) { // 상품 갯수 만큼 반복
        if (data.msg.OrderGoodList[i].goodsDetail.VENDOR_ID === '109103') { // 제휴사코드가 갤러리아일 때
          existGallProd = true

          const invoke = {
            prdNm: data.msg.OrderGoodList[i].goodsDetail.XCATENTRY_DISP_NAME,
            NO: data.msg.OrderGoodList[i].itemDetailInfo.alliMallGoodsCd,
            ORDER_QTY: data.msg.OrderGoodList[i].goodsDetail.QUANTITY,
            PRICE: data.msg.OrderGoodList[i].goodsDetail.ITEMPRICE,
            OPT_NAME: '',
            OPT_VALUE: '',
            OPT_PRICE: '',
            OPT_QTY: '',
            OPT_STOCK_NO: data.msg.OrderGoodList[i].goodsDetail.CATENTRY_ID_CHILD
          }

          gallProdArray.push(invoke)
        }
      }

      if (existGallProd) {
        nsaxios.post('GalleriaPrdCntCheck', { reqParam: JSON.stringify(gallProdArray) }, data => {
          // TODO: BUG 2539 확인완료 후에 다시 복원 - START
          /*
          if (data.msg.resultCode === 'N') {
            messageUtil.alert(data.msg.resultMsg, () => {
              routerUtil.back()
            })
          } else {
            this.isLoadChildComponent = true
          }
          */
          // TODO: BUG 2539 확인완료 후에 다시 복원 - END

          // TODO: BUG 2539 확인완료 후에 삭제 - START
          this.isLoadChildComponent = true
          // TODO: BUG 2539 확인완료 후에 삭제 - END
        })
      }

      return existGallProd
    }
  }
}

export default setPartnershipDataMixin
