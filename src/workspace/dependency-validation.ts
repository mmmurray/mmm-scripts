import chalk from 'chalk'
import { pluraliseMessage, printList } from '../helpers/print'
import { Project } from '../types'
import { validateDependencies } from './dependencies'

const dependencyValidation = async (
  projects: Project[],
  getProjectName: (project: Project) => string,
) => {
  const validation = await validateDependencies(projects)

  if (validation.invalid.length > 0) {
    printList(
      pluraliseMessage(
        validation.invalid,
        '#N invalid #W',
        'dependency',
        'dependencies',
      ),
      validation.invalid,
      (invalid) =>
        `${chalk.blueBright(getProjectName(invalid.project))}: ${
          invalid.name
        }@${invalid.version}`,
      'negative',
    )

    console.error(chalk.redBright('\nValidation failed.'))
    process.exit(1)
  }

  if (validation.mismatches.length > 0) {
    printList(
      pluraliseMessage(
        validation.mismatches,
        '#N mismatched #W',
        'dependency',
        'dependencies',
      ),
      validation.mismatches,
      (mismatch) =>
        `${mismatch.name}:\n${mismatch.versions
          .map(
            (version) =>
              `    - ${chalk.blueBright(getProjectName(version.project))}: ${
                mismatch.name
              }@${version.version}`,
          )
          .join('\n')}`,
      'negative',
    )

    console.error(chalk.redBright('\nValidation failed.'))
    process.exit(1)
  }

  const internalDependencies = projects.map(
    (project) => project.packageManifest.name,
  )

  const externalDependencies = Object.entries(validation.dependencyVersions)
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .filter(([name]) => !internalDependencies.includes(name))

  printList(
    pluraliseMessage(
      externalDependencies,
      '#N external #W',
      'dependency',
      'dependencies',
    ),
    externalDependencies,
    ([name, version]) => `${chalk.blueBright(name)}@${chalk.blue(version)}`,
  )
}

export { dependencyValidation }
