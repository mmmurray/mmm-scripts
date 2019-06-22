const { join } = require('path')
const { existsSync, readFile } = require('fs-extra')
const defaultConfig = require('../../jest.config')

const createOptionArg = (optionName, optionValue) =>
  typeof optionValue === 'boolean'
    ? [`--${optionValue ? '' : 'no-'}${optionName}`]
    : [`--${optionName}`, String(optionValue)]

const converOptionsToArgs = options =>
  Object.keys(options).reduce(
    (acc, optionName) => [
      ...acc,
      ...createOptionArg(optionName, options[optionName]),
    ],
    [],
  )

const readJSON = async path => JSON.parse(await readFile(path, 'utf-8'))

const jest = async (projectRoot, options = {}) => {
  const hasConfigFile = existsSync(join(projectRoot, 'jest.config.js'))
  const hasConfigProperty = Boolean(
    (readJSON(join(projectRoot, 'package.json')) || {}).jest,
  )
  const useDefaultConfig = !hasConfigFile && !hasConfigProperty

  const optionsArgs = converOptionsToArgs(options)
  const configArgs = useDefaultConfig
    ? ['--config', JSON.stringify(defaultConfig)]
    : []
  const args = [...optionsArgs, ...configArgs]

  require('jest').run(args)
}

module.exports = jest
