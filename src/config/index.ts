import fs from 'fs'
import { ensureDir } from 'fs-extra'
import { dirname, join } from 'path'
import { promisify } from 'util'
import { tryReadLines } from '../helpers/file'
import { filterUnique, removeNull } from '../helpers/fn'
import { Project } from '../types'
import { commonGenerator } from './common'
import { eslintGenerator } from './eslint'
import { githubGenerator } from './github'
import { huskyGenerator } from './husky'
import { jestGenerator } from './jest'
import { licenseGenerator } from './license'
import { mmmGenerator } from './mmm'
import { npmGenerator } from './npm'
import { updatePackageManifest } from './package-manifest'
import { prettierGenerator } from './prettier'
import { ConfigFile, ConfigGenerator } from './types'
import { tsGenerator } from './typescript'

const writeFile = promisify(fs.writeFile)

const generators: ConfigGenerator[] = [
  commonGenerator,
  eslintGenerator,
  githubGenerator,
  huskyGenerator,
  jestGenerator,
  licenseGenerator,
  mmmGenerator,
  npmGenerator,
  prettierGenerator,
  tsGenerator,
]

const createConfigWriter = (project: Project) => async (
  file: ConfigFile,
): Promise<string | null> => {
  const filePath = join(project.path, file.path)
  await ensureDir(dirname(filePath))
  await writeFile(filePath, file.contents)
  return file.commit ? null : file.path
}

const defaultIgnores = [
  '.DS_Store',
  '.terraform',
  '.tfplan',
  '*.zip',
  'coverage',
  'node_modules',
  'yarn-error.log',
]

const createGitConfig = (ignores: string[]): ConfigFile => ({
  path: '.gitignore',
  contents:
    filterUnique([...defaultIgnores, ...ignores])
      .sort()
      .join('\n') + '\n',
})

const generateConfig = async (project: Project): Promise<void> => {
  const configWriter = createConfigWriter(project)

  const { scripts, ignores } = (
    await Promise.all(
      generators.map(async (generator) => {
        const { scripts, files } = await generator(project)
        const ignores = removeNull(await Promise.all(files.map(configWriter)))
        return { scripts, ignores }
      }),
    )
  ).reduce(
    (acc, x) => ({
      scripts: { ...acc.scripts, ...x.scripts },
      ignores: [...acc.ignores, ...x.ignores],
    }),
    { scripts: {}, ignores: [] },
  )

  const outputIgnores = project.components.map(
    (component) => component.outputPath,
  )

  const existingIgnores = await tryReadLines(join(project.path, '.gitignore'))

  await configWriter(
    createGitConfig([...existingIgnores, ...ignores, ...outputIgnores]),
  )

  await updatePackageManifest(project, { scripts })
}

export { generateConfig }
