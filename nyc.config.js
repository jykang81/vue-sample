module.exports = {
  extension: [
    '.js',
    '.vue'
  ],
  exclude: [
    'client/dist/**',
    'client/src/common/directives/**',
    'client/src/common/plugins/**',
    'client/src/main.js',
    'client/src/router/**',
    'client/src/**/*Test.*',
    'client/tests/**',
    '**/sampleSimple.js',
    '**/sample.js',
    '**/native/**'
  ],
  reporter: [
    'lcov',
    'text',
    'text-summary'
  ]
}
