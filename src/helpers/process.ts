import { exec, spawn } from 'child_process'

const execShell = (
  executable: string,
  args: string[],
  cwd?: string,
): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const command = `${executable} ${args.join(' ')}`
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      if (stderr) {
        reject(new Error(`${command} failed: ${stderr}`))
      }
      resolve(stdout)
    })
  })

const execProcess = (
  executable: string,
  args: string[],
  cwd?: string,
): Promise<number> =>
  new Promise((resolve, reject) => {
    const ps = spawn(executable, args, {
      cwd: cwd,
      stdio: 'inherit',
    })

    ps.on('close', (code) => {
      if (code === 0) {
        resolve(0)
      } else {
        reject(new Error(`${executable} ${args.join(' ')} failed in ${cwd}`))
      }
    })
  })

export { execShell, execProcess }
