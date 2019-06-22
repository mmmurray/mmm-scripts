const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const build = async projectRoot => {
  await spawn(getBinPath('tsc'), [], projectRoot)
}

module.exports = build
