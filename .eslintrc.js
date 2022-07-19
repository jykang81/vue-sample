module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  ignorePatterns: ['client/public/js/*'],
  rules: {
    'vue/max-attributes-per-line': 'off',
    'no-restricted-imports': ['error', {
        'patterns': ['../*', './*']
      }
    ],
    'curly': ['error', 'all'],
    'import/extensions': ['error', 'never', {
      'png': 'always',
      'jpg': 'always',
      'jpeg': 'always',
      'gif': 'always',
      'svg': 'awlays'
    }],
    'object-shorthand': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],
    'prefer-template': 'error'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
