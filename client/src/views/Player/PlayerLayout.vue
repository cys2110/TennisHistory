<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router'
import { useUrlNames } from '@/utils/useUrlNames';
import { updateDocumentTitle } from '@/utils/functions';

const { unencodeName } = useUrlNames()

const props = defineProps<{
  name: string
  id: string
}>()
const route = useRoute()

const pages = [
  { title: 'Overview', name: 'player' },
  { title: 'Activity', name: 'activity' },
  { title: 'Titles and Finals', name: 'titles' },
  { title: 'Win-Loss Index', name: 'index' },
  { title: 'Stats', name: 'stats' }
]

const getPageName = () => {
  const pageName = Object.entries(pages).find(([key, value]) => value.name === route.name)
  return pageName![1].title
}

// Update document title
watch(() => route.name, () => {
  const pageName = getPageName()
  updateDocumentTitle(`${pageName} | ${unencodeName(props.name)}`)
}, { immediate: true })
</script>

<template>
  <div class="lg:w-3/4 mx-auto">
    <Title>
      <template #title>{{ unencodeName(name) }}</template>
      <template #subtitle>{{ getPageName() }}</template>
    </Title>
    <router-view :pageNames="pages" />
  </div>
</template>