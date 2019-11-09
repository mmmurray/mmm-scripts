#!/usr/bin/env node

if (process.env.MM_SOURCE) {
  console.log('Using source version of mmm-scripts')
  const { join } = require('path')
  const { spawnSync } = require('child_process')

  const tsNodePath = join(__dirname, '..', 'node_modules', '.bin', 'ts-node')
  const indexPath = join(__dirname, '..', 'src', 'index.ts')
  const tsConfigPath = join(__dirname, '..', 'tsconfig.lib.json')
  const args = process.argv.slice(2)

  const { status } = spawnSync(
    tsNodePath,
    ['-P', tsConfigPath, indexPath, ...args],
    { stdio: 'inherit' },
  )

  process.exit(status)
}

require('../lib')
