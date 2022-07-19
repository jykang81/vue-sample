import store from '@/vuex'
import animationPopupUtil from '@frameworks/animationPopupUtil'

describe('animationPopup', () => {
  describe('hide', () => {
    it('애니메이션 팝업 객체가 없으면 mutation 즉시 종료된다', () => {
      store.commit('animationPopup/hide')
    })

    it('지정 스타일 및 딜레이 옵션이 없으면 기본 스타일과 딜레이를 적용해서 팝업을 닫는다', () => {
      const options = {
        componentPath: 'store/IntroPopup'
      }

      animationPopupUtil.openAnimationPopup(options)

      store.commit('animationPopup/hide')
    })

    it('딜레이 옵션이 있으면 기본 스타일에 딜레이를 오버라이드 하여 팝업을 닫는다', () => {
      const options = {
        componentPath: 'store/IntroPopup',
        delay: 1
      }

      animationPopupUtil.openAnimationPopup(options)

      store.commit('animationPopup/hide')
    })

    it('지정 스타일이 있으면 해당 스타일을 적용하여 팝업을 닫는다', () => {
      // 지정
      const options = {
        componentPath: 'store/IntroPopup',
        enterAnimationStyle: {
          transition: 'all 1s',
          animation: 'fadeIn 1s forwards',
          animationName: 'slidein'
        },
        leaveAnimationStyle: {
          transition: 'all 1s',
          animation: 'fadeIn 1s forwards',
          animationName: 'slideOut'
        }
      }

      animationPopupUtil.openAnimationPopup(options) // animation popup 열기

      store.commit('animationPopup/hide')
    })
  })
})
