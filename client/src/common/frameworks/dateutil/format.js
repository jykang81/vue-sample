import zf from '@frameworks/dateutil/zf'

/**
 * 날짜 포맷
 * @param {date | string(yyyyMMdd or yyyyMMddHHmmss)} date (필수) 변환할 대상 날짜
 * @param {string} format (필수) 날짜 변환 포맷 ex) yyyy-MM-dd hh:mm:ss
 * @returns {string} 포맷팅된 날짜 형식
 */
function format (date, format) {
  let d = null
  if (typeof date === 'object' && date instanceof Date) {
    d = date
  } else if (typeof date === 'string' && date.length >= 8) {
    let dateString = ''
    const year = date.substr(0, 4)
    const month = date.substr(4, 2)
    const day = date.substr(6, 2)
    dateString = `${year}-${month}-${day}`
    if (date.length === 14) {
      const hour = date.substr(8, 2)
      const minute = date.substr(10, 2)
      const second = date.substr(12, 2)
      dateString += `T${hour}:${minute}:${second}`
    }
    d = new Date(dateString)
  } else {
    return null
  }

  return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, $1 => {
    switch ($1) {
      case 'yyyy': return d.getFullYear()
      case 'yy': return zf(d.getFullYear() % 1000, 2)
      case 'MM': return zf(d.getMonth() + 1, 2)
      case 'dd': return zf(d.getDate(), 2)
      case 'E': return ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
      case 'HH': return zf(d.getHours(), 2)
      case 'hh': {
        const h = d.getHours()
        return zf(h % 12 ? h : 12, 2)
      }
      case 'mm': return zf(d.getMinutes(), 2)
      case 'ss': return zf(d.getSeconds(), 2)
      case 'a/p': return d.getHours() < 12 ? '오전' : '오후'
      default: return $1
    }
  })
}

export default format
