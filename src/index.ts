import { commands } from './commands'
import { generateConfig } from './config'
import { getMonorepoRoot } from './helpers/monorepo'
import { loadMonorepoProjects, loadProject } from './helpers/project'
import { workspace } from './workspace'

const run = async (args: string[]) => {
  console.log(`Running ${args.join(' ')}`)

  const [command, ...commandArgs] = args
  const commandRunner = commands[command]

  const projectPath = process.cwd()
  const monorepoPath = await getMonorepoRoot(projectPath)
  const monorepoProjects = monorepoPath
    ? await loadMonorepoProjects(monorepoPath)
    : []

  if (monorepoPath && command === 'workspace') {
    await workspace(monorepoPath, monorepoProjects, commandArgs)
    return
  }

  if (!commandRunner) {
    console.error(`Unknown command '${command}'`)
    process.exit(1)
  }

  const project =
    monorepoProjects.find(
      (monorepoProject) => monorepoProject.path === projectPath,
    ) || (await loadProject(projectPath))

  if (!project) {
    console.error(`Cannot find project in '${projectPath}'`)
    process.exit(1)
  }

  await generateConfig(project)

  await commandRunner(project)
}

run(process.argv.slice(2)).catch((error) => {
  console.error(error)
  process.exit(1)
})
