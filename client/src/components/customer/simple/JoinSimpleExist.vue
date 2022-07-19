<template>
  <div class="join_simple_exist">
    <div
      v-if="param.entFlag === 'NAVER'"
      class="join_simple_exist_sns"
    >
      <i class="icons_naver" />
      <strong class="subject">
        해당 네이버 계정으로 이미 가입되어 있습니다.
      </strong>
    </div>
    <div
      v-if="param.entFlag === 'KAKAO'"
      class="join_simple_exist_sns"
    >
      <i class="icons_kakao" />
      <strong class="subject">
        해당 카카오 계정으로 이미 가입되어 있습니다.
      </strong>
    </div>
    <div
      v-if="param.entFlag === 'PAYCO'"
      class="join_simple_exist_sns"
    >
      <i class="icons_payco" />
      <strong class="subject">
        해당 페이코 계정으로 이미 가입되어 있습니다.
      </strong>
    </div>
    <div
      v-if="param.entFlag === 'FACEBOOK'"
      class="join_simple_exist_sns"
    >
      <i class="icons_facebook" />
      <strong class="subject">
        해당 페이스북 계정으로 이미 가입되어 있습니다.
      </strong>
    </div>
    <p class="join_simple_guide">
      기존 아이디와 연결하시거나 다른 방법으로 회원가입 하세요.
    </p>
    <a
      class="btn_linkage"
      @click="parentsCall('memberConnect')"
    >
      <span>연결하기</span>
    </a>
    <a
      class="btn_join"
      @click="parentsCall('nsJoin')"
    >
      <span>회원가입</span>
    </a>
    <div class="join_simple_sns">
      <div class="title">
        <span>SNS 계정 회원가입</span>
      </div>
      <!-- 선택한 SNS 외 나머지 SNS 회원가입만 노출 -->
      <ul>
        <li
          v-if="param.entFlag !== 'NAVER'"
        >
          <a
            class="btn_sns naver"
            @click="parentsCall('callNaver')"
          >
            <span>네이버 계정으로 회원가입</span>
          </a>
        </li>
        <li
          v-if="param.entFlag !== 'KAKAO'"
        >
          <a
            class="btn_sns kakao"
            @click="parentsCall('callKakao')"
          >
            <span>카카오 계정으로 회원가입</span>
          </a>
        </li>
        <li
          v-if="param.entFlag !== 'PAYCO'"
        >
          <a
            class="btn_sns payco"
            @click="parentsCall('callPayco')"
          >
            <span>페이코 계정으로 회원가입</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import {
  viewType
} from '@utils/commonutil/commonUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import NATIVE_CONST from '@constants/framework/native'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      rtnData: {}
    }
  },
  mounted () {
    if (viewType() === 'ios') {
      localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.SIMPLE_LOGIN_PATH, '/customer/join')
    }
    // 마케팅 스크립트 적용 부분
    // SNS 계정 페이지 뷰 강제 로깅
    // let snsTypeName = ''
    // if (this.param.entFlag === 'NAVER') {
    //   snsTypeName = '네이버'
    // } else if (this.param.entFlag === 'KAKAO') {
    //   snsTypeName = '카카오'
    // } else if (this.param.entFlag === 'PAYCO') {
    //   snsTypeName = '페이코'
    // } else if (this.param.entFlag === 'FACEBOOK') {
    //   snsTypeName = '페이스북'
    // }
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true,
        subparams: {
          t1: '로그인',
          t2: '회원가입',
          t3: '계정연결',
          t4: '기존아이디와연결' // `${snsTypeName}계정연결`
        }
      }
    })
  },
  methods: {
    /**
     * 해당 팝업을 호출한 부모창에 데이터를 돌려준다.
     *
     * @param {String} fnType 간편로그인/가입 구분
     */
    parentsCall (fnType) {
      this.rtnData = this.param
      this.rtnData.fnType = fnType
      this.$store.commit('popup/hide', this.rtnData)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/customer/simple/JoinSimpleExist";
</style>
