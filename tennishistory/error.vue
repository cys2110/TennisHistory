<script setup lang="ts">
import type { NuxtError } from "#app"

const appConfig = useAppConfig()
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
        icon: appConfig.ui.icons.arrowLeft
      }"
    />
  </nuxt-layout>
</template>
