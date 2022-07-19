import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@utils/loginUtil'
import {
  isNull,
  onlyNumFormat,
  stringFormat,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  getAddDate
} from '@frameworks/dateutil/dateUtil'
import messageUtil from '@frameworks/messageUtil'
import MESSAGES from '@constants/framework/messages'

const winnerMixin = {
  methods: {
    /**
     * 당첨자발표 목록 조회 및 검색
     *
     * @returns {void}
     */
    async getNoticeListMobile () {
      if (this.winnerList.length >= this.totalCount && this.totalCount > 0) {
        return false
      }

      if (isNull(this.pageId) || this.pageId === 0) {
        this.pageId = 1
      }

      this.isListForFlg = false

      const invoke = {
        cmdType: 101,
        tab_gubun: 3, // 1-이벤트 발표및 공지 , 2-이벤트 목록"
        sel_gubun: 'AL', // AL'-전체, CL-진행중, FL-종료
        imgType: 'BANNIMGIDSEQ1',
        userId: loginUtil.userId(),
        rowPerPage: 10,
        pageIdx: this.pageId,
        recGb: this.recGb,
        searchValue: this.searchKeyword
      }

      const resultData = await nsaxios.post('NSAjaxMTimesEventCmd', invoke)
      this.setNoticeListMobile(resultData)
    },
    /**
     * 당첨자발표 API데이터 작업
     * @param {object} data json데이터
     * @returns {void}
     */
    setNoticeListMobile (data) {
      if (isNull(data.msg)) {
        messageUtil.alert(MESSAGES.procedure_error)
        return false
      }

      this.totalCount = isNull(data.msg.totCnt) ? 0 : data.msg.totCnt

      const eventList = data.msg.eventList
      const isEventList = !!eventList && eventList.length > 0
      if (!isEventList) {
        this.isList = false
      } else {
        this.isList = true
        eventList.forEach((data, idx) => {
          const items = eventList[idx]

          // 새글처리
          if (getAddDate('day', -7) <= onlyNumFormat(items.initRegiDttm)) {
            items.newTag = true
          } else {
            items.newTag = false
          }

          this.winnerList.push(items)
        })
        this.pageId++
      }
      this.isListForFlg = true
    },
    /**
     * 당첨자발표 상세호출
     * @param {object} item 리스트ROW데이터
     * @returns {void}
     */
    onclickDetailNotice (item) {
      const goingInvok = {
        name: 'participationWinnerDetail',
        params: {
          eventState: item.eventState,
          offerIdfr: item.offerIdfr,
          itemData: item,
          artclNum: item.artclNum
        }
      }

      this.$router.push(goingInvok)
    },
    /**
     * 당첨자발표 검색페이지에서 상세호출
     * @param {object} item 리스트ROW데이터
     * @returns {void}
     */
    detailNotice (item) {
      const goingInvok = {
        name: 'participationWinnerDetail',
        params: {
          eventState: item.eventState,
          offerIdfr: item.offerIdfr,
          itemData: item,
          artclNum: item.artclNum
        }
      }

      this.$router.push(goingInvok)
    },
    /**
     * 당첨자발표 상세정보API호출
     *
     * @returns {void}
     */
    getEventWinningInfo () {
      const invoke = {
        cmdType: 102,
        offerIdfr: this.winnerRowData.offerIdfr, // '1,2,3,4',
        artclNum: this.winnerRowData.artclNum,
        winConfirmYn: 'Y'
      }

      nsaxios.post('NSAjaxMTimesEventCmd', invoke, this.responseEventWinningInfo)
    },
    /**
     * 당첨자발표 상세정보 callback
     * @param {object} data callbackData
     * @returns {boolean|void}
     */
    responseEventWinningInfo (data) {
      if (isNull(data.msg)) {
        messageUtil.alert(MESSAGES.procedure_error)
        return false
      }
      this.winnerApiData = data.msg

      // 상세 내용 출력
      const eventWinDetail = this.winnerApiData.eventWinDetail

      if (isNull(eventWinDetail) || Object.keys(eventWinDetail).length === 0) {
        this.isDetail = false
        return false
      } else {
        this.isDetail = true

        if (getAddDate('day', -7) <= onlyNumFormat(eventWinDetail.initRegiDttm)) {
          this.winnerApiData.eventWinDetail.newTag = true
        } else {
          this.winnerApiData.eventWinDetail.newTag = false
        }

        if (!isNull(this.winnerApiData.eventWinDetail.content)) {
          this.winnerApiData.eventWinDetail.content = `${htmlDecode(stringFormat('<p>{0}</p>', this.winnerApiData.eventWinDetail.content))}`
        }
      }
    }
  }
}

export default winnerMixin
