<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations'
import { Avatar, Button, ButtonGroup, Card, Divider, Image } from 'primevue'
import FlagIcon from './FlagIcon.vue'
import { EVENT_PAGES } from '@/utils/variables'

const props = defineProps<{ event: EventCardType }>()
const { tname, ename, surface, tid, city, country, dates, start, year, eid, category } = props.event

// Disabled buttons if event has not started yet
const startDate = new Date(start)
const currentDate = new Date()
const isDisabled = currentDate < startDate

const tournamentParams = {
  name: useChangeCase(tname, 'kebabCase').value,
  tid: tid
}
const eventParams = {
  ...tournamentParams,
  year: year,
  eid: eid
}
</script>

<template>
  <Card :id="`event-${eid}`">
    <template #header>
      <Image :src="`/surfaces/${surface}.jpg`" :alt="surface" class="object-fit opacity-75" />
    </template>
    <template #title>
      <router-link class="hover-link" :to="{ name: 'tournament', params: tournamentParams }">
        {{ tname }}
      </router-link>
    </template>
    <template #subtitle>{{ ename ?? '' }}</template>
    <template #content>
      <Divider />
      <div class="flex gap-3 items-center">
        <Avatar :image="`/category/${category}.svg`" :alt="category" class="bg-slate-300" shape="circle" />
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 items-center">
            {{ city }}
            <flag-icon :country />
          </div>
          <div>{{ dates }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <button-group>
        <template v-for="page in EVENT_PAGES" :key="page.title">
          <Button v-if="isDisabled" v-tooltip="'Event has not started yet'" disabled size="small" variant="outlined" rounded>
            <fa-icon :icon="page.icon" :rotation="page.title === 'Draw' && 90" />
            {{ page.title }}
          </Button>
          <Button v-else size="small" variant="outlined" rounded>
            <fa-icon :icon="page.icon" />
            <router-link class="hover-link" :to="{ name: page.name, params: eventParams }">{{ page.title }}</router-link>
          </Button>
        </template>
      </button-group>
    </template>
  </Card>
</template>

<style scoped></style>
