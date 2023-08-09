import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosPromise,
} from "axios"
// import qs from "qs"

// 创建一个 Axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: "https://api.coingecko.com/api/v3", // 设置基本的 API 地址
  timeout: 10000, // 设置请求超时时间
  // paramsSerializer: params => qs.stringify(params),
})

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 封装通用的 GET 请求函数
export function get<T>(url: string, params?: any): AxiosPromise<T> {
  return instance.get<T>(url, { params })
}

// 封装通用的 POST 请求函数
export function post<T>(url: string, data: any): AxiosPromise<T> {
  return instance.post<T>(url, data)
}

export default instance
