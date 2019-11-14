const toString = Object.prototype.toString
// 类型判断, 返回值使用类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
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
