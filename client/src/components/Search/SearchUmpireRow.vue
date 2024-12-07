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

const props = defineProps<{
  event: Event
}>()
const selectedFlag = shallowRef(null)

// Import flag icons on mount
onMounted(async () => {
  const countryCode = props.event.venue?.country.id
  try {
    const flags: { [key: string]: any } = await import(`@/components/icons/flags`)
    selectedFlag.value = flags[countryCode] || null
  } catch (error) {
    console.error(`Flag for ${countryCode} not found`, error)
  }
})

const getParams = (event: Event) => {
  return {
    name: encodeName(event.tournament.name),
    id: event.tournament.id,
    year: event.year.id,
    eid: event.id,
  }
}
</script>

<template>
  <a-list :data-source="event.rounds">
    <template #header>
      <div class="flex items-center">
        <Icon v-if="selectedFlag" :component="selectedFlag" class="text-2xl" />
        <div class="ml-3">
          <router-link class="hover-link" :to="{ name: 'event', params: getParams(event) }">
            {{ event.tournament.name }} {{ event.year.id }}</router-link
          >
        </div>
      </div>
    </template>
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>{{ item.round }}</template>
          <template #description>
            <div v-for="match in item.matches" :key="match.match_no" class="ml-5 text-sm my-1">
              <router-link
                class="hover-link"
                :to="{ name: 'match', params: { ...getParams(event), mid: match.match_no } }"
              >
                {{ match.p1.player.player.full_name }} vs.
                {{ match.p2.player.player.full_name }}</router-link
              >
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
