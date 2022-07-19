<template>
  <div class="shopping_alarm_list">
    <div class="title_wrap">
      <strong class="title">
        <i class="icons_orderlist" />신청내역
      </strong>
      <router-link :to="{ name: 'tvScheduleTable'}" event="" class="btn_tv_schedule" @click.native.prevent="goScheduleHome">
        <span>편성표 보기</span>
      </router-link>
    </div>
    <div class="product_list">
      <div
        v-for="(item, index) in shoppingAlarmList"
        :key="index" class="item"
      >
        <router-link
          :to="`/product/${item.partNumber}`"
        >
          <figure>
            <ns-img
              :product-number="item.partNumber"
              :width="144"
              :height="144"
              :alt="item.goodsName"
            />
          </figure>
          <div class="title_option">
            <p class="title">
              {{ item.goodsName }}
            </p>
            <ul class="option">
              <li>수신기간 {{ item.rcvPeriod }}</li>
              <li>{{ item.rcvCnt }} 알림</li>
            </ul>
          </div>
        </router-link>
        <div class="button_box">
          <button
            type="button" class="btn_modify"
            @click="modifyAlarmSettings(item)"
          >
            <span>수정</span>
          </button>
          <button
            type="button" class="btn_delete"
            @click="deleteAlarmSettings(`${item.infrId}`)"
          >
            <span>삭제</span>
          </button>
        </div>
      </div>
      <div v-if="showNoDataDiv"
           class="nodata"
      >
        <p>등록된 방송 알림이 없습니다.</p>
      </div>
    </div>
    <div ref="alarmMsg" class="alarm_guide">
      <p class="title">
        방송알림 안내
      </p>
      <ul class="msg_bullet_list">
        <li>NSmall TV Live / TV Shop+ 방송 30분 전, 방송 예정 시간을 카카오톡 알림 메시지로 알려드립니다. (카카오톡 수신 불가 시, 문자로 발송됩니다.)</li>
        <li>방송 알림은 방송 편성에 따라 변경될 수 있습니다.</li>
        <li>재방송은 알림에서 제외됩니다.</li>
        <li>20시 ~ 08시의 심야/새벽 방송은 저녁 8시에 미리 알려드립니다.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import loginUtil from '@utils/loginUtil'
import Const from '@constants/framework/framework'
import NsImg from '@components/common/NsImg'
import popupUtil from '@frameworks/popupUtil'
import uiUtil from '@utils/uiUtil'
import nativeUtil from '@frameworks/nativeUtil'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'

export default {
  name: 'ShoppingAlarmList',
  components: {
    NsImg
  },
  data () {
    return {
      getMobileInfoFlag: true,
      isListForFlg: true,
      pickedPeriod: '10',
      pickedCnt: '10',
      mobileNum: '',
      modifyProduct: {},
      mInputParams: {},
      reloadKey: 0,
      showNoDataDiv: false,
      shoppingAlarmList: [],
      Const,
      currentCnt: 0,
      totalCnt: 0,
      searchType: ''
    }
  },
  mounted () {
    uiUtil.setInfiniteScroll(this, {
      callback: this.getShowAlarmInfo,
      conditionCallback: this.isGetShowAlarmInfo,
      targetElement: this.$refs.alarmMsg
    })
  },
  methods: {
    /**
     * 알림삭제
     *
     * @param {string} infrId 알림키값
     * @returns {void}
     */
    removeShoppingAlarm (infrId) {
      const params = {
        userId: loginUtil.userId(),
        infrIdList: infrId
      }
      const successHandling = response => {
        if (response.msg.root.resultKey === 1) {
          this.resetList()
        } else {
          const msg = '방송 알리미 삭제에 실패 하였습니다.'
          toastUtil.show(msg)
        }
      }

      const errorHandling = () => {
        const msg = '방송 알리미 삭제에 실패 하였습니다.'
        toastUtil.show(msg)
      }

      this.$nsaxios.post('DeleteAlarmReal', params, successHandling, errorHandling)
    },
    /**
     * 알림정보 세팅
     * @param {object} item 방송알림상품정보
     * @returns {void}
     */
    modifyAlarmSettings (item) {
      const params = {
        infrId: item.infrId,
        mobileNum: item.mobileNum,
        rcvPeriod: item.rcvPeriod,
        rcvCnt: item.rcvCnt,
        productName: item.goodsName,
        partNumber: item.partNumber
      }
      if (item.rcvPeriod === '1개월') {
        this.pickedPeriod = '10'
      } else if (item.rcvPeriod === '2개월') {
        this.pickedPeriod = '20'
      } else if (item.rcvPeriod === '3개월') {
        this.pickedPeriod = '30'
      } else {
        this.pickedPeriod = '10'
      }

      if (item.rcvCnt === '한번만') {
        this.pickedCnt = '10'
      } else if (item.rcvCnt === '방송시마다') {
        this.pickedCnt = '20'
      } else {
        this.pickedCnt = '10'
      }
      params.isSmsMarcketingAgreeChecked = true
      params.isShowModifyPopup = true
      params.pickedCnt = this.pickedCnt
      params.pickedPeriod = this.pickedPeriod

      this.modifyProduct = params
      popupUtil.show('customer/shopping/ShoppingAlarmPopup.vue', this.modifyProduct, data => {
        if (data.resultData.resultCode === '00') {
          // this.resetList()
          this.resetList()
        }
      })
    },
    /**
     * 방송알림 삭제 확인
     * @param {object} infrId 방송알림Key
     */
    deleteAlarmSettings (infrId) {
      const msg = '방송 알림을 삭제하시겠습니까?'
      messageUtil.confirm(msg, () => this.removeShoppingAlarm(infrId))
    },
    /**
     * 방송알림 목록 조회
     *
     * @returns {boolean|void}
     */
    async getShowAlarmInfo () {
      // 조회갯수고 합계와 동일하거나 클경우 조회 중지
      if (this.searchType === 'L' && this.shoppingAlarmList.length >= this.totalCnt && this.totalCnt > 0) {
        return false
      }

      this.searchType = 'L' // 삭제인경우 searchType은 R로 넘어오기때문에 L로 변경
      this.isListForFlg = false
      const params = {}

      this.currentCnt += 1
      params.userId = loginUtil.userId()
      params.pageNum = this.currentCnt
      params.pageSize = 5

      const successHandling = response => {
        const shoppingAlarmList = response.msg.root.shoppingAlarmList
        const isShoppingAlarmExist = !!shoppingAlarmList && shoppingAlarmList.length > 0

        if (isShoppingAlarmExist) {
          const totalCnt = response.msg.root.totalCount

          // 총 카운트 표시
          this.totalCnt = totalCnt
          shoppingAlarmList.forEach(data => {
            if (!data) {
              this.totalCnt -= 1
            } else {
              this.shoppingAlarmList.push(data)
            }
          })
          this.isListForFlg = true
        } else {
          this.showNoDataDiv = true
          this.currentCnt = 0
          this.totalCnt = 0
          this.shoppingAlarmList = []
          this.isListForFlg = true
          return false
        }
      }

      const errorHandling = () => {
        this.showNoDataDiv = true
        this.currentCnt = 0
        this.totalCnt = 0
        this.shoppingAlarmList = []
        this.isListForFlg = true
        return false
      }

      await this.$nsaxios.post('ShowAlarmReal', params, successHandling, errorHandling)
    },
    /**
     * 리스트 초기화
     *
     * @returns {void}
     */
    async resetList () {
      this.currentCnt = 0
      this.totalCnt = 0
      this.shoppingAlarmList = []
      await this.getShowAlarmInfo()

      return true
    },
    /**
     * 리스트 통신중 여부 확인
     *
     * @returns {boolean}
     */
    isGetShowAlarmInfo () {
      return this.isListForFlg
    },
    /**
     * 공지사항 클릭
     */
    goScheduleHome () {
      if (isOsApp()) { // APP
        const params = { toggleActive: 'tv' }
        nativeUtil.goScheduleHome(params)
      } else {
        this.$router.push({ name: 'tvScheduleTable' }).catch(() => {
          // 같은 경로 이동 오류 방어
        })
      }
    }
  }
}
</script>
<style lang="scss">
  @import "~@/assets/styles/views/media/ShoppingAlarmList";
</style>
