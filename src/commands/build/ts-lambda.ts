import { emptyDir } from 'fs-extra'
import { join } from 'path'
import { getLinkedLibs } from '../../helpers/linked-libs'
import { compile } from '../../helpers/webpack'
import { createWebpackConfig } from '../../helpers/webpack-config'
import { Project, ProjectComponentTSLambda } from '../../types'

const buildTSLambda = async (
  project: Project,
  component: ProjectComponentTSLambda,
): Promise<void> => {
  const outputPath = join(project.path, component.outputPath)

  await emptyDir(outputPath)

  const config = createWebpackConfig({
    alias: getLinkedLibs(project),
    dev: false,
    entryPath: join(project.path, component.entryPath),
    filename: 'lambda',
    hashFilename: false,
    outputPath,
    react: false,
    target: 'node',
  })

  return compile(config)
}

export { buildTSLambda }
