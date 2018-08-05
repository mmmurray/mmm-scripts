#!/usr/bin/env node

const {
  run,
  jest,
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

run({
  jest: args => jest({ config: jestConfig, options: { watch: true, ...args } }),
  coverage: args => jest({ config: jestConfig, options: { coverage: true, ...args } }),
  build: () => typescriptBuild({ config: tsConfig }),
  pack: () => webpackBuild({ config: webpackConfig.default, env: 'production' }),
  format: () => prettier({ config: prettierConfig }),
  watch: () =>
    watcher({
      compile: typescriptWatch({ config: tsConfig }),
      bundler: webpackWatch({ config: webpackConfig.default, env: 'development' }),
    }),
})
