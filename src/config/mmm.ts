import prettier from 'prettier'
import { prettierOptions } from './prettier'
import { ConfigGenerator } from './types'

const mmmGenerator: ConfigGenerator = async (project) => {
  return {
    scripts: {},
    files: [
      {
        path: 'mmm.config.js',
        contents: prettier.format(
          `module.exports=${JSON.stringify(
            {
              test: project.test,
              components: project.components,
            },
            null,
            2,
          )}`,
          { ...prettierOptions, parser: 'babel' },
        ),
        commit: true,
      },
    ],
  }
}

export { mmmGenerator }
