import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  server: {
    hmr: true,
    open: true,
    port: 8080,
    // 跨域配置
    proxy: {
      '/biobank': {
        // 正式环境
        target: 'http://150.158.18.74:8082',
        changeOrigin: true,
      },
      '/system': {
        // 正式环境
        target: 'http://150.158.18.74:8082',
        changeOrigin: true,
      },
      '/common': {
        // 正式环境
        target: 'http://150.158.18.74:8082',
        changeOrigin: true,
      },
    }
  },
  build: {
    outDir: 'biobank'
  }
})
