import { defineEventHandler } from 'h3'
import { createProxyMiddleware as _createProxyMiddleware } from 'http-proxy-middleware'

export function createProxyMiddleware(options) {
  const proxyMiddleware = _createProxyMiddleware(options)

  return defineEventHandler(async (event) => {
    await new Promise((resolve, reject) => {
      proxyMiddleware(event.node.req, event.node.res, (err) => {
        if (err)
          reject(err)
        else
          resolve(true)
      })
    })
  })
}
