<template>
  <div class="cust_center_notice_detail">
    <div class="item">
      <span
        v-if="noticeView.notiGb === '1'"
        class="badge"
      >
        중요
      </span>
      <div class="title">
        <span class="subject">
          {{ noticeView.subject }}
          <span
            v-if="noticeView.newPostYn !== 'N'"
            class="icons_new"
          >
            new
          </span>
        </span>
        <p class="date">
          {{ noticeView.date }}
        </p>
      </div>
    </div>
    <div
      class="ns_write"
      v-html="decodeContent"
    />

    <div
      v-if="noticeView.file && noticeView.file.length > 0"
      class="ns_file"
    >
      <strong class="title_file">첨부파일</strong>
      <a
        v-for="(file, index) in noticeView.file"
        :key="index"
        :href="CONST.NS_IMAGE_EXHI_SRV + file.fileUrl"
        target="_blank"
        class="file"
      >
        {{ file.fileName }}
      </a>
    </div>
  </div>
</template>

<script>
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import CONST from '@constants/framework/framework'

export default {
  data () {
    return {
      noticeId: '',
      noticeView: {},
      decodeContent: ''
    }
  },
  computed: {
    CONST () {
      return CONST
    }
  },
  created () {
    this.noticeId = this.$route.params.id

    this.getNoticeDetail()
  },
  methods: {
    /**
     * 공지사항 상세 가져오기
     */
    getNoticeDetail () {
      const param = {
        artclNum: this.noticeId,
        tab_gubun: 1,
        cmd_gubun: 'ND'
      }

      const successHandling = data => {
        this.noticeView = data.msg.root.NoticeView
        this.decodeContent = htmlDecode(this.noticeView.content)
      }

      this.$nsaxios.post('FooterNoticeViewMobileReal', param, successHandling)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterNoticeDetail";
</style>
