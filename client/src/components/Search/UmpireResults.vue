<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_UMPIRE } from '@/services/MiscService'
import type { Event } from '@/utils/types';
import { encodeName } from '@/utils/functions';

const props = defineProps<{
  umpires: { id: string }[]
}>()

const open = ref(false)
const selection: Ref<string | null> = ref(null)
const events: Ref<Pick<Event, 'id' | 'tournament' | 'year' | 'venue' | 'rounds'>[]> = ref([])

const { query, variables } = GET_UMPIRE('')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) console.log(newResult)
  if (newResult) events.value = newResult.events
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleClick = (umpire: string) => {
  selection.value = umpire
  open.value = true
  refetch({ id: umpire })
}
</script>

<template>
  <TabPanel value="4">
    <div class="grid grid-cols-3 gap-3">
      <div v-for="umpire in umpires" :key="umpire.id"
        class="flex justify-center items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg cursor-pointer"
        @click="handleClick(umpire.id)">
        <div class="ml-2">{{ umpire.id }}</div>
      </div>
    </div>
    <Dialog v-model:visible="open" maximizable modal :header="`Matches umpired by ${selection}`">
      <div v-if="events && events.length > 0" class="grid grid-cols-1 gap-3">
        <Fieldset v-for="event in events" :key="event.id">
          <template #legend>
            <div class="flex items-center gap-2">
              <div>
                <GetFlag v-if="event.venue?.country?.id" :country="event.venue.country.id" />
              </div>
              <div class="ml-2">
                <router-link class="hover-link !font-bold"
                  :to="{ name: 'event', params: { name: encodeName(event.tournament.name), id: event.tournament.id, year: event.year.id, eid: event.id } }">
                  {{ event.tournament.name }} {{ event.year.id }}
                </router-link>
              </div>
            </div>
          </template>
          <div class="flex flex-col gap-2">
            <Panel v-for="round in event.rounds" :key="round.round" :header="round.round">
              <div class="flex flex-col gap-1">
                <div v-for="match in round.matches">
                  <router-link class="hover-link"
                    :to="{ name: 'match', params: { name: encodeName(event.tournament.name), id: event.tournament.id, year: event.year.id, eid: event.id, mid: match.match_no } }">{{
                      match.p1.player.player.full_name }} v. {{ match.p2.player.player.full_name }}
                  </router-link>
                </div>
              </div>
            </Panel>
          </div>
        </Fieldset>
      </div>
      <Loading v-else :loading>
        <template #none>No results available</template>
      </Loading>
    </Dialog>
  </TabPanel>
</template>