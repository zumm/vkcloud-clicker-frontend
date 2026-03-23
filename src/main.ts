import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import { DataLoaderPlugin } from 'vue-router/experimental'
import { configureClient } from '@/client-config'
import App from '@/Preloader.vue'
import router from '@/router'
import 'unfonts.css'
import 'vue-final-modal/style.css'

configureClient()

const app = createApp(App)
const pinia = createPinia()
const vfm = createVfm()

app.use(DataLoaderPlugin, { router })
app.use(router)
app.use(pinia)
app.use(PiniaColada)
app.use(vfm)

app.mount('#app')
