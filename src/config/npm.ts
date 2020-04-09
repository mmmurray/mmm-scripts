import { ConfigGenerator, Scripts } from './types'

const npmGenerator: ConfigGenerator = async (project) => {
  const libComponent = project.components.find(
    (component) => component.type === 'ts-lib',
  )

  if (!libComponent) {
    return { scripts: {}, files: [] }
  }

  return {
    scripts: {
      release: 'mmm release',
    } as Scripts,
    files: [
      {
        path: '.npmignore',
        contents: ['node_modules', 'src/**', 'yarn.lock', ''].join('\n'),
      },
    ],
  }
}

export { npmGenerator }
