import { fileURLToPath } from 'node:url'
import { defu } from 'defu'
import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
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
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir, /#http-proxy/)

    const finalConfig = nuxt.options.runtimeConfig.proxy = defu(nuxt.options.runtimeConfig.proxy, {
      options: options.options,
    })

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
          const handler = `#http-proxy/${hash(objectHash(options))}.mjs`
          nitroConfig.virtual![handler] = createProxyMiddleware(options, index)

          addServerHandler({
            handler,
            middleware: true,
          })
        })
      }
      else {
        const handler = `#http-proxy/${hash(objectHash(finalConfig.options))}.mjs`
        nitroConfig.virtual[handler] = createProxyMiddleware(finalConfig.options)

        addServerHandler({
          handler,
          middleware: true,
        })
      }
    })
  },
})
