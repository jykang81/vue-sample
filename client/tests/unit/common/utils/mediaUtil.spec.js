import { assert } from 'chai'
import mediaUtil from '@utils/mediaUtil'

describe('mediaUtil', () => {
  describe('setDurationTimeForm', () => {
    describe('includeHour가 true일 때', () => {
      it('0초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(0, true), '00:00:00')
      })

      it('1초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(1, true), '00:00:01')
      })

      it('1분', () => {
        assert.equal(mediaUtil.setDurationTimeForm(60, true), '00:01:00')
      })

      it('1분 1초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(61, true), '00:01:01')
      })

      it('1시간', () => {
        assert.equal(mediaUtil.setDurationTimeForm(3600, true), '01:00:00')
      })

      it('1시간 1분 1초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(3661, true), '01:01:01')
      })
    })

    describe('includeHour가 false일 때', () => {
      it('0초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(0, false), '00:00')
      })

      it('1초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(1, false), '00:01')
      })

      it('1분', () => {
        assert.equal(mediaUtil.setDurationTimeForm(60, false), '01:00')
      })

      it('1분 1초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(61, false), '01:01')
      })

      it('1시간', () => {
        assert.equal(mediaUtil.setDurationTimeForm(3600, false), '01:00:00')
      })

      it('1시간 1분 1초', () => {
        assert.equal(mediaUtil.setDurationTimeForm(3661, false), '01:01:01')
      })
    })
  })
})
