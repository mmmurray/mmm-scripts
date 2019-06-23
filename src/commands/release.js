const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const release = async projectRoot => {
  await spawn(getBinPath('semantic-release'), [], projectRoot)
}

module.exports = release
