const webpack = require('webpack')
const createNodeConfig = require('../webpack.config').createNodeConfig

const createServerWatcher = entry => ({
  start: (onOutput, onError) => {
    const mode = 'development'

    const compiler = webpack(createNodeConfig({ mode, entry }))

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
