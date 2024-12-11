<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_COUNTRY } from '@/services/MiscService'
import { encodeName, headshot } from '@/utils/functions'
import type { Player } from '@/utils/types';

const props = defineProps<{
  countries: {
    id: string
    name: string
  }[]
}>()

const open = ref(false)
const selection: Ref<string | null> = ref(null)
const players: Ref<{ players: Pick<Player, 'id' | 'full_name'>[], formerPlayers: Pick<Player, 'id' | 'full_name' | 'country'>[] } | null> = ref(null)

const { query, variables } = GET_COUNTRY('')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) players.value = newResult.countries[0]
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleClick = (country: string) => {
  selection.value = country
  open.value = true
  refetch({ name: country })
}
</script>

<template>
  <TabPanel value="2">
    <div class="grid grid-cols-3 gap-3">
      <div v-for="country in countries" :key="country.id"
        class="flex justify-center items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg cursor-pointer"
        @click="handleClick(country.name)">
        <div>
          <GetFlag :country="country.id" />
        </div>
        <div class="ml-2">{{ country.name }}</div>
      </div>
    </div>
    <Dialog v-model:visible="open" maximizable modal :header="`Players who have represented ${selection}`">
      <Fieldset v-if="players && players.players.length > 0" legend="Current or retired players">
        <div class="grid grid-cols-2 gap-3">
          <div v-for="player in players.players" :key="player.id"
            class="flex items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg">
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(player.id)" class="mx-2" />
            <div class="ml-2">
              <router-link class="hover-link"
                :to="{ name: 'player', params: { name: encodeName(player.full_name), id: player.id } }">
                {{ player.full_name }}
              </router-link>
            </div>
          </div>
        </div>
      </Fieldset>
      <Fieldset v-if="players && players.formerPlayers.length > 0" legend="Former players">
        <div class="grid grid-cols-2 gap-3">
          <div v-for="player in players.formerPlayers" :key="player.id"
            class="flex items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg">
            <div>
              <GetFlag :country="player.country.id" />
            </div>
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(player.id)" class="mx-2" />
            <div class="ml-2">
              <router-link class="hover-link"
                :to="{ name: 'player', params: { name: encodeName(player.full_name), id: player.id } }">
                {{ player.full_name }}
              </router-link>
            </div>
          </div>
        </div>
      </Fieldset>
      <Loading v-else :loading>
        <template #none>No results available</template>
      </Loading>
    </Dialog>
  </TabPanel>
</template>