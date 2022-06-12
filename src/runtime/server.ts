import type { Options } from 'http-proxy-middleware'
import { createProxyMiddleware as _createProxyMiddleware } from 'http-proxy-middleware'

export default function createProxyMiddleware(options: Options) {
  const proxyMiddleware = _createProxyMiddleware(options)

  // @ts-expect-error: Resolved by Nuxt
  return defineEventHandler(async (event) => {
    await new Promise((resolve, reject) => {
      proxyMiddleware(event.req, event.res, (err?: unknown) => {
        if (err)
          reject(err)
        else
          resolve(true)
      })
    })
  })
}
