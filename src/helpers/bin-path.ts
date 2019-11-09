import { join } from 'path'

const getBinPath = (executable: string) =>
  join(__dirname, '..', '..', 'node_modules', '.bin', executable)

export { getBinPath }
