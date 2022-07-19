<template>
  <div>
    <h1>APP to WEB</h1>
  </div>
</template>

<script>
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  mounted () {
    window.marketingLogSend = this.marketingLogSend
  },
  methods: {
    /**
     * SDK를 지원하지 않는 마케팅 스크립트인 경우 Native에서 WEB을 통해서 로그 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    marketingLogSend: param => {
      const params = JSON.parse(param)
      try {
        switch (params.logger) {
          case marketingUtil.LOGGER.NAVER: // 네이버 프리미엄 로그
            /*
            * 1. 유입 추적
            *  params={"logger":"1","type":"1","data":{"pageId":"prodDetail"}}
            * 2. 전환 추적
            *  params={"logger":"1","type":"2","data":{"strTranSoft":"2","strTranValue":"1","pageId":"signUp"}}
            */
            marketingUtil.naverLogger.send(params)
            break
          case marketingUtil.LOGGER.RECOBELL: // RECOBELL
          case marketingUtil.LOGGER.EIGENE: // EIGENE
            /*
            * 1. 'add_productview'
            *  params={"logger":"2","data":{"category":"add_productview","action":{"catalog":"1358062","name":"종근당 6년근 홍삼정 애니타임 + 고급 쇼핑백","id":"24745657","price":28900,"sale":""},"searchTerm":"","clickUrl":"yunTest1","itemType":"","CTCOMitemYn":"","TVitemYn":"","pageId":"prodDetail"}}
            * 2. 'add_purchase'
            *  params={"logger":"2","data":{"category":"add_purchase","action":[{"orderId":"1122334455","productName":"고무신","productId":"42985725","price":50000,"quantity":1,"discount":"adjustment","del":"shipCharge","attrs":"attributesName"},{"orderId":"1122334455","productName":"[우리우리] 밥하는남자 김하진 총각김치 3kg","productId":"22100219","price":18500,"quantity":1,"discount":"adjustment","del":"shipCharge","attrs":"attributesName"}],"lastPrice":77777,"totalPrice":68500,"orderId":"1122334455","pageId":"orderCompleted"}}
            * 3. 'add_search'
            *  params={"logger":"2","data":{"category":"add_search","action":[{"name":"1395573","id":"25174064","price":268900,"search":"구찌 295419 A0VBR 1060"}],"searchTerm":"구찌 295419 A0VBR 1060","pageId":"prodSearch"}}
            * 4. 'add_login'
            *  params={"logger":"2","data":{"category":"add_login","action":"swchang@einz.co.kr","memberInfo":{"tcode":"","gender":"","userId":110548084,"snsAuthkeyCheck":"N","hpNo":"--","isSSORequest":"false","isAdult":"","custNum":"30124193","gradeNm":"패밀리","userName":"장성우","adultAuthYN":"N","entFlag":"","userMargetingTM":"N","lastOrder":"2020-07-21 14:53:34.669","registration":"2020-01-10 15:49:41.223","email":"swchang@einz.co.kr","telNo":"010-1234-5678","userMargetingEmail":"N","birthday":"","userMarketingSMS":"Y","logonId":"swchang@einz.co.kr","failcount":"0","sessionid":"QqqV0Cn7gtuxT4IVKne2ms6","loginyn":"Y","logonPassword":"qaws1357!","memberGradeCss":"family","staffInfo":false,"staffInfoName":"","staffBnft":"N","loginType":"K","logonType":"nomal"},"pageId":"login"}}
            */
            marketingUtil.recobellLogger.send(params)
            break
          case marketingUtil.LOGGER.DTSI: // DTSI
            /*
            * 1. 'add_purchase'
            *  params={"logger":"3","data":{"category":"add_purchase","action":[{"orderId":"orderId","productId":"productId1","productName":"productName1","price":100,"quantity":1,"discount":10,"del":2500,"attrs":"attrs1"},{"orderId":"orderId","productId":"productId2","productName":"productName2","price":200,"quantity":2,"discount":20,"del":0,"attrs":"attrs2"}],"orderId":"72972","lastPrice":2970,"totalPrice":300,"pageId":"orderCompleted"}}
            * 2. 회원가입 완료
            *  params={"logger":"3","data":{"isSignUp":true,"pageId":"signUp"}}
            */
            marketingUtil.dtsiLogger.send(params)
            break
          case marketingUtil.LOGGER.GA360: // GA 360 - Native에서 전송 처리
            // marketingUtil.ga360Logger.send(params)
            break
          case marketingUtil.LOGGER.AIQUA: // AIQUA - Native에서 전송 처리
            // marketingUtil.aiquaLogger.send(params)
            break
          case marketingUtil.LOGGER.HSMOA: // 홈쇼핑 모아
            /*
            * 1. 'list'
            *  params={"logger":"6","data":{"from_hsmoa":false,"action":["11466759","14740166","24689641","26349642","21193188"],"category":"list","pageId":"prodList"}}
            * 2. 'product'
            *  params={"logger":"6","data":{"co_cd":"110","action":"11466759","category":"product","pageId":"prodDetail"}}
            * 3. 'basket'
            *  params={"logger":"6","data":{"co_cd":"110","action":["11466759"],"category":"basket","pageId":"basket"}}
            * 4. 'purchase'
            *  params={"logger":"6","data":{"co_cd":"110","action":["11466759","14740166","24689641","26349642","21193188"],"category":"purchase","pageId":"orderCompleted"}}
            * 5. 'query'
            *  params={"logger":"6","data":{"co_cd":"110","action":"검색어","category":"query","pageId":"prodSearch"}}
            * 6. 'basketview'
            *  params={"logger":"6","data":{"co_cd":"110","action":["11466759","14740166","24689641","26349642","21193188"],"category":"basketview","pageId":"basketview"}}
            */
            marketingUtil.hsmoaLogger.send(params)
            break
          case marketingUtil.LOGGER.FBPIXEL: // Facebook 픽셀
            /*
            * 1. 'ViewContent'
            *  params={"logger":"7","type":"ViewContent","data":{"value":1000,"currency":"KRW","content_name":"제품명1","content_type":"product","content_ids":"1122334455","pageId":"prodDetail"}}
            * 2. 'AddToCart'
            *  params={"logger":"7","type":"AddToCart","pageId":"basket"}
            * 3. 'Purchase'
            *  params={"logger":"7","type":"Purchase","data":{"value":2000,"currency":"KRW","pageId":"orderCompleted"}}
            * 4. 'CompleteRegistration'
            *  params={"logger":"7","type":"CompleteRegistration","pageId":"signUp"}
            */
            marketingUtil.fbpixelLogger.send(params)
            break
          case marketingUtil.LOGGER.AIRBRIDGE: // Airbridge - Native에서 전송 처리
            // marketingUtil.airbridgeLogger.send(params)
            break
          default:
            break
        }
        return 'TRUE'
      } catch (e) {
        return 'FALSE'
      }
    }
  }
}
</script>
