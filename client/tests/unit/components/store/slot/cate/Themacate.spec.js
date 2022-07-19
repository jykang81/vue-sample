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

// import ThemacateDummy from '@unit/components/store/slot/mock/ThemacateDummy'
// import Themacate from '@/components/store/slot/cate/Themacate'

// describe('Themacate 테스트', () => {
//   let dummy
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
//         subCategoryId: 'N',
//         themacateSeq: 1,
//         listPageIdx: 1,
//         clickThemaSeq: {},
//         clickThemaCategoryNm: {}
//       },
//       espotData: {
//         '': [{
//           catalogId: '',
//           categoryId: '',
//           categoryLevel: '',
//           categoryName: '',
//           espotId: '',
//           imgUrl: '',
//           seq: 1
//         }]
//       },
//       espotExtendData: {
//         '': {
//           css: {
//             columnStyle: ''
//           }
//         }
//       },
//       totalOrgan: {
//       }
//     }
//   }

//   before(() => {
//     axios.defaults.timeout = 100000
//     dummy = mount(ThemacateDummy, options)
//     wrapper = dummy.find(Themacate)
//   })

//   it('computed - getId', () => {
//     assert.isEmpty(wrapper.vm.getId)
//   })
//   it('espotDraw', () => {
//     wrapper.vm.espotDraw()

//     wrapper.vm.espotExtendData[''].css.columnStyle = 'GRID2W'
//     wrapper.vm.espotDraw()

//     wrapper.vm.espotExtendData[''].css = null
//     wrapper.vm.espotDraw()

//     assert.isTrue(true)
//   })
//   it('onCollapseCategory', () => {
//     const event = { srcElement: { parentElement: { classList: { toggle: a => {} } } } }
//     wrapper.vm.onCollapseCategory(event)
//     assert.isTrue(true)
//   })
//   it('clickClassActive', () => {
//     wrapper.vm.clickClassActive(0)
//     assert.isTrue(true)
//   })
//   it('updateActiveSubcategory', () => {
//     wrapper.vm.updateActiveSubcategory(0)

//     wrapper.vm.slotGlobalVal.clickThemaCategoryNm[''] = 'TEST'
//     wrapper.vm.updateActiveSubcategory(0)
//     assert.isTrue(true)
//   })
//   it('replaceSlot', () => {
//     wrapper.vm.replaceSlot(0)
//     assert.isTrue(true)
//   })
//   it('categoryClose', () => {
//     wrapper.vm.categoryClose()
//     assert.isTrue(true)
//   })
// })
