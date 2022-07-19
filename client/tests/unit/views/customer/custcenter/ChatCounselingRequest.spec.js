// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'
// import { assert } from 'chai'
// import { ORDER_CONST } from '@constants/order/order'
// import { shallowMount, createLocalVue } from '@vue/test-utils'
// import CONST from '@constants/framework/framework'
// import nsaxios from '@frameworks/axiosUtil'
// import CUST_CENTER_CONST from '@constants/custcenter/custcenter'

// import ChatCounselingRequest from '@/views/custcenter/ChatCounselingRequest'

// const localVue = createLocalVue()
// localVue.use(VueRouter)

// // 필수 테스트 할 대상 파일명을 넣음
// describe('ChatCounselingRequest 테스트', () => {
//   let wrapper
//   let vm
//   let mock

//   before(() => {
//     Vue.prototype.$nsaxios = nsaxios

//     // mock axios
//     mock = new MockAdapter(axios)

//     // 채팅상담 분류 목록 조회
//     mock.onPost(`${CONST.API_URL}/FooterInquirySelectMobileReal`).reply(200,
//       {
//         msg: {
//           root: [{
//             bigGroup: Object.values(CUST_CENTER_CONST.CHAT_CONSULT.L_CD).map(lcd => ({ id: lcd })),
//             mediumGroup: Object.values(CUST_CENTER_CONST.CHAT_CONSULT.M_CD).map(mcd => ({ id: mcd }))
//           }]
//         }
//       }
//     )

//     // 주문 목록 조회
//     mock.onPost(`${CONST.API_URL}/NSMypageCmd`).reply(200,
//       {
//         msg: {
//           root: {
//             orders: [{
//               cats: [{
//                 brandName: '테스트 브랜드',
//                 catentryName: '테스트 상품',
//                 status: 'D',
//                 attrs: [],
//                 quantity: 1,
//                 goodsCd: '12345',
//                 statusName: '결제대기',
//                 orderSeq: 1,
//                 ordersId: '123456'
//               }],
//               ordersId: '123456',
//               timeplaced: '2020-06-04'
//             }]
//           }
//         }
//       }
//     )

//     wrapper = shallowMount(ChatCounselingRequest, {
//       localVue,
//       router: new VueRouter({
//         routes: []
//       })
//     })
//     vm = wrapper.vm
//   })

//   describe('showBigGroup', () => {
//     it('선택 상품이 있을 때 대분류 노출', () => {
//       vm.selectedProduct = {
//         ordersId: '12345'
//       }
//       assert.isTrue(Boolean(vm.showBigGroup))
//     })
//     it('상품선택 안함 체크했을 때 대분류 노출', () => {
//       vm.selectedProduct = null
//       vm.isWithoutProduct = true
//       assert.isTrue(Boolean(vm.showBigGroup))
//     })
//     it('선택 상품이 없고 "상품선택 안함" 미체크일 때는 미노출', () => {
//       vm.selectedProduct = null
//       vm.isWithoutProduct = false
//       assert.isFalse(Boolean(vm.showBigGroup))
//     })
//   })

//   describe('validBigGroup', () => {
//     it('선택 상품이 없을때의 대분류 항목', () => {
//       vm.selectedProduct = null
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.EVENT
//       ]
//       const expected = vm.validBigGroup.map(item => item.id) // id값만 비교

//       assert.deepEqual(actual, expected)
//     })
//     it('선택 상품이 있고 배송중일때의 대분류 항목', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         status: ORDER_CONST.STATUS.SHIPPING
//       }
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.ORDER,
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.DELIVERY,
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.RETURN,
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.EXCHANGE,
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.EVENT
//       ]
//       const expected = vm.validBigGroup.map(item => item.id) // id값만 비교
//       assert.deepEqual(actual, expected)
//     })
//     it('선택 상품이 있고 상품 준비중일때의 대분류 항목', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         status: ORDER_CONST.STATUS.PRODUCT_PREPARE
//       }
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.ORDER,
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.DELIVERY,
//         CUST_CENTER_CONST.CHAT_CONSULT.L_CD.EVENT
//       ]
//       const expected = vm.validBigGroup.map(item => item.id) // id값만 비교
//       assert.deepEqual(actual, expected)
//     })
//   })

//   describe('validMediumGroup', () => {
//     it('선택 상품이 없을때의 중분류 항목', () => {
//       vm.selectedProduct = null
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EVENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.SERVICE
//       ]
//       const expected = vm.validMediumGroup.map(item => item.id) // id값만 비교

//       assert.deepEqual(actual, expected)
//     })
//     it('선택 상품이 있고 결제대기일 때의 중분류 항목', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         status: ORDER_CONST.STATUS.PAYMENT_WAIT
//       }
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.UPDATE,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.PAYMENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.CANCEL,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.COLLECT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EVENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.SERVICE
//       ]
//       const expected = vm.validMediumGroup.map(item => item.id) // id값만 비교
//       assert.deepEqual(actual, expected)
//     })
//     it('선택 상품이 있고 결제완료일 때의 중분류 항목', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         status: ORDER_CONST.STATUS.PAYMENT_COMPLETE
//       }
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.UPDATE,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.PAYMENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.CANCEL,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.DELIVERY,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.COLLECT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EVENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.SERVICE
//       ]
//       const expected = vm.validMediumGroup.map(item => item.id) // id값만 비교
//       assert.deepEqual(actual, expected)
//     })
//     it('선택 상품이 있고 상품준비중일 때의 중분류 항목', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         status: ORDER_CONST.STATUS.PRODUCT_PREPARE
//       }
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.UPDATE,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.PAYMENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.DELIVERY,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.COLLECT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EVENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.SERVICE
//       ]
//       const expected = vm.validMediumGroup.map(item => item.id) // id값만 비교
//       assert.deepEqual(actual, expected)
//     })
//     it('선택 상품이 있고 배송중일 때의 중분류 항목', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         status: ORDER_CONST.STATUS.SHIPPING
//       }
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.UPDATE,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.PAYMENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.COLLECT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.RETURN,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EXCHANGE,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EVENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.SERVICE
//       ]
//       const expected = vm.validMediumGroup.map(item => item.id) // id값만 비교
//       assert.deepEqual(actual, expected)
//     })
//     it('선택 상품이 있고 배송완료일 때의 중분류 항목', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         status: ORDER_CONST.STATUS.DELIVERY_COMPLETE
//       }
//       const actual = [
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.UPDATE,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.PAYMENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.DELIVERY,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.COLLECT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.RETURN,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EXCHANGE,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.EVENT,
//         CUST_CENTER_CONST.CHAT_CONSULT.M_CD.SERVICE
//       ]
//       const expected = vm.validMediumGroup.map(item => item.id) // id값만 비교
//       assert.deepEqual(actual, expected)
//     })
//   })

//   describe('changeBigGroup', () => {
//     it('채팅상담 대분류 변경', () => {
//       vm.changeBigGroup()
//     })
//   })

//   describe('selectProduct', () => {
//     it('상담할 상품 선택', () => {
//       const selectedProduct = {
//         ordersId: '12345',
//         catentryName: '',
//         imageUrl: '',
//         orderSeq: ''
//       }
//       vm.selectProduct(selectedProduct)

//       assert.deepEqual(selectedProduct, vm.selectedProduct)
//     })
//   })

//   describe('deleteProduct', () => {
//     it('선택된 상품 삭제', () => {
//       vm.selectedProduct = {}
//       vm.selectedBigGroup = 'test'
//       vm.selectedMediumGroup = 'test'

//       vm.deleteProduct()

//       assert.equal(null, vm.selectedProduct)
//       assert.equal('', vm.selectedBigGroup)
//       assert.equal('', vm.selectedMediumGroup)
//     })
//   })

//   describe('openConsultation', () => {
//     it('채팅상담 팝업 열기', () => {
//       vm.selectedProduct = {
//         ordersId: '12345',
//         catentryName: '',
//         imageUrl: '',
//         orderSeq: ''
//       }

//       vm.openConsultation()
//     })
//   })
// })
