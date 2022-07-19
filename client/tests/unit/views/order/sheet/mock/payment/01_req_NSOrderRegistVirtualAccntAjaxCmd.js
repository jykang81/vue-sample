const temp01ReqNSOrderRegistVirtualAccntAjaxCmd = {}
temp01ReqNSOrderRegistVirtualAccntAjaxCmd.get = (_code, _name) => {
  return {
    userId: '30124193',
    bankName: _name,
    bankCode: _code
  }
}

export default temp01ReqNSOrderRegistVirtualAccntAjaxCmd
