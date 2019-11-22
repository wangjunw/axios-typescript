// url拼接params
import { isDate, isObject, encode, isURLSearchParams } from './util'
interface URLOrigin {
  protocol: string
  host: string
}
export function buildURL(
  url: string,
  params: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  // params规则
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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
    })
    serializedParams = parts.join('&')
  }
  // 去除哈希部分
  if (serializedParams) {
    const index = url.indexOf('#')
    if (index !== -1) {
      url = url.slice(0, index)
    }
  }
  url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  return url
}

// 判断url是不是绝对地址
export function isAbsoluteUrl(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

// 拼接baseurl和相对url
export function combineUrl(baseUrl: string, relativeUrl?: string): string {
  // baseurl后面的/去掉，相对url前面的/也去掉，再做拼接
  return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}

export function isUrlSameOrigin(requestUrl: string): boolean {
  const parseOrigin = resolveURL(requestUrl)
  return parseOrigin.protocol === currentOrigin.protocol && parseOrigin.host === currentOrigin.host
}

// 通过创建一个a标签可以获取到协议和域名，进而判断是不是同源
const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
