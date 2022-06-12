# nuxt-proxy

[![Version](https://img.shields.io/npm/v/nuxt-proxy?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/nuxt-proxy)

Http-proxy middleware for Nuxt 3.

## Installation

```bash
npm install nuxt-proxy
```

## Usage

```ts
export default defineNuxtConfig({
  modules: ['nuxt-proxy'],
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

## License

MIT
