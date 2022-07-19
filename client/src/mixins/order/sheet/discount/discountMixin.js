import {
  isNull,
  onlyNumFormat,
  moneyUnformat,
  insertCommas,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'

import { PAY_ASSIST_CONST } from '@/common/constants/order/order'

/**
 * DiscountMixin
 */
const discountMixin = {
  methods: {
    /**
     * 임직원 할인 노출
     * @param {Object} staffBnft - 임직원 혜택정보
     * @returns {void}
     */
    setStaffDiscount (staffBnft) {
      // NS임직원 할인 적용이 가능 한 상품 인 경우 에만 임직원 할인 노출
      if (staffBnft.empYn === 'Y') {
        // NS임직원 할인 잔여 한도 체크
        if (Number(staffBnft.balanceAmt) >= Number(this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT)) {
          // NS임직원 할인이 일반 쿠폰보다 할인률이 높으면 Y
          if (staffBnft.bnftBiggerYn === 'Y') {
            // 보유액이 구매금액보다 크고, 혜택이 큰경우 쿠폰과 함께 사용할 수 없다.
            this.globalVal.discountInfo.checkedEmployee = true // 임직원 할인 체크
            this.disabledEmployee = false // 임직원 할인 활성화
            this.checkedCoupons = false // 할인쿠폰 선택해제
          } else {
            this.isStaffBnftBigger = false
          }
        } else {
          // 보유액이 구매금액보다 작은경우, 사용할수 없으므로 체크박스 비활성화 한다.
          this.globalVal.discountInfo.checkedEmployee = false
          this.disabledEmployee = true
          this.staffBnftBalanceAmt = staffBnft.balanceAmt
          this.isUseStaffBnftWithCoupon = true
        }
        this.showDiscountStaff = true
      }
    },
    /**
     * 쿠폰할인 출력
     * @returns {void}
     */
    setDiscountCoupons () {
      const data = this.globalVal.mOutputDatas.msg

      // NS임직원 관련 데이터
      const selectKeyList = this.paymentData.Discount.getDefineValue('CouponSelectInfo', 'selectKeyList')
      const staffBnft = data.staffBnft
      const arrDlvCpList = [] // 무료배송쿠폰 리스트
      this.staffCouponListId = staffBnft.couponId

      // 주문서작성.쿠폰할인 목록 출력
      // 할인쿠폰, 더할인쿠폰, 가격할인은 별도 계산식에 따라 처리

      // 상품마다 구매 수량 2개 이상일 때 사용할 변수 초기화
      this.firsttimeCalc.length = data.OrderGoodList.length
      this.tempSeperatePrice.length = data.OrderGoodList.length
      this.tempSeperatePriceBase.length = data.OrderGoodList.length
      this.cpClssf.length = data.OrderGoodList.length
      this.tempDiscountPrice.length = data.OrderGoodList.length
      this.sumDiscountPrice.length = data.OrderGoodList.length

      for (let i = 0; i < data.OrderGoodList.length; i++) {
        this.firsttimeCalc[i] = false
        this.tempSeperatePrice[i] = []
        this.tempSeperatePriceBase[i] = 0
        this.cpClssf[i] = []
        this.cpClssf[i].length = 4
        this.tempDiscountPrice[i] = [0, 0, 0, 0]
        this.sumDiscountPrice[i] = 0
      }

      for (let i = 0; i < data.OrderGoodList.length; i++) {
        // 모든쿠폰제외여부가 설정이 되어 있으면 해당 상품은 모든 할인쿠폰이 적용되어서는 안됩니다
        // 해당 상품의 모든쿠폰제외여부 처리
        if (data.OrderGoodList[i].itemDetailInfo.everyCpExcptYn === 'Y') {
          continue
        }

        const goodsDetail = data.OrderGoodList[i].goodsDetail // 상품정보
        const itemDetailInfo = data.OrderGoodList[i].itemDetailInfo // 상품상세정보
        const couponItem = {
          brandName: '',
          productName: '',
          ORDERITEMS_ID: '',
          selectbox: []
        }

        couponItem.brandName = itemDetailInfo.brandName
        couponItem.productName = itemDetailInfo.productName
        couponItem.ORDERITEMS_ID = goodsDetail.ORDERITEMS_ID

        this.couponCount[goodsDetail.ORDERITEMS_ID] = 0

        // 무료배송 쿠폰 중복data를 제거 하고 별도 array에 담는다
        if (!isNull(data.CouponList[goodsDetail.ORDERITEMS_ID].freeDlvry)) {
          const arrFreeDlvry = data.CouponList[goodsDetail.ORDERITEMS_ID].freeDlvry
          if (arrFreeDlvry.length > 0) {
            for (let j = 0; arrFreeDlvry.length > j; j++) {
              let bInDataCheck = false

              for (let k = 0; arrDlvCpList.length > k; k++) {
                if (arrFreeDlvry[j].CP_IDFR === arrDlvCpList[k].CP_IDFR) {
                  arrDlvCpList[k].ORDERITEMS_IDS[arrDlvCpList[k].ORDERITEMS_IDS.length] = goodsDetail.ORDERITEMS_ID
                  bInDataCheck = true
                }
              }

              if (!bInDataCheck) {
                const nCount = arrDlvCpList.length
                arrDlvCpList[nCount] = arrFreeDlvry[j]
                arrDlvCpList[nCount].ORDERITEMS_IDS = []
                arrDlvCpList[nCount].ORDERITEMS_IDS[0] = goodsDetail.ORDERITEMS_ID
              }
            }
          }
        }

        // 상품별 쿠폰 select box
        for (let j = 0; j < selectKeyList.length; j++) {
          const selectboxItem = {
            disabled: false,
            cpChoice: false,
            defaultText: '',
            selectId: '',
            orderItemsId: goodsDetail.ORDERITEMS_ID, // (ASIS: onchange_discountCoupons) orderItemsId
            itemIndex: i, // (ASIS: onchange_discountCoupons)  itemIndex
            couponIndex: j, // (ASIS: onchange_discountCoupons)  couponIndex
            keyIndex: selectKeyList[j].index, // (ASIS: onchange_discountCoupons)  keyIndex
            data: '',
            option: []
          }

          selectboxItem.defaultText = selectKeyList[j].defaultText
          selectboxItem.selectId = `coupon_${j}_${goodsDetail.ORDERITEMS_ID}`
          selectboxItem.data = {
            ORDERITEMS_ID: goodsDetail.ORDERITEMS_ID,
            CATENTRY_ID_CHILD: goodsDetail.CATENTRY_ID_CHILD,
            ITEMPRICE: goodsDetail.ITEMPRICE,
            PRICE: goodsDetail.PRICE,
            DCPRICE: goodsDetail.DCPRICE,
            QUANTITY: goodsDetail.QUANTITY,
            _XPriceDtl_COST_VAT_PERDO: goodsDetail._XPriceDtl_COST_VAT_PERDO,
            _XPriceDtl_VAT_AMT: goodsDetail._XPriceDtl_VAT_AMT,
            XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE: goodsDetail.XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE
          }

          selectboxItem.cpChoice = Object.prototype.hasOwnProperty.call(data.CouponList[goodsDetail.ORDERITEMS_ID], selectKeyList[j].index)
          // 전문변경으로 쿠폰이 없을 경우 null이 나옴
          if (data.CouponList[goodsDetail.ORDERITEMS_ID][selectKeyList[j].index] === null) {
            selectboxItem.cpChoice = false
          }

          // 쿠폰별 select options list
          if (selectboxItem.cpChoice) {
            const couponDetailList = data.CouponList[goodsDetail.ORDERITEMS_ID][selectKeyList[j].index] // 쿠폰 상세 목록

            for (let k = 0; k < couponDetailList.length; k++) {
              const optionItem = {
                index: k,
                selectboxId: selectboxItem.selectId,
                isView: true,
                text: '',
                value: '',
                couponUnit: '',
                data: '',
                existStaffCp: false
              }
              optionItem.isView = true // 화면에 표시 여부

              // 플래쉬세일(슈퍼핫딜)의 경우 알뜰 쿠폰이 아닌경우 모두 화면 미표시
              if (goodsDetail.FLASH_SALE_YN === 'Y' && selectKeyList[j].index !== '3') {
                optionItem.isView = false // 화면 미표시
              }

              // 할인쿠폰(1), 더할인쿠폰(2) 일경우
              if (selectKeyList[j].index === '1' || selectKeyList[j].index === '2') {
                const strXCatentryDispXmdMinCntrbPfrate = goodsDetail.XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE // MD 이익률(문자열)
                if (undefined === strXCatentryDispXmdMinCntrbPfrate || strXCatentryDispXmdMinCntrbPfrate === null || strXCatentryDispXmdMinCntrbPfrate === '') {
                  // 화면 표시
                } else {
                  const nPrice = Number(goodsDetail.PRICE) // 매가  - goodsDetail.PRICE
                  const nDcPrice = couponDetailList[k].WWW_RATE === '0' ? Number(couponDetailList[k].WWW_AMT) : nPrice / 100 * Number(couponDetailList[k].WWW_RATE)// 할인금액
                  const nXPriceDtlCostVatPerdo = Number(goodsDetail._XPriceDtl_COST_VAT_PERDO) // 원가VAT별도금액  - goodsDetail._XPriceDtl_COST_VAT_PERDO
                  const nXPriceDtlVatAmt = Number(goodsDetail._XPriceDtl_VAT_AMT) // 부과세액  - goodsDetail._XPriceDtl_VAT_AMT
                  const nXCatentryDispXmdMinCntrbPfrate = Number(strXCatentryDispXmdMinCntrbPfrate) // MD 이익률  - goodsDetail.XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE

                  // (매가 - 할인금액 - 원가 VAT 별도금액 - 부과세액) / 매가  >= MD 이익률
                  if ((nPrice - nDcPrice - nXPriceDtlCostVatPerdo - nXPriceDtlVatAmt) / nPrice >= nXCatentryDispXmdMinCntrbPfrate / 100) {
                    // 화면 표시
                  } else {
                    optionItem.isView = false // 화면 미표시
                  }
                }
              }

              // 알뜰쿠폰(3) -> 정액 쿠폰인데 상품 가격보다 할인이 클 경우 쿠폰 미적용한다.
              if (selectKeyList[j].index === '3') {
                if (couponDetailList[k].WWW_RATE === '0') {
                  const nPrice = Number(goodsDetail.PRICE)
                  const nDcPrice = couponDetailList[k].WWW_RATE === '0' ? Number(couponDetailList[k].WWW_AMT) : nPrice / 100 * Number(couponDetailList[k].WWW_RATE)
                  if (nPrice <= nDcPrice) {
                    if (this.couponAlertCheck) {
                      messageUtil.alert(`해당 쿠폰은 최소 ${nDcPrice}원 초과로 구매하여야 사용하실 수 있습니다.`)
                      this.couponAlertCheck = false
                    }
                    optionItem.isView = false
                  }
                }
              }

              // 비회원 주문일 경우 옵션 화면에 표시하지 않음..
              if (this.globalVal.isGuest) {
                optionItem.isView = false
              }

              if (optionItem.isView) {
                optionItem.text = couponDetailList[k].CP_NM === '' ? `${selectKeyList[j].title}[${couponDetailList[k].CP_IDFR}]` : `${couponDetailList[k].CP_NM}[${couponDetailList[k].CP_IDFR}]`
                optionItem.value = `${goodsDetail.ORDERITEMS_ID}_${couponDetailList[k].CP_IDFR}`
                optionItem.data = couponDetailList[k]

                // NS임직원 쿠폰은 카운팅 제외
                if (staffBnft.couponId !== couponDetailList[k].CP_IDFR) {
                  this.couponCount[goodsDetail.ORDERITEMS_ID]++
                }

                // NS임직원 쿠폰 객체 리스트
                if (staffBnft.empYn === 'Y' && staffBnft.couponId === couponDetailList[k].CP_IDFR) {
                  this.existStaffCp = true
                  optionItem.existStaffCp = true
                  this.staffCouponList.push(optionItem)
                }
              }
              selectboxItem.option.push(optionItem)
            }

            if (selectboxItem.option.length > 0) {
              selectboxItem.option.unshift({
                isView: true,
                text: selectboxItem.defaultText,
                value: '',
                couponUnit: '',
                data: '',
                existStaffCp: false
              })
              couponItem.selectbox.push(selectboxItem)
            }
          }
        }

        if (couponItem.selectbox.length === 0) {
          couponItem.selectbox[0] = {
            disabled: true,
            cpChoice: false,
            keyIndex: '',
            defaultText: '',
            selectId: '',
            itemIndex: '',
            orderItemsId: '',
            couponIndex: '',
            data: '',
            option: [{
              isView: true,
              text: '적용가능한 쿠폰 없음',
              value: '',
              couponUnit: '',
              data: '',
              existStaffCp: false
            }]
          }
        }
        this.couponList.push(couponItem)
      }

      if (arrDlvCpList.length > 0) {
        this.freeDlvryCoupon.option.push({ value: '', text: '무료배송쿠폰', data: null })
        for (let i = 0; arrDlvCpList.length > i; i++) {
          const value = arrDlvCpList[i].CP_IDFR
          const text = `${arrDlvCpList[i].WWW_AMT}원 무료배송쿠폰[${arrDlvCpList[i].CP_IDFR}]`
          const data = arrDlvCpList[i]
          this.freeDlvryCoupon.option.push({ value, text, data })
        }

        // 단일상품, 수량 1개, 무료배송일 경우 무료배송쿠폰 숨김
        if (data.OrderGoodList.length === 1 &&
            data.OrderGoodList[0].goodsDetail.SHIPCHARGE === '0' &&
            data.OrderGoodList[0].goodsDetail.QUANTITY === '1') {
          this.showFreeDlvryCoupon = false // 무료배송쿠폰 숨김
          this.totalCouponCount = 0
        } else {
          this.showFreeDlvryCoupon = true // 무료배송쿠폰 사용
          this.totalCouponCount = arrDlvCpList.length
        }
      }

      for (const key in this.couponCount) {
        if (!isNull(this.couponCount[key])) {
          this.totalCouponCount += this.couponCount[key]
        }
      }

      // 자동선택 처리
      if (!this.globalVal.isGuest) { // 비회원이 아닌경우
        // 쿠폰할인 내역에서 할인금액이 가장 높은 쿠폰으로 자동 선택
        // 전문에서 나온 것을 자동으로 선택

        for (let i = 0; i < data.OrderGoodList.length; i++) {
          const goodsDetail = data.OrderGoodList[i].goodsDetail // 상품정보

          if (goodsDetail.FLASH_SALE_YN === 'Y' && goodsDetail.FLASH_COUPON_USE_YN === 'Y') { // 플래쉬세일(슈퍼핫딜)의 경우 처리
            // 슈퍼핫딜의 경우 쿠폰은 하나만 나오며 best 쿠폰에는 나타나지 않는다.
            // 고정 알뜰 쿠폰을 선택한다.
            // 해당 select box은 disabled 한다.
            // 상품상세에서 플레시 세일일 경우 쿠폰번호 main.js 쪽에 세팅하고 넘어와 사용 하도록 수정
            // 해피딜 상품 장바구니 담기 관련 - 수정사항 일단 개발만 적용 되도록 처리
            if (data.CouponList[goodsDetail.ORDERITEMS_ID][3] !== null) {
              for (let j = 0; data.CouponList[goodsDetail.ORDERITEMS_ID][3].length > j; j++) {
                const optionItem = {
                  selectboxId: '',
                  optionValue: ''
                }

                if (data.CouponList[goodsDetail.ORDERITEMS_ID][3][j].CP_IDFR === data.CouponList[goodsDetail.ORDERITEMS_ID].flashMap.OFFER_ITEM_CD) {
                  this.globalVal.discountInfo.flashSaleEnddd = data.CouponList[goodsDetail.ORDERITEMS_ID][j].CP_VALID_ENDDD // 쿠폰 종료일 전역변수 세팅
                }

                // 주문UI개편
                this.happyDealCouponFlag = 'Y' // ASIS: oncheckbox_coupon 사용됨

                optionItem.selectboxId = `coupon_${j}_${goodsDetail.ORDERITEMS_ID}`
                optionItem.optionValue = `${goodsDetail.ORDERITEMS_ID}_${data.CouponList[goodsDetail.ORDERITEMS_ID][3][j].CP_IDFR}`
                this.autoSelectedCoupon.push(optionItem)
              }
            }
          } else if (undefined !== data.BestCouponList[goodsDetail.ORDERITEMS_ID]) {
            for (let j = 0; j < selectKeyList.length; j++) { // 쿠폰 종류
              const optionItem = {
                selectboxId: '',
                optionValue: ''
              }

              const couponMapPlus = data.BestCouponList[goodsDetail.ORDERITEMS_ID].couponMap[`plus${selectKeyList[j].index}`]
              if (!isNull(couponMapPlus) && !isNull(couponMapPlus.cpIdfr)) {
                optionItem.selectboxId = `coupon_${j}_${goodsDetail.ORDERITEMS_ID}`
                optionItem.optionValue = `${goodsDetail.ORDERITEMS_ID}_${couponMapPlus.cpIdfr}`
                this.autoSelectedCoupon.push(optionItem)
              }
            }
          }
        }

        if (this.autoSelectedCoupon.length > 0) {
          this.checkedCoupons = true
        }
      }
    },
    /**
     * 임직원 할인, 임직원 쿠폰 추가
     * 임직원 할인 적용시에 쿠폰목록에 추가하여 사용
     * @returns {void}
     */
    addStaffCoupon () {
      if (this.staffCouponList.length > 0 && this.couponList.length > 0) {
        for (const couponItem of this.couponList) {
          for (const selectboxItem of couponItem.selectbox) {
            for (const itemStaffCoupon of this.staffCouponList) {
              if (itemStaffCoupon.selectboxId === selectboxItem.selectId) {
                if (!this.isUseStaffBnftWithCoupon && !this.globalVal.discountInfo.checkedEmployee) {
                  const removeIndex = selectboxItem.option.findIndex(option => { return option.value === itemStaffCoupon.value })
                  if (removeIndex > 0) {
                    selectboxItem.option.splice(removeIndex, 1)
                  }
                } else {
                  selectboxItem.option.splice(selectboxItem.option.length + 1, 1, itemStaffCoupon)
                }
              }
            }
          }
        }
      }
    },
    /**
     * 임직원 할인, 임직원 쿠폰 삭제
     * 임직원 할인 해제시에 쿠폰목록에 삭제하여 사용
     * @returns {void}
     */
    removeStaffCoupon () {
      if (this.staffCouponList.length > 0 && this.couponList.length > 0) {
        for (const couponItem of this.couponList) { // 전체 쿠폰 목록
          for (const selectboxItem of couponItem.selectbox) { // 쿠폰 selectbox
            for (const itemStaffCoupon of this.staffCouponList) { // 임직원 쿠폰
              if (itemStaffCoupon.selectboxId === selectboxItem.selectId) { // 쿠폰 === 임직원 쿠폰이 같은경우
                selectboxItem.option = selectboxItem.option.filter(o => { // 임직원 쿠폰을 제외한다.
                  return itemStaffCoupon.value !== o.value
                })
              }
            }
          }
        }
      }
    },
    /**
     * 이전 선택된 쿠폰 정보에서 중복사용된 쿠폰 value 값으로 selectbox 가져오기
     * @param {String} value
     * @returns {Object}
     */
    getPreviousCouponSelectboxByValue (value) {
      let selectbox = null
      const couponCode = value.split('_')[1]
      for (const couponItem of this.couponList) {
        for (const selectItem of couponItem.selectbox) {
          const prevValue = this.previousCoupons[selectItem.selectId]
          if (!isNull(prevValue) &&
               (value !== prevValue && couponCode === prevValue.split('_')[1])) {
            selectbox = selectItem
          }
        }
      }
      return selectbox
    },
    /**
     * 쿠폰 selectbox 가져오기
     * @param {String} selectboxId
     * @returns {Object}
     */
    getCouponSelectbox (selectboxId) {
      let selectbox = null
      for (const couponItem of this.couponList) {
        for (const selectItem of couponItem.selectbox) {
          if (selectItem.selectId === selectboxId) {
            selectbox = selectItem
          }
        }
      }
      return selectbox
    },
    /**
     * 쿠폰 selectbox option 가져오기
     * @param {Object} selectbox
     * @returns {Object}
     */
    getCouponOption (selectbox) {
      let optionItem = null
      const value = document.getElementById(selectbox.selectId).value

      for (const option of selectbox.option) {
        if (value === option.value) {
          optionItem = option
        }
      }
      return optionItem
    },
    /**
     * 무료배송쿠폰 selectbox option 가져오기
     * @returns {Object}
     */
    getDeliveryCouponOption (_orderItemId) {
      let optionItem = null
      const value = document.getElementById(`${this.freeDlvryCoupon.id}_${_orderItemId}`).value

      for (const option of this.freeDlvryCoupon.option) {
        if (value === option.value) {
          optionItem = option
        }
      }
      return optionItem
    },
    /**
     * 무료배송쿠폰 select onchange (ASIS: onchange_deliveryCoupons)
     * @returns {void}
     */
    onchangeDeliveryCoupon (_orderItemId) {
      const selectedId = `${this.freeDlvryCoupon.id}_${_orderItemId}`
      const selectedOptionValue = document.getElementById(selectedId).value
      const tmpCpnID = selectedId
      const tmpCpnMatchID = tmpCpnID.split('_')
      const cpnMatchID = tmpCpnMatchID[2]

      // 무료배송쿠폰 관련 적재 data 삭제
      for (let i = 0; this.paymentData.Discount.discountList.length > i; i++) {
        const objCPList = this.paymentData.Discount.discountList[i].couponList[this.globalVal.CONST.DISCOUNT_FREE_DLVRY_DC_INDEX]

        if (objCPList != null || undefined !== objCPList) {
          this.paymentData.Discount.removeCouponItem(i, String(this.globalVal.CONST.DISCOUNT_FREE_DLVRY_DC_INDEX))
        }
      }

      // 카드일시불할인 해제
      if (this.showFreeDlvryCoupon &&
          this.globalVal.discountInfo.showSinglePaymentDiscount &&
          this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
        // this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
        this.onchangeSinglePaymentDiscount()
      }

      // 적립금/예치금 사용 모두 취소
      this.useAmtCancel()

      // 카드사 디폴트 고정
      this.$root.$emit('paymentMethodCardSelectEmit')

      // 값이 없을 경우 처리
      if (selectedOptionValue === '') {
        this.globalVal.discountInfo.dcCouponAmt = '0'
        this.checkedCoupons = false
        // this.disabledCheckboxCoupons = !this.checkedCoupons
        this.freeDlvryCoupon.selected = ''
        this.setDiscountAmount() // 재계산 및 화면 표시
        return false
      }

      // 선택된 option의 값 추출
      const optionItem = this.getDeliveryCouponOption(_orderItemId)
      const objOptionData = optionItem.data
      const objLastData = {} // 최종적으로 적용할 item data
      let bBreak = false // 적합한 data가 있을 경우 true

      const arrDLVList = this.paymentData.Delivery.deliveryList // deliveryList 적재
      let addressId = ''

      // 적절한 item data 추출
      for (let i = 0; arrDLVList.length > i; i++) { // deliveryList 반복
        for (let j = 0; arrDLVList[i].ITEMS.length > j; j++) { // deliveryList의 하위 ITEMS의 반복
          // 만약 복수배송지라면 배송지별로 선택된 배송상품의 배송비 금액 확인해서 조건이 맞는지 판단한다.
          // 선택한 상품, 상품에 딸려있는 쿠폰 종류

          const tmpShipCharge = arrDLVList[i].ITEMS[j].SHIPCHARGE
          const tmpRmaShipCharge = arrDLVList[i].ITEMS[j].RMASHIPCHARGE
          const tmpWwwAmt = objOptionData.WWW_AMT

          if (((tmpShipCharge !== '0' && (Number(tmpShipCharge) <= Number(tmpWwwAmt))) ||
                (tmpRmaShipCharge !== '0' && (Number(tmpRmaShipCharge) <= Number(tmpWwwAmt)))) &&
              (Number(tmpShipCharge) + Number(tmpRmaShipCharge) <= Number(tmpWwwAmt))) {
            // 위 if 구문에 내가 선택한 쿠폰과 상품의 쿠폰 매칭 조건이 추가되어야 한다.
            for (let k = 0; objOptionData.ORDERITEMS_IDS.length > k; k++) { // 쿠폰 data에서 해당 쿠폰을 해당 item이 사용가능 한지 판단하기 위해 ORDERITEMS_IDS 반복
              if (arrDLVList[i].ITEMS[j].ORDERITEMS_ID === objOptionData.ORDERITEMS_IDS[k]) { // 해당 item의 id와 쿠폰의 사용가능 id가 같으면 진행
                if (Number(arrDLVList[i].ITEMS[j].SHIPCHARGE) === Number(objOptionData.WWW_AMT)) { // 배송 가격과 할인 가격이 같으면 해당 적합한 값으로 보고 진행
                  objLastData.itemIndex = i
                  objLastData.items = arrDLVList[i].ITEMS[j]
                  addressId = arrDLVList[i].ADDRESS_ID

                  bBreak = true // 적합한 data를 찾아서 더이상 진행이 필요 없으므로...
                } else {
                  if (undefined === objLastData.itemIndex) { // 적재된 data가 없을 경우
                    if (cpnMatchID === objOptionData.ORDERITEMS_IDS[k]) {
                      objLastData.itemIndex = i
                      objLastData.items = arrDLVList[i].ITEMS[j]
                      addressId = arrDLVList[i].ADDRESS_ID
                    }
                  } else {
                    if (cpnMatchID === objOptionData.ORDERITEMS_IDS[k]) {
                      if (Number(objLastData.items.SHIPCHARGE) < Number(arrDLVList[i].ITEMS[j].SHIPCHARGE)) { // 적재된 data의 배송비 값이 새로운 data보다 작을 경우 새롭게 적재를 위해 진행
                        objLastData.itemIndex = i
                        objLastData.items = arrDLVList[i].ITEMS[j]
                        addressId = arrDLVList[i].ADDRESS_ID
                      } else if (Number(objLastData.items.RMASHIPCHARGE) < Number(arrDLVList[i].ITEMS[j].RMASHIPCHARGE)) {
                        objLastData.itemIndex = i
                        objLastData.items = arrDLVList[i].ITEMS[j]
                        addressId = arrDLVList[i].ADDRESS_ID
                      }
                    }
                  }
                }
                break // 사용가능한 쿠폰으로 판단하였기에 상위 포문 정지
              }
            }
            if (bBreak) {
              break
            } // 더이상 진행 불필요
          }
        }
        if (bBreak) {
          break
        } // 더이상 진행 불필요
      }

      // 무료쿠폰영역 선택제어 - 2가지 이상의 상품일 때 무료쿠폰을 한 상품에서 선택하면 다른 상품에는 선택할 수 없도록 한다.
      if (!isNull(this.freeDlvryCoupon.selected)) {
        messageUtil.alert('무료배송쿠폰은 중복사용 할 수 없습니다. 복수 배송지일 경우 상품 적용 후 다시 시도해 주세요.')
        document.getElementById(selectedId).value = ''
        this.onchangeDeliveryCoupon(_orderItemId)
        this.useAmtCancel() // 적립금/예치금 사용 모두 취소

        return false
      }

      // 상품에 따른 쿠폰 적용이 실패했을 때
      // 적용할 item data가 없을경우 처리
      if (undefined === objLastData.itemIndex) {
        messageUtil.alert(`${objOptionData.WWW_AMT}원 무료배송쿠폰의 사용 가능한 상품이 없습니다. 복수 배송지일 경우 상품 적용 후 다시 시도해 주세요.`)
        document.getElementById(selectedId).value = ''
        this.onchangeDeliveryCoupon(_orderItemId)
        this.useAmtCancel() // 적립금/예치금 사용 모두 취소

        return false
      }

      this.paymentData.Discount.setItem(objLastData.itemIndex, {
        orderItemId: objLastData.items.ORDERITEMS_ID,
        CATENTRY_ID: objLastData.items.CATENTRY_ID
      })

      let tmpShipCharge
      if (objLastData.items.SHIPCHARGE === '0' && objLastData.items.RMASHIPCHARGE !== '0') {
        tmpShipCharge = objLastData.items.RMASHIPCHARGE
      } else {
        tmpShipCharge = Number(objLastData.items.SHIPCHARGE) + Number(objLastData.items.RMASHIPCHARGE)
      }

      if (this.globalVal.productInfo.nCountGds < 2) {
        objLastData.itemIndex = 0
      }
      this.paymentData.Discount.setCouponItem(objLastData.itemIndex, this.globalVal.CONST.DISCOUNT_FREE_DLVRY_DC_INDEX, {
        ListName: 'freeDlvry',
        ImdtDcCpAmt: String(tmpShipCharge),
        DiscountPrice: String(tmpShipCharge),
        PRMT_TYPE_CD: this.paymentData.Discount.getDefineValue('PRMT_TYPE_CD', 'freeDlvry'), // 프로모션타입코드
        DC_TYPE_CD: this.paymentData.Discount.getDefineValue('DC_TYPE_CD', 'freeDlvry'), // 할인타입코드
        WWW_RATE: objOptionData.WWW_RATE,
        WWW_AMT: objOptionData.WWW_AMT,
        MAX_USE_NUM: objOptionData.MAX_USE_NUM,
        CP_IDFR: objOptionData.CP_IDFR,
        USED_COUPON_QTY: objLastData.items.QUANTITY,
        ADDRESS_ID: addressId
      })

      this.globalVal.discountInfo.dcCouponAmt = tmpShipCharge
      this.checkedCoupons = tmpShipCharge > 0
      this.checkedShipDcAmt = tmpShipCharge > 0
      // this.disabledCheckboxCoupons = !this.checkedCoupons
      this.freeDlvryCoupon.selected = selectedOptionValue
      this.setDiscountAmount() // 재 개산 및 화면 표시
    },
    /**
     * 할인정보 출력
     * @returns {void}
     */
    setAdjustmentList () {
      const data = this.globalVal.mOutputDatas.msg
      // 기획요건에서 사용안함으로 변경되면 적용
      data.UsePaymentInfo.OKCASHBAG = 'N'
      data.UsePaymentInfo.HAPPYMONEY = 'N'

      if ((Number(data.UserInfoBenefit.ANNUDCCP_BALANCE) > 0) &&
            (this.globalVal.mOutputDatas.giftDispTypeYn !== 'Y')) {
        this.globalVal.discountInfo.annualDcAvaAmt = this.getNumber(data.UserInfoBenefit.ANNUDCCP_BALANCE || '0')
        this.disabledInitAnnualDc = (this.globalVal.discountInfo.annualDcAvaAmt === 0)
        this.adjustmentList.push({
          targetId: 'discountAnnual',
          name: PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.EN, // 'annualCoupons',
          title: PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.KO, // '연간할인권',
          amountText: '보유 금액',
          amountFieldName: 'UserInfoBenefit.ANNUDCCP_BALANCE',
          amount: this.globalVal.discountInfo.annualDcAvaAmt
        })
      } else {
        this.disabledInitAnnualDc = true // 연간할인권 사용안함
      }

      if (data.UsePaymentInfo.OKCASHBAG === 'Y') {
        this.globalVal.discountInfo.okCashbagAvaAmt = this.getNumber(data.UserInfoBenefit.OKCASHBAG_BALANCE || '0')
        this.disabledInitOkCashbag = (this.globalVal.discountInfo.okCashbagAvaAmt === 0)
        this.adjustmentList.push({
          targetId: 'reserveUse',
          name: PAY_ASSIST_CONST.INFO.OK_CASHBAG.EN, // 'okCashbag',
          title: PAY_ASSIST_CONST.INFO.OK_CASHBAG.KO, // 'OK캐쉬백',
          amountText: '잔액',
          amountFieldName: 'UserInfoBenefit.OKCASHBAG_BALANCE',
          amount: this.globalVal.discountInfo.okCashbagAvaAmt,
          link: { title: 'OK캐쉬백조회' }
        })
      } else {
        this.disabledInitOkCashbag = true
      }

      if (data.UsePaymentInfo.ACCUMMONEY === 'Y' &&
          (Number(data.UserInfoBenefit.MILEAGE_BALANCE) > 0) &&
          data.UserInfo.REGISTERTYPE !== 'G') {
        this.globalVal.discountInfo.reservesAvaAmt = this.getNumber(data.UserInfoBenefit.MILEAGE_BALANCE || '0')
        this.disabledInitReserved = (this.globalVal.discountInfo.reservesAvaAmt === 0)
        this.adjustmentList.push({
          targetId: 'reserveUse',
          name: PAY_ASSIST_CONST.INFO.RESERVED_AMT.EN, // 'reservedAmt',
          title: PAY_ASSIST_CONST.INFO.RESERVED_AMT.KO, // '적립금',
          amountText: `보유 ${PAY_ASSIST_CONST.INFO.RESERVED_AMT.KO}`,
          amountFieldName: 'UserInfoBenefit.MILEAGE_BALANCE',
          amount: this.globalVal.discountInfo.reservesAvaAmt
        })
      } else {
        this.disabledInitReserved = true
      }

      if (data.UsePaymentInfo.HAPPYMONEY === 'Y') {
        this.globalVal.discountInfo.happyMoneyAvaAmt = this.getNumber(data.UserInfoBenefit.HAPPYMONEY_BALANCE || '0')
        this.disabledInitHappyMoney = (this.globalVal.discountInfo.happyMoneyAvaAmt === 0)
        this.adjustmentList.push({
          targetId: 'reserveUse',
          name: PAY_ASSIST_CONST.INFO.HAPPY_MONEY.EN, // 'happyMoney',
          title: PAY_ASSIST_CONST.INFO.HAPPY_MONEY.KO,
          amountText: '잔액',
          amountFieldName: 'UserInfoBenefit.HAPPYMONEY_BALANCE',
          amount: this.globalVal.discountInfo.happyMoneyAvaAmt,
          link: { title: `${PAY_ASSIST_CONST.INFO.HAPPY_MONEY.KO}조회` }
        })
      } else {
        this.disabledInitHappyMoney = true
      }

      if (data.UsePaymentInfo.GIFTCARD === 'Y' && data.UserInfo.REGISTERTYPE !== 'G') {
        this.globalVal.discountInfo.nsGiftCardAvaAmt = this.getNumber(data.UserInfoBenefit.GIFTCARD_BALANCE || '0')
        this.disabledInitGiftCard = (this.globalVal.discountInfo.nsGiftCardAvaAmt === 0)
        this.adjustmentList.push({
          targetId: 'reserveUse',
          name: PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.EN, // 'giftCardAmount',
          title: PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.KO, // 'NS상품권',
          amountText: '보유 금액',
          amountFieldName: 'UserInfoBenefit.GIFTCARD_BALANCE',
          amount: this.globalVal.discountInfo.nsGiftCardAvaAmt,
          link: { title: '상품권등록' }
        })
      } else {
        this.disabledInitGiftCard = true
      }

      // 노출여부와 가격 필드명이 바뀌어 있음... 이슈 재기하였으나 IBM에서 처리 못할것으로 판단됨
      if (data.UsePaymentInfo.MILEAGE === 'Y' &&
          Number(data.UserInfoBenefit.ACCUMONEY_BALANCE) > 0 &&
          data.UserInfo.REGISTERTYPE !== 'G') {
        this.globalVal.discountInfo.depositAvaAmt = this.getNumber(data.UserInfoBenefit.ACCUMONEY_BALANCE || '0')
        this.disabledInitDeposit = (this.globalVal.discountInfo.depositAvaAmt === 0)
        this.adjustmentList.push({
          targetId: 'reserveUse',
          name: PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.EN, // 'depositAmount',
          title: PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.KO, // '예치금',
          amountText: `보유 ${PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.KO}`,
          amountFieldName: 'UserInfoBenefit.ACCUMONEY_BALANCE',
          amount: this.globalVal.discountInfo.depositAvaAmt
        })
      } else {
        this.disabledInitDeposit = true
      }

      // 카드일시불할인 항목 사용가능여부 체크
      let totalLspRate = 0
      for (let z = 0; z < data.OrderGoodList.length; z++) {
        const vImdtDcCpAmt = data.ImdtDcCpAmtList[data.OrderGoodList[z].goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
        totalLspRate += Number(vImdtDcCpAmt.PROM_VAL_LSP_RATE)
      }

      // 일시불할인제외여부가 설정이 되어 있으면 해당 상품은 일시불할인 데이터가 존재하더라도 할인 금액이 적용, 노출되어서는 안됩니다
      if (totalLspRate === 0 || data.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn === 'Y') {
        this.globalVal.discountInfo.showSinglePaymentDiscount = false // 카드일시불할인 사용안함
      }
    },
    /**
     * OK캐쉬백 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledOkCashbag (value) {
      this.disabledCheckboxOkCashbagAmt = value
      this.disabledOkCashbagAmt = value
    },
    /**
     * 적립금 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledReserved (value) {
      this.disabledCheckboxReservedAmt = value
      this.disabledReservedAmt = value
    },
    /**
     * 해피머니 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledHappyMoney (value) {
      this.disabledCheckboxHappyMoneyAmt = value
      this.disabledHappyMoneyAmt = value
    },
    /**
     * NS상품권 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledGiftCard (value) {
      this.disabledCheckboxGiftCardAmt = value
      this.disabledGiftCardAmt = value
    },
    /**
     * 예치금 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledDeposit (value) {
      this.disabledCheckboxDepositAmt = value
      this.disabledDepositAmt = value
    },
    /**
     * 연간할인권 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledAnnualDc (value) {
      this.disabledCheckboxAnnualDcAmt = value
      this.disabledAnnualDcAmt = value
    },
    /**
     * 네티웰 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledNetiWell (value) {
      this.disabledCheckboxNetiWellAmt = value
      this.disabledNetiWellAmt = value
    },
    /**
     * 일시불 활성화/비활성화
     * @param {Boolean} value
     * @returns {void}
     */
    disabledSinglePaymentDiscount (value) {
      this.globalVal.discountInfo.disabledCheckboxSinglePaymentDiscount = value
    },
    /**
     * 사용금액이 0보다 큰경우
     * @returns {void}
     */
    checkedAllUseAmtGtZero () {
      this.checkedReservedAmt = this.getNumber(this.globalVal.discountInfo.reservesUseAmt) > 0
      this.checkedHappyMoneyAmt = this.getNumber(this.globalVal.discountInfo.happyMoneyUseAmt) > 0
      this.checkedGiftCardAmt = this.getNumber(this.globalVal.discountInfo.nsGiftCardUseAmt) > 0
      this.checkedDepositAmt = this.getNumber(this.globalVal.discountInfo.depositUseAmt) > 0
      this.checkedOkCashbagAmt = this.getNumber(this.globalVal.discountInfo.okCashbagUseAmt) > 0
      // this.checkedAnnualDcAmt = this.getNumber(this.globalVal.discountInfo.annualDcUseAmt) > 0
      // this.checkedNetiWellAmt = this.getNumber(this.globalVal.discountInfo.netiWellUseAmt) > 0
    },
    /**
     * 임직원 제외 모두 비활성화 처리
     * @returns {void}
     */
    disabledAllExcludeEmployee () {
      this.disabledSinglePaymentDiscount(true)
      this.disabledOkCashbag(true)
      this.disabledReserved(true)
      this.disabledHappyMoney(true)
      this.disabledGiftCard(true)
      this.disabledDeposit(true)
      this.disabledAnnualDc(true)
      this.disabledNetiWell(true)
    },
    /**
     * 사용금액이 0보다 큰경우
     * @returns {void}
     */
    checkedAllClear () {
      this.checkedReservedAmt = false
      this.checkedHappyMoneyAmt = false
      this.checkedGiftCardAmt = false
      this.checkedDepositAmt = false
      this.checkedOkCashbagAmt = false
      // this.checkedAnnualDcAmt = false
      // this.checkedNetiWellAmt = false
    },
    /**
     * 전체 사용금액
     * @returns {Number}
     */
    getAllUseAmt () {
      const totalAmt = this.getNumber(this.globalVal.discountInfo.reservesUseAmt) +
      this.getNumber(this.globalVal.discountInfo.happyMoneyUseAmt) +
      this.getNumber(this.globalVal.discountInfo.nsGiftCardUseAmt) +
      this.getNumber(this.globalVal.discountInfo.depositUseAmt) +
      this.getNumber(this.globalVal.discountInfo.okCashbagUseAmt)
      // this.checkedAnnualDcAmt = this.getNumber(this.globalVal.discountInfo.annualDcUseAmt)
      // this.checkedNetiWellAmt = this.getNumber(this.globalVal.discountInfo.netiWellUseAmt)

      return totalAmt
    },
    /**
     * 보유액이 0이면 비활성화
     * @returns {void}
     */
    disabledAvaAmt () {
      const isZeroReservesAvaAmt = this.getNumber(this.globalVal.discountInfo.reservesAvaAmt) === 0
      this.disabledReserved(isZeroReservesAvaAmt)

      const isZeroHappyMoneyAvaAmt = this.getNumber(this.globalVal.discountInfo.happyMoneyAvaAmt) === 0
      this.disabledHappyMoney(isZeroHappyMoneyAvaAmt)

      const isZeroGiftCardAvaAmt = this.getNumber(this.globalVal.discountInfo.nsGiftCardAvaAmt) === 0
      this.disabledGiftCard(isZeroGiftCardAvaAmt)

      const isZeroDepositAvaAmt = this.getNumber(this.globalVal.discountInfo.depositAvaAmt) === 0
      this.disabledDeposit(isZeroDepositAvaAmt)

      const isZeroOkCashbagAvaAmt = this.getNumber(this.globalVal.discountInfo.okCashbagAvaAmt) === 0
      this.disabledOkCashbag(isZeroOkCashbagAvaAmt)
    },
    /**
     * 숫자이외에 문자열 제거
     * @param {String} _amt
     * @returns {Number}
     */
    getNumber (_amt) {
      return Number(onlyNumFormat(moneyUnformat(_amt)))
    },
    /**
     * 금액 사용 취소 (ASIS: onclick_btnReserveUseCancel)
     * @returns {void}
     */
    useAmtCancel () {
      if (!this.globalVal.paymentMethodInfo.bFlagCard31) { // 선할인 카드가 선택 되어 있지 않으면
        this.$root.$emit('paymentMethodCardSelectEmit') // 카드사 디폴트 고정
      }

      // 할인금액 체크박스 해제
      if (!this.disabledReservedAmt) {
        this.setPaymentAmount(PAY_ASSIST_CONST.RESERVED_AMT, this.CONST_MODE.CANCEL)
      }
      if (!this.disabledHappyMoneyAmt) {
        this.setPaymentAmount(PAY_ASSIST_CONST.HAPPY_MONEY, this.CONST_MODE.CANCEL)
      }
      if (!this.disabledGiftCardAmt) {
        this.setPaymentAmount(PAY_ASSIST_CONST.NS_GIFT_CARD, this.CONST_MODE.CANCEL)
      }
      if (!this.disabledDepositAmt) {
        this.setPaymentAmount(PAY_ASSIST_CONST.DEPOSIT_AMT, this.CONST_MODE.CANCEL)
      }
      if (!this.disabledOkCashbagAmt) {
        this.setPaymentAmount(PAY_ASSIST_CONST.OK_CASHBAG, this.CONST_MODE.CANCEL)
      }
    },
    /**
     * 결제정보(적립금/예치금) 출력
     * @param {String} type
     * @param {String} mode
     * @returns {void}
     */
    setPaymentAmount (type, mode = '') {
      // 결제정보(적립금/예치금) 폼 데이터 반영
      const defineValueKey = PAY_ASSIST_CONST.getDefineValueKey(type)
      const index = this.paymentData.Payment.getDefineValue(defineValueKey, 'index')
      const payType = this.paymentData.Payment.getDefineValue(defineValueKey, 'payType')
      const requestCommand = this.paymentData.Payment.getDefineValue(defineValueKey, 'requestCommand')

      // 할인된 결제금액 구하기
      const getAmount = (_avaAmt, _useAmt) => {
        let useAmt = this.getNumber(_useAmt) // 사용금액
        const avaAmt = this.getNumber(_avaAmt) // 사용가능금액
        const dcAmount = (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT * 1) + useAmt // 입력한 필드에 이미 입력된 금액과 최종 결제 금액을 합한다.

        // 결제할 금액과 입력정보 비교하여 결제할 금액이하로 결제되도록 설정
        if (dcAmount < (avaAmt * 1)) {
          useAmt = dcAmount
        } else {
          useAmt = avaAmt
        }
        return useAmt
      }

      // 보유금액보다 큰 금액 사용방지
      const validAmount = (_avaAmt, _useAmt) => {
        let useAmt = this.getNumber(_useAmt) // 사용금액
        const avaAmt = this.getNumber(_avaAmt) // 사용가능금액
        const dcAmount = (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT * 1) // 최종 결제 금액

        useAmt = Math.floor(useAmt / 10) * 10 // 원단위 버림 처리

        if (useAmt > avaAmt) {
          // messageUtil.alert(insertCommas(avaAmt) + ' 보다 큰 금액을 입력할 수 없습니다.')
          useAmt = getAmount(avaAmt, 0)
        } else if (dcAmount < (useAmt * 1)) { // 사용금액이 보유액보다 작고 결제금액보다 큰경우 결제금액으로 설정한다.
          useAmt = getAmount(dcAmount, 0)
        }
        return useAmt
      }

      // 숫자를 -###,### 표시
      const formatAmount = value => {
        const amt = this.getNumber(value)
        const money = insertCommas(amt)
        return (amt === 0 || amt === '0' || isNull(amt)) ? money : `-${money}`
      }

      let amount = 0
      let tempUseAmt = 0
      switch (type) {
        case PAY_ASSIST_CONST.ANNUAL_COUPONS: // 'annualCoupons': // 연간할인권
          if (this.getNumber(this.globalVal.discountInfo.annualDcUseAmt) > 0) {
            tempUseAmt = this.globalVal.discountInfo.annualDcUseAmt
            this.globalVal.discountInfo.annualDcUseAmt = 0
            this.setFinalPaymentAmount()
            this.globalVal.discountInfo.annualDcUseAmt = tempUseAmt
          }

          if (mode === this.CONST_MODE.CHECKBOX) {
            if (!this.checkedAnnualDcAmt) {
              this.globalVal.discountInfo.annualDcUseAmt = 0
            }
            amount = getAmount(this.globalVal.discountInfo.annualDcAvaAmt, this.globalVal.discountInfo.annualDcUseAmt)
            amount = this.checkedAnnualDcAmt ? amount : 0
          } else if (mode === this.CONST_MODE.INPUT) {
            amount = validAmount(this.globalVal.discountInfo.annualDcAvaAmt, this.globalVal.discountInfo.annualDcUseAmt)
          }
          this.globalVal.discountInfo.annualDcUseAmt = formatAmount(amount)
          break
        case PAY_ASSIST_CONST.OK_CASHBAG: // 'okCashbag': // OK캐쉬백
          if (this.getNumber(this.globalVal.discountInfo.okCashbagUseAmt) > 0) {
            tempUseAmt = this.globalVal.discountInfo.okCashbagUseAmt
            this.globalVal.discountInfo.okCashbagUseAmt = 0
            this.setFinalPaymentAmount()
            this.globalVal.discountInfo.okCashbagUseAmt = tempUseAmt
          }

          if (mode === this.CONST_MODE.CHECKBOX) {
            if (!this.checkedOkCashbagAmt) {
              this.globalVal.discountInfo.okCashbagUseAmt = 0
            }
            amount = getAmount(this.globalVal.discountInfo.okCashbagAvaAmt, this.globalVal.discountInfo.okCashbagUseAmt)
            amount = this.checkedOkCashbagAmt ? amount : 0
          } else if (mode === this.CONST_MODE.INPUT) {
            amount = validAmount(this.globalVal.discountInfo.okCashbagAvaAmt, this.globalVal.discountInfo.okCashbagUseAmt)
          }
          this.globalVal.discountInfo.okCashbagUseAmt = formatAmount(amount)
          this.paymentData.Payment.setItem(index, {
            point_amt: String(amount)
          })
          break
        case PAY_ASSIST_CONST.NETI_WELL: // 'netiWell': // 네티웰
          if (this.getNumber(this.globalVal.discountInfo.netiWellUseAmt) > 0) {
            tempUseAmt = this.globalVal.discountInfo.netiWellUseAmt
            this.globalVal.discountInfo.netiWellUseAmt = 0
            this.setFinalPaymentAmount()
            this.globalVal.discountInfo.netiWellUseAmt = tempUseAmt
          }

          if (mode === this.CONST_MODE.CHECKBOX) {
            if (!this.checkedNetiWellAmt) {
              this.globalVal.discountInfo.netiWellUseAmt = 0
            }
            amount = getAmount(this.globalVal.discountInfo.netiWellAvaAmt, this.globalVal.discountInfo.netiWellUseAmt)
            amount = this.checkedNetiWellAmt ? amount : 0
          } else if (mode === this.CONST_MODE.INPUT) {
            amount = validAmount(this.globalVal.discountInfo.netiWellAvaAmt, this.globalVal.discountInfo.netiWellUseAmt)
          }
          this.globalVal.discountInfo.netiWellUseAmt = formatAmount(amount)

          this.paymentData.Payment.setItem(index, {
            usePoint: String(amount),
            orderNo: String(this.globalVal.mInputParams.orderId),
            productNm: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName,
            productCnt: String(this.globalVal.mOutputDatas.TOTAL_ITEM_COUNT),
            buyName: this.globalVal.mOutputDatas.msg.UserInfo.LASTNAME,
            zipNo: this.globalVal.mOutputDatas.msg.UserInfo.ZIPCODE,
            address1: this.globalVal.mOutputDatas.msg.UserInfo.ADDRESS1,
            address2: this.globalVal.mOutputDatas.msg.UserInfo.ADDRESS2,
            telNo: insertSeparatorPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE2, '-'),
            hpNo: insertSeparatorPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1, '-'),
            otherMemo: ''
          })
          break
        case PAY_ASSIST_CONST.HAPPY_MONEY: // 'happyMoney': // 해피머니
          if (this.getNumber(this.globalVal.discountInfo.happyMoneyUseAmt) > 0) {
            tempUseAmt = this.globalVal.discountInfo.happyMoneyUseAmt
            this.globalVal.discountInfo.happyMoneyUseAmt = 0
            this.setFinalPaymentAmount()
            this.globalVal.discountInfo.happyMoneyUseAmt = tempUseAmt
          }

          if (mode === this.CONST_MODE.CHECKBOX) {
            if (!this.checkedHappyMoneyAmt) {
              this.globalVal.discountInfo.happyMoneyUseAmt = 0
            }
            amount = getAmount(this.globalVal.discountInfo.happyMoneyAvaAmt, this.globalVal.discountInfo.happyMoneyUseAmt)
            amount = this.checkedHappyMoneyAmt ? amount : 0
          } else if (mode === this.CONST_MODE.INPUT) {
            amount = validAmount(this.globalVal.discountInfo.happyMoneyAvaAmt, this.globalVal.discountInfo.happyMoneyUseAmt)
          }
          this.globalVal.discountInfo.happyMoneyUseAmt = formatAmount(amount)
          this.paymentData.Payment.setItem(index, {
            productAmt: String(amount),
            productNm: this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.productName,
            productCnt: String(this.globalVal.mOutputDatas.TOTAL_ITEM_COUNT)
          })
          break
        case PAY_ASSIST_CONST.RESERVED_AMT: // 'reservedAmt' : // 적립금
          if (this.getNumber(this.globalVal.discountInfo.reservesUseAmt) > 0) {
            tempUseAmt = this.globalVal.discountInfo.reservesUseAmt
            this.globalVal.discountInfo.reservesUseAmt = 0
            this.setFinalPaymentAmount()
            this.globalVal.discountInfo.reservesUseAmt = tempUseAmt
          }

          if (mode === this.CONST_MODE.CHECKBOX) {
            if (!this.checkedReservedAmt) {
              this.globalVal.discountInfo.reservesUseAmt = 0
            }
            amount = getAmount(this.globalVal.discountInfo.reservesAvaAmt, this.globalVal.discountInfo.reservesUseAmt)
            amount = this.checkedReservedAmt ? amount : 0
          } else if (mode === this.CONST_MODE.INPUT) {
            amount = validAmount(this.globalVal.discountInfo.reservesAvaAmt, this.globalVal.discountInfo.reservesUseAmt)
          }
          this.globalVal.discountInfo.reservesUseAmt = formatAmount(amount)
          break
        case PAY_ASSIST_CONST.DEPOSIT_AMT: // 'depositAmount' : // 예치금
          if (this.getNumber(this.globalVal.discountInfo.depositUseAmt) > 0) {
            tempUseAmt = this.globalVal.discountInfo.depositUseAmt
            this.globalVal.discountInfo.depositUseAmt = 0
            this.setFinalPaymentAmount()
            this.globalVal.discountInfo.depositUseAmt = tempUseAmt
          }

          if (mode === this.CONST_MODE.CHECKBOX) {
            if (!this.checkedDepositAmt) {
              this.globalVal.discountInfo.depositUseAmt = 0
            }
            amount = getAmount(this.globalVal.discountInfo.depositAvaAmt, this.globalVal.discountInfo.depositUseAmt)
            amount = this.checkedDepositAmt ? amount : 0
          } else if (mode === this.CONST_MODE.INPUT) {
            amount = validAmount(this.globalVal.discountInfo.depositAvaAmt, this.globalVal.discountInfo.depositUseAmt)
          }
          this.globalVal.discountInfo.depositUseAmt = formatAmount(amount)
          break
        case PAY_ASSIST_CONST.NS_GIFT_CARD: // 'giftCardAmount': // NS상품권
          if (this.getNumber(this.globalVal.discountInfo.nsGiftCardUseAmt) > 0) {
            tempUseAmt = this.globalVal.discountInfo.nsGiftCardUseAmt
            this.globalVal.discountInfo.nsGiftCardUseAmt = 0
            this.setFinalPaymentAmount()
            this.globalVal.discountInfo.nsGiftCardUseAmt = tempUseAmt
          }

          if (mode === this.CONST_MODE.CHECKBOX) {
            if (!this.checkedGiftCardAmt) {
              this.globalVal.discountInfo.nsGiftCardUseAmt = 0
            }
            amount = getAmount(this.globalVal.discountInfo.nsGiftCardAvaAmt, this.globalVal.discountInfo.nsGiftCardUseAmt)
            amount = this.checkedGiftCardAmt ? amount : 0
          } else if (mode === this.CONST_MODE.INPUT) {
            amount = validAmount(this.globalVal.discountInfo.nsGiftCardAvaAmt, this.globalVal.discountInfo.nsGiftCardUseAmt)
          }
          this.globalVal.discountInfo.nsGiftCardUseAmt = formatAmount(amount)
          this.paymentData.Payment.setItem(index, {
            useAmt: String(amount)
          })
          break
      }

      // 결제 폼 데이터 반영
      this.paymentData.Payment.setItem(index, {
        payType,
        requestCommand,
        payAmt: String(amount)
      })

      // 결제할 금액 재계산
      this.setFinalPaymentAmount()

      if (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT === 0) {
        // 적립금
        const isZeroReservesUseAmt = this.getNumber(this.globalVal.discountInfo.reservesUseAmt) === 0
        this.disabledReserved(isZeroReservesUseAmt)
        if (isZeroReservesUseAmt) {
          this.checkedReservedAmt = !isZeroReservesUseAmt // 체크해제
        }

        // 해피머니
        const isZeroHappyMoneyUseAmt = this.getNumber(this.globalVal.discountInfo.happyMoneyUseAmt) === 0
        this.disabledHappyMoney(isZeroHappyMoneyUseAmt)
        if (isZeroHappyMoneyUseAmt) {
          this.checkedHappyMoneyAmt = !isZeroHappyMoneyUseAmt // 체크해제
        }

        // NS상품권
        const isZeroNsGiftCardUseAmt = this.getNumber(this.globalVal.discountInfo.nsGiftCardUseAmt) === 0
        this.disabledGiftCard(isZeroNsGiftCardUseAmt)
        if (isZeroNsGiftCardUseAmt) {
          this.checkedGiftCardAmt = !isZeroNsGiftCardUseAmt // 체크해제
        }

        // 예치금
        const isZeroDepositUseAmt = this.getNumber(this.globalVal.discountInfo.depositUseAmt) === 0
        this.disabledDeposit(isZeroDepositUseAmt)
        if (isZeroDepositUseAmt) {
          this.checkedDepositAmt = !isZeroDepositUseAmt // 체크해제
        }

        // OK캐쉬백
        const isZeroOkCashbagUseAmt = this.getNumber(this.globalVal.discountInfo.okCashbagUseAmt) === 0
        this.disabledOkCashbag(isZeroOkCashbagUseAmt)
        if (isZeroOkCashbagUseAmt) {
          this.checkedOkCashbagAmt = !isZeroOkCashbagUseAmt // 체크해제
        }
      } else {
        this.disabledAvaAmt()
      }

      this.checkedAllUseAmtGtZero()
    },
    /**
     * NSSR-37841 모바일에서 쿠폰과 일시불할인(정률) 동시 적용 시 계산 오류 수정
     * 일시불할인이 체크되어있으면 현재 할인쿠폰이 적용된 금액에 맞춰 일시불할인 재계산
     * @returns {void}
     */
    recalcSinglePaymentDiscount () {
      if (this.globalVal.discountInfo.showSinglePaymentDiscount) {
        if (this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
          // 저장된 일시불할인 쿠폰정보 삭제
          for (var k = 0; k < this.paymentData.Discount.size(); k++) {
            this.paymentData.Discount.removeCouponItem(k, this.globalVal.CONST.DISCOUNT_CARD_LSP_INDEX) // 카드일시불할인 삭제
          }
          this.calcSinglePaymentDiscount()
        }
      }
    }
  }
}
export default discountMixin
