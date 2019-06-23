const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')
const build = require('./build')

const release = async projectRoot => {
  await build(projectRoot)
  await spawn(getBinPath('semantic-release'), [], projectRoot)
}

module.exports = release
