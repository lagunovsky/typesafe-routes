import { schema } from './index'


test('Override', () => {
  const routes = schema({
    override: [ '', {
      news: [ 'good-news', {
        why: [ '', {
          ['just-a-test']: {},
        } ],
      } ],
    } ],
  })

  expect(routes.override.get()).toBe('/')
  expect(routes.override.news.get()).toBe('/good-news')
  expect(routes.override.news.why.get()).toBe('/good-news')
  expect(routes.override.news.why['just-a-test'].get()).toBe('/good-news/just-a-test')
})

test('Exception', () => {
  const routes = schema({
    exception: [ null, {
      allowed: {},
    } ],
  })

  expect(routes.exception.get).toBeUndefined()
  expect(routes.exception.allowed.get()).toBe('/exception/allowed')
})

test('Base', () => {
  const routes = schema({
    base: {
      deep: {},
    },
  })

  expect(routes.base.get()).toBe('/base')
  expect(routes.base.deep.get()).toBe('/base/deep')
})

test('Dynamic', () => {
  const routes = schema({
    dynamic: (id: string) => [ id, {
      edit: {},
      v: (version: string) => [ version, {} ],
    } ],
  })

  expect(routes.dynamic.get()).toBe('/dynamic')
  expect(routes.dynamic('1').get()).toBe('/dynamic/1')
  expect(routes.dynamic('1').edit.get()).toBe('/dynamic/1/edit')
  expect(routes.dynamic('1').v('1.0.0').get()).toBe('/dynamic/1/v/1.0.0')
})

test('Query', () => {
  const routes = schema({
    base: {},
  })

  expect(routes.base.get('?token=magic')).toBe('/base?token=magic')
  expect(routes.base.get(() => '?token=magic')).toBe('/base?token=magic')
})

test('Options', () => {
  const routes = schema(
    {
      home: [ '', {
        deep: {},
      } ],
    },
    { initialPath: '/sub-app' },
  )

  expect(routes.home.get()).toBe('/sub-app')
  expect(routes.home.deep.get()).toBe('/sub-app/deep')
})
