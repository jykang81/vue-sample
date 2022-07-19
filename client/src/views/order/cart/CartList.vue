<template>
  <div ref="cartContainer" class="cart_list">
    <div v-if="totalCount" class="cart_wrap">
      <cart-list-item v-if="isAPIcalled"
                      :cart-type="'GENERAL'"
                      @update:quantity="validChangeQuantity"
                      @delete:product="deleteProduct"
                      @goto:ordersheet="gotoOrderSheet"
      />
      <cart-list-item v-if="isAPIcalled"
                      :cart-type="'CARD'"
                      @update:quantity="validChangeQuantity"
                      @delete:product="deleteProduct"
                      @goto:ordersheet="gotoOrderSheet"
      />
      <!-- 구매하기 버튼 -->
      <div class="buy_box">
        <p v-show="totalCheckedCount">
          합계:
          <strong>{{ totalPaymentPrice }}</strong>
          <span>원</span>
        </p>
        <button type="button" @click="orderProduct">
          구매하기 {{ totalCheckedCount ? `(${totalCheckedCount})` : '' }}
        </button>
      </div>
    </div>
    <div v-else-if="isAPIcalled && totalCount === 0" class="cart_empty_box">
      <div class="cart_empty">
        <div class="guide">
          <p class="title">
            장바구니에 담긴 상품이 없습니다.
          </p>
          <template v-if="isNonMember()">
            <p class="summary">
              로그인 하시고 다양한 구매혜택을 받으세요.
            </p>
          </template>
        </div>
        <div class="button">
          <button
            type="button"
            class="btn coral_border"
            @click="shoppingContinue"
          >
            <span>쇼핑 계속하기</span>
          </button>
          <button
            v-if="isNonMember()"
            type="button"
            class="btn coral"
            @click="gotoLogin()"
          >
            <span>로그인</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import CartListItem from '@/views/order/cart/CartListItem'

import MESSAGES from '@constants/framework/messages'
import COMM_CONST from '@constants/framework/constants'
import LOGIN_CONST from '@constants/customer/login'
import { PRODUCT_CONST } from '@constants/product/product'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import {
  htmlDecode,
  arrayGroupBy,
  isNull
} from '@utils/commonutil/commonUtil'
import externalUtil from '@utils/externalUtil'
import loginUtil from '@utils/loginUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import cartListService from '@services/order/cart/cartListService'

export default {
  name: 'CartList',
  components: {
    CartListItem
  },
  data () {
    return {
      isAPIcalled: false // 장바구니 API가 호출됐는지 여부
    }
  },
  computed: {
    ...mapState('cart', [
      'cartData',
      'totalProductList',
      'checkedItemIdsByType'
    ]),
    ...mapGetters('cart', [
      'totalCount',
      'totalPaymentPrice',
      'orderId',
      'coNm'
    ]),
    /**
     * 장바구니 전체 체크된 상품 아이템ID 목록
     *
     */
    checkedItemIds () {
      return Object.values(this.checkedItemIdsByType).flat()
    },
    /**
     * 장바구니 전체 체크된 상품 목록
     *
     */
    totalCheckedProductList () {
      return this.totalProductList.filter(product => this.checkedItemIds.includes(product.orderItemsId))
    },
    /**
     * 장바구니 전체 체크된 상품 개수
     *
     */
    totalCheckedCount () {
      return this.totalCheckedProductList.length
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapMutations('cart', ['setCheckedItemIdsByType', 'setCartData']),
    /**
     * 로그인 페이지로 이동
     *
     * @param {object} params (필수) 로그인 페이지에 넘길 주문 데이터
     */
    gotoLogin (params) {
      bizUtil.gotoLogin()
    },
    /**
     * 비회원 여부
     */
    isNonMember () {
      return !loginUtil.checkLogonStatus() || loginUtil.logonType() === COMM_CONST.LOGON_TYPE.NONMEMBER
    },
    /**
     * 품절 여부
     *
     * @param {object} product (필수) 상품 데이터
     */
    isSoldout (product) {
      return product.outYn === 'Y' || product.saleYn === 'N' || product.itemLiveYN === 'N'
    },
    /**
     * 장바구니 최초 조회
     *
     */
    async init () {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      this.reloadCart().then(() => {
      // 임직원 전용 상품 체크. 장바구니 내에서 상품이 추가되는 일은 없으니 created hook에서 한 번만 실행
        if (!isNull(this.totalProductList)) {
          this.chkStaffOnlyPrd(this.totalProductList)
        }
      })
    },
    /**
     * 장바구니 조회
     *
     */
    reloadCart () {
      return this.getBasketListInfo().then(data => {
        this.isAPIcalled = true
        this.resultBasketList(data)
      })
    },
    /**
     * 장바구니 상품 조회
     */
    getBasketListInfo () {
      const param = {
        mobAPI: 'NSESBasketMobileCmdReal',
        co_cd: COMM_CONST.getCocd()
      }
      return cartListService.getBasketListInfo(param).then(data => {
        if (data.msg === null) {
          messageUtil.alert(MESSAGES.PROCEDURE_ERROR)
          externalUtil.callPageLogging('LoggingPage', {
            ErrorCode: 'PE',
            p_espotid: 'NSESBasketMobileCmdReal'
          })
        }

        return data
      })
    },
    /**
     * 장바구니 상품 조회 결과
     *
     * @param {object} data
     */
    resultBasketList (data) {
      // 상품조회 결과 저장
      this.setCartData(data.msg)

      // 마케팅 스크립트 적용 부분
      // 홈쇼핑 모아
      if (this.totalCount) {
        marketingUtil.hsmoaLogger.send({
          data: {
            co_cd: COMM_CONST.getCocd(),
            action: this.totalProductList.map(product => product.partNumber),
            category: 'basketview'
          }
        })
      }
    },
    /**
     * 임직원 전용 상품 체크
     *
     * @param {object} data (필수) 상품 데이터
     */
    chkStaffOnlyPrd (data) {
      externalUtil.chkStaffOnlyPrd(data, goodsList => {
        if (goodsList) {
          messageUtil.alert('고객님은 현재 임직원인증 만료 상태로, 구매가 불가능한 임직원 전용상품을 장바구니에서 삭제합니다.', () => {
            const orderItemsId = []
            const eventParameter = []

            goodsList.forEach(product => {
              orderItemsId.push(product.orderItemsId)

              // AIQUA 파라미터
              eventParameter.push({
                category_name: !isNull(product.mparam) ? htmlDecode(product.mparam.cate1Nm) : '',
                product_id: product.partNumber,
                product_name: product.goodsName,
                product_image_url: `https:${product.imageUrl}`,
                product_price: product.price,
                product_channel: product.dlvyGrpKey.split(',').find(dlvyGrpKey =>
                  dlvyGrpKey.includes('BUSCHN_ID')
                ).split(':')[1]
              })
            })

            const param = {
              orderId: this.orderId, // 주문번호
              orderItemId: orderItemsId // 선택한 아이템ID
            }

            this.deleteProduct(param, eventParameter)
          })
        }
      })
    },
    /**
     * 구매하기
     *
     */
    async orderProduct () {
      if (!this.isNonMember()) {
        await bizUtil.secessionMemberCheker()
      }

      if (!this.totalCheckedCount) {
        messageUtil.alert('선택된 상품이 없습니다.')
        return
      }

      // 상품권 / 일반상품 같이 주문 체크
      if (Object.values(this.checkedItemIdsByType).every(checkedItemIds => checkedItemIds.length)) {
        messageUtil.alert('일반상품과 상품권은 함께 구매할 수 없습니다.\n일반상품과 상품권을 구분하여 각각 구매해 주세요.')
        return
      }

      // 환불 유형 코드로 group by
      const rfndShapeCdGrp = arrayGroupBy(this.totalCheckedProductList, 'rfndShapeCd')
      // group by 결과의 그룹 개수가 1이면 환불 타입 일치, 1보다 크면 불일치
      const hasSameRfndShapeCd = Object.keys(rfndShapeCdGrp).length === 1
      // 선/후환불 상품 장바구니에서 같이 주문 시 체크
      if (!hasSameRfndShapeCd) {
        messageUtil.alert('환불 방법이 다른 상품은 함께 구매할 수 없습니다.\n선환불 상품과 후환불 상품을 구분하여 각각 구매해 주세요.')
        return
      }

      // 주문 수량 합계 체크
      const totalQuantity = this.totalCheckedProductList.reduce((acc, curr) => acc + Number(curr.quantity), 0)
      if (totalQuantity > 99) {
        messageUtil.alert('1회 최대 구매 가능 수량은 99개까지입니다.')
        return
      }

      // 임직원인 경우 임직원할인 상품(TV쇼핑, Shop+)과 다른 상품 합결제 체크
      if (!this.isNonMember()) {
        const staffDcPrd = this.totalCheckedProductList.filter(product => product.busChnId === 'CTCOM' || product.busChnId === 'TV')
        const intPrd = this.totalCheckedProductList.filter(product => product.busChnId === 'INT')
        if (loginUtil.getMemberInfo().staffInfo && staffDcPrd.length > 0 && intPrd.length > 0) {
          messageUtil.alert('임직원할인 상품(TV쇼핑, Shop+)은 다른 상품과 합결제시 임직원할인가 적용이 불가하오니, 개별 구매결제 하시기 바랍니다.')
          return
        }
      }

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_장바구니',
          eventAction: '장바구니활동',
          eventLabel: '선택상품주문',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })

      // 할부 개월수 일치 체크. 할부 개월수로 group by 결과의 그룹 개수가 1이면 할부 개월 수 일치, 1보다 크면 불일치
      const interestFreeMonthGrp = arrayGroupBy(this.totalCheckedProductList, 'interestFreeMonth')
      if (Object.keys(interestFreeMonthGrp).length === 1) {
        // 주문서로 이동
        this.gotoOrderSheet(this.checkedItemIds)
      } else {
        messageUtil.confirm(
          `선택하신 상품의 무이자 할부 개월 수가 다릅니다.
          함께 구매할 경우 무이자 할부 개월 수가 가장 낮은 개월 수 혹은 일시불로 조정됩니다.
          (상품별로 제공하는 무이자 할부를 이용하시려면 각각 구매해 주세요.)`,
          () => {
            // 주문서로 이동
            this.gotoOrderSheet(this.checkedItemIds)
          },
          null,
          '확인',
          '취소'
        )
      }
    },
    /**
     * 쇼핑 계속하기
     */
    shoppingContinue () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_장바구니',
          eventAction: '장바구니 이탈',
          eventLabel: '쇼핑계속하기',
          params: {
            t1: null
          }
        }
      })
      // 메인으로 이동
      bizUtil.gotoMain()
    },
    /**
     * 수량 변경 검증 후 수량 변경 처리
     *
     * @param {number} tobeQuantity (필수) 변경할 수량
     * @param {object} product (필수) 상품 데이터
     */
    validChangeQuantity (tobeQuantity, product) {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_장바구니',
          eventAction: '장바구니활동',
          eventLabel: '수량조절',
          params: {
            t1: null // $router.meta.depth를 사용하는 경우
          }
        }
      })

      // 수량 변경 API 호출
      this.changeQuantity({
        catEntryId_1: product.catentryId,
        quantity_1: tobeQuantity,
        extCatalogId_1: COMM_CONST.getDefaultCatalogId(),
        extPtncd_1: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        orderItemId_1: product.orderItemsId, // 선택한 아이템 번호
        orderId: this.orderId // 주문번호
      })
    },
    /**
     * 수량 변경 API 호출
     *
     * @param {object} param (필수) 수량 변경 API 호출 파라미터
     */
    changeQuantity (param) {
      return cartListService.changeQuantity(param).finally(() => {
        // 장바구니 재조회
        this.reloadCart()
      })
    },
    /**
     * 상품 삭제
     *
     * @param {object} param (필수) 삭제할 상품의 주문번호, 아이템번호
     * @param {object} eventParameter (필수) AIQUA 전송 파라미터
     */
    deleteProduct (param, eventParameter) {
      return cartListService.deleteProduct(param, async data => {
        if (data.msg && data.msg.result === 'success') {
          // 체크된 아이템ID에서 제거
          Object.keys(this.checkedItemIdsByType).forEach(cartType => {
            const value = this.checkedItemIdsByType[cartType].filter(orderItemsId =>
              !param.orderItemId.includes(orderItemsId)
            )
            this.setCheckedItemIdsByType({
              cartType,
              value
            })
          })

          // 마케팅 스크립트 적용 부분
          // AIQUA
          for (const aiquaParam of eventParameter) {
            const nsRcmdParam = {
              rcmdGbn: 'PRODUCT',
              rcmdValue: aiquaParam.product_id
            }
            await cartListService.callNSRcmdCmd(nsRcmdParam, nsRcmdResult => {
              marketingUtil.aiquaLogger.send({
                type: marketingUtil.aiquaLogger.USER_EVENT,
                data: {
                  event: 'product_removed_from_cart',
                  params: {
                    category_name: aiquaParam.category_name,
                    product_id: aiquaParam.product_id,
                    product_name: aiquaParam.product_name,
                    product_image_url: aiquaParam.product_image_url,
                    product_price: Number(String(aiquaParam.product_price).replaceAll(',', '')),
                    product_channel: aiquaParam.product_channel,
                    md_name: nsRcmdResult.msg.empNm,
                    md_team_name: nsRcmdResult.msg.orgNm
                  }
                }
              })
            })
          }
          // 삭제 성공 시 장바구니 재조회
          this.reloadCart()
        } else {
          messageUtil.alert(`장바구니 상품 삭제 시 문제가 발생했습니다.\n${data.msg.resultMessage ? `\n${data.msg.resultMessage}` : ''}`)
        }
      })
    },
    /**
     * 주문할 상품 목록의 카테고리명 가져오기
     *
     * @param {array} orderPossibleProductList (필수) 주문할 상품 목록
     * @return {object} 주문할 상품 목록의 카테고리명
     */
    getProductCategoryName (orderPossibleProductList) {
      const productCategoryName = {}
      orderPossibleProductList.forEach(product => {
        productCategoryName[`partNum_${product.partNumber}`] = {
          success: true
        }
        const productCategoryObj = productCategoryName[`partNum_${product.partNumber}`]
        try {
          let strCateCdFull = '' // '@/'를 구분자로 하여 순서대로 나열된 카테고리 코드 문자열
          let strCateNmFull = '' // '@/'를 구분자로 하여 순서대로 나열된 카테고리 이름 문자열
          let cateCdEnd = ''
          let cateNmEnd = ''
          for (let i = 5; i >= 1; i--) {
            const mparam = product.mparam
            let cateCode = mparam[`cate${i}Code`]
            let cateName = mparam[`cate${i}Nm`]

            if (strCateCdFull !== '') {
              cateCode = cateCode || ''
              cateName = cateCode ? cateName : ''
              strCateCdFull = `${cateCode}@/${strCateCdFull}`
              strCateNmFull = `${cateName}@/${strCateNmFull}`
            } else if (cateCode != null) {
              strCateCdFull = cateCode
              strCateNmFull = cateName
              cateCdEnd = cateCode
              cateNmEnd = cateName
            } else {
              // else 케이스 없음
            }

            productCategoryObj[`cate${i}Code`] = mparam[`cate${i}Code`]
            productCategoryObj[`cate${i}Nm`] = mparam[`cate${i}Nm`]
          }

          productCategoryObj.cateCdFull = strCateCdFull
          productCategoryObj.cateNmFull = strCateNmFull
          productCategoryObj.cateCdEnd = cateCdEnd
          productCategoryObj.cateNmEnd = cateNmEnd
        } catch (e) {
          productCategoryObj.success = false
        }
      })

      return productCategoryName
    },
    /**
     * 주문서 이동
     *
     * @param {array} orderItemIds (필수) 주문할 아이템ID
     */
    gotoOrderSheet (orderItemIds) {
      // 장바구니 리스트 품절여부 재조회
      this.getBasketListInfo().then(data => {
        // 재 조회된 장바구니 리스트에서 주문할 상품만 필터링
        let orderProductList = data.msg.goods.filter(product => orderItemIds.includes(product.orderItemsId))

        // 최대구매수량 초과 여부
        let isOverMaxOrderQty = false

        // 구매제한 상품의 구매제한 초과 여부
        const limitOrderProductList = orderProductList.filter(product => product.custPrchQtyLimitYn === 'Y')
        if (limitOrderProductList.length > 0) {
          if (loginUtil.userId() === '') {
            messageUtil.alert('구매를 위해서 로그인이 필요합니다.', () => {
              bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.GLOBAL)
            })
            return
          }

          const partNumberGroup = arrayGroupBy(limitOrderProductList, 'partNumber')// 상품번호별 group by
          // 상품별 구매가능한 최대구매수량에서 상품의 구매수량만큼 감산을 한다. 남은수량이 음수가 되면 최대구매수량 초과로 판단
          Object.keys(partNumberGroup).map(key => {
            return partNumberGroup[key].reduce((acc, curr) => {
              const remainQuantity = acc - Number(curr.quantity)
              if (remainQuantity < 0) {
                isOverMaxOrderQty = true
              }

              return remainQuantity
            }, Number(partNumberGroup[key][0].maxOrderPossQty)) // 초기값 : 상품의 최대구매수량
          })
        }

        if (isOverMaxOrderQty) {
          messageUtil.alert('장바구니 상품 중 구매 수량 제한 상품이 주문 가능 수량을 초과하였습니다.')
          return Promise.reject(new Error('구매 수량 제한 상품 주문 가능 수량 초과'))
        }

        // 1회 최대 주문 가능 수량 초과한 상품 찾기
        const isOverMaxProduct = orderProductList.find(product =>
          Number(product.maxItemCountOnOnce) < Number(product.quantity)
        )

        // 1회 최대 주문 가능 수량 초과 여부 체크
        if (isOverMaxProduct) {
          messageUtil.alert(
              `${htmlDecode(isOverMaxProduct.goodsName)} 의 최대구매수량이 초과되어 구매를 진행할 수 없습니다.
              확인 시, 해당 상품의 구매 가능한 수량이 자동 조정됩니다.`,
              () => {
                // 수량 변경 API 호출
                this.changeQuantity({
                  catEntryId_1: isOverMaxProduct.catentryId,
                  quantity_1: Math.min(
                    Number(isOverMaxProduct.inventoryQuantity),
                    Number(isOverMaxProduct.maxItemCountOnOnce),
                    99
                  ),
                  extCatalogId_1: COMM_CONST.getDefaultCatalogId(),
                  extPtncd_1: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
                  orderItemId_1: isOverMaxProduct.orderItemsId, // 선택한 아이템 번호
                  orderId: this.orderId // 주문번호
                }).then(() => {
                  this.$refs.cartContainer.querySelector(`#quantity_${isOverMaxProduct.orderItemsId}`).focus()
                })
              }
          )
          return Promise.reject(new Error('최대구매수량 초과'))
        }

        // 품절된 상품 체크
        const soldOutProduct = orderProductList.find(product => this.isSoldout(product))
        if (soldOutProduct) {
          messageUtil.alert(`${htmlDecode(soldOutProduct.goodsName)} 의 재고가 부족하여 구매를 진행할 수 없습니다.`, () => {
            this.resultBasketList(data)
            return Promise.reject(new Error('품절'))
          })
        }

        // 판매가능수량보다 주문수량이 큰 상품 찾기 (Choice 상품은 재고 체크 안함)
        const outOfStockProduct = orderProductList.find(product =>
          product.goodsType !== PRODUCT_CONST.GOODS_DISP_TYPE_CD.CHOICE &&
          Number(product.inventoryQuantity) < Number(product.quantity)
        )
        if (outOfStockProduct) {
          messageUtil.alert(
              `${htmlDecode(outOfStockProduct.goodsName)} 의 재고가 부족하여 구매를 진행할 수 없습니다.
              확인 시, 해당 상품의 구매 가능한 수량이 자동 조정됩니다.
              구매 수량을 다시 확인해 주세요.`,
              () => {
                // 수량 변경 API 호출
                this.changeQuantity({
                  catEntryId_1: outOfStockProduct.catentryId,
                  quantity_1: Math.min(
                    Number(outOfStockProduct.inventoryQuantity),
                    Number(outOfStockProduct.maxItemCountOnOnce),
                    99
                  ),
                  extCatalogId_1: COMM_CONST.getDefaultCatalogId(),
                  extPtncd_1: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
                  orderItemId_1: outOfStockProduct.orderItemsId, // 선택한 아이템 번호
                  orderId: this.orderId // 주문번호
                }).then(() => {
                  this.$refs.cartContainer.querySelector(`#quantity_${outOfStockProduct.orderItemsId}`).focus()
                })
              }
          )
          return Promise.reject(new Error('재고 부족'))
        }

        // 제휴 유입시 구매 불가 상품은 제외한 구매 가능 상품 목록
        orderProductList = orderProductList.filter(product =>
          product.noSaleCatalogYN !== 'Y'
        )

        if (!orderProductList.length) {
          messageUtil.alert(`${this.coNm} 경유 시 구매 불가능한 상품입니다.\n메인페이지로 이동합니다.`, bizUtil.gotoMain())
          return Promise.reject(new Error('구매가능한 상품 없음(제휴 유입 시 구매 불가)'))
        }

        return Promise.resolve(orderProductList)
      }).then(orderProductList => {
        const productArray = []
        // 마케팅 스크립트 적용 부분
        // E-commerce
        let tvProduct = ''
        for (let i = 0; i < orderProductList.length; i++) {
          const text = orderProductList[i].dlvyGrpKey.split(',')
          // 제품_상품 유형
          if (text[0] === 'BUSCHN_ID:CTCOM' || text[0] === 'BUSCHN_ID:TV') {
            tvProduct = 'eTV'
          } else {
            tvProduct = 'e상품'
          }

          // 카테고리 전송
          let categoryName = ''
          if (!isNull(orderProductList[i].mparam)) {
            if (!isNull(orderProductList[i].mparam.cate1Nm)) {
              categoryName += htmlDecode(orderProductList[i].mparam.cate1Nm)
            }
            if (!isNull(orderProductList[i].mparam.cate2Nm)) {
              categoryName += htmlDecode(`/${orderProductList[i].mparam.cate2Nm}`)
            }
            if (!isNull(orderProductList[i].mparam.cate3Nm)) {
              categoryName += htmlDecode(`/${orderProductList[i].mparam.cate3Nm}`)
            }
            if (!isNull(orderProductList[i].mparam.cate4Nm)) {
              categoryName += htmlDecode(`/${orderProductList[i].mparam.cate4Nm}`)
            }
            if (!isNull(orderProductList[i].mparam.cate5Nm)) {
              categoryName += htmlDecode(`/${orderProductList[i].mparam.cate5Nm}`)
            }
          }

          let optionName = ''
          if (!isNull(orderProductList[i].selectOpt[0].name)) {
            if (orderProductList[i].goodsName === orderProductList[i].selectOpt[0].name) {
              optionName = undefined
            } else {
              optionName = orderProductList[i].selectOpt[0].name
            }
          }

          productArray.push({
            id: String(orderProductList[i].goodsId),
            name: orderProductList[i].goodsName,
            brand: orderProductList[i].brandName,
            category: categoryName,
            variant: optionName,
            dimension16: tvProduct
          })
        }
        if (tvProduct === 'eTV') { // 상품상세(e-상품)
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
            data: {
              step: marketingUtil.ga360Logger.ECOMMERCE_STEP_06,
              params: productArray,
              subparams: {
                t1: '주문/결제',
                t2: '장바구니'
              }
            }
          })
        } else {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
            data: {
              step: marketingUtil.ga360Logger.ECOMMERCE_STEP_05,
              params: productArray,
              subparams: {
                t1: '주문/결제',
                t2: '장바구니'
              }
            }
          })
        }

        // 선택된 주문 아이템을 주문접수(P) --> 주문서작성(H) 상태로 변경
        const isHaveAdultItem = orderProductList.some(product => product.adultItemFlag === 'Y') // 성인 상품 포함 여부
        const tmpProductCategoryName = this.getProductCategoryName(orderProductList)
        tmpProductCategoryName.haveAdultItem = isHaveAdultItem ? 'Y' : 'N'
        const param = {
          orderId: this.orderId, // 주문번호
          orderItemsIds: orderProductList.map(product => product.orderItemsId).join(','), // 구매 가능 상품 아이템ID 목록
          productCategoryName: tmpProductCategoryName // 카테고리 정보 추가
        }

        // 비회원이면, 로그인화면으로 이동
        if (this.isNonMember()) {
          bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.ORDER, null, false, {
            invoke: param,
            isOnlyUser: false
          })
        } else {
          cartListService.gotoOrderSheet(param, () => {
            // 성인인증이 안되어 있을 경우
            if (isHaveAdultItem && loginUtil.adultAuthYN() !== 'Y') {
              messageUtil.alert('성인 상품은 인증하셔야 보실 수 있습니다.', () => {
                bizUtil.openCert(true)
              })

              return
            }

            // 성인인증이 되어 있을 경우 주문서정보 페이지로 이동
            const params = {
              orderId: this.orderId,
              productCategoryName: this.getProductCategoryName(orderProductList)
            }

            // if (isOsApp()) {
            //   params.push('from', 'cart')
            // }
            // 경유 시 구매 불가능한 상품 포함시 안내 문구
            if (orderItemIds.length > orderProductList.length) {
              messageUtil.alert(`${this.coNm} 경유 시 구매 불가능한 상품이 있습니다.\n해당 상품을 제외하고 결제 페이지로 이동합니다.`, () => {
                bizUtil.gotoOrdersheet(params)
              })
            } else {
              bizUtil.gotoOrdersheet(params)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/cart/CartList";
</style>
