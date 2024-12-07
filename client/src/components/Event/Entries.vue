<script setup lang="ts">
import { EventEntries } from '@/utils/types'

const props = defineProps<{
  entries: EventEntries[]
}>()
</script>

<template>
  <div id="entries" class="text-4xl my-5">Entries</div>
  <a-row justify="space-evenly" :gutter="[0, 32]">
    <a-col :xs="24" :md="11" :lg="7" :xl="5" v-for="entry in entries" :key="entry.player.id">
      <EntryCard :entry="entry" />
    </a-col>
  </a-row>
</template>
