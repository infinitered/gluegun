/**
 * Internal tools for use within Gluegun
 */

const head = <T>(a: T[]): T => a[0]
const tail = <T>(a: T[]): T[] => a.slice(1)
const identity = a => a
const isNil = (a: any): boolean => a === null || a === undefined
const split = (b: string, a: string): string[] => a.split(b)
const trim = (a: string): string => a.trim()
const forEach = <T>(f: (i: T) => void, a: T[]) => a.forEach(f)
const keys = (a: Object): string[] => (Object(a) !== a ? [] : Object.keys(a))
const replace = (b: string | RegExp, c: string, a: string): string => a.replace(b, c)
const last = <T>(a: T[]): T => a[a.length - 1]
const reject = <T>(f: (i: T) => boolean, a: T[]): T[] => a.filter(b => !f(b))
const is = (Ctor: any, val: any): boolean => (val != null && val.constructor === Ctor) || val instanceof Ctor
const takeLast = <T>(n: number, a: T[]): T[] => a.slice(-1 * n)
const equals = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i])
const times = (fn: Function, n: number) => {
  let list = new Array(n)
  for (let i = 0; i < n; i++) list[i] = fn(i)
  return list
}
const prop = (p: string, obj: Object) => obj[p]

export {
  head,
  identity,
  isNil,
  split,
  tail,
  trim,
  forEach,
  keys,
  replace,
  last,
  reject,
  is,
  takeLast,
  equals,
  times,
  prop,
}
