import { path } from './constants'
import { BaseDescription, Description, DynamicDescription, ExceptionDescription, Getter, Options, OverrideDescription, Query, Schema } from './types'


export function schema<D extends Description>(description: D, options: Options = {}): Schema<D> {
  return process(description, options.initialPath || '') as Schema<D>
}

function process(description: Description, path: string): any {
  if (Array.isArray(description)) {
    return processOverride(description, path)
  }
  if (typeof description === 'function') {
    return processDynamic(description, path)
  }
  return processBase(description, path)
}

function processDynamic(description: DynamicDescription, parentPath: string = ''): any {
  return ((...args: any[]) => process(description(args), parentPath))
}

function processOverride(description: OverrideDescription | ExceptionDescription, parentPath: string): any {
  const [ overridePath, overrideDescription ] = description

  if (overridePath === null) {
    return process(overrideDescription, parentPath)
  }

  if (overridePath === '') {
    if (parentPath === '') {
      return processWithGetter(overrideDescription, '', '/')
    }
    return processWithGetter(overrideDescription, parentPath)
  }

  return processWithGetter(overrideDescription, parentPath + '/' + overridePath)
}

function processBase(description: BaseDescription, parentPath: string): any {
  return Object.fromEntries(Object.entries(description).map(([ childrenPath, childrenDescription ]) => {
    if (Array.isArray(childrenDescription)) {
      const [ overridePath, overrideDescription ] = childrenDescription
      if (overridePath === null) {
        return [ childrenPath, process(overrideDescription, parentPath + '/' + childrenPath) ]
      }
      return [ childrenPath, processOverride(childrenDescription, parentPath) ]
    }
    return [ childrenPath, processWithGetter(childrenDescription, parentPath + '/' + childrenPath) ]
  }))
}

function processWithGetter(description: Description, parentPath: string, currentPath?: string) {
  const nextDescription = process(description, parentPath)
  nextDescription.get = get.bind(nextDescription)
  nextDescription[path] = currentPath || parentPath
  return nextDescription
}

function get(this: Getter, query?: Query): string {
  if (query !== undefined) {
    return typeof query === 'function'
      ? this[path] + query()
      : this[path] + query
  }
  return this[path]
}
