import build from '../src/index'

test('construct with default obj', () => {
  const defaultObj = {}
  const result = build(defaultObj).val()
  expect(result).toBe(defaultObj)
})

test('construct with function', () => {
  const defaultObj = {}
  const result = build(() => {
    return defaultObj
  }).val()
  expect(result).toBe(defaultObj)
})

test('pick', () => {
  const a = Math.random()
  const b = Math.random()
  const result = build()
    .from({
      a
    })
    .pick([
      'a',
      ['b', b]
    ])
    .val()
  expect(Object.keys(result).length).toBe(2)
  expect(result.a).toBe(a)
  expect(result.b).toBe(b)
})

test('map', () => {
  const a = Math.random()
  const result = build()
    .from({
      a
    })
    .map({
      a1: 'a'
    })
    .val()
  expect(Object.keys(result).length).toBe(1)
  expect(result.a1).toBe(a)
})

test('compute(field, fn)', () => {
  const a = Math.random()
  const b = Math.random()
  const c = a + b
  const source = {a, b}
  const result = build()
    .from(source)
    .compute('c', (obj: typeof source) => {
      return obj.a + obj.b
    })
    .val()
  expect(Object.keys(result).length).toBe(1)
  expect(result.c).toBe(c)
})

test('compute({field: fn})', () => {
  const a = Math.random()
  const b = Math.random()
  const c = a + b
  const source = { a, b}
  const result = build()
    .from(source)
    .compute({
      c: (obj: typeof source) => {
      return obj.a + obj.b
      }
    })
    .val()
  expect(Object.keys(result).length).toBe(1)
  expect(result.c).toBe(c)
})

test('assign(obj)', () => {
  const a = Date.now()
  const result = build()
    .assign({
      b: a
    })
    .val()
  expect(Object.keys(result).length).toBe(1)
  expect(result.b).toBe(a)
})

test('custom(fn)', () => {
  const a = Date.now()
  const source = {a}
  const result = build()
    .from(source)
    .custom((targetObj: any, obj: typeof source) => {
      targetObj.b = obj.a + 1
    })
    .val()
  expect(Object.keys(result).length).toBe(1)
  expect(result.b).toBe(a + 1)
})

test('nested', () => {
  const source = {
    itemList: [
      {
        a: Math.random()
      },
      {
        a: Math.random()
      }
    ]
  }
  const result = build().from(source)
    .compute('items', (obj: typeof source) => {
      return obj.itemList.map(item => {
        return build()
          .from(item)
          .map({
            'b': 'a'
          })
          .val()
      })
    })
    .val()
  expect(Object.keys(result).length).toBe(1)
  expect(result.items).toBeInstanceOf(Array)
  expect(result.items.length).toBe(source.itemList.length)
  expect(Object.keys(result.items[0]).length).toBe(1)
  expect(result.items[0].b).toBe(source.itemList[0].a)
  expect(Object.keys(result.items[1]).length).toBe(1)
  expect(result.items[1].b).toBe(source.itemList[1].a)
})