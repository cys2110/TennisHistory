<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_SURFACE } from '@/services/MiscService'
import { encodeName } from '@/utils/functions'

const props = defineProps<{
  surfaces: {
    id: string
  }[]
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
}

const open = ref(false)
const selection: Ref<string | null> = ref(null)
const events: Ref<Event[]> = ref([])

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

const handleClose = () => {
  open.value = false
  selection.value = null
}
</script>

<template>
  <a-list :data-source="surfaces" header="Surfaces">
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
    <template #title>Events which took place on {{ selection }}</template>
    <a-list v-if="events.length > 0" :data-source="events">
      <template #renderItem="{ item }">
        <a-list-item>
          <SearchEventRow :event="item" />
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>
</template>
