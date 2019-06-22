const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const commit = async projectRoot => {
  await spawn(getBinPath('git-cz'), [], projectRoot)
}

module.exports = commit
