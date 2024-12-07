<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_COACH } from '@/services/MiscService'
import { encodeName } from '@/utils/functions'

const props = defineProps<{
  coaches: {
    id: string
    full_name: string | null
  }[]
}>()

interface Player {
  id: string
  full_name: string
  country: {
    name: string
    id: string
  }
}
const open = ref(false)
const selection: Ref<{ id: string; full_name: string | null } | null> = ref(null)
const players: Ref<Player[]> = ref([])

const { query, variables } = GET_COACH('')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult?.coaches[0]?.players) players.value = newResult.coaches[0].players
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleClick = (coach: { id: string; full_name: string | null }) => {
  selection.value = coach
  open.value = true
  refetch({ id: coach.id })
}

const handleClose = () => {
  open.value = false
  selection.value = null
}

const getParams = (item: { id: string; full_name: string | null }) => {
  return {
    name: encodeName(item.full_name || 'Unknown'),
    id: item.id,
  }
}
</script>

<template>
  <a-list :data-source="coaches" header="Coaches">
    <template #renderItem="{ item }">
      <a-list-item class="cursor-pointer" @click="handleClick(item)">{{
        item.full_name || item.id
      }}</a-list-item>
    </template>
  </a-list>
  <a-drawer
    v-if="selection"
    v-model:open="open"
    @close="handleClose"
    size="large"
    class="!bg-violet-800"
  >
    <template #title
      >Players coached by
      <router-link
        v-if="selection.full_name"
        class="hover-link font-bold"
        :to="{ name: 'player', params: getParams(selection) }"
        >{{ selection.full_name }}</router-link
      >
      <span v-else class="font-bold">{{ selection.id }}</span>
    </template>
    <a-list v-if="players.length > 0" :data-source="players">
      <template #renderItem="{ item }">
        <a-list-item>
          <SearchPlayerRow :player="item" />
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>
</template>
