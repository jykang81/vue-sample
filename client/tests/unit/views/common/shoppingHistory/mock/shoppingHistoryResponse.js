const GetWishList = {
  msg: {
    data: {
      pageInfo: {
        totalCnt: 2
      },
      wishProductList: [
        { catentryId: '21821675' },
        { catentryId: '26030598' }
      ]
    }
  }
}

const RemoveWish = {
  msg: {
    class: 'class com.ns.commerce.common.bean.ResultBean',
    data: null,
    exception: null,
    isSuccess: 1,
    resultCode: null,
    userMessage: null
  }
}

const RegisterWish = {
  msg: {
    class: 'class com.ns.commerce.common.bean.ResultBean',
    data: null,
    exception: null,
    isSuccess: 1,
    resultCode: null,
    userMessage: null
  }
}

const ErrorWish = {
  msg: {
    isSuccess: 0,
    resultCode: '19001'
  }
}

export { GetWishList, RegisterWish, RemoveWish, ErrorWish }
