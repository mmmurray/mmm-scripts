import { topologicalSort } from '../src/helpers/topological-sort'

test('can sort one edge', () => {
  const ids = topologicalSort([['a', 'b']])

  expect(ids).toEqual(['b', 'a'])
})

test('can sort two edges', () => {
  const ids = topologicalSort([['a', 'b'], ['b', 'c']])

  expect(ids).toEqual(['c', 'b', 'a'])
})

test('can sort three edges', () => {
  const ids = topologicalSort([['a', 'b'], ['b', 'c'], ['a', 'c']])

  expect(ids).toEqual(['c', 'b', 'a'])
})
