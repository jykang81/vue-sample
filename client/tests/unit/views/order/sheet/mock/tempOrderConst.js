import { PAY_TYPE_CONST } from '@/common/constants/order/order'

const dummyPayTypes = []
dummyPayTypes.push(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD)
dummyPayTypes.push(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER)
dummyPayTypes.push(PAY_TYPE_CONST.CREDIT_CARD)
dummyPayTypes.push(PAY_TYPE_CONST.NAVER_PAY)
dummyPayTypes.push(PAY_TYPE_CONST.PAYCO)
dummyPayTypes.push(PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK)

const dummySelectboxCard = [
  { value: 'SH_029_Y_10', text: '신한카드' },
  { value: 'SS_031_N_20', text: '삼성카드' },
  { value: 'KM_016_Y_30', text: 'KB국민카드' },
  { value: 'BC_026_N_40', text: 'BC카드' },
  { value: 'DN_027_N_50', text: '현대카드' },
  { value: 'CH_018_Y_60', text: 'NH농협카드' },
  { value: 'AM_047_Y_70', text: '롯데카드' },
  { value: 'HN_006_N_80', text: '하나카드' },
  { value: 'BC_021_N_100', text: '우리카드' },
  { value: 'KM_016_Y_110', text: '카카오뱅크카드' },
  { value: 'VS_022_N_120', text: '씨티카드' },
  { value: 'BC_026_N_130', text: '저축은행카드' },
  { value: 'VS_050_N_130', text: 'VISA카드' },
  { value: 'BC_026_N_140', text: '신협체크카드' },
  { value: 'BC_026_N_150', text: 'MG새마을체크카드' },
  { value: 'BC_026_N_160', text: 'KB증권able카드' },
  { value: 'SU_017_N_170', text: '수협카드' },
  { value: 'VS_010_N_190', text: '전북JB카드' },
  { value: 'SH_011_Y_200', text: '제주카드' },
  { value: 'BC_002_N_220', text: '광주은행카드' }
]

const dummySelectboxCard2 = [
  { value: 'KM_016', text: 'KB국민카드' },
  { value: 'SS_031', text: '삼성카드' },
  { value: 'SH_029', text: '신한카드' },
  { value: 'DN_027', text: '현대카드' },
  { value: 'BC_026', text: 'BC카드' },
  { value: 'AM_047', text: '롯데카드' }
]

export { dummyPayTypes, dummySelectboxCard, dummySelectboxCard2 }
