<script setup lang="ts">
import { Breadcrumb } from 'primevue'

const props = defineProps<{ tournament: string; tid: string }>()

const home = { label: 'Home' }
const items = [{ label: 'Tournaments' }, { label: props.tournament }]
</script>

<template>
  <Breadcrumb :home :model="items"> </Breadcrumb>
</template>
