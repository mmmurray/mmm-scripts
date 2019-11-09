const removeNull = <T>(arr: (T | null)[]): T[] =>
  arr.reduce<T[]>((acc, x) => (x === null ? acc : [...acc, x]), [])

const flatten = <T>(arr: T[][]): T[] =>
  arr.reduce<T[]>((acc, a) => [...acc, ...a], [])

const filterUnique = <T>(arr: T[]): T[] =>
  arr.filter((item, i) => arr.indexOf(item) === i)

export { removeNull, flatten, filterUnique }
