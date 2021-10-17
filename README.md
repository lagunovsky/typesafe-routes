![License](https://img.shields.io/github/license/lagunovsky/typesafe-routes)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.0.0-blue)
![Tests workflow](https://github.com/lagunovsky/typesafe-routes/actions/workflows/publish.yml/badge.svg)

Introduction
======================

This library abstracts your routes away behind type safe object. This way it will allow you to easily refactor routes, prevent typos, prohibit the use of some
routes, and use dynamic routes.

TypeScript version must be `>=4.0.0`

## Installation

```
$ npm install --save @lagunovsky/typesafe-routes
```

## Usage

To get a type-safe route object, use the `schema` function

```typescript
const routes = schema({
  override: [ '', {
    deep: [ 'override', {} ]
  } ],
  exception: [ null, {
    allowed: {},
  } ],
  dynamic: (id: string) => [ id, {
    edit: {},
    v: (version: string) => [ version, {} ],
  } ],
  deep: {
    deep: {},
  },
})
```

| Call | Result |
|-------------------------------------------|--------------------------|
| `routes.override.get()`                   | `'/'`                    |
| `routes.override.deep.get()`              | `'/override'`            |
| `routes.exception.get()`                  | error                    |
| `routes.exception.allowed.get()`          | `'/exception/allowed'`   |
| `routes.dynamic.get()`                    | `'/dynamic'`             |
| `routes.dynamic('1').get()`               | `'/dynamic/1'`           |
| `routes.dynamic('1').edit.get()`          | `'/dynamic/1/edit'`      |
| `routes.dynamic('1').v('1.0.0').get()`    | `'/dynamic/1/v/1.0.0'`   |
| `routes.deep.get()`                       | `'/deep'`                |
| `routes.deep.deep.get()`                  | `'/deep/deep'`           |
| `routes.deep.get('?token=magic')`         | `'/deep?token=magic'`    |

## API

### `schema`

```
schema(description: Description, options?: Options)
```

Creates a type-safe route object

#### `Description`

```ts
type Description = BaseDescription | DynamicDescription | OverrideDescription | ExceptionDescription
```

#### `BaseDescription`

```
type BaseDescription = { [key: string]: Description }
```

When using this type of description, routes are compiled from the path of the object.

#### `DynamicDescription`

```
type DynamicDescription = (...args: any[]) => OverrideDescription | ExceptionDescription
```

When you want to create parameter-dependent routes.

#### `OverrideDescription`

```
type OverrideDescription = [ string, BaseDescription | DynamicDescription ]
```

The first element of the array is used to overwrite its key.

#### `ExceptionDescription`

```
type ExceptionDescription = [ null, BaseDescription | DynamicDescription ]
```

It is used when it is necessary to prohibit the use of a certain route.

#### `Options`

```ts
type Options = { initialPath?: string }
```

Using the `options.initialPath`, you can specify a string that will be added to the beginning of each generated link.

```ts
// Example
const options: Options = { initialPath: '/sub-app' }
const routes = schema({ page: {} }, options)
const route = routes.page.get() // '/sub-app/page'
```

---

### `get`

```ts
get(string | ((...args: any[]) => string))
```

Allows to get the path of the route.

```ts
// Example
const routes = schema({ page: {} })
const route = routes.page.get('?token=magic')  // '/page?token=magic'
```

---

### `path`

```
const path: symbol
```

The key by which you can get (or change) the route path.

```ts
// Example
const routes = schema({ page: {} })
const route = routes.page[path]  // '/page'
```

