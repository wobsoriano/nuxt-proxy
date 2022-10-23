# nuxt-proxy

[![Version](https://img.shields.io/npm/v/nuxt-proxy?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/nuxt-proxy) ![NPM](https://img.shields.io/npm/l/nuxt-proxy?style=flat&colorA=000000&colorB=000000)

Http-proxy middleware for Nuxt and [h3](https://github.com/unjs/h3).

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
    options: {
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
  },
  // OR
  // runtimeConfig: {
  //   proxy: {...}
  // }
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

Pass an array instead for multiple targets

```ts
export default defineNuxtConfig({
  modules: ['nuxt-proxy'],
  // See options here https://github.com/chimurai/http-proxy-middleware#options
  proxy: {
    options: [
      {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/todos': '/todos'
        },
        pathFilter: [
          '/api/todos'
        ]
      },
      {
        target: 'https://api.spacexdata.com/v5',
        changeOrigin: true,
        pathRewrite: {
          '^/api/launches': '/launches/latest',
        },
        pathFilter: [
          '/api/launches',
        ],
      },
    ]
  }
})

// GET /api/todos -> https://jsonplaceholder.typicode.com/todos [304]
// GET /api/launches -> https://api.spacexdata.com/v5/launches/latest [304]
```

## License

MIT
