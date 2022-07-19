const CUST_CENTER_CONST = {
  CHAT_CONSULT: {
    L_CD: {
      ORDER: '1', // 주문
      DELIVERY: '2', // 배송/수거
      RETURN: '4', // 반품
      EXCHANGE: '5', // 교환
      EVENT: '731' // 이벤트/서비스문의
    },
    M_CD: {
      UPDATE: '16', // 수정
      PAYMENT: '18', // 결제
      CANCEL: '22', // 취소
      DELIVERY: '31', // 배송문의
      COLLECT: '749', // 수거문의
      RETURN: '60', // 반품문의
      EXCHANGE: '62', // 교환문의
      EVENT: '732', // 참여이벤트문의
      SERVICE: '734' // 서비스/사이트이용/장애문의
    }
  }
}

export default CUST_CENTER_CONST
