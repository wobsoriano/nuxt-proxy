import { fileURLToPath } from 'url'
import { addServerHandler, addTemplate, defineNuxtModule } from '@nuxt/kit'
import type { Options } from 'http-proxy-middleware'
import { join } from 'pathe'
import { defu } from 'defu'
import dedent from 'dedent'

export default defineNuxtModule<Options>({
  meta: {
    name: 'nuxt-proxy',
    configKey: 'proxy',
  },
  defaults: {},
  setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir, '#build/proxy-handler')

    // Final resolved configuration
    const finalConfig = nuxt.options.runtimeConfig.proxy = defu(nuxt.options.runtimeConfig.proxy, options)

    addTemplate({
      filename: 'proxy-handler.ts',
      write: true,
      getContents: () => dedent`
        import { createProxyMiddleware } from 'nuxt-proxy/middleware'
        
        export default createProxyMiddleware(${JSON.stringify(finalConfig)})
      `,
    })

    addServerHandler({
      handler: join(nuxt.options.buildDir, 'proxy-handler.ts'),
      middleware: true,
    })
  },
})

