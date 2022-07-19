const temp02ReqNSMypageCommCmdAlejandro = {}
temp02ReqNSMypageCommCmdAlejandro.get = (_mnm, _val) => {
  return {
    tasknm: 'alejandro',
    var: `{"cnm":"com.ns.commerce.nsmypage.util.NSAlejandroAdapter","mnm":"${_mnm}","args":{"ordersId":"300011018016"${_val}}}`,
    accptPath: '500',
    accptPathCd: '500',
    req_co_cd: '110',
    userId: '',
    catalogId: 97001
  }
}
export default temp02ReqNSMypageCommCmdAlejandro
