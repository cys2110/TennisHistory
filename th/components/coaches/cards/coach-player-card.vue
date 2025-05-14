<script setup lang="ts">
defineProps<{
  player: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "ch" | "ch_date" | "dob"> & {
    coach_start: string | null
    coach_end: string | null
    gs: Pick<EventInterface, "year" | "id" | "tournament">[]
  }
}>()
</script>

<template>
  <u-page-card
    :icon="player.country.alpha2 ? `flag:${player.country.alpha2}-4x3` : `flags:${player.country.id}`"
    :ui="{ title: 'flex items-center gap-2', body: 'w-full', description: 'flex flex-col gap-2 mt-5' }"
  >
    <template #title>
      <u-avatar
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
        :alt="player.name"
        :icon="ICONS.player"
      />
      <u-link
        :to="{ name: 'player', params: { name: encodeName(player.name), id: player.id } }"
        class="hover-link w-fit text-lg"
      >
        {{ player.name }}
      </u-link>
    </template>

    <template #description>
      <div class="flex justify-between gap-5 w-full text-sm">
        <span>DOB</span>
        <span class="font-semibold">{{ player.dob ?? "—" }}</span>
      </div>
      <div class="flex justify-between gap-5 w-full text-sm">
        <span>Active years</span>
        <span class="font-semibold">{{ player.min_year }} - {{ player.max_year === new Date().getFullYear() ? "present" : player.max_year }}</span>
      </div>
      <div class="flex justify-between gap-5 w-full text-sm">
        <span>Career High</span>
        <span class="font-semibold">{{ player.ch ? `${player.ch} (${player.ch_date})` : "Unknown" }}</span>
      </div>
      <div class="flex justify-between gap-5 w-full text-sm">
        <span>Coach Start</span>
        <span class="font-semibold">{{ player.coach_start ?? "—" }}</span>
      </div>
      <div class="flex justify-between gap-5 w-full text-sm">
        <span>Coach End</span>
        <span class="font-semibold">{{ player.coach_end ?? "—" }}</span>
      </div>
      <div class="flex justify-between gap-5 w-full text-sm">
        <span>Grand Slam Titles</span>
        <span class="font-semibold flex flex-col gap-2">
          <div
            v-for="event in player.gs"
            :key="event.id"
            class="flex gap-2 justify-end"
          >
            <base-link
              type="tournament"
              :tournament="event.tournament"
            />
            <u-link
              :to="{ name: 'event', params: { id: event.tournament.id, name: encodeName(event.tournament.name), year: event.year, eid: event.id } }"
              class="hover-link"
            >
              {{ event.year }}
            </u-link>
          </div>
        </span>
      </div>
    </template>
  </u-page-card>
</template>
