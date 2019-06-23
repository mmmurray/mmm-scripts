const hasLibOutput = config =>
  config.type === 'library' && config.language === 'typescript'

module.exports = {
  hasLibOutput,
}
