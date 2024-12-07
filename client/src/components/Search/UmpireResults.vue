<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_UMPIRE } from '@/services/MiscService'

const props = defineProps<{
  umpires: string[]
}>()

interface Event {
  id: number
  tournament: {
    id: number
    name: string
  }
  year: {
    id: number
  }
  venue: {
    country: {
      id: string
    }
  }
  rounds: {
    round: string
    matches: {
      match_no: number
      p1: {
        player: {
          player: {
            full_name: string
            id: string
          }
        }
      }
      p2: {
        player: {
          player: {
            full_name: string
            id: string
          }
        }
      }
    }[]
  }
}

const open = ref(false)
const selection: Ref<string | null> = ref(null)
const events: Ref<Event[]> = ref([])

const { query, variables } = GET_UMPIRE('')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
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

const handleClose = () => {
  open.value = false
  selection.value = null
}
</script>

<template>
  <a-list :data-source="umpires" header="Umpires">
    <template #renderItem="{ item }">
      <a-list-item class="cursor-pointer" @click="handleClick(item.id)">{{ item.id }}</a-list-item>
    </template>
  </a-list>
  <a-drawer
    v-if="selection"
    v-model:open="open"
    @close="handleClose"
    size="large"
    class="!bg-violet-800"
  >
    <template #title>Matches umpired by {{ selection }}</template>
    <SearchUmpireRow v-for="event in events" :key="event.id" :event="event" />
  </a-drawer>
</template>
