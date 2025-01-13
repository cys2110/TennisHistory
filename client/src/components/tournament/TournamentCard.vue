<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { Button, ButtonGroup, Card } from 'primevue'
import { EVENT_PAGES } from '@/utils/variables'
import FlagIcon from '../FlagIcon.vue'
import AvatarComponent from '../primevue/AvatarComponent.vue'

const tname = useRouteParams('name')
const tid = useRouteParams('tid')

const props = defineProps<{ event: TournamentEventType }>()
const { year, eid, match_no, winner_id, winner_name, winner_country, loser_id, loser_name, loser_country } = props.event

const eventParams = { name: tname.value, tid: tid.value, year, eid }
const matchParams = { ...eventParams, mid: match_no }
</script>

<template>
  <Card :id="`event-${eid}`">
    <template #title>{{ year }}</template>
    <template #content>
      <div class="flex flex-col items-center gap-3">
        <div class="flex items-center gap-2">
          <flag-icon v-if="winner_country" :country="winner_country" />
          <avatar-component v-if="winner_id && winner_name" :id="winner_id" :name="winner_name" />
          <router-link class="hover-link" :to="{ name: 'player', params: { name: winner_name, id: winner_id } }">{{ winner_name }}</router-link>
        </div>
        <div>d.</div>
        <div class="flex items-center gap-2">
          <flag-icon v-if="loser_country" :country="loser_country" />
          <avatar-component v-if="loser_id && loser_name" :id="loser_id" :name="loser_name" />
          <router-link class="hover-link" :to="{ name: 'player', params: { name: loser_name, id: loser_id } }">{{ loser_name }}</router-link>
        </div>
        <router-link :to="{ name: 'match', params: matchParams }" class="hover-link flex gap-1">
          <template v-for="(_, index) in new Array(5)" :key="index">
            <span v-if="(event as any)[`s${index + 1}`]">
              {{ (event as any)[`s${index + 1}`] }}
              <sup v-if="(event as any)[`t${index + 1}`]">{{ (event as any)[`t${index + 1}`] }}</sup>
            </span>
          </template>
        </router-link>
      </div>
    </template>
    <template #footer>
      <button-group>
        <Button v-for="page in EVENT_PAGES" :key="page.title" size="small" variant="outlined" rounded>
          <fa-icon :icon="page.icon" :rotation="page.title === 'Draw' ? 90 : 0" />
          <router-link class="hover-link" :to="{ name: page.name, params: eventParams }">{{ page.title }}</router-link>
        </Button>
      </button-group>
    </template>
  </Card>
</template>

<style scoped></style>
