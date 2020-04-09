import chalk from 'chalk'
import { relative } from 'path'
import yargsParser from 'yargs-parser'
import { getChangedFilePaths } from '../helpers/git'
import { pluraliseMessage, printBox, printList } from '../helpers/print'
import { getRelatedProjects, sortProjects } from '../helpers/project'
import { Project } from '../types'
import { create } from './create'
import { dependencyValidation } from './dependency-validation'
import { install } from './install'
import { run } from './run'

const workspace = async (
  workspaceRoot: string,
  projects: Project[],
  args: string[],
): Promise<void> => {
  const getProjectName = (project: Project): string =>
    relative(workspaceRoot, project.path)

  printList(
    pluraliseMessage(projects, '#N available #W', 'project', 'projects'),
    projects,
    (project) => chalk.blueBright(getProjectName(project)),
  )

  await dependencyValidation(projects, getProjectName)

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $0,
    _: [command, ...commandArgs],
    since,
  } = yargsParser(args)

  if (!command) {
    console.error('Expected workspace command argument')
    process.exit(1)
  }

  if (command === 'create') {
    await create(workspaceRoot, projects)
    return
  }

  const changedPaths: string[] | null = since
    ? await getChangedFilePaths(workspaceRoot, since)
    : null

  if (changedPaths) {
    printList(
      pluraliseMessage(
        changedPaths,
        `#N #W changed since ${since}`,
        'file',
        'files',
      ),
      changedPaths,
      (path) => chalk.blueBright(path),
    )
  } else {
    printBox(
      `No --since argument supplied. Assuming all files have changed.`,
      'neutral',
    )
  }

  const changedProjects = projects.filter(
    (project) =>
      !changedPaths ||
      changedPaths.some((changedPath) =>
        changedPath.startsWith(`${project.path}/`),
      ),
  )

  printList(
    pluraliseMessage(changedProjects, '#N changed #W', 'project', 'projects'),
    changedProjects,
    (project) => chalk.blueBright(getProjectName(project)),
  )

  const relatedProjects = getRelatedProjects(
    projects,
    changedProjects,
    (project) => project.packageManifest.name !== 'mmm-scripts',
  )

  printList(
    pluraliseMessage(
      relatedProjects.dependents,
      '#N changed project #W',
      'dependent',
      'dependents',
    ),
    relatedProjects.dependents,
    (project) => chalk.blueBright(getProjectName(project)),
  )

  printList(
    pluraliseMessage(
      relatedProjects.dependencies,
      '#N changed project #W',
      'dependency',
      'dependencies',
    ),
    relatedProjects.dependencies,
    (project) => chalk.blueBright(getProjectName(project)),
  )

  const allRelated = sortProjects(projects, [
    ...relatedProjects.dependencies,
    ...changedProjects,
    ...relatedProjects.dependents,
  ])

  const allImpacted = sortProjects(projects, [
    ...changedProjects,
    ...relatedProjects.dependents,
  ])

  if (command === 'install') {
    printList(
      pluraliseMessage(allRelated, 'Installing #N #W', 'project', 'projects'),
      allRelated,
      (project) => chalk.blueBright(getProjectName(project)),
    )

    await install(workspaceRoot, allRelated)
  } else {
    const projectsToRun = command === 'test' ? allImpacted : allRelated

    await run(projectsToRun, getProjectName, [command, ...commandArgs])
  }
}

export { workspace }
