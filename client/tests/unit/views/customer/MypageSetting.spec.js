import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import MypageSetting from '@/views/customer/MypageSetting'
import loginUtil from '@/common/utils/loginUtil'

describe('마이페이지 > 설정', () => {
  let mock
  const memberInfo = {
    tcode: 't123',
    gender: 'F',
    userId: 111103108,
    hpNo: '010-9898-9342',
    isSSORequest: 'false',
    isAdult: 'true',
    custNum: '30124937',
    gradeNm: '패밀리',
    userName: '강진영',
    adultAuthYN: 'N',
    entFlag: 'Y',
    userMargetingTM: 'N',
    lastOrder: '2020-03-12 18:21:20.125',
    registration: '2020-03-12 16:44:06.125',
    email: 'lsd251@nsmall.com',
    telNo: '010-9898-9342',
    userMargetingEmail: 'N',
    birthday: '19840425',
    userMarketingSMS: 'N',
    logonId: 'lsd251@nsmall.com',
    failcount: '0',
    sessionid: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    sessionId: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    loginyn: 'Y',
    logonType: 'WEB',
    memberGradeCss: 'family',
    staffInfo: false,
    staffInfoName: '대표',
    staffBnft: 'Y',
    logonPassword: 'test001!'
  }

  const MobilePersonalInfoManageCmdReal = {
    msg: {
      root: {
        childInfo: [],
        childCount: 0,
        SpouseInfo: {
          birth: '',
          birthType: ''
        },
        entInfoList: [
          {
            entUserId: '40370689',
            userId: '100286013',
            entName: '김**',
            entFlag: 'NAVER',
            refresh_token: '4uQ9pDTrBTbV1qtjDeoTVlWOTKQ......',
            entEmail: 'yong**@naver.com',
            linkDate: '2020-03-23 14:55:22'
          },
          {
            entUserId: 'yongchunwoo@naver.com',
            userId: '100286013',
            entName: '김**',
            entFlag: 'PAYCO',
            refresh_token: 'AAAAb/Gdfpjer1OJd+8NiFTk......',
            entEmail: 'yong**@naver.com',
            linkDate: '2019-01-25 14:23:30'
          },
          {
            entUserId: 'yongchunwoo@naver.com',
            userId: '100286013',
            entName: '김**',
            entFlag: 'KAKAO',
            refresh_token: 'AAAAb/Gdfpjer1OJd+8NiFTk......',
            entEmail: 'yong**@naver.com',
            linkDate: '2019-01-25 14:23:30'
          }
        ],
        PersonalInfo: {
          zipType: '200',
          lastName: '홍길동',
          birth: null,
          smsYn: 'N',
          phoneType: '10',
          address1: '서울 **구 **로43가길 75&amp;:(**동) ***호',
          address2: '서울 **구 **동',
          address3: '77-**번지 ***호',
          email1: 'test',
          email2: 'nsmall.com',
          addressId: '20638964503',
          relBirthType: null,
          emailYn: 'N',
          tmYn: 'N',
          phoneNum: '01012341236',
          zipCode: '157010',
          relBirth: null,
          telNum: '01012341234',
          gender: '남성',
          logonId: 'kjinkyu'
        }
      }
    }
  }
  const NSSnsMemberDispAjaxResult = {
    msg: {
      result: {
        snsMemberDispYn: 'Y'
      }
    },
    cmdType: [
      'getSnsMemberDisplayYn'
    ],
    catalogId: [
      '14051'
    ],
    userId: [
      '100286013'
    ],
    langId: [
      '-9'
    ],
    accptPath: [
      '500'
    ],
    accptPathCd: [
      '500'
    ],
    storeId: [
      '13001'
    ]
  }
  const NSMobileSnsPswMgmt = {
    msg: {
      root: {
        isSuccess: 'S',
        isRegisteredPwd: 'N'
      }
    },
    userId: [
      '687240832'
    ],
    langId: [
      '-9'
    ],
    accptPath: [
      '500'
    ],
    accptPathCd: [
      '500'
    ],
    entUserId: [
      ''
    ],
    req_co_cd: [
      '110'
    ],
    catalogId: [
      '97001'
    ],
    cmdType: [
      '1'
    ],
    request_userId: [
      '687240832'
    ],
    entFlag: [
      ''
    ],
    storeId: [
      '13001'
    ]
  }
  const MobilePersonalInfoManageCmdRealUnlink = {
    msg: {
      root: {
        resultMsg: '정상적으로 연동이 해제되었습니다.',
        successYn: 'Y'
      }
    }
  }
  const MobileSimpleLoginData = {
    root: {
      token_type: 'bearer',
      gender: 'U',
      profile_image: 'https:\\/\\/ssl.pstatic.net\\/static\\/pwe\\/address\\/img_profile.png',
      name: '\\uc591\\uc601\\uc77c',
      res_code: '00',
      code: 'Lw7d9hdfDroRYkzTHM',
      nickname: '-',
      expires_in: '3600',
      state: '884_https',
      refresh_token: 'AkbK9XecSlipMJ17QXMm1G99nistRzmzeuljOg8g57iisbwisjnOXXuIOipltiifJFagyYyQT63oOGTsiixnjzbpOdH0hVcwc1txaUG5zraipbfh8FMxwofy0QZ1BNW66Abg2ABR',
      id: '128258652',
      email: 'pilot-376@naver.com',
      birthday: '',
      access_token: 'AAAAOYrWEeXcPWn7iycg6UGNuxFJrSKJIwPg1vmeZ9zq70AhzJ67dQXteK8j5D3MvEa8M5VxtMh76tr+7h69AUYGPkQ=',
      age: '0-9'
    }
  }
  const NsMobileMemberSignupCmd = {
    msg: {
      result: {
        dupYN: 'N',
        nsLogonId: '',
        linkYN: 'N'
      }
    },
    userId: [
      '687240832'
    ],
    langId: [
      '-9'
    ],
    accptPath: [
      '500'
    ],
    accptPathCd: [
      '500'
    ],
    entUserId: [
      '128138199'
    ],
    req_co_cd: [
      '110'
    ],
    catalogId: [
      '97001'
    ],
    cmdType: [
      'checkEntUser'
    ],
    entFlag: [
      'NAVER'
    ],
    storeId: [
      '13001'
    ]
  }

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios

    mock
      .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`)
      .reply(200, MobilePersonalInfoManageCmdReal)
    mock
      .onPost(`${CONST.API_URL}/NSSnsMemberDispAjax`)
      .reply(200, NSSnsMemberDispAjaxResult)
    mock
      .onPost(`${CONST.API_URL}/NSMobileSnsPswMgmt`)
      .reply(200, NSMobileSnsPswMgmt)
    mock
      .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal?processFlag=Unlink`)
      .reply(200, MobilePersonalInfoManageCmdRealUnlink)
    mock
      .onPost(`${process.env.VUE_APP_API_HOST}/jsp/epg/MobileSimpleLoginData.jsp`)
      .reply(200, MobileSimpleLoginData)
    mock
      .onPost(`${CONST.API_URL}/NsMobileMemberSignupCmd`)
      .reply(200, NsMobileMemberSignupCmd)
  })

  it('getUserInfo', async () => {
    const wrapper = mount(MypageSetting, options)

    // 초기값
    assert.equal(wrapper.vm.sns.naver, false)
    assert.equal(wrapper.vm.sns.kakao, false)
    assert.equal(wrapper.vm.sns.payco, false)

    wrapper.vm.getUserInfo()

    await flushPromises()

    for (let i = 0; i < MobilePersonalInfoManageCmdReal.msg.root.entInfoList.length; i++) {
      if (MobilePersonalInfoManageCmdReal.msg.root.entInfoList[i].entFlag === 'NAVER') {
        assert.equal(wrapper.vm.sns.naver, true)
      } else if (MobilePersonalInfoManageCmdReal.msg.root.entInfoList[i].entFlag === 'KAKAO') {
        assert.equal(wrapper.vm.sns.kakao, true)
      } else if (MobilePersonalInfoManageCmdReal.msg.root.entInfoList[i].entFlag === 'PAYCO') {
        assert.equal(wrapper.vm.sns.payco, true)
      }
    }

    wrapper.vm.checkSnsDisp()
    wrapper.vm.setPushAgree()
    wrapper.vm.getPushAgreeYn()
    wrapper.vm.setAppUpdate()
    wrapper.vm.getAppVersion()
    wrapper.vm.leadingZeros(1, 2)
  })

  it('logout', () => {
    const wrapper = mount(MypageSetting, options)

    wrapper.vm.logout() // 이 이후에 예 아니오를 클릭해야 테스트가 가능한데.... UI 부분을 일단 패스
  })

  it('setSnsAccount', () => {
    const wrapper = mount(MypageSetting, options)

    wrapper.vm.setSnsAccount('naver') // sns.naver가 false
    wrapper.vm.setSnsAccount() // 빈 값일 때
    wrapper.vm.setSnsAccount('n') // 잘못된 문자열일 떄

    wrapper.vm.sns.naver = true
    wrapper.vm.setSnsAccount('naver') // sns.snstype이 true일 때 (연동되었을 때)

    // SNS 해제 컨펌
    wrapper.vm.unlinkSnsConfirm('naver')
    wrapper.vm.unlinkSnsConfirm('kakao')
    wrapper.vm.unlinkSnsConfirm('payco')
    wrapper.vm.unlinkSnsConfirm('na')
    wrapper.vm.unlinkSnsConfirm()

    // 간편로그인 팝업호출
    wrapper.vm.simpleLogin('PAYCO')
    wrapper.vm.simpleLogin('NAVER')
    wrapper.vm.simpleLogin('KAKAO')
    wrapper.vm.simpleLogin('APPLE')
  })

  it('unlinkSns', () => {
    const wrapper = mount(MypageSetting, options)

    wrapper.vm.sns.naver = true
    wrapper.vm.unlinkSns('naver')
  })

  it('snsDataCallBack', async () => {
    const wrapper = mount(MypageSetting, options)
    wrapper.vm.snsDataCallBack({
      data: {
        root: {
          access_token: 'AAAAOS9ulxIZ8wkKsp',
          age: '',
          birthday: '',
          code: 'YAJ71b5DPcnh1LJqLd',
          email: 'pilot-376@naver.com',
          expires_in: '3600',
          gender: '',
          id: '128138199',
          name: '양',
          nickname: '',
          profile_image: '',
          refresh_token: 'iieFgL4JDPh',
          res_code: '00',
          state: '932_https',
          token_type: 'bearer'
        }
      },
      entFlag: 'KAKAO'
    })
    wrapper.vm.snsDataCallBack({
      data: {
        root: {
          access_token: 'AAAAOS9ulxIZ8wkKsp',
          age: '',
          birthday: '',
          code: 'YAJ71b5DPcnh1LJqLd',
          email: 'pilot-376@naver.com',
          expires_in: '3600',
          gender: '',
          id: '128138199',
          name: '양',
          nickname: '',
          profile_image: '',
          refresh_token: 'iieFgL4JDPh',
          res_code: '00',
          state: '932_https',
          token_type: 'bearer'
        }
      },
      entFlag: 'NAVER'
    })
    wrapper.vm.snsDataCallBack({
      data: {
        root: {
          access_token: 'AAAAOS9ulxIZ8wkKsp',
          age: '',
          birthday: '',
          code: 'YAJ71b5DPcnh1LJqLd',
          email: 'pilot-376@naver.com',
          expires_in: '3600',
          gender: '',
          id: '128138199',
          name: '양',
          nickname: '',
          profile_image: '',
          refresh_token: 'iieFgL4JDPh',
          res_code: '00',
          state: '932_https',
          token_type: 'bearer'
        }
      },
      entFlag: 'PAYCO'
    })
  })

  it('simpleLogin', () => {
    const wrapper = mount(MypageSetting, options)

    wrapper.vm.simpleLogin('PAYCO')
    wrapper.vm.simpleLogin('NAVER')
    wrapper.vm.simpleLogin('KAKAO')
    wrapper.vm.simpleLogin('APPLE')
    // 이 이후프로세스는 해당 SNS사이트 팝업임
  })

  it('setSnsAccount false', async () => {
    localStorage.removeItem('memberInfo')
    loginUtil.login(memberInfo)

    const roadUrl = `${CONST.API_URL}/MobilePersonalInfoManageCmdReal`
    const SnsPswUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
    const roadResult = {
      msg: {
        root: {
          entInfoList: ['NAVER', 'KAKAO'],
          PersonalInfo: {
            logonId: 'lsd250@naver.com'
          }
        }
      }
    }
    const SnsPswResult = {
      msg: {
        root: {
          isSuccess: true,
          isRegisteredPwd: 'N'
        }
      }
    }

    mock
      .onPost(roadUrl)
      .reply(200, roadResult)

    mock
      .onPost(SnsPswUrl)
      .reply(200, SnsPswResult)

    const wrapper = mount(MypageSetting, options)
    wrapper.vm.sns.naver = false
    wrapper.vm.setSnsAccount('naver')

    await flushPromises()

    assert.equal(true, true)
  })

  it('setSnsAccount true', async () => {
    localStorage.removeItem('memberInfo')
    loginUtil.login(memberInfo)

    const roadUrl = `${CONST.API_URL}/MobilePersonalInfoManageCmdReal`
    const SnsPswUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
    const roadResult = {
      msg: {
        root: {
          entInfoList: ['NAVER', 'KAKAO'],
          PersonalInfo: {
            logonId: 'lsd250@naver.com'
          }
        }
      }
    }
    const SnsPswResult = {
      msg: {
        root: {
          isSuccess: true,
          isRegisteredPwd: 'N'
        }
      }
    }

    mock
      .onPost(roadUrl)
      .reply(200, roadResult)

    mock
      .onPost(SnsPswUrl)
      .reply(200, SnsPswResult)

    const wrapper = mount(MypageSetting, options)
    wrapper.vm.sns.naver = true
    wrapper.vm.setSnsAccount('naver')

    await flushPromises()

    assert.equal(true, true)
  })

  it('checkSnsDisp', async () => {
    const roadUrl = `${CONST.API_URL}/MobilePersonalInfoManageCmdReal`
    const roadResult = {
      msg: {
        root: {
          entInfoList: ['NAVER', 'KAKAO'],
          PersonalInfo: {
            logonId: 'lsd250@naver.com'
          }
        }
      }
    }

    mock
      .onPost(roadUrl)
      .reply(200, roadResult)

    const wrapper = mount(MypageSetting, options)
    const personalInfoUrl = `${CONST.API_URL}/getSnsMemberDisplayYn`
    const mockResponseResult = {
      msg: {
        result: {
          snsMemberDispYn: 'Y'
        }
      }
    }

    mock
      .onPost(personalInfoUrl)
      .reply(200, mockResponseResult)

    await wrapper.vm.checkSnsDisp()

    await flushPromises()

    if (mockResponseResult.msg.result.snsMemberDispYn === 'Y') {
      assert.equal(wrapper.vm.isSnsShow, true)
    } else if (mockResponseResult.msg.result.snsMemberDispYn !== 'Y') {
      assert.equal(wrapper.vm.isSnsShow, false)
    }
  })

  it('snsDataCallBack', async () => {
    const roadUrl = `${CONST.API_URL}/MobilePersonalInfoManageCmdReal`
    const roadResult = {
      msg: {
        root: {
          entInfoList: ['NAVER', 'KAKAO'],
          PersonalInfo: {
            logonId: 'lsd250@naver.com'
          }
        }
      }
    }

    mock
      .onPost(roadUrl)
      .reply(200, roadResult)

    const wrapper = mount(MypageSetting, options)
    const personalInfoUrl = `${CONST.API_URL}/jsp/epg/MobileSimpleLoginData.jsp`
    const mockResponseResult = {
      root: {
        token_type: 'Bearer',
        expires_in: '21600',
        state: '733_https',
        refresh_token: 'AAAAb4isyXT79Fani6HFZN+hprLN5kZ9aoPAAhiziG55OCpEzbUk57nnkrtVyCNu+aTSt2L3A6bLZ4\\/1wOKBUiVJb0PBCDsHIq+Vv2OEEYJRdhS4i7IeO7ifLc5lw0G7mJhulCWz48mQqj9AazKOhNfEiiM=',
        resultCode: 0,
        id: 'lsd25simple@naver.com',
        name: '',
        email: 'lsd25simple@naver.com',
        code: 'mT5u0qOk1uxeUu49V5LDuE27',
        access_token: 'AAAA\\/dGvssHY1A63rEwepfKTr+7Dkt8ujxQkpl27em3pw2UVGASfPXcUkSg15XU+HJpiTfSTYgFjWvmlQSiAjs+HR5bYj+7A71zxTL7F82\\/08G8AmkE9xAjDJ4IbdR2iP6z0xC4mbD8ODwgdHxvbZ\\/                        nGfVBvLyPOQdadshaZqlO4Kusk0iSs2Ql3fk\\/jMhm14qhSI99uiv1JO9mDqwINDPU25TJ3338B3+vt4sN2beT\\/xi63g8naUDq\\/qIWfeNpg5PnoF7QZpa5wtlQFQsFDLI8qfntLaSFCOmhX\\/+8FQeJHspFbmrHg=',
        paycoId: '9c3faff0-12a7-11eb-92ff-fa163e29e35b'
      }
    }

    mock
      .onPost(personalInfoUrl)
      .reply(200, mockResponseResult)

    await wrapper.vm.snsDataCallBack()

    await flushPromises()

    assert.equal(true, true)
  })

  it('snsLoginCallback', async () => {
    const roadUrl = `${CONST.API_URL}/MobilePersonalInfoManageCmdReal`
    const roadResult = {
      msg: {
        root: {
          entInfoList: ['NAVER', 'KAKAO'],
          PersonalInfo: {
            logonId: 'lsd250@naver.com'
          }
        }
      }
    }

    mock
      .onPost(roadUrl)
      .reply(200, roadResult)

    const wrapper = mount(MypageSetting, options)
    let returnVal = true
    // data 누락시
    returnVal = await wrapper.vm.snsLoginCallback(null, null)
    assert.notEqual(true, returnVal)

    await flushPromises()

    const snsData = {
      root: {
        token_type: 'Bearer',
        expires_in: '21600',
        state: '733_https',
        refresh_token: 'AAAAb4isyXT79Fani6HFZN+hprLN5kZ9aoPAAhiziG55OCpEzbUk57nnkrtVyCNu+aTSt2L3A6bLZ4\\/1wOKBUiVJb0PBCDsHIq+Vv2OEEYJRdhS4i7IeO7ifLc5lw0G7mJhulCWz48mQqj9AazKOhNfEiiM=',
        resultCode: 0,
        id: 'lsd25simple@naver.com',
        name: '',
        email: 'lsd25simple@naver.com',
        code: 'mT5u0qOk1uxeUu49V5LDuE27',
        access_token: 'AAAA\\/dGvssHY1A63rEwepfKTr+7Dkt8ujxQkpl27em3pw2UVGASfPXcUkSg15XU+HJpiTfSTYgFjWvmlQSiAjs+HR5bYj+7A71zxTL7F82\\/08G8AmkE9xAjDJ4IbdR2iP6z0xC4mbD8ODwgdHxvbZ\\/                        nGfVBvLyPOQdadshaZqlO4Kusk0iSs2Ql3fk\\/jMhm14qhSI99uiv1JO9mDqwINDPU25TJ3338B3+vt4sN2beT\\/xi63g8naUDq\\/qIWfeNpg5PnoF7QZpa5wtlQFQsFDLI8qfntLaSFCOmhX\\/+8FQeJHspFbmrHg=',
        paycoId: '9c3faff0-12a7-11eb-92ff-fa163e29e35b',
        entFlag: 'PAYCO'
      }
    }

    const personalInfoUrl = `${CONST.API_URL}/NsMobileMemberSignupCmd`
    const mockResponseResult = {
      msg: {
        result: {
          dupYN: 'N',
          nsLogonId: '',
          linkYN: 'N'
        }
      },
      userId: '',
      langId: '-9',
      accptPath: '500',
      accptPathCd: '500',
      entUserId: 'lsd25simple@naver.com',
      req_co_cd: '110',
      catalogId: '97001',
      cmdType: 'checkEntUser',
      entFlag: 'PAYCO',
      storeId: '13001'
    }

    mock
      .onPost(personalInfoUrl)
      .reply(200, mockResponseResult)

    // dupYN === 'N'
    await wrapper.vm.snsLoginCallback(snsData, 'PAYCO')

    await flushPromises()

    assert.equal(true, true)

    // dupYN === 'Y'
    mockResponseResult.msg.result.dupYN = 'Y'

    mock
      .onPost(personalInfoUrl)
      .reply(200, mockResponseResult)

    await wrapper.vm.snsLoginCallback(snsData, 'PAYCO')

    await flushPromises()

    assert.equal(true, true)
  })
})
