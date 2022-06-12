import { fileURLToPath } from 'url'
import { addServerHandler, addTemplate, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { Options } from 'http-proxy-middleware'
import { join } from 'pathe'
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
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir, '#build/proxy-handler')

    const handlerPath = join(nuxt.options.buildDir, 'proxy-handler.ts')

    // Final resolved configuration
    const finalConfig = nuxt.options.runtimeConfig.proxy = defu(nuxt.options.runtimeConfig.proxy, {
      logger: options.logger,
      changeOrigin: options.changeOrigin,
    })

    addServerHandler({
      handler: handlerPath,
      middleware: true,
    })

    addTemplate({
      src: 'proxy-handler.ts',
      write: true,
      getContents: () => dedent`
        import createProxyMiddleware from '#build/proxy-handler'
        
        export default createProxyMiddleware(${finalConfig})
      `,
    })
  },
})

