
const redirectLink = {
  path: '/',
  children: [
    {
      path: 'MainView',
      redirect: { name: 'storeHome' }
    },
    {
      path: 'MemberLogin',
      redirect: { name: 'memberLogin' }
    },
    {
      path: 'sendSMSView',
      redirect: { name: 'storeHome' }
    },
    {
      path: 'SuperHotMain',
      redirect: { name: 'happyDeal' }
    },
    {
      path: 'NSHappyDealView',
      redirect: { name: 'happyDeal' }
    },
    {
      path: 'TVHomeShoppingView',
      redirect: { name: 'tvScheduleTableBase' }
    },
    {
      path: 'Setting',
      redirect: { name: 'mypageSetting' }
    },
    {
      path: 'NSExhibit',
      redirect: { name: 'exhibitionDetail' }
    },
    {
      path: 'NSTimesPrmtView',
      redirect: to => ({
        name: 'exhibitionDetail',
        query: {
          catgroupId: to.query.cate1Code
        }
      })
    },
    {
      path: 'ProductDisplay',
      redirect: to => ({
        name: 'productDetail',
        params: {
          number: to.query.partNumber
        },
        query: {}
      })
    },
    {
      path: 'NSNotYetReviewedList',
      redirect: {
        name: 'managementMyReview',
        params: {
          type: 'unregistered'
        }
      }
    },
    {
      path: 'NSReviewList',
      redirect: {
        name: 'managementMyReview',
        params: {
          type: 'registered'
        }
      }
    },
    {
      path: 'NSPresent',
      redirect: { name: 'attendanceEvent' }
    },
    {
      path: 'NSTimesCheckAttendance',
      redirect: { name: 'attendanceEvent' }
    },
    {
      path: 'NSMypage',
      redirect: { name: 'mypageMain' }
    },
    {
      path: 'NSTimesEvent',
      redirect: to => ({
        name: 'applicationEvent',
        params: {
          offerId: to.query.offer_id
        },
        query: to.query
      })
    }
  ]
}

export default redirectLink
