const { existsSync } = require('fs')
const { dirname, join, relative } = require('path')
const { merge } = require('lodash')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const StartServerPlugin = require('start-server-webpack-plugin')
const webpackNodeExternals = require('webpack-node-externals')

const includeIf = (condition, item) => (condition ? [item] : [])

const appEntryPaths = [
  './src/app/index.tsx',
  './src/client/index.tsx',
  './src/index.tsx',
]

const appEntry = appEntryPaths.find(path =>
  existsSync(join(process.cwd(), path)),
)

const serverEntryPaths = ['./src/server/entry.ts']

const serverEntry = serverEntryPaths.find(path =>
  existsSync(join(process.cwd(), path)),
)

module.exports.default = env => {
  const dev = env === 'development'

  return {
    mode: env,
    entry: [...includeIf(dev, 'react-hot-loader/patch'), appEntry || './src'],
    output: {
      filename: 'bundle.js',
      path: join(process.cwd(), 'public'),
    },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
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
          test: /\.[j,t]sx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                compact: false,
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
      contentBase: join(process.cwd(), 'public'),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  }
}

module.exports.createNodeConfig = ({ mode, entry }) => {
  const dev = mode === 'development'
  const outputPath = join(process.cwd(), 'dist')
  const customEntry = join(__dirname, 'bin', 'api-entry.ts')

  return {
    mode,
    entry: [...includeIf(dev, 'webpack/hot/poll?300'), customEntry],
    target: 'node',
    output: {
      filename: 'server.js',
      path: outputPath,
      libraryTarget: 'commonjs2',
    },
    resolve: {
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.json'],
      mainFields: ['module', 'main'],
    },
    node: {
      __console: false,
      __dirname: false,
      __filename: false,
    },
    plugins: [
      ...includeIf(dev, new webpack.HotModuleReplacementPlugin()),
      ...includeIf(
        dev,
        new StartServerPlugin({
          name: 'server.js',
        }),
      ),
      ...includeIf(
        !dev,
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        }),
      ),
      new webpack.DefinePlugin({
        API_ENTRY: JSON.stringify(
          relative(dirname(customEntry), join(process.cwd(), entry)),
        ),
      }),
    ],
    externals: [
      ...includeIf(
        dev,
        webpackNodeExternals({
          whitelist: ['webpack/hot/poll?300'],
        }),
      ),
    ],

    module: {
      rules: [
        {
          test: /\.[j,t]sx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                compact: false,
                cwd: __dirname,
                babelrc: false,
                cacheDirectory: true,
                presets: ['@babel/typescript', '@babel/react'],
                plugins: [
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
  }
}

module.exports.mergeDefaultWith = config => env =>
  merge(module.exports.default(env), config)
