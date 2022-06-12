import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['nuxt-proxy'],
  proxy: {
    target: 'https://jsonplaceholder.typicode.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/todos': '/todos',
      '^/api/users': '/users',
    },
    pathFilter: [
      '/api/todos',
      '/api/users',
    ],
  },
})
