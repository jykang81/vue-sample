import isNull from '@utils/commonutil/isNull'
import moneyUnformat from '@utils/commonutil/moneyUnformat'

function toNumeric (value) {
  if (isNull(value)) {
    return 0
  }
  const retrunValue = moneyUnformat(value)
  if (retrunValue === '') {
    return 0
  }
  return Number(retrunValue)
}

export default toNumeric
