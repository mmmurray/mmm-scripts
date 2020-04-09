import chalk from 'chalk'
import { EOL } from 'os'
import { Project, Watcher } from '../../types'
import { devTSLambda } from './ts-lambda'
import { devTSWebApp } from './ts-web-app'

const colours = [chalk.greenBright, chalk.yellowBright, chalk.magentaBright]

const dev = async (project: Project) => {
  const watchers = project.components.reduce<
    {
      name: string
      watcher: Watcher
    }[]
  >((acc, component) => {
    switch (component.type) {
      case 'ts-web-app':
        return [
          ...acc,
          { name: component.name, watcher: devTSWebApp(project, component) },
        ]
      case 'ts-lambda':
        const watcher = devTSLambda(project, component)
        return watcher ? [...acc, { name: component.name, watcher }] : acc
    }
    return acc
  }, [])

  await Promise.all(
    watchers.map(({ name, watcher }, index) => {
      const colour = colours[index % colours.length]
      const formatMessage = (message: string) =>
        message
          .split(EOL)
          .map((line) => `${colour('[' + name + ']')} ${line}`)
          .join(EOL)

      return watcher(
        (message) => console.log(formatMessage(message)),
        (message) => console.error(formatMessage(chalk.redBright(message))),
      )
    }),
  )
}

export { dev }
