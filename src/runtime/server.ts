// ~/server/middleware/proxy.ts
import { defineEventHandler } from 'h3'
// @ts-expect-error: Resolved by Nuxt
import apiProxyMiddleware from '#build/proxyMiddleware.mjs'

export default defineEventHandler(async (event) => {
  await new Promise((resolve, reject) => {
    apiProxyMiddleware(event.req, event.res, (err?: unknown) => {
      if (err)
        reject(err)
      else
        resolve(true)
    })
  })
})
