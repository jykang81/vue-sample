const temp01ReqNSBasketMobileCmdReal = {}
temp01ReqNSBasketMobileCmdReal.get = _val => {
  return {
    DISP_TYPE_CD: _val,
    goodsType: 'GENERAL',
    accptPath: '500',
    accptPathCd: '500',
    req_co_cd: '110',
    userId: '',
    catalogId: 97001
  }
}

export default temp01ReqNSBasketMobileCmdReal
