// type类型别名用来给一个类型起个新名字。
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'POST'
  | 'post'
  | 'options'
  | 'OPTIONS'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
// 调用axios传入的参数必须符合该接口
export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
}
