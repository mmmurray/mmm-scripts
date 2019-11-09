import { join } from 'path'
import { getLinkedLibs } from '../../helpers/linked-libs'
import { watch } from '../../helpers/webpack'
import { createWebpackConfig } from '../../helpers/webpack-config'
import { Project, ProjectComponentTSLambda, Watcher } from '../../types'

const devTSLambda = (
  project: Project,
  component: ProjectComponentTSLambda,
): Watcher | null => {
  if (!component.devServerEntryPath) {
    return null
  }

  const config = createWebpackConfig({
    alias: getLinkedLibs(project),
    dev: true,
    entryPath: join(project.path, component.devServerEntryPath),
    hashFilename: false,
    outputPath: join(project.path, component.outputPath),
    react: true,
    target: 'node',
    port: component.devServerPort,
  })

  return watch(config)
}

export { devTSLambda }
