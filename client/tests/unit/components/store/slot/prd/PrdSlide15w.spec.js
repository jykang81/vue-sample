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

// import PrdSlide15w from '@/components/store/slot/prd/PrdSlide15w'

// describe('PrdSlide15w 테스트', () => {
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
//           promCardMaxRate: '5',
//           promPadYn: 'Y',
//           promPadCd: '',
//           espotImgUrl: '',
//           promPadVal: '1000',
//           dcPrice: '800',
//           dcRate: '5',
//           price: '1000'
//         }]
//       },
//       espotExtendData: {
//         '': {
//           titleContent: {
//             espotId: '',
//             contentsId: '',
//             clickCode: '',
//             mainTitle: '',
//             subTitle: '',
//             clickTarget: '',
//             imgUrl: '',
//             mdUrl: ''
//           }
//         }
//       },
//       totalOrgan: {
//       }
//     }
//   }

//   before(() => {
//     axios.defaults.timeout = 100000
//     wrapper = mount(PrdSlide15w, options)
//   })

//   it('computed - bizUtil', () => {
//     assert.isNotNull(wrapper.vm.bizUtil)
//   })
//   it('computed - getId', () => {
//     assert.isEmpty(wrapper.vm.getId)
//   })
//   it('espotDraw', () => {
//     wrapper.vm.espotDraw()
//     assert.isTrue(true)
//   })
// })
