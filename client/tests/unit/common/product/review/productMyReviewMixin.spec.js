import Vue from 'vue'
import { assert } from 'chai'

import productMyReviewMixin from '@/mixins/product/review/productMyReviewMixin'

describe('마이페이지 > 상품평 관리 Mixin', () => {
  const catGb = ['10', '20', '30', '40', '']
  const cateName = {
    c10: ['배송', '가격', '맛', '신선도'],
    c20: ['배송', '가격', '품질', '섭취편의'],
    c30: ['배송', '가격', '소재', '디자인', '사이즈', '색상'],
    c40: ['배송', '가격', '견고함', '디자인'],
    c: ['배송', '가격', '품질', '디자인']
  }
  const wrapper = new Vue({
    mixins: [productMyReviewMixin],
    template: '<div />'
  }).$mount()

  it('getCategoriesInfo', () => {
    for (let i = 0; i < catGb.length; i++) {
      const result = wrapper.getCategoriesInfo(catGb[i])

      for (let j = 0; j < result.length; j++) {
        assert.equal(result[j].name, cateName[`c${catGb[i]}`][j])
      }
    }
  })

  it('getScoreCateList', () => {
    const scoreParam = {
      score1: 1,
      score2: 3,
      score3: 5,
      score4: 1
    }

    for (let i = 0; i < catGb.length; i++) {
      if (catGb[i] === '30') {
        scoreParam.score5 = '작다'
        scoreParam.score6 = '밝다'
      }

      const scoreCateList = wrapper.getScoreCateList(catGb[i], scoreParam)

      for (let j = 0; j < scoreCateList.length; j++) {
        assert.equal(scoreCateList[j].name, cateName[`c${catGb[i]}`][j])
      }
    }
  })
})
