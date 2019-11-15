import { isPlainObject } from './util'
// 兼容headers中属性大小写
function normalizeHeaderName(headers: any, normalizeName: string): any {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}
export const processHeaders = (headers: any, data: any): any => {
  normalizeHeaderName(headers, 'Content-Type')
  // 如果有data要设置Content-Type后端才可以拿到数据
  if (isPlainObject(data)) {
    // 如果没有配置Content-Type就默认为application/json;charset=utf-8
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
