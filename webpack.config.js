const { join } = require('path')
const { merge } = require('lodash')
const { createTypescriptConfigFile } = require('scripts-toolbox')
const webpack = require('webpack')

const includeIf = (condition, item) => (condition ? [item] : [])

module.exports.default = env => {
  const dev = env === 'development'

  return {
    mode: env,
    entry: [
      ...includeIf(dev, join(__dirname, 'webpack-entry.js')),
      ...includeIf(dev, 'webpack-dev-server/client?http://0.0.0.0:8888'),
      ...includeIf(dev, 'webpack/hot/only-dev-server'),
      ...includeIf(dev, 'react-hot-loader/patch'),
      './src',
    ],
    output: {
      filename: 'bundle.js',
      path: join(process.cwd(), 'public'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [...includeIf(dev, new webpack.HotModuleReplacementPlugin())],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            ...includeIf(dev, {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                cacheDirectory: true,
                plugins: ['react-hot-loader/babel'],
              },
            }),
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: createTypescriptConfigFile(process.cwd(), require('./tsconfig.json')),
              },
            },
          ],
        },
      ],
    },
    resolveLoader: {
      modules: ['node_modules', join(__dirname, 'node_modules')],
    },
    devServer: {
      hotOnly: true,
      index: '',
      contentBase: join(process.cwd(), 'public'),
      proxy: [
        {
          context: () => true,
          target: 'http://localhost:9000',
        },
      ],
    },
  }
}

module.exports.mergeDefaultWith = config => env => merge(module.exports.default(env), config)
