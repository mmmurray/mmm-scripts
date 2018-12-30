#!/usr/bin/env node

const { existsSync } = require('fs')
const { join } = require('path')

const {
  run,
  jest,
  nodemonWatch,
  prettier,
  typescriptBuild,
  typescriptWatch,
  watcher,
  webpackBuild,
  webpackWatch,
} = require('scripts-toolbox')

const prettierConfig = require('../prettier.config')
const tsConfig = require('../tsconfig.json')
const webpackConfigBuilder = require('../webpack.config')
const jestConfig = require('../jest.config')

const exists = path => existsSync(join(process.cwd(), path))

const devServerScript = 'lib/server/dev.js'
const useDevServer = exists(devServerScript)

const webpackEntryPaths = [
  './src/app/index.tsx',
  './src/client/index.tsx',
  './src/index.tsx',
]
const webpackEntry = webpackEntryPaths.find(exists)
const webpackConfig = webpackConfigBuilder.default({
  proxy: useDevServer,
  entry: webpackEntry,
})

run({
  jest: args => jest({ config: jestConfig, options: { watch: true, ...args } }),
  coverage: args =>
    jest({ config: jestConfig, options: { coverage: true, ...args } }),
  build: () => typescriptBuild({ config: tsConfig }),
  pack: () => webpackBuild({ config: webpackConfig, env: 'production' }),
  format: () => prettier({ config: prettierConfig }),
  watch: args => {
    const use = args.use ? args.use.split(',') : []
    const useBundler = use.length === 0 || use.includes('bundler')
    const useServer = use.length === 0 || use.includes('server')
    const useCompiler = use.length === 0 || use.includes('compiler')

    const server =
      useDevServer && useServer
        ? nodemonWatch({
            options: {
              script: devServerScript,
              delay: 1,
              watch: 'lib/server',
            },
          })
        : null

    return watcher({
      ...(useCompiler
        ? { compile: typescriptWatch({ config: tsConfig }) }
        : {}),
      ...(useBundler
        ? {
            bundler: webpackWatch({
              config: webpackConfig,
              env: 'development',
              port: args.webpackPort,
            }),
          }
        : {}),
      ...(server ? { server } : {}),
    })
  },
})
