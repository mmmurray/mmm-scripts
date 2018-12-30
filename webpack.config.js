const { join } = require('path')
const { merge } = require('lodash')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const includeIf = (condition, item) => (condition ? [item] : [])
const includePropertyIf = (condition, name, item) =>
  condition ? { [name]: item } : {}

module.exports.default = ({ proxy, entry } = {}) => env => {
  const dev = env === 'development'

  return {
    mode: env,
    entry: [
      ...includeIf(dev, join(__dirname, 'webpack-entry.js')),
      ...includeIf(dev, 'webpack-dev-server/client?http://0.0.0.0:8888'),
      ...includeIf(dev, 'webpack/hot/only-dev-server'),
      ...includeIf(dev, 'react-hot-loader/patch'),
      entry || './src',
    ],
    output: {
      filename: 'bundle.js',
      path: join(process.cwd(), 'public'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
      ...includeIf(dev, new webpack.HotModuleReplacementPlugin()),
      ...includeIf(
        !dev,
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        }),
      ),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cwd: __dirname,
                babelrc: false,
                cacheDirectory: true,
                presets: ['@babel/typescript', '@babel/react'],
                plugins: [
                  ...includeIf(dev, 'react-hot-loader/babel'),
                  '@babel/proposal-class-properties',
                  '@babel/proposal-object-rest-spread',
                ],
              },
            },
          ],
        },
      ],
    },
    resolveLoader: {
      modules: [join(__dirname, 'node_modules'), 'node_modules'],
    },
    devServer: {
      hotOnly: true,
      index: '',
      contentBase: join(process.cwd(), 'public'),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      ...includePropertyIf(proxy, 'proxy', [
        {
          context: () => true,
          target: 'http://localhost:9000',
        },
      ]),
    },
  }
}

module.exports.mergeDefaultWith = config => env =>
  merge(module.exports.default()(env), config)
