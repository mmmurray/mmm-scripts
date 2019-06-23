const getBinPath = require('../helpers/bin-path')
const spawn = require('../helpers/spawn')

const lint = async ({ projectRoot, test }) => {
  if (!test.includes('eslint')) {
    console.log('Skipping since eslint missing in test option:', test)
    return
  }

  await spawn(
    getBinPath('eslint'),
    ['--ext', '.ts,.tsx', 'src', 'test'],
    projectRoot,
  )
}

module.exports = lint
