/// <reference types="../external" />

import HtmlWebpackPlugin from 'html-webpack-plugin'
import StartServerPlugin from 'start-server-webpack-plugin'
import webpack, { Configuration } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { join } from 'path'

type Options = {
  alias?: {}
  dev?: boolean
  entryPath: string
  filename?: string
  hashFilename?: boolean
  htmlTemplatePath?: string
  outputPath: string
  port?: number
  react?: boolean
  target?: 'web' | 'node'
}

const ownNodeModulesPath = join(__dirname, '..', '..', 'node_modules')

const classesAreGood = false

const includeIf = <T>(condition: boolean, item: T): T[] =>
  condition ? [item] : []

const createWebpackConfig = ({
  alias = {},
  dev = false,
  entryPath,
  filename = 'bundle',
  hashFilename = false,
  htmlTemplatePath,
  outputPath,
  port,
  react = false,
  target = 'web',
}: Options): Configuration => {
  const outputFilename = hashFilename
    ? `${filename}-[hash].js`
    : `${filename}.js`

  return {
    mode: dev ? 'development' : 'production',
    entry: [
      ...includeIf(dev && react, 'react-hot-loader/patch'),
      ...includeIf(dev && target === 'node', 'webpack/hot/poll?300'),
      entryPath,
    ],
    target,
    node:
      target === 'node'
        ? {
            __console: false,
            __dirname: false,
            __filename: false,
          }
        : undefined,
    output: {
      filename: outputFilename,
      path: outputPath,
      libraryTarget: target === 'node' ? 'commonjs' : undefined,
    },
    externals: target === 'node' ? ['aws-sdk'] : [],
    resolve: {
      alias: {
        ...alias,
        ...(dev && react ? { 'react-dom': '@hot-loader/react-dom' } : {}),
      },
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.json'],
    },
    resolveLoader: {
      modules: ['node_modules', ownNodeModulesPath],
    },
    plugins: [
      ...includeIf(
        dev && target === 'node',
        new webpack.HotModuleReplacementPlugin(),
      ),
      ...includeIf(
        dev && target === 'node',
        new StartServerPlugin({
          name: outputFilename,
        }),
      ),
      ...includeIf(
        typeof port === 'number',
        new webpack.EnvironmentPlugin({
          PORT: port,
        }),
      ),
      ...includeIf(
        Boolean(htmlTemplatePath),
        new HtmlWebpackPlugin({
          template: htmlTemplatePath,
        }),
      ),
      ...includeIf(
        !dev,
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        }),
      ),
    ] as any,
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
                  ...includeIf(dev && react, 'react-hot-loader/babel'),
                  ...includeIf(
                    classesAreGood,
                    '@babel/proposal-class-properties',
                  ),
                  '@babel/proposal-object-rest-spread',
                ],
              },
            },
          ],
        },
      ],
    },
  }
}

export { createWebpackConfig }
