import { printBox } from '../helpers/print'
import { execProcess } from '../helpers/process'
import { Project } from '../types'

const run = async (
  projects: Project[],
  getProjectName: (project: Project) => string,
  args: string[],
): Promise<void> => {
  const [command, ...commandArgs] = args

  const projectsWithScript = projects.filter(
    (project) => project.packageManifest.scripts[command],
  )

  let index = 0
  for (const project of projectsWithScript) {
    index++

    printBox(
      `(${index}/${projectsWithScript.length}) ${command} ${getProjectName(
        project,
      )}`,
      'positive',
    )

    await execProcess('yarn', [command, ...commandArgs], project.path)
  }
}

export { run }
