/**
 * 앱인지 판단
 *
 * @returns {Boolean} true : App, false : Web
 */
function isOsApp () {
  return Boolean(window.NSHub)
}

export default isOsApp
