const webpack = require('webpack')
const webpackConfig = require('../webpack.config').node

const createServerWatcher = entry => ({
  start: (onOutput, onError) => {
    const mode = 'development'

    const compiler = webpack(webpackConfig(mode))

    compiler.hooks.done.tap('invalid', () => {
      onOutput('Bundling.')
    })

    compiler.watch(
      {
        quiet: true,
        stats: 'none',
      },
      (err, stats) => {
        if (err) {
          onError(err)
        } else {
          onOutput('Bundled successfully.')
        }
      },
    )
  },
})

module.exports = createServerWatcher
