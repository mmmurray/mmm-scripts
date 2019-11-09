import { spawnSync } from 'child_process'

const spawn = async (
  command: string,
  args: string[],
  cwd: string,
  env: { [name: string]: string } = {},
) => {
  const { status } = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  })

  if (status !== 0) {
    throw new Error(`${command} failed`)
  }
}

export { spawn }
