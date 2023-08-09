import { createApp, h } from "vue"
import { plugin } from "echarts-for-vue"
import * as echarts from "echarts"
import App from "./App.vue"

const app = createApp(App)
app.use(plugin, { echarts, h })

app.mount("#app")
