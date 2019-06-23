const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')
const build = require('./build')

const release = async config => {
  if (config.type !== 'library') {
    console.log('Skipping release for non library type:', config.type)
    return
  }

  await build(config)
  await spawn(getBinPath('semantic-release'), [], config.projectRoot)
}

module.exports = release
