<script setup lang="ts">
import type { NuxtError } from "#app"

defineProps<{ error: NuxtError }>()
</script>

<template>
  <nuxt-layout name="default">
    <u-error
      :error="{
        statusCode: error.statusCode,
        statusMessage: error.statusCode === 404 ? 'Page not found' : error.statusMessage,
        message: error.message
      }"
      :clear="{
        color: 'secondary',
        size: 'xl',
        variant: 'subtle',
        icon: 'material-symbols:arrow-circle-left-outline-rounded'
      }"
    />
  </nuxt-layout>
</template>
