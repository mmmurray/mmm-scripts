const hasLibOutput = config =>
  (config.type === 'library' && config.language === 'typescript') ||
  (config.type === 'app:node' && config.language === 'typescript')

module.exports = {
  hasLibOutput,
}
