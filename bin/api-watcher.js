const webpack = require('webpack')
const webpackConfig = require('../webpack.config').node

const createServerWatcher = entry => ({
  start: (onOutput, onError) => {
    const mode = 'development'

    const serverCompiler = webpack(webpackConfig(mode))

    serverCompiler.watch(
      {
        quiet: true,
        stats: 'none',
      },
      (err, stats) => {
        if (err) {
          onError(err)
        } else {
          onOutput('Compiled')
        }
      },
    )
  },
})

module.exports = createServerWatcher
