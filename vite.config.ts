import type { PluginOption, UserConfig } from 'vite'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import TailwindCss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import Unfonts from 'unplugin-fonts/vite'
import { defineConfig, loadEnv } from 'vite'
import VueRouter from 'vue-router/vite'

export default defineConfig(async ({ mode }) => {
  const port = Number(loadEnv(mode, process.cwd()).VITE_PORT)

  const devPlugins: PluginOption[] = []
  if (mode === 'development') {
    const VueDevTools = (await import('vite-plugin-vue-devtools')).default
    devPlugins.push(VueDevTools())
  }

  return {
    plugins: [
      VueRouter(),
      Vue(),
      TailwindCss(),
      Unfonts({
        custom: {
          families: [{
            name: 'VK Sans Display',
            local: 'VK Sans Display',
            src: './src/assets/fonts/*.ttf',
          }],

          display: 'auto',
          preload: true,
          prefetch: false,
          injectTo: 'head-prepend',
        },
      }),
      ...devPlugins,
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      port,
      strictPort: true,
      allowedHosts: true,
    },

    preview: {
      port,
      strictPort: true,
    },
  } satisfies UserConfig
})
