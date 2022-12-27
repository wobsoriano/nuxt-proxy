import { fileURLToPath } from 'url'
import { addServerHandler, defineNuxtModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import type { Options } from 'http-proxy-middleware'
import { hash, objectHash } from 'ohash'

export interface ModuleOptions {
  options: Options[] | Options
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-proxy',
    configKey: 'proxy',
  },
  defaults: {
    options: [],
  },
  setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir, '#proxy-handler')

    const finalConfig = (nuxt.options.runtimeConfig.proxy = nuxt.options.runtimeConfig.proxy || { options: options.options }) as ModuleOptions

    function createProxyMiddleware(options: Options, index?: number) {
      return `
        import { createProxyMiddleware } from ${JSON.stringify(resolve(runtimeDir, './middleware'))}
        import { defu } from 'defu'
        import { useRuntimeConfig } from '#imports'
    
        const buildtimeOptions = ${JSON.stringify(options)}
        const runtimeOptions = [].concat(useRuntimeConfig().proxy?.options)[${JSON.stringify(index)} ?? 0]
    
        export default createProxyMiddleware(defu(runtimeOptions, buildtimeOptions))
      `
    }

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {}

      if (Array.isArray(finalConfig.options)) {
        finalConfig.options.forEach((options, index) => {
          const handler = `#http-proxy/${hash(objectHash(options))}`
          nitroConfig.virtual![handler] = createProxyMiddleware(options, index)

          addServerHandler({
            handler,
            middleware: true,
          })
        })
      }
      else {
        const handler = `#http-proxy/${hash(objectHash(finalConfig.options))}`
        nitroConfig.virtual[handler] = createProxyMiddleware(finalConfig.options)

        addServerHandler({
          handler,
          middleware: true,
        })
      }
    })
  },
})
