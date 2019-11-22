import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isUrlSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    } = config
    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configerRequset()
    addEvent()
    processHeaders()
    processCancel()

    request.send(data)

    // 配置相关判断
    function configerRequset(): void {
      if (responseType) {
        request.responseType = responseType
      }

      // 设置超时时间，默认是0
      if (timeout) {
        request.timeout = timeout
      }

      // 设置跨域情况下携带请求域的cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    // 添加事件
    function addEvent(): void {
      // 响应处理
      request.onreadystatechange = () => {
        if (request.readyState !== 4 || request.status === 0) {
          return
        }
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      // 处理网络错误，此时没有response
      request.onerror = () => {
        reject(createError('Network Error', config, null, request))
      }
      // 处理超时，此时没有response
      request.ontimeout = () => {
        reject(createError(`Timeout of ${timeout}ms Error`, config, 'ECONNABORTED', request))
      }

      // 上传下载进度事件执行传入的事件
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      if (onUploadProgress) {
        request.onprogress = onUploadProgress
      }
    }

    // 处理headers
    function processHeaders(): void {
      if ((withCredentials || isUrlSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      Object.keys(headers).forEach(name => {
        // 既没有data也没有content-type，删除content-type。否则设置headers
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
      // 如果数据是FormData类型，删除Content-Type
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
    }

    // 取消处理
    function processCancel(): void {
      // cancelToken是CancelToken的实例
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    // 状态码错误
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status <= 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request faild with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
