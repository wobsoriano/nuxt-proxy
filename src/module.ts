import { fileURLToPath } from 'node:url'
import { defu } from 'defu'
import { addServerHandler, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Options } from 'http-proxy-middleware'
import { hash, objectHash } from 'ohash'

export interface ModuleOptions {
  options: Options[] | Options
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-proxy',
    configKey: 'proxy',
    version: '^3.1.0',
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

    function createProxyMiddleware(options: Options, filename: string, index?: number) {
      addTemplate({
        filename,
        write: true,
        getContents() {
          return `
            import { createProxyMiddleware } from ${JSON.stringify(resolve(runtimeDir, './middleware'))}
            import { defu } from 'defu'
            import { useRuntimeConfig } from '#imports'
        
            const buildtimeOptions = ${JSON.stringify(options)}
            const runtimeOptions = [].concat(useRuntimeConfig().proxy?.options)[${JSON.stringify(index)} ?? 0]
        
            export default createProxyMiddleware(defu(runtimeOptions, buildtimeOptions))
          `
        },
      })
    }

    if (Array.isArray(finalConfig.options)) {
      finalConfig.options.forEach((options, index) => {
        const handler = `http-proxy/${hash(objectHash(options))}.ts`
        createProxyMiddleware(options, handler, index)

        addServerHandler({
          handler: resolve(nuxt.options.buildDir, handler),
          middleware: true,
        })
      })
    }
    else {
      const handler = `http-proxy/${hash(objectHash(finalConfig.options))}.ts`
      createProxyMiddleware(finalConfig.options, handler)

      addServerHandler({
        handler: resolve(nuxt.options.buildDir, handler),
        middleware: true,
      })
    }
  },
})
