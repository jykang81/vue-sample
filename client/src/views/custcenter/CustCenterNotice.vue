<template>
  <div class="cust_center_notice">
    <ul
      v-if="noticeList.length > 0"
    >
      <li
        v-for="(item, index) in noticeList"
        :key="index"
        class="item"
      >
        <span
          v-if="item.notiGb === '1'"
          class="badge"
        >
          중요
        </span>
        <div class="title">
          <router-link
            :to="'/custcenter/notice/' + item.noticeId"
          >
            <span class="subject">
              {{ item.subject }}
              <span
                v-if="item.newPostYn !== 'N'"
                class="icons_new"
              >
                new
              </span>
            </span>
            <p class="date">
              {{ item.date }}
            </p>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import uiUtil from '@/common/utils/uiUtil'

export default {
  data () {
    return {
      pageIdx: 1,
      pageSize: 10,
      totalCount: 0,
      noticeList: [],
      object: {
        callback: this.getNotice
      },
      isApiLoding: false
    }
  },
  mounted () {
    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)
  },
  created () {
    this.getNotice()
  },
  methods: {
    /**
     * 공지사항 리스트 가져오기
     * @returns {void|boolean}
     */
    getNotice () {
      // 현재 불러온 리스트의 개수가 총 개수보다 많거나 같으면
      if (this.pageIdx !== 1 && this.noticeList.length >= this.totalCount) {
        return false
      }

      // 현재 로딩중이면
      if (this.isApiLoding) {
        return false
      }

      this.isApiLoding = true

      const param = {
        pageId: this.pageIdx,
        pageSize: this.pageSize,
        tab_gubun: 1,
        cmd_gubun: 'NL'
      }

      const successHandling = data => {
        this.totalCount = data.msg.root.TotalCount
        this.noticeList = this.noticeList.concat(data.msg.root.NoticeList)
        this.pageIdx++
        this.isApiLoding = false
      }

      this.$nsaxios.post('FooterNoticeListMobileReal', param, successHandling)
    },
    /**
     * 무한 스크롤용 객체 초기화
     */
    initParamObject () {
      this.object.callback = this.getNotice
      this.object.isEnable = true
      this.object.interval = 500
      this.object.triggerHeightPercent = 70
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterNotice";
</style>
