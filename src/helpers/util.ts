const toString = Object.prototype.toString
// 类型判断, 返回值使用类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}
// 判断是不是一个object类型
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}
// 判断是不是一个普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
// 编码转换，还需要把一些特殊字符再转回去
export function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3a/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2c/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5b/gi, '[')
    .replace(/%5d/gi, ']')
}

// 混合
export function extend<T, U>(to: T, from: U): T & U {
  // from合并到to
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 深拷贝，参数个数不一定
export function deepCopy(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        // 如果值是普通对象，递归
        if (isPlainObject(val)) {
          // 已有的属性也是普通对象
          if (isPlainObject(result[key])) {
            result[key] = deepCopy(result[key], val)
          } else {
            result[key] = deepCopy(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
