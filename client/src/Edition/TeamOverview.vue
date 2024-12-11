<script setup>
import { formatCurrency, joinArray, flagSrc, headshot } from '@/components/utils'
import PlayerService from '@/services/PlayerService'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps(['edition', 'ties'])
const teams = ref(null)

onMounted(() => {
  PlayerService.getTeamPlayersByEdition(props.edition.id)
    .then((response) => (teams.value = response.data))
    .catch((error) => console.log(error))
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <div class="detail" v-if="edition.venue">
          <span class="font-weight-bold">Venue</span>
          <span>{{ edition.venue }}</span>
        </div>
        <div class="detail">
          <span class="font-weight-bold">City</span>
          <span>{{ edition.city }}</span>
        </div>
        <div class="detail" v-if="edition.surface">
          <span class="font-weight-bold">Surface</span>
          <span
            >{{ edition.environment }} {{ edition.surface
            }}<span v-if="edition.hard_type"> ({{ edition.hard_type }})</span></span
          >
        </div>
      </v-col>
      <v-col cols="6">
        <div class="detail" v-if="edition.pm">
          <span class="font-weight-bold">Prize money</span>
          <span>{{ formatCurrency(edition.currency, edition.pm) }}</span>
        </div>
        <div class="detail" v-if="edition.tfc">
          <span class="font-weight-bold">Total financial commitment</span>
          <span>{{ formatCurrency(edition.currency, edition.tfc) }}</span>
        </div>
        <div class="detail" v-if="edition.supervisors.length > 0">
          <span class="font-weight-bold">{{
            edition.supervisors.length === 1 ? 'Supervisor' : 'Supervisors'
          }}</span>
          <span>{{ joinArray(edition.supervisors) }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="teams">
      <v-col cols="3" v-for="(country, countryCode) in teams.groupedWTA" :key="countryCode">
        <short-card class="py-3 px-6">
          <v-card-title>
            <flag-img :src="flagSrc(countryCode)" width="100" class="mx-auto" />
          </v-card-title>
          <div v-for="player in teams.groupedATP[countryCode]" class="d-flex my-2 align-center">
            <div>
              <v-avatar v-if="player['Player.headshot']" class="mr-2">
                <v-img :src="headshot(player.PlayerId)" :alt="player['Player.last_name']" />
              </v-avatar>
            </div>
            <div>
              <RouterLink
                class="hover-link"
                :to="{
                  name: 'Player',
                  params: {
                    id: player.PlayerId,
                    name: player['Player.first_name'] + ' ' + player['Player.last_name'],
                  },
                }"
                >{{ player['Player.first_name'] }} {{ player['Player.last_name'] }}</RouterLink
              >
            </div>
          </div>
          <div v-for="player in country" class="d-flex flex-column my-2">
            <div>{{ player.name }}</div>
          </div>
        </short-card>
      </v-col>
    </v-row>
  </v-container>
</template>
