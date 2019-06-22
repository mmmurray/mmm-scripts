const { exists } = require('fs-extra')
const { join } = require('path')
const spawn = require('../helpers/spawn')

const ensureGitHooks = async projectRoot => {
  if (await exists(join(projectRoot, '.git', 'hooks', 'pre-commit'))) {
    return
  }

  return spawn(
    'node',
    [
      join(require.resolve('husky/husky')),
      'install',
      join(projectRoot, 'node_modules', 'husky'),
    ],
    projectRoot,
  )
}

module.exports = ensureGitHooks
