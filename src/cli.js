const chalk = require('chalk')
const parse = require('yargs-parser')
const commands = require('./commands')

const run = async (argv, commands) => {
  const [, , commandName, ...commandArgv] = argv
  const { _, ...args } = parse(commandArgv)
  const command = commands[commandName]

  if (!command) {
    console.error(`Unknown command '${commandName}'`)
    process.exit(1)
  }

  const result = await command(args)

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
