import animationPopupUtil from '@frameworks/animationPopupUtil'

describe('animationPopupUtil', () => {
  describe('openAnimationPopup', () => {
    it('기본 설정으로 애니메이션 팝업을 호출한다', () => {
      const options = {
        componentPath: 'store/IntroPopup'
      }

      animationPopupUtil.openAnimationPopup(options)
    })

    it('delay 1초 애니메이션 팝업을 호출한다', () => {
      const options = {
        componentPath: 'store/IntroPopup',
        delay: 1
      }

      animationPopupUtil.openAnimationPopup(options)
    })

    it('커스텀 스타일의 애니메이션 팝업을 호출한다', () => {
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

      animationPopupUtil.openAnimationPopup(options)
    })
  })
})
