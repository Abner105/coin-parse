import { get } from "../utils/request"

// 接口文档：https://www.coingecko.com/en/api/documentation

export const getCoinMarket = (id: string, params: any) => {
  return get(`/coins/${id}/market_chart/range`, params)
}
export const getCurrency = () => {
  return get("/simple/supported_vs_currencies")
}
export const getCoins = () => {
  return get("/coins/list", { include_platform: false })
}
