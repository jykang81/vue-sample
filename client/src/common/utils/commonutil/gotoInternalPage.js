import router from '@/router'

/**
 * espot에서 clickTarget이 Internal로 들어왔을 때, 페이지 이동
 *
 * @param {String} bannerId 컨텐츠 ID
 * @param {String} espotId ESPOT ID
 * @param {String} mdUrl 이동할 md URL
 */
function gotoInternalPage (bannerId, espotId, mdUrl) {
  const invoke = {}

  try {
    const tmp = mdUrl.split('?')
    if (tmp.length > 1) {
      const paramStr = tmp[1].split('&')

      invoke.bannerId = bannerId
      invoke.espotId = espotId

      for (let i = 0; i < paramStr.length; i++) {
        const param = paramStr[i].split('=')

        invoke[param[0]] = param[1]
      }
    }

    if (!mdUrl.startsWith('/')) {
      mdUrl = `/${mdUrl}`
    }

    router.push({
      path: mdUrl,
      params: invoke
    }).catch(() => {
      // router navigation gaurd 에러 메시지 미표시용
    })
  } catch (e) {
    router.push({ name: 'errorPage' })
  }
}

export default gotoInternalPage
