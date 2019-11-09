import { ConfigGenerator } from './types'

const eslintGenerator: ConfigGenerator = async () => ({
  scripts: {
    'test:lint': 'mmm test:lint',
  },
  files: [
    {
      path: '.eslintrc.js',
      contents: `module.exports = require('mmm-scripts/eslint')\n`,
    },
    {
      path: '.eslintignore',
      contents: ['**/*.js', '**/generated/**', ''].join('\n'),
    },
  ],
})

export { eslintGenerator }
