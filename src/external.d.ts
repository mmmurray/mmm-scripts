declare module 'start-server-webpack-plugin' {
  import { Plugin } from 'webpack'

  declare class StartServerPlugin extends Plugin {
    constructor(options: { name: string })
  }

  export = StartServerPlugin
}
