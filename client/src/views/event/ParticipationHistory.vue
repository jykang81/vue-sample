<template>
  <div class="participation_history">
    <div class="tabs">
      <router-link
        class="tab active"
        :to="{ name: 'participationHistory' }"
        replace
      >
        <span>
          참여내역
        </span>
      </router-link>
      <router-link
        :to="{ name: 'participationWinner' }"
        class="tab"
        replace
      >
        <span>
          당첨자발표
        </span>
      </router-link>
    </div>
    <ul
      v-for="(item, index) in partList"
      v-show="isListFlg"
      :key="index"
      class="part_detail_list"
    >
      <li>
        <p class="title">
          {{ htmlDecode(item.offerNm) }}
        </p>
        <p class="date">
          응모일 : {{ item.init_regi_dttm }}
        </p>
      </li>
    </ul>
    <p v-show="!isListFlg" class="empty">
      참여내역이 없습니다.
    </p>
    <div ref="listEnd" />
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import uiUtil from '@utils/uiUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'

export default {
  name: 'ParticipationHistory',
  data () {
    return {
      isListFlg: true,
      pageIdx: 1,
      isListForFlg: true,
      totalCount: 0,
      partList: [],
      failCnt: 0,
      object: {
        callback: this.getNoticeListMobile
      }
    }
  },
  async mounted () {
    await this.getNoticeListMobile()
    uiUtil.bindInfiniteScroll(this, this.object)
  },
  methods: {
    htmlDecode,
    /**
     * 참여내역 조회
     *
     * @returns {void}
     */
    async getNoticeListMobile () {
      if (this.partList.length >= this.totalCount && this.totalCount > 0) {
        return false
      }

      if (isNull(this.pageId) || this.pageId === 0) {
        this.pageId = 1
      }

      const invoke = {
        cmdType: 103,
        userId: loginUtil.userId(),
        rowPerPage: 10,
        pageIdx: this.pageIdx
      }

      const failRes = () => {
        if (this.failCnt < 3) {
          this.failCnt++
          this.getNoticeListMobile()
        } else {
          this.failCnt = 0
          messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.')
          return false
        }
      }
      await this.$nsaxios.post('NSAjaxMTimesEventCmd', invoke, this.setNoticeListMobile, failRes)
    },
    /**
     * 참여내역 정보 세팅
     * @param {object} data API데이터
     * @returns {boolean|void}
     */
    setNoticeListMobile (data) {
      if (!isNull(data.msg.eventList)) {
        this.failCnt = 0
        this.totalCount = isNull(data.msg.totCnt) ? 0 : data.msg.totCnt

        const eventList = data.msg.eventList
        const isEventList = !!eventList && eventList.length > 0
        if (!isEventList) {
          this.isListFlg = false
        } else {
          this.isListFlg = true
          eventList.forEach((data, idx) => {
            const items = eventList[idx]

            // 새글처리
            if (isNull(items.newPostYn) === 'N') {
              items.newTag = false
            } else {
              items.newTag = true
            }

            // 중요처리
            if (isNull(items.notiGb) === '1') {
              items.titleIndex = true
            } else {
              items.titleIndex = false
            }

            this.partList.push(items)
          })
          this.pageIdx++
        }
      }
    },
    /**
     * 리스트 통신중 여부 확인
     *
     * @returns {boolean}
     */
    isGetList () {
      return this.isListForFlg
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/event/ParticipationHistory";
</style>
