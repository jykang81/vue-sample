// http://bkm.nsmall.com/#M_U1122101M&pageNewUrlNum=4

// 주문목록
// reqeust:
const TEMP_REQ_DATA1 = { tasknm: 'checkRefundItem', var: '300074232054', mobAPI: 'NSMypageCommCmd', accessTm: '20200812090715649', storeId: 13001, langId: -9, uuid: '28b9f761-3a30-4850-a303-730037d262bd', accptPath: 500, accptPathCd: 500, req_co_cd: '110', userId: '110548084', catalogId: 97001 }
// response:
const TEMP_RES_DATA1 = { tasknm: 'checkRefundItem', isSuccessful: true, responseHeaders: { Server: 'WebSphere Application Server/7.0', 'Transfer-Encoding': 'chunked', 'Content-Language': 'en-US', 'Content-Type': 'application/json; charset=UTF-8', Date: 'Wed, 12 Aug 2020 00:05:36 GMT' }, userId: ['110548084'], tranId: 'webapp/wcs/stores/servlet/NSMypageCommCmd', var: '300074232054', langId: ['-9'], accptPath: ['500'], accptPathCd: ['500'], responseTime: 17, totalTime: 18, req_co_cd: ['110'], catalogId: ['97001'], statusReason: 'OK', mobAPI: ['NSMypageCommCmd'], uuid: ['28b9f761-3a30-4850-a303-730037d262bd'], storeId: ['13001'], accessTm: ['20200812090715649'], list: { resultCd: 'Y' }, statusCode: 200 }

// pageparam:
const TEMP_M_INPUTPARAMS = { ordersId: '300074232054', tabIndex: 0, monthly: '', pageidx: '', objOrder: { ordersId: '300074232054', lastupdateall: '20200812082111', storeentId: '13001', timeplaced: '2020-08-12', hasCantTraceCardYn: 'N', payms: [{ paymenttype: 'POINT', payAmt: '9900', paySchdAdjustAmt: '9900', payTypeCnt: '1', availAdjustAmt: '9900', displayorder: ' 00040', paymentname: '예치금 사용', payDttm: '2020.08.12 08:21', payClssfNm: '승인', paySchdAmt: '9900', paySeq: '1', availAmt: '9900', paymdtls: [{ payAmt: '9900', payDttm: '2020.08.12 08:21:11', apprNo: '-', payDt: '2020/08/12', relNm: '', availAmt: '9900', relNo: '***-****-****' }], ordersId: '300074232054', totalPayment: '9900', cancelDttm: null, priority: '7', stdAmt: '9900', pstAdjustAmt: '0', payTypeSum: '9900', paymentpath: 'INTERNAL', receiptYn: 'Y', oneTouchYn: 'N', displaytext: '적립금/포인트/예치금 사용', paymentcode: '500', canceltype: 'PARTIAL', payClssfCd: '100', pstAmt: '0', payTypeSeq: '1' }], catType: '1', preCancelYn: 'N', orderitems: [{ ordersId: '300074232054', attrs: [{ attrvalDesc: '프로닥스 시트세제 1팩@' }], cancelQuantity: '0', catentryName: '[TV]프로닥스 시트세제 1팩(15매)', selfAddress: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, roadZipcode: '13487', phone11: '010', zipcode: '13487', phone12: '1234', phone13: '1234', lotnZipcode: '13487', memberId: '110548084', addrbookId: '26672218', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', lastname: '일이삼사오육칠팔구십', roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, addressId: '20654514011', phone23: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1' }, price: '9900', quantity: '1', orderitemsId: '262206255', modQuantity: '1', exchangeQuantity: '0', addressId: '20654514011', stdOrderitemsId: '262206255', orderSeq: '1', brandName: '프로닥스', status: 'S', ordercatsKey: '300074232054_20654514011_10212323292_S', commentWriteYn: 'Y', memberId: '110548084', catentryId: '10212323292', goodsCd: '28233676', returnQuantity: '0', statusName: '배송완료' }], memberId: '110548084', latestOperationId: null, cats: [{ ordersId: '300074232054', attrs: [{ attrvalDesc: '프로닥스 시트세제 1팩@' }], cancelQuantity: '0', catentryName: '[TV]프로닥스 시트세제 1팩(15매)', selfAddress: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, roadZipcode: '13487', phone11: '010', zipcode: '13487', phone12: '1234', phone13: '1234', lotnZipcode: '13487', memberId: '110548084', addrbookId: '26672218', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', lastname: '일이삼사오육칠팔구십', roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, addressId: '20654514011', phone23: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1' }, price: '9900', quantity: '1', orderitemsId: '262206255', modQuantity: '1', exchangeQuantity: '0', addressId: '20654514011', stdOrderitemsId: '262206255', orderSeq: '1', brandName: '프로닥스', status: 'S', ordercatsKey: '300074232054_20654514011_10212323292_S', commentWriteYn: 'Y', memberId: '110548084', catentryId: '10212323292', goodsCd: '28233676', returnQuantity: '0', statusName: '배송완료' }], discs: [], catsLeng: 1 }, objCats: { ordersId: '300074232054', attrs: [{ attrvalDesc: '프로닥스 시트세제 1팩@' }], cancelQuantity: '0', catentryName: '[TV]프로닥스 시트세제 1팩(15매)', selfAddress: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, roadZipcode: '13487', phone11: '010', zipcode: '13487', phone12: '1234', phone13: '1234', lotnZipcode: '13487', memberId: '110548084', addrbookId: '26672218', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', lastname: '일이삼사오육칠팔구십', roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, addressId: '20654514011', phone23: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1' }, price: '9900', quantity: '1', orderitemsId: '262206255', modQuantity: '1', exchangeQuantity: '0', addressId: '20654514011', stdOrderitemsId: '262206255', orderSeq: '1', brandName: '프로닥스', status: 'S', ordercatsKey: '300074232054_20654514011_10212323292_S', commentWriteYn: 'Y', memberId: '110548084', catentryId: '10212323292', goodsCd: '28233676', returnQuantity: '0', statusName: '배송완료' }, ordersDate: '2020.08.12' }

// STEP1: 사유/수거지선택
// 01.

// 02. 반품할 상품정보 조회
// request:
const TEMP_REQ_DATA2 = { subTasknm: 'form', tasknm: 'RETURN', ordsid: '300074232054', channel: 'mobile', counselorOrderCancel: 'Y', objOrder: { ordersId: '300074232054', lastupdateall: '20200812082111', storeentId: '13001', timeplaced: '2020-08-12', hasCantTraceCardYn: 'N', payms: [{ paymenttype: 'POINT', payAmt: '9900', paySchdAdjustAmt: '9900', payTypeCnt: '1', availAdjustAmt: '9900', displayorder: ' 00040', paymentname: '예치금 사용', payDttm: '2020.08.12 08:21', payClssfNm: '승인', paySchdAmt: '9900', paySeq: '1', availAmt: '9900', paymdtls: [{ payAmt: '9900', payDttm: '2020.08.12 08:21:11', apprNo: '-', payDt: '2020/08/12', relNm: '', availAmt: '9900', relNo: '***-****-****' }], ordersId: '300074232054', totalPayment: '9900', cancelDttm: null, priority: '7', stdAmt: '9900', pstAdjustAmt: '0', payTypeSum: '9900', paymentpath: 'INTERNAL', receiptYn: 'Y', oneTouchYn: 'N', displaytext: '적립금/포인트/예치금 사용', paymentcode: '500', canceltype: 'PARTIAL', payClssfCd: '100', pstAmt: '0', payTypeSeq: '1' }], catType: '1', preCancelYn: 'N', orderitems: [{ ordersId: '300074232054', attrs: [{ attrvalDesc: '프로닥스 시트세제 1팩@' }], cancelQuantity: '0', catentryName: '[TV]프로닥스 시트세제 1팩(15매)', selfAddress: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, roadZipcode: '13487', phone11: '010', zipcode: '13487', phone12: '1234', phone13: '1234', lotnZipcode: '13487', memberId: '110548084', addrbookId: '26672218', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', lastname: '일이삼사오육칠팔구십', roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, addressId: '20654514011', phone23: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1' }, price: '9900', quantity: '1', orderitemsId: '262206255', modQuantity: '1', exchangeQuantity: '0', addressId: '20654514011', stdOrderitemsId: '262206255', orderSeq: '1', brandName: '프로닥스', status: 'S', ordercatsKey: '300074232054_20654514011_10212323292_S', commentWriteYn: 'Y', memberId: '110548084', catentryId: '10212323292', goodsCd: '28233676', returnQuantity: '0', statusName: '배송완료' }], memberId: '110548084', latestOperationId: null, cats: [{ ordersId: '300074232054', attrs: [{ attrvalDesc: '프로닥스 시트세제 1팩@' }], cancelQuantity: '0', catentryName: '[TV]프로닥스 시트세제 1팩(15매)', selfAddress: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, roadZipcode: '13487', phone11: '010', zipcode: '13487', phone12: '1234', phone13: '1234', lotnZipcode: '13487', memberId: '110548084', addrbookId: '26672218', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', lastname: '일이삼사오육칠팔구십', roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, addressId: '20654514011', phone23: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1' }, price: '9900', quantity: '1', orderitemsId: '262206255', modQuantity: '1', exchangeQuantity: '0', addressId: '20654514011', stdOrderitemsId: '262206255', orderSeq: '1', brandName: '프로닥스', status: 'S', ordercatsKey: '300074232054_20654514011_10212323292_S', commentWriteYn: 'Y', memberId: '110548084', catentryId: '10212323292', goodsCd: '28233676', returnQuantity: '0', statusName: '배송완료' }], discs: [], catsLeng: 1 }, mobAPI: 'NSChangeOrderCmd', accessTm: '20200812090715898', storeId: 13001, langId: -9, uuid: '28b9f761-3a30-4850-a303-730037d262bd', accptPath: 500, accptPathCd: 500, req_co_cd: '110', userId: '110548084', catalogId: 97001 }
// response:
const TEMP_RES_DATA2 = { msg: { root: { vdn_cd: '6950', pagelmt: '', tasknm: 'RETURN', subTasknm: 'form', orders: [{ validPayYn: 'Y', totalpayment: '9900', cancelProcType: 'PRE', timeplaced: '2020-08-12', currency: 'KRW', rtnExcgNotAvailYn: 'N', memberId: '110548084', totaltaxshipping: '0', lockedOrderYn: 'N', latestOperationId: null, cats: [{ statusIndex: '6', totalproductTax: '900', unitCd: '10212323292', catentryName: '[TV]프로닥스 시트세제 1팩(15매)', selfAddress: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, roadZipcode: '13487', phone11: '010', zipcode: '13487', phone12: '1234', phone13: '1234', lotnZipcode: '13487', memberId: '110548084', addrbookId: '26672218', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', lastname: '일이삼사오육칠팔구십', roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, addressId: '20654514011', phone23: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1' }, relaxGb: 'N', quantity: '1', btnctrls: [{ btns: 'DELIVERY_STATUS', btnnm: '배송조회' }, { btns: 'REFUND', btnnm: '반품신청' }, { btns: 'EXCHANGE', btnnm: '교환신청' }, { btns: 'PRODUCT_COMMENT_WRITE', btnnm: '상품평 쓰기' }], orgQuantity: '1', orderitemsBillTax: '900', imageUrl: '//product-image.prod-nsmall.com/itemimg/6/28/676/28233676_C.jpg', convinGb: 'N', catentryId: '10212323292', availQuantity: '462', displayType: 'NORMAL', statusName: '배송완료', addressChangeable: 'N', phoneReqDate: null, orgship: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, cardsender: '김테이', orderername: '김테이', message: null, roadZipcode: '13487', zipcode: '13487', phone11: '010', phone12: '1234', phone13: '1234', lotnZipcode: '13487', addrbookId: '26672218', memberId: '110548084', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', email: 'wowkny7@nsmall.com', ordersId: '300074232054', lastname: '일이삼사오육칠팔구십', sendType: null, roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, contactnum: '010-9423-8309', dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', receiverEmail: null, orderitemsId: '262206255', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, phone23: null, addressId: '20654514011', cardmessage: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1', cardreceiver: '일이삼사오육칠팔구십' }, barOpt: null, attrs: [{ ordersId: '300074232054', attrvalDesc: '프로닥스 시트세제 1팩@', sequence: '10', attrDesc: '옵션', attrvalId: '10', attrId: '1', orderitemsId: '262206255' }], buschnId: 'MOBIL', cancelQuantity: '0', prsntPackYn: 'N', steps: [{ step: '주문접수' }, { step: '결제완료' }, { step: '주문전달' }, { step: '상품준비중' }, { step: '배송중' }, { step: '배송완료' }], cnveyNum: null, createdate: '2020.08.12', totalproduct: '9900', phoneReqClssfNm: null, modQuantity: '1', addressId: '20654514011', stdOrderitemsId: '262206255', orderSeq: '1', totaladjustment: '0', slctDay: null, brandName: '프로닥스', exceptionMsg: null, ordercatsKey: '300074232054_20654514011_10212323292_S', addressSum: '9900', shipchargeSum: '0', ship: { lotnZipcode1: '13487', lotnZipcode2: null, phone1: '010-1234-1234', phone2: null, cardsender: '김테이', orderername: '김테이', message: null, roadZipcode: '13487', zipcode: '13487', phone11: '010', phone12: '1234', phone13: '1234', lotnZipcode: '13487', addrbookId: '26672218', memberId: '110548084', teltype01: null, teltype02: null, businesstitle: null, lotnAddress1: '경기 성남시 분당구 삼평동', lotnAddress2: '625번지 7', ziptype: '200', email: 'wowkny7@nsmall.com', ordersId: '300074232054', lastname: '일이삼사오육칠팔구십', sendType: null, roadZipcode1: '13487', zipcode1: '13487', roadZipcode2: null, zipcode2: null, contactnum: '010-9423-8309', dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1', receiverEmail: null, orderitemsId: '262206255', phone21: null, nickname: '일이삼사오육칠팔구십', phone22: null, phone23: null, addressId: '20654514011', cardmessage: null, roadAddress1: '경기 성남시 분당구 판교로228번길 15', address1: '경기 성남시 분당구 판교로228번길 15', roadAddress2: '1', address2: '1', cardreceiver: '일이삼사오육칠팔구십' }, orgattrs: [{ ordersId: '300074232054', attrvalDesc: '프로닥스 시트세제 1팩@', sequence: '10', attrDesc: '옵션', attrvalId: '10', attrId: '1', orderitemsId: '262206255' }], subProducts: [], stepOpt: 'ir_b_cnts order_step', price: '9900', addressSeq: '1', flashSaleYn: null, existAnotherOpts: 'Y', catentryIdOrg: '10212323292', exchangeQuantity: '0', availQuantitySchdDate: '20200813', memberId: '110548084', addressCnt: '1', goodsCd: '28233676', orderitemsBill: '9900', returnQuantity: '0', ordersId: '300074232054', msgCardWriteYn: 'N', dlvrWayCd1: '10', shipcharge: '0', status: 'S', intrv: null, availQuantityType: '10', commentWriteYn: 'Y', rmashipcharge: '0', createdatetime: '2020.08.12 08:20:53', multiCd: null, dispTypeCd: '10' }], cashreceiptAmount: '9900', ordersId: '300074232054', lastupdateall: '20200812082111', media: '모바일', ourCoPayYn: 'Y', storeentId: '13001', totaltax: '0', shipascomplete: 'Y', totalproduct: '9900', hasCantTraceCardYn: 'N', catType: '1', totaladjustment: '0', preCancelYn: 'N', orderitems: [{ ordersId: '300074232054', modDlvrDcAmt: '0', buschnId: 'MOBIL', dlvrDcAmt: '0', cancelQuantity: '0', price: '9900', totalproduct: '9900', quantity: '1', catentryIdOrg: '10212323292', orderitemsId: '262206255', modQuantity: '1', exchangeQuantity: '0', addressId: '20654514011', shipcharge: '0', totaladjustment: '0', orderSeq: '1', ordercatsKey: '300074232054_20654514011_10212323292_S', memberId: '110548084', addressIdOrg: '20654514011', rmashipcharge: '0', catentryId: '10212323292', stdAmount: '9900', returnQuantity: '0' }], totalshipping: '0', status: 'M', totalstdamount: '9900', cpBnftVal: '0', totalavailpayment: '9900', pstRefundAvailYn: 'Y', orderLastPaySeq: '1', taxbillreceiptAmount: '9900' }], userId: '110548084', rowpage: '', tidx: '', langId: '-9', accptPath: '500', vwtyp: '', ordsid: '300074232054', pageidx: '', counselorOrderCancel: 'Y', midx: '', odt1: '', tmtyp: '', status: '', req_co_cd: '110', odt2: '', viewTaskName: 'NSChangeOrderForm', userInfo: { gender: 'F', phone1: '010-9423-8309', phone2: null, phone11: '010', zipcode: '13487', phone12: '9423', phone13: '8309', addrbookId: '26672218', memberId: '110548084', teltype01: null, teltype02: null, ziptype: '200', registertype: 'K', lastname: '김테이', zipcode1: '13487', zipcode2: null, phone21: null, nickname: 'wowkny7@nsmall.com', phone22: null, addressId: '20650631974', phone23: null, custNum: '44491294', address: '경기 성남시 분당구 판교로228번길 15 1', address1: '경기 성남시 분당구 판교로228번길 15', address2: '1', age: null }, onTouchPaymentYn: '', storeId: '13001' } }, channel: ['mobile'], subTasknm: ['form'], tasknm: ['RETURN'], isSuccessful: true, responseHeaders: { Server: 'WebSphere Application Server/7.0', 'Transfer-Encoding': 'chunked', 'Content-Language': 'en-US', 'Content-Type': 'application/json; charset=UTF-8', Date: 'Wed, 12 Aug 2020 00:05:37 GMT' }, userId: ['110548084'], tranId: 'webapp/wcs/stores/servlet/NSChangeOrderCmd', langId: ['-9'], accptPath: ['500'], accptPathCd: ['500'], ordsid: ['300074232054'], responseTime: 866, counselorOrderCancel: ['Y'], totalTime: 868, custNum: '44491294', req_co_cd: ['110'], catalogId: ['97001'], statusReason: 'OK', mobAPI: ['NSChangeOrderCmd'], uuid: ['28b9f761-3a30-4850-a303-730037d262bd'], storeId: ['13001'], accessTm: ['20200812090715898'], statusCode: 200 }

// 03. 반품사유 리스트 조회: NSMypageCommCmd
// request:
const TEMP_REQ_DATA3 = { tasknm: 'ordrsn', var: 'RETURN', accptPath: '500', accptPathCd: '500', userId: '110548084' }
// response:
const TEMP_RES_DATA3 = { tasknm: 'ordrsn', isSuccessful: true, responseHeaders: { Server: 'WebSphere Application Server/7.0', 'Transfer-Encoding': 'chunked', 'Content-Language': 'en-US', 'Content-Type': 'application/json; charset=UTF-8', Date: 'Wed, 12 Aug 2020 00:05:37 GMT' }, userId: ['110548084'], tranId: 'webapp/wcs/stores/servlet/NSMypageCommCmd', var: 'RETURN', langId: ['-9'], accptPath: ['500'], accptPathCd: ['500'], responseTime: 31, totalTime: 32, req_co_cd: ['110'], catalogId: ['97001'], statusReason: 'OK', mobAPI: ['NSMypageCommCmd'], uuid: ['28b9f761-3a30-4850-a303-730037d262bd'], storeId: ['13001'], accessTm: ['20200812090717029'], list: [{ LV3_NAME: '고객사유', LV2_NAME: '반품환불', EXCHANGE: null, LV1_NAME: '반품', LV3_ID: '460', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: null, LV1_ORDER: '5', LV2_ORDER: '2', REFUND: null, LV3_ORDER: '2', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }, { LV3_NAME: '개봉전반품요청', LV2_NAME: '반품환불', EXCHANGE: null, LV1_NAME: '반품', LV3_ID: '459', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: null, LV1_ORDER: '5', LV2_ORDER: '2', REFUND: null, LV3_ORDER: '1', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }, { LV3_NAME: '사이즈', LV2_NAME: '반품환불', EXCHANGE: 'Y', LV1_NAME: '반품', LV3_ID: '161', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: 'N', LV1_ORDER: '5', LV2_ORDER: '2', REFUND: null, LV3_ORDER: '5', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }, { LV3_NAME: '소재/재질', LV2_NAME: '반품환불', EXCHANGE: null, LV1_NAME: '반품', LV3_ID: '150', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: 'N', LV1_ORDER: '5', LV2_ORDER: '2', REFUND: 'Y', LV3_ORDER: '6', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }, { LV3_NAME: '성능/효과불만', LV2_NAME: '반품환불', EXCHANGE: 'Y', LV1_NAME: '반품', LV3_ID: '156', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: 'N', LV1_ORDER: '5', LV2_ORDER: '2', REFUND: null, LV3_ORDER: '15', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }, { LV3_NAME: '작동불량', LV2_NAME: '반품환불', EXCHANGE: null, LV1_NAME: '반품', LV3_ID: '155', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: 'N', LV1_ORDER: '5', LV2_ORDER: '2', REFUND: 'Y', LV3_ORDER: '14', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }, { LV3_NAME: '봉제/마감', LV2_NAME: '반품환불', EXCHANGE: null, LV1_NAME: '반품', LV3_ID: '151', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: 'N', LV1_ORDER: '5', LV2_ORDER: '2', REFUND: 'Y', LV3_ORDER: '7', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }, { LV3_NAME: '디자인/색상', LV2_NAME: '반품환불', EXCHANGE: 'Y', LV1_NAME: '반품', LV3_ID: '157', LV2_ID: '61', LV1_ID: '4', CUST_CHARGE_YN: 'N', LV1_ORDER: '5', LV2_ORDER: '2', REFUND: null, LV3_ORDER: '4', LV1_LMS: 'LCS', CANCEL: null, LV2_LMS: 'MCS', LV3_LMS: 'SCS' }], statusCode: 200 }

// 04. 최근배송지, 주소록 리스트 조회
// request:
const TEMP_REQ_DATA4 = { userId: '110548084', mobAPI: 'NSOrderDeliveryModifyMobile', accessTm: '20200812090717048', storeId: 13001, langId: -9, uuid: '28b9f761-3a30-4850-a303-730037d262bd', accptPath: 500, accptPathCd: 500, req_co_cd: '110', catalogId: 97001 }
// response:
const TEMP_RES_DATA4 = { msg: { root: { AddressList: [{ BILLINGCODETYPE: '', PERSONTITLE: '', MOBILEPHONE1: '', SELFADDRESS: '0', BILLINGCODE: '', BESTCALLINGTIME: '', ADDRESSTYPE: 'SB', ORGNAME: '', LASTCREATE: '2020-08-04 15:29:52.714', PUBLISHPHONE1: '', PUBLISHPHONE2: '', ORGUNITNAME: '', FAX1: '200', FAX2: '13487', FIELD1: '', FIELD2: '', OFFICEADDRESS: '', FIELD3: '16', MOBILE_ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:1', FIRSTNAME: '', PHONE1TYPE: '', ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:1', PHONE2TYPE: '', ADDRESS2: '', ADDRESS3: '', ADDRBOOK_ID: '26672218', MEMBER_ID: '110548084', MIDDLENAME: '', LASTNAME: '일이삼사오육칠팔구십', PHONE1: '010-1234-1234', PHONE2: '', ADDRESS_ID: '20654514011', OPTCOUNTER: '26093', MOBILEPHONE1CNTRY: '', CITY: '', PACKAGESUPPRESSION: '', ZIPCODE: '13487', NICKNAME: '일이삼사오육칠팔구십', SHIPPINGGEOCODE: '', STATE: '', STATUS: 'P', TAXGEOCODE: '', EMAIL1: '', EMAIL2: '', COUNTRY: 'KR', ISPRIMARY: '1', BUSINESSTITLE: '' }], ShipAddressList: [{ BILLINGCODETYPE: '', PERSONTITLE: '', MOBILEPHONE1: '', SELFADDRESS: '0', BILLINGCODE: '', BESTCALLINGTIME: '', ADDRESSTYPE: 'SB', ORGNAME: '', LASTCREATE: '2020-08-04 15:29:52.714', PUBLISHPHONE1: '', PUBLISHPHONE2: '', ORGUNITNAME: '', FAX1: '200', FAX2: '13487', FIELD1: '', FIELD2: '', OFFICEADDRESS: '', FIELD3: '16', MOBILE_ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:1', FIRSTNAME: '', PHONE1TYPE: '', ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:1', PHONE2TYPE: '', ADDRESS2: '', ADDRESS3: '', ADDRBOOK_ID: '26672218', MEMBER_ID: '110548084', MIDDLENAME: '', LASTNAME: '일이삼사오육칠팔구십', PHONE1: '010-1234-1234', PHONE2: '', ADDRESS_ID: '20654514011', OPTCOUNTER: '26093', MOBILEPHONE1CNTRY: '', CITY: '', PACKAGESUPPRESSION: '', ZIPCODE: '13487', NICKNAME: '일이삼사오육칠팔구십', SHIPPINGGEOCODE: '', STATE: '', STATUS: 'P', TAXGEOCODE: '', EMAIL1: '', EMAIL2: '', COUNTRY: 'KR', ISPRIMARY: '1', BUSINESSTITLE: '' }, { BILLINGCODETYPE: '', PERSONTITLE: '', MOBILEPHONE1: '', SELFADDRESS: '0', BILLINGCODE: '', BESTCALLINGTIME: '', ADDRESSTYPE: 'SB', ORGNAME: '', LASTCREATE: '2020-07-07 10:20:43.435', PUBLISHPHONE1: '', PUBLISHPHONE2: '', ORGUNITNAME: '', FAX1: '200', FAX2: '13487', FIELD1: '', FIELD2: '', OFFICEADDRESS: '', FIELD3: '4', MOBILE_ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:7', FIRSTNAME: '', PHONE1TYPE: '', ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:7', PHONE2TYPE: '', ADDRESS2: '', ADDRESS3: '', ADDRBOOK_ID: '26672218', MEMBER_ID: '110548084', MIDDLENAME: '', LASTNAME: '도로명', PHONE1: '010-1234-1234', PHONE2: '', ADDRESS_ID: '20654500512', OPTCOUNTER: '12778', MOBILEPHONE1CNTRY: '', CITY: '', PACKAGESUPPRESSION: '', ZIPCODE: '13487', NICKNAME: '도로명', SHIPPINGGEOCODE: '', STATE: '', STATUS: 'P', TAXGEOCODE: '', EMAIL1: '', EMAIL2: '', COUNTRY: 'KR', ISPRIMARY: '0', BUSINESSTITLE: '' }, { BILLINGCODETYPE: '', PERSONTITLE: '', MOBILEPHONE1: '', SELFADDRESS: '0', BILLINGCODE: '', BESTCALLINGTIME: '', ADDRESSTYPE: 'SB', ORGNAME: '', LASTCREATE: '2020-07-02 15:16:35.449', PUBLISHPHONE1: '', PUBLISHPHONE2: '', ORGUNITNAME: '', FAX1: '200', FAX2: '31708', FIELD1: '', FIELD2: '', OFFICEADDRESS: '', FIELD3: '3', MOBILE_ADDRESS1: '충남 당진시 석문면 난지1길 201&amp;:도서', FIRSTNAME: '', PHONE1TYPE: '', ADDRESS1: '충남 당진시 석문면 난지1길 201&amp;:도서', PHONE2TYPE: '', ADDRESS2: '', ADDRESS3: '', ADDRBOOK_ID: '26672218', MEMBER_ID: '110548084', MIDDLENAME: '', LASTNAME: '도서', PHONE1: '010-1234-1234', PHONE2: '', ADDRESS_ID: '20654499007', OPTCOUNTER: '9495', MOBILEPHONE1CNTRY: '', CITY: '', PACKAGESUPPRESSION: '', ZIPCODE: '31708', NICKNAME: '도서', SHIPPINGGEOCODE: '', STATE: '', STATUS: 'P', TAXGEOCODE: '', EMAIL1: '', EMAIL2: '', COUNTRY: 'KR', ISPRIMARY: '0', BUSINESSTITLE: '' }], RecentAddressList: [{ phone1: '010-1234-1234', phone2: null, contactNum: '', addressType: 'SB', addressID: '20654514011', receiverName: '일이삼사오육칠팔구십', email: '', phone1Type: null, phone2Type: null, lastname: '일이삼사오육칠팔구십', mobile: '', requestProperties: null, commandContext: null, resources: null, ordererName: '일이삼사오육칠팔구십', httpRequest: null, viewCommandContext: null, httpResponse: null, zipCode: '13487', nickname: '일이삼사오육칠팔구십', ispriamry: '1', fax1: '200', addrBookId: '26672218', memberID: '110548084', class: 'class com.ns.commerce.nsorder.bean.NSOrderDeliveryAddrBean', address1: '경기 성남시 분당구 판교로228번길 15&amp;:1', address2: '경기 성남시 분당구 삼평동', address3: '625번지 7' }, { phone1: '010-1234-1234', phone2: null, contactNum: '', addressType: 'SB', addressID: '20654500512', receiverName: '도로명', email: '', phone1Type: null, phone2Type: null, lastname: '도로명', mobile: '', requestProperties: null, commandContext: null, resources: null, ordererName: '도로명', httpRequest: null, viewCommandContext: null, httpResponse: null, zipCode: '13487', nickname: '도로명', ispriamry: '0', fax1: '200', addrBookId: '26672218', memberID: '110548084', class: 'class com.ns.commerce.nsorder.bean.NSOrderDeliveryAddrBean', address1: '경기 성남시 분당구 판교로228번길 15&amp;:7', address2: '경기 성남시 분당구 삼평동', address3: '625번지 7' }, { phone1: '010-1234-1234', phone2: null, contactNum: '', addressType: 'SB', addressID: '20654499007', receiverName: '도서', email: '', phone1Type: null, phone2Type: null, lastname: '도서', mobile: '', requestProperties: null, commandContext: null, resources: null, ordererName: '도서', httpRequest: null, viewCommandContext: null, httpResponse: null, zipCode: '31708', nickname: '도서', ispriamry: '0', fax1: '200', addrBookId: '26672218', memberID: '110548084', class: 'class com.ns.commerce.nsorder.bean.NSOrderDeliveryAddrBean', address1: '충남 당진시 석문면 난지1길 201&amp;:도서', address2: '충남 당진시 석문면', address3: '난지도리 116-3번지 도서' }], deliveryMsg: [{ DELI_MSG: '테스트' }, { DELI_MSG: '문앞' }], LatelyAddressList: [{ BILLINGCODETYPE: '', PERSONTITLE: '', MOBILEPHONE1: '', SELFADDRESS: '0', BILLINGCODE: '', BESTCALLINGTIME: '', ADDRESSTYPE: 'SB', ORGNAME: '', LASTCREATE: '2020-07-02 15:16:35.449', PUBLISHPHONE1: '', PUBLISHPHONE2: '', ORGUNITNAME: '', FAX1: '200', FAX2: '31708', FIELD1: '', FIELD2: '', OFFICEADDRESS: '', FIELD3: '3', MOBILE_ADDRESS1: '충남 당진시 석문면 난지1길 201&amp;:도서', FIRSTNAME: '', PHONE1TYPE: '', ADDRESS1: '충남 당진시 석문면 난지1길 201&amp;:도서', PHONE2TYPE: '', ADDRESS2: '', ADDRESS3: '', ADDRBOOK_ID: '26672218', MEMBER_ID: '110548084', MIDDLENAME: '', LASTNAME: '도서', PHONE1: '010-1234-1234', PHONE2: '', ADDRESS_ID: '20654499007', OPTCOUNTER: '9495', MOBILEPHONE1CNTRY: '', CITY: '', PACKAGESUPPRESSION: '', ZIPCODE: '31708', NICKNAME: '도서', SHIPPINGGEOCODE: '', STATE: '', STATUS: 'P', TAXGEOCODE: '', EMAIL1: '', EMAIL2: '', COUNTRY: 'KR', ISPRIMARY: '0', BUSINESSTITLE: '' }, { BILLINGCODETYPE: '', PERSONTITLE: '', MOBILEPHONE1: '', SELFADDRESS: '0', BILLINGCODE: '', BESTCALLINGTIME: '', ADDRESSTYPE: 'SB', ORGNAME: '', LASTCREATE: '2020-07-07 10:20:43.435', PUBLISHPHONE1: '', PUBLISHPHONE2: '', ORGUNITNAME: '', FAX1: '200', FAX2: '13487', FIELD1: '', FIELD2: '', OFFICEADDRESS: '', FIELD3: '4', MOBILE_ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:7', FIRSTNAME: '', PHONE1TYPE: '', ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:7', PHONE2TYPE: '', ADDRESS2: '', ADDRESS3: '', ADDRBOOK_ID: '26672218', MEMBER_ID: '110548084', MIDDLENAME: '', LASTNAME: '도로명', PHONE1: '010-1234-1234', PHONE2: '', ADDRESS_ID: '20654500512', OPTCOUNTER: '12778', MOBILEPHONE1CNTRY: '', CITY: '', PACKAGESUPPRESSION: '', ZIPCODE: '13487', NICKNAME: '도로명', SHIPPINGGEOCODE: '', STATE: '', STATUS: 'P', TAXGEOCODE: '', EMAIL1: '', EMAIL2: '', COUNTRY: 'KR', ISPRIMARY: '0', BUSINESSTITLE: '' }, { BILLINGCODETYPE: '', PERSONTITLE: '', MOBILEPHONE1: '', SELFADDRESS: '0', BILLINGCODE: '', BESTCALLINGTIME: '', ADDRESSTYPE: 'SB', ORGNAME: '', LASTCREATE: '2020-08-04 15:29:52.714', PUBLISHPHONE1: '', PUBLISHPHONE2: '', ORGUNITNAME: '', FAX1: '200', FAX2: '13487', FIELD1: '', FIELD2: '', OFFICEADDRESS: '', FIELD3: '16', MOBILE_ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:1', FIRSTNAME: '', PHONE1TYPE: '', ADDRESS1: '경기 성남시 분당구 판교로228번길 15&amp;:1', PHONE2TYPE: '', ADDRESS2: '', ADDRESS3: '', ADDRBOOK_ID: '26672218', MEMBER_ID: '110548084', MIDDLENAME: '', LASTNAME: '일이삼사오육칠팔구십', PHONE1: '010-1234-1234', PHONE2: '', ADDRESS_ID: '20654514011', OPTCOUNTER: '26093', MOBILEPHONE1CNTRY: '', CITY: '', PACKAGESUPPRESSION: '', ZIPCODE: '13487', NICKNAME: '일이삼사오육칠팔구십', SHIPPINGGEOCODE: '', STATE: '', STATUS: 'P', TAXGEOCODE: '', EMAIL1: '', EMAIL2: '', COUNTRY: 'KR', ISPRIMARY: '1', BUSINESSTITLE: '' }] } }, isSuccessful: true, responseHeaders: { Server: 'WebSphere Application Server/7.0', 'Transfer-Encoding': 'chunked', 'Content-Language': 'en-US', 'Content-Type': 'application/json; charset=UTF-8', Date: 'Wed, 12 Aug 2020 00:05:37 GMT' }, userId: ['110548084'], tranId: 'webapp/wcs/stores/servlet/NSOrderDeliveryModifyMobile', langId: ['-9'], accptPath: ['500'], accptPathCd: ['500'], responseTime: 27, totalTime: 30, req_co_cd: ['110'], catalogId: ['97001'], statusReason: 'OK', mobAPI: ['NSOrderDeliveryModifyMobile'], uuid: ['28b9f761-3a30-4850-a303-730037d262bd'], storeId: ['13001'], accessTm: ['20200812090717048'], statusCode: 200 }

// 05. 직접 입력 수거가능지역 여부 조회
// request:
// {tasknm:setNewAddressId, var: {...}}
// response:

// 06. 수거가능지역 여부 조회
// request:
// {tasknm:setNewAddressId, var: {...}}
// response:

// 반품사유선택하세요.
// 상세사유 입력하세요.
// 수거 정보는 필수 아님

// STEP2: 환불정보확인
// 01. 환불정보확인 단계 정보 조회
// request:
const TEMP_REQ_DATA5 = { subTasknm: 'payment', tasknm: 'RETURN', ordsid: '300074232054', channel: 'mobile', counselorOrderCancel: 'Y', pageData: '[{"validPayYn":"Y","totalpayment":"9900","cancelProcType":"PRE","timeplaced":"2020-08-12","currency":"KRW","rtnExcgNotAvailYn":"N","memberId":"110548084","totaltaxshipping":"0","lockedOrderYn":"N","latestOperationId":null,"cats":[{"statusIndex":"6","totalproductTax":"900","unitCd":"10212323292","catentryName":"[TV]프로닥스 시트세제 1팩(15매)","selfAddress":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"roadZipcode":"13487","phone11":"010","zipcode":"13487","phone12":"1234","phone13":"1234","lotnZipcode":"13487","memberId":"110548084","addrbookId":"26672218","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","lastname":"일이삼사오육칠팔구십","roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"addressId":"20654514011","phone23":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1"},"relaxGb":"N","quantity":"1","btnctrls":[{"btns":"DELIVERY_STATUS","btnnm":"배송조회"},{"btns":"REFUND","btnnm":"반품신청"},{"btns":"EXCHANGE","btnnm":"교환신청"},{"btns":"PRODUCT_COMMENT_WRITE","btnnm":"상품평 쓰기"}],"orgQuantity":"1","orderitemsBillTax":"900","imageUrl":"//product-image.prod-nsmall.com/itemimg/6/28/676/28233676_C.jpg","convinGb":"N","catentryId":"10212323292","availQuantity":"462","displayType":"NORMAL","statusName":"배송완료","addressChangeable":"N","phoneReqDate":null,"orgship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"barOpt":null,"attrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"buschnId":"MOBIL","cancelQuantity":"0","prsntPackYn":"N","steps":[{"step":"주문접수"},{"step":"결제완료"},{"step":"주문전달"},{"step":"상품준비중"},{"step":"배송중"},{"step":"배송완료"}],"cnveyNum":null,"createdate":"2020.08.12","totalproduct":"9900","phoneReqClssfNm":null,"modQuantity":0,"addressId":"20654514011","stdOrderitemsId":"262206255","orderSeq":"1","totaladjustment":"0","slctDay":null,"brandName":"프로닥스","exceptionMsg":null,"ordercatsKey":"300074232054_20654514011_10212323292_S","addressSum":"9900","shipchargeSum":"0","ship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"orgattrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"subProducts":[],"stepOpt":"ir_b_cnts order_step","price":"9900","addressSeq":"1","flashSaleYn":null,"existAnotherOpts":"Y","catentryIdOrg":"10212323292","exchangeQuantity":"0","availQuantitySchdDate":"20200813","memberId":"110548084","addressCnt":"1","goodsCd":"28233676","orderitemsBill":"9900","returnQuantity":"0","ordersId":"300074232054","msgCardWriteYn":"N","dlvrWayCd1":"10","shipcharge":"0","status":"S","intrv":null,"availQuantityType":"10","commentWriteYn":"Y","rmashipcharge":"0","createdatetime":"2020.08.12 08:20:53","multiCd":null,"dispTypeCd":"10","pickupInfo":{"addressId":"20654514011","businesstitle":"","conv_dt":"","conv_tel11":"","conv_tel12":"","conv_tel13":"","deliv_addr1":"경기 성남시 분당구 판교로228번길 15","deliv_addr2":"1","deliv_message":"","deliv_name":"일이삼사오육칠팔구십","deliv_tel11":"010","deliv_tel12":"1234","deliv_tel13":"1234","deliv_tel21":"","deliv_tel22":"","deliv_tel23":"","deliv_zipcd1":"","deliv_ziptype":"200","ordersId":"300074232054","type":"2"},"returnInfo":{"occurType":"100","ordersId":"300074232054","phone11":"010","phone12":"1234","phone13":"1234","rsn":"460","rsnDesc":"고객사유","rsnDtl":"테스트"},"exchangeInfo":{"occurType":"200","ordersId":"300074232054"},"cancelInfo":{"occurType":"600","ordersId":"300074232054"},"custChargeYn":"N"}],"cashreceiptAmount":"9900","ordersId":"300074232054","lastupdateall":"20200812082111","media":"모바일","ourCoPayYn":"Y","storeentId":"13001","totaltax":"0","shipascomplete":"Y","totalproduct":"9900","hasCantTraceCardYn":"N","catType":"1","totaladjustment":"0","preCancelYn":"N","orderitems":[{"ordersId":"300074232054","modDlvrDcAmt":"0","buschnId":"MOBIL","dlvrDcAmt":"0","cancelQuantity":"0","price":"9900","totalproduct":"9900","quantity":"1","catentryIdOrg":"10212323292","orderitemsId":"262206255","modQuantity":"1","exchangeQuantity":"0","addressId":"20654514011","shipcharge":"0","totaladjustment":"0","orderSeq":"1","ordercatsKey":"300074232054_20654514011_10212323292_S","memberId":"110548084","addressIdOrg":"20654514011","rmashipcharge":"0","catentryId":"10212323292","stdAmount":"9900","returnQuantity":"0","returnInfo":{"occurType":"100","ordersId":"300074232054","phone11":"010","phone12":"1234","phone13":"1234","rsn":"460","rsnDesc":"고객사유","rsnDtl":"테스트","orderitemsId":"262206255"}}],"totalshipping":"0","status":"M","totalstdamount":"9900","cpBnftVal":"0","totalavailpayment":"9900","pstRefundAvailYn":"Y","orderLastPaySeq":"1","taxbillreceiptAmount":"9900","newAddrs":[{}]}]', mobAPI: 'NSChangeOrderCmd', accessTm: '20200812091440280', storeId: 13001, langId: -9, uuid: '28b9f761-3a30-4850-a303-730037d262bd', accptPath: 500, accptPathCd: 500, req_co_cd: '110', userId: '110548084', catalogId: 97001 }
// response:
const TEMP_RES_DATA5 = {
  msg: {
    root: {
      vdn_cd: '6950',
      pagelmt: '',
      tasknm: 'RETURN',
      subTasknm: 'payment',
      orders: [
        {
          currency: 'KRW',
          totaltaxshipping: '0',
          lockedOrderYn: 'N',
          paymCncls: [
            {
              ordersId: '300074232054',
              productDesc: '[TV]프로닥스 시트세제 1팩(15매)',
              payAmt: '9900',
              payType: '500',
              goodsCode: '28233676',
              cancelType: 'PRE',
              paySchdAmt: '0',
              paySeq: '1',
              pstAmt: '0',
              requestCommand: 'CancelPay',
              newHistSeq: '2020081203930720'
            }
          ],
          settype: 'ALL',
          newHistSeq: '2020081203930720',
          storeentId: '13001',
          shipascomplete: 'Y',
          totalproduct: '0',
          hasCantTraceCardYn: 'N',
          refundAccntList: [
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '1234567890',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: 'selected',
              bankNm: '산업은행',
              accntOwner: '김일모',
              bankCd: '02'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: 'KEB하나은행',
              accntOwner: '',
              bankCd: '81'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '국민은행',
              accntOwner: '',
              bankCd: '04'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '수협',
              accntOwner: '',
              bankCd: '07'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '농협',
              accntOwner: '',
              bankCd: '11'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '우리은행',
              accntOwner: '',
              bankCd: '20'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: 'SC제일은행',
              accntOwner: '',
              bankCd: '23'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '신한은행',
              accntOwner: '',
              bankCd: '26'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '대구은행',
              accntOwner: '',
              bankCd: '31'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '부산은행',
              accntOwner: '',
              bankCd: '32'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '광주은행',
              accntOwner: '',
              bankCd: '34'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '제주은행',
              accntOwner: '',
              bankCd: '35'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '전북은행',
              accntOwner: '',
              bankCd: '37'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '경남은행',
              accntOwner: '',
              bankCd: '39'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '시티은행',
              accntOwner: '',
              bankCd: '53'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '기업은행',
              accntOwner: '',
              bankCd: '03'
            }
          ],
          catType: '1',
          refundAmt: '9900',
          totaladjustment: '0',
          orderitems: [
            {
              modDlvrDcAmt: '0',
              cancelInfo: {
                ordersId: '300074232054',
                occurType: '600'
              },
              price: '9900',
              quantity: '1',
              catentryIdOrg: '10212323292',
              exchangeQuantity: '0',
              memberId: '110548084',
              catentryId: '10212323292',
              returnQuantity: '1',
              stdAmount: '9900',
              custChargeYn: 'N',
              ordersId: '300074232054',
              buschnId: 'MOBIL',
              cancelQuantity: '0',
              dlvrDcAmt: '0',
              totalproduct: '9900',
              modQuantity: '0',
              orderitemsId: '262206255',
              addressId: '20654514011',
              shipcharge: '0',
              exchangeInfo: {
                ordersId: '300074232054',
                occurType: '200'
              },
              totaladjustment: '0',
              orderSeq: '1',
              ordercatsKey: '300074232054_20654514011_10212323292_S',
              addressIdOrg: '20654514011',
              rmashipcharge: '0',
              returnInfo: {
                ordersId: '300074232054',
                phone13: '1234',
                occurType: '100',
                rsn: '460',
                phone11: '010',
                rsnDesc: '고객사유',
                phone12: '1234',
                rsnDtl: '테스트'
              }
            }
          ],
          currAmt: '9900',
          pstAmt: '0',
          addPstAmt: '0',
          adjustAmt: '-9900',
          cancCatentryName: '[TV]프로닥스 시트세제 1팩(15매)',
          orderLastPaySeq: '1',
          taxbillreceiptAmount: '9900',
          validPayYn: 'Y',
          totalpayment: '9900',
          changeitem: 'N',
          cancGoodsCd: '28233676',
          cancelProcType: 'PRE',
          timeplaced: '2020-08-12',
          payms: [
            {
              payAmt: '9900',
              paymenttype: 'POINT',
              paySchdAdjustAmt: '9900',
              payTypeCnt: '1',
              availAdjustAmt: '0',
              cancelProcType: 'PRE',
              displayorder: ' 00040',
              payDttm: '2020.08.12 08:21',
              paymentname: '예치금 사용',
              paySchdAmt: '9900',
              payClssfNm: '승인',
              paySeq: '1',
              availAmt: '9900',
              paymdtls: [
                {
                  payAmt: '9900',
                  payDttm: '2020.08.12 08:21:11',
                  apprNo: '-',
                  relNm: '',
                  payDt: '2020/08/12',
                  availAmt: '9900',
                  relNo: '***-****-****'
                }
              ],
              ordersId: '300074232054',
              totalPayment: '9900',
              cancelDttm: null,
              priority: '7',
              stdAmt: '9900',
              pstAdjustAmt: '0',
              payTypeSum: '9900',
              paymentpath: 'INTERNAL',
              receiptYn: 'Y',
              oneTouchYn: 'N',
              displaytext: '적립금/포인트/예치금 사용',
              paymentcode: '500',
              canceltype: 'PARTIAL',
              payClssfCd: '100',
              pstAmt: '0',
              payTypeSeq: '1'
            }
          ],
          newShipCharge: '0',
          rtnExcgNotAvailYn: 'N',
          memberId: '110548084',
          latestOperationId: null,
          cats: [
            {
              statusIndex: '6',
              totalproductTax: '900',
              unitCd: '10212323292',
              catentryName: '[TV]프로닥스 시트세제 1팩(15매)',
              selfAddress: {
                lotnZipcode1: '13487',
                lotnZipcode2: null,
                phone1: '010-1234-1234',
                phone2: null,
                roadZipcode: '13487',
                phone11: '010',
                zipcode: '13487',
                phone12: '1234',
                phone13: '1234',
                lotnZipcode: '13487',
                memberId: '110548084',
                addrbookId: '26672218',
                teltype01: null,
                teltype02: null,
                businesstitle: null,
                lotnAddress1: '경기 성남시 분당구 삼평동',
                lotnAddress2: '625번지 7',
                ziptype: '200',
                lastname: '일이삼사오육칠팔구십',
                roadZipcode1: '13487',
                zipcode1: '13487',
                roadZipcode2: null,
                zipcode2: null,
                dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1',
                phone21: null,
                nickname: '일이삼사오육칠팔구십',
                phone22: null,
                addressId: '20654514011',
                phone23: null,
                roadAddress1: '경기 성남시 분당구 판교로228번길 15',
                address1: '경기 성남시 분당구 판교로228번길 15',
                roadAddress2: '1',
                address2: '1'
              },
              relaxGb: 'N',
              quantity: '1',
              btnctrls: [
                {
                  btns: 'DELIVERY_STATUS',
                  btnnm: '배송조회'
                },
                {
                  btns: 'REFUND',
                  btnnm: '반품신청'
                },
                {
                  btns: 'EXCHANGE',
                  btnnm: '교환신청'
                },
                {
                  btns: 'PRODUCT_COMMENT_WRITE',
                  btnnm: '상품평 쓰기'
                }
              ],
              orgQuantity: '1',
              orderitemsBillTax: '900',
              imageUrl: '//product-image.prod-nsmall.com/itemimg/6/28/676/28233676_C.jpg',
              convinGb: 'N',
              catentryId: '10212323292',
              availQuantity: '462',
              displayType: 'NORMAL',
              statusName: '배송완료',
              addressChangeable: 'N',
              phoneReqDate: null,
              orgship: {
                lotnZipcode1: '13487',
                lotnZipcode2: null,
                phone1: '010-1234-1234',
                phone2: null,
                cardsender: '김테이',
                orderername: '김테이',
                message: null,
                roadZipcode: '13487',
                zipcode: '13487',
                phone11: '010',
                phone12: '1234',
                phone13: '1234',
                lotnZipcode: '13487',
                addrbookId: '26672218',
                memberId: '110548084',
                teltype01: null,
                teltype02: null,
                businesstitle: null,
                lotnAddress1: '경기 성남시 분당구 삼평동',
                lotnAddress2: '625번지 7',
                ziptype: '200',
                email: 'wowkny7@nsmall.com',
                ordersId: '300074232054',
                lastname: '일이삼사오육칠팔구십',
                sendType: null,
                roadZipcode1: '13487',
                zipcode1: '13487',
                roadZipcode2: null,
                zipcode2: null,
                contactnum: '010-9423-8309',
                dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1',
                receiverEmail: null,
                orderitemsId: '262206255',
                phone21: null,
                nickname: '일이삼사오육칠팔구십',
                phone22: null,
                phone23: null,
                addressId: '20654514011',
                cardmessage: null,
                roadAddress1: '경기 성남시 분당구 판교로228번길 15',
                address1: '경기 성남시 분당구 판교로228번길 15',
                roadAddress2: '1',
                address2: '1',
                cardreceiver: '일이삼사오육칠팔구십'
              },
              barOpt: null,
              attrs: [
                {
                  ordersId: '300074232054',
                  attrvalDesc: '프로닥스 시트세제 1팩@',
                  sequence: '10',
                  attrDesc: '옵션',
                  attrvalId: '10',
                  attrId: '1',
                  orderitemsId: '262206255'
                }
              ],
              buschnId: 'MOBIL',
              cancelQuantity: '0',
              prsntPackYn: 'N',
              steps: [
                {
                  step: '주문접수'
                },
                {
                  step: '결제완료'
                },
                {
                  step: '주문전달'
                },
                {
                  step: '상품준비중'
                },
                {
                  step: '배송중'
                },
                {
                  step: '배송완료'
                }
              ],
              cnveyNum: null,
              createdate: '2020.08.12',
              totalproduct: '9900',
              phoneReqClssfNm: null,
              modQuantity: 0,
              addressId: '20654514011',
              stdOrderitemsId: '262206255',
              orderSeq: '1',
              totaladjustment: '0',
              slctDay: null,
              brandName: '프로닥스',
              exceptionMsg: null,
              ordercatsKey: '300074232054_20654514011_10212323292_S',
              addressSum: '9900',
              shipchargeSum: '0',
              ship: {
                lotnZipcode1: '13487',
                lotnZipcode2: null,
                phone1: '010-1234-1234',
                phone2: null,
                cardsender: '김테이',
                orderername: '김테이',
                message: null,
                roadZipcode: '13487',
                zipcode: '13487',
                phone11: '010',
                phone12: '1234',
                phone13: '1234',
                lotnZipcode: '13487',
                addrbookId: '26672218',
                memberId: '110548084',
                teltype01: null,
                teltype02: null,
                businesstitle: null,
                lotnAddress1: '경기 성남시 분당구 삼평동',
                lotnAddress2: '625번지 7',
                ziptype: '200',
                email: 'wowkny7@nsmall.com',
                ordersId: '300074232054',
                lastname: '일이삼사오육칠팔구십',
                sendType: null,
                roadZipcode1: '13487',
                zipcode1: '13487',
                roadZipcode2: null,
                zipcode2: null,
                contactnum: '010-9423-8309',
                dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1',
                receiverEmail: null,
                orderitemsId: '262206255',
                phone21: null,
                nickname: '일이삼사오육칠팔구십',
                phone22: null,
                phone23: null,
                addressId: '20654514011',
                cardmessage: null,
                roadAddress1: '경기 성남시 분당구 판교로228번길 15',
                address1: '경기 성남시 분당구 판교로228번길 15',
                roadAddress2: '1',
                address2: '1',
                cardreceiver: '일이삼사오육칠팔구십'
              },
              orgattrs: [
                {
                  ordersId: '300074232054',
                  attrvalDesc: '프로닥스 시트세제 1팩@',
                  sequence: '10',
                  attrDesc: '옵션',
                  attrvalId: '10',
                  attrId: '1',
                  orderitemsId: '262206255'
                }
              ],
              subProducts: [],
              stepOpt: 'ir_b_cnts order_step',
              cancelInfo: {
                ordersId: '300074232054',
                occurType: '600'
              },
              price: '9900',
              pickupInfo: {
                ordersId: '300074232054',
                deliv_message: '',
                addressId: '20654514011',
                conv_tel11: '',
                conv_tel12: '',
                conv_tel13: '',
                deliv_name: '일이삼사오육칠팔구십',
                deliv_tel21: '',
                deliv_ziptype: '200',
                deliv_tel22: '',
                deliv_tel11: '010',
                deliv_tel23: '',
                deliv_tel12: '1234',
                deliv_tel13: '1234',
                deliv_zipcd1: '',
                businesstitle: '',
                deliv_addr1: '경기 성남시 분당구 판교로228번길 15',
                deliv_addr2: '1',
                type: '2',
                conv_dt: ''
              },
              addressSeq: '1',
              existAnotherOpts: 'Y',
              flashSaleYn: null,
              catentryIdOrg: '10212323292',
              exchangeQuantity: '0',
              availQuantitySchdDate: '20200813',
              memberId: '110548084',
              addressCnt: '1',
              goodsCd: '28233676',
              orderitemsBill: '9900',
              returnQuantity: '0',
              custChargeYn: 'N',
              ordersId: '300074232054',
              msgCardWriteYn: 'N',
              dlvrWayCd1: '10',
              shipcharge: '0',
              exchangeInfo: {
                ordersId: '300074232054',
                occurType: '200'
              },
              status: 'S',
              intrv: null,
              availQuantityType: '10',
              commentWriteYn: 'Y',
              rmashipcharge: '0',
              createdatetime: '2020.08.12 08:20:53',
              multiCd: null,
              dispTypeCd: '10',
              returnInfo: {
                ordersId: '300074232054',
                phone13: '1234',
                occurType: '100',
                rsn: '460',
                phone11: '010',
                rsnDesc: '고객사유',
                phone12: '1234',
                rsnDtl: '테스트'
              }
            }
          ],
          cashreceiptAmount: '9900',
          ordersId: '300074232054',
          lastupdateall: '20200812082111',
          newAddrs: [
            {}
          ],
          media: '모바일',
          ourCoPayYn: 'Y',
          totaltax: '0',
          addAmt: '0',
          orderdiscs: [],
          refundActSum: '9900',
          preCancelYn: 'N',
          totalshipping: '0',
          status: 'M',
          newRmaShipCharge: '0',
          jobtype: 'RETURN',
          totalstdamount: '9900',
          cpBnftVal: '0',
          pstRefundAvailYn: 'Y',
          totalavailpayment: '9900'
        }
      ],
      userId: '110548084',
      rowpage: '',
      tidx: '',
      langId: '-9',
      accptPath: '500',
      vwtyp: '',
      ordsid: '300074232054',
      pageidx: '',
      counselorOrderCancel: 'Y',
      midx: '',
      odt1: '',
      tmtyp: '',
      status: '',
      req_co_cd: '110',
      odt2: '',
      viewTaskName: 'NSChangeOrderForm',
      userInfo: {
        gender: 'F',
        phone1: '010-9423-8309',
        phone2: null,
        phone11: '010',
        zipcode: '13487',
        phone12: '9423',
        phone13: '8309',
        addrbookId: '26672218',
        memberId: '110548084',
        teltype01: null,
        teltype02: null,
        ziptype: '200',
        registertype: 'K',
        lastname: '김테이',
        zipcode1: '13487',
        zipcode2: null,
        phone21: null,
        nickname: 'wowkny7@nsmall.com',
        phone22: null,
        addressId: '20650631974',
        phone23: null,
        custNum: '44491294',
        address: '경기 성남시 분당구 판교로228번길 15 1',
        address1: '경기 성남시 분당구 판교로228번길 15',
        address2: '1',
        age: null
      },
      onTouchPaymentYn: '',
      storeId: '13001'
    }
  },
  channel: [
    'mobile'
  ],
  tasknm: [
    'RETURN'
  ],
  responseHeaders: {
    'Cache-Control': 'no-cache="set-cookie, set-cookie2"',
    Server: 'WebSphere Application Server/7.0',
    Expires: 'Thu, 01 Dec 1994 16:00:00 GMT',
    'Transfer-Encoding': 'chunked',
    'Content-Language': 'en-US',
    'Content-Type': 'application/json; charset=UTF-8',
    Date: 'Wed, 12 Aug 2020 00:13:00 GMT',
    'Set-Cookie': 'WC_USERACTIVITY_110548084=110548084%2c13001%2cnull%2cnull%2c1597190646821%2c1597192981699%2cnull%2cnull%2cnull%2cnull%2cScxsngqNpBOLKDCiCKJ7WxjeqdZRaRTmD1gLV7ZzW%2fz1AEsN8RRjyvy0OhfBdyro2n6mPmd%2fjRdT%0aLGIWpjKXlmCx%2feoUP0rSLK4TzeFtgPW6RZPwwUMy3pxq65jcHhalnVhHX52blLptv5nTbbSpUeOK%0a5Lf4H9FRtnMMP5HKltc%3d; Path=/'
  },
  userId: [
    '110548084'
  ],
  accptPath: [
    '500'
  ],
  accptPathCd: [
    '500'
  ],
  ordsid: [
    '300074232054'
  ],
  catalogId: [
    '97001'
  ],
  statusReason: 'OK',
  pageData: [
    '[{"validPayYn":"Y","totalpayment":"9900","cancelProcType":"PRE","timeplaced":"2020-08-12","currency":"KRW","rtnExcgNotAvailYn":"N","memberId":"110548084","totaltaxshipping":"0","lockedOrderYn":"N","latestOperationId":null,"cats":[{"statusIndex":"6","totalproductTax":"900","unitCd":"10212323292","catentryName":"[TV]프로닥스 시트세제 1팩(15매)","selfAddress":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"roadZipcode":"13487","phone11":"010","zipcode":"13487","phone12":"1234","phone13":"1234","lotnZipcode":"13487","memberId":"110548084","addrbookId":"26672218","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","lastname":"일이삼사오육칠팔구십","roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"addressId":"20654514011","phone23":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1"},"relaxGb":"N","quantity":"1","btnctrls":[{"btns":"DELIVERY_STATUS","btnnm":"배송조회"},{"btns":"REFUND","btnnm":"반품신청"},{"btns":"EXCHANGE","btnnm":"교환신청"},{"btns":"PRODUCT_COMMENT_WRITE","btnnm":"상품평 쓰기"}],"orgQuantity":"1","orderitemsBillTax":"900","imageUrl":"//product-image.prod-nsmall.com/itemimg/6/28/676/28233676_C.jpg","convinGb":"N","catentryId":"10212323292","availQuantity":"462","displayType":"NORMAL","statusName":"배송완료","addressChangeable":"N","phoneReqDate":null,"orgship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"barOpt":null,"attrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"buschnId":"MOBIL","cancelQuantity":"0","prsntPackYn":"N","steps":[{"step":"주문접수"},{"step":"결제완료"},{"step":"주문전달"},{"step":"상품준비중"},{"step":"배송중"},{"step":"배송완료"}],"cnveyNum":null,"createdate":"2020.08.12","totalproduct":"9900","phoneReqClssfNm":null,"modQuantity":0,"addressId":"20654514011","stdOrderitemsId":"262206255","orderSeq":"1","totaladjustment":"0","slctDay":null,"brandName":"프로닥스","exceptionMsg":null,"ordercatsKey":"300074232054_20654514011_10212323292_S","addressSum":"9900","shipchargeSum":"0","ship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"orgattrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"subProducts":[],"stepOpt":"ir_b_cnts order_step","price":"9900","addressSeq":"1","flashSaleYn":null,"existAnotherOpts":"Y","catentryIdOrg":"10212323292","exchangeQuantity":"0","availQuantitySchdDate":"20200813","memberId":"110548084","addressCnt":"1","goodsCd":"28233676","orderitemsBill":"9900","returnQuantity":"0","ordersId":"300074232054","msgCardWriteYn":"N","dlvrWayCd1":"10","shipcharge":"0","status":"S","intrv":null,"availQuantityType":"10","commentWriteYn":"Y","rmashipcharge":"0","createdatetime":"2020.08.12 08:20:53","multiCd":null,"dispTypeCd":"10","pickupInfo":{"addressId":"20654514011","businesstitle":"","conv_dt":"","conv_tel11":"","conv_tel12":"","conv_tel13":"","deliv_addr1":"경기 성남시 분당구 판교로228번길 15","deliv_addr2":"1","deliv_message":"","deliv_name":"일이삼사오육칠팔구십","deliv_tel11":"010","deliv_tel12":"1234","deliv_tel13":"1234","deliv_tel21":"","deliv_tel22":"","deliv_tel23":"","deliv_zipcd1":"","deliv_ziptype":"200","ordersId":"300074232054","type":"2"},"returnInfo":{"occurType":"100","ordersId":"300074232054","phone11":"010","phone12":"1234","phone13":"1234","rsn":"460","rsnDesc":"고객사유","rsnDtl":"테스트"},"exchangeInfo":{"occurType":"200","ordersId":"300074232054"},"cancelInfo":{"occurType":"600","ordersId":"300074232054"},"custChargeYn":"N"}],"cashreceiptAmount":"9900","ordersId":"300074232054","lastupdateall":"20200812082111","media":"모바일","ourCoPayYn":"Y","storeentId":"13001","totaltax":"0","shipascomplete":"Y","totalproduct":"9900","hasCantTraceCardYn":"N","catType":"1","totaladjustment":"0","preCancelYn":"N","orderitems":[{"ordersId":"300074232054","modDlvrDcAmt":"0","buschnId":"MOBIL","dlvrDcAmt":"0","cancelQuantity":"0","price":"9900","totalproduct":"9900","quantity":"1","catentryIdOrg":"10212323292","orderitemsId":"262206255","modQuantity":"1","exchangeQuantity":"0","addressId":"20654514011","shipcharge":"0","totaladjustment":"0","orderSeq":"1","ordercatsKey":"300074232054_20654514011_10212323292_S","memberId":"110548084","addressIdOrg":"20654514011","rmashipcharge":"0","catentryId":"10212323292","stdAmount":"9900","returnQuantity":"0","returnInfo":{"occurType":"100","ordersId":"300074232054","phone11":"010","phone12":"1234","phone13":"1234","rsn":"460","rsnDesc":"고객사유","rsnDtl":"테스트","orderitemsId":"262206255"}}],"totalshipping":"0","status":"M","totalstdamount":"9900","cpBnftVal":"0","totalavailpayment":"9900","pstRefundAvailYn":"Y","orderLastPaySeq":"1","taxbillreceiptAmount":"9900","newAddrs":[{}]}]'
  ],
  storeId: [
    '13001'
  ],
  isSuccessful: true,
  subTasknm: [
    'payment'
  ],
  tranId: 'webapp/wcs/stores/servlet/NSChangeOrderCmd',
  langId: [
    '-9'
  ],
  responseTime: 311,
  counselorOrderCancel: [
    'Y'
  ],
  totalTime: 331,
  req_co_cd: [
    '110'
  ],
  custNum: '44491294',
  mobAPI: [
    'NSChangeOrderCmd'
  ],
  uuid: [
    '28b9f761-3a30-4850-a303-730037d262bd'
  ],
  accessTm: [
    '20200812091440280'
  ],
  statusCode: 200
}

// 환불방법선택
// 예치금
// 내계좌환불

// STEP2: 신청완료
// 01. 신청완료 단계 정보 조회
// request:
const TEMP_REQ_DATA6 = { subTasknm: 'execute', tasknm: 'RETURN', ordsid: '300074232054', channel: 'mobile', counselorOrderCancel: 'Y', pageData: '[{"currency":"KRW","totaltaxshipping":"0","lockedOrderYn":"N","paymCncls":[{"ordersId":"300074232054","productDesc":"[TV]프로닥스 시트세제 1팩(15매)","payAmt":"9900","payType":"500","goodsCode":"28233676","cancelType":"PRE","paySchdAmt":"0","paySeq":"1","pstAmt":"0","requestCommand":"CancelPay","newHistSeq":"2020081203930722"}],"settype":"ALL","newHistSeq":"2020081203930722","storeentId":"13001","shipascomplete":"Y","totalproduct":"0","hasCantTraceCardYn":"N","refundAccntList":[{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"산업은행","accntOwner":"","bankCd":"02"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"KEB하나은행","accntOwner":"","bankCd":"81"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"국민은행","accntOwner":"","bankCd":"04"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"수협","accntOwner":"","bankCd":"07"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"농협","accntOwner":"","bankCd":"11"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"우리은행","accntOwner":"","bankCd":"20"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"SC제일은행","accntOwner":"","bankCd":"23"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"신한은행","accntOwner":"","bankCd":"26"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"대구은행","accntOwner":"","bankCd":"31"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"부산은행","accntOwner":"","bankCd":"32"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"광주은행","accntOwner":"","bankCd":"34"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"제주은행","accntOwner":"","bankCd":"35"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"전북은행","accntOwner":"","bankCd":"37"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"경남은행","accntOwner":"","bankCd":"39"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"시티은행","accntOwner":"","bankCd":"53"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"기업은행","accntOwner":"","bankCd":"03"}],"catType":"1","refundAmt":"9900","totaladjustment":"0","orderitems":[{"modDlvrDcAmt":"0","cancelInfo":{"ordersId":"300074232054","occurType":"600"},"price":"9900","quantity":"1","catentryIdOrg":"10212323292","exchangeQuantity":"0","memberId":"110548084","catentryId":"10212323292","returnQuantity":"1","stdAmount":"9900","custChargeYn":"N","ordersId":"300074232054","buschnId":"MOBIL","cancelQuantity":"0","dlvrDcAmt":"0","totalproduct":"9900","modQuantity":"0","orderitemsId":"262206255","addressId":"20654514011","shipcharge":"0","exchangeInfo":{"ordersId":"300074232054","occurType":"200"},"totaladjustment":"0","orderSeq":"1","ordercatsKey":"300074232054_20654514011_10212323292_S","addressIdOrg":"20654514011","rmashipcharge":"0","returnInfo":{"ordersId":"300074232054","phone13":"1234","occurType":"100","rsn":"460","phone11":"010","rsnDesc":"고객사유","phone12":"1234","rsnDtl":"테스트"},"refundInfo":{"accntNo":"359987123456","accntOwner":"김테이","bankCd":"02","bankNm":"산업은행","newHistSeq":"2020081203930722","ordersId":"300074232054","refundAmt":"9900","type":"2","typeDesc":"계좌"}}],"currAmt":"9900","pstAmt":"0","addPstAmt":"0","adjustAmt":"-9900","cancCatentryName":"[TV]프로닥스 시트세제 1팩(15매)","orderLastPaySeq":"1","taxbillreceiptAmount":"9900","validPayYn":"Y","totalpayment":"9900","changeitem":"N","cancGoodsCd":"28233676","cancelProcType":"PRE","timeplaced":"2020-08-12","payms":[{"payAmt":"9900","paymenttype":"POINT","paySchdAdjustAmt":"9900","payTypeCnt":"1","availAdjustAmt":"0","cancelProcType":"PRE","displayorder":" 00040","payDttm":"2020.08.12 08:21","paymentname":"예치금 사용","paySchdAmt":"9900","payClssfNm":"승인","paySeq":"1","availAmt":"9900","paymdtls":[{"payAmt":"9900","payDttm":"2020.08.12 08:21:11","apprNo":"-","relNm":"","payDt":"2020/08/12","availAmt":"9900","relNo":"***-****-****"}],"ordersId":"300074232054","totalPayment":"9900","cancelDttm":null,"priority":"7","stdAmt":"9900","pstAdjustAmt":"0","payTypeSum":"9900","paymentpath":"INTERNAL","receiptYn":"Y","oneTouchYn":"N","displaytext":"적립금/포인트/예치금 사용","paymentcode":"500","canceltype":"PARTIAL","payClssfCd":"100","pstAmt":"0","payTypeSeq":"1"}],"newShipCharge":"0","rtnExcgNotAvailYn":"N","memberId":"110548084","latestOperationId":null,"cats":[{"statusIndex":"6","totalproductTax":"900","unitCd":"10212323292","catentryName":"[TV]프로닥스 시트세제 1팩(15매)","selfAddress":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"roadZipcode":"13487","phone11":"010","zipcode":"13487","phone12":"1234","phone13":"1234","lotnZipcode":"13487","memberId":"110548084","addrbookId":"26672218","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","lastname":"일이삼사오육칠팔구십","roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"addressId":"20654514011","phone23":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1"},"relaxGb":"N","quantity":"1","btnctrls":[{"btns":"DELIVERY_STATUS","btnnm":"배송조회"},{"btns":"REFUND","btnnm":"반품신청"},{"btns":"EXCHANGE","btnnm":"교환신청"},{"btns":"PRODUCT_COMMENT_WRITE","btnnm":"상품평 쓰기"}],"orgQuantity":"1","orderitemsBillTax":"900","imageUrl":"//product-image.prod-nsmall.com/itemimg/6/28/676/28233676_C.jpg","convinGb":"N","catentryId":"10212323292","availQuantity":"462","displayType":"NORMAL","statusName":"배송완료","addressChangeable":"N","phoneReqDate":null,"orgship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"barOpt":null,"attrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"buschnId":"MOBIL","cancelQuantity":"0","prsntPackYn":"N","steps":[{"step":"주문접수"},{"step":"결제완료"},{"step":"주문전달"},{"step":"상품준비중"},{"step":"배송중"},{"step":"배송완료"}],"cnveyNum":null,"createdate":"2020.08.12","totalproduct":"9900","phoneReqClssfNm":null,"modQuantity":0,"addressId":"20654514011","stdOrderitemsId":"262206255","orderSeq":"1","totaladjustment":"0","slctDay":null,"brandName":"프로닥스","exceptionMsg":null,"ordercatsKey":"300074232054_20654514011_10212323292_S","addressSum":"9900","shipchargeSum":"0","ship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"orgattrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"subProducts":[],"stepOpt":"ir_b_cnts order_step","cancelInfo":{"ordersId":"300074232054","occurType":"600"},"price":"9900","pickupInfo":{"ordersId":"300074232054","deliv_message":"수거 전 연락바랍니다.","addressId":"20654514011","conv_tel11":"","conv_tel12":"","conv_tel13":"","deliv_name":"일이삼사오육칠팔구십","deliv_tel21":"","deliv_ziptype":"200","deliv_tel22":"","deliv_tel11":"010","deliv_tel23":"","deliv_tel12":"1234","deliv_tel13":"1234","deliv_zipcd1":"","businesstitle":"","deliv_addr1":"경기 성남시 분당구 판교로228번길 15","deliv_addr2":"1","type":"2","conv_dt":""},"addressSeq":"1","existAnotherOpts":"Y","flashSaleYn":null,"catentryIdOrg":"10212323292","exchangeQuantity":"0","availQuantitySchdDate":"20200813","memberId":"110548084","addressCnt":"1","goodsCd":"28233676","orderitemsBill":"9900","returnQuantity":"0","custChargeYn":"N","ordersId":"300074232054","msgCardWriteYn":"N","dlvrWayCd1":"10","shipcharge":"0","exchangeInfo":{"ordersId":"300074232054","occurType":"200"},"status":"S","intrv":null,"availQuantityType":"10","commentWriteYn":"Y","rmashipcharge":"0","createdatetime":"2020.08.12 08:20:53","multiCd":null,"dispTypeCd":"10","returnInfo":{"ordersId":"300074232054","phone13":"1234","occurType":"100","rsn":"460","phone11":"010","rsnDesc":"고객사유","phone12":"1234","rsnDtl":"테스트"}}],"cashreceiptAmount":"9900","ordersId":"300074232054","lastupdateall":"20200812082111","newAddrs":[{}],"media":"모바일","ourCoPayYn":"Y","totaltax":"0","addAmt":"0","orderdiscs":[],"refundActSum":"9900","preCancelYn":"N","totalshipping":"0","status":"M","newRmaShipCharge":"0","jobtype":"RETURN","totalstdamount":"9900","cpBnftVal":"0","pstRefundAvailYn":"Y","totalavailpayment":"9900","refundInfo":{"accntNo":"359987123456","accntOwner":"김테이","bankCd":"02","bankNm":"산업은행","newHistSeq":"2020081203930722","ordersId":"300074232054","refundAmt":"9900","type":"2","typeDesc":"계좌"}}]', mobAPI: 'NSChangeOrderCmd', accessTm: '20200812092832450', storeId: 13001, langId: -9, uuid: '28b9f761-3a30-4850-a303-730037d262bd', accptPath: 500, accptPathCd: 500, req_co_cd: '110', userId: '110548084', catalogId: 97001 }
// response:
const TEMP_RES_DATA6 = {
  msg: {
    root: {
      vdn_cd: '6950',
      pagelmt: '',
      tasknm: 'RETURN',
      subTasknm: 'execute',
      orders: [
        {
          RECEIPT_TYPE: '200',
          accptPath: '500',
          totalProduct: '9900',
          regiGb: '03',
          currency: 'KRW',
          totaltaxshipping: '0',
          apprAmt: 9900,
          lockedOrderYn: 'N',
          paymCncls: [
            {
              ordersId: '300074232054',
              productDesc: '[TV]프로닥스 시트세제 1팩(15매)',
              payAmt: '9900',
              payType: '500',
              goodsCode: '28233676',
              cancelType: 'PRE',
              paySchdAmt: '0',
              paySeq: '1',
              pstAmt: '0',
              requestCommand: 'CancelPay',
              newHistSeq: '2020081203930722'
            }
          ],
          settype: 'ALL',
          newHistSeq: '2020081203930722',
          storeentId: '13001',
          shipascomplete: 'Y',
          totalproduct: '0',
          hasCantTraceCardYn: 'N',
          refundAccntList: [
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '산업은행',
              accntOwner: '',
              bankCd: '02'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: 'KEB하나은행',
              accntOwner: '',
              bankCd: '81'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '국민은행',
              accntOwner: '',
              bankCd: '04'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '수협',
              accntOwner: '',
              bankCd: '07'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '농협',
              accntOwner: '',
              bankCd: '11'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '우리은행',
              accntOwner: '',
              bankCd: '20'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: 'SC제일은행',
              accntOwner: '',
              bankCd: '23'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '신한은행',
              accntOwner: '',
              bankCd: '26'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '대구은행',
              accntOwner: '',
              bankCd: '31'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '부산은행',
              accntOwner: '',
              bankCd: '32'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '광주은행',
              accntOwner: '',
              bankCd: '34'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '제주은행',
              accntOwner: '',
              bankCd: '35'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '전북은행',
              accntOwner: '',
              bankCd: '37'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '경남은행',
              accntOwner: '',
              bankCd: '39'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '시티은행',
              accntOwner: '',
              bankCd: '53'
            },
            {
              _classname: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              accntNo: '',
              class: 'com.ns.commerce.nsmypage.bean.NSRefundAccountBean',
              _type: 'JavaClass',
              selected: '',
              bankNm: '기업은행',
              accntOwner: '',
              bankCd: '03'
            }
          ],
          refundAmt: '9900',
          catType: '1',
          totaladjustment: '0',
          orderitems: [
            {
              modDlvrDcAmt: '0',
              refundInfo: {
                ordersId: '300074232054',
                refundAmt: '9900',
                accntNo: '359987123456',
                type: '2',
                bankNm: '산업은행',
                typeDesc: '계좌',
                accntOwner: '김테이',
                bankCd: '02',
                newHistSeq: '2020081203930722'
              },
              cancelInfo: {
                ordersId: '300074232054',
                occurType: '600'
              },
              price: '9900',
              quantity: '1',
              catentryIdOrg: '10212323292',
              exchangeQuantity: '0',
              memberId: '110548084',
              catentryId: '10212323292',
              returnQuantity: '1',
              stdAmount: '9900',
              custChargeYn: 'N',
              ordersId: '300074232054',
              buschnId: 'MOBIL',
              cancelQuantity: '0',
              dlvrDcAmt: '0',
              totalproduct: '9900',
              modQuantity: '0',
              orderitemsId: '262206255',
              addressId: '20654514011',
              shipcharge: '0',
              exchangeInfo: {
                ordersId: '300074232054',
                occurType: '200'
              },
              totaladjustment: '0',
              orderSeq: '1',
              ordercatsKey: '300074232054_20654514011_10212323292_S',
              addressIdOrg: '20654514011',
              rmashipcharge: '0',
              returnInfo: {
                ordersId: '300074232054',
                phone13: '1234',
                occurType: '100',
                rsn: '460',
                phone11: '010',
                rsnDesc: '고객사유',
                phone12: '1234',
                rsnDtl: '테스트'
              }
            }
          ],
          custNum: '44491294',
          currAmt: '9900',
          pstAmt: '0',
          addPstAmt: '0',
          adjustAmt: '-9900',
          cancCatentryName: '[TV]프로닥스 시트세제 1팩(15매)',
          orderLastPaySeq: '1',
          taxbillreceiptAmount: '9900',
          validPayYn: 'Y',
          totalpayment: '9900',
          changeitem: 'Y',
          cancGoodsCd: '28233676',
          bizRegNum: null,
          refundInfo: {
            ordersId: '300074232054',
            refundAmt: '9900',
            accntNo: '359987123456',
            type: '2',
            bankNm: '산업은행',
            typeDesc: '계좌',
            accntOwner: '김테이',
            bankCd: '02',
            newHistSeq: '2020081203930722'
          },
          cancelProcType: 'PRE',
          timeplaced: '2020-08-12',
          payms: [
            {
              payAmt: '9900',
              paymenttype: 'POINT',
              paySchdAdjustAmt: '9900',
              payTypeCnt: '1',
              availAdjustAmt: '0',
              cancelProcType: 'PRE',
              displayorder: ' 00040',
              payDttm: '2020.08.12 08:21',
              paymentname: '예치금 사용',
              paySchdAmt: '9900',
              payClssfNm: '승인',
              paySeq: '1',
              availAmt: '9900',
              paymdtls: [
                {
                  payAmt: '9900',
                  payDttm: '2020.08.12 08:21:11',
                  apprNo: '-',
                  relNm: '',
                  payDt: '2020/08/12',
                  availAmt: '9900',
                  relNo: '***-****-****'
                }
              ],
              ordersId: '300074232054',
              totalPayment: '9900',
              cancelDttm: null,
              priority: '7',
              stdAmt: '9900',
              pstAdjustAmt: '0',
              payTypeSum: '9900',
              paymentpath: 'INTERNAL',
              receiptYn: 'Y',
              oneTouchYn: 'N',
              displaytext: '적립금/포인트/예치금 사용',
              paymentcode: '500',
              canceltype: 'PARTIAL',
              payClssfCd: '100',
              pstAmt: '0',
              payTypeSeq: '1'
            }
          ],
          newShipCharge: '0',
          rtnExcgNotAvailYn: 'N',
          memberId: '110548084',
          latestOperationId: null,
          cats: [
            {
              statusIndex: '6',
              totalproductTax: '900',
              unitCd: '10212323292',
              catentryName: '[TV]프로닥스 시트세제 1팩(15매)',
              selfAddress: {
                lotnZipcode1: '13487',
                lotnZipcode2: null,
                phone1: '010-1234-1234',
                phone2: null,
                roadZipcode: '13487',
                phone11: '010',
                zipcode: '13487',
                phone12: '1234',
                phone13: '1234',
                lotnZipcode: '13487',
                memberId: '110548084',
                addrbookId: '26672218',
                teltype01: null,
                teltype02: null,
                businesstitle: null,
                lotnAddress1: '경기 성남시 분당구 삼평동',
                lotnAddress2: '625번지 7',
                ziptype: '200',
                lastname: '일이삼사오육칠팔구십',
                roadZipcode1: '13487',
                zipcode1: '13487',
                roadZipcode2: null,
                zipcode2: null,
                dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1',
                phone21: null,
                nickname: '일이삼사오육칠팔구십',
                phone22: null,
                addressId: '20654514011',
                phone23: null,
                roadAddress1: '경기 성남시 분당구 판교로228번길 15',
                address1: '경기 성남시 분당구 판교로228번길 15',
                roadAddress2: '1',
                address2: '1'
              },
              relaxGb: 'N',
              quantity: '1',
              btnctrls: [
                {
                  btns: 'DELIVERY_STATUS',
                  btnnm: '배송조회'
                },
                {
                  btns: 'REFUND',
                  btnnm: '반품신청'
                },
                {
                  btns: 'EXCHANGE',
                  btnnm: '교환신청'
                },
                {
                  btns: 'PRODUCT_COMMENT_WRITE',
                  btnnm: '상품평 쓰기'
                }
              ],
              orgQuantity: '1',
              orderitemsBillTax: '900',
              imageUrl: '//product-image.prod-nsmall.com/itemimg/6/28/676/28233676_C.jpg',
              convinGb: 'N',
              catentryId: '10212323292',
              availQuantity: '462',
              displayType: 'NORMAL',
              statusName: '배송완료',
              addressChangeable: 'N',
              phoneReqDate: null,
              orgship: {
                lotnZipcode1: '13487',
                lotnZipcode2: null,
                phone1: '010-1234-1234',
                phone2: null,
                cardsender: '김테이',
                orderername: '김테이',
                message: null,
                roadZipcode: '13487',
                zipcode: '13487',
                phone11: '010',
                phone12: '1234',
                phone13: '1234',
                lotnZipcode: '13487',
                addrbookId: '26672218',
                memberId: '110548084',
                teltype01: null,
                teltype02: null,
                businesstitle: null,
                lotnAddress1: '경기 성남시 분당구 삼평동',
                lotnAddress2: '625번지 7',
                ziptype: '200',
                email: 'wowkny7@nsmall.com',
                ordersId: '300074232054',
                lastname: '일이삼사오육칠팔구십',
                sendType: null,
                roadZipcode1: '13487',
                zipcode1: '13487',
                roadZipcode2: null,
                zipcode2: null,
                contactnum: '010-9423-8309',
                dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1',
                receiverEmail: null,
                orderitemsId: '262206255',
                phone21: null,
                nickname: '일이삼사오육칠팔구십',
                phone22: null,
                phone23: null,
                addressId: '20654514011',
                cardmessage: null,
                roadAddress1: '경기 성남시 분당구 판교로228번길 15',
                address1: '경기 성남시 분당구 판교로228번길 15',
                roadAddress2: '1',
                address2: '1',
                cardreceiver: '일이삼사오육칠팔구십'
              },
              barOpt: null,
              attrs: [
                {
                  ordersId: '300074232054',
                  attrvalDesc: '프로닥스 시트세제 1팩@',
                  sequence: '10',
                  attrDesc: '옵션',
                  attrvalId: '10',
                  attrId: '1',
                  orderitemsId: '262206255'
                }
              ],
              buschnId: 'MOBIL',
              cancelQuantity: '0',
              prsntPackYn: 'N',
              steps: [
                {
                  step: '주문접수'
                },
                {
                  step: '결제완료'
                },
                {
                  step: '주문전달'
                },
                {
                  step: '상품준비중'
                },
                {
                  step: '배송중'
                },
                {
                  step: '배송완료'
                }
              ],
              cnveyNum: null,
              createdate: '2020.08.12',
              totalproduct: '9900',
              phoneReqClssfNm: null,
              modQuantity: 0,
              addressId: '20654514011',
              stdOrderitemsId: '262206255',
              orderSeq: '1',
              totaladjustment: '0',
              slctDay: null,
              brandName: '프로닥스',
              exceptionMsg: null,
              ordercatsKey: '300074232054_20654514011_10212323292_S',
              addressSum: '9900',
              shipchargeSum: '0',
              ship: {
                lotnZipcode1: '13487',
                lotnZipcode2: null,
                phone1: '010-1234-1234',
                phone2: null,
                cardsender: '김테이',
                orderername: '김테이',
                message: null,
                roadZipcode: '13487',
                zipcode: '13487',
                phone11: '010',
                phone12: '1234',
                phone13: '1234',
                lotnZipcode: '13487',
                addrbookId: '26672218',
                memberId: '110548084',
                teltype01: null,
                teltype02: null,
                businesstitle: null,
                lotnAddress1: '경기 성남시 분당구 삼평동',
                lotnAddress2: '625번지 7',
                ziptype: '200',
                email: 'wowkny7@nsmall.com',
                ordersId: '300074232054',
                lastname: '일이삼사오육칠팔구십',
                sendType: null,
                roadZipcode1: '13487',
                zipcode1: '13487',
                roadZipcode2: null,
                zipcode2: null,
                contactnum: '010-9423-8309',
                dispAddressPlus: '[13487] 경기 성남시 분당구 판교로228번길 15 1',
                receiverEmail: null,
                orderitemsId: '262206255',
                phone21: null,
                nickname: '일이삼사오육칠팔구십',
                phone22: null,
                phone23: null,
                addressId: '20654514011',
                cardmessage: null,
                roadAddress1: '경기 성남시 분당구 판교로228번길 15',
                address1: '경기 성남시 분당구 판교로228번길 15',
                roadAddress2: '1',
                address2: '1',
                cardreceiver: '일이삼사오육칠팔구십'
              },
              orgattrs: [
                {
                  ordersId: '300074232054',
                  attrvalDesc: '프로닥스 시트세제 1팩@',
                  sequence: '10',
                  attrDesc: '옵션',
                  attrvalId: '10',
                  attrId: '1',
                  orderitemsId: '262206255'
                }
              ],
              subProducts: [],
              stepOpt: 'ir_b_cnts order_step',
              cancelInfo: {
                ordersId: '300074232054',
                occurType: '600'
              },
              price: '9900',
              pickupInfo: {
                ordersId: '300074232054',
                deliv_message: '수거 전 연락바랍니다.',
                addressId: '20654514011',
                conv_tel11: '',
                conv_tel12: '',
                conv_tel13: '',
                deliv_name: '일이삼사오육칠팔구십',
                deliv_tel21: '',
                deliv_ziptype: '200',
                deliv_tel22: '',
                deliv_tel11: '010',
                deliv_tel23: '',
                deliv_tel12: '1234',
                deliv_tel13: '1234',
                deliv_zipcd1: '',
                businesstitle: '',
                deliv_addr1: '경기 성남시 분당구 판교로228번길 15',
                deliv_addr2: '1',
                type: '2',
                conv_dt: ''
              },
              addressSeq: '1',
              existAnotherOpts: 'Y',
              flashSaleYn: null,
              catentryIdOrg: '10212323292',
              exchangeQuantity: '0',
              availQuantitySchdDate: '20200813',
              memberId: '110548084',
              addressCnt: '1',
              goodsCd: '28233676',
              orderitemsBill: '9900',
              returnQuantity: '0',
              custChargeYn: 'N',
              ordersId: '300074232054',
              msgCardWriteYn: 'N',
              dlvrWayCd1: '10',
              shipcharge: '0',
              exchangeInfo: {
                ordersId: '300074232054',
                occurType: '200'
              },
              status: 'S',
              intrv: null,
              availQuantityType: '10',
              commentWriteYn: 'Y',
              rmashipcharge: '0',
              createdatetime: '2020.08.12 08:20:53',
              multiCd: null,
              dispTypeCd: '10',
              returnInfo: {
                ordersId: '300074232054',
                phone13: '1234',
                occurType: '100',
                rsn: '460',
                phone11: '010',
                rsnDesc: '고객사유',
                phone12: '1234',
                rsnDtl: '테스트'
              }
            }
          ],
          cashreceiptAmount: '9900',
          ordersId: '300074232054',
          lastupdateall: '20200812082111',
          newAddrs: [
            {
              custNum: '44491294',
              custDstnClssfNum: '1'
            }
          ],
          media: '모바일',
          ourCoPayYn: 'Y',
          addAmt: '0',
          totaltax: '0',
          orderdiscs: [],
          refundActSum: '9900',
          status: 'M',
          totalshipping: '0',
          preCancelYn: 'N',
          newRmaShipCharge: '0',
          jobtype: 'RETURN',
          totalstdamount: '9900',
          cpBnftVal: '0',
          pstRefundAvailYn: 'Y',
          totalavailpayment: '9900'
        }
      ],
      userId: '110548084',
      rowpage: '',
      tidx: '',
      langId: '-9',
      accptPath: '500',
      vwtyp: '',
      ordsid: '300074232054',
      pageidx: '',
      counselorOrderCancel: 'Y',
      midx: '',
      odt1: '',
      tmtyp: '',
      status: '',
      req_co_cd: '110',
      odt2: '',
      viewTaskName: 'NSChangeOrderForm',
      userInfo: {
        gender: 'F',
        phone1: '010-9423-8309',
        phone2: null,
        phone11: '010',
        zipcode: '13487',
        phone12: '9423',
        phone13: '8309',
        addrbookId: '26672218',
        memberId: '110548084',
        teltype01: null,
        teltype02: null,
        ziptype: '200',
        registertype: 'K',
        lastname: '김테이',
        zipcode1: '13487',
        zipcode2: null,
        phone21: null,
        nickname: 'wowkny7@nsmall.com',
        phone22: null,
        addressId: '20650631974',
        phone23: null,
        custNum: '44491294',
        address: '경기 성남시 분당구 판교로228번길 15 1',
        address1: '경기 성남시 분당구 판교로228번길 15',
        address2: '1',
        age: null
      },
      onTouchPaymentYn: '',
      storeId: '13001'
    }
  },
  channel: [
    'mobile'
  ],
  tasknm: [
    'RETURN'
  ],
  responseHeaders: {
    'Cache-Control': 'no-cache="set-cookie, set-cookie2"',
    Server: 'WebSphere Application Server/7.0',
    Expires: 'Thu, 01 Dec 1994 16:00:00 GMT',
    'Transfer-Encoding': 'chunked',
    'Content-Language': 'en-US',
    'Content-Type': 'application/json; charset=UTF-8',
    Date: 'Wed, 12 Aug 2020 00:26:56 GMT',
    'Set-Cookie': 'WC_USERACTIVITY_110548084=110548084%2c13001%2cnull%2cnull%2c1597190646821%2c1597193816989%2cnull%2cnull%2cnull%2cnull%2cScxsngqNpBOLKDCiCKJ7WxjeqdZRaRTmD1gLV7ZzW%2fz1AEsN8RRjymLytA7XcLSvX15JeAKTTfx1%0ahJxhdxLS5eBaklyYu36a5jyGgzDsP1RrErnnBRUsOEoJvrPo3HHfiQikCb5JHR3rfHgesnWnjWsw%0aQeiBFXPvFqMdTKu2TbY%3d; Path=/'
  },
  userId: [
    '110548084'
  ],
  accptPath: [
    '500'
  ],
  accptPathCd: [
    '500'
  ],
  ordsid: [
    '300074232054'
  ],
  catalogId: [
    '97001'
  ],
  statusReason: 'OK',
  pageData: [
    '[{"currency":"KRW","totaltaxshipping":"0","lockedOrderYn":"N","paymCncls":[{"ordersId":"300074232054","productDesc":"[TV]프로닥스 시트세제 1팩(15매)","payAmt":"9900","payType":"500","goodsCode":"28233676","cancelType":"PRE","paySchdAmt":"0","paySeq":"1","pstAmt":"0","requestCommand":"CancelPay","newHistSeq":"2020081203930722"}],"settype":"ALL","newHistSeq":"2020081203930722","storeentId":"13001","shipascomplete":"Y","totalproduct":"0","hasCantTraceCardYn":"N","refundAccntList":[{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"산업은행","accntOwner":"","bankCd":"02"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"KEB하나은행","accntOwner":"","bankCd":"81"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"국민은행","accntOwner":"","bankCd":"04"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"수협","accntOwner":"","bankCd":"07"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"농협","accntOwner":"","bankCd":"11"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"우리은행","accntOwner":"","bankCd":"20"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"SC제일은행","accntOwner":"","bankCd":"23"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"신한은행","accntOwner":"","bankCd":"26"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"대구은행","accntOwner":"","bankCd":"31"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"부산은행","accntOwner":"","bankCd":"32"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"광주은행","accntOwner":"","bankCd":"34"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"제주은행","accntOwner":"","bankCd":"35"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"전북은행","accntOwner":"","bankCd":"37"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"경남은행","accntOwner":"","bankCd":"39"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"시티은행","accntOwner":"","bankCd":"53"},{"_classname":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","accntNo":"","class":"com.ns.commerce.nsmypage.bean.NSRefundAccountBean","_type":"JavaClass","selected":"","bankNm":"기업은행","accntOwner":"","bankCd":"03"}],"catType":"1","refundAmt":"9900","totaladjustment":"0","orderitems":[{"modDlvrDcAmt":"0","cancelInfo":{"ordersId":"300074232054","occurType":"600"},"price":"9900","quantity":"1","catentryIdOrg":"10212323292","exchangeQuantity":"0","memberId":"110548084","catentryId":"10212323292","returnQuantity":"1","stdAmount":"9900","custChargeYn":"N","ordersId":"300074232054","buschnId":"MOBIL","cancelQuantity":"0","dlvrDcAmt":"0","totalproduct":"9900","modQuantity":"0","orderitemsId":"262206255","addressId":"20654514011","shipcharge":"0","exchangeInfo":{"ordersId":"300074232054","occurType":"200"},"totaladjustment":"0","orderSeq":"1","ordercatsKey":"300074232054_20654514011_10212323292_S","addressIdOrg":"20654514011","rmashipcharge":"0","returnInfo":{"ordersId":"300074232054","phone13":"1234","occurType":"100","rsn":"460","phone11":"010","rsnDesc":"고객사유","phone12":"1234","rsnDtl":"테스트"},"refundInfo":{"accntNo":"359987123456","accntOwner":"김테이","bankCd":"02","bankNm":"산업은행","newHistSeq":"2020081203930722","ordersId":"300074232054","refundAmt":"9900","type":"2","typeDesc":"계좌"}}],"currAmt":"9900","pstAmt":"0","addPstAmt":"0","adjustAmt":"-9900","cancCatentryName":"[TV]프로닥스 시트세제 1팩(15매)","orderLastPaySeq":"1","taxbillreceiptAmount":"9900","validPayYn":"Y","totalpayment":"9900","changeitem":"N","cancGoodsCd":"28233676","cancelProcType":"PRE","timeplaced":"2020-08-12","payms":[{"payAmt":"9900","paymenttype":"POINT","paySchdAdjustAmt":"9900","payTypeCnt":"1","availAdjustAmt":"0","cancelProcType":"PRE","displayorder":" 00040","payDttm":"2020.08.12 08:21","paymentname":"예치금 사용","paySchdAmt":"9900","payClssfNm":"승인","paySeq":"1","availAmt":"9900","paymdtls":[{"payAmt":"9900","payDttm":"2020.08.12 08:21:11","apprNo":"-","relNm":"","payDt":"2020/08/12","availAmt":"9900","relNo":"***-****-****"}],"ordersId":"300074232054","totalPayment":"9900","cancelDttm":null,"priority":"7","stdAmt":"9900","pstAdjustAmt":"0","payTypeSum":"9900","paymentpath":"INTERNAL","receiptYn":"Y","oneTouchYn":"N","displaytext":"적립금/포인트/예치금 사용","paymentcode":"500","canceltype":"PARTIAL","payClssfCd":"100","pstAmt":"0","payTypeSeq":"1"}],"newShipCharge":"0","rtnExcgNotAvailYn":"N","memberId":"110548084","latestOperationId":null,"cats":[{"statusIndex":"6","totalproductTax":"900","unitCd":"10212323292","catentryName":"[TV]프로닥스 시트세제 1팩(15매)","selfAddress":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"roadZipcode":"13487","phone11":"010","zipcode":"13487","phone12":"1234","phone13":"1234","lotnZipcode":"13487","memberId":"110548084","addrbookId":"26672218","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","lastname":"일이삼사오육칠팔구십","roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"addressId":"20654514011","phone23":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1"},"relaxGb":"N","quantity":"1","btnctrls":[{"btns":"DELIVERY_STATUS","btnnm":"배송조회"},{"btns":"REFUND","btnnm":"반품신청"},{"btns":"EXCHANGE","btnnm":"교환신청"},{"btns":"PRODUCT_COMMENT_WRITE","btnnm":"상품평 쓰기"}],"orgQuantity":"1","orderitemsBillTax":"900","imageUrl":"//product-image.prod-nsmall.com/itemimg/6/28/676/28233676_C.jpg","convinGb":"N","catentryId":"10212323292","availQuantity":"462","displayType":"NORMAL","statusName":"배송완료","addressChangeable":"N","phoneReqDate":null,"orgship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"barOpt":null,"attrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"buschnId":"MOBIL","cancelQuantity":"0","prsntPackYn":"N","steps":[{"step":"주문접수"},{"step":"결제완료"},{"step":"주문전달"},{"step":"상품준비중"},{"step":"배송중"},{"step":"배송완료"}],"cnveyNum":null,"createdate":"2020.08.12","totalproduct":"9900","phoneReqClssfNm":null,"modQuantity":0,"addressId":"20654514011","stdOrderitemsId":"262206255","orderSeq":"1","totaladjustment":"0","slctDay":null,"brandName":"프로닥스","exceptionMsg":null,"ordercatsKey":"300074232054_20654514011_10212323292_S","addressSum":"9900","shipchargeSum":"0","ship":{"lotnZipcode1":"13487","lotnZipcode2":null,"phone1":"010-1234-1234","phone2":null,"cardsender":"김테이","orderername":"김테이","message":null,"roadZipcode":"13487","zipcode":"13487","phone11":"010","phone12":"1234","phone13":"1234","lotnZipcode":"13487","addrbookId":"26672218","memberId":"110548084","teltype01":null,"teltype02":null,"businesstitle":null,"lotnAddress1":"경기 성남시 분당구 삼평동","lotnAddress2":"625번지 7","ziptype":"200","email":"wowkny7@nsmall.com","ordersId":"300074232054","lastname":"일이삼사오육칠팔구십","sendType":null,"roadZipcode1":"13487","zipcode1":"13487","roadZipcode2":null,"zipcode2":null,"contactnum":"010-9423-8309","dispAddressPlus":"[13487] 경기 성남시 분당구 판교로228번길 15 1","receiverEmail":null,"orderitemsId":"262206255","phone21":null,"nickname":"일이삼사오육칠팔구십","phone22":null,"phone23":null,"addressId":"20654514011","cardmessage":null,"roadAddress1":"경기 성남시 분당구 판교로228번길 15","address1":"경기 성남시 분당구 판교로228번길 15","roadAddress2":"1","address2":"1","cardreceiver":"일이삼사오육칠팔구십"},"orgattrs":[{"ordersId":"300074232054","attrvalDesc":"프로닥스 시트세제 1팩@","sequence":"10","attrDesc":"옵션","attrvalId":"10","attrId":"1","orderitemsId":"262206255"}],"subProducts":[],"stepOpt":"ir_b_cnts order_step","cancelInfo":{"ordersId":"300074232054","occurType":"600"},"price":"9900","pickupInfo":{"ordersId":"300074232054","deliv_message":"수거 전 연락바랍니다.","addressId":"20654514011","conv_tel11":"","conv_tel12":"","conv_tel13":"","deliv_name":"일이삼사오육칠팔구십","deliv_tel21":"","deliv_ziptype":"200","deliv_tel22":"","deliv_tel11":"010","deliv_tel23":"","deliv_tel12":"1234","deliv_tel13":"1234","deliv_zipcd1":"","businesstitle":"","deliv_addr1":"경기 성남시 분당구 판교로228번길 15","deliv_addr2":"1","type":"2","conv_dt":""},"addressSeq":"1","existAnotherOpts":"Y","flashSaleYn":null,"catentryIdOrg":"10212323292","exchangeQuantity":"0","availQuantitySchdDate":"20200813","memberId":"110548084","addressCnt":"1","goodsCd":"28233676","orderitemsBill":"9900","returnQuantity":"0","custChargeYn":"N","ordersId":"300074232054","msgCardWriteYn":"N","dlvrWayCd1":"10","shipcharge":"0","exchangeInfo":{"ordersId":"300074232054","occurType":"200"},"status":"S","intrv":null,"availQuantityType":"10","commentWriteYn":"Y","rmashipcharge":"0","createdatetime":"2020.08.12 08:20:53","multiCd":null,"dispTypeCd":"10","returnInfo":{"ordersId":"300074232054","phone13":"1234","occurType":"100","rsn":"460","phone11":"010","rsnDesc":"고객사유","phone12":"1234","rsnDtl":"테스트"}}],"cashreceiptAmount":"9900","ordersId":"300074232054","lastupdateall":"20200812082111","newAddrs":[{}],"media":"모바일","ourCoPayYn":"Y","totaltax":"0","addAmt":"0","orderdiscs":[],"refundActSum":"9900","preCancelYn":"N","totalshipping":"0","status":"M","newRmaShipCharge":"0","jobtype":"RETURN","totalstdamount":"9900","cpBnftVal":"0","pstRefundAvailYn":"Y","totalavailpayment":"9900","refundInfo":{"accntNo":"359987123456","accntOwner":"김테이","bankCd":"02","bankNm":"산업은행","newHistSeq":"2020081203930722","ordersId":"300074232054","refundAmt":"9900","type":"2","typeDesc":"계좌"}}]'
  ],
  storeId: [
    '13001'
  ],
  isSuccessful: true,
  subTasknm: [
    'execute'
  ],
  tranId: 'webapp/wcs/stores/servlet/NSChangeOrderCmd',
  langId: [
    '-9'
  ],
  responseTime: 3499,
  counselorOrderCancel: [
    'Y'
  ],
  totalTime: 3503,
  req_co_cd: [
    '110'
  ],
  custNum: '44491294',
  mobAPI: [
    'NSChangeOrderCmd'
  ],
  uuid: [
    '28b9f761-3a30-4850-a303-730037d262bd'
  ],
  accessTm: [
    '20200812092832450'
  ],
  statusCode: 200
}

export { TEMP_M_INPUTPARAMS, TEMP_REQ_DATA1, TEMP_RES_DATA1, TEMP_REQ_DATA2, TEMP_RES_DATA2, TEMP_REQ_DATA3, TEMP_RES_DATA3, TEMP_REQ_DATA4, TEMP_RES_DATA4, TEMP_REQ_DATA5, TEMP_RES_DATA5, TEMP_REQ_DATA6, TEMP_RES_DATA6 }
