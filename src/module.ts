import { fileURLToPath } from 'url'
import { addServerHandler, addTemplate, defineNuxtModule } from '@nuxt/kit'
import type { Options } from 'http-proxy-middleware'
import { join } from 'pathe'
import { defu } from 'defu'
import dedent from 'dedent'
import { hash, objectHash } from 'ohash'

function createProxyMiddleware(buildDir: string, filename: string, options: Options) {
  addTemplate({
    filename,
    write: true,
    getContents: () => dedent`
      import { createProxyMiddleware } from 'nuxt-proxy/middleware'
      import { useRuntimeConfig } from '#imports'

      export default createProxyMiddleware(useRuntimeConfig().proxy.options)
    `,
  })

  addServerHandler({
    handler: join(buildDir, filename),
    middleware: true,
  })
}

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
    nuxt.options.build.transpile.push(runtimeDir)

    // Final resolved configuration
    const finalConfig = (nuxt.options.runtimeConfig.proxy = defu(nuxt.options.runtimeConfig.proxy, options)) as ModuleOptions

    if (Array.isArray(finalConfig.options)) {
      finalConfig.options.forEach((options) => {
        const filename = `proxy/handler_${hash(objectHash(options))}.ts`
        createProxyMiddleware(nuxt.options.buildDir, filename, options)
      })
    }
    else {
      const filename = 'proxy_handler.ts'
      createProxyMiddleware(nuxt.options.buildDir, filename, finalConfig.options)
    }
  },
})

