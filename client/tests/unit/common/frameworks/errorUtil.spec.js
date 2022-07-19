import errorUtil from '@frameworks/errorUtil'

describe('errorUtil', () => {
  describe('handlerError', () => {
    it('에러 로그를 남긴다', () => {
      try {
        throw new Error('에러')
      } catch (error) {
        errorUtil.handleError(error)
      }
    })
  })
})
