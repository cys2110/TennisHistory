<script setup lang="ts">
const { categories, status } = defineProps<{
  categories: CategoryType[]
  status: APIStatusType
}>()
</script>

<template>
  <u-page-grid
    v-if="categories.length || ['pending', 'idle'].includes(status)"
    class="pt-10 px-4 pb-2"
  >
    <u-page-card
      v-if="categories.length"
      v-for="category in categories"
      :key="category"
      :to="{ name: 'category', params: { id: encodeName(category) } }"
      :title="category"
      highlight
      highlight-color="joint"
      reverse
      :ui="{
        body: 'mx-auto w-full',
        title: 'text-center',
        container: 'items-center'
      }"
    />
    <loading-base
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>

  <error-message
    v-else
    message="No categories found"
  />
</template>
