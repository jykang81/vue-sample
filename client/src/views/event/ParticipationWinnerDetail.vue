<template>
  <div class="participation_winner_detail">
    <ul class="winnder_announce_list single">
      <li>
        <p class="title">
          {{ htmlDecode(winnerApiData.eventWinDetail.title) }}
        </p>
        <p class="date">
          당첨발표일 : {{ winnerApiData.eventWinDetail.initRegiDttm }}
        </p>
      </li>
    </ul>
    <div
      id="eventWinDetail"
      class="winnder_announce_detail"
      v-html="winnerApiData.eventWinDetail.content"
    />
  </div>
</template>

<script>
import winnerMixin from '@/mixins/event/winnerMixin'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
export default {
  mixins: [
    winnerMixin
  ],
  data () {
    return {
      isDetail: false,
      winnerRowData: {},
      winnerApiData: {
        eventWinDetail: {
          title: '',
          initRegiDttm: '',
          content: ''
        }
      }
    }
  },
  created () {
    this.winnerRowData = this.$route.params
    this.getEventWinningInfo()
  },
  methods: {
    htmlDecode
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/event/ParticipationWinnerDetail";
</style>
