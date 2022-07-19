const temp01ReqNSMypageCmd = {
  method: 'post',
  url: 'http://devwww.nsmall.com/webapp/wcs/stores/servlet/NSMypageCmd',
  data: {
    pageidx: '1',
    rowpage: '10',
    tmtyp: '3',
    odt1: '2020.05.05',
    odt2: '2020.06.05',
    status: '',
    userId: '111476762',
    midx: 'navi_11',
    channel: 'mobile',
    accptPath: '500',
    accptPathCd: '500'
  }
}

export default temp01ReqNSMypageCmd
