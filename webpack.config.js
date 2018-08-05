const { join } = require('path')
const { merge } = require('lodash')
const { createTypescriptConfigFile } = require('scripts-toolbox')

module.exports.default = env => ({
  mode: env,
  entry: ['./src'],
  output: {
    filename: 'bundle.js',
    path: join(process.cwd(), 'public'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
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
    contentBase: join(process.cwd(), 'public'),
  },
})

module.exports.mergeDefaultWith = config => env => merge(module.exports.default(env), config)
