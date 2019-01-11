/**
 * Internal tools for use within Gluegun
 */

const head = (a: any[]): any => a[0]
const tail = (a: any[]): any[] => a.slice(1)
const identity = a => a
const isNil = (a: any): boolean => a === null || a === undefined
const split = (b: string, a: string): string[] => a.split(b)
const trim = (a: string): string => a.trim()
const forEach = (f: (i: any) => any, a: any[]) => a.forEach(f)
const keys = (a: Object): string[] => (Object(a) !== a ? [] : Object.keys(a))
const replace = (b: string | RegExp, c: string, a: string): string => a.replace(b, c)
const last = (a: any[]): any => a[a.length - 1]
const reject = (f: (i: any) => boolean, a: any[]): any[] => a.filter(b => !f(b))
const is = (Ctor: any, val: any): boolean => (val != null && val.constructor === Ctor) || val instanceof Ctor
const takeLast = (n: number, a: any[]): any[] => a.slice(-1 * n)
const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
const times = (fn, n) => {
  let list = new Array(n)
  for (let i = 0; i < n; i++) list[i] = fn(i)
  return list
}
const prop = (p, obj) => obj[p]

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
