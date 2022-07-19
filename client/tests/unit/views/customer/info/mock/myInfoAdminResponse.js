const MobilePersonalInfoManageCmdReal = {
  msg: {
    root: {
      PersonalInfo: {
        address1: '서울 강서구 화곡로43가길 75&amp;:(화곡동) 301호',
        address2: '서울 강서구 우장산동',
        address3: '77-29번지 301호',
        addressId: '20638964503',
        birth: null,
        email1: 'test',
        email2: 'nsmall.com',
        emailYn: 'N',
        gender: '남성',
        lastName: '홍길동',
        logonId: 'kjinkyu',
        phoneNum: '01012341236',
        phoneType: '10',
        relBirth: null,
        relBirthType: null,
        smsYn: 'N',
        telNum: '01012341234',
        tmYn: 'N',
        zipCode: '157010',
        zipType: '200'
      }
    }
  }
}

const NSShippingAddressAccessCmdReal = {
  msg: {
    addressList: [
      {
        addressBas: '서울 강서구 화곡로43가길 75',
        addressBasS: '서울 강서구 우장산동',
        addressDtl: '(화곡동) 301호',
        addressDtlS: '77-29번지 301호',
        address_id: 20639661003,
        isPrimary: 1,
        lastName: '홍길동',
        nadre: '',
        nickName: '테스트',
        phone1: '010-1234-1234',
        phone2: '010-1234-1234',
        zipType: '200',
        zip_code: '157010',
        zip_codeS: '157010'
      }
    ]
  }
}

const NSShippingAddressAccessCmdRealEmpty = {
  msg: {
    addressList: [

    ]
  }
}

export { MobilePersonalInfoManageCmdReal, NSShippingAddressAccessCmdReal, NSShippingAddressAccessCmdRealEmpty }
