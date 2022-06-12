# nuxt-vanilla-extract

[![Version](https://img.shields.io/npm/v/nuxt-vanilla-extract?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/nuxt-vanilla-extract)

Zero-runtime stylesheets in your Nuxt 3 apps.

## Installation

```bash
npm install nuxt-vanilla-extract
```

## Usage

```ts
export default defineNuxtConfig({
  modules: ['nuxt-vanilla-extract'],
  vanilla: {
    // https://vanilla-extract.style/documentation/setup/#identifiers
    identifiers: {}
  }
})
```

```ts
// ~/styles.css.ts
import { createTheme, style } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
})

export const exampleStyle = style({
  backgroundColor: vars.color.brand,
  fontFamily: vars.font.body,
  color: 'white',
  padding: 10
})
```

```html
<script setup lang="ts">
import { themeClass, exampleStyle } from '~/styles.css.ts';
</script>

<template>
  <section :class="themeClass">
    <h1 :class="exampleStyle">Hello world!</h1>
  </section>
</template>
```

## License

MIT
