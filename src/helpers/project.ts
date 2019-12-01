import fs from 'fs'
import glob from 'glob-promise'
import { dirname, join } from 'path'
import { promisify } from 'util'
import { Project, ProjectConfig } from '../types'
import { removeNull } from './fn'
import { loadPackageManifest } from './package-manifest'
import { topologicalSort } from './topological-sort'

const exists = promisify(fs.exists)

const loadProject = async (projectPath: string): Promise<Project | null> => {
  const packageManifestPath = join(projectPath, 'package.json')

  if (!(await exists(packageManifestPath))) {
    return null
  }

  const packageManifest = await loadPackageManifest(packageManifestPath)
  const configPath = join(projectPath, 'mmm.config.js')
  const partial = (await exists(configPath)) ? require(configPath) : {}

  const config: ProjectConfig = {
    components: partial.components || [],
    test: {
      coverageIgnores: (partial.test || {}).coverageIgnores || [],
    },
  }

  return {
    ...config,
    path: projectPath,
    dependencies: [],
    packageManifest,
  }
}

const loadMonorepoProjects = async (
  monorepoPath: string,
): Promise<Project[]> => {
  const { workspaces } = await loadPackageManifest(
    join(monorepoPath, 'package.json'),
  )

  const workspacePackageGlobs = workspaces.map(workspace =>
    join(workspace, 'package.json'),
  )

  const packageManifestPaths = (
    await Promise.all(
      workspacePackageGlobs.map(workspacePackageGlob =>
        glob(workspacePackageGlob, { cwd: monorepoPath }),
      ),
    )
  ).reduce((acc, paths) => [...acc, ...paths], [])

  const projectPaths = packageManifestPaths.map(packageManifestPath =>
    join(monorepoPath, dirname(packageManifestPath)),
  )

  const baseProjects = removeNull(
    await Promise.all(projectPaths.map(loadProject)),
  )

  const projects = baseProjects.map(baseProject => {
    const allDependencies = [
      ...Object.keys(baseProject.packageManifest.dependencies),
      ...Object.keys(baseProject.packageManifest.devDependencies),
    ]

    return {
      ...baseProject,
      dependencies: baseProjects.filter(monorepoProject =>
        allDependencies.includes(monorepoProject.packageManifest.name),
      ),
    }
  })

  const projectEdges = projects.reduce<[string, string][]>(
    (acc, project) => [
      ...acc,
      ...project.dependencies.map(
        dependency => [project.path, dependency.path] as [string, string],
      ),
    ],
    [],
  )

  const sortedProjectPaths = topologicalSort(projectEdges)

  return projects.sort(
    (a, b) =>
      sortedProjectPaths.indexOf(a.path) - sortedProjectPaths.indexOf(b.path),
  )
}

const createProjectsIncludes = (
  projects: Project[],
): ((project: Project) => boolean) => {
  const projectPaths = projects.map(({ path }) => path)
  return project => projectPaths.includes(project.path)
}

const getRelatedProjects = (
  projects: Project[],
  toProjects: Project[],
  includeProject: (project: Project) => boolean,
) => {
  const toProjectsIncludes = createProjectsIncludes(toProjects)

  const isAncestor = (project: Project, to: Project): boolean => {
    const projectDependencies = project.dependencies.filter(includeProject)

    return (
      createProjectsIncludes(projectDependencies)(to) ||
      projectDependencies.some(dependency => isAncestor(dependency, to))
    )
  }

  const dependents = projects.filter(
    project =>
      includeProject(project) &&
      !toProjectsIncludes(project) &&
      toProjects.some(toProject => isAncestor(project, toProject)),
  )

  const dependentsIncludes = createProjectsIncludes(dependents)

  const dependencies: Project[] = projects.filter(
    project =>
      includeProject(project) &&
      !toProjectsIncludes(project) &&
      !dependentsIncludes(project) &&
      (toProjects.some(p => isAncestor(p, project)) ||
        dependents.some(p => isAncestor(p, project))),
  )

  return { dependencies, dependents }
}

const sortProjects = (sortOrder: Project[], projects: Project[]): Project[] =>
  projects.sort(
    (a, b) =>
      sortOrder.findIndex(p => p.path === a.path) -
      sortOrder.findIndex(p => p.path === b.path),
  )

export { loadProject, loadMonorepoProjects, getRelatedProjects, sortProjects }
