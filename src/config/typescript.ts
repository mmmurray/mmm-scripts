import { relative } from 'path'
import { formatJSONFile } from '../helpers/file'
import { removeNull } from '../helpers/fn'
import { getLinkedLibs } from '../helpers/linked-libs'
import { ProjectComponent } from '../types'
import { ConfigGenerator, Scripts } from './types'

const tsComponentTypes: ProjectComponent['type'][] = [
  'ts-lambda',
  'ts-lib',
  'ts-web-app',
]

const baseDefaultConfig = {
  compilerOptions: {
    allowSyntheticDefaultImports: true,
    baseUrl: '.',
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    isolatedModules: true,
    jsx: 'react',
    lib: ['dom', 'es2015', 'es2016', 'es2017', 'es2018', 'esnext'],
    module: 'esnext',
    moduleResolution: 'node',
    noEmit: true,
    noFallthroughCasesInSwitch: true,
    noImplicitReturns: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    target: 'esnext',
  },
  include: ['src/**/*'],
  exclude: ['node_modules'],
}

const baseLibConfig = {
  extends: './tsconfig.json',
  compilerOptions: {
    declaration: true,
    isolatedModules: false,
    module: 'commonjs',
    noEmit: false,
    rootDir: 'src',
    sourceMap: true,
    target: 'es5',
  },
  include: ['src/**/*'],
}

const tsGenerator: ConfigGenerator = async project => {
  const hasTSComponent = project.components.some(component =>
    tsComponentTypes.includes(component.type),
  )

  if (!hasTSComponent) {
    return { scripts: {}, files: [] }
  }

  const paths = Object.entries(getLinkedLibs(project)).reduce<{
    [key: string]: string[]
  }>((acc, [name, path]) => {
    acc[name] = [relative(project.path, path)]
    return acc
  }, {})

  const defaultConfig = {
    ...baseDefaultConfig,
    compilerOptions: {
      ...baseDefaultConfig.compilerOptions,
      paths,
    },
  }

  const libConfigs = removeNull(
    project.components.map(component => {
      if (component.type !== 'ts-lib') {
        return null
      }

      return {
        path: `tsconfig.${component.name}.json`,
        contents: formatJSONFile({
          ...baseLibConfig,
          compilerOptions: {
            ...baseLibConfig.compilerOptions,
            outDir: component.outputPath,
          },
        }),
      }
    }),
  )

  return {
    scripts: {
      'test:compile': 'mmm test:compile',
    } as Scripts,
    files: [
      {
        path: 'tsconfig.json',
        contents: formatJSONFile(defaultConfig),
      },
      ...libConfigs,
    ],
  }
}

export { tsGenerator }
