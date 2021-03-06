import { emptyDir, copy, existsSync } from 'fs-extra'
import { join } from 'path'
import { getLinkedLibs } from '../../helpers/linked-libs'
import { compile } from '../../helpers/webpack'
import { createWebpackConfig } from '../../helpers/webpack-config'
import { Project, ProjectComponentTSWebApp } from '../../types'

const buildTSWebApp = async (
  project: Project,
  component: ProjectComponentTSWebApp,
): Promise<void> => {
  const outputPath = join(project.path, component.outputPath)
  const staticPath = join(project.path, component.entryPath, 'static')

  await emptyDir(outputPath)

  if (existsSync(staticPath)) {
    await copy(staticPath, join(outputPath, 'static'))
  }

  const config = createWebpackConfig({
    alias: getLinkedLibs(project),
    dev: false,
    entryPath: join(project.path, component.entryPath),
    filename: 'bundle',
    hashFilename: true,
    htmlTemplatePath:
      component.htmlTemplatePath &&
      join(project.path, component.htmlTemplatePath),
    outputPath,
    react: true,
    target: 'web',
  })

  return compile(config)
}

export { buildTSWebApp }
