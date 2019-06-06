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
const webpackConfig = require('../webpack.config').default
const jestConfig = require('../jest.config')

const exists = path => existsSync(join(process.cwd(), path))

const devServerScript = 'lib/server/dev.js'
const useDevServer = exists(devServerScript)

run({
  jest: args => jest({ config: jestConfig, options: { watch: true, ...args } }),
  coverage: args =>
    jest({ config: jestConfig, options: { coverage: true, ...args } }),
  build: args =>
    args.watch
      ? watcher({
          compile: typescriptWatch({ config: tsConfig }),
          ...(args.server
            ? {
                server: nodemonWatch({
                  options: {
                    script: args.server,
                    args: (String(args.args) || '').split(' '),
                    delay: 1,
                    watch: 'lib',
                  },
                }),
              }
            : {}),
        })
      : typescriptBuild({ config: tsConfig }),
  pack: args =>
    webpackBuild({ config: webpackConfig, env: args.mode || 'production' }),
  format: () => prettier({ config: prettierConfig }),
  dev: args => {
    return watcher({
      ...(webpackConfig.entry || args.app
        ? {
            bundler: webpackWatch({
              config: webpackConfig,
              env: 'development',
              port: args.webpackPort,
            }),
          }
        : {}),
      ...(args.server
        ? { compile: typescriptWatch({ config: tsConfig }) }
        : {}),
      ...(args.server
        ? {
            server: nodemonWatch({
              options: {
                script: args.server,
                args: (String(args.args) || '').split(' '),
                delay: 1,
                watch: 'lib',
              },
            }),
          }
        : {}),
    })
  },
})
