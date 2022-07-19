import messageUtil from '@frameworks/messageUtil'
import modalUtil from '@frameworks/modalUtil'
import popupUtil from '@frameworks/popupUtil'
import {
  isNull,
  getPhoneNumber
} from '@utils/commonutil/commonUtil'

const shippingChargeMixin = {
  methods: {
    /**
     * 도서산간 배송 불가한 상품의 경우 주문 시 도서산간배송지로 배송 불가하도록 체크
     * 체크 결과를 가지고 배송비 조회 및 계산 및 출력 function 호출
     * @param {Number} index - 배송지 index
     * @param {String} orderId - 주문번호
     * @param {String} zipCode - 우편번호
     * @param {Object} items - 상품리스트
     * @param {String} strType - 멀티배송 여부
     * @param {Number} multiIdx - 배송지 index
     * @param {Number} itemIdx - 상품 index
     * @returns {void}
     */
    async getShippingCharge (index, orderId, addrObj, items, strType, multiIdx, itemIdx) {
      let nRmaYNCheckCount = items.length
      let strRmaYNCheck = ''
      const deliveryDate = this.globalVal.productInfo.deliveryDateSelected.replace(/-/gi, '') // 배송일지정
      const strRmaYNCheckArr = []

      for (let i = 0; i < items.length; i++) { // 아이템 수량 만큼 반복
        const item = items[i]

        if (nRmaYNCheckCount === 0) {
          if (strRmaYNCheck === 'N' && !(this.globalVal.deliveryInfo.isPopOpenYn === 'Y' && this.globalVal.from === this.globalVal.CONST.FROM_CART)) { // 불가시 처리
            if (undefined !== strType && strType === '1') {
              this.getShippingChargeNext1({ index, ITEMS: items }, addrObj.zipCode, strRmaYNCheck, strRmaYNCheckArr, strType, multiIdx, itemIdx) // 배송비 조회 및 계산 및 출력(복수배송상품 선택 버튼 클릭 처리)
            } else {
              this.getShippingChargeNext(index, orderId, addrObj, items, strRmaYNCheck)
            }
          }
        }

        const param = {
          catEnt_id: item.CATENTRYID,
          zipCode: addrObj.zipCode,
          catEnt_RmaYn: item.RMA_DLVR_YN
        }

        const successHandling = data => {
          if ((data === undefined || data === '' || data === null) || (data.root === undefined || data.root === '' || data.root === null) ||
          (data.root.result === undefined || data.root.result === '' || data.root.result === null)) {
            return
          }
          this.globalVal.deliveryInfo.strRmaYNCheck = data.root.result

          // 복수상품 구매시 각 상품별로 배송여부 비교하기 위함
          this.globalVal.deliveryInfo.deliveryStatus[this.globalVal.deliveryInfo.deliveryStatusIdx] = data.root.result
          this.globalVal.deliveryInfo.deliveryStatusIdx = this.globalVal.deliveryInfo.deliveryStatusIdx + 1

          if (data.root.result === 'N') {
            strRmaYNCheck = 'N'
            this.globalVal.deliveryInfo.bDeliveryYN = 'N'
            strRmaYNCheckArr.push(data.catEnt_id)
            items[i].rmaYNCheck = 'N'
          } else {
            this.globalVal.deliveryInfo.bDeliveryYN = 'Y'
            items[i].rmaYNCheck = 'Y'
          }

          const jejuYN = data.root.jejuYN
          this.globalVal.deliveryInfo.bjejuYN = jejuYN

          nRmaYNCheckCount--

          if (nRmaYNCheckCount === 0) {
            if (undefined !== strType && strType === '1') {
              this.getShippingChargeNext1({ index, ITEMS: items }, addrObj.zipCode, strRmaYNCheck, strRmaYNCheckArr, strType, multiIdx, itemIdx) // 배송비 조회 및 계산 및 출력(복수배송상품 선택 버튼 클릭 처리)
            } else {
              // 배송일지정
              if (this.globalVal.productInfo.deliveryDesignatedDayFlag === 'Y' && deliveryDate !== '') {
                this.getIslandmountain(index, orderId, addrObj, items, strRmaYNCheck)
              } else {
                this.getShippingChargeNext(index, orderId, addrObj, items, strRmaYNCheck)
              }
            }
          }
        }

        await this.$nsaxios.post('RmaYNCheckCmd', param, successHandling)
      }
    },
    /**
     * 배송일지정_도서산간 지역체크
     * @param {Number} index - 배송지 index
     * @param {String} orderId - 주문번호
     * @param {String} zipCode - 우편번호
     * @param {Object} items - 상품리스트
     * @param {String} strFlag - 도서산간 가능 여부
     * @returns {void}
     */
    getIslandmountain (index, orderId, addrObj, items, strFlag) {
      const param = {
        tasknm: 'rmacnt',
        var: addrObj.zipCode
      }

      const successHandling = data => {
        if (data.list.resultCd === 'Y' && this.globalVal.productInfo.deliveryDesignatedDayFlag === 'Y') {
          messageUtil.alert('배송일 지정시 제주/도서지역 주문이 불가합니다.', () => {
            this.globalVal.deliveryInfo.bDeliveryYN = 'N'
            this.globalVal.productInfo.deliveryNoDataClass = 'active'
            this.globalVal.productInfo.deliveryDateSelected = ''
            this.globalVal.productInfo.deliveryDataClass[0] = ''
            this.globalVal.productInfo.deliveryDataClass[1] = ''
            this.globalVal.productInfo.deliveryDataClass[2] = ''

            this.getShippingChargeNext(index, orderId, addrObj, items, strFlag)
          }, '확인')
        } else {
          this.getShippingChargeNext(index, orderId, addrObj, items, strFlag)
        }
      }

      const errorHandling = err => {
        console.log(err)
      }

      this.$nsaxios.post('NSMypageCommCmd', param, successHandling, errorHandling)
    },
    /**
     * 배송비 조회 및 계산 및 출력
     * @param {Number} index - 배송지 index
     * @param {String} orderId - 주문번호
     * @param {String} zipCode - 우편번호
     * @param {Object} itemList - 상품리스트
     * @param {String} strFlag - 도서산간 가능 여부
     * @returns {void}
     */
    getShippingChargeNext (index, orderId, addrObj, itemList, strFlag) {
      const date = this.globalVal.productInfo.deliveryDateSelected.replace(/-/gi, '')

      if (strFlag === 'N' && date === '') { // 상품에 대한 도서산간 가능 플래그 체크
        this.globalVal.deliveryInfo.bDeliveryYn = 'N'
        this.globalVal.deliveryInfo.isPopClose = false

        if (this.globalVal.deliveryInfo.isPopOpenYn === 'Y' && this.globalVal.from === this.globalVal.CONST.FROM_CART) {
          if (this.globalVal.deliveryInfo.rmaChkPopFlg) {
            this.globalVal.deliveryInfo.rmaChkPopFlg = false

            const callback = result => {
              this.$nextTick(() => {
                this.clickAddressBookLink()
              })
            }

            const cartItemList = itemList.filter(cartItems => cartItems.rmaYNCheck === 'N' && (cartItems.RMA_DLVR_YN === 'N' || cartItems.RMA_DLVR_YN === 'J'))

            modalUtil.show('order/sheet/OrderSheetRmaCheck', { globalVal: this.globalVal, items: cartItemList }, callback)
          }
        } else {
          // this.globalVal.CONST.FROM_PRODUCT_DETAIL
          messageUtil.alert('도서산간 지역 배송 안내\n도서산간 지역으로 배송되지 않습니다.', () => {}, '확인')
        }
      } else {
        this.paymentData.Delivery.setItem(0, {
          ADDRESS_ID: addrObj.addrId
        })

        this.globalVal.deliveryInfo.bDeliveryYn = 'Y'
        if (this.globalVal.deliveryInfo.strRmaYNCheck === 'N' && strFlag === 'N') {
          this.globalVal.deliveryInfo.bDeliveryYn = 'N'
        }

        const chargeParam = {
          orderId: String(orderId),
          orderItemList: [],
          zipCode: addrObj.zipCode
        }

        for (let i = 0; i < itemList.length; i++) {
          chargeParam.orderItemList.push({
            itemId: itemList[i].ORDERITEMS_ID,
            quantity: itemList[i].QUANTITY
          })
        }

        this.doShippingChargeCmd(chargeParam, chargeData => {
          let nShippingCharge = 0
          if (undefined !== chargeData.msg.shippingCharge) {
            nShippingCharge = Number(chargeData.msg.shippingCharge)
          }

          // 배송비 출력
          const objItemShippingChargeInfo = chargeData.msg.itemShippingChargeInfo
          const objDelivery = this.paymentData.Delivery.getItem(index).ITEMS
          let z = 0
          let sumRmaShipCharge = 0
          for (let i = 0; i < objDelivery.length; i++) {
            if (!isNull(objItemShippingChargeInfo)) {
              for (let j = 0; j < objItemShippingChargeInfo.length; j++) {
                if (objDelivery[i].ORDERITEMS_ID === objItemShippingChargeInfo[j].ORDITEMID) {
                  objDelivery[z].SHIPCHARGE = objItemShippingChargeInfo[j].ORDITEMSHIPCHARGE
                  objDelivery[z].RMASHIPCHARGE = objItemShippingChargeInfo[j].ORDITEMRMASHIPCHARGE
                  break
                }
              }
              z++
            }
          }

          for (let k = 0; k < z; k++) {
            sumRmaShipCharge += Number(objDelivery[k].RMASHIPCHARGE)
          }

          this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE = nShippingCharge
          this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE = sumRmaShipCharge
          this.globalVal.deliveryInfo.sumShipCharge = nShippingCharge
          this.globalVal.deliveryInfo.rmaShipCharge = sumRmaShipCharge

          // 배송비 설정
          this.paymentData.Delivery.setItem(index, {
            SHIP_CHARGE: String(nShippingCharge),
            RMA_SHIP_CHARGE: String(sumRmaShipCharge)
          })

          // 배송비 재계산
          this.globalVal.deliveryInfo.isPopClose = true
          this.setShippingChargeInfo('0', 0, 0)
        })
      }
    },
    /**
     * 배송주소 클릭 시
     */
    clickAddressBookLink () {
      const bDeliveryYnTmp = this.globalVal.deliveryInfo.bDeliveryYn

      this.globalVal.deliveryInfo.checkSafeGuest = null

      const ordAddr = {
        addrId: this.globalVal.deliveryInfo.addrId,
        zipCode: this.globalVal.deliveryInfo.zipCode,
        addr: this.globalVal.deliveryInfo.addr,
        addrDetail: this.globalVal.deliveryInfo.addrDetail,
        recipientName: this.globalVal.deliveryInfo.recipientName,
        phone: `${this.globalVal.deliveryInfo.phone11}-${this.globalVal.deliveryInfo.phone12}-${this.globalVal.deliveryInfo.phone13}`
      }

      const param = {
        title: '배송지 선택',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        paymentData: this.paymentData,
        ordAddr,
        multiYn: 'N',
        multiIdx: 0,
        chargeItems: [],
        consultYn: 'N',
        mypageYn: 'N'
      }

      const callback = result => {
        if (result !== undefined) {
          if (this.globalVal.deliveryInfo.shipAddrLength === 0) {
            this.globalVal.deliveryInfo.isMultiDeliveryShow = false
            this.globalVal.deliveryInfo.isNonDeliveryShow = true
            this.globalVal.deliveryInfo.isBasicDeliveryShow = false
          } else {
            this.globalVal.deliveryInfo.isNonDeliveryShow = false
            this.globalVal.deliveryInfo.isBasicDeliveryShow = true

            this.globalVal.deliveryInfo.recipientName = result.receiverName
            this.globalVal.deliveryInfo.isDeliveryBasicIconShow = (result.ispriamry === '1')
            this.globalVal.deliveryInfo.isDeliverySafeIconShow = false
            this.globalVal.deliveryInfo.addrId = result.addressID
            this.globalVal.deliveryInfo.addr = result.cst_addr
            this.globalVal.deliveryInfo.addrDetail = result.cst_addrDetail
            this.globalVal.deliveryInfo.phone11 = getPhoneNumber(result.phone1.trim(), '1')
            this.globalVal.deliveryInfo.phone12 = getPhoneNumber(result.phone1.trim(), '2')
            this.globalVal.deliveryInfo.phone13 = getPhoneNumber(result.phone1.trim(), '3')
            this.globalVal.deliveryInfo.zipCode = result.cst_zipCode
            this.globalVal.deliveryInfo.addrFlag = result.fax1
            this.globalVal.deliveryInfo.secAddress1 = result.fax1 === '100' ? result.address2 : result.address1
            this.globalVal.deliveryInfo.secAddress2 = result.fax1 === '100' ? result.address3 : result.address1

            this.globalVal.orderDeliveryInfo.deliveryInfo = [{
              iptOrdererHpNo1: '', // 주문하시는분 휴대폰1
              iptOrdererHpNo2: '', // 주문하시는분 휴대폰2
              iptOrdererHpNo3: '', // 주문하시는분 휴대폰3
              iptOrdererEmail: '', // 주문하시는분 이메일
              addrAlias: '', // 배송지명
              recipientName: '', // 받으시는분
              phone11: '', // 받으시는분 휴대폰1
              phone12: '', // 받으시는분 휴대폰2
              phone13: '', // 받으시는분 휴대폰3
              phone21: '', // 추가연락처 1
              phone22: '', // 추가연락처 2
              phone23: '', // 추가연락처 3
              zipCode: '', // 우편번호
              postcode: '', // 우편번호
              addrFlag: '', // 주소타입(100: 지번주소, 200: 도로명주소)
              addr: '', // 주소
              addrDetail: '', // 상세주소
              secAddress1: '', // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
              secAddress2: '', // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
              ipDefaultDest: '', // 기본배송지로 설정 여부
              selShippingAddress: '', // 배송지선택
              shippingMessage: '', // 배송메세지
              ADDINFO: '' // 안심택배 최근배송지 falg
            }]

            this.globalVal.orderDeliveryInfo.deliveryInfo[0] = {
              iptOrdererHpNo1: '', // 주문하시는분 휴대폰1
              iptOrdererHpNo2: '', // 주문하시는분 휴대폰2
              iptOrdererHpNo3: '', // 주문하시는분 휴대폰3
              iptOrdererEmail: '', // 주문하시는분 이메일
              addrAlias: this.globalVal.deliveryInfo.recipientName, // 배송지명
              recipientName: this.globalVal.deliveryInfo.recipientName, // 받으시는분
              phone11: this.globalVal.deliveryInfo.phone11, // 받으시는분 휴대폰1
              phone12: this.globalVal.deliveryInfo.phone12, // 받으시는분 휴대폰2
              phone13: this.globalVal.deliveryInfo.phone13, // 받으시는분 휴대폰3
              phone21: '', // 추가연락처 1
              phone22: '', // 추가연락처 2
              phone23: '', // 추가연락처 3
              zipCode: this.globalVal.deliveryInfo.zipCode, // 우편번호
              postcode: this.globalVal.deliveryInfo.zipCode, // 우편번호
              addrFlag: this.globalVal.deliveryInfo.addrFlag, // 주소타입(100: 지번주소, 200: 도로명주소)
              addr: this.globalVal.deliveryInfo.addr, // 주소
              addrDetail: this.globalVal.deliveryInfo.addrDetail, // 상세주소
              secAddress1: this.globalVal.deliveryInfo.secAddress1, // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
              secAddress2: this.globalVal.deliveryInfo.secAddress2, // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
              ipDefaultDest: '', // 기본배송지로 설정 여부
              selShippingAddress: '', // 배송지선택
              shippingMessage: '', // 배송메세지
              ADDINFO: '' // 안심택배 최근배송지 falg
            }
          }
        } else {
          this.globalVal.deliveryInfo.bDeliveryYn = bDeliveryYnTmp
        }
      }

      popupUtil.show('order/sheet/OrderSheetAddressBook', param, callback)
    },
    /**
     * 복수배송지 개편
     * 배송비 조회 및 계산 및 출력(복수배송상품 선택 버튼 클릭 처리)
     * @param {Object} data - 상품 object
     * @param {String} zipCode - 우편번호
     * @param {String} strFlag - 도서산간 가능 여부
     * @param {Array} strRmaYNCheckArr - 도서산간 가능 여부 배열
     * @param {String} strType - 멀티배송 여부
     * @param {Number} multiIdx - 배송지 index
     * @param {Number} itemIdx - 상품 index
     * @returns {void}
     */
    getShippingChargeNext1 (data, zipCode, strFlag, strRmaYNCheckArr, strType, multiIdx, itemIdx) {
      const addrIndex = multiIdx

      // 도서산간 배송 주문 불가 상품 체크
      const filterArr = []
      const filterArr2 = []
      let deliveryFlg = true

      if (strRmaYNCheckArr) {
        for (let i = 0; i < this.globalVal.deliveryInfo.multi[multiIdx].catentryId.length; i++) {
          for (let j = 0; j < strRmaYNCheckArr.length; j++) {
            console.log(`${this.globalVal.deliveryInfo.multi[multiIdx].catentryId[i].toString()} === ${strRmaYNCheckArr[j].toString()} && ${Number(this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[i])}`)
            if (this.globalVal.deliveryInfo.multi[multiIdx].catentryId[i].toString() === strRmaYNCheckArr[j].toString()) {
              filterArr.push(data.ITEMS[i].INDEX)
            }
            if (this.globalVal.deliveryInfo.multi[multiIdx].catentryId[i].toString() === strRmaYNCheckArr[j].toString() && Number(this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[i])) {
              filterArr2.push(data.ITEMS[i].INDEX)
            }
          }
        }
      }

      if ((strRmaYNCheckArr.length > 0 && this.globalVal.deliveryInfo.multi[multiIdx].catentryId.length === filterArr.length) || filterArr2.length > 0) {
        deliveryFlg = false
      }

      if (!deliveryFlg) {
        if (strFlag === 'N' || strFlag === 'Z') { // 상품에 대한 도서산간 가능 플래그 체크
          // this.globalVal['mDelivery' + addrIndex].resetItemQuantity(filterArr)
          this.globalVal.deliveryInfo.bDeliveryYn = 'Y'

          // this.globalVal['mDelivery' + addrIndex].resetItemQuantity(filterArr)
          this.globalVal.deliveryInfo.bDeliveryYn = 'Y'
          this.globalVal.deliveryInfo.isPopClose = false
        } else if (strFlag === 'D') { // 상품에 대한 제주도 가능 플래그 체크
          // this.globalVal['mDelivery' + addrIndex].resetItemQuantity(filterArr)
          this.globalVal.deliveryInfo.bjejuYn = 'Y'

          // this.globalVal['mDelivery' + addrIndex].resetItemQuantity(filterArr)
          this.globalVal.deliveryInfo.bjejuYn = 'Y'
          this.globalVal.deliveryInfo.isPopClose = false
        }

        if (strFlag === 'N' || strFlag === 'Z' || strFlag === 'D') {
          this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx] = 0
          this.$forceUpdate()
          messageUtil.alert('도서산간 지역 배송 안내\n도서산간 배송지로 변경이 불가합니다.')
        }
      } else {
        const chargeParam = {
          orderId: String(this.globalVal.mInputParams.orderId),
          orderItemList: [],
          zipCode
        }

        // for (let i = 0; i < data.ITEMS.length; i++) {
        //   chargeParam.orderItemList.push({
        //     itemId: data.ITEMS[i].ORDERITEMS_ID,
        //     quantity: this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[i]
        //   })
        // }

        for (let i = 0; i < this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt.length; i++) {
          if (this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[i] > 0) {
            chargeParam.orderItemList.push({
              itemId: this.globalVal.deliveryInfo.multi[multiIdx].orderItemsId[i],
              quantity: this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[i]
            })
          }
        }
        // if (Number(this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx[multiIdx]]) > 0) {
        //   chargeParam.orderItemList.push({
        //     itemId: this.globalVal.mOutputDatas.msg.OrderGoodList[itemIdx[multiIdx]].goodsDetail.ORDERITEMS_ID,
        //     quantity: this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx[multiIdx]]
        //   })
        // }

        // 배송비 계산
        this.doShippingChargeCmd(chargeParam, chargeData => {
          let strAllShipCharge = 0 // (ASIS) strAllSHIP_CHARGE
          let sumRmaShipCharge = 0

          if (chargeData.msg && chargeData.msg.result === 'success') {
            const objItemShippingChargeInfo = chargeData.msg.itemShippingChargeInfo
            let nRowId = 1
            let productIndex = 0
            this.paymentData.Delivery.deliveryList[addrIndex].ITEMS = []

            for (let i = 0; i < data.ITEMS.length; i++) {
              let nShipCharge = 0
              let strRmaShipCharge = '0'

              for (let j = 0; objItemShippingChargeInfo.length > j; j++) {
                if (objItemShippingChargeInfo[j].ORDITEMID === data.ITEMS[i].ORDERITEMS_ID) {
                  nShipCharge = objItemShippingChargeInfo[j].ORDITEMSHIPCHARGE
                  strRmaShipCharge = objItemShippingChargeInfo[j].ORDITEMRMASHIPCHARGE
                  break
                }
              }

              // 배송 아이템 추가
              data.ITEMS[i].ROWID = String(nRowId)
              data.ITEMS[i].BASEPRICE = data.ITEMS[i].PRICE
              data.ITEMS[i].SHIPCHARGE = String(nShipCharge)
              data.ITEMS[i].RMASHIPCHARGE = strRmaShipCharge
              // data.ITEMS[i].TOTALPRODUCT = String(Number(data.ITEMS[i].BASEPRICE) * Number(data.ITEMS[i].QUANTITY))
              data.ITEMS[i].TOTALPRODUCT = String(Number(data.ITEMS[i].BASEPRICE) * Number(this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[i]))
              data.ITEMS[i].TOTALADJUSTMENT = String(addrIndex === 0 ? data.ITEMS[i].DiscountPrice : 0)
              data.ITEMS[i].QUANTITY = Number(this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[i])
              delete data.ITEMS[i].itemAmt
              delete data.ITEMS[i].BasePrice
              delete data.ITEMS[i].adjustment
              delete data.ITEMS[i].shipCharge
              // delete data.ITEMS[i].DiscountPrice
              nRowId++
              if (data.ITEMS[i].QUANTITY > 0) {
                this.paymentData.Delivery.setProductItem(addrIndex, productIndex, data.ITEMS[i])
                productIndex++
              }
            }

            strAllShipCharge = chargeData.msg.shippingCharge

            for (let k = 0; k < data.ITEMS.length; k++) {
              sumRmaShipCharge += Number(data.ITEMS[k].RMASHIPCHARGE)
            }
          }

          // 배송비 설정
          this.paymentData.Delivery.setItem(addrIndex, {
            SHIP_CHARGE: String(strAllShipCharge),
            RMA_SHIP_CHARGE: String(sumRmaShipCharge)
          })

          // 배송비 재계산
          this.globalVal.deliveryInfo.isPopClose = true
          this.setShippingChargeInfo(strType, multiIdx, itemIdx)
        })
      }
    },
    /**
     * 배송비 계산 후 출력
     * @param {String} strType - 멀티배송 여부
     * @param {Number} multiIdx - 배송지 index
     * @param {Number} itemIdx - 상품 index
     * @returns {void}
     */
    setShippingChargeInfo (strType, multiIdx, itemIdx) {
      this.globalVal.deliveryInfo.isPopOpenYn = 'N'

      let shipCharge = 0 // 총배송비
      let rmaShipCharge = 0

      if (strType === '1') {
        const tmpShipCharge = Number(this.paymentData.Delivery.getItem(multiIdx).SHIP_CHARGE)
        const tmpRmaShipCharge = Number(this.paymentData.Delivery.getItem(multiIdx).RMA_SHIP_CHARGE)

        this.globalVal.deliveryInfo.multi[multiIdx].shipCharge = tmpShipCharge
        this.globalVal.deliveryInfo.multi[multiIdx].rmaShipCharge = tmpRmaShipCharge
        this.$forceUpdate()
        /*
        if (Number(this.globalVal.deliveryInfo.multi[multiIdx].selectedCnt[itemIdx[multiIdx]]) > 0) {
          this.globalVal.deliveryInfo.multi[multiIdx].shipCharge = tmpShipCharge
          this.globalVal.deliveryInfo.multi[multiIdx].rmaShipCharge = tmpRmaShipCharge
          this.$forceUpdate()
        } else {
          this.globalVal.deliveryInfo.multi[multiIdx].shipCharge = '0'
          this.globalVal.deliveryInfo.multi[multiIdx].rmaShipCharge = '0'
          this.$forceUpdate()
        }
        */

        shipCharge = this.paymentData.Delivery.getItem(multiIdx).SHIP_CHARGE
        rmaShipCharge = this.paymentData.Delivery.getItem(multiIdx).RMA_SHIP_CHARGE

        /*
        this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE = 0
        this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE = 0
        for (let i = 0; i < this.globalVal.deliveryInfo.multi.length; i++) {
          this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE += Number(shipCharge)
          this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE += Number(rmaShipCharge)
        }

        shipCharge = this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE
        rmaShipCharge = this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE
        */
      } else {
        shipCharge = Number(this.paymentData.Delivery.getItem(0).SHIP_CHARGE)
        rmaShipCharge = Number(this.paymentData.Delivery.getItem(0).RMA_SHIP_CHARGE)

        // this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE = shipCharge
        // this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE = rmaShipCharge
      }

      // 최종 합산 배송비 적재
      this.paymentData.Payment.setItem(0, {
        SHIP_CHARGE: shipCharge,
        RMA_SHIP_CHARGE: rmaShipCharge,
        SHIP_CHARGE_ONE_DELIVERY: shipCharge,
        SHIP_CHARGE_MULTI_DELIVERY: shipCharge
      })

      this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE = shipCharge
      this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE = rmaShipCharge
      this.globalVal.deliveryInfo.sumShipCharge = shipCharge
      this.globalVal.deliveryInfo.rmaShipCharge = rmaShipCharge

      this.$forceUpdate()

      if (this.globalVal.deliveryInfo.isPopClose && this.dataFildsList !== undefined) {
        this.$store.commit('popup/hide', this.dataFildsList[this.globalVal.deliveryInfo.popIdx].data)
        this.globalVal.deliveryInfo.isPopClose = false
      }

      // 총결제금액 다시 출력
      this.setFinalPaymentAmount()

      // 배송지역 변경시 신용카드 재처리
      this.$root.$emit('changeFinalAmtPaymentMethodCardEmit')
    }
  }
}
export default shippingChargeMixin
