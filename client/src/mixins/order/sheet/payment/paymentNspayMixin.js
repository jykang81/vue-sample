import nsaxios from '@/common/frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import COMM_CONST from '@/common/constants/framework/constants'
import LOGIN_CONST from '@constants/customer/login'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import {
  isNull,
  isOsApp,
  viewType,
  serializeToObject,
  insertCommas
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import popupUtil from '@frameworks/popupUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'

/**
 * PaymentNspayMixin
 */
const paymentNspayMixin = {
  data () {
    return {
      // Nspay
      isInitNspay: true,
      intervalId: null,
      swiperNspay: {
        slidesPerView: 'auto',
        spaceBetween: 25,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },

        // data
        isApplySaved: true,
        cardBnftList: [], // NSPAY 신용카드 청구할인 적용대상 코드 리스트
        noIntCardList: [], // 카드사 무이자 할부 정보 리스트.
        minInstallCnt: 0, // 최대 무이자 할부 개월 수.
        payinfoList: [], // 결제수단 리스트
        mappedCodeList: [], // 신용카드 기존코드와 이니시스코드 매핑 리스트
        mileage: null, // 적립금 정보.
        sliderItems: [],
        isDeposit: false,
        nsNoInt: [],
        selectedItem: null,
        finalPaymentAmt: 0,
        loadDataComplete: false
      }
    }
  },
  methods: {
    /**
    * Nspay Slid 변경
    * @returns {void}
    */
    onchangeNspaySlideChange () {
      this.swiperNspay.selectedItem = this.swiperNspay.sliderItems[this.swiper.activeIndex]
      this.setNspayParams()
    },
    /**
     * Nspay re init 설정
     * @returns {void}
     */
    reInit () {
      if (!this.isInitNspay) {
        this.isInitNspay = true
        this.globalVal.paymentMethodInfo.selectedNspay.item.wpayToken = ''
      }
    },
    /**
     * Nspay Slid 설정
     * @returns {void}
     */
    gotoNspaySlideTo () {
      if (this.isInitNspay) {
        const len = this.swiperNspay.sliderItems.length
        let index = 0
        let indexFlag = true
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            const item = this.swiperNspay.sliderItems[i]
            if (item.payMethod !== 'DEFAULT') {
              if (!isNull(this.$refs[`nspayMajYn${i}`])) {
                this.$refs[`nspayMajYn${i}`][0].checked = item.majYn === 'Y'
              }

              if (indexFlag && this.globalVal.paymentMethodInfo.selectedNspay.item.wpayToken === item.wpayToken) {
                indexFlag = false
                index = i
              }
            }
          }
        }
        if (!isNull(this.swiper)) {
          this.swiper.slideTo(index, 0)
        }
        this.setNspayParams()
        this.isInitNspay = false
        this.swiperNspay.loadDataComplete = true
      }
    },
    /**
     * 결제금액이 5만원 미만
     * @returns {Boolean}
     */
    isLtFinalPaymentAmt () {
      return this.swiperNspay.finalPaymentAmt < 50000
    },
    /**
     * 결제금액이 5만원 이상
     * @returns {Boolean}
     */
    isGeFinalPaymentAmt () {
      return this.swiperNspay.finalPaymentAmt >= 50000
    },
    /**
     * 선택된 신용카드 결제수단 할부정보
     * @returns {Object}}
     */
    getNspayCardQuotaByActiveIndex () {
      const nspayCardQuota = this.$refs[`nspayCardQuota${this.swiperNspay.selectedItem.activeIndex}`]
      const dummyCardQuota = {
        selectedIndex: 0,
        options: this.swiperNspay.selectedItem.quotaList
      }

      return isNull(nspayCardQuota) ? dummyCardQuota : nspayCardQuota[0]
    },
    /**
     * Nspay 무이자 할부 여부 가져오기
     * @param {String} quota - 무이자 할부 개월수
     * @param {String} text - 무이자 할부 문자열
     * @returns {void}
     */
    getNoinstYn (quota, text) {
      if (quota !== '00') {
        return text.indexOf('무이자') >= 0 ? 'Y' : 'N'
      } else {
        return 'N'
      }
    },
    /**
     * Nspay 정보설정
     * @returns {void}
     */
    setNspayParams () {
      this.swiperNspay.selectedItem.activeIndex = isNull(this.swiper) ? 0 : this.swiper.activeIndex
      if (this.swiperNspay.selectedItem.payMethod === '01') {
        this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD // 1600
        this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD
        this.swiperNspay.isDeposit = false

        if (this.swiperNspay.isApplySaved && !isNull(this.globalVal.paymentMethodInfo.selectedNspay.item.wpayToken)) {
          this.swiperNspay.isApplySaved = false
          this.swiperNspay.selectedItem.quota = this.globalVal.paymentMethodInfo.selectedNspay.item.quota
        }

        const elCardQuota = this.getNspayCardQuotaByActiveIndex()
        const quotaText = elCardQuota.options[elCardQuota.selectedIndex].text || ''
        elCardQuota.value = this.swiperNspay.selectedItem.quota || '00'
        this.swiperNspay.selectedItem.quota = elCardQuota.value // TODO: $(element).find('#cardQuota')[0].value
        this.swiperNspay.selectedItem.noinstYn = this.getNoinstYn(elCardQuota.value, quotaText) // TODO: $(element).find('#cardQuota option:selected').text().indexOf('무이자') >= 0 ? 'Y' : 'N'

        // 카드 결제 정보 초기화.
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD] = {
          payType: PAY_TYPE_CONST.NS_PAY_CREDIT_CARD,
          requestCommand: 'RequestInfo',
          mid: '', // 필수값: 가맹점 ID
          wpayUserKey: '', // 필수값: 이니시스에서 발행한 사용자 key
          wtid: '', // 필수값: WPAY 트랜잭션ID
          wpayToken: this.swiperNspay.selectedItem.wpayToken, // $(element).find('#wpToken')[0].value, // 필수값: 이니시스에서 발행한 토큰
          ci: '',
          bankCardCode: this.swiperNspay.selectedItem.bankCardCode, // $(element).find('#cardCode')[0].value,
          oid: '', // 필수값: 주문번호
          goodsName: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName, // 필수값: 상품명
          goodsPrice: this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT, // 필수값: 결제금액
          buyerName: this.paymentData.OrderUserInfo.getItem().LASTNAME, // 필수값: 구매자명
          buyerTel: this.paymentData.OrderUserInfo.getItem().PHONE1, // 필수값: 구매자연락처
          buyerEmail: '',
          cardQuota: this.swiperNspay.selectedItem.quota, // 필수값: 할부개월수
          cardInterest: this.swiperNspay.selectedItem.noinstYn, // 무이자 여부
          bankCardNo: this.swiperNspay.selectedItem.bankCardNo, // $(element).find('.card-num')[0].innerText,
          acntRegDttm: '',
          flagPin: '',
          flagPinMsg: '',
          returnUrl: `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_result.jsp?payType=${PAY_TYPE_CONST.NS_PAY_CREDIT_CARD}`,
          signature: '', // 필수값: hash
          PHONE_NUM: '', // 현금영수증 전화번호
          BIZ_REG_NUM: '', // 현금영수증 사업자번호
          RECEIPT_TYPE: '', // 현금영수증 타입(P:개인, B:사업자)
          EP_card_prefix: '', // 카드 prefix 6자리
          EP_card_no: '', // 카드번호 마스킹 되어있어서 6자리만 처리
          usedcard_code: '', // 기존 카드사 코드
          cardName: this.swiperNspay.selectedItem.cardName // $(element).find('.logo').text() // 카드사이름
        }
        this.setNspayCardQuota(this.swiperNspay.selectedItem.quota, this.swiperNspay.selectedItem.noinstYn)
        this.dispNspayCardDcCoupon()
      } else if (this.swiperNspay.selectedItem.payMethod === '16') {
        this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER // 1700
        this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER

        if (!this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
          this.globalVal.discountInfo.checkedSinglePaymentDiscount = true
          this.onchangeSinglePaymentDiscount()
        }

        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER] = {
          payType: PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER,
          requestCommand: 'RequestInfo',
          mid: '', // 필수값: 가맹점 ID
          wpayUserKey: '', // 필수값: 이니시스에서 발행한 사용자 key
          wtid: '', // 필수값: WPAY 트랜잭션ID
          wpayToken: this.swiperNspay.selectedItem.wpayToken, // $(element).find('#wpToken')[0].value, // 필수값: 이니시스에서 발행한 토큰
          ci: '',
          bankCardCode: this.swiperNspay.selectedItem.bankCardCode, // $(element).find('#wpBankCode')[0].value,
          oid: '', // 필수값: 주문번호
          goodsName: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName, // 필수값: 상품명
          goodsPrice: this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT, // 필수값: 결제금액
          buyerName: this.paymentData.OrderUserInfo.getItem().LASTNAME, // 필수값: 구매자명
          buyerTel: this.paymentData.OrderUserInfo.getItem().PHONE1, // 필수값: 구매자연락처
          buyerEmail: '',
          cardQuota: '', // cardQuota, // 필수값: 할부개월수
          cardInterest: '', // cardInterest, // 무이자 여부
          bankCardNo: this.swiperNspay.selectedItem.bankCardNo, // $(element).find('.card-num')[0].innerText,
          acntRegDttm: this.swiperNspay.selectedItem.acntRegDttm, // $(element).find('#wpRegDttm')[0].value,
          flagPin: '',
          flagPinMsg: '',
          returnUrl: `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_result.jsp?payType=${PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER}`, // 필수값: 결과전달URL
          signature: '', // 필수값: hash
          PHONE_NUM: '', // 현금영수증 전화번호
          BIZ_REG_NUM: '', // 현금영수증 사업자번호
          RECEIPT_TYPE: '', // 현금영수증 타입(P:개인, B:사업자)
          EP_card_prefix: '', // 카드 prefix 6자리
          EP_card_no: '', // 카드번호 마스킹 되어있어서 6자리만 처리
          usedcard_code: '', // 기존 카드사 코드
          cardName: this.swiperNspay.selectedItem.cardName // $(element).find('.logo').text() // 은행이름
        }
        this.swiperNspay.isDeposit = true
        this.setReceiptInfo()
      } else {
        this.globalVal.paymentMethodInfo.paymentMethod = ''
        this.globalVal.paymentMethodInfo.currentPayType = 'NSPay'
        this.swiperNspay.isDeposit = false
      }
    },
    /**
     * 저장된 Nspay 설정
     * @returns {void}
     */
    async setSavedNspayInfo () {
      this.intervalId = setInterval(async () => {
        if (this.globalVal.completeOrderSheetDiscount) {
          clearInterval(this.intervalId)
          await this.setNspayInfo()
          this.intervalId = setInterval(() => {
            if (this.swiperNspay.loadDataComplete) {
              this.globalVal.paymentMethodInfo.selectedNspay.item = this.swiperNspay.selectedItem
              let name = ''
              let quota = ''
              if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
                name = this.getNspayCardCiList().getName(this.swiperNspay.selectedItem.bankCardCode)
                quota = this.getNspayCardCiList().getQuotaName(this.swiperNspay.selectedItem.quota, this.swiperNspay.selectedItem.quotaList)
              } else if (PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
                name = this.getNspayAcctCiList().getName(this.swiperNspay.selectedItem.bankCardCode)
                this.saveNspayReceiptInfo()
              }
              this.globalVal.paymentMethodInfo.paymentMethod = this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode
              this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardCode = this.swiperNspay.selectedItem.bankCardCode
              this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType, name, quota)
              this.globalVal.paymentMethodInfo.paymentMethodTitle = isNull(this.globalVal.paymentMethodInfo.paymentMethodTitle) ? '결제수단을 선택해 주세요.' : this.globalVal.paymentMethodInfo.paymentMethodTitle
              clearInterval(this.intervalId)
            }
          }, 300)
        }
      }, 30)
    },
    /**
     * Nspay 설정 (init)
     * @returns {void}
     */
    async setNspayInfo () {
      this.swiperNspay.finalPaymentAmt = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
      this.swiperNspay.minInstallCnt = this.globalVal.mOutputDatas.minInstallCnt > 0 ? this.globalVal.mOutputDatas.minInstallCnt : 0
      this.globalVal.paymentMethodInfo.checkedNspayOneTouch = this.globalVal.mOutputDatas.msg.nspaySmptYn === 'Y'
      this.setNspayBnftList()
      if (this.isLtFinalPaymentAmt()) {
        await this.getNspayPayInfoAll()
      } else {
        await this.getNspayNoIntInfo()
      }
      this.reInit()
    },
    /**
     * NSPAY 신용카드 청구할인 적용대상 코드 리스트 (ASIS: setBnftList)
     * @returns {void}
     */
    setNspayBnftList () {
      this.swiperNspay.cardBnftList = []
      for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
        const cardPreDcList = this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemDetailInfo.cardBnftList
        if (cardPreDcList && cardPreDcList.length > 0) {
          for (let j = 0; j < cardPreDcList.length; j++) {
            if (cardPreDcList[j].bnftType === '35') {
              const str = {
                cardBnftSpr: cardPreDcList[j].cardBnftSpr,
                cardBnftVal: cardPreDcList[j].cardBnftVal,
                amtStartVal: cardPreDcList[j].amtStartVal
              }
              this.swiperNspay.cardBnftList[cardPreDcList[j].cardCoCd] = str
            }
          }
        }
      }
    },
    /**
     * 모든 목록을 조회한다.
     * @returns {void}
     */
    async getNspayPayInfoAll () {
      await nsaxios.post('AjaxNSWPay', { cmdType: 'payInfoAll' }, data => {
        if (!isNull(data) && !isNull(data.payInfo)) {
          this.swiperNspay.payinfoList = data.payInfo
        } else {
          this.swiperNspay.payinfoList = []
        }

        if (!isNull(data) && !isNull(data.mappedCodeList)) {
          this.swiperNspay.mappedCodeList = data.mappedCodeList
        } else {
          this.swiperNspay.mappedCodeList = []
        }

        if (!isNull(data) && !isNull(data.mileage)) {
          this.swiperNspay.mileage = data.mileage
        } else {
          this.swiperNspay.mileage = null
        }

        this.setNspaySliderItems()
      }, e => { console.error(e) })
    },

    /**
     * SliderItem 설정
     * @returns {void}
     */
    async setNspaySliderItems () {
      this.swiperNspay.sliderItems = []
      if (!isNull(this.swiperNspay.payinfoList) && this.swiperNspay.payinfoList.payListCnt > 0) {
        this.swiperNspay.payinfoList.payList = this.sortNspayPayInfoList(this.swiperNspay.payinfoList.payList)
        const count = this.swiperNspay.payinfoList.payListCnt

        for (let i = count - 1; i >= 0; i--) {
          const payInfo = this.swiperNspay.payinfoList.payList[i]

          // 카드 Slider
          if (payInfo.payMethod === '01') {
            let nsCoCd = ''
            let showNsCoCd = false
            let cardBnft = ''
            let quotaList = []

            if (!isNull(payInfo.bankCardCode)) {
              nsCoCd = this.swiperNspay.mappedCodeList[payInfo.bankCardCode]

              if (!isNull(nsCoCd)) {
                cardBnft = this.swiperNspay.cardBnftList[nsCoCd]

                if (!isNull(cardBnft) && !isNull(cardBnft.cardBnftVal) && Number(cardBnft.cardBnftVal) > 0) {
                  showNsCoCd = true
                }
              }
            }

            if (this.isLtFinalPaymentAmt()) {
              quotaList = [{ value: '00', text: '일시불(5만원 이상할부가능)' }]
            } else if (this.isGeFinalPaymentAmt()) {
              quotaList = await this.addNspayCardQuota(payInfo.bankCardCode)
            }

            this.swiperNspay.sliderItems.unshift({
              payMethod: payInfo.payMethod,
              nsCoCd,
              showNsCoCd,
              cardBnft,
              ciCode: this.getNspayCardCiList().getCode(payInfo.bankCardCode),
              cardName: decodeURIComponent(payInfo.cardName),
              bankCardNo: payInfo.bankCardNo,
              wpayToken: payInfo.wpayToken,
              bankCardCode: payInfo.bankCardCode,
              majYn: payInfo.majYn,
              acntRegDttm: payInfo.acntRegDttm,
              data: payInfo,
              quota: '00',
              quotaList,
              disabledQuota: this.isLtFinalPaymentAmt(),
              activeIndex: 0
            })
          }

          // 계좌 Slider
          if (payInfo.payMethod === '16') {
            const ALLOW_BANK_CODES = ['002', '003', '004', '005', '007', '011', '020', '023', '027', '031', '032', '034', '035', '037', '039', '045', '048', '071', '088', '089']
            let acctCiCode = 'b0'
            let rate = ''

            if (ALLOW_BANK_CODES.includes(payInfo.bankCardCode)) {
              acctCiCode = this.getNspayAcctCiList().getCode(payInfo.bankCardCode)
            }

            if (!isNull(this.swiperNspay.mileage) &&
                !isNull(this.swiperNspay.mileage.rate)) {
              rate = this.swiperNspay.mileage.rate
            }

            this.swiperNspay.sliderItems.unshift({
              payMethod: payInfo.payMethod,
              rate,
              ciCode: acctCiCode,
              cardName: decodeURIComponent(payInfo.cardName),
              bankCardNo: payInfo.bankCardNo,
              wpayToken: payInfo.wpayToken,
              bankCardCode: payInfo.bankCardCode,
              majYn: payInfo.majYn,
              acntRegDttm: payInfo.acntRegDttm,
              data: payInfo
            })
          }
        }
      }

      this.swiperNspay.sliderItems.push({ payMethod: 'DEFAULT' })
      this.swiperNspay.selectedItem = this.swiperNspay.sliderItems[0]
      this.$nextTick(() => {
        this.gotoNspaySlideTo()
      })
    },
    /**
     * 결제 수단 정렬 (ASIS: sortPayList)
     * @param {Array} payList - 결제수단목록
     * @returns {Array}
     */
    sortNspayPayInfoList (payList) {
      // 실시간 계좌이체를 앞으로 처리
      payList.sort((a, b) => {
        const typeCard = '01'
        const typeAcct = '16'

        if (a.payMethod === typeCard && b.payMethod === typeAcct) {
          return 1
        }
        if (a.payMethod === typeAcct && b.payMethod === typeCard) {
          return -1
        }
        return 0
      })

      // 즐겨찾기를 앞으로 처리
      payList.sort((a, b) => {
        if (a.majYn === 'N' && b.majYn === 'Y') {
          return 1
        }
        if (a.majYn === 'Y' && b.majYn === 'N') {
          return -1
        }
        return 0
      })

      return payList
    },

    /**
     * 카드 CI 목록 (ASIS: getCardCiList)
     * @returns {Object}
     */
    getNspayCardCiList () {
      // 카드 CI 목록
      const cardCi = new Map()
      cardCi.set('01', { ci: 'c6', name: '하나(외환)카드' })// 하나(외환)카드
      cardCi.set('03', { ci: 'c7', name: '롯데카드' })// 롯데카드
      cardCi.set('04', { ci: 'c4', name: '현대카드' })// 현대카드
      cardCi.set('06', { ci: 'c2', name: '국민카드' })// 국민카드
      cardCi.set('11', { ci: 'c3', name: 'BC카드' })// BC카드
      cardCi.set('12', { ci: 'c5', name: '삼성카드' })// 삼성카드
      cardCi.set('14', { ci: 'c1', name: '신한카드' })// 신한카드
      cardCi.set('16', { ci: 'c8', name: 'NH카드' })// NH카드
      cardCi.set('17', { ci: 'c6', name: '하나(외환)카드' })// 하나(외환)카드

      const cardCiList = {
        cardCiList: cardCi,
        getCode (code) {
          const item = this.cardCiList.get(code)
          return isNull(item) ? '' : item.ci
        },
        getName (code) {
          const item = this.cardCiList.get(code)
          return isNull(item) ? '' : item.name
        },
        getQuotaName (value, quotaList) {
          if (value === '00') {
            return '일시불'
          }
          const item = quotaList.filter(o => {
            return o.value === value
          })[0]
          return isNull(item) ? '' : item.text
        }
      }

      return cardCiList
    },

    /**
     * 은행 CI 목록 (ASIS: getAcctCiList)
     * @returns {Object}
     */
    getNspayAcctCiList () {
      // 계좌 이체 CI 목록
      const acctCi = new Map()
      acctCi.set('002', { ci: 'b7', name: '산업' }) // 산업
      acctCi.set('003', { ci: 'b6', name: '기업' }) // 기업
      acctCi.set('004', { ci: 'b2', name: '국민' }) // 국민
      acctCi.set('005', { ci: 'b5', name: '하나' }) // 하나
      acctCi.set('007', { ci: 'b9', name: '수협' }) // 수협
      acctCi.set('011', { ci: 'b1', name: '농협' }) // 농협
      acctCi.set('020', { ci: 'b3', name: '우리' }) // 우리
      acctCi.set('023', { ci: 'b8', name: '제일' }) // 제일
      acctCi.set('027', { ci: 'b11', name: '시티' }) // 시티
      acctCi.set('031', { ci: 'b15', name: '대구' }) // 대구
      acctCi.set('032', { ci: 'b16', name: '부산' }) // 부산
      acctCi.set('034', { ci: 'b17', name: '광주' }) // 광주
      acctCi.set('035', { ci: 'b12', name: '제주' }) // 제주
      acctCi.set('037', { ci: 'b10', name: '전북' }) // 전북
      acctCi.set('039', { ci: 'b18', name: '경남' }) // 경남
      acctCi.set('045', { ci: 'b13', name: '새마을' }) // 새마을
      acctCi.set('048', { ci: 'b14', name: '신협' }) // 신협
      acctCi.set('071', { ci: 'b19', name: '우체국' })// 우체국
      acctCi.set('088', { ci: 'b4', name: '신한' }) // 신한
      acctCi.set('089', { ci: 'b21', name: '케이뱅크' }) // Kbank
      acctCi.set('999', { ci: 'b20', name: 'NS페이' }) // 위에 해당되는 카드코드가 없는 경우 보여줌

      const acctCiList = {
        acctCiList: acctCi,
        getCode (code) {
          const item = this.acctCiList.get(code)
          return isNull(item) ? '' : item.ci
        },
        getName (code) {
          const item = this.acctCiList.get(code)
          return isNull(item) ? '' : item.name
        }
      }

      return acctCiList
    },

    /**
     * 무이자 할부 리스트를 조회한다.
     * @param {Function}} callback - 바닥페이지에서 호출되어 사용되는 경우 (참고: setNspayFinalPaymentAmt)
     * @returns {void}
     */
    async getNspayNoIntInfo (callback) {
      const successHandler = async data => {
        if (!isNull(data) && !isNull(data.nointInfo)) {
          this.swiperNspay.noIntCardList = data.nointInfo || []
        }

        if (isNull(callback)) {
          await this.getNspayPayInfoAll()
        } else {
          callback()
        }
      }

      const failureHandler = error => {
        console.error(error)
        this.getNspayPayInfoAll() // Exception시에도 slider는 그린다.
      }

      const catalogId = isNull(this.globalVal.mInputParams.catalogId) ? COMM_CONST.getDefaultCatalogId() : this.globalVal.mInputParams.catalogId
      const params = {
        cmdType: 'noIntInfo',
        catalogId
      }
      await nsaxios.post('AjaxNSWPay', params, successHandler, failureHandler)
    },
    /**
     * 기본(카드/계좌) 추가 (ASIS: addPayment)
     * @param {String} payMethod - 결제수단코드
     * @returns {void}
     */
    onclickAddNspayInfo (payMethod) {
      if (!loginUtil.checkLogonStatus()) {
        this.$store.commit('orderSheet/setFromOrderSheetIsNoMemberOrder', true)
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.ORDER, null, false, this.$store.state.orderSheet.orderProduct)
        return false
      } else {
        window.vm = this // 기본(카드/계좌) 추가관련 window.open 의 새창에서 call 하기 위함
        window.vm.callbackName = 'callbackNspayInfoResult'
        const paramPopup = {
          titleAlign: 'center',
          isShowSearch: false,
          isShowCart: false,
          orderNspayParams: {
            sendFlag: 'addPayment',
            payMethod,
            userId: this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID
          }
        }

        // 버튼 위치 조정 (iOS App 버튼 위치 오류 대응)
        const reviseButtonPositionforiOSApp = () => {
          if (viewType() !== 'ios') {
            return
          }
          const theFixedButton = document.querySelector('.bottom_button')

          if (theFixedButton === null) {
            return
          }

          theFixedButton.style.bottom = '1px'

          setTimeout(() => {
            theFixedButton.style.bottom = 0
          }, 100)
        }
        popupUtil.show('order/OrderNspayCert.vue', paramPopup, reviseButtonPositionforiOSApp)
      }
    },
    /**
     * 기본(카드/계좌) 추가후 처리
     * @param {Object} data - 기본(카드/계좌) 추가결과 response
     * @returns {void}
     */
    callbackNspayInfoResult (data) {
      if (isOsApp() && viewType === 'ios') { // APP
        this.$store.commit('popup/hide')
      }
      delete window.vm.callbackName
      this.setNspayInfo()
    },
    /**
     * NS페이 서비스 해제 (ASIS: memUnReg)
     * @returns {void}
     */
    onclickNspayMemUnReg () {
      messageUtil.confirm('모든 정보 및 등록하신 결제수단이 삭제됩니다. 관련 법률에 의거, 거래 기록은 최대 5년간 보관 후 삭제됩니다. 서비스 해지를 진행하시겠습니까?',
        () => {},
        () => {
          nsaxios.post('AjaxNSWPay',
            {
              cmdType: 'memUnReg'
            }, data => {
              messageUtil.alert('이용 해지 처리가 완료되었습니다.', () => {
                this.setNspayInfo()
              })
            }, e => { console.error(e) })
        }, '아니오', '네')
    },
    /**
     * 선택한 결제정보를 삭제 (ASIS: delPayInfo)
     * @returns {void}
     */
    onclickDelNspayInfo () {
      messageUtil.confirm('해당 결제정보를 삭제하시겠습니까?',
        () => {},
        () => {
          const payInfo = this.swiperNspay.selectedItem
          nsaxios.post('AjaxNSWPay',
            {
              cmdType: 'delPayInfo',
              payMethod: payInfo.payMethod,
              wpayToken: payInfo.wpayToken,
              bankCardCode: payInfo.bankCardCode,
              bankCardNo: payInfo.bankCardNo,
              acntRegDttm: payInfo.acntRegDttm
            }, data => {
              this.setNspayInfo()
            }, e => { console.error(e) })
        },
        '아니오', '네')
    },
    /**
     * 기본(카드/계좌) 선택
     * @param {Number} index - 기본(카드/계좌) 선택 index
     * @returns {void}
     */
    onchangeNspayMajor (index) {
      this.swiperNspay.selectedItem = this.swiperNspay.sliderItems[index]
      const checked = this.$refs[`nspayMajYn${index}`][0].checked
      if (checked) {
        this.setNspayMajorInfo()
      } else {
        this.delNspayMajorInfo()
      }
    },
    /**
     * 기본(카드/계좌)설정 (ASIS: setMajorPayInfo)
     * @returns {void}
     */
    setNspayMajorInfo () {
      const payInfo = this.swiperNspay.selectedItem
      nsaxios.post('AjaxNSWPay',
        {
          cmdType: 'setMajorPayInfo',
          payMethod: payInfo.payMethod,
          wpayToken: payInfo.wpayToken,
          bankCardCode: payInfo.bankCardCode,
          bankCardNo: payInfo.bankCardNo,
          acntRegDttm: payInfo.acntRegDttm
        }, data => {
          this.setNspayInfo()
        }, e => { console.error(e) })
    },
    /**
     * 기본(카드/계좌)삭제 (ASIS: delMajorPayInfo)
     * @returns {void}
     */
    delNspayMajorInfo () {
      const payInfo = this.swiperNspay.selectedItem
      nsaxios.post('AjaxNSWPay',
        {
          cmdType: 'delMajorPayInfo',
          payMethod: payInfo.payMethod,
          wpayToken: payInfo.wpayToken,
          bankCardCode: payInfo.bankCardCode,
          bankCardNo: payInfo.bankCardNo,
          acntRegDttm: payInfo.acntRegDttm
        }, data => {
          this.setNspayInfo()
        }, e => { console.error(e) })
    },
    /**
     * 원터치결제 사용여부 체크
     * @returns {void}
     */
    onchangeNspayOneTouch () {
      if (!this.globalVal.paymentMethodInfo.checkedNspayOneTouch) {
        setTimeout(() => {
          this.globalVal.paymentMethodInfo.checkedNspayOneTouch = true
        }, 10)
        messageUtil.confirm('원터치 결제는 안전한 거래임이 확인된 경우에만 진행 됩니다.사용하지 않으면 결제시마다 비밀번호를 입력해야 합니다',
          () => {
            this.globalVal.paymentMethodInfo.checkedNspayOneTouch = true
          }, () => {
            this.globalVal.paymentMethodInfo.checkedNspayOneTouch = false
            this.setNspaySmptYn()
          }, '계속사용', '사용안함')
      } else {
        setTimeout(() => {
          this.globalVal.paymentMethodInfo.checkedNspayOneTouch = false
        }, 10)
        this.checkNspayPassword()
      }
    },
    /**
     * NSPAY 원터치 결제 설정 (ASIS: onclick_NsPaySmptYnSetting)
     * @returns {void}
     */
    setNspaySmptYn () {
      const invoke = {
        cmdType: 'setNSPayOneTouchFlag',
        userId: loginUtil.userId(),
        onTouchFlag: this.globalVal.paymentMethodInfo.checkedNspayOneTouch ? 'Y' : 'N'
      }

      nsaxios.post('AjaxNSWPay'
        , invoke
        , data => {
          this.globalVal.paymentMethodInfo.checkedNspayOneTouch = data.onTouchFlag[0] === 'Y'
          this.globalVal.mOutputDatas.msg.nspaySmptYn = data.onTouchFlag[0]
          if (data.msg.resultCode === '9999') {
            messageUtil.alert('미가입자입니다.')
          }
          if (viewType() === 'ios' && invoke.onTouchFlag === 'Y') {
            nativeUtil.goBack()
          }
        }, e => { console.error(e) })
    },
    /**
     * NSPAY 비밀번호 확인 (ASIS: checkNSPAYPassWord)
     * @returns {void}
     */
    checkNspayPassword () {
      if (!loginUtil.checkLogonStatus()) {
        bizUtil.gotoLogin()
        return false
      } else {
        window.vm = this // 기본(카드/계좌) 추가관련 window.open 의 새창에서 call 하기 위함
        window.vm.callbackName = 'callbackNspayPasswordResult'
        const paramPopup = {
          titleAlign: 'center',
          isShowSearch: false,
          isShowCart: false,
          orderNspayParams: {
            sendFlag: 'checkPW',
            userId: loginUtil.userId(),
            returnUrl: `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_check_pw_res.jsp`
          }
        }
        popupUtil.show('order/OrderNspayCert.vue', paramPopup, () => {})
      }
    },
    /**
     * NSPAY 비밀번호 확인 후 처리 (ASIS: checkPWResult)
     * @param {Object} data - NSPAY 비밀번호 확인결과 response
     * @returns {void}
     */
    callbackNspayPasswordResult (data) {
      delete window.vm.callbackName
      if (isNull(data)) {
        return false
      } else {
        if (viewType() === 'ios') {
          data = serializeToObject(data.params)
        } else {
          data = data.params
        }
      }

      if (data.resultCode === '0000') {
        this.globalVal.paymentMethodInfo.checkedNspayOneTouch = true
        this.setNspaySmptYn()
      } else {
        this.globalVal.paymentMethodInfo.checkedNspayOneTouch = false
        messageUtil.alert('인증번호 확인이 정상적으로 처리되지 않았습니다.')
      }
    },
    /**
     * NS페이 카드: 이니시스 무이자 할부 리스트 추가 (ASIS: addCardQuota)
     * @param {String} bankCardCode - 결제수단 코드
     * @returns {void}
     */
    async addNspayCardQuota (bankCardCode) {
      if (this.isGeFinalPaymentAmt()) {
        // NSSR-38498 모바일 NS페이 5만원미만->5만원이상으로 변경 시 할부 리스트 재조회 불가 이슈
        // 할인적용(쿠폰할인, 임직원할인, 적립금 등) 해제하면 5만원미만이고 할인적용하면 5만원이상인 상품인 경우에 대비해 조건 추가
        let nsCardCode = this.swiperNspay.mappedCodeList[bankCardCode] || ''
        let inisisNoInt = []
        this.swiperNspay.nsNoInt = []

        for (let x = 0; x < this.swiperNspay.noIntCardList.length; x++) {
          if (this.swiperNspay.noIntCardList[x].cardCode === bankCardCode) {
            const cardEventList = this.swiperNspay.noIntCardList[x].cardEventList
            nsCardCode = this.swiperNspay.noIntCardList[x].nsCardCode
            cardEventList.sort(function (a, b) { // 제이높은 금액부터 처리 하기 위한 amount 역순sort
              if (a.amount > b.amount) { return -1 }
              if (b.amount > a.amount) { return 1 }
              return 0
            })

            for (let i = 0; i < cardEventList.length; i++) {
              if (this.swiperNspay.finalPaymentAmt >= Number(cardEventList[i].amount * 10000)) {
                inisisNoInt = cardEventList[i].month
                break
              }
            }
          }
        }
        this.swiperNspay.nsNoInt = this.swiperNspay.nsNoInt.concat(inisisNoInt) // NS 무이자 개월 과 이니시스 무이자 개월을 합친다.
        const minInstSize = (this.swiperNspay.minInstallCnt > 12) ? 10 : (this.swiperNspay.minInstallCnt - 2)
        for (let i = 0; i <= minInstSize; i++) {
          this.swiperNspay.nsNoInt[i] = String(i + 2)
        }

        if (this.swiperNspay.minInstallCnt > 12) { // 이니시스에서 내려온 할부 정보가 최대 무이자 개월 수 보다 작을 경우 NS쪽 설정을 받아온다.
          const quotaList = await this.setNspayCardInstInfo(nsCardCode)
          return quotaList
        } else {
          return this.setNspayDrawNoIntArea(this.swiperNspay.nsNoInt)
        }
      }
    },
    /**
     * NS페이 카드: NS 무이자 할부 리스트
     * @param {Array} nsNoInt - 무이자 할부정보
     * @returns {void}
     */
    setNspayDrawNoIntArea (nsNoInt) {
      const quotaList = []
      nsNoInt = nsNoInt.slice().sort(function (a, b) { // 중복값을 제거한다.
        return a - b
      }).reduce(function (a, b) {
        if (a.slice(-1)[0] !== b) { a.push(b) }
        return a
      }, [])
      // 기본 할부개월 처리 (12개월)
      let maxEpQuota = 0
      for (let i = 2; i <= 12; i++) {
        let index = -1
        for (let j = 0; j < nsNoInt.length; j++) {
          if (String(nsNoInt[j]) === String(i)) {
            index = j
            break
          }
        }
        const prefix = i < 10 ? '0' : ''
        if (index > -1) {
          quotaList.push({ value: `${prefix}${i}`, text: `${prefix}${i}개월(무이자)`, flag: true })
          nsNoInt.splice(index, 1)
          maxEpQuota++
        } else {
          quotaList.push({ value: `${prefix}${i}`, text: `${prefix}${i}개월`, flag: false })
        }
      }

      // 12개월 이상 처리
      if (nsNoInt.length > 0) {
        for (let a = 0; a < nsNoInt.length; a++) {
          quotaList.push({ value: `${nsNoInt[a]}`, text: `${nsNoInt[a]}개월(무이자)`, flag: true })
        }
      }

      const temp = quotaList.filter(o => {
        return o.flag
      })
      if (maxEpQuota > 0) {
        const textMaxEpQuota = temp[temp.length - 1].value
        quotaList.unshift({ value: '00', text: `일시불(무이자최대 ${textMaxEpQuota}개월 가능)` })
      } else {
        quotaList.unshift({ value: '00', text: '일시불' })
      }
      return quotaList
    },
    /**
     * NS페이 카드: NS 무이자 할부 리스트
     * @param {String} cardVal - NS 카드값
     * @returns {void}
     */
    async setNspayCardInstInfo (cardVal) {
      let quotaList = []
      if (cardVal === 'SH') {
        cardVal = 'LG'
      }

      await nsaxios.post('NSMypageCommCmd',
        {
          tasknm: 'instmMmsList',
          var: cardVal
        }, data => {
          if (data.list) {
            data.list.some(i => {
              if (i > Number(this.swiperNspay.minInstallCnt)) {
                return true // break
              } else {
                if (i >= 10) {
                  this.swiperNspay.nsNoInt.push(String(i))
                }
              }
            })
          } else {
            this.swiperNspay.nsNoInt = this.setNspayCardInstInfoExtra(cardVal)
          }
          quotaList = this.setNspayDrawNoIntArea(this.swiperNspay.nsNoInt)

          // 바닥페이지에서 호출되는경우를 위해 사용
          this.globalVal.paymentMethodInfo.selectedNspay.item.quotaList = quotaList
        }, e => { console.error(e) })

      return quotaList
    },
    /**
     * NS페이 카드: NS 무이자 할부 리스트 Extra (ASIS: setNspayCardInstInfo_extra)
     * @param {String} cardVal - NS 카드값
     * @returns {Array}
     */
    setNspayCardInstInfoExtra (cardVal) {
      const minInstSize = (this.swiperNspay.minInstallCnt > 24) ? 24 : this.swiperNspay.minInstallCnt
      // 현대 무이자 : 2~12,24,36
      if (cardVal === 'DN') {
        if (this.swiperNspay.minInstallCnt >= 24) { this.swiperNspay.nsNoInt.push('24') }
        if (this.swiperNspay.minInstallCnt >= 36) { this.swiperNspay.nsNoInt.push('36') }
        return this.swiperNspay.nsNoInt
      }

      if (cardVal === 'KM' || cardVal === 'SS' || cardVal === 'SH') {
      // 국민,삼성,신한 무이자 : 2~24, 36
        for (let i = 13; i <= minInstSize; i++) {
          this.swiperNspay.nsNoInt.push(String(i))
        }

        if (this.swiperNspay.minInstallCnt >= 36) {
          this.swiperNspay.nsNoInt.push('36')
        }

        return this.swiperNspay.nsNoInt
      }

      // 롯데 무이자 : 2~24
      if (cardVal === 'AM') {
      // 국민,삼성,신한 무이자 : 2~24, 36
        for (let i = 13; i <= minInstSize; i++) {
          this.swiperNspay.nsNoInt.push(String(i))
        }
        return this.swiperNspay.nsNoInt
      }
      return this.swiperNspay.nsNoInt
    },
    /**
     * NS페이 카드: 신용카드 할부 선택 select onchange (ASIS: changeQuota)
     * @returns {void}
     */
    onchangeNspaySelectQuota () {
      let bankCardCode = ''
      let quotaList = ''
      let quota = '00'
      let noinstYn = 'N'

      const initCardQuota = (isInit, isFloor) => {
        const setCardQuota = _isFloor => {
          const elCardQuota = _isFloor ? this.$refs.floorNspayCardQuota : this.getNspayCardQuotaByActiveIndex()
          if (!isNull(elCardQuota)) {
            quota = elCardQuota.value || '00'
            const index = elCardQuota.selectedIndex < 0 ? 0 : elCardQuota.selectedIndex
            if (!isNull(elCardQuota.options[index])) {
              noinstYn = this.getNoinstYn(quota, elCardQuota.options[index].text)
            } else {
              return false
            }
          } else {
            return false
          }
        }

        if (isInit || isFloor) {
          setCardQuota(isFloor)
        }

        if (isFloor) {
          bankCardCode = this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardCode
          quotaList = this.globalVal.paymentMethodInfo.selectedNspay.item.quotaList

          if (isInit) {
            this.globalVal.paymentMethodInfo.selectedNspay.item.quota = quota
            this.globalVal.paymentMethodInfo.selectedNspay.item.noinstYn = noinstYn
          } else {
            this.globalVal.paymentMethodInfo.selectedNspay.item.quota = '00'
            this.globalVal.paymentMethodInfo.selectedNspay.item.noinstYn = 'N'
          }
        } else {
          bankCardCode = this.swiperNspay.selectedItem.bankCardCode
          quotaList = this.swiperNspay.selectedItem.quotaList

          if (isInit) {
            this.swiperNspay.selectedItem.quota = quota
            this.swiperNspay.selectedItem.noinstYn = noinstYn
          } else {
            this.getNspayCardQuotaByActiveIndex().value = '00'
            this.swiperNspay.selectedItem.quota = '00'
            this.swiperNspay.selectedItem.noinstYn = 'N'
          }
        }
        return true
      }

      if (!initCardQuota(true, this.isFloorMode)) {
        return false
      }

      if (this.globalVal.discountInfo.showSinglePaymentDiscount) {
        if (this.globalVal.discountInfo.checkedSinglePaymentDiscount && quota !== '00') {
          // (NSSR-19278 주문결제페이지 내 일시불할인 자동적용) - 일시불할인 체크박스 적용상태에서, NS페이 할부 선택
          const strConfirmMsg = `${'할부를 선택하셔서 일시불 할인 ' + '-'}${insertCommas(this.paymentData.Payment.getItem(0).cardDcAmt)}원` + '이 취소됩니다. 할부결제를 하시겠습니까?'
          messageUtil.confirm(strConfirmMsg, () => {
            // 확인 - 신용카드 할부 + 일시불할인 미적용
            this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
            this.onchangeSinglePaymentDiscount()
            this.setNspayCardQuota(quota, noinstYn)
            this.setFloorNspayCardTmplTitle(this.isFloorMode, bankCardCode, quota, quotaList)
          }, () => {
            // 취소 - 신용카드 일시불 + 일시불할인 적용
            initCardQuota(false, this.isFloorMode)
            this.setFloorNspayCardTmplTitle(this.isFloorMode, bankCardCode, '00', quotaList)
          }, '확인', '취소')
        } else if (quota === '00' && !this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
          initCardQuota(false, this.isFloorMode)
          this.setNspayCardQuota(quota, noinstYn)
        }
      } else {
        this.setNspayCardQuota(quota, noinstYn)
      }
      this.setFloorNspayCardTmplTitle(this.isFloorMode, bankCardCode, quota, quotaList)
    },
    /**
     * 바닥페이지 NS페이 신용카드 타이틀 설정
     * @param {String} mode - 바닥페이지 구분
     * @param {String} bankCardCode - 결제수단 코드
     * @param {String} quota - 할부 정보
     * @param {Array} quotaList - 할부 목록
     * @returns {void}
     */
    setFloorNspayCardTmplTitle (mode, bankCardCode, quota, quotaList) {
      if (mode) {
        const name = this.getNspayCardCiList().getName(bankCardCode)
        const quotaName = this.getNspayCardCiList().getQuotaName(quota, quotaList)
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType, name, quotaName)
      }
    },
    /**
     * NS페이 카드: 신용카드 할부 선택 (ASIS: setCardQuota)
     * @param {String} quota - 할부 정보
     * @param {String} noinstYn - 무이자 여부
     * @returns {void}
     */
    setNspayCardQuota (quota, noinstYn) {
      this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].cardQuota = quota
      this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].cardInterest = noinstYn

      if (this.globalVal.discountInfo.checkedSinglePaymentDiscount && quota !== '00') {
        this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
        this.onchangeSinglePaymentDiscount()
      } else if (quota === '00' && !this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
        // 카드일시불할인 항목 사용가능여부 체크
        let totalLspRate = 0
        for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
          const vImdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
          totalLspRate += Number(vImdtDcCpAmt.PROM_VAL_LSP_RATE)
        }

        if (totalLspRate !== 0 &&
            this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn !== 'Y' &&
            !this.globalVal.paymentMethodInfo.changeFinalAmtPaymentMethodNspayCardEmit) {
          this.globalVal.discountInfo.checkedSinglePaymentDiscount = true
          this.onchangeSinglePaymentDiscount()
        }
      }
    },
    /**
     * NS페이 카드: 할인 정보 (ASIS: dispCardDcCoupon)
     * @returns {void}
     */
    dispNspayCardDcCoupon () {
      const nsCoCd = this.swiperNspay.selectedItem.nsCoCd
      const cardNum = this.swiperNspay.selectedItem.bankCardNo.replace(/-/g, '').replace(/\*/g, '').substring(0, 6)
      const cardName = this.swiperNspay.selectedItem.cardName
      const basePrice = this.paymentData.Payment.paymentList[0].FINAL_PAYMENT_AMT

      for (let k = 0; k < this.paymentData.Discount.size(); k++) {
        this.paymentData.Discount.removeCouponItem(k, this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX) // 카드청구할인 삭제
      }

      for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
        const cardPreDcList = this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemDetailInfo.cardBnftList
        this.globalVal.paymentMethodInfo.nspayCardPointGuide.cardPreDc.isShow = false
        this.globalVal.paymentMethodInfo.nspayCardPointGuide.cardPreDc.fullText = ''

        if (cardPreDcList && cardPreDcList.length > 0) {
          for (let j = 0; j < cardPreDcList.length; j++) {
            if (cardPreDcList[j].cardCoCd === nsCoCd && cardPreDcList[j].bnftType === '35') { // 할인가 계산
              const cardBnft = cardPreDcList[j]
              if (basePrice >= cardBnft.amtStartVal && cardBnft.cardBnftSpr === '2') {
                this.globalVal.paymentMethodInfo.nspayCardPointGuide.cardPreDc.isShow = true
                this.globalVal.paymentMethodInfo.nspayCardPointGuide.cardPreDc.fullText = `${cardName} 최대 ${cardBnft.cardBnftVal}% 청구할인`
                break
              }
            }
          }
        } else {
          this.globalVal.paymentMethodInfo.nspayCardPointGuide.cardPreDc.isShow = false
          this.globalVal.paymentMethodInfo.nspayCardPointGuide.cardPreDc.fullText = ''
        }
      }

      this.setNspayCardDcCoupon(nsCoCd, cardNum)
    },
    /**
     * NS페이 카드: 할인정보 설정 (ASIS: setCardDcCoupon)
     * @param {String} nsCoCd - NS COCD
     * @param {String} cardNum - 카드번호
     * @returns {void}
     */
    setNspayCardDcCoupon (nsCoCd, cardNum) {
      const basePrice = this.paymentData.Payment.paymentList[0].FINAL_PAYMENT_AMT

      for (let k = 0; k < this.paymentData.Discount.size(); k++) {
        this.paymentData.Discount.removeCouponItem(k, this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX) // 카드청구할인 삭제
      }

      for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
        const cardPreDcList = this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemDetailInfo.cardBnftList
        const itemBaseData = this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemBaseData

        if (cardPreDcList && cardPreDcList.length > 0) {
          for (let j = 0; j < cardPreDcList.length; j++) {
            if (cardPreDcList[j].cardCoCd === nsCoCd && cardPreDcList[j].bnftType === '35') {
              const cardBnft = cardPreDcList[j]

              let dcPrice = cardBnft.cardBnftSpr === '1' ? Number(cardBnft.cardBnftVal) : Number(cardBnft.cardBnftVal) / 100 * basePrice
              dcPrice = Math.ceil(Math.round(dcPrice) / 10) * 10

              if (basePrice >= cardBnft.amtStartVal) {
                let singDcPrice = 0
                let diffAmt = ''

                if (cardBnft.maxBnftLimit !== '' && cardBnft.maxBnftLimit !== '0') {
                  if (cardBnft.cardBnftSpr === '2' && cardBnft.maxBnftLimit) {
                    if (dcPrice > Number(cardBnft.maxBnftLimit)) {
                      dcPrice = Number(cardBnft.maxBnftLimit)
                    }
                  }
                }

                if (cardBnft.cardBnftSpr === '1') { // 정액
                  // 절산된 전체 할인될 금액 - 절산된 개별(정액 / 갯수) 할인될 금액 * 갯수
                  singDcPrice = (Math.ceil(Math.round(Number(cardBnft.cardBnftVal) / itemBaseData.QTY) / 10) * 10)
                  diffAmt = dcPrice - (singDcPrice * itemBaseData.QTY)
                } else { // 정률
                  // 절산된 전체 할인될 금액 - 절산된 개별 할인될 금액 * 갯수
                  singDcPrice = (Math.ceil(Math.round((basePrice / itemBaseData.QTY) * (Number(cardBnft.cardBnftVal) / 100)) / 10) * 10)
                  diffAmt = dcPrice - (singDcPrice * itemBaseData.QTY)
                }

                this.paymentData.Discount.setItem(i, {
                  orderItemId: this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID,
                  CATENTRY_ID: this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.CATENTRY_ID_CHILD
                })

                const couponList = {
                  ListName: 'cardPreDc_35',
                  ImdtDcCpAmt: String(singDcPrice),
                  DiscountPrice: String(singDcPrice * itemBaseData.QTY),
                  PRMT_TYPE_CD: this.paymentData.Discount.getDefineValue('PRMT_TYPE_CD', 'cardPreDc'), // 프로모션타입코드
                  DC_TYPE_CD: '610', // 할인타입코드
                  WWW_RATE: cardBnft.cardBnftSpr === '2' ? String(cardBnft.cardBnftVal) : '0',
                  WWW_AMT: cardBnft.cardBnftSpr === '1' ? String(cardBnft.cardBnftVal) : '0',
                  MAX_USE_NUM: String(itemBaseData.QTY),
                  CP_IDFR: cardBnft.offerIdfr,
                  CP_NM: cardBnft.offerNm,
                  USED_COUPON_QTY: String(itemBaseData.QTY),
                  USED_COUPON: String(itemBaseData.QTY),
                  OFFER_BRCH: cardBnft.bnftType,
                  DIFF_AMT: String(diffAmt)
                }

                this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].EP_card_prefix = cardNum // 카드 prefix 6자리
                this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].EP_card_no = cardNum // 카드번호 마스킹 되어있어서 6자리만 처리
                this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD].usedcard_code = nsCoCd // 기존 카드사 코드
                this.paymentData.Discount.setCouponItem(i, this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX, couponList)
              }
            }
          }
        }
      }
    },
    /**
     * NS페이 결제금액 설정
     * NSSR-38498 모바일 NS페이 5만원미만->5만원이상으로 변경 시 할부 리스트 재조회 불가 이슈 (ASIS: setPaymentAmt)
     * TOBE: 선택 후 바닥페이지에서 호출되는 유형으로 바닥페이지의 할부 목록을 설정한다.
     * @param {Number} amt - 결제금액
     * @returns {void}
     */
    async setNspayFinalPaymentAmt (amt) {
      this.swiperNspay.finalPaymentAmt = amt
      if (this.isGeFinalPaymentAmt()) {
        if (this.isFloorMode) {
          this.swiperNspay.selectedItem = this.globalVal.paymentMethodInfo.selectedNspay.item
        }

        this.swiperNspay.minInstallCnt = this.globalVal.mOutputDatas.minInstallCnt > 0 ? this.globalVal.mOutputDatas.minInstallCnt : 0
        await this.getNspayNoIntInfo(async () => {
          const list = await this.addNspayCardQuota(this.swiperNspay.selectedItem.bankCardCode)
          if (this.isFloorMode) {
            this.swiperNspay.selectedItem.quotaList = list
            this.globalVal.paymentMethodInfo.selectedNspay.item.quotaList = list
          }
          this.$forceUpdate()
        })
      } else {
        if (!isNull(this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD]) &&
            !isNull(this.swiperNspay.selectedItem)) {
          const list = [{ value: '00', text: '일시불(5만원 이상할부가능)' }]
          this.swiperNspay.selectedItem.quotaList = list
          this.globalVal.paymentMethodInfo.selectedNspay.item.quotaList = list
          this.setNspayCardQuota('00', 'N')
          this.$forceUpdate()
        }
      }
    },
    /**
     * NS페이 계좌: 현금영수증 정보저장 (ASIS: setCashReceiptToParam)
     * @returns {void}
     */
    saveNspayReceiptInfo () {
      if (this.globalVal.paymentMethodInfo.checkedReceipt) {
        const receiptValue = this.globalVal.paymentMethodInfo.receiptValue
        if (this.globalVal.paymentMethodInfo.isChangeReceipt) {
          const receiptType = this.globalVal.paymentMethodInfo.receiptType
          if (receiptType === this.CONST_VALID_CASH_RECEIPT.PHONE_RECEIPT_TPYE) {
            this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].PHONE_NUM = receiptValue
          } else if (receiptType === this.CONST_VALID_CASH_RECEIPT.BIZ_RECEIPT_TPYE) {
            this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].BIZ_REG_NUM = receiptValue
          }

          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].RECEIPT_TYPE = receiptType
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].RECEIPT_SAVE = this.globalVal.paymentMethodInfo.isSaveReceiptValue
        } else {
          // 기존 현금 영수증 정보로 처리.
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].RECEIPT_TYPE = 'P'
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].PHONE_NUM = this.paymentData.OrderUserInfo.getItem().PHONE1
          this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].RECEIPT_SAVE = false
        }
      } else {
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].RECEIPT_TYPE = ''// 현금영수증 신청X
      }
    },
    /**
     * NS페이 계좌: 적립금 설정
     * @returns {void}
     */
    setNspayAccMileage () {
      if (this.mileage) {
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].mileageRate = this.mileage.rate
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].mileageMaxAmt = this.mileage.maxAmt
        this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER].mileageOfferId = this.mileage.offerId
      }

      const payAmt = this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT
      const mileageMaxAmt = this.mileage.maxAmt
      const mileageRate = this.mileage.rate * 0.01
      const mileageAmt = payAmt * mileageRate
      this.globalVal.discountInfo.forecastReservedAmt = (mileageAmt > mileageMaxAmt) ? mileageMaxAmt : mileageAmt
    }
  }
}

export default paymentNspayMixin
