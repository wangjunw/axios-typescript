// url拼接params
import { isDate, isObject, encode } from './util'
export function buildURL(url: string, params: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      // return跳到下一次循环
      return
    }
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
    let serializedParams = parts.join('&')
    // 去除哈希部分
    if (serializedParams) {
      const index = url.indexOf('#')
      if (index !== -1) {
        url = url.slice(0, index)
      }
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  })
  return url
}
