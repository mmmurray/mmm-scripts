import { Project } from '../../types'
import { buildTSLambda } from './ts-lambda'
import { buildTSLib } from './ts-lib'
import { buildTSWebApp } from './ts-web-app'

const build = async (project: Project) => {
  for (const component of project.components) {
    console.log(`Building ${component.name}`)
    switch (component.type) {
      case 'ts-web-app':
        await buildTSWebApp(project, component)
        break
      case 'ts-lambda':
        await buildTSLambda(project, component)
        break
      case 'ts-lib':
        await buildTSLib(project, component)
    }
  }
}

export { build }
