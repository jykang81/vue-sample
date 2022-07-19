import CONST from '@constants/framework/framework'

const nsaJaxMTimesEventCmdUrl = `${CONST.API_URL}/NSAjaxMTimesEventCmd`

// 이벤트 참여내역
const nsaJaxMTimesEventCmdRes = {
  msg: {
    eventList: [
      {
        eventPrgrsMeans: '1',
        drwCnfrmYn: '0',
        startDt: '2020.09.21',
        offerIdfr: '100000082801',
        init_regi_dttm: '2020.09.21',
        winDttm: '0',
        num: '2',
        eventState: '진행중',
        endDt: '2020.09.27',
        offerNm: '200921~0927_해피딜재구매적립_신청'
      },
      {
        eventPrgrsMeans: '1',
        drwCnfrmYn: '0',
        startDt: '2020.09.01',
        offerIdfr: '100000082366',
        init_regi_dttm: '2020.09.21',
        winDttm: '0',
        num: '1',
        eventState: '진행중',
        endDt: '2020.09.27',
        offerNm: '추석이벤트_쿠폰_3천원'
      }
    ],
    totCnt: 2
  }
}

// 당첨자 발표
const winnerListRes = {
  msg: {
    totCnt: 65,
    rowPerPage: 10,
    tab_gubun: 3,
    eventList: [
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '1',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '슬리미 현금 2020.09.20 20:30~21:40',
        artclNum: '8433',
        recGb: '일반',
        wnrDt: '2020.09.21',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '2',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '슬리미 3대 추첨 2020.09.20 20:30~21:40',
        artclNum: '8432',
        recGb: '일반',
        wnrDt: '2020.09.21',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '3',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '쿠쿠펫드라이룸 2020.09.20 17:15~18:15',
        artclNum: '8431',
        recGb: '일반',
        wnrDt: '2020.09.21',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '4',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '쿠쿠정수기 2020.09.20 16:05~17:15',
        artclNum: '8430',
        recGb: '일반',
        wnrDt: '2020.09.21',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '5',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '에코체음식물처리기 2020.09.19 18:00~18:55',
        artclNum: '8429',
        recGb: '일반',
        wnrDt: '2020.09.21',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '6',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '도루코프라이팬 2020.09.19 10:40~11:40',
        artclNum: '8428',
        recGb: '일반',
        wnrDt: '2020.09.21',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '7',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '휴렉음식물처리기 2020.09.18 23:55~00:55',
        artclNum: '8427',
        recGb: '일반',
        wnrDt: '2020.09.21',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '8',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '[NS톡] 8월 펫밀리아 방송 적립금 이벤트 당첨자',
        artclNum: '8399',
        recGb: '일반',
        wnrDt: '2020.09.18',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '9',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '[NS톡] 8월 지인창호 방송 적립금 이벤트 당첨자',
        artclNum: '8398',
        recGb: '일반',
        wnrDt: '2020.09.18',
        endDt: '',
        offerNm: ''
      },
      {
        startDt: '',
        drwCnfrmYn: '0',
        offerIdfr: '',
        num: '10',
        eventState: '',
        offerPrgrsStatSpr: '0',
        title: '[NS톡] 8월 쿠쿠 특집전 적립금 이벤트 당첨자',
        artclNum: '8397',
        recGb: '일반',
        wnrDt: '2020.09.18',
        endDt: '',
        offerNm: ''
      }
    ],
    pageIdx: 1
  }
}

const winnerDetilRes = {
  msg: {
    eventWinDetail: {
      notiGb: '0',
      inqryCnt: '186',
      title: '슬리미 현금 2020.09.20 20:30~21:40',
      content: '&lt;P&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;● 당첨을 축하합니다.!!&lt;\\/SPAN&gt;&lt;\\/P&gt;\r\n&lt;P&gt;&lt;BR&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;● 방송시간 : 2020.09.20 20:30~21:40&lt;\\/SPAN&gt;&lt;BR&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;● 이벤트명 : 현금 총 100만원&lt;\\/SPAN&gt;&lt;BR&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;● 당첨인원 : 2명&lt;\\/SPAN&gt;&lt;BR&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;● 사은품 : 100만원 x 2명 추첨 (제세공과금 22% 고객부담)&lt;\\/SPAN&gt;&lt;\\/P&gt;\r\n&lt;P&gt;&lt;BR&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;- 해피콜 진행예정&lt;\\/SPAN&gt;&lt;\\/P&gt;\r\n&lt;P&gt;&amp;nbsp;&lt;\\/P&gt;\r\n&lt;P&gt;\r\n&lt;TABLE style=\\"WIDTH: 372pt; BORDER-COLLAPSE: collapse\\" cellSpacing=0 cellPadding=0 width=496 border=0&gt;\r\n&lt;COLGROUP&gt;\r\n&lt;COL style=\\"WIDTH: 36pt; mso-width-source: userset; mso-width-alt: 1536\\" width=48&gt;\r\n&lt;COL style=\\"WIDTH: 182pt; mso-width-source: userset; mso-width-alt: 7776\\" width=243&gt;\r\n&lt;COL style=\\"WIDTH: 61pt; mso-width-source: userset; mso-width-alt: 2592\\" width=81&gt;\r\n&lt;COL style=\\"WIDTH: 93pt; mso-width-source: userset; mso-width-alt: 3968\\" width=124&gt;\r\n&lt;TBODY&gt;\r\n&lt;TR style=\\"HEIGHT: 16.5pt\\" height=22&gt;\r\n&lt;TD class=xl65 style=\\"BORDER-TOP: black 0.5pt solid; HEIGHT: 16.5pt; BORDER-RIGHT: black 0.5pt solid; WIDTH: 36pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black 0.5pt solid; BACKGROUND-COLOR: #cd2e57\\" height=22 width=48&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;STRONG&gt;&lt;FONT color=#ffffff face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;순위&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/STRONG&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl65 style=\\"BORDER-TOP: black 0.5pt solid; BORDER-RIGHT: black 0.5pt solid; WIDTH: 182pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: #cd2e57\\" width=243&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;STRONG&gt;&lt;FONT color=#ffffff face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;상품명&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/STRONG&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl65 style=\\"BORDER-TOP: black 0.5pt solid; BORDER-RIGHT: black 0.5pt solid; WIDTH: 61pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: #cd2e57\\" width=81&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;STRONG&gt;&lt;FONT color=#ffffff face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;고객명&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/STRONG&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl66 style=\\"BORDER-TOP: black 0.5pt solid; BORDER-RIGHT: black 0.5pt solid; WIDTH: 93pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: #cd2e57\\" width=124&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;STRONG&gt;&lt;FONT color=#ffffff face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;휴대폰번호&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/STRONG&gt;&lt;\\/P&gt;&lt;\\/TD&gt;&lt;\\/TR&gt;\r\n&lt;TR style=\\"HEIGHT: 16.5pt\\" height=22&gt;\r\n&lt;TD class=xl68 style=\\"BORDER-TOP: #f0f0f0; HEIGHT: 16.5pt; BORDER-RIGHT: black 0.5pt solid; WIDTH: 36pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black 0.5pt solid; BACKGROUND-COLOR: white\\" height=22 width=48&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;1&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl68 style=\\"BORDER-TOP: #f0f0f0; BORDER-RIGHT: black 0.5pt solid; WIDTH: 182pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: white\\" width=243&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;현금 100만원 1차 추첨&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl68 style=\\"BORDER-TOP: #f0f0f0; BORDER-RIGHT: black 0.5pt solid; WIDTH: 61pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: white\\" width=81&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;전상*&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl69 style=\\"BORDER-TOP: #f0f0f0; BORDER-RIGHT: black 0.5pt solid; WIDTH: 93pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: white\\" width=124&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;6238&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;&lt;\\/TR&gt;\r\n&lt;TR style=\\"HEIGHT: 16.5pt\\" height=22&gt;\r\n&lt;TD class=xl68 style=\\"BORDER-TOP: #f0f0f0; HEIGHT: 16.5pt; BORDER-RIGHT: black 0.5pt solid; WIDTH: 36pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black 0.5pt solid; BACKGROUND-COLOR: white\\" height=22 width=48&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;2&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl68 style=\\"BORDER-TOP: #f0f0f0; BORDER-RIGHT: black 0.5pt solid; WIDTH: 182pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: white\\" width=243&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;현금 100만원 2차 추첨&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl68 style=\\"BORDER-TOP: #f0f0f0; BORDER-RIGHT: black 0.5pt solid; WIDTH: 61pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: white\\" width=81&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;이미*&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;\r\n&lt;TD class=xl69 style=\\"BORDER-TOP: #f0f0f0; BORDER-RIGHT: black 0.5pt solid; WIDTH: 93pt; BORDER-BOTTOM: black 0.5pt solid; BORDER-LEFT: black; BACKGROUND-COLOR: white\\" width=124&gt;\r\n&lt;P style=\\"TEXT-ALIGN: center\\"&gt;&lt;FONT color=#000000 face=Arial&gt;&lt;SPAN style=\\"FONT-FAMILY: Arial,sans-serif\\"&gt;7560&lt;\\/SPAN&gt;&lt;\\/FONT&gt;&lt;\\/P&gt;&lt;\\/TD&gt;&lt;\\/TR&gt;&lt;\\/TBODY&gt;&lt;\\/TABLE&gt;&lt;\\/P&gt;',
      artclNum: '8433',
      recGb: '일반',
      initRegiDttm: '2020.09.21'
    },
    tab_gubun: 1,
    eventDetail: {}
  }
}

const memberInfo = {
  tcode: 't123',
  gender: 'F',
  loginType: 'K',
  userId: 111103108,
  hpNo: '010-9898-9342',
  isSSORequest: 'false',
  isAdult: 'true',
  custNum: '30124937',
  gradeNm: '패밀리',
  userName: '강진영',
  adultAuthYN: 'N',
  entFlag: 'Y',
  userMargetingTM: 'N',
  lastOrder: '2020-03-12 18:21:20.125',
  registration: '2020-03-12 16:44:06.125',
  email: 'lsd251@nsmall.com',
  telNo: '010-9898-9342',
  userMargetingEmail: 'N',
  birthday: '19840425',
  userMarketingSMS: 'N',
  logonId: 'lsd251@nsmall.com',
  failcount: '0',
  sessionid: 'mxa-VH3TY9K5c1ECcC5i_Uj',
  sessionId: 'mxa-VH3TY9K5c1ECcC5i_Uj',
  loginyn: 'Y',
  logonType: 'WEB',
  memberGradeCss: 'family',
  staffInfo: false,
  staffInfoName: '대표',
  staffBnft: 'Y'
}

export { nsaJaxMTimesEventCmdUrl, nsaJaxMTimesEventCmdRes, winnerListRes, winnerDetilRes, memberInfo }
