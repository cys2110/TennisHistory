<script setup lang="ts">
import { ref } from 'vue'
import { encodeName } from '@/utils/functions'
import { SURFACES } from '@/utils/variables'
import type { Surface, TitlesAndFinals } from '@/utils/types';

const props = defineProps<{
  events: TitlesAndFinals[]
}>()
const expandedRowGroups = ref()

const getEventParams = (id: number, name: string, eid: number, year: number) => {
  return {
    name: encodeName(name),
    id,
    eid,
    year
  }
}

const calculateYearTotal = (year: number) => {
  const filteredEvents = props.events.filter((event) => event.year === year)
  return filteredEvents.length
}
</script>

<template>
  <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="events" expandableRowGroups rowGroupMode="subheader"
    groupRowsBy="year" sortMode="single" sortField="year" :sortOrder="1" size="small" stripedRows>
    <Column field="year" header="Year" />
    <Column field="tname" header="Event" class="!text-xs md:!text-base">
      <template #body="{ data }">
        <router-link class="hover-link md:ml-3"
          :to="{ name: 'tournament', params: { name: encodeName(data.tname), id: data.tid } }">{{ data.tname
          }}</router-link>
      </template>
    </Column>
    <Column field="surface" header="Surface" class="!text-xs md:!text-base">
      <template #body="{ data }">
        <span>{{ SURFACES[data.surface as Surface] }}</span>
      </template>
    </Column>
    <Column class="!text-xs xl:!text-base">
      <template #body="{ data }">
        <div class="flex flex-col lg:flex-row justify-evenly">
          <Button label="Overview" size="small" variant="outlined" rounded raised as="router-link" class="my-1"
            :to="{ name: 'event', params: getEventParams(data.tid, data.tname, data.id, data.year) }" />
          <Button label="Results" size="small" variant="outlined" rounded raised as="router-link" class="my-1"
            :to="{ name: 'results', params: getEventParams(data.tid, data.tname, data.id, data.year) }" />
          <Button label="Draw" size="small" variant="outlined" rounded raised as="router-link" class="my-1"
            :to="{ name: 'draw', params: getEventParams(data.tid, data.tname, data.id, data.year) }" />
        </div>
      </template>
    </Column>
    <template #groupheader="{ data }">
      <span class="font-bold">{{ data.year }}</span>
    </template>
    <template #groupfooter="{ data }">
      <div class="flex justify-end w-full font-bold">Total in {{ data.year }}: {{ calculateYearTotal(data.year) }}</div>
    </template>
    <template #footer>
      <div class="font-extrabold">Total: {{ events.length }}</div>
    </template>
  </DataTable>
</template>

<style scoped>
:deep(.p-datatable-row-group-header) {
  background-color: var(--p-violet-800);
}
</style>