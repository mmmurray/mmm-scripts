const { exists } = require('fs-extra')
const { join } = require('path')
const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const lint = async ({ projectRoot, test }) => {
  if (!test.includes('eslint')) {
    console.log('Skipping since eslint missing in test option:', test)
    return
  }

  const lintDirectories = [
    ...((await exists(join(projectRoot, 'src'))) ? ['src'] : []),
    ...((await exists(join(projectRoot, 'test'))) ? ['test'] : []),
  ]

  if (lintDirectories.length === 0) {
    console.log('Skipping eslint since no lintable directories found')
    return
  }

  await spawn(
    getBinPath('eslint'),
    ['--ext', '.ts,.tsx', ...lintDirectories],
    projectRoot,
  )
}

module.exports = lint
