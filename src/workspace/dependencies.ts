import { Project } from '../types'

type Dependency = {
  name: string
  version: string
  project: Project
}

type ProjectVersion = {
  project: Project
  version: string
}

type Mismatch = {
  name: string
  versions: ProjectVersion[]
}

type DependencyVersions = { [name: string]: string }

type Validation = {
  dependencyVersions: DependencyVersions
  invalid: Dependency[]
  mismatches: Mismatch[]
}

const isVersionValid = (version: string): boolean => /^\d/.test(version)

const getProjectPackageManifestDependencies = (project: Project) => [
  ...Object.entries(project.packageManifest.dependencies),
  ...Object.entries(project.packageManifest.devDependencies),
]

const validateDependencies = (projects: Project[]): Validation => {
  const dependencyVersions: DependencyVersions = {}
  const invalid: Dependency[] = []
  const mismatchDependencies: string[] = []

  projects.forEach((project) => {
    getProjectPackageManifestDependencies(project).forEach(
      ([name, version]) => {
        if (!isVersionValid(version)) {
          invalid.push({ name, version, project })
        }

        if (
          dependencyVersions[name] &&
          dependencyVersions[name] !== version &&
          !mismatchDependencies.includes(name)
        ) {
          mismatchDependencies.push(name)
        }

        dependencyVersions[name] = version
      },
    )
  })

  const mismatches = mismatchDependencies.map<Mismatch>((mismatchName) => ({
    name: mismatchName,
    versions: projects.reduce<ProjectVersion[]>((acc, project) => {
      const packageManifestDependency = getProjectPackageManifestDependencies(
        project,
      ).find(([name]) => name === mismatchName)
      if (packageManifestDependency) {
        return [...acc, { project, version: packageManifestDependency[1] }]
      }

      return acc
    }, []),
  }))

  return { dependencyVersions, invalid, mismatches }
}

export { validateDependencies }
