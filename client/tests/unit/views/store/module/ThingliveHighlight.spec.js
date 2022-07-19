import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import ThingliveHighlight from '@/views/store/module/ThingliveHighlight'
import { highlight } from '@unit/views/store/mock/thinglive'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@/common/constants/framework/framework'
import Vue from 'vue'

describe('ThingliveHighlight', () => {
  // $nsaxios 추가
  Vue.prototype.$nsaxios = nsaxios

  // wrapper 생성
  const wrapper = shallowMount(ThingliveHighlight, {
    propsData: {
      responseData: highlight.msg.espotList[0]._EZ_THING_LIVE_HIGHLIGHT
    }
  })
  const vm = wrapper.vm

  // 함수 실행
  vm.setThingliveHighlight()
  for (let i = 0; i < vm.highlight.length; i++) {
    describe(`highlight[${i}]`, () => {
      describe('setThingliveHighlight', () => {
        it('vodPlayCount', () => {
          // vodPlayCount 타입 확인
          assert.equal(typeof vm.highlight[i].vodPlayCount, 'number')
          // vodPlayCount 값이 mock데이터와 동일한지 확인
          assert.equal(vm.highlight[i].vodPlayCount, Number(highlight.msg.espotList[0]._EZ_THING_LIVE_HIGHLIGHT[i].vodPlayCount))
        })

        it('vodLikeCount', () => {
          // vodLikeCount 타입 확인
          assert.equal(typeof vm.highlight[i].vodLikeCount, 'number')
          // vodLikeCount 값이 mock데이터와 동일한지 확인
          assert.equal(vm.highlight[i].vodLikeCount, Number(highlight.msg.espotList[0]._EZ_THING_LIVE_HIGHLIGHT[i].vodLikeCount))
        })

        it('userLikeYn', () => {
          // userLikeYn 타입 확인
          assert.equal(typeof vm.highlight[i].userLikeYn, 'boolean')
          // userLikeYn 값 확인
          if (highlight.msg.espotList[0]._EZ_THING_LIVE_HIGHLIGHT[i].userLikeYn === 'Y') {
            assert.equal(vm.highlight[i].userLikeYn, true)
          } else {
            assert.equal(vm.highlight[i].userLikeYn, false)
          }
        })

        it('poster', () => {
          // poster 타입 확인
          assert.equal(vm.highlight[i].playerOptions.poster, highlight.msg.espotList[0]._EZ_THING_LIVE_HIGHLIGHT[i].imgUrl)
        })

        it('src', () => {
          // src 타입 확인
          const replacedVodPath = highlight.msg.espotList[0]._EZ_THING_LIVE_HIGHLIGHT[i].vodPath.replace('http://', 'https://')
          assert.equal(vm.highlight[i].playerOptions.sources[0].src, replacedVodPath)
        })

        it('etc', () => {
          assert.equal(vm.highlight[i].remainingTime, '') // 비디오 남은 시간
          assert.equal(vm.highlight[i].showVideo, false) // 비디오 영역 보임 여부
          assert.equal(vm.highlight[i].showPlayButton, false) // 재생버튼 보임 여부
          assert.equal(vm.highlight[i].showRemainingTime, false) // 남은시간 보임 여부
          assert.equal(vm.highlight[i].showDataWarning, false) // 데이터 요금 경고 보임 여부
          assert.equal(vm.highlight[i].collapse, false) // 상품 더 보기 토글 추가
          assert.isNotNull(vm.highlight[i].prodList) // 상품 목록 추가
        })
      })

      describe('onClickLikeBtn', () => {
        it('좋아요 클릭', () => {
          // false로 변경
          vm.highlight[i].userLikeYn = false
          // 변경 전 값 저장
          // const beforeCount = vm.highlight[i].vodLikeCount
          // 로그인된 것으로 가정
          const memberInfo = {
            userId: '9999',
            logonId: 'nstest@nsmall.com'
          }
          sessionStorageUtil.set('memberInfo', memberInfo)
          // 함수 실행
          vm.onClickLikeBtn(i)
          // 확인
          // assert.equal(vm.highlight[i].vodLikeCount, beforeCount + 1)
        })

        it('좋아요 해제', () => {
          // true로 변경
          vm.highlight[i].userLikeYn = true
          // 변경 전 값 저장
          // const beforeCount = vm.highlight[i].vodLikeCount
          // 로그인된 것으로 가정
          const memberInfo = {
            userId: '9999',
            logonId: 'nstest@nsmall.com'
          }
          sessionStorageUtil.set('memberInfo', memberInfo)
          // 함수 실행
          vm.onClickLikeBtn(i)
          // 확인
          // assert.equal(vm.highlight[i].vodLikeCount, beforeCount - 1)
        })
      })

      describe('onClickShareBtn', () => {
        it('emit 확인', () => {
          vm.onClickShareBtn('타이틀', '설명', '이미지 경로', 1, 2, '1', '12345678')
          const testParam = {
            title: '타이틀',
            description: '설명',
            imageUrl: '이미지 경로',
            likeCount: 1,
            viewCount: 2,
            shareUrl: `https://${CONST.MOBILE_NSMALL_PATH}/media/thinglive/vod-stream/12345678/1`
          }
          const emitted = wrapper.emitted().onClickShareBtn[0][0]
          assert.equal(emitted.title, testParam.title)
          assert.equal(emitted.description, testParam.description)
          assert.equal(emitted.imageUrl, testParam.imageUrl)
          assert.equal(emitted.likeCount, testParam.likeCount)
          assert.equal(emitted.viewCount, testParam.viewCount)
          assert.equal(emitted.shareUrl, testParam.shareUrl)
        })
      })

      describe('openDataWarning', () => {
        it('showDataWarning 확인', () => {
          vm.openDataWarning(i)
          assert.isTrue(vm.highlight[i].showDataWarning)
        })
        it('showPlayButton 확인', () => {
          vm.openDataWarning(i)
          assert.isFalse(vm.highlight[i].showPlayButton)
        })
        it('showRemainingTime 확인', () => {
          vm.openDataWarning(i)
          assert.isFalse(vm.highlight[i].showRemainingTime)
        })
      })

      describe('closeDataWarning', () => {
        it('showDataWarning 확인', () => {
          vm.closeDataWarning(i)
          assert.isFalse(vm.highlight[i].showDataWarning)
        })
        it('showPlayButton 확인', () => {
          vm.closeDataWarning(i)
          assert.isTrue(vm.highlight[i].showPlayButton)
        })
        it('showRemainingTime 확인', () => {
          vm.closeDataWarning(i)
          assert.isTrue(vm.highlight[i].showRemainingTime)
        })
      })

      describe('onToggleList', () => {
        it('change true to false', () => {
          // true로 변경
          vm.highlight[i].collapse = true
          // 함수 실행
          vm.onToggleList(i)
          // 확인
          assert.equal(vm.highlight[i].collapse, false)
        })

        it('change false to true', async () => {
          // false로 변경
          vm.highlight[i].collapse = false
          // 함수 실행
          await vm.onToggleList(i)
          // 확인
          assert.equal(vm.highlight[i].collapse, true)
        })
      })

      describe('setPlayLog  함수', () => {
        it('함수 호출 확인', () => {
          vm.setPlayLog('1')
        })
      })

      describe('createObserver 함수', () => {
        it('함수 실행', () => {
          document.body.innerHTML = `<div class="thinglive_main">
          <div class="video_area">
          <div v-show="livePlay.vodLiveGoodsNm" id="liveWrap" class="photo_wrap"></div>
          </div>
          </div>
          `
          // 함수 실행
          vm.createObserver()
        })
      })

      describe('buildThresholdList 함수', () => {
        it('함수 실행', () => {
          // 함수 실행
          const result = vm.buildThresholdList()
          assert.equal(result.length, 101)
        })
      })
    })
  }
})
