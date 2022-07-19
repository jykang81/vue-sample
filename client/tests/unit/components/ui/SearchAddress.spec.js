import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import popupUtil from '@frameworks/popupUtil'

import SearchAddress from '@components/common/SearchAddress' // 테스트 할 대상 컴포넌트
import CONST from '@constants/framework/framework'

// 필수 테스트 할 대상 파일명을 넣음
describe('SearchAddress.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null

  beforeEach(function () {
    localVue = createLocalVue()

    options = {
      localVue,
      store,
      router,
      propsData: {
        param: {
          is1Dept: false
        }
      }
    }

    // mock axios
    axios.defaults.timeout = 100000
    const mock = new MockAdapter(axios)
    const mockResponseResult = {
      postList: [
        {
          NADR3S: '1',
          NODE: 'D',
          NADR1S: '서울 구로구 고척로10길 7-2',
          ADDR1D: '서울 구로구 오류동',
          NADRE: '(오류동,LG베스트빌)',
          NADREJN: '(오류동 13-72, LG베스트빌)',
          CNT: '1',
          ADDRKD: '',
          NNMZ: '1153041481250100000700002',
          ADDRKG: '구로구',
          ADDR1D2: '13-72번지 LG베스트빌 1',
          ZIPR: '08268',
          ADDRE: '오류동',
          ZIP6: '08268',
          NNMB: '1153010800100130185005889',
          STDADDRJN: '13-72',
          ADDRKS: '서울',
          IDX: '0'
        },
        {
          NADR3S: '1',
          NADS: null,
          NODE: 'P',
          NADR1S: '서울 구로구 고척로10길 7-2',
          ADDR1D: '서울 구로구 오류동',
          NADRE: '(오류동,LG베스트빌)',
          NADREJN: '(오류동 13-72, LG베스트빌)',
          CNT: '0',
          ADDRKD: '',
          NNMZ: '1153041481250100000700002',
          ADDRKG: '구로구',
          ADDR1D2: '13-72번지 LG베스트빌 1',
          ZIPR: '08268',
          ADDRE: '오류동',
          ZIP6: '08268',
          NNMB: '1153010800100130185005889',
          STDADDRJN: '13-72',
          ADDRKS: '서울',
          NADM: null,
          IDX: '0'
        }
      ]
    }

    const url = `${CONST.API_URL}/NSNewPostSearchCmd`
    /**
     * 어댑터 설정 적용
     */
    mock
      .onPost(url)
      .reply(200, mockResponseResult)
  })

  // 여기서부터는 테스트 할 메소드 디스크립션
  describe('method : void 타입 테스트 코드 커버리지 용', () => {
    // 테스트 결과에 기대 조건 ... 대한 설명
    it('화면에 관련된 함수라 결과는 없다.', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(SearchAddress, options)
      const vm = wrapper.vm

      const addressInfo = {
        NADR1: '서울 구로구 고척로10길',
        ZIP: '08268',
        ZIPS: '607',
        NADR3: '7-2',
        ADR1: '서울 구로구 오류동',
        NNMB: '1153010800100130185005889',
        NNMR: '115304148125',
        RI: '',
        BLD: 'LG베스트빌',
        BUNJI: '13-72',
        BJC: '1153010800',
        otherAddress: '3',
        isSearchDong: false,
        is1Dept: false
      }

      const callback = result => {
        console.log(result)
      }
      popupUtil.show('common/SearchAddress', { title: '주소찾기', is1Dept: false }, callback)

      // vm.테스트대상메소드명
      let testResult = vm.resultAddressStep1(addressInfo)
      // console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      popupUtil.show('common/SearchAddress', { title: '주소찾기', is1Dept: false }, callback)

      testResult = vm.resultAddressStep2()
      // console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)
    })
  })
})
