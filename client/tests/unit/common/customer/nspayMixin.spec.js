import { assert } from 'chai'
import { mount } from '@vue/test-utils'
import nspayMixin from '@/mixins/customer/nspayMixin'

describe('nspayMixin', () => {
  let wrapper
  let vm

  before(async () => {
    wrapper = mount(nspayMixin, {})
    vm = wrapper.vm
  })

  describe('getCardandBankInfo', () => {
    it('카드 코드를 이용하여 카드사 CSS 클래스명을 조회한다', () => {
      assert.equal(vm.getCardandBankInfo('01', '01', 'class'), 'c6')
      assert.equal(vm.getCardandBankInfo('01', '03', 'class'), 'c7')
      assert.equal(vm.getCardandBankInfo('01', '04', 'class'), 'c4')
      assert.equal(vm.getCardandBankInfo('01', '06', 'class'), 'c2')
      assert.equal(vm.getCardandBankInfo('01', 11, 'class'), 'c3')
      assert.equal(vm.getCardandBankInfo('01', 12, 'class'), 'c5')
      assert.equal(vm.getCardandBankInfo('01', 14, 'class'), 'c1')
      assert.equal(vm.getCardandBankInfo('01', 16, 'class'), 'c8')
      assert.equal(vm.getCardandBankInfo('01', 17, 'class'), 'c6')
    })

    it('카드 코드를 이용하여 카드사명을 조회한다', () => {
      assert.equal(vm.getCardandBankInfo('01', '01', 'name'), '하나카드')
      assert.equal(vm.getCardandBankInfo('01', '03', 'name'), '롯데카드')
      assert.equal(vm.getCardandBankInfo('01', '04', 'name'), '현대카드')
      assert.equal(vm.getCardandBankInfo('01', '06', 'name'), 'KB국민카드')
      assert.equal(vm.getCardandBankInfo('01', 11, 'name'), '비씨카드')
      assert.equal(vm.getCardandBankInfo('01', 12, 'name'), '삼성카드')
      assert.equal(vm.getCardandBankInfo('01', 14, 'name'), '신한카드')
      assert.equal(vm.getCardandBankInfo('01', 16, 'name'), 'NH카드')
      assert.equal(vm.getCardandBankInfo('01', 17, 'name'), '하나카드')
    })

    it('은행 코드를 이용하여 은행 CSS 클래스명을 조회한다', () => {
      // 등록된 은행 코드가 있을 경우
      assert.equal(vm.getCardandBankInfo('16', '002', 'class'), 'b7')
      assert.equal(vm.getCardandBankInfo('16', '003', 'class'), 'b6')
      assert.equal(vm.getCardandBankInfo('16', '004', 'class'), 'b2')
      assert.equal(vm.getCardandBankInfo('16', '005', 'class'), 'b5') // 외환은행
      assert.equal(vm.getCardandBankInfo('16', '007', 'class'), 'b9')
      assert.equal(vm.getCardandBankInfo('16', '011', 'class'), 'b1')
      assert.equal(vm.getCardandBankInfo('16', '020', 'class'), 'b3')
      assert.equal(vm.getCardandBankInfo('16', '023', 'class'), 'b8')
      assert.equal(vm.getCardandBankInfo('16', '027', 'class'), 'b11')
      assert.equal(vm.getCardandBankInfo('16', '031', 'class'), 'b15')
      assert.equal(vm.getCardandBankInfo('16', '032', 'class'), 'b16')
      assert.equal(vm.getCardandBankInfo('16', '034', 'class'), 'b17')
      assert.equal(vm.getCardandBankInfo('16', '035', 'class'), 'b12')
      assert.equal(vm.getCardandBankInfo('16', '037', 'class'), 'b10')
      assert.equal(vm.getCardandBankInfo('16', '039', 'class'), 'b18')
      assert.equal(vm.getCardandBankInfo('16', '045', 'class'), 'b13')
      assert.equal(vm.getCardandBankInfo('16', '048', 'class'), 'b14')
      assert.equal(vm.getCardandBankInfo('16', '071', 'class'), 'b19')
      assert.equal(vm.getCardandBankInfo('16', '088', 'class'), 'b4')
      assert.equal(vm.getCardandBankInfo('16', '089', 'class'), 'b21')
      assert.equal(vm.getCardandBankInfo('16', 999, 'class'), 'b20')

      // 등록된 은행 코드가 없을 경우
      assert.equal(vm.getCardandBankInfo('16', '099', 'class'), 'b20')
      assert.equal(vm.getCardandBankInfo('16', 999, 'class'), 'b20')
    })

    it('은행 코드를 이용하여 은행명을 조회한다', () => {
      // 등록된 은행 코드가 있을 경우
      assert.equal(vm.getCardandBankInfo('16', '002', 'name'), 'KDB산업은행')
      assert.equal(vm.getCardandBankInfo('16', '003', 'name'), 'IBK기업은행')
      assert.equal(vm.getCardandBankInfo('16', '004', 'name'), '국민은행')
      assert.equal(vm.getCardandBankInfo('16', '005', 'name'), 'KEB하나은행') // 외환은행
      assert.equal(vm.getCardandBankInfo('16', '007', 'name'), '수협은행')
      assert.equal(vm.getCardandBankInfo('16', '011', 'name'), 'NH농협은행')
      assert.equal(vm.getCardandBankInfo('16', '020', 'name'), '우리은행')
      assert.equal(vm.getCardandBankInfo('16', '023', 'name'), 'SC제일은행')
      assert.equal(vm.getCardandBankInfo('16', '027', 'name'), '씨티은행')
      assert.equal(vm.getCardandBankInfo('16', '031', 'name'), 'DGB대구은행')
      assert.equal(vm.getCardandBankInfo('16', '032', 'name'), '부산은행')
      assert.equal(vm.getCardandBankInfo('16', '034', 'name'), '광주은행')
      assert.equal(vm.getCardandBankInfo('16', '035', 'name'), '제주은행')
      assert.equal(vm.getCardandBankInfo('16', '037', 'name'), '전북은행')
      assert.equal(vm.getCardandBankInfo('16', '039', 'name'), '경남은행')
      assert.equal(vm.getCardandBankInfo('16', '045', 'name'), '새마을은행')
      assert.equal(vm.getCardandBankInfo('16', '048', 'name'), '신협')
      assert.equal(vm.getCardandBankInfo('16', '071', 'name'), '우체국')
      assert.equal(vm.getCardandBankInfo('16', '088', 'name'), '신한은행')
      assert.equal(vm.getCardandBankInfo('16', '089', 'name'), '케이뱅크')
      assert.equal(vm.getCardandBankInfo('16', 999, 'name'), 'NS페이')

      // 등록된 은행 코드가 없을 경우
      assert.equal(vm.getCardandBankInfo('16', '099', 'name'), 'NS페이')
      assert.equal(vm.getCardandBankInfo('16', 999, 'name'), 'NS페이')
    })
  })
})
