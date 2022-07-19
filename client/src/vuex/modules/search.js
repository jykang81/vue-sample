export default {
  namespaced: true,
  // state는 component의 data와 유사한 역할을 함.
  state: {
    searchTerm: '',
    promotionText: '',
    filterInfo: {
      filterType: [],
      researchTerm: '',
      currentPage: 1,
      pageSize: 30,
      sortCriteria: 'weight',
      priceStart: '',
      priceEnd: '',
      cate3Name: [],
      brandName: [],
      freeDeliverYn: '',
      interestFreeYn: '',
      saveYn: '',
      lspYn: '',
      priceFilterFlag: false,
      categoryFilterFlag: false,
      setBrandFinishFlag: false,
      benefitFilterFlag: false,
      storeTypeFilterFlag: false,
      hasBenefitLabels: [],
      hasStoreTypeLabels: [],
      checkedFilterElement: [],
      cateRootList: [],
      priceList: [],
      brandSortNmList: [],
      brandSortCntList: [],
      cate3NameView: [],
      listForInputRecheckFromBack: []
    },
    tvTableStatus: false,
    keywordType: '',
    searchProductAdultStat: false
  },

  // setter 개념 - state는 mutation을 통해서만 수정. 여기에 로그를 남기면 됨.
  mutations: {
    setSearchWordInfo (state, infoLoad) {
      state.searchTerm = infoLoad.searchTerm
      state.promotionText = infoLoad.promotionText
    },
    setFilterInfo (state, infoLoad) {
      state.filterInfo = infoLoad
    },
    setTvTableStatus (state, infoLoad) {
      state.tvTableStatus = infoLoad
    },
    setKeywordType (state, infoLoad) {
      state.keywordType = infoLoad
    },
    setSearchProductAdultStat (state, infoLoad) {
      state.searchProductAdultStat = infoLoad
    }
  },

  getters: {
  /**
   *
   * @param {*} state (필수) 상태
   */
    getSearchWordInfo: state => {
      const searchWordInfo = {
        searchTerm: state.searchTerm,
        promotionText: state.promotionText
      }
      return searchWordInfo
    },
    getFilterInfo: state => {
      const filterInfo = state.filterInfo
      return filterInfo
    },
    getTvTableStatus: state => {
      const tvTableStatus = state.tvTableStatus
      return tvTableStatus
    },
    getKeywordType: state => {
      const keywordType = state.keywordType
      return keywordType
    },
    getSearchProductAdultStat: state => {
      const searchProductAdultStat = state.searchProductAdultStat
      return searchProductAdultStat
    }
  }
}
