import { ensureDir, writeFile } from 'fs-extra'
import { basename, join } from 'path'
import readline from 'readline'
import { generateConfig } from '../config'
import { loadProject } from '../helpers/project'
import { Project, ProjectComponent } from '../types'

type ComponentType = ProjectComponent['type']

type CreateOptions = {
  relativePath: string
  component: ProjectComponent
}

const prompt = async <TResult extends string>(
  message: string,
  validator: TResult[] | ((value: string) => boolean | Promise<boolean>) = (
    value,
  ) => Boolean(value),
): Promise<TResult> => {
  const lineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  const promptMessage = Array.isArray(validator)
    ? `${message} (${validator.join(', ')}):`
    : `${message}:`

  console.log(promptMessage)

  return new Promise<TResult>((resolve) => {
    lineInterface.on('line', async (line) => {
      const value = line as TResult
      if (
        Array.isArray(validator)
          ? validator.includes(value)
          : await validator(value)
      ) {
        lineInterface.close()
        resolve(value)
      } else {
        console.log(promptMessage)
      }
    })
  })
}

const getOptions = async (): Promise<CreateOptions> => {
  const relativePath = await prompt('Relative path to package')

  const componentType = await prompt<ComponentType>('Component type', [
    'ts-web-app',
    'ts-lambda',
    'ts-lib',
  ])

  const componentName = await prompt('Component name')

  const createComponent = (): ProjectComponent => {
    switch (componentType) {
      case 'ts-lambda':
        return {
          type: componentType,
          name: componentName,
          entryPath: `src/${componentName}`,
          outputPath: `dist/${componentName}`,
        }
      case 'ts-lib':
        return {
          type: componentType,
          name: componentName,
          entryPath: `src/${componentName}`,
          outputPath: `dist/${componentName}`,
        }
      case 'ts-web-app':
        return {
          type: componentType,
          name: componentName,
          entryPath: `src/${componentName}`,
          outputPath: `dist/${componentName}`,
        }
    }
  }

  return {
    relativePath,
    component: createComponent(),
  }
}

const createProject = async (projectPath: string): Promise<Project> => {
  const name = basename(projectPath)
  console.log(`Creating new project '${name}'`)

  await ensureDir(projectPath)

  await writeFile(
    join(projectPath, 'package.json'),
    JSON.stringify(
      {
        name: `@epoch/${name}`,
        version: '0.0.0',
        private: true,
        devDependencies: {
          'mmm-scripts': '0.0.0-semantically-released',
        },
      },
      null,
      2,
    ) + '\n',
  )

  await writeFile(join(projectPath, 'mmm.config.js'), 'module.exports = {}\n')

  const project = await loadProject(projectPath)

  if (!project) {
    throw new Error('Failed to create project')
  }

  return project
}

const getProject = async (
  projectPath: string,
  projects: Project[],
): Promise<Project> => {
  const existingProject = projects.find(
    (project) => project.path === projectPath,
  )

  if (existingProject) {
    console.log(`Found existing project '${basename(existingProject.path)}'`)
    return existingProject
  }

  return createProject(projectPath)
}

const create = async (workspaceRoot: string, projects: Project[]) => {
  console.log('Creating new pacakge component')

  const options = await getOptions()
  const projectPath = join(workspaceRoot, options.relativePath)
  const project = await getProject(projectPath, projects)
  const newProject = {
    ...project,
    components: [...project.components, options.component],
  }

  await generateConfig(newProject)

  console.log('Done')
}

export { create }
