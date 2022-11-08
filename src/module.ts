import { fileURLToPath } from 'url'
import { addServerHandler, addTemplate, defineNuxtModule } from '@nuxt/kit'
import type { Options } from 'http-proxy-middleware'
import { join } from 'pathe'
import dedent from 'dedent'
import { hash, objectHash } from 'ohash'

function createProxyMiddleware(buildDir: string, filename: string, options: Options, index?: number) {
  addTemplate({
    filename,
    write: true,
    getContents: () => dedent`
      import { createProxyMiddleware } from 'nuxt-proxy/middleware'
      import { defu } from 'defu'
      import { useRuntimeConfig } from '#imports'

      const buildtimeOptions = ${JSON.stringify(options)}
      const runtimeOptions = [].concat(useRuntimeConfig().proxy?.options)[${JSON.stringify(index)} ?? 0]

      export default createProxyMiddleware(defu(runtimeOptions, buildtimeOptions))
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

    const finalConfig = (nuxt.options.runtimeConfig.proxy = nuxt.options.runtimeConfig.proxy || { options: options.options }) as ModuleOptions

    if (Array.isArray(finalConfig.options)) {
      finalConfig.options.forEach((options, index) => {
        const filename = `proxy/handler_${hash(objectHash(options))}.ts`
        createProxyMiddleware(nuxt.options.buildDir, filename, options, index)
      })
    }
    else {
      const filename = 'proxy_handler.ts'
      createProxyMiddleware(nuxt.options.buildDir, filename, finalConfig.options)
    }
  },
})

