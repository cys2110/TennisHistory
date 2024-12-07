<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import Icon from '@ant-design/icons-vue'
import { encodeName } from '@/utils/functions'

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

const props = defineProps<{
  event: Event
}>()
const selectedFlag = shallowRef(null)

// Import flag icons on mount
onMounted(async () => {
  const countryCode = props.event.venue.country.id
  try {
    const flags: { [key: string]: any } = await import(`@/components/icons/flags`)
    selectedFlag.value = flags[countryCode] || null
  } catch (error) {
    console.error(`Flag for ${countryCode} not found`, error)
  }
})
</script>

<template>
  <a-list-item-meta>
    <template #avatar>
      <Icon v-if="selectedFlag" :component="selectedFlag" class="text-2xl" />
    </template>
    <template #title>
      <router-link
        class="hover-link hover:!text-zinc-300"
        :to="{
          name: 'event',
          params: {
            name: encodeName(event.tournament.name),
            id: event.tournament.id,
            year: event.year.id,
            eid: event.id,
          },
        }"
        >{{ event.tournament.name }} {{ event.year.id }}
      </router-link>
    </template>
  </a-list-item-meta>
</template>
