const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const precommit = async projectRoot => {
  await spawn(getBinPath('commitlint'), ['-E', 'HUSKY_GIT_PARAMS'], projectRoot)
}

module.exports = precommit
