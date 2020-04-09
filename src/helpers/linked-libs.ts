import { join } from 'path'
import { Project } from '../types'

const getLinkedLibs = (project: Project) =>
  project.dependencies.reduce<{ [name: string]: string }>((acc, dependency) => {
    const libComponent = dependency.components.find(
      (component) => component.type === 'ts-lib',
    )

    if (!libComponent) {
      return acc
    }

    acc[dependency.packageManifest.name] = join(
      dependency.path,
      libComponent.entryPath,
    )

    return acc
  }, {})

export { getLinkedLibs }
