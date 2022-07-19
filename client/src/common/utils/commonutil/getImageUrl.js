import loginUtil from '@utils/loginUtil'
import CONST from '@constants/framework/framework'
import ADULT_SQUARE from '@/assets/images/common/img_adult_square.png'
import ADULT_WIDE from '@/assets/images/common/img_adult_wide.png'

/**
 * 이미지 URL 생성
 *
 * @param {string} productNumber 상품번호
 * @param {number} width 이미지 넓이
 * @param {number} height 이미지 높이
 * @param {string} [isAdult='N'] 성인상품 여부
 * @param {string} [type='crop|fill'] 이미지 리사이즈 옵션 (https://sharp.pixelplumbing.com/api-resize#resize)
 * @return {string} 이미지 URL
 */
function getImageUrl (productNumber, width, height, isAdult = 'N', type = 'fill') {
  // 성인상품 체크
  if (isAdult === 'Y' && loginUtil.adultAuthYN() !== 'Y') {
    return width === height ? ADULT_SQUARE : ADULT_WIDE
  }

  return `${CONST.NS_IMAGE}/new/${productNumber}_0.jpg?s=${width}x${height}&t=${type}&q=80`
}

export default getImageUrl
