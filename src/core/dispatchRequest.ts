import { AxiosRequestConfig, AxiosPromise } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { processHeaders } from '../helpers/headers'
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config)
}
// 处理config参数
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}
// 处理url
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  // url是可选参数，用!断言防止url不存在
  return buildURL(url!, params)
}
// 处理data
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
// 处理headers
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
