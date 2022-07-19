import { assert } from 'chai'
import store from '@/vuex'

describe('Vuex store layouts 테스트', () => {
  it('하단 탭바 보이기', async () => {
    store.commit('layouts/toggleBottomNavi', true)

    const actual = store.state.layouts.bottomNavi
    const expected = true
    assert.equal(actual, expected)
  })

  it('하단 탭바 숨기기', async () => {
    store.commit('layouts/toggleBottomNavi', false)

    const actual = store.state.layouts.bottomNavi
    const expected = false
    assert.equal(actual, expected)
  })
})
