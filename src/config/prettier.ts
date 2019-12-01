import { formatJSONFile } from '../helpers/file'
import { ConfigGenerator } from './types'

const prettierGenerator: ConfigGenerator = async () => ({
  scripts: {
    format: 'mmm format',
  },
  files: [
    {
      path: '.prettierrc',
      contents: formatJSONFile({
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
      }),
    },
  ],
})

export { prettierGenerator }
