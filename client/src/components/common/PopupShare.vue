<template>
  <div class="popup_share">
    <p class="popup_share_title">
      공유하기
    </p>
    <ul class="popup_share_list">
      <li>
        <a @click="onClickKakaotalk">
          <i class="icons_kakao" />
          카카오톡
        </a>
      </li>
      <li>
        <a @click="onClickFacebook">
          <i class="icons_facebook" />
          페이스북
        </a>
      </li>
      <li>
        <a :href="smsUrl">
          <i class="icons_sms" />
          SMS문자
        </a>
      </li>
    </ul>
    <div class="popup_share_path">
      <a @click="onClickUrlCopy(param.shareUrl)">
        <span class="url"> {{ param.shareUrl }}</span>
        <span class="copy">URL 복사</span>
      </a>
    </div>
    <button
      type="button"
      class="btn_cancel"
      @click="sharePopupClose"
    >
      닫기
    </button>
  </div>
</template>

<script>
import modalUtil from '@frameworks/modalUtil'
import messageUtil from '@frameworks/messageUtil'
import {
  viewType
} from '@utils/commonutil/commonUtil'
import COMMON_CONST from '@/common/constants/common/common'
import Kakao from '@/common/plugins/kakao.min'
import shareMixin from '@/mixins/common/shareMixin'

export default {
  mixins: [
    shareMixin
  ],
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // sms 스키마가 추가된 URL
      smsUrl: '',
      // iOS Version
      iOSVersion: ''
    }
  },
  created () {
    // SMS URL 세팅
    this.setSmsUrl()
    // 카카오 공유하기 세팅
    this.setKakaoLink()
  },
  methods: {
    /**
     * SMS URL 세팅
     * @returns {void}
     */
    setSmsUrl () {
      if (viewType() === 'androidweb') {
        this.smsUrl = `sms:?body=${this.param.shareUrl}`
      } else if (viewType() === 'iosweb') {
        this.smsUrl = `sms:&body=${this.param.shareUrl}`
      }
    },
    /**
     * 카카오 공유하기 세팅
     * @returns {void}
     */
    setKakaoLink () {
      // SDK 초기화
      Kakao.init(COMMON_CONST.KAKAO.APP_KEY.JAVASCRIPT)
      // SDK 초기화 여부를 판단
      console.log(Kakao.isInitialized())
    },
    /**
     * 카카오톡 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickKakaotalk () {
      /**
       * 이미지 크기를 구한 후 카카오톡 공유하기를 실행한다
       * @param {Object} param - 공유할 데이터 파라미터
       * @param {Number} imageWidth - 이미지 너비
       * @param {Number} imageHeight - 이미지 높이
       * @param {String} imageHeight - 이미지 URL
       * @returns {void}
       */
      const callKakaoLinkSend = (param, imageWidth, imageHeight, imageUrl) => {
        // 상품상세
        if (param.type === 'product') {
          Kakao.Link.sendDefault({
            objectType: 'commerce',
            content: {
              title: param.title,
              imageUrl,
              imageWidth,
              imageHeight,
              link: {
                mobileWebUrl: param.shareUrl,
                webUrl: param.shareUrl
              }
            },
            commerce: {
              regularPrice: param.regularPrice,
              discountPrice: param.discountPrice,
              discountRate: param.discountRate
            },
            buttons: [
              {
                title: '구매하기',
                link: {
                  mobileWebUrl: param.shareUrl,
                  webUrl: param.shareUrl
                }
              }
            ]
          })
        // 상품상세(무형상품)
        } else if (param.type === 'intangibleProduct') {
          Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title: param.title,
              description: param.description,
              imageUrl,
              imageWidth,
              imageHeight,
              link: {
                mobileWebUrl: param.shareUrl,
                webUrl: param.shareUrl
              }
            },
            buttons: [
              {
                title: '구매하기',
                link: {
                  mobileWebUrl: param.shareUrl,
                  webUrl: param.shareUrl
                }
              }
            ]
          })
        // 띵라이브
        } else if (param.type === 'thinglive') {
          Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title: param.title,
              description: param.description,
              imageUrl,
              imageWidth,
              imageHeight,
              link: {
                mobileWebUrl: param.shareUrl,
                webUrl: param.shareUrl
              }
            },
            social: {
              likeCount: param.likeCount,
              viewCount: param.viewCount
            },
            buttons: [
              {
                title: '동영상 보러가기',
                link: {
                  mobileWebUrl: param.shareUrl,
                  webUrl: param.shareUrl
                }
              }
            ]
          })
        // 기획전
        } else if (param.type === 'exhibition') {
          Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title: param.title,
              description: param.description,
              imageUrl,
              imageWidth,
              imageHeight,
              link: {
                mobileWebUrl: param.shareUrl,
                webUrl: param.shareUrl
              }
            },
            buttons: [
              {
                title: '웹으로 확인',
                link: {
                  mobileWebUrl: param.shareUrl,
                  webUrl: param.shareUrl
                }
              }
            ]
          })
        }
      }

      // 이미지의 가로, 세로 길이를 받아온다
      this.getImageSize(this.param, callKakaoLinkSend)
    },
    /**
     * 페이스북 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickFacebook () {
      this.facebookShareLink(this.param.shareUrl)
    },
    /**
     * URL 복사 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickUrlCopy (value) {
      // iOS일 경우(iOS 13.4 미만 Safari에서는 clipboard API 지원이 안됨)
      if (viewType() === 'ios' || viewType() === 'iosweb') {
        // 클립보드로 링크 복사
        const textArea = document.createElement('textarea')
        document.body.appendChild(textArea)
        textArea.value = value
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        messageUtil.alert('URL 복사가 완료되었습니다.')
      } else {
        // 클립보드로 링크 복사
        navigator.clipboard.writeText(this.param.shareUrl)
          .then(function () {
            messageUtil.alert('URL 복사가 완료되었습니다.')
          })
      }
      // 공유하기 팝업 닫기
      this.sharePopupClose()
    },
    /**
     * 모달 팝업 닫기
     * @returns {void}
     */
    sharePopupClose () {
      modalUtil.close()
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/PopupShare";
</style>
