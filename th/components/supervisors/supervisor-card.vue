<script setup lang="ts">
defineProps<{ supervisor: { id: string; first_name: string; last_name: string } }>()
</script>

<template>
  <u-page-card
    :title="supervisor.first_name + ' ' + supervisor.last_name"
    :to="{ name: 'supervisor', params: { id: encodeName(supervisor.first_name + ' ' + supervisor.last_name) } }"
    highlight
    :ui="{ container: 'justify-center items-center text-center' }"
  />
</template>
