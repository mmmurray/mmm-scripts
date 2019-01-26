const { createTransformer } = require('babel-jest')

module.exports = createTransformer({
  presets: [
    ['@babel/preset-env', { targets: { node: '11' } }],
    '@babel/typescript',
    '@babel/react',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
})
