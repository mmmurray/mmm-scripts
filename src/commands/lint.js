const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const lint = async projectRoot => {
  await spawn(getBinPath('eslint'), ['--ext', '.ts,.tsx', 'src'], projectRoot)
}

module.exports = lint