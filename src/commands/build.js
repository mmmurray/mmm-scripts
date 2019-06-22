const { copy } = require('fs-extra')
const { join } = require('path')
const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const ensureConfigFile = async projectRoot => {
  await copy(
    join(__dirname, '..', '..', 'tsconfig.json'),
    join(projectRoot, 'tsconfig.json'),
  )
}

const build = async () => {
  const projectRoot = process.cwd()
  await ensureConfigFile(projectRoot)
  await spawn(getBinPath('tsc'), [], projectRoot)
}

module.exports = build
