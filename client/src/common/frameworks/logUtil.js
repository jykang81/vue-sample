'use strict'

import COMM_CONST from '@constants/framework/constants'
import CONST from '@/common/constants/framework/framework'
import axios from 'axios'
import {
  format
} from '@frameworks/dateutil/dateUtil'
import localStorageUtil from '@frameworks/localStorageUtil'

const nslogAxios = axios.create({
  baseURL: CONST.LOG.STREAM.URL.BASE
})

/**
 * @class
 * @since 2020.03.13
 * @author YongcheolKwon
 */
class KinesisSender {
  /**
   * @constructor
   */
  constructor () {
    this._isSendReady = false
    this._kinesisMockingApiGatewayUrl = CONST.LOG.STREAM.URL.BASE
    this._mode = process.env.NODE_ENV
    this.initMetaData()
  }

  /**
   * @memberof KinesisSender
   * @description 필요한 메타데이터 생성 처리
   * e.g. this.initMetadata()
   */
  initMetaData () {
    this.setUserAgent()
  }

  /**
   * @memberof KinesisSender
   * @description UserAgent값을 내부변수에 저장 처리
   * e.g. this.setUserAgent()
   */
  setUserAgent () {
    this._userAgent = navigator.userAgent
  }

  /**
   * @memberof KinesisSender
   * @description 내부변수에 설정된 UserAgent값을 반환
   * e.g. this.getUserAgent
   * @returns {string} Returns `UserAgent` string
   */
  get getUserAgent () {
    return this._userAgent
  }

  /**
   * @memberof KinesisSender
   * @description 프로젝트 모드에 따른 로그 등록여부 반환
   * e.g. KinesisSender.isAllowLog
   * @returns {boolean} Returns `true`, `false`
   */
  get isAllowLog () {
    return (CONST.IS_ALLOW_LOG)
  }

  /**
   * @memberof KinesisSender
   * @description Kinesis DataStream 단건 전송 URL 반환
   * e.g. KinesisSender.getRecordSendUrl
   */
  get getRecordSendUrl () {
    return CONST.LOG.STREAM.URL.SINGLE
  }

  /**
   * @memberof KinesisSender
   * @description Kinesis DataStream 발송 단건 레코드 데이터 생성
   * e.g. KinesisSender.makeRecord(data)
   * @param {object} data 전송할 로그 데이터
   */
  makeRecord (data) {
    this._data = {
      Data: Buffer.from(`${JSON.stringify(data)}\n`).toString('base64'),
      PartitionKey: data.request_id
    }
  }

  /**
   * @memberof KinesisSender
   * @description Kinesis DataStream 전송 단건 레코드 데이터 반환
   * e.g. KinesisSender.getRecord
   */
  get getRecord () {
    return this._data
  }

  /**
   * @memberof KinesisSender
   * @description Kinesis DataStream 단건 레코드 전송
   * e.g. KinesisSender.sendRecord()
   */
  sendRecord () {
    if (this.isAllowLog) {
      nslogAxios.put(
        this.getRecordSendUrl,
        this.getRecord)
    } else {
      if (!CONST.IS_TEST_REPORT) { // unit test 환경이 아닐 때
        console.info(CONST.LOG.MESSAGE.REQUEST.LOCAL_MODE)
      }
    }
  }
}

const nslog = {
  kinesisSender: new KinesisSender(),
  /**
   * @memberof nslog
   * @description 전송할 로그 데이터 검증
   * e.g. nslog.validate(type, args)
   * @param {string} type 전송할 로그 타입
   * @param {array} args 전송할 Arguments
   * @returns {boolean} Returns `true`, `false`
   */
  validate: (type, args) => {
    if (type === undefined) {
      console.log(CONST.LOG.MESSAGE.VALID.TYPE_NOT_VALID)
      return false
    }
    if (args.length === 0) {
      console.log(CONST.LOG.MESSAGE.VALID.ARGS_LENGTH_ZERO)
      return false
    }
    return true
  },

  /**
   * @memberof nslog
   * @description WCS API 호출 로그 단건 레코드 생성
   * e.g. nslog.makeRecord(args)
   * @param {array} args 전송할 Arguments
   */
  makeRecordByWCSApiCall (args) {
    const apiUrl = args.url
    const request = args.request
    const response = args.response
    const status = args.status
    const page = args.page
    const view = args.view

    const data = {
      request_id: localStorageUtil.get(COMM_CONST.STORAGE_KEY.UUID),
      view,
      page,
      user_agent: this.kinesisSender.getUserAgent,
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      status,
      api: {
        url: apiUrl,
        request,
        response
      },
      error: {
        type: '',
        message: '',
        trace: ''
      }
    }
    this.kinesisSender.makeRecord(data)
  },

  /**
   * @memberof nslog
   * @description Runtime Error 로그 단건 레코드 생성
   * e.g. nslog.makeRecordByError(args)
   * @param {array} args 전송할 Arguments
   */
  makeRecordByError (args) {
    const errorType = args.type
    const errorMessage = args.message
    const errorTrace = args.trace
    const status = args.status
    const page = args.page
    const view = args.view

    const data = {
      request_id: localStorageUtil.get(COMM_CONST.STORAGE_KEY.UUID),
      view,
      page,
      user_agent: this.kinesisSender.getUserAgent,
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      status,
      api: {
        url: '',
        request: '',
        response: ''
      },
      error: {
        type: errorType,
        message: errorMessage,
        trace: JSON.stringify(errorTrace)
      }
    }
    this.kinesisSender.makeRecord(data)
  },

  /**
   * @memberof nslog
   * @description 로그 데이터 단일 전송
   * e.g. nslog.sendRecord(type, ...args)
   * @param {string} type 전송 타입 `ERROR`, `REQUEST`, `RESPONSE`
   * @param {array} args 전송할 Arguments
   */
  sendRecord (type, ...args) {
    if (!this.validate(type, args)) {
      return
    }

    switch (type) {
      case CONST.LOG.TYPE.ERROR:
        this.makeRecordByError(args[0])
        break
      case CONST.LOG.TYPE.RESPONSE:
        this.makeRecordByWCSApiCall(args[0])
        break
    }

    this.kinesisSender.sendRecord()
  }
}

export default nslog
