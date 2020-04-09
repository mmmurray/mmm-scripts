import { formatJSONFile } from '../helpers/file'
import { ConfigGenerator } from './types'

const prettierOptions = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
} as const

const prettierGenerator: ConfigGenerator = async () => ({
  scripts: {
    format: 'mmm format',
  },
  files: [
    {
      path: '.prettierrc',
      contents: formatJSONFile(prettierOptions),
    },
  ],
})

export { prettierGenerator, prettierOptions }
