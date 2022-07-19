<template>
  <div>
    <div>
      <button @click="showModal">
        Single 모달 팝업 띄우기
      </button>
      <br>
      <b>Parameter Object:</b> {{ singleLayerParam }}
      <br>
      <b>callback Data:</b> 약관 동의 여부 : {{ singleLayerCallback.isAgreeTerms }}
      <br>
    </div>
    <br>
    <div>
      <button @click="showMultiModal">
        Multi 모달 팝업 띄우기
      </button>
      <br>
      <b>Parameter Object:</b> {{ multiLayerParam }}
      <br>
      <b>callback Data:</b> 회원 가입 정보 : {{ multiLayerCallback }}
      <br>
    </div>
    <br>
    <div>
      <button @click="showChainModal">
        연쇄 자동 모달 팝업 띄우기
      </button>
    </div>
    <br>
    <div>
      <button @click="showFullLayer">
        풀 레이어 팝업 띄우기
      </button>
      {{ callbackAddress }}
    </div>
    <br>
    <div>
      <button @click="showFullLayerAuth">
        풀 레이어 팝업 띄우기(본인인증)
      </button>
      <br>
      {{ callbackAuth }}
    </div>
    <br>
    <div>
      <button @click="showFullLayerAuth2">
        풀 레이어 팝업 띄우기(성인인증)
      </button>
      <br>
      {{ callbackAuth2 }}
    </div>
    <br>
    <div>
      <button @click="showToast">
        토스트 메시지 띄우기
      </button>
    </div>
    <br>
    <div>
      <button @click="alert">
        alert
      </button>
    </div>
    <br>
    <div>
      <button @click="alertCustom">
        alert (커스텀 문구 적용)
      </button>
    </div>
    <br>
    <div>
      <button @click="confirm">
        confirm
      </button>
    </div>
    <br>
    <div>
      <button @click="error">
        error
      </button>
    </div>
    <div>
      <button @click="openEventPopup">
        이벤트 팝업 열기
      </button>
    </div>
    <div>
      <button @click="openAnimationPopup">
        애니메이션 팝업
      </button>
      <br>
    </div>
    <div>
      <button @click="openAppInducer">
        앱 유도 팝업
      </button>
      <br>
    </div>
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'
import modalUtil from '@frameworks/modalUtil'
import popupUtil from '@frameworks/popupUtil'
import toastUtil from '@frameworks/toastUtil'
import bizUtil from '@utils/bizUtil'
import COMM_CONST from '@constants/framework/constants'
import localStorageUtil from '@frameworks/localStorageUtil'
import {
  getBdDay,
  getNowDate
} from '@frameworks/dateutil/dateUtil'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import animationPopupUtil from '@frameworks/animationPopupUtil'

export default {
  data () {
    return {
      singleLayerParam: {
        title: '이용약관'
      },
      singleLayerCallback: {
        isAgreeTerms: false
      },
      multiLayerParam: {
        title: '주소찾기',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false
      },
      authLayerParam: {
        title: '본인인증',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false
      },
      multiLayerCallback: {
        name: '',
        address: ''
      },
      callbackAddress: '',
      callbackAuth: '',
      callbackAuth2: '',
      unsubscribeToAnimationPopupHide: null
    }
  },
  mounted () {
    this.unsubscribeToAnimationPopupHide = this.subscribeToAnimationPopupHide() // 애니메이션 팝업 닫힘 구독

    const hasBannerBeenDown = sessionStorage.getItem(COMM_CONST.SESSION_STORAGE_KEY.ATTRACT_APP_DOWN_BANNER) === 'Y'

    if (!hasBannerBeenDown) {
      this.openAppInducer()
    }
  },
  beforeDestroy () {
    this.unsubscribeToAnimationPopupHide() // 애니메이션 팝업 닫힘 구독 취소
  },
  methods: {
    showModal () {
      modalUtil.show('customer/MemberAgree', this.singleLayerParam, this.showModalCallback)
    },
    showMultiModal () {
      modalUtil.show('test/MultiModal1', this.multiLayerParam, this.showMultiModalCallback)
    },
    showChainModal () {
      modalUtil.show('test/ChainModal1', this.multiLayerParam, () => {})
    },
    showFullLayer () {
      popupUtil.show('common/SearchAddress', this.multiLayerParam, this.showFullLayerCallback)
    },
    showFullLayerAuth () {
      bizUtil.openCert(false, this.showFullLayerAuthCallback)
    },
    showFullLayerAuth2 () {
      bizUtil.openCert(true, this.showFullLayerAuthCallback)
    },
    showToast () {
      toastUtil.show('장바구니에 추가됐습니다')
    },
    alert () {
      messageUtil.alert('입력하신 회원가입 정보가 모두 삭제됩니다.', this.okCallback)
    },
    alertCustom () {
      messageUtil.alert('custom 타이틀\n입력하신 회원가입 정보가 모두 삭제됩니다.', this.okCallback, 'custom 버튼 문구')
    },
    confirm () {
      messageUtil.confirm('가입을 취소 하시겠습니까?', this.okCallback, this.cancelCallback)
    },
    error () {
      messageUtil.error('오류가 발생했습니다.', this.okCallback)
    },
    showModalCallback (callbackData) {
      if (callbackData) {
        messageUtil.alert('약관 동의가 완료됐습니다.')
        this.singleLayerCallback.isAgreeTerms = callbackData.isAgreeTerms
      }
    },
    showMultiModalCallback (callbackData) {
      if (callbackData) {
        messageUtil.alert('회원 가입이 완료됐습니다.')
        this.multiLayerCallback.name = callbackData.name
        this.multiLayerCallback.address = callbackData.address
      }
    },
    showFullLayerCallback (callbackData) {
      if (callbackData) {
        this.callbackAddress = callbackData
      } else {
        messageUtil.alert('뒤로가기 발생')
      }
    },
    showFullLayerAuthCallback (callbackData) {
      this.callbackAuth = callbackData
      if (!isNull(this.callbackAuth.paramsType) && this.callbackAuth.paramsType === 'link') {
        this.$router.push(this.callbackAuth.linkParam)
      }
    },
    showFullLayerAuthCallback2 (callbackData) {
      this.callbackAuth2 = callbackData
    },
    okCallback () {
      console.log('확인 콜백 실행')
    },
    cancelCallback () {
      console.log('취소 콜백 실행')
    },
    openEventPopup () {
      const endDate = localStorageUtil.get(COMM_CONST.STORAGE_KEY.EVENT_POPUP_DETAIL)
      if (endDate === null || !getBdDay(endDate)) {
        const params = {
          type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_DETAIL,
          okCallback () {
            const endDate = `${getNowDate()}235959`
            localStorageUtil.set(params.type, endDate)
            toastUtil.show('하루동안 이벤트 팝업이 표시되지 않습니다.')
          },
          cancelCallback () {
            toastUtil.show('메인 페이지에서 팝업이 표시되지 않습니다.')
          },
          partNumber: 26030598, // 테스트용 상품번호
          vendorId: 105964 // 테스트용 업체번호
        }

        popupUtil.openEventPopup(params)
      } else {
        toastUtil.show('하루동안 이벤트 팝업을 표시하지 않는 상태입니다')
      }
    },
    async openAnimationPopup () {
      try {
        // 메인 팝업 정보
        // const response = await this.$nsaxios.post('NSEspotCommon', { espotInfo: 'POPUP_MOBILE_HOME|Text' })

        // NSEspotCommon API 응답값
        const mockResponse = {
          msg: {
            root: {
              _POPUP_MOBILE_HOME: [{
                clickCode: '26030598',
                clickTarget: 'Product',
                contentMimeType: 'image',
                contentsId: '2115652',
                espotId: '1007953',
                espotTitle: '',
                espotTitleImgPath: '',
                espotTitleMimeType: '',
                espotTitleText: '',
                espotType: 'MarketingContent',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/Popup/mobile/main/202005/52944402585830941.jpg',
                marketingText: 'ㅇㅇㅇㅇㅇ',
                mdUrl: 'ProductDisplay?productId=26030598&amp;catalogId=14051&amp;storeId=13001'
              }]
            }
          }
        }

        const popupInfo = mockResponse.msg.root._POPUP_MOBILE_HOME[0]
        popupInfo.partNumber = popupInfo.clickCode // 상품번호 명시

        const options = {
          componentPath: 'store/IntroPopup',
          delay: 1,
          param: popupInfo
          // enterAnimationStyle: {
          //   transition: 'all 1s',
          //   animation: 'fadeIn 1s forwards',
          //   animationName: 'slidein'
          // },
          // leaveAnimationStyle: {
          //   transition: 'all 1s',
          //   animation: 'fadeIn 1s forwards',
          //   animationName: 'slideOut'
          // }
        }

        animationPopupUtil.openAnimationPopup(options)
      } catch {}
    },
    subscribeToAnimationPopupHide () {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'animationPopup/hide') {
          this.callbackForAnimationPopupHide()
        }
      })
    },
    callbackForAnimationPopupHide () {
      messageUtil.alert('애니메이션 팝업이 닫혔습니다')
    },
    openAppInducer () {
      modalUtil.show('common/AppInducer', null, this.openAnimationPopup)
    }
  }
}
</script>
