<script setup lang="ts">
// const { data } = useFetch<{ id: number; title: string }[]>('http://localhost:3000/api/todos')

const { data } = useAsyncData<{ id: number; title: string }[]>('todos', () => $fetch('http://localhost:3000/api/todos'))
</script>

<template>
  <ul>
    <li v-for="t in data" :key="t.id">
      {{ t.title }}
    </li>
  </ul>
</template>
