# nuxt-proxy

[![Version](https://img.shields.io/npm/v/nuxt-proxy?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/nuxt-proxy) ![NPM](https://img.shields.io/npm/l/nuxt-proxy?style=flat&colorA=000000&colorB=000000)

Http-proxy middleware for Nuxt 3.

## Installation

```bash
npm install nuxt-proxy
```

## Usage

```ts
export default defineNuxtConfig({
  modules: ['nuxt-proxy'],
  // See options here https://github.com/chimurai/http-proxy-middleware#options
  proxy: {
    target: 'https://jsonplaceholder.typicode.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/todos': '/todos',
      '^/api/users': '/users'
    },
    pathFilter: [
      '/api/todos',
      '/api/users'
    ]
  }
})

// GET /api/todos -> https://jsonplaceholder.typicode.com/todos [304]
// GET /api/users -> https://jsonplaceholder.typicode.com/users [304]
```

```html
<script setup>
// Base url is required
const { data } = useFetch('http://localhost:3000/api/todos')
</script>
```

## Usage with h3

```ts
import { createApp } from 'h3'
import { createProxyMiddleware } from 'nuxt-proxy/middleware'

const app = createApp()

app.use(createProxyMiddleware({}))
```

## License

MIT
