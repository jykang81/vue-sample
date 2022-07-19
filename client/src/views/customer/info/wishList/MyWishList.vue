<template>
  <div class="my_wish_list">
    <div v-if="isWishData" class="my_wish_container">
      <div class="total_wrap">
        <span class="wish_link">
          <i class="icons_wish on" />
          <span>총 <span class="num">{{ totalCnt }}개</span></span>
        </span>
        <button
          type="button"
          class="btn_delete_all"
          @click="removeConfirmWishes(null, true)"
        >
          <span>전체삭제</span>
        </button>
      </div>
      <div class="product_list">
        <div
          v-for="(wishData, index) in wishDataList"
          :key="index"
          class="item" :class="wishData.prdTypeClass"
        >
          <router-link
            :to="{ name: 'productDetail', params: { number: wishData.catentryId, clksrc: '마이페이지_찜' }}"
            @click.native="wishProductLogging(wishData)"
          >
            <figure>
              <ns-img
                :product-number="wishData.catentryId"
                :width="224"
                :height="224"
                :alt="wishData.itncatentrynm"
                :is-adult="wishData.adultProduct"
              />
            </figure>
            <div class="price_title">
              <ns-price
                :dc-price="wishData.discountPrice"
                :sold-out="wishData.prdTypeClass === 'soldout'"
              />
              <p class="title">
                {{ htmlDecode(wishData.itncatentrynm) }}
              </p>
            </div>
          </router-link>
          <div class="button_box">
            <button
              type="button"
              class="btn gray_border"
              @click="removeConfirmWishes(wishData.catentryId)"
            >
              <span>삭제</span>
            </button>
            <button
              v-if="(wishData.prdTypeClass !== 'soldout' && wishData.type !== 'noMsgDetail')"
              type="button"
              class="btn coral_border"
              @click="addCart(wishData)"
            >
              <span>장바구니 담기</span>
            </button>
          </div>
        </div>
      </div>
      <p class="my_wish_guide">
        찜한 상품은 등록일로부터 최대 1년간 보관합니다.<br>찜하는 시점과 주문하는 시점에 따른 가격차이가 발생할 수 있으니, 확인 후 구매 하시기 바랍니다.
      </p>
    </div>
    <div v-if="!isWishData" class="my_wish_container">
      <p class="nodata">
        {{ notDataMsg }}
      </p>
    </div>
    <div ref="wishMsg" />
  </div>
</template>

<script>
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import MEMBER_CONST from '@/common/constants/customer/member'
import COMM_CONST from '@/common/constants/framework/constants'
import uiUtil from '@utils/uiUtil'
import bizUtil from '@utils/bizUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import toastUtil from '@frameworks/toastUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'

export default {
  name: 'MyWishList',
  components: {
    NsImg,
    NsPrice
  },
  data () {
    return {
      isWishData: false,
      currentCnt: 0,
      pushFullEvent: false,
      isListForFlg: true,
      totalCnt: 0,
      listIndex: 1,
      totalIdx: 0,
      notDataMsg: '',
      wishDataList: [],
      object: {
        callback: this.getWishList,
        isEnable: true,
        triggerHeightPercent: 90
      }
    }
  },
  async mounted () {
    await this.getWishList()
    uiUtil.bindInfiniteScroll(this, this.object)
  },
  methods: {
    htmlDecode,
    /**
     * 상품상세 클릭
     * @param {Object} data 상품정보
     */
    wishProductLogging (data) {
      // 마케팅 스크립트 적용 부분
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(data.catentryId),
              name: data.itncatentrynm
            }
          ],
          subparams: {
            t1: '마이페이지',
            t2: '찜',
            product_list: '마이페이지_찜'
          }
        }
      })
    },
    /**
     * 찜목록 API호출
     *
     * @returns {Promise}
     */
    async getWishList () {
      this.object.isEnable = false
      // 찜상품 조회갯수고 합계와 동일하거나 클경우 조회 중지
      if (this.listIndex >= this.totalIdx && this.currentCnt >= this.totalCnt && this.totalCnt > 0) {
        return false
      }

      const params = {
        currentCnt: this.currentCnt
      }

      const successHandling = data => {
        this.pushFullEvent = false
        if (data.msg && data.msg.isSuccess) {
          const resultData = data.msg.data
          if (resultData.wishProductList.length > 0) {
            this.isWishData = true
            const totalCnt = resultData.pageInfo.totalCnt
            // 총 카운트 표시
            this.totalCnt = totalCnt

            if (this.currentCnt === 0) {
              this.totalIdx = (totalCnt % 20) === 0 ? (totalCnt / 20) : (totalCnt / 20) + 1
            }

            // 리스트 그리기
            const wishProductList = resultData.wishProductList
            this.listIndex++
            console.log('as : ', this.currentCnt)
            this.drawWishList(wishProductList).then(() => {
              this.currentCnt += wishProductList.length
              console.log('to : ', this.currentCnt)
              this.object.isEnable = true
              console.log('this.object.isEnable 01 : ', this.object.isEnable)
            })
          } else {
            // 찜 없음 표시
            this.isWishData = false
            this.notDataMsg = '찜한 상품이 없습니다.'
            this.object.isEnable = true
          }
        }
        console.log('this.object.isEnable 02 : ', this.object.isEnable)
      }

      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVICE_PROC_ERROR_COMMON, () => {
          routerUtil.back()
          this.object.isEnable = true
        })
      }
      await this.$nsaxios.post('GetWishList', params, successHandling, errorHandling)
    },
    /**
     * 리스트데이터 배열에 담기
     *
     * @param {object} wishProductList 리스트데이터
     * @returns {void}
     */
    async drawWishList (wishProductList) {
      await wishProductList.forEach(data => {
        if (!data) {
          this.totalCnt -= 1
        } else {
          let isCatentryId = false
          this.wishDataList.forEach(tmpData => {
            if (tmpData.catentryId === data.catentryId) {
              isCatentryId = true
            }
          })

          if (!isCatentryId) {
            const adultProduct = isNull(data.adultProduct) ? 'Y' : 'N'

            // 판매 가능 상품리스트 템플릿
            let prdTypeClass = ''
            // 판매 불가 상품리스트 템플릿
            if (!data.saleProduct) {
              prdTypeClass = 'soldout'
            }

            // 장바구니 버튼 노출 여부

            // type : 이벤트 동작
            // - cart   : 장바구니 담기
            // - detail : 상품상세 이동
            data.type = 'cart'

            // 유/무형 상품
            // true  : 유형상품 - 장바구니,
            if (data.materialProduct) {
              // 장바구니 담기 가능 여부.. 불가 시 상세 이동
              if (!data.possibleAddCart) {
                data.type = 'detail'
              }
              // false : 무형상품 - 상담신청
            } else {
              data.btnName = '상담신청'
              data.type = 'noMsgDetail'
            }

            data.price_unit = data.price ? data.unit : ''

            const tmpData = {
              reserveFund: data.reserveFund,
              unit: data.unit,
              couponList: data.couponList,
              saleProduct: data.saleProduct,
              materialProduct: data.materialProduct,
              discountPrice: data.discountPrice,
              price: data.price,
              possibleAddCart: data.possibleAddCart,
              bundleShipping: data.bundleShipping,
              adultProduct,
              interestFree: data.interestFree,
              catentryId: data.catentryId,
              class: data.class,
              freeShipping: data.freeShipping,
              billingDiscount: data.billingDiscount,
              itncatentrynm: data.itncatentrynm,
              showCartBtn: data.showCartBtn,
              type: data.type,
              btnName: data.btnName,
              price_unit: data.price_unit,
              prdTypeClass
            }

            this.wishDataList.push(tmpData)
          }
        }
      })
    },
    /**
     * 찜상품 삭제
     * @param {string} catentryId [필수] 상품코드
     * @param {string} isAll [선택] 전체여부
     * @returns {boolean|void}
     */
    removeConfirmWishes (catentryId = '', isAll = false) {
      const param = {
        catentryIds: [
          catentryId
        ]
      }

      // 전체삭제일때 처리
      if (isAll) {
        if (this.wishDataList.length > 0) {
          const tmpCatentryIds = []
          this.wishDataList.forEach(function (data, idx) {
            tmpCatentryIds[idx] = data.catentryId
          })
          param.catentryIds = tmpCatentryIds
          param.isAll = isAll
        } else {
          return false
        }

        const okCallback = () => {
          this.removeWishes(param)
        }
        const cancelCallback = () => {
          return false
        }

        messageUtil.confirm(COMM_CONST.CONFIRM_MESSAGES.PRODUCT_ALL_REMOVE, okCallback, cancelCallback, '확인', '취소')
      } else {
        this.removeWishes(param)
      }
    },
    /**
     * 찜상품 삭제API 호출
     * @param {object} params 삭제대상상품 정보
     * @returns {Promise}
     */
    async removeWishes (params) {
      const successHandling = data => {
        // 마케팅 스크립트 적용 부분
        // GA 360
        if (params.isAll) {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_찜',
              eventAction: '찜활동',
              eventLabel: '전체삭제',
              params: {
                t1: null
              }
            }
          })
        } else {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_찜',
              eventAction: '찜활동',
              eventLabel: '개별삭제',
              params: {
                t1: null
              }
            }
          })
        }

        if (data.msg && data.msg.isSuccess) {
          window.location.reload()
        } else {
          let eMsg = '일시적으로 오류가 발생했습니다. 잠시 후 다시 시도 하시기 바랍니다.'
          eMsg = data.msg ? data.msg.userMessage : eMsg
          messageUtil.alert(eMsg)
        }
      }

      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('RemoveWishes', params, successHandling, errorHandling)
    },
    /**
     * 장바구니 담기처리
     * @param {object} prdInfo 장바구니담기처리를 위한 파라메터
     * @returns {Promise}
     */
    async addCart (prdInfo) {
      const catentryId = prdInfo.catentryId
      const successHandling = data => {
        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_찜',
            eventAction: '찜활동',
            eventLabel: '장바구니담기',
            params: {
              t1: null
            }
          }
        })

        if (data.msg && data.msg.isSuccess) {
          // E-commerce
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
            data: {
              step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
              params: [
                {
                  id: String(catentryId),
                  name: prdInfo.itncatentrynm,
                  brand: '',
                  category: '찜',
                  dimension16: 'e상품'
                }
              ],
              subparams: {
                t1: '마이페이지',
                t2: '혜택정보',
                t3: '찜'
              }
            }
          })
          // TODO : 추후 변경
          // GA360
          // var product_array = [];
          // product_array.push(
          //     {
          //       'id':prdInfo.catentryId,
          //       'name':prdInfo.itncatentrynm,
          //       'brand':"",
          //       'category':"찜",
          //       'dimension16':"e상품"
          //     }
          // )
          // var subparam = {
          //     t1:'마이페이지',
          //     t2:'혜택정보',
          //     t3:'찜'
          // };
          // GA.sendEcommerceData(product_array,"3", subparam);

          toastUtil.show(COMM_CONST.TOAST_MESSAGES.CART_ADD_SUCCESS, 'add_cart')
          bizUtil.getCartCount()
        } else {
          // toastUtil.show(COMM_CONST.TOAST_MESSAGES.CART_ADD_OPTION)
          this.gotoProdDetail(catentryId)
        }
      }

      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      await this.$nsaxios.post('AddCart', { catentryId: prdInfo.catentryId }, successHandling, errorHandling)
    },
    /**
     * 상품상세로 이동
     *
     * @param {string} catentryId 상품번호
     * @param {string} msg 메세지
     * @returns {void}
     */
    gotoProdDetail (catentryId, msg) {
      if (msg) {
        const okCb = () => {
          bizUtil.gotoProductDetail(catentryId, { showRightOrderOptionFlag: true })
          return false
        }

        messageUtil.confirm(msg, okCb, null, '확인', '취소')
      } else {
        bizUtil.gotoProductDetail(catentryId, { showRightOrderOptionFlag: true })
      }
    },
    /**
     * 리스트 통신중 여부 확인
     *
     * @returns {boolean}
     */
    isGetWishInfo () {
      return this.isListForFlg
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/info/wishList/MyWishList";
</style>
