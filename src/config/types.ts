import { Project } from '../types'

export type ConfigFile = {
  path: string
  contents: string
  commit?: boolean
}

export type Scripts = { [name: string]: string }

export type ConfigGenerator = (
  project: Project,
) => Promise<{ files: ConfigFile[]; scripts: Scripts }>
