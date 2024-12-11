<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_VENUE } from '@/services/MiscService'
import { encodeName } from '@/utils/functions'
import type { Event, Venue } from '@/utils/types';
import GetFlag from '../Global/GetFlag.vue';

const props = defineProps<{
  venues: Venue[]
}>()
const open = ref(false)
const selection: Ref<{ name: string; city: string }> = ref({ name: '', city: '' })
const events: Ref<Pick<Event, 'id' | 'tournament' | 'year'>[]> = ref([])

const { query, variables } = GET_VENUE('', '')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult?.venues[0]?.events) events.value = newResult.venues[0].events
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleClick = (venue: Venue) => {
  selection.value = { name: venue.name, city: venue.city }
  open.value = true
  refetch({ name: venue.name, city: venue.city })
}
</script>

<template>
  <TabPanel value="6">
    <div class="grid grid-cols-3 gap-3">
      <div v-for="venue in venues" :key="venue.name"
        class="flex flex-col justify-center items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg cursor-pointer"
        @click="handleClick(venue)">
        <div class="ml-2">{{ venue.name }}</div>
        <div class="mx-2">{{ venue.city }}
          <GetFlag class="mx-2" :country="venue.country.id" />
        </div>
      </div>
    </div>
    <Dialog v-model:visible="open" maximizable modal
      :header="`Events which took place in ${selection.name}, ${selection.city}`">
      <div v-if="events && events.length > 0" class="grid grid-cols-2 gap-3">
        <div v-for="event in events" :key="event.id"
          class="flex justify-center items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg">
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