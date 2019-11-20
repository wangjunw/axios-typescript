import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepCopy } from '../helpers/util'

const strats = Object.create(null)

// 几种合并策略函数
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
function deepStrat(val1: any, val2: any): any {
  // 如果val2是普通对象，执行深拷贝
  if (isPlainObject(val2)) {
    return deepCopy(val1, val2)
  }
  // 如果val2有值，但不是对象，直接返回
  else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepCopy(val1)
  } else {
    return val1
  }
}

// 如果是以下属性，使用fromVal2Strat策略
const stratKeysFromVal2 = ['url', 'params', 'data', 'timeout']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 以下使用深拷贝策略
const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepStrat
})

// 合并配置
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  // 合并config2
  for (let key in config2) {
    mergeField(key)
  }
  // config2中没有的，合并config1
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }
  return config
}
