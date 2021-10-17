import { path } from './constants'


export type Schema<D extends Description> =
  D extends DynamicDescription
    ? (...args: Parameters<D>) => Schema<ReturnType<D>[1]> & Getter
    : D extends BaseDescription
      ? { [P in keyof D]: Schema<D[P]> & Getter }
      : D extends OverrideDescription
        ? Schema<D[1]> & Getter
        : D extends ExceptionDescription
          ? Schema<D[1]> & { [P in keyof Getter]: never }
          : never

export type BaseDescription = { [key: string]: Description }

export type DynamicDescription = (...args: any[]) => OverrideDescription | ExceptionDescription

export type OverrideDescription = [ string, BaseDescription | DynamicDescription ]

export type ExceptionDescription = [ null, BaseDescription | DynamicDescription ]

export type Description = BaseDescription | DynamicDescription | OverrideDescription | ExceptionDescription

export type Query = string | ((...args: any[]) => string)

export type Getter = {
  get: <Q extends Query>(query?: Q) => string
  [path]: string
}

export type Options = {
  initialPath?: string
}
