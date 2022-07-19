// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'
// import flushPromises from 'flush-promises'
// import CONST from '@constants/framework/framework'
// import customerInputMixin from '@/mixins/customer/customerInputMixin'
// import { assert } from 'chai'

describe('customerInputMixin', function () {
  // let mock

  // before(() => {
  //   // mock axios
  //   axios.defaults.timeout = 100000
  //   mock = new MockAdapter(axios)
  // })

  // 간편로그인 정보 처리
  // describe('간편 로그인 callback 처리', function () {
  //   beforeEach(() => {
  //     mock.reset()
  //   })

  //   it('페이코 callback 처리', async () => {
  //     const url = `${CONST.API_URL}/NsMobileMemberSignupCmd`
  //     const mockResponseResult = {
  //       msg: {
  //         result: {
  //           linkYN: 'Y',
  //           nsLogonId: 'nstest01@nsmall.com',
  //           dupYN: 'N'
  //         },
  //         resultCode: '00'
  //       }
  //     }

  //     mock
  //       .onPost(url)
  //       .reply(200, mockResponseResult)

  //     try {
  //       const callbackData = {
  //         root: {
  //           refresh_token: '2ojVorqC1OCjisoGyLaVXJ69ekrLTjMss2g3hdzCJnZ1PILoKd',
  //           email: 'nstest01@nsmall.com',
  //           name: '나선영',
  //           paycoId: ''
  //         }
  //       }

  //       const returnVal = await customerInputMixin.snsLoginCallback(callbackData)

  //       await flushPromises()
  //       assert.equal(false, returnVal)
  //     } catch (error) {
  //       assert.fail(error.message)
  //     }
  //   })
  // })
})
