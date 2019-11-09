export type PackageManifest = {
  name: string
  workspaces: string[]
  scripts: { [name: string]: string }
  dependencies: { [name: string]: string }
  devDependencies: { [name: string]: string }
  license?: string
}

type ProjectComponentCommon = {
  name: string
  entryPath: string
  outputPath: string
}

export type ProjectComponentTSWebApp = ProjectComponentCommon & {
  type: 'ts-web-app'
  htmlTemplatePath?: string
}

export type ProjectComponentTSLib = ProjectComponentCommon & {
  type: 'ts-lib'
}

export type ProjectComponentTSLambda = ProjectComponentCommon & {
  type: 'ts-lambda'
  devServerEntryPath?: string
  devServerPort?: number
}

export type ProjectComponent =
  | ProjectComponentTSWebApp
  | ProjectComponentTSLib
  | ProjectComponentTSLambda

export type ProjectConfig = {
  test: {
    coverageIgnores: string[]
  }
  components: ProjectComponent[]
}

export type Project = ProjectConfig & {
  path: string
  packageManifest: PackageManifest
  dependencies: Project[]
}

export type Watcher = (
  onOutput: (message: string) => void,
  onError: (message: string) => void,
) => Promise<() => Promise<void>>
