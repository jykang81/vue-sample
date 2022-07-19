import CONST from '@constants/framework/framework'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'

/**
 * Share Mixin
 */
const shareMixin = {
  mounted () {
    if (isOsApp()) {
      window.facebookShareLink = this.facebookShareLink
    }
  },
  methods: {
    /**
     * Native에서 페이스북 링크 호출 스크립트
     * @param {String} param - 콜백데이터
     * @returns {void}
     */
    facebookShareLink (param) {
      window.open(`http://www.facebook.com/sharer.php?u=${encodeURIComponent(param)}`)
    },

    /**
     * 이미지 크기를 구한 후 카카오톡 공유하기를 실행한다
     * @param {Object} pageType - 어떤페이지 인지(상품상세, 띵라이브, 기획전)
     * @param {Object} param - 공유할 데이터 파라미터
     * @returns {void}
     */
    kakaoShareNative (pageType, param) {
      // 띵라이브 메인
      const callKakaoLinkSend = (kakaoParam, imageWidth, imageHeight, imageUrl) => {
        let param = {}
        // 상품상세
        if (pageType === 'product') {
          param = {
            type: 'commerce',
            title: kakaoParam.title,
            imageUrl: kakaoParam.imageUrl,
            url: kakaoParam.shareUrl,
            price: {
              regularPrice: kakaoParam.regularPrice,
              discountPrice: kakaoParam.discountPrice,
              discountRate: kakaoParam.discountRate
            },
            facebookCallFunction: 'facebookShareLink'
          }
        // 띵라이브
        } else if (pageType === 'thinglive') {
          param = {
            type: 'feed',
            title: kakaoParam.title,
            description: kakaoParam.description,
            likeCount: kakaoParam.likeCount,
            viewCount: kakaoParam.viewCount,
            imageUrl,
            imageWidth,
            imageHeight,
            url: kakaoParam.shareUrl,
            btnName: '동영상 보러가기',
            facebookCallFunction: 'facebookShareLink'
          }
        // 기획전
        } else if (pageType === 'exhibition') {
          param = {
            type: 'feed',
            title: kakaoParam.title,
            description: kakaoParam.description,
            likeCount: 0,
            viewCount: 0,
            imageUrl,
            imageWidth,
            imageHeight,
            url: kakaoParam.shareUrl,
            btnName: '웹으로 확인',
            facebookCallFunction: 'facebookShareLink'
          }
        }

        nativeUtil.doShareLink(JSON.stringify(param))
      }
      this.getImageSize(param, callKakaoLinkSend)
    },

    /**
     * 이미지의 가로, 세로 길이를 구한다
     * 이미지가 없을 경우 noimage URL로 변경해준다
     * @param {Object} param - 이미지 데이터
     * @param {Function} callback - 이미지 크기를 받아온 후 호출될 callback 함수
     * @returns {void}
     */
    getImageSize (param, callback) {
      // 이미지 엘리먼트 생성
      const image = new Image()
      // 이미지가 로드되면 이미지 크기 체크
      image.onload = function () {
        const imageWidth = image.width
        const imageHeight = image.height
        callback(param, imageWidth, imageHeight, image.src)
      }
      // 이미지 없을 경우 noImage로 대체
      image.onerror = () => {
        const noImageWidth = 375
        const noImageHeight = 188
        const noImageUrl = `https://${CONST.MOBILE_NSMALL_PATH}/images/img_noImage_wide.png`
        callback(param, noImageWidth, noImageHeight, noImageUrl)
      }
      // 이미지 객체에 Source URL 추가
      image.src = param.imageUrl
    }
  }
}

export default shareMixin
