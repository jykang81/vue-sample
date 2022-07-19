var fs = require('fs')
var path = require('path')
var extend = require('extend')
var log = require('fancy-log')
var readPackage = require('read-pkg').sync
var slugify = require('slugify')
var get = require('lodash.get')
var uniq = require('lodash.uniq')
// var os = require("os");

function defineSonarQubeScannerParams (
  params,
  projectBaseDir,
  sqScannerParamsFromEnvVariable
) {
  // #1 - set default values
  var sonarqubeScannerParams = {}
  try {
    var sqFile = path.join(projectBaseDir, 'sonar-project.properties')
    fs.accessSync(sqFile, fs.F_OK)
    // there's a 'sonar-project.properties' file - no need to set default values
  } catch (e) {
    // No 'sonar-project.properties' file - let's add some default values
    extend(sonarqubeScannerParams, {
      'sonar.projectDescription': 'No description.',
      'sonar.sources': '.',
      'sonar.exclusions': [
        'node_modules/**',
        'bower_components/**',
        'jspm_packages/**',
        'typings/**',
        'lib-cov/**',
        'client/public/**',
        'client/src/views/event/ApplicationEvent.vue',
        'client/src/components/product/ReportReview.vue',
        'client/src/common/common/kakao.min.js' // external script
      ].join(',')
    })

    // If there's a 'package.json' file, read it to grab info
    try {
      extractInfoFromPackageFile(sonarqubeScannerParams, projectBaseDir, params)
    } catch (e) {
      // No 'package.json' file (or invalid one) - let's remain on the defaults
      log(`No 'package.json' file found (or no valid one): ${e.message}`)
      log('=> Using default settings.')
    }
  }

  // #2 - if SONARQUBE_SCANNER_PARAMS exists, extend the current params
  if (sqScannerParamsFromEnvVariable) {
    extend(sonarqubeScannerParams, sqScannerParamsFromEnvVariable)
  }

  // #3 - check what's passed in the call params - these are prevalent params
  if (params.serverUrl) {
    sonarqubeScannerParams['sonar.host.url'] = params.serverUrl
  }
  if (params.token) {
    sonarqubeScannerParams['sonar.login'] = params.token
  }
  if (params.options) {
    extend(sonarqubeScannerParams, params.options)
  }

  return sonarqubeScannerParams
}

function extractInfoFromPackageFile (sonarqubeScannerParams, projectBaseDir, params) {
  const invalidCharacterRegex = /[?$*+~.()'"!:@/]/g
  var packageFile = path.join(projectBaseDir, 'package.json')
  var pkg = readPackage(packageFile)
  log('Getting info from "package.json" file')
  function fileExistsInProjectSync (file) {
    return fs.existsSync(path.resolve(projectBaseDir, file))
  }
  function dependenceExists (pkgName) {
    return ['devDependencies', 'dependencies', 'peerDependencies'].some(
      function (prop) {
        return pkg[prop] && pkgName in pkg[prop]
      }
    )
  }
  if (pkg) {
    sonarqubeScannerParams['sonar.projectKey'] = slugify(`${pkg.name}-${params.currentStage}`, {
      remove: invalidCharacterRegex
    })
    sonarqubeScannerParams['sonar.projectName'] = `${pkg.name}-${params.currentStage}`
    sonarqubeScannerParams['sonar.projectVersion'] = pkg.version
    if (pkg.description) {
      sonarqubeScannerParams['sonar.projectDescription'] = pkg.description
    }
    if (pkg.homepage) {
      sonarqubeScannerParams['sonar.links.homepage'] = pkg.homepage
    }
    if (pkg.bugs && pkg.bugs.url) {
      sonarqubeScannerParams['sonar.links.issues'] = pkg.bugs.url
    }
    if (pkg.repository && pkg.repository.url) {
      sonarqubeScannerParams['sonar.links.scm'] = pkg.repository.url
    }

    uniq(
      [
        // jest coverage output directory
        // See: http://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
        'jest.coverageDirectory',
        // nyc coverage output directory
        // See: https://github.com/istanbuljs/nyc#configuring-nyc
        'nyc.report-dir'
      ]
        .map(function (path) {
          return get(pkg, path)
        })
        .filter(Boolean)
        .concat(
          // default coverage output directory
          'coverage'
        )
    ).find(function (lcovReportDir) {
      var lcovReportPath = path.posix.join(lcovReportDir, 'lcov.info')
      if (fileExistsInProjectSync(lcovReportPath)) {
        sonarqubeScannerParams['sonar.exclusions'] +=
          `,${path.posix.join(lcovReportDir, '**')}`
        // https://docs.sonarqube.org/display/PLUG/JavaScript+Coverage+Results+Import
        sonarqubeScannerParams[
          'sonar.javascript.lcov.reportPaths'
        ] = lcovReportPath
        // TODO: use Generic Test Data to remove dependence of SonarJS, it is need transformation lcov to sonar generic coverage format
        return true
      }
    })

    if (
      dependenceExists('mocha-sonarqube-reporter') &&
      fileExistsInProjectSync('xunit.xml')
    ) {
      // https://docs.sonarqube.org/display/SONAR/Generic+Test+Data
      sonarqubeScannerParams['sonar.testExecutionReportPaths'] = 'xunit.xml'
    }
    // TODO: use `glob` to lookup xunit format files and transformation to sonar generic report format
  }
}

function prepareExecEnvironment (params, process) {
  // Define what the SQ Scanner params must be
  var processEnvParams = {}
  if (process.env.SONARQUBE_SCANNER_PARAMS) {
    processEnvParams = JSON.parse(process.env.SONARQUBE_SCANNER_PARAMS)
  }
  var sqScannerParams = defineSonarQubeScannerParams(
    params,
    process.cwd(),
    processEnvParams
  )

  // We need to merge the existing env variables (process.env) with the SQ ones
  var mergedEnv = {}
  extend(mergedEnv, process.env, {
    SONARQUBE_SCANNER_PARAMS: JSON.stringify(sqScannerParams)
  })

  // this is the actual object that the process.exec function is waiting for
  var optionsExec = {
    env: mergedEnv,
    stdio: [0, 1, 2],
    // Increase the amount of data allowed on stdout or stderr
    // (if this value is exceeded then the child process is killed).
    // TODO: make this customizable
    maxBuffer: 1024 * 1024
  }

  return optionsExec
}

module.exports.prepareExecEnvironment = prepareExecEnvironment
