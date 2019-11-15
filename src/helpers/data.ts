import { isPlainObject } from './util'
// 如果data是普通对象，转成对象字符串
export const transformRequest = (data: any): any => {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
