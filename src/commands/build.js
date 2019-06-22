const { emptyDir } = require('fs-extra')
const { join } = require('path')
const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const build = async projectRoot => {
  await emptyDir(join(projectRoot, 'lib'))
  await spawn(getBinPath('tsc'), [], projectRoot)
}

module.exports = build
