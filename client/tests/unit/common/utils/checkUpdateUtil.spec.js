import { assert } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import sinon from 'sinon'
import flushPromises from 'flush-promises'
import CONST from '@/common/constants/framework/framework'
import localStorageUtil from '@frameworks/localStorageUtil'
import checkUpdateUtil from '@/common/utils/checkUpdateUtil'

describe('checkUpdates', () => {
  let mock
  const lastModified = '12345678'
  const sandbox = sinon.createSandbox()

  before(() => {
    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.onHead('/index.html').reply(200, {}, { 'last-modified': lastModified })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('init', () => {
    checkUpdateUtil.saveLatest()
    assert.isTrue(true)
  })

  it('execute::clearCount', () => {
    checkUpdateUtil.clearCount()
    assert.equal(checkUpdateUtil.getCount(), 0)
  })

  it('execute::setCount', () => {
    checkUpdateUtil.setCount()
    const count = checkUpdateUtil.getCount()
    assert.equal(count, 1)
  })

  it('execute::clearTime', () => {
    checkUpdateUtil.clearTime()
    const time = checkUpdateUtil.getLastRequestTime()
    assert.notEqual(time, undefined)
  })

  it('execute::getCurrentCompareTime', () => {
    const compareTime = checkUpdateUtil.getCurrentCompareTime()
    assert.notEqual(compareTime, undefined)
  })

  it('execute::not reload ', () => {
    mock.onHead('/index.html').reply(200, {}, { 'last-modified': lastModified })
    checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.NONE)
    checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.TIME)
    checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.COUNT)
    assert.isTrue(true)
  })

  it('execute::reload', async () => {
    const { location } = window
    delete window.location
    window.location = { reload: sandbox.stub() }

    localStorageUtil.set(CONST.UPDATE_CHECK_SEPARATOR, lastModified)
    mock.onHead('/index.html').reply(200, {}, { 'last-modified': '12345679' })
    checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.NONE)
    checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.TIME)
    checkUpdateUtil.check(CONST.UPDATE.CHECK_TYPE.COUNT)
    assert.isTrue(true)

    await flushPromises()

    window.location = location
  })
})
