import type { Options } from 'http-proxy-middleware'
import { defineEventHandler } from 'h3'
import { createProxyMiddleware as _createProxyMiddleware } from 'http-proxy-middleware'

export function createProxyMiddleware(options: Options) {
  const proxyMiddleware = _createProxyMiddleware(options)

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
