#!/usr/bin/env node

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
const webpackConfig = require('../webpack.config')
const jestConfig = require('../jest.config')
const createApiWatcher = require('./api-watcher')

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
    webpackBuild({
      config: webpackConfig.default,
      env: args.mode || 'production',
      options: args,
    }),
  format: () => prettier({ config: prettierConfig }),
  dev: args => {
    return watcher({
      ...(args.app
        ? {
            app: webpackWatch({
              config: webpackConfig.default,
              env: 'development',
              port: args.webpackPort,
            }),
          }
        : {}),
      ...(args.api
        ? {
            api: createApiWatcher(args.api),
          }
        : {}),
    })
  },
})
