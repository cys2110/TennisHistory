<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_SURFACE } from '@/services/MiscService'
import { encodeName } from '@/utils/functions'
import type { Event, Surface } from '@/utils/types';
import { SURFACES } from '@/utils/variables';

const props = defineProps<{
  surfaces: {
    id: string
  }[]
}>()

const open = ref(false)
const selection: Ref<string | null> = ref(null)
const events: Ref<Pick<Event, 'id' | 'tournament' | 'year' | 'venue'>[]> = ref([])

const { query, variables } = GET_SURFACE('')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult?.surfaces[0]?.events) events.value = newResult.surfaces[0].events
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleClick = (surface: string) => {
  selection.value = surface
  open.value = true
  refetch({ id: surface })
}
</script>

<template>
  <TabPanel value="5">
    <div class="grid grid-cols-3 gap-3">
      <div v-for="surface in surfaces" :key="surface.id"
        class="flex justify-center items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg cursor-pointer"
        @click="handleClick(surface.id)">
        <div class="ml-2">{{ SURFACES[surface.id as Surface] }}</div>
      </div>
    </div>
    <Dialog v-model:visible="open" maximizable modal :header="`Events which took place on ${selection}`">
      <div v-if="events && events.length > 0" class="grid grid-cols-2 gap-3">
        <div v-for="event in events" :key="event.id"
          class="flex items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg">
          <div>
            <GetFlag :country="event.venue.country.id" />
          </div>
          <div class="ml-2">
            <router-link class="hover-link"
              :to="{ name: 'event', params: { name: encodeName(event.tournament.name), id: event.tournament.id, year: event.year.id, eid: event.id } }">
              {{ event.tournament.name }} {{ event.year.id }}
            </router-link>
          </div>
        </div>
      </div>
      <Loading v-else :loading>
        <template #none>No results available</template>
      </Loading>
    </Dialog>
  </TabPanel>
</template>