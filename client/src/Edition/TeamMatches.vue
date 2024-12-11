<script setup>
import { flagSrc, headshot } from '../utils'
import { RouterLink } from 'vue-router'

const props = defineProps(['match', 'wta', 'country1', 'country2'])

const duration = (length) => {
  const hour = Math.floor(length / 60)
  const minutes = length % 60
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
  return `${hour}:${formattedMinutes}`
}
</script>

<template>
  <v-sheet width="60%" class="mx-auto pa-5" rounded="xl">
    <v-table>
      <thead>
        <tr>
          <th class="text-center py-2">
            <flag-img :src="flagSrc(country1)" width="100" class="mx-auto py-1" />
          </th>
          <th class="text-center">Score</th>
          <th class="text-center py-2">
            <flag-img :src="flagSrc(country2)" width="100" class="mx-auto py-1" />
          </th>
          <th v-if="match.duration_mins" class="text-center">Duration</th>
          <th v-if="match.umpire" class="text-center">Umpire</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="d-flex align-center py-8">
            <div>
              <v-avatar v-if="match.player1.headshot" class="mr-2">
                <v-img :src="headshot(match.p1)" :alt="match.player1.full_name" />
              </v-avatar>
            </div>
            <div>
              <RouterLink
                class="hover-link"
                :class="{ 'font-weight-bold': match.winner_id === match.p1 }"
                :to="{ name: 'Player', params: { id: match.p1, name: match.player1.full_name } }"
                >{{ match.player1.full_name }}</RouterLink
              >
            </div>
          </td>
          <td class="text-center">
            <span
              >{{ match.s1p1 }}{{ match.s1p2
              }}<sup v-if="match.t1p1 !== null">{{
                match.t1p1 > match.t1p2 ? match.t1p2 : match.t1p1
              }}</sup></span
            >&nbsp;
            <span
              >{{ match.s2p1 }}{{ match.s2p2
              }}<sup v-if="match.t2p1 !== null">{{
                match.t2p1 > match.t2p2 ? match.t2p2 : match.t2p1
              }}</sup></span
            >&nbsp;
            <span v-if="match.s3p1 !== null"
              >{{ match.s3p1 }}{{ match.s3p2
              }}<sup v-if="match.t3p1 !== null">{{
                match.t3p1 > match.t3p2 ? match.t3p2 : match.t3p1
              }}</sup></span
            >
          </td>
          <td class="d-flex align-center py-8">
            <div>
              <v-avatar v-if="match.player2.headshot" class="mr-2">
                <v-img :src="headshot(match.p2)" :alt="match.player2.full_name" />
              </v-avatar>
            </div>
            <div>
              <RouterLink
                class="hover-link"
                :class="{ 'font-weight-bold': match.winner_id === match.p2 }"
                :to="{ name: 'Player', params: { id: match.p2, name: match.player2.full_name } }"
                >{{ match.player2.full_name }}</RouterLink
              >
            </div>
          </td>
          <td v-if="match.duration_mins" class="text-center">
            {{ duration(match.duration_mins) }}
          </td>
          <td v-if="match.umpire">{{ match.umpire }}</td>
        </tr>
        <tr>
          <td class="pl-16 py-4" :class="{ 'font-weight-bold': wta[0].winner === 'wta1' }">
            {{ wta[0].wta1.name }}
          </td>
          <td class="text-center">
            <span>{{ wta[0].s1p1 }}{{ wta[0].s1p2 }}</span
            >&nbsp; <span>{{ wta[0].s2p1 }}{{ wta[0].s2p2 }}</span
            >&nbsp;
            <span v-if="wta[0].s3p1 !== null">{{ wta[0].s3p1 }}{{ match.s3p2 }}</span>
          </td>
          <td class="pl-16" :class="{ 'font-weight-bold': wta[0].winner === 'wta2' }">
            {{ wta[0].wta2.name }}
          </td>
          <td v-if="match.duration_mins" class="text-center">
            {{ duration(wta[0].duration_mins) }}
          </td>
          <td v-if="wta[0].umpire">{{ wta[0].umpire }}</td>
        </tr>
        <tr>
          <td class="py-4">
            <div class="ml-12" :class="{ 'font-weight-bold': wta[1].winner === 'wta1' }">
              {{ wta[1].wta1.name }}
            </div>
            <div class="d-flex align-center">
              <div>
                <v-avatar v-if="wta[1].atp1.headshot" class="mr-2">
                  <v-img :src="headshot(wta[1].p1)" :alt="wta[1].atp1.full_name" />
                </v-avatar>
              </div>
              <div>
                <RouterLink
                  class="hover-link"
                  :class="{ 'font-weight-bold': wta[1].winner === 'wta1' }"
                  :to="{ name: 'Player', params: { id: wta[1].p1, name: wta[1].atp1.full_name } }"
                  >{{ wta[1].atp1.full_name }}</RouterLink
                >
              </div>
            </div>
          </td>
          <td class="text-center">
            <span>{{ wta[1].s1p1 }}{{ wta[1].s1p2 }}</span
            >&nbsp; <span>{{ wta[1].s2p1 }}{{ wta[1].s2p2 }}</span
            >&nbsp;
            <span v-if="wta[1].s3p1 !== null">{{ wta[1].s3p1 }}{{ wta[1].s3p2 }}</span>
          </td>
          <td>
            <div class="ml-12" :class="{ 'font-weight-bold': wta[1].winner === 'wta2' }">
              {{ wta[1].wta2.name }}
            </div>
            <div class="d-flex align-center">
              <div>
                <v-avatar v-if="wta[1].atp2.headshot" class="mr-2">
                  <v-img :src="headshot(wta[1].p2)" :alt="wta[1].atp2.full_name" />
                </v-avatar>
              </div>
              <div>
                <RouterLink
                  class="hover-link"
                  :class="{ 'font-weight-bold': wta[1].winner === 'wta2' }"
                  :to="{ name: 'Player', params: { id: wta[1].p2, name: wta[1].atp2.full_name } }"
                  >{{ wta[1].atp2.full_name }}</RouterLink
                >
              </div>
            </div>
          </td>
          <td v-if="wta[1].duration_mins" class="text-center">
            {{ duration(wta[1].duration_mins) }}
          </td>
          <td v-if="wta[1].umpire">{{ wta[1].umpire }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>
