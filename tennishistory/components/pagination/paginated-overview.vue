<script setup lang="ts">
const { breadcrumbs, count = 0 } = defineProps<{
  breadcrumbs: { label: string; to?: { name: string }; icon: string }[]
  count?: number
}>()

const selectedLetter = defineModel<string>()
const page = defineModel<number>("page")
const pageSize = defineModel<number>("pageSize", { default: 15 })
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="breadcrumbs" />
      </template>

      <template #right>
        <set-page-size v-model="pageSize" />
      </template>

      <template #toolbar>
        <letters-radio-group
          v-model="selectedLetter"
          @update:modelValue="page = 1"
        />
      </template>

      <slot />

      <pagination-component
        v-if="count > 0"
        v-model="page"
        :total="count"
        :page-size="pageSize"
      />
    </nuxt-layout>
  </div>
</template>
