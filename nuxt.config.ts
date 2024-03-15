import fs from 'node:fs'
import path from 'node:path'

import { appDescription } from './src/constants/index'

fs.rmSync(path.join(__dirname, 'dist-electron'), { recursive: true, force: true })

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    srcDir: 'src',
    modules: [
        '@element-plus/nuxt',
        '@nuxtjs/color-mode',
        '@unocss/nuxt',
        '@pinia/nuxt',
        '@vue-macros/nuxt',
        '@vueuse/nuxt',
        'nuxt-electron',
    ],

    experimental: {
        // 使用generate时，payload js资源包含在sw预缓存清单中
        // 但离线时丢失，禁用提取直到修复
        payloadExtraction: false,
        renderJsonPayloads: true,
        typedPages: true,

        // @ts-expect-error 缺失类型
        inlineSSRStyles: false,
    },

    app: {
        rootId: 'nuxt-root',
        head: {
            viewport: 'width=device-width,initial-scale=1',
            link: [
                { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
                { rel: 'icon', type: 'image/svg+xml', href: '/svg/nuxt.svg' },
                { rel: 'apple-touch-icon', href: '/images/apple-touch-icon.png' },
            ],
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: appDescription },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            ],
        },
    },

    runtimeConfig: {
        app: {

        },
    },

    css: [
        '@unocss/reset/tailwind-compat.css',
    ],

    nitro: {
        esbuild: {
            options: {
                target: 'esnext',
            },
        },
        routeRules: {
            '/api/**': {
                proxy: 'https://php.mmxiaowu.com/api/fetch/**',
            },
        },
        runtimeConfig: {
            app: {
            },
        },
    },
    ssr: true,

    hooks: {
        'prepare:types': ({ references }) => {
            references.push({ types: '@lincy/utils' })
        },
    },

    electron: {
        build: [
            {
                entry: 'src/electron/main.ts',
            },
            {
                entry: 'src/electron/preload.ts',
                onstart(options: any) {
                    // Notify the renderer process to reload the page when the preload-script is completely loaded
                    // Instead of restarting the entire electron app
                    options.reload()
                },
            },
        ],
        renderer: {},
        disableDefaultOptions: true,
    },
})
