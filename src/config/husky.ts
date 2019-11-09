import { formatJSONFile } from '../helpers/file'
import { ConfigGenerator } from './types'

const huskyGenerator: ConfigGenerator = async () => ({
  scripts: {},
  files: [
    {
      path: 'commitlint.config.js',
      contents: `module.exports = require('mmm-scripts/commitlint')\n`,
    },
    {
      path: '.huskyrc',
      contents: formatJSONFile({
        hooks: {
          'commit-msg': 'mmm precommit',
        },
      }),
    },
  ],
})

export { huskyGenerator }
