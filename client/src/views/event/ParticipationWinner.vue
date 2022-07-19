<template>
  <div class="participation_winner">
    <div class="tabs">
      <router-link
        :to="{ name: 'participationHistory' }"
        class="tab"
        replace
      >
        <span>
          참여내역
        </span>
      </router-link>
      <router-link
        :to="{ name: 'participationWinner' }"
        class="tab active"
        replace
      >
        <span>
          당첨자발표
        </span>
      </router-link>
    </div>
    <p class="search">
      <router-link :to="{ name: 'participationWinnerSearch', params: { recGb } }" class="search_input">
        <label>
          <input
            type="text"
            placeholder="이벤트 검색"
            required
          >
          <button
            type="button"
            class="btn_reset"
          >
            <span>검색어초기화</span>
          </button>
          <button
            type="type"
            class="btn_search"
          >
            검색
          </button>
        </label>
      </router-link>
    </p>
    <div class="title_sort">
      <h3>당첨자발표</h3>
      <label class="select">
        <select v-model="recGb" @change="chageNoticeListMobile">
          <option value="">전체</option>
          <option value="98">전등급</option>
          <option value="99">VIP</option>
        </select>
      </label>
    </div>
    <ul
      v-for="(item, index) in winnerList"
      v-show="isList"
      :key="index"
      class="winnder_announce_list"
    >
      <li @click="onclickDetailNotice(item)">
        <p class="title">
          <i v-if="item.recGb === 'VIP'" class="vip">VIP</i>
          {{ htmlDecode(item.title) }}
        </p>
        <p class="date">
          당첨발표일 : {{ item.wnrDt }}
        </p>
      </li>
    </ul>
    <p v-if="!isList" class="empty">
      당첨자 발표 게시물이 없습니다.
    </p>
    <div ref="listEnd" />
  </div>
</template>

<script>
import uiUtil from '@/common/utils/uiUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import winnerMixin from '@/mixins/event/winnerMixin'
export default {
  name: 'ParticipationWinner',
  mixins: [
    winnerMixin
  ],
  data () {
    return {
      recGb: '',
      pageId: 0,
      winnerList: [],
      isApiLoding: false,
      totalCount: 0,
      isList: true,
      isListForFlg: true
    }
  },
  mounted () {
    uiUtil.setInfiniteScroll(this, {
      callback: this.getNoticeListMobile,
      conditionCallback: this.isGetList,
      targetElement: this.$refs.listEnd
    })
  },
  activated () {
    // 이전 페이지가 참여한 이벤트 페이지일때만 검색 이력 초기화
    const referer = this.$route.meta.refer

    if (referer === 'viplounge') {
      this.recGb = isNull(this.$route.params.recGb) ? '' : this.$route.params.recGb
    }

    if (referer !== 'ParticipationWinnerDetail') {
      this.chageNoticeListMobile()
    }
  },
  created () {
    this.recGb = isNull(this.$route.params.recGb) ? '' : this.$route.params.recGb
  },
  methods: {
    htmlDecode,
    /**
     * 키워드 제거 및 리스트 초기화
     */
    chageNoticeListMobile () {
      this.pageId = 1
      this.winnerList = []
      this.isList = false
      this.getNoticeListMobile()
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
  @import "~@/assets/styles/views/event/ParticipationWinner";
</style>
