import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './default'
import mergeConfig from './core/mergeConfig'
// 把axios编程混合对象
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}
const axios = createInstance(defaults)

// 每次调用create都会创建一个实例
axios.create = function(config) {
  return createInstance(mergeConfig(defaults, config))
}
export default axios
