const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

const currentEnv = process.env.VUE_APP_ENV

const sourceMapModeGroup = ['local', 'dev'] // source-map 그룹
const isSourceMapMode = sourceMapModeGroup.includes(currentEnv)
const isTestReport = process.env.TEST_REPORT === 'true' // 유닛테스트 전용
const productionBuildModeGroup = ['test', 'prod'] // production build 그룹
const isProductionBuildMode = productionBuildModeGroup.includes(currentEnv)
const optimizeModeGroup = ['dev', 'test', 'prod'] // optimize build 그룹
const isOptimizeMode = optimizeModeGroup.includes(currentEnv)
const compressModeGroup = ['prod'] // compress 그룹 (console.*, debugger 제외)
const isCompressMode = compressModeGroup.includes(currentEnv)
const isLocalMode = process.env.IS_LOCAL_MODE === 'true' // 로컬실행 전용

/**
 * unit test 환경변수설정
 * 아래 단계를 거쳐 CONST.IS_TEST_REPORT 값이 변환됨
 * cross-env TEST_REPORT=true -> isTestReport=true
 * process.env.VUE_APP_IS_TEST_REPORT = true -> CONST.IS_TEST_REPORT = true
 *
 * @param {boolean} isTestReport
 */
function setTestReportEnv (isTestReport) {
  if (isTestReport) {
    process.env.VUE_APP_IS_TEST_REPORT = 'true'
    process.env.NODE_ENV = 'test'
  }
}
setTestReportEnv(isTestReport)

/**
 * 로컬 실행 모드 환경변수 설정
 * 아래 단계를 거쳐 CONST.IS_LOCAL_MODE 값이 변환됨
 * cross-env IS_LOCAL_MODE=true -> isLocalMode=true
 * process.env.VUE_APP_IS_LOCAL_MODE = true -> CONST.IS_LOCAL_MODE = true
 * @param {boolean} isLocalMode
 */
function setIsLocalEnv (isLocalMode) {
  if (isLocalMode) {
    process.env.VUE_APP_IS_LOCAL_MODE = 'true'
  }
}

setIsLocalEnv(isLocalMode)

/**
 * devtool 설정
 * 'eval': 유닛 테스트용
 * 'source-map': 개발용
 * '': 운영
 *
 * @param {boolean} isTestReport 유닛테스트 여부
 * @param {boolean} isSourceMapMode source-map 생성여부
 * @returns {string}
 */
function getDevtool (isTestReport, isSourceMapMode) {
  let devtool

  if (isTestReport) {
    devtool = 'eval'
  } else {
    if (isSourceMapMode) {
      devtool = 'source-map'
    } else {
      devtool = ''
    }
  }

  return devtool
}
const devtool = getDevtool(isTestReport, isSourceMapMode)

/**
 * webpack optimization 설정
 *
 * @param {boolean} isOptimizeMode optimization 여부
 * @param {boolean} isCompressMode compress 여부 (console.*, debugger 제외)
 * @param {boolean} isTestReport unit test flag
 * @returns {object} webpack optimization 설정 객체
 */
function getOptimizationConfig (isOptimizeMode, isCompressMode, isTestReport) {
  let optimization = {}

  if (isTestReport) {
    return optimization
  }

  if (isOptimizeMode) {
    if (isCompressMode) {
      optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true
              },
              output: {
                comments: false
              }
            },
            extractComments: false
          })
        ]
      }
    } else {
      optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              output: {
                comments: false
              }
            },
            extractComments: false
          })
        ]
      }
    }
  }

  return optimization
}
const optimization = getOptimizationConfig(isOptimizeMode, isCompressMode, isTestReport)

/**
 * preload chunk 정규식 조회
 * @param {Array<String>} additionalChunks
 * @returns {Object} 정규식 객체
 */
function getPreloadChunks (additionalChunks) {
  const initialChunks = ['index', 'chunk-vendors']

  const mergedChunks = [...initialChunks, ...additionalChunks]

  const concatedStringChunks = mergedChunks.join('|')

  return new RegExp(`^((?!${concatedStringChunks}).)*$`)
}

const preloadChunks = getPreloadChunks([
  'BaseLayout',
  'storeHome',
  'AppBottomNavi',
  'AppFooter',
  'common-AppInducer',
  'ContainerFullLayer',
  'AppCategory',
  'common-QuantityInput',
  'rightOrderOption'
])

/**
 * mode에 따라서 dns-prefetch 도메인 목록 반환
 * @param {String} mode vue CLI mode (env 파일)
 * @returns {Array<String>|null} 도메인 목록
 */
function getDnsPrefetchDomains (mode) {
  // internal
  const API_HOST = `https:${process.env.VUE_APP_API_HOST}`
  const IMAGE_HOSTS = [`https:${process.env.VUE_APP_NS_IMAGE}`, 'https://image.nsmall.com']
  const AWS_LOG_HOST = 'https://7uz9s9v44m.execute-api.ap-northeast-2.amazonaws.com'

  // external
  // marketing
  const googleAnalyticsDomain = 'https://www.google-analytics.com'

  const aiquaDomains = [
    'https://aiqua-config.c.appier.net',
    'https://aiqua-sdk.c.appier.net'
  ]

  const airbridgeDomains = [
    'https://sdk.airbridge.io',
    'https://core.airbridge.io',
    'https://static.airbridge.io'
  ]

  const etcDomains = [
    'https://cdn.qgr.ph',
    'https://cdn.qgraph.io',
    'https://logger.eigene.io',
    'https://issuer.eigene.io',
    'https://receiver.eigene.io'
  ]

  // mode 구분 없는 공통 도메인
  const commonDomains = [
    API_HOST,
    ...IMAGE_HOSTS,
    AWS_LOG_HOST,
    googleAnalyticsDomain,
    ...aiquaDomains,
    ...airbridgeDomains,
    ...etcDomains
  ]

  let dnsPrefetchDomains

  // mode에 따른 분기처리
  if (mode === 'local') {
    dnsPrefetchDomains = commonDomains
  } else if (mode === 'dev') {
    dnsPrefetchDomains = commonDomains
  } else if (mode === 'test') {
    dnsPrefetchDomains = commonDomains
  } else if (mode === 'prod') {
    dnsPrefetchDomains = commonDomains
  } else {
    return null
  }

  return dnsPrefetchDomains
}

/**
 * 도메인 목록으로부터 dns-prefetch tag 반환
 * @param {Array<String>|null} dnsPrefetchDomains dns-prefetch 도메인 목록
 * @returns {String} dns-prefetch 태그
 */
function generateDnsPrefetchTags (dnsPrefetchDomains) {
  if (dnsPrefetchDomains === null) {
    return null
  }

  const dnsPrefetchArray = dnsPrefetchDomains.map(domain => {
    return `<link rel="dns-prefetch" href="${domain}">`
  })

  const dnsPrefetchTags = dnsPrefetchArray.join('')

  return dnsPrefetchTags
}

const dnsPrefetchDomains = getDnsPrefetchDomains(currentEnv)
const dnsPrefetchTags = generateDnsPrefetchTags(dnsPrefetchDomains)

function generateMetaTags (mode) {
  let url = ''

  if (mode === 'local') {
    url = 'https://local.nsmall.com/'
  } else if (mode === 'dev') {
    url = 'https://devm2.nsmall.com/'
  } else if (mode === 'test') {
    url = 'https://testm2.nsmall.com/'
  } else if (mode === 'prod') {
    url = 'https://mw.nsmall.com/'
  } else {
    return null
  }

  return `<meta content="${url}" property="og:url"></meta>`
}

const metaTags = generateMetaTags(currentEnv)

const CONFIG = {
  /**
   * webpack build 설정 (chaining)
   */
  chainWebpack: config => {
    /**
     * alias 설정. 변수를 특정 경로로 치환
     */
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'client/src'))
      .set('@constants', path.resolve(__dirname, 'client/src/common/constants'))
      .set('@frameworks', path.resolve(__dirname, 'client/src/common/frameworks'))
      .set('@utils', path.resolve(__dirname, 'client/src/common/utils'))
      .set('@components', path.resolve(__dirname, 'client/src/components'))
      .set('@services', path.resolve(__dirname, 'client/src/services'))
      .set('@unit', path.resolve(__dirname, 'client/tests/unit'))

    config
      .plugin('html-index')
      .tap(options => {
        const option = options[0]

        option.dnsPrefetchTags = dnsPrefetchTags // dns-prefetch 태그 목록 추가
        option.metaTags = metaTags // meta 태그 목록 추가

        return options
      })

    config
      .plugin('preload-index') // preload 설정
      .tap(options => {
        const option = options[0]

        // 확장자에 따라서 as attribute value 매핑
        option.as = entry => {
          if (/\.css$/.test(entry)) { return 'style' }
          if (/\.woff$/.test(entry)) { return 'font' }
          if (/\.png$/.test(entry)) { return 'image' }
          return 'script'
        }

        // include 옵션이 제대로 동작하지 않아서,
        // 전체 chunk 포함 후 필터링
        option.include = 'all'
        option.fileBlacklist = [
          ...option.fileBlacklist,
          preloadChunks
        ]

        return options
      })

    config.plugins.delete('prefetch-index') // CLI 기본 prefetch 제거 -> network 요청수 감소
  },
  /**
   * vue cli entry point 지정
   * 기본 값 '.src/main.js'
   */
  pages: {
    index: {
      entry: 'client/src/main.js',
      template: 'client/public/index.html'
    }
  },
  /**
   * webpack development mode 설정
   */
  devServer: {
    https: true, // 로컬에서는 주석처리, 소스커밋할떄는 반드시 주석해제 (mixed content issue)
    host: 'local.nsmall.com',
    contentBase: path.join(__dirname, 'client/public'),
    disableHostCheck: true // APP 에서 local 서버를 IP로 접근하기 위한 설정
  },
  /**
   * build 결과 디렉토리 지정
   * 기본 값 '/dist'
   */
  outputDir: 'client/dist',
  filenameHashing: false,
  /**
   * webpack build 설정
   */
  configureWebpack: {
    plugins: [
      new StyleLintPlugin({ files: ['client/src/assets/styles/**/*.scss'] }), // stylelint 추가
      // new BundleAnalyzerPlugin(),
      new CopyWebpackPlugin([{ from: 'client/public', to: '.' }]) // 배포 결과에 정적 리소스 복사
    ],
    optimization,
    /**
     * 프로젝트 구조와 유사한 source-map 생성
     * chrome developer tools -> sources -> page -> webpack:// -> client/src 확인 가능
     */
    devtool,
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
      publicPath: '/'
    }
  }
}

/**
 * 운영용 build 설정
 * webpack 최적화 처리
 *
 * @param {Object} CONFIG
 * @param {Boolean} isProductionBuildMode production 빌드 설정 여부
 * @param {Boolean} isSourceMapMode source-map 생성 여부
 * @param {Boolean} isTestReport unit test flag
 */
function setProductionBuild (CONFIG, isProductionBuildMode, isSourceMapMode, isTestReport) {
  if (isTestReport) {
    return
  }

  if (isProductionBuildMode) {
    process.env.NODE_ENV = 'production' // 빌드 최적화

    if (!isSourceMapMode) {
      CONFIG.productionSourceMap = false // source-map 미생성
    }
  }
}
setProductionBuild(CONFIG, isProductionBuildMode, isSourceMapMode, isTestReport)

/**
 * css 설정
 * @param {Object} CONFIG
 * @param {Boolean} isTestReport unit test flag
 */
function setCss (CONFIG, isTestReport) {
  if (isTestReport) {
    return
  }

  CONFIG.css = {
    extract: true
  }
}
setCss(CONFIG, isTestReport)

/**
 * build 정보 출력
 */
function printBuildInfo () {
  console.log(`
    ===== build info =====

    NODE_ENV: ${process.env.NODE_ENV}
    env file: .env.${currentEnv}
    devtool: ${devtool}

    ===== build info =====
  `)
}
printBuildInfo()

module.exports = CONFIG
