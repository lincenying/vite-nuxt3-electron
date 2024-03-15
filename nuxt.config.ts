// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    dir: {
    // tell it where to find these directories
        pages: 'src/pages',
        assets: 'src/assets',
        layouts: 'src/layouts',
    },
    components: {
        dirs: ['src/components'],
    },
    modules: [
        '@unocss/nuxt',
        '@pinia/nuxt',
        '@vue-macros/nuxt',
        '@vueuse/nuxt',
    ],

    css: [
        '@unocss/reset/tailwind-compat.css',
    ],

    hooks: {
        'prepare:types': ({ references }) => {
            references.push({ types: '@lincy/utils' })
        },
    },
})
