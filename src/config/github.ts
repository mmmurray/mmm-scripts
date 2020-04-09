import { ConfigGenerator, Scripts } from './types'

const createWorkflow = () => `name: Push

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v1
      - name: Install
        uses: docker://mmmurray/test:latest
        with:
          entrypoint: yarn
          args: install
      - name: Build
        uses: docker://mmmurray/test:latest
        with:
          entrypoint: yarn
          args: build
      - name: Test
        uses: docker://mmmurray/test:latest
        with:
          entrypoint: yarn
          args: test
      - name: Release
        uses: docker://mmmurray/test:latest
        with:
          entrypoint: yarn
          args: release
          GH_TOKEN: \${{ secrets.GH_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
`

const githubGenerator: ConfigGenerator = async (project) => {
  const libComponent = project.components.find(
    (component) => component.type === 'ts-lib',
  )

  if (!libComponent) {
    return { scripts: {}, files: [] }
  }

  return {
    scripts: {} as Scripts,
    files: [
      {
        path: '.github/workflows/push.yml',
        contents: createWorkflow(),
        commit: true,
      },
    ],
  }
}

export { githubGenerator }
