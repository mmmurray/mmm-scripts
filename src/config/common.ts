import { ConfigGenerator } from './types'

const commonGenerator: ConfigGenerator = async () => ({
  scripts: {
    build: 'mmm build',
    dev: 'mmm dev',
    test: 'mmm test',
  },
  files: [],
})

export { commonGenerator }
