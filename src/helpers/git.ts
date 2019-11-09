import { join } from 'path'
import { execShell } from './process'

const getChangedFilePaths = async (
  repoPath: string,
  sinceRef: string,
): Promise<string[]> => {
  const output = await execShell(
    'git',
    ['diff', '--name-only', 'HEAD', sinceRef],
    repoPath,
  )

  return output
    .split('\n')
    .filter(Boolean)
    .map(path => join(repoPath, path))
}

export { getChangedFilePaths }
