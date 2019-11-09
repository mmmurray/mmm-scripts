import { join } from 'path'
import { getLinkedLibs } from '../../helpers/linked-libs'
import { dev } from '../../helpers/webpack'
import { createWebpackConfig } from '../../helpers/webpack-config'
import { Project, ProjectComponentTSWebApp, Watcher } from '../../types'

const devTSWebApp = (
  project: Project,
  component: ProjectComponentTSWebApp,
): Watcher => {
  const config = createWebpackConfig({
    alias: getLinkedLibs(project),
    dev: true,
    entryPath: join(project.path, component.entryPath),
    hashFilename: false,
    htmlTemplatePath:
      component.htmlTemplatePath &&
      join(project.path, component.htmlTemplatePath),
    outputPath: join(project.path, component.outputPath),
    react: true,
    target: 'web',
  })

  return dev(config, {
    ...({ logLevel: 'silent' } as any),
    hotOnly: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export { devTSWebApp }
