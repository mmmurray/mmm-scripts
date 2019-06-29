const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const compile = async ({ projectRoot }) => {
  await spawn(getBinPath('tsc'), ['--noEmit'], projectRoot)
}

module.exports = compile
