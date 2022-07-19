const productReviewMixin = {
  data () {
    return {
      categories: {
        delivery: {
          name: '배송',
          question: '배송은 빨랐나요?',
          answerList: ['빨라요', '보통이에요', '느려요']
        },

        price: {
          name: '가격',
          question: '가격은 어떤가요?',
          answerList: ['싸게 샀어요', '적당해요', '비싼 편이에요']
        },

        taste: {
          name: '맛',
          question: '맛은 어땠나요?',
          answerList: ['정말 맛있어요', '보통이에요', '생각보다 별로예요']
        },

        fresh: {
          name: '신선도',
          question: '상품은 신선한가요?',
          answerList: ['신선해요', '보통이에요', '생각보다 별로예요']
        },

        quality: {
          name: '품질',
          question: '품질은 어떤가요?',
          answerList: ['정말 좋아요', '보통이에요', '생각보다 별로예요']
        },

        ingest: {
          name: '섭취편의',
          question: '섭취하시기 편한가요?',
          answerList: ['먹기 편해요', '보통이에요', '먹기 불편해요']
        },

        strong: {
          name: '견고함',
          question: '상품은 견고한가요?',
          answerList: ['생각보다 견고해요', '보통이에요', '생각보다 부실해요']
        },

        design: {
          name: '디자인',
          question: '디자인은 어떤가요?',
          answerList: ['아주 맘에 들어요', '보통이에요', '생각보다 별로예요']
        },

        material: {
          name: '소재',
          question: '소재는 어떤가요?',
          answerList: ['정말 좋아요', '보통이에요', '생각보다 별로예요']
        },

        size: {
          name: '사이즈',
          question: '사이즈는 맞으세요?',
          answerList: ['정사이즈예요', '예상보다 커요', '예상보다 작아요']
        },

        color: {
          name: '색상',
          question: '실제 색상은 어떤가요?',
          answerList: ['화면과 비슷해요', '화면보다 밝아요', '화면보다 어두워요']
        }
      }
    }
  },
  methods: {
    /**
     * 상품 분류에 따라 하위 카테고리 리턴
     * @param {string} catGb
     * @returns {array} 카테고리 배열
     */
    getCategoriesInfo (catGb) {
      let categoriesInfo = []

      switch (catGb) {
        case '10':
          categoriesInfo = [
            this.categories.delivery,
            this.categories.price,
            this.categories.taste,
            this.categories.fresh
          ]
          break

        case '20':
          categoriesInfo = [
            this.categories.delivery,
            this.categories.price,
            this.categories.quality,
            this.categories.ingest
          ]
          break

        case '30':
          categoriesInfo = [
            this.categories.delivery,
            this.categories.price,
            this.categories.material,
            this.categories.design,
            this.categories.size,
            this.categories.color
          ]
          break

        case '40':
          categoriesInfo = [
            this.categories.delivery,
            this.categories.price,
            this.categories.strong,
            this.categories.design
          ]
          break

        default:
          categoriesInfo = [
            this.categories.delivery,
            this.categories.price,
            this.categories.quality,
            this.categories.design
          ]
          break
      }

      return categoriesInfo
    },

    /**
     * 리뷰 세부 항복 스코어 계산
     * 10 식품 : 배송, 가격, 맛, 신선도
     * 20 건강식품 : 배송, 가격, 품질, 섭취편의
     * 30 의류/슈즈 : 배송, 가격, 소재, 디자인, 사이즈, 색상
     * 40 의료기기 : 배송, 가격, 견고함, 디자인
     * 39 기타 : 배송, 가격, 품질, 디자인
     * @param {string} catGB
     * @param {object} score
     * @returns {array} score list
     */
    getScoreCateList (catGB, score) {
      const scoreCateList = []

      for (const key in score) {
        if (Object.prototype.hasOwnProperty.call(score, key)) {
          const value = score[key]

          // 사이즈, 색상이 아닌 경우
          if (typeof value === 'number') {
            let valNum

            if (value < 2) {
              valNum = 2
            } else if (value > 3) {
              valNum = 0
            } else {
              valNum = 1
            }

            score[`${key}_result`] = valNum
          }

          // 사이즈, 색상인 경우
          if (key === 'score5') {
            let valStr

            if (value === '작다') {
              valStr = 2
            } else if (value === '크다') {
              valStr = 1
            } else {
              valStr = 0
            }

            score[`${key}_result`] = valStr
          } else if (key === 'score6') {
            let valStr

            if (value === '어둡다') {
              valStr = 2
            } else if (value === '밝다') {
              valStr = 1
            } else {
              valStr = 0
            }

            score[`${key}_result`] = valStr
          }
        }
      }

      switch (catGB) {
        case '10':
          scoreCateList.push({ name: this.categories.delivery.name, value: this.categories.delivery.answerList[score.score1_result] })
          scoreCateList.push({ name: this.categories.price.name, value: this.categories.price.answerList[score.score2_result] })
          scoreCateList.push({ name: this.categories.taste.name, value: this.categories.taste.answerList[score.score3_result] })
          scoreCateList.push({ name: this.categories.fresh.name, value: this.categories.fresh.answerList[score.score4_result] })
          break

        case '20':
          scoreCateList.push({ name: this.categories.delivery.name, value: this.categories.delivery.answerList[score.score1_result] })
          scoreCateList.push({ name: this.categories.price.name, value: this.categories.price.answerList[score.score2_result] })
          scoreCateList.push({ name: this.categories.quality.name, value: this.categories.quality.answerList[score.score3_result] })
          scoreCateList.push({ name: this.categories.ingest.name, value: this.categories.ingest.answerList[score.score4_result] })
          break

        case '30':
          scoreCateList.push({ name: this.categories.delivery.name, value: this.categories.delivery.answerList[score.score1_result] })
          scoreCateList.push({ name: this.categories.price.name, value: this.categories.price.answerList[score.score2_result] })
          scoreCateList.push({ name: this.categories.material.name, value: this.categories.material.answerList[score.score3_result] })
          scoreCateList.push({ name: this.categories.design.name, value: this.categories.design.answerList[score.score4_result] })
          scoreCateList.push({ name: this.categories.size.name, value: this.categories.size.answerList[score.score5_result] })
          scoreCateList.push({ name: this.categories.color.name, value: this.categories.color.answerList[score.score6_result] })
          break

        case '40':
          scoreCateList.push({ name: this.categories.delivery.name, value: this.categories.delivery.answerList[score.score1_result] })
          scoreCateList.push({ name: this.categories.price.name, value: this.categories.price.answerList[score.score2_result] })
          scoreCateList.push({ name: this.categories.strong.name, value: this.categories.strong.answerList[score.score3_result] })
          scoreCateList.push({ name: this.categories.design.name, value: this.categories.design.answerList[score.score4_result] })
          break

        default:
          scoreCateList.push({ name: this.categories.delivery.name, value: this.categories.delivery.answerList[score.score1_result] })
          scoreCateList.push({ name: this.categories.price.name, value: this.categories.price.answerList[score.score2_result] })
          scoreCateList.push({ name: this.categories.quality.name, value: this.categories.quality.answerList[score.score3_result] })
          scoreCateList.push({ name: this.categories.design.name, value: this.categories.design.answerList[score.score4_result] })
          break
      }

      return scoreCateList
    }
  }
}

export default productReviewMixin
