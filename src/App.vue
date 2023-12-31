<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.min.mjs"
import { getCoinMarket, getCurrency } from "./api"
import { ref, reactive } from "vue"
import { ElButton, ElFormItem, ElForm, ElSelect, ElOption, ElDatePicker, ElInput, ElConfigProvider } from "element-plus"
import dayjs from "dayjs"

const coinOption = ref()
const investOption = ref()
const currencyList = ref<string[]>([])
const coinList = ref<string[]>(["bitcoin"])
const investRuleList = ref<any[]>([
  {
    value: "month",
    label: "月定投",
  },
  {
    value: "week",
    label: "周定投",
  },
  {
    value: "day",
    label: "日定投",
  },
])

const form = reactive({
  coin: "bitcoin",
  currency: "cny",
  date: "",
  invest: "",
  investRule: "month",
})

const onSubmit = () => {
  getCoinData()
}

const getList = () => {
  // 法币列表
  getCurrency().then((res: any) => {
    currencyList.value = res
  })
  // 数据量太大
  // getCoins().then((res: any) => {
  //   coinList.value = res.map((c: any) => c.id)
  // })
}

const getCoinData = () => {
  getCoinMarket(form.coin, {
    vs_currency: form.currency,
    from: dayjs(form.date[0]).unix(),
    to: dayjs(form.date[1]).unix(),
  }).then((res: any) => {
    // 处理粒度
    let prices = res.prices // 范围价格
    const daySub = dayjs(form.date[1]).diff(dayjs(form.date[0]), "days")
    if (daySub < 90) {
      prices = prices.filter((_: any, index: any) => index % 24 === 0)
    }
    if (form.investRule === "week") {
      prices = prices.filter((_: any, index: any) => index % 7 === 0)
    } else if (form.investRule === "month") {
      const curDay = dayjs(form.date[0]).date()
      prices = prices.filter((item: any) => dayjs(item[0]).date() === curDay)
    }
    computeCoinOption(res.prices)
    computeInvest(prices)
  })
}

// 计算走势
const computeCoinOption = (prices: any) => {
  const XData = prices.map((item: any) => dayjs(item[0]).format("YYYY-MM-DD"))
  const YData = prices.map((item: any) => item[1])
  coinOption.value = {
    animationDuration: 10000,  // 动画
    title: {
      // 标题
      text: `${form.coin}走势`,
      left: "10%",
    },
    legend: {
      show: true,
    },
    xAxis: {
      type: "category",
      data: XData,
    },
    yAxis: {
      type: "value",
      scale: true,
      splitLine: {
        show: false,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    series: [
      {
        data: YData,
        type: "line",
        smooth: true,
        showSymbol: false,
      },
    ],
  }
}

// 计算定投
const computeInvest = (prices: any) => {
  const XData = prices.map((item: any) => dayjs(item[0]).format("YYYY-MM-DD"))
  // 定投本金
  const YData1 = prices.map((_: any, index: number) => (index + 1) * Number(form.invest))
  let r = 0
  // 资产
  const YData2 = prices.map((item: any) => {
    r += 1 / item[1]
    return (Number(form.invest) * item[1] * r).toFixed(3)
  })
  investOption.value = {
    animationDuration: 10000, // 动画
    title: {
      // 标题
      text: `${form.coin}定投图`,
      left: "10%",
    },
    legend: {
      show: true,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: XData,
    },
    yAxis: {
      type: "value",
      scale: true,
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        data: YData1,
        name: "本金",
        type: "line",
        smooth: true,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return params.seriesName + ": " + params.value
          },
        },
      },
      {
        data: YData2,
        name: "资产",
        type: "line",
        smooth: true,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return params.seriesName + ": " + params.value
          },
        },
      },
    ],
  }
}

getList()
</script>

<template>
  <el-config-provider :locale="zhCn">
    <el-form :model="form" label-width="120px" :inline="true">
      <el-form-item label="币种：">
        <el-select v-model="form.coin" filterable placeholder="请选择">
          <el-option :label="coin" :value="coin" :key="coin" v-for="coin in coinList" />
        </el-select>
      </el-form-item>
      <el-form-item label="法币：">
        <el-select v-model="form.currency" filterable placeholder="请选择">
          <el-option :label="currency" :value="currency" :key="currency" v-for="currency in currencyList" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围：">
        <el-date-picker v-model="form.date" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" />
      </el-form-item>
      <el-form-item label="定投规则：">
        <el-select v-model="form.investRule" filterable placeholder="请选择">
          <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in investRuleList" />
        </el-select>
      </el-form-item>
      <el-form-item label="定投金额：">
        <el-input v-model="form.invest" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
    <ECharts :option="investOption" theme="light" auto-resize style="width: 100%; height: 500px" />
    <ECharts :option="coinOption" theme="light" auto-resize style="width: 100%; height: 500px" />
  </el-config-provider>
</template>

<style scoped></style>
