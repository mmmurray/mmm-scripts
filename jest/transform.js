const { createTransformer } = require('babel-jest')

module.exports = createTransformer({
  presets: [
    [require('@babel/preset-env'), { targets: { node: '10' } }],
    require('@babel/preset-typescript'),
    require('@babel/preset-react'),
  ],
  plugins: [
    require('@babel/plugin-proposal-class-properties'),
    require('@babel/plugin-proposal-object-rest-spread'),
  ],
})
