<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_COACH } from '@/services/MiscService'
import { encodeName, headshot } from '@/utils/functions'
import type { Player } from '@/utils/types';

const props = defineProps<{
  coaches: {
    id: string
    full_name: string | null
  }[]
}>()
const open = ref(false)
const selection: Ref<string | null> = ref(null)
const players: Ref<Pick<Player, 'id' | 'full_name' | 'country'>[]> = ref([])

const { query, variables } = GET_COACH('')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult?.coaches[0]?.players) players.value = newResult.coaches[0].players
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleClick = (coach: string) => {
  selection.value = coach
  open.value = true
  refetch({ id: coach })
}
</script>

<template>
  <TabPanel value="3">
    <div class="grid grid-cols-3 gap-3">
      <div v-for="coach in coaches" :key="coach.id"
        class="flex justify-center items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg cursor-pointer"
        @click="handleClick(coach.id)">
        <div class="ml-2">{{ coach.full_name || coach.id }}</div>
      </div>
    </div>
    <Dialog v-model:visible="open" maximizable modal :header="`Players coached by ${selection}`">
      <div v-if="players && players.length > 0" class="grid grid-cols-2 gap-3">
        <div v-for="player in players" :key="player.id"
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
      <Loading v-else :loading>
        <template #none>No results available</template>
      </Loading>
    </Dialog>
  </TabPanel>
</template>