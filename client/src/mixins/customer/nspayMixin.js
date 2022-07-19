/**
 * MSPay Mixin
 */
const nspayMixin = {
  data () {
    return {
    }
  },
  methods: {
    /**
     * NSPay 카드사 및 은행 CSS class 및 이름 조회
     *
     * @param {String} method 결제수단(카드. 계좌)
     * @param {String} code 카드사, 은행 코드
     * @param {String} type class, name
     * @returns {String} 카드사, 은행 별 CSS 클래스 명
     */
    getCardandBankInfo (method, code, type) {
      const card = {
        '01': { name: '하나카드', class: 'c6' },
        '03': { name: '롯데카드', class: 'c7' },
        '04': { name: '현대카드', class: 'c4' },
        '06': { name: 'KB국민카드', class: 'c2' },
        11: { name: '비씨카드', class: 'c3' },
        12: { name: '삼성카드', class: 'c5' },
        14: { name: '신한카드', class: 'c1' },
        16: { name: 'NH카드', class: 'c8' },
        17: { name: '하나카드', class: 'c6' }
      }

      const bank = {
        '002': { name: 'KDB산업은행', class: 'b7' },
        '003': { name: 'IBK기업은행', class: 'b6' },
        '004': { name: '국민은행', class: 'b2' },
        '005': { name: 'KEB하나은행', class: 'b5' }, // 외환은행
        '007': { name: '수협은행', class: 'b9' },
        '011': { name: 'NH농협은행', class: 'b1' },
        '020': { name: '우리은행', class: 'b3' },
        '023': { name: 'SC제일은행', class: 'b8' },
        '027': { name: '씨티은행', class: 'b11' },
        '031': { name: 'DGB대구은행', class: 'b15' },
        '032': { name: '부산은행', class: 'b16' },
        '034': { name: '광주은행', class: 'b17' },
        '035': { name: '제주은행', class: 'b12' },
        '037': { name: '전북은행', class: 'b10' },
        '039': { name: '경남은행', class: 'b18' },
        '045': { name: '새마을은행', class: 'b13' },
        '048': { name: '신협', class: 'b14' },
        '071': { name: '우체국', class: 'b19' },
        '088': { name: '신한은행', class: 'b4' },
        '089': { name: '케이뱅크', class: 'b21' },
        999: { name: 'NS페이', class: 'b20' } // 위에 해당되는 카드코드가 없는 경우 보여줌
      }

      if (method === '01') { // 카드
        return type === 'name' ? card[code].name : card[code].class
      } else { // 계좌
        if (Object.prototype.hasOwnProperty.call(bank, code)) {
          return type === 'name' ? bank[code].name : bank[code].class
        } else {
          return type === 'name' ? bank['999'].name : bank['999'].class
        }
      }
    }
  }
}

export default nspayMixin
