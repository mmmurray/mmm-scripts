const { join } = require('path')
const { existsSync, readFile } = require('fs-extra')
const createJestConfig = require('../config/jest')

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

const jest = async (
  { projectRoot, test, transformJestConfig },
  options = {},
) => {
  if (!test.includes('jest')) {
    console.log('Skipping since jest missing in test option:', test)
    return
  }

  const hasConfigFile = existsSync(join(projectRoot, 'jest.config.js'))
  const hasConfigProperty = Boolean(
    (readJSON(join(projectRoot, 'package.json')) || {}).jest,
  )
  const useDefaultConfig = !hasConfigFile && !hasConfigProperty
  const baseConfig = await createJestConfig(projectRoot)
  const config = transformJestConfig(baseConfig)

  const optionsArgs = converOptionsToArgs(options)
  const configArgs = useDefaultConfig
    ? ['--config', JSON.stringify(config)]
    : []
  const args = [...optionsArgs, ...configArgs]

  require('jest').run(args)
}

module.exports = jest
