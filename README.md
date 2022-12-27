# nuxt-proxy

[![Version](https://img.shields.io/npm/v/nuxt-proxy?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/nuxt-proxy) ![NPM](https://img.shields.io/npm/l/nuxt-proxy?style=flat&colorA=000000&colorB=000000)

Http-proxy middleware for Nuxt and [h3](https://github.com/unjs/h3).

## ⭐️ Before using

Check out H3's built-in [proxyRequest](https://www.jsdocs.io/package/h3#proxyRequest) helper before using this module. 😀

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

You can pass an array of options for multiple targets.

## Runtime config

```env
NUXT_PROXY_OPTIONS_TARGET=https://reqres.in/api
```
```ts
export default defineNuxtConfig({
  modules: ['nuxt-proxy'],
  runtimeConfig: {
    proxy: {
      options: { target: 'https://jsonplaceholder.typicode.com', ...{ /* config */} }
    }
  }
})
// GET /api/users -> https://reqres.in/api/users [304]
```

## License

MIT
