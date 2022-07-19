import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  mount,
  createLocalVue
} from '@vue/test-utils'
import {
  assert
} from 'chai'
import router from '@/router'
import axios from 'axios'
import nsaxios from '@frameworks/axiosUtil'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import CustCenterBoardInquiry from '@/views/custcenter/CustCenterBoardInquiry'
import {
  QuestionItemListInfo
} from '@unit/views/custcenter/mock/CustCenterResponse'

describe('고객센터 > 1:1 문의 > 내역', () => {
  const localVue = createLocalVue()
  let mock

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(VueRouter)

  const options = {
    localVue,
    router
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios
  })

  beforeEach(() => {
    mock.reset() // reset mock adapter
  })

  it('getQnaList', async () => {
    const wrapper = mount(CustCenterBoardInquiry, options)

    mock
      .onPost(`${CONST.API_URL}/QuestionItemListInfo`)
      .reply(200, QuestionItemListInfo)

    wrapper.vm.getQnaList()
    await flushPromises()

    assert.equal(Array.isArray(wrapper.vm.answerList), true)

    for (let i = 0; i < QuestionItemListInfo.msg.root.questionListInfo.length; i++) {
      const answer = QuestionItemListInfo.msg.root.questionListInfo[i]

      wrapper.vm.moveDetail(answer)
    }
  })
})
