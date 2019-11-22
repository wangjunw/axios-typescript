import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteUrl, combineUrl } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    }
  )
}
// 处理config参数
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}
// 处理url
function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseUrl } = config
  // 如果配置了baseurl并且url不是绝对地址
  if (baseUrl && !isAbsoluteUrl(url!)) {
    url = combineUrl(baseUrl, url)
  }
  // url是可选参数，用!断言防止url不存在
  return buildURL(url!, params, paramsSerializer)
}
// 处理data
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    // 如果有cancelToken就通过throwIfRequested检测是否使用过
    config.cancelToken.throwIfRequested()
  }
}
