import { resolve } from 'path'
import { addTemplate, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { Options } from 'http-proxy-middleware'
import { defu } from 'defu'
// @ts-expect-error: No types
import dedent from 'dedent'

const logger = useLogger('nuxt-proxy')

export default defineNuxtModule<Options>({
  meta: {
    name: 'nuxt-proxy',
    configKey: 'proxy',
  },
  defaults: {
    logger,
    changeOrigin: true,
  },
  setup(options, nuxt) {
    const buildDir = nuxt.options.buildDir

    // Final resolved configuration
    const finalConfig = nuxt.options.runtimeConfig.proxy = defu(nuxt.options.runtimeConfig.proxy, {
      logger: options.logger,
      changeOrigin: options.changeOrigin,
    })

    addTemplate({
      src: resolve(buildDir, 'proxyMiddleware.mjs'),
      write: true,
      getContents: () => dedent`
        import { createProxyMiddleware } from 'http-proxy-middleware'
        
        export default createProxyMiddleware(${finalConfig})
      `,
    })
  },
})

