// import sinon from 'sinon'
// import { iframePostMessage } from '@utils/commonutil/commonUtil'

// describe('iframePostMessage', () => {
//   const sandbox = sinon.createSandbox()

//   afterEach(() => {
//     sandbox.restore()
//   })

//   it('iframe 에서 parent 로 data 를 전달한다.', () => {
//     // mock parent 객체
//     const mockParent = {
//       postMessage (obj, str) {}
//     }

//     // window.parent 프로퍼티 mock parent 객체로 대체
//     sandbox.replaceGetter(global.window, 'parent', function () {
//       return mockParent
//     })

//     iframePostMessage('hello', '')
//   })
// })
