import { ConfigGenerator } from './types'

const jestGenerator: ConfigGenerator = async () => ({
  scripts: {
    jest: 'mmm jest',
    'test:coverage': 'mmm test:coverage',
  },
  files: [],
})

export { jestGenerator }
