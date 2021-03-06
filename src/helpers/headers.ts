import { isPlainObject, deepCopy } from './util'
import { Method } from '../types'
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

// 转换响应headers为json，因为headers是以换行符分隔的字符串
export const parseHeaders = (headers: string): any => {
  let headersObj = Object.create(null)
  if (!headers) {
    return headersObj
  }
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    headersObj[key] = val
  })
  return headersObj
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  // 把common和methed合并到同一级，headers身上
  headers = deepCopy(headers.common, headers[method], headers)

  // 定义合并之后要删掉的属性
  const deleteKeys = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  deleteKeys.forEach(key => {
    delete headers[key]
  })
  return headers
}
