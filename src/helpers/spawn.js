const { spawnSync } = require('child_process')

const spawn = async (command, args, cwd) => {
  const { status } = spawnSync(command, args, { cwd, stdio: 'inherit' })

  if (status !== 0) {
    throw new Error(`${command} failed`)
  }
}

module.exports = spawn
