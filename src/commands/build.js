const { emptyDir } = require('fs-extra')
const { join } = require('path')
const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')
const { hasLibOutput } = require('../helpers/config')

const build = async ({ projectRoot, ...config }) => {
  if (!hasLibOutput(config)) {
    console.log('Skipping build')
    return
  }

  await emptyDir(join(projectRoot, 'lib'))
  await spawn(getBinPath('tsc'), ['-p', './tsconfig.build.json'], projectRoot)
}

module.exports = build
