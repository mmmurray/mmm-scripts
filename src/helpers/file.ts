import fs from 'fs'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

const formatJSONFile = (obj: { [key: string]: any }): string =>
  JSON.stringify(obj, null, 2) + '\n'

const tryReadLines = async (path: string) => {
  try {
    const contents = await readFile(path, 'utf-8')

    return contents
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

export { formatJSONFile, tryReadLines }
