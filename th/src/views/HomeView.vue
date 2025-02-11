<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { NPageHeader } from 'naive-ui'

useHead({ title: 'Home', templateParams: { page: null } })
</script>

<template>
  <n-page-header title="TennisHistory" />
</template>
