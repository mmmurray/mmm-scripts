const chalk = require('chalk')
const parse = require('yargs-parser')
const commands = require('./commands')
const setup = require('./setup')

const run = async (argv, commands) => {
  const projectRoot = process.cwd()
  const [, , commandName, ...commandArgv] = argv
  const { _, ...args } = parse(commandArgv)
  const command = commands[commandName]

  if (!command) {
    console.error(`Unknown command '${commandName}'`)
    process.exit(1)
  }

  const config = await setup(projectRoot)

  const result = await command(config, args)

  if (result && result.warning) {
    console.warn(chalk.yellowBright(result.warning))
  }

  if (result && result.output) {
    console.log(result.output)
  }
}

run(process.argv, commands).catch(error => {
  console.error(chalk.redBright(error.message))
  process.exit(1)
})
