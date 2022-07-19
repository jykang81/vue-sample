// import Vue from 'vue'
// import Vuex from 'vuex'
// import VueRouter from 'vue-router'
// import router from '@/router'

// import axios from 'axios'
// import { assert } from 'chai'
// import { mount, createLocalVue } from '@vue/test-utils'
// import store from '@/vuex'
// import nsaxios from '@frameworks/axiosUtil'
// import VueAwesomeSwiper from 'vue-awesome-swiper'

// import CntntPrdList from '@/components/store/slot/cntnt/CntntPrdList'

// describe('CntntPrdList 테스트', () => {
//   let wrapper

//   const localVue = createLocalVue()
//   Vue.prototype.$nsaxios = nsaxios
//   localVue.use(Vuex)
//   localVue.use(VueAwesomeSwiper)
//   localVue.use(VueRouter)

//   const options = {
//     localVue,
//     router,
//     store,
//     attachToDocument: true,
//     propsData: {
//       espotName: 'TEST',
//       slotGlobalVal: {
//         cateName: ''
//       },
//       espotData: {
//         '': [{
//           catentryId: '',
//           buschnId: '',
//           dispTypeCd: '',
//           partnumber: '',
//           itncatentrynm: '',
//           adultItemFlag: 'N',
//           dcRate: '5',
//           dcPrice: '800',
//           price: '1000',
//           espotImgUrl: '',
//           marketingText: ''
//         }]
//       },
//       espotExtendData: {
//         '': {
//           titleContent: {
//             mainTitle: '',
//             marketingText: ''
//           },
//           css: {
//             prdAddBtn: ''
//           }
//         }
//       },
//       totalOrgan: {
//       }
//     }
//   }

//   before(() => {
//     axios.defaults.timeout = 100000
//     wrapper = mount(CntntPrdList, options)
//   })

//   // it('computed - bizUtil', () => {
//   //   assert.isNotNull(wrapper.vm.bizUtil)
//   // })
//   // it('computed - getId', () => {
//   //   assert.isEmpty(wrapper.vm.getId)
//   // })
//   // it('espotDraw', () => {
//   //   wrapper.vm.espotDraw()
//   //   assert.isTrue(true)
//   // })
// })
