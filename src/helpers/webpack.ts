import { EOL } from 'os'
import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { Watcher } from '../types'

const formatMessage = (message: string) =>
  message
    .split(EOL)
    .filter(line => line.indexOf('./') !== 0 && line.indexOf('/') !== 0)
    .join(EOL)

const formatMessages = (messages: string[]) =>
  `${EOL}${messages.map(formatMessage).join(`${EOL}${EOL}`)}${EOL}`

const compile = (config: Configuration) =>
  new Promise<void>((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error) {
        reject(error)
      } else if (stats.hasErrors()) {
        console.error(stats.toJson().errors.join('\n'))
        reject(new Error('Failed with errors'))
      } else if (stats.hasWarnings()) {
        console.warn(stats.toJson().warnings.join('\n'))
        reject(new Error('Failed with warnings'))
      } else {
        console.log(stats.toString({ colors: true }))
        resolve()
      }
    })
  })

const dev = (
  config: Configuration,
  devServerConfig: WebpackDevServer.Configuration,
): Watcher => (onOutput, onError) =>
  new Promise(async resolve => {
    const compiler = webpack(config)

    compiler.hooks.invalid.tap('invalid', () => {
      onOutput('Bundling.')
    })

    compiler.hooks.done.tap('done', stats => {
      const info = stats.toJson()

      if (info.errors.length > 0) {
        onError(formatMessages(info.errors))
      } else if (info.warnings.length > 0) {
        onError(formatMessages(info.warnings))
      } else {
        onOutput('Bundled successfully.')
      }
    })

    const server = new WebpackDevServer(compiler, devServerConfig)
    const host = 'localhost'
    const port = 8080

    server.listen(port, host, () => {
      onOutput(`Dev server running at http://${host}:${port}`)
      resolve(async () => {})
    })
  })

const watch = (config: Configuration): Watcher => async (onOutput, onError) => {
  const compiler = webpack(config)

  compiler.hooks.invalid.tap('invalid', () => {
    onOutput('Bundling.')
  })

  compiler.watch(
    {
      ...({ quiet: true } as any),
      stats: 'none',
    },
    (error, stats) => {
      if (error) {
        onError(error.message)
      } else if (stats.hasErrors()) {
        onError(formatMessages(stats.toJson().errors))
      } else if (stats.hasWarnings()) {
        onError(formatMessages(stats.toJson().warnings))
      } else {
        onOutput('Bundled successfully.')
      }
    },
  )
  return async () => {}
}

export { compile, dev, watch }
